const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 

window.onload = () => {
    // Initialisation date
    document.getElementById('examDate').valueAsDate = new Date();
    updateReport();
};

let currentSA = 0; // Semaines d'aménorrhée calculées

// --- 1. LOGIQUE DE CALCUL DU TERME ---
function calculerTerme() {
    const debut = new Date(document.getElementById('dateDebut').value);
    const today = new Date(document.getElementById('examDate').value);
    
    if (!isNaN(debut)) {
        // Différence en millisecondes
        const diffTime = Math.abs(today - debut);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        currentSA = Math.floor(diffDays / 7);
        const joursRestants = diffDays % 7;

        // Mise à jour de l'affichage
        document.getElementById('display-sa').innerText = `${currentSA} SA + ${joursRestants}j`;
        
        // Calcul DPA (Date Prévue d'Accouchement) = DDR + 41 SA
        const dpa = new Date(debut);
        dpa.setDate(dpa.getDate() + (41 * 7));
        document.getElementById('display-dpa').innerText = dpa.toLocaleDateString('fr-FR');

        // Génération auto de la biologie (HCG)
        genererBiologie(currentSA);
    }
    updateReport();
}

// --- 2. LOGIQUE BIOLOGIE (BETA-HCG) ---
function genererBiologie(sa) {
    let hcg = 0;
    let ref = "";
    
    // Valeurs approximatives réalistes
    if (sa <= 4) { hcg = rand(10, 400); ref = "5 - 420 mIU/ml"; }
    else if (sa === 5) { hcg = rand(200, 7000); ref = "18 - 7,340 mIU/ml"; }
    else if (sa === 6) { hcg = rand(1000, 50000); ref = "1,080 - 56,500 mIU/ml"; }
    else if (sa >= 7 && sa <= 12) { hcg = rand(10000, 200000); ref = "7,650 - 229,000 mIU/ml"; }
    else if (sa > 12) { hcg = rand(5000, 60000); ref = "Variable (Baisse physiologique T2/T3)"; }

    document.getElementById('hcg-result').innerText = formatNumber(hcg) + " mIU/ml";
    document.getElementById('hcg-ref').innerText = ref;
    
    if (sa > 0 && sa < 4) document.getElementById('hcg-interp').innerText = "Début de grossesse possible";
    else if (sa >= 4) document.getElementById('hcg-interp').innerText = "Grossesse confirmée biologiquement";
    else document.getElementById('hcg-interp').innerText = "Négatif";
}

// --- 3. GÉNÉRATION DES MESURES ET IMAGE ---
function genererMesuresAleatoires() {
    if (currentSA === 0) { alert("Veuillez entrer une Date de Début de Grossesse d'abord."); return; }

    // -- A. L'IMAGE --
    // Pour l'instant on utilise des Placeholders avec du texte.
    // TU PEUX REMPLACER LES LIENS "https://placehold.co/..." PAR TES VRAIES IMAGES HÉBERGÉES
    let imgSrc = "assets/echo_placeholder.jpg";
    
    if (currentSA < 10) imgSrc = "https://placehold.co/600x400/000000/FFFFFF?text=SAC+GESTATIONNEL+PRECOCE"; 
    else if (currentSA < 14) imgSrc = "https://placehold.co/600x400/000000/FFFFFF?text=FOETUS+T1+PROFIL";
    else if (currentSA < 28) imgSrc = "https://placehold.co/600x400/000000/FFFFFF?text=MORPHOLOGIE+T2";
    else imgSrc = "https://placehold.co/600x400/000000/FFFFFF?text=CROISSANCE+T3+VISAGE";
    
    document.getElementById('echo-img-display').src = imgSrc;


    // -- B. LES MESURES (BIOMÉTRIES) --
    // Formules très approximatives pour le RP
    const lcc = currentSA < 14 ? (currentSA - 6) * 10 + rand(-5, 5) : 0; // Valide surtout au T1
    const bip = currentSA > 12 ? (currentSA * 2.5) + rand(-3, 3) : 0;
    const lf = currentSA > 12 ? (currentSA * 1.8) + rand(-2, 2) : 0;
    const poids = currentSA > 12 ? Math.pow(currentSA, 2.8) * 0.15 + rand(-50, 50) : 0;

    // Affichage
    document.getElementById('val-lcc').innerText = lcc > 0 ? lcc.toFixed(1) + " mm" : "Non mesurable";
    document.getElementById('val-bip').innerText = bip > 0 ? bip.toFixed(1) + " mm" : "Non mesurable";
    document.getElementById('val-lf').innerText = lf > 0 ? lf.toFixed(1) + " mm" : "Non mesurable";
    document.getElementById('val-pc').innerText = bip > 0 ? (bip * 3.14).toFixed(0) + " mm" : "-";
    document.getElementById('val-pa').innerText = bip > 0 ? ((bip-5) * 3.14).toFixed(0) + " mm" : "-";
    document.getElementById('val-poids').innerText = poids > 10 ? poids.toFixed(0) + " g" : "< 1 g";

    // Vitalité
    const bdc = document.getElementById('activiteCardiaque').checked ? rand(120, 160) : 0;
    document.getElementById('val-acf').innerText = bdc > 0 ? bdc + " bpm (Régulier)" : "ABSENTE";
    document.getElementById('val-maf').innerText = document.getElementById('mouvementsActifs').checked ? "Présents / Normaux" : "Absents";

    // Mise à jour de la conclusion auto
    let conclusion = `Grossesse mono-foetale évolutive de ${currentSA} SA.\n`;
    conclusion += `Biométries correspondant au terme (vers le ${rand(10,90)}e percentile).\n`;
    conclusion += bdc > 0 ? "Activité cardiaque visible et régulière." : "Absence d'activité cardiaque.";
    document.getElementById('conclusionInput').value = conclusion;
    updateReport();
}

function updateReport() {
    // Infos patiente
    document.getElementById('display-patient').innerText = document.getElementById('patientName').value || "...";
    const birth = document.getElementById('patientBirth').value;
    document.getElementById('display-birth').innerText = birth ? new Date(birth).toLocaleDateString('fr-FR') : "...";
    
    // Dates
    const today = document.getElementById('examDate').value;
    const dateStr = today ? new Date(today).toLocaleDateString('fr-FR') : "...";
    document.getElementById('display-date-top').innerText = dateStr;
    document.getElementById('echo-date-display').innerText = dateStr;

    // Conclusion
    document.getElementById('display-conclusion').innerText = document.getElementById('conclusionInput').value || "En attente...";

    // Signature
    document.getElementById('d-sig').innerText = document.getElementById('doctorSig').value || "...";

    // QR Code
    const qrData = encodeURIComponent(`OMC-OBST-${document.getElementById('patientName').value}-${currentSA}SA`);
    document.getElementById('qr-ref').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}&margin=1`;
}

// Utilitaires
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }
function formatNumber(num) { return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

async function genererImage() {
    const btn = event.currentTarget;
    btn.innerText = "CHARGEMENT...";
    try {
        const canvas = await html2canvas(document.getElementById('capture-zone'), { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        const formData = new FormData(); formData.append("image", imgData);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
        const json = await res.json();
        if (json.success) {
            window.open(json.data.url, '_blank');
        }
    } catch (e) { alert("Erreur ImgBB"); }
    btn.innerText = "GÉNÉRER L'IMAGE";
}
