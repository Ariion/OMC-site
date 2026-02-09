const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 

const ECHO_IMAGES = {
    sac: "https://placehold.co/600x400/000000/FFFFFF?text=SAC+GESTATIONNEL",
    t1: "https://placehold.co/600x400/000000/FFFFFF?text=PROFIL+T1",
    t2: "https://placehold.co/600x400/000000/FFFFFF?text=MORPHO+T2",
    t3: "https://placehold.co/600x400/000000/FFFFFF?text=VISAGE+T3",
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
    calculerTerme(); // Recalcul auto pour adapter le titre
}

function updateHealthColor() {
    const val = document.getElementById('santeMaman').value;
    const txt = document.getElementById('healthValue');
    txt.innerText = val + "%";
    if(val > 75) txt.style.color = "#4ade80";
    else if(val > 40) txt.style.color = "#facc15";
    else txt.style.color = "#ef4444";
}

// 1. CALCUL DU TERME ET TYPE D'EXAMEN AUTO
function calculerTerme() {
    const debut = new Date(document.getElementById('dateDebut').value);
    const today = new Date(document.getElementById('examDate').value);
    
    if (!isNaN(debut)) {
        const diffTime = Math.abs(today - debut);
        const daysIRL = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        currentSA = Math.floor(daysIRL * 0.64);
        const joursRestants = Math.floor((daysIRL * 0.64 - currentSA) * 7);

        document.getElementById('display-sa').innerText = `${currentSA} SA + ${joursRestants}j`;
        
        // Calcul DPA (41 SA)
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

        // Détermination AUTO du type d'examen
        const hasEcho = document.getElementById('toggleEcho').checked;
        if (hasEcho) {
            if (currentSA < 11) examTypeLabel = "Échographie de Datation";
            else if (currentSA >= 11 && currentSA < 14) examTypeLabel = "Échographie T1 (12 SA)";
            else if (currentSA >= 14 && currentSA < 28) examTypeLabel = "Échographie Morphologique T2";
            else if (currentSA >= 28) examTypeLabel = "Échographie Croissance T3";
        } else {
            examTypeLabel = "Consultation de Suivi Mensuel";
        }
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

// 2. BIOLOGIE ÉVOLUTIVE (CUMULATIVE)
function genererBiologieEvolutive(sante) {
    const tbody = document.getElementById('bio-tbody');
    tbody.innerHTML = ""; 
    const bloodGroup = document.getElementById('bloodGroup').value || "Non renseigné";

    const addRow = (nom, res, unit, ref, isBad = false, comment = "") => {
        const row = document.createElement('tr');
        row.innerHTML = `<td><strong>${nom}</strong></td><td class="${isBad ? 'result-bad' : 'result-good'}">${res} ${unit}</td><td style="color:#64748b; font-size:10px;">${ref}</td><td style="font-style:italic;">${isBad ? '⚠️ ' + comment : 'Normal'}</td>`;
        tbody.appendChild(row);
    };

    // --- TOUJOURS AFFICHER ---
    addRow("Groupe Sanguin / Rhésus", bloodGroup, "", "Info Patient");

    // --- DÉBUT DE GROSSESSE (T1 & Avant) ---
    if (currentSA > 0) {
        let hcg = rand(20000, 150000);
        if (currentSA > 14) hcg = rand(10000, 50000); // Baisse physiologique
        addRow("Beta-hCG Plasmatique", formatNumber(hcg), "mIU/ml", "Variable selon terme");
        
        const toxo = sante < 30 ? "IgM POSITIF" : "Négatif";
        addRow("Sérologie Toxoplasmose", toxo, "", "Négatif", toxo.includes("POSITIF"), "Primo-infection ?");
        addRow("Sérologie Rubéole", "Immunisée", "", "Immunisée");
    }

    // --- MILIEU DE GROSSESSE (T2 : 15-28 SA) ---
    // On ajoute NFS et Glycémie
    if (currentSA >= 15) {
        let hemo = sante < 60 ? rand(95, 105) : rand(115, 130);
        addRow("Hémoglobine (NFS)", hemo, "g/L", "> 110 g/L", hemo < 110, "Anémie gravidique");
        
        let glycemie = sante < 40 ? "1.35" : "0.85";
        addRow("Glycémie à jeun", glycemie, "g/L", "< 0.92 g/L", parseFloat(glycemie) > 0.92, "Diabète Gestationnel");
    }

    // --- FIN DE GROSSESSE (T3 : > 28 SA) ---
    // On ajoute Coagulation et Albuminurie
    if (currentSA >= 28) {
        let plaq = rand(150, 400);
        addRow("Plaquettes", plaq, "G/L", "150 - 400 G/L");
        
        let tp = rand(80, 100);
        addRow("Taux de Prothrombine (TP)", tp, "%", "> 70%", false, "Bilan anesthésie OK");

        let prot = sante < 20 ? "0.45" : "0.10"; 
        addRow("Protéinurie", prot, "g/24h", "< 0.30", parseFloat(prot) > 0.3, "Risque Pré-éclampsie");
    }
}

// 3. ECHOGRAPHIE AUTO
function genererEchoLogic(sante) {
    const sexe = document.getElementById('sexeFoetal').value;
    
    // Choix image selon terme
    let imgUrl = ECHO_IMAGES.sac;
    if (currentSA >= 10 && currentSA < 14) imgUrl = ECHO_IMAGES.t1;
    else if (currentSA >= 14 && currentSA < 28) imgUrl = ECHO_IMAGES.t2;
    else if (currentSA >= 28) imgUrl = ECHO_IMAGES.t3;
    
    document.getElementById('echo-img-display').src = imgUrl;
    document.getElementById('echo-label-img').innerText = examTypeLabel.toUpperCase();

    // Miniatures
    document.getElementById('thumb-1').src = ECHO_IMAGES.femur;
    document.getElementById('thumb-2').src = ECHO_IMAGES.abdo;
    document.getElementById('thumb-3').src = ECHO_IMAGES.cerveau;

    // Biométries
    const list = document.getElementById('bio-list-content');
    list.innerHTML = ""; 

    if (currentSA < 10) {
        list.innerHTML = "<li><span>Sac Gestationnel :</span> <strong>Visible intra-utérin</strong></li>";
    } else {
        const bip = currentSA > 12 ? (currentSA * 2.5) + rand(-3, 3) : 0;
        const lf = currentSA > 12 ? (currentSA * 1.8) + rand(-2, 2) : 0;
        const poids = currentSA > 12 ? (Math.pow(currentSA, 2.9) * 0.13 + rand(-50, 50)) : 0;

        list.innerHTML += `<li><span>BIP (Tête) :</span> <strong>${bip.toFixed(1)} mm</strong></li>`;
        list.innerHTML += `<li><span>LF (Fémur) :</span> <strong>${lf.toFixed(1)} mm</strong></li>`;
        list.innerHTML += `<li><span>PC (Périm. Tête) :</span> <strong>${(bip * 3.14).toFixed(0)} mm</strong></li>`;
        list.innerHTML += `<li><span>PA (Abdo) :</span> <strong>${(bip * 2.8).toFixed(0)} mm</strong></li>`;
        
        document.getElementById('val-poids').innerText = poids > 10 ? poids.toFixed(0) + " g" : "-";
    }

    // Vitalité
    document.getElementById('val-acf').innerText = rand(130, 160) + " bpm";
    document.getElementById('val-sexe').innerText = (currentSA > 14) ? sexe : "Incertain";
    document.getElementById('val-maf').innerText = "Présents";
    
    // Conclusion
    let txt = `Grossesse évolutive de ${currentSA} SA.\n`;
    if (currentSA > 14 && sexe !== "Indéterminé") txt += `Foetus de sexe ${sexe.toUpperCase()}.\n`;
    if (sante < 50) txt += "⚠️ Surveillance accrue nécessaire (Biologie perturbée).";
    else txt += "Développement staturo-pondéral satisfaisant.";
    
    document.getElementById('conclusionInput').value = txt;
}

// 4. ORDONNANCE AUTO
function genererOrdonnance(sante) {
    const list = document.getElementById('ordo-list');
    list.innerHTML = "";

    if (currentSA < 14) list.innerHTML += "<li>Acide Folique 0.4mg (1cp/jour)</li><li>Vitamines Grossesse</li>";
    if (currentSA >= 14 && sante < 60) list.innerHTML += "<li>Tardyferon 80mg (Fer)</li>";
    if (currentSA >= 28) list.innerHTML += "<li>Rendez-vous Anesthésiste (Péridurale)</li>";
    if (currentSA >= 41) list.innerHTML = "<li>Monitoring toutes les 48h à l'hôpital</li><li>Déclenchement J+4</li>";
}

function updateReport() {
    document.getElementById('display-patient').innerText = document.getElementById('patientName').value || "...";
    document.getElementById('display-birth').innerText = document.getElementById('patientBirth').value || "...";
    document.getElementById('d-sig').innerText = document.getElementById('doctorSig').value || "...";
    document.getElementById('display-conclusion').innerText = document.getElementById('conclusionInput').value;
    
    const dateStr = new Date(document.getElementById('examDate').value).toLocaleDateString('fr-FR');
    document.getElementById('display-date-top').innerText = dateStr;
    document.getElementById('echo-date-display').innerText = dateStr;

    const nom = document.getElementById('patientName').value || "Inconnu";
    const qrData = encodeURIComponent(`OMC-OBST-${nom}-${currentSA}SA`);
    document.getElementById('qr-ref').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}&margin=1`;
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }
function formatNumber(num) { return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

async function genererImage() {
    const btn = event.currentTarget;
    window.scrollTo(0,0);
    btn.innerText = "CHARGEMENT...";
    
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
