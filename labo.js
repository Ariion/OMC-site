

// ==========================================
// 1. BASE DE DONNÉES MÉDICALE
// ==========================================
const database = {
    "HÉMATOLOGIE (SANG)": [
        { id: "gb", label: "Leucocytes (Globules Blancs)", unit: "G/L", norm: "4.0 - 10.0", help: "Infection." },
        { id: "hb", label: "Hémoglobine", unit: "g/dL", norm: "13.0 - 17.0", help: "Anémie." },
        { id: "ht", label: "Hématocrite", unit: "%", norm: "40 - 52", help: "Volume." },
        { id: "pla", label: "Plaquettes", unit: "G/L", norm: "150 - 400", help: "Coagulation." },
        { id: "vgm", label: "VGM", unit: "fL", norm: "80 - 100", help: "Taille." },
        { id: "tcmh", label: "TCMH", unit: "pg", norm: "27 - 32", help: "Hémoglobine." },
        { id: "poly_n", label: "Polynucléaires Neutrophiles", unit: "%", norm: "40 - 75", help: "Bactéries." },
        { id: "lympho", label: "Lymphocytes", unit: "%", norm: "20 - 45", help: "Virus." }
    ],
    "COAGULATION": [
        { id: "tp", label: "Taux de Prothrombine (TP)", unit: "%", norm: "70 - 100", help: "Vitesse." },
        { id: "inr", label: "INR", unit: "-", norm: "0.8 - 1.2", help: "Suivi." },
        { id: "tca", label: "TCA", unit: "sec", norm: "24 - 38", help: "Temps." },
        { id: "fibri", label: "Fibrinogène", unit: "g/L", norm: "2.0 - 4.0", help: "Facteur." }
    ],
    "BIOCHIMIE MÉTABOLIQUE": [
        { id: "gly", label: "Glycémie à jeun", unit: "g/L", norm: "0.70 - 1.10", help: "Sucre." },
        { id: "uree", label: "Urée", unit: "g/L", norm: "0.15 - 0.45", help: "Déchets." },
        { id: "crea", label: "Créatinine", unit: "mg/L", norm: "7.0 - 12.0", help: "Reins." },
        { id: "crp", label: "CRP", unit: "mg/L", norm: "0 - 5.0", help: "Inflammation." },
        { id: "vs", label: "Vitesse Sédimentation", unit: "mm/h", norm: "0 - 20", help: "Chronique." }
    ],
    "IONOGRAMME (SELS)": [
        { id: "na", label: "Sodium (Na+)", unit: "mmol/L", norm: "135 - 145", help: "Hydratation." },
        { id: "k", label: "Potassium (K+)", unit: "mmol/L", norm: "3.5 - 5.0", help: "Cœur." },
        { id: "cl", label: "Chlore (Cl-)", unit: "mmol/L", norm: "95 - 105", help: "Acide." },
        { id: "ca", label: "Calcium", unit: "mg/L", norm: "85 - 105", help: "Os." }
    ],
    "BILAN HÉPATIQUE (FOIE)": [
        { id: "asat", label: "ASAT (TGO)", unit: "UI/L", norm: "0 - 35", help: "Foie." },
        { id: "alat", label: "ALAT (TGP)", unit: "UI/L", norm: "0 - 45", help: "Foie." },
        { id: "ggt", label: "Gamma-GT", unit: "UI/L", norm: "0 - 55", help: "Alcool." },
        { id: "bili_t", label: "Bilirubine Totale", unit: "mg/L", norm: "0 - 12", help: "Jaunisse." }
    ],
    "MARQUEURS CARDIAQUES": [
        { id: "tropo", label: "Troponine I", unit: "ng/L", norm: "0 - 15", help: "Infarctus." },
        { id: "bnp", label: "BNP", unit: "pg/mL", norm: "0 - 100", help: "Cœur." }
    ],
    "GAZ DU SANG (AA)": [
        { id: "ph", label: "pH Artériel", unit: "", norm: "7.38 - 7.42", help: "Acidité." },
        { id: "pco2", label: "PCO2", unit: "mmHg", norm: "35 - 45", help: "CO2." },
        { id: "po2", label: "PO2", unit: "mmHg", norm: "80 - 100", help: "Oxygène." },
        { id: "lact", label: "Lactates", unit: "mmol/L", norm: "0.5 - 2.0", help: "Choc." }
    ],
    "TOXICOLOGIE (LSPD/BCSO)": [
        { id: "alc", label: "Alcoolémie", unit: "g/L", norm: "0 - 0.10", help: "Alcool." },
        { id: "thc", label: "Cannabis (THC)", unit: "-", norm: "Négatif", help: "Drogue." },
        { id: "coc", label: "Cocaïne", unit: "-", norm: "Négatif", help: "Drogue." },
        { id: "amp", label: "Amphétamines", unit: "-", norm: "Négatif", help: "Drogue." }
    ],
    "ENDOCRINOLOGIE & DIVERS": [
        { id: "tsh", label: "TSH", unit: "mUI/L", norm: "0.4 - 4.0", help: "Thyroïde." },
        { id: "hcg", label: "Bêta-HCG", unit: "mUI/mL", norm: "0 - 5", help: "Grossesse." },
        { id: "vitd", label: "Vitamine D", unit: "ng/mL", norm: "30 - 60", help: "Os." },
        { id: "adn", label: "Compatibilité ADN", unit: "%", norm: "100", help: "Identification." }
    ]
};

// Configuration : 1 Mois de grossesse = 1 Semaine réelle
const grossesseData = {
    1: { hcg: "50-500", gb: "5.5-10.5", fer: "80-150", label: "1er Mois" },
    2: { hcg: "500-5000", gb: "6.0-11.5", fer: "70-140", label: "2ème Mois" },
    3: { hcg: "30000-150000", gb: "7.5-12.5", fer: "60-130", label: "3ème Mois (Pic hormonal)" },
    4: { hcg: "100000-250000", gb: "8.5-13.5", fer: "50-110", label: "4ème Mois" },
    5: { hcg: "20000-100000", gb: "9.5-14.5", fer: "40-90", label: "5ème Mois" },
    6: { hcg: "15000-60000", gb: "10.0-15.5", fer: "30-75", label: "6ème Mois" },
    7: { hcg: "10000-50000", gb: "11.0-16.5", fer: "20-60", label: "7ème Mois" },
    8: { hcg: "10000-40000", gb: "11.5-17.5", fer: "15-50", label: "8ème Mois" },
    9: { hcg: "8000-35000", gb: "12.0-18.5", fer: "10-40", label: "9ème Mois (Terme)" },
    "neg": { hcg: "0-5", gb: "4.5-10.0", fer: "50-150", label: "Test Négatif" }
};

// Configuration : 1 Mois de grossesse = 1 Semaine réelle
const grossesseData = {
    1: { hcg: "50-500", gb: "5.5-10.5", fer: "80-150", label: "1er Mois" },
    2: { hcg: "500-5000", gb: "6.0-11.5", fer: "70-140", label: "2ème Mois" },
    3: { hcg: "30000-150000", gb: "7.5-12.5", fer: "60-130", label: "3ème Mois (Pic hormonal)" },
    4: { hcg: "100000-250000", gb: "8.5-13.5", fer: "50-110", label: "4ème Mois" },
    5: { hcg: "20000-100000", gb: "9.5-14.5", fer: "40-90", label: "5ème Mois" },
    6: { hcg: "15000-60000", gb: "10.0-15.5", fer: "30-75", label: "6ème Mois" },
    7: { hcg: "10000-50000", gb: "11.0-16.5", fer: "20-60", label: "7ème Mois" },
    8: { hcg: "10000-40000", gb: "11.5-17.5", fer: "15-50", label: "8ème Mois" },
    9: { hcg: "8000-35000", gb: "12.0-18.5", fer: "10-40", label: "9ème Mois (Terme)" },
    "neg": { hcg: "0-5", gb: "4.5-10.0", fer: "50-150", label: "Test Négatif" }
};

function genererGrossesse(mois) {
    // Logique Aléatoire pour le bouton "Test"
    if (mois === 'aleatoire') {
        // 50% de chance d'être enceinte (1er mois) ou négatif
        mois = (Math.random() > 0.5) ? 1 : 'neg';
    }

    const data = grossesseData[mois];
    const rand = (range) => {
        const [min, max] = range.split('-').map(Number);
        return (Math.random() * (max - min) + min).toFixed(1);
    };

    const vHcg = rand(data.hcg);
    const vGb = rand(data.gb);
    const vFer = rand(data.fer);

    // AFFICHAGE DES RÉSULTATS DANS LE DOCUMENT (C'est ici que ça manquait)
    // res(id_technique, valeur, section_titre, unité, norme)
    res('hcg', vHcg, 'ENDOCRINOLOGIE & MATERNITÉ', 'mUI/mL', '0 - 5');
    res('v_gb', vGb, 'HÉMATOLOGIE', 'G/L', '4.0 - 10.0');
    res('fer', vFer, 'BIOCHIMIE', 'µg/dL', '50 - 150');

    // Conclusion médicale
    let concl = "";
    if (mois === "neg") {
        concl = "Analyse immunologique : Absence d'hormone Bêta-HCG. Test de grossesse négatif.";
    } else {
        concl = `Bilan de maternité - ${data.label} : Présence d'hormone HCG (${vHcg} mUI/mL). `;
        
        if(mois >= 7) concl += "Fin de troisième trimestre. Surveillance du fer et de la tension recommandée avant l'accouchement. ";
        else if(mois == 3 || mois == 4) concl += "Pic hormonal atteint. Symptômes de nausées possibles. ";
        else concl += "Début de grossesse confirmé. Évolution normale des constantes. ";

        if (vFer < 30) concl += "Note : Réserves en fer basses. ";
        concl += "Évolution clinique favorable.";
    }
    
    document.getElementById('auto-concl-area').value = concl;
    document.getElementById('d-concl').innerText = concl;
}

// ==========================================
// 2. INITIALISATION ET ACCORDÉONS
// ==========================================
function init() {
    const tabsContainer = document.getElementById('dynamic-tabs');
    const sectionsContainer = document.getElementById('dynamic-sections');
    if (!tabsContainer || !sectionsContainer) return;
    tabsContainer.innerHTML = ""; sectionsContainer.innerHTML = "";

    for (let cat in database) {
        let btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.innerHTML = `<span>${cat.toUpperCase()}</span> <span>▼</span>`;
        let contentDiv = document.createElement('div');
        contentDiv.className = 'category-content';
        contentDiv.id = 't-' + cat;

        btn.onclick = (e) => {
            e.preventDefault();
            const isOpen = contentDiv.classList.contains('active');
            document.querySelectorAll('.category-content').forEach(el => el.classList.remove('active'));
            if (!isOpen) contentDiv.classList.add('active');
        };

        let sec = document.createElement('div');
        sec.id = 'sec-' + cat;
        sec.className = 'section';
        sec.innerHTML = `<div class="section-title">${cat}</div>`;

        database[cat].forEach(item => {
            contentDiv.innerHTML += `
                <div class="input-group-manual">
                    <label class="manual-label">${item.label}</label>
                    <span class="manual-help">Norme : ${item.norm} ${item.unit} | ${item.help}</span>
                    <input type="text" class="analysis-input" data-id="${item.id}" data-label="${item.label}" data-norm="${item.norm}" oninput="res('${item.id}', this.value, '${cat}')" placeholder="Valeur...">
                </div>`;
            sec.innerHTML += `
                <div class="row" id="row-${item.id}">
                    <span>${item.label}</span>
                    <span class="val" id="val-${item.id}"></span>
                    <span class="norme">${item.norm} ${item.unit}</span>
                </div>`;
        });
        tabsContainer.appendChild(btn); tabsContainer.appendChild(contentDiv); sectionsContainer.appendChild(sec);
    }
}

// ==========================================
// 3. LOGIQUE MÉDICALE ET MISE À JOUR
// ==========================================
function res(id, val, cat) {
    const row = document.getElementById('row-' + id);
    const valSpan = document.getElementById('val-' + id);
    const section = document.getElementById('sec-' + cat);

    if (valSpan) {
        valSpan.innerText = val;
        const itemData = Object.values(database).flat().find(i => i.id === id);
        if (val.trim() !== "" && itemData && itemData.norm.includes('-')) {
            const valNum = parseFloat(val.replace(',', '.'));
            const [min, max] = itemData.norm.split('-').map(n => parseFloat(n));
            valSpan.style.color = (valNum < min || valNum > max) ? "#ef4444" : "#22c55e";
        } else if (val.toLowerCase() === "positif") {
            valSpan.style.color = "#ef4444";
        } else if (val.toLowerCase() === "négatif") {
            valSpan.style.color = "#22c55e";
        }
    }

    if (val.trim() !== "") {
        if(row) row.classList.add('active');
        if(section) section.classList.add('active');
    } else {
        if(row) row.classList.remove('active');
        if(section && section.querySelectorAll('.row.active').length === 0) section.classList.remove('active');
    }
    analyserTout();
}

// CONCLUSION GRADUÉE SELON GRAVITÉ
function analyserTout() {
    let anomaliesBas = [], anomaliesHaut = [], anomaliesCritiques = [];
    let isEnceinte = false;

    document.querySelectorAll('.analysis-input').forEach(input => {
        let valText = input.value.trim().replace(',', '.');
        if (!valText) return;
        let val = parseFloat(valText);
        let label = input.getAttribute('data-label'), norm = input.getAttribute('data-norm');

        if (input.getAttribute('data-id') === 'hcg' && val > 5) isEnceinte = true;

        if (norm.includes('-')) {
            let [min, max] = norm.split('-').map(n => parseFloat(n));
            let ecart = (val > max) ? (val / max) : (val < min) ? (min / val) : 1;

            if (ecart > 2.5) anomaliesCritiques.push(label);
            else if (val > max) anomaliesHaut.push(label);
            else if (val < min) anomaliesBas.push(label);
        }
    });

    let concl = "";
    if (isEnceinte) {
        const hcgVal = parseFloat(document.querySelector('[data-id="hcg"]').value);
        concl = `Grossesse confirmée. Taux HCG compatible avec un suivi de routine. `;
        if (hcgVal > 100000) concl = `Grossesse confirmée. Taux HCG très élevé (Pic du 1er trimestre). `;
    }

    if (anomaliesCritiques.length > 0) concl += `ALERTE CRITIQUE : Déséquilibre majeur pour ${anomaliesCritiques.join(', ')}. Hospitalisation immédiate requise.`;
    else if (anomaliesHaut.length > 0 || anomaliesBas.length > 0) concl += `Bilan perturbé : Anomalies détectées sur ${[...anomaliesHaut, ...anomaliesBas].join(', ')}.`;
    else if (!concl) concl = "Bilan biologique satisfaisant. Absence d'anomalie majeure.";

    document.getElementById('auto-concl-area').value = concl;
    document.getElementById('d-concl').innerText = concl;
}

// ==========================================
// 4. GÉNÉRATEUR AUTO ET GRAVITÉ
// ==========================================
// Correction de la génération aléatoire du groupe sanguin
function determinerGroupeAleatoire() {
    const groupes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const resultat = groupes[Math.floor(Math.random() * groupes.length)];
    
    const afficheur = document.getElementById('d-groupe');
    const select = document.getElementById('select-groupe');
    
    if(afficheur) afficheur.innerText = resultat;
    if(select) select.value = resultat;
}

function lancerGenerationAuto() {
    const grav = parseInt(document.getElementById('gravity-range').value); // 1-10
    const scenarios = Array.from(document.querySelectorAll('.scenario-grid input:checked')).map(i => i.value);
    
    if (scenarios.length === 0) return alert("Coche au moins un scénario !");

    // Valeurs de base saines
    let results = { gb: 6.0, hb: 14.5, ht: 45.0, pla: 250, gly: 0.90, crea: 9.0, crp: 1.5, ph: 7.40, pco2: 40, po2: 95, lact: 1.0, hcg: 0, alc: 0 };
    let extraMsg = "";

    scenarios.forEach(s => {
        let factor = grav / 5; 
        if (s === 'acc-route' || s === 'arme-feu') {
            results.hb -= (2.5 * factor); results.ht -= (8 * factor); results.lact += (1.5 * factor);
            results.po2 -= (6 * factor); results.gb += (2 * factor);
            if(grav > 7) results.ph -= 0.15;
        }
        if (s === 'overdose') {
            results.alc = (0.4 * factor).toFixed(2);
            results.ph -= (0.08 * factor);
        }
        if (s === 'diabete') {
            results.gly += (0.8 * factor); results.ph -= (0.05 * factor);
        }
        if (s === 'renal') {
            results.crea += (8 * factor);
        }
        if (s === 'grossesse') {
            // Logique : 1 niveau de gravité = 1 mois réel = 4 semaines de grossesse
            // Le taux HCG augmente de façon exponentielle
            const semaines = grav * 4;
            results.hcg = Math.floor(1000 * Math.pow(1.8, grav)); 
            extraMsg = ` (Grossesse confirmée : environ ${semaines} SA / ${grav} mois)`;
        }
    });

    for (let id in results) {
        let finalVal = results[id];
        
        // Conversion des résultats HCG en données chiffrées concrètes
        if(id === 'hcg') {
            finalVal = results[id] > 5 ? `${results[id]} mUI/mL` : "5 mUI/mL (Négatif)";
        } else {
            finalVal = results[id].toFixed(id === 'ph' ? 2 : 1);
        }
        
        let catFound = "";
        for (let c in database) {
            if (database[c].find(i => i.id === id)) catFound = c;
        }

        const input = document.querySelector(`[data-id="${id}"]`);
        if (input) {
            input.value = finalVal;
            res(id, finalVal, catFound); 
        }
    }
    
    if(extraMsg) {
        const inputConcl = document.getElementById('auto-concl-area');
        inputConcl.value = "Analyse hormonale positive." + extraMsg;
        analyserTout(); 
    }
}

function switchMode(mode) {
    document.getElementById('panel-auto').style.display = (mode === 'auto' ? 'block' : 'none');
    document.getElementById('panel-manual').style.display = (mode === 'manual' ? 'block' : 'none');
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    if(mode === 'auto') document.getElementById('btn-auto').classList.add('active');
    else document.getElementById('btn-manual').classList.add('active');
}

function resetSeulementBio() {
    if (!confirm("Vider les analyses ?")) return;
    document.querySelectorAll('.analysis-input').forEach(el => el.value = "");
    document.querySelectorAll('.scenario-grid input').forEach(el => el.checked = false);
    document.querySelectorAll('.row, .section').forEach(el => el.classList.remove('active'));
}
// ==========================================
// 5. EXPORT IMAGE
// ==========================================
// GÉNÉRATEUR D'IMAGE AVEC POPUP
const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 

async function genererImage() {
    const doc = document.getElementById('document');
    const btn = event.target;
    btn.innerText = "CROP & UPLOAD...";
    btn.disabled = true;

    try {
        // html2canvas va maintenant suivre la hauteur réelle de l'élément #document
        const canvas = await html2canvas(doc, { 
            scale: 2,           // Haute qualité
            useCORS: true,      // Pour le QR Code
            backgroundColor: "#ffffff",
            height: doc.offsetHeight, // Force la capture à la hauteur réelle du texte
            windowHeight: doc.offsetHeight
        });

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
            document.getElementById('direct-link').value = result.data.url;
            document.getElementById('preview-img-result').src = result.data.url;
            document.getElementById('image-popup').style.display = 'flex';
        }

    } catch (e) {
        console.error(e);
        alert("Erreur lors du crop de l'image.");
    } finally {
        btn.innerText = "🖼️ GÉNÉRER L'IMAGE (CROP)";
        btn.disabled = false;
    }
}

function copyLink() {
    const copyText = document.getElementById("direct-link");
    copyText.select();
    document.execCommand("copy");
    alert("Lien copié ! Vous pouvez le coller en jeu.");
}

function closePopup() {
    document.getElementById('image-popup').style.display = 'none';
}

// RESTE DES FONCTIONS (res, switchMode, determinerGroupeAleatoire, etc.)


document.addEventListener('DOMContentLoaded', init);
