function updateThemeButtonText(theme) {
    const btnText = document.getElementById('theme-text');
    if (btnText) {
        btnText.innerText = theme === 'dark' ? 'Passer mode clair' : 'Passer mode sombre';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
    updateThemeButtonText(targetTheme);
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButtonText(savedTheme);
});

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


