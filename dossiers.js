document.addEventListener('DOMContentLoaded', () => {
    chargerPatients();
    updateStats();
});

function chargerPatients() {
    const db = getPatientsDB(); 
    const grid = document.getElementById('patients-grid');
    const emptyState = document.getElementById('empty-state');
    grid.innerHTML = "";

    if (db.length === 0) {
        emptyState.style.display = "block";
        return;
    }
    emptyState.style.display = "none";

    [...db].reverse().forEach(p => {
        const card = document.createElement('div');
        card.className = 'patient-card';
        const initiales = p.nom ? p.nom.split(' ').map(n => n[0]).join('').toUpperCase() : "?";
        
        card.innerHTML = `
            <div class="p-tag">${p.groupe || '?'}</div>
            <div class="p-avatar">${initiales}</div>
            <div class="p-name">${p.nom}</div>
            <div class="p-info">📅 ${formatDate(p.naissance)}</div>
            <div class="p-info">💼 ${p.job || 'Civil'}</div>
        `;
        card.onclick = () => ouvrirPanelEdition(p);
        grid.appendChild(card);
    });
}

function ouvrirPanelEdition(p) {
    document.getElementById('sidebar-stats').style.display = 'none';
    const panel = document.getElementById('panel-edition');
    panel.style.display = 'block';

    document.getElementById('edit-original-name').value = p.nom;
    document.getElementById('edit-nom').value = p.nom;
    document.getElementById('edit-ddn').value = p.naissance;
    document.getElementById('edit-groupe').value = p.groupe;
    document.getElementById('edit-job').value = p.job;
    document.getElementById('edit-notes').value = p.notes || "";
    
    // Scroll auto vers le haut pour voir l'édition
    document.querySelector('.sidebar').scrollTop = 0;
}

function fermerTout() {
    document.getElementById('panel-edition').style.display = 'none';
    document.getElementById('sidebar-stats').style.display = 'block';
}

function sauvegarderEdition() {
    const updatedP = {
        nom: document.getElementById('edit-nom').value,
        naissance: document.getElementById('edit-ddn').value,
        groupe: document.getElementById('edit-groupe').value,
        job: document.getElementById('edit-job').value,
        notes: document.getElementById('edit-notes').value,
        dateCreation: new Date().toISOString()
    };
    savePatientToDB(updatedP);
    alert("Dossier mis à jour !");
    fermerTout();
    chargerPatients();
}

function creerPatient() {
    const nom = document.getElementById('new-nom').value;
    const notes = document.getElementById('new-notes').value; // On récupère les notes
    
    if (!nom) { 
        alert("Le nom est obligatoire !"); 
        return; 
    }
    
    const newP = {
        nom: nom,
        naissance: document.getElementById('new-ddn').value,
        groupe: document.getElementById('new-groupe').value,
        job: document.getElementById('new-job').value,
        notes: notes, // Enregistrement des notes
        dateCreation: new Date().toISOString()
    };

    savePatientToDB(newP);
    chargerPatients();
    updateStats();
    
    // Reset du formulaire de création
    document.getElementById('new-nom').value = "";
    document.getElementById('new-ddn').value = "";
    document.getElementById('new-job').value = "";
    document.getElementById('new-notes').value = "";
}

function supprimerPatient() {
    const nom = document.getElementById('edit-nom').value;
    if(confirm(`Supprimer ${nom} ?`)) {
        let db = getPatientsDB().filter(p => p.nom !== nom);
        localStorage.setItem('omc_patients_db', JSON.stringify(db));
        fermerTout();
        chargerPatients();
        updateStats();
    }
}

function filtrerPatients() {
    const term = document.getElementById('search-input').value.toLowerCase();
    document.querySelectorAll('.patient-card').forEach(card => {
        const name = card.querySelector('.p-name').innerText.toLowerCase();
        card.style.display = name.includes(term) ? "block" : "none";
    });
}

function updateStats() {
    const db = getPatientsDB();
    document.getElementById('stat-total').innerText = db.length;
    document.getElementById('stat-last').innerText = db.length > 0 ? db[db.length-1].nom : "-";
}

function formatDate(s) { return s ? new Date(s).toLocaleDateString('fr-FR') : "??/??/????"; }
