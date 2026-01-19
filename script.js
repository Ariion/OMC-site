// ==========================================
// 1. BASES DE DONNÉES
// ==========================================
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
        { id: "na", label: "Sodium (Na+)", unit: "mmol/L", norm: "135 - 145", help: "Sels." },
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
        { id: "bnp", label: "BNP", unit: "pg/mL", norm: "0 - 100", help: "Cœur." }
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
        { id: "adn", label: "Compatibilité ADN", unit: "%", norm: "100", help: "ADN." }
    ]
};

const causesData = {
    "Neurologique": ["Hémorragie méningée", "Traumatisme cranien sévère"],
    "Hémorragique": ["Hémorragie interne massive", "Rupture d'anévrisme"],
    "Infectieuse / Métabolique": ["Choc septique", "Défaillance multiviscérale"],
    "Cardio-respiratoire": ["Arrêt cardio-respiratoire", "Infarctus aigu"],
    "Traumatique": ["Polytraumatisme", "Ecrasement thoraco-abdominal"],
    "Toxique": ["Overdose opioïdes", "Intoxication monoxyde"]
};

// ==========================================
// 2. INITIALISATION ET MISES À JOUR
// ==========================================
function init() {
    const tabsContainer = document.getElementById('dynamic-tabs');
    const sectionsContainer = document.getElementById('dynamic-sections');
    if (!tabsContainer || !sectionsContainer) return;
    tabsContainer.innerHTML = "";
    sectionsContainer.innerHTML = "";

    for (let cat in database) {
        let btn = document.createElement('button');
        btn.className = 'tab-btn';
        btn.innerHTML = `${cat.toUpperCase()} <span>▼</span>`;
        btn.onclick = (e) => { e.preventDefault(); document.getElementById('t-'+cat).classList.toggle('active'); };
        tabsContainer.appendChild(btn);

        let div = document.createElement('div');
        div.id = 't-'+cat; div.className = 'tab-content';
        let sec = document.createElement('div');
        sec.id = 'sec-'+cat; sec.className = 'section';
        sec.innerHTML = `<div class="section-title">${cat}</div>`;

        database[cat].forEach(item => {
            div.innerHTML += `
            <div class="input-group">
                <label>${item.label}</label>
                <input type="text" class="analysis-input" data-id="${item.id}" data-label="${item.label}" data-norm="${item.norm}" oninput="res('${item.id}', this.value, '${cat}')" placeholder="Valeur...">
            </div>`;
            sec.innerHTML += `
            <div class="row" id="row-${item.id}">
                <span>${item.label}</span>
                <span class="val" id="val-${item.id}"></span>
                <span class="norme">${item.norm} ${item.unit}</span>
            </div>`;
        });
        tabsContainer.appendChild(div);
        sectionsContainer.appendChild(sec);
    }
}

function up(id, val) {
    const el = document.getElementById(id);
    if(el) el.innerText = val || (id==='d-sig' ? "NOM DOCTEUR" : "...");
}

function upDate(id, val) {
    if(!val) return;
    const [y,m,d] = val.split('-');
    const el = document.getElementById(id);
    if(el) el.innerText = `${d}/${m}/${y}`;
}

// ==========================================
// 3. LOGIQUE GÉNÉRATEUR AUTO & MODES
// ==========================================
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

    scenarios.forEach(s => {
        if(s === 'acc-route' || s === 'arme-feu' || s === 'arme-blanche') {
            results.hb -= (grav * 0.9);
            results.ht -= (grav * 2.5);
            results.lact += (grav * 0.6);
        }
        if(s === 'overdose') { results.ph -= (grav * 0.05); results.alc = (grav * 0.4); }
        if(s === 'grossesse') { results.hcg = (grav * 5000); }
    });

    for(let id in results) {
        let finalVal = results[id].toFixed(id === 'ph' ? 2 : 1);
        if(id === 'hcg') finalVal = results[id] > 5 ? "POSITIF" : "Négatif";
        
        let cat = "";
        for(let c in database) { if(database[c].find(i => i.id === id)) cat = c; }
        
        const input = document.querySelector(`[data-id="${id}"]`);
        if(input) { input.value = finalVal; res(id, finalVal, cat); }
    }
}

function resetSeulementBio() {
    if(!confirm("Vider les analyses ?")) return;
    document.querySelectorAll('.analysis-input').forEach(el => el.value = "");
    document.querySelectorAll('.scenario-grid input').forEach(el => el.checked = false);
    document.querySelectorAll('.row').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    document.getElementById('auto-concl-area').value = "";
    document.getElementById('d-concl').innerText = "...";
}

// ==========================================
// 4. LOGIQUE MÉDICALE & ANALYSE
// ==========================================
function res(id, val, cat) {
    const row = document.getElementById('row-'+id);
    const valSpan = document.getElementById('val-'+id);
    if(valSpan) valSpan.innerText = val;

    const itemData = Object.values(database).flat().find(i => i.id === id);
    if (val.trim() !== "" && itemData && itemData.norm !== "Négatif") {
        const valNum = parseFloat(val.replace(',', '.'));
        const [min, max] = itemData.norm.replace('0 - ', '0-').split('-').map(n => parseFloat(n));
        valSpan.style.color = (valNum < min || valNum > max) ? "red" : "green";
    }

    if(val.trim() !== "") row.classList.add('active'); else row.classList.remove('active');
    const section = document.getElementById('sec-'+cat);
    if(section) section.classList.toggle('active', section.querySelectorAll('.row.active').length > 0);
    analyserTout();
}

function analyserTout() {
    let anomalies = [];
    document.querySelectorAll('.analysis-input').forEach(input => {
        let valText = input.value.trim().replace(',', '.');
        if (!valText) return;
        let label = input.getAttribute('data-label'), norm = input.getAttribute('data-norm');
        if (norm.includes('-')) {
            let valNum = parseFloat(valText), [min, max] = norm.split('-').map(n => parseFloat(n));
            if (valNum < min) anomalies.push(`${label} bas`);
            if (valNum > max) anomalies.push(`${label} élevé`);
        }
    });
    let concl = anomalies.length > 0 ? "Alertes : " + anomalies.join(', ') + "." : "RAS.";
    document.getElementById('auto-concl-area').value = concl;
    document.getElementById('d-concl').innerText = concl;
}

// ==========================================
// 5. DISCORD & DÉCÈS
// ==========================================
async function capturerEtEnvoyer(webhookURL, fileName, contentMsg, patientId) {
    const docElement = document.getElementById('document');
    const btn = document.getElementById('discord-btn');
    btn.innerText = "📸 ENVOI...";
    btn.disabled = true;

    try {
        const canvas = await html2canvas(docElement, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            const patientName = document.getElementById(patientId)?.innerText || "Inconnu";
            formData.append("payload_json", JSON.stringify({ content: contentMsg + ` **${patientName}**` }));
            formData.append("file", blob, `${fileName}.png`);
            await fetch(webhookURL, { method: 'POST', body: formData });
            alert("✅ RÉUSSI !");
        }, 'image/png');
    } catch (e) { alert("Erreur capture."); }
    finally { btn.innerText = "ENVOYER SUR DISCORD"; btn.disabled = false; }
}

function envoyerDiscord() {
    const url = "https://discord.com/api/webhooks/1462416189526638613/iMpoe9mn6DC4j_0eBS4tOVjaDo_jy1MhfSKIEP80H7Ih3uYGHRcJ5kQSqIFuL0DTqlUy";
    capturerEtEnvoyer(url, "labo", "Rapport Labo :", "d-nom");
}

function determinerGroupeAleatoire() {
    const groupes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const res = groupes[Math.floor(Math.random() * groupes.length)];
    document.getElementById('d-groupe').innerText = res;
    document.getElementById('select-groupe').value = res;
}

// ==========================================
// 6. LANCEMENT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    init();
    if(typeof genererReference === "function") genererReference();
});
