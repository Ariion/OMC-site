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
    {"id":"tete","label":"Tête / Crâne","points":[[215,20],[250,60],[255,100],[215,120],[175,100],[180,60]]},
    {"id":"cou","label":"Région Cervicale (Cou)","points":[[185,125],[240,123],[240,146],[185,145]]},
    {"id":"epaule_d","label":"Épaule Droite","points":[[175,155],[140,170],[95,195],[135,265],[160,220],[175,175]]},
    {"id":"epaule_g","label":"Épaule Gauche","points":[[250,150],[300,175],[320,185],[325,190],[290,265],[260,205],[250,150]]},
    {"id":"thorax","label":"Thorax / Cage Thoracique","points":[[180,155],[240,155],[253,217],[260,300],[160,300],[170,220]]},
    {"id":"abdomen","label":"Abdomen / Ventre","points":[[160,305],[260,305],[270,400],[150,400]]},
    {"id":"hanche","label":"Hanche / Bassin","points":[[140,400],[285,405],[295,440],[295,470],[130,470],[135,425]]},
    
    // BRAS DROIT
    {"id":"bras_d_haut","label":"Bras Droit (Biceps)","points":[[95,205],[130,270],[125,310],[120,345],[85,315],[90,265]]},
    {"id":"coude_d","label":"Coude Droit","points":[[110,360],[125,360],[125,385],[110,385]]},
    {"id":"avant_bras_d","label":"Avant-bras Droit","points":[[75,400],[115,400],[100,450],[60,450]]},
    {"id":"poignet_d","label":"Poignet Droit","points":[[85,460],[50,450],[60,430],[85,440]]},
    {"id":"main_d","label":"Main Droite","points":[[80,520],[40,525],[45,455],[85,470]]},
    {"id":"pouce_d","label":"Pouce Droit","points":[[30,500],[50,500],[50,520],[30,520]]},
    {"id":"index_d","label":"Index Droit","points":[[35,530],[50,530],[50,555],[35,555]]},
    {"id":"majeur_d","label":"Majeur Droit","points":[[55,540],[70,540],[70,570],[55,570]]},
    {"id":"annulaire_d","label":"Annulaire Droit","points":[[75,535],[85,535],[85,560],[75,560]]},
    {"id":"auriculaire_d","label":"Auriculaire Droit","points":[[90,520],[100,520],[100,545],[90,545]]},

    // BRAS GAUCHE
    {"id":"bras_g_haut","label":"Bras Gauche (Biceps)","points":[[320,205],[290,270],[295,310],[300,345],[335,315],[330,265]]},
    {"id":"coude_g","label":"Coude Gauche","points":[[295,360],[310,360],[310,385],[295,385]]},
    {"id":"avant_bras_g","label":"Avant-bras Gauche","points":[[305,400],[345,400],[360,450],[320,450]]},
    {"id":"poignet_g","label":"Poignet Gauche","points":[[340,460],[375,455],[365,435],[340,445]]},
    {"id":"main_g","label":"Main Gauche","points":[[340,480],[385,530],[400,485],[355,460]]},
    {"id":"pouce_g","label":"Pouce Gauche","points":[[370,500],[390,500],[390,520],[370,520]]},
    {"id":"index_g","label":"Index Gauche","points":[[370,530],[385,530],[385,555],[370,555]]},
    {"id":"majeur_g","label":"Majeur Gauche","points":[[350,540],[365,540],[365,570],[350,570]]},
    {"id":"annulaire_g","label":"Annulaire Gauche","points":[[335,535],[345,535],[345,560],[335,560]]},
    {"id":"auriculaire_g","label":"Auriculaire Gauche","points":[[320,520],[330,520],[330,545],[320,545]]},

    // JAMBES
    {"id":"cuisse_d","label":"Cuisse Droite","points":[[130,475],[205,475],[205,515],[200,575],[195,620],[140,620]]},
    {"id":"genou_d","label":"Genou Droit","points":[[140,625],[190,625],[190,660],[140,660]]},
    {"id":"jambe_d","label":"Jambe Droite (Tibia)","points":[[140,665],[190,665],[180,820],[155,815]]},
    {"id":"pied_d","label":"Pied Droit","points":[[160,905],[125,890],[145,860],[185,860]]},

    {"id":"cuisse_g","label":"Cuisse Gauche","points":[[215,475],[295,475],[290,575],[230,620],[220,540]]},
    {"id":"genou_g","label":"Genou Gauche","points":[[230,626],[285,626],[285,661],[235,656]]},
    {"id":"jambe_g","label":"Jambe Gauche (Tibia)","points":[[235,664],[285,670],[270,825],[245,820]]},
    {"id":"pied_g","label":"Pied Gauche","points":[[280,860],[300,885],[260,905],[250,880]]}
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
