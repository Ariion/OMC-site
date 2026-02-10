/* ============================================================
   Dossiers.js - VERSION TEMPS RÉEL (FIREBASE)
   ============================================================ */

// On importe les fonctions depuis global.js
import { ecouterPatients, savePatientToDB, deletePatientFromDB } from "./global.js";

let patientsLocaux = []; // Copie locale pour la recherche

document.addEventListener('DOMContentLoaded', () => {
    // ON LANCE L'ÉCOUTE (C'est la magie du temps réel)
    ecouterPatients((liste) => {
        patientsLocaux = liste; // On met à jour notre copie locale
        afficherGrille(liste);  // On dessine l'écran
        updateStats(liste);     // On met à jour les chiffres
    });
});

// 1. AFFICHAGE GRILLE
function afficherGrille(liste) {
    const grid = document.getElementById('patients-grid');
    const emptyState = document.getElementById('empty-state');
    
    if(!grid) return;
    grid.innerHTML = "";

    if (liste.length === 0) {
        if(emptyState) emptyState.style.display = "block";
        return;
    }
    if(emptyState) emptyState.style.display = "none";

    liste.forEach(p => {
        const card = document.createElement('div');
        card.className = 'patient-card';
        
        const initiales = p.nom ? p.nom.split(' ').map(n => n[0]).join('').toUpperCase() : "?";
        const hasNotes = p.notes && p.notes.trim().length > 0;

        card.innerHTML = `
            <div class="p-tag">${p.groupe || '?'}</div>
            <div class="p-avatar">${initiales}</div>
            <div class="p-name">${p.nom}</div>
            <div class="p-info">📅 ${formatDate(p.naissance)}</div>
            <div class="p-info">💼 ${p.job || 'Civil'}</div>
            ${hasNotes ? '<div class="p-info" style="color:#fbbf24; font-size:10px; margin-top:5px;">⚠️ Notes présentes</div>' : ''}
        `;
        
        // Au clic, on passe l'objet complet
        card.addEventListener('click', () => ouvrirPanelEdition(p));
        grid.appendChild(card);
    });
}

// 2. OUVERTURE DOSSIER
// On doit attacher ces fonctions à window car on est dans un module
window.ouvrirPanelEdition = function(p) {
    document.getElementById('sidebar-stats').style.display = 'none';
    document.getElementById('panel-creation').style.display = 'none';
    document.getElementById('panel-edition').style.display = 'block';

    // IMPORTANT : On stocke l'ID Firebase caché
    document.getElementById('edit-original-name').value = p.id; // On utilise l'ID ici !

    document.getElementById('edit-nom').value = p.nom;
    document.getElementById('edit-ddn').value = p.naissance;
    document.getElementById('edit-groupe').value = p.groupe;
    document.getElementById('edit-job').value = p.job;
    document.getElementById('edit-notes').value = p.notes || "";

    // Historique
    const histDiv = document.getElementById('edit-historique');
    if(histDiv) {
        histDiv.innerHTML = "";
        if (p.historique && p.historique.length > 0) {
            p.historique.forEach((h, index) => {
                const dateH = new Date(h.date).toLocaleDateString('fr-FR');
                let btnVoir = h.url ? `<button onclick="voirDocument('${h.url}')" style="background:#3b82f6;border:none;color:white;cursor:pointer;font-size:10px;margin-right:5px;">👁️</button>` : "";
                // On passe l'ID et l'index pour la suppression
                let btnSuppr = `<button onclick="supprimerLigneHist('${p.id}', ${index})" style="color:#ef4444;border:none;background:none;cursor:pointer;">✖</button>`;

                histDiv.innerHTML += `
                    <div style="font-size:10px;margin-bottom:8px;border-left:2px solid #3b82f6;padding-left:8px;">
                        <div style="display:flex;justify-content:space-between;">
                            <span>${dateH} - <strong>${h.type}</strong></span>
                            <div>${btnVoir}${btnSuppr}</div>
                        </div>
                        <span style="color:#cbd5e1;font-style:italic;">${h.details}</span>
                    </div>`;
            });
        } else {
            histDiv.innerHTML = '<div style="color:#475569;font-size:10px;">Aucun historique.</div>';
        }
    }
    document.querySelector('.sidebar').scrollTop = 0;
}

window.fermerTout = function() {
    document.getElementById('panel-edition').style.display = 'none';
    document.getElementById('sidebar-stats').style.display = 'block';
    document.getElementById('panel-creation').style.display = 'block';
}

// 3. ACTIONS (SAUVEGARDER, CRÉER, SUPPRIMER)
window.creerPatient = async function() {
    const nom = document.getElementById('new-nom').value;
    if (!nom) return alert("Nom obligatoire !");

    const newP = {
        nom: nom,
        naissance: document.getElementById('new-ddn').value,
        groupe: document.getElementById('new-groupe').value,
        job: document.getElementById('new-job').value,
        notes: document.getElementById('new-notes').value,
        historique: [],
        dateCreation: new Date().toISOString()
    };

    await savePatientToDB(newP);
    // Pas besoin de recharger, ecouterPatients le fera tout seul !
    
    // Reset
    document.getElementById('new-nom').value = "";
    document.getElementById('new-ddn').value = "";
    document.getElementById('new-job').value = "";
    document.getElementById('new-notes').value = "";
}

window.sauvegarderEdition = async function() {
    const id = document.getElementById('edit-original-name').value;
    
    // On retrouve le patient actuel dans notre liste locale pour ne pas perdre l'historique
    const originalP = patientsLocaux.find(p => p.id === id);

    const updatedP = {
        id: id, // IMPORTANT : On garde l'ID Firebase
        nom: document.getElementById('edit-nom').value,
        naissance: document.getElementById('edit-ddn').value,
        groupe: document.getElementById('edit-groupe').value,
        job: document.getElementById('edit-job').value,
        notes: document.getElementById('edit-notes').value,
        dateCreation: originalP.dateCreation,
        historique: originalP.historique || []
    };

    await savePatientToDB(updatedP);
    fermerTout();
    alert("✅ Dossier mis à jour (Synchronisé) !");
}

window.supprimerPatient = async function() {
    const id = document.getElementById('edit-original-name').value;
    if(confirm("Supprimer définitivement ce dossier de la base commune ?")) {
        await deletePatientFromDB(id);
        fermerTout();
    }
}

// 4. GESTION HISTORIQUE
window.supprimerLigneHist = async function(patientId, index) {
    if(!confirm("Supprimer cette ligne ?")) return;
    
    const p = patientsLocaux.find(pat => pat.id === patientId);
    if(p) {
        p.historique.splice(index, 1); // On retire la ligne
        await savePatientToDB(p); // On sauvegarde
        // L'interface se mettra à jour toute seule grâce au listener, 
        // mais comme le panneau est ouvert, on le rafraichit manuellement :
        ouvrirPanelEdition(p);
    }
}

// 5. RECHERCHE ET UTILS
window.filtrerPatients = function() {
    const term = document.getElementById('search-input').value.toLowerCase();
    const listeFiltree = patientsLocaux.filter(p => p.nom.toLowerCase().includes(term));
    afficherGrille(listeFiltree);
}

function updateStats(liste) {
    document.getElementById('stat-total').innerText = liste.length;
    document.getElementById('stat-last').innerText = liste.length > 0 ? liste[0].nom : "-";
}

function formatDate(s) { 
    return s ? new Date(s).toLocaleDateString('fr-FR') : "??/??/????"; 
}

// Fonctions pour le visualiseur d'image
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
