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
    {"id":"main_d","label":"Main Droite","points":[[20,470],[110,470],[110,580],[20,580]]},

    // BRAS GAUCHE
    {"id":"bras_g_haut","label":"Bras Gauche (Biceps)","points":[[315,215],[345,215],[345,340],[305,340]]},
    {"id":"coude_g","label":"Coude Gauche","points":[[305,345],[345,345],[345,385],[305,385]]},
    {"id":"avant_bras_g","label":"Avant-bras Gauche","points":[[315,390],[360,390],[375,460],[330,460]]},
    {"id":"poignet_g","label":"Poignet Gauche","points":[[330,465],[375,465],[375,485],[330,485]]},
    {"id":"main_g","label":"Main Gauche","points":[[310,470],[400,470],[400,580],[310,580]]},

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

// Initialisation
window.onload = () => {
    initPalette();
    setupInteractions();
    setupDraggableSystem();
    updateReport();

    // On cible directement l'ID 'overlay' qui est ton SVG
    const svg = document.getElementById('overlay'); 
    if (svg) {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.id = "debugLayer";
        // On l'insère au début du SVG pour qu'il soit sous les marqueurs
        svg.insertBefore(g, svg.firstChild); 
    } else {
        console.error("ERREUR : Le SVG avec l'id 'overlay' est introuvable !");
    }
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

// Tooltip de survol
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
}

function setupDraggableSystem() {
    const frame = document.getElementById('frame');
    
    // On écoute le clic sur le cadre de la silhouette
    frame.addEventListener('click', function(e) {
        // Si on clique sur un point déjà existant, on ne crée pas un nouveau point
        if (e.target.classList.contains('marker-point')) return;

        const rect = frame.getBoundingClientRect();
        
        // Calcul de la position en pourcentage
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        createMarker(x, y);
    });
}

function createMarker(x, y) {
    const config = LESIONS.find(l => l.key === activeType);
    const frame = document.getElementById('frame');
    
    const markerEl = document.createElement('div');
    markerEl.className = 'marker-point';
    
    // Style dynamique du point
    markerEl.style.left = x + "%";
    markerEl.style.top = y + "%";
    markerEl.style.backgroundColor = config.color;
    markerEl.dataset.type = activeType;

    // Drag & Drop du point
    markerEl.onmousedown = function(e) {
        e.stopPropagation(); // Empêche de créer un nouveau point par erreur
        
        let shiftX = e.clientX - markerEl.getBoundingClientRect().left;
        let shiftY = e.clientY - markerEl.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            let rectFrame = frame.getBoundingClientRect();
            let newX = ((pageX - rectFrame.left - shiftX) / rectFrame.width) * 100;
            let newY = ((pageY - rectFrame.top - shiftY) / rectFrame.height) * 100;
            
            // Limites
            markerEl.style.left = Math.max(0, Math.min(100, newX)) + "%";
            markerEl.style.top = Math.max(0, Math.min(100, newY)) + "%";
            updateMarkersData();
        }

        function onMouseMove(e) { moveAt(e.clientX, e.clientY); }
        document.addEventListener('mousemove', onMouseMove);

        document.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
        };
    };

    frame.appendChild(markerEl);
    updateMarkersData();
}

function updateMarkersData() {
    const frame = document.getElementById('frame');
    const allMarkers = frame.querySelectorAll('.marker-point');
    markers = [];
    allMarkers.forEach(el => {
        const x = (parseFloat(el.style.left) / 100) * 418;
        const y = (parseFloat(el.style.top) / 100) * 940;
        markers.push({ x, y, type: el.dataset.type });
    });
    updateReport();
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

function updateReport() {
    const list = document.getElementById('reportList');
    list.innerHTML = markers.length ? "" : "<li>Aucune lésion.</li>";

    markers.forEach((m, i) => {
        const config = LESIONS.find(l => l.key === m.type);
        const zone = regionFrom(m.x, m.y);
        const li = document.createElement('li');
        li.innerHTML = `<strong>#${i+1}</strong>: ${config.icon} ${config.label} (${zone})`;
        list.appendChild(li);
    });

    const patient = document.getElementById('patientId').value || "—";
    const doctor = document.getElementById('doctorName').value || "—";
    const sig = document.getElementById('doctorSig').value || "...";

    document.getElementById('reportMeta').innerText = `Patient : ${patient} • Médecin : ${doctor} • Date : ${new Date().toLocaleDateString('fr-FR')}`;
    document.getElementById('d-sig').innerText = sig;

    const hasPAF = markers.some(m => m.type === 'plaie_feu');
    document.getElementById('pafBadge').className = hasPAF ? 'paf-badge' : 'paf-badge paf-hidden';

    // QR Code stable basé sur l'heure de session
    if (!window.sessionRef) window.sessionRef = Date.now().toString().slice(-6);
    document.getElementById('qr-ref').src = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=OMC-CST-${window.sessionRef}`;
}

// Les boutons d'action (À mettre à la fin du fichier JS)
document.getElementById('btnUndo').onclick = function() {
    const frame = document.getElementById('frame');
    const points = frame.querySelectorAll('.marker-point');
    if (points.length > 0) {
        points[points.length - 1].remove();
        updateMarkersData();
    }
};

document.getElementById('btnClear').onclick = function() {
    if (confirm("Réinitialiser l'imagerie ?")) {
        document.querySelectorAll('.marker-point').forEach(p => p.remove());
        updateMarkersData();
    }
};

// Generation Image + ImgBB
async function genererImage() {
    const captureZone = document.getElementById('capture-zone');
    const btn = event.currentTarget;
    btn.innerText = "UPLOAD EN COURS...";
    btn.disabled = true;

    try {
        const canvas = await html2canvas(captureZone, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imageData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        const formData = new FormData();
        formData.append("image", imageData);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            document.getElementById('preview-img-result').src = result.data.url;
            document.getElementById('direct-link').value = result.data.url;
            document.getElementById('image-popup').style.display = 'flex';
        }
    } catch (e) {
        alert("Erreur lors de l'envoi ImgBB.");
    } finally {
        btn.innerText = "🖼️ GÉNÉRER L'IMAGE";
        btn.disabled = false;
    }
}

// Envoi Discord
async function envoyerDiscord() {
    const url = "https://discord.com/api/webhooks/1462416189526638613/iMpoe9mn6DC4j_0eBS4tOVjaDo_jy1MhfSKIEP80H7Ih3uYGHRcJ5kQSqIFuL0DTqlUy";
    const btn = event.currentTarget;
    const captureZone = document.getElementById('capture-zone');
    
    btn.disabled = true;
    btn.innerText = "ENVOI...";

    try {
        const canvas = await html2canvas(captureZone, { scale: 2, useCORS: true });
        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            const nom = document.getElementById('patientId').value || "Anonyme";
            formData.append("payload_json", JSON.stringify({
                content: `📄 **Nouveau Constat Lésionnel**\n👤 Patient : ${nom}`
            }));
            formData.append("file", blob, `constat_${nom}.png`);
            
            const response = await fetch(url, { method: 'POST', body: formData });
            if (response.ok) {
                alert("✅ Envoyé sur Discord !");
                btn.innerText = "ENVOYÉ";
            }
        }, 'image/png');
    } catch (e) {
        alert("Erreur Discord.");
        btn.disabled = false;
    }
}

function copyLink() {
    const copyText = document.getElementById("direct-link");
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
    alert("Lien copié !");
}

function closePopup() {
    document.getElementById('image-popup').style.display = 'none';
}

function toggleDebug() {
    const isChecked = document.getElementById('debugToggle').checked;
    const layer = document.getElementById('debugLayer');
    
    if (!layer) return; // Sécurité si le calque n'existe pas

    layer.style.display = isChecked ? 'block' : 'none';
    
    if (isChecked && layer.innerHTML === "") {
        console.log("Génération du calque de debug...");
        
        REGIONS.forEach(region => {
            const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            
            // On s'assure que les points sont bien formatés
            const pointsString = region.points.map(p => p.join(",")).join(" ");
            
            polygon.setAttribute("points", pointsString);
            polygon.setAttribute("class", "debug-zone");
            
            // On ajoute le nom pour le survol
            const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
            title.textContent = region.label;
            polygon.appendChild(title);
            
            layer.appendChild(polygon);
        });
    }
}
