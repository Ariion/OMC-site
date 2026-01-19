// Fonction de liaison simple (Nom, Lieu, Heure, Signature)
function up(id, val) {
    const el = document.getElementById(id);
    if (el) {
        el.innerText = val || "...";
        // Cas particulier pour la signature du docteur
        if(id === 'd-sig' && !val) el.innerText = "DOCTEUR";
    }
}

// Fonction de liaison pour les dates (formate AAAA-MM-JJ en JJ/MM/AAAA)
function upDate(id, val) {
    if (!val) return;
    const [y, m, d] = val.split('-');
    const el = document.getElementById(id);
    if (el) el.innerText = `${d}/${m}/${y}`;
}
