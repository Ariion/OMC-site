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
    FONCTIONS STORAGE — VERSION SÉCURISÉE (CORS PROOF)
   ============================================================ */

window.uploadImageFirebase = async function(blob, nomPatient, typeDoc) {
    const nomPropre = (nomPatient || "anonyme").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_\-]/g, "_");
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const chemin = `rapports/${nomPropre}/${typeDoc}_${timestamp}.png`;
    const fileRef = storageRef(storage, chemin);

    try {
        // On ajoute un timeout de 4 secondes pour ne pas bloquer le site si Firebase refuse
        const uploadPromise = uploadBytes(fileRef, blob, { contentType: 'image/png' });
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout Firebase")), 4000));

        await Promise.race([uploadPromise, timeoutPromise]);
        const url = await getDownloadURL(fileRef);
        return url;
    } catch (e) {
        console.error("⚠️ Erreur Storage (CORS probable) :", e.message);
        return null; // On renvoie null pour signaler l'échec sans bloquer
    }
};

/* ============================================================
    ARCHIVAGE UNIVERSEL - NE BLOQUE PLUS JAMAIS
   ============================================================ */

window.archiverDocument = async function(config) {
    const { captureId, nomPatientId, typeDoc, pageSource, detailsId, onSuccess } = config;

    // 1. Récupération Nom
    const elNom = document.getElementById(nomPatientId);
    let nomPatient = "Anonyme";
    if (elNom) {
        const val = elNom.tagName === 'INPUT' ? elNom.value : elNom.innerText;
        if (val && val !== "..." && val.trim() !== "") nomPatient = val.trim();
    }

    // 2. Capture HTML
    const captureEl = document.getElementById(captureId);
    if (!captureEl) return null;

    let blob, localDataUrl;
    try {
        const canvas = await html2canvas(captureEl, { scale: 1.5, useCORS: true, backgroundColor: "#ffffff" });
        localDataUrl = canvas.toDataURL('image/png');
        blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    } catch(e) {
        console.error("Erreur capture", e);
        return null;
    }

    // 3. Tentative d'upload (n'attend pas indéfiniment)
    let urlFinal = await window.uploadImageFirebase(blob, nomPatient, typeDoc);
    
    // Si l'upload échoue, on utilise l'image locale (Base64) pour que l'historique fonctionne quand même
    const imageAEnregistrer = urlFinal || localDataUrl;

    // 4. Enregistrement Historique
    if (window.ajouterEvenementPatient) {
        await window.ajouterEvenementPatient(nomPatient, typeDoc, typeDoc, imageAEnregistrer, pageSource);
    }

    if (onSuccess) onSuccess(imageAEnregistrer, blob);
    return imageAEnregistrer;
};

/* ============================================================
    HISTORIQUE ET BASE DE DONNÉES
   ============================================================ */

window.ajouterEvenementPatient = async function(nomPatient, typeEvent, details, urlImage = null, pageSource = null) {
    const patient = patientsCache.find(p => p.nom.trim().toLowerCase() === nomPatient.trim().toLowerCase());
    if (patient) {
        let historique = patient.historique || [];
        historique.unshift({
            date: new Date().toISOString(),
            type: typeEvent,
            details: details,
            url: urlImage,
            pageSource: pageSource
        });
        const ref = doc(db, COLLECTION_NAME, patient.id);
        try {
            await updateDoc(ref, { historique: historique });
        } catch(e) { console.error("Erreur historique", e); }
    }
};

// --- LE RESTE DES FONCTIONS (AUTOCOMPLETE, THEME, ETC.) ---
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

// UTILITAIRES DE MISE À JOUR
window.up = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val || "..."; };
window.upDate = (id, val) => { if (!val) return; const [y, m, d] = val.split('-'); const el = document.getElementById(id); if (el) el.innerText = `${d}/${m}/${y}`; };
