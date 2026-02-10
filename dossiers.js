/* ============================================================
   DOSSIERS.JS - GESTION DES ARCHIVES (V2 FIREBASE)
   ============================================================ */

// 1. IMPORTS
// On récupère les fonctions de connexion depuis le fichier central
import { getPatientsDB, savePatientToDB, deletePatientFromDB, ecouterPatients } from "./global.js";

// Variable locale pour stocker la liste (utilisée pour la recherche et l'édition)
let patientsLocaux = [];

// 2. INITIALISATION
document.addEventListener('DOMContentLoaded', () => {
    // Écoute temps réel : Dès que Firebase change, cette fonction s'active
    ecouterPatients((liste) => {
        patientsLocaux = liste; // Mise à jour de la mémoire locale
        afficherGrille(liste);  // Mise à jour visuelle
        updateStats(liste);     // Mise à jour des compteurs
    });
});

/* ============================================================
   FONCTIONS INTERNES (UI)
   ============================================================ */

function afficherGrille(liste) {
    const grid = document.getElementById('patients-grid');
    const emptyState = document.getElementById('empty-state');
    
    if(!grid) return;
    grid.innerHTML = "";

    // Gestion de l'état vide
    if (!liste || liste.length === 0) {
        if(emptyState) emptyState.style.display = "block";
        return;
    }
    if(emptyState) emptyState.style.display = "none";

    // Génération des cartes
    liste.forEach(p => {
        const card = document.createElement('div');
        card.className = 'patient-card';
        
        const initiales = p.nom ? p.nom.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : "?";
        const hasNotes = p.notes && p.notes.trim().length > 0;

        card.innerHTML = `
            <div class="p-tag">${p.groupe || '?'}</div>
            <div class="p-avatar">${initiales}</div>
            <div class="p-name">${p.nom}</div>
            <div class="p-info">📅 ${formatDate(p.naissance)}</div>
            <div class="p-info">💼 ${p.job || 'Civil'}</div>
            ${hasNotes ? '<div class="p-info" style="color:#fbbf24; font-size:10px; margin-top:5px;">⚠️ Notes présentes</div>' : ''}
        `;
        
        // Au clic, on ouvre le panneau d'édition
        card.onclick = () => window.ouvrirPanelEdition(p);
        grid.appendChild(card);
    });
}

/* ============================================================
   FONCTIONS PUBLIQUES (ATTACHÉES À WINDOW)
   ============================================================ */

// --- 1. GESTION DES PANNEAUX ---

window.fermerTout = function() {
    document.getElementById('panel-edition').style.display = 'none';
    document.getElementById('sidebar-stats').style.display = 'block';
    document.getElementById('panel-creation').style.display = 'block';
}

window.ouvrirPanelEdition = function(p) {
    window.fermerTout(); // Reset visuel
    
    // On cache les éléments inutiles
    document.getElementById('sidebar-stats').style.display = 'none';
    document.getElementById('panel-creation').style.display = 'none';
    
    // On affiche l'éditeur
    document.getElementById('panel-edition').style.display = 'block';

    // Remplissage des champs
    // IMPORTANT : On stocke l'ID Firebase caché pour savoir qui on modifie
    document.getElementById('edit-original-name').value = p.id || p.nom;
    
    document.getElementById('edit-nom').value = p.nom;
    document.getElementById('edit-ddn').value = p.naissance;
    document.getElementById('edit-groupe').value = p.groupe;
    document.getElementById('edit-job').value = p.job;
    document.getElementById('edit-notes').value = p.notes || "";

    // Affichage de l'historique
    const histDiv = document.getElementById('edit-historique');
    if(histDiv) {
        histDiv.innerHTML = "";
        if (p.historique && p.historique.length > 0) {
            p.historique.forEach((h, index) => {
                const dateH = new Date(h.date).toLocaleDateString('fr-FR');
                
                // Bouton VOIR (si une image existe)
                let btnVoir = h.url ? `<button onclick="voirDocument('${h.url}')" style="background:#3b82f6;border:none;color:white;cursor:pointer;font-size:10px;margin-right:5px;border-radius:2px;padding:2px 5px;">👁️</button>` : "";
                
                // Bouton SUPPRIMER
                let btnSuppr = `<button onclick="supprimerLigneHist('${p.id || p.nom}', ${index})" style="color:#ef4444;border:none;background:none;cursor:pointer;">✖</button>`;

                histDiv.innerHTML += `
                    <div style="font-size:10px; margin-bottom:8px; border-left:2px solid #3b82f6; padding-left:8px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span>${dateH} - <strong style="color:white;">${h.type}</strong></span>
                            <div>${btnVoir}${btnSuppr}</div>
                        </div>
                        <span style="color:#cbd5e1; font-style:italic;">${h.details}</span>
                    </div>`;
            });
        } else {
            histDiv.innerHTML = '<div style="color:#475569; font-size:10px; padding:5px;">Aucun historique récent.</div>';
        }
    }
    // Scroll automatique en haut du panneau
    document.querySelector('.sidebar').scrollTop = 0;
}

// --- 2. ACTIONS CRUD (CRÉER, MODIFIER, SUPPRIMER) ---

window.creerPatient = async function() {
    const nom = document.getElementById('new-nom').value;
    if (!nom) return alert("Le nom est obligatoire !");

    const newP = {
        nom: nom,
        naissance: document.getElementById('new-ddn').value,
        groupe: document.getElementById('new-groupe').value,
        job: document.getElementById('new-job').value,
        notes: document.getElementById('new-notes').value,
        historique: [],
        dateCreation: new Date().toISOString()
    };

    // Sauvegarde Cloud
    await savePatientToDB(newP);
    
    // Reset du formulaire
    document.getElementById('new-nom').value = "";
    document.getElementById('new-ddn').value = "";
    document.getElementById('new-job').value = "";
    document.getElementById('new-notes').value = "";
}

window.sauvegarderEdition = async function() {
    const id = document.getElementById('edit-original-name').value;
    
    // On retrouve le patient original (par ID Firebase ou Nom)
    const originalP = patientsLocaux.find(p => p.id === id || p.nom === id);

    if(!originalP) return alert("Erreur : Patient introuvable");

    const updatedP = {
        id: originalP.id, // On garde l'ID pour que Firebase sache qui modifier
        nom: document.getElementById('edit-nom').value,
        naissance: document.getElementById('edit-ddn').value,
        groupe: document.getElementById('edit-groupe').value,
        job: document.getElementById('edit-job').value,
        notes: document.getElementById('edit-notes').value,
        dateCreation: originalP.dateCreation,
        historique: originalP.historique || []
    };

    await savePatientToDB(updatedP);
    window.fermerTout();
    alert("✅ Dossier mis à jour !");
}

window.supprimerPatient = async function() {
    const id = document.getElementById('edit-original-name').value;
    if(confirm("⛔ Supprimer définitivement ce dossier ? Cette action est irréversible.")) {
        await deletePatientFromDB(id);
        window.fermerTout();
    }
}

// --- 3. ACTIONS HISTORIQUE ---

window.supprimerLigneHist = async function(patientId, index) {
    if(!confirm("Supprimer cette ligne d'historique ?")) return;
    
    const p = patientsLocaux.find(pat => pat.id === patientId || pat.nom === patientId);
    if(p) {
        // On retire l'élément du tableau
        p.historique.splice(index, 1);
        // On sauvegarde le patient complet
        await savePatientToDB(p);
        // On rafraichit l'affichage
        window.ouvrirPanelEdition(p);
    }
}

// --- 4. RECHERCHE ET UTILITAIRES ---

window.filtrerPatients = function() {
    const term = document.getElementById('search-input').value.toLowerCase();
    const listeFiltree = patientsLocaux.filter(p => p.nom.toLowerCase().includes(term));
    afficherGrille(listeFiltree);
}

function updateStats(liste) {
    const totalEl = document.getElementById('stat-total');
    const lastEl = document.getElementById('stat-last');
    if(totalEl) totalEl.innerText = liste.length;
    if(lastEl) lastEl.innerText = liste.length > 0 ? liste[0].nom : "-";
}

function formatDate(s) { 
    return s ? new Date(s).toLocaleDateString('fr-FR') : "??/??/????"; 
}

// --- 5. VISUALISEUR DE DOCUMENTS ---

window.voirDocument = function(url) {
    const modal = document.getElementById('modal-document');
    if(modal) {
        document.getElementById('doc-viewer-img').src = url;
        document.getElementById('doc-viewer-url').value = url;
        modal.style.display = 'flex';
    }
}
window.fermerVisualiseur = function() {
    document.getElementById('modal-document').style.display = 'none';
}
window.copierLienDoc = function() {
    const copyText = document.getElementById("doc-viewer-url");
    copyText.select();
    document.execCommand("copy");
    alert("Lien copié !");
}

// --- 6. EXPORT / IMPORT (SAUVEGARDE LOCALE) ---

window.exporterDonnees = function() {
    const dataStr = JSON.stringify(patientsLocaux, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OMC_BACKUP_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
