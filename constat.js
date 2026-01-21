const LESIONS = [
    {key:'fracture', label:'Fracture', color:'#ef4444'},
    {key:'plaie_laceration', label:'Plaie & lacération', color:'#a855f7'},
    {key:'plaie_feu', label:'Plaie par arme à feu', color:'#b91c1c'},
    {key:'brulure', label:'Brûlure', color:'#eab308'}
];

let activeType = 'fracture';
let markers = [];

// Initialisation de la palette
function initPalette() {
    const grid = document.getElementById('lesionsGrid');
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

// Placement d'un point
document.getElementById('overlay').onclick = function(e) {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 418;
    const y = ((e.clientY - rect.top) / rect.height) * 940;
    
    addMarker(x, y, activeType);
};

function addMarker(x, y, type) {
    const marker = { id: Date.now(), x, y, type };
    markers.push(marker);
    drawMarkers();
    updateReport();
}

function drawMarkers() {
    const layer = document.getElementById('markersLayer');
    layer.innerHTML = '';
    markers.forEach(m => {
        const config = LESIONS.find(l => l.key === m.type);
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', m.x);
        circle.setAttribute('cy', m.y);
        circle.setAttribute('r', '10');
        circle.setAttribute('fill', config.color);
        layer.appendChild(circle);
    });
}

function updateReport() {
    const list = document.getElementById('reportList');
    list.innerHTML = '';
    markers.forEach((m, i) => {
        const config = LESIONS.find(l => l.key === m.type);
        const li = document.createElement('li');
        li.innerText = `${config.label} située sur la zone constatée.`;
        list.appendChild(li);
    });
    
    // Check PAF badge
    const hasPAF = markers.some(m => m.type === 'plaie_feu');
    document.getElementById('pafBadge').className = hasPAF ? 'paf-badge' : 'paf-badge paf-hidden';
}

// Lancement
window.onload = () => {
    initPalette();
    updateReport();
};
