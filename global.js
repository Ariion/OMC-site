/* ============================================================
   GLOBAL.JS - AVEC FIREBASE CONNECTÉ + ARCHIVAGE STORAGE
   ============================================================ */

// --- INJECTION AUTOMATIQUE DU FAVICON (Logo OMC) SUR TOUTES LES PAGES ---
(function() {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/png';
    favicon.href = 'assets/logo_omc.png';
    document.head.appendChild(favicon);
})();

// 1. IMPORTATION DE FIREBASE (Version Web)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query } 
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } 
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// 2. CONFIGURATION FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCkrm6_s49SIHQkBBL-s0o1k2MZKW37Smc",
  authDomain: "ocean-medical-center.firebaseapp.com",
  projectId: "ocean-medical-center",
  storageBucket: "ocean-medical-center.firebasestorage.app",
  messagingSenderId: "789656238322",
  appId: "1:789656238322:web:42a95fb132ab3b5eda786b",
  measurementId: "G-TFN05MSD6R"
};

// 3. INITIALISATION
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const COLLECTION_NAME = "patients";

// --- SYSTÈME DE CACHE LOCAL ---
let patientsCache = [];

const q = query(collection(db, COLLECTION_NAME));
onSnapshot(q, (snapshot) => {
    patientsCache = [];
    snapshot.forEach((docSnap) => {
        patientsCache.push({ id: docSnap.id, ...docSnap.data() });
    });
    if (typeof window.chargerPatients === 'function') {
        window.chargerPatients();
        if(typeof window.updateStats === 'function') window.updateStats();
    }
});

/* ============================================================
   FONCTIONS DE GESTION DE DONNÉES (FIRESTORE)
   ============================================================ */

window.getPatientsDB = function() {
    return patientsCache;
}

window.savePatientToDB = async function(patientData) {
    try {
        const existing = patientsCache.find(p => 
            p.id === patientData.id || 
            p.nom.toLowerCase() === patientData.nom.toLowerCase()
        );
        if (existing && existing.id) {
            const ref = doc(db, COLLECTION_NAME, existing.id);
            const { id, ...cleanData } = patientData;
            await updateDoc(ref, cleanData);
            console.log("✅ Patient mis à jour sur Firebase !");
        } else {
            await addDoc(collection(db, COLLECTION_NAME), patientData);
            console.log("✅ Nouveau patient créé sur Firebase !");
        }
        return true;
    } catch (e) {
        console.error("Erreur Firebase : ", e);
        alert("Erreur de sauvegarde ! Vérifie ta connexion internet.");
        return false;
    }
}

window.deletePatientFromDB = async function(id) {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        console.log("🗑️ Patient supprimé de Firebase");
    } catch (e) {
        console.error("Erreur suppression", e);
    }
}

/* ============================================================
   FIREBASE STORAGE — UPLOAD IMAGE
   ============================================================ */

/**
 * Upload un Blob image sur Firebase Storage
 * @param {Blob} blob 
 * @param {string} nomPatient 
 * @param {string} typeDoc 
 * @returns {Promise<string>} URL permanente
 */
window.uploadImageFirebase = async function(blob, nomPatient, typeDoc) {
    const nomPropre = (nomPatient || "anonyme")
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9_\-]/g, "_")
        .substring(0, 40);

    const typePropre = (typeDoc || "doc")
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9_\-]/g, "_");

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const chemin = `rapports/${nomPropre}/${typePropre}_${timestamp}.png`;

    const fileRef = storageRef(storage, chemin);
    await uploadBytes(fileRef, blob, { contentType: 'image/png' });
    const url = await getDownloadURL(fileRef);
    console.log("✅ Image Firebase Storage :", url);
    return url;
};

/* ============================================================
   ARCHIVAGE UNIVERSEL — capture + upload + historique
   ============================================================ */

/**
 * Capture un élément HTML, l'upload sur Firebase Storage et l'ajoute à l'historique du patient.
 * 
 * @param {object} config
 * @param {string} config.captureId    - ID de l'élément à capturer
 * @param {string} config.nomPatientId - ID du champ/div nom patient
 * @param {string} config.typeDoc      - Libellé type doc (ex: "Constat Lésionnel")
 * @param {string} config.pageSource   - Page pour le bouton Modifier (ex: "constat.html")
 * @param {string} [config.detailsId]  - ID optionnel pour les détails historique
 * @param {function} [config.onSuccess] - Callback(url, blob) après succès
 * @returns {Promise<string|null>}
 */
window.archiverDocument = async function(config) {
    const { captureId, nomPatientId, typeDoc, pageSource, detailsId, onSuccess } = config;

    // Récupère le nom du patient
    const elNom = document.getElementById(nomPatientId);
    let nomPatient = "Anonyme";
    if (elNom) {
        const val = elNom.tagName === 'INPUT' ? elNom.value : elNom.innerText;
        if (val && val !== "..." && val.trim() !== "") nomPatient = val.trim();
    }

    // Capture HTML
    const captureEl = document.getElementById(captureId);
    if (!captureEl) { console.error("Élément #" + captureId + " introuvable"); return null; }

    let blob;
    try {
        const canvas = await html2canvas(captureEl, {
            scale: 2, useCORS: true, backgroundColor: "#ffffff",
            scrollY: 0, height: captureEl.scrollHeight,
            windowHeight: captureEl.scrollHeight + 100
        });
        blob = await new Promise((res, rej) => canvas.toBlob(b => b ? res(b) : rej(new Error("Blob vide")), 'image/png'));
    } catch(e) {
        console.error("Erreur capture :", e);
        return null;
    }

    // Upload Firebase Storage
    let urlImage = null;
    try {
        urlImage = await window.uploadImageFirebase(blob, nomPatient, typeDoc);
    } catch(e) {
        console.warn("Upload Storage échoué, on continue sans URL :", e);
    }

    // Détails pour l'historique
    let details = typeDoc;
    if (detailsId) {
        const elD = document.getElementById(detailsId);
        if (elD) {
            const txt = elD.tagName === 'INPUT' ? elD.value : elD.innerText;
            if (txt && txt !== "...") details = txt.substring(0, 120);
        }
    }

    // Enregistrement historique
    if (window.ajouterEvenementPatient) {
        await window.ajouterEvenementPatient(nomPatient, typeDoc, details, urlImage, pageSource);
    }

    if (onSuccess) onSuccess(urlImage, blob);
    return urlImage;
};

/* ============================================================
   HISTORIQUE PATIENT
   ============================================================ */

// ⚠️ MODIFIÉ : ajout du paramètre pageSource
window.ajouterEvenementPatient = async function(nomPatient, typeEvent, details, urlImage = null, pageSource = null) {
    const patient = patientsCache.find(p => p.nom.trim().toLowerCase() === nomPatient.trim().toLowerCase());

    if (patient) {
        let historique = patient.historique || [];
        historique.unshift({
            date: new Date().toISOString(),
            type: typeEvent,
            details: details,
            url: urlImage,
            pageSource: pageSource  // ← URL de la page source pour "Modifier"
        });

        const ref = doc(db, COLLECTION_NAME, patient.id);
        try {
            await updateDoc(ref, { historique: historique });
            console.log("✅ Historique + URL sauvegardés !");
        } catch(e) {
            console.error("Erreur historique", e);
        }
    } else {
        console.warn("⚠️ Patient introuvable pour l'historique :", nomPatient, "— Créer d'abord le dossier.");
    }
}

window.supprimerEvenementHistorique = async function(nomPatient, index) {
    const patient = patientsCache.find(p => p.nom === nomPatient);
    if (patient && patient.historique) {
        patient.historique.splice(index, 1);
        const ref = doc(db, COLLECTION_NAME, patient.id);
        await updateDoc(ref, { historique: patient.historique });
        return patient;
    }
    return null;
}

/* ============================================================
   AUTOCOMPLÉTION
   ============================================================ */

window.setupPatientAutocomplete = function(config) {
    const inputName = document.getElementById(config.nameId);
    if (!inputName) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'autocomplete-wrapper';
    inputName.parentNode.insertBefore(wrapper, inputName);
    wrapper.appendChild(inputName);

    const list = document.createElement('div');
    list.className = 'autocomplete-list';
    list.style.display = 'none';
    wrapper.appendChild(list);

    inputName.addEventListener('input', function() {
        const val = this.value.toLowerCase();
        list.innerHTML = '';
        if (val.length < 2) { list.style.display = 'none'; return; }

        const matches = patientsCache.filter(p => p.nom.toLowerCase().includes(val));
        if (matches.length > 0) {
            list.style.display = 'block';
            matches.forEach(p => {
                const item = document.createElement('div');
                item.className = 'autocomplete-item';
                item.innerHTML = `
                    <div><strong>${p.nom}</strong><small>${p.job || 'Civil'}</small></div>
                    <div><small>${p.naissance || '??/??/????'} | ${p.groupe || '?'}</small></div>
                `;
                item.onclick = function() {
                    inputName.value = p.nom;
                    inputName.dataset.firebaseId = p.id;
                    if (config.birthId && document.getElementById(config.birthId))
                        document.getElementById(config.birthId).value = p.naissance;
                    if (config.bloodId && document.getElementById(config.bloodId))
                        document.getElementById(config.bloodId).value = p.groupe;
                    if (config.jobId && document.getElementById(config.jobId))
                        document.getElementById(config.jobId).value = p.job;
                    list.style.display = 'none';
                    if (config.callback) config.callback(p);
                };
                list.appendChild(item);
            });
        } else {
            list.style.display = 'none';
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target !== inputName) list.style.display = 'none';
    });
}

/* ============================================================
   UTILITAIRES (THÈME, HELPERS)
   ============================================================ */

window.toggleTheme = function() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('omc_theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    updateThemeButtonText();
}

function updateThemeButtonText() {
    const txtSpan = document.getElementById('theme-text');
    if (txtSpan) {
        txtSpan.innerText = document.body.classList.contains('light-mode') 
            ? "Passer mode Sombre" : "Passer mode Clair";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('omc_theme') === 'light') document.body.classList.add('light-mode');
    updateThemeButtonText();
});

window.up = function(id, val) {
    const el = document.getElementById(id);
    if (el) {
        el.innerText = val || "...";
        if(id === 'd-sig' && !val) el.innerText = "DOCTEUR";
    }
}

window.upDate = function(id, val) {
    if (!val) return;
    const [y, m, d] = val.split('-');
    const el = document.getElementById(id);
    if (el) el.innerText = `${d}/${m}/${y}`;
}
