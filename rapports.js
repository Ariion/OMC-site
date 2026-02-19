// ==========================================
// RAPPORTS OFFICIELS - OMC LOGIC
// ==========================================

const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1473838500552900763/elqC43oQ76jAapLRLieQ38oQ53xHteXNdqJ3SrQ-Md_o2spH9a1AZyfhDqI6ruxVQASG"; 

let currentReportType = 'med'; 
let customCount = 0; 

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
        
        switchReport('med'); 
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

// Fonction de disparition intelligente
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

// Assemblage et formatage automatique du Prénom et Nom
window.upNom = function() {
    let prenom = document.getElementById('in-prenom').value.trim();
    let nom = document.getElementById('in-nom-famille').value.trim();
    
    // Format Prénom : Première lettre Majuscule, le reste minuscule
    if(prenom.length > 0) {
        prenom = prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase();
    }
    
    // Format Nom : TOUT EN MAJUSCULE
    if(nom.length > 0) {
        nom = nom.toUpperCase();
    }
    
    // Assemblage final
    let nomComplet = [];
    if(prenom) nomComplet.push(prenom);
    if(nom) nomComplet.push(nom);
    
    const texteFinal = nomComplet.length > 0 ? nomComplet.join(' ') : '...';
    
    // Envoi sur le document de droite
    document.getElementById('d-nom').innerText = texteFinal;
    document.getElementById('d-nom-titre').innerText = texteFinal;
}

// Ligne PRATICIEN du haut (Assemble le nom, le grade et l'hôpital)
window.upDoc = function() {
    const elDoc = document.getElementById('in-doc');
    const elGrade = document.getElementById('in-grade');
    if(!elDoc || !elGrade) return;

    const docVal = elDoc.value.trim();
    const gradeVal = elGrade.value.trim();
    const wrapDoc = document.getElementById('wrap-doc');
    const dDoc = document.getElementById('d-doc');
    
    if (docVal === '' && gradeVal === '') {
        if(wrapDoc) wrapDoc.style.display = 'none';
        if(dDoc) dDoc.innerText = '';
    } else {
        if(wrapDoc) wrapDoc.style.display = 'block';
        let parts = [];
        if(docVal !== '') parts.push(docVal);
        if(gradeVal !== '') parts.push(`${gradeVal} de l'Ocean Medical Center`);
        else if(docVal !== '') parts.push(`de l'Ocean Medical Center`); 
        
        if(dDoc) dDoc.innerText = parts.join(' - ');
    }
}

// Ligne SIGNATAIRE du bas
window.upSig = function(val) {
    const text = val ? val.trim() : '';
    const dSig = document.getElementById('d-sig');
    
    if(dSig) {
        dSig.innerText = text;
        dSig.style.display = (text !== '') ? 'inline-block' : 'none'; 
    }
}

// Gestion complète du bloc Suivi & Conclusion
window.upMedSuivi = function() {
    const concl = document.getElementById('in-med-conclusion').value.trim();
    const repos = document.getElementById('in-med-repos').value.trim();
    const prix = document.getElementById('in-med-prix').value.trim();
    
    document.getElementById('d-med-conclusion').innerText = concl;
    document.getElementById('d-med-conclusion').style.display = concl ? 'block' : 'none';

    document.getElementById('d-med-repos').innerText = repos;
    document.getElementById('wrap-med-repos').style.display = repos ? 'block' : 'none';
    
    document.getElementById('d-med-prix').innerText = prix;
    document.getElementById('wrap-med-prix').style.display = prix ? 'block' : 'none';
    
    document.getElementById('wrap-med-suivi').style.display = (concl || repos || prix) ? 'block' : 'none';
}

// --- GESTION DE LA RÉFÉRENCE ET QR CODE ---
window.genererRef = function() {
    try {
        const dateInput = document.getElementById('in-date-prel').value;
        const heureInput = document.getElementById('in-heure-prel').value;
        let ref = "#...";
        
        if(dateInput && heureInput) {
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
        
        // CORRECTION ICI : On cherche le texte formaté 'd-nom' au lieu de l'input manquant 'in-nom'
        const elNom = document.getElementById('d-nom');
        const nom = (elNom && elNom.innerText !== '...') ? elNom.innerText : "Inconnu";

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
    const labelNom = document.getElementById('label-nom'); 
    
    if(type === 'med') {
        titreDoc.innerText = "DOSSIER MÉDICAL";
        labelDoc.innerText = "Praticien intervenant";
        if(labelNom) labelNom.innerText = "Prénom & Nom du Patient"; 
        document.getElementById('d-info-auto').style.display = 'none';
    } else if (type === 'psy') {
        titreDoc.innerText = "BILAN PSYCHOLOGIQUE";
        labelDoc.innerText = "Psychologue / Médecin";
        if(labelNom) labelNom.innerText = "Prénom & Nom du Patient"; 
        document.getElementById('d-info-auto').style.display = 'none';
    } else if (type === 'auto') {
        titreDoc.innerText = "RAPPORT D'AUTOPSIE";
        labelDoc.innerText = "Médecin Légiste (Coroner)";
        if(labelNom) labelNom.innerText = "Prénom & Nom du Défunt"; 
        const heure = document.getElementById('in-auto-heure').value;
        if(heure) document.getElementById('d-info-auto').style.display = 'block';
    }
    genererRef();
}

// --- SECTIONS DYNAMIQUES (AJOUT & SUPPRESSION) ---
window.ajouterSectionCustom = function() {
    customCount++;
    const id = customCount;

    // 1. UI Gauche
    const containerIn = document.getElementById('custom-inputs-container');
    const htmlIn = `
        <div id="custom-block-${id}" class="form-group" style="background: #0f172a; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; border-bottom: 1px solid #334155; padding-bottom: 5px;">
                <input type="text" id="in-c${id}-titre" placeholder="Titre du bloc (ex: PRESCRIPTION)..." oninput="upCustom(${id})" style="font-weight: bold; color: #38bdf8; border: none; background: transparent; border-radius: 0; padding-left: 0; outline: none; width: 100%;">
                <button type="button" onclick="supprimerSectionCustom(${id})" title="Supprimer ce bloc" style="background: #ef4444; border: none; color: white; border-radius: 4px; cursor: pointer; padding: 4px 8px; font-size: 10px; margin-left: 10px; flex-shrink: 0;">❌</button>
            </div>
            <textarea id="in-c${id}-text" rows="2" placeholder="Contenu du bloc..." oninput="upCustom(${id})" style="border: none; background: #111b2d; color: white; width: 100%; resize: vertical; padding: 8px; border-radius: 4px; outline: none; box-sizing: border-box;"></textarea>
        </div>
    `;
    containerIn.insertAdjacentHTML('beforeend', htmlIn);

    // 2. UI Droite (Le rendu)
    const containerOut = document.getElementById('render-custom');
    const htmlOut = `
        <div id="wrap-c${id}" style="display: none; margin-top: 25px;">
            <h4 id="d-c${id}-titre" class="doc-h4"></h4>
            <p id="d-c${id}-text" class="doc-p"></p>
        </div>
    `;
    containerOut.insertAdjacentHTML('beforeend', htmlOut);
}

window.supprimerSectionCustom = function(id) {
    const inputBlock = document.getElementById(`custom-block-${id}`);
    const renderBlock = document.getElementById(`wrap-c${id}`);
    
    if(inputBlock) inputBlock.remove(); 
    if(renderBlock) renderBlock.remove(); 
}

window.upCustom = function(id) {
    const titre = document.getElementById(`in-c${id}-titre`).value.trim();
    const texte = document.getElementById(`in-c${id}-text`).value.trim();
    const wrap = document.getElementById(`wrap-c${id}`);
    
    document.getElementById(`d-c${id}-titre`).innerText = titre || `SECTION SUPPLÉMENTAIRE`;
    document.getElementById(`d-c${id}-text`).innerText = texte;
    
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
    
    // CORRECTION ICI : On cherche le texte formaté au lieu de l'input manquant
    const elNom = document.getElementById('d-nom');
    const nom = (elNom && elNom.innerText !== '...') ? elNom.innerText : "Inconnu";
    
    const titreDoc = document.getElementById('d-titre-doc').innerText;
    const ref = document.getElementById('d-ref').innerText;
    
    const praticien = document.getElementById('in-sig').value || document.getElementById('in-doc').value || "Non Renseigné";

    window.scrollTo(0,0);
    btn.disabled = true;
    btn.innerText = "CAPTURE EN COURS...";

    try {
        const canvas = await html2canvas(doc, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        btn.innerText = "ENVOI SUR L'INTRANET...";

        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));

        const formData = new FormData();
        formData.append("payload_json", JSON.stringify({
            username: "Intranet OMC",
            content: `📂 **NOUVEAU DOSSIER DÉPOSÉ**\n━━━━━━━━━━━━━━━━━━━━\n👤 **Patient/Sujet :** ${nom}\n📄 **Type :** ${titreDoc}\n🏷️ **Réf :** \`${ref}\`\n👨‍⚕️ **Signataire :** ${praticien}\n━━━━━━━━━━━━━━━━━━━━`
        }));
        
        formData.append("file", blob, "rapport_officiel.jpg");

        const response = await fetch(DISCORD_WEBHOOK_URL, { method: 'POST', body: formData });
        
        if(response.ok) {
            alert("✅ Rapport envoyé avec succès sur l'intranet !");
            btn.innerText = "✅ ENVOYÉ !";
        } else {
            const errText = await response.text();
            throw new Error("Refus de Discord : " + errText);
        }
        
        setTimeout(() => {
            btn.innerText = "📨 ENVOYER SUR L'INTRANET";
            btn.disabled = false;
        }, 3000);

    } catch (e) {
        console.error("Erreur d'envoi Discord:", e);
        alert("❌ Erreur d'envoi. Vérifiez la console.");
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
