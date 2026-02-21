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
    const { captureId, nomPatientId, typeDoc, pageSource, onSuccess } = config;

    // --- ASPIRATION DE TOUTES LES DONNÉES DU FORMULAIRE ---
    const formData = {};
    // On récupère TOUS les champs de saisie de la page
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.id) {
            // Sauvegarde de la valeur ou de l'état coché
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

        // Sauvegarde dans Firebase avec le "sac à dos" de données (formData)
        if (window.ajouterEvenementPatient) {
            await window.ajouterEvenementPatient(
                nomPatient, 
                typeDoc, 
                typeDoc, 
                localDataUrl, 
                pageSource, 
                formData // On envoie l'objet complet ici
            );
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
    // 1. On cherche si le patient existe
    let patient = patientsCache.find(p => p.nom.trim().toLowerCase() === nomPatient.trim().toLowerCase());

    // 2. SI LE PATIENT N'EXISTE PAS : ON LE CRÉE
    if (!patient) {
        console.log("🆕 Nouveau patient détecté, création automatique du dossier...");
        const nouveauDossier = {
            nom: nomPatient,
            naissance: formData?.patientBirth || "", // On essaie de récupérer la DDN si elle est dans le formulaire
            groupe: formData?.patientBlood || "",
            job: formData?.patientJob || "Civil",
            notes: "Dossier créé automatiquement via " + typeEvent,
            historique: [],
            dateCreation: new Date().toISOString()
        };
        
        // On sauvegarde le nouveau patient
        await window.savePatientToDB(nouveauDossier);
        
        // On attend un tout petit peu que Firebase se mette à jour et on le récupère
        // (Ou on utilise directement l'objet qu'on vient de créer)
        patient = nouveauDossier;
    }

    // 3. ON RAJOUTE L'ÉVÉNEMENT À L'HISTORIQUE
    let historique = patient.historique || [];
    historique.unshift({
        date: new Date().toISOString(),
        type: typeEvent,
        details: details,
        url: urlImage,
        pageSource: pageSource,
        formData: formData // Le fameux sac à dos pour le bouton "Modifier"
    });

    // 4. MISE À JOUR DANS FIREBASE
    // On cherche l'ID (soit celui existant, soit on laisse savePatientToDB gérer)
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
