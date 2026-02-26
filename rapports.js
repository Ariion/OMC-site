// ==========================================
// RAPPORTS OFFICIELS - OMC LOGIC v3.1
// ==========================================

let currentReportType = 'med';
let customCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    try {
        const today = new Date();
        const elDate  = document.getElementById('in-date-prel');
        const elHeure = document.getElementById('in-heure-prel');

        if (elDate) elDate.valueAsDate = today;

        const h = String(today.getHours()).padStart(2, '0');
        const m = String(today.getMinutes()).padStart(2, '0');
        if (elHeure) elHeure.value = `${h}:${m}`;

        upDate('d-date', today.toISOString().split('T')[0]);
        up('d-heure', `${h}:${m}`);

        switchReport('med');
        initToolbars();
    } catch(e) {
        console.error("Erreur Initialisation", e);
    }
});

// ==========================================
// FORMATAGE TEXTE RICHE (Markdown)
// ==========================================

window.formatMD = function(text) {
    if (!text) return '';
    let html = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    let lines = html.split('\n'), inList = false, out = "";
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i], trimmed = line.trim();
        if (trimmed.startsWith('- ')) {
            if (!inList) { out += '<ul style="margin:5px 0;padding-left:20px;">'; inList = true; }
            out += '<li style="margin-bottom:2px;">' + trimmed.substring(2) + '</li>';
        } else {
            if (inList) { out += '</ul>'; inList = false; }
            out += line + (i < lines.length - 1 ? '<br>' : '');
        }
    }
    if (inList) out += '</ul>';
    return out.replace(/<\/ul><br>/g, '</ul>');
};

window.insertMD = function(id, type) {
    const el = document.getElementById(id);
    if (!el) return;
    const start = el.selectionStart, end = el.selectionEnd;
    const text = el.value, selected = text.substring(start, end);
    let before = text.substring(0, start), after = text.substring(end), newVal = "";
    if (type === 'bold')   newVal = before + '**' + (selected || 'Texte') + '**' + after;
    if (type === 'italic') newVal = before + '*'  + (selected || 'Texte') + '*'  + after;
    if (type === 'list') {
        let listText = selected ? selected.split('\n').map(l => '- ' + l).join('\n') : '- ';
        const isStartOfLine = start === 0 || text.charAt(start - 1) === '\n';
        if (!isStartOfLine && !selected) listText = '\n- ';
        newVal = before + listText + after;
    }
    el.value = newVal;
    el.dispatchEvent(new Event('input'));
    el.focus();
};

window.initToolbars = function() {
    document.querySelectorAll('textarea').forEach(ta => {
        if (ta.previousElementSibling?.classList.contains('md-toolbar')) return;
        const tb = document.createElement('div');
        tb.className = 'md-toolbar';
        tb.innerHTML = `
            <button type="button" onclick="insertMD('${ta.id}','bold')"   title="Gras">B</button>
            <button type="button" onclick="insertMD('${ta.id}','italic')" title="Italique">I</button>
            <button type="button" onclick="insertMD('${ta.id}','list')"   title="Liste">• Liste</button>
        `;
        ta.parentNode.insertBefore(tb, ta);
    });
};

// ==========================================
// FONCTIONS DE MISE À JOUR DOM
// ==========================================

window.up = function(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val || '...';
};

window.upDate = function(id, val) {
    const el = document.getElementById(id);
    if (el && val) {
        const d = new Date(val);
        el.innerText = d.toLocaleDateString('fr-FR', { year:'numeric', month:'long', day:'numeric' });
    } else if (el) {
        el.innerText = '...';
    }
};

window.upBlock = function(textId, wrapId, val) {
    const el   = document.getElementById(textId);
    const wrap = document.getElementById(wrapId);
    if (el)   el.innerHTML = formatMD(val) || '';
    if (wrap) wrap.style.display = (val && val.trim()) ? 'block' : 'none';
};

window.upNom = function() {
    let prenom = document.getElementById('in-prenom')?.value.trim()      || '';
    let nom    = document.getElementById('in-nom-famille')?.value.trim() || '';
    if (prenom) prenom = prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase();
    if (nom)    nom    = nom.toUpperCase();
    const full = [prenom, nom].filter(Boolean).join(' ') || '...';
    const el = document.getElementById('d-nom');
    if (el) el.innerText = full;
};

window.upDoc = function() {
    const docVal   = document.getElementById('in-doc')?.value.trim()   || '';
    const gradeVal = document.getElementById('in-grade')?.value.trim() || '';
    const wrap     = document.getElementById('wrap-doc');
    const dDoc     = document.getElementById('d-doc');
    if (!docVal) {
        if (wrap) wrap.style.display = 'none';
        return;
    }
    const complet = docVal + (gradeVal ? ` — ${gradeVal}` : '') + ` de l'Ocean Medical Center`;
    if (wrap)  wrap.style.display = 'block';
    if (dDoc)  dDoc.innerText     = complet;
};

window.upSig = function(val) {
    const text = (val || '').trim();
    const dSig = document.getElementById('d-sig');
    if (dSig) { dSig.innerText = text; dSig.style.display = text ? 'inline-block' : 'none'; }
};

window.upMedSuivi = function() {
    const concl = document.getElementById('in-med-conclusion')?.value.trim() || '';
    const repos = document.getElementById('in-med-repos')?.value.trim()      || '';
    const prix  = document.getElementById('in-med-prix')?.value.trim()       || '';

    const elConcl = document.getElementById('d-med-conclusion');
    if (elConcl) { elConcl.innerHTML = formatMD(concl); elConcl.style.display = concl ? 'block' : 'none'; }

    const dRepos = document.getElementById('d-med-repos');
    const wRepos = document.getElementById('wrap-med-repos');
    if (dRepos) dRepos.innerText = repos;
    if (wRepos) wRepos.style.display = repos ? 'block' : 'none';

    const dPrix = document.getElementById('d-med-prix');
    const wPrix = document.getElementById('wrap-med-prix');
    if (dPrix) dPrix.innerText = prix;
    if (wPrix) wPrix.style.display = prix ? 'block' : 'none';

    const wSuivi = document.getElementById('wrap-med-suivi');
    if (wSuivi) wSuivi.style.display = (concl || repos || prix) ? 'block' : 'none';
};

window.upAutoHeure = function(val) {
    const el      = document.getElementById('d-auto-heure');
    const infoBox = document.getElementById('d-info-auto');
    if (el)      el.innerText           = val || '...';
    if (infoBox) infoBox.style.display  = val ? 'block' : 'none';
};

window.genererRef = function() {
    try {
        const dateInput  = document.getElementById('in-date-prel')?.value  || '';
        const heureInput = document.getElementById('in-heure-prel')?.value || '';
        let ref = "#...";
        if (dateInput && heureInput) {
            const clean = dateInput.replace(/\D/g, '');
            if (clean.length >= 8) {
                ref = "#" + clean.substring(6,8) + clean.substring(4,6) + heureInput.replace(/\D/g,'');
            }
        }
        const elRef = document.getElementById('d-ref');
        if (elRef) elRef.innerText = ref;

        const nom  = document.getElementById('d-nom')?.innerText || 'Inconnu';
        const data = encodeURIComponent(`OMC-${currentReportType.toUpperCase()}|${nom}|${ref}`);
        const qr   = document.getElementById('qr-ref');
        if (qr) qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
    } catch(e) {
        console.error("Erreur QR Code", e);
    }
};

// ==========================================
// ONGLETS
// ==========================================

window.switchReport = function(type) {
    currentReportType = type;

    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + type)?.classList.add('active');

    document.querySelectorAll('.dynamic-fields').forEach(f => f.style.display = 'none');
    document.getElementById('fields-' + type).style.display = 'block';

    // Le document imprimé n'a pas de sections render séparées —
    // il affiche uniquement le résumé IA + infos patient.
    // Mais on met à jour le titre et les labels.
    const titreDoc = document.getElementById('d-titre-doc');
    const labelDoc = document.getElementById('label-doc');
    const labelNom = document.getElementById('label-nom');
    const infoAuto = document.getElementById('d-info-auto');

    if (type === 'med') {
        if (titreDoc) titreDoc.innerText = "DOSSIER MÉDICAL";
        if (labelDoc) labelDoc.innerText = "Praticien intervenant";
        if (labelNom) labelNom.innerText = "Prénom & Nom du Patient";
        if (infoAuto) infoAuto.style.display = 'none';
    } else if (type === 'psy') {
        if (titreDoc) titreDoc.innerText = "BILAN PSYCHOLOGIQUE";
        if (labelDoc) labelDoc.innerText = "Psychologue / Médecin";
        if (labelNom) labelNom.innerText = "Prénom & Nom du Patient";
        if (infoAuto) infoAuto.style.display = 'none';
    } else if (type === 'auto') {
        if (titreDoc) titreDoc.innerText = "RAPPORT D'AUTOPSIE";
        if (labelDoc) labelDoc.innerText = "Médecin Légiste (Coroner)";
        if (labelNom) labelNom.innerText = "Prénom & Nom du Défunt";
        const heure = document.getElementById('in-auto-heure')?.value;
        if (infoAuto) infoAuto.style.display = heure ? 'block' : 'none';
    }

    // Réinitialise le statut résumé
    const status = document.getElementById('resume-status');
    if (status) { status.textContent = 'Remplissez le formulaire puis générez'; status.className = ''; }

    genererRef();
};

// ==========================================
// SECTIONS CUSTOM
// ==========================================

window.ajouterSectionCustom = function() {
    customCount++;
    const id = customCount;

    document.getElementById('custom-inputs-container').insertAdjacentHTML('beforeend', `
        <div id="custom-block-${id}" class="form-group" style="background:#0f172a;padding:10px;border-radius:6px;margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;border-bottom:1px solid #334155;padding-bottom:5px;">
                <input type="text" id="in-c${id}-titre" placeholder="Titre du bloc..." oninput="upCustom(${id})" style="font-weight:bold;color:#38bdf8;border:none;background:transparent;border-radius:0;padding-left:0;outline:none;width:100%;">
                <button type="button" onclick="supprimerSectionCustom(${id})" style="background:#ef4444;border:none;color:white;border-radius:4px;cursor:pointer;padding:4px 8px;font-size:10px;margin-left:10px;flex-shrink:0;">❌</button>
            </div>
            <textarea id="in-c${id}-text" rows="2" placeholder="Contenu..." oninput="upCustom(${id})" style="border:none;background:#111b2d;color:white;width:100%;resize:vertical;padding:8px;border-radius:4px;outline:none;box-sizing:border-box;"></textarea>
        </div>
    `);
    initToolbars();
};

window.supprimerSectionCustom = function(id) {
    document.getElementById(`custom-block-${id}`)?.remove();
};

window.upCustom = function(id) {
    // Les sections custom ne s'affichent pas dans le document résumé —
    // elles sont incluses dans la génération IA via le formulaire.
    // (Le résumé IA les intégrera si elles sont remplies.)
};