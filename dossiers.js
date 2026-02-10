/* ============================================================
   GESTIONNAIRE DE DOSSIERS PATIENTS
   ============================================================ */

let currentDisplayedPatient = null; // Pour savoir qui est affiché

window.onload = () => {
    refreshStats();
    setupSearch();
};

// 1. BARRE DE RECHERCHE DYNAMIQUE
function setupSearch() {
    const input = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('search-results');

    input.addEventListener('input', function() {
        const val = this.value.toLowerCase();
        resultsDiv.innerHTML = "";
        
        if (val.length < 2) {
            resultsDiv.style.display = 'none';
            return;
        }

        // On utilise la fonction de global.js pour récupérer la vraie DB
        const patients = getPatientsDB(); 
        const filtered = patients.filter(p => p.nom.toLowerCase().includes(val));

        if (filtered.length > 0) {
            resultsDiv.style.display = 'block';
            filtered.forEach(p => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.innerHTML = `<strong>${p.nom}</strong> <span>${p.naissance}</span>`;
                div.onclick = () => afficherPatient(p);
                resultsDiv.appendChild(div);
            });
        } else {
            resultsDiv.style.display = 'none';
        }
    });

    // Fermer si clic ailleurs
    document.addEventListener('click', (e) => {
        if (e.target !== input) resultsDiv.style.display = 'none';
    });
}


// 2. AFFICHER LE DOSSIER
function afficherPatient(p) {
    currentDisplayedPatient = p;
    
    // UI Switch
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('search-results').style.display = 'none';
    document.getElementById('searchInput').value = p.nom;
    document.getElementById('patient-folder').style.display = 'grid';

    // Remplissage des champs
    document.getElementById('p-name').innerText = p.nom;
    document.getElementById('p-avatar').innerText = p.nom.substring(0,2).toUpperCase();
    document.getElementById('p-birth').innerText = p.naissance || "--/--/----";
    document.getElementById('p-phone').innerText = p.telephone || "Non renseigné";
    document.getElementById('p-blood').innerText = p.groupe || "?";
    document.getElementById('p-job').innerText = p.job || "Civil";
    
    // Notes & Alertes (éditables)
    document.getElementById('p-alerts').value = p.alerts || "";
    document.getElementById('p-notes').value = p.notes || "";
}

// 3. SAUVEGARDER LES NOTES MODIFIÉES
function saveCurrentNotes() {
    if (!currentDisplayedPatient) return;
    
    currentDisplayedPatient.alerts = document.getElementById('p-alerts').value;
    currentDisplayedPatient.notes = document.getElementById('p-notes').value;
    
    // On met à jour dans la base globale
    savePatientToDB(currentDisplayedPatient);
    alert("Notes mises à jour !");
}

// 4. CRÉATION DE PATIENT (MODALE)
function openNewPatientModal() {
    document.getElementById('modal-new-patient').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-new-patient').style.display = 'none';
}

function saveNewPatient() {
    const nom = document.getElementById('new-nom').value;
    const birth = document.getElementById('new-birth').value;
    
    if(!nom) { alert("Le nom est obligatoire !"); return; }

    const newP = {
        nom: nom,
        naissance: birth,
        groupe: document.getElementById('new-blood').value,
        job: document.getElementById('new-job').value,
        telephone: document.getElementById('new-phone').value,
        alerts: "",
        notes: ""
    };

    // Sauvegarde via global.js
    savePatientToDB(newP);
    
    alert("Dossier patient créé avec succès !");
    closeModal();
    afficherPatient(newP); // Affiche direct le nouveau dossier
    refreshStats();
}

// 5. NAVIGATION
function goTo(page) {
    window.location.href = page;
}

// 6. STATISTIQUES (COSMÉTIQUE)
function refreshStats() {
    const db = getPatientsDB();
    document.getElementById('stats-total').innerText = db.length;
}
