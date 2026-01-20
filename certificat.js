const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 
const webhook = "https://discord.com/api/webhooks/1462416189526638613/iMpoe9mn6DC4j_0eBS4tOVjaDo_jy1MhfSKIEP80H7Ih3uYGHRcJ5kQSqIFuL0DTqlUy"; // À remplacer par ton lien
let lastImageUrl = "";

function updateCertif() {
    const nom = document.getElementById('f-nom').value || "...";
    const naiss = document.getElementById('f-naiss').value || "...";
    const entreprise = document.getElementById('f-entreprise').value || "...";
    const medecin = document.getElementById('f-medecin').value || "DOCTEUR";
    const type = document.getElementById('f-type').value;
    const concl = document.querySelector('input[name="concl"]:checked').value;

    document.getElementById('d-nom').innerText = nom;
    document.getElementById('d-naiss').innerText = naiss;
    document.getElementById('d-entreprise').innerText = entreprise;
    document.getElementById('d-medecin').innerText = medecin.toUpperCase();
    document.getElementById('d-titre-doc').innerText = "Certificat : " + type;

    let texte = "";
    if(concl === "Apte") texte = "Apte — L'examen clinique ne présente aucune contre-indication à l'activité citée.";
    else if(concl === "Inapte") texte = "Inapte — Le sujet présente des contre-indications médicales majeures pour cette activité.";
    else texte = "Apte avec réserve — Nécessite un aménagement de poste ou un suivi médical régulier.";
    
    document.getElementById('d-concl').innerText = texte;
}

async function genererImage() {
    const doc = document.getElementById('document');
    const btn = event.target;
    btn.innerText = "CHARGEMENT...";
    
    const canvas = await html2canvas(doc, { scale: 2, backgroundColor: "#ffffff" });
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
    btn.innerText = "🖼️ GÉNÉRER L'IMAGE (CROP)";
}

function envoyerDiscord() {
    if(!lastImageUrl) return alert("Génère l'image d'abord !");
    
    fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            embeds: [{
                title: "Nouveau Certificat Médical",
                description: `Patient: ${document.getElementById('d-nom').innerText}`,
                image: { url: lastImageUrl },
                color: 3447003
            }]
        })
    }).then(() => alert("Envoyé !"));
}

function closePopup() { document.getElementById('image-popup').style.display = 'none'; }

// Initialisation de la date
document.getElementById('d-date').innerText = new Date().toLocaleDateString();
