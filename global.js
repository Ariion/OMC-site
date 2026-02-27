/* ============================================================
    GLOBAL.JS - VERSION SÉCURISÉE (ANTI-CORS & ANTI-BLOCAGE)
   ============================================================ */

// --- INJECTION AUTOMATIQUE DU FAVICON ---
(function() {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/png';
    favicon.href = 'assets/logo_omc.png';
    document.head.appendChild(favicon);
})();

// 1. IMPORTATION DE FIREBASE
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

let patientsCache = [];

const q = query(collection(db, COLLECTION_NAME));
onSnapshot(q, (snapshot) => {
    patientsCache = [];
    snapshot.forEach((docSnap) => {
        patientsCache.push({ id: docSnap.id, ...docSnap.data() });
    });
    if (typeof window.chargerPatients === 'function') window.chargerPatients();
});

/* ============================================================
    THÈME CLAIR / SOMBRE
   ============================================================ */

window.toggleTheme = function() {
    const body = document.body;
    body.classList.toggle('light-mode');

    // Persistance localStorage
    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('omc-theme', isLight ? 'light' : 'dark');

    // Mise à jour du texte du bouton (id="theme-text" présent sur toutes les pages)
    const btn = document.getElementById('theme-text');
    if (btn) btn.textContent = isLight ? 'Passer mode sombre' : 'Passer mode clair';
};

// Applique le thème sauvegardé au chargement
(function() {
    const saved = localStorage.getItem('omc-theme');
    if (saved === 'light') {
        document.body.classList.add('light-mode');
    }
    // Mettre à jour le texte du bouton après que le DOM soit prêt
    document.addEventListener('DOMContentLoaded', function() {
        const btn = document.getElementById('theme-text');
        if (btn) {
            const isLight = document.body.classList.contains('light-mode');
            btn.textContent = isLight ? 'Passer mode sombre' : 'Passer mode clair';
        }
    });
})();

/* ============================================================
    FONCTIONS STORAGE — VERSION SÉCURISÉE (CORS PROOF)
   ============================================================ */

window.uploadImageFirebase = async function(blob, nomPatient, typeDoc) {
    const nomPropre = (nomPatient || "anonyme").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_\-]/g, "_");
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const chemin = `rapports/${nomPropre}/${typeDoc}_${timestamp}.png`;
    const fileRef = storageRef(storage, chemin);

    try {
        const uploadPromise = uploadBytes(fileRef, blob, { contentType: 'image/png' });
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout Firebase")), 4000));
        await Promise.race([uploadPromise, timeoutPromise]);
        const url = await getDownloadURL(fileRef);
        return url;
    } catch (e) {
        console.error("⚠️ Erreur Storage (CORS probable) :", e.message);
        return null;
    }
};

/* ============================================================
    ARCHIVAGE UNIVERSEL - NE BLOQUE PLUS JAMAIS
   ============================================================ */

window.archiverDocument = async function(config) {
    const { captureId, nomPatientId, typeDoc, pageSource, onSuccess } = config;

    const formData = {};
    document.querySelectorAll('input, textarea, select').forEach(input => {
        if (input.id) {
            formData[input.id] = (input.type === 'checkbox' || input.type === 'radio') 
                ? input.checked 
                : input.value;
        }
    });

    const elNom = document.getElementById(nomPatientId);
    let nomPatient = elNom?.value || elNom?.innerText || "Anonyme";
    const captureEl = document.getElementById(captureId);

    try {
        const canvas = await html2canvas(captureEl, { scale: 1.5, useCORS: true });
        const localDataUrl = canvas.toDataURL('image/jpeg', 0.7);

        if (window.ajouterEvenementPatient) {
            await window.ajouterEvenementPatient(nomPatient, typeDoc, typeDoc, localDataUrl, pageSource, formData);
        }

        if (onSuccess) onSuccess(localDataUrl);
        return localDataUrl;
    } catch(e) {
        console.error("Erreur capture", e);
        return null;
    }
};

/* ============================================================
    HISTORIQUE ET BASE DE DONNÉES
   ============================================================ */

window.ajouterEvenementPatient = async function(nomPatient, typeEvent, details, urlImage = null, pageSource = null, formData = null) {
    let patient = patientsCache.find(p => p.nom.trim().toLowerCase() === nomPatient.trim().toLowerCase());

    if (!patient) {
        console.log("🆕 Nouveau patient détecté, création automatique du dossier...");
        const nouveauDossier = {
            nom: nomPatient,
            naissance: formData?.patientBirth || "",
            groupe: formData?.patientBlood || "",
            job: formData?.patientJob || "Civil",
            notes: "Dossier créé automatiquement via " + typeEvent,
            historique: [],
            dateCreation: new Date().toISOString()
        };
        await window.savePatientToDB(nouveauDossier);
        patient = nouveauDossier;
    }

    let historique = patient.historique || [];
    historique.unshift({
        date: new Date().toISOString(),
        type: typeEvent,
        details: details,
        url: urlImage,
        pageSource: pageSource,
        formData: formData
    });

    const patientRef = patientsCache.find(p => p.nom.trim().toLowerCase() === nomPatient.trim().toLowerCase());
    if (patientRef) {
        const ref = doc(db, COLLECTION_NAME, patientRef.id);
        try {
            await updateDoc(ref, { historique: historique });
            console.log("✅ Document archivé avec succès !");
        } catch(e) {
            console.error("Erreur mise à jour historique", e);
        }
    }
};

window.getPatientsDB = () => patientsCache;

window.savePatientToDB = async function(patientData) {
    try {
        const existing = patientsCache.find(p => p.nom.toLowerCase() === patientData.nom.toLowerCase());
        if (existing) {
            await updateDoc(doc(db, COLLECTION_NAME, existing.id), patientData);
        } else {
            await addDoc(collection(db, COLLECTION_NAME), patientData);
        }
        return true;
    } catch (e) { return false; }
};

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
                item.innerHTML = `<div><strong>${p.nom}</strong></div>`;
                item.onclick = function() {
                    inputName.value = p.nom;
                    if (config.birthId) document.getElementById(config.birthId).value = p.naissance;
                    list.style.display = 'none';
                    if (config.callback) config.callback(p);
                };
                list.appendChild(item);
            });
        }
    });
};

// UTILITAIRES DE MISE À JOUR (compatibilité pages qui utilisent ces fonctions globales)
// Note : rapports.js redéfinit up/upDate localement avec une logique plus riche
window.up     = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val || "..."; };
window.upDate = (id, val) => {
    if (!val) return;
    const el = document.getElementById(id);
    if (!el) return;
    try {
        el.innerText = new Date(val).toLocaleDateString('fr-FR', {year:'numeric', month:'long', day:'numeric'});
    } catch(e) {
        const [y, m, d] = val.split('-');
        el.innerText = `${d}/${m}/${y}`;
    }
};

// Variable globale pour éviter les doublons durant la session
window.omc_last_archive = { url: null, done: false };

window.omc_moteur_generation = async function(config) {
    const { captureId, nomPatientId, typeDoc, pageSource, imgBBKey } = config;

    if (window.omc_last_archive.done) {
        return { url: window.omc_last_archive.url, dejaFait: true };
    }

    try {
        const captureEl = document.getElementById(captureId);
        const canvas = await html2canvas(captureEl, { scale: 1.5, useCORS: true });
        const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.8));

        const formDataBB = new FormData();
        formDataBB.append("image", blob);
        const resBB = await fetch(`https://api.imgbb.com/1/upload?key=${imgBBKey}`, { method: "POST", body: formDataBB });
        const jsonBB = await resBB.json();
        const shortUrl = jsonBB.data.url;

        const formSnapshot = {};
        document.querySelectorAll('input, textarea, select').forEach(el => {
            if(el.id) formSnapshot[el.id] = (el.type === 'checkbox' || el.type === 'radio') ? el.checked : el.value;
        });

        const nomPatient = document.getElementById(nomPatientId).value || "Anonyme";
        if (window.ajouterEvenementPatient) {
            await window.ajouterEvenementPatient(nomPatient, typeDoc, typeDoc, shortUrl, pageSource, formSnapshot);
        }

        window.omc_last_archive = { url: shortUrl, done: true };
        return { url: shortUrl, dejaFait: false };

    } catch (e) {
        console.error("Erreur Moteur OMC:", e);
        return null;
    }
};