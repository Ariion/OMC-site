/* ============================================================
   LABORATOIRE - VERSION INTELLIGENTE (AGE + SEXE RÉELS)
   ============================================================ */

const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282";

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

// ==========================================
// 4. SCÉNARIOS GYNÉCO / URO (INTELLIGENTS)
// ==========================================

// --- TEST DE GROSSESSE ---
window.lancerTestGrossesse = function() {
    window.resetSeulementBio(false);
    const { age, sexe } = getInfosPatient();
    
    if(sexe === 'H') {
        window.res('hcg', '0', 'ENDOCRINOLOGIE & FERTILITÉ');
        fusionnerConclusionSpecifique("TEST NON APPLICABLE.\nPatient de sexe masculin.\nL'hormone Bêta-HCG n'est pas produite par l'organisme masculin.");
        return;
    }

    // Hasard : 70% de chance d'être enceinte si RP
    const isEnceinte = Math.random() > 0.3; 
    let hcg = 0;
    let texte = "";

    if(isEnceinte) {
        hcg = Math.floor(Math.random() * 5000) + 100;
        let sa = 4; // Semaines d'aménorrhée estimées
        if(hcg > 500) sa = 5;
        if(hcg > 2000) sa = 6;
        
        texte = `POSITIVE (GROSSESSE DÉTECTÉE).\n\nANALYSE :\n- Bêta-HCG : ${hcg} mUI/mL (Seuil > 5).\n\nINTERPRÉTATION :\nGrossesse biochimique confirmée. Terme estimé à ${sa} SA.\n\nRECOMMANDATION :\nÉchographie pelvienne de datation requise.`;
    } else {
        hcg = Math.floor(Math.random() * 5);
        texte = `NÉGATIVE (ABSENCE DE GROSSESSE).\n\nANALYSE :\n- Bêta-HCG : < 5 mUI/mL (Indétectable).\n\nINTERPRÉTATION :\nAbsence de grossesse évolutive à ce jour.`;
    }
    
    window.res('hcg', hcg.toString(), 'ENDOCRINOLOGIE & FERTILITÉ');
    fusionnerConclusionSpecifique(texte);
}

// --- BILAN FERTILITÉ (Le "Score") ---
window.lancerFertilite = function() {
    window.resetSeulementBio(false);
    const { age, sexe } = getInfosPatient();
    let conclusion = "";

    // === HOMME ===
    if (sexe === 'H') {
        let conc, mob, qualite;
        
        // Calcul selon l'âge
        if (age < 50) {
            // Homme jeune/adulte : Fertilité Top
            conc = Math.floor(Math.random() * 60 + 40); // 40-100 M/ml
            mob = Math.floor(Math.random() * 30 + 50);  // 50-80%
            qualite = "EXCELLENTE";
        } else {
            // Homme âgé : Déclin naturel
            conc = Math.floor(Math.random() * 30 + 10); // 10-40 M/ml
            mob = Math.floor(Math.random() * 30 + 20);  // 20-50%
            qualite = "DIMINUÉE (LIÉE À L'ÂGE)";
        }

        conclusion = `BILAN ANDROLOGIQUE (Patient de ${age} ans).\n\nSPERMOGRAMME :\n- Concentration : ${conc} M/ml.\n- Mobilité : ${mob}%.\n\nCONCLUSION :\nQualité spermatique ${qualite}.\nLa fertilité naturelle est préservée.`;
    } 
    
    // === FEMME ===
    else {
        let amh, fsh, lh, etat;

        if (age < 38) {
            // JEUNE : Fertilité optimale
            amh = (Math.random() * 2 + 2.5).toFixed(2); // Haute
            fsh = (Math.random() * 3 + 4).toFixed(1);   // Basse
            etat = "RÉSERVE OVARIENNE OPTIMALE.\nPotentiel de fertilité excellent.";
        } 
        else if (age >= 38 && age < 48) {
            // QUARANTAINE : Déclin
            amh = (Math.random() * 1 + 0.5).toFixed(2); // Basse
            fsh = (Math.random() * 5 + 9).toFixed(1);   // Monte
            etat = "RÉSERVE OVARIENNE DIMINUÉE.\nLe stock ovocytaire s'épuise naturellement. Fertilité spontanée réduite.";
        } 
        else {
            // > 48 ANS : Ménopause
            amh = "0.05"; // Nulle
            fsh = (Math.random() * 20 + 30).toFixed(1); // Explosive
            etat = "PROFIL MÉNOPAUSIQUE.\nArrêt physiologique de la fonction ovarienne lié à l'âge.";
        }

        window.res('amh', amh, 'ENDOCRINOLOGIE & FERTILITÉ');
        window.res('fsh', fsh, 'ENDOCRINOLOGIE & FERTILITÉ');
        
        conclusion = `BILAN GYNÉCOLOGIQUE (Patiente de ${age} ans).\n\nDOSAGE HORMONAL :\n- AMH : ${amh} ng/mL.\n- FSH : ${fsh} UI/L.\n\nCONCLUSION :\n${etat}`;
    }

    fusionnerConclusionSpecifique(conclusion);
}

// --- TEST DE STÉRILITÉ (Le "Diagnostic de cause") ---
window.lancerSterilite = function() {
    window.resetSeulementBio(false);
    const { age, sexe } = getInfosPatient();
    let conclusion = "";

    // === HOMME : AZOOSPERMIE ===
    if (sexe === 'H') {
        conclusion = `DIAGNOSTIC D'INFERTILITÉ MASCULINE.\n\nANALYSE :\n- Spermatozoïdes totaux : 0 (Absence complète).\n- pH séminal : 7.2.\n\nVERDICT : AZOOSPERMIE SÉCRÉTOIRE.\nStérilité masculine confirmée.\nOrigine probable : Atrophie testiculaire ou obstruction bilatérale des canaux déférents.`;
    } 
    
    // === FEMME : OBSTRUCTION ou MÉNOPAUSE ===
    else {
        // Si elle est jeune (< 45), c'est une maladie
        if (age < 45) {
            window.res('amh', '2.5', 'ENDOCRINOLOGIE & FERTILITÉ'); // Hormones OK
            conclusion = `DIAGNOSTIC D'INFERTILITÉ TUBAIRE.\n\nANALYSE HORMONALE :\n- AMH et FSH normales (L'ovulation fonctionne).\n\nHYSTÉROSALPINGOGRAPHIE :\n- Obstruction bilatérale des trompes de Fallope.\n\nVERDICT : STÉRILITÉ MÉCANIQUE.\nLa rencontre ovule/spermatozoïde est physiquement impossible.`;
        } 
        // Si elle est âgée (> 45), c'est l'âge
        else {
            window.res('amh', '0.01', 'ENDOCRINOLOGIE & FERTILITÉ');
            window.res('fsh', '50.0', 'ENDOCRINOLOGIE & FERTILITÉ');
            conclusion = `DIAGNOSTIC DE STÉRILITÉ PHYSIOLOGIQUE.\n\nANALYSE :\n- Effondrement total des hormones de réserve.\n\nVERDICT : MÉNOPAUSE CONFIRMÉE.\nInfertilité définitive et naturelle due à l'âge de la patiente (${age} ans).`;
        }
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

// ==========================================
// 7. EXPORT IMAGE ET DISCORD
// ==========================================

window.genererImage = async function() {
    const doc = document.getElementById('document');
    const btn = event.target;
    
    window.scrollTo(0,0);
    btn.innerText = "GÉNÉRATION...";
    btn.disabled = true;
    doc.classList.add('mode-capture');

    try {
        const canvas = await html2canvas(doc, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imageData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        const formData = new FormData();
        formData.append("image", imageData);
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
        const result = await response.json();
        
        if (result.success) {
            const imgUrl = result.data.url;
            const nomPatient = document.getElementById('patientName').value;

            if(nomPatient && window.ajouterEvenementPatient) {
                window.ajouterEvenementPatient(nomPatient, "Laboratoire", "Bilan Biologique", imgUrl);
            }

            document.getElementById('direct-link').value = result.data.url;
            document.getElementById('preview-img-result').src = result.data.url;
            document.getElementById('image-popup').style.display = 'flex';
        }
    } catch (e) {
        console.error(e);
        alert("Erreur lors de la génération.");
    } finally {
        doc.classList.remove('mode-capture');
        btn.innerText = "🖼️ GÉNÉRER L'IMAGE";
        btn.disabled = false;
    }
}

window.envoyerDiscord = async function() {
    const url = "https://discord.com/api/webhooks/1468219484245332171/OwqxaLPAJznP0W5gxsmNEhuPIJHWukIEX6OZDXpElPWOz0Bbjjc3I9ahKsJ73dCUaQln";
    const btn = document.getElementById('discord-btn'); 
    const doc = document.getElementById('document'); 

    window.scrollTo(0,0);
    btn.disabled = true;
    btn.innerText = "CAPTURE...";
    doc.classList.add('mode-capture');

    try {
        const canvas = await html2canvas(doc, { scale: 2, useCORS: true });
        
        btn.innerText = "ENVOI...";

        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            const nom = document.getElementById('d-nom').innerText || "Inconnu";
            const datePost = new Date().toLocaleDateString('fr-FR');

            formData.append("payload_json", JSON.stringify({
                thread_name: `🔬 LABO - ${nom} (${datePost})`,
                content: `🧪 **Nouveau Bilan Biologique**\n👤 Patient : ${nom}`
            }));
            
            formData.append("file", blob, `labo_${nom}.png`);

            const response = await fetch(url + "?wait=true", { method: 'POST', body: formData });
            
            if(response.ok) { 
                if(nom !== "..." && nom !== "Inconnu" && window.ajouterEvenementPatient) {
                    window.ajouterEvenementPatient(nom, "Laboratoire", "Envoyé sur Discord (Pas de lien image)");
                }
                alert("✅ Rapport Labo envoyé !"); 
                btn.innerText = "ENVOYÉ"; 
            } else {
                throw new Error("Erreur Discord");
            }
            btn.disabled = false;
        }, 'image/png');

    } catch (e) {
        console.error(e);
        btn.disabled = false;
        btn.innerText = "RÉESSAYER";
    } finally {
        doc.classList.remove('mode-capture');
    }
}

window.copyLink = function() {
    const copyText = document.getElementById("direct-link");
    copyText.select();
    document.execCommand("copy");
    alert("Lien copié !");
}
window.closePopup = function() { document.getElementById('image-popup').style.display = 'none'; }
