/* ============================================================
   GESTIONNAIRE D'ARCHIVES PATIENTS (GRID VIEW) - V2
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
    
    if(!grid || !emptyState) return;

    grid.innerHTML = "";

    if (db.length === 0) {
        emptyState.style.display = "block";
        return;
    } else {
        emptyState.style.display = "none";
    }

    const dbReverse = [...db].reverse();

    dbReverse.forEach(p => {
        const card = document.createElement('div');
        card.className = 'patient-card';
        
        const initiales = p.nom ? p.nom.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : "?";
        
        let age = "Âge inconnu";
        if(p.naissance) {
            const birthDate = new Date(p.naissance);
            const diff = Date.now() - birthDate.getTime();
            const ageDate = new Date(diff); 
            age = Math.abs(ageDate.getUTCFullYear() - 1970) + " ans";
        }

        card.innerHTML = `
            <div class="p-tag">${p.groupe || '?'}</div>
            <div class="p-avatar">${initiales}</div>
            <div class="p-name">${p.nom}</div>
            <div class="p-info">📅 ${formatDate(p.naissance)} (${age})</div>
            <div class="p-info">💼 ${p.job || 'Civil'}</div>
            ${p.notes ? '<div class="p-info" style="color:#fbbf24; font-size:10px;">⚠️ Notes présentes</div>' : ''}
        `;
        
        // AU CLIC : On ouvre la modale d'édition
        card.onclick = () => {
            ouvrirModalEdition(p);
        };

        grid.appendChild(card);
    });
}

// 2. FILTRE DE RECHERCHE
function filtrerPatients() {
    const term = document.getElementById('search-input').value.toLowerCase();
    const cards = document.querySelectorAll('.patient-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const name = card.querySelector('.p-name').innerText.toLowerCase();
        if (name.includes(term)) {
            card.style.display = "block";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    const emptyState = document.getElementById('empty-state');
    if (visibleCount === 0 && cards.length > 0) {
        emptyState.style.display = "block";
        emptyState.querySelector('h3').innerText = "Aucun résultat";
    } else if (cards.length === 0) {
        emptyState.style.display = "block"; 
    } else {
        emptyState.style.display = "none";
    }
}

// 3. STATISTIQUES
function updateStats() {
    const db = getPatientsDB();
    const statTotal = document.getElementById('stat-total');
    const statLast = document.getElementById('stat-last');

    if(statTotal) statTotal.innerText = db.length;
    if(statLast) {
        statLast.innerText = (db.length > 0) ? db[db.length-1].nom : "-";
    }
}

// ============================================================
// GESTION MODALE CRÉATION
// ============================================================
function fermerTout() {
    document.getElementById('modal-creation').style.display = 'none';
    document.getElementById('modal-edition').style.display = 'none';
}

function ouvrirModalCreation() {
    fermerTout(); // On ferme tout d'abord !
    document.getElementById('modal-creation').style.display = 'flex';
}

function fermerModal() {
    document.getElementById('modal-creation').style.display = 'none';
    document.getElementById('new-nom').value = "";
    document.getElementById('new-ddn').value = "";
    document.getElementById('new-job').value = "";
    document.getElementById('new-groupe').value = "A+";
}

function creerPatient() {
    const nom = document.getElementById('new-nom').value;
    const ddn = document.getElementById('new-ddn').value;
    const groupe = document.getElementById('new-groupe').value;
    const job = document.getElementById('new-job').value;

    if (!nom) { alert("Le nom est obligatoire !"); return; }

    const newP = {
        nom: nom,
        naissance: ddn,
        groupe: groupe,
        job: job,
        notes: "", // Champ vide par défaut
        dateCreation: new Date().toISOString()
    };

    savePatientToDB(newP); 
    fermerModal();
    chargerPatients();
    updateStats();
}

// ============================================================
// GESTION MODALE ÉDITION (MODIFIER / SUPPRIMER)
// ============================================================
function ouvrirModalEdition(p) {
    fermerTout(); // On ferme tout d'abord !
    
    // Remplissage des champs (Code existant inchangé)
    document.getElementById('edit-original-name').value = p.nom;
    document.getElementById('edit-nom').value = p.nom;
    document.getElementById('edit-ddn').value = p.naissance;
    document.getElementById('edit-groupe').value = p.groupe;
    document.getElementById('edit-job').value = p.job;
    document.getElementById('edit-notes').value = p.notes || "";

    document.getElementById('modal-edition').style.display = 'flex';
}

function fermerModalEdition() {
    document.getElementById('modal-edition').style.display = 'none';
}

function sauvegarderEdition() {
    const originalName = document.getElementById('edit-original-name').value;
    
    // On recrée l'objet patient mis à jour
    const updatedP = {
        nom: document.getElementById('edit-nom').value,
        naissance: document.getElementById('edit-ddn').value,
        groupe: document.getElementById('edit-groupe').value,
        job: document.getElementById('edit-job').value,
        notes: document.getElementById('edit-notes').value, // Sauvegarde des notes
        dateCreation: new Date().toISOString() // On pourrait garder l'ancienne date, mais c'est du détail
    };

    // Astuce : savePatientToDB écrase si le nom existe déjà.
    // Comme le nom est en "readonly", ça mettra bien à jour le bon patient.
    savePatientToDB(updatedP);
    
    fermerModalEdition();
    chargerPatients(); // Rafraichissement
    // Petit feedback visuel
    alert("Dossier mis à jour !");
}

function supprimerPatient() {
    const nom = document.getElementById('edit-nom').value;
    
    if(confirm(`Êtes-vous sûr de vouloir supprimer définitivement le dossier de ${nom} ?`)) {
        let db = getPatientsDB();
        // On filtre pour garder tout le monde SAUF celui qu'on veut supprimer
        db = db.filter(p => p.nom !== nom);
        
        // On sauvegarde la nouvelle liste
        localStorage.setItem('omc_patients_db', JSON.stringify(db));
        
        fermerModalEdition();
        chargerPatients();
        updateStats();
    }
}

// Utilitaire date
function formatDate(dateString) {
    if(!dateString) return "??/??/????";
    const d = new Date(dateString);
    return d.toLocaleDateString('fr-FR');
}
