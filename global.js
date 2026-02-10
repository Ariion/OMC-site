/* ============================================================
   GLOBAL.JS - AVEC FIREBASE CONNECTÉ
   ============================================================ */

// 1. IMPORTATION DE FIREBASE (Version Web)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. TA CONFIGURATION (Celle que tu m'as donnée)
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
const COLLECTION_NAME = "patients";

// --- SYSTÈME DE CACHE LOCAL (Pour que ton site reste rapide) ---
// On garde une copie des patients ici pour que l'autocomplétion soit instantanée
let patientsCache = [];

// Cette fonction tourne en permanence et écoute la base de données
// Dès qu'une modification arrive, elle met à jour le cache local
const q = query(collection(db, COLLECTION_NAME));
onSnapshot(q, (snapshot) => {
    patientsCache = [];
    snapshot.forEach((doc) => {
        // On mélange les données du patient avec son ID Firebase
        patientsCache.push({ id: doc.id, ...doc.data() });
    });
    // Si on est sur la page dossiers, on rafraichit la grille automatiquement
    if (typeof window.chargerPatients === 'function') {
        window.chargerPatients();
        if(typeof window.updateStats === 'function') window.updateStats();
    }
});

/* ============================================================
   FONCTIONS DE GESTION DE DONNÉES (MODE CLOUD)
   ============================================================ */

// Récupère la liste depuis le cache local (Rapide et compatible avec ton ancien code)
window.getPatientsDB = function() {
    return patientsCache;
}

// Sauvegarde ou Met à jour un patient dans le Cloud
window.savePatientToDB = async function(patientData) {
    try {
        // On cherche si le patient existe déjà dans notre cache (par ID ou par Nom)
        const existing = patientsCache.find(p => p.id === patientData.id || p.nom.toLowerCase() === patientData.nom.toLowerCase());

        if (existing && existing.id) {
            // MISE À JOUR
            const ref = doc(db, COLLECTION_NAME, existing.id);
            // On s'assure de ne pas ré-envoyer l'ID à l'intérieur des données
            const { id, ...cleanData } = patientData; 
            // On fusionne les nouvelles données avec les anciennes (pour ne pas perdre l'historique si on ne l'a pas chargé)
            await updateDoc(ref, cleanData);
            console.log("✅ Patient mis à jour sur Firebase !");
        } else {
            // CRÉATION
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

// Fonction de suppression (Optionnel, utile pour dossiers.js)
window.deletePatientFromDB = async function(id) {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        console.log("🗑️ Patient supprimé de Firebase");
    } catch (e) {
        console.error("Erreur suppression", e);
    }
}


/* ============================================================
   FONCTIONS UTILITAIRES (THEMES, DATES, ETC.)
   ============================================================ */

window.toggleTheme = function() {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        localStorage.setItem('omc_theme', 'light');
    } else {
        localStorage.setItem('omc_theme', 'dark');
    }
    updateThemeButtonText();
}

function updateThemeButtonText() {
    const txtSpan = document.getElementById('theme-text');
    const isLight = document.body.classList.contains('light-mode');
    if (txtSpan) {
        txtSpan.innerText = isLight ? "Passer mode Sombre" : "Passer mode Clair";
    }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('omc_theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
    updateThemeButtonText();
});

// Helpers de texte
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

/* ============================================================
   AUTOCOMPLETION & HISTORIQUE
   ============================================================ */

// Autocomplétion (utilise le cache local qui est sync avec Firebase)
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
        
        if (val.length < 2) {
            list.style.display = 'none';
            return;
        }

        // On cherche dans le cache local (super rapide)
        const matches = patientsCache.filter(p => p.nom.toLowerCase().includes(val));

        if (matches.length > 0) {
            list.style.display = 'block';
            matches.forEach(p => {
                const item = document.createElement('div');
                item.className = 'autocomplete-item';
                item.innerHTML = `
                    <div><strong>${p.nom}</strong><small>${p.job || 'Civil'}</small></div>
                    <div><small>${p.naissance || '??/??/????'}</small></div>
                `;
                
                item.onclick = function() {
                    inputName.value = p.nom;
                    
                    // On garde l'ID Firebase en mémoire si possible (utile pour l'historique)
                    inputName.dataset.firebaseId = p.id;

                    if (config.birthId && document.getElementById(config.birthId)) {
                        document.getElementById(config.birthId).value = p.naissance;
                    }
                    if (config.bloodId && document.getElementById(config.bloodId)) {
                        document.getElementById(config.bloodId).value = p.groupe;
                    }
                    if (config.jobId && document.getElementById(config.jobId)) {
                        document.getElementById(config.jobId).value = p.job;
                    }

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

// AJOUT HISTORIQUE (Connecté à Firebase)
window.ajouterEvenementPatient = async function(nomPatient, typeEvent, details, urlImage = null) {
    // 1. Trouver le patient
    const patient = patientsCache.find(p => p.nom.trim().toLowerCase() === nomPatient.trim().toLowerCase());

    if (patient) {
        // 2. Préparer le nouvel historique
        let historique = patient.historique || [];
        historique.unshift({
            date: new Date().toISOString(),
            type: typeEvent,
            details: details,
            url: urlImage
        });

        // 3. Envoyer la mise à jour à Firebase
        const ref = doc(db, COLLECTION_NAME, patient.id);
        try {
            await updateDoc(ref, { historique: historique });
            console.log("✅ Historique sauvegardé sur le Cloud !");
        } catch(e) {
            console.error("Erreur historique", e);
        }
    } else {
        console.warn("Patient introuvable pour l'historique (Peut-être nouveau ?)");
    }
}

// SUPPRESSION HISTORIQUE
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
