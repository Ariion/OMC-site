// ==========================================
<<<<<<< HEAD
// RAPPORTS OFFICIELS - OMC v5.0
// Compatible avec rapports.html du projet
=======
// RAPPORTS OFFICIELS - OMC v4.0
// Synchronisation complète : résumé + complet
>>>>>>> a709d396fc484408844ac95182b3b7858e065c9b
// ==========================================

const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282";
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1473838500552900763/elqC43oQ76jAapLRLieQ38oQ53xHteXNdqJ3SrQ-Md_o2spH9a1AZyfhDqI6ruxVQASG';
const GEMINI_KEY = 'AIzaSyDBJNFfIhhf3mPJ-8x6LryOF7hVD5w4xqU';

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

<<<<<<< HEAD
        upDate('d-date', today.toISOString().split('T')[0]);
        up('d-heure', `${h}:${m}`);
        up('d-sexe', 'Homme');
=======
        // Init les deux docs avec la date du jour
        const iso = today.toISOString().split('T')[0];
        _upBoth('d-date', 'd-date-r',   _formatDate(iso));
        _upBoth('d-heure', 'd-heure-r', `${h}:${m}`);

        // Init sexe
        _upBoth('d-sexe', 'd-sexe-r', 'Homme');
>>>>>>> a709d396fc484408844ac95182b3b7858e065c9b

        switchReport('med');
        initToolbars();
    } catch(e) { console.error('Init error', e); }
});

// ==========================================
<<<<<<< HEAD
// MARKDOWN
// ==========================================
=======
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
>>>>>>> a709d396fc484408844ac95182b3b7858e065c9b
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
<<<<<<< HEAD
            <button type="button" onclick="insertMD('${ta.id}','bold')">B</button>
            <button type="button" onclick="insertMD('${ta.id}','italic')">I</button>
            <button type="button" onclick="insertMD('${ta.id}','list')">• Liste</button>`;
=======
            <button type="button" onclick="insertMD('${ta.id}','bold')"   title="Gras">B</button>
            <button type="button" onclick="insertMD('${ta.id}','italic')" title="Italique">I</button>
            <button type="button" onclick="insertMD('${ta.id}','list')"   title="Liste">• Liste</button>`;
>>>>>>> a709d396fc484408844ac95182b3b7858e065c9b
        ta.parentNode.insertBefore(tb, ta);
    });
};

// ==========================================
<<<<<<< HEAD
// MISE À JOUR DOM
// ==========================================
=======
// FONCTIONS DE MISE À JOUR — LES DEUX DOCS
// ==========================================

// Exposée globalement car appelée depuis oninput dans le HTML
>>>>>>> a709d396fc484408844ac95182b3b7858e065c9b
window.up = function(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val || '...';
};

window.upDate = function(id, val) {
    const el = document.getElementById(id);
<<<<<<< HEAD
    if (!el) return;
    if (val) {
        try { el.innerText = new Date(val).toLocaleDateString('fr-FR', {year:'numeric',month:'long',day:'numeric'}); }
        catch(e) { el.innerText = val; }
    } else { el.innerText = '...'; }
=======
    if (el) el.innerText = val ? _formatDate(val) : '...';
>>>>>>> a709d396fc484408844ac95182b3b7858e065c9b
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
<<<<<<< HEAD
    const el  = document.getElementById('d-nom');
    const el2 = document.getElementById('d-nom-titre');
    if (el)  el.innerText  = full;
    if (el2) el2.innerText = full;
=======
    // Sync les deux docs
    _upBoth('d-nom', 'd-nom-r', full);
};

window.upSexe = function(val) {
    _upBoth('d-sexe', 'd-sexe-r', val);
>>>>>>> a709d396fc484408844ac95182b3b7858e065c9b
};

window.upDoc = function() {
    const docVal   = document.getElementById('in-doc')?.value.trim()   || '';
    const gradeVal = document.getElementById('in-grade')?.value.trim() || '';
<<<<<<< HEAD
    const wrap = document.getElementById('wrap-doc');
    const dDoc = document.getElementById('d-doc');
    if (!docVal) { if (wrap) wrap.style.display='none'; return; }
    const complet = docVal + (gradeVal ? ` - ${gradeVal}` : '') + ` de l'Ocean Medical Center`;
    if (wrap) wrap.style.display = 'block';
    if (dDoc) dDoc.innerText = complet;
=======
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
>>>>>>> a709d396fc484408844ac95182b3b7858e065c9b
};

window.upSig = function(val) {
    const text = (val||'').trim();
<<<<<<< HEAD
    const el = document.getElementById('d-sig');
    if (el) { el.innerText = text; el.style.display = text ? 'inline-block' : 'none'; }
=======
    ['d-sig','d-sig-r'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.innerText = text; el.style.display = text ? 'inline-block' : 'none'; }
    });
>>>>>>> a709d396fc484408844ac95182b3b7858e065c9b
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
<<<<<<< HEAD
    const el  = document.getElementById('d-auto-heure');
    const box = document.getElementById('d-info-auto');
    if (el)  el.innerText      = val || '...';
    if (box) box.style.display = (currentReportType==='auto' && val) ? 'block' : 'none';
=======
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
>>>>>>> a709d396fc484408844ac95182b3b7858e065c9b
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
<<<<<<< HEAD
        const qr   = document.getElementById('qr-ref');
        if (qr) qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
=======
        const src  = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
        ['qr-ref','qr-ref-r'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.src = src;
        });
>>>>>>> a709d396fc484408844ac95182b3b7858e065c9b
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

<<<<<<< HEAD
    document.querySelectorAll('.dynamic-fields').forEach(f => f.style.display='none');
    document.getElementById('fields-'+type).style.display='block';

    document.querySelectorAll('.render-section').forEach(s => s.style.display='none');
    const rs = document.getElementById('render-'+type);
    if (rs) rs.style.display='block';

    const titres  = {med:'DOSSIER MÉDICAL', psy:'BILAN PSYCHOLOGIQUE', auto:"RAPPORT D'AUTOPSIE"};
    const labels  = {med:'Praticien intervenant', psy:'Psychologue / Médecin', auto:'Médecin Légiste (Coroner)'};
    const nomLbls = {med:'Prénom & Nom du Patient', psy:'Prénom & Nom du Patient', auto:'Prénom & Nom du Défunt'};

    const titreDoc = document.getElementById('d-titre-doc');
    if (titreDoc) titreDoc.innerText = titres[type];

    const lDoc = document.getElementById('label-doc');
    const lNom = document.getElementById('label-nom');
    if (lDoc) lDoc.innerText = labels[type];
    if (lNom) lNom.innerText = nomLbls[type];

    const heure   = document.getElementById('in-auto-heure')?.value || '';
    const boxAuto = document.getElementById('d-info-auto');
    if (boxAuto) boxAuto.style.display = (type==='auto' && heure) ? 'block' : 'none';
=======
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
>>>>>>> a709d396fc484408844ac95182b3b7858e065c9b

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
<<<<<<< HEAD
=======

>>>>>>> a709d396fc484408844ac95182b3b7858e065c9b
    document.getElementById('render-custom').insertAdjacentHTML('beforeend', `
        <div id="wrap-c${id}" style="display:none;margin-top:20px;">
            <h4 id="d-c${id}-titre" class="doc-h4"></h4>
            <p  id="d-c${id}-text"  class="doc-p"></p>
        </div>`);
<<<<<<< HEAD
=======

>>>>>>> a709d396fc484408844ac95182b3b7858e065c9b
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
<<<<<<< HEAD
};

// ==========================================
// RÉSUMÉ IA VIA GEMINI
// ==========================================
async function genererResumeIA() {
    const btn    = document.getElementById('btn-generer-resume');
    const status = document.getElementById('resume-status');
    const ta     = document.getElementById('resume-textarea');
    const type   = currentReportType;

    const prenom    = document.getElementById('in-prenom')?.value.trim()      || '';
    const nom       = document.getElementById('in-nom-famille')?.value.trim() || '';
    const sujet     = document.getElementById('in-sujet')?.value.trim()       || '';
    const ddnRaw    = document.getElementById('in-ddn')?.value                || '';
    const sexe      = document.getElementById('in-sexe')?.value               || '';
    const dateRaw   = document.getElementById('in-date-prel')?.value          || '';
    const heure     = document.getElementById('in-heure-prel')?.value         || '';
    const praticien = document.getElementById('in-doc')?.value.trim()         || '';
    const grade     = document.getElementById('in-grade')?.value.trim()       || '';

    let sections = {};
    if (type === 'med') {
        sections = {
            'Circonstances':          document.getElementById('in-med-circ')?.value.trim(),
            'Bilan clinique':         document.getElementById('in-med-bilan')?.value.trim(),
            'Protocole de soins':     document.getElementById('in-med-soins')?.value.trim(),
            'Conclusion / Pronostic': document.getElementById('in-med-conclusion')?.value.trim(),
            'Temps de récupération':  document.getElementById('in-med-repos')?.value.trim(),
            'Facturation':            document.getElementById('in-med-prix')?.value.trim(),
        };
    } else if (type === 'psy') {
        sections = {
            'Contexte / Motif': document.getElementById('in-psy-circ')?.value.trim(),
            'Observations':     document.getElementById('in-psy-obs')?.value.trim(),
            'Diagnostic':       document.getElementById('in-psy-diag')?.value.trim(),
            'Recommandations':  document.getElementById('in-psy-reco')?.value.trim(),
        };
    } else if (type === 'auto') {
        sections = {
            'Heure du décès estimée':    document.getElementById('in-auto-heure')?.value,
            'Examen externe':            document.getElementById('in-auto-ext')?.value.trim(),
            'Examen interne':            document.getElementById('in-auto-int')?.value.trim(),
            'Conclusion médico-légale':  document.getElementById('in-auto-cause')?.value.trim(),
        };
    }

    const secStr = Object.entries(sections)
        .filter(([,v]) => v && v.length > 0)
        .map(([k,v]) => `${k} :\n${v}`)
        .join('\n\n');

    if (!secStr && !prenom && !nom) {
        status.textContent = "⚠ Remplissez d'abord quelques champs";
        status.className = 'err'; return;
    }

    const typeLabel = {med:'médical', psy:'psychologique', auto:"d'autopsie"}[type] || type;
    const ddn  = ddnRaw  ? new Date(ddnRaw).toLocaleDateString('fr-FR')  : '';
    const date = dateRaw ? new Date(dateRaw).toLocaleDateString('fr-FR') : '';

    const infos = [
        (prenom||nom) ? `Patient : ${prenom} ${nom}`.trim() : '',
        ddn       ? `Date de naissance : ${ddn}` : '',
        sexe      ? `Sexe : ${sexe}` : '',
        sujet     ? `Motif / Sujet : ${sujet}` : '',
        date      ? `Date d'intervention : ${date}${heure ? ' à '+heure : ''}` : '',
        praticien ? `Praticien : ${praticien}${grade ? ', '+grade : ''}` : '',
    ].filter(Boolean).join('\n');

    const prompt = `Tu es médecin à l'Ocean Medical Center. À partir des notes brutes ci-dessous, rédige un résumé médical officiel en français, destiné à être imprimé et remis aux autorités.

Type de rapport : ${typeLabel}
${infos ? '\nIdentité :\n'+infos : ''}
${secStr ? '\nNotes brutes :\n'+secStr : ''}

Règles absolues :
- Reformule et synthétise : ne recopie PAS les notes mot pour mot
- Prose médicale fluide et professionnelle, 2 à 4 paragraphes bien rédigés
- Commence immédiatement par les faits cliniques, sans phrase d'intro
- N'inclus pas le nom du patient ni la date (déjà dans l'en-tête)
- Zéro markdown, zéro tiret, zéro astérisque
- 150 à 280 mots`;

    btn?.classList.add('loading-state');
    if (btn) btn.disabled = true;
    if (status) { status.textContent = 'Rédaction en cours…'; status.className = 'go'; }

    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { maxOutputTokens: 700, temperature: 0.3 }
                })
            }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Erreur '+res.status);
        const texte = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (!texte) throw new Error('Réponse vide');

        if (ta) ta.value = texte;
        syncResumeDoc(texte);
        if (status) { status.textContent = '✓ Résumé généré — modifiable ci-dessus'; status.className = 'ok'; }

    } catch(e) {
        console.error('Erreur IA :', e);
        if (status) { status.textContent = '✗ ' + (e.message || 'Erreur — réessayez'); status.className = 'err'; }
    }

    btn?.classList.remove('loading-state');
    if (btn) btn.disabled = false;
}

function syncResumeDoc(texte) {
    // Si le HTML a un panneau résumé séparé (version 3 colonnes)
    const section = document.getElementById('doc-resume-section');
    const el      = document.getElementById('doc-resume-text');
    if (el)      el.textContent        = texte || '';
    if (section) section.style.display = (texte && texte.trim()) ? 'block' : 'none';
}

// ==========================================
// GÉNÉRATION IMAGE + DISCORD
// ==========================================
window.genererImageRapport = async function() {
    const doc = document.getElementById('document');
    const btn = event?.target || document.querySelector('.btn-image');
    const prevText = btn?.innerText || '';

    if (btn) { btn.innerText = "GÉNÉRATION..."; btn.disabled = true; }

    try {
        const canvas = await html2canvas(doc, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imageData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        const formData = new FormData();
        formData.append("image", imageData);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method:"POST", body:formData });
        const result = await res.json();
        if (result.success) {
            document.getElementById('direct-link').value = result.data.url;
            document.getElementById('preview-img-result').src = result.data.url;
            document.getElementById('image-popup').style.display = 'flex';
        } else { throw new Error("Erreur ImgBB"); }
    } catch(e) { console.error(e); alert("❌ Erreur génération image"); }
    finally { if (btn) { btn.innerText = prevText; btn.disabled = false; } }
};

window.envoyerRapportDiscord = async function() {
    const btn = document.getElementById('discord-btn');
    const doc = document.getElementById('document');
    const nom      = document.getElementById('d-nom')?.innerText || 'Inconnu';
    const titreDoc = document.getElementById('d-titre-doc')?.innerText || 'Rapport';
    const ref      = document.getElementById('d-ref')?.innerText || '...';
    const praticien= document.getElementById('in-sig')?.value || document.getElementById('in-doc')?.value || 'Non renseigné';

    if (btn) { btn.disabled = true; btn.innerText = "CAPTURE..."; }

    try {
        const canvas = await html2canvas(doc, { scale:1.5, useCORS:true, backgroundColor:"#ffffff" });
        if (btn) btn.innerText = "ENVOI...";
        const blob = await new Promise((res,rej) => canvas.toBlob(b => b ? res(b) : rej(new Error("Blob fail")), 'image/png'));

        const formData = new FormData();
        formData.append("payload_json", JSON.stringify({
            username: "Intranet OMC",
            thread_name: `📄 ${titreDoc} - ${nom}`,
            content: `📂 **NOUVEAU DOSSIER DÉPOSÉ**\n━━━━━━━━━━━━━━━━━━━━\n👤 **Patient/Sujet :** ${nom}\n📄 **Type :** ${titreDoc}\n🏷️ **Réf :** \`${ref}\`\n👨‍⚕️ **Signataire :** ${praticien}\n━━━━━━━━━━━━━━━━━━━━`
        }));
        formData.append("file", blob, "rapport_officiel.png");

        const res = await fetch(DISCORD_WEBHOOK_URL, { method:'POST', body:formData });
        if (res.ok) { alert("✅ Rapport envoyé !"); if (btn) btn.innerText = "✅ ENVOYÉ !"; }
        else throw new Error("Discord refus "+res.status);
    } catch(e) {
        console.error(e); alert("❌ Erreur Discord : "+e.message);
        if (btn) { btn.disabled = false; btn.innerText = "📨 ENVOYER SUR L'INTRANET"; }
    }
};

function copyLink() { navigator.clipboard.writeText(document.getElementById("direct-link").value); alert("Copié !"); }
function closePopup() { document.getElementById('image-popup').style.display = 'none'; }
=======
};
>>>>>>> a709d396fc484408844ac95182b3b7858e065c9b
