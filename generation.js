/* ============================================================
   GENERATION.JS — MOTEUR UNIVERSEL OMC v3.1
   Patch : scale 3 + width 794 (A4) + hauteur totale capturée
   Logique deux docs : genererImage → #document-jeu si présent
                       envoyerDiscord → #document (complet)
   ============================================================ */

var IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282";

function _getCaptureEl(captureId) {
    const id = captureId || 'document';
    const el = document.getElementById(id);
    if (!el) throw new Error(`Élément #${id} introuvable pour la capture.`);
    return el;
}

function _getNomPatient(nomPatientId) {
    const id = nomPatientId || 'patientName';
    const el = document.getElementById(id);
    if (!el) return 'Anonyme';
    return (el.value || el.innerText || 'Anonyme').trim();
}

async function _captureToBlob(el, quality) {
    quality = quality || 0.92;

    // Hauteur totale — jamais tronquée
    const fullHeight = Math.max(el.scrollHeight, el.offsetHeight, el.clientHeight);

    const canvas = await html2canvas(el, {
        scale:           3,       // ×3 → net et zoomable en jeu
        useCORS:         true,
        backgroundColor: '#ffffff',
        scrollX:         0,
        scrollY:         -window.scrollY,
        width:           794,     // A4 fixe (96 dpi)
        windowWidth:     794,     // force le rendu A4
        height:          fullHeight,
        windowHeight:    fullHeight,
        logging:         false
    });

    return new Promise(function(resolve) {
        canvas.toBlob(resolve, 'image/jpeg', quality);
    });
}

async function _uploadImgBB(blob) {
    const fd = new FormData();
    fd.append('image', blob);
    const res  = await fetch('https://api.imgbb.com/1/upload?key=' + IMGBB_API_KEY, { method: 'POST', body: fd });
    const json = await res.json();
    if (!json.success) throw new Error('ImgBB : ' + (json.error?.message || 'Erreur inconnue'));
    return json.data.url;
}

function _showPopup(url) {
    const img   = document.getElementById('preview-img-result');
    const input = document.getElementById('direct-link');
    const popup = document.getElementById('image-popup');
    if (img)   img.src     = url;
    if (input) input.value = url;
    if (popup) popup.style.display = 'flex';
}

function _archiver(nomPatient, typeDoc, url, pageSource) {
    var snapshot = {};
    document.querySelectorAll('input, textarea, select').forEach(function(el) {
        if (el.id) snapshot[el.id] = (el.type === 'checkbox' || el.type === 'radio') ? el.checked : el.value;
    });
    if (window.ajouterEvenementPatient) {
        window.ajouterEvenementPatient(nomPatient, typeDoc, typeDoc, url, pageSource, snapshot)
            .catch(e => console.warn('Archivage Firebase :', e));
    }
}

/* ----------------------------------------------------------
   GÉNÉRER IMAGE EN JEU
   → capture #document-jeu si présent, sinon #document
---------------------------------------------------------- */
window.genererImage = async function(btn, captureId) {
    const originalText = btn ? btn.innerText : '';
    if (btn) { btn.disabled = true; btn.innerText = '⏳ CAPTURE...'; }

    try {
        const cfg = window.OMC_CONFIG || {};
        // Si #document-jeu existe sur cette page → résumé en jeu
        // Sinon fallback sur #document (comportement universel, toutes les autres pages)
        const id  = captureId
                 || (document.getElementById('document-jeu') ? 'document-jeu' : null)
                 || cfg.captureId
                 || 'document';
        const el  = _getCaptureEl(id);

        const blob = await _captureToBlob(el, 0.92);
        if (btn) btn.innerText = '⏳ HÉBERGEMENT IBB...';

        const url = await _uploadImgBB(blob);
        _showPopup(url);

        if (cfg.typeDoc) {
            _archiver(_getNomPatient(cfg.nomPatientId), cfg.typeDoc, url, cfg.pageSource);
        }

    } catch (e) {
        console.error('genererImage :', e);
        alert('❌ Erreur : ' + e.message);
    } finally {
        if (btn) { btn.disabled = false; btn.innerText = originalText || '🖼️ GÉNÉRER L\'IMAGE'; }
    }
};

/* ----------------------------------------------------------
   ENVOYER SUR DISCORD — rapport complet
   → capture #document (complet), ignore #document-jeu
---------------------------------------------------------- */
window.envoyerDiscord = async function(btn) {
    const cfg = window.OMC_CONFIG || {};
    if (!cfg.webhook) { alert('❌ webhook Discord manquant.'); return; }

    const originalText = btn ? btn.innerText : '';
    if (btn) { btn.disabled = true; btn.innerText = '⏳ CAPTURE...'; }

    try {
        // Discord reçoit TOUJOURS le document complet
        const id   = cfg.captureId || 'document';
        const el   = _getCaptureEl(id);
        const blob = await _captureToBlob(el, 0.95);

        if (btn) btn.innerText = '⏳ ENVOI DISCORD...';

        const nom        = _getNomPatient(cfg.nomPatientId);
        const threadName = cfg.getThreadName ? cfg.getThreadName() : `OMC — ${cfg.typeDoc || 'Document'} — ${nom}`;
        const content    = cfg.getContent    ? cfg.getContent()    : `📄 **${cfg.typeDoc || 'Document'}** — ${nom}`;
        const filename   = (cfg.pageSource || 'document').replace('.html', '') + '_' + nom + '.jpg';

        const fd = new FormData();
        fd.append('payload_json', JSON.stringify({ username: 'Intranet OMC', thread_name: threadName, content }));
        fd.append('file', blob, filename);

        const res = await fetch(cfg.webhook + '?wait=true', { method: 'POST', body: fd });

        if (res.ok) {
            _archiver(nom, cfg.typeDoc || 'Document', null, cfg.pageSource);
            if (btn) btn.innerText = '✅ ENVOYÉ !';
            setTimeout(() => { if (btn) { btn.innerText = originalText; btn.disabled = false; } }, 3000);
        } else {
            let err = {}; try { err = await res.json(); } catch(e2) {}
            throw new Error(err.message || 'HTTP ' + res.status);
        }

    } catch (e) {
        console.error('envoyerDiscord :', e);
        alert('❌ Erreur Discord : ' + e.message);
        if (btn) { btn.innerText = 'RÉESSAYER'; btn.disabled = false; }
    }
};

window.copyLink = function() {
    const el = document.getElementById('direct-link');
    if (!el) return;
    el.select();
    navigator.clipboard.writeText(el.value)
        .then(() => alert('✅ Lien copié !'))
        .catch(() => { document.execCommand('copy'); alert('✅ Lien copié !'); });
};

window.closePopup = function() {
    const popup = document.getElementById('image-popup');
    if (popup) popup.style.display = 'none';
};