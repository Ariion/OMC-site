
// LIEN DISCORD MIS À JOUR
const ECHO_IMAGES = {
    sac: "assets/echo_sac.jpg",
    t1: "assets/echo_t1.jpg",
    t2: "assets/echo_t1.jpg",
    t3: "assets/echo_t3_3d.jpg",
    twins: "assets/echo_twins.jpg",
    col: "https://placehold.co/600x400/000000/FFFFFF?text=MESURE+COL"
};

// --- INITIALISATION ---
window.onload = () => {
    document.getElementById('examDate').valueAsDate = new Date();
    updateHealthColor();
    toggleSections();

    setupPatientAutocomplete({
        nameId: 'patientName',
        birthId: 'patientBirth',
        bloodId: 'patientBlood', 
        callback: function(p) {
            updateReport();
            calculerTerme(); 
        }
    });
    
    updateReport();
};

let currentSA = 0;
let examTypeLabel = "Standard";

function toggleSections() {
    const showBio = document.getElementById('toggleBio').checked;
    const showEcho = document.getElementById('toggleEcho').checked;
    const showOrdo = document.getElementById('toggleOrdo').checked;

    document.getElementById('section-bio').style.display = showBio ? 'block' : 'none';
    document.getElementById('section-echo').style.display = showEcho ? 'block' : 'none';
    document.getElementById('section-ordo').style.display = showOrdo ? 'block' : 'none';
}

function updateHealthColor() {
    const val = document.getElementById('santeMaman').value;
    const txt = document.getElementById('healthValue');
    txt.innerText = val + "%";
    if(val > 75) txt.style.color = "#4ade80";
    else if(val > 40) txt.style.color = "#facc15";
    else txt.style.color = "#ef4444";
}

// 1. CALCUL DU TERME (UNIQUEMENT)
function calculerTerme() {
    const debut = new Date(document.getElementById('dateDebut').value);
    const today = new Date(document.getElementById('examDate').value);
    
    if (!isNaN(debut) && !isNaN(today)) {
        const diffTime = Math.abs(today - debut);
        const daysIRL = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        currentSA = Math.floor(daysIRL * 0.64);
        const joursRestants = Math.floor((daysIRL * 0.64 - currentSA) * 7);

        document.getElementById('display-sa').innerText = `${currentSA} SA + ${joursRestants}j`;
        
        const dpa = new Date(debut);
        dpa.setDate(dpa.getDate() + 64);
        document.getElementById('display-dpa').innerText = dpa.toLocaleDateString('fr-FR');

        // Alerte
        const banner = document.getElementById('banner-status');
        if (currentSA >= 41) {
            banner.classList.add('alert-term');
            document.getElementById('display-sa').innerText += " (DÉPASSÉ)";
        } else {
            banner.classList.remove('alert-term');
        }

        const isCol = document.getElementById('measureCol').checked;
        if (isCol) examTypeLabel = "Mesure du Col (Urgence)";
        else if (currentSA < 11) examTypeLabel = "Échographie de Datation";
        else if (currentSA >= 11 && currentSA < 14) examTypeLabel = "Échographie T1 (12 SA)";
        else if (currentSA >= 14 && currentSA < 28) examTypeLabel = "Échographie Morphologique T2";
        else examTypeLabel = "Échographie Croissance T3";
        
        document.getElementById('exam-type-auto').innerText = examTypeLabel;
    }
}

// 2. FONCTION DE GÉNÉRATION (ACTIVÉE PAR LE BOUTON)
function lancerGenerationResultats() {
    calculerTerme();
    const sante = parseInt(document.getElementById('santeMaman').value);
    genererBiologieEvolutive(sante);
    genererEchoLogic(sante);
    genererOrdonnance(sante);
    updateReport();
}

// --- GÉNÉRATEURS ---
function genererBiologieEvolutive(sante) {
    const tbody = document.getElementById('bio-tbody');
    tbody.innerHTML = ""; 
    const bloodGroup = document.getElementById('patientBlood').value || "Non renseigné";

    const addRow = (nom, res, unit, ref, isBad = false, comment = "") => {
        const row = document.createElement('tr');
        row.innerHTML = `<td><strong>${nom}</strong></td><td class="${isBad ? 'result-bad' : 'result-good'}">${res} ${unit}</td><td style="color:#64748b; font-size:10px;">${ref}</td><td style="font-style:italic;">${isBad ? '⚠️ ' + comment : 'Normal'}</td>`;
        tbody.appendChild(row);
    };

    addRow("Groupe Sanguin / Rhésus", bloodGroup, "", "Info Patient");

    let hcg = 0; let normHcg = "";
    if (currentSA <= 3) { hcg = rand(10, 50); normHcg = "10 - 50"; }
    else if (currentSA <= 4) { hcg = rand(50, 500); normHcg = "50 - 500"; }
    else if (currentSA <= 5) { hcg = rand(500, 5000); normHcg = "100 - 5000"; }
    else if (currentSA <= 6) { hcg = rand(5000, 50000); normHcg = "1000 - 50000"; }
    else if (currentSA <= 12) { hcg = rand(50000, 200000); normHcg = "Pic maximal (T1)"; }
    else { hcg = rand(20000, 60000); normHcg = "Baisse physiologique T2/T3"; }
    
    if (currentSA > 0) addRow("Beta-hCG Plasmatique", formatNumber(hcg), "mIU/ml", normHcg);

    if (currentSA > 4 && currentSA <= 20) {
        const toxo = sante < 30 ? "IgM POSITIF" : "Négatif";
        addRow("Sérologie Toxoplasmose", toxo, "", "Négatif", toxo.includes("POSITIF"), "Infection active");
        addRow("Sérologie Rubéole", "Immunisée", "", "Immunisée");
    }

    if (currentSA > 14) {
        let hemo = sante < 60 ? rand(95, 105) : rand(115, 130);
        addRow("Hémoglobine (NFS)", hemo, "g/L", "> 110 g/L", hemo < 110, "Anémie gravidique");
        if (currentSA > 20) {
            let glyc = sante < 40 ? "1.35" : "0.85";
            addRow("Glycémie (HGPO)", glyc, "g/L", "< 0.92 g/L", parseFloat(glyc) > 0.92, "Diabète Gestationnel");
        }
    }

    if (currentSA >= 28) {
        addRow("Plaquettes", rand(150, 400), "G/L", "150 - 400");
        addRow("TP (Taux Prothrombine)", rand(80, 100), "%", "> 70%", false, "OK Anesthésie");
        let prot = sante < 20 ? "0.45" : "0.10"; 
        addRow("Protéinurie", prot, "g/24h", "< 0.30", parseFloat(prot) > 0.3, "Risque Pré-éclampsie");
    }
}

function genererEchoLogic(sante) {
    const sexe = document.getElementById('sexeFoetal').value;
    const isGemellaire = document.getElementById('isGemellaire').checked;
    const isCol = document.getElementById('measureCol').checked;
    
    let imgUrl = ECHO_IMAGES.sac;
    if (isCol) imgUrl = ECHO_IMAGES.col;
    else if (isGemellaire && ECHO_IMAGES.twins) imgUrl = ECHO_IMAGES.twins;
    else if (currentSA >= 10 && currentSA < 14) imgUrl = ECHO_IMAGES.t1;
    else if (currentSA >= 14 && currentSA < 28) imgUrl = ECHO_IMAGES.t2;
    else if (currentSA >= 28) imgUrl = ECHO_IMAGES.t3;
    
    document.getElementById('echo-img-display').src = imgUrl;
    document.getElementById('echo-label-img').innerText = isGemellaire ? "GÉMELLAIRE - " + examTypeLabel.toUpperCase() : examTypeLabel.toUpperCase();

    const list = document.getElementById('bio-list-content');
    list.innerHTML = ""; 

    if (isCol) {
        let col = sante < 50 ? rand(15, 25) : rand(30, 45);
        list.innerHTML += `<li><span>Longueur Cervicale :</span> <strong>${col} mm</strong></li>`;
        list.innerHTML += `<li><span>Orifice Interne :</span> <strong>${col < 25 ? "OUVERT" : "Fermé"}</strong></li>`;
    } else {
        const bip = currentSA > 12 ? (currentSA * 2.5) + rand(-3, 3) : 0;
        const lf = currentSA > 12 ? (currentSA * 1.8) + rand(-2, 2) : 0;
        const poids = currentSA > 12 ? (Math.pow(currentSA, 2.9) * 0.13) : 0;

        if (isGemellaire) {
            list.innerHTML += `<li style="font-weight:bold; color:#0f172a;">JUMEAU A / JUMEAU B</li>`;
            list.innerHTML += `<li><span>BIP (Tête) :</span> <strong>${bip.toFixed(1)} / ${(bip-1).toFixed(1)} mm</strong></li>`;
            list.innerHTML += `<li><span>Poids Estimé :</span> <strong>${poids.toFixed(0)} / ${(poids-50).toFixed(0)} g</strong></li>`;
        } else {
            list.innerHTML += `<li><span>BIP (Tête) :</span> <strong>${bip.toFixed(1)} mm</strong></li>`;
            list.innerHTML += `<li><span>LF (Fémur) :</span> <strong>${lf.toFixed(1)} mm</strong></li>`;
            list.innerHTML += `<li><span>Poids Estimé :</span> <strong>${poids.toFixed(0)} g</strong></li>`;
        }
    }

    const acf = rand(130, 160);
    document.getElementById('val-acf').innerText = isGemellaire ? `${acf} / ${acf-5} bpm` : `${acf} bpm`;
    document.getElementById('val-sexe').innerText = (currentSA > 14) ? sexe : "Incertain";
    document.getElementById('val-maf').innerText = "Présents";
    document.getElementById('val-poids').innerText = "Voir biométries";

    let txt = `Terme : ${currentSA} SA.\n`;
    if (isCol) txt += "Examen du col utérin réalisé.\n";
    else if (isGemellaire) txt += "Grossesse Gémellaire Bi-choriale Bi-amniotique évolutive.\n";
    else txt += "Grossesse singleton évolutive.\n";

    if (currentSA >= 41) txt += "⚠️ TERME DÉPASSÉ. Déclenchement requis.\n";
    if (sante < 50) txt += "Surveillance pathologique nécessaire.\n";
    
    document.getElementById('conclusionInput').value = txt;
}

function genererOrdonnance(sante) {
    const list = document.getElementById('ordo-list');
    list.innerHTML = "";

    // DÉBUT GROSSESSE : Vitamines
    if (currentSA < 14) list.innerHTML += "<li>Folix Acid 0.4mg (Prévention) - 1 cp/j</li>";
    if (currentSA >= 4) list.innerHTML += "<li>VitaMom (Vitamines Grossesse) - 1 cp/j</li>";

    // SYMPTÔMES COURANTS
    // Gastrol (Anti-acide) au lieu de Gaviscon
    if (currentSA > 20) list.innerHTML += "<li>Gastrol (Si aigreurs d'estomac)</li>";
    
    // Jambes lourdes
    if (currentSA > 28) list.innerHTML += "<li>Bas de Contention classe 2 (Port diurne)</li>";
    
    // Crampes (Magnésium)
    if (currentSA > 30) list.innerHTML += "<li>MagneLife B6 (Crampes/Fatigue)</li>";

    // PATHOLOGIES & COMPLICATIONS
    // Anémie : FerroMax au lieu de Tardyferon
    if (sante < 60) list.innerHTML += "<li>FerroMax 80mg (Fer) - 1 cp matin</li>";
    
    // Contractions : Spasmex au lieu de Spasfon
    if (sante < 45) list.innerHTML += "<li>Spasmex (Si contractions) - Repos strict</li>";

    // Douleurs / Fièvre (Seul le Paracétamol est autorisé)
    // Acetamax au lieu de Doliprane
    if (sante < 70) list.innerHTML += "<li>Acetamax 1g (Si douleurs/fièvre) - Max 3g/j</li>";

    // DÉPASSEMENT DE TERME
    if (currentSA >= 41) list.innerHTML += "<li><strong>Monitoring (RCF) toutes les 48h à l'hôpital</strong></li>";
}

// 3. MISE A JOUR VISUELLE
function updateReport() {
    const nom = document.getElementById('patientName').value;
    const dateNaiss = document.getElementById('patientBirth').value;
    const medecin = document.getElementById('doctorSig').value;
    const conclusion = document.getElementById('conclusionInput').value;
    
    document.getElementById('display-patient').innerText = nom || "...";
    if(dateNaiss) {
        document.getElementById('display-birth').innerText = new Date(dateNaiss).toLocaleDateString('fr-FR');
    } else {
        document.getElementById('display-birth').innerText = "...";
    }
    document.getElementById('d-sig').innerText = medecin || "...";
    document.getElementById('display-conclusion').innerText = conclusion;
    
    const obs = document.getElementById('obsHealth').value;
    const obsBlock = document.getElementById('obs-block');
    if (obs && obs.trim() !== "") {
        obsBlock.style.display = 'block';
        document.getElementById('display-obs').innerText = obs;
    } else {
        obsBlock.style.display = 'none';
    }

    const dateStr = new Date(document.getElementById('examDate').value).toLocaleDateString('fr-FR');
    document.getElementById('display-date-top').innerText = dateStr;
    document.getElementById('echo-date-display').innerText = dateStr;

    const qrData = encodeURIComponent(`OMC-OBST-${nom || "Inconnu"}-${currentSA}SA`);
    document.getElementById('qr-ref').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}&margin=1`;
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }
function formatNumber(num) { return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
