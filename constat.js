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
    
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    window.sessionRef = `#${day}${month}${hours}${minutes}`;
    document.getElementById('constatDate').valueAsDate = now;
    
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
    const markerNumber = markers.length + 1;
    const newMarker = {
        id: id,
        number: markerNumber,
        x: (x / 100) * 418,
        y: (y / 100) * 940,
        type: activeType,
        details: { typeL: "", elements: [], extras: "", origine: "", organes: [] }
    };
    markers.push(newMarker);

    const markerEl = document.createElement('div');
    markerEl.className = 'marker-point';
    markerEl.id = `m-${id}`;
    markerEl.innerText = markerNumber;
    markerEl.style.left = x + "%";
    markerEl.style.top = y + "%";
    markerEl.style.backgroundColor = config.color;

    markerEl.oncontextmenu = function(e) {
        e.preventDefault();
        markerEl.remove();
        markers = markers.filter(m => m.id !== id);
        reindexMarkers();
        updateReport();
        document.getElementById('detailsContainer').style.display = "none";
    };

    markerEl.onmousedown = function(e) {
        e.stopPropagation();
        let hasMoved = false;
        const rect = document.getElementById('frame').getBoundingClientRect();
        let shiftX = e.clientX - markerEl.getBoundingClientRect().left;
        let shiftY = e.clientY - markerEl.getBoundingClientRect().top;

        function onMouseMove(moveEvent) {
            hasMoved = true;
            let newX = ((moveEvent.clientX - rect.left - shiftX) / rect.width) * 100;
            let newY = ((moveEvent.clientY - rect.top - shiftY) / rect.height) * 100;
            newX = Math.max(0, Math.min(100, newX));
            newY = Math.max(0, Math.min(100, newY));
            markerEl.style.left = newX + "%";
            markerEl.style.top = newY + "%";
            newMarker.x = (newX / 100) * 418;
            newMarker.y = (newY / 100) * 940;
            updateReport();
        }

        document.addEventListener('mousemove', onMouseMove);
        document.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            if (!hasMoved) openDetails(id);
            document.onmouseup = null;
        };
    };

    document.getElementById('frame').appendChild(markerEl);
    openDetails(id);
    updateReport();
}

function reindexMarkers() {
    markers.forEach((m, index) => {
        const newNum = index + 1;
        m.number = newNum;
        const el = document.getElementById(`m-${m.id}`);
        if(el) el.innerText = newNum;
    });
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

    let html = `<span class="details-header">Options de la lésion (${config.label})</span>`;
    html += `<div class="details-grid-wrapper">`;

    if (m.type === 'fracture') {
        html += renderOptionGroup(m, "Type", ["Fermée non déplacée", "Fermée déplacée", "Ouverte"]);
    } else if (m.type === 'plaie_laceration') {
        html += renderOptionGroup(m, "Type", ["Coupure superficielle", "Lacération profonde", "Perforation"]);
        html += renderOptionGroup(m, "Origine", ["Arme Blanche", "Autre (environnement)"], "origine");
        html += renderOptionGroup(m, "Lésion d’organe", ["Cœur", "Estomac", "Foie", "Intestin", "Poumon", "Rate", "Rein"], "organes", true);
    } else if (m.type === 'brulure') {
        html += renderOptionGroup(m, "Brûlure thermique", ["1er degré (rougeurs)", "2e degré (cloques)", "3e degré (peau détruite)"]);
        html += renderOptionGroup(m, "Cause", ["Thermique", "Chimique", "Électrique", "Inhalation de fumée"], "origine");
        html += renderOptionGroup(m, "Étendue", ["< 5%", "5% - 50%", "50% - 80%", "> 80%"], "extras");
    } else if (m.type === 'hematome') {
        html += renderOptionGroup(m, "Type", ["Hématome", "Œdème", "Traumatisme crânien", "Hémorragie interne"]);
        html += renderOptionGroup(m, "Gravité", ["Légère", "Moyenne", "Sévère"], "extras");
    } else if (m.type === 'plaie_feu') {
        html += `<div style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 6px 12px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-bottom: 10px; border: 1px solid rgba(239, 68, 68, 0.2);">🔴 PAF détectée</div>`;
        html += renderOptionGroup(m, "Type d’impact", ["Entrée seule", "Entrée + sortie"]);
        html += renderOptionGroup(m, "Gravité", ["Superficielle", "Pénétrante", "Traversante"], "extras");
        html += renderOptionGroup(m, "Lésion d’organe", ["Cœur", "Estomac", "Foie", "Intestin", "Poumon", "Rate", "Rein"], "organes", true);
    } else if (m.type === 'abrasion') {
        html += renderOptionGroup(m, "Type", ["Entorse légère", "Entorse sévère", "Luxation complète"]);
    }

    html += renderOptionGroup(m, "Éléments associés", ["Hémorragie", "Corps étranger présent", "Risque infectieux"], "elements", true);
    html += `</div>`;
    container.innerHTML = html;
}

function renderOptionGroup(marker, title, options, field = "typeL", isMultiple = false) {
    let groupHtml = `<div class="option-group"><div class="details-sub-title">${title}</div><div class="options-grid">`;
    options.forEach(opt => {
        let isSelected = isMultiple ? (marker.details[field] || []).includes(opt) : marker.details[field] === opt;
        const activeClass = isSelected ? 'selected' : '';
        groupHtml += `<button class="opt-btn ${activeClass}" onclick="toggleOption(${marker.id}, '${field}', '${opt}', ${isMultiple})">${opt}</button>`;
    });
    groupHtml += `</div></div>`;
    return groupHtml;
}

function toggleOption(id, field, val, isMultiple) {
    const m = markers.find(mark => mark.id == id);
    if (!m) return;
    if (!m.details[field]) m.details[field] = isMultiple ? [] : "";
    if (isMultiple) {
        if (m.details[field].includes(val)) m.details[field] = m.details[field].filter(v => v !== val);
        else m.details[field].push(val);
    } else {
        m.details[field] = val;
    }
    updateReport();
    openDetails(id);
}

function initTraitements() {
    document.getElementById('medsGrid').innerHTML = LISTE_MEDS.map(m => `<label class="checkbox-item"><input type="checkbox" class="med-check" value="${m}" onchange="updateReport()"> ${m}</label>`).join('');
    document.getElementById('preconsGrid').innerHTML = LISTE_CONSEILS.map(c => `<label class="checkbox-item"><input type="checkbox" class="precon-check" value="${c}" onchange="updateReport()"> ${c}</label>`).join('');
}

function updateReport() {
    const patientVal = document.getElementById('patientId').value || "...";
    const birthInput = document.getElementById('patientBirth').value;
    const imagingVal = document.getElementById('imagingDoc').value || "...";
    const doctorVal = document.getElementById('doctorName').value || "...";
    const dateVal = document.getElementById('constatDate').value;
    const sigVal = document.getElementById('doctorSig').value || "...";

// 2. Formatage des dates
    const formattedBirth = birthInput ? new Date(birthInput).toLocaleDateString('fr-FR') : "...";
    const formattedDate = dateVal ? new Date(dateVal).toLocaleDateString('fr-FR') : "...";

    // 3. Mise à jour de l'aperçu à droite
    if(document.getElementById('display-patient')) document.getElementById('display-patient').innerText = patientVal;
    if(document.getElementById('display-birth')) document.getElementById('display-birth').innerText = formattedBirth;
    if(document.getElementById('display-imaging')) document.getElementById('display-imaging').innerText = imagingVal;
    if(document.getElementById('display-date')) document.getElementById('display-date').innerText = formattedDate;
    if(document.getElementById('display-ref')) document.getElementById('display-ref').innerText = window.sessionRef;
    if(document.getElementById('d-sig')) document.getElementById('d-sig').innerText = sigVal;
    
    const displayDate = document.getElementById('display-date');
    if(displayDate) displayDate.innerText = dateVal ? new Date(dateVal).toLocaleDateString('fr-FR') : "...";
    if(document.getElementById('d-sig')) document.getElementById('d-sig').innerText = sigVal;

    const list = document.getElementById('reportList');
    if (list) {
        list.innerHTML = markers.length ? "" : "<li>Aucune lésion sélectionnée.</li>";
        markers.forEach((m) => {
            const config = LESIONS.find(l => l.key === m.type);
            const zone = regionFrom(m.x, m.y);
            const d = m.details || {};
            let parts = [];
            if (d.typeL) parts.push(d.typeL);
            if (d.origine) parts.push(`Origine: ${d.origine}`);
            if (d.extras) parts.push(`Détail: ${d.extras}`);
            if (d.organes && d.organes.length) parts.push(`Organes: ${d.organes.join(', ')}`);
            if (d.elements && d.elements.length) parts.push(`Assoc.: ${d.elements.join(', ')}`);
            
            const txt = parts.length ? ` (${parts.join(' — ')})` : "";
            const li = document.createElement('li');
            li.style.listStyle = "none";
            li.style.marginBottom = "8px";
            li.innerHTML = `<span class="report-badge" style="background:${config.color}">${m.number}</span> <strong>${config.label}</strong>${txt} : <u>${zone}</u>.`;
            list.appendChild(li);
        });
    }

    const obsInput = document.getElementById('obsSupInput').value;
    const sectionObs = document.getElementById('sectionObsSup');
    if (sectionObs) {
        sectionObs.style.display = obsInput.trim() !== "" ? 'block' : 'none';
        document.getElementById('docObsSupText').innerText = obsInput;
    }

    const pafBadge = document.getElementById('pafBadge');
    if (pafBadge) pafBadge.style.display = markers.some(m => m.type === 'plaie_feu') ? 'block' : 'none';

    const selectedMeds = Array.from(document.querySelectorAll('.med-check:checked')).map(cb => cb.value);
    document.getElementById('sectionTraitements').style.display = selectedMeds.length ? 'block' : 'none';
    document.getElementById('docMedsList').innerHTML = selectedMeds.map(m => `<li>${m}</li>`).join('');

    const selectedPrecons = Array.from(document.querySelectorAll('.precon-check:checked')).map(cb => cb.value);
    document.getElementById('sectionPrecons').style.display = selectedPrecons.length ? 'block' : 'none';
    document.getElementById('docPreconsList').innerHTML = selectedPrecons.map(c => `<li>${c}</li>`).join('');

    const qrImg = document.getElementById('qr-ref');
    if (qrImg) {
        const refData = document.getElementById('patientId').value || "0000";
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OMC-CERT-${refData}`;
    }
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
    const layer = document.getElementById('debugLayer') || document.createElementNS("http://www.w3.org/2000/svg", "g");
    layer.id = "debugLayer";
    const svg = document.getElementById('overlay');
    layer.style.display = isChecked ? 'block' : 'none';
    if (isChecked) {
        svg.appendChild(layer);
        if (layer.innerHTML === "") {
            REGIONS.forEach(region => {
                const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                poly.setAttribute("points", region.points.map(p => p.join(",")).join(" "));
                poly.setAttribute("style", "fill:rgba(59,130,246,0.3); stroke:white; stroke-width:0.5; pointer-events:none;");
                layer.appendChild(poly);
            });
        }
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
    const url = "https://discord.com/api/webhooks/1421780761731928194/ZFSpiLTHfytIGT02QBf5SBOIEDzWMaf_PMHtDB9sd-GmF5chHnQqQic-9YpLnYHJIRPo";
    try {
        const canvas = await html2canvas(document.getElementById('capture-zone'), { scale: 2, useCORS: true });
        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            const nom = document.getElementById('patientId').value || "Inconnu";
            formData.append("payload_json", JSON.stringify({
                thread_name: `Imagerie - ${nom} - sessionRef`,
                content: `🚑 **Nouveau Constat Lésionnel** : ${nom}`
            }));
            formData.append("file", blob, `constat_${nom}.png`);
            await fetch(url + "?wait=true", { method: 'POST', body: formData });
            alert("✅ Constat envoyé !");
        }, 'image/png');
    } catch (e) { alert("Erreur Discord"); }
}

function copyLink() { navigator.clipboard.writeText(document.getElementById("direct-link").value); alert("Copié !"); }
function closePopup() { document.getElementById('image-popup').style.display = 'none'; }
