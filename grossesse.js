const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 

// Placeholders d'images par stade (Tu peux remplacer les URL)
const ECHO_IMAGES = {
    sac: "https://placehold.co/600x400/000000/FFFFFF?text=SAC+GESTATIONNEL",
    t1: "https://placehold.co/600x400/000000/FFFFFF?text=FOETUS+T1+(PROFIL)",
    t2: "https://placehold.co/600x400/000000/FFFFFF?text=MORPHOLOGIE+T2",
    t3: "https://placehold.co/600x400/000000/FFFFFF?text=CROISSANCE+T3+(VISAGE)",
    sexe: "https://placehold.co/600x400/000000/FFFFFF?text=TUBERCULE+GENITAL"
};

window.onload = () => {
    document.getElementById('examDate').valueAsDate = new Date();
    updateHealthColor();
    // On ne lance pas le calcul tout de suite pour éviter les "NaN SA"
};

let currentSA = 0;

function updateHealthColor() {
    const val = document.getElementById('santeMaman').value;
    const txt = document.getElementById('healthValue');
    txt.innerText = val + "%";
    
    if(val > 75) txt.style.color = "#4ade80"; // Vert
    else if(val > 40) txt.style.color = "#facc15"; // Jaune
    else txt.style.color = "#ef4444"; // Rouge
}

// --- 1. CALCUL DU TERME (RP : 1 sem IRL = 1 mois Grossesse) ---
function calculerTerme() {
    const debut = new Date(document.getElementById('dateDebut').value);
    const today = new Date(document.getElementById('examDate').value);
    
    if (!isNaN(debut)) {
        // Différence en jours IRL
        const diffTime = Math.abs(today - debut);
        const daysIRL = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        // FORMULE : 7 jours IRL = 4.5 semaines de grossesse (1 mois)
        // Donc 1 jour IRL = 0.64 semaine de grossesse.
        currentSA = Math.floor(daysIRL * 0.64);
        
        // Jours restants (esthétique)
        const joursRestants = Math.floor((daysIRL * 0.64 - currentSA) * 7);

        document.getElementById('display-sa').innerText = `${currentSA} SA + ${joursRestants}j`;
        
        // Calcul DPA théorique
        const dpa = new Date(debut);
        // On inverse la formule pour trouver la date IRL de l'accouchement
        // 41 SA total / 0.64 = ~64 jours IRL de grossesse totale
        dpa.setDate(dpa.getDate() + 64); 
        document.getElementById('display-dpa').innerText = dpa.toLocaleDateString('fr-FR');

        // Lancer la génération des résultats
        genererTout();
    }
}

function genererTout() {
    const sante = parseInt(document.getElementById('santeMaman').value);
    genererBiologieComplete(sante);
    genererEchoAndConclusion(sante);
    updateReport();
}

// --- 2. BIOLOGIE COMPLÈTE & PATHOLOGIES ---
function genererBiologieComplete(sante) {
    const tbody = document.getElementById('bio-tbody');
    tbody.innerHTML = ""; // Reset

    // Fonction utilitaire pour créer une ligne
    const addRow = (nom, res, unit, ref, isBad = false, comment = "") => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${nom}</strong></td>
            <td class="${isBad ? 'result-bad' : 'result-good'}">${res} ${unit}</td>
            <td style="color:#64748b; font-size:10px;">${ref}</td>
            <td style="font-style:italic;">${isBad ? '⚠️ ' + comment : 'Normal'}</td>
        `;
        tbody.appendChild(row);
    };

    // 1. Beta-hCG (Toujours)
    let hcg = 0;
    if (currentSA <= 4) hcg = rand(50, 500);
    else if (currentSA <= 8) hcg = rand(1000, 100000);
    else hcg = rand(20000, 50000); // Baisse après T1
    addRow("Beta-hCG Plasmatique", formatNumber(hcg), "mIU/ml", "Variable selon terme");

    // 2. Sérologies (Début de grossesse)
    if (currentSA > 4) {
        const toxo = sante < 30 ? "POSITIF (IgM+)" : "Négatif"; // Risque si santé basse
        addRow("Sérologie Toxoplasmose", toxo, "", "Négatif", toxo.includes("POSITIF"), "Infection active suspectée");
        addRow("Sérologie Rubéole", "Immunisée", "", "Immunisée/Négatif");
    }

    // 3. Glycémie (Diabète ?) - Surtout après 20 SA ou si santé basse
    if (currentSA > 15 || sante < 50) {
        let glycemie = (Math.random() * (0.95 - 0.70) + 0.70).toFixed(2);
        if (sante < 40) glycemie = (Math.random() * (1.40 - 1.10) + 1.10).toFixed(2); // Pathologique
        const isDiabete = parseFloat(glycemie) > 0.92;
        addRow("Glycémie à jeun", glycemie, "g/L", "< 0.92 g/L", isDiabete, "Hyperglycémie / Diabète Gestationnel");
    }

    // 4. Numération (Anémie ?)
    if (currentSA > 10) {
        let hemo = rand(115, 130);
        if (sante < 60) hemo = rand(90, 105); // Anémie
        const isAnemie = hemo < 105;
        addRow("Hémoglobine", hemo, "g/L", "> 110 g/L", isAnemie, "Anémie gravidique");
    }

    // 5. Protéinurie (Pré-éclampsie ?) - Fin de grossesse
    if (currentSA > 20) {
        let prot = 0;
        if (sante < 20) prot = (Math.random() * (0.8 - 0.3) + 0.3).toFixed(2); // Pré-éclampsie
        const isPreEclampsie = prot > 0.3;
        addRow("Protéinurie (Albuminurie)", prot, "g/24h", "< 0.30 g/L", isPreEclampsie, "Risque Pré-éclampsie !");
    }
}

// --- 3. ÉCHO ET CONCLUSION ---
function genererEchoAndConclusion(sante) {
    // Lecture des menus déroulants
    const typeEcho = document.getElementById('echoType').value;
    const sexeChoix = document.getElementById('sexeFoetal').value;
    const isVivant = document.getElementById('activiteCardiaque').checked;

    // A. IMAGE
    let imgUrl = ECHO_IMAGES.sac;
    let imgLabel = "SAC GESTATIONNEL";

    if (currentSA >= 10 && currentSA < 14) { imgUrl = ECHO_IMAGES.t1; imgLabel = "PROFIL T1"; }
    else if (currentSA >= 14 && currentSA < 28) { imgUrl = ECHO_IMAGES.t2; imgLabel = "MORPHO T2"; }
    else if (currentSA >= 28) { imgUrl = ECHO_IMAGES.t3; imgLabel = "CROISSANCE T3"; }

    // Si on demande le sexe spécifiquement
    if (currentSA > 14 && (sexeChoix === "Féminin" || sexeChoix === "Masculin")) {
        imgLabel += " - SEXE FOETAL";
    }

    document.getElementById('echo-img-display').src = imgUrl;
    document.getElementById('echo-label-img').innerText = imgLabel;

    // B. MESURES
    const lcc = currentSA < 14 ? (currentSA - 5) * 10 + rand(-5, 5) : 0; 
    const bip = currentSA > 12 ? (currentSA * 2.5) + rand(-3, 3) : 0;
    const lf = currentSA > 12 ? (currentSA * 1.8) + rand(-2, 2) : 0;
    
    // Poids impacté par la santé (RCIU si santé basse)
    let ratioPoids = 1;
    if (sante < 40) ratioPoids = 0.85; // Retard de croissance
    const poids = currentSA > 12 ? (Math.pow(currentSA, 2.9) * 0.13 * ratioPoids + rand(-50, 50)) : 0;

    document.getElementById('val-lcc').innerText = lcc > 0 ? lcc.toFixed(1) + " mm" : "-";
    document.getElementById('val-bip').innerText = bip > 0 ? bip.toFixed(1) + " mm" : "-";
    document.getElementById('val-lf').innerText = lf > 0 ? lf.toFixed(1) + " mm" : "-";
    document.getElementById('val-pc').innerText = bip > 0 ? (bip * 3.14).toFixed(0) + " mm" : "-";
    document.getElementById('val-pa').innerText = bip > 0 ? ((bip-5) * 3.14 * ratioPoids).toFixed(0) + " mm" : "-";
    document.getElementById('val-poids').innerText = poids > 10 ? poids.toFixed(0) + " g" : "-";

    // Vitalité & Sexe
    document.getElementById('val-acf').innerText = isVivant ? rand(130, 160) + " bpm" : "ABSENTE";
    document.getElementById('val-maf').innerText = document.getElementById('mouvementsActifs').checked ? "Présents" : "Absents";
    document.getElementById('val-sexe').innerText = (currentSA > 14) ? sexeChoix : "Non visible";

    // C. CONCLUSION AUTOMATIQUE (Avec conseils)
    let conclusion = `Grossesse évolutive de ${currentSA} SA.\n`;
    
    if (sexeChoix !== "Indéterminé" && currentSA > 14) conclusion += `Foetus de sexe ${sexeChoix.toUpperCase()}.\n`;
    
    // Analyse Santé
    if (sante > 80) {
        conclusion += "Biométries et biologie strictement normales. Poursuite du suivi mensuel.";
    } else if (sante > 50) {
        conclusion += "État général satisfaisant. Légère surveillance biologique conseillée.";
    } else {
        conclusion += "⚠️ GROSSESSE À RISQUE.\n";
        if (currentSA > 20) conclusion += "- Surveillance Protéinurie/TA rapprochée (Risque Pré-éclampsie).\n";
        conclusion += "- Repos strict préconisé.\n- Contrôle biologique hebdomadaire.";
    }

    if (!isVivant) conclusion = "⚠️ ARRÊT DE L'ACTIVITÉ CARDIAQUE FOETALE CONSTATÉE.";

    document.getElementById('conclusionInput').value = conclusion;
}

function updateReport() {
    // Infos patiente
    document.getElementById('display-patient').innerText = document.getElementById('patientName').value || "...";
    const birth = document.getElementById('patientBirth').value;
    document.getElementById('display-birth').innerText = birth ? new Date(birth).toLocaleDateString('fr-FR') : "...";
    
    // Dates & Signature
    const today = document.getElementById('examDate').value;
    const dateStr = today ? new Date(today).toLocaleDateString('fr-FR') : "...";
    document.getElementById('display-date-top').innerText = dateStr;
    document.getElementById('echo-date-display').innerText = dateStr;
    document.getElementById('d-sig').innerText = document.getElementById('doctorSig').value || "...";

    // Conclusion (Copiée du textarea)
    document.getElementById('display-conclusion').innerText = document.getElementById('conclusionInput').value;

    // QR Code
    const nom = document.getElementById('patientName').value || "Inconnu";
    const qrData = encodeURIComponent(`OMC-OBST-${nom}-${currentSA}SA`);
    document.getElementById('qr-ref').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}&margin=1`;
}

// Outils
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }
function formatNumber(num) { return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

// --- 4. GESTION IMAGE & DISCORD ---
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
