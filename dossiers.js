/* ============================================================
   DOSSIERS.JS — VERSION ENRICHIE
   Visualiseur de rapports : voir, copier URL, renvoyer Discord, modifier
   ============================================================ */

console.log("✅ Dossiers.js chargé !");

/* ============================================================
   CHARGEMENT & GRILLE
   ============================================================ */

window.chargerPatients = function() {
    const liste = window.getPatientsDB ? window.getPatientsDB() : [];
    window.patientsLocaux = liste;

    const grid = document.getElementById('patients-grid');
    const emptyState = document.getElementById('empty-state');
    if (!grid) return;
    grid.innerHTML = "";

    if (!liste || liste.length === 0) {
        if (emptyState) emptyState.style.display = "block";
        return;
    }
    if (emptyState) emptyState.style.display = "none";

    [...liste].reverse().forEach(p => {
        const card = document.createElement('div');
        card.className = 'patient-card';

        const initiales = p.nom
            ? p.nom.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
            : "?";
        const hasNotes = p.notes && p.notes.trim().length > 0;
        const nbDocs = (p.historique || []).filter(h => h.url).length;

        card.innerHTML = `
            <div class="p-tag">${p.groupe || '?'}</div>
            <div class="p-avatar">${initiales}</div>
            <div class="p-name">${p.nom}</div>
            <div class="p-info">📅 ${formatDate(p.naissance)}</div>
            <div class="p-info">💼 ${p.job || 'Civil'}</div>
            ${nbDocs > 0 ? `<div class="p-info" style="color:#64ffda;font-size:10px;margin-top:5px;">📄 ${nbDocs} document${nbDocs > 1 ? 's' : ''} archivé${nbDocs > 1 ? 's' : ''}</div>` : ''}
            ${hasNotes ? '<div class="p-info" style="color:#fbbf24;font-size:10px;margin-top:2px;">⚠️ Notes présentes</div>' : ''}
        `;
        card.onclick = () => window.ouvrirPanelEdition(p);
        grid.appendChild(card);
    });

    updateStats(liste);
}

/* ============================================================
   GESTION DES PANNEAUX
   ============================================================ */

window.fermerTout = function() {
    document.getElementById('panel-edition').style.display = 'none';
    document.getElementById('sidebar-stats').style.display = 'block';
    document.getElementById('panel-creation').style.display = 'block';
}

window.ouvrirPanelEdition = function(p) {
    document.getElementById('sidebar-stats').style.display = 'none';
    document.getElementById('panel-creation').style.display = 'none';
    document.getElementById('panel-edition').style.display = 'block';

    document.getElementById('edit-original-name').value = p.id || p.nom;
    document.getElementById('edit-nom').value = p.nom;
    document.getElementById('edit-ddn').value = p.naissance;
    document.getElementById('edit-groupe').value = p.groupe;
    document.getElementById('edit-job').value = p.job;
    document.getElementById('edit-notes').value = p.notes || "";

    // Affichage de l'historique enrichi
    _afficherHistorique(p);
    document.querySelector('.sidebar').scrollTop = 0;
}

/* ── Affichage de l'historique avec tous les boutons ── */
function _afficherHistorique(p) {
    const histDiv = document.getElementById('edit-historique');
    if (!histDiv) return;
    histDiv.innerHTML = "";

    if (!p.historique || p.historique.length === 0) {
        histDiv.innerHTML = '<div style="color:#475569;font-size:10px;padding:5px;">Aucun document archivé.</div>';
        return;
    }

    p.historique.forEach((h, index) => {
        const dateH = new Date(h.date).toLocaleDateString('fr-FR');
        const heureH = new Date(h.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

        // Boutons dynamiques selon ce qui est disponible
        const btnVoir = h.url
            ? `<button onclick="voirDocument(${JSON.stringify(h)})" title="Voir le document" style="background:#3b82f6;border:none;color:white;cursor:pointer;font-size:10px;border-radius:3px;padding:3px 7px;">👁️</button>`
            : '';

        const btnCopier = h.url
            ? `<button onclick="copierUrlDoc('${h.url}')" title="Copier l'URL" style="background:#1e293b;border:1px solid #334155;color:#94a3b8;cursor:pointer;font-size:10px;border-radius:3px;padding:3px 7px;">📋</button>`
            : '';

        const btnDiscord = h.url
            ? `<button onclick="renvoyerDiscord(${JSON.stringify(h)}, '${p.nom}')" title="Renvoyer sur Discord" style="background:#5865F2;border:none;color:white;cursor:pointer;font-size:10px;border-radius:3px;padding:3px 7px;">📤</button>`
            : '';

        const btnModifier = h.pageSource
            ? `<button onclick="ouvrirPourModifier('${h.pageSource}', '${p.nom}')" title="Modifier ce document" style="background:#f59e0b;border:none;color:#000;cursor:pointer;font-size:10px;border-radius:3px;padding:3px 7px;font-weight:bold;">✏️</button>`
            : '';

        const btnSuppr = `<button onclick="supprimerLigneHist('${p.id || p.nom}', ${index})" title="Supprimer" style="color:#ef4444;border:none;background:none;cursor:pointer;font-size:12px;padding:2px 4px;">✖</button>`;

        histDiv.innerHTML += `
            <div style="font-size:10px;margin-bottom:10px;border-left:2px solid #3b82f6;padding-left:8px;padding-top:3px;padding-bottom:3px;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:4px;flex-wrap:wrap;">
                    <div style="flex:1;min-width:0;">
                        <span style="color:#cbd5e1;">${dateH} ${heureH}</span>
                        <strong style="color:white;display:block;margin-top:1px;">${h.type}</strong>
                        <span style="color:#94a3b8;font-style:italic;font-size:9px;">${(h.details || '').substring(0, 80)}</span>
                    </div>
                    <div style="display:flex;gap:3px;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end;">
                        ${btnVoir}${btnCopier}${btnDiscord}${btnModifier}${btnSuppr}
                    </div>
                </div>
                ${h.url ? `<div style="margin-top:4px;font-size:8px;color:#475569;word-break:break-all;background:#0a1324;padding:3px 5px;border-radius:3px;">${h.url.substring(0, 60)}...</div>` : ''}
            </div>`;
    });
}

/* ============================================================
   ACTIONS CRUD
   ============================================================ */

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

    if (window.savePatientToDB) {
        await window.savePatientToDB(newP);
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
    const originalP = window.patientsLocaux
        ? window.patientsLocaux.find(p => p.id === id || p.nom === id)
        : null;
    if (!originalP) return alert("Erreur : Patient introuvable");

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

    if (window.savePatientToDB) {
        await window.savePatientToDB(updatedP);
        window.fermerTout();
        alert("✅ Dossier mis à jour !");
    }
}

window.supprimerPatient = async function() {
    const id = document.getElementById('edit-original-name').value;
    if (confirm("⛔ Supprimer définitivement ce dossier ?")) {
        if (window.deletePatientFromDB) {
            await window.deletePatientFromDB(id);
            window.fermerTout();
        }
    }
}

window.supprimerLigneHist = async function(patientId, index) {
    if (!confirm("Supprimer cette ligne d'historique ?")) return;
    const p = window.patientsLocaux
        ? window.patientsLocaux.find(pat => pat.id === patientId || pat.nom === patientId)
        : null;
    if (p) {
        p.historique.splice(index, 1);
        await window.savePatientToDB(p);
        window.ouvrirPanelEdition(p);
    }
}

/* ============================================================
   VISUALISEUR DE DOCUMENTS
   ============================================================ */

// Ouvre la modale avec toutes les infos du document
window.voirDocument = function(h) {
    if (typeof h === 'string') h = JSON.parse(h);
    const modal = document.getElementById('modal-document');
    if (!modal) return;

    document.getElementById('doc-viewer-img').src = h.url || '';
    document.getElementById('doc-viewer-url').value = h.url || '';
    document.getElementById('doc-viewer-type').innerText = h.type || '—';
    document.getElementById('doc-viewer-date').innerText = h.date
        ? new Date(h.date).toLocaleDateString('fr-FR') + ' à ' + new Date(h.date).toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})
        : '—';
    document.getElementById('doc-viewer-details').innerText = h.details || '—';

    // Bouton Modifier
    const btnMod = document.getElementById('doc-viewer-modifier');
    if (btnMod) {
        if (h.pageSource) {
            btnMod.style.display = 'block';
            // On stocke dans un attribut data pour l'action onclick
            btnMod.setAttribute('data-page', h.pageSource);
            btnMod.setAttribute('data-nom', document.getElementById('doc-viewer-type').closest('[data-nom]')?.dataset.nom || '');
        } else {
            btnMod.style.display = 'none';
        }
    }

    // Bouton Discord
    const btnDis = document.getElementById('doc-viewer-discord');
    if (btnDis) {
        btnDis.setAttribute('data-h', JSON.stringify(h));
    }

    modal.style.display = 'flex';
}

window.fermerVisualiseur = function() {
    const modal = document.getElementById('modal-document');
    if (modal) modal.style.display = 'none';
}

// Copie l'URL dans le presse-papiers
window.copierLienDoc = function() {
    const input = document.getElementById('doc-viewer-url');
    if (!input) return;
    navigator.clipboard.writeText(input.value)
        .then(() => alert("✅ Lien copié dans le presse-papiers !"))
        .catch(() => {
            input.select();
            document.execCommand("copy");
            alert("✅ Lien copié !");
        });
}

window.copierUrlDoc = function(url) {
    navigator.clipboard.writeText(url)
        .then(() => alert("✅ Lien copié !"))
        .catch(() => alert("Impossible de copier automatiquement. URL : " + url));
}

/* ── Renvoyer un document archivé sur Discord ── */
window.renvoyerDiscord = async function(h, nomPatient) {
    if (typeof h === 'string') h = JSON.parse(h);
    if (!h.url) return alert("Aucune URL disponible pour ce document.");

    const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1421780761731928194/ZFSpiLTHfytIGT02QBf5SBOIEDzWMaf_PMHtDB9sd-GmF5chHnQqQic-9YpLnYHJIRPo";

    const dateDoc = h.date ? new Date(h.date).toLocaleDateString('fr-FR') : '??/??/????';

    try {
        const response = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: "Intranet OMC",
                content: `📂 **DOCUMENT RE-PARTAGÉ**\n━━━━━━━━━━━━━━━━━━━━\n👤 **Patient :** ${nomPatient || 'Inconnu'}\n📄 **Type :** ${h.type || '—'}\n📅 **Créé le :** ${dateDoc}\n🔗 **Lien :** ${h.url}\n━━━━━━━━━━━━━━━━━━━━`
            })
        });
        if (response.ok) {
            alert("✅ Document renvoyé sur l'intranet Discord !");
        } else {
            throw new Error("Code " + response.status);
        }
    } catch(e) {
        // Fallback : partage l'URL via embed si l'envoi JSON plante
        alert("⚠️ Envoi direct échoué. Voici le lien à copier manuellement :\n\n" + h.url);
    }
}

/* ── Ouvrir une page de formulaire avec le patient pré-rempli ── */
window.ouvrirPourModifier = function(pageSource, nomPatient) {
    if (!pageSource) return alert("Source du document inconnue.");
    // On passe le nom en paramètre URL pour que la page puisse pré-remplir
    const url = `${pageSource}?patient=${encodeURIComponent(nomPatient)}`;
    window.open(url, '_blank');
}

/* ── Action depuis la modale (bouton Modifier dans la modale) ── */
window.modifierDepuisModal = function() {
    const btn = document.getElementById('doc-viewer-modifier');
    if (!btn) return;
    const page = btn.getAttribute('data-page');
    const nomEl = document.getElementById('doc-viewer-type'); // On cherche dans le contexte

    // Récupère le nom du patient depuis le panneau d'édition ouvert
    const nomPatient = document.getElementById('edit-nom')?.value || '';
    if (page) window.ouvrirPourModifier(page, nomPatient);
}

/* ── Action Discord depuis la modale ── */
window.renvoyerDiscordDepuisModal = function() {
    const btn = document.getElementById('doc-viewer-discord');
    if (!btn) return;
    const h = JSON.parse(btn.getAttribute('data-h') || '{}');
    const nomPatient = document.getElementById('edit-nom')?.value || 'Inconnu';
    window.renvoyerDiscord(h, nomPatient);
}

/* ============================================================
   RECHERCHE & UTILITAIRES
   ============================================================ */

window.filtrerPatients = function() {
    const term = document.getElementById('search-input').value.toLowerCase();
    document.querySelectorAll('.patient-card').forEach(card => {
        const name = card.querySelector('.p-name').innerText.toLowerCase();
        card.style.display = name.includes(term) ? "block" : "none";
    });
}

window.updateStats = function(liste) {
    if (!liste) liste = window.patientsLocaux || [];
    const totalEl = document.getElementById('stat-total');
    const lastEl = document.getElementById('stat-last');
    if (totalEl) totalEl.innerText = liste.length;
    if (lastEl) lastEl.innerText = liste.length > 0 ? liste[liste.length - 1].nom : "-";
}

function updateStats(liste) { window.updateStats(liste); }

function formatDate(s) {
    return s ? new Date(s).toLocaleDateString('fr-FR') : "??/??/????";
}

/* ============================================================
   EXPORT / IMPORT
   ============================================================ */

window.exporterDonnees = function() {
    const dataStr = JSON.stringify(window.patientsLocaux || [], null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OMC_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

window.importerDonnees = function(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const json = JSON.parse(e.target.result);
            if (Array.isArray(json)) {
                alert("L'import massif vers Firebase n'est pas activé pour éviter les doublons.");
            } else {
                alert("❌ Fichier invalide.");
            }
        } catch(err) {
            alert("❌ Erreur lecture fichier.");
        }
    };
    reader.readAsText(file);
    input.value = '';
}
