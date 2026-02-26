// ==========================================
// RAPPORTS OFFICIELS - OMC LOGIC v3.1
// Base : code original conservé intégralement
// Ajout : fonctions de sync vers #document-jeu
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

        upDate('d-date',     today.toISOString().split('T')[0]);
        upDate('d-date-jeu', today.toISOString().split('T')[0]);
        up('d-heure',     `${h}:${m}`);
        up('d-heure-jeu', `${h}:${m}`);

        switchReport('med');
        initToolbars();
    } catch(e) {
        console.error("Erreur Initialisation", e);
    }
});

// ==========================================
// FORMATAGE TEXTE RICHE (Markdown) — ORIGINAL
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
            if (!inList) { out += '<ul style="margin: 5px 0; padding-left: 20px;">'; inList = true; }
            out += '<li style="margin-bottom: 2px;">' + trimmed.substring(2) + '</li>';
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
            <button type="button" onclick="insertMD('${ta.id}', 'bold')" title="Gras">B</button>
            <button type="button" onclick="insertMD('${ta.id}', 'italic')" title="Italique">I</button>
            <button type="button" onclick="insertMD('${ta.id}', 'list')" title="Liste">• Liste</button>
        `;
        ta.parentNode.insertBefore(tb, ta);
    });
};

// ==========================================
// FONCTIONS DE MISE À JOUR — ORIGINALES
// ==========================================

window.up = function(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val || '...';
};

window.upDate = function(id, val) {
    const el = document.getElementById(id);
    if (el && val) {
        const d = new Date(val);
        el.innerText = d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    } else if (el) {
        el.innerText = '...';
    }
};

window.upBlock = function(textId, wrapId, val) {
    const el   = document.getElementById(textId);
    const wrap = document.getElementById(wrapId);
    if (el)   el.innerHTML = formatMD(val) || '';
    if (wrap) wrap.style.display = (val && val.trim() !== '') ? 'block' : 'none';
    // Mise à jour de la conclusion résumé en jeu
    _syncJeuConcl();
};

window.upNom = function() {
    let prenom = document.getElementById('in-prenom').value.trim();
    let nom    = document.getElementById('in-nom-famille').value.trim();
    if (prenom.length > 0) prenom = prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase();
    if (nom.length > 0)    nom    = nom.toUpperCase();
    const full = [prenom, nom].filter(Boolean).join(' ') || '...';

    // Document complet
    document.getElementById('d-nom').innerText = full;
    // Résumé en jeu
    const jelNom = document.getElementById('d-nom-jeu');
    if (jelNom) jelNom.innerText = full;
};

window.upDoc = function() {
    const elDoc   = document.getElementById('in-doc');
    const elGrade = document.getElementById('in-grade');
    const wrapDoc = document.getElementById('wrap-doc');
    const dDoc    = document.getElementById('d-doc');
    // Résumé en jeu
    const wrapDocJeu = document.getElementById('wrap-doc-jeu');
    const dDocJeu    = document.getElementById('d-doc-jeu');

    let docVal   = elDoc   ? elDoc.value.trim()   : '';
    let gradeVal = elGrade ? elGrade.value.trim()  : '';

    if (docVal === '') {
        if (wrapDoc)    wrapDoc.style.display    = 'none';
        if (wrapDocJeu) wrapDocJeu.style.display = 'none';
    } else {
        let complet = docVal + (gradeVal ? ` — ${gradeVal}` : '') + ` de l'Ocean Medical Center`;
        if (wrapDoc)    { wrapDoc.style.display    = 'block'; dDoc.innerText    = complet; }
        if (wrapDocJeu) { wrapDocJeu.style.display = 'block'; dDocJeu.innerText = complet; }
    }
};

window.upSig = function(val) {
    const text = (val || '').trim();
    // Document complet
    const dSig = document.getElementById('d-sig');
    if (dSig) { dSig.innerText = text; dSig.style.display = text ? 'inline-block' : 'none'; }
    // Résumé en jeu
    const dSigJeu = document.getElementById('d-sig-jeu');
    if (dSigJeu) { dSigJeu.innerText = text; dSigJeu.style.display = text ? 'inline-block' : 'none'; }
};

window.upMedSuivi = function() {
    const concl = document.getElementById('in-med-conclusion').value.trim();
    const repos = document.getElementById('in-med-repos').value.trim();
    const prix  = document.getElementById('in-med-prix').value.trim();

    // Document complet — identique à l'original
    const elConcl = document.getElementById('d-med-conclusion');
    if (elConcl) { elConcl.innerHTML = formatMD(concl); elConcl.style.display = concl ? 'block' : 'none'; }
    document.getElementById('d-med-repos').innerText = repos;
    document.getElementById('wrap-med-repos').style.display = repos ? 'block' : 'none';
    document.getElementById('d-med-prix').innerText = prix;
    document.getElementById('wrap-med-prix').style.display = prix ? 'block' : 'none';
    document.getElementById('wrap-med-suivi').style.display = (concl || repos || prix) ? 'block' : 'none';

    // Résumé en jeu
    const reposEl = document.getElementById('d-jeu-repos');
    const prixEl  = document.getElementById('d-jeu-prix');
    const reposBox = document.getElementById('jeu-repos-box');
    const prixBox  = document.getElementById('jeu-prix-box');
    if (reposEl)  reposEl.innerText = repos;
    if (prixEl)   prixEl.innerText  = prix ? prix + ' $' : '';
    if (reposBox) reposBox.style.display = repos ? 'flex' : 'none';
    if (prixBox)  prixBox.style.display  = prix  ? 'flex' : 'none';

    _syncJeuConcl();
};

window.genererRef = function() {
    try {
        const dateInput  = document.getElementById('in-date-prel').value;
        const heureInput = document.getElementById('in-heure-prel').value;
        let ref = "#...";
        if (dateInput && heureInput) {
            const clean = dateInput.replace(/\D/g, '');
            if (clean.length >= 8) {
                ref = "#" + clean.substring(6,8) + clean.substring(4,6) + heureInput.replace(/\D/g,'');
            }
        }
        // Document complet
        const elRef = document.getElementById('d-ref');
        if (elRef) elRef.innerText = ref;
        // Résumé en jeu
        const elRefJeu = document.getElementById('d-ref-jeu');
        if (elRefJeu) elRefJeu.innerText = ref;

        const nom  = document.getElementById('d-nom')?.innerText || 'Inconnu';
        const data = encodeURIComponent(`OMC-${currentReportType.toUpperCase()}|${nom}|${ref}`);
        const src  = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
        const qr1  = document.getElementById('qr-ref');
        const qr2  = document.getElementById('qr-ref-jeu');
        if (qr1) qr1.src = src;
        if (qr2) qr2.src = src;
    } catch(e) {
        console.error("Erreur QR Code", e);
    }
};

// ── Heure décès autopsie ──────────────────────────────────
window.upAutoHeure = function(val) {
    // Document complet
    const el      = document.getElementById('d-auto-heure');
    const infoBox = document.getElementById('d-info-auto');
    if (el)      el.innerText       = val || '...';
    if (infoBox) infoBox.style.display = val ? 'block' : 'none';
    // Résumé en jeu
    const elJeu  = document.getElementById('d-auto-heure-jeu');
    const box    = document.getElementById('jeu-heure-box');
    if (elJeu) elJeu.innerText      = val || '...';
    if (box)   box.style.display    = val ? 'flex' : 'none';
    _syncJeuConcl();
};

// ── Sujet ────────────────────────────────────────────────
window.upSujetBoth = function(val) {
    up('d-sujet', val);
    const jeuEl  = document.getElementById('d-sujet-jeu');
    const jeuBox = document.getElementById('jeu-sujet-box');
    if (jeuEl)  jeuEl.innerText     = val || '...';
    if (jeuBox) jeuBox.style.display = val.trim() ? 'flex' : 'none';
};

// ── Sexe ─────────────────────────────────────────────────
window.upSexeBoth = function(val) {
    up('d-sexe',     val);
    up('d-sexe-jeu', val);
};

// ==========================================
// SYNC RÉSUMÉ EN JEU — conclusion auto
// Prend le dernier champ de conclusion rempli
// selon le type de rapport courant
// ==========================================
function _syncJeuConcl() {
    let concl = '';
    let label = 'Conclusion';

    if (currentReportType === 'med') {
        concl = document.getElementById('in-med-conclusion')?.value.trim() || '';
        if (!concl) {
            // Fallback : bilan clinique tronqué
            const bilan = document.getElementById('in-med-bilan')?.value.trim() || '';
            concl = bilan.substring(0, 220) + (bilan.length > 220 ? '…' : '');
            label = 'Bilan clinique (résumé)';
        } else {
            label = 'Conclusion médicale';
        }
    } else if (currentReportType === 'psy') {
        concl = document.getElementById('in-psy-reco')?.value.trim() || '';
        if (!concl) {
            const diag = document.getElementById('in-psy-diag')?.value.trim() || '';
            concl = diag.substring(0, 220) + (diag.length > 220 ? '…' : '');
            label = 'Diagnostic (résumé)';
        } else {
            label = 'Recommandations';
        }
    } else if (currentReportType === 'auto') {
        concl = document.getElementById('in-auto-cause')?.value.trim() || '';
        if (!concl) {
            const ext = document.getElementById('in-auto-ext')?.value.trim() || '';
            concl = ext.substring(0, 220) + (ext.length > 220 ? '…' : '');
            label = 'Examen externe (résumé)';
        } else {
            label = 'Conclusion médico-légale';
        }
    }

    const el    = document.getElementById('d-jeu-concl');
    const box   = document.getElementById('jeu-concl-box');
    const lbl   = document.getElementById('jeu-concl-label');

    if (el)   el.innerHTML         = formatMD(concl);
    if (box)  box.style.display    = concl ? 'flex' : 'none';
    if (lbl)  lbl.innerText        = label;
}

// ==========================================
// ONGLETS — ORIGINAL + sync résumé
// ==========================================

window.switchReport = function(type) {
    currentReportType = type;

    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + type).classList.add('active');

    document.querySelectorAll('.dynamic-fields').forEach(f => f.style.display = 'none');
    document.getElementById('fields-' + type).style.display = 'block';

    document.querySelectorAll('.render-section').forEach(s => s.style.display = 'none');
    document.getElementById('render-' + type).style.display = 'block';

    const titreDoc = document.getElementById('d-titre-doc');
    const titreJeu = document.getElementById('d-titre-jeu');
    const labelDoc = document.getElementById('label-doc');
    const labelNom = document.getElementById('label-nom');

    if (type === 'med') {
        if (titreDoc) titreDoc.innerText = "DOSSIER MÉDICAL";
        if (titreJeu) titreJeu.innerText = "DOSSIER MÉDICAL";
        if (labelDoc) labelDoc.innerText = "Praticien intervenant";
        if (labelNom) labelNom.innerText = "Prénom & Nom du Patient";
        const infoAuto = document.getElementById('d-info-auto');
        if (infoAuto) infoAuto.style.display = 'none';
        const heureBox = document.getElementById('jeu-heure-box');
        if (heureBox) heureBox.style.display = 'none';
    } else if (type === 'psy') {
        if (titreDoc) titreDoc.innerText = "BILAN PSYCHOLOGIQUE";
        if (titreJeu) titreJeu.innerText = "BILAN PSYCHOLOGIQUE";
        if (labelDoc) labelDoc.innerText = "Psychologue / Médecin";
        if (labelNom) labelNom.innerText = "Prénom & Nom du Patient";
        const infoAuto = document.getElementById('d-info-auto');
        if (infoAuto) infoAuto.style.display = 'none';
        const heureBox = document.getElementById('jeu-heure-box');
        if (heureBox) heureBox.style.display = 'none';
    } else if (type === 'auto') {
        if (titreDoc) titreDoc.innerText = "RAPPORT D'AUTOPSIE";
        if (titreJeu) titreJeu.innerText = "RAPPORT D'AUTOPSIE";
        if (labelDoc) labelDoc.innerText = "Médecin Légiste (Coroner)";
        if (labelNom) labelNom.innerText = "Prénom & Nom du Défunt";
        const heure = document.getElementById('in-auto-heure')?.value;
        if (heure) {
            const infoAuto = document.getElementById('d-info-auto');
            if (infoAuto) infoAuto.style.display = 'block';
            const heureBox = document.getElementById('jeu-heure-box');
            if (heureBox) heureBox.style.display = 'flex';
        }
    }

    genererRef();
    _syncJeuConcl();
};

// ==========================================
// SECTIONS CUSTOM — ORIGINAL (inchangé)
// ==========================================

window.ajouterSectionCustom = function() {
    customCount++;
    const id = customCount;

    const containerIn = document.getElementById('custom-inputs-container');
    containerIn.insertAdjacentHTML('beforeend', `
        <div id="custom-block-${id}" class="form-group" style="background: #0f172a; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; border-bottom: 1px solid #334155; padding-bottom: 5px;">
                <input type="text" id="in-c${id}-titre" placeholder="Titre du bloc..." oninput="upCustom(${id})" style="font-weight: bold; color: #38bdf8; border: none; background: transparent; border-radius: 0; padding-left: 0; outline: none; width: 100%;">
                <button type="button" onclick="supprimerSectionCustom(${id})" style="background: #ef4444; border: none; color: white; border-radius: 4px; cursor: pointer; padding: 4px 8px; font-size: 10px; margin-left: 10px; flex-shrink: 0;">❌</button>
            </div>
            <textarea id="in-c${id}-text" rows="2" placeholder="Contenu du bloc..." oninput="upCustom(${id})" style="border: none; background: #111b2d; color: white; width: 100%; resize: vertical; padding: 8px; border-radius: 4px; outline: none; box-sizing: border-box;"></textarea>
        </div>
    `);

    // Sections custom → document complet seulement
    document.getElementById('render-custom').insertAdjacentHTML('beforeend', `
        <div id="wrap-c${id}" style="display: none; margin-top: 25px;">
            <h4 id="d-c${id}-titre" class="doc-h4"></h4>
            <p  id="d-c${id}-text"  class="doc-p"></p>
        </div>
    `);

    initToolbars();
};

window.supprimerSectionCustom = function(id) {
    document.getElementById(`custom-block-${id}`)?.remove();
    document.getElementById(`wrap-c${id}`)?.remove();
};

window.upCustom = function(id) {
    const titre = document.getElementById(`in-c${id}-titre`).value.trim();
    const texte = document.getElementById(`in-c${id}-text`).value.trim();
    const wrap  = document.getElementById(`wrap-c${id}`);
    document.getElementById(`d-c${id}-titre`).innerText = titre || 'SECTION SUPPLÉMENTAIRE';
    document.getElementById(`d-c${id}-text`).innerHTML  = formatMD(texte);
    wrap.style.display = texte ? 'block' : 'none';
};