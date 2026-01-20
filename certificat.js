const IMGBB_API_KEY = "TA_CLE_IMGBB";
const DISCORD_WEBHOOK = "TON_WEBHOOK_DISCORD";
let lastImageUrl = "";

function generateRef() {
    const now = new Date();
    const j = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return j + m + h + min;
}

function updateCertif() {
    const type = document.getElementById('f-type').value;
    
    // Sidebar groups
    const sideEntreprise = document.getElementById('f-entreprise-group');
    const sideConcl = document.getElementById('f-concl-group');
    const sideDivers = document.getElementById('f-divers-group');
    
    // Document blocks
    const docBoxEntreprise = document.getElementById('d-box-entreprise');
    const docAreaConcl = document.getElementById('d-concl-area');
    const docAreaDivers = document.getElementById('d-divers-area');

    // Reset à l'affichage par défaut
    sideEntreprise.style.display = "block";
    sideConcl.style.display = "block";
    sideDivers.style.display = "none";
    docBoxEntreprise.style.display = "block";
    docAreaConcl.style.display = "block";
    docAreaDivers.style.display = "none";

    // Logique selon le type
    if (type === "Port d'arme (PPA)") {
        sideEntreprise.style.display = "none";
        docBoxEntreprise.style.display = "none";
        document.getElementById('d-titre-doc').innerText = "CAPACITÉ EXAMEN PPA";
    } 
    else if (type === "Divers") {
        sideEntreprise.style.display = "none";
        sideConcl.style.display = "none";
        sideDivers.style.display = "block";
        docBoxEntreprise.style.display = "none";
        docAreaConcl.style.display = "none";
        docAreaDivers.style.display = "block";
        document.getElementById('d-titre-doc').innerText = "CERTIFICAT MÉDICAL";
    } 
    else {
        document.getElementById('d-titre-doc').innerText = type.toUpperCase();
    }

    // Update Textes
    document.getElementById('d-nom').innerText = document.getElementById('f-nom').value || "...";
    document.getElementById('d-entreprise').innerText = document.getElementById('f-entreprise').value || "...";
    document.getElementById('d-medecin').innerText = "Dr. " + (document.getElementById('f-medecin').value || "");
    document.getElementById('d-ref').innerText = "#" + generateRef();

    if (type !== "Divers") {
        const concl = document.querySelector('input[name="concl"]:checked').value;
        let txt = (concl === "Apte") ? "Apte — L'examen clinique ne présente aucune contre-indication." : 
                  (concl === "Inapte" ? "Inapte — Présente des contre-indications cliniques majeures." : "Apte avec réserve.");
        document.getElementById('d-concl').innerText = txt;
    } else {
        document.getElementById('d-divers-text').innerText = document.getElementById('f-divers').value || "...";
    }
}

function upDate(targetId, val) {
    if(!val) return;
    const date = new Date(val);
    document.getElementById(targetId).innerText = date.toLocaleDateString('fr-FR');
}

// Initialisation
window.onload = () => {
    document.getElementById('d-date').innerText = new Date().toLocaleDateString('fr-FR');
};
