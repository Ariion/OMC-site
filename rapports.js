// ==========================================
// RAPPORTS OFFICIELS - OMC LOGIC
// ==========================================

// --- CONFIGURATION ---
const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; // Clé pour héberger les images

// ⚠️⚠️ REMPLACE LE LIEN CI-DESSOUS PAR CELUI QUE TU M'AS DONNÉ ⚠️⚠️
const DISCORD_WEBHOOK_URL = "METTRE_TON_LIEN_WEBHOOK_ICI"; 


let currentReportType = 'med'; // Par défaut

document.addEventListener('DOMContentLoaded', () => {
    // Initialise la date et heure au chargement
    const today = new Date();
    if(document.getElementById('in-date-prel')) document.getElementById('in-date-prel').valueAsDate = today;
    
    const h = String(today.getHours()).padStart(2, '0');
    const m = String(today.getMinutes()).padStart(2, '0');
    if(document.getElementById('in-heure-prel')) document.getElementById('in-heure-prel').value = `${h}:${m}`;

    // Applique sur le document
    upDate('d-date', today.toISOString().split('T')[0]);
    up('d-heure', `${h}:${m}`);
    genererRef();
    
    // FORCE LE MODE MÉDICAL AU DÉMARRAGE
    switchReport('med');
});

// --- FONCTIONS DE MISE À JOUR DOM ---
window.up = function(id, val) {
    const el = document.getElementById(id);
    if(el) el.innerText = val || '...';
}

window.upDate = function(id, val) {
    const el = document.getElementById(id);
    if(el && val) {
        const d = new Date(val);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        el.innerText = d.toLocaleDateString('fr-FR', options);
    } else if (el) {
        el.innerText = '...';
    }
}

window.genererRef = function() {
    const date = document.getElementById('in-date-prel').value; // YYYY-MM-DD
    const heure = document.getElementById('in-heure-prel').value; // HH:MM
    let ref = "#...";
    
    if(date && heure) {
        let d = date.replace(/\D/g, '').substring(6, 8) + date.replace(/\D/g, '').substring(4, 6); // DDMM
        let h = heure.replace(/\D/g, ''); // HHMM
        ref = "#" + d + h;
    }
    
    document.getElementById('d-ref').innerText = ref;
    
    // Maj QR Code
    const nom = document.getElementById('in-nom').value || "Anonyme";
    const refTexte = document.getElementById('d-ref').innerText;
    const qrImg = document.getElementById('qr-ref');
    if (qrImg) {
        const data = encodeURIComponent(`OMC-${currentReportType.toUpperCase()}|${nom}|${refTexte}`);
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
    }
}

// --- GESTION DES ONGLETS (Médical / Psy / Autopsie) ---
window.switchReport = function(type) {
    currentReportType = type;
    
    // 1. Boutons Sidebar
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + type).classList.add('active');

    // 2. Champs Sidebar
    document.querySelectorAll('.dynamic-fields').forEach(f => f.style.display = 'none');
    document.getElementById('fields-' + type).style.display = 'block';

    // 3. Sections Document Rendu
    document.querySelectorAll('.render-section').forEach(s => s.style.display = 'none');
    document.getElementById('render-' + type).style.display = 'block';

    // 4. Titres et spécificités
    const titreDoc = document.getElementById('d-titre-doc');
    const labelDoc = document.getElementById('label-doc');
    const infoAuto = document.getElementById('d-info-auto'); // Heure décès

    if(type === 'med') {
        titreDoc.innerText = "DOSSIER MÉDICAL";
        labelDoc.innerText = "Praticien intervenant";
        infoAuto.style.display = 'none';
    } else if (type === 'psy') {
        titreDoc.innerText = "BILAN PSYCHOLOGIQUE";
        labelDoc.innerText = "Psychologue / Médecin";
        infoAuto.style.display = 'none';
    } else if (type === 'auto') {
        titreDoc.innerText = "RAPPORT D'AUTOPSIE";
        labelDoc.innerText = "Médecin Légiste (Coroner)";
        infoAuto.style.display = 'block';
    }
    
    genererRef();
}

// ==========================================
// FONCTIONS DE GÉNÉRATION ET D'ENVOI (IMG + DISCORD)
// ==========================================

// 1. GÉNÉRER L'IMAGE (Bouton Blanc)
window.genererImageRapport = async function() {
    const doc = document.getElementById('document');
    const btn = event.target;
    
    window.scrollTo(0,0);
    btn.innerText = "GÉNÉRATION EN COURS...";
    btn.disabled = true;

    try {
        // Capture
        const canvas = await html2canvas(doc, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imageData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        
        // Envoi à ImgBB
        const formData = new FormData();
        formData.append("image", imageData);
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
        const result = await response.json();
        
        if (result.success) {
            // Afficher le popup
            document.getElementById('direct-link').value = result.data.url;
            document.getElementById('preview-img-result').src = result.data.url;
            document.getElementById('image-popup').style.display = 'flex';
            
            // Sauvegarder dans les archives si possible
            const nomPatient = document.getElementById('in-nom').value;
            const titreDoc = document.getElementById('d-titre-doc').innerText;
            if(nomPatient && window.ajouterEvenementPatient) {
                window.ajouterEvenementPatient(nomPatient, "Rapports Officiels", titreDoc, result.data.url);
            }
        } else {
            throw new Error("Erreur ImgBB");
        }
    } catch (e) {
        console.error(e);
        alert("❌ Erreur lors de la génération de l'image.");
    } finally {
        btn.innerText = "🖼️ GÉNÉRER L'IMAGE";
        btn.disabled = false;
    }
}

// 2. ENVOYER SUR L'INTRANET (Bouton Bleu Discord)
window.envoyerRapportDiscord = async function() {
    if(DISCORD_WEBHOOK_URL.includes("METTRE_TON_LIEN")) {
        alert("⚠️ ERREUR CONFIG : Le lien du Webhook Discord n'a pas été configuré dans le fichier rapports.js !");
        return;
    }

    const btn = document.getElementById('discord-btn');
    const doc = document.getElementById('document');
    
    // Récupération infos pour le titre du message Discord
    const nom = document.getElementById('in-nom').value || "Inconnu";
    const titreDoc = document.getElementById('d-titre-doc').innerText;
    const ref = document.getElementById('d-ref').innerText;
    const praticien = document.getElementById('in-doc').value;

    window.scrollTo(0,0);
    btn.disabled = true;
    btn.innerText = "CAPTURE EN COURS...";

    try {
        // Capture
        const canvas = await html2canvas(doc, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        btn.innerText = "ENVOI SUR L'INTRANET...";

        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            
            // Configuration du message Discord
            formData.append("payload_json", JSON.stringify({
                username: "Intranet OMC",
                avatar_url: "https://i.imgur.com/TempLogo.png", // Tu pourras mettre le lien de ton logo ici
                content: `📂 **NOUVEAU DOSSIER DÉPOSÉ**\n━━━━━━━━━━━━━━━━━━━━\n👤 **Patient/Sujet :** ${nom}\n📄 **Type :** ${titreDoc}\n🏷️ **Réf :** \`${ref}\`\n👨‍⚕️ **Praticien :** ${praticien}\n━━━━━━━━━━━━━━━━━━━━`,
            }));
            
            // Ajout de l'image
            formData.append("file", blob, `rapport_${ref.replace('#','')}.jpg`);

            // Envoi au Webhook
            const response = await fetch(DISCORD_WEBHOOK_URL, { method: 'POST', body: formData });
            
            if(response.ok) {
                alert("✅ Rapport envoyé avec succès sur l'intranet !");
                btn.innerText = "✅ ENVOYÉ !";
                
                // Sauvegarder dans les archives
                if(nom !== "Inconnu" && window.ajouterEvenementPatient) {
                    window.ajouterEvenementPatient(nom, "Rapports Officiels", `${titreDoc} (Envoyé sur Intranet)`);
                }
            } else {
                throw new Error("Erreur Discord: " + response.status);
            }
            
            setTimeout(() => {
                btn.innerText = "📨 ENVOYER SUR L'INTRANET";
                btn.disabled = false;
            }, 3000);

        }, 'image/jpeg', 0.9);

    } catch (e) {
        console.error(e);
        alert("❌ Erreur lors de l'envoi Discord.");
        btn.innerText = "RÉESSAYER";
        btn.disabled = false;
    }
}

// --- FONCTIONS POPUP ---
window.copyLink = function() {
    const copyText = document.getElementById("direct-link");
    copyText.select();
    document.execCommand("copy");
    alert("Lien copié !");
}
window.closePopup = function() { document.getElementById('image-popup').style.display = 'none'; }
