/* ============================================================
   GENERATION.JS — MOTEUR UNIVERSEL OMC v3.3
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

async function _captureToBlob(el, quality = 0.92, html2canvasOptions = {}) {

    const fullWidth  = Math.max(el.scrollWidth, el.offsetWidth, el.clientWidth);
    const fullHeight = Math.max(el.scrollHeight, el.offsetHeight, el.clientHeight);

    const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: -window.scrollY,
        width: fullWidth,
        height: fullHeight,
        windowWidth: Math.max(fullWidth, window.innerWidth),
        windowHeight: Math.max(fullHeight, window.innerHeight),
        logging: false,
        ...html2canvasOptions
    });

    return new Promise(resolve => {
        canvas.toBlob(resolve, 'image/jpeg', quality);
    });
}

async function _uploadImgBB(blob) {
    const fd = new FormData();
    fd.append('image', blob);

    const res = await fetch(
        'https://api.imgbb.com/1/upload?key=' + IMGBB_API_KEY,
        { method: 'POST', body: fd }
    );

    const json = await res.json();
    if (!json.success) throw new Error('ImgBB : ' + (json.error?.message || 'Erreur inconnue'));

    return json.data.url;
}

function _showPopup(url) {
    const img   = document.getElementById('preview-img-result');
    const input = document.getElementById('direct-link');
    const popup = document.getElementById('image-popup');

    if (img) img.src = url;
    if (input) input.value = url;
    if (popup) popup.style.display = 'flex';
}

/* ----------------------------------------------------------
   GÉNÉRER IMAGE
---------------------------------------------------------- */
window.genererImage = async function(btn, captureId) {

    const originalText = btn ? btn.innerText : '';

    if (btn) {
        btn.disabled = true;
        btn.innerText = '⏳ CAPTURE...';
    }

    try {

        const cfg = window.OMC_CONFIG || {};
        const id =
            captureId ||
            (document.getElementById('document-jeu') ? 'document-jeu' : null) ||
            cfg.captureId ||
            'document';

        const el = _getCaptureEl(id);

        const blob = await _captureToBlob(el, 0.92, cfg.html2canvasOptions);

        if (btn) btn.innerText = '⏳ HÉBERGEMENT...';

        const url = await _uploadImgBB(blob);
        _showPopup(url);

    } catch (e) {
        console.error(e);
        alert('❌ Erreur : ' + e.message);
    }

    if (btn) {
        btn.disabled = false;
        btn.innerText = originalText || '🖼️ GÉNÉRER L\'IMAGE';
    }
};