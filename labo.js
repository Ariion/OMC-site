const database = {
    "Hématologie (Sang)": [
        { id: "gb", label: "Leucocytes (Globules Blancs)", unit: "G/L", norm: "4.0 - 10.0", help: "Infection." },
        { id: "hb", label: "Hémoglobine", unit: "g/dL", norm: "13.0 - 17.0", help: "Anémie." },
        { id: "ht", label: "Hématocrite", unit: "%", norm: "40 - 52", help: "Volume." },
        { id: "pla", label: "Plaquettes", unit: "G/L", norm: "150 - 400", help: "Coagulation." },
        { id: "vgm", label: "VGM", unit: "fL", norm: "80 - 100", help: "Taille." },
        { id: "tcmh", label: "TCMH", unit: "pg", norm: "27 - 32", help: "Hémoglobine." },
        { id: "poly_n", label: "Polynucléaires Neutrophiles", unit: "%", norm: "40 - 75", help: "Bactéries." },
        { id: "lympho", label: "Lymphocytes", unit: "%", norm: "20 - 45", help: "Virus." }
    ],
    "Coagulation": [
        { id: "tp", label: "Taux de Prothrombine (TP)", unit: "%", norm: "70 - 100", help: "Vitesse." },
        { id: "inr", label: "INR", unit: "-", norm: "0.8 - 1.2", help: "Suivi." },
        { id: "tca", label: "TCA", unit: "sec", norm: "24 - 38", help: "Temps." },
        { id: "fibri", label: "Fibrinogène", unit: "g/L", norm: "2.0 - 4.0", help: "Facteur." }
    ],
    "Biochimie Métabolique": [
        { id: "gly", label: "Glycémie à jeun", unit: "g/L", norm: "0.70 - 1.10", help: "Sucre." },
        { id: "uree", label: "Urée", unit: "g/L", norm: "0.15 - 0.45", help: "Déchets." },
        { id: "crea", label: "Créatinine", unit: "mg/L", norm: "7.0 - 12.0", help: "Reins." },
        { id: "crp", label: "CRP", unit: "mg/L", norm: "0 - 5.0", help: "Inflammation." },
        { id: "vs", label: "Vitesse Sédimentation", unit: "mm/h", norm: "0 - 20", help: "Chronique." }
    ],
    "Ionogramme (Sels)": [
        { id: "na", label: "Sodium (Na+)", unit: "mmol/L", norm: "135 - 145", help: "Hydratation." },
        { id: "k", label: "Potassium (K+)", unit: "mmol/L", norm: "3.5 - 5.0", help: "Cœur." },
        { id: "cl", label: "Chlore (Cl-)", unit: "mmol/L", norm: "95 - 105", help: "Acide." },
        { id: "ca", label: "Calcium", unit: "mg/L", norm: "85 - 105", help: "Os." }
    ],
    "Bilan Hépatique (Foie)": [
        { id: "asat", label: "ASAT (TGO)", unit: "UI/L", norm: "0 - 35", help: "Foie." },
        { id: "alat", label: "ALAT (TGP)", unit: "UI/L", norm: "0 - 45", help: "Foie." },
        { id: "ggt", label: "Gamma-GT", unit: "UI/L", norm: "0 - 55", help: "Alcool." },
        { id: "bili_t", label: "Bilirubine Totale", unit: "mg/L", norm: "0 - 12", help: "Jaunisse." }
    ],
    "Marqueurs Cardiaques": [
        { id: "tropo", label: "Troponine I", unit: "ng/L", norm: "0 - 15", help: "Infarctus." },
        { id: "bnp", label: "BNP", unit: "pg/mL", norm: "0 - 100", help: "Insuffisance." }
    ],
    "Gaz du Sang (AA)": [
        { id: "ph", label: "pH Artériel", unit: "", norm: "7.38 - 7.42", help: "Acidité." },
        { id: "pco2", label: "PCO2", unit: "mmHg", norm: "35 - 45", help: "CO2." },
        { id: "po2", label: "PO2", unit: "mmHg", norm: "80 - 100", help: "Oxygène." },
        { id: "lact", label: "Lactates", unit: "mmol/L", norm: "0.5 - 2.0", help: "Choc." }
    ],
    "Toxicologie (LSPD/BCSO)": [
        { id: "alc", label: "Alcoolémie", unit: "g/L", norm: "0 - 0.10", help: "Alcool." },
        { id: "thc", label: "Cannabis (THC)", unit: "-", norm: "Négatif", help: "Drogue." },
        { id: "coc", label: "Cocaïne", unit: "-", norm: "Négatif", help: "Drogue." },
        { id: "amp", label: "Amphétamines", unit: "-", norm: "Négatif", help: "Drogue." }
    ],
    "Endocrinologie & Divers": [
        { id: "tsh", label: "TSH", unit: "mUI/L", norm: "0.4 - 4.0", help: "Thyroïde." },
        { id: "hcg", label: "Bêta-HCG", unit: "mUI/mL", norm: "0 - 5", help: "Grossesse." },
        { id: "vitd", label: "Vitamine D", unit: "ng/mL", norm: "30 - 60", help: "Os." },
        { id: "adn", label: "Compatibilité ADN", unit: "%", norm: "100", help: "Identification." }
    ]
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

    const itemData = Object.values(database).flat().find(i => i.id === id);
    if (val.trim() !== "" && itemData && itemData.norm.includes('-')) {
        const valNum = parseFloat(val.replace(',', '.'));
        const [min, max] = itemData.norm.split('-').map(n => parseFloat(n));
        valSpan.style.color = (valNum < min || valNum > max) ? "red" : "green";
    }

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
async function genererImage() {
    const doc = document.getElementById('document');
    const canvas = await html2canvas(doc, { scale: 2, useCORS: true, height: doc.scrollHeight });
    const imgData = canvas.toDataURL('image/jpeg', 0.9);
    // Ici tu peux ajouter ton upload ImgBB
    window.open().document.write('<img src="' + imgData + '">');
}

function determinerGroupeAleatoire() {
    const groupes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const res = groupes[Math.floor(Math.random() * groupes.length)];
    document.getElementById('d-groupe').innerText = res; document.getElementById('select-groupe').value = res;
}

// On ajoute 'help' et 'norm' dans l'affichage manuel
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
            // AJOUT DE L'AIDE ICI
            div.innerHTML += `
            <div class="input-group">
                <label>${item.label}</label>
                <span class="help-norm">Norme : ${item.norm} ${item.unit} | ${item.help}</span>
                <input type="text" class="analysis-input" 
                    data-id="${item.id}" 
                    data-label="${item.label}" 
                    data-norm="${item.norm}" 
                    oninput="res('${item.id}', this.value, '${cat}')" 
                    placeholder="Valeur...">
            </div>`;
            
            sec.innerHTML += `<div class="row" id="row-${item.id}"><span>${item.label}</span><span class="val" id="val-${item.id}"></span><span class="norme">${item.norm} ${item.unit}</span></div>`;
        });
        tabs.appendChild(div); sections.appendChild(sec);
    }
}

// CONCLUSION AUTOMATIQUE INTELLIGENTE
function analyserTout() {
    let anomalies = [];
    document.querySelectorAll('.analysis-input').forEach(input => {
        let valText = input.value.trim().replace(',', '.');
        if (!valText) return;
        
        let label = input.getAttribute('data-label');
        let norm = input.getAttribute('data-norm');
        
        if (norm.includes('-')) {
            let valNum = parseFloat(valText);
            let [min, max] = norm.split('-').map(n => parseFloat(n));
            if (valNum < min) anomalies.push(label + " BAS");
            if (valNum > max) anomalies.push(label + " ÉLEVÉ");
        } else if (norm === "Négatif" && valText.toLowerCase() === "positif") {
            anomalies.push(label + " POSITIF");
        }
    });

    let conclFinal = "";
    if (anomalies.length > 0) {
        conclFinal = "Points d'attention : " + anomalies.join(', ') + ". Une surveillance médicale est recommandée.";
    } else {
        conclFinal = "Bilan biologique satisfaisant. Absence d'anomalie majeure détectée.";
    }

    // Mise à jour des deux zones (Input et Document)
    document.getElementById('auto-concl-area').value = conclFinal;
    document.getElementById('d-concl').innerText = conclFinal;
}

// N'oublie pas d'appeler analyserTout() à la fin de ta fonction res() !


document.addEventListener('DOMContentLoaded', init);


