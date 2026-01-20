const IMGBB_API_KEY = "TA_CLE_IMGBB";
const DISCORD_WEBHOOK = "TON_WEBHOOK_DISCORD";
let lastImageUrl = "";

// Fonction pour générer la référence (JOUR MOIS HEURE MINUTE)
function generateRef() {
    const now = new Date();
    const j = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return j + m + h + min;
}

function updateCertif() {
    const type = document.getElementById('f-type').value;
    const blocEntreprise = document.getElementById('box-entreprise');
    const blocConclRadio = document.getElementById('concl-radio-group'); // Le groupe radio dans la sidebar
    const blocConclDoc = document.getElementById('concl-area-doc'); // La zone conclusion sur le doc
    const blocDiversDoc = document.getElementById('divers-area-doc'); // Nouveau bloc texte libre
    const inputDivers = document.getElementById('f-divers-group'); // Groupe input sidebar

    // Reset l'affichage par défaut
    blocEntreprise.style.display = "block";
    blocConclDoc.style.display = "block";
    inputDivers.style.display = "none";
    if(blocDiversDoc) blocDiversDoc.style.display = "none";

    // 1. Logique selon le type
    if (type === "Port d'arme (PPA)") {
        blocEntreprise.style.display = "none";
        document.getElementById('d-titre-doc').innerText = "EXAMEN CAPACITÉ PPA";
    } 
    else if (type === "Divers") {
        blocEntreprise.style.display = "none";
        blocConclDoc.style.display = "none"; // On enlève les 3 points (Apte/Inapte)
        inputDivers.style.display = "block"; // On affiche le champ de texte libre
        if(blocDiversDoc) blocDiversDoc.style.display = "block";
        document.getElementById('d-titre-doc').innerText = "CERTIFICAT MÉDICAL";
    } 
    else {
        document.getElementById('d-titre-doc').innerText = type.toUpperCase();
    }

    // 2. Mise à jour des textes
    document.getElementById('d-nom').innerText = document.getElementById('f-nom').value || "...";
    document.getElementById('d-entreprise').innerText = document.getElementById('f-entreprise').value || "...";
    document.getElementById('d-medecin').innerText = "Dr. " + (document.getElementById('f-medecin').value || "");
    document.getElementById('d-ref').innerText = "#" + generateRef();

    // Gestion de la conclusion (si pas en mode Divers)
    if (type !== "Divers") {
        const concl = document.querySelector('input[name="concl"]:checked').value;
        document.getElementById('d-concl').innerText = (concl === "Apte") ? 
            "Apte — L'examen clinique ne présente aucune contre-indication." : 
            (concl === "Inapte" ? "Inapte — Contre-indications cliniques majeures." : "Apte avec réserve.");
    } else {
        // Texte libre pour le mode Divers
        document.getElementById('d-divers-text').innerText = document.getElementById('f-divers').value || "...";
    }
}

// Fonction pour les dates (DDN et Visite)
function upDate(targetId, val) {
    if(!val) return;
    const date = new Date(val);
    const formatted = date.toLocaleDateString('fr-FR');
    document.getElementById(targetId).innerText = formatted;
}

// Génération Image
async function genererImage() {
    const doc = document.getElementById('document');
    const canvas = await html2canvas(doc, { scale: 2 });
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
        document.getElementById('preview-img-result').src = lastImageUrl;
        document.getElementById('direct-link').value = lastImageUrl;
        document.getElementById('image-popup').style.display = 'flex';
    }
}

// Envoi Discord
function envoyerDiscord() {
    if(!lastImageUrl) return alert("Génère l'image d'abord !");
    
    fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            embeds: [{
                title: "Nouveau Certificat Médical",
                fields: [
                    { name: "Patient", value: document.getElementById('d-nom').innerText, inline: true },
                    { name: "Médecin", value: document.getElementById('d-medecin').innerText, inline: true }
                ],
                image: { url: lastImageUrl },
                color: 3447003
            }]
        })
    }).then(() => alert("Certificat envoyé avec succès !"));
}

function closePopup() { document.getElementById('image-popup').style.display = 'none'; }

// Init Date du jour à l'ouverture
document.getElementById('d-date').innerText = new Date().toLocaleDateString('fr-FR');
