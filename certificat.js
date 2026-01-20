const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 
let lastImageUrl = "";

function updateCertif() {
    // Récupération
    const nom = document.getElementById('f-nom').value || "—";
    const naiss = document.getElementById('f-naiss').value || "—";
    const entreprise = document.getElementById('f-entreprise').value || "—";
    const medecin = document.getElementById('f-medecin').value || "—";
    const type = document.getElementById('f-type').value;
    const concl = document.querySelector('input[name="concl"]:checked').value;

    // Mise à jour Document
    document.getElementById('d-nom').innerText = nom;
    document.getElementById('d-naiss').innerText = naiss;
    document.getElementById('d-entreprise').innerText = entreprise;
    document.getElementById('d-medecin').innerText = medecin;
    
    // Texte de conclusion dynamique
    let texteConcl = "";
    if(concl === "Apte") texteConcl = "Apte — examen clinique sans contre-indication.";
    else if(concl === "Inapte") texteConcl = "Inapte — présente des contre-indications au poste / à l'activité.";
    else texteConcl = "Apte avec réserves — nécessite un aménagement ou suivi particulier.";
    
    document.getElementById('d-concl').innerText = texteConcl;
}

// Réutiliser la même fonction genererImage et envoyerDiscord que pour le Labo
// (Copie les fonctions du labo ici en changeant juste le nom du patient pour le webhook)
