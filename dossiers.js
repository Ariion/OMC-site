// SIMULATION DE BASE DE DONNÉES PATIENTS
const MOCK_DB = [
    {
        id: 1, nom: "FREEMAN Garret", naissance: "1995-05-12", telephone: "555-0192", 
        groupe: "A+", job: "Civil", 
        alerts: "Allergie Pénicilline. Asthmatique léger.", 
        notes: "Patient coopératif. Bonne couverture assurance."
    },
    {
        id: 2, nom: "GREY Meredith", naissance: "1988-11-10", telephone: "555-8822", 
        groupe: "O+", job: "EMS", 
        alerts: "Aucune allergie connue.", 
        notes: "Collègue."
    },
    {
        id: 3, nom: "WICK John", naissance: "1980-09-02", telephone: "555-6666", 
        groupe: "AB-", job: "Inconnu", 
        alerts: "Multiples traumatismes anciens.", 
        notes: "Patient très résistant à la douleur. Peu bavard."
    }
];

// 1. RECHERCHE DYNAMIQUE
function simulerRecherche() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = "";

    if (input.length < 2) {
        resultsDiv.style.display = 'none';
        return;
    }

    const filtered = MOCK_DB.filter(p => p.nom.toLowerCase().includes(input));

    if (filtered.length > 0) {
        resultsDiv.style.display = 'block';
        filtered.forEach(p => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML = `<strong>${p.nom}</strong> <span>${p.naissance}</span>`;
            div.onclick = () => chargerDossier(p);
            resultsDiv.appendChild(div);
        });
    } else {
        resultsDiv.style.display = 'none';
    }
}

// 2. CHARGEMENT DU DOSSIER
function chargerDossier(patient) {
    // Masquer l'état vide et la recherche
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('search-results').style.display = 'none';
    document.getElementById('searchInput').value = patient.nom;
    
    // Afficher le dossier
    document.getElementById('patient-folder').style.display = 'grid';

    // Remplir les champs
    document.getElementById('p-name').innerText = patient.nom;
    document.getElementById('p-avatar').innerText = patient.nom.split(' ').map(n => n[0]).join('');
    document.getElementById('p-birth').innerText = new Date(patient.naissance).toLocaleDateString('fr-FR');
    document.getElementById('p-phone').innerText = patient.telephone;
    document.getElementById('p-blood').innerText = patient.groupe;
    document.getElementById('p-job').innerText = patient.job;
    document.getElementById('p-alerts').value = patient.alerts;
    document.getElementById('p-notes').value = patient.notes;

    // Sauvegarder dans le navigateur pour les autres pages (Le secret !)
    localStorage.setItem('currentPatient', JSON.stringify(patient));
}

// 3. NAVIGATION AVEC PRÉ-REMPLISSAGE
function goTo(page) {
    // L'info est déjà dans localStorage, la page suivante n'aura plus qu'à la lire
    window.location.href = page;
}

// 4. RÉINITIALISATION
function resetInterface() {
    document.getElementById('patient-folder').style.display = 'none';
    document.getElementById('empty-state').style.display = 'flex';
    document.getElementById('searchInput').value = "";
    localStorage.removeItem('currentPatient');
}
