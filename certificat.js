// ══════════════════════════════════════════════════════════════
//  certificat.js — OMC Medical Center
//  + arrêt de travail + rendez-vous médical
// ══════════════════════════════════════════════════════════════

function toggleMotifs() {
    const concl = document.querySelector('input[name="concl"]:checked').value;
    if (document.getElementById('motif-reserve-group'))
        document.getElementById('motif-reserve-group').style.display = (concl === "Réserve") ? "block" : "none";
    if (document.getElementById('motif-inapte-group'))
        document.getElementById('motif-inapte-group').style.display  = (concl === "Inapte")  ? "block" : "none";
    updateCertif();
}

/* ── Construit le label Dr. Prénom NOM et met à jour ── */
function buildMedecinLabel() {
    const prenom = document.getElementById('f-med-prenom')?.value.trim() || '';
    const nom    = document.getElementById('f-med-nom')?.value.trim().toUpperCase() || '';
    const label  = [prenom, nom].filter(Boolean).join(' ');

    // Synchronise aussi le champ médecin signataire si vide ou déjà auto
    const champSig = document.getElementById('f-medecin');
    if (champSig && (!champSig.value || champSig._autoFilled)) {
        champSig.value    = label ? `Dr. ${label}` : '';
        champSig._autoFilled = true;
    }
    updateCertif();
}


function calcDureeArret() {
    const debut = document.getElementById('f-arret-debut')?.value;
    const fin   = document.getElementById('f-arret-fin')?.value;
    if (!debut || !fin) return;
    const d1 = new Date(debut);
    const d2 = new Date(fin);
    const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    const el = document.getElementById('f-arret-jours');
    if (el && diff >= 0) el.value = diff + 1; // inclus les deux bornes
    updateCertif();
}

function calcFinArret() {
    const debut = document.getElementById('f-arret-debut')?.value;
    const jours = parseInt(document.getElementById('f-arret-jours')?.value);
    if (!debut || !jours || jours < 1) return;
    const d1  = new Date(debut);
    d1.setDate(d1.getDate() + jours - 1);
    const pad = n => String(n).padStart(2, '0');
    const fin = `${d1.getFullYear()}-${pad(d1.getMonth()+1)}-${pad(d1.getDate())}`;
    const el  = document.getElementById('f-arret-fin');
    if (el) el.value = fin;
    updateCertif();
}

function fmtDateFR(val) {
    if (!val) return '...';
    const d = new Date(val);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function updateCertif() {
    const type = document.getElementById('f-type').value;

    /* ── Visibilité des blocs sidebar ── */
    const showEntreprise   = type === "Aptitude professionnelle";
    const showConcl        = !["Divers", "Arrêt de travail", "Rendez-vous médical", "Prêt de matériel"].includes(type);
    const showDivers       = type === "Divers";
    const showArret        = type === "Arrêt de travail";
    const showRdv          = type === "Rendez-vous médical";
    const showPret         = type === "Prêt de matériel";
    const showServiceGenre = showArret || showRdv || showPret;

    document.getElementById('side-entreprise-block').style.display    = showEntreprise   ? "block" : "none";
    document.getElementById('doc-entreprise-block').style.display     = showEntreprise   ? "block" : "none";
    document.getElementById('side-concl-block').style.display         = showConcl        ? "block" : "none";
    document.getElementById('doc-concl-block').style.display          = showConcl        ? "block" : "none";
    document.getElementById('side-divers-block').style.display        = showDivers       ? "block" : "none";
    document.getElementById('doc-divers-block').style.display         = showDivers       ? "block" : "none";
    document.getElementById('side-arret-block').style.display         = (showArret || showPret) ? "block" : "none"; 
    document.getElementById('doc-arret-block').style.display          = showArret        ? "block" : "none";
    document.getElementById('side-rdv-block').style.display           = showRdv          ? "block" : "none";
    document.getElementById('doc-rdv-block').style.display            = showRdv          ? "block" : "none";
    document.getElementById('doc-pret-block').style.display           = showPret         ? "block" : "none";
    document.getElementById('side-service-genre-block').style.display = showServiceGenre ? "block" : "none";

    /* ── Titre du document ── */
    const titres = {
        "Aptitude professionnelle": "CERTIFICAT D'APTITUDE PROFESSIONNELLE",
        "PPA Civil": "CERTIFICAT DE CAPACITÉ PPA — CIVIL",
        "PPA Professionnel": "CERTIFICAT DE CAPACITÉ PPA — PROFESSIONNEL",
        "Divers": "CERTIFICAT — DIVERS",
        "Arrêt de travail": "ARRÊT DE TRAVAIL",
        "Rendez-vous médical": "ATTESTATION DE RENDEZ-VOUS MÉDICAL",
        "Prêt de matériel": "CONTRAT DE PRÊT DE MATÉRIEL MÉDICAL"
    };
    document.getElementById('d-titre-doc').innerText = titres[type] || "CERTIFICAT MÉDICAL";

    /* ── Nom patient ── */
    const prenomRaw = document.getElementById('patientPrenom')?.value.trim() || '';
    const nomRaw    = document.getElementById('patientNom')?.value.trim()    || '';
    const prenom    = typeof formatPrenom === 'function' ? formatPrenom(prenomRaw) : prenomRaw;
    const nom       = typeof formatNom    === 'function' ? formatNom(nomRaw)       : nomRaw.toUpperCase();
    const fullName  = [prenom, nom].filter(Boolean).join(' ');
    document.getElementById('d-nom').innerText = fullName || '...';
    const hiddenName = document.getElementById('patientName');
    if (hiddenName) hiddenName.value = fullName;

    /* ── Date naissance ── */
    const birthInput = document.getElementById('patientBirth');
    if (birthInput && birthInput.value)
        document.getElementById('d-naiss').innerText = new Date(birthInput.value).toLocaleDateString('fr-FR');
    else
        document.getElementById('d-naiss').innerText = '...';

    /* ── Entreprise ── */
    const entreprise = document.getElementById('f-entreprise');
    if (entreprise) document.getElementById('d-entreprise').innerText = entreprise.value || '...';

    /* ── Données Médecin (Préparées pour les blocs de texte) ── */
    const medecin   = document.getElementById('f-medecin').value || 'DOCTEUR';
    document.getElementById('d-sig').innerText = medecin;

    const medPrenom = document.getElementById('f-med-prenom')?.value.trim() || '';
    const medNom    = document.getElementById('f-med-nom')?.value.trim().toUpperCase() || '';
    const medLabel  = [medPrenom, medNom].filter(Boolean).join(' ');
    const drLabel   = medLabel ? `Dr. ${medLabel}` : medecin;
    
    const fonction = document.getElementById('f-fonction')?.value.trim() || 'Médecin';
    const genre    = document.getElementById('f-genre')?.value || 'm';
    const lePatient = genre === 'f' ? 'la patiente' : 'le patient';

    /* ── Conclusion (certificats classiques) ── */
    if (showConcl) {
        const c = document.querySelector('input[name="concl"]:checked').value;
        let texteFinal = "";
        if (c === "Apte")     texteFinal = "Apte — Aucune contre-indication clinique.";
        else if (c === "Réserve") {
            const motif = document.getElementById('f-motif-reserve').value;
            texteFinal = "Apte avec réserve" + (motif ? ` — ${motif}` : ".");
        } else if (c === "Inapte") {
            const motif = document.getElementById('f-motif-inapte').value;
            texteFinal = "Inapte" + (motif ? ` — ${motif}` : ".");
        }
        document.getElementById('d-concl').innerText = texteFinal;
    }

    /* ── Divers ── */
    if (showDivers) {
        document.getElementById('d-divers-text').innerText = document.getElementById('f-divers').value || '...';
    }

    /* ── Arrêt de travail ── */
    if (showArret) {
        const debut   = document.getElementById('f-arret-debut')?.value;
        const fin     = document.getElementById('f-arret-fin')?.value;
        const jours   = document.getElementById('f-arret-jours')?.value;
        const motif   = document.getElementById('f-arret-motif')?.value || '';
        
        const debutFR = fmtDateFR(debut);
        const finFR   = fmtDateFR(fin);
        const duree   = jours ? `${jours} jour${parseInt(jours) > 1 ? 's' : ''}` : '...';

        const texte = `Je soussigné(e), ${drLabel}, ${fonction} de l'Ocean Medical Center, certifie avoir examiné ce jour ${lePatient} ${fullName || '...'} et prescris un arrêt de travail d'une durée de ${duree}, du ${debutFR} au ${finFR} inclus.${motif ? `\n\nMotif médical : ${motif}` : ''}\n\n ${lePatient} est invité à se représenter à la fin de cette période si nécessaire.`;

        const el = document.getElementById('d-arret-text');
        if (el && !el._userEdited) el.innerText = texte;
    }

    /* ── Rendez-vous médical ── */
    if (showRdv) {
        const dateRdv  = document.getElementById('f-rdv-date')?.value;
        const heureRdv = document.getElementById('f-rdv-heure')?.value || '...';
        const motifRdv = document.getElementById('f-rdv-motif')?.value || '';

        const dateFR = dateRdv
            ? new Date(dateRdv).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
            : '...';

        const texte = `Je soussigné(e), ${drLabel}, ${fonction} de l'Ocean Medical Center, certifie avoir reçu ce jour en rendez-vous médical ${lePatient} ${fullName || '...'}, le ${dateFR} à ${heureRdv}.${motifRdv ? `\n\nMotif de consultation : ${motifRdv}` : ''}`;

        const el = document.getElementById('d-rdv-text');
        if (el && !el._userEdited) el.innerText = texte;
    }

    /* ── Logique Prêt de matériel ── */
    if (showPret) {
        const debut = document.getElementById('f-arret-debut')?.value;
        const fin   = document.getElementById('f-arret-fin')?.value;
        const jours = document.getElementById('f-arret-jours')?.value || '...';
        
        const texte = `Je soussigné(e), ${drLabel}, ${fonction}, certifie le prêt d'un **Fauteuil Roulant Standard** à l'usage exclusif de ${lePatient} ${fullName || '...'} pour une durée de ${jours} jour(s).

Le matériel est mis à disposition du ${fmtDateFR(debut)} au ${fmtDateFR(fin)} inclus.

**CONDITIONS DE PRÊT :**
1. Le matériel doit être restitué à l'Ocean Medical Center au plus tard le ${fmtDateFR(fin)}.
2. En cas de non-restitution, de dégradation volontaire ou de perte, une facture forfaitaire de **10 000$** sera automatiquement émise au nom du bénéficiaire.
3. Le bénéficiaire s'engage à utiliser le matériel avec soin et uniquement dans le cadre de sa convalescence.`;

        const el = document.getElementById('d-pret-text');
        if (el && !el._userEdited) el.innerText = texte;
    }

    /* ── Observations ── */
    const obs = document.getElementById('f-observations')?.value.trim() || '';
    document.getElementById('doc-observations-block').style.display = obs ? 'block' : 'none';
    document.getElementById('d-observations-text').innerText = obs;
}

    

    /* ── Observations complémentaires ── */
    const obs     = document.getElementById('f-observations')?.value.trim() || '';
    const docObs  = document.getElementById('doc-observations-block');
    const docObsT = document.getElementById('d-observations-text');
    if (docObs)  docObs.style.display = obs ? 'block' : 'none';
    if (docObsT) docObsT.innerText    = obs;


function genererReference() {
    const n   = new Date();
    const ref = `${n.getDate()}${n.getMonth()+1}${n.getHours()}${n.getMinutes()}`;
    if (document.getElementById('d-ref'))  document.getElementById('d-ref').innerText = "#" + ref;
    if (document.getElementById('qr-ref')) document.getElementById('qr-ref').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OMC-CERT-${ref}`;
}

function upDate(targetId, val) {
    if (!val) return;
    document.getElementById(targetId).innerText = new Date(val).toLocaleDateString('fr-FR');
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const isEdit    = urlParams.get('mode') === 'edit';

    if (document.getElementById('d-date')) {
        const today = new Date();
        document.getElementById('d-date').innerText = today.toLocaleDateString('fr-FR');
        if (!isEdit) {
            const dateInput = document.querySelector('input[oninput*="d-date"]');
            if (dateInput) dateInput.valueAsDate = today;
        }
    }

    genererReference();

    /* ── Détection édition manuelle des blocs contenteditable ── */
    ['d-arret-text', 'd-rdv-text', 'd-pret-text'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', () => { el._userEdited = true; });
        el.addEventListener('dblclick', () => {
            if (el._userEdited) {
                el._userEdited = false;
                updateCertif();
                el.style.background = '#f0fdf4';
                setTimeout(() => { el.style.background = ''; }, 600);
            }
        });
        el.setAttribute('title', 'Cliquez pour modifier · Double-clic pour réinitialiser le texte auto');
    });

    /* ── Si l'utilisateur tape dans le champ signataire, désactive l'auto-fill ── */
    const champSig = document.getElementById('f-medecin');
    if (champSig) {
        champSig.addEventListener('input', () => { champSig._autoFilled = false; });
    }

    if (isEdit) {
        const data = JSON.parse(localStorage.getItem('edit_snapshot'));
        if (data) {
            Object.keys(data).forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    if (el.type === 'checkbox' || el.type === 'radio') el.checked = data[id];
                    else el.value = data[id];
                }
            });
            if (data.patientName) splitAndFillName(data.patientName);
            setTimeout(() => { toggleMotifs(); updateCertif(); }, 100);
            localStorage.removeItem('edit_snapshot');
        }
    } else {
        const patientFromUrl = urlParams.get('patient');
        if (patientFromUrl) { splitAndFillName(decodeURIComponent(patientFromUrl)); updateCertif(); }
    }
};

function splitAndFillName(fullName) {
    if (!fullName) return;
    const parts  = fullName.trim().split(/\s+/);
    const nom    = parts.length > 1 ? parts[parts.length - 1].toUpperCase() : '';
    const prenom = parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0];
    const prenomInput = document.getElementById('patientPrenom');
    const nomInput    = document.getElementById('patientNom');
    if (prenomInput) prenomInput.value = prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase();
    if (nomInput)    nomInput.value    = nom;
    if (typeof buildFullName === 'function') buildFullName();
}