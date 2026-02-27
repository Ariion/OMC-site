// ==========================================
// RAPPORTS OFFICIELS - OMC v4.0
// Synchronisation complète : résumé + complet
// ==========================================

let currentReportType = 'med';
window.currentReportType = 'med';
let customCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    try {
        const today = new Date();
        const elDate  = document.getElementById('in-date-prel');
        const elHeure = document.getElementById('in-heure-prel');
        if (elDate)  elDate.valueAsDate = today;
        const h = String(today.getHours()).padStart(2,'0');
        const m = String(today.getMinutes()).padStart(2,'0');
        if (elHeure) elHeure.value = `${h}:${m}`;

        // Init les deux docs avec la date du jour
        const iso = today.toISOString().split('T')[0];
        _upBoth('d-date', 'd-date-r',   _formatDate(iso));
        _upBoth('d-heure', 'd-heure-r', `${h}:${m}`);

        // Init sexe
        _upBoth('d-sexe', 'd-sexe-r', 'Homme');

        switchReport('med');
        initToolbars();
    } catch(e) { console.error('Init error', e); }
});

// ==========================================
// UTILITAIRES INTERNES
// ==========================================

function _formatDate(iso) {
    if (!iso) return '...';
    try {
        return new Date(iso).toLocaleDateString('fr-FR', {year:'numeric', month:'long', day:'numeric'});
    } catch(e) { return iso; }
}

// Met à jour deux éléments en même temps (doc complet + doc résumé)
function _upBoth(id1, id2, val) {
    const e1 = document.getElementById(id1);
    const e2 = document.getElementById(id2);
    if (e1) e1.innerText = val || '...';
    if (e2) e2.innerText = val || '...';
}

// ==========================================
// MARKDOWN
// ==========================================
window.formatMD = function(text) {
    if (!text) return '';
    let html = text.replace(/</g,'&lt;').replace(/>/g,'&gt;');
    html = html.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g,'<em>$1</em>');
    let lines = html.split('\n'), inList = false, out = '';
    for (let i=0; i<lines.length; i++) {
        const line=lines[i], t=line.trim();
        if (t.startsWith('- ')) {
            if (!inList) { out += '<ul style="margin:5px 0;padding-left:20px;">'; inList=true; }
            out += '<li style="margin-bottom:2px;">'+t.substring(2)+'</li>';
        } else {
            if (inList) { out += '</ul>'; inList=false; }
            out += line + (i<lines.length-1 ? '<br>' : '');
        }
    }
    if (inList) out += '</ul>';
    return out.replace(/<\/ul><br>/g,'</ul>');
};

window.insertMD = function(id, type) {
    const el = document.getElementById(id);
    if (!el) return;
    const s=el.selectionStart, e=el.selectionEnd, t=el.value, sel=t.substring(s,e);
    let b=t.substring(0,s), a=t.substring(e), nv='';
    if (type==='bold')   nv=b+'**'+(sel||'Texte')+'**'+a;
    if (type==='italic') nv=b+'*'+(sel||'Texte')+'*'+a;
    if (type==='list') {
        let lt = sel ? sel.split('\n').map(l=>'- '+l).join('\n') : '- ';
        if (s!==0 && t.charAt(s-1)!=='\n' && !sel) lt='\n- ';
        nv=b+lt+a;
    }
    el.value=nv; el.dispatchEvent(new Event('input')); el.focus();
};

window.initToolbars = function() {
    document.querySelectorAll('textarea').forEach(ta => {
        if (!ta.id) return;
        if (ta.previousElementSibling?.classList.contains('md-toolbar')) return;
        const tb = document.createElement('div');
        tb.className = 'md-toolbar';
        tb.innerHTML = `
            <button type="button" onclick="insertMD('${ta.id}','bold')"   title="Gras">B</button>
            <button type="button" onclick="insertMD('${ta.id}','italic')" title="Italique">I</button>
            <button type="button" onclick="insertMD('${ta.id}','list')"   title="Liste">• Liste</button>`;
        ta.parentNode.insertBefore(tb, ta);
    });
};

// ==========================================
// FONCTIONS DE MISE À JOUR — LES DEUX DOCS
// ==========================================

// Exposée globalement car appelée depuis oninput dans le HTML
window.up = function(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val || '...';
};

window.upDate = function(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val ? _formatDate(val) : '...';
};

window.upBlock = function(textId, wrapId, val) {
    const el   = document.getElementById(textId);
    const wrap = document.getElementById(wrapId);
    if (el)   el.innerHTML     = formatMD(val) || '';
    if (wrap) wrap.style.display = (val && val.trim()) ? 'block' : 'none';
};

window.upSujet = function(val) {
    // Doc complet
    const el = document.getElementById('d-sujet');
    if (el) el.innerText = val || '...';
    // Doc résumé — affiche la box "sujet" seulement si renseigné
    const elR = document.getElementById('d-sujet-r');
    const box = document.getElementById('r-sujet-box');
    if (elR) elR.innerText = val || '';
    if (box) box.style.display = val && val.trim() ? 'block' : 'none';
};

window.upNom = function() {
    let prenom = document.getElementById('in-prenom')?.value.trim()      || '';
    let nom    = document.getElementById('in-nom-famille')?.value.trim() || '';
    if (prenom) prenom = prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase();
    if (nom)    nom    = nom.toUpperCase();
    const full = [prenom, nom].filter(Boolean).join(' ') || '...';
    // Sync les deux docs
    _upBoth('d-nom', 'd-nom-r', full);
};

window.upSexe = function(val) {
    _upBoth('d-sexe', 'd-sexe-r', val);
};

window.upDoc = function() {
    const docVal   = document.getElementById('in-doc')?.value.trim()   || '';
    const gradeVal = document.getElementById('in-grade')?.value.trim() || '';
    const complet  = docVal + (gradeVal ? ` — ${gradeVal}` : '') + ` de l'Ocean Medical Center`;

    // Doc complet
    const wrap = document.getElementById('wrap-doc');
    const dDoc = document.getElementById('d-doc');
    if (wrap) wrap.style.display = docVal ? 'block' : 'none';
    if (dDoc && docVal) dDoc.innerText = complet;

    // Doc résumé
    const wrapR = document.getElementById('wrap-doc-r');
    const dDocR = document.getElementById('d-doc-r');
    if (wrapR) wrapR.style.display = docVal ? 'block' : 'none';
    if (dDocR && docVal) dDocR.innerText = complet;
};

window.upSig = function(val) {
    const text = (val||'').trim();
    ['d-sig','d-sig-r'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.innerText = text; el.style.display = text ? 'inline-block' : 'none'; }
    });
};

window.upMedSuivi = function() {
    const concl = document.getElementById('in-med-conclusion')?.value.trim() || '';
    const repos = document.getElementById('in-med-repos')?.value.trim()      || '';
    const prix  = document.getElementById('in-med-prix')?.value.trim()       || '';

    const elC = document.getElementById('d-med-conclusion');
    if (elC) { elC.innerHTML = formatMD(concl); elC.style.display = concl ? 'block' : 'none'; }

    const dR = document.getElementById('d-med-repos'),  wR = document.getElementById('wrap-med-repos');
    if (dR) dR.innerText = repos; if (wR) wR.style.display = repos ? 'block' : 'none';

    const dP = document.getElementById('d-med-prix'), wP = document.getElementById('wrap-med-prix');
    if (dP) dP.innerText = prix; if (wP) wP.style.display = prix ? 'block' : 'none';

    const wS = document.getElementById('wrap-med-suivi');
    if (wS) wS.style.display = (concl||repos||prix) ? 'block' : 'none';
};

window.upAutoHeure = function(val) {
    // Doc complet
    const el  = document.getElementById('d-auto-heure');
    const box = document.getElementById('d-info-auto');
    if (el)  el.innerText       = val || '...';
    if (box) box.style.display  = val ? 'block' : 'none';
    // Doc résumé
    const elR  = document.getElementById('d-heure-deces-r');
    const boxR = document.getElementById('r-heure-box');
    if (elR)  elR.innerText       = val || '...';
    if (boxR) boxR.style.display  = (currentReportType==='auto' && val) ? 'block' : 'none';
};

window.genererRef = function() {
    try {
        const dateInput  = document.getElementById('in-date-prel')?.value  || '';
        const heureInput = document.getElementById('in-heure-prel')?.value || '';
        let ref = '#...';
        if (dateInput && heureInput) {
            const clean = dateInput.replace(/\D/g,'');
            if (clean.length >= 8)
                ref = '#' + clean.substring(6,8) + clean.substring(4,6) + heureInput.replace(/\D/g,'');
        }
        // Sync les deux docs
        _upBoth('d-ref', 'd-ref-r', ref);

        // QR code identique pour les deux
        const nom  = document.getElementById('d-nom')?.innerText || 'Inconnu';
        const data = encodeURIComponent(`OMC-${currentReportType.toUpperCase()}|${nom}|${ref}`);
        const src  = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
        ['qr-ref','qr-ref-r'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.src = src;
        });
    } catch(e) { console.error('QR error',e); }
};

// ==========================================
// ONGLETS — met à jour les DEUX docs
// ==========================================
window.switchReport = function(type) {
    currentReportType = type;
    window.currentReportType = type;

    // Boutons actifs
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-'+type)?.classList.add('active');

    // Formulaire
    document.querySelectorAll('.dynamic-fields').forEach(f => f.style.display='none');
    document.getElementById('fields-'+type).style.display='block';

    // Sections doc complet
    document.querySelectorAll('.render-section').forEach(s => s.style.display='none');
    const rs = document.getElementById('render-'+type);
    if (rs) rs.style.display='block';

    // Titres et labels
    const titres  = {med:'DOSSIER MÉDICAL', psy:'BILAN PSYCHOLOGIQUE', auto:"RAPPORT D'AUTOPSIE"};
    const labels  = {med:'Praticien intervenant', psy:'Psychologue / Médecin', auto:'Médecin Légiste (Coroner)'};
    const nomLbls = {med:'Prénom & Nom du Patient', psy:'Prénom & Nom du Patient', auto:'Prénom & Nom du Défunt'};

    // Sync titre dans les deux docs
    _upBoth('d-titre-doc', 'd-titre-r', titres[type]);

    const lDoc = document.getElementById('label-doc');
    const lNom = document.getElementById('label-nom');
    if (lDoc) lDoc.innerText = labels[type];
    if (lNom) lNom.innerText = nomLbls[type];

    // Boîte heure décès (autopsie seulement)
    const heure = document.getElementById('in-auto-heure')?.value || '';
    const boxAuto = document.getElementById('d-info-auto');
    const boxR    = document.getElementById('r-heure-box');
    if (boxAuto) boxAuto.style.display = (type==='auto' && heure) ? 'block' : 'none';
    if (boxR)    boxR.style.display    = (type==='auto' && heure) ? 'block' : 'none';

    // Reset statut résumé
    const status = document.getElementById('resume-status');
    if (status) { status.textContent='Remplissez le formulaire puis générez'; status.className=''; }

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
                <input type="text" id="in-c${id}-titre" placeholder="Titre du bloc..."
                    oninput="upCustom(${id})"
                    style="font-weight:bold;color:#38bdf8;border:none;background:transparent;padding-left:0;outline:none;width:100%;">
                <button type="button" onclick="supprimerSectionCustom(${id})"
                    style="background:#ef4444;border:none;color:white;border-radius:4px;cursor:pointer;padding:4px 8px;font-size:10px;margin-left:10px;flex-shrink:0;">❌</button>
            </div>
            <textarea id="in-c${id}-text" rows="2" placeholder="Contenu..."
                oninput="upCustom(${id})"
                style="border:none;background:#111b2d;color:white;width:100%;resize:vertical;padding:8px;border-radius:4px;outline:none;box-sizing:border-box;"></textarea>
        </div>`);

    document.getElementById('render-custom').insertAdjacentHTML('beforeend', `
        <div id="wrap-c${id}" style="display:none;margin-top:20px;">
            <h4 id="d-c${id}-titre" class="doc-h4"></h4>
            <p  id="d-c${id}-text"  class="doc-p"></p>
        </div>`);

    initToolbars();
};

window.supprimerSectionCustom = function(id) {
    document.getElementById(`custom-block-${id}`)?.remove();
    document.getElementById(`wrap-c${id}`)?.remove();
};

window.upCustom = function(id) {
    const titre  = document.getElementById(`in-c${id}-titre`)?.value.trim() || '';
    const texte  = document.getElementById(`in-c${id}-text`)?.value.trim()  || '';
    const wrap   = document.getElementById(`wrap-c${id}`);
    const dTitre = document.getElementById(`d-c${id}-titre`);
    const dText  = document.getElementById(`d-c${id}-text`);
    if (dTitre) dTitre.innerText = titre || 'SECTION SUPPLÉMENTAIRE';
    if (dText)  dText.innerHTML  = formatMD(texte);
    if (wrap)   wrap.style.display = texte ? 'block' : 'none';
};