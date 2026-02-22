/* ============================================================
   LABORATOIRE - VERSION INTELLIGENTE (AGE + SEXE RÉELS)
   ============================================================ */


// ==========================================
// 1. BASE DE DONNÉES MÉDICALE
// ==========================================
const database = {
    "HÉMATOLOGIE (SANG)": [
        { id: "gb", label: "Leucocytes", unit: "G/L", norm: "4.0 - 10.0" },
        { id: "hb", label: "Hémoglobine", unit: "g/dL", norm: "13.0 - 17.0" },
        { id: "ht", label: "Hématocrite", unit: "%", norm: "40 - 52" },
        { id: "pla", label: "Plaquettes", unit: "G/L", norm: "150 - 400" },
        { id: "vgm", label: "VGM", unit: "fL", norm: "80 - 100" },
        { id: "tcmh", label: "TCMH", unit: "pg", norm: "27 - 32" },
        { id: "poly_n", label: "Polynucléaires", unit: "%", norm: "40 - 75" },
        { id: "lympho", label: "Lymphocytes", unit: "%", norm: "20 - 45" }
    ],
    "COAGULATION": [
        { id: "tp", label: "Taux Prothrombine", unit: "%", norm: "70 - 100" },
        { id: "inr", label: "INR", unit: "-", norm: "0.8 - 1.2" },
        { id: "tca", label: "TCA", unit: "sec", norm: "24 - 38" },
        { id: "fibri", label: "Fibrinogène", unit: "g/L", norm: "2.0 - 4.0" }
    ],
    "BIOCHIMIE MÉTABOLIQUE": [
        { id: "gly", label: "Glycémie (Jeun)", unit: "g/L", norm: "0.70 - 1.10" },
        { id: "uree", label: "Urée", unit: "g/L", norm: "0.15 - 0.45" },
        { id: "crea", label: "Créatinine", unit: "mg/L", norm: "7.0 - 12.0" },
        { id: "crp", label: "CRP", unit: "mg/L", norm: "0 - 5.0" },
        { id: "vs", label: "Vitesse Sédim.", unit: "mm/h", norm: "0 - 20" }
    ],
    "IONOGRAMME": [
        { id: "na", label: "Sodium (Na+)", unit: "mmol/L", norm: "135 - 145" },
        { id: "k", label: "Potassium (K+)", unit: "mmol/L", norm: "3.5 - 5.0" },
        { id: "cl", label: "Chlore (Cl-)", unit: "mmol/L", norm: "95 - 105" },
        { id: "ca", label: "Calcium", unit: "mg/L", norm: "85 - 105" }
    ],
    "BILAN HÉPATIQUE": [
        { id: "asat", label: "ASAT (TGO)", unit: "UI/L", norm: "0 - 35" },
        { id: "alat", label: "ALAT (TGP)", unit: "UI/L", norm: "0 - 45" },
        { id: "ggt", label: "Gamma-GT", unit: "UI/L", norm: "0 - 55" },
        { id: "bili_t", label: "Bilirubine Tot.", unit: "mg/L", norm: "0 - 12" }
    ],
    "MARQUEURS CARDIAQUES": [
        { id: "tropo", label: "Troponine I", unit: "ng/L", norm: "0 - 15" },
        { id: "bnp", label: "BNP", unit: "pg/mL", norm: "0 - 100" }
    ],
    "GAZ DU SANG": [
        { id: "ph", label: "pH Artériel", unit: "", norm: "7.38 - 7.42" },
        { id: "pco2", label: "PCO2", unit: "mmHg", norm: "35 - 45" },
        { id: "po2", label: "PO2", unit: "mmHg", norm: "80 - 100" },
        { id: "lact", label: "Lactates", unit: "mmol/L", norm: "0.5 - 2.0" }
    ],
    "TOXICOLOGIE": [
        { id: "alc", label: "Alcoolémie", unit: "g/L", norm: "0 - 0.10" },
        { id: "thc", label: "Cannabis", unit: "-", norm: "Négatif" },
        { id: "coc", label: "Cocaïne", unit: "-", norm: "Négatif" },
        { id: "amp", label: "Amphétamines", unit: "-", norm: "Négatif" }
    ],
    "ENDOCRINOLOGIE & FERTILITÉ": [
        { id: "tsh", label: "TSH", unit: "mUI/L", norm: "0.4 - 4.0" },
        { id: "hcg", label: "Bêta-HCG", unit: "mUI/mL", norm: "< 5" },
        { id: "amh", label: "AMH (Réserve)", unit: "ng/mL", norm: "2.0 - 6.8" },
        { id: "fsh", label: "FSH", unit: "UI/L", norm: "3.5 - 12.5" },
        { id: "lh", label: "LH", unit: "UI/L", norm: "2.4 - 12.6" },
        { id: "prolac", label: "Prolactine", unit: "ng/mL", norm: "4.8 - 23.3" }
    ]
};

// ==========================================
// 2. INITIALISATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initInterface();
    if(window.setAutoDate) window.setAutoDate();
    if(window.determinerGroupeAleatoire) window.determinerGroupeAleatoire();
    
    // --- AUTOCOMPLETE ---
    if(window.setupPatientAutocomplete) {
        window.setupPatientAutocomplete({
            nameId: 'patientName',
            birthId: 'patientBirth',
            bloodId: 'patientBlood', 
            callback: function(p) {
                if(window.up) window.up('d-nom', p.nom);
                if(window.upDate) window.upDate('d-ddn', p.naissance);
                if(p.groupe && window.up) window.up('d-groupe', p.groupe);
            }
        });
    }

    updateLiveQRCode();
});

function initInterface() {
    const tabsContainer = document.getElementById('dynamic-tabs');
    const sectionsContainer = document.getElementById('dynamic-sections');
    if (!tabsContainer || !sectionsContainer) return;

    tabsContainer.innerHTML = "";
    sectionsContainer.innerHTML = "";

    for (let cat in database) {
        const cleanCatId = cat.replace(/\s+/g, '-').replace(/[()]/g, '');

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

        let sec = document.createElement('div');
        sec.id = 'sec-' + cleanCatId;
        sec.className = 'section';
        sec.innerHTML = `<div class="section-title">${cat}</div>`;

        database[cat].forEach(item => {
            contentDiv.innerHTML += `
                <div class="input-group-manual">
                    <label class="manual-label">${item.label}</label>
                    <input type="text" class="analysis-input" data-id="${item.id}" data-label="${item.label}" data-norm="${item.norm}" oninput="window.res('${item.id}', this.value, '${cat}')" placeholder="Valeur...">
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

// ==========================================
// 3. FONCTIONS UTILITAIRES (CALCUL AGE)
// ==========================================

function getInfosPatient() {
    const ddnStr = document.getElementById('patientBirth').value;
    const sexe = document.getElementById('patientSex') ? document.getElementById('patientSex').value : 'F';
    
    let age = 30; // Valeur par défaut
    if (ddnStr) {
        const ddn = new Date(ddnStr);
        const diff = Date.now() - ddn.getTime();
        const ageDate = new Date(diff); 
        age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    
    return { age, sexe };
}

/* ==========================================
   4. SCÉNARIOS GYNÉCO / URO (STRICTS)
   ========================================== */

// Fonction pour mettre à jour le sexe sur le papier
window.updateSexe = function(val) {
    const el = document.getElementById('d-sexe');
    if(!el) return;
    
    if(val === 'F') el.innerText = "Femme";
    else if(val === 'H') el.innerText = "Homme";
    else el.innerText = "Autre";
}

// 1. TEST DE GROSSESSE (FEMME UNIQUEMENT)
window.lancerTestGrossesse = function() {
    window.resetSeulementBio(false);
    
    const sexe = document.getElementById('patientSex').value;
    
    if(sexe !== 'F') {
        alert("⛔ ERREUR : Ce test est réservé aux patients de sexe FÉMININ.");
        return;
    }

    const isEnceinte = Math.random() > 0.3; // 30% négatif, 70% positif (pour le RP)
    let hcg = 0;
    let texte = "";

    if(isEnceinte) {
        hcg = Math.floor(Math.random() * 5000) + 100;
        let sa = 4;
        if(hcg > 500) sa = 5;
        if(hcg > 2000) sa = 6;
        texte = `POSITIVE (GROSSESSE DÉTECTÉE).\n\nANALYSE :\n- Bêta-HCG : ${hcg} mUI/mL.\n\nINTERPRÉTATION :\nGrossesse biochimique confirmée. Terme estimé à ${sa} SA.\n\nRECOMMANDATION :\nÉchographie de datation requise.`;
    } else {
        hcg = Math.floor(Math.random() * 5);
        texte = `NÉGATIVE (ABSENCE DE GROSSESSE).\n\nANALYSE :\n- Bêta-HCG : < 5 mUI/mL (Indétectable).\n\nINTERPRÉTATION :\nPas de grossesse détectée ce jour.`;
    }
    
    window.res('hcg', hcg.toString(), 'ENDOCRINOLOGIE & FERTILITÉ');
    fusionnerConclusionSpecifique(texte);
}

// 2. BILAN FERTILITÉ (FEMME UNIQUEMENT)
window.lancerFertilite = function() {
    window.resetSeulementBio(false);
    
    const sexe = document.getElementById('patientSex').value;
    if(sexe !== 'F') {
        alert("⛔ ERREUR : Le bilan de fertilité ovarienne est réservé aux FEMMES.\nPour un homme, utilisez le Test de Stérilité (Spermogramme).");
        return;
    }

    // SCÉNARIO FEMME (Réserve Ovarienne)
    const isFertile = Math.random() > 0.3; 
    let amh, fsh, conclusion;

    if(isFertile) {
        amh = (Math.random()*2 + 2).toFixed(2); // Haute
        fsh = (Math.random()*4 + 4).toFixed(1);   // Basse
        conclusion = `BILAN FERTILITÉ : EXCELLENT.\n\nDOSAGE HORMONAL :\n- AMH (Réserve) : ${amh} ng/mL (Normale).\n- FSH : ${fsh} UI/L (Normale).\n\nCONCLUSION :\nRéserve ovarienne satisfaisante. Potentiel de fertilité optimal.`;
    } else {
        amh = (Math.random()*0.8 + 0.1).toFixed(2); // Basse
        fsh = (Math.random()*5 + 10).toFixed(1);   // Haute
        conclusion = `BILAN FERTILITÉ : RÉSERVE DIMINUÉE.\n\nDOSAGE HORMONAL :\n- AMH basse : ${amh} ng/mL.\n- FSH élevée : ${fsh} UI/L.\n\nCONCLUSION :\nLe stock d'ovules est faible. La fertilité naturelle est réduite.`;
    }

    window.res('amh', amh, 'ENDOCRINOLOGIE & FERTILITÉ');
    window.res('fsh', fsh, 'ENDOCRINOLOGIE & FERTILITÉ');
    fusionnerConclusionSpecifique(conclusion);
}

// 3. TEST DE STÉRILITÉ (HOMME UNIQUEMENT)
window.lancerSterilite = function() {
    window.resetSeulementBio(false);
    
    const sexe = document.getElementById('patientSex').value;
    if(sexe !== 'H') {
        alert("⛔ ERREUR : Le test de stérilité (Spermogramme) est réservé aux HOMMES.\nPour une femme, utilisez le Bilan Fertilité.");
        return;
    }

    // SCÉNARIO HOMME (Spermogramme)
    // On décide au hasard s'il est stérile ou juste "moyen" ou "bon"
    const rand = Math.random();
    let conclusion = "";

    if (rand < 0.2) {
        // AZOOSPERMIE (Stérile complet)
        conclusion = `DIAGNOSTIC DE STÉRILITÉ CONFIRMÉ.\n\nSPERMOGRAMME :\n- Concentration : 0 M/ml (Absence totale).\n- Mobilité : 0%.\n\nVERDICT : AZOOSPERMIE.\nAbsence de spermatozoïdes dans l'éjaculat. Stérilité d'origine sécrétoire ou obstructive.`;
    } else if (rand < 0.5) {
        // HYPOFERTILITÉ (Pas stérile, mais galère)
        let conc = Math.floor(Math.random()*10 + 2);
        conclusion = `HYPOFERTILITÉ MASCULINE.\n\nSPERMOGRAMME :\n- Concentration : ${conc} M/ml (Faible).\n- Mobilité : Réduite.\n\nCONCLUSION :\nOligospermie. La conception est possible mais difficile.`;
    } else {
        // NORMAL (Il va bien, c'est juste un contrôle)
        let conc = Math.floor(Math.random()*60 + 20);
        conclusion = `ABSENCE DE STÉRILITÉ.\n\nSPERMOGRAMME :\n- Concentration : ${conc} M/ml (Normale).\n- Mobilité : Excellente.\n\nCONCLUSION :\nLe patient n'est pas stérile. Paramètres spermatiques normaux.`;
    }

    fusionnerConclusionSpecifique(conclusion);
}
// ==========================================
// 5. FONCTIONS PUBLIQUES (WINDOW)
// ==========================================

window.res = function(id, val, cat) {
    const cleanCatId = cat.replace(/\s+/g, '-').replace(/[()]/g, '');
    const row = document.getElementById('row-' + id);
    const valSpan = document.getElementById('val-' + id);
    const section = document.getElementById('sec-' + cleanCatId);

    if (valSpan) {
        valSpan.innerText = val;
        const item = Object.values(database).flat().find(i => i.id === id);
        if (item && val.trim() !== "" && item.norm.includes('-')) {
            try {
                const parts = item.norm.split('-');
                if(parts.length === 2) {
                    const min = parseFloat(parts[0]);
                    const max = parseFloat(parts[1]);
                    const v = parseFloat(val.replace(',', '.'));
                    if(!isNaN(v) && !isNaN(min) && !isNaN(max)) {
                        valSpan.style.color = (v < min || v > max) ? "#ef4444" : "#22c55e";
                    }
                }
            } catch(e) {}
        }
    }

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
}

window.switchMode = function(mode) {
    document.getElementById('panel-auto').style.display = (mode === 'auto' ? 'block' : 'none');
    document.getElementById('panel-manual').style.display = (mode === 'manual' ? 'block' : 'none');
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    if(mode === 'auto') document.getElementById('btn-auto').classList.add('active');
    else document.getElementById('btn-manual').classList.add('active');
}

window.determinerGroupeAleatoire = function() {
    const groupes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const resultat = groupes[Math.floor(Math.random() * groupes.length)];
    const select = document.getElementById('patientBlood');
    if(select) {
        select.value = resultat;
        if(window.up) window.up('d-groupe', resultat);
    }
}

window.setAutoDate = function() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = today.toLocaleDateString('fr-FR', options);
    if (document.getElementById('date-prel-input')) document.getElementById('date-prel-input').valueAsDate = today;
    if (document.getElementById('d-date-prel')) document.getElementById('d-date-prel').innerText = dateStr;
}

window.resetSeulementBio = function(confirmNeeded = true) {
    if (confirmNeeded && !confirm("Vider les analyses ?")) return;
    document.querySelectorAll('.analysis-input').forEach(el => el.value = "");
    document.querySelectorAll('.row, .section').forEach(el => el.classList.remove('active'));
    document.getElementById('auto-concl-area').value = "";
    document.getElementById('d-concl').innerText = "...";
    updateLiveQRCode();
}

window.lancerGenerationAuto = function() {
    const grav = parseInt(document.getElementById('gravity-range').value);
    const scenarios = Array.from(document.querySelectorAll('.sidebar input[type="checkbox"]:checked')).map(i => i.value);
    let f = (grav - 1) / 9; 

    window.resetSeulementBio(false);

    let results = { gb: 7.0, hb: 15.0, ht: 45, pla: 250, gly: 0.90, na: 140, k: 4.0, crea: 9.0, ph: 7.40, lact: 0.8 };
    let diagPrincipal = "";

    scenarios.forEach(s => {
        if (s === 'arme-feu' || s === 'acc-route') {
            results.hb = (15.0 - (10.0 * f)).toFixed(1); 
            results.pla = (250 - (200 * f)).toFixed(0); 
            results.lact = (0.8 + (8.0 * f)).toFixed(1); 
            diagPrincipal = grav >= 7 ? "URGENCE : CHOC HYPOVOLÉMIQUE. Hémorragie massive avec acidose lactique." : "TRAUMA : Spoliation sanguine modérée. Risque de choc hypovolémique à surveiller.";
        }
        
        if (s === 'overdose') {
            results.ph = (7.40 - (0.50 * f)).toFixed(2); 
            results.lact = (0.8 + (10.0 * f)).toFixed(1);
            results.alc = (f * 4.5).toFixed(2);
            diagPrincipal = grav >= 7 ? "URGENCE : OVERDOSE CRITIQUE. Acidose respiratoire majeure et défaillance multiviscérale." : "TOXICOLOGIE : Vigilance altérée. Signes d'intoxication systémique.";
        }

        if (s === 'diabete') {
            results.gly = (0.90 + (6.0 * f)).toFixed(2); 
            results.k = (4.0 + (3.0 * f)).toFixed(1);    
            diagPrincipal = grav >= 7 ? "URGENCE : COMA ACIDO-CÉTOSIQUE. Hyperglycémie maligne. Danger d'arrêt cardiaque (Hyperkaliémie)." : "DIABÈTE : Décompensation glycémique. Surveillance ionique requise.";
        }
    });

    if (!diagPrincipal) {
        diagPrincipal = grav > 1 ? "CONSTANTES PERTURBÉES : Anomalies détectées. Surveillance clinique nécessaire." : "STABLE : Constantes physiologiques dans les normes.";
    }

    for (let id in results) {
        let cat = Object.keys(database).find(c => database[c].some(i => i.id === id));
        if (cat) window.res(id, results[id].toString(), cat);
    }
    
    fusionnerConclusionSpecifique(diagPrincipal);
}

// ==========================================
// 6. FONCTIONS INTERNES
// ==========================================

function updateLiveQRCode() {
    const nom = document.getElementById('d-nom').innerText || "Anonyme";
    const date = document.getElementById('d-date-prel').innerText || "00-00-00";
    const qrImg = document.getElementById('qr-ref');
    if (qrImg) {
        const data = encodeURIComponent(`OMC-LAB|${nom}|${date}`);
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
    }
}

function fusionnerConclusionSpecifique(nouveauTexte) {
    document.getElementById('auto-concl-area').value = nouveauTexte;
    document.getElementById('d-concl').innerText = nouveauTexte;
}
