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
    // 1. Identité & Entreprise
    document.getElementById('d-nom').innerText = document.getElementById('f-nom').value || "...";
    document.getElementById('d-entreprise').innerText = document.getElementById('f-entreprise').value || "...";
    document.getElementById('d-medecin').innerText = "Dr. " + (document.getElementById('f-medecin').value || "");

    // 2. Type de certificat (Titre)
    const type = document.getElementById('f-type').value;
    document.getElementById('d-titre-doc').innerText = type.toUpperCase();

    // 3. Conclusion médicale
    const concl = document.querySelector('input[name="concl"]:checked').value;
    let texteConcl = "";
    if(concl === "Apte") texteConcl = "Apte — L'examen clinique ne présente aucune contre-indication.";
    else if(concl === "Inapte") texteConcl = "Inapte — Le sujet présente des contre-indications cliniques majeures.";
    else texteConcl = "Apte avec réserve — Nécessite un aménagement de poste ou un suivi régulier.";
    
    document.getElementById('d-concl').innerText = texteConcl;

    // 4. Mise à jour automatique de la Référence
    document.getElementById('d-ref').innerText = "#" + generateRef();
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
