const database = {
    "Hématologie (Sang)": [
        { id: "gb", label: "Leucocytes", unit: "G/L", norm: "4.0-10.0" },
        { id: "hb", label: "Hémoglobine", unit: "g/dL", norm: "13.0-17.0" },
        { id: "ht", label: "Hématocrite", unit: "%", norm: "40-52" },
        { id: "pla", label: "Plaquettes", unit: "G/L", norm: "150-400" }
    ],
    "Biochimie": [
        { id: "gly", label: "Glycémie", unit: "g/L", norm: "0.70-1.10" },
        { id: "crea", label: "Créatinine", unit: "mg/L", norm: "7.0-12.0" },
        { id: "crp", label: "CRP", unit: "mg/L", norm: "0-5.0" }
    ]
    /* Complète avec tes autres données ici */
};

function init() {
    const tabs = document.getElementById('dynamic-tabs');
    const sections = document.getElementById('dynamic-sections');
    if (!tabs || !sections) return;
    tabs.innerHTML = ""; sections.innerHTML = "";

    for (let cat in database) {
        let btn = document.createElement('button');
        btn.className = 'tab-btn'; btn.innerHTML = `${cat.toUpperCase()} ▼`;
        btn.onclick = (e) => { e.preventDefault(); document.getElementById('t-'+cat).classList.toggle('active'); };
        tabs.appendChild(btn);

        let div = document.createElement('div'); div.id = 't-'+cat; div.className = 'tab-content';
        let sec = document.createElement('div'); sec.id = 'sec-'+cat; sec.className = 'section';
        sec.innerHTML = `<div class="section-title">${cat}</div>`;

        database[cat].forEach(item => {
            div.innerHTML += `<div class="input-group"><label>${item.label}</label><input type="text" class="analysis-input" data-id="${item.id}" data-label="${item.label}" data-norm="${item.norm}" oninput="res('${item.id}', this.value, '${cat}')" placeholder="Valeur..."></div>`;
            sec.innerHTML += `<div class="row" id="row-${item.id}"><span>${item.label}</span><span class="val" id="val-${item.id}"></span><span class="norme">${item.norm} ${item.unit}</span></div>`;
        });
        tabs.appendChild(div); sections.appendChild(sec);
    }
}

function res(id, val, cat) {
    const row = document.getElementById('row-'+id);
    const valSpan = document.getElementById('val-'+id);
    const section = document.getElementById('sec-'+cat);
    if(valSpan) valSpan.innerText = val;
    if(val.trim() !== "") { row.classList.add('active'); section.classList.add('active'); }
    else { row.classList.remove('active'); if(section.querySelectorAll('.row.active').length === 0) section.classList.remove('active'); }
    analyserTout();
}

function switchMode(mode) {
    document.getElementById('panel-auto').style.display = (mode === 'auto' ? 'block' : 'none');
    document.getElementById('panel-manual').style.display = (mode === 'manual' ? 'block' : 'none');
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function lancerGenerationAuto() {
    const grav = parseInt(document.getElementById('gravity-range').value);
    const scenarios = Array.from(document.querySelectorAll('.scenario-grid input:checked')).map(i => i.value);
    if(scenarios.length === 0) return alert("Coche un scénario !");

    let results = { hb: 14.5, ht: 45, lact: 1.0, ph: 7.40, pco2: 40, po2: 95, crea: 9.0, hcg: 0, alc: 0, gb: 6.0 };
    let extra = "";

    scenarios.forEach(s => {
        if(['acc-route','arme-feu','arme-blanche'].includes(s)) { 
            results.hb -= (grav * 0.95); results.ht -= (grav * 2.8); results.lact += (grav * 0.6); 
        }
        if(s === 'overdose') { results.ph -= (grav * 0.05); results.alc = (grav * 0.45); }
        if(s === 'grossesse') { results.hcg = (grav * 8500); extra = ` (Grossesse estimée : ${grav * 2} semaines)`; }
    });

    for(let id in results) {
        let finalVal = results[id].toFixed(id === 'ph' ? 2 : 1);
        if(id === 'hcg') finalVal = results[id] > 5 ? "POSITIF" : "Négatif";
        let cat = ""; for(let c in database) { if(database[c].find(i => i.id === id)) cat = c; }
        const input = document.querySelector(`[data-id="${id}"]`);
        if(input) { input.value = finalVal; res(id, finalVal, cat); }
    }
    if(extra) { document.getElementById('auto-concl-area').value += extra; document.getElementById('d-concl').innerText += extra; }
}

function resetSeulementBio() {
    if(!confirm("Vider les analyses ?")) return;
    document.querySelectorAll('.analysis-input').forEach(el => el.value = "");
    document.querySelectorAll('.row, .section').forEach(el => el.classList.remove('active'));
    document.getElementById('auto-concl-area').value = ""; document.getElementById('d-concl').innerText = "...";
}

function determinerGroupeAleatoire() {
    const groupes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const res = groupes[Math.floor(Math.random() * groupes.length)];
    document.getElementById('d-groupe').innerText = res; document.getElementById('select-groupe').value = res;
}

document.addEventListener('DOMContentLoaded', init);
