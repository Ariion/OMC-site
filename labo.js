/* ============================================================
   LABORATOIRE OMC — VERSION MÉDICALE COMPLÈTE
   Scénarios cliniques réels + Module IST
   ============================================================ */

// ==========================================
// 1. BASE DE DONNÉES MÉDICALE COMPLÈTE
// ==========================================
const database = {
    "HÉMATOLOGIE — Analyse du Sang": [
        { id: "gb",      label: "Leucocytes (globules blancs — défense)",  unit: "G/L",   norm: "4.0 - 10.0" },
        { id: "gr",      label: "Globules Rouges (transport oxygène)",      unit: "T/L",   norm: "4.5 - 5.5" },
        { id: "hb",      label: "Hémoglobine (taux d'oxygène dans le sang)",unit: "g/dL",  norm: "13.0 - 17.0" },
        { id: "ht",      label: "Hématocrite (% de sang = globules rouges)",unit: "%",     norm: "40 - 52" },
        { id: "pla",     label: "Plaquettes (cicatrisation / coagulation)", unit: "G/L",   norm: "150 - 400" },
        { id: "vgm",     label: "VGM (taille des globules rouges)",         unit: "fL",    norm: "80 - 100" },
        { id: "tcmh",    label: "TCMH (teneur en hémoglobine / globule)",   unit: "pg",    norm: "27 - 32" },
        { id: "poly_n",  label: "Polynucléaires (soldats anti-infection)",  unit: "%",     norm: "40 - 75" },
        { id: "lympho",  label: "Lymphocytes (mémoire immunitaire)",        unit: "%",     norm: "20 - 45" }
    ],
    "COAGULATION — Capacité à Stopper le Saignement": [
        { id: "tp",      label: "TP — Taux de Prothrombine (vitesse de coag.)",  unit: "%",   norm: "70 - 100" },
        { id: "inr",     label: "INR (risque hémorragique — 1 = normal)",         unit: "-",   norm: "0.8 - 1.2" },
        { id: "tca",     label: "TCA (temps pour former un caillot)",             unit: "sec", norm: "24 - 38" },
        { id: "fibri",   label: "Fibrinogène (protéine clé du caillot sanguin)",  unit: "g/L", norm: "2.0 - 4.0" }
    ],
    "BIOCHIMIE — Métabolisme & Organes": [
        { id: "gly",     label: "Glycémie (taux de sucre dans le sang)",          unit: "g/L",   norm: "0.70 - 1.10" },
        { id: "ceton",   label: "Cétonémie (corps cétoniques — signe de diabète)",unit: "mmol/L",norm: "0 - 0.6" },
        { id: "uree",    label: "Urée (déchet filtré par les reins)",             unit: "g/L",   norm: "0.15 - 0.45" },
        { id: "crea",    label: "Créatinine (état des reins)",                    unit: "mg/L",  norm: "7.0 - 12.0" },
        { id: "crp",     label: "CRP (marqueur d'inflammation / infection)",      unit: "mg/L",  norm: "0 - 5.0" },
        { id: "cpk",     label: "CPK (destruction musculaire — écrasement)",      unit: "UI/L",  norm: "30 - 200" }
    ],
    "IONOGRAMME — Sels Minéraux du Sang": [
        { id: "na",      label: "Sodium / Na+ (équilibre eau-sel)",               unit: "mmol/L",norm: "135 - 145" },
        { id: "k",       label: "Potassium / K+ (rythme cardiaque ⚠️)",           unit: "mmol/L",norm: "3.5 - 5.0" },
        { id: "cl",      label: "Chlore / Cl- (équilibre acide-base)",            unit: "mmol/L",norm: "95 - 105" },
        { id: "ca",      label: "Calcium (os, nerfs, muscles)",                   unit: "mg/L",  norm: "85 - 105" }
    ],
    "BILAN RÉNAL — Analyse des Urines": [
        { id: "prot_u",  label: "Protéinurie (protéines dans les urines — anormal)",unit: "g/24h", norm: "< 0.15" },
        { id: "hem_u",   label: "Hématurie (sang dans les urines)",                 unit: "ER/mL", norm: "< 5" },
        { id: "leu_u",   label: "Leucocyturie (globules blancs dans les urines)",   unit: "EB/mL", norm: "< 10" }
    ],
    "BILAN HÉPATIQUE — État du Foie": [
        { id: "asat",    label: "ASAT / TGO (enzyme hépatique — lésion foie/muscle)",unit: "UI/L", norm: "0 - 35" },
        { id: "alat",    label: "ALAT / TGP (enzyme spécifique du foie)",            unit: "UI/L", norm: "0 - 45" },
        { id: "ggt",     label: "Gamma-GT (alcool / médicaments / foie)",            unit: "UI/L", norm: "0 - 55" },
        { id: "bili_t",  label: "Bilirubine (déchet biliaire — jaunisse si élevé)",  unit: "mg/L", norm: "0 - 12" }
    ],
    "MARQUEURS CARDIAQUES — Cœur & Transfusion": [
        { id: "tropo",   label: "Troponine I (lésion cardiaque — infarctus)",         unit: "ng/L",  norm: "0 - 15" },
        { id: "bnp",     label: "BNP (insuffisance cardiaque — cœur fatigué)",        unit: "pg/mL", norm: "0 - 100" },
        { id: "rai",     label: "RAI (anticorps anti-sang étranger — avant transfusion)",unit: "-",  norm: "Négatif" }
    ],
    "GAZ DU SANG — Respiration & Acidité": [
        { id: "ph",      label: "pH Artériel (acidité du sang — 7.40 = normal)",      unit: "",      norm: "7.38 - 7.42" },
        { id: "pco2",    label: "PCO2 (CO2 dans le sang — respiration)",              unit: "mmHg",  norm: "35 - 45" },
        { id: "po2",     label: "PO2 (oxygène dans le sang)",                         unit: "mmHg",  norm: "80 - 100" },
        { id: "lact",    label: "Lactates (manque d'oxygène dans les tissus — choc)", unit: "mmol/L",norm: "0.5 - 2.0" }
    ],
    "TOXICOLOGIE SANGUINE — Substances dans le Sang": [
        { id: "alc",     label: "Alcoolémie (taux d'alcool dans le sang)",            unit: "g/L",   norm: "0 - 0.10" },
        { id: "parace",  label: "Paracétamol (Doliprane — toxique si surdosé)",       unit: "mg/L",  norm: "< 10" },
        { id: "lithium", label: "Lithium (médicament psychiatrique)",                 unit: "mmol/L",norm: "0.6 - 1.2" }
    ],
    "TOXICOLOGIE URINAIRE — Dépistage de Drogues": [
        { id: "thc",     label: "Cannabis / THC",     unit: "-", norm: "Négatif" },
        { id: "coc",     label: "Cocaïne",            unit: "-", norm: "Négatif" },
        { id: "amp",     label: "Amphétamines / Speed",unit: "-", norm: "Négatif" },
        { id: "benzo",   label: "Benzodiazépines (Valium, Xanax...)", unit: "-", norm: "Négatif" },
        { id: "opio",    label: "Opioïdes (Héroïne, Morphine...)",    unit: "-", norm: "Négatif" }
    ],
    "HORMONES & FERTILITÉ": [
        { id: "tsh",     label: "TSH (hormone thyroïde — métabolisme)",               unit: "mUI/L", norm: "0.4 - 4.0" },
        { id: "hcg",     label: "Bêta-HCG (hormone de grossesse)",                   unit: "mUI/mL",norm: "< 5" },
        { id: "amh",     label: "AMH (réserve d'ovules — fertilité féminine)",        unit: "ng/mL", norm: "2.0 - 6.8" },
        { id: "fsh",     label: "FSH (hormone stimulant les ovaires/testicules)",     unit: "UI/L",  norm: "3.5 - 12.5" },
        { id: "lh",      label: "LH (déclenche l'ovulation / production testostérone)",unit: "UI/L", norm: "2.4 - 12.6" },
        { id: "prolac",  label: "Prolactine (hormone de lactation)",                  unit: "ng/mL", norm: "4.8 - 23.3" }
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
    set('hb',  (15.0 - 8.0 * f).toFixed(1),    'HÉMATOLOGIE — Analyse du Sang');
    set('gr',  (5.0  - 2.5 * f).toFixed(2),    'HÉMATOLOGIE — Analyse du Sang');
    set('ht',  (45   - 20  * f).toFixed(0),    'HÉMATOLOGIE — Analyse du Sang');
    set('gb',  (7.0  + 8.0 * f).toFixed(1),    'HÉMATOLOGIE — Analyse du Sang');
    set('pla', (280  - 180 * f).toFixed(0),    'HÉMATOLOGIE — Analyse du Sang');

    // Coagulation
    set('tp',    (95  - 55 * f).toFixed(0),  'COAGULATION — Capacité à Stopper le Saignement');
    set('inr',   (1.0 + 3.0 * f).toFixed(1), 'COAGULATION — Capacité à Stopper le Saignement');
    set('tca',   (30  + 40 * f).toFixed(0),  'COAGULATION — Capacité à Stopper le Saignement');
    set('fibri', (3.5 - 2.5 * f).toFixed(1), 'COAGULATION — Capacité à Stopper le Saignement');

    // Gaz du sang — acidose
    set('ph',   (7.40 - 0.18 * f).toFixed(2), 'GAZ DU SANG — Respiration & Acidité');
    set('pco2', (40   + 5   * f).toFixed(0),  'GAZ DU SANG — Respiration & Acidité');
    set('lact', (1.0  + 9.0 * f).toFixed(1),  'GAZ DU SANG — Respiration & Acidité');

    // Ionogramme
    set('na', (140 - 8  * f).toFixed(0), 'IONOGRAMME — Sels Minéraux du Sang');
    set('k',  (4.0 + 2.0 * f).toFixed(1), 'IONOGRAMME — Sels Minéraux du Sang');

    // Rénal
    set('uree', (0.30 + 0.80 * f).toFixed(2), 'BIOCHIMIE — Métabolisme & Organes');
    set('crea', (9.0  + 15  * f).toFixed(1),  'BIOCHIMIE — Métabolisme & Organes');

    // Écrasement → CPK très élevée
    if (ecrasement) {
        set('cpk', (200 + Math.round(15000 * f)).toString(), 'BIOCHIMIE — Métabolisme & Organes');
    }

    // Thoracique → Troponine
    if (thoracique) {
        set('tropo', (15 + Math.round(2000 * f)).toString(), 'MARQUEURS CARDIAQUES — Cœur & Transfusion');
    }

    // Opération → Groupe + RAI
    if (operation) {
        set('rai', 'Négatif', 'MARQUEURS CARDIAQUES — Cœur & Transfusion');
    }

    const sev = grav >= 8 ? 'CRITIQUE' : grav >= 5 ? 'GRAVE' : 'MODÉRÉ';
    let extras = [];
    if (ecrasement)  extras.push("- CPK très élevée → destruction musculaire importante (écrasement). Risque de blocage des reins.");
    if (thoracique)  extras.push("- Troponine élevée → le cœur a été touché par le choc. Surveillance cardiaque requise.");
    if (operation)   extras.push("- Test de compatibilité transfusionnelle (RAI) : négatif. Transfusion possible si besoin.");

    fusionnerConclusion(
        `TRAUMATISME — ÉTAT ${sev}.\n\n` +
        `SAIGNEMENT INTERNE :\n- Manque de sang ${grav >= 7 ? 'sévère' : 'modéré'} détecté (Hémoglobine : ${(15.0 - 8.0*f).toFixed(1)} g/dL — norme : 13-17).\n` +
        `- Plaquettes basses (${(280-180*f).toFixed(0)} G/L) → le corps a du mal à stopper le saignement.\n\n` +
        `CAPACITÉ À COAGULER :\n- Tests de coagulation perturbés → le sang coagule mal, risque de saignement continu.\n\n` +
        `ACIDITÉ DU SANG (Gaz du sang) :\n- pH ${(7.40-0.18*f).toFixed(2)} → ${grav >= 7 ? 'le sang est trop acide, signe d\'urgence vitale' : 'légère acidité, à surveiller'}.\n\n` +
        `APPORT EN OXYGÈNE :\n- Lactates ${(1.0+9.0*f).toFixed(1)} mmol/L → ${grav >= 7 ? 'les organes manquent d\'oxygène (choc hémorragique)' : 'légère souffrance tissulaire'}.\n\n` +
        (extras.length ? extras.join('\n') + '\n\n' : '') +
        `À FAIRE : ${grav >= 7 ? 'Transfusion sanguine en urgence. Intervention chirurgicale pour stopper l\'hémorragie.' : 'Perfusion (remplissage), surveillance constante des constantes vitales.'}`
    );
};

/* ── PLAIE PAR BALLE ── */
window.lancerPlaieBalle = function() {
    window.resetSeulementBio(false);
    const grav = parseInt(document.getElementById('gravity-range').value);
    const f = (grav - 1) / 9;
    const sexe = document.getElementById('patientSex')?.value;

    // NFS
    set('hb',  (15.0 - 9.0 * f).toFixed(1), 'HÉMATOLOGIE — Analyse du Sang');
    set('gr',  (5.0  - 2.8 * f).toFixed(2), 'HÉMATOLOGIE — Analyse du Sang');
    set('pla', (270  - 170 * f).toFixed(0), 'HÉMATOLOGIE — Analyse du Sang');
    set('gb',  (8.0  + 10  * f).toFixed(1), 'HÉMATOLOGIE — Analyse du Sang');

    // Coagulation
    set('tp',    (95  - 60 * f).toFixed(0),  'COAGULATION — Capacité à Stopper le Saignement');
    set('inr',   (1.0 + 4.0 * f).toFixed(1), 'COAGULATION — Capacité à Stopper le Saignement');
    set('tca',   (30  + 50 * f).toFixed(0),  'COAGULATION — Capacité à Stopper le Saignement');
    set('fibri', (3.5 - 3.0 * f).toFixed(1), 'COAGULATION — Capacité à Stopper le Saignement');

    // Bilan transfusionnel
    set('rai', 'Négatif', 'MARQUEURS CARDIAQUES — Cœur & Transfusion');

    // Facteurs de gravité
    set('ph',   (7.40 - 0.20 * f).toFixed(2), 'GAZ DU SANG — Respiration & Acidité');
    set('lact', (1.0  + 11   * f).toFixed(1), 'GAZ DU SANG — Respiration & Acidité');

    // Grossesse si femme
    if (sexe === 'F') {
        const enceinte = Math.random() > 0.85;
        const hcgVal = enceinte ? Math.floor(Math.random() * 3000 + 50) : Math.floor(Math.random() * 4);
        set('hcg', hcgVal.toString(), 'HORMONES & FERTILITÉ');
    }

    fusionnerConclusion(
        `PLAIE PAR BALLE — ÉTAT ${grav >= 8 ? 'CRITIQUE' : grav >= 5 ? 'GRAVE' : 'MODÉRÉ'}.\n\n` +
        `PERTE DE SANG :\n- Manque de sang ${grav >= 7 ? 'sévère' : 'important'} (Hémoglobine : ${(15.0-9.0*f).toFixed(1)} g/dL).\n` +
        `- Plaquettes basses et coagulation perturbée → le sang ne coagule plus correctement.\n\n` +
        `COMPATIBILITÉ POUR TRANSFUSION :\n- Test de compatibilité (RAI) : négatif → transfusion sanguine ${grav >= 7 ? 'urgente' : 'possible si besoin'}.\n\n` +
        `ÉTAT GÉNÉRAL :\n- Lactates ${(1.0+11*f).toFixed(1)} mmol/L → ${grav >= 7 ? 'choc hémorragique : les organes manquent de sang' : 'début de manque d\'oxygène dans les tissus'}.\n` +
        `- pH sanguin ${(7.40-0.20*f).toFixed(2)} → ${grav >= 7 ? 'sang trop acide, situation critique' : 'légère acidité compensée'}.\n\n` +
        (sexe === 'F' ? `TEST DE GROSSESSE (HCG) : réalisé systématiquement chez les femmes en âge de procréer.\n\n` : '') +
        `À FAIRE : Chirurgie d'urgence pour stopper le saignement. ${grav >= 7 ? 'Transfusion massive à initier immédiatement.' : 'Surveiller l\'évolution et préparer une transfusion.'}`
    );
};

/* ── OVERDOSE ── */
window.lancerOverdose = function() {
    window.resetSeulementBio(false);
    const grav = parseInt(document.getElementById('gravity-range').value);
    const f = (grav - 1) / 9;
    const sexe = document.getElementById('patientSex')?.value;

    // NFS
    set('gb',  (7.0 + 5.0 * f).toFixed(1), 'HÉMATOLOGIE — Analyse du Sang');
    set('hb',  (14  - 4.0 * f).toFixed(1), 'HÉMATOLOGIE — Analyse du Sang');
    set('pla', (250 - 100 * f).toFixed(0), 'HÉMATOLOGIE — Analyse du Sang');

    // Ionogramme
    set('na', (140 - 10 * f).toFixed(0), 'IONOGRAMME — Sels Minéraux du Sang');
    set('k',  (4.0 + 1.5 * f).toFixed(1), 'IONOGRAMME — Sels Minéraux du Sang');

    // Glycémie
    set('gly', (0.90 - 0.30 * f).toFixed(2), 'BIOCHIMIE — Métabolisme & Organes');

    // Rénal
    set('uree', (0.30 + 0.60 * f).toFixed(2), 'BIOCHIMIE — Métabolisme & Organes');
    set('crea', (9.0  + 20   * f).toFixed(1), 'BIOCHIMIE — Métabolisme & Organes');

    // Hépatique
    set('asat', (25 + Math.round(800 * f)).toString(), 'BILAN HÉPATIQUE — État du Foie');
    set('alat', (30 + Math.round(600 * f)).toString(), 'BILAN HÉPATIQUE — État du Foie');

    // Toxique selon gravité
    set('parace', (f > 0.5 ? (Math.round(50 + 200 * f)).toString() : '< 10'), 'TOXICOLOGIE SANGUINE — Substances dans le Sang');
    set('alc',    (f * 3.5).toFixed(2), 'TOXICOLOGIE SANGUINE — Substances dans le Sang');

    // Urinaire
    const tox = ['thc','coc','amp','benzo','opio'];
    const nb = Math.ceil(f * 3);
    shuffle(tox).slice(0, nb).forEach(t => set(t, 'POSITIF', 'TOXICOLOGIE URINAIRE — Dépistage de Drogues'));

    // Gaz du sang
    set('ph',   (7.40 - 0.25 * f).toFixed(2), 'GAZ DU SANG — Respiration & Acidité');
    set('lact', (0.8  + 6    * f).toFixed(1), 'GAZ DU SANG — Respiration & Acidité');

    // HCG femme
    if (sexe === 'F') {
        const hcgVal = Math.random() > 0.9 ? Math.floor(Math.random()*2000+50) : Math.floor(Math.random()*4);
        set('hcg', hcgVal.toString(), 'HORMONES & FERTILITÉ');
    }

    fusionnerConclusion(
        `INTOXICATION AIGUË — ÉTAT ${grav >= 8 ? 'CRITIQUE' : grav >= 5 ? 'GRAVE' : 'MODÉRÉ'}.\n\n` +
        `ANALYSE DU SANG :\n- ${grav >= 6 ? 'Manque de plaquettes et globules rouges (anémie)' : 'Légères perturbations de la formule sanguine'}.\n` +
        `- Sels minéraux déséquilibrés. Taux de sucre bas.\n\n` +
        `ÉTAT DES REINS :\n- Créatinine ${(9+20*f).toFixed(1)} mg/L → ${grav >= 7 ? 'les reins sont en train de lâcher (insuffisance rénale aiguë)' : 'les reins commencent à souffrir'}.\n\n` +
        `ÉTAT DU FOIE :\n- Enzymes hépatiques ${grav >= 6 ? 'très' : 'modérément'} élevées → le foie est endommagé par les substances ingérées.\n\n` +
        `SUBSTANCES DÉTECTÉES :\n- Dosage du Paracétamol et de l'alcool effectué dans le sang.\n- Dépistage urinaire : ${nb} substance(s) détectée(s).\n\n` +
        (sexe === 'F' ? `TEST DE GROSSESSE (HCG) : réalisé systématiquement.\n\n` : '') +
        `À FAIRE : Traitement selon les substances. Surveiller foie et reins en continu. ${grav >= 8 ? 'Réanimation nécessaire.' : ''}`
    );
};

/* ── DIABÈTE ── */
window.lancerDiabete = function() {
    window.resetSeulementBio(false);
    const grav = parseInt(document.getElementById('gravity-range').value);
    const f = (grav - 1) / 9;

    // Glycémie +++
    set('gly',   (1.10 + 5.0 * f).toFixed(2), 'BIOCHIMIE — Métabolisme & Organes');
    set('ceton', (0.3  + 8.0 * f).toFixed(1), 'BIOCHIMIE — Métabolisme & Organes');

    // Ionogramme
    set('k',  (4.0 + 2.5 * f).toFixed(1), 'IONOGRAMME — Sels Minéraux du Sang');
    set('na', (140 - 6   * f).toFixed(0), 'IONOGRAMME — Sels Minéraux du Sang');

    // Rénal (déshydratation)
    set('uree', (0.30 + 0.80 * f).toFixed(2), 'BIOCHIMIE — Métabolisme & Organes');
    set('crea', (9.0  + 12   * f).toFixed(1), 'BIOCHIMIE — Métabolisme & Organes');

    // Gaz du sang si céto-acidose
    if (grav >= 5) {
        set('ph',   (7.40 - 0.20 * f).toFixed(2), 'GAZ DU SANG — Respiration & Acidité');
        set('pco2', (40   - 12   * f).toFixed(0), 'GAZ DU SANG — Respiration & Acidité');
        set('lact', (1.0  + 3.0  * f).toFixed(1), 'GAZ DU SANG — Respiration & Acidité');
    }

    const cetose = parseFloat((0.3 + 8.0 * f).toFixed(1)) > 0.6;
    fusionnerConclusion(
        `CRISE DIABÉTIQUE — ${grav >= 8 ? 'COMA SUCRÉ (ACIDO-CÉTOSIQUE)' : grav >= 5 ? 'ACIDOCÉTOSE (SUCRE + CORPS CÉTONIQUES)' : 'HYPERGLYCÉMIE SIMPLE (TROP DE SUCRE)'}.\n\n` +
        `TAUX DE SUCRE : ${(1.10+5.0*f).toFixed(2)} g/L → ${grav >= 7 ? 'dangereusement élevé' : 'trop élevé'}. Norme : 0.70 - 1.10 g/L.\n\n` +
        `CORPS CÉTONIQUES : ${(0.3+8.0*f).toFixed(1)} mmol/L → ${cetose ? '⚠️ Présents ! Le corps brûle ses graisses faute de sucre utilisable (signe de diabète décompensé).' : 'Taux limite, à surveiller'}.\n\n` +
        `POTASSIUM (K+) : ${(4.0+2.5*f).toFixed(1)} mmol/L → ${grav >= 7 ? '⚠️ TROP ÉLEVÉ — risque d\'arrêt cardiaque. Électrocardiogramme immédiat requis !' : 'légèrement élevé, à surveiller'}.\n\n` +
        `REINS : ${grav >= 6 ? 'Les reins souffrent de la déshydratation liée au diabète.' : 'Légère hausse de la créatinine — reins légèrement sollicités.'}\n\n` +
        (grav >= 5 ? `ACIDITÉ DU SANG : pH ${(7.40-0.20*f).toFixed(2)} → sang trop acide. Le corps essaie de compenser (respiration rapide).\n\n` : '') +
        `À FAIRE : Injection d'insuline, hydratation en urgence, surveillance du potassium. ${grav >= 8 ? 'Hospitalisation en réanimation.' : ''}`
    );
};

/* ── INSUFFISANCE RÉNALE ── */
window.lancerRenale = function() {
    window.resetSeulementBio(false);
    const grav = parseInt(document.getElementById('gravity-range').value);
    const f = (grav - 1) / 9;

    // NFS — anémie si chronique
    set('hb',  (14 - 6.0 * f).toFixed(1), 'HÉMATOLOGIE — Analyse du Sang');
    set('gr',  (5.0 - 2.0 * f).toFixed(2), 'HÉMATOLOGIE — Analyse du Sang');

    // Urée / Créatinine +++
    set('uree', (0.30 + 2.0 * f).toFixed(2), 'BIOCHIMIE — Métabolisme & Organes');
    set('crea', (9.0  + 80  * f).toFixed(1), 'BIOCHIMIE — Métabolisme & Organes');

    // Ionogramme
    set('k',  (4.0 + 3.0 * f).toFixed(1), 'IONOGRAMME — Sels Minéraux du Sang');
    set('na', (140 - 10  * f).toFixed(0), 'IONOGRAMME — Sels Minéraux du Sang');

    // Gaz du sang — acidose métabolique
    set('ph',   (7.40 - 0.15 * f).toFixed(2), 'GAZ DU SANG — Respiration & Acidité');
    set('pco2', (40   - 8   * f).toFixed(0), 'GAZ DU SANG — Respiration & Acidité');

    // Examen urinaire
    set('prot_u', (0.05 + 3.0 * f).toFixed(2), 'BILAN RÉNAL — Analyse des Urines');
    set('hem_u',  grav >= 5 ? (Math.round(5 + 50 * f)).toString() : '< 5', 'BILAN RÉNAL — Analyse des Urines');
    set('leu_u',  grav >= 6 ? (Math.round(10 + 80 * f)).toString() : '< 10', 'BILAN RÉNAL — Analyse des Urines');

    const chronic = grav >= 6;
    fusionnerConclusion(
        `INSUFFISANCE RÉNALE ${chronic ? 'CHRONIQUE (LES REINS LÂCHENT PROGRESSIVEMENT)' : 'AIGUË (LES REINS BLOQUENT SOUDAINEMENT)'} — STADE ${grav >= 8 ? 'TERMINAL' : grav >= 5 ? 'SÉVÈRE' : 'MODÉRÉ'}.\n\n` +
        `GLOBULES ROUGES :\n- Hémoglobine ${(14-6*f).toFixed(1)} g/dL → ${grav >= 6 ? 'les reins ne produisent plus assez d\'érythropoïétine (hormone = fabrication du sang)' : 'légère anémie'}.\n\n` +
        `ÉTAT DES REINS :\n- Urée ${(0.30+2.0*f).toFixed(2)} g/L + Créatinine ${(9+80*f).toFixed(1)} mg/L → ${grav >= 7 ? 'les reins ne filtrent presque plus. Dialyse à envisager.' : 'filtration rénale fortement réduite'}.\n\n` +
        `POTASSIUM (K+) : ${(4.0+3.0*f).toFixed(1)} mmol/L → ${grav >= 7 ? '⚠️ TROP ÉLEVÉ — risque d\'arrêt cardiaque. Traitement immédiat !' : 'à surveiller de près'}.\n\n` +
        `ACIDITÉ DU SANG : pH ${(7.40-0.15*f).toFixed(2)} → le sang s'acidifie car les reins n'éliminent plus les déchets acides.\n\n` +
        `ANALYSE DES URINES :\n- Présence ${grav >= 5 ? 'de sang et de globules blancs' : 'de protéines'} dans les urines — signe de lésion rénale.\n\n` +
        `À FAIRE : Protéger les reins, corriger le potassium. ${grav >= 8 ? 'Discussion urgente pour mise sous dialyse.' : ''}`
    );
};

/* ── GYNÉCO — Test grossesse ── */
window.lancerTestGrossesse = function() {
    window.resetSeulementBio(false);
    const sexe = document.getElementById('patientSex')?.value;
    if (sexe !== 'F') { alert("⛔ Ce test est réservé aux patientes de sexe féminin."); return; }

    const enceinte = Math.random() > 0.3;
    const hcg = enceinte ? Math.floor(Math.random()*5000+100) : Math.floor(Math.random()*4);
    set('hcg', hcg.toString(), 'HORMONES & FERTILITÉ');

    let sa = 4;
    if (hcg > 500) sa = 5;
    if (hcg > 2000) sa = 6;
    if (hcg > 10000) sa = 8;

    fusionnerConclusion(enceinte
        ? `TEST DE GROSSESSE : POSITIF ✓\n\nHormone de grossesse (Bêta-HCG) : ${hcg} mUI/mL → grossesse confirmée biologiquement.\nÂge de grossesse estimé : environ ${sa} semaines.\n\nÀ FAIRE : Échographie pour confirmer la localisation et la date exacte.`
        : `TEST DE GROSSESSE : NÉGATIF\n\nHormone de grossesse (Bêta-HCG) : indétectable (< 5 mUI/mL).\n\nAucune grossesse détectée à ce jour.`
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
    set('amh', amh, 'HORMONES & FERTILITÉ');
    set('fsh', fsh, 'HORMONES & FERTILITÉ');

    fusionnerConclusion(fertile
        ? `BILAN FERTILITÉ : BONNE RÉSERVE OVARIENNE ✓\n\nAMH (stock d'ovules) : ${amh} ng/mL ✓\nFSH (hormone de stimulation) : ${fsh} UI/L ✓\n\nLes ovaires fonctionnent bien. La fertilité naturelle est bonne.`
        : `BILAN FERTILITÉ : RÉSERVE OVARIENNE FAIBLE ⚠️\n\nAMH (stock d'ovules) bas : ${amh} ng/mL\nFSH (hormone de stimulation) élevée : ${fsh} UI/L — signe que les ovaires peinent.\n\nLe stock d'ovules est réduit. Consultation chez un spécialiste recommandée.`
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
        texte = `ANALYSE DU SPERME (SPERMOGRAMME) : STÉRILITÉ CONFIRMÉE.\n\nConcentration : 0 M/mL — Aucun spermatozoïde trouvé dans l'éjaculat (azoospermie).\nMobilité : 0%.\n\nRÉSULTAT : Le patient est stérile. Des examens complémentaires sont nécessaires pour en trouver la cause (production nulle ou blocage).`;
    } else if (rand < 0.5) {
        const conc = Math.floor(Math.random()*10+2);
        texte = `ANALYSE DU SPERME (SPERMOGRAMME) : FERTILITÉ RÉDUITE.\n\nConcentration : ${conc} M/mL (faible — norme > 15 M/mL).\nMobilité : réduite.\n\nLe patient n'est pas stérile mais sa fertilité est diminuée. Une conception naturelle reste possible mais difficile.`;
    } else {
        const conc = Math.floor(Math.random()*60+20);
        texte = `ANALYSE DU SPERME (SPERMOGRAMME) : RÉSULTATS NORMAUX ✓\n\nConcentration : ${conc} M/mL ✓\nMobilité : excellente.\n\nAucun problème de fertilité détecté. Les paramètres sont dans les normes.`;
    }
    fusionnerConclusion(texte);
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
                        <label style="font-size:10px;color:#94a3b8;display:block;margin-bottom:4px;">Nb de partenaires différents (3 dernières semaines)</label>
                        <select id="ist-partenaires" style="width:100%;background:#0a1324;border:1px solid #334155;color:white;padding:8px;border-radius:4px;font-size:12px;">
                            <option value="0">0 — Aucun</option>
                            <option value="1">1 partenaire</option>
                            <option value="2">2 partenaires</option>
                            <option value="3">3 partenaires</option>
                            <option value="4">4 ou plus</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:10px;color:#94a3b8;display:block;margin-bottom:4px;">Dernier rapport sans préservatif</label>
                        <select id="ist-protection" style="width:100%;background:#0a1324;border:1px solid #334155;color:white;padding:8px;border-radius:4px;font-size:12px;">
                            <option value="jamais">Toujours protégé(e)</option>
                            <option value="recent">Il y a moins de 72h</option>
                            <option value="semaine">Il y a environ 1 semaine</option>
                            <option value="mois">Il y a plus d'1 mois</option>
                        </select>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
                    <div>
                        <label style="font-size:10px;color:#94a3b8;display:block;margin-bottom:4px;">Symptômes remarqués</label>
                        <select id="ist-symptomes" style="width:100%;background:#0a1324;border:1px solid #334155;color:white;padding:8px;border-radius:4px;font-size:12px;">
                            <option value="aucun">Aucun symptôme</option>
                            <option value="brulures">Brûlures ou douleurs en urinant</option>
                            <option value="ecoulement">Écoulement inhabituel</option>
                            <option value="lesions">Plaies ou boutons sur les parties génitales</option>
                            <option value="multiples">Plusieurs symptômes à la fois</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:10px;color:#94a3b8;display:block;margin-bottom:4px;">Déjà eu une IST ?</label>
                        <select id="ist-antecedent" style="width:100%;background:#0a1324;border:1px solid #334155;color:white;padding:8px;border-radius:4px;font-size:12px;">
                            <option value="non">Non</option>
                            <option value="oui">Oui</option>
                            <option value="nsp">Ne sait pas</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style="font-size:10px;color:#94a3b8;display:block;margin-bottom:4px;">Consommation de drogues injectables (seringues) ?</label>
                    <select id="ist-drogues" style="width:100%;background:#0a1324;border:1px solid #334155;color:white;padding:8px;border-radius:4px;font-size:12px;">
                        <option value="non">Non</option>
                        <option value="oui">Oui — utilise des seringues (parfois partagées)</option>
                        <option value="substances">Oui — drogues mais sans seringues</option>
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
        _istConclusion = `Aucune infection sexuellement transmissible détectée ce jour.\n\nCONSEIL : Un dépistage régulier est recommandé tous les 3 à 6 mois selon le nombre de partenaires.${protection === 'recent' ? '\n\n⚠️ Rapport non protégé récent (moins de 72h) — Parler au médecin de la possibilité d\'un traitement préventif (PEP).' : ''}`;
        concDiv.style.cssText = 'margin-top:12px;padding:12px;border-radius:6px;font-size:12px;line-height:1.6;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);color:#86efac;';
    } else {
        _istConclusion = `⚠️ ${nbPositifs} infection(s) sexuellement transmissible(s) détectée(s).\n\nUne prise en charge médicale immédiate est nécessaire.\nLe ou les partenaires doivent également être dépistés et traités.\nCertaines infections (VIH, syphilis) sont à déclarer obligatoirement aux autorités sanitaires.`;
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
