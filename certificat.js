// Clé API ImgBB
const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 
let lastImageUrl = ""; // Stocke l'URL de l'image générée

function updateCertif() { 
    const type = document.getElementById('f-type').value;
    
    // Sidebar elements
    const sideEnt = document.getElementById('side-entreprise-block');
    const sideConcl = document.getElementById('side-concl-block');
    const sideDiv = document.getElementById('side-divers-block');
     
    // Document elements
    const docEnt = document.getElementById('doc-entreprise-block');
    const docConcl = document.getElementById('doc-concl-block');
    const docDiv = document.getElementById('doc-divers-block');

    // --- LOGIQUE DE FILTRAGE ---
    if (type === "Aptitude professionnelle") {
        sideEnt.style.display = "block"; sideConcl.style.display = "block"; sideDiv.style.display = "none";
        docEnt.style.display = "block"; docConcl.style.display = "block"; docDiv.style.display = "none";
        document.getElementById('d-titre-doc').innerText = "APTITUDE PROFESSIONNELLE";
    } 
    else if (type === "Port d'arme (PPA)") {
        sideEnt.style.display = "none"; sideConcl.style.display = "block"; sideDiv.style.display = "none";
        docEnt.style.display = "none"; docConcl.style.display = "block"; docDiv.style.display = "none";
        document.getElementById('d-titre-doc').innerText = "CAPACITÉ EXAMEN PPA";
    } 
    else if (type === "Divers") {
        sideEnt.style.display = "none"; sideConcl.style.display = "none"; sideDiv.style.display = "block";
        docEnt.style.display = "none"; docConcl.style.display = "none"; docDiv.style.display = "block";
        document.getElementById('d-titre-doc').innerText = "CERTIFICAT MÉDICAL DIVERS";
    }

    // --- MISE À JOUR DES DONNÉES ---
    document.getElementById('d-nom').innerText = document.getElementById('f-nom').value || "...";
    document.getElementById('d-entreprise').innerText = document.getElementById('f-entreprise').value || "...";
    document.getElementById('d-medecin').innerText = "Dr. " + (document.getElementById('f-medecin').value || "");
    
    // Référence JJMMHHmm
    const now = new Date();
    const ref = String(now.getDate()).padStart(2,'0') + String(now.getMonth()+1).padStart(2,'0') + String(now.getHours()).padStart(2,'0') + String(now.getMinutes()).padStart(2,'0');
    document.getElementById('d-ref').innerText = "#" + ref;

    // Conclusion ou Texte libre
    if (type !== "Divers") {
        const c = document.querySelector('input[name="concl"]:checked').value;
        document.getElementById('d-concl').innerText = (c === "Apte") ? "Apte — Aucune contre-indication clinique." : (c === "Inapte" ? "Inapte — Contre-indications majeures." : "Apte avec réserve.");
    } else {
        document.getElementById('d-divers-text').innerText = document.getElementById('f-divers').value || "...";
    }
}

function upDate(targetId, val) {
    if(!val) return;
    document.getElementById(targetId).innerText = new Date(val).toLocaleDateString('fr-FR');
}

async function genererImage() {
    const doc = document.getElementById('document');
    const btn = event.target;
    btn.innerText = "GÉNÉRATION...";
    btn.disabled = true;

    try {
        const canvas = await html2canvas(doc, { 
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff"
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
        console.error(e);
        alert("Erreur lors de la création de l'image.");
    } finally {
        btn.innerText = "🖼️ GÉNÉRER L'IMAGE";
        btn.disabled = false;
    }
}

function closePopup() {
    document.getElementById('image-popup').style.display = 'none';
}

async function envoyerDiscord() {
    const webhookUrl = "https://discord.com/api/webhooks/1462416189526638613/iMpoe9mn6DC4j_0eBS4tOVjaDo_jy1MhfSKIEP80H7Ih3uYGHRcJ5kQSqIFuL0DTqlUy";
    const btn = event.target;
    const nomPatient = document.getElementById('d-nom').innerText;
    const typeDoc = document.getElementById('d-titre-doc').innerText;

    // On vérifie si l'image a été générée
    if (!lastImageUrl) {
        alert("❌ Veuillez d'abord cliquer sur 'GÉNÉRER L'IMAGE'");
        return;
    }

    btn.disabled = true;
    btn.innerText = "ENVOI EN COURS...";

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: `📜 **NOUVEAU CERTIFICAT MÉDICAL**`,
                embeds: [{
                    title: typeDoc,
                    color: 3066993, // Vert médical
                    fields: [
                        { name: "👤 Patient", value: nomPatient, inline: true },
                        { name: "📅 Date", value: document.getElementById('d-date').innerText, inline: true }
                    ],
                    image: { url: lastImageUrl }
                }]
            })
        });

        if (response.ok) {
            alert("✅ Certificat envoyé sur l'intranet !");
            btn.innerText = "ENVOYÉ";
        } else {
            alert("❌ Erreur lors de l'envoi.");
            btn.disabled = false;
            btn.innerText = "Envoyer Discord";
        }
    } catch (e) {
        console.error(e);
        alert("❌ Erreur de connexion.");
        btn.disabled = false;
    }
}
