function updateCertif() {
    const type = document.getElementById('f-type').value;
    
    // Sidebar elements
    const sideEnt = document.getElementById('side-entreprise-block');
    const sideConcl = document.getElementById('side-concl-block');
    const sideDiv = document.getElementById('side-divers-block');
     
    // Document elements
    const docEnt = document.getElementById('doc-entreprise-block');
    const docConcl = document.getElementById('doc-concl-block');
    const docDiv = document.getElementById('doc-divers-block');

    // --- LOGIQUE DE FILTRAGE ---
    
    if (type === "Aptitude professionnelle") {
        sideEnt.style.display = "block"; sideConcl.style.display = "block"; sideDiv.style.display = "none";
        docEnt.style.display = "block"; docConcl.style.display = "block"; docDiv.style.display = "none";
        document.getElementById('d-titre-doc').innerText = "APTITUDE PROFESSIONNELLE";
    } 
    else if (type === "Port d'arme (PPA)") {
        sideEnt.style.display = "none"; sideConcl.style.display = "block"; sideDiv.style.display = "none";
        docEnt.style.display = "none"; docConcl.style.display = "block"; docDiv.style.display = "none";
        document.getElementById('d-titre-doc').innerText = "CAPACITÉ EXAMEN PPA";
    } 
    else if (type === "Divers") {
        sideEnt.style.display = "none"; sideConcl.style.display = "none"; sideDiv.style.display = "block";
        docEnt.style.display = "none"; docConcl.style.display = "none"; docDiv.style.display = "block";
        document.getElementById('d-titre-doc').innerText = "CERTIFICAT MÉDICAL DIVERS";
    }

    // --- MISE À JOUR DES DONNÉES ---
    document.getElementById('d-nom').innerText = document.getElementById('f-nom').value || "...";
    document.getElementById('d-entreprise').innerText = document.getElementById('f-entreprise').value || "...";
    document.getElementById('d-medecin').innerText = "Dr. " + (document.getElementById('f-medecin').value || "");
    
    // Référence JJMMHHmm
    const now = new Date();
    const ref = String(now.getDate()).padStart(2,'0') + String(now.getMonth()+1).padStart(2,'0') + String(now.getHours()).padStart(2,'0') + String(now.getMinutes()).padStart(2,'0');
    document.getElementById('d-ref').innerText = "#" + ref;

    // Conclusion ou Texte libre
    if (type !== "Divers") {
        const c = document.querySelector('input[name="concl"]:checked').value;
        document.getElementById('d-concl').innerText = (c === "Apte") ? "Apte — Aucune contre-indication clinique." : (c === "Inapte" ? "Inapte — Contre-indications majeures." : "Apte avec réserve.");
    } else {
        document.getElementById('d-divers-text').innerText = document.getElementById('f-divers').value || "...";
    }
}

function upDate(targetId, val) {
    if(!val) return;
    document.getElementById(targetId).innerText = new Date(val).toLocaleDateString('fr-FR');
}
