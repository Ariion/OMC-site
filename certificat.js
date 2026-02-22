// ══════════════════════════════════════════════════════════════
//  certificat.js — OMC Medical Center
//  Adapté pour champs Prénom / NOM séparés
// ══════════════════════════════════════════════════════════════

// Gère l'affichage des listes de motifs selon la conclusion cochée
function toggleMotifs() {
    const concl = document.querySelector('input[name="concl"]:checked').value;
    
    if (document.getElementById('motif-reserve-group')) {
        document.getElementById('motif-reserve-group').style.display = (concl === "Réserve") ? "block" : "none";
    }
    if (document.getElementById('motif-inapte-group')) {
        document.getElementById('motif-inapte-group').style.display = (concl === "Inapte") ? "block" : "none";
    }
    
    updateCertif();
}

function updateCertif() {
    const type = document.getElementById('f-type').value;
    
    // Blocs conditionnels selon le type
    document.getElementById('side-entreprise-block').style.display = (type === "Aptitude professionnelle") ? "block" : "none";
    document.getElementById('doc-entreprise-block').style.display  = (type === "Aptitude professionnelle") ? "block" : "none";
    document.getElementById('side-concl-block').style.display      = (type !== "Divers") ? "block" : "none";
    document.getElementById('doc-concl-block').style.display       = (type !== "Divers") ? "block" : "none";
    document.getElementById('side-divers-block').style.display     = (type === "Divers") ? "block" : "none";
    document.getElementById('doc-divers-block').style.display      = (type === "Divers") ? "block" : "none";

    // Titre du document selon le type
    const titres = {
        "Aptitude professionnelle": "CERTIFICAT D'APTITUDE PROFESSIONNELLE",
        "Port d'arme (PPA)":        "CERTIFICAT DE CAPACITÉ À PASSER L'EXAMEN DU PPA",
        "Divers":                   "CERTIFICAT — DIVERS"
    };
    document.getElementById('d-titre-doc').innerText = titres[type] || "CERTIFICAT MÉDICAL";

    // ── Nom patient : lit les deux champs séparés ──
    // formatPrenom / formatNom sont définis dans certificat.html
    const prenomRaw = document.getElementById('patientPrenom')?.value.trim() || '';
    const nomRaw    = document.getElementById('patientNom')?.value.trim()    || '';
    const prenom    = typeof formatPrenom === 'function' ? formatPrenom(prenomRaw) : prenomRaw;
    const nom       = typeof formatNom    === 'function' ? formatNom(nomRaw)       : nomRaw.toUpperCase();
    const fullName  = [prenom, nom].filter(Boolean).join(' ');

    document.getElementById('d-nom').innerText = fullName || '...';

    // Sync champ caché (utilisé par generation.js pour Discord)
    const hiddenName = document.getElementById('patientName');
    if (hiddenName) hiddenName.value = fullName;

    // ── Date de naissance ──
    const birthInput = document.getElementById('patientBirth');
    if (birthInput && birthInput.value) {
        document.getElementById('d-naiss').innerText = new Date(birthInput.value).toLocaleDateString('fr-FR');
    } else {
        document.getElementById('d-naiss').innerText = '...';
    }

    // ── Entreprise ──
    const entreprise = document.getElementById('f-entreprise');
    if (entreprise) {
        document.getElementById('d-entreprise').innerText = entreprise.value || '...';
    }

    // ── Médecin ──
    document.getElementById('d-sig').innerText = document.getElementById('f-medecin').value || 'DOCTEUR';

    // ── Conclusion ou texte libre ──
    if (type !== "Divers") {
        const c = document.querySelector('input[name="concl"]:checked').value;
        let texteFinal = "";

        if (c === "Apte") {
            texteFinal = "Apte — Aucune contre-indication clinique.";
        } else if (c === "Réserve") {
            const motif = document.getElementById('f-motif-reserve').value;
            texteFinal = "Apte avec réserve" + (motif ? ` — ${motif}` : ".");
        } else if (c === "Inapte") {
            const motif = document.getElementById('f-motif-inapte').value;
            texteFinal = "Inapte" + (motif ? ` — ${motif}` : ".");
        }
        document.getElementById('d-concl').innerText = texteFinal;
    } else {
        document.getElementById('d-divers-text').innerText = document.getElementById('f-divers').value || '...';
    }
}

function genererReference() {
    const n = new Date();
    const ref = `${n.getDate()}${n.getMonth()+1}${n.getHours()}${n.getMinutes()}`;
    
    if (document.getElementById('d-ref')) {
        document.getElementById('d-ref').innerText = "#" + ref;
    }
    if (document.getElementById('qr-ref')) {
        document.getElementById('qr-ref').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OMC-CERT-${ref}`;
    }
}

function upDate(targetId, val) {
    if (!val) return;
    document.getElementById(targetId).innerText = new Date(val).toLocaleDateString('fr-FR');
}

// ══════════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════════
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const isEdit    = urlParams.get('mode') === 'edit';

    // Date du jour auto
    if (document.getElementById('d-date')) {
        const today = new Date();
        document.getElementById('d-date').innerText = today.toLocaleDateString('fr-FR');
        if (!isEdit) {
            const dateInput = document.querySelector('input[oninput*="d-date"]');
            if (dateInput) dateInput.valueAsDate = today;
        }
    }

    genererReference();

    // ── MODE ÉDITION : restauration depuis localStorage ──
    if (isEdit) {
        const data = JSON.parse(localStorage.getItem('edit_snapshot'));
        if (data) {
            console.log("Restauration des données du rapport...", data);

            Object.keys(data).forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    if (el.type === 'checkbox' || el.type === 'radio') {
                        el.checked = data[id];
                    } else {
                        el.value = data[id];
                    }
                }
            });

            // Si on a un patientName complet au format "Louis BRUNELLE",
            // on le décompose pour remplir les deux champs séparés
            if (data.patientName) {
                splitAndFillName(data.patientName);
            }

            setTimeout(() => {
                toggleMotifs();
                updateCertif();
            }, 100);

            localStorage.removeItem('edit_snapshot');
        }

    // ── MODE PRÉ-REMPLISSAGE depuis URL ?patient=Louis+BRUNELLE ──
    } else {
        const patientFromUrl = urlParams.get('patient');
        if (patientFromUrl) {
            splitAndFillName(decodeURIComponent(patientFromUrl));
            updateCertif();
        }
    }
};

/**
 * Reçoit "Louis BRUNELLE" et remplit patientPrenom + patientNom
 * Convention : le dernier mot en majuscules = NOM, le reste = prénom
 */
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