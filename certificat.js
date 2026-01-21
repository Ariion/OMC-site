const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 
let lastImageUrl = ""; 

// Affiche ou cache les menus de motifs selon la conclusion choisie
function toggleMotifs() {
    const concl = document.querySelector('input[name="concl"]:checked').value;
    document.getElementById('motif-reserve-group').style.display = (concl === "Réserve") ? "block" : "none";
    document.getElementById('motif-inapte-group').style.display = (concl === "Inapte") ? "block" : "none";
    updateCertif();
}

function updateCertif() {
    const type = document.getElementById('f-type').value;
    const sideEnt = document.getElementById('side-entreprise-block');
    const sideConcl = document.getElementById('side-concl-block');
    const sideDiv = document.getElementById('side-divers-block');
    const docEnt = document.getElementById('doc-entreprise-block');
    const docConcl = document.getElementById('doc-concl-block');
    const docDiv = document.getElementById('doc-divers-block');

    // Gestion de la visibilité des blocs
    sideEnt.style.display = (type === "Aptitude professionnelle") ? "block" : "none";
    docEnt.style.display = (type === "Aptitude professionnelle") ? "block" : "none";
    sideConcl.style.display = (type !== "Divers") ? "block" : "none";
    docConcl.style.display = (type !== "Divers") ? "block" : "none";
    sideDiv.style.display = (type === "Divers") ? "block" : "none";
    docDiv.style.display = (type === "Divers") ? "block" : "none";

    // Mise à jour des TITRES DYNAMIQUES (Majuscules avec accents)
    const titres = {
        "Aptitude professionnelle": "CERTIFICAT D'APTITUDE PROFESSIONNELLE",
        "Port d'arme (PPA)": "CERTIFICAT DE CAPACITÉ À PASSER L'EXAMEN DU PPA",
        "Divers": "CERTIFICAT — DIVERS"
    };
    document.getElementById('d-titre-doc').innerText = titres[type] || "CERTIFICAT MÉDICAL";

    // Mise à jour des informations patient et médecin
    document.getElementById('d-nom').innerText = document.getElementById('f-nom').value || "...";
    document.getElementById('d-entreprise').innerText = document.getElementById('f-entreprise').value || "...";
    document.getElementById('d-sig').innerText = document.getElementById('f-medecin').value || "DOCTEUR";

    // GESTION DE LA CONCLUSION ET DES MOTIFS RAPIDES
    if (type !== "Divers") {
        const concl = document.querySelector('input[name="concl"]:checked').value;
        let texteFinal = "";
        
        if (concl === "Apte") {
            texteFinal = "Apte — Aucune contre-indication clinique.";
        } 
        else if (concl === "Réserve") {
            const motif = document.getElementById('f-motif-reserve').value;
            texteFinal = "Apte avec réserve" + (motif ? ` — ${motif}` : ".");
        } 
        else if (concl === "Inapte") {
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
    const jj = n.getDate().toString().padStart(2, '0');
    const mm = (n.getMonth() + 1).toString().padStart(2, '0');
    const hh = n.getHours().toString().padStart(2, '0');
    const min = n.getMinutes().toString().padStart(2, '0');
    const ref = `${jj}${mm}${hh}${min}`;
    
    const refEl = document.getElementById('d-ref');
    refEl.innerText = "#" + ref;
    refEl.style.color = "#1e293b"; 
    
    document.getElementById('qr-ref').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OMC-CERT-${ref}`;
}

function upDate(targetId, val) {
    if(!val) return;
    document.getElementById(targetId).innerText = new Date(val).toLocaleDateString('fr-FR');
}

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
            height: doc.offsetHeight
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
    const webhookUrl = "
