// ==========================================
// RAPPORTS OFFICIELS - OMC LOGIC
// ==========================================

const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1473838500552900763/elqC43oQ76jAapLRLieQ38oQ53xHteXNdqJ3SrQ-Md_o2spH9a1AZyfhDqI6ruxVQASG"; 

let currentReportType = 'med'; 
let customCount = 0; // Compteur pour les sections supplémentaires

document.addEventListener('DOMContentLoaded', () => {
    try {
        const today = new Date();
        const elDate = document.getElementById('in-date-prel');
        const elHeure = document.getElementById('in-heure-prel');
        
        if(elDate) elDate.valueAsDate = today;
        
        const h = String(today.getHours()).padStart(2, '0');
        const m = String(today.getMinutes()).padStart(2, '0');
        if(elHeure) elHeure.value = `${h}:${m}`;

        upDate('d-date', today.toISOString().split('T')[0]);
        up('d-heure', `${h}:${m}`);
        
        switchReport('med'); // Force le mode médical et génère la REF
    } catch(e) {
        console.error("Erreur Initialisation", e);
    }
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

// Fonction de disparition intelligente (Si vide = caché)
window.upBlock = function(textId, wrapId, val) {
    const el = document.getElementById(textId);
    const wrap = document.getElementById(wrapId);
    
    if(el) el.innerText = val || '';
    
    if(wrap) {
        if(val && val.trim() !== '') {
            wrap.style.display = 'block';
        } else {
            wrap.style.display = 'none';
        }
    }
}

window.upDoc = function(val) {
    const dDoc = document.getElementById('d-doc');
    const dSig = document.getElementById('d-sig');
    const wrapDoc = document.getElementById('wrap-doc');
    
    const text = val ? val.trim() : '';
    
    if(dDoc) dDoc.innerText = text;
    if(dSig) {
        dSig.innerText = text;
        dSig.style.display = (text !== '') ? 'inline-block' : 'none'; // Cache la ligne noire si vide
    }
    if(wrapDoc) {
        wrapDoc.style.display = (text !== '') ? 'block' : 'none';
    }
}

window.upMedSuivi = function() {
    const repos = document.getElementById('in-med-repos').value.trim();
    const prix = document.getElementById('in-med-prix').value.trim();
    
    document.getElementById('d-med-repos').innerText = repos;
    document.getElementById('wrap-med-repos').style.display = repos ? 'block' : 'none';
    
    document.getElementById('d-med-prix').innerText = prix;
    document.getElementById('wrap-med-prix').style.display = prix ? 'block' : 'none';
    
    document.getElementById('wrap-med-suivi').style.display = (repos || prix) ? 'block' : 'none';
}

// --- GESTION DE LA RÉFÉRENCE ET QR CODE ---
window.genererRef = function() {
    try {
        const dateInput = document.getElementById('in-date-prel').value;
        const heureInput = document.getElementById('in-heure-prel').value;
        let ref = "#...";
        
        if(dateInput && heureInput) {
            // Formate la date YYYY-MM-DD en DDMM
            const cleanDate = dateInput.replace(/\D/g, '');
            if(cleanDate.length >= 8) {
                const dd = cleanDate.substring(6, 8);
                const mm = cleanDate.substring(4, 6);
                const h = heureInput.replace(/\D/g, '');
                ref = "#" + dd + mm + h;
            }
        }
        
        const elRef = document.getElementById('d-ref');
        if(elRef) elRef.innerText = ref;
        
        const nom = document.getElementById('in-nom').value || "Inconnu";
        const qrImg = document.getElementById('qr-ref');
        if (qrImg) {
            const data = encodeURIComponent(`OMC-${currentReportType.toUpperCase()}|${nom}|${ref}`);
            qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
        }
    } catch(e) {
        console.error("Erreur QR Code", e);
    }
}

// --- ONGLETS ---
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
        const heure = document.getElementById('in-auto-heure').value;
        if(heure) document.getElementById('d-info-auto').style.display = 'block';
    }
    
    genererRef();
}

// --- BOUTON DYNAMIQUE "AJOUTER UNE SECTION" ---
window.ajouterSectionCustom = function() {
    customCount++;
    const id = customCount;

    // 1. Ajouter l'UI pour écrire à gauche (Design de ton image)
    const containerIn = document.getElementById('custom-inputs-container');
    const htmlIn = `
        <div class="form-group" style="background: #0f172a; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
            <input type="text" id="in-c${id}-titre" placeholder="Titre du bloc (ex: PRESCRIPTION)..." oninput="upCustom(${id})" style="margin-bottom: 5px; font-weight: bold; color: #38bdf8; border: none; background: transparent; border-bottom: 1px solid #334155; border-radius: 0; padding-left: 0; outline: none; width: 100%;">
            <textarea id="in-c${id}-text" rows="2" placeholder="Contenu du bloc..." oninput="upCustom(${id})" style="border: none; background: #111b2d; color: white; width: 100%; resize: vertical; padding: 8px; border-radius: 4px; outline: none; box-sizing: border-box;"></textarea>
        </div>
    `;
    containerIn.insertAdjacentHTML('beforeend', htmlIn);

    // 2. Ajouter l'UI de rendu sur le papier
    const containerOut = document.getElementById('render-custom');
    const htmlOut = `
        <div id="wrap-c${id}" style="display: none; margin-top: 25px;">
            <h4 id="d-c${id}-titre" class="doc-h4"></h4>
            <p id="d-c${id}-text" class="doc-p"></p>
        </div>
    `;
    containerOut.insertAdjacentHTML('beforeend', htmlOut);
}

// Met à jour la section dynamique
window.upCustom = function(id) {
    const titre = document.getElementById(`in-c${id}-titre`).value.trim();
    const texte = document.getElementById(`in-c${id}-text`).value.trim();
    const wrap = document.getElementById(`wrap-c${id}`);
    
    document.getElementById(`d-c${id}-titre`).innerText = titre || `SECTION SUPPLÉMENTAIRE`;
    document.getElementById(`d-c${id}-text`).innerText = texte;
    
    // S'affiche uniquement si du texte est entré
    wrap.style.display = (texte !== '') ? 'block' : 'none';
}

// ==========================================
// FONCTIONS DE GÉNÉRATION (IMG + DISCORD)
// ==========================================

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
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('direct-link').value = result.data.url;
            document.getElementById('preview-img-result').src = result.data.url;
            document.getElementById('image-popup').style.display = 'flex';
        } else {
            throw new Error("Erreur ImgBB");
        }
    } catch (e) {
        console.error(e);
        alert("❌ Erreur de génération");
    } finally {
        btn.innerText = "🖼️ GÉNÉRER L'IMAGE";
        btn.disabled = false;
    }
}

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
                content: `📂 **NOUVEAU DOSSIER DÉPOSÉ**\n━━━━━━━━━━━━━━━━━━━━\n👤 **Patient/Sujet :** ${nom}\n📄 **Type :** ${titreDoc}\n🏷️ **Réf :** \`${ref}\`\n👨‍⚕️ **Praticien :** ${praticien}\n━━━━━━━━━━━━━━━━━━━━`
            }));
            
            formData.append("file", blob, `rapport_${ref.replace('#','')}.jpg`);

            const response = await fetch(DISCORD_WEBHOOK_URL, { method: 'POST', body: formData });
            
            if(response.ok) {
                alert("✅ Rapport envoyé avec succès sur l'intranet !");
                btn.innerText = "✅ ENVOYÉ !";
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
        alert("❌ Erreur d'envoi");
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
