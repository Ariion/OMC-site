/* ============================================================
   DOSSIERS.JS - VERSION SIMPLE (SANS IMPORT)
   ============================================================ */

console.log("✅ Dossiers.js chargé !");

// 1. INITIALISATION
// Pas besoin d'écouteur ici, c'est global.js qui va déclencher "window.chargerPatients" tout seul !

/* ============================================================
   FONCTIONS INTERNES (UI)
   ============================================================ */

// Cette fonction est appelée automatiquement par Global.js quand la base change
window.chargerPatients = function() {
    console.log("🔄 Mise à jour de la grille...");
    
    // On récupère la liste depuis la mémoire de Global.js
    const liste = window.getPatientsDB ? window.getPatientsDB() : [];
    
    // On met à jour la variable locale pour les recherches
    window.patientsLocaux = liste; 

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

    // Génération des cartes (inversé pour avoir les derniers ajouts en haut)
    [...liste].reverse().forEach(p => {
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
    
    updateStats(liste);
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
                
                // Boutons
                let btnVoir = h.url ? `<button onclick="voirDocument('${h.url}')" style="background:#3b82f6;border:none;color:white;cursor:pointer;font-size:10px;margin-right:5px;border-radius:2px;padding:2px 5px;">👁️</button>` : "";
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

    // On appelle la fonction de global.js
    if(window.savePatientToDB) {
        await window.savePatientToDB(newP);
        
        // Reset du formulaire
        document.getElementById('new-nom').value = "";
        document.getElementById('new-ddn').value = "";
        document.getElementById('new-job').value = "";
        document.getElementById('new-notes').value = "";
    } else {
        alert("Erreur : global.js ne semble pas chargé.");
    }
}

window.sauvegarderEdition = async function() {
    const id = document.getElementById('edit-original-name').value;
    
    // On retrouve le patient original
    // window.patientsLocaux est défini dans chargerPatients plus haut
    const originalP = window.patientsLocaux ? window.patientsLocaux.find(p => p.id === id || p.nom === id) : null;

    if(!originalP) return alert("Erreur : Patient introuvable");

    const updatedP = {
        id: originalP.id, 
        nom: document.getElementById('edit-nom').value,
        naissance: document.getElementById('edit-ddn').value,
        groupe: document.getElementById('edit-groupe').value,
        job: document.getElementById('edit-job').value,
        notes: document.getElementById('edit-notes').value,
        dateCreation: originalP.dateCreation,
        historique: originalP.historique || []
    };

    if(window.savePatientToDB) {
        await window.savePatientToDB(updatedP);
        window.fermerTout();
        alert("✅ Dossier mis à jour !");
    }
}

window.supprimerPatient = async function() {
    const id = document.getElementById('edit-original-name').value;
    if(confirm("⛔ Supprimer définitivement ce dossier ?")) {
        if(window.deletePatientFromDB) {
            await window.deletePatientFromDB(id);
            window.fermerTout();
        }
    }
}

// --- 3. ACTIONS HISTORIQUE ---

window.supprimerLigneHist = async function(patientId, index) {
    if(!confirm("Supprimer cette ligne d'historique ?")) return;
    
    const p = window.patientsLocaux ? window.patientsLocaux.find(pat => pat.id === patientId || pat.nom === patientId) : null;
    if(p) {
        p.historique.splice(index, 1);
        await window.savePatientToDB(p);
        window.ouvrirPanelEdition(p);
    }
}

// --- 4. RECHERCHE ET UTILITAIRES ---

window.filtrerPatients = function() {
    const term = document.getElementById('search-input').value.toLowerCase();
    const liste = window.patientsLocaux || [];
    const listeFiltree = liste.filter(p => p.nom.toLowerCase().includes(term));
    // On ne recharge pas tout, on utilise juste l'affichage interne
    // (Mais pour faire simple, on filtre visuellement les cartes)
    document.querySelectorAll('.patient-card').forEach(card => {
        const name = card.querySelector('.p-name').innerText.toLowerCase();
        card.style.display = name.includes(term) ? "block" : "none";
    });
}

// Appelée aussi par global.js si besoin
window.updateStats = function(liste) {
    if(!liste) liste = window.patientsLocaux || [];
    const totalEl = document.getElementById('stat-total');
    const lastEl = document.getElementById('stat-last');
    if(totalEl) totalEl.innerText = liste.length;
    if(lastEl) lastEl.innerText = liste.length > 0 ? liste[liste.length-1].nom : "-";
}

function updateStats(liste) {
     window.updateStats(liste);
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
