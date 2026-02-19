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
        initToolbars(); 
    } catch(e) {
        console.error("Erreur Initialisation", e);
    }
});

// ==========================================
// FORMATAGE TEXTE RICHE (Markdown) CORRIGÉ
// ==========================================

window.formatMD = function(text) {
    if(!text) return '';
    let html = text.replace(/</g, "&lt;").replace(/>/g, "&gt;"); 
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); 
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>'); 
    
    let lines = html.split('\n');
    let inList = false;
    let out = "";
    
    for(let i=0; i < lines.length; i++) {
        let line = lines[i]; 
        let trimmed = line.trim();
        
        if(trimmed.startsWith('- ')) {
            if(!inList) {
                // Début de la liste (marges propres)
                out += '<ul style="margin: 5px 0; padding-left: 20px;">';
                inList = true;
            }
            // Ligne de liste (pas de sauts de ligne supplémentaires)
            out += '<li style="margin-bottom: 2px;">' + trimmed.substring(2) + '</li>';
        } else {
            if(inList) {
                out += '</ul>'; // Fin de la liste
                inList = false;
            }
            // Sauts de ligne normaux pour le texte classique
            out += line + (i < lines.length - 1 ? '<br>' : '');
        }
    }
    if(inList) out += '</ul>'; // Sécurité si la liste est tout à la fin
    
    // Évite d'avoir un énorme espace juste après une liste
    return out.replace(/<\/ul><br>/g, '</ul>');
}

window.insertMD = function(id, type) {
    const el = document.getElementById(id);
    if(!el) return;
    
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end);
    
    let before = text.substring(0, start);
    let after = text.substring(end, text.length);
    let newVal = "";
    
    if (type === 'bold') {
        newVal = before + '**' + (selected || 'Texte') + '**' + after;
    } else if (type === 'italic') {
        newVal = before + '*' + (selected || 'Texte') + '*' + after;
    } else if (type === 'list') {
        let listText = selected ? selected.split('\n').map(l => '- ' + l).join('\n') : '- ';
        const isStartOfLine = start === 0 || text.charAt(start - 1) === '\n';
        if(!isStartOfLine && !selected) listText = '\n- ';
        newVal = before + listText + after;
    }
    
    el.value = newVal;
    el.dispatchEvent(new Event('input')); 
    el.focus();
}

window.initToolbars = function() {
    document.querySelectorAll('textarea').forEach(ta => {
        if(ta.previousElementSibling && ta.previousElementSibling.classList.contains('md-toolbar')) return;
        
        const tb = document.createElement('div');
        tb.className = 'md-toolbar';
        tb.innerHTML = `
            <button type="button" onclick="insertMD('${ta.id}', 'bold')" title="Mettre en gras">B</button>
            <button type="button" onclick="insertMD('${ta.id}', 'italic')" title="Mettre en italique">I</button>
            <button type="button" onclick="insertMD('${ta.id}', 'list')" title="Liste à puces">• Liste</button>
        `;
        ta.parentNode.insertBefore(tb, ta);
    });
}

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

window.upBlock = function(textId, wrapId, val) {
    const el = document.getElementById(textId);
    const wrap = document.getElementById(wrapId);
    
    if(el) el.innerHTML = formatMD(val) || '';
    
    if(wrap) {
        if(val && val.trim() !== '') {
            wrap.style.display = 'block';
        } else {
            wrap.style.display = 'none';
        }
    }
}

window.upNom = function() {
    let prenom = document.getElementById('in-prenom').value.trim();
    let nom = document.getElementById('in-nom-famille').value.trim();
    
    if(prenom.length > 0) prenom = prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase();
    if(nom.length > 0) nom = nom.toUpperCase();
    
    let nomComplet = [];
    if(prenom) nomComplet.push(prenom);
    if(nom) nomComplet.push(nom);
    
    const texteFinal = nomComplet.length > 0 ? nomComplet.join(' ') : '...';
    
    document.getElementById('d-nom').innerText = texteFinal;
    document.getElementById('d-nom-titre').innerText = texteFinal;
}

window.upDoc = function() {
    const elDoc = document.getElementById('in-doc');
    const elGrade = document.getElementById('in-grade');
    const wrapDoc = document.getElementById('wrap-doc');
    const dDoc = document.getElementById('d-doc');
    
    let docVal = elDoc ? elDoc.value.trim() : '';
    let gradeVal = elGrade ? elGrade.value.trim() : '';
    
    if (docVal === '') {
        if(wrapDoc) wrapDoc.style.display = 'none';
        if(dDoc) dDoc.innerText = '';
    } else {
        if(wrapDoc) wrapDoc.style.display = 'block';
        let complet = docVal;
        if(gradeVal !== '') {
            complet += ` - ${gradeVal}`;
        }
        complet += ` de l'Ocean Medical Center`;
        if(dDoc) dDoc.innerText = complet;
    }
}

window.upSig = function(val) {
    const text = val ? val.trim() : '';
    const dSig = document.getElementById('d-sig');
    
    if(dSig) {
        dSig.innerText = text;
        dSig.style.display = (text !== '') ? 'inline-block' : 'none'; 
    }
}

window.upMedSuivi = function() {
    const concl = document.getElementById('in-med-conclusion').value.trim();
    const repos = document.getElementById('in-med-repos').value.trim();
    const prix = document.getElementById('in-med-prix').value.trim();
    
    const elConcl = document.getElementById('d-med-conclusion');
    if(elConcl) {
        elConcl.innerHTML = formatMD(concl);
        elConcl.style.display = concl ? 'block' : 'none';
    }

    document.getElementById('d-med-repos').innerText = repos;
    document.getElementById('wrap-med-repos').style.display = repos ? 'block' : 'none';
    
    document.getElementById('d-med-prix').innerText = prix;
    document.getElementById('wrap-med-prix').style.display = prix ? 'block' : 'none';
    
    document.getElementById('wrap-med-suivi').style.display = (concl || repos || prix) ? 'block' : 'none';
}

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

// --- SECTIONS DYNAMIQUES ---
window.ajouterSectionCustom = function() {
    customCount++;
    const id = customCount;

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

    const containerOut = document.getElementById('render-custom');
    const htmlOut = `
        <div id="wrap-c${id}" style="display: none; margin-top: 25px;">
            <h4 id="d-c${id}-titre" class="doc-h4"></h4>
            <p id="d-c${id}-text" class="doc-p"></p>
        </div>
    `;
    containerOut.insertAdjacentHTML('beforeend', htmlOut);
    
    initToolbars();
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
    document.getElementById(`d-c${id}-text`).innerHTML = formatMD(texte); 
    
    wrap.style.display = (texte !== '') ? 'block' : 'none';
}

// ==========================================
// ENVOIS (IMG + DISCORD) ROBUSIFIÉS
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
        alert("❌ Erreur de génération de l'image.");
    } finally {
        btn.innerText = "🖼️ GÉNÉRER L'IMAGE";
        btn.disabled = false;
    }
}

// Nouvelle version Ultra-Sécurisée pour Discord
window.envoyerRapportDiscord = async function() {
    const btn = document.getElementById('discord-btn');
    const doc = document.getElementById('document');
    
    const elNom = document.getElementById('d-nom');
    const nom = (elNom && elNom.innerText !== '...') ? elNom.innerText : "Inconnu";
    
    const titreDoc = document.getElementById('d-titre-doc').innerText;
    const ref = document.getElementById('d-ref').innerText;
    
    const elSig = document.getElementById('in-sig');
    const elDoc = document.getElementById('in-doc');
    const praticien = (elSig && elSig.value) ? elSig.value : ((elDoc && elDoc.value) ? elDoc.value : "Non Renseigné");

    window.scrollTo(0,0);
    btn.disabled = true;
    btn.innerText = "CAPTURE EN COURS...";

    try {
        // Capture à scale 1.5 au lieu de 2 pour éviter les fichiers trop lourds pour Discord
        const canvas = await html2canvas(doc, { scale: 1.5, useCORS: true, backgroundColor: "#ffffff" });
        btn.innerText = "ENVOI SUR L'INTRANET...";

        // Création de l'image garantie sans bloquer
        const blob = await new Promise((resolve, reject) => {
            canvas.toBlob((b) => {
                if(b) resolve(b);
                else reject(new Error("Echec de la création du fichier image."));
            }, 'image/png'); // Le PNG passe parfois mieux sur Discord
        });

        const formData = new FormData();
        formData.append("payload_json", JSON.stringify({
            username: "Intranet OMC",
            content: `📂 **NOUVEAU DOSSIER DÉPOSÉ**\n━━━━━━━━━━━━━━━━━━━━\n👤 **Patient/Sujet :** ${nom}\n📄 **Type :** ${titreDoc}\n🏷️ **Réf :** \`${ref}\`\n👨‍⚕️ **Signataire :** ${praticien}\n━━━━━━━━━━━━━━━━━━━━`
        }));
        
        // Nom simplifié pour ne pas faire planter l'API Discord
        formData.append("file", blob, "rapport_officiel.png");

        const response = await fetch(DISCORD_WEBHOOK_URL, { method: 'POST', body: formData });
        
        if(response.ok) {
            alert("✅ Rapport envoyé avec succès sur l'intranet !");
            btn.innerText = "✅ ENVOYÉ !";
        } else {
            const errText = await response.text();
            throw new Error("Discord a refusé l'envoi. Code: " + response.status + " | Message: " + errText);
        }

    } catch (e) {
        console.error("Détails de l'erreur Discord:", e);
        alert("❌ Erreur d'envoi. Cause : " + e.message);
        btn.innerText = "RÉESSAYER";
    } finally {
        // Dans tous les cas, on débloque le bouton après quelques secondes
        setTimeout(() => {
            if(btn.innerText !== "RÉESSAYER") {
                btn.innerText = "📨 ENVOYER SUR L'INTRANET";
            }
            btn.disabled = false;
        }, 3000);
    }
}

window.copyLink = function() {
    const copyText = document.getElementById("direct-link");
    copyText.select();
    document.execCommand("copy");
    alert("Lien copié !");
}
window.closePopup = function() { document.getElementById('image-popup').style.display = 'none'; }
