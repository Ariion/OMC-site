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
// Clé API ImgBB (Remplace par la tienne pour que ça marche à 100%)
const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 

async function genererImage() {
    const doc = document.getElementById('document');
    const btn = event.target;
    btn.innerText = "CROP & UPLOAD...";
    btn.disabled = true;

    try {
        // html2canvas va maintenant suivre la hauteur réelle de l'élément #document
        const canvas = await html2canvas(doc, { 
            scale: 2,           // Haute qualité
            useCORS: true,      // Pour le QR Code
            backgroundColor: "#ffffff",
            height: doc.offsetHeight, // Force la capture à la hauteur réelle du texte
            windowHeight: doc.offsetHeight
        });

        const imageData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        const formData = new FormData();
        formData.append("image", imageData);

        // Envoi à ImgBB
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            document.getElementById('direct-link').value = result.data.url;
            document.getElementById('preview-img-result').src = result.data.url;
            document.getElementById('image-popup').style.display = 'flex';
        }

    } catch (e) {
        console.error(e);
        alert("Erreur lors du crop de l'image.");
    } finally {
        btn.innerText = "🖼️ GÉNÉRER L'IMAGE (CROP)";
        btn.disabled = false;
    }
}

function copyLink() {
    const copyText = document.getElementById("direct-link");
    copyText.select();
    document.execCommand("copy");
    alert("Lien copié ! Vous pouvez le coller en jeu.");
}

function closePopup() {
    document.getElementById('image-popup').style.display = 'none';
}

// Fonction d'envoi Discord
async function envoyerDiscord() {
    const url = "https://discord.com/api/webhooks/1462416189526638613/iMpoe9mn6DC4j_0eBS4tOVjaDo_jy1MhfSKIEP80H7Ih3uYGHRcJ5kQSqIFuL0DTqlUy";
    const btn = document.getElementById('discord-btn');
    const doc = document.getElementById('document');
    
    if(!doc) return alert("Erreur : Document introuvable");
    
    btn.disabled = true;
    btn.innerText = "CAPTURING...";

    try {
        // On utilise useCORS pour autoriser la capture d'images venant d'autres sites (comme le QR Code)
        // On ajoute logging pour voir les erreurs en console si besoin
        const canvas = await html2canvas(doc, { 
            scale: 2,
            useCORS: true, 
            allowTaint: true,
            logging: false
        });

        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            const nom = document.getElementById('d-nom').innerText || "Inconnu";
            
            formData.append("payload_json", JSON.stringify({
                content: `📄 **Nouvel Acte de Décès**\n👤 Défunt : ${nom}`
            }));
            formData.append("file", blob, `deces_${nom}.png`);
            
            const response = await fetch(url, { method: 'POST', body: formData });
            
            if (response.ok) {
                alert("✅ Envoyé sur l'intranet !");
                btn.innerText = "ENVOYÉ";
            } else {
                throw new Error("Erreur serveur Discord");
            }
        }, 'image/png');

    } catch (e) {
        console.error(e);
        alert("❌ Erreur lors de l'envoi. Vérifiez votre connexion.");
        btn.disabled = false;
        btn.innerText = "RÉESSAYER";
    }
}
