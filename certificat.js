const IMGBB_API_KEY = "TA_CLE_IMGBB";
const DISCORD_WEBHOOK = "TON_WEBHOOK_DISCORD";
let lastImageUrl = "";

// Génération de la référence : JOUR MOIS HEURE MINUTE (JJMMHHmm)
function generateRef() {
    const now = new Date();
    const j = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return j + m + h + min;
}

function updateCertif() {
    // Récupération du type de certificat
    const type = document.getElementById('f-type').value;
    
    // Éléments de la Sidebar (Saisie)
    const sideEntreprise = document.getElementById('f-entreprise-group');
    const sideConcl = document.getElementById('f-concl-group');
    const sideDivers = document.getElementById('f-divers-group');
    
    // Éléments du Document (Preview)
    const docBoxEntreprise = document.getElementById('d-box-entreprise');
    const docAreaConcl = document.getElementById('d-concl-area');
    const docAreaDivers = document.getElementById('d-divers-area');

    // --- RESET PAR DÉFAUT ---
    sideEntreprise.style.display = "block";
    sideConcl.style.display = "block";
    sideDivers.style.display = "none";
    
    docBoxEntreprise.style.display = "block";
    docAreaConcl.style.display = "block";
    docAreaDivers.style.display = "none";

    // --- LOGIQUE D'AFFICHAGE DYNAMIQUE ---
    if (type === "Port d'arme (PPA)") {
        // Mode PPA : On cache juste l'entreprise
        sideEntreprise.style.display = "none";
        docBoxEntreprise.style.display = "none";
        document.getElementById('d-titre-doc').innerText = "CAPACITÉ EXAMEN PPA";
    } 
    else if (type === "Divers") {
        // Mode Divers : On cache entreprise + conclusion, on montre le texte libre
        sideEntreprise.style.display = "none";
        sideConcl.style.display = "none";
        sideDivers.style.display = "block";
        
        docBoxEntreprise.style.display = "none";
        docAreaConcl.style.display = "none";
        docAreaDivers.style.display = "block";
        
        document.getElementById('d-titre-doc').innerText = "CERTIFICAT MÉDICAL";
    } 
    else {
        // Mode Normal (Aptitude pro / sport)
        document.getElementById('d-titre-doc').innerText = type.toUpperCase();
    }

    // --- MISE À JOUR DES TEXTES ---
    document.getElementById('d-nom').innerText = document.getElementById('f-nom').value || "...";
    document.getElementById('d-entreprise').innerText = document.getElementById('f-entreprise').value || "...";
    document.getElementById('d-medecin').innerText = "Dr. " + (document.getElementById('f-medecin').value || "");
    
    // Référence auto-générée
    document.getElementById('d-ref').innerText = "#" + generateRef();

    // Conclusion (uniquement si pas en mode Divers)
    if (type !== "Divers") {
        const selectedConcl = document.querySelector('input[name="concl"]:checked').value;
        let finalConcl = "";
        if(selectedConcl === "Apte") finalConcl = "Apte — L'examen clinique ne présente aucune contre-indication.";
        else if(selectedConcl === "Inapte") finalConcl = "Inapte — Présente des contre-indications cliniques majeures.";
        else finalConcl = "Apte avec réserve — Nécessite un suivi ou aménagement particulier.";
        
        document.getElementById('d-concl').innerText = finalConcl;
    } else {
        // Remplissage du texte libre
        document.getElementById('d-divers-text').innerText = document.getElementById('f-divers').value || "...";
    }
}

// Mise à jour des dates (Naissance et Visite)
function upDate(targetId, val) {
    if(!val) return;
    const date = new Date(val);
    const formatted = date.toLocaleDateString('fr-FR');
    document.getElementById(targetId).innerText = formatted;
}

// Génération de l'image (html2canvas)
async function genererImage() {
    const doc = document.getElementById('document');
    const canvas = await html2canvas(doc, { 
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
    });
    
    const imageData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
    const formData = new FormData();
    formData.append("image", imageData);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: "POST",
            body: formData
        });
        const result = await response.json();

        if (result.success) {
            lastImageUrl = result.data.url;
            document.getElementById('preview-img-result').src = lastImageUrl;
            document.getElementById('direct-link').value = lastImageUrl;
            document.getElementById('image-popup').style.display = 'flex';
        } else {
            alert("Erreur ImgBB : " + result.error.message);
        }
    } catch (err) {
        alert("Erreur de connexion : " + err);
    }
}

// Envoi vers le Webhook Discord
function envoyerDiscord() {
    if(!lastImageUrl) return alert("Veuillez générer l'image avant d'envoyer !");
    
    fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            embeds: [{
                title: "📜 NOUVEAU CERTIFICAT MÉDICAL",
                description: `**Patient :** ${document.getElementById('d-nom').innerText}\n**Type :** ${document.getElementById('f-type').value}`,
                image: { url: lastImageUrl },
                footer: { text: "Système Médical OMC" },
                color: 3447003
            }]
        })
    }).then(() => alert("Certificat envoyé sur Discord !"));
}

function closePopup() { 
    document.getElementById('image-popup').style.display = 'none'; 
}

// Initialisation au chargement
window.onload = function() {
    document.getElementById('d-date').innerText = new Date().toLocaleDateString('fr-FR');
};
