/* ============================================================
   GESTIONNAIRE D'ARCHIVES PATIENTS - VERSION FINALISÉE
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    chargerPatients();
    updateStats();
});

// 1. CHARGEMENT ET AFFICHAGE (GRILLE)
function chargerPatients() {
    const db = getPatientsDB(); 
    const grid = document.getElementById('patients-grid');
    const emptyState = document.getElementById('empty-state');
    
    // Sécurité
    if(!grid || !emptyState) return;

    grid.innerHTML = "";

    // Gestion état vide
    if (db.length === 0) {
        emptyState.style.display = "block";
        return;
    }
    emptyState.style.display = "none";

    // Affichage des cartes (Inversé pour voir les nouveaux en premier)
    [...db].reverse().forEach(p => {
        const card = document.createElement('div');
        card.className = 'patient-card';
        
        // Initiales
        const initiales = p.nom ? p.nom.split(' ').map(n => n[0]).join('').toUpperCase() : "?";
        
        // Indicateur visuel si notes présentes
        const hasNotes = p.notes && p.notes.trim().length > 0;

        card.innerHTML = `
            <div class="p-tag">${p.groupe || '?'}</div>
            <div class="p-avatar">${initiales}</div>
            <div class="p-name">${p.nom}</div>
            <div class="p-info">📅 ${formatDate(p.naissance)}</div>
            <div class="p-info">💼 ${p.job || 'Civil'}</div>
            ${hasNotes ? '<div class="p-info" style="color:#fbbf24; font-size:10px; margin-top:5px;">⚠️ Notes présentes</div>' : ''}
        `;
        
        card.onclick = () => ouvrirPanelEdition(p);
        grid.appendChild(card);
    });
}

// 2. OUVERTURE DU DOSSIER (SIDEBAR)
function ouvrirPanelEdition(p) {
    // UI : On cache les stats et la création pour faire de la place
    document.getElementById('sidebar-stats').style.display = 'none';
    document.getElementById('panel-creation').style.display = 'none';
    
    // UI : On affiche l'édition
    const panel = document.getElementById('panel-edition');
    panel.style.display = 'block';

    // Remplissage des champs
    document.getElementById('edit-original-name').value = p.nom;
    document.getElementById('edit-nom').value = p.nom;
    document.getElementById('edit-ddn').value = p.naissance;
    document.getElementById('edit-groupe').value = p.groupe;
    document.getElementById('edit-job').value = p.job;
    document.getElementById('edit-notes').value = p.notes || "";
    
    // AFFICHAGE DE L'HISTORIQUE (Ordonnances, etc.)
    // Note: Il faut que la div id="edit-historique" existe dans ton HTML (voir instruction précédente)
    const histDiv = document.getElementById('edit-historique');
    if(histDiv) {
        histDiv.innerHTML = ""; // On vide avant de remplir
        
        if (p.historique && p.historique.length > 0) {
            p.historique.forEach(h => {
                const dateH = new Date(h.date).toLocaleDateString('fr-FR');
                histDiv.innerHTML += `
                    <div style="font-size: 10px; margin-bottom: 8px; border-left: 2px solid #3b82f6; padding-left: 8px;">
                        <span style="color: #94a3b8;">${dateH}</span> - <strong style="color:white;">${h.type}</strong><br>
                        <span style="color: #cbd5e1; font-style: italic;">${h.details}</span>
                    </div>
                `;
            });
        } else {
            histDiv.innerHTML = '<div style="font-size:10px; color:#475569; padding:5px; font-style:italic;">Aucun historique disponible.</div>';
        }
    }
    
    // Scroll en haut de la sidebar pour bien voir le dossier
    document.querySelector('.sidebar').scrollTop = 0;
}

// 3. FERMETURE DU DOSSIER
function fermerTout() {
    // UI : On cache l'édition
    document.getElementById('panel-edition').style.display = 'none';
    
    // UI : On réaffiche la création et les stats
    document.getElementById('sidebar-stats').style.display = 'block';
    document.getElementById('panel-creation').style.display = 'block';
}

// 4. SAUVEGARDE DES MODIFICATIONS
function sauvegarderEdition() {
    const originalName = document.getElementById('edit-original-name').value;
    
    // On récupère la DB actuelle pour ne pas perdre l'historique existant
    let db = getPatientsDB();
    const existingP = db.find(p => p.nom === originalName);

    const updatedP = {
        nom: document.getElementById('edit-nom').value,
        naissance: document.getElementById('edit-ddn').value,
        groupe: document.getElementById('edit-groupe').value,
        job: document.getElementById('edit-job').value,
        notes: document.getElementById('edit-notes').value,
        // On garde la date de création et l'historique originaux s'ils existent
        dateCreation: existingP ? existingP.dateCreation : new Date().toISOString(),
        historique: existingP ? (existingP.historique || []) : []
    };

    savePatientToDB(updatedP);
    alert("✅ Dossier mis à jour !");
    fermerTout();
    chargerPatients();
}

// 5. CRÉATION D'UN NOUVEAU PATIENT
function creerPatient() {
    const nom = document.getElementById('new-nom').value;
    const notes = document.getElementById('new-notes').value; 
    
    if (!nom) { 
        alert("⚠️ Le nom est obligatoire !"); 
        return; 
    }
    
    const newP = {
        nom: nom,
        naissance: document.getElementById('new-ddn').value,
        groupe: document.getElementById('new-groupe').value,
        job: document.getElementById('new-job').value,
        notes: notes,
        historique: [], // Tableau vide au départ
        dateCreation: new Date().toISOString()
    };

    savePatientToDB(newP);
    chargerPatients();
    updateStats();
    
    // Reset du formulaire
    document.getElementById('new-nom').value = "";
    document.getElementById('new-ddn').value = "";
    document.getElementById('new-job').value = "";
    document.getElementById('new-notes').value = "";
}

// 6. SUPPRESSION
function supprimerPatient() {
    const nom = document.getElementById('edit-nom').value;
    if(confirm(`⛔ Êtes-vous sûr de vouloir supprimer définitivement le dossier de ${nom} ?`)) {
        let db = getPatientsDB().filter(p => p.nom !== nom);
        localStorage.setItem('omc_patients_db', JSON.stringify(db));
        
        fermerTout();
        chargerPatients();
        updateStats();
    }
}

// 7. BARRE DE RECHERCHE
function filtrerPatients() {
    const term = document.getElementById('search-input').value.toLowerCase();
    document.querySelectorAll('.patient-card').forEach(card => {
        const name = card.querySelector('.p-name').innerText.toLowerCase();
        card.style.display = name.includes(term) ? "block" : "none";
    });
}

// 8. STATISTIQUES
function updateStats() {
    const db = getPatientsDB();
    document.getElementById('stat-total').innerText = db.length;
    document.getElementById('stat-last').innerText = db.length > 0 ? db[db.length-1].nom : "-";
}

// UTILITAIRE
function formatDate(s) { 
    return s ? new Date(s).toLocaleDateString('fr-FR') : "??/??/????"; 
}
