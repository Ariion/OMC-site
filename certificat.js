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
    const sideEnt = document.getElementById('side-entreprise-block');
    const sideConcl = document.getElementById('side-concl-block');
    const sideDiv = document.getElementById('side-divers-block');
    const docEnt = document.getElementById('doc-entreprise-block');
    const docConcl = document.getElementById('doc-concl-block');
    const docDiv = document.getElementById('doc-divers-block');

    // Visibilité des blocs de saisie et de document
    sideEnt.style.display = (type === "Aptitude professionnelle") ? "block" : "none";
    docEnt.style.display = (type === "Aptitude professionnelle") ? "block" : "none";
    sideConcl.style.display = (type !== "Divers") ? "block" : "none";
    docConcl.style.display = (type !== "Divers") ? "block" : "none";
    sideDiv.style.display = (type === "Divers") ? "block" : "none";
    docDiv.style.display = (type === "Divers") ? "block" : "none";

    // RÉTABLISSEMENT DES TITRES EXACTS (Majuscules et Accents)
    const titres = {
        "Aptitude professionnelle": "CERTIFICAT D'APTITUDE PROFESSIONNELLE",
        "Port d'arme (PPA)": "CERTIFICAT DE CAPACITÉ À PASSER L'EXAMEN DU PPA",
        "Divers": "CERTIFICAT — DIVERS"
    };
    document.getElementById('d-titre-doc').innerText = titres[type] || "CERTIFICAT MÉDICAL";

    // Mise à jour des textes de base
    document.getElementById('d-nom').innerText = document.getElementById('f-nom').value || "...";
    document.getElementById('d-entreprise').innerText = document.getElementById('f-entreprise').value || "...";
    document.getElementById('d-sig').innerText = document.getElementById('f-medecin').value || "DOCTEUR";

    // GESTION DES CONCLUSIONS AVEC MOTIFS RAPIDES
    if (type !== "Divers") {
        const c = document.querySelector('input[name="concl"]:checked').value;
        let texteFinal = "";

        if (c === "Apte") {
            texteFinal = "Apte — Aucune contre-indication clinique.";
        } 
        else if (c === "Réserve") {
            const motif = document.getElementById('f-motif-reserve').value;
            // Si un motif est choisi, on l'ajoute à la phrase
            texteFinal = "Apte avec réserve" + (motif ? ` — ${motif}` : ".");
        } 
        else if (c === "Inapte") {
            const motif = document.getElementById('f-motif-inapte').value;
            // Si un motif est choisi, on l'ajoute à la phrase
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
    if(refEl) {
        refEl.innerText = "#" + ref;
        refEl.style.color = "#1e293b"; 
    }
    
    const qrImg = document.getElementById('qr-ref');
    if(qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OMC-CERT-${ref}`;
    }
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
        // Correction du crop : On utilise les dimensions exactes du contenu
        const canvas = await html2canvas(doc, { 
            scale: 2, 
            useCORS: true, 
            backgroundColor: "#ffffff",
            // Ces deux lignes règlent le problème du crop et du blanc inutile :
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
    const webhookUrl = "https://discord.com/api/webhooks/1462416189526638613/iMpoe9mn6DC4j_0eBS4tOVjaDo_jy1MhfSKIEP80H7Ih3uYGHRcJ5kQSqIFuL0DTqlUy";
    const btn = document.getElementById('discord-btn');
    const doc = document.getElementById('document');
    
    btn.disabled = true;
    btn.innerText = "CAPTURING...";

    try {
        const canvas = await html2canvas(doc, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            const nom = document.getElementById('d-nom').innerText || "Inconnu";
            const typeDoc = document.getElementById('d-titre-doc').innerText;
            
            const payload = {
                content: `📜 **NOUVEAU RAPPORT MÉDICAL**\n👤 **Patient :** ${nom}\n📋 **Type :** ${typeDoc}`,
                embeds: [{
                    color: 3066993,
                    image: { url: "attachment://certificat.png" }
                }]
            };

            formData.append("payload_json", JSON.stringify(payload));
            formData.append("file", blob, "certificat.png");
            
            await fetch(webhookUrl, { method: 'POST', body: formData });
            alert("✅ Envoyé avec succès !");
            btn.innerText = "ENVOYÉ";
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

window.onload = function() {
    if(document.getElementById('d-date')) {
        document.getElementById('d-date').innerText = new Date().toLocaleDateString('fr-FR');
    }
    genererReference();
    toggleMotifs(); // Lance l'initialisation des titres et motifs
};
