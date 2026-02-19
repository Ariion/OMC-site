// ==========================================
// RAPPORTS OFFICIELS - OMC LOGIC
// ==========================================

const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1473838500552900763/elqC43oQ76jAapLRLieQ38oQ53xHteXNdqJ3SrQ-Md_o2spH9a1AZyfhDqI6ruxVQASG"; 

let currentReportType = 'med'; // Par défaut

document.addEventListener('DOMContentLoaded', () => {
    // Initialise la date et heure au chargement
    const today = new Date();
    if(document.getElementById('in-date-prel')) document.getElementById('in-date-prel').valueAsDate = today;
    
    const h = String(today.getHours()).padStart(2, '0');
    const m = String(today.getMinutes()).padStart(2, '0');
    if(document.getElementById('in-heure-prel')) document.getElementById('in-heure-prel').value = `${h}:${m}`;

    upDate('d-date', today.toISOString().split('T')[0]);
    up('d-heure', `${h}:${m}`);
    genererRef();
    
    // Force Mode Médical au chargement
    switchReport('med');
});

// --- FONCTIONS DE MISE À JOUR DOM ---

// Fonction basique (pour l'identité)
window.up = function(id, val) {
    const el = document.getElementById(id);
    if(el) el.innerText = val || '...';
}

// Fonction pour les blocs : Cache le bloc si le texte est vide
window.upBlock = function(textId, wrapId, val, isFlex = false) {
    const el = document.getElementById(textId);
    const wrap = document.getElementById(wrapId);
    if(el) el.innerText = val || '';
    
    if(wrap) {
        if(val && val.trim() !== '') {
            wrap.style.display = isFlex ? 'block' : 'block'; // Adaptable si besoin
            if(wrapId === 'd-info-auto') wrap.style.display = 'block'; 
        } else {
            wrap.style.display = 'none';
        }
    }
}

// Fonction spécifique pour le Praticien
window.upDoc = function(val) {
    document.getElementById('d-doc').innerText = val || '';
    document.getElementById('d-sig').innerText = val || '';
    document.getElementById('wrap-doc').style.display = (val && val.trim() !== '') ? 'block' : 'none';
}

// Fonction spécifique pour la partie Suivi/Facture (Médical)
window.upMedSuivi = function() {
    const repos = document.getElementById('in-med-repos').value.trim();
    const prix = document.getElementById('in-med-prix').value.trim();
    
    document.getElementById('d-med-repos').innerText = repos;
    document.getElementById('wrap-med-repos').style.display = repos ? 'block' : 'none';
    
    document.getElementById('d-med-prix').innerText = prix;
    document.getElementById('wrap-med-prix').style.display = prix ? 'block' : 'none';
    
    // Si l'un des deux existe, on affiche le bloc global
    document.getElementById('wrap-med-suivi').style.display = (repos || prix) ? 'block' : 'none';
}

// Fonction pour les 2 blocs Personnalisés optionnels
window.upCustom = function(index) {
    const titre = document.getElementById(`in-c${index}-titre`).value.trim();
    const texte = document.getElementById(`in-c${index}-text`).value.trim();
    const wrap = document.getElementById(`wrap-c${index}`);
    
    document.getElementById(`d-c${index}-titre`).innerText = titre || `SECTION PERSONNALISÉE ${index}`;
    document.getElementById(`d-c${index}-text`).innerText = texte;
    
    // Le bloc ne s'affiche QUE si du texte est entré
    wrap.style.display = (texte !== '') ? 'block' : 'none';
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
    const date = document.getElementById('in-date-prel').value;
    const heure = document.getElementById('in-heure-prel').value;
    let ref = "#...";
    
    if(date && heure) {
        let d = date.replace(/\D/g, '').substring(6, 8) + date.replace(/\D/g, '').substring(4, 6);
        let h = heure.replace(/\D/g, '');
        ref = "#" + d + h;
    }
    document.getElementById('d-ref').innerText = ref;
    
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
    
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + type).classList.add('active');

    document.querySelectorAll('.dynamic-fields').forEach(f => f.style.display = 'none');
    document.getElementById('fields-' + type).style.display = 'block';

    document.querySelectorAll('.render-section').forEach(s => s.style.display = 'none');
    document.getElementById('render-' + type).style.display = 'block';

    const titreDoc = document.getElementById('d-titre-doc');
    const labelDoc = document.getElementById('label-doc');
    
    // Cache ou affiche l'heure du décès selon l'onglet
    const valAutoHeure = document.getElementById('in-auto-heure').value.trim();

    if(type === 'med') {
        titreDoc.innerText = "DOSSIER MÉDICAL";
        labelDoc.innerText = "Praticien intervenant";
        document.getElementById('d-info-auto').style.display = 'none';
    } else if (type === 'psy') {
        titreDoc.innerText = "BILAN PSYCHOLOGIQUE";
        labelDoc.innerText = "Psychologue / Médecin";
        document.getElementById('d-info-auto').style.display = 'none';
    } else if (type === 'auto') {
        titreDoc.innerText = "RAPPORT D'AUTOPSIE";
        labelDoc.innerText = "Médecin Légiste (Coroner)";
        if(valAutoHeure) document.getElementById('d-info-auto').style.display = 'block';
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
        const canvas = await html2canvas(doc, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imageData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        
        const formData = new FormData();
        formData.append("image", imageData);
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${https://discord.com/api/webhooks/1473838500552900763/elqC43oQ76jAapLRLieQ38oQ53xHteXNdqJ3SrQ-Md_o2spH9a1AZyfhDqI6ruxVQASG}`, { method: "POST", body: formData });
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('direct-link').value = result.data.url;
            document.getElementById('preview-img-result').src = result.data.url;
            document.getElementById('image-popup').style.display = 'flex';
            
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
    const btn = document.getElementById('discord-btn');
    const doc = document.getElementById('document');
    
    const nom = document.getElementById('in-nom').value || "Inconnu";
    const titreDoc = document.getElementById('d-titre-doc').innerText;
    const ref = document.getElementById('d-ref').innerText;
    const praticien = document.getElementById('in-doc').value || "Non Renseigné";

    window.scrollTo(0,0);
    btn.disabled = true;
    btn.innerText = "CAPTURE EN COURS...";

    try {
        const canvas = await html2canvas(doc, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        btn.innerText = "ENVOI SUR L'INTRANET...";

        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            
            formData.append("payload_json", JSON.stringify({
                username: "Intranet OMC",
                content: `📂 **NOUVEAU DOSSIER DÉPOSÉ**\n━━━━━━━━━━━━━━━━━━━━\n👤 **Patient/Sujet :** ${nom}\n📄 **Type :** ${titreDoc}\n🏷️ **Réf :** \`${ref}\`\n👨‍⚕️ **Praticien :** ${praticien}\n━━━━━━━━━━━━━━━━━━━━`,
            }));
            
            formData.append("file", blob, `rapport_${ref.replace('#','')}.jpg`);

            const response = await fetch(DISCORD_WEBHOOK_URL, { method: 'POST', body: formData });
            
            if(response.ok) {
                alert("✅ Rapport envoyé avec succès sur l'intranet !");
                btn.innerText = "✅ ENVOYÉ !";
                
                if(nom !== "Inconnu" && window.ajouterEvenementPatient) {
                    window.ajouterEvenementPatient(nom, "Rapports Officiels", `${titreDoc} (Envoyé sur Intranet)`);
                }
            } else {
                throw new Error("Erreur Discord");
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

window.copyLink = function() {
    const copyText = document.getElementById("direct-link");
    copyText.select();
    document.execCommand("copy");
    alert("Lien copié !");
}
window.closePopup = function() { document.getElementById('image-popup').style.display = 'none'; }
