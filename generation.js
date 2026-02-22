/* ============================================================
   GENERATION.JS — MOTEUR UNIVERSEL OMC v3.0
   Centralise : Capture html2canvas, Upload ImgBB, Popup,
                Envoi Discord, Archivage Firebase
   ============================================================
   USAGE DANS LES HTML :

   1. Déclarer la config de la page dans un <script> :
      const OMC_CONFIG = {
        webhook:      'https://discord.com/api/webhooks/...',
        captureId:    'document',          // défaut: 'document'
        nomPatientId: 'patientName',       // défaut: 'patientName'
        typeDoc:      'Certificat Médical',
        pageSource:   'certificat.html',
        getThreadName: () => `📝 Certificat - ${document.getElementById('d-nom')?.innerText}`,
        getContent:    () => `📜 **Nouveau Certificat**\n👤 ${document.getElementById('d-nom')?.innerText}`
      };

   2. Boutons :
      <button onclick="genererImage(this)">🖼️ GÉNÉRER</button>
      <button onclick="genererImage(this, 'capture-zone')">🖼️ GÉNÉRER</button>
      <button onclick="envoyerDiscord(this)">DISCORD</button>
   ============================================================ */

const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282";

/* ----------------------------------------------------------
   UTILITAIRES INTERNES
---------------------------------------------------------- */

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
    quality = quality || 0.85;

    // Fix crop automatique si le contenu déborde (ex: grossesse, rapports longs)
    const isScrollable = el.scrollHeight > (el.clientHeight + 10);
    const captureHeight = isScrollable ? el.scrollHeight + 60 : undefined;

    const opts = {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0
    };

    if (captureHeight) {
        opts.height = captureHeight;
        opts.windowHeight = captureHeight;
    }

    const canvas = await html2canvas(el, opts);
    return new Promise(function(resolve) {
        canvas.toBlob(resolve, 'image/jpeg', quality);
    });
}

async function _uploadImgBB(blob) {
    const fd = new FormData();
    fd.append('image', blob);
    const res  = await fetch('https://api.imgbb.com/1/upload?key=' + IMGBB_API_KEY, {
        method: 'POST',
        body: fd
    });
    const json = await res.json();
    if (!json.success) throw new Error('ImgBB : ' + (json.error && json.error.message ? json.error.message : 'Erreur inconnue'));
    return json.data.url;
}

function _showPopup(url) {
    const img   = document.getElementById('preview-img-result');
    const input = document.getElementById('direct-link');
    const popup = document.getElementById('image-popup');
    if (img)   img.src   = url;
    if (input) input.value = url;
    if (popup) popup.style.display = 'flex';
}

function _archiver(nomPatient, typeDoc, url, pageSource) {
    // Aspiration complète du formulaire pour le bouton "Modifier" dans les dossiers
    var snapshot = {};
    document.querySelectorAll('input, textarea, select').forEach(function(el) {
        if (el.id) {
            snapshot[el.id] = (el.type === 'checkbox' || el.type === 'radio') ? el.checked : el.value;
        }
    });
    if (window.ajouterEvenementPatient) {
        window.ajouterEvenementPatient(nomPatient, typeDoc, typeDoc, url, pageSource, snapshot)
            .catch(function(e) { console.warn('Archivage Firebase (non bloquant) :', e); });
    }
}

/* ----------------------------------------------------------
   FONCTION PRINCIPALE : GÉNÉRER L'IMAGE + POPUP
   @param btn       — le bouton cliqué (this)
   @param captureId — id de l'élément à capturer (optionnel, défaut: 'document')
---------------------------------------------------------- */
window.genererImage = async function(btn, captureId) {
    var originalText = btn ? btn.innerText : '';
    if (btn) { btn.disabled = true; btn.innerText = '⏳ CAPTURE...'; }

    try {
        var cfg = window.OMC_CONFIG || {};
        var id  = captureId || cfg.captureId || 'document';
        var el  = _getCaptureEl(id);

        var blob = await _captureToBlob(el);
        if (btn) btn.innerText = '⏳ HÉBERGEMENT IBB...';

        var url = await _uploadImgBB(blob);
        _showPopup(url);

        // Archivage silencieux si config disponible
        if (cfg.typeDoc) {
            var nom = _getNomPatient(cfg.nomPatientId);
            _archiver(nom, cfg.typeDoc, url, cfg.pageSource);
        }

    } catch (e) {
        console.error('genererImage :', e);
        alert('❌ Erreur lors de la génération : ' + e.message);
    } finally {
        if (btn) { btn.disabled = false; btn.innerText = originalText || '🖼️ GÉNÉRER L\'IMAGE'; }
    }
};

/* ----------------------------------------------------------
   FONCTION PRINCIPALE : ENVOYER SUR DISCORD
   @param btn — le bouton cliqué (this)
   (lit window.OMC_CONFIG automatiquement)
---------------------------------------------------------- */
window.envoyerDiscord = async function(btn) {
    var cfg = window.OMC_CONFIG;
    if (!cfg || !cfg.webhook) {
        alert('❌ Configuration Discord manquante.\nDéclare OMC_CONFIG.webhook sur cette page.');
        return;
    }

    var originalText = btn ? btn.innerText : '';
    if (btn) { btn.disabled = true; btn.innerText = '⏳ CAPTURE...'; }

    try {
        var id   = cfg.captureId || 'document';
        var el   = _getCaptureEl(id);
        var blob = await _captureToBlob(el, 0.9);

        if (btn) btn.innerText = '⏳ ENVOI DISCORD...';

        var nom        = _getNomPatient(cfg.nomPatientId);
        var threadName = cfg.getThreadName ? cfg.getThreadName() : ('OMC — ' + (cfg.typeDoc || 'Document') + ' — ' + nom);
        var content    = cfg.getContent    ? cfg.getContent()    : ('📄 **' + (cfg.typeDoc || 'Document') + '** — ' + nom);
        var filename   = (cfg.pageSource || 'document').replace('.html', '') + '_' + nom + '.png';

        var fd = new FormData();
        fd.append('payload_json', JSON.stringify({
            username: 'Intranet OMC',
            thread_name: threadName,
            content: content
        }));
        fd.append('file', blob, filename);

        var res = await fetch(cfg.webhook + '?wait=true', { method: 'POST', body: fd });

        if (res.ok) {
            _archiver(nom, cfg.typeDoc || 'Document', null, cfg.pageSource);
            if (btn) btn.innerText = '✅ ENVOYÉ !';
            setTimeout(function() {
                if (btn) { btn.innerText = originalText; btn.disabled = false; }
            }, 3000);
        } else {
            var err = {};
            try { err = await res.json(); } catch(e) {}
            throw new Error(err.message || ('HTTP ' + res.status));
        }

    } catch (e) {
        console.error('envoyerDiscord :', e);
        alert('❌ Erreur Discord : ' + e.message);
        if (btn) { btn.innerText = 'RÉESSAYER'; btn.disabled = false; }
    }
};

/* ----------------------------------------------------------
   UTILITAIRES POPUP — partagés par toutes les pages
---------------------------------------------------------- */
window.copyLink = function() {
    var el = document.getElementById('direct-link');
    if (!el) return;
    el.select();
    try {
        navigator.clipboard.writeText(el.value).then(function() {
            alert('✅ Lien copié !');
        });
    } catch (e) {
        document.execCommand('copy');
        alert('✅ Lien copié !');
    }
};

window.closePopup = function() {
    var popup = document.getElementById('image-popup');
    if (popup) popup.style.display = 'none';
};