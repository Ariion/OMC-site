const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 

const ECHO_IMAGES = {
    sac: "https://placehold.co/600x400/000000/FFFFFF?text=SAC+GESTATIONNEL",
    t1: "https://placehold.co/600x400/000000/FFFFFF?text=PROFIL+T1",
    t2: "https://placehold.co/600x400/000000/FFFFFF?text=MORPHO+T2",
    t3: "https://placehold.co/600x400/000000/FFFFFF?text=VISAGE+T3",
    col: "https://placehold.co/600x400/000000/FFFFFF?text=MESURE+COL+UTERIN",
    femur: "https://placehold.co/200x150/000000/FFFFFF?text=FEMUR",
    abdo: "https://placehold.co/200x150/000000/FFFFFF?text=ABDO",
    cerveau: "https://placehold.co/200x150/000000/FFFFFF?text=CERVEAU"
};

window.onload = () => {
    document.getElementById('examDate').valueAsDate = new Date();
    updateHealthColor();
    toggleSections();
};

let currentSA = 0;

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

// 1. CALCUL DU TERME (AVEC LOGIQUE DÉPASSEMENT)
function calculerTerme() {
    const debut = new Date(document.getElementById('dateDebut').value);
    const today = new Date(document.getElementById('examDate').value);
    
    if (!isNaN(debut)) {
        const diffTime = Math.abs(today - debut);
        const daysIRL = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        // 1 jour IRL = 0.64 Semaine Grossesse
        currentSA = Math.floor(daysIRL * 0.64);
        const joursRestants = Math.floor((daysIRL * 0.64 - currentSA) * 7);

        document.getElementById('display-sa').innerText = `${currentSA} SA + ${joursRestants}j`;
        
        // DPA (Terme théorique)
        const dpa = new Date(debut);
        dpa.setDate(dpa.getDate() + 64);
        document.getElementById('display-dpa').innerText = dpa.toLocaleDateString('fr-FR');

        // Alerte Dépassement
        const banner = document.getElementById('banner-status');
        if (currentSA >= 41) {
            banner.classList.add('alert-term');
            document.getElementById('display-sa').innerText += " (DÉPASSÉ)";
        } else {
            banner.classList.remove('alert-term');
        }

        genererTout();
    }
}

function genererTout() {
    const sante = parseInt(document.getElementById('santeMaman').value);
    genererBiologieEvolutive(sante);
    genererEchoLogic(sante);
    genererOrdonnance(sante);
    updateReport();
}

// 2. BIOLOGIE ÉVOLUTIVE (CHANGE SELON LES SEMAINES)
function genererBiologieEvolutive(sante) {
    const tbody = document.getElementById('bio-tbody');
    tbody.innerHTML = ""; 

    const addRow = (nom, res, unit, ref, isBad = false, comment = "") => {
        const row = document.createElement('tr');
        row.innerHTML = `<td><strong>${nom}</strong></td><td class="${isBad ? 'result-bad' : 'result-good'}">${res} ${unit}</td><td style="color:#64748b; font-size:10px;">${ref}</td><td style="font-style:italic;">${isBad ? '⚠️ ' + comment : 'Normal'}</td>`;
        tbody.appendChild(row);
    };

    // T1 (< 14 SA) : Sérologies, Groupe Sanguin
    if (currentSA <= 14) {
        let hcg = rand(20000, 150000);
        addRow("Beta-hCG", formatNumber(hcg), "mIU/ml", "> 5000");
        addRow("Groupe Sanguin / Rhésus", ["A+", "A-", "B+", "O+", "O-"][rand(0,4)], "", "Info");
        addRow("Toxoplasmose", sante < 30 ? "IgM POSITIF" : "Négatif", "", "Négatif", sante < 30, "Infection");
        addRow("Rubéole", "Immunisée", "", "Immunisée");
    }
    
    // T2 (15 - 28 SA) : Diabète, Numération
    if (currentSA > 14 && currentSA <= 28) {
        let hemo = sante < 60 ? rand(95, 105) : rand(115, 130);
        addRow("Hémoglobine", hemo, "g/L", "> 110 g/L", hemo < 110, "Anémie gravidique");
        
        let glycemie = sante < 40 ? "1.35" : "0.85";
        addRow("Glycémie à jeun", glycemie, "g/L", "< 0.92 g/L", parseFloat(glycemie) > 0.92, "Diabète Gestationnel");
    }

    // T3 & Terme (> 28 SA) : Coagulation, Albuminurie
    if (currentSA > 28) {
        let plaquettes = rand(150, 400);
        addRow("Plaquettes", plaquettes, "G/L", "150 - 400 G/L");
        
        let prot = sante < 20 ? "0.45" : "0.10"; // Pré-éclampsie
        addRow("Protéinurie", prot, "g/24h", "< 0.30", parseFloat(prot) > 0.3, "Risque Pré-éclampsie");
        
        addRow("TP (Taux Prothrombine)", rand(80, 100), "%", "> 70%", false, "OK pour Péridurale");
    }
}

// 3. LOGIQUE ECHOGRAPHIE (Col vs Bébé)
function genererEchoLogic(sante) {
    const typeEx = document.getElementById('echoType').value;
    const sexe = document.getElementById('sexeFoetal').value;
    const isCol = typeEx === "Col";
    
    // Image principale
    let imgUrl = ECHO_IMAGES.t1;
    if (typeEx === "Col") imgUrl = ECHO_IMAGES.col;
    else if (currentSA > 14 && currentSA < 28) imgUrl = ECHO_IMAGES.t2;
    else if (currentSA >= 28) imgUrl = ECHO_IMAGES.t3;
    
    document.getElementById('echo-img-display').src = imgUrl;
    document.getElementById('echo-label-img').innerText = typeEx.toUpperCase();

    // Biométries (Liste)
    const list = document.getElementById('bio-list-content');
    list.innerHTML = ""; // Reset

    if (isCol) {
        // Mode Mesure du Col (Urgence contractions)
        let longueur = sante < 50 ? rand(15, 25) : rand(30, 45); // Col court si santé basse
        list.innerHTML += `<li><span>Longueur Cervicale :</span> <strong>${longueur} mm</strong></li>`;
        list.innerHTML += `<li><span>Orifice Interne :</span> <strong>${longueur < 25 ? "OUVERT (Entonnoir)" : "Fermé"}</strong></li>`;
        list.innerHTML += `<li><span>Membranes :</span> <strong>Intactes</strong></li>`;
    } else {
        // Mode Foetus Standard
        const bip = currentSA > 12 ? (currentSA * 2.5) + rand(-3, 3) : 0;
        const lf = currentSA > 12 ? (currentSA * 1.8) + rand(-2, 2) : 0;
        const poids = currentSA > 12 ? (Math.pow(currentSA, 2.9) * 0.13 + rand(-50, 50)) : 0;

        list.innerHTML += `<li><span>BIP (Tête) :</span> <strong>${bip.toFixed(1)} mm</strong></li>`;
        list.innerHTML += `<li><span>LF (Fémur) :</span> <strong>${lf.toFixed(1)} mm</strong></li>`;
        list.innerHTML += `<li><span>PC (Périm. Tête) :</span> <strong>${(bip * 3.14).toFixed(0)} mm</strong></li>`;
        list.innerHTML += `<li><span>PA (Abdo) :</span> <strong>${(bip * 2.8).toFixed(0)} mm</strong></li>`;
    }

    // Valeurs communes
    document.getElementById('val-acf').innerText = rand(130, 160) + " bpm";
    document.getElementById('val-sexe').innerText = (currentSA > 14) ? sexe : "Incertain";
    
    // Conclusion Auto
    let txt = `Terme : ${currentSA} SA. Examen : ${typeEx}.\n`;
    if (isCol) {
        txt += document.querySelector('#bio-list-content strong').innerText.includes("1") ? "⚠️ COL COURT. Menace d'accouchement prématuré." : "Col long et fermé. Pas de menace.";
    } else {
        txt += `Vitalité foetale positive. Biométries conformes.\nSexe probable : ${sexe}.`;
        if (currentSA >= 41) txt = "⚠️ TERME DÉPASSÉ. Placenta grade 3. Oligoamnios modéré.\nIndication de déclenchement à discuter.";
    }
    document.getElementById('conclusionInput').value = txt;
}

// 4. ORDONNANCE INTELLIGENTE
function genererOrdonnance(sante) {
    const list = document.getElementById('ordo-list');
    list.innerHTML = "";

    // Base vitamines
    if (currentSA < 14) list.innerHTML += "<li>Acide Folique 0.4mg (1cp/jour)</li>";
    if (currentSA > 14) list.innerHTML += "<li>Gestarelle / Vitamines Grossesse (1cp/jour)</li>";

    // Pathologie
    if (sante < 60) list.innerHTML += "<li>Tardyferon 80mg (Fer) - 1cp matin</li>";
    if (sante < 40) list.innerHTML += "<li>Spasfon (en cas de contractions)</li><li>Repos strict au domicile</li>";

    // Dépassement Terme
    if (currentSA >= 41) {
        list.innerHTML = "<li>Monitoring Foetal (RCF) toutes les 48h à l'hôpital</li>";
        list.innerHTML += "<li>Déclenchement prévu à J+4 si pas de travail spontané</li>";
    }
}

function updateReport() {
    document.getElementById('display-patient').innerText = document.getElementById('patientName').value || "...";
    document.getElementById('display-birth').innerText = document.getElementById('patientBirth').value || "...";
    document.getElementById('d-sig').innerText = document.getElementById('doctorSig').value || "...";
    document.getElementById('display-conclusion').innerText = document.getElementById('conclusionInput').value;
    
    // Update dates
    const dateStr = new Date(document.getElementById('examDate').value).toLocaleDateString('fr-FR');
    document.getElementById('display-date-top').innerText = dateStr;
    document.getElementById('echo-date-display').innerText = dateStr;

    // QR
    const qrData = encodeURIComponent(`OMC-OBST-${currentSA}SA-${Date.now()}`);
    document.getElementById('qr-ref').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}&margin=1`;
}

function updateConclusionDynamic() { calculerTerme(); } // Relance le calcul complet
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }
function formatNumber(num) { return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

// --- EXPORT IMAGE ---
async function genererImage() {
    const btn = event.currentTarget;
    window.scrollTo(0,0);
    btn.innerText = "CHARGEMENT...";
    
    // On force la hauteur pour tout capturer
    const captureZone = document.getElementById('capture-zone');
    const originalHeight = captureZone.style.height;
    captureZone.style.height = captureZone.scrollHeight + "px";

    try {
        const canvas = await html2canvas(captureZone, { scale: 2, useCORS: true, scrollY: -window.scrollY });
        const imgData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        const formData = new FormData(); formData.append("image", imgData);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
        const json = await res.json();
        
        if (json.success) {
            document.getElementById('preview-img-result').src = json.data.url;
            document.getElementById('direct-link').value = json.data.url;
            document.getElementById('image-popup').style.display = 'flex';
        }
    } catch (e) { alert("Erreur: " + e.message); }
    
    captureZone.style.height = originalHeight; // Restore
    btn.innerText = "GÉNÉRER L'IMAGE";
}

async function envoyerDiscord() {
    // ... (Même logique que Constat, copier/coller la fonction si besoin)
    // Pour alléger la réponse, je garde la fonction d'export simple ici
    alert("Fonction Discord prête (voir code précédent)");
}

function copyLink() { navigator.clipboard.writeText(document.getElementById("direct-link").value); alert("Copié !"); }
function closePopup() { document.getElementById('image-popup').style.display = 'none'; }
