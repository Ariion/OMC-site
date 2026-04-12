/* ============================================================
   LABORATOIRE OMC — VERSION MÉDICALE COMPLÈTE
   Scénarios cliniques réels + Module IST
   ============================================================ */

// ==========================================
// 1. BASE DE DONNÉES MÉDICALE COMPLÈTE
// ==========================================
const database = {
    "HÉMATOLOGIE (NFS)": [
        { id: "gb",      label: "Leucocytes",      unit: "G/L",   norm: "4.0 - 10.0" },
        { id: "gr",      label: "Globules Rouges",  unit: "T/L",   norm: "4.5 - 5.5" },
        { id: "hb",      label: "Hémoglobine",      unit: "g/dL",  norm: "13.0 - 17.0" },
        { id: "ht",      label: "Hématocrite",       unit: "%",     norm: "40 - 52" },
        { id: "pla",     label: "Plaquettes",        unit: "G/L",   norm: "150 - 400" },
        { id: "vgm",     label: "VGM",               unit: "fL",    norm: "80 - 100" },
        { id: "tcmh",    label: "TCMH",              unit: "pg",    norm: "27 - 32" },
        { id: "poly_n",  label: "Polynucléaires",    unit: "%",     norm: "40 - 75" },
        { id: "lympho",  label: "Lymphocytes",       unit: "%",     norm: "20 - 45" }
    ],
    "COAGULATION": [
        { id: "tp",      label: "Taux Prothrombine", unit: "%",     norm: "70 - 100" },
        { id: "inr",     label: "INR",               unit: "-",     norm: "0.8 - 1.2" },
        { id: "tca",     label: "TCA",               unit: "sec",   norm: "24 - 38" },
        { id: "fibri",   label: "Fibrinogène",       unit: "g/L",   norm: "2.0 - 4.0" }
    ],
    "BIOCHIMIE MÉTABOLIQUE": [
        { id: "gly",     label: "Glycémie (Jeun)",   unit: "g/L",   norm: "0.70 - 1.10" },
        { id: "ceton",   label: "Cétonémie",         unit: "mmol/L",norm: "0 - 0.6" },
        { id: "uree",    label: "Urée",              unit: "g/L",   norm: "0.15 - 0.45" },
        { id: "crea",    label: "Créatinine",        unit: "mg/L",  norm: "7.0 - 12.0" },
        { id: "crp",     label: "CRP",               unit: "mg/L",  norm: "0 - 5.0" },
        { id: "cpk",     label: "CPK (Créatine PK)", unit: "UI/L",  norm: "30 - 200" }
    ],
    "IONOGRAMME": [
        { id: "na",      label: "Sodium (Na+)",      unit: "mmol/L",norm: "135 - 145" },
        { id: "k",       label: "Potassium (K+)",    unit: "mmol/L",norm: "3.5 - 5.0" },
        { id: "cl",      label: "Chlore (Cl-)",      unit: "mmol/L",norm: "95 - 105" },
        { id: "ca",      label: "Calcium",            unit: "mg/L",  norm: "85 - 105" }
    ],
    "BILAN RÉNAL": [
        { id: "prot_u",  label: "Protéinurie",       unit: "g/24h", norm: "< 0.15" },
        { id: "hem_u",   label: "Hématurie",         unit: "ER/mL", norm: "< 5" },
        { id: "leu_u",   label: "Leucocyturie",      unit: "EB/mL", norm: "< 10" }
    ],
    "BILAN HÉPATIQUE": [
        { id: "asat",    label: "ASAT (TGO)",        unit: "UI/L",  norm: "0 - 35" },
        { id: "alat",    label: "ALAT (TGP)",        unit: "UI/L",  norm: "0 - 45" },
        { id: "ggt",     label: "Gamma-GT",          unit: "UI/L",  norm: "0 - 55" },
        { id: "bili_t",  label: "Bilirubine Tot.",   unit: "mg/L",  norm: "0 - 12" }
    ],
    "MARQUEURS CARDIAQUES": [
        { id: "tropo",   label: "Troponine I",       unit: "ng/L",  norm: "0 - 15" },
        { id: "bnp",     label: "BNP",               unit: "pg/mL", norm: "0 - 100" },
        { id: "rai",     label: "RAI (Ags irrég.)",  unit: "-",     norm: "Négatif" }
    ],
    "GAZ DU SANG": [
        { id: "ph",      label: "pH Artériel",       unit: "",      norm: "7.38 - 7.42" },
        { id: "pco2",    label: "PCO2",              unit: "mmHg",  norm: "35 - 45" },
        { id: "po2",     label: "PO2",               unit: "mmHg",  norm: "80 - 100" },
        { id: "lact",    label: "Lactates",          unit: "mmol/L",norm: "0.5 - 2.0" }
    ],
    "TOXICOLOGIE SANGUINE": [
        { id: "alc",     label: "Alcoolémie",        unit: "g/L",   norm: "0 - 0.10" },
        { id: "parace",  label: "Paracétamol",       unit: "mg/L",  norm: "< 10" },
        { id: "lithium", label: "Lithium",           unit: "mmol/L",norm: "0.6 - 1.2" }
    ],
    "TOXICOLOGIE URINAIRE": [
        { id: "thc",     label: "Cannabis (THC)",    unit: "-",     norm: "Négatif" },
        { id: "coc",     label: "Cocaïne",           unit: "-",     norm: "Négatif" },
        { id: "amp",     label: "Amphétamines",      unit: "-",     norm: "Négatif" },
        { id: "benzo",   label: "Benzodiazépines",   unit: "-",     norm: "Négatif" },
        { id: "opio",    label: "Opioïdes",          unit: "-",     norm: "Négatif" }
    ],
    "ENDOCRINOLOGIE & FERTILITÉ": [
        { id: "tsh",     label: "TSH",               unit: "mUI/L", norm: "0.4 - 4.0" },
        { id: "hcg",     label: "Bêta-HCG",          unit: "mUI/mL",norm: "< 5" },
        { id: "amh",     label: "AMH (Réserve)",     unit: "ng/mL", norm: "2.0 - 6.8" },
        { id: "fsh",     label: "FSH",               unit: "UI/L",  norm: "3.5 - 12.5" },
        { id: "lh",      label: "LH",                unit: "UI/L",  norm: "2.4 - 12.6" },
        { id: "prolac",  label: "Prolactine",        unit: "ng/mL", norm: "4.8 - 23.3" }
    ]
};

// ==========================================
// 2. INITIALISATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initInterface();
    if (window.setAutoDate) window.setAutoDate();
    if (window.determinerGroupeAleatoire) window.determinerGroupeAleatoire();
    updateLiveQRCode();
});

function initInterface() {
    const tabsContainer = document.getElementById('dynamic-tabs');
    const sectionsContainer = document.getElementById('dynamic-sections');
    if (!tabsContainer || !sectionsContainer) return;

    tabsContainer.innerHTML = "";
    sectionsContainer.innerHTML = "";

    for (let cat in database) {
        const cid = cleanId(cat);

        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.innerHTML = `<span>${cat}</span><span class="cat-arrow">▼</span>`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'category-content';
        contentDiv.id = 't-' + cid;

        btn.onclick = (e) => {
            e.preventDefault();
            contentDiv.classList.toggle('active');
            btn.querySelector('.cat-arrow').textContent = contentDiv.classList.contains('active') ? '▲' : '▼';
        };

        const sec = document.createElement('div');
        sec.id = 'sec-' + cid;
        sec.className = 'section';
        sec.innerHTML = `<div class="section-title">${cat}</div>`;

        database[cat].forEach(item => {
            contentDiv.innerHTML += `
                <div class="input-group-manual">
                    <label class="manual-label">${item.label} <small style="color:#475569">${item.unit}</small></label>
                    <input type="text" class="analysis-input" data-id="${item.id}"
                           oninput="window.res('${item.id}', this.value, '${cat}')"
                           placeholder="${item.norm}">
                </div>`;

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

function cleanId(str) {
    return str.replace(/\s+/g, '-').replace(/[()&]/g, '').replace(/--+/g, '-');
}

// ==========================================
// 3. SCÉNARIOS CLINIQUES COMPLETS
// ==========================================

/* ── TRAUMA (Accident / Écrasement) ── */
window.lancerTrauma = function() {
    window.resetSeulementBio(false);
    const grav = parseInt(document.getElementById('gravity-range').value);
    const f = (grav - 1) / 9;
    const ecrasement = document.getElementById('chk-ecrasement')?.checked;
    const thoracique  = document.getElementById('chk-thoracique')?.checked;
    const operation   = document.getElementById('chk-operation')?.checked;

    // NFS — hémorragie
    set('hb',  (15.0 - 8.0 * f).toFixed(1),    'HÉMATOLOGIE (NFS)');
    set('gr',  (5.0  - 2.5 * f).toFixed(2),    'HÉMATOLOGIE (NFS)');
    set('ht',  (45   - 20  * f).toFixed(0),    'HÉMATOLOGIE (NFS)');
    set('gb',  (7.0  + 8.0 * f).toFixed(1),    'HÉMATOLOGIE (NFS)');
    set('pla', (280  - 180 * f).toFixed(0),    'HÉMATOLOGIE (NFS)');

    // Coagulation
    set('tp',    (95  - 55 * f).toFixed(0),  'COAGULATION');
    set('inr',   (1.0 + 3.0 * f).toFixed(1), 'COAGULATION');
    set('tca',   (30  + 40 * f).toFixed(0),  'COAGULATION');
    set('fibri', (3.5 - 2.5 * f).toFixed(1), 'COAGULATION');

    // Gaz du sang — acidose
    set('ph',   (7.40 - 0.18 * f).toFixed(2), 'GAZ DU SANG');
    set('pco2', (40   + 5   * f).toFixed(0),  'GAZ DU SANG');
    set('lact', (1.0  + 9.0 * f).toFixed(1),  'GAZ DU SANG');

    // Ionogramme
    set('na', (140 - 8  * f).toFixed(0), 'IONOGRAMME');
    set('k',  (4.0 + 2.0 * f).toFixed(1), 'IONOGRAMME');

    // Rénal
    set('uree', (0.30 + 0.80 * f).toFixed(2), 'BIOCHIMIE MÉTABOLIQUE');
    set('crea', (9.0  + 15  * f).toFixed(1),  'BIOCHIMIE MÉTABOLIQUE');

    // Écrasement → CPK très élevée
    if (ecrasement) {
        set('cpk', (200 + Math.round(15000 * f)).toString(), 'BIOCHIMIE MÉTABOLIQUE');
    }

    // Thoracique → Troponine
    if (thoracique) {
        set('tropo', (15 + Math.round(2000 * f)).toString(), 'MARQUEURS CARDIAQUES');
    }

    // Opération → Groupe + RAI
    if (operation) {
        set('rai', 'Négatif', 'MARQUEURS CARDIAQUES');
    }

    const sev = grav >= 8 ? 'CRITIQUE' : grav >= 5 ? 'MODÉRÉ-SÉVÈRE' : 'MODÉRÉ';
    let extras = [];
    if (ecrasement)  extras.push("- CPK massivement élevée → rhabdomyolyse traumatique. Risque d'insuffisance rénale aiguë.");
    if (thoracique)  extras.push("- Troponine élevée → contusion myocardique à surveiller. ECG requis.");
    if (operation)   extras.push("- RAI négatif. Patient éligible à la transfusion en urgence.");

    fusionnerConclusion(
        `TRAUMATISME — ÉTAT ${sev}.\n\n` +
        `TROUBLES HÉMORRAGIQUES :\n- Anémie ${grav >= 7 ? 'sévère' : 'modérée'} (Hb ${(15.0 - 8.0*f).toFixed(1)} g/dL).\n` +
        `- Thrombopénie (Plaquettes ${(280-180*f).toFixed(0)} G/L).\n\n` +
        `COAGULATION :\n- TP abaissé, INR élevé → coagulopathie de consommation.\n\n` +
        `GAZ DU SANG :\n- ${grav >= 7 ? 'Acidose métabolique sévère' : 'Acidose métabolique débutante'} (pH ${(7.40-0.18*f).toFixed(2)}).\n\n` +
        `CHOC HÉMORRAGIQUE :\n- Lactatémie ${(1.0+9.0*f).toFixed(1)} mmol/L → ${grav >= 7 ? 'choc installé, urgence vitale' : 'hypoperfusion tissulaire'}.\n\n` +
        (extras.length ? extras.join('\n') + '\n\n' : '') +
        `CONDUITE : ${grav >= 7 ? 'Transfusion massive en urgence. Contrôle hémorragique chirurgical.' : 'Remplissage vasculaire, surveillance rapprochée.'}`
    );
};

/* ── PLAIE PAR BALLE ── */
window.lancerPlaieBalle = function() {
    window.resetSeulementBio(false);
    const grav = parseInt(document.getElementById('gravity-range').value);
    const f = (grav - 1) / 9;
    const sexe = document.getElementById('patientSex')?.value;

    // NFS
    set('hb',  (15.0 - 9.0 * f).toFixed(1), 'HÉMATOLOGIE (NFS)');
    set('gr',  (5.0  - 2.8 * f).toFixed(2), 'HÉMATOLOGIE (NFS)');
    set('pla', (270  - 170 * f).toFixed(0), 'HÉMATOLOGIE (NFS)');
    set('gb',  (8.0  + 10  * f).toFixed(1), 'HÉMATOLOGIE (NFS)');

    // Coagulation
    set('tp',    (95  - 60 * f).toFixed(0),  'COAGULATION');
    set('inr',   (1.0 + 4.0 * f).toFixed(1), 'COAGULATION');
    set('tca',   (30  + 50 * f).toFixed(0),  'COAGULATION');
    set('fibri', (3.5 - 3.0 * f).toFixed(1), 'COAGULATION');

    // Bilan transfusionnel
    set('rai', 'Négatif', 'MARQUEURS CARDIAQUES');

    // Facteurs de gravité
    set('ph',   (7.40 - 0.20 * f).toFixed(2), 'GAZ DU SANG');
    set('lact', (1.0  + 11   * f).toFixed(1), 'GAZ DU SANG');

    // Grossesse si femme
    if (sexe === 'F') {
        const enceinte = Math.random() > 0.85;
        const hcgVal = enceinte ? Math.floor(Math.random() * 3000 + 50) : Math.floor(Math.random() * 4);
        set('hcg', hcgVal.toString(), 'ENDOCRINOLOGIE & FERTILITÉ');
    }

    fusionnerConclusion(
        `PLAIE PAR BALLE — ÉTAT ${grav >= 8 ? 'CRITIQUE' : grav >= 5 ? 'GRAVE' : 'MODÉRÉ'}.\n\n` +
        `HÉMORRAGIE :\n- Anémie aiguë (Hb ${(15.0-9.0*f).toFixed(1)} g/dL), thrombopénie.\n` +
        `- Coagulopathie traumatique : TP ${(95-60*f).toFixed(0)}%, INR ${(1.0+4.0*f).toFixed(1)}.\n\n` +
        `BILAN TRANSFUSIONNEL :\n- RAI négatif. Transfusion ${grav >= 7 ? 'urgente requise' : 'à envisager'}.\n\n` +
        `GRAVITÉ :\n- Lactates ${(1.0+11*f).toFixed(1)} mmol/L → ${grav >= 7 ? 'choc hémorragique avéré' : 'hypoperfusion débutante'}.\n` +
        `- pH ${(7.40-0.20*f).toFixed(2)} → ${grav >= 7 ? 'acidose sévère, triade létale' : 'acidose compensée'}.\n\n` +
        (sexe === 'F' ? `BÊTA-HCG : Dosé systématiquement (patiente en âge de procréer).\n\n` : '') +
        `CONDUITE : Damage control chirurgical. Protocole de transfusion massive si lactates > 4.`
    );
};

/* ── OVERDOSE ── */
window.lancerOverdose = function() {
    window.resetSeulementBio(false);
    const grav = parseInt(document.getElementById('gravity-range').value);
    const f = (grav - 1) / 9;
    const sexe = document.getElementById('patientSex')?.value;

    // NFS
    set('gb',  (7.0 + 5.0 * f).toFixed(1), 'HÉMATOLOGIE (NFS)');
    set('hb',  (14  - 4.0 * f).toFixed(1), 'HÉMATOLOGIE (NFS)');
    set('pla', (250 - 100 * f).toFixed(0), 'HÉMATOLOGIE (NFS)');

    // Ionogramme
    set('na', (140 - 10 * f).toFixed(0), 'IONOGRAMME');
    set('k',  (4.0 + 1.5 * f).toFixed(1), 'IONOGRAMME');

    // Glycémie
    set('gly', (0.90 - 0.30 * f).toFixed(2), 'BIOCHIMIE MÉTABOLIQUE');

    // Rénal
    set('uree', (0.30 + 0.60 * f).toFixed(2), 'BIOCHIMIE MÉTABOLIQUE');
    set('crea', (9.0  + 20   * f).toFixed(1), 'BIOCHIMIE MÉTABOLIQUE');

    // Hépatique
    set('asat', (25 + Math.round(800 * f)).toString(), 'BILAN HÉPATIQUE');
    set('alat', (30 + Math.round(600 * f)).toString(), 'BILAN HÉPATIQUE');

    // Toxique selon gravité
    set('parace', (f > 0.5 ? (Math.round(50 + 200 * f)).toString() : '< 10'), 'TOXICOLOGIE SANGUINE');
    set('alc',    (f * 3.5).toFixed(2), 'TOXICOLOGIE SANGUINE');

    // Urinaire
    const tox = ['thc','coc','amp','benzo','opio'];
    const nb = Math.ceil(f * 3);
    shuffle(tox).slice(0, nb).forEach(t => set(t, 'POSITIF', 'TOXICOLOGIE URINAIRE'));

    // Gaz du sang
    set('ph',   (7.40 - 0.25 * f).toFixed(2), 'GAZ DU SANG');
    set('lact', (0.8  + 6    * f).toFixed(1), 'GAZ DU SANG');

    // HCG femme
    if (sexe === 'F') {
        const hcgVal = Math.random() > 0.9 ? Math.floor(Math.random()*2000+50) : Math.floor(Math.random()*4);
        set('hcg', hcgVal.toString(), 'ENDOCRINOLOGIE & FERTILITÉ');
    }

    fusionnerConclusion(
        `INTOXICATION AIGUË — ÉTAT ${grav >= 8 ? 'CRITIQUE' : grav >= 5 ? 'GRAVE' : 'MODÉRÉ'}.\n\n` +
        `BILAN GÉNÉRAL :\n- NFS : ${grav >= 6 ? 'Thrombopénie et anémie' : 'Légères perturbations hématologiques'}.\n` +
        `- Ionogramme perturbé. Hypoglycémie relative.\n\n` +
        `BILAN RÉNAL :\n- Créatinine ${(9+20*f).toFixed(1)} mg/L → ${grav >= 7 ? 'insuffisance rénale aiguë' : 'atteinte rénale débutante'}.\n\n` +
        `BILAN HÉPATIQUE :\n- ASAT/ALAT ${grav >= 6 ? 'très' : 'modérément'} élevées → cytolyse hépatique.\n\n` +
        `TOXICOLOGIE :\n- Paracétamol plasmatique, bilan alcoolémie effectués.\n- Screening urinaire positif (${nb} substance(s)).\n\n` +
        (sexe === 'F' ? `BÊTA-HCG : Dosé systématiquement.\n\n` : '') +
        `CONDUITE : Antidotes selon substances. Surveillance hépatique et rénale rapprochée. ${grav >= 8 ? 'USI requis.' : ''}`
    );
};

/* ── DIABÈTE ── */
window.lancerDiabete = function() {
    window.resetSeulementBio(false);
    const grav = parseInt(document.getElementById('gravity-range').value);
    const f = (grav - 1) / 9;

    // Glycémie +++
    set('gly',   (1.10 + 5.0 * f).toFixed(2), 'BIOCHIMIE MÉTABOLIQUE');
    set('ceton', (0.3  + 8.0 * f).toFixed(1), 'BIOCHIMIE MÉTABOLIQUE');

    // Ionogramme
    set('k',  (4.0 + 2.5 * f).toFixed(1), 'IONOGRAMME');
    set('na', (140 - 6   * f).toFixed(0), 'IONOGRAMME');

    // Rénal (déshydratation)
    set('uree', (0.30 + 0.80 * f).toFixed(2), 'BIOCHIMIE MÉTABOLIQUE');
    set('crea', (9.0  + 12   * f).toFixed(1), 'BIOCHIMIE MÉTABOLIQUE');

    // Gaz du sang si céto-acidose
    if (grav >= 5) {
        set('ph',   (7.40 - 0.20 * f).toFixed(2), 'GAZ DU SANG');
        set('pco2', (40   - 12   * f).toFixed(0), 'GAZ DU SANG');
        set('lact', (1.0  + 3.0  * f).toFixed(1), 'GAZ DU SANG');
    }

    const cetose = parseFloat((0.3 + 8.0 * f).toFixed(1)) > 0.6;
    fusionnerConclusion(
        `DÉCOMPENSATION DIABÉTIQUE — ${grav >= 8 ? 'COMA ACIDO-CÉTOSIQUE' : grav >= 5 ? 'ACIDOCÉTOSE' : 'HYPERGLYCÉMIE SIMPLE'}.\n\n` +
        `GLYCÉMIE : ${(1.10+5.0*f).toFixed(2)} g/L — hyperglycémie ${grav >= 7 ? 'maligne' : 'sévère'}.\n\n` +
        `CÉTONÉMIE : ${(0.3+8.0*f).toFixed(1)} mmol/L → ${cetose ? 'cétose confirmée ⚠️' : 'limite normale'}.\n\n` +
        `IONOGRAMME :\n- K+ ${(4.0+2.5*f).toFixed(1)} mmol/L → ${grav >= 7 ? 'HYPERKALIÉMIE URGENTE — ECG requis immédiatement' : 'surveillance ionique'}.\n\n` +
        `RÉNAL :\n- ${grav >= 6 ? 'Insuffisance rénale fonctionnelle par déshydratation' : 'Légère élévation de la créatinine'}.\n\n` +
        (grav >= 5 ? `GAZ DU SANG :\n- pH ${(7.40-0.20*f).toFixed(2)} — acidose métabolique. PCO2 basse (hyperventilation compensatrice).\n\n` : '') +
        `CONDUITE : Insulinothérapie IV, réhydratation, correction ionique. ${grav >= 8 ? 'Réanimation immédiate.' : ''}`
    );
};

/* ── INSUFFISANCE RÉNALE ── */
window.lancerRenale = function() {
    window.resetSeulementBio(false);
    const grav = parseInt(document.getElementById('gravity-range').value);
    const f = (grav - 1) / 9;

    // NFS — anémie si chronique
    set('hb',  (14 - 6.0 * f).toFixed(1), 'HÉMATOLOGIE (NFS)');
    set('gr',  (5.0 - 2.0 * f).toFixed(2), 'HÉMATOLOGIE (NFS)');

    // Urée / Créatinine +++
    set('uree', (0.30 + 2.0 * f).toFixed(2), 'BIOCHIMIE MÉTABOLIQUE');
    set('crea', (9.0  + 80  * f).toFixed(1), 'BIOCHIMIE MÉTABOLIQUE');

    // Ionogramme
    set('k',  (4.0 + 3.0 * f).toFixed(1), 'IONOGRAMME');
    set('na', (140 - 10  * f).toFixed(0), 'IONOGRAMME');

    // Gaz du sang — acidose métabolique
    set('ph',   (7.40 - 0.15 * f).toFixed(2), 'GAZ DU SANG');
    set('pco2', (40   - 8   * f).toFixed(0), 'GAZ DU SANG');

    // Examen urinaire
    set('prot_u', (0.05 + 3.0 * f).toFixed(2), 'BILAN RÉNAL');
    set('hem_u',  grav >= 5 ? (Math.round(5 + 50 * f)).toString() : '< 5', 'BILAN RÉNAL');
    set('leu_u',  grav >= 6 ? (Math.round(10 + 80 * f)).toString() : '< 10', 'BILAN RÉNAL');

    const chronic = grav >= 6;
    fusionnerConclusion(
        `INSUFFISANCE RÉNALE ${chronic ? 'CHRONIQUE DÉCOMPENSÉE' : 'AIGUË'} — STADE ${grav >= 8 ? 'TERMINAL' : grav >= 5 ? 'SÉVÈRE' : 'MODÉRÉ'}.\n\n` +
        `BILAN GÉNÉRAL :\n- Anémie ${grav >= 6 ? 'sévère (anémie rénale)' : 'modérée'} : Hb ${(14-6*f).toFixed(1)} g/dL.\n\n` +
        `FONCTION RÉNALE :\n- Urée ${(0.30+2.0*f).toFixed(2)} g/L — Créatinine ${(9+80*f).toFixed(1)} mg/L → ${grav >= 7 ? 'DFG effondré, dialyse à discuter' : 'altération sévère'}.\n\n` +
        `IONOGRAMME :\n- K+ ${(4.0+3.0*f).toFixed(1)} mmol/L → ${grav >= 7 ? '⚠️ HYPERKALIÉMIE URGENTE — ECG, résines échangeuses' : 'à surveiller'}.\n\n` +
        `GAZ DU SANG :\n- pH ${(7.40-0.15*f).toFixed(2)} — acidose métabolique par rétention d'acides.\n\n` +
        `EXAMEN URINAIRE :\n- Protéinurie ${(0.05+3.0*f).toFixed(2)} g/24h, ${grav >= 5 ? 'hématurie et leucocyturie présentes' : 'sédiment urinaire actif'}.\n\n` +
        `CONDUITE : Néphroprotection, correction ionique. ${grav >= 8 ? 'Discussion dialyse en urgence.' : ''}`
    );
};

/* ── GYNÉCO — Test grossesse ── */
window.lancerTestGrossesse = function() {
    window.resetSeulementBio(false);
    const sexe = document.getElementById('patientSex')?.value;
    if (sexe !== 'F') { alert("⛔ Ce test est réservé aux patientes de sexe féminin."); return; }

    const enceinte = Math.random() > 0.3;
    const hcg = enceinte ? Math.floor(Math.random()*5000+100) : Math.floor(Math.random()*4);
    set('hcg', hcg.toString(), 'ENDOCRINOLOGIE & FERTILITÉ');

    let sa = 4;
    if (hcg > 500) sa = 5;
    if (hcg > 2000) sa = 6;
    if (hcg > 10000) sa = 8;

    fusionnerConclusion(enceinte
        ? `TEST DE GROSSESSE : POSITIF ✓\n\nBêta-HCG : ${hcg} mUI/mL → Grossesse biochimique confirmée.\nTerme estimé : ${sa} SA.\n\nRECOMMANDATION : Échographie de datation requise.`
        : `TEST DE GROSSESSE : NÉGATIF\n\nBêta-HCG : < 5 mUI/mL (indétectable).\n\nPas de grossesse détectée à ce jour.`
    );
};

/* ── GYNÉCO — Fertilité ── */
window.lancerFertilite = function() {
    window.resetSeulementBio(false);
    const sexe = document.getElementById('patientSex')?.value;
    if (sexe !== 'F') { alert("⛔ Pour un homme, utilisez le Test de Stérilité (Spermogramme)."); return; }

    const fertile = Math.random() > 0.3;
    const amh = fertile ? (Math.random()*2+2).toFixed(2) : (Math.random()*0.8+0.1).toFixed(2);
    const fsh = fertile ? (Math.random()*4+4).toFixed(1)  : (Math.random()*5+10).toFixed(1);
    set('amh', amh, 'ENDOCRINOLOGIE & FERTILITÉ');
    set('fsh', fsh, 'ENDOCRINOLOGIE & FERTILITÉ');

    fusionnerConclusion(fertile
        ? `BILAN FERTILITÉ : RÉSERVE OVARIENNE SATISFAISANTE.\n\nAMH : ${amh} ng/mL ✓\nFSH : ${fsh} UI/L ✓\n\nPotentiel de fertilité optimal.`
        : `BILAN FERTILITÉ : RÉSERVE DIMINUÉE.\n\nAMH basse : ${amh} ng/mL\nFSH élevée : ${fsh} UI/L\n\nLe stock d'ovules est réduit. Consultation spécialisée recommandée.`
    );
};

/* ── GYNÉCO — Stérilité homme ── */
window.lancerSterilite = function() {
    window.resetSeulementBio(false);
    const sexe = document.getElementById('patientSex')?.value;
    if (sexe !== 'H') { alert("⛔ Pour une femme, utilisez le Bilan Fertilité."); return; }

    const rand = Math.random();
    let texte;
    if (rand < 0.2) {
        texte = `SPERMOGRAMME : AZOOSPERMIE.\n\nConcentration : 0 M/mL — Absence totale de spermatozoïdes.\nMobilité : 0%.\n\nVERDICT : Stérilité d'origine sécrétoire ou obstructive. Bilan hormonal complémentaire requis.`;
    } else if (rand < 0.5) {
        const conc = Math.floor(Math.random()*10+2);
        texte = `SPERMOGRAMME : HYPOFERTILITÉ MASCULINE.\n\nConcentration : ${conc} M/mL (Faible — norme > 15).\nMobilité : Réduite.\n\nOligospermie confirmée. Conception spontanée difficile.`;
    } else {
        const conc = Math.floor(Math.random()*60+20);
        texte = `SPERMOGRAMME : PARAMÈTRES NORMAUX.\n\nConcentration : ${conc} M/mL ✓\nMobilité : Excellente.\n\nAucune stérilité détectée.`;
    }
    fusionnerConclusion(texte);
};

window.lancerGroupageSanguin = function() {
        // ── Remplir le document-carte ──
    const sel = document.getElementById('patientBlood');
    const groupes = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
    let groupe = groupes[Math.floor(Math.random() * groupes.length)];
    const abo = groupe.replace('+','').replace('-','');  // ← ajouter
    const rhPos = groupe.includes('+');                  // ← ajouter
    if (sel) sel.value = groupe;


    if (window.up) window.up('d-groupe', groupe);

    // ── RAI aléatoire (5% positif) ──
    const raiPositif = Math.random() < 0.05;
    const raiTexte = raiPositif
        ? "POSITIF ⚠️ — Anticorps irréguliers détectés"
        : "NÉGATIF — Aucun anticorps irrégulier détecté";

    const nom    = document.getElementById('d-nom')?.innerText || '—';
    const ddn    = document.getElementById('d-ddn')?.innerText || '—';
    const medecin = document.getElementById('d-sig')?.innerText || '—';
    const dateAujourdhui = new Date().toLocaleDateString('fr-FR');

    const receveurTable = {
        "A+":  ["A+","A-","O+","O-"],
        "A-":  ["A-","O-"],
        "B+":  ["B+","B-","O+","O-"],
        "B-":  ["B-","O-"],
        "AB+": ["A+","A-","B+","B-","AB+","AB-","O+","O-"],
        "AB-": ["A-","B-","AB-","O-"],
        "O+":  ["O+","O-"],
        "O-":  ["O-"]
    };
    const donneurTable = {
        "A+":  ["A+","AB+"],
        "A-":  ["A+","A-","AB+","AB-"],
        "B+":  ["B+","AB+"],
        "B-":  ["B+","B-","AB+","AB-"],
        "AB+": ["AB+"],
        "AB-": ["AB+","AB-"],
        "O+":  ["A+","B+","AB+","O+"],
        "O-":  ["A+","A-","B+","B-","AB+","AB-","O+","O-"]
    };

    const labelSpecial = groupe === 'O-' ? '⭐ Donneur Universel'
                       : groupe === 'AB+' ? '⭐ Receveur Universel' : '';

    const _set = (id, val) => { const e = document.getElementById(id); if(e) e.innerText = val; };
    _set('carte-groupe-affiche',      groupe);
    _set('carte-compatibilite-label', labelSpecial);
    _set('carte-nom',                 nom);
    _set('carte-ddn',                 ddn);
    _set('carte-rai',                 raiTexte);
    _set('carte-date',                dateAujourdhui);
    _set('carte-receveur',            (receveurTable[groupe] || []).join(', '));
    _set('carte-donneur',             (donneurTable[groupe] || []).join(', '));
    _set('carte-medecin',             `Dr. ${medecin}`);

    // Couleur groupe selon Rh
    const gc = document.getElementById('carte-groupe-affiche');
    if (gc) gc.style.color = groupe.includes('-') ? '#1e3a5f' : '#dc2626';

    

    window.resetSeulementBio(false);

    

    // ── Compatibilité transfusionnelle ──
    const receveur = {
        "A+":  ["A+","A-","O+","O-"],
        "A-":  ["A-","O-"],
        "B+":  ["B+","B-","O+","O-"],
        "B-":  ["B-","O-"],
        "AB+": ["A+","A-","B+","B-","AB+","AB-","O+","O-"],
        "AB-": ["A-","B-","AB-","O-"],
        "O+":  ["O+","O-"],
        "O-":  ["O-"]
    };
    const donneur = {
        "A+":  ["A+","AB+"],
        "A-":  ["A+","A-","AB+","AB-"],
        "B+":  ["B+","AB+"],
        "B-":  ["B+","B-","AB+","AB-"],
        "AB+": ["AB+"],
        "AB-": ["AB+","AB-"],
        "O+":  ["A+","B+","AB+","O+"],
        "O-":  ["A+","A-","B+","B-","AB+","AB-","O+","O-"]
    };

    
    // ── Rhésus ──
    const rhesusTexte = rhPos
        ? "POSITIF (+) — Antigène D présent sur les globules rouges"
        : "NÉGATIF (−) — Antigène D absent. Risque d'allo-immunisation si exposition à du sang RH+";

    // ── Conclusion ──
    const concl =
`GROUPAGE SANGUIN — RÉSULTAT VALIDÉ

▶ GROUPE SANGUIN : ${groupe}

RHÉSUS : ${rhesusTexte}

RAI (Recherche d'Agglutinines Irrégulières) : ${raiTexte}

COMPATIBILITÉ TRANSFUSIONNELLE :
  → Peut recevoir : ${receveur[groupe].join(', ')}
  → Peut donner à : ${donneur[groupe].join(', ')}

CONCLUSION : ${raiPositif
    ? "Anticorps irréguliers détectés — Épreuve de compatibilité obligatoire avant toute transfusion. Contacter le médecin référent."
    : "Aucune contre-indication transfusionnelle détectée. Patient transfusable selon les protocoles standards."}

Carte de groupe sanguin à remettre au patient.`;

    fusionnerConclusion(concl);
};





// La fonction manquante qui permet de générer les mêmes probabilités avec le même numéro !
function seededRandom(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
}

window.lancerTestADN = function() {
    window.resetSeulementBio(false);
    const typeRecherche = document.querySelector('input[name="adn-type"]:checked')?.value || "Fratrie";
    let seedValue = document.getElementById('adn-seed').value;
    
    if (!seedValue) {
        seedValue = Math.floor(Math.random() * 9000 + 1000).toString();
        document.getElementById('adn-seed').value = seedValue;
    }

    const rng = seededRandom(seedValue);
    let statut = ""; let matchP = 0; let interp = ""; let col = ""; 
    
    if (rng < 0.45) {
        statut = "NÉGATIF"; col = "#dc2626"; // Rouge
        matchP = (seededRandom(seedValue + "p") * 0.1).toFixed(2); 
        interp = `Aucune similitude génétique. Lien biologique formellement exclu.`;
    } 
    else if (rng < 0.65) {
        statut = "DEMI-LIEN"; col = "#0284c7"; // Bleu OMC
        matchP = (seededRandom(seedValue + "p") * 10 + 42).toFixed(2); 
        interp = `Lien au 2ème degré confirmé. Les sujets partagent exactement un (1) parent biologique en commun.`;
    } 
    else {
        statut = "POSITIF"; col = "#16a34a"; // Vert
        matchP = (seededRandom(seedValue + "p") * 1.5 + 98.4).toFixed(2); 
        interp = `Lien de parenté au 1er degré biologiquement prouvé à quasi 100%.`;
    }

    const nomsLocus = ["D3S1358", "vWA", "D16S539", "TH01", "TPOX", "CSF1PO", "D7S820", "D13S317"];
    
    // Ajout des précisions entre parenthèses directement dans l'en-tête du tableau
    let tabHTML = `<table style="width:100%; border-collapse: collapse; font-size: 10px; margin: 0 0 4px 0;">
        <tr style="background: #0a192f; color: white;">
            <th style="padding: 3px; text-align: left;">LOCUS <span style="font-size:8px; font-weight:normal; color:#cbd5e1;">(Marqueur)</span></th>
            <th style="text-align: center;">A <span style="font-size:8px; font-weight:normal; color:#cbd5e1;">(Allèles)</span></th>
            <th style="text-align: center;">B <span style="font-size:8px; font-weight:normal; color:#cbd5e1;">(Allèles)</span></th>
            <th style="text-align: center;">RÉSULTAT</th>
        </tr>`;

    nomsLocus.forEach((locus) => {
        let vA1 = Math.floor(seededRandom(seedValue + locus + "1") * 15 + 10);
        let vA2 = Math.floor(seededRandom(seedValue + locus + "2") * 15 + 15);
        let vB1, vB2, res;
        if (statut === "POSITIF") { 
            vB1 = vA1; vB2 = vA2; res = "<b style='color:#16a34a'>MATCH</b>"; 
        }
        else if (statut === "DEMI-LIEN") { 
            vB1 = vA1; vB2 = Math.floor(seededRandom(seedValue + locus + "3") * 10 + 25); res = "<b style='color:#0284c7'>SEMI</b>"; 
        }
        else { 
            vB1 = Math.floor(seededRandom(seedValue + locus + "4") * 10 + 5); vB2 = Math.floor(seededRandom(seedValue + locus + "5") * 10 + 35); res = "<b style='color:#dc2626'>NON</b>"; 
        }
        tabHTML += `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 2px; font-weight: bold;">${locus}</td><td style="text-align: center;">${vA1}/${vA2}</td><td style="text-align: center;">${vB1}/${vB2}</td><td style="text-align: center; font-size: 9px;">${res}</td></tr>`;
    });
    tabHTML += `</table>`;

    const dConcl = document.getElementById('d-concl');
    if (dConcl) {
        dConcl.innerHTML = `
            <div style="background: #f1f5f9; padding: 4px 8px; border-left: 3px solid #0a192f; margin-bottom: 6px; font-size: 11px; display: flex; justify-content: space-between;">
                <b>EXPERTISE ADN #${seedValue}</b> <span style="text-transform: uppercase;">Type : ${typeRecherche}</span>
            </div>
            ${tabHTML}
            
            <div style="margin-top: 4px; padding: 6px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid ${col}; border-radius: 4px; display: flex; align-items: center; gap: 12px;">
                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; padding-right: 12px; border-right: 1px solid #cbd5e1; min-width: 80px;">
                    <span style="font-size: 8px; font-weight: 900; color: #64748b; letter-spacing: 1px; margin-bottom: 0px;">RÉSULTAT</span>
                    <b style="font-size: 13px; color: ${col}; line-height: 1; margin-top: -1px;">${statut}</b>
                </div>
                <div style="font-size: 10px; line-height: 1.3;">
                    <b style="font-size: 11px; color: #0f172a;">Probabilité : ${matchP}%</b><br>
                    <span style="color: #475569;">${interp}</span>
                </div>
            </div>
        `;
    }
};




// ==========================================
// 4. MODULE IST — POPUP COMPLÈTE
// ==========================================
window.ouvrirModuleIST = function() {
    const existant = document.getElementById('modal-ist');
    if (existant) { existant.style.display = 'flex'; return; }

    const modal = document.createElement('div');
    modal.id = 'modal-ist';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;display:flex;justify-content:center;align-items:flex-start;padding:40px 20px;overflow-y:auto;';

    modal.innerHTML = `
    <div style="background:#0f172a;border:1px solid #38bdf8;border-radius:12px;width:100%;max-width:600px;color:#e2e8f0;font-family:'Segoe UI',sans-serif;">
        
        <!-- HEADER -->
        <div style="background:linear-gradient(135deg,#0f2744,#1a1040);padding:20px 24px;border-radius:12px 12px 0 0;border-bottom:1px solid #1e3a5f;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <div style="font-size:11px;color:#38bdf8;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">Module Confidentiel</div>
                    <h2 style="margin:0;font-size:18px;color:white;">🔬 BILAN IST — DÉPISTAGE</h2>
                </div>
                <button onclick="document.getElementById('modal-ist').style.display='none'"
                    style="background:#1e293b;border:1px solid #334155;color:#94a3b8;width:32px;height:32px;border-radius:6px;cursor:pointer;font-size:16px;">✕</button>
            </div>
        </div>

        <div style="padding:24px;">
            <!-- ANAMNÈSE -->
            <div style="background:#111b2d;border:1px solid #1e3a5f;border-radius:8px;padding:16px;margin-bottom:16px;">
                <div style="font-size:10px;color:#38bdf8;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">📋 Anamnèse</div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
                    <div>
                        <label style="font-size:10px;color:#94a3b8;display:block;margin-bottom:4px;">Partenaires (3 dernières semaines)</label>
                        <select id="ist-partenaires" style="width:100%;background:#0a1324;border:1px solid #334155;color:white;padding:8px;border-radius:4px;font-size:12px;">
                            <option value="0">0 — Aucun</option>
                            <option value="1">1 partenaire</option>
                            <option value="2">2 partenaires</option>
                            <option value="3">3 partenaires</option>
                            <option value="4">4 ou plus</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:10px;color:#94a3b8;display:block;margin-bottom:4px;">Dernier rapport non protégé</label>
                        <select id="ist-protection" style="width:100%;background:#0a1324;border:1px solid #334155;color:white;padding:8px;border-radius:4px;font-size:12px;">
                            <option value="jamais">Jamais (protégé)</option>
                            <option value="recent">Il y a moins de 72h</option>
                            <option value="semaine">Il y a 1 semaine</option>
                            <option value="mois">Il y a plus d'1 mois</option>
                        </select>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
                    <div>
                        <label style="font-size:10px;color:#94a3b8;display:block;margin-bottom:4px;">Symptômes signalés</label>
                        <select id="ist-symptomes" style="width:100%;background:#0a1324;border:1px solid #334155;color:white;padding:8px;border-radius:4px;font-size:12px;">
                            <option value="aucun">Aucun symptôme</option>
                            <option value="brulures">Brûlures/douleurs</option>
                            <option value="ecoulement">Écoulement inhabituel</option>
                            <option value="lesions">Lésions/ulcérations</option>
                            <option value="multiples">Symptômes multiples</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:10px;color:#94a3b8;display:block;margin-bottom:4px;">Antécédent d'IST</label>
                        <select id="ist-antecedent" style="width:100%;background:#0a1324;border:1px solid #334155;color:white;padding:8px;border-radius:4px;font-size:12px;">
                            <option value="non">Non</option>
                            <option value="oui">Oui</option>
                            <option value="nsp">Ne sait pas</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style="font-size:10px;color:#94a3b8;display:block;margin-bottom:4px;">Usage de drogues IV ou substances</label>
                    <select id="ist-drogues" style="width:100%;background:#0a1324;border:1px solid #334155;color:white;padding:8px;border-radius:4px;font-size:12px;">
                        <option value="non">Non</option>
                        <option value="oui">Oui — usage de seringues partagées</option>
                        <option value="substances">Oui — substances sans seringue</option>
                    </select>
                </div>
            </div>

            <!-- SÉROLOGIES À TESTER -->
            <div style="background:#111b2d;border:1px solid #1e3a5f;border-radius:8px;padding:16px;margin-bottom:16px;">
                <div style="font-size:10px;color:#38bdf8;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">🧪 Sérologies prescrites</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                    ${['VIH (Ag/Ac)', 'Syphilis (TPHA/VDRL)', 'Hépatite B (Ag HBs)', 'Hépatite C (Ac HCV)',
                       'Chlamydia', 'Gonocoque', 'Herpès HSV2', 'Mycoplasme'].map(s => `
                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px;border-radius:4px;background:#0a1324;border:1px solid #1e3a5f;">
                        <input type="checkbox" class="ist-check" data-ist="${s}" checked
                               style="accent-color:#38bdf8;width:14px;height:14px;">
                        <span style="font-size:12px;color:#cbd5e1;">${s}</span>
                    </label>`).join('')}
                </div>
            </div>

            <!-- BOUTON GÉNÉRER -->
            <button onclick="window.genererResultatsIST()"
                style="width:100%;padding:14px;background:linear-gradient(135deg,#0ea5e9,#6366f1);border:none;border-radius:8px;color:white;font-weight:bold;font-size:14px;cursor:pointer;letter-spacing:1px;">
                🔬 GÉNÉRER LES RÉSULTATS
            </button>

            <!-- RÉSULTATS -->
            <div id="ist-resultats" style="display:none;margin-top:16px;background:#0a1324;border:1px solid #1e3a5f;border-radius:8px;padding:16px;">
                <div style="font-size:10px;color:#38bdf8;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">📄 Résultats</div>
                <div id="ist-resultats-body"></div>
                <div id="ist-conclusion" style="margin-top:12px;padding:12px;border-radius:6px;font-size:12px;line-height:1.6;"></div>
                <button onclick="window.appliquerISTauLabo()"
                    style="width:100%;margin-top:12px;padding:10px;background:#10b981;border:none;border-radius:6px;color:white;font-weight:bold;cursor:pointer;">
                    ✅ APPLIQUER AU RAPPORT LABO
                </button>
            </div>
        </div>
    </div>`;

    document.body.appendChild(modal);
};

// Résultats IST stockés pour injection dans le rapport
let _istResultats = [];
let _istConclusion = '';

window.genererResultatsIST = function() {
    const partenaires = parseInt(document.getElementById('ist-partenaires').value);
    const protection  = document.getElementById('ist-protection').value;
    const symptomes   = document.getElementById('ist-symptomes').value;
    const antecedent  = document.getElementById('ist-antecedent').value;
    const drogues     = document.getElementById('ist-drogues').value;

    // Calcul du risque global
    let risque = 0;
    risque += partenaires * 0.12;
    if (protection === 'recent')  risque += 0.25;
    if (protection === 'semaine') risque += 0.20;
    if (protection === 'mois')    risque += 0.10;
    if (symptomes === 'multiples') risque += 0.35;
    if (symptomes !== 'aucun')     risque += 0.15;
    if (antecedent === 'oui')      risque += 0.20;
    if (drogues === 'oui')         risque += 0.30;
    risque = Math.min(risque, 0.90);

    const checks = [...document.querySelectorAll('.ist-check:checked')].map(c => c.dataset.ist);
    _istResultats = [];
    let nbPositifs = 0;

    const body = document.getElementById('ist-resultats-body');
    body.innerHTML = '';

    checks.forEach(test => {
        // Probabilité individuelle par IST
        const probas = {
            'VIH (Ag/Ac)': risque * 0.4,
            'Syphilis (TPHA/VDRL)': risque * 0.6,
            'Hépatite B (Ag HBs)': risque * 0.5,
            'Hépatite C (Ac HCV)': (drogues === 'oui' ? risque * 1.2 : risque * 0.3),
            'Chlamydia': risque * 0.8,
            'Gonocoque': risque * 0.65,
            'Herpès HSV2': risque * 0.55,
            'Mycoplasme': risque * 0.60,
        };
        const positif = Math.random() < (probas[test] || risque * 0.5);
        if (positif) nbPositifs++;

        const color = positif ? '#ef4444' : '#22c55e';
        const label = positif ? '⚠️ POSITIF' : '✓ NÉGATIF';

        _istResultats.push({ test, positif });

        body.innerHTML += `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 10px;border-radius:4px;margin-bottom:4px;background:${positif ? 'rgba(239,68,68,.08)' : 'rgba(34,197,94,.05)'};border:1px solid ${positif ? 'rgba(239,68,68,.2)' : 'rgba(34,197,94,.1)'};">
                <span style="font-size:12px;color:#cbd5e1;">${test}</span>
                <span style="font-size:11px;font-weight:bold;color:${color};">${label}</span>
            </div>`;
    });

    // Conclusion
    const concDiv = document.getElementById('ist-conclusion');
    if (nbPositifs === 0) {
        _istConclusion = `Bilan IST complet NÉGATIF. Aucune infection sexuellement transmissible détectée ce jour.\n\nRECOMMANDATION : Dépistage régulier recommandé tous les 3 à 6 mois selon l'activité sexuelle.${protection === 'recent' ? '\n\nNB : Rapport non protégé récent (< 72h) — Discussion PrEP/PEP possible.' : ''}`;
        concDiv.style.cssText = 'margin-top:12px;padding:12px;border-radius:6px;font-size:12px;line-height:1.6;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);color:#86efac;';
    } else {
        _istConclusion = `BILAN IST : ${nbPositifs} infection(s) détectée(s).\n\nPrise en charge immédiate requise. Traitement adapté à initier selon les résultats.\nDépistage et traitement du/des partenaire(s) nécessaire.\nDeclaration obligatoire pour VIH et syphilis si positifs.`;
        concDiv.style.cssText = 'margin-top:12px;padding:12px;border-radius:6px;font-size:12px;line-height:1.6;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);color:#fca5a5;';
    }
    concDiv.textContent = _istConclusion;

    document.getElementById('ist-resultats').style.display = 'block';
};

window.appliquerISTauLabo = function() {
    // Injecter dans la conclusion du rapport
    const concluArea = document.getElementById('auto-concl-area');
    const concluDisplay = document.getElementById('d-concl');
    const texte = `BILAN IST :\n${_istResultats.map(r => `- ${r.test} : ${r.positif ? 'POSITIF ⚠️' : 'Négatif'}`).join('\n')}\n\n${_istConclusion}`;
    if (concluArea) concluArea.value = texte;
    if (concluDisplay) concluDisplay.innerText = texte;

    document.getElementById('modal-ist').style.display = 'none';
    alert('✅ Résultats IST appliqués au rapport !');
};

// ==========================================
// 5. FONCTIONS PUBLIQUES
// ==========================================

window.res = function(id, val, cat) {
    const cid = cleanId(cat);
    const row = document.getElementById('row-' + id);
    const valSpan = document.getElementById('val-' + id);
    const section = document.getElementById('sec-' + cid);

    if (valSpan) {
        valSpan.innerText = val;
        const item = Object.values(database).flat().find(i => i.id === id);
        if (item && val && item.norm.includes('-')) {
            try {
                const [minS, maxS] = item.norm.split('-');
                const min = parseFloat(minS), max = parseFloat(maxS), v = parseFloat(val.replace(',', '.'));
                if (!isNaN(v) && !isNaN(min) && !isNaN(max))
                    valSpan.style.color = (v < min || v > max) ? '#ef4444' : '#22c55e';
            } catch(e) {}
        }
        // Valeurs textuelles
        if (val === 'POSITIF' || val === 'Positif') valSpan.style.color = '#ef4444';
        if (val === 'Négatif' || val === 'NÉGATIF') valSpan.style.color = '#22c55e';
    }

    if (val && val.trim() !== '') {
        if (row)    row.classList.add('active');
        if (section) section.classList.add('active');
    } else {
        if (row)    row.classList.remove('active');
        if (section && !section.querySelectorAll('.row.active').length)
            section.classList.remove('active');
    }
    updateLiveQRCode();
};

function set(id, val, cat) { window.res(id, val, cat); }

window.switchMode = function(mode) {
    document.getElementById('panel-auto').style.display   = mode === 'auto'   ? 'block' : 'none';
    document.getElementById('panel-manual').style.display = mode === 'manual' ? 'block' : 'none';
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(mode === 'auto' ? 'btn-auto' : 'btn-manual').classList.add('active');
};

window.determinerGroupeAleatoire = function() {
    const g = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
    const sel = document.getElementById('patientBlood');
    if (sel) { sel.value = g[Math.floor(Math.random()*g.length)]; if (window.up) window.up('d-groupe', sel.value); }
};

window.setAutoDate = function() {
    const today = new Date();
    const input = document.getElementById('date-prel-input');
    if (input) input.valueAsDate = today;
    const el = document.getElementById('d-date-prel');
    if (el) el.innerText = today.toLocaleDateString('fr-FR', {year:'numeric',month:'long',day:'numeric'});
};

window.resetSeulementBio = function(needConfirm = true) {
    if (needConfirm && !confirm("Vider les analyses ?")) return;
    document.querySelectorAll('.analysis-input').forEach(el => el.value = "");
    document.querySelectorAll('.row, .section').forEach(el => el.classList.remove('active'));
    const a = document.getElementById('auto-concl-area'), d = document.getElementById('d-concl');
    if (a) a.value = "";
    if (d) d.innerText = "...";
    updateLiveQRCode();
};

window.updateSexe = function(val) {
    const el = document.getElementById('d-sexe');
    if (el) el.innerText = val === 'F' ? 'Femme' : val === 'H' ? 'Homme' : 'Autre';
};

// ==========================================
// 6. FONCTIONS INTERNES
// ==========================================

function fusionnerConclusion(texte) {
    const a = document.getElementById('auto-concl-area'), d = document.getElementById('d-concl');
    if (a) a.value = texte;
    if (d) d.innerText = texte;
}

function updateLiveQRCode() {
    const nom  = document.getElementById('d-nom')?.innerText || 'Anonyme';
    const date = document.getElementById('d-date-prel')?.innerText || '';
    const qr   = document.getElementById('qr-ref');
    if (qr) qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`OMC-LAB|${nom}|${date}`)}`;
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
