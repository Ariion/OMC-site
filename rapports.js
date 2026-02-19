// ==========================================
// RAPPORTS OFFICIELS - OMC LOGIC
// ==========================================

let currentReportType = 'med'; // Par défaut

document.addEventListener('DOMContentLoaded', () => {
    // Initialise la date et heure au chargement
    const today = new Date();
    if(document.getElementById('in-date-prel')) document.getElementById('in-date-prel').valueAsDate = today;
    
    const h = String(today.getHours()).padStart(2, '0');
    const m = String(today.getMinutes()).padStart(2, '0');
    if(document.getElementById('in-heure-prel')) document.getElementById('in-heure-prel').value = `${h}:${m}`;

    // Applique sur le document
    upDate('d-date', today.toISOString().split('T')[0]);
    up('d-heure', `${h}:${m}`);
    genererRef();
});

// --- FONCTIONS DE MISE À JOUR DOM ---
window.up = function(id, val) {
    const el = document.getElementById(id);
    if(el) el.innerText = val || '...';
}

window.upDate = function(id, val) {
    const el = document.getElementById(id);
    if(el && val) {
        const d = new Date(val);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        el.innerText = d.toLocaleDateString('fr-FR', options);
    } else if (el) {
        el.innerText = '...';
    }
}

window.genererRef = function() {
    const date = document.getElementById('in-date-prel').value; // YYYY-MM-DD
    const heure = document.getElementById('in-heure-prel').value; // HH:MM
    let ref = "#...";
    
    if(date && heure) {
        let d = date.replace(/\D/g, '').substring(6, 8) + date.replace(/\D/g, '').substring(4, 6); // DDMM
        let h = heure.replace(/\D/g, ''); // HHMM
        ref = "#" + d + h;
    }
    
    document.getElementById('d-ref').innerText = ref;
    
    // Maj QR Code
    const nom = document.getElementById('in-nom').value || "Anonyme";
    const qrImg = document.getElementById('qr-ref');
    if (qrImg) {
        const data = encodeURIComponent(`OMC-${currentReportType.toUpperCase()}|${nom}|${ref}`);
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
    }
}

// --- GESTION DES ONGLETS (Médical / Psy / Autopsie) ---
window.switchReport = function(type) {
    currentReportType = type;
    
    // 1. Boutons Sidebar
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + type).classList.add('active');

    // 2. Champs Sidebar
    document.querySelectorAll('.dynamic-fields').forEach(f => f.style.display = 'none');
    document.getElementById('fields-' + type).style.display = 'block';

    // 3. Sections Document Rendu
    document.querySelectorAll('.render-section').forEach(s => s.style.display = 'none');
    document.getElementById('render-' + type).style.display = 'block';

    // 4. Titres et spécificités
    const titreDoc = document.getElementById('d-titre-doc');
    const labelDoc = document.getElementById('label-doc');
    const infoAuto = document.getElementById('d-info-auto'); // Heure décès

    if(type === 'med') {
        titreDoc.innerText = "DOSSIER MÉDICAL";
        labelDoc.innerText = "Praticien intervenant";
        infoAuto.style.display = 'none';
    } else if (type === 'psy') {
        titreDoc.innerText = "BILAN PSYCHOLOGIQUE";
        labelDoc.innerText = "Psychologue / Médecin";
        infoAuto.style.display = 'none';
    } else if (type === 'auto') {
        titreDoc.innerText = "RAPPORT D'AUTOPSIE";
        labelDoc.innerText = "Médecin Légiste (Coroner)";
        infoAuto.style.display = 'block';
    }
    
    genererRef();
}

// --- GÉNÉRATEUR DISCORD / DOJ ---
window.copierDiscord = function() {
    const btn = document.querySelector('.btn-discord');
    
    // Récupération infos de base
    const nom = document.getElementById('in-nom').value || '[NOM DU PATIENT]';
    const ddn = document.getElementById('d-ddn').innerText || '[DDN]';
    const sexe = document.getElementById('in-sexe').options[document.getElementById('in-sexe').selectedIndex].text;
    const date = document.getElementById('d-date').innerText;
    const heure = document.getElementById('d-heure').innerText;
    const ref = document.getElementById('d-ref').innerText;
    const doc = document.getElementById('in-doc').value || '[MÉDECIN]';

    let markdown = "";

    // FORMAT MÉDICAL
    if(currentReportType === 'med') {
        markdown = `**DOSSIER MÉDICAL : ${nom}**
**Référence :** ${ref} | **Date :** ${date} à ${heure}

**IDENTITÉ**
* **Nom/Prénom :** ${nom}
* **Naissance :** ${ddn}
* **Sexe :** ${sexe}

**CIRCONSTANCES DE L'INTERVENTION**
* **Praticien :** ${doc}
* **Déclarations :** ${document.getElementById('in-med-circ').value || '...'}

**BILAN CLINIQUE ET IMAGERIE**
${document.getElementById('in-med-bilan').value || '...'}

**PROTOCOLE DE SOINS APPLIQUÉ**
${document.getElementById('in-med-soins').value || '...'}

**SUIVI & CONCLUSION**
* **Temps de récupération :** ${document.getElementById('in-med-repos').value || '...'}
* **Facturation :** ${document.getElementById('in-med-prix').value || '0'}$

_Établi par : ${doc} - Ocean Medical Center_`;
    } 
    
    // FORMAT PSYCHOLOGIE
    else if (currentReportType === 'psy') {
        markdown = `**BILAN PSYCHOLOGIQUE : ${nom}**
**Référence :** ${ref} | **Date :** ${date} à ${heure}

**IDENTITÉ**
* **Nom/Prénom :** ${nom}
* **Naissance :** ${ddn}

**CONTEXTE & MOTIF**
* **Praticien :** ${doc}
* **Motif :** ${document.getElementById('in-psy-circ').value || '...'}

**OBSERVATIONS CLINIQUES**
${document.getElementById('in-psy-obs').value || '...'}

**ANALYSE & DIAGNOSTIC**
${document.getElementById('in-psy-diag').value || '...'}

**CONCLUSION & RECOMMANDATIONS**
${document.getElementById('in-psy-reco').value || '...'}

_Établi par : ${doc} - Ocean Medical Center_`;
    }

    // FORMAT AUTOPSIE
    else if (currentReportType === 'auto') {
        markdown = `**RAPPORT D'AUTOPSIE : ${nom}**
**Référence :** ${ref} | **Date :** ${date} à ${heure}

**IDENTITÉ DU DÉFUNT**
* **Nom/Prénom :** ${nom}
* **Naissance :** ${ddn}
* **Sexe :** ${sexe}
* **Heure estimée du décès :** ${document.getElementById('in-auto-heure').value || '--:--'}

**EXAMEN EXTERNE**
${document.getElementById('in-auto-ext').value || '...'}

**EXAMEN INTERNE**
${document.getElementById('in-auto-int').value || '...'}

**CONCLUSION MÉDICO-LÉGALE**
**${document.getElementById('in-auto-cause').value || '...'}**

_Établi par : ${doc} (Légiste) - Ocean Medical Center_`;
    }

    // Copie Presse-papier
    navigator.clipboard.writeText(markdown).then(() => {
        const texteOriginal = btn.innerText;
        btn.innerText = "✅ COPIÉ ! (COLLER SUR DISCORD)";
        setTimeout(() => { btn.innerText = texteOriginal; }, 2500);
    }).catch(err => {
        alert("Erreur de copie.");
    });
}
