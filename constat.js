const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 

// Liste des lésions enrichie
const LESIONS = [
    {key:'fracture', label:'Fracture / Entorse', color:'#ef4444', icon:'🦴'},
    {key:'plaie_laceration', label:'Lacération / Coupure', color:'#a855f7', icon:'🔪'},
    {key:'plaie_feu', label:'Impact Arme à Feu', color:'#b91c1c', icon:'🔴'},
    {key:'brulure', label:'Brûlure (Thermique/Chimique)', color:'#eab308', icon:'🔥'},
    {key:'hematome', label:'Hématome / Bleu', color:'#3b82f6', icon:'🟣'},
    {key:'abrasion', label:'Abrasion (Râpé)', color:'#10b981', icon:'🟢'},
    {key:'ponction', label:'Point de ponction (Seringue)', color:'#6366f1', icon:'💉'}
];

// Tes données de régions (Gardées telles quelles)
const REGIONS = [
    {"id":"tete","label":"Tête / Crâne","points":[[175,20],[243,20],[258,60],[258,105],[215,125],[172,105],[172,60]]},
    {"id":"cou","label":"Région Cervicale (Cou)","points":[[185,125],[245,125],[245,150],[185,150]]},
    {"id":"epaule_d","label":"Épaule Droite","points":[[135,160],[175,155],[165,200],[110,210]]},
    {"id":"epaule_g","label":"Épaule Gauche","points":[[255,155],[295,160],[320,210],[265,200]]},
    {"id":"thorax","label":"Thorax / Cage Thoracique","points":[[175,155],[255,155],[265,300],[165,300]]},
    {"id":"abdomen","label":"Abdomen / Ventre","points":[[165,305],[265,305],[275,410],[155,410]]},
    {"id":"hanche","label":"Hanche / Bassin","points":[[140,410],[290,410],[300,475],[130,475]]},
    
    // BRAS DROIT
    {"id":"bras_d_haut","label":"Bras Droit (Biceps)","points":[[85,215],[115,215],[125,340],[85,340]]},
    {"id":"coude_d","label":"Coude Droit","points":[[85,345],[125,345],[125,385],[85,385]]},
    {"id":"avant_bras_d","label":"Avant-bras Droit","points":[[70,390],[115,390],[100,460],[55,460]]},
    {"id":"poignet_d","label":"Poignet Droit","points":[[55,465],[100,465],[100,485],[55,485]]},
    {"id":"main_d","label":"Main Droite (Paume)","points":[[50,490],[95,490],[95,530],[50,530]]},
    {"id":"pouce_d","label":"Pouce Droit","points":[[20,500],[55,500],[55,540],[20,540]]},
    {"id":"index_d","label":"Index Droit","points":[[30,545],[50,545],[50,590],[30,590]]},
    {"id":"majeur_d","label":"Majeur Droit","points":[[52,545],[70,545],[70,600],[52,600]]},
    {"id":"annulaire_d","label":"Annulaire Droit","points":[[72,545],[88,545],[88,590],[72,590]]},
    {"id":"auriculaire_d","label":"Auriculaire Droit","points":[[90,535],[110,535],[110,575],[90,575]]},

    // BRAS GAUCHE
    {"id":"bras_g_haut","label":"Bras Gauche (Biceps)","points":[[315,215],[345,215],[345,340],[305,340]]},
    {"id":"coude_g","label":"Coude Gauche","points":[[305,345],[345,345],[345,385],[305,385]]},
    {"id":"avant_bras_g","label":"Avant-bras Gauche","points":[[315,390],[360,390],[375,460],[330,460]]},
    {"id":"poignet_g","label":"Poignet Gauche","points":[[330,465],[375,465],[375,485],[330,485]]},
    {"id":"main_g","label":"Main Gauche (Paume)","points":[[335,490],[380,490],[380,530],[335,530]]},
    {"id":"pouce_g","label":"Pouce Gauche","points":[[375,500],[410,500],[410,540],[375,540]]},
    {"id":"index_g","label":"Index Gauche","points":[[380,545],[400,545],[400,590],[380,590]]},
    {"id":"majeur_g","label":"Majeur Gauche","points":[[360,545],[378,545],[378,600],[360,600]]},
    {"id":"annulaire_g","label":"Annulaire Gauche","points":[[342,545],[358,545],[358,590],[342,590]]},
    {"id":"auriculaire_g","label":"Auriculaire Gauche","points":[[320,535],[340,535],[340,575],[320,575]]},

    // JAMBES
    {"id":"cuisse_d","label":"Cuisse Droite","points":[[135,480],[208,480],[205,620],[135,620]]},
    {"id":"genou_d","label":"Genou Droit","points":[[135,625],[205,625],[205,670],[135,670]]},
    {"id":"jambe_d","label":"Jambe Droite (Tibia)","points":[[140,675],[195,675],[190,820],[150,820]]},
    {"id":"cheville_d","label":"Cheville Droite","points":[[150,825],[190,825],[190,855],[150,855]]},
    {"id":"pied_d","label":"Pied Droit","points":[[130,860],[195,860],[185,920],[115,920]]},

    {"id":"cuisse_g","label":"Cuisse Gauche","points":[[212,480],[285,480],[285,620],[215,620]]},
    {"id":"genou_g","label":"Genou Gauche","points":[[215,625],[285,625],[285,670],[215,670]]},
    {"id":"jambe_g","label":"Jambe Gauche (Tibia)","points":[[225,675],[280,675],[270,820],[230,820]]},
    {"id":"cheville_g","label":"Cheville Gauche","points":[[230,825],[270,825],[270,855],[230,855]]},
    {"id":"pied_g","label":"Pied Gauche","points":[[225,860],[290,860],[305,920],[235,920]]}
];

let activeType = 'fracture';
let markers = [];

// --- CONFIGURATION DES LÉSIONS ---
// Initialisation
window.onload = () => {
    initPalette();
    setupInteractions();
    updateReport();
};

function initPalette() {
    const grid = document.getElementById('lesionsGrid');
    grid.innerHTML = "";
    LESIONS.forEach(l => {
        const chip = document.createElement('div');
        chip.className = 'chip' + (l.key === activeType ? ' active' : '');
        chip.innerHTML = `${l.icon} ${l.label}`;
        chip.onclick = () => {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeType = l.key;
            document.getElementById('activeMarkerLabel').innerText = l.label;
        };
        grid.appendChild(chip);
    });
}

function setupInteractions() {
    const overlay = document.getElementById('overlay');
    const tip = document.getElementById('cursorTip');

    overlay.onmousemove = (e) => {
        const rect = overlay.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 418;
        const y = ((e.clientY - rect.top) / rect.height) * 940;
        
        const zone = regionFrom(x, y);
        tip.style.display = "block";
        tip.style.left = (e.clientX + 15) + "px";
        tip.style.top = (e.clientY + 15) + "px";
        tip.innerText = zone;
    };

    overlay.onmouseleave = () => tip.style.display = "none";

    overlay.onclick = (e) => {
        const rect = overlay.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 418;
        const y = ((e.clientY - rect.top) / rect.height) * 940;
        
        markers.push({ id: Date.now(), x, y, type: activeType });
        drawMarkers();
        updateReport();
    };
}

function regionFrom(x, y) {
    for (const r of REGIONS) {
        let inside = false;
        for (let i = 0, j = r.points.length - 1; i < r.points.length; j = i++) {
            const xi = r.points[i][0], yi = r.points[i][1];
            const xj = r.points[j][0], yj = r.points[j][1];
            const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        if (inside) return r.label;
    }
    return "Zone indéterminée";
}

function drawMarkers() {
    const layer = document.getElementById('markersLayer');
    layer.innerHTML = '';
    markers.forEach(m => {
        const config = LESIONS.find(l => l.key === m.type);
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', m.x);
        circle.setAttribute('cy', m.y);
        circle.setAttribute('r', '12');
        circle.setAttribute('fill', config.color);
        circle.setAttribute('stroke', 'white');
        circle.setAttribute('stroke-width', '2');
        layer.appendChild(circle);
    });
}

function updateReport() {
    const list = document.getElementById('reportList');
    list.innerHTML = "";
    
    if(markers.length === 0) {
        list.innerHTML = "<li>Aucune lésion sélectionnée.</li>";
    }

    markers.forEach((m, index) => {
        const config = LESIONS.find(l => l.key === m.type);
        const zone = regionFrom(m.x, m.y);
        const li = document.createElement('li');
        li.innerHTML = `<strong>Lésion #${index+1} :</strong> ${config.icon} ${config.label} située au niveau : ${zone}.`;
        list.appendChild(li);
    });

    // Signature et Admin
    const patient = document.getElementById('patientId').value || "—";
    const doctor = document.getElementById('doctorName').value || "—";
    const sig = document.getElementById('doctorSig').value || "...";
    
    document.getElementById('reportMeta').innerText = `Patient : ${patient} • Médecin : ${doctor} • Date : ${new Date().toLocaleDateString('fr-FR')}`;
    document.getElementById('d-sig').innerText = sig;

    // QR Code
    const ref = Date.now().toString().slice(-6);
    document.getElementById('qr-ref').src = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=OMC-CST-${ref}`;
}

async function genererImage() {
    const captureZone = document.getElementById('capture-zone');
    const btn = event.currentTarget;
    
    btn.innerText = "UPLOAD EN COURS...";
    btn.disabled = true;

    try {
        // Capture la silhouette et le document
        const canvas = await html2canvas(captureZone, { 
            scale: 2, 
            useCORS: true,
            backgroundColor: "#ffffff" 
        });

        // Conversion en base64 pour ImgBB
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
            // Remplit la popup avec les données reçues
            document.getElementById('preview-img-result').src = result.data.url;
            document.getElementById('direct-link').value = result.data.url;
            document.getElementById('image-popup').style.display = 'flex';
        } else {
            alert("Erreur ImgBB : " + result.error.message);
        }

    } catch (e) {
        console.error(e);
        alert("Erreur lors de la génération ou de l'upload.");
    } finally {
        btn.innerText = "🖼️ GÉNÉRER L'IMAGE";
        btn.disabled = false;
    }
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

// Fonction pour copier le lien
function copyLink() {
    const copyText = document.getElementById("direct-link");
    copyText.select();
    copyText.setSelectionRange(0, 99999); // Pour mobile
    navigator.clipboard.writeText(copyText.value);
    alert("Lien copié dans le presse-papier !");
}

// Fonction pour fermer la popup
function closePopup() {
    document.getElementById('image-popup').style.display = 'none';
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', genererReference);
