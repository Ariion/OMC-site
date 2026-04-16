/* ============================================================
   DOSSIERS.JS — VERSION CORRIGÉE
   ============================================================ */

console.log("✅ Dossiers.js chargé !");

const RESERVED_IDS = ['ETAT_DES_CHAMBRES_COMPLET']; 

// --- 1. FONCTION DE CHARGEMENT PRINCIPALE ---
window.chargerPatients = function() {
    const tous = window.getPatientsDB ? window.getPatientsDB() : [];

    // Filtrer les documents réservés (chambres, etc.) et les entrées sans nom
    const liste = tous.filter(p => 
        p && 
        p.nom && 
        typeof p.nom === 'string' && 
        p.nom.trim() !== '' &&
        !RESERVED_IDS.includes(p.id)
    );

    window.patientsLocaux = liste;

    const grid = document.getElementById('patients-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (!grid) return;
    grid.innerHTML = "";

    if (!liste || liste.length === 0) {
        if (emptyState) emptyState.style.display = "block";
        updateStats([]);
        return;
    }
    
    if (emptyState) emptyState.style.display = "none";

    // Tri par nom (sécurisé)
    [...liste]
        .sort((a, b) => (a.nom || '').localeCompare(b.nom || ''))
        .forEach(p => {
            const card = document.createElement('div');
            card.className = 'patient-card';

            const initiales = p.nom
                ? p.nom.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                : "?";
            const nbDocs = (p.historique || []).length;

            card.innerHTML = `
                <div class="p-tag">${p.groupe || '?'}</div>
                <div class="p-avatar">${initiales}</div>
                <div class="p-name">${p.nom}</div>
                <div class="p-info">📅 ${formatDate(p.naissance)}</div>
                <div class="p-info">💼 ${p.job || 'Civil'}</div>
                ${nbDocs > 0 ? `<div class="p-info" style="color:#64ffda;font-size:10px;margin-top:5px;">📄 ${nbDocs} document(s)</div>` : ''}
            `;
            card.onclick = () => window.ouvrirPanelEdition(p);
            grid.appendChild(card);
        });

    updateStats(liste);
};

// --- 2. DÉCLENCHEUR DE SECOURS ---
// Si Firebase répond avant que window.chargerPatients soit défini,
// global.js ne peut pas l'appeler. On force un rappel au chargement.
document.addEventListener('DOMContentLoaded', () => {
    // Tentative immédiate
    if (window.getPatientsDB && window.getPatientsDB().length > 0) {
        window.chargerPatients();
        return;
    }
    // Fallback : réessayer toutes les 500ms pendant 10 secondes max
    let attempts = 0;
    const interval = setInterval(() => {
        attempts++;
        const liste = window.getPatientsDB ? window.getPatientsDB() : [];
        if (liste.length > 0) {
            clearInterval(interval);
            window.chargerPatients();
        } else if (attempts >= 20) {
            // Après 10s, afficher quand même (peut-être vraiment vide)
            clearInterval(interval);
            window.chargerPatients();
        }
    }, 500);
});

/* ============================================================
   GESTION DES PANNEAUX & HISTORIQUE
   ============================================================ */

window.ouvrirPanelEdition = function(p) {
    document.getElementById('sidebar-stats').style.display = 'none';
    document.getElementById('panel-creation').style.display = 'none';
    document.getElementById('panel-edition').style.display = 'block';

    document.getElementById('edit-original-name').value = p.id || p.nom;
    document.getElementById('edit-nom').value = p.nom;
    document.getElementById('edit-ddn').value = p.naissance || '';
    document.getElementById('edit-groupe').value = p.groupe || 'En attente';
    document.getElementById('edit-job').value = p.job || '';
    document.getElementById('edit-notes').value = p.notes || "";

    _afficherHistorique(p);
};

function _afficherHistorique(p) {
    const histDiv = document.getElementById('edit-historique');
    if (!histDiv) return;
    histDiv.innerHTML = "";

    if (!p.historique || p.historique.length === 0) {
        histDiv.innerHTML = '<div style="color:#475569;font-size:10px;padding:5px;">Aucun document archivé.</div>';
        return;
    }

    p.historique.forEach((h, index) => {
        const dateH = h.date ? new Date(h.date).toLocaleDateString('fr-FR') : '??/??';
        const hData = JSON.stringify(h).replace(/"/g, '&quot;');

        histDiv.innerHTML += `
            <div style="font-size:11px; margin-bottom:10px; border-left:2px solid #3b82f6; padding-left:8px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color:white;">${h.type}</strong>
                    <div style="display:flex; gap:5px;">
                        <button onclick="window.voirDocument('${hData}')" style="background:#3b82f6; border:none; color:white; border-radius:3px; padding:2px 5px; cursor:pointer;">👁️</button>
                        <button onclick="window.ouvrirPourModifier('${h.pageSource}', '${p.nom}')" style="background:#f59e0b; border:none; border-radius:3px; padding:2px 5px; cursor:pointer;">✏️</button>
                        <button onclick="window.supprimerLigneHist('${p.id || p.nom}', ${index})" style="background:none; border:none; color:#ef4444; cursor:pointer;">✖</button>
                    </div>
                </div>
                <div style="color:#94a3b8; font-size:9px;">${dateH}</div>
            </div>`;
    });
}

/* ============================================================
   ACTIONS (CREER, MODIFIER, SUPPRIMER)
   ============================================================ */

window.creerPatient = async function() {
    const nom = document.getElementById('new-nom').value.trim();
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

    const success = await window.savePatientToDB(newP);
    if (success) {
        document.getElementById('new-nom').value = "";
        document.getElementById('new-ddn').value = "";
        document.getElementById('new-notes').value = "";
        alert("✅ Patient créé !");
    }
};

window.sauvegarderEdition = async function() {
    const id = document.getElementById('edit-original-name').value;
    const originalP = window.patientsLocaux.find(p => (p.id === id || p.nom === id));
    
    if (!originalP) return alert("Erreur : Patient introuvable");

    const updatedP = {
        ...originalP,
        nom: document.getElementById('edit-nom').value,
        naissance: document.getElementById('edit-ddn').value,
        groupe: document.getElementById('edit-groupe').value,
        job: document.getElementById('edit-job').value,
        notes: document.getElementById('edit-notes').value
    };

    await window.savePatientToDB(updatedP);
    window.fermerTout();
    alert("✅ Dossier mis à jour !");
};

window.supprimerPatient = async function() {
    const id = document.getElementById('edit-original-name').value;
    if (!confirm("Supprimer définitivement ce dossier ?")) return;
    const p = window.patientsLocaux.find(p => (p.id === id || p.nom === id));
    if (!p || !p.id) return alert("Patient introuvable");
    if (window.deletePatientFromDB) {
        await window.deletePatientFromDB(p.id);
    }
    window.fermerTout();
};

window.fermerTout = function() {
    document.getElementById('panel-edition').style.display = 'none';
    document.getElementById('sidebar-stats').style.display = 'block';
    document.getElementById('panel-creation').style.display = 'block';
};

/* ============================================================
   VISUALISEUR & NAVIGATION
   ============================================================ */

window.voirDocument = function(hData) {
    const h = typeof hData === 'string' ? JSON.parse(hData.replace(/&quot;/g, '"')) : hData;
    
    const modal = document.getElementById('modal-document');
    const img = document.getElementById('doc-viewer-img');
    
    if (modal && img) {
        img.src = h.url || '';
        document.getElementById('doc-viewer-type').innerText = h.type || 'Document';
        document.getElementById('doc-viewer-date').innerText = h.date ? new Date(h.date).toLocaleDateString('fr-FR') : '—';
        document.getElementById('doc-viewer-details').innerText = h.details || '—';
        document.getElementById('doc-viewer-url').value = h.url || '';

        const btnMod = document.getElementById('doc-viewer-modifier-popup'); 
        if (btnMod) {
            if (h.pageSource) {
                btnMod.style.display = 'block';
                btnMod.onclick = () => window.ouvrirPourModifier(h);
            } else {
                btnMod.style.display = 'none';
            }
        }
        modal.style.display = 'flex';
    }
};

window.fermerVisualiseur = function() {
    const modal = document.getElementById('modal-document');
    if (modal) modal.style.display = 'none';
};

window.copierLienDoc = function() {
    const url = document.getElementById('doc-viewer-url').value;
    if (url) navigator.clipboard.writeText(url).then(() => alert("Lien copié !"));
};

window.ouvrirPourModifier = function(h) {
    if (!h.pageSource) return alert("Source inconnue");
    if (h.formData) {
        localStorage.setItem('edit_snapshot', JSON.stringify(h.formData));
    }
    const nomPatient = document.getElementById('edit-nom')?.value || h.nomPatient || '';
    window.open(`${h.pageSource}?mode=edit&patient=${encodeURIComponent(nomPatient)}`, '_blank');
};

window.filtrerPatients = function() {
    const term = document.getElementById('search-input').value.toLowerCase();
    document.querySelectorAll('.patient-card').forEach(card => {
        const name = card.querySelector('.p-name').innerText.toLowerCase();
        card.style.display = name.includes(term) ? "block" : "none";
    });
};

function updateStats(liste) {
    const totalEl = document.getElementById('stat-total');
    if (totalEl) totalEl.innerText = liste.length;

    // Dernier ajout
    const lastEl = document.getElementById('stat-last');
    if (lastEl && liste.length > 0) {
        const sorted = [...liste].sort((a, b) => 
            new Date(b.dateCreation || 0) - new Date(a.dateCreation || 0)
        );
        lastEl.innerText = sorted[0]?.nom || '-';
    }
}

function formatDate(s) {
    return s ? new Date(s).toLocaleDateString('fr-FR') : "??/??/????";
}