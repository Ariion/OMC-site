const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 
let lastImageUrl = ""; 

// Gère l'affichage des listes de motifs selon la conclusion cochée
function toggleMotifs() {
    const concl = document.querySelector('input[name="concl"]:checked').value;
    
    // On affiche le menu correspondant à la sélection
    if(document.getElementById('motif-reserve-group')) {
        document.getElementById('motif-reserve-group').style.display = (concl === "Réserve") ? "block" : "none";
    }
    if(document.getElementById('motif-inapte-group')) {
        document.getElementById('motif-inapte-group').style.display = (concl === "Inapte") ? "block" : "none";
    }
    
    updateCertif();
}

function updateCertif() {
    const type = document.getElementById('f-type').value;
    
    // Visibilité des blocs
    document.getElementById('side-entreprise-block').style.display = (type === "Aptitude professionnelle") ? "block" : "none";
    document.getElementById('doc-entreprise-block').style.display = (type === "Aptitude professionnelle") ? "block" : "none";
    
    document.getElementById('side-concl-block').style.display = (type !== "Divers") ? "block" : "none";
    document.getElementById('doc-concl-block').style.display = (type !== "Divers") ? "block" : "none";
    
    document.getElementById('side-divers-block').style.display = (type === "Divers") ? "block" : "none";
    document.getElementById('doc-divers-block').style.display = (type === "Divers") ? "block" : "none";

    // Titres
    const titres = {
        "Aptitude professionnelle": "CERTIFICAT D'APTITUDE PROFESSIONNELLE",
        "Port d'arme (PPA)": "CERTIFICAT DE CAPACITÉ À PASSER L'EXAMEN DU PPA",
        "Divers": "CERTIFICAT — DIVERS"
    };
    document.getElementById('d-titre-doc').innerText = titres[type] || "CERTIFICAT MÉDICAL";

    // --- CORRECTION MAJEURE ICI (LIAISON) ---
    // On prend les nouveaux IDs (patientName, patientBirth)
    const inputNom = document.getElementById('patientName');
    const inputDate = document.getElementById('patientBirth');

    document.getElementById('d-nom').innerText = inputNom && inputNom.value ? inputNom.value : "...";
    
    // Pour la date, on formate si elle existe
    if(inputDate && inputDate.value) {
        document.getElementById('d-naiss').innerText = new Date(inputDate.value).toLocaleDateString('fr-FR');
    } else {
        document.getElementById('d-naiss').innerText = "...";
    }
    // ----------------------------------------

    document.getElementById('d-entreprise').innerText = document.getElementById('f-entreprise').value || "...";
    document.getElementById('d-sig').innerText = document.getElementById('f-medecin').value || "DOCTEUR";

    // Conclusions
    if (type !== "Divers") {
        const c = document.querySelector('input[name="concl"]:checked').value;
        let texteFinal = "";

        if (c === "Apte") texteFinal = "Apte — Aucune contre-indication clinique.";
        else if (c === "Réserve") {
            const motif = document.getElementById('f-motif-reserve').value;
            texteFinal = "Apte avec réserve" + (motif ? ` — ${motif}` : ".");
        } 
        else if (c === "Inapte") {
            const motif = document.getElementById('f-motif-inapte').value;
            texteFinal = "Inapte" + (motif ? ` — ${motif}` : ".");
        }
        document.getElementById('d-concl').innerText = texteFinal;
    } else {
        document.getElementById('d-divers-text').innerText = document.getElementById('f-divers').value || "...";
    }
}

function genererReference() {
    const n = new Date();
    const ref = `${n.getDate()}${n.getMonth()+1}${n.getHours()}${n.getMinutes()}`;
    
    if(document.getElementById('d-ref')) {
        document.getElementById('d-ref').innerText = "#" + ref;
    }
    if(document.getElementById('qr-ref')) {
        document.getElementById('qr-ref').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OMC-CERT-${ref}`;
    }
}

// Fonction utilitaire pour mise à jour rapide date (gardée pour compatibilité)
function upDate(targetId, val) {
    if(!val) return;
    document.getElementById(targetId).innerText = new Date(val).toLocaleDateString('fr-FR');
}

// --- INIT & AUTOCOMPLETE ---
window.onload = function() {
    // Date du jour auto
    if(document.getElementById('d-date')) {
        const today = new Date();
        document.getElementById('d-date').innerText = today.toLocaleDateString('fr-FR');
        // On remplit aussi l'input date du jour s'il existe (optionnel)
        const dateInput = document.querySelector('input[oninput*="d-date"]');
        if(dateInput) dateInput.valueAsDate = today;
    }
    
    genererReference();
    toggleMotifs(); 

    // SYSTÈME DE PATIENT CENTRALISÉ
    setupPatientAutocomplete({
        nameId: 'patientName',
        birthId: 'patientBirth',
        callback: function(p) {
            // Force la mise à jour visuelle après avoir cliqué sur un nom
            updateCertif();
        }
    });
};

// ... (Garde tes fonctions genererImage, envoyerDiscord, copyLink, closePopup inchangées en dessous) ...
async function genererImage() {
    const doc = document.getElementById('document');
    const btn = event.target;
    btn.innerText = "CROP & UPLOAD...";
    btn.disabled = true;

    try {
        const canvas = await html2canvas(doc, { 
            scale: 2, 
            useCORS: true, 
            backgroundColor: "#ffffff",
            height: doc.scrollHeight, 
            windowHeight: doc.scrollHeight,
            y: 0,
            scrollX: 0,
            scrollY: 0
        });

        const imageData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        const formData = new FormData();
        formData.append("image", imageData);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            lastImageUrl = result.data.url;
            document.getElementById('direct-link').value = lastImageUrl;
            document.getElementById('preview-img-result').src = lastImageUrl;
            document.getElementById('image-popup').style.display = 'flex';
        }
    } catch (e) {
        alert("Erreur lors de la génération.");
    } finally {
        btn.innerText = "🖼️ GÉNÉRER L'IMAGE (lien)";
        btn.disabled = false;
    }
}

async function envoyerDiscord() {
    const url = "https://discord.com/api/webhooks/1421827797965471855/aBgwIgdIRP3TO0Qp_culr5GJHVLDRnwtKnxjv7N62ThG8L_bRQ1gwsqV_aYXhu4eCHa2";
    const btn = document.getElementById('discord-btn');
    const doc = document.getElementById('document');
    
    btn.disabled = true;
    btn.innerText = "CAPTURE...";

    try {
        const canvas = await html2canvas(doc, { scale: 2, useCORS: true });
        
        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            const nom = document.getElementById('d-nom').innerText || "Inconnu";
            const typeDoc = document.getElementById('d-titre-doc').innerText || "Certificat";

            formData.append("payload_json", JSON.stringify({
                thread_name: `📝 ${typeDoc} - ${nom}`,
                content: `📜 **Nouveau Rapport Médical**\n👤 Patient : ${nom}\n📋 Type : ${typeDoc}`
            }));

            formData.append("file", blob, "certificat.png");
            
            const response = await fetch(url + "?wait=true", { method: 'POST', body: formData });
            
            if(response.ok) {
                alert("✅ Certificat envoyé !");
                btn.innerText = "ENVOYÉ";
            }
            btn.disabled = false;
        }, 'image/png');
    } catch (e) {
        alert("Erreur envoi Discord.");
        btn.disabled = false;
        btn.innerText = "RÉESSAYER";
    }
}

function copyLink() {
    const copyText = document.getElementById("direct-link");
    copyText.select();
    document.execCommand("copy");
    alert("Lien copié !");
}

function closePopup() {
    document.getElementById('image-popup').style.display = 'none';
}
