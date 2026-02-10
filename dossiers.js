/* ============================================================
   GESTIONNAIRE D'ARCHIVES PATIENTS (GRID VIEW)
   ============================================================ */

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    chargerPatients();
    updateStats();
});

// 1. CHARGEMENT ET AFFICHAGE (GRILLE)
function chargerPatients() {
    // On récupère la base de données via global.js
    const db = getPatientsDB(); 
    const grid = document.getElementById('patients-grid');
    const emptyState = document.getElementById('empty-state');
    
    // Sécurité si un élément manque
    if(!grid || !emptyState) return;

    grid.innerHTML = "";

    // Si la base est vide
    if (db.length === 0) {
        emptyState.style.display = "block";
        return;
    } else {
        emptyState.style.display = "none";
    }

    // On inverse pour afficher les derniers ajoutés en premier (en haut à gauche)
    const dbReverse = [...db].reverse();

    dbReverse.forEach(p => {
        const card = document.createElement('div');
        card.className = 'patient-card';
        
        // Création des initiales pour l'avatar (Ex: Garret Freeman -> GF)
        const initiales = p.nom ? p.nom.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : "?";
        
        // Calcul de l'âge (approximatif)
        let age = "Âge inconnu";
        if(p.naissance) {
            const birthDate = new Date(p.naissance);
            const diff = Date.now() - birthDate.getTime();
            const ageDate = new Date(diff); 
            age = Math.abs(ageDate.getUTCFullYear() - 1970) + " ans";
        }

        // Construction de la carte HTML
        card.innerHTML = `
            <div class="p-tag">${p.groupe || '?'}</div>
            <div class="p-avatar">${initiales}</div>
            <div class="p-name">${p.nom}</div>
            <div class="p-info">📅 ${formatDate(p.naissance)} (${age})</div>
            <div class="p-info">💼 ${p.job || 'Civil'}</div>
        `;
        
        // Interaction au clic (Pour l'instant simple alerte, plus tard édition)
        card.onclick = () => {
            alert(`Dossier : ${p.nom}\nStatut : ${p.job}\nGroupe : ${p.groupe}`);
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
        // On cherche dans le nom affiché sur la carte
        const name = card.querySelector('.p-name').innerText.toLowerCase();
        
        if (name.includes(term)) {
            card.style.display = "block"; // On affiche
            visibleCount++;
        } else {
            card.style.display = "none"; // On cache
        }
    });

    // Gestion du message "Aucun résultat"
    const emptyState = document.getElementById('empty-state');
    const h3 = emptyState.querySelector('h3');
    const p = emptyState.querySelector('p');

    if (visibleCount === 0 && cards.length > 0) {
        // Il y a des patients mais la recherche ne donne rien
        emptyState.style.display = "block";
        if(h3) h3.innerText = "Aucun résultat";
        if(p) p.innerText = "Essayez une autre orthographe.";
    } else if (cards.length === 0) {
        // La base est vraiment vide
        emptyState.style.display = "block"; 
        if(h3) h3.innerText = "Aucun patient trouvé";
        if(p) p.innerText = "Modifiez votre recherche ou créez un nouveau dossier.";
    } else {
        emptyState.style.display = "none";
    }
}

// 3. STATISTIQUES SIDEBAR
function updateStats() {
    const db = getPatientsDB();
    const statTotal = document.getElementById('stat-total');
    const statLast = document.getElementById('stat-last');

    if(statTotal) statTotal.innerText = db.length;
    
    if(statLast) {
        if(db.length > 0) {
            // Le dernier ajouté est le dernier du tableau
            statLast.innerText = db[db.length-1].nom;
        } else {
            statLast.innerText = "-";
        }
    }
}

// 4. GESTION DE LA MODALE (POPUP)
function ouvrirModalCreation() {
    document.getElementById('modal-creation').style.display = 'flex';
}

function fermerModal() {
    document.getElementById('modal-creation').style.display = 'none';
    // On vide les champs pour la prochaine fois
    document.getElementById('new-nom').value = "";
    document.getElementById('new-ddn').value = "";
    document.getElementById('new-job').value = "";
    document.getElementById('new-groupe').value = "A+";
}

// 5. CRÉATION DU PATIENT
function creerPatient() {
    const nom = document.getElementById('new-nom').value;
    const ddn = document.getElementById('new-ddn').value;
    const groupe = document.getElementById('new-groupe').value;
    const job = document.getElementById('new-job').value;

    if (!nom) {
        alert("Le nom est obligatoire !");
        return;
    }

    const newP = {
        nom: nom,
        naissance: ddn,
        groupe: groupe,
        job: job,
        dateCreation: new Date().toISOString()
    };

    // Sauvegarde via la fonction centrale de global.js
    savePatientToDB(newP); 
    
    fermerModal();
    chargerPatients(); // On recharge la grille pour voir le nouveau
    updateStats();     // On met à jour les compteurs
}

// Petit utilitaire pour formater la date proprement
function formatDate(dateString) {
    if(!dateString) return "??/??/????";
    const d = new Date(dateString);
    return d.toLocaleDateString('fr-FR');
}
