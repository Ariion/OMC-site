const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 

const LESIONS = [
    {key:'fracture', label:'Fracture / Entorse', color:'#ef4444', icon:'🦴'},
    {key:'plaie_laceration', label:'Plaie & Lacération', color:'#a855f7', icon:'🔪'},
    {key:'plaie_feu', label:'Impact Arme à Feu', color:'#b91c1c', icon:'🔴'},
    {key:'brulure', label:'Brûlure', color:'#eab308', icon:'🔥'},
    {key:'hematome', label:'Contusion & traumatisme fermé', color:'#3b82f6', icon:'🟣'},
    {key:'abrasion', label:'Entorse & Luxation', color:'#10b981', icon:'🟢'},
];

const REGIONS = [
    {"id":"tete","label":"Tête / Crâne","points":[[175,20],[243,20],[258,60],[258,105],[215,125],[172,105],[172,60]]},
    {"id":"cou","label":"Cou / Cervicales","points":[[185,123],[245,123],[245,150],[185,150]]},
    {"id":"thorax","label":"Thorax / Poitrine","points":[[175,155],[255,155],[270,300],[160,300]]},
    {"id":"aisselle_d","label":"Aisselle Droite","points":[[135,210],[165,210],[170,265],[140,265]]},
    {"id":"aisselle_g","label":"Aisselle Gauche","points":[[265,210],[295,210],[290,265],[260,265]]},
    {"id":"abdomen_haut","label":"Abdomen (Haut)","points":[[160,305],[270,305],[272,340],[158,340]]},
    {"id":"ombilic","label":"Région Ombilicale (Nombril)","points":[[158,340],[272,340],[275,385],[155,385]]},
    {"id":"flanc_d","label":"Flanc Droit","points":[[135,270],[158,270],[153,400],[130,400]]},
    {"id":"flanc_g","label":"Flanc Gauche","points":[[272,270],[295,270],[300,400],[277,400]]},
    {"id":"bassin","label":"Bassin / Bas-Ventre","points":[[155,385],[275,385],[285,420],[145,420]]},
    {"id":"fosse_iliaque_d","label":"Fosse Iliaque Droite","points":[[145,420],[180,420],[180,460],[145,460]]},
    {"id":"fosse_iliaque_g","label":"Fosse Iliaque Gauche","points":[[250,420],[285,420],[285,460],[250,460]]},
    {"id":"pubis","label":"Zone Pubienne","points":[[180,420],[250,420],[245,490],[185,490]]},
    {"id":"hanche_d","label":"Hanche Droite","points":[[115,410],[145,410],[145,490],[115,490]]},
    {"id":"hanche_g","label":"Hanche Gauche","points":[[285,410],[315,410],[315,490],[285,490]]},
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

const LISTE_MEDS = ["Antalgique (Palier 1)", "Morphinique (Palier 3)", "Anti-inflammatoire", "Rappel Tétanos", "Anticoagulants", "Antibiotiques", "Plâtre", "Attelle / Écharpe", "Transfusion sanguine", "Pansement stérile"];
const LISTE_CONSEILS = ["Restriction d'activité (Repos)", "Séances Kinésithérapie", "Surélévation du membre", "Contrôle imagerie (72h)", "Surveillance température", "Éviter contact avec l'eau", "Contrôle points de suture"];

let activeType = 'fracture';
let markers = [];
window.sessionRef = "";

window.onload = () => {
    initPalette();
    setupInteractions();
    setupDraggableSystem();
    initTraitements();
    
    // Init Date & Ref
    const d = new Date();
    const dateStr = d.toISOString().slice(2,10).replace(/-/g, '');
    window.sessionRef = "#" + dateStr + Math.floor(Math.random() * 99).toString().padStart(2, '0');
    
    document.getElementById('reportRef').value = window.sessionRef;
    document.getElementById('constatDate').valueAsDate = d;

    // Création calque debug
    const svg = document.getElementById('overlay'); 
    if (svg && !document.getElementById('debugLayer')) {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.id = "debugLayer";
        g.style.display = "none";
        svg.appendChild(g);
    }
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
        tip.style.display = "block";
        tip.style.left = (e.clientX + 15) + "px";
        tip.style.top = (e.clientY + 15) + "px";
        tip.innerText = regionFrom(x, y);
    };
    overlay.onmouseleave = () => tip.style.display = "none";
}

function setupDraggableSystem() {
    const frame = document.getElementById('frame');
    
    frame.addEventListener('click', function(e) {
        if (e.target.id === 'overlay') {
            const rect = frame.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            createMarker(x, y);
        }
    });
}

function createMarker(x, y) {
    const config = LESIONS.find(l => l.key === activeType);
    const id = Date.now();
    const newMarker = {
        id: id,
        x: (x / 100) * 418,
        y: (y / 100) * 940,
        type: activeType,
        details: { typeL: "", elements: [], extras: "", origine: "" }
    };
    markers.push(newMarker);

    const markerEl = document.createElement('div');
    markerEl.className = 'marker-point';
    markerEl.id = `m-${id}`;
    markerEl.style.left = x + "%";
    markerEl.style.top = y + "%";
    markerEl.style.backgroundColor = config.color;

    // SYSTÈME DE DÉPLACEMENT (DRAG)
    markerEl.onmousedown = function(e) {
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        let hasMoved = false;

        const rect = frame.getBoundingClientRect();
        let shiftX = e.clientX - markerEl.getBoundingClientRect().left;
        let shiftY = e.clientY - markerEl.getBoundingClientRect().top;

        function onMouseMove(moveEvent) {
            hasMoved = true;
            let newX = ((moveEvent.clientX - rect.left - shiftX) / rect.width) * 100;
            let newY = ((moveEvent.clientY - rect.top - shiftY) / rect.height) * 100;
            
            // Bornes 0-100%
            newX = Math.max(0, Math.min(100, newX));
            newY = Math.max(0, Math.min(100, newY));

            markerEl.style.left = newX + "%";
            markerEl.style.top = newY + "%";

            // Mise à jour des coordonnées réelles pour le calcul de zone
            newMarker.x = (newX / 100) * 418;
            newMarker.y = (newY / 100) * 940;
            updateReport();
        }

        document.addEventListener('mousemove', onMouseMove);

        document.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            // Si on n'a pas bougé, c'est un clic simple : on ouvre les détails
            if (!hasMoved) {
                openDetails(id);
            }
            document.onmouseup = null;
        };
    };

    document.getElementById('frame').appendChild(markerEl);
    openDetails(id);
    updateReport();
}

function regionFrom(x, y) {
    for (const r of REGIONS) {
        let inside = false;
        for (let i = 0, j = r.points.length - 1; i < r.points.length; j = i++) {
            const xi = r.points[i][0], yi = r.points[i][1], xj = r.points[j][0], yj = r.points[j][1];
            if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
        }
        if (inside) return r.label;
    }
    return "Zone indéterminée";
}

function openDetails(markerId) {
    const m = markers.find(mark => mark.id == markerId);
    if (!m) return;
    const container = document.getElementById('detailsContainer');
    container.style.display = "block";
    const config = LESIONS.find(l => l.key === m.type);
    let html = `<span class="details-title">${config.icon} OPTIONS : ${config.label}</span>`;

    if (m.type === 'fracture' || m.type === 'abrasion') {
        html += `<div class="details-sub">TYPE :</div>
            <select onchange="updateMarkerDetail(${m.id}, 'typeL', this.value)">
                <option value="">Choisir...</option>
                <option value="Fermée non déplacée" ${m.details.typeL==='Fermée non déplacée'?'selected':''}>Fermée non déplacée</option>
                <option value="Fermée déplacée" ${m.details.typeL==='Fermée déplacée'?'selected':''}>Fermée déplacée</option>
                <option value="Ouverte" ${m.details.typeL==='Ouverte'?'selected':''}>Ouverte</option>
                <option value="Entorse légère" ${m.details.typeL==='Entorse légère'?'selected':''}>Entorse légère</option>
                <option value="Entorse sévère" ${m.details.typeL==='Entorse sévère'?'selected':''}>Entorse sévère</option>
                <option value="Luxation complète" ${m.details.typeL==='Luxation complète'?'selected':''}>Luxation complète</option>
            </select>`;
    } else if (m.type === 'plaie_feu') {
        html += `<div style="color:#ef4444; font-size:10px; font-weight:bold;">⚠️ DÉCLARATION LSPD REQUISE</div>
            <div class="details-sub">IMPACT :</div>
            <select onchange="updateMarkerDetail(${m.id}, 'typeL', this.value)">
                <option value="Entrée seule" ${m.details.typeL==='Entrée seule'?'selected':''}>Entrée seule</option>
                <option value="Entrée + sortie" ${m.details.typeL==='Entrée + sortie'?'selected':''}>Entrée + sortie</option>
            </select>`;
    }

    html += `<div class="details-sub">ÉLÉMENTS ASSOCIÉS :</div><div class="checkbox-grid">`;
    ["Hémorragie", "Corps étranger", "Risque infectieux", "Oedème"].forEach(el => {
        html += `<label class="checkbox-item"><input type="checkbox" onchange="updateMarkerElements(${m.id},'${el}',this.checked)" ${m.details.elements.includes(el)?'checked':''}> ${el}</label>`;
    });
    html += `</div>`;
    container.innerHTML = html;
}

function updateMarkerDetail(id, field, val) {
    const m = markers.find(mark => mark.id == id);
    if (m) { m.details[field] = val; updateReport(); }
}

function updateMarkerElements(id, val, checked) {
    const m = markers.find(mark => mark.id == id);
    if (m) {
        if (checked) m.details.elements.push(val);
        else m.details.elements = m.details.elements.filter(e => e !== val);
        updateReport();
    }
}

function initTraitements() {
    document.getElementById('medsGrid').innerHTML = LISTE_MEDS.map(m => `<label class="checkbox-item"><input type="checkbox" class="med-check" value="${m}" onchange="updateReport()"> ${m}</label>`).join('');
    document.getElementById('preconsGrid').innerHTML = LISTE_CONSEILS.map(c => `<label class="checkbox-item"><input type="checkbox" class="precon-check" value="${c}" onchange="updateReport()"> ${c}</label>`).join('');
}

function updateReport() {
    const patient = document.getElementById('patientId').value || "...";
    const doctor = document.getElementById('doctorName').value || "...";
    const dateVal = document.getElementById('constatDate').value;
    const sig = document.getElementById('doctorSig').value || "...";

    document.getElementById('display-patient').innerText = patient;
    document.getElementById('display-date').innerText = dateVal || "...";
    document.getElementById('display-ref').innerText = window.sessionRef;
    document.getElementById('reportMeta').innerText = `Patient : ${patient} • Médecin : ${doctor} • Dossier : ${window.sessionRef}`;
    document.getElementById('d-sig').innerText = sig;

    const list = document.getElementById('reportList');
    list.innerHTML = markers.length ? "" : "<li>Aucune lésion sélectionnée.</li>";
    markers.forEach((m, i) => {
        const config = LESIONS.find(l => l.key === m.type);
        const zone = regionFrom(m.x, m.y);
        const d = m.details;
        list.innerHTML += `<li><strong>${config.label}</strong> ${d.typeL ? '('+d.typeL+')' : ''} ${d.elements.length ? ' — '+d.elements.join(', ') : ''} [${zone}]</li>`;
    });

    const paf = document.getElementById('pafBadge');
    if (paf) paf.style.display = markers.some(m => m.type === 'plaie_feu') ? 'block' : 'none';

    const selMeds = Array.from(document.querySelectorAll('.med-check:checked')).map(c => c.value);
    document.getElementById('sectionTraitements').style.display = selMeds.length ? 'block' : 'none';
    document.getElementById('docMedsList').innerHTML = selMeds.map(m => `<li>${m}</li>`).join('');

    const selPre = Array.from(document.querySelectorAll('.precon-check:checked')).map(c => c.value);
    document.getElementById('sectionPrecons').style.display = selPre.length ? 'block' : 'none';
    document.getElementById('docPreconsList').innerHTML = selPre.map(p => `<li>${p}</li>`).join('');

    document.getElementById('qr-ref').src = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${window.sessionRef}`;
}

document.getElementById('btnUndo').onclick = () => {
    const points = document.querySelectorAll('.marker-point');
    if (points.length) { points[points.length-1].remove(); markers.pop(); updateReport(); }
};

document.getElementById('btnClear').onclick = () => {
    if (confirm("Réinitialiser ?")) { document.querySelectorAll('.marker-point').forEach(p => p.remove()); markers = []; updateReport(); }
};

function toggleDebug() {
    const isChecked = document.getElementById('debugToggle').checked;
    const layer = document.getElementById('debugLayer');
    if (!layer) return;
    layer.style.display = isChecked ? 'block' : 'none';
    if (isChecked && layer.innerHTML === "") {
        REGIONS.forEach(region => {
            const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            poly.setAttribute("points", region.points.map(p => p.join(",")).join(" "));
            poly.setAttribute("class", "debug-zone");
            const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
            const cX = region.points.reduce((s, p) => s + p[0], 0) / region.points.length;
            const cY = region.points.reduce((s, p) => s + p[1], 0) / region.points.length;
            txt.setAttribute("x", cX); txt.setAttribute("y", cY);
            txt.setAttribute("fill", "white"); txt.setAttribute("font-size", "8px");
            txt.setAttribute("text-anchor", "middle"); txt.textContent = region.label;
            layer.appendChild(poly); layer.appendChild(txt);
        });
    }
}

async function genererImage() {
    const btn = event.currentTarget;
    btn.innerText = "CHARGEMENT...";
    try {
        const canvas = await html2canvas(document.getElementById('capture-zone'), { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        const formData = new FormData(); formData.append("image", imgData);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
        const json = await res.json();
        if (json.success) {
            document.getElementById('preview-img-result').src = json.data.url;
            document.getElementById('direct-link').value = json.data.url;
            document.getElementById('image-popup').style.display = 'flex';
        }
    } catch (e) { alert("Erreur ImgBB"); }
    btn.innerText = "GÉNÉRER L'IMAGE";
}

async function envoyerDiscord() {
    const url = "https://discord.com/api/webhooks/1462416189526638613/iMpoe9mn6DC4j_0eBS4tOVjaDo_jy1MhfSKIEP80H7Ih3uYGHRcJ5kQSqIFuL0DTqlUy";
    try {
        const canvas = await html2canvas(document.getElementById('capture-zone'), { scale: 2, useCORS: true });
        canvas.toBlob(async (blob) => {
            const fd = new FormData();
            fd.append("payload_json", JSON.stringify({ content: `📄 **Constat : ${document.getElementById('patientId').value}**` }));
            fd.append("file", blob, "constat.png");
            await fetch(url, { method: 'POST', body: fd });
            alert("Envoyé !");
        });
    } catch (e) { alert("Erreur Discord"); }
}

function copyLink() { navigator.clipboard.writeText(document.getElementById("direct-link").value); alert("Copié !"); }
function closePopup() { document.getElementById('image-popup').style.display = 'none'; }
