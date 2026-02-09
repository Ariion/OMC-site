const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282";  

const ECHO_IMAGES = {
    sac: "https://placehold.co/600x400/000000/FFFFFF?text=SAC+GESTATIONNEL",
    t1: "https://placehold.co/600x400/000000/FFFFFF?text=PROFIL+T1",
    t2: "https://placehold.co/600x400/000000/FFFFFF?text=MORPHO+T2",
    t3: "https://placehold.co/600x400/000000/FFFFFF?text=VISAGE+T3",
    col: "https://placehold.co/600x400/000000/FFFFFF?text=MESURE+COL",
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
let examTypeLabel = "Standard";

function toggleSections() {
    const showBio = document.getElementById('toggleBio').checked;
    const showEcho = document.getElementById('toggleEcho').checked;
    const showOrdo = document.getElementById('toggleOrdo').checked;

    document.getElementById('section-bio').style.display = showBio ? 'block' : 'none';
    document.getElementById('section-echo').style.display = showEcho ? 'block' : 'none';
    document.getElementById('section-ordo').style.display = showOrdo ? 'block' : 'none';
    calculerTerme();
}

function updateHealthColor() {
    const val = document.getElementById('santeMaman').value;
    const txt = document.getElementById('healthValue');
    txt.innerText = val + "%";
    if(val > 75) txt.style.color = "#4ade80";
    else if(val > 40) txt.style.color = "#facc15";
    else txt.style.color = "#ef4444";
}

// 1. CALCUL DU TERME ET LOGIQUE PRINCIPALE
function calculerTerme() {
    const debut = new Date(document.getElementById('dateDebut').value);
    const today = new Date(document.getElementById('examDate').value);
    
    if (!isNaN(debut)) {
        const diffTime = Math.abs(today - debut);
        const daysIRL = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        currentSA = Math.floor(daysIRL * 0.64);
        const joursRestants = Math.floor((daysIRL * 0.64 - currentSA) * 7);

        document.getElementById('display-sa').innerText = `${currentSA} SA + ${joursRestants}j`;
        
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

        // Type Examen Auto
        const isCol = document.getElementById('measureCol').checked;
        if (isCol) examTypeLabel = "Mesure du Col (Urgence)";
        else if (currentSA < 11) examTypeLabel = "Échographie de Datation";
        else if (currentSA >= 11 && currentSA < 14) examTypeLabel = "Échographie T1 (12 SA)";
        else if (currentSA >= 14 && currentSA < 28) examTypeLabel = "Échographie Morphologique T2";
        else examTypeLabel = "Échographie Croissance T3";
        
        document.getElementById('exam-type-auto').innerText = examTypeLabel;

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

// 2. BIOLOGIE ÉVOLUTIVE (HCG RÉALISTE)
function genererBiologieEvolutive(sante) {
    const tbody = document.getElementById('bio-tbody');
    tbody.innerHTML = ""; 
    const bloodGroup = document.getElementById('bloodGroup').value || "Non renseigné";

    const addRow = (nom, res, unit, ref, isBad = false, comment = "") => {
        const row = document.createElement('tr');
        row.innerHTML = `<td><strong>${nom}</strong></td><td class="${isBad ? 'result-bad' : 'result-good'}">${res} ${unit}</td><td style="color:#64748b; font-size:10px;">${ref}</td><td style="font-style:italic;">${isBad ? '⚠️ ' + comment : 'Normal'}</td>`;
        tbody.appendChild(row);
    };

    addRow("Groupe Sanguin / Rhésus", bloodGroup, "", "Info Patient");

    // HCG RÉALISTE (Tableau de référence approx)
    let hcg = 0; let normHcg = "";
    if (currentSA <= 3) { hcg = rand(10, 50); normHcg = "10 - 50"; }
    else if (currentSA <= 4) { hcg = rand(50, 500); normHcg = "50 - 500"; }
    else if (currentSA <= 5) { hcg = rand(500, 5000); normHcg = "100 - 5000"; }
    else if (currentSA <= 6) { hcg = rand(5000, 50000); normHcg = "1000 - 50000"; }
    else if (currentSA <= 12) { hcg = rand(50000, 200000); normHcg = "Pic maximal (T1)"; }
    else { hcg = rand(20000, 60000); normHcg = "Baisse physiologique T2/T3"; }
    
    if (currentSA > 0) addRow("Beta-hCG Plasmatique", formatNumber(hcg), "mIU/ml", normHcg);

    // T1 : Sérologies
    if (currentSA > 4 && currentSA <= 20) {
        const toxo = sante < 30 ? "IgM POSITIF" : "Négatif";
        addRow("Sérologie Toxoplasmose", toxo, "", "Négatif", toxo.includes("POSITIF"), "Infection active");
        addRow("Sérologie Rubéole", "Immunisée", "", "Immunisée");
    }

    // T2 : NFS & Diabète
    if (currentSA > 14) {
        let hemo = sante < 60 ? rand(95, 105) : rand(115, 130);
        addRow("Hémoglobine (NFS)", hemo, "g/L", "> 110 g/L", hemo < 110, "Anémie gravidique");
        
        if (currentSA > 20) {
            let glyc = sante < 40 ? "1.35" : "0.85";
            addRow("Glycémie (HGPO)", glyc, "g/L", "< 0.92 g/L", parseFloat(glyc) > 0.92, "Diabète Gestationnel");
        }
    }

    // T3 : Coagulation & Urine
    if (currentSA >= 28) {
        addRow("Plaquettes", rand(150, 400), "G/L", "150 - 400");
        addRow("TP (Taux Prothrombine)", rand(80, 100), "%", "> 70%", false, "OK Anesthésie");
        
        let prot = sante < 20 ? "0.45" : "0.10"; 
        addRow("Protéinurie", prot, "g/24h", "< 0.30", parseFloat(prot) > 0.3, "Risque Pré-éclampsie");
    }
}

// 3. ECHOGRAPHIE LOGIC (JUMEAUX + COL)
function genererEchoLogic(sante) {
    const sexe = document.getElementById('sexeFoetal').value;
    const isGemellaire = document.getElementById('isGemellaire').checked;
    const isCol = document.getElementById('measureCol').checked;
    
    // Images
    let imgUrl = ECHO_IMAGES.sac;
    if (isCol) imgUrl = ECHO_IMAGES.col;
    else if (currentSA >= 10 && currentSA < 14) imgUrl = ECHO_IMAGES.t1;
    else if (currentSA >= 14 && currentSA < 28) imgUrl = ECHO_IMAGES.t2;
    else if (currentSA >= 28) imgUrl = ECHO_IMAGES.t3;
    
    document.getElementById('echo-img-display').src = imgUrl;
    document.getElementById('echo-label-img').innerText = isGemellaire ? "GÉMELLAIRE - " + examTypeLabel.toUpperCase() : examTypeLabel.toUpperCase();

    // Biométries
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

    // Vitalité
    const acf = rand(130, 160);
    document.getElementById('val-acf').innerText = isGemellaire ? `${acf} / ${acf-5} bpm` : `${acf} bpm`;
    document.getElementById('val-sexe').innerText = (currentSA > 14) ? sexe : "Incertain";
    document.getElementById('val-maf').innerText = "Présents";
    document.getElementById('val-poids').innerText = "Voir biométries";

    // Conclusion Auto
    let txt = `Terme : ${currentSA} SA.\n`;
    if (isCol) txt += "Examen du col utérin réalisé.\n";
    else if (isGemellaire) txt += "Grossesse Gémellaire Bi-choriale Bi-amniotique évolutive.\n";
    else txt += "Grossesse singleton évolutive.\n";

    if (currentSA >= 41) txt += "⚠️ TERME DÉPASSÉ. Déclenchement requis.\n";
    if (sante < 50) txt += "Surveillance pathologique nécessaire.\n";
    
    document.getElementById('conclusionInput').value = txt;
}

// 4. ORDONNANCE COMPLÈTE
function genererOrdonnance(sante) {
    const list = document.getElementById('ordo-list');
    list.innerHTML = "";

    // Base
    if (currentSA < 14) list.innerHTML += "<li>Acide Folique 0.4mg (1 cp/j)</li>";
    if (currentSA >= 4) list.innerHTML += "<li>Gestarelle / Vitamines Grossesse (1 cp/j)</li>";

    // Symptômes courants
    if (currentSA > 20) list.innerHTML += "<li>Gaviscon (Si aigreurs d'estomac)</li>";
    if (currentSA > 28) list.innerHTML += "<li>Bas de Contention classe 2 (Port diurne)</li>";
    if (currentSA > 30) list.innerHTML += "<li>Magnésium B6 (Crampes/Fatigue)</li>";

    // Pathologie
    if (sante < 60) list.innerHTML += "<li>Tardyferon 80mg (Fer) - 1 cp matin</li>";
    if (sante < 40) list.innerHTML += "<li>Spasfon (Si contractions) - Repos strict</li>";

    // Dépassement
    if (currentSA >= 41) list.innerHTML += "<li><strong>Monitoring (RCF) toutes les 48h</strong></li>";
}

function updateReport() {
    document.getElementById('display-patient').innerText = document.getElementById('patientName').value || "...";
    document.getElementById('display-birth').innerText = document.getElementById('patientBirth').value || "...";
    document.getElementById('d-sig').innerText = document.getElementById('doctorSig').value || "...";
    document.getElementById('display-conclusion').innerText = document.getElementById('conclusionInput').value;
    
    // Affichage Observation
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

    const nom = document.getElementById('patientName').value || "Inconnu";
    const qrData = encodeURIComponent(`OMC-OBST-${nom}-${currentSA}SA`);
    document.getElementById('qr-ref').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}&margin=1`;
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }
function formatNumber(num) { return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

// --- EXPORT IMAGE ---
async function genererImage() {
    const btn = event.currentTarget;
    window.scrollTo(0,0);
    btn.innerText = "CHARGEMENT...";
    
    const captureZone = document.getElementById('capture-zone');
    const originalHeight = captureZone.style.height;
    captureZone.style.height = captureZone.scrollHeight + "px"; // Force full height capture

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
    
    captureZone.style.height = originalHeight; 
    btn.innerText = "GÉNÉRER L'IMAGE";
}

async function envoyerDiscord() {
    const url = "https://discord.com/api/webhooks/1421780761731928194/ZFSpiLTHfytIGT02QBf5SBOIEDzWMaf_PMHtDB9sd-GmF5chHnQqQic-9YpLnYHJIRPo";
    try {
        window.scrollTo(0,0);
        const canvas = await html2canvas(document.getElementById('capture-zone'), { scale: 2, useCORS: true });
        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            const nom = document.getElementById('patientName').value || "Inconnu";
            formData.append("payload_json", JSON.stringify({
                thread_name: `Obstétrique - ${nom}`,
                content: `🤰 **Nouveau Dossier Obstétrique** : ${nom}`
            }));
            formData.append("file", blob, `grossesse_${nom}.png`);
            await fetch(url + "?wait=true", { method: 'POST', body: formData });
            alert("✅ Dossier envoyé !");
        }, 'image/png');
    } catch (e) { alert("Erreur Discord"); }
}

function copyLink() { navigator.clipboard.writeText(document.getElementById("direct-link").value); alert("Copié !"); }
function closePopup() { document.getElementById('image-popup').style.display = 'none'; }
