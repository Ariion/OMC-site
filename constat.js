// Configuration des types de lésions (Basé sur ton LESIONS)
const LESIONS = [
    {key:'fracture', label:'Fracture', color:'#ef4444'},
    {key:'plaie_laceration', label:'Plaie & lacération', color:'#a855f7'},
    {key:'plaie_feu', label:'Plaie par arme à feu', color:'#b91c1c'},
    {key:'brulure', label:'Brûlure', color:'#eab308'}
];

// Tes données de régions (Gardées telles quelles)
const REGIONS = [
    {"id":"tete","label":"Tête","points":[[215,20],[235,30],[245,45],[250,60],[250,75],[255,80],[255,95],[245,105],[240,120],[185,120],[180,105],[175,95],[170,80],[174,60],[175,45],[190,30],[200,20],[215,20]]},
    {"id":"cou","label":"Cou","points":[[185,125],[240,123],[240,146],[185,145],[185,125]]},
    {"id":"epaule_droite","label":"Épaule Droite","points":[[175,155],[140,170],[95,195],[135,265],[160,220],[175,175]]},
    {"id":"epaule_gauche","label":"Épaule Gauche","points":[[250,150],[300,175],[320,185],[325,190],[290,265],[260,205],[250,150]]},
    {"id":"thorax","label":"Thorax","points":[[180,155],[240,155],[253,217],[279,266],[275,305],[149,301],[145,265],[170,220]]},
    {"id":"abdomen","label":"Abdomen","points":[[150,310],[275,314],[280,360],[285,395],[145,395],[145,315]]},
    {"id":"hanche","label":"Hanche","points":[[140,400],[285,405],[295,440],[295,470],[130,470],[135,425]]},
    {"id":"cuisse_gauche","label":"Cuisse Gauche","points":[[215,475],[295,475],[290,575],[285,620],[230,620],[220,540],[220,505]]},
    {"id":"cuisse_droite","label":"Cuisse Droite","points":[[130,475],[205,475],[205,515],[200,575],[195,620],[140,620],[135,575],[130,525]]},
    {"id":"genoux_gauche","label":"Genou Gauche","points":[[230,626],[285,626],[285,661],[235,656],[235,646]]},
    {"id":"genoux_droit","label":"Genou Droit","points":[[140,625],[190,625],[190,660],[140,660],[140,640]]},
    {"id":"jambe_gauche","label":"Jambe Gauche","points":[[235,664],[285,670],[285,750],[270,815],[270,825],[245,820],[240,765],[235,730],[235,695]]},
    {"id":"jambe_droite","label":"Jambe Droite","points":[[140,665],[190,665],[190,730],[185,760],[180,795],[180,820],[155,815],[145,760],[140,725],[140,675]]},
    {"id":"cheville_gauche","label":"Cheville Gauche","points":[[245,825],[270,830],[275,860],[245,875],[240,855],[245,835]]},
    {"id":"cheville_droite","label":"Cheville Droite","points":[[155,825],[180,825],[185,855],[150,855],[155,840]]},
    {"id":"pied_gauche","label":"Pied Gauche","points":[[280,860],[300,885],[295,895],[280,905],[260,905],[250,890],[250,880],[260,870]]},
    {"id":"pied_droit","label":"Pied Droit","points":[[160,905],[135,900],[125,890],[130,875],[145,860],[165,860],[185,860],[180,875],[175,895],[170,900]]},
    {"id":"bras_gauche","label":"Bras Gauche","points":[[335,425],[310,355],[305,310],[295,270],[330,195],[335,235],[335,285],[340,310],[350,340],[360,410],[365,430],[340,435]]},
    {"id":"poignet_gauche","label":"Poignet Gauche","points":[[340,460],[380,455],[365,445],[365,435],[350,435],[340,445]]},
    {"id":"main_gauche","label":"Main Gauche","points":[[385,530],[355,530],[345,520],[340,480],[340,465],[355,460],[370,460],[385,465],[400,485],[400,495],[385,485]]},
    {"id":"bras_droit","label":"Bras Droit","points":[[90,430],[65,425],[70,385],[75,345],[85,315],[90,265],[95,220],[95,205],[130,270],[125,310],[120,345],[110,380]]},
    {"id":"poignet_droit","label":"Poignet Droit","points":[[85,460],[50,450],[60,440],[60,430],[75,430],[80,430],[85,440]]},
    {"id":"main_droite","label":"Main Droite","points":[[80,520],[70,530],[55,530],[40,525],[45,495],[45,480],[35,495],[25,495],[30,480],[45,455],[60,455],[75,460],[85,470],[85,505],[85,515]]}
];

let activeType = 'fracture';
let markers = [];

// --- CONFIGURATION DES LÉSIONS ---
const LESIONS = [
    {key:'fracture', label:'Fracture', color:'#ef4444', icon:'🦴'},
    {key:'plaie_laceration', label:'Plaie & lacération', color:'#a855f7', icon:'🔪'},
    {key:'plaie_feu', label:'Plaie par arme à feu', color:'#b91c1c', icon:'🔴'},
    {key:'brulure', label:'Brûlure', color:'#eab308', icon:'🔥'}
];

// --- DONNÉES DES RÉGIONS (Coordonnées du corps) ---
const REGIONS = [
    {"id":"tete","label":"Tête","points":[[215,20],[235,30],[245,45],[250,60],[250,75],[255,80],[255,95],[245,105],[240,120],[185,120],[180,105],[175,95],[170,80],[174,60],[175,45],[190,30],[200,20],[215,20]]},
    {"id":"cou","label":"Cou","points":[[185,125],[240,123],[240,146],[185,145],[185,125]]},
    {"id":"epaule_droite","label":"Épaule Droite","points":[[175,155],[140,170],[95,195],[135,265],[160,220],[175,175]]},
    {"id":"epaule_gauche","label":"Épaule Gauche","points":[[250,150],[300,175],[320,185],[325,190],[290,265],[260,205],[250,150]]},
    {"id":"thorax","label":"Thorax","points":[[180,155],[240,155],[253,217],[279,266],[275,305],[149,301],[145,265],[170,220]]},
    {"id":"abdomen","label":"Abdomen","points":[[150,310],[275,314],[280,360],[285,395],[145,395],[145,315]]},
    {"id":"hanche","label":"Hanche","points":[[140,400],[285,405],[295,440],[295,470],[130,470],[135,425]]},
    {"id":"cuisse_gauche","label":"Cuisse Gauche","points":[[215,475],[295,475],[290,575],[285,620],[230,620],[220,540],[220,505]]},
    {"id":"cuisse_droite","label":"Cuisse Droite","points":[[130,475],[205,475],[205,515],[200,575],[195,620],[140,620],[135,575],[130,525]]},
    {"id":"genoux_gauche","label":"Genou Gauche","points":[[230,626],[285,626],[285,661],[235,656],[235,646]]},
    {"id":"genoux_droit","label":"Genou Droit","points":[[140,625],[190,625],[190,660],[140,660],[140,640]]},
    {"id":"jambe_gauche","label":"Jambe Gauche","points":[[235,664],[285,670],[285,750],[270,815],[270,825],[245,820],[240,765],[235,730],[235,695]]},
    {"id":"jambe_droite","label":"Jambe Droite","points":[[140,665],[190,665],[190,730],[185,760],[180,795],[180,820],[155,815],[145,760],[140,725],[140,675]]},
    {"id":"bras_gauche","label":"Bras Gauche","points":[[335,425],[310,355],[305,310],[295,270],[330,195],[335,235],[335,285],[340,310],[350,340],[360,410],[365,430],[340,435]]},
    {"id":"bras_droit","label":"Bras Droit","points":[[90,430],[65,425],[70,385],[75,345],[85,315],[90,265],[95,220],[95,205],[130,270],[125,310],[120,345],[110,380]]}
];

let activeType = 'fracture';
let markers = [];

// 1. Initialisation
window.onload = () => {
    initPalette();
    updateReport();
};

// 2. Création des boutons de sélection (Chips)
function initPalette() {
    const grid = document.getElementById('lesionsGrid');
    grid.innerHTML = "";
    LESIONS.forEach(l => {
        const chip = document.createElement('div');
        chip.className = 'chip' + (l.key === activeType ? ' active' : '');
        chip.innerText = l.label;
        chip.onclick = () => {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeType = l.key;
        };
        grid.appendChild(chip);
    });
}

// 3. Logique du clic sur la silhouette
document.getElementById('overlay').onclick = function(e) {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 418;
    const y = ((e.clientY - rect.top) / rect.height) * 940;
    
    markers.push({ id: Date.now(), x, y, type: activeType });
    drawMarkers();
    updateReport();
};

// 4. Dessin des points
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

// 5. Identification de la zone du corps
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

// 6. Mise à jour du document texte
function updateReport() {
    const list = document.getElementById('reportList');
    list.innerHTML = '';
    
    // Remplissage de la liste des observations
    if (markers.length === 0) {
        list.innerHTML = '<li>Aucune lésion sélectionnée.</li>';
    } else {
        markers.forEach((m, index) => {
            const config = LESIONS.find(l => l.key === m.type);
            const zone = regionFrom(m.x, m.y);
            const li = document.createElement('li');
            li.innerHTML = `<strong>${config.icon} ${config.label}</strong> : constatée au niveau de la zone : ${zone}.`;
            list.appendChild(li);
        });
    }

    // Mise à jour des infos Patient / Médecin
    const patient = document.getElementById('patientId').value || '—';
    const doctor = document.getElementById('doctorName').value || '—';
    const signature = document.getElementById('doctorSig').value || '...';
    
    document.getElementById('reportMeta').innerText = `Patient : ${patient} • Médecin : ${doctor} • Date : ${new Date().toLocaleDateString('fr-FR')}`;
    document.getElementById('d-sig').innerText = signature;

    // Alerte Arme à feu
    const hasPAF = markers.some(m => m.type === 'plaie_feu');
    const badge = document.getElementById('pafBadge');
    if (badge) badge.className = hasPAF ? 'paf-badge' : 'paf-badge paf-hidden';

    // QR Code Référence
    const now = new Date();
    const ref = String(now.getDate()).padStart(2,'0') + String(now.getMonth()+1).padStart(2,'0') + String(now.getHours()).padStart(2,'0') + String(now.getMinutes()).padStart(2,'0');
    document.getElementById('qr-ref').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OMC-CONSTAT-${ref}`;
}

// 7. Fonctions des boutons
document.getElementById('btnUndo').onclick = () => { markers.pop(); drawMarkers(); updateReport(); };
document.getElementById('btnClear').onclick = () => { markers = []; drawMarkers(); updateReport(); };

// 8. Capture d'image
async function genererImage() {
    const captureZone = document.getElementById('capture-zone');
    const btn = event.target;
    btn.innerText = "CAPTURING...";

    const canvas = await html2canvas(captureZone, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: "#ffffff" 
    });
    
    const link = document.createElement('a');
    link.download = `Constat_${document.getElementById('patientId').value || 'Patient'}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    btn.innerText = "🖼️ GÉNÉRER L'IMAGE";
}
