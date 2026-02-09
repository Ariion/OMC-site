const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 

// Base d'images (Placeholders pour l'instant)
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
    toggleSections(); // Init l'affichage
};

let currentSA = 0;

function toggleSections() {
    const showBio = document.getElementById('toggleBio').checked;
    const showEcho = document.getElementById('toggleEcho').checked;

    document.getElementById('section-bio').style.display = showBio ? 'block' : 'none';
    document.getElementById('section-echo').style.display = showEcho ? 'block' : 'none';
}

function updateHealthColor() {
    const val = document.getElementById('santeMaman').value;
    const txt = document.getElementById('healthValue');
    txt.innerText = val + "%";
    if(val > 75) txt.style.color = "#4ade80";
    else if(val > 40) txt.style.color = "#facc15";
    else txt.style.color = "#ef4444";
}

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
        dpa.setDate(dpa.getDate() + 64); // +64 jours IRL (environ 9 mois RP)
        document.getElementById('display-dpa').innerText = dpa.toLocaleDateString('fr-FR');

        genererTout();
    }
}

function genererTout() {
    const sante = parseInt(document.getElementById('santeMaman').value);
    genererBiologieComplete(sante);
    genererEchoStats(sante);
    updateConclusionDynamic(); // Génère le texte
    updateReport(); // Affiche tout
}

function genererBiologieComplete(sante) {
    const tbody = document.getElementById('bio-tbody');
    tbody.innerHTML = ""; 

    const addRow = (nom, res, unit, ref, isBad = false, comment = "") => {
        const row = document.createElement('tr');
        row.innerHTML = `<td><strong>${nom}</strong></td><td class="${isBad ? 'result-bad' : 'result-good'}">${res} ${unit}</td><td style="color:#64748b; font-size:10px;">${ref}</td><td style="font-style:italic;">${isBad ? '⚠️ ' + comment : 'Normal'}</td>`;
        tbody.appendChild(row);
    };

    let hcg = currentSA <= 4 ? rand(50, 500) : (currentSA <= 12 ? rand(10000, 200000) : rand(20000, 60000));
    addRow("Beta-hCG Plasmatique", formatNumber(hcg), "mIU/ml", "Variable selon terme");

    if (currentSA > 4) {
        addRow("Sérologie Toxoplasmose", sante < 30 ? "POSITIF (IgM+)" : "Négatif", "", "Négatif", sante < 30, "Infection suspectée");
        addRow("Sérologie Rubéole", "Immunisée", "", "Immunisée");
    }
    
    if (currentSA > 12) {
        let hemo = sante < 60 ? rand(90, 105) : rand(115, 135);
        addRow("Hémoglobine", hemo, "g/L", "> 110 g/L", hemo < 110, "Anémie");
    }
}

function genererEchoStats(sante) {
    // Images
    let mainImg = ECHO_IMAGES.sac;
    let label = "SAC GESTATIONNEL";
    
    if (currentSA >= 10 && currentSA < 14) { mainImg = ECHO_IMAGES.t1; label = "PROFIL T1"; }
    else if (currentSA >= 14 && currentSA < 28) { mainImg = ECHO_IMAGES.t2; label = "MORPHO T2"; }
    else if (currentSA >= 28) { mainImg = ECHO_IMAGES.t3; label = "CROISSANCE T3"; }

    document.getElementById('echo-img-display').src = mainImg;
    document.getElementById('echo-label-img').innerText = label;

    // Miniatures
    document.getElementById('thumb-1').src = ECHO_IMAGES.femur;
    document.getElementById('thumb-2').src = ECHO_IMAGES.abdo;
    document.getElementById('thumb-3').src = ECHO_IMAGES.cerveau;

    // Mesures aléatoires
    const lcc = currentSA < 14 ? (currentSA - 5) * 10 + rand(-5, 5) : 0; 
    const bip = currentSA > 12 ? (currentSA * 2.5) + rand(-3, 3) : 0;
    const lf = currentSA > 12 ? (currentSA * 1.8) + rand(-2, 2) : 0;
    const poids = currentSA > 12 ? (Math.pow(currentSA, 2.9) * 0.13 + rand(-50, 50)) : 0;

    document.getElementById('val-lcc').innerText = lcc > 0 ? lcc.toFixed(1) + " mm" : "-";
    document.getElementById('val-bip').innerText = bip > 0 ? bip.toFixed(1) + " mm" : "-";
    document.getElementById('val-lf').innerText = lf > 0 ? lf.toFixed(1) + " mm" : "-";
    document.getElementById('val-pc').innerText = bip > 0 ? (bip * 3.14).toFixed(0) + " mm" : "-";
    document.getElementById('val-pa').innerText = bip > 0 ? ((bip-5) * 3.14).toFixed(0) + " mm" : "-";
    document.getElementById('val-poids').innerText = poids > 10 ? poids.toFixed(0) + " g" : "-";
    
    document.getElementById('val-acf').innerText = rand(130, 160) + " bpm";
    document.getElementById('val-maf').innerText = "Présents";
}

// Fonction appelée quand on change un dropdown pour mettre à jour le texte SANS changer les chiffres
function updateConclusionDynamic() {
    const sexe = document.getElementById('sexeFoetal').value;
    const typeEx = document.getElementById('echoType').value;
    const sante = parseInt(document.getElementById('santeMaman').value);

    // Mise à jour visuelle des champs
    document.getElementById('val-sexe').innerText = (currentSA > 14) ? sexe : "Non visible";
    document.getElementById('echo-label-img').innerText = typeEx.toUpperCase();

    // Génération Conclusion
    let txt = `Grossesse mono-foetale évolutive de ${currentSA} SA.\n`;
    txt += `Examen réalisé : ${typeEx}.\n`;
    
    if (currentSA > 14 && sexe !== "Indéterminé") txt += `Foetus de sexe ${sexe.toUpperCase()}.\n`;
    
    if (sante > 80) txt += "Biométries et vitalité dans les normes. Pas de particularité.";
    else if (sante > 50) txt += "État général satisfaisant. Surveillance standard.";
    else txt += "⚠️ SURVEILLANCE ACCRUE REQUISE (Pathologie maternelle/foetale suspectée).";

    document.getElementById('conclusionInput').value = txt;
    updateReport();
}

function updateReport() {
    document.getElementById('display-patient').innerText = document.getElementById('patientName').value || "...";
    document.getElementById('display-birth').innerText = document.getElementById('patientBirth').value || "...";
    
    const today = document.getElementById('examDate').value;
    document.getElementById('display-date-top').innerText = today;
    document.getElementById('echo-date-display').innerText = today;
    document.getElementById('d-sig').innerText = document.getElementById('doctorSig').value || "...";
    document.getElementById('display-conclusion').innerText = document.getElementById('conclusionInput').value;

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
    try {
        const canvas = await html2canvas(document.getElementById('capture-zone'), { scale: 2, useCORS: true, scrollY: -window.scrollY });
        const imgData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        const formData = new FormData(); formData.append("image", imgData);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
        const json = await res.json();
        if (json.success) {
            document.getElementById('preview-img-result').src = json.data.url;
            document.getElementById('direct-link').value = json.data.url;
            document.getElementById('image-popup').style.display = 'flex';
        }
    } catch (e) { alert("Erreur ImgBB"); }
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
