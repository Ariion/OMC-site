/* ============================================================
   DOSSIERS.JS - VERSION CORRIGÉE (LIAISON HTML OK)
   ============================================================ */

// On importe les outils de global.js
import { getPatientsDB, savePatientToDB, deletePatientFromDB, ecouterPatients } from "./global.js";

// Variable locale pour la recherche
let patientsLocaux = [];

document.addEventListener('DOMContentLoaded', () => {
    // On lance l'écoute temps réel de Firebase
    ecouterPatients((liste) => {
        patientsLocaux = liste;
        afficherGrille(liste);
        updateStats(liste);
    });
});

// --- FONCTIONS D'AFFICHAGE ---

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
        
        // Au clic, on appelle la fonction globale
        card.onclick = () => window.ouvrirPanelEdition(p);
        grid.appendChild(card);
    });
}

// --- FONCTIONS RENDUES PUBLIQUES (WINDOW) ---

// 1. GESTION DES PANNEAUX
window.fermerTout = function() {
    document.getElementById('panel-edition').style.display = 'none';
    document.getElementById('sidebar-stats').style.display = 'block';
    document.getElementById('panel-creation').style.display = 'block';
}

window.ouvrirPanelEdition = function(p) {
    window.fermerTout(); // Reset visuel
    
    // Cache creation et stats
    document.getElementById('sidebar-stats').style.display = 'none';
    document.getElementById('panel-creation').style.display = 'none';
    
    // Affiche édition
    document.getElementById('panel-edition').style.display = 'block';

    // Remplissage
    // IMPORTANT : On utilise l'ID Firebase s'il existe, sinon le nom
    document.getElementById('edit-original-name').value = p.id || p.nom;
    
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
                // Boutons Voir et Supprimer
                let btnVoir = h.url ? `<button onclick="voirDocument('${h.url}')" style="background:#3b82f6;border:none;color:white;cursor:pointer;font-size:10px;margin-right:5px;">👁️</button>` : "";
                let btnSuppr = `<button onclick="supprimerLigneHist('${p.id || p.nom}', ${index})" style="color:#ef4444;border:none;background:none;cursor:pointer;">✖</button>`;

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

// 2. ACTIONS CRUD (Create, Update, Delete)
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

    // On utilise la fonction de global.js qui gère Firebase
    await savePatientToDB(newP);
    
    // Reset
    document.getElementById('new-nom').value = "";
    document.getElementById('new-ddn').value = "";
    document.getElementById('new-job').value = "";
    document.getElementById('new-notes').value = "";
    
    // Note : Pas besoin de chargerPatients(), Firebase le fera automatiquement grâce à ecouterPatients
}

window.sauvegarderEdition = async function() {
    const id = document.getElementById('edit-original-name').value;
    
    // On retrouve le patient original pour ne pas perdre son historique ou sa date de création
    const originalP = patientsLocaux.find(p => p.id === id || p.nom === id);

    if(!originalP) return alert("Erreur : Patient introuvable");

    const updatedP = {
        id: originalP.id, // On garde l'ID Firebase
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
    if(confirm("Supprimer définitivement ce dossier ?")) {
        await deletePatientFromDB(id);
        window.fermerTout();
    }
}

// 3. ACTIONS HISTORIQUE
window.supprimerLigneHist = async function(patientId, index) {
    if(!confirm("Supprimer cette ligne ?")) return;
    
    const p = patientsLocaux.find(pat => pat.id === patientId || pat.nom === patientId);
    if(p) {
        p.historique.splice(index, 1);
        await savePatientToDB(p);
        // On rafraichit l'affichage du panneau
        window.ouvrirPanelEdition(p);
    }
}

// 4. RECHERCHE
window.filtrerPatients = function() {
    const term = document.getElementById('search-input').value.toLowerCase();
    const listeFiltree = patientsLocaux.filter(p => p.nom.toLowerCase().includes(term));
    afficherGrille(listeFiltree);
}

// 5. UTILS & EXPORT
function updateStats(liste) {
    const totalEl = document.getElementById('stat-total');
    const lastEl = document.getElementById('stat-last');
    if(totalEl) totalEl.innerText = liste.length;
    if(lastEl) lastEl.innerText = liste.length > 0 ? liste[0].nom : "-";
}

function formatDate(s) { 
    return s ? new Date(s).toLocaleDateString('fr-FR') : "??/??/????"; 
}

// Visualiseur de document
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

// Export / Import (Compatible JSON Local)
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
