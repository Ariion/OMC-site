function updateThemeButtonText(theme) {
    const btnText = document.getElementById('theme-text');
    if (btnText) {
        btnText.innerText = theme === 'dark' ? 'Passer mode clair' : 'Passer mode sombre';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
    updateThemeButtonText(targetTheme);
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButtonText(savedTheme);
});

// Fonction de liaison simple (Nom, Lieu, Heure, Signature)
function up(id, val) {
    const el = document.getElementById(id);
    if (el) {
        el.innerText = val || "...";
        // Cas particulier pour la signature du docteur
        if(id === 'd-sig' && !val) el.innerText = "DOCTEUR";
    }
}

// Fonction de liaison pour les dates (formate AAAA-MM-JJ en JJ/MM/AAAA)
function upDate(id, val) {
    if (!val) return;
    const [y, m, d] = val.split('-');
    const el = document.getElementById(id);
    if (el) el.innerText = `${d}/${m}/${y}`;
}


/* ============================================================
   SYSTEME CENTRAL DE GESTION PATIENTS (OMC-CORE)
   ============================================================ */

const DB_KEY = 'omc_patients_db';

// --- 1. GESTION BASE DE DONNÉES ---
function getPatientsDB() {
    const db = localStorage.getItem(DB_KEY);
    return db ? JSON.parse(db) : [];
}

function savePatientToDB(patientData) {
    const db = getPatientsDB();
    // On vérifie si le patient existe déjà (par nom)
    const index = db.findIndex(p => p.nom.toLowerCase() === patientData.nom.toLowerCase());
    
    if (index >= 0) {
        db[index] = patientData; // Mise à jour
    } else {
        db.push(patientData); // Création
    }
    
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return true;
}

// --- 2. FONCTION MAGIQUE D'AUTOCOMPLÉTION ---
// config = { nameId, birthId, bloodId, jobId, callback }
function setupPatientAutocomplete(config) {
    const inputName = document.getElementById(config.nameId);
    if (!inputName) return; // Sécurité si l'ID n'existe pas

    // Création du wrapper pour le style
    const wrapper = document.createElement('div');
    wrapper.className = 'autocomplete-wrapper';
    inputName.parentNode.insertBefore(wrapper, inputName);
    wrapper.appendChild(inputName);

    // Création de la liste (cachée)
    const list = document.createElement('div');
    list.className = 'autocomplete-list';
    list.style.display = 'none';
    wrapper.appendChild(list);

    // Écouteur de frappe
    inputName.addEventListener('input', function() {
        const val = this.value.toLowerCase();
        list.innerHTML = '';
        
        if (val.length < 2) {
            list.style.display = 'none';
            return;
        }

        const db = getPatientsDB();
        const matches = db.filter(p => p.nom.toLowerCase().includes(val));

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
                    // 1. Remplir le nom
                    inputName.value = p.nom;
                    
                    // 2. Remplir Date Naissance (si l'ID existe sur la page)
                    if (config.birthId && document.getElementById(config.birthId)) {
                        document.getElementById(config.birthId).value = p.naissance;
                    }
                    
                    // 3. Remplir Groupe Sanguin (si l'ID existe)
                    if (config.bloodId && document.getElementById(config.bloodId)) {
                        document.getElementById(config.bloodId).value = p.groupe;
                    }

                    // 4. Remplir Métier (si l'ID existe)
                    if (config.jobId && document.getElementById(config.jobId)) {
                        document.getElementById(config.jobId).value = p.job;
                    }

                    // 5. Fermer la liste
                    list.style.display = 'none';

                    // 6. Exécuter la fonction spécifique à la page (mise à jour preview)
                    if (config.callback) config.callback(p);
                };
                list.appendChild(item);
            });
        } else {
            list.style.display = 'none';
        }
    });

    // Fermer si on clique ailleurs
    document.addEventListener('click', function(e) {
        if (e.target !== inputName) list.style.display = 'none';
    });
}

