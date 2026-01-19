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







// Mise à jour des textes simples (Nom, Date, etc.)
function up(id, val) {
    const el = document.getElementById(id);
    if(el) {
        el.innerText = val || "...";
        // Correction spécifique pour la signature
        if(id === 'd-sig' && !val) el.innerText = "NOM DU DOCTEUR";
    }
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







// Mise à jour des analyses de laboratoire
function res(id, val, cat) {
    const row = document.getElementById('row-' + id);
    const valSpan = document.getElementById('val-' + id);
    const section = document.getElementById('sec-' + cat);

    if (valSpan) {
        valSpan.innerText = val;
        
        // Logique de couleur (Rouge si hors norme)
        const itemData = Object.values(database).flat().find(i => i.id === id);
        if (val.trim() !== "" && itemData && itemData.norm !== "Négatif") {
            const valNum = parseFloat(val.replace(',', '.'));
            const normParts = itemData.norm.split('-');
            if(normParts.length === 2) {
                const min = parseFloat(normParts[0]);
                const max = parseFloat(normParts[1]);
                valSpan.style.color = (valNum < min || valNum > max) ? "red" : "green";
            }
        }
    }

    // --- CETTE PARTIE EST CRUCIALE POUR L'AFFICHAGE ---
    if (val.trim() !== "") {
        if(row) row.classList.add('active');
        if(section) section.classList.add('active');
    } else {
        if(row) row.classList.remove('active');
        // On ne cache la section que si plus aucune ligne n'est active dedans
        if(section && section.querySelectorAll('.row.active').length === 0) {
            section.classList.remove('active');
        }
    }

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



    const textZone = document.getElementById('auto-concl-area');



    if(textZone) textZone.value = autoConcl;



    const conclEl = document.getElementById('d-concl');



    if(conclEl) conclEl.innerText = autoConcl;



}







// ==========================================



// 4. LOGIQUE DÉCÈS



// ==========================================







let typeSelectionne = "";







function updateCausesSub(type) {



    typeSelectionne = type;



    const select = document.getElementById('cause-precision');



    if(!select) return;







    select.innerHTML = '<option value="">-- Sélectionner --</option>';



    if (causesData[type]) {



        causesData[type].forEach(c => {



            select.innerHTML += `<option value="${c}">${c}</option>`;



        });



    }



}







function updateCauseFinale(precision) {



    const blocAffichage = document.getElementById('d-cause');



    if (blocAffichage && precision !== "") {



        blocAffichage.innerText = `${typeSelectionne} — ${precision}`;



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



// 5. ENVOIS DISCORD (FIX COUPE IMAGE)



// ==========================================







async function capturerEtEnvoyer(webhookURL, fileName, contentMsg, patientId) {



    const docElement = document.getElementById('document');



    if(!docElement) return;







    const btn = document.getElementById('discord-btn');



    btn.innerText = "📸 ENVOI...";



    btn.disabled = true;







    // --- PRÉPARATION DU MESSAGE PERSONNALISÉ ---



        const now = new Date();



        const dateFormatee = now.toLocaleDateString('en-US'); // Format MM/DD/YYYY comme sur ta capture



        const patientName = document.getElementById(patientId)?.innerText || "Inconnu";







        // Construction du texte avec émojis



        const customHeader = `📄 **${contentMsg}**\n👤 **Patient :** ${patientName}\n📅 **Date :** ${dateFormatee}`;



    try {



        const canvas = await html2canvas(docElement, {



            scale: 2,



            useCORS: true,



            backgroundColor: "#ffffff",



            width: 800,           // Force la capture à 800px



            windowWidth: 1200,    // Simule un écran large pour éviter les coupures à droite



            scrollX: 0,



            scrollY: 0,



            onclone: (clonedDoc) => {



                const d = clonedDoc.getElementById('document');



                d.style.margin = '0';



                d.style.boxShadow = 'none';



            }



        });







        canvas.toBlob(async (blob) => {



            const formData = new FormData();



            const patientName = document.getElementById(patientId)?.innerText || "Inconnu";







            formData.append("payload_json", JSON.stringify({



                content: contentMsg + ` **${patientName}**`



            }));



            formData.append("file", blob, `${fileName}.png`);







            await fetch(webhookURL, { method: 'POST', body: formData });



            alert("✅ RÉUSSI ! Tout est sur Discord.");



        }, 'image/png');







    } catch (error) {



        alert("❌ Erreur. Vérifie ta console (F12)");



    } finally {



        btn.innerText = "ENVOYER SUR L'INTRANET";



        btn.disabled = false;



    }



}







function envoyerDiscord() {



    const url = "https://discord.com/api/webhooks/1462416189526638613/iMpoe9mn6DC4j_0eBS4tOVjaDo_jy1MhfSKIEP80H7Ih3uYGHRcJ5kQSqIFuL0DTqlUy";



    // On passe juste le titre, le reste est géré automatiquement



    capturerEtEnvoyer(url, "labo", "Nouveau rapport de laboratoire", "d-nom");



}



function envoyerDiscordDeces() {



    const url = "https://discord.com/api/webhooks/1462416189526638613/iMpoe9mn6DC4j_0eBS4tOVjaDo_jy1MhfSKIEP80H7Ih3uYGHRcJ5kQSqIFuL0DTqlUy";



    capturerEtEnvoyer(url, "acte", "Nouvel acte de décès établi", "d-defunt");



}







// ==========================================



// 6. LANCEMENT



// ==========================================







document.addEventListener('DOMContentLoaded', () => {



    init();



    genererReference();



});







function determinerGroupeAleatoire() {



    const groupes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];



    const resultat = groupes[Math.floor(Math.random() * groupes.length)];







    // Mise à jour du texte sur le document (sans changement de couleur)



    const afficheur = document.getElementById('d-groupe');



    if(afficheur) {



        afficheur.innerText = resultat;



    }







    // Synchronisation du menu déroulant à gauche



    const select = document.getElementById('select-groupe');



    if(select) {



        select.value = resultat;



    }



}







// --- LOGIQUE GÉNÉRATEUR AUTO ---







function switchMode(mode) {



    const panelAuto = document.getElementById('panel-auto');



    const panelManual = document.getElementById('panel-manual');



    const btnAuto = document.getElementById('btn-auto');



    const btnManual = document.getElementById('btn-manual');







    if (mode === 'auto') {



        panelAuto.style.display = 'block';



        panelManual.style.display = 'none';



        btnAuto.classList.add('active');



        btnManual.classList.remove('active');



    } else {



        panelAuto.style.display = 'none';



        panelManual.style.display = 'block';



        btnAuto.classList.remove('active');



        btnManual.classList.add('active');



    }



}







// --- LOGIQUE GÉNÉRATEUR AUTO MISE À JOUR ---

function lancerGenerationAuto() {
    const grav = parseInt(document.getElementById('gravity-range').value);
    const scenarios = Array.from(document.querySelectorAll('.scenario-grid input:checked')).map(i => i.value);
    
    if(scenarios.length === 0) return alert("Coche au moins un scénario !");

    // Valeurs de base (normales)
    let results = { hb: 14.5, ht: 45, lact: 1.0, ph: 7.40, pco2: 40, po2: 95, crea: 9.0, hcg: 0, alc: 0, gb: 6.0 };
    let extraConcl = "";

    scenarios.forEach(s => {
        // Impact de la gravité beaucoup plus fort (Multiplié par grav)
        if(s === 'acc-route' || s === 'arme-feu' || s === 'arme-blanche') {
            results.hb -= (grav * 0.9); // Gravité 10 = -9g/dL (Hémorragie massive)
            results.ht -= (grav * 2.8);
            results.lact += (grav * 1.2);
            if(s === 'arme-feu') results.gb += (grav * 1.5);
        }
        if(s === 'overdose') { 
            results.ph -= (grav * 0.05); 
            results.pco2 += (grav * 4); 
            results.alc = (grav * 0.4);
        }
        if(s === 'grossesse') { 
            results.hcg = (grav * 8000); 
            // Calcul des semaines basé sur la gravité (Grav 1 = 2sem, Grav 10 = 20sem par ex)
            let semaines = grav * 2;
            extraConcl = " Test de grossesse POSITIF (Estimation : env. " + semaines + " semaines).";
        }
        if(s === 'diabete') { results.ph -= (grav * 0.04); results.gly = (grav * 0.5); }
        if(s === 'renal') { results.crea += (grav * 8); }
        if(s === 'infection') { results.gb += (grav * 3); results.crp = (grav * 20); }
    });

    // Injection et affichage
    for(let id in results) {
        let finalVal = results[id].toFixed(id === 'ph' ? 2 : 1);
        if(id === 'hcg') finalVal = results[id] > 5 ? "POSITIF" : "Négatif";
        
        let cat = "";
        for(let c in database) { if(database[c].find(i => i.id === id)) cat = c; }
        
        const input = document.querySelector(`[data-id="${id}"]`);
        if(input) {
            input.value = finalVal;
            res(id, finalVal, cat);
        }
    }
    
    // ANALYSE ET CONCLUSION
    analyserTout();
    
    // Ajout du texte spécifique (ex: Grossesse) à la fin de la conclusion auto
    if(extraConcl !== "") {
        const textZone = document.getElementById('auto-concl-area');
        const conclEl = document.getElementById('d-concl');
        textZone.value += extraConcl;
        conclEl.innerText += extraConcl;
    }

    // ON NE REPASSE PLUS EN MANUEL AUTOMATIQUEMENT
    // switchMode('manual'); <-- Ligne supprimée pour rester sur l'onglet AUTO
}

function resetSeulementBio() {
    if(!confirm("Vider les analyses ? (Les infos patient seront gardées)")) return;

    // 1. Décocher les scénarios
    document.querySelectorAll('.scenario-grid input').forEach(el => el.checked = false);

    // 2. Vider les inputs de résultats dans les onglets manuels
    document.querySelectorAll('.analysis-input').forEach(el => el.value = "");

    // 3. Masquer les lignes sur le document blanc
    document.querySelectorAll('.row').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    
    // 4. Reset conclusion
    document.getElementById('auto-concl-area').value = "";
    document.getElementById('d-concl').innerText = "...";
    
    console.log("Analyses réinitialisées");
}







    // 1. Vider les inputs textes et dates



    document.querySelectorAll('#input-panel input[type="text"], #input-panel input[type="date"], #input-panel textarea').forEach(el => el.value = "");



    



    // 2. Décocher les scénarios et reset slider



    document.querySelectorAll('.scenario-grid input').forEach(el => el.checked = false);



    document.getElementById('gravity-range').value = 5;



    document.getElementById('grav-display').innerText = "5";







    // 3. Réinitialiser le document de droite



    document.querySelectorAll('#document span[id^="d-"]').forEach(el => el.innerText = "...");



    document.getElementById('d-sig').innerText = "NOM DU DOCTEUR";



    



    // 4. Cacher les lignes de résultats



    document.querySelectorAll('.row').forEach(el => el.classList.remove('active'));



    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));



    



    // 5. Reset sélecteur groupe



    document.getElementById('select-groupe').value = "...";



    



    analyserTout(); // Remet la conclusion par défaut



    alert("Interface réinitialisée.");



}


