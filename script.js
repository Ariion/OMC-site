// ==========================================
// 1. BASES DE DONNÉES
// ==========================================

const database = {
    "Hématologie (Sang)": [
        { id: "gb", label: "Leucocytes (Globules Blancs)", unit: "G/L", norm: "4.0 - 10.0", help: "Infection ou inflammation." },
        { id: "hb", label: "Hémoglobine", unit: "g/dL", norm: "13.0 - 17.0", help: "Anémie ou hémorragie." },
        { id: "ht", label: "Hématocrite", unit: "%", norm: "40 - 52", help: "Volume des globules rouges." },
        { id: "pla", label: "Plaquettes", unit: "G/L", norm: "150 - 400", help: "Coagulation." },
        { id: "vgm", label: "VGM", unit: "fL", norm: "80 - 100", help: "Taille des globules rouges." },
        { id: "tcmh", label: "TCMH", unit: "pg", norm: "27 - 32", help: "Teneur en hémoglobine." },
        { id: "poly_n", label: "Polynucléaires Neutrophiles", unit: "%", norm: "40 - 75", help: "Infection bactérienne." },
        { id: "lympho", label: "Lymphocytes", unit: "%", norm: "20 - 45", help: "Infection virale / Immunité." }
    ],
    "Coagulation": [
        { id: "tp", label: "Taux de Prothrombine (TP)", unit: "%", norm: "70 - 100", help: "Vitesse de coagulation." },
        { id: "inr", label: "INR", unit: "-", norm: "0.8 - 1.2", help: "Suivi traitement anticoagulant." },
        { id: "tca", label: "TCA", unit: "sec", norm: "24 - 38", help: "Temps de céphaline activée." },
        { id: "fibri", label: "Fibrinogène", unit: "g/L", norm: "2.0 - 4.0", help: "Facteur de coagulation." }
    ],
    "Biochimie Métabolique": [
        { id: "gly", label: "Glycémie à jeun", unit: "g/L", norm: "0.70 - 1.10", help: "Taux de sucre (Diabète)." },
        { id: "uree", label: "Urée", unit: "g/L", norm: "0.15 - 0.45", help: "Déchets azotés." },
        { id: "crea", label: "Créatinine", unit: "mg/L", norm: "7.0 - 12.0", help: "Filtration des reins." },
        { id: "crp", label: "CRP", unit: "mg/L", norm: "0 - 5.0", help: "Inflammation aiguë." },
        { id: "vs", label: "Vitesse Sédimentation", unit: "mm/h", norm: "0 - 20", help: "Inflammation chronique." }
    ],
    "Ionogramme (Sels)": [
        { id: "na", label: "Sodium (Na+)", unit: "mmol/L", norm: "135 - 145", help: "Hydratation." },
        { id: "k", label: "Potassium (K+)", unit: "mmol/L", norm: "3.5 - 5.0", help: "Danger cardiaque si anormal." },
        { id: "cl", label: "Chlore (Cl-)", unit: "mmol/L", norm: "95 - 105", help: "Équilibre acido-basique." },
        { id: "ca", label: "Calcium", unit: "mg/L", norm: "85 - 105", help: "Os et muscles." }
    ],
    "Bilan Hépatique (Foie)": [
        { id: "asat", label: "ASAT (TGO)", unit: "UI/L", norm: "0 - 35", help: "Lésion hépatique." },
        { id: "alat", label: "ALAT (TGP)", unit: "UI/L", norm: "0 - 45", help: "Inflammation foie." },
        { id: "ggt", label: "Gamma-GT", unit: "UI/L", norm: "0 - 55", help: "Alcool ou voies biliaires." },
        { id: "bili_t", label: "Bilirubine Totale", unit: "mg/L", norm: "0 - 12", help: "Jaunisse (Ictère)." }
    ],
    "Marqueurs Cardiaques": [
        { id: "tropo", label: "Troponine I", unit: "ng/L", norm: "0 - 15", help: "Diagnostic Infarctus." },
        { id: "bnp", label: "BNP", unit: "pg/mL", norm: "0 - 100", help: "Insuffisance cardiaque." }
    ],
    "Gaz du Sang (AA)": [
        { id: "ph", label: "pH Artériel", unit: "", norm: "7.38 - 7.42", help: "Acidité sanguine." },
        { id: "pco2", label: "PCO2", unit: "mmHg", norm: "35 - 45", help: "Respiration (CO2)." },
        { id: "po2", label: "PO2", unit: "mmHg", norm: "80 - 100", help: "Oxygénation." },
        { id: "lact", label: "Lactates", unit: "mmol/L", norm: "0.5 - 2.0", help: "Souffrance des tissus." }
    ],
    "Toxicologie (LSPD/BCSO)": [
        { id: "alc", label: "Alcoolémie", unit: "g/L", norm: "0 - 0.10", help: "Taux d'alcool." },
        { id: "thc", label: "Cannabis (THC)", unit: "-", norm: "Négatif", help: "Dépistage stupéfiant." },
        { id: "coc", label: "Cocaïne", unit: "-", norm: "Négatif", help: "Dépistage stupéfiant." },
        { id: "amp", label: "Amphétamines", unit: "-", norm: "Négatif", help: "Dépistage stupéfiant." }
    ],
    "Endocrinologie & Divers": [
        { id: "tsh", label: "TSH", unit: "mUI/L", norm: "0.4 - 4.0", help: "Thyroïde." },
        { id: "hcg", label: "Bêta-HCG", unit: "mUI/mL", norm: "0 - 5", help: "Test de grossesse." },
        { id: "vitd", label: "Vitamine D", unit: "ng/mL", norm: "30 - 60", help: "Solidité osseuse." },
        { id: "adn", label: "Compatibilité ADN", unit: "%", norm: "100", help: "Identification criminelle." }
    ]
};

const causesData = {
    "Neurologique": ["Hémorragie méningée", "Hémorragie intracérébrale massive", "Infarctus cérébral massif", "Traumatisme cranien sévère", "Etat de mal épileptique"],
    "Hémorragique": ["Hémorragie interne massive", "Hémorragie externe incontrôlable", "Rupture d'anévrisme", "Hémorragie obstétricale sévère"],
    "Infectieuse / Métabolique": ["Choc septique", "Défaillance multiviscérale", "Méningite bactérienne fulminante", "Acidocétose diabétique sévère", "Insuffisance hépatique aiguë", "Hyperthermie maligne"],
    "Cardio-respiratoire": ["Arrêt cardio-respiratoire", "Fibrillation / TV", "Infarctus aigu du myocarde", "Embolie pulmonaire massive", "Oedème aigu du poumon", "Noyade"],
    "Traumatique": ["Polytraumatisme avec choc hémorragique", "Ecrasement thoraco-abdominal", "Section médullaire haute", "Brulures étendues"],
    "Toxique": ["Intoxication médicamenteuse massive", "Overdose opioïdes / cocaïne", "Intoxication monoxyde de carbone", "Empoisonnement chimique"]
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
                <span class="help-text">${item.help}</span>
                <label>${item.label}</label>
                <div style="font-size: 0.7em; color: orange; margin-bottom: 5px;">Norme : ${item.norm} ${item.unit}</div>
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
// 3. LOGIQUE MÉDICALE (LABO)
// ==========================================

function res(id, val, cat) {
    const row = document.getElementById('row-'+id);
    const valSpan = document.getElementById('val-'+id);
    if(valSpan) valSpan.innerText = val;

    const itemData = Object.values(database).flat().find(i => i.id === id);
    if (val.trim() !== "" && itemData && itemData.norm !== "Négatif" && itemData.norm !== "Conforme") {
        const valNum = parseFloat(val.replace(',', '.'));
        const [min, max] = itemData.norm.replace('0 - ', '0-').split('-').map(n => parseFloat(n));
        valSpan.style.color = (valNum < min || valNum > max) ? "red" : "green";
    } else if (val.toLowerCase() === "positif") { valSpan.style.color = "red"; }
    else if (val.toLowerCase() === "négatif" || val.toLowerCase() === "conforme") { valSpan.style.color = "green"; }

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
        if (norm.includes('-') || norm.startsWith('0')) {
            let valNum = parseFloat(valText), [min, max] = norm.replace('0 - ', '0-').split('-').map(n => parseFloat(n));
            if (valNum < min) anomalies.push(`${label} bas`);
            if (valNum > max) anomalies.push(`${label} élevé`);
        } else if (norm === "Négatif" && valText.toLowerCase() === "positif") { anomalies.push(`${label} POSITIF`); }
    });
    let autoConcl = anomalies.length > 0 ? "Points d'attention : " + anomalies.join(', ') + "." : "Bilan biologique satisfaisant.";
    const textZone = document.querySelector('textarea[oninput*="d-concl"]');
    if(textZone) textZone.value = autoConcl;
    const conclEl = document.getElementById('d-concl');
    if(conclEl) conclEl.innerText = autoConcl;
}

// ==========================================
// 4. LOGIQUE DÉCÈS (SÉLECTEURS & RÉF)
// ==========================================

function updateCausesSub(type) {
    const select = document.getElementById('cause-precision');
    if(!select) return;
    select.innerHTML = '<option value="">-- Sélectionner --</option>';
    if (causesData[type]) {
        causesData[type].forEach(c => {
            select.innerHTML += `<option value="${c}">${c}</option>`;
        });
    }
}

function genererReference() {
    const n = new Date();
    const jour = n.getDate().toString().padStart(2, '0');
    const mois = (n.getMonth() + 1).toString().padStart(2, '0');
    const heure = n.getHours().toString().padStart(2, '0');
    const minute = n.getMinutes().toString().padStart(2, '0');
    const ref = `${jour}${mois}${heure}${minute}`;

    const elements = { 'd-ref': ref, 'stamp-ref': ref };
    for (let id in elements) {
        let el = document.getElementById(id);
        if (el) el.innerText = elements[id];
    }

    const qr = document.getElementById('qr-ref');
    if (qr) qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OMC-DECES-${ref}`;
}

// ==========================================
// 5. ENVOIS DISCORD
// ==========================================

async function envoyerDiscord() {
    const webhookURL = "https://discord.com/api/webhooks/1462416189526638613/iMpoe9mn6DC4j_0eBS4tOVjaDo_jy1MhfSKIEP80H7Ih3uYGHRcJ5kQSqIFuL0DTqlUy";
    const btn = document.getElementById('discord-btn');
    const docElement = document.getElementById('document');
    btn.innerText = "📸 CAPTURE...";
    btn.disabled = true;

    try {
        const canvas = await html2canvas(docElement, { scale: 2, useCORS: true });
        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            const patientNom = document.getElementById('d-nom')?.innerText || "Inconnu";
            const payload = {
                username: "OMC INTRANET",
                content: `📑 **Nouveau rapport de laboratoire**\n👤 **Patient :** ${patientNom}`,
            };
            formData.append("payload_json", JSON.stringify(payload));
            formData.append("file", blob, `rapport_${patientNom}.png`);
            await fetch(webhookURL, { method: 'POST', body: formData });
            alert("✅ Rapport envoyé !");
        }, 'image/png');
    } catch (error) { alert("❌ Erreur de capture."); }
    finally { btn.innerText = "ENVOYER SUR L'INTRANET"; btn.disabled = false; }
}

async function envoyerDiscordDeces() {
    const webhookURL = "TON_WEBHOOK_DECES_ICI"; // À REMPLACER PAR TON LIEN
    const docElement = document.getElementById('document');
    const patient = document.getElementById('d-defunt')?.innerText || "Inconnu";

    html2canvas(docElement, { scale: 2 }).then(canvas => {
        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append("payload_json", JSON.stringify({
                content: `💀 **NOUVEL ACTE DE DÉCÈS ÉTABLI**\n👤 Défunt : **${patient}**`
            }));
            formData.append("file", blob, `acte_deces_${patient}.png`);
            await fetch(webhookURL, { method: 'POST', body: formData });
            alert("✅ Acte de décès envoyé !");
        });
    });
}

// ==========================================
// 6. LANCEMENT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    init();
    genererReference();
});
