const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 

// Liste des lésions enrichie
const LESIONS = [
    {key:'fracture', label:'Fracture / Entorse', color:'#ef4444', icon:'🦴'},
    {key:'plaie_laceration', label:'Plaie & Lacération', color:'#a855f7', icon:'🔪'},
    {key:'plaie_feu', label:'Impact Arme à Feu', color:'#b91c1c', icon:'🔴'},
    {key:'brulure', label:'Brûlure', color:'#eab308', icon:'🔥'},
    {key:'hematome', label:'Contusion & traumatisme fermé', color:'#3b82f6', icon:'🟣'},
    {key:'abrasion', label:'Entorse & Luxation', color:'#10b981', icon:'🟢'},
];

// Tes données de régions
const REGIONS = [
    {"id":"tete","label":"Tête / Crâne","points":[[175,20],[243,20],[258,60],[258,105],[215,125],[172,105],[172,60]]},
    {"id":"cou","label":"Cou / Cervicales","points":[[185,123],[245,123],[245,150],[185,150]]},
    
    // TRONC SUPÉRIEUR
    {"id":"thorax","label":"Thorax / Poitrine","points":[[175,155],[255,155],[270,300],[160,300]]},
    {"id":"aisselle_d","label":"Aisselle Droite","points":[[135,210],[165,210],[170,265],[140,265]]},
    {"id":"aisselle_g","label":"Aisselle Gauche","points":[[265,210],[295,210],[290,265],[260,265]]},

    // ABDOMEN DÉTAILLÉ
    {"id":"abdomen_haut","label":"Abdomen (Haut)","points":[[160,305],[270,305],[272,340],[158,340]]},
    {"id":"ombilic","label":"Région Ombilicale (Nombril)","points":[[158,340],[272,340],[275,385],[155,385]]},
    {"id":"flanc_d","label":"Flanc Droit","points":[[135,270],[158,270],[153,400],[130,400]]},
    {"id":"flanc_g","label":"Flanc Gauche","points":[[272,270],[295,270],[300,400],[277,400]]},

    // ZONE BASSIN & PUBIENNE (Fosses Iliaques)
    {"id":"bassin","label":"Bassin / Bas-Ventre","points":[[155,385],[275,385],[285,420],[145,420]]},
    {"id":"fosse_iliaque_d","label":"Fosse Iliaque Droite","points":[[145,420],[180,420],[180,460],[145,460]]},
    {"id":"fosse_iliaque_g","label":"Fosse Iliaque Gauche","points":[[250,420],[285,420],[285,460],[250,460]]},
    {"id":"pubis","label":"Zone Pubienne","points":[[180,420],[250,420],[245,490],[185,490]]},
    {"id":"hanche_d","label":"Hanche Droite","points":[[115,410],[145,410],[145,490],[115,490]]},
    {"id":"hanche_g","label":"Hanche Gauche","points":[[285,410],[315,410],[315,490],[285,490]]},

    // MEMBRES SUPÉRIEURS
    {"id":"epaule_d","label":"Épaule Droite","points":[[110,165],[170,155],[160,210],[100,210]]},
    {"id":"bras_d_haut","label":"Bras Droit (Biceps)","points":[[90,215],[125,215],[125,320],[85,320]]},
    {"id":"coude_d","label":"Coude Droit","points":[[85,325],[125,325],[125,365],[85,365]]},
    {"id":"avant_bras_d","label":"Avant-bras Droit","points":[[70,370],[115,370],[100,450],[60,450]]},
    {"id":"poignet_d","label":"Poignet Droit","points":[[55,455],[95,455],[95,480],[55,480]]},
    {"id":"main_d","label":"Main & Pouce Droits","points":[[20,485],[95,485],[90,560],[20,560]]},

    {"id":"epaule_g","label":"Épaule Gauche","points":[[260,155],[320,165],[330,210],[270,210]]},
    {"id":"bras_g_haut","label":"Bras Gauche (Biceps)","points":[[305,215],[340,215],[345,320],[305,320]]},
    {"id":"coude_g","label":"Coude Gauche","points":[[305,325],[345,325],[345,365],[305,365]]},
    {"id":"avant_bras_g","label":"Avant-bras Gauche","points":[[315,370],[360,370],[375,450],[330,450]]},
    {"id":"poignet_g","label":"Poignet Gauche","points":[[335,455],[375,455],[375,480],[335,480]]},
    {"id":"main_g","label":"Main & Pouce Gauches","points":[[330,485],[405,485],[405,560],[330,560]]},

    // MEMBRES INFÉRIEURS
    {"id":"cuisse_d","label":"Cuisse Droite","points":[[120,490],[200,495],[205,620],[135,620]]},
    {"id":"cuisse_g","label":"Cuisse Gauche","points":[[215,495],[295,495],[285,620],[215,620]]},
    {"id":"genou_d","label":"Genou Droit","points":[[135,625],[205,625],[205,670],[135,670]]},
    {"id":"genou_g","label":"Genou Gauche","points":[[215,625],[285,625],[285,670],[215,670]]},
    {"id":"jambe_d","label":"Jambe Droite (Tibia)","points":[[140,675],[195,675],[190,820],[150,820]]},
    {"id":"jambe_g","label":"Jambe Gauche (Tibia)","points":[[225,675],[280,675],[270,820],[230,820]]},
    {"id":"cheville_d","label":"Cheville Droite","points":[[150,825],[190,825],[190,855],[150,855]]},
    {"id":"cheville_g","label":"Cheville Gauche","points":[[230,825],[270,825],[270,855],[230,855]]},
    {"id":"pied_d","label":"Pied Droit","points":[[130,860],[195,860],[185,910],[120,910]]},
    {"id":"pied_g","label":"Pied Gauche","points":[[225,860],[290,860],[305,910],[240,910]]}
];

const MEDS = ["Antalgique", "Anti-inflammatoire", "Rappel Tétanos", "Anticoagulants", "Antibiotiques", "Plâtre", "Attelle", "Transfusion", "Pansement stérile"];
const PRECONS = ["Restriction d'activité", "Séances Kiné", "Surélévation", "Contrôle imagerie", "Consigne pansement", "Eviter eau"];

let activeType = 'fracture';
let markers = [];

// Initialisation
window.onload = () => {
    initPalette();
    setupInteractions();
    setupDraggableSystem();
    updateReport();
    initTraitements();

    // Création sécurisée du calque de zones
    const svg = document.getElementById('overlay'); 
    if (svg) {
        // On vérifie si le calque existe déjà pour éviter les doublons
        if (!document.getElementById('debugLayer')) {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.id = "debugLayer";
            g.style.display = "none"; // Caché par défaut
            svg.appendChild(g);
        }
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
    frame.addEventListener('mousedown', function(e) {
        if (e.target.classList.contains('marker-point')) {
            // Clic sur un point existant : on ouvre ses détails
            openDetails(e.target.dataset.id);
        }
    });

    frame.addEventListener('click', function(e) {
        if (e.target.classList.contains('marker-point') || e.target.id !== 'overlay') return;
        
        const rect = frame.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        createMarker(x, y);
    });
}

function createMarker(x, y) {
    const config = LESIONS.find(l => l.key === activeType);
    const id = Date.now();
    
    // Initialisation de l'objet marker avec des options vides
    const newMarker = {
        id: id,
        x: (x / 100) * 418,
        y: (y / 100) * 940,
        type: activeType,
        details: { typeL: "", elements: [], extras: "" } // Pour stocker les détails
    };
    
    markers.push(newMarker);

    const markerEl = document.createElement('div');
    markerEl.className = 'marker-point';
    markerEl.id = `m-${id}`;
    markerEl.dataset.id = id;
    markerEl.style.left = x + "%";
    markerEl.style.top = y + "%";
    markerEl.style.backgroundColor = config.color;

    // Logique de Drag (on désactive le clic pendant le déplacement)
    markerEl.onmousedown = function(e) {
        e.stopPropagation();
        let isDragging = false;
        let shiftX = e.clientX - markerEl.getBoundingClientRect().left;
        let shiftY = e.clientY - markerEl.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            isDragging = true;
            let rect = document.getElementById('frame').getBoundingClientRect();
            let nX = ((pageX - rect.left - shiftX) / rect.width) * 100;
            let nY = ((pageY - rect.top - shiftY) / rect.height) * 100;
            markerEl.style.left = nX + "%";
            markerEl.style.top = nY + "%";
        }

        function onMouseMove(e) { moveAt(e.clientX, e.clientY); }
        document.addEventListener('mousemove', onMouseMove);
        document.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            if (isDragging) updateMarkersCoordsFromEl(id, markerEl);
            document.onmouseup = null;
        };
    };

    document.getElementById('frame').appendChild(markerEl);
    openDetails(id); // Ouvre le menu à la création
    updateReport();
}

function updateMarkersCoordsFromEl(id, el) {
    const m = markers.find(mark => mark.id == id);
    if (m) {
        m.x = (parseFloat(el.style.left) / 100) * 418;
        m.y = (parseFloat(el.style.top) / 100) * 940;
        updateReport();
    }
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
    // 1. Liaison des Textes (Patient, Médecin, Date)
    const patient = document.getElementById('patientId').value || "—";
    const doctor = document.getElementById('doctorName').value || "—";
    const dateTime = document.getElementById('constatDateTime').value;
    
    // Formatage de la date
    let dateFormatted = "—";
    if (dateTime) {
        const d = new Date(dateTime);
        dateFormatted = d.toLocaleDateString('fr-FR') + " à " + d.toLocaleTimeString('fr-FR', {hour: '2bit', minute:'2bit'});
    }

    document.getElementById('reportMeta').innerText = `Patient : ${patient} • Médecin : ${doctor} • Le : ${dateFormatted}`;

    // 2. Gestion de la Signature
    const sig = document.getElementById('doctorSig').value || "...";
    document.getElementById('d-sig').innerText = sig;

    // 3. Liste des Lésions
    const list = document.getElementById('reportList');
    list.innerHTML = markers.length ? "" : "<li>Aucune lésion.</li>";

    markers.forEach((m, i) => {
        const config = LESIONS.find(l => l.key === m.type);
        const zone = regionFrom(m.x, m.y);
        const d = m.details || {}; // Sécurité si details est null
        
        let texteLésion = `<strong>${config.label}</strong>`;
        if (d.typeL) texteLésion += ` (${d.typeL})`;
        if (d.extras) texteLésion += ` [${d.extras}]`;
        
        let associes = (d.elements && d.elements.length > 0) ? ` — éléments associés : ${d.elements.join(', ')}` : "";
        
        const li = document.createElement('li');
        li.innerHTML = `${texteLésion}${associes} au niveau de : ${zone}.`;
        list.appendChild(li);
    });

    // 4. Badge Arme à feu
    const pafBadge = document.getElementById('pafBadge');
    if (pafBadge) {
        const hasPAF = markers.some(m => m.type === 'plaie_feu');
        pafBadge.className = hasPAF ? 'paf-badge' : 'paf-badge paf-hidden';
    }

    // 5. QR Code et Référence
    if (!window.sessionRef) {
        window.sessionRef = "OMC-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        document.getElementById('reportRef').value = window.sessionRef;
    }
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${window.sessionRef}-${patient}`;
    document.getElementById('qr-ref').src = qrUrl;
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
    document.getElementById('debugToggle').checked = false;
toggleDebug();
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

// Listes de données
const LISTE_MEDS = ["Antalgique (Palier 1)", "Morphinique (Palier 3)", "Anti-inflammatoire", "Rappel Tétanos", "Anticoagulants", "Antibiotiques", "Plâtre", "Attelle / Écharpe", "Transfusion sanguine", "Pansement stérile"];
const LISTE_CONSEILS = ["Restriction d'activité (Repos)", "Séances Kinésithérapie", "Surélévation du membre", "Contrôle imagerie (72h)", "Surveillance température", "Éviter contact avec l'eau", "Contrôle points de suture"];

function initTraitements() {
    const medsGrid = document.getElementById('medsGrid');
    const preconsGrid = document.getElementById('preconsGrid');
    
    // Génère les Médicaments
    medsGrid.innerHTML = LISTE_MEDS.map(m => `
        <label class="checkbox-item">
            <input type="checkbox" class="med-check" value="${m}" onchange="updateReport()"> ${m}
        </label>
    `).join('');

    // Génère les Conseils
    preconsGrid.innerHTML = LISTE_CONSEILS.map(c => `
        <label class="checkbox-item">
            <input type="checkbox" class="precon-check" value="${c}" onchange="updateReport()"> ${c}
        </label>
    `).join('');
}


// Envoi Discord
async function envoyerDiscord() {
    document.getElementById('debugToggle').checked = false;
toggleDebug();
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
    const svg = document.getElementById('overlay');
    
    if (!layer || !svg) return;

    // A chaque clic, on le déplace à la fin du SVG pour qu'il soit devant l'image
    svg.appendChild(layer); 
    layer.style.display = isChecked ? 'block' : 'none';

    if (isChecked && layer.innerHTML === "") {
        REGIONS.forEach(region => {
            const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            polygon.setAttribute("points", region.points.map(p => p.join(",")).join(" "));
            polygon.setAttribute("class", "debug-zone");
            layer.appendChild(polygon);

            // Ajout du texte
            const centerX = region.points.reduce((sum, p) => sum + p[0], 0) / region.points.length;
            const centerY = region.points.reduce((sum, p) => sum + p[1], 0) / region.points.length;
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", centerX); text.setAttribute("y", centerY);
            text.setAttribute("fill", "white"); text.setAttribute("font-size", "9px");
            text.setAttribute("text-anchor", "middle"); text.setAttribute("style", "text-shadow: 1px 1px 2px black;");
            text.textContent = region.label;
            layer.appendChild(text);
        });
    }
}

function openDetails(markerId) {
    const m = markers.find(mark => mark.id == markerId);
    if (!m) return;

    const container = document.getElementById('detailsContainer');
    container.style.display = "block";
    
    // Titre dynamique avec l'icône de la lésion
    const config = LESIONS.find(l => l.key === m.type);
    let html = `<span class="details-title">${config.icon} OPTIONS : ${config.label}</span>`;

    // --- BLOC FRACTURE / ENTORSE ---
    if (m.type === 'fracture') {
        html += `
            <div class="details-sub">TYPE :</div>
            <select onchange="updateMarkerDetail(${m.id}, 'typeL', this.value)">
                <option value="">Choisir...</option>
                <option value="Fermée non déplacée" ${m.details.typeL === 'Fermée non déplacée'?'selected':''}>Fermée non déplacée</option>
                <option value="Fermée déplacée" ${m.details.typeL === 'Fermée déplacée'?'selected':''}>Fermée déplacée</option>
                <option value="Ouverte" ${m.details.typeL === 'Ouverte'?'selected':''}>Ouverte</option>
                <option value="Entorse légère" ${m.details.typeL === 'Entorse légère'?'selected':''}>Entorse légère</option>
                <option value="Entorse sévère" ${m.details.typeL === 'Entorse sévère'?'selected':''}>Entorse sévère</option>
                <option value="Luxation complète" ${m.details.typeL === 'Luxation complète'?'selected':''}>Luxation complète</option>
            </select>
        `;
    }

    // --- BLOC BRÛLURE ---
    if (m.type === 'brulure') {
        html += `
            <div class="details-sub">DEGRÉ :</div>
            <select onchange="updateMarkerDetail(${m.id}, 'typeL', this.value)">
                <option value="">Choisir...</option>
                <option value="1er degré (rougeurs)" ${m.details.typeL === '1er degré (rougeurs)'?'selected':''}>1er degré (rougeurs)</option>
                <option value="2e degré (cloques)" ${m.details.typeL === '2e degré (cloques)'?'selected':''}>2e degré (cloques)</option>
                <option value="3e degré (peau détruite)" ${m.details.typeL === '3e degré (peau détruite)'?'selected':''}>3e degré (peau détruite)</option>
            </select>
            <div class="details-sub">CAUSE :</div>
            <select onchange="updateMarkerDetail(${m.id}, 'origine', this.value)">
                <option value="Thermique" ${m.details.origine === 'Thermique'?'selected':''}>Thermique</option>
                <option value="Chimique" ${m.details.origine === 'Chimique'?'selected':''}>Chimique</option>
                <option value="Electrique" ${m.details.origine === 'Electrique'?'selected':''}>Electrique</option>
            </select>
            <div class="details-sub">ÉTENDUE :</div>
            <select onchange="updateMarkerDetail(${m.id}, 'extras', this.value)">
                <option value="< 5%" ${m.details.extras === '< 5%'?'selected':''}>Moins de 5%</option>
                <option value="5% - 50%" ${m.details.extras === '5% - 50%'?'selected':''}>5% à 50%</option>
                <option value="> 80%" ${m.details.extras === '> 80%'?'selected':''}>Plus de 80%</option>
            </select>
        `;
    }

    // --- BLOC LACÉRATION / COUPURE ---
    if (m.type === 'plaie_laceration') {
        html += `
            <div class="details-sub">TYPE :</div>
            <select onchange="updateMarkerDetail(${m.id}, 'typeL', this.value)">
                <option value="Coupure superficielle" ${m.details.typeL === 'Coupure superficielle'?'selected':''}>Coupure superficielle</option>
                <option value="Lacération profonde" ${m.details.typeL === 'Lacération profonde'?'selected':''}>Lacération profonde</option>
                <option value="Perforation" ${m.details.typeL === 'Perforation'?'selected':''}>Perforation</option>
            </select>
            <div class="details-sub">ORIGINE :</div>
            <select onchange="updateMarkerDetail(${m.id}, 'origine', this.value)">
                <option value="Arme Blanche" ${m.details.origine === 'Arme Blanche'?'selected':''}>Arme Blanche</option>
                <option value="Autre (environnement)" ${m.details.origine === 'Autre (environnement)'?'selected':''}>Autre (environnement)</option>
            </select>
        `;
    }

    // --- BLOC ARME À FEU (PAF) ---
    if (m.type === 'plaie_feu') {
        html += `
            <div style="color:#ef4444; font-size:10px; font-weight:bold; margin-bottom:5px;">⚠️ DÉCLARATION LSPD/BCSO REQUISE</div>
            <div class="details-sub">IMPACT :</div>
            <select onchange="updateMarkerDetail(${m.id}, 'typeL', this.value)">
                <option value="Entrée seule" ${m.details.typeL === 'Entrée seule'?'selected':''}>Entrée seule</option>
                <option value="Entrée + sortie" ${m.details.typeL === 'Entrée + sortie'?'selected':''}>Entrée + sortie</option>
            </select>
            <div class="details-sub">GRAVITÉ :</div>
            <select onchange="updateMarkerDetail(${m.id}, 'extras', this.value)">
                <option value="Superficielle" ${m.details.extras === 'Superficielle'?'selected':''}>Superficielle</option>
                <option value="Pénétrante" ${m.details.extras === 'Pénétrante'?'selected':''}>Pénétrante</option>
                <option value="Traversante" ${m.details.extras === 'Traversante'?'selected':''}>Traversante</option>
            </select>
        `;
    }

    // --- BLOC CONTUSION / HEMATOME ---
    if (m.type === 'hematome' || m.type === 'abrasion') {
        html += `
            <div class="details-sub">GRAVITÉ :</div>
            <select onchange="updateMarkerDetail(${m.id}, 'extras', this.value)">
                <option value="Légère" ${m.details.extras === 'Légère'?'selected':''}>Légère</option>
                <option value="Moyenne" ${m.details.extras === 'Moyenne'?'selected':''}>Moyenne</option>
                <option value="Sévère" ${m.details.extras === 'Sévère'?'selected':''}>Sévère</option>
            </select>
        `;
    }

    // --- SECTION ÉLÉMENTS ASSOCIÉS (Commun à presque tout) ---
    html += `<div class="details-sub">ÉLÉMENTS ASSOCIÉS :</div>`;
html += `<div class="checkbox-grid">`; // Ouverture de la grille
const commonElements = ["Hémorragie", "Corps étranger", "Risque infectieux", "Hémorragie interne", "Oedème"];
commonElements.forEach(el => {
    html += `
        <label class="checkbox-item">
            <input type="checkbox" onchange="updateMarkerElements(${m.id}, '${el}', this.checked)" ${m.details.elements.includes(el)?'checked':''}>
            <span>${el}</span>
        </label>
    `;
});
html += `</div>`; // Fermeture de la grille

    // --- SECTION ORGANES (Si abdomen/thorax) ---
    const zone = regionFrom(m.x, m.y);
   if (zone.includes("Abdomen") || zone.includes("Thorax") || zone.includes("Flanc")) {
    html += `<div class="details-sub">LÉSION D'ORGANE :</div>`;
    html += `<div class="checkbox-grid">`;
    ["Cœur", "Estomach", "Foie", "Intestin", "Poumon", "Rate", "Rein"].forEach(org => {
        html += `
            <label class="checkbox-item">
                <input type="checkbox" onchange="updateMarkerElements(${m.id}, '${org}', this.checked)" ${m.details.elements.includes(org)?'checked':''}>
                <span>${org}</span>
            </label>
        `;
    });
    html += `</div>`;
}

    container.innerHTML = html;
    updateReport();
}

// Fonctions de mise à jour des données du marqueur
function updateMarkerDetail(id, field, value) {
    const m = markers.find(mark => mark.id == id);
    if (m) {
        m.details[field] = value;
        updateReport();
    }
}

function updateMarkerElements(id, value, checked) {
    const m = markers.find(mark => mark.id == id);
    if (m) {
        if (checked) {
            if (!m.details.elements.includes(value)) m.details.elements.push(value);
        } else {
            m.details.elements = m.details.elements.filter(e => e !== value);
        }
        updateReport();
    }
}

// 5. Modification de updateReport pour inclure les détails
function updateReport() {
    const list = document.getElementById('reportList');
    list.innerHTML = markers.length ? "" : "<li>Aucune lésion.</li>";

    markers.forEach((m, i) => {
        const config = LESIONS.find(l => l.key === m.type);
        const zone = regionFrom(m.x, m.y);
        const det = m.details;
        
        let detailText = det.typeL ? ` <i>(${det.typeL})</i>` : "";
        let elementsText = det.elements.length ? ` — éléments associés : ${det.elements.join(', ')}` : "";
        
        const li = document.createElement('li');
        li.innerHTML = `<strong>${config.label}</strong>${detailText}${elementsText} au niveau de : ${zone}.`;
        list.appendChild(li);
        // Gestion des affichages Traitements sur le doc
    const selectedMeds = Array.from(document.querySelectorAll('.med-check:checked')).map(cb => cb.value);
    const selectedPrecons = Array.from(document.querySelectorAll('.precon-check:checked')).map(cb => cb.value);

    const divMeds = document.getElementById('sectionTraitements');
    const listMeds = document.getElementById('docMedsList');
    divMeds.style.display = selectedMeds.length ? 'block' : 'none';
    listMeds.innerHTML = selectedMeds.map(m => `<li>${m}</li>`).join('');

    const divPre = document.getElementById('sectionPrecons');
    const listPre = document.getElementById('docPreconsList');
    divPre.style.display = selectedPrecons.length ? 'block' : 'none';
    listPre.innerHTML = selectedPrecons.map(c => `<li>${c}</li>`).join('');
    });
    
}
