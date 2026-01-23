// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    init();
    setAutoDate();
    updateLiveQRCode();
});

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

function genererGrossesse(mois) {
    if (mois === 'aleatoire') mois = 1;
    const data = grossesseData[mois] || grossesseData["neg"];
    
    // 1. Injection des valeurs bio
    res('hcg', (Math.random() * (2000 - 500) + 500).toFixed(0), 'ENDOCRINOLOGIE & DIVERS');
    res('gb', "11.2", 'HÉMATOLOGIE (SANG)');

    // 2. Préparation du texte
    let texteGrossesse = (mois === "neg") 
        ? "Analyse immunologique : Absence d'hormone Bêta-HCG. Test de grossesse négatif." 
        : `Bilan de maternité - ${data.label} : Présence d'hormone HCG. Évolution clinique favorable.`;

    // 3. LOGIQUE INTELLIGENTE : On récupère la conclusion actuelle
    let actuelle = document.getElementById('auto-concl-area').value;
    
    // Si une ligne de grossesse existe déjà, on la remplace pour ne pas "empiler" les mois
    // Sinon, on l'ajoute à la suite du reste (Accident, etc.)
    let finale = "";
    if (actuelle.includes("Bilan de maternité") || actuelle.includes("Analyse immunologique")) {
        // On remplace l'ancienne ligne de grossesse par la nouvelle
        finale = actuelle.replace(/.*(Bilan de maternité|Analyse immunologique).*/, texteGrossesse);
    } else {
        finale = actuelle ? actuelle + "\n" + texteGrossesse : texteGrossesse;
    }

    document.getElementById('auto-concl-area').value = finale;
    document.getElementById('d-concl').innerText = finale;
    updateLiveQRCode();
}

function determinerGroupeAleatoire() {
    const groupes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const resultat = groupes[Math.floor(Math.random() * groupes.length)];
    
    const afficheur = document.getElementById('d-groupe'); // Sur le rapport
    const select = document.getElementById('select-groupe'); // Dans le menu
    
    if(afficheur) afficheur.innerText = resultat;
    if(select) select.value = resultat;
}

// Modifie ton DOMContentLoaded pour l'inclure au départ
document.addEventListener('DOMContentLoaded', () => {
    init();
    setAutoDate();
    determinerGroupeAleatoire(); // <--- ICI
    updateLiveQRCode();
});

// ==========================================
// 2. INITIALISATION ET AFFICHAGE
// ==========================================

function init() {
    const tabsContainer = document.getElementById('dynamic-tabs');
    const sectionsContainer = document.getElementById('dynamic-sections');
    if (!tabsContainer || !sectionsContainer) return;

    tabsContainer.innerHTML = "";
    sectionsContainer.innerHTML = "";

    for (let cat in database) {
        const cleanCatId = cat.replace(/\s+/g, '-').replace(/[()]/g, '');

        // Bouton Menu Gauche
        let btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.innerHTML = `<span>${cat.toUpperCase()}</span> <span>▼</span>`;
        
        let contentDiv = document.createElement('div');
        contentDiv.className = 'category-content';
        contentDiv.id = 't-' + cleanCatId;

        btn.onclick = (e) => {
            e.preventDefault();
            contentDiv.classList.toggle('active');
        };

        // Section Document Droite (C'est ici que l'affichage se joue)
        let sec = document.createElement('div');
        sec.id = 'sec-' + cleanCatId;
        sec.className = 'section';
        sec.innerHTML = `<div class="section-title">${cat}</div>`;

        database[cat].forEach(item => {
            // Ajout dans le menu manuel
            contentDiv.innerHTML += `
                <div class="input-group-manual">
                    <label class="manual-label">${item.label}</label>
                    <input type="text" class="analysis-input" data-id="${item.id}" data-label="${item.label}" data-norm="${item.norm}" oninput="res('${item.id}', this.value, '${cat}')" placeholder="Valeur...">
                </div>`;
            
            // Ajout de la ligne invisible dans le rapport
            sec.innerHTML += `
                <div class="row" id="row-${item.id}">
                    <span>${item.label}</span>
                    <span class="val" id="val-${item.id}"></span>
                    <span class="norme">${item.norm} ${item.unit}</span>
                </div>`;
        });

        tabsContainer.appendChild(btn);
        tabsContainer.appendChild(contentDiv);
        sectionsContainer.appendChild(sec);
    }
}

// REMPLISSAGE ET ACTIVATION DES LIGNES
function res(id, val, cat) {
    const cleanCatId = cat.replace(/\s+/g, '-').replace(/[()]/g, '');
    const row = document.getElementById('row-' + id);
    const valSpan = document.getElementById('val-' + id);
    const section = document.getElementById('sec-' + cleanCatId);

    if (valSpan) {
        valSpan.innerText = val;
        // Couleur selon norme
        const item = Object.values(database).flat().find(i => i.id === id);
        if (item && val.trim() !== "" && item.norm.includes('-')) {
            const [min, max] = item.norm.split('-').map(n => parseFloat(n));
            const v = parseFloat(val.replace(',', '.'));
            valSpan.style.color = (v < min || v > max) ? "#ef4444" : "#22c55e";
        }
    }

    // IMPORTANT : Active la visibilité
    if (val.trim() !== "" && val !== "...") {
        if (row) row.classList.add('active');
        if (section) section.classList.add('active');
    } else {
        if (row) row.classList.remove('active');
        if (section && section.querySelectorAll('.row.active').length === 0) {
            section.classList.remove('active');
            
        }
    }
    updateLiveQRCode();
    analyserTout(); // <--- AJOUTE ÇA ICI
}
}

// ==========================================
// 3. GÉNÉRATEURS ET LOGIQUE
// ==========================================

function lancerGenerationAuto() {
    const grav = parseInt(document.getElementById('gravity-range').value);
    const scenarios = Array.from(document.querySelectorAll('.sidebar input[type="checkbox"]:checked')).map(i => i.value);
    
    if (scenarios.length === 0) return alert("Coche un scénario !");
    resetSeulementBio(false); 

    let results = { gb: 7.2, hb: 14.8, ht: 44, pla: 280, gly: 0.95, na: 140, k: 4.1 };
    let categoriesToShow = ["HÉMATOLOGIE (SANG)", "BIOCHIMIE MÉTABOLIQUE", "IONOGRAMME (SELS)"];

    scenarios.forEach(s => {
        let f = grav / 5; 
        if (s === 'acc-route' || s === 'overdose') {
            results.hb = (14.5 - (3.5 * f)).toFixed(1);
            results.alc = (0.2 + (0.8 * f)).toFixed(2);
            if (s === 'overdose') categoriesToShow.push("TOXICOLOGIE (LSPD/BCSO)");
        }
    });

    for (let id in results) {
        let catFound = "";
        for (let c in database) {
            if (database[c].find(i => i.id === id)) catFound = c;
        }
        if (catFound && categoriesToShow.includes(catFound)) {
            res(id, results[id].toString(), catFound);
        }
    }
    analyserTout(); // Optionnel : met à jour la conclusion auto
}

function genererGrossesse(mois) {
    if (mois === 'aleatoire') mois = 1;
    const data = grossesseData[mois] || grossesseData["neg"];
    
    res('hcg', "1250", 'ENDOCRINOLOGIE & DIVERS');
    res('gb', "11.2", 'HÉMATOLOGIE (SANG)');

    let texte = `Bilan de maternité - ${data.label}. Évolution clinique favorable.`;
    let actuelle = document.getElementById('auto-concl-area').value;
    let finale = actuelle ? actuelle + "\n" + texte : texte;

    document.getElementById('auto-concl-area').value = finale;
    document.getElementById('d-concl').innerText = finale;
}

// --- FONCTIONS SYSTÈME ---

function setAutoDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = today.toLocaleDateString('fr-FR', options);
    if (document.getElementById('d-date-prel')) document.getElementById('d-date-prel').innerText = dateStr;
}

function updateLiveQRCode() {
    const nom = document.getElementById('d-nom').innerText || "Anonyme";
    const qrImg = document.getElementById('qr-ref');
    if (qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OMC-${encodeURIComponent(nom)}`;
    }
}

function resetSeulementBio(confirmNeeded = true) {
    if (confirmNeeded && !confirm("Vider les analyses ?")) return;
    document.querySelectorAll('.analysis-input').forEach(el => el.value = "");
    document.querySelectorAll('.row, .section').forEach(el => el.classList.remove('active'));
    document.getElementById('auto-concl-area').value = "";
    document.getElementById('d-concl').innerText = "...";
    updateLiveQRCode();
}

function analyserTout() {
    let anomalies = [];
    let isCritique = false;

    // On scanne tous les inputs qui ont une valeur
    document.querySelectorAll('.analysis-input').forEach(input => {
        let val = parseFloat(input.value.replace(',', '.'));
        let norm = input.getAttribute('data-norm');
        let label = input.getAttribute('data-label');

        if (!isNaN(val) && norm && norm.includes('-')) {
            let [min, max] = norm.split('-').map(Number);
            if (val < min || val > max) {
                anomalies.push(label);
                // Si l'écart est énorme (x2), on passe en critique
                if (val > max * 2 || val < min / 2) isCritique = true;
            }
        }
    });

    if (anomalies.length > 0) {
        let texte = isCritique ? "ALERTE CRITIQUE : Déséquilibre majeur détecté (" : "Bilan perturbé : Anomalies sur (";
        texte += anomalies.join(', ') + ").";
        
        // On l'ajoute à la conclusion sans effacer la grossesse si elle est là
        let actuelle = document.getElementById('auto-concl-area').value;
        if (!actuelle.includes("Bilan perturbé") && !actuelle.includes("ALERTE CRITIQUE")) {
            let finale = actuelle ? texte + "\n" + actuelle : texte;
            document.getElementById('auto-concl-area').value = finale;
            document.getElementById('d-concl').innerText = finale;
        }
    }
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

    // On s'assure que le scroll est en haut pour une capture propre
    window.scrollTo(0,0);

    try {
        const canvas = await html2canvas(doc, { 
            scale: 2,           // Haute qualité pour impression
            useCORS: true,      // Pour les images externes
            backgroundColor: "#ffffff",
            // LE CROP : On prend la hauteur exacte du contenu
            height: doc.scrollHeight, 
            windowHeight: doc.scrollHeight,
            y: 0 
        });

        const imageData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        const formData = new FormData();
        formData.append("image", imageData);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            lastImageUrl = result.data.url;
            document.getElementById('direct-link').value = lastImageUrl;
            document.getElementById('preview-img-result').src = lastImageUrl;
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

// Variable globale pour stocker l'URL de l'image
let lastImageUrl = "";



function envoyerDiscord() {
    const webhook = "https://discord.com/api/webhooks/1462416189526638613/iMpoe9mn6DC4j_0eBS4tOVjaDo_jy1MhfSKIEP80H7Ih3uYGHRcJ5kQSqIFuL0DTqlUy"; // À remplacer par ton lien
    const nomPatient = document.getElementById('d-nom').innerText;
    
    if (!lastImageUrl) {
        return alert("Génère d'abord l'image avant d'envoyer sur Discord !");
    }

    const payload = {
        username: "OMC - Laboratoire",
        embeds: [{
            title: `Nouveau Bilan Biologique : ${nomPatient}`,
            color: 65500, // Couleur Cyan
            image: { url: lastImageUrl },
            footer: { text: "Olympus Medical Center - Los Santos" },
            timestamp: new Date()
        }]
    };

    fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(() => alert("Rapport envoyé sur Discord !"));
}

function closePopup() {
    document.getElementById('image-popup').style.display = 'none';
    document.body.style.overflow = 'auto'; // Réactive le scroll du site
}

// Fonction pour mettre à jour le QR Code en temps réel
function updateLiveQRCode() {
    const nom = document.getElementById('d-nom').innerText || "Anonyme";
    const date = document.getElementById('d-date-prel').innerText || "00-00-00";
    const qrImg = document.getElementById('qr-ref');
    
    if (qrImg) {
        // On crée une chaîne de données unique basée sur les infos du document
        const data = encodeURIComponent(`OMC-LAB|${nom}|${date}`);
        // L'URL change, forçant l'image à se recharger avec les nouvelles infos
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
    }
}

// MODIFICATION DE TA FONCTION UP EXISTANTE
// Assure-toi que ta fonction up() appelle updateLiveQRCode() à la fin
function up(id, val) {
    const el = document.getElementById(id);
    if (el) {
        el.innerText = val;
        // Mise à jour du QR Code à chaque modification de texte
        updateLiveQRCode(); 
    }
}

// Reste des fonctions (analyserTout, lancerGenerationAuto, genererImage, etc.) à garder intactes...
document.addEventListener('DOMContentLoaded', init);
