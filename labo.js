/* ============================================================
   LABORATOIRE - VERSION FUSIONNÉE (MÉDICAL + FIREBASE)
   ============================================================ */

// 1. IMPORTS ET CONFIG
import { setupPatientAutocomplete, ajouterEvenementPatient } from "./global.js";

const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282";

// ==========================================
// 2. BASE DE DONNÉES MÉDICALE (LOCALE AU FICHIER)
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
    "ENDOCRINOLOGIE & FERTILITÉ": [
        { id: "tsh", label: "TSH", unit: "mUI/L", norm: "0.4 - 4.0", help: "Thyroïde." },
        { id: "hcg", label: "Bêta-HCG (Grossesse)", unit: "mUI/mL", norm: "< 5", help: "Grossesse." },
        { id: "amh", label: "AMH (Réserve Ovarienne)", unit: "ng/mL", norm: "2.0 - 6.8", help: "Fertilité." },
        { id: "fsh", label: "FSH (J3 cycle)", unit: "UI/L", norm: "3.5 - 12.5", help: "Stimulation." },
        { id: "lh", label: "LH", unit: "UI/L", norm: "2.4 - 12.6", help: "Ovulation." },
        { id: "prolac", label: "Prolactine", unit: "ng/mL", norm: "4.8 - 23.3", help: "Hormone." }
    ]
};

// ==========================================
// 3. INITIALISATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initInterface();
    setAutoDate();
    determinerGroupeAleatoire();
    
    // --- AUTOCOMPLETE CENTRALISÉ VIA FIREBASE ---
    // (Cette fonction est importée depuis global.js)
    if(window.setupPatientAutocomplete) {
        window.setupPatientAutocomplete({
            nameId: 'patientName',
            birthId: 'patientBirth',
            bloodId: 'patientBlood', 
            callback: function(p) {
                // Mise à jour visuelle quand on clique sur un patient
                if(window.up) window.up('d-nom', p.nom);
                if(window.upDate) window.upDate('d-ddn', p.naissance);
                if(p.groupe && window.up) window.up('d-groupe', p.groupe);
            }
        });
    }

    updateLiveQRCode();
});

// Création de l'interface (Onglets + Champs)
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
            // Création des inputs dans la sidebar
            contentDiv.innerHTML += `
                <div class="input-group-manual">
                    <label class="manual-label">${item.label}</label>
                    <input type="text" class="analysis-input" data-id="${item.id}" data-label="${item.label}" data-norm="${item.norm}" oninput="window.res('${item.id}', this.value, '${cat}')" placeholder="Valeur...">
                </div>`;
            
            // Création des lignes dans le document
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
// 4. LOGIQUE MÉTIER (RENDUE PUBLIQUE)
// ==========================================

// Fonction mise à jour des résultats (attachée à window pour le HTML)
window.res = function(id, val, cat) {
    const cleanCatId = cat.replace(/\s+/g, '-').replace(/[()]/g, '');
    const row = document.getElementById('row-' + id);
    const valSpan = document.getElementById('val-' + id);
    const section = document.getElementById('sec-' + cleanCatId);

    if (valSpan) {
        valSpan.innerText = val;
        // Logic de couleur simple pour valeurs numériques
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

window.lancerGenerationAuto = function() {
    const grav = parseInt(document.getElementById('gravity-range').value);
    const scenarios = Array.from(document.querySelectorAll('.sidebar input[type="checkbox"]:checked')).map(i => i.value);
    let f = (grav - 1) / 9; 

    resetSeulementBio(false);

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

window.lancerTestGrossesse = function() {
    resetSeulementBio(false);
    const isEnceinte = Math.random() > 0.3; // 70% chance positif pour le RP
    
    let hcg = isEnceinte ? Math.floor(Math.random() * 5000) + 50 : Math.floor(Math.random() * 5);
    
    window.res('hcg', hcg.toString(), 'ENDOCRINOLOGIE & FERTILITÉ');
    
    let texte = "";
    if(isEnceinte) {
        let sa = 0;
        if(hcg < 50) sa = 3;
        else if(hcg < 500) sa = 4;
        else if(hcg < 5000) sa = 5;
        else sa = 6;
        texte = `TEST DE GROSSESSE POSITIF.\nTaux Beta-HCG : ${hcg} mUI/mL.\nTerme estimé : ${sa} SA environ.\nNécessite échographie de datation.`;
    } else {
        texte = `TEST DE GROSSESSE NÉGATIF.\nTaux Beta-HCG : < 5 mUI/mL.\nAbsence de grossesse biologique détectable ce jour.`;
    }
    
    fusionnerConclusionSpecifique(texte);
}

window.lancerFertilite = function() {
    resetSeulementBio(false);
    
    const isPatho = Math.random() > 0.7;
    
    let amh = (Math.random() * 4 + 2).toFixed(2);
    let fsh = (Math.random() * 8 + 3).toFixed(1);
    let lh = (Math.random() * 8 + 3).toFixed(1);
    let prolac = (Math.random() * 15 + 5).toFixed(1);
    
    let diag = "BILAN FERTILITÉ NORMAL. Réserve ovarienne satisfaisante.";

    if (isPatho) {
        const type = Math.random();
        if (type < 0.5) {
            amh = (Math.random() * 1).toFixed(2); 
            fsh = (Math.random() * 15 + 15).toFixed(1); 
            diag = "INSUFFISANCE OVARIENNE DÉBUTANTE.\nAMH basse et FSH élevée. Réserve ovarienne diminuée.";
        } else {
            lh = (fsh * 2.5).toFixed(1); 
            diag = "PROFIL OPK SUSPECTÉ.\nInversion du ratio LH/FSH. À corréler avec l'échographie.";
        }
    }

    window.res('amh', amh, 'ENDOCRINOLOGIE & FERTILITÉ');
    window.res('fsh', fsh, 'ENDOCRINOLOGIE & FERTILITÉ');
    window.res('lh', lh, 'ENDOCRINOLOGIE & FERTILITÉ');
    window.res('prolac', prolac, 'ENDOCRINOLOGIE & FERTILITÉ');
    
    fusionnerConclusionSpecifique(diag);
}

// ==========================================
// 5. FONCTIONS UTILITAIRES INTERNES
// ==========================================

function determinerGroupeAleatoire() {
    const groupes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const resultat = groupes[Math.floor(Math.random() * groupes.length)];
    const select = document.getElementById('patientBlood');
    if(select) {
        select.value = resultat;
        if(window.up) window.up('d-groupe', resultat);
    }
}

function setAutoDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = today.toLocaleDateString('fr-FR', options);
    if (document.getElementById('date-prel-input')) document.getElementById('date-prel-input').valueAsDate = today;
    if (document.getElementById('d-date-prel')) document.getElementById('d-date-prel').innerText = dateStr;
}

function updateLiveQRCode() {
    const nom = document.getElementById('d-nom').innerText || "Anonyme";
    const date = document.getElementById('d-date-prel').innerText || "00-00-00";
    const qrImg = document.getElementById('qr-ref');
    if (qrImg) {
        const data = encodeURIComponent(`OMC-LAB|${nom}|${date}`);
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
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

function fusionnerConclusionSpecifique(nouveauTexte) {
    document.getElementById('auto-concl-area').value = nouveauTexte;
    document.getElementById('d-concl').innerText = nouveauTexte;
}

// ==========================================
// 6. EXPORT IMAGE ET DISCORD
// ==========================================

window.genererImage = async function() {
    const doc = document.getElementById('document');
    const btn = event.target;
    
    window.scrollTo(0,0);
    btn.innerText = "GÉNÉRATION...";
    btn.disabled = true;
    doc.classList.add('mode-capture');

    try {
        const canvas = await html2canvas(doc, { 
            scale: 2, 
            useCORS: true, 
            backgroundColor: "#ffffff"
        });

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
                if(window.ajouterEvenementPatient) {
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
