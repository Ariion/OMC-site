// 1. BASE DE DONNÉES DES MÉDICAMENTS
const medsDB = {
    "Médecine Générale": ["Paracétamol", "Ibuprofène", "Amoxicilline", "Oméprazole", "Salbutamol", "Prednisolone", "Metformine", "Spasfon"],
    "Psychologie": ["Sertraline", "Escitalopram", "Alprazolam", "Quétiapine", "Hydroxyzine", "Lorazépam", "Fluoxétine", "Diazépam"],
    "Chirurgie": ["Tramadol", "Paracétamol Codéiné", "Amoxicilline + Ac. clavulanique", "Énoxaparine (Lovenox)", "Mupirocine", "Bétadine", "Morphine"],
    "Gynécologie": ["Phloroglucinol (Spasfon)", "Amoxicilline", "Métronidazole", "Dydrogestérone", "Acide folique", "Pilule contraceptive", "Antifongique local"],
    "Kiné": ["Diclofénac (Gel)", "Paracétamol", "Ibuprofène", "Baclofène", "Capsaïcine (Patch)", "Tramadol", "Ketoprofène"]
};

// 2. INITIALISATION
document.addEventListener('DOMContentLoaded', () => {
    // Initialise la liste des médicaments par défaut
    updateMeds("Médecine Générale");
    
    // Date du jour automatique
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('input-date');
    if(dateInput) dateInput.value = today;
    upDate('d-date', today);

    // Génère un numéro de dossier aléatoire
    genererReference();
    updateQR();
});

// 3. LOGIQUE D'AFFICHAGE (Mises à jour texte)
function up(id, val) {
    const el = document.getElementById(id);
    if(el) {
        el.innerText = val || "...";
        // Affiche/Cache le conteneur d'instructions si besoin
        if(id === 'd-inst') {
            document.getElementById('inst-container').style.display = val ? 'block' : 'none';
        }
    }
    updateQR();
}

function upSignature(val) {
    const el = document.getElementById('display-sig');
    if(el) el.innerText = val ? "Dr. " + val : "Dr...";
    updateQR();
}

function upDate(id, val) {
    const el = document.getElementById(id);
    if(el) {
        if(!val) el.innerText = "...";
        else {
            const d = new Date(val);
            el.innerText = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        }
    }
    updateQR();
}

// 4. GESTION DES MÉDICAMENTS
function updateMeds(service) {
    const select = document.getElementById('med-select');
    select.innerHTML = ""; // Vide la liste
    
    if(medsDB[service]) {
        medsDB[service].forEach(med => {
            let opt = document.createElement('option');
            opt.value = med;
            opt.innerText = med;
            select.appendChild(opt);
        });
    }
}

function ajouterLigne() {
    const med = document.getElementById('med-select').value;
    const dosage = document.getElementById('input-dosage').value || "-";
    const duree = document.getElementById('input-duree').value || "-";
    const poso = document.getElementById('input-poso').value || "Selon instructions";

    const list = document.getElementById('ordo-list');
    
    // Supprime le message "Aucune prescription" si c'est le premier ajout
    if(list.querySelector('.empty-msg')) {
        list.innerHTML = "";
    }

    const li = document.createElement('li');
    li.innerHTML = `
        <span class="med-name">${med} ${dosage}</span>
        <span class="med-details">Pendant : ${duree}</span>
        <span class="med-details">Posologie : <span class="med-poso">${poso}</span></span>
    `;
    
    list.appendChild(li);
    updateQR();
}

function viderOrdonnance() {
    if(confirm("Tout effacer ?")) {
        document.getElementById('ordo-list').innerHTML = '<li class="empty-msg">Aucune prescription en cours...</li>';
        updateQR();
    }
}

// 5. GÉNÉRATION ET QR CODE
function genererReference() {
    const ref = Math.floor(Math.random() * 90000) + 10000;
    document.getElementById('d-ref').innerText = "#ORDO-" + ref;
}

function updateQR() {
    const ref = document.getElementById('d-ref').innerText;
    const nom = document.getElementById('input-nom').value || "Inconnu";
    const medecin = document.getElementById('display-sig').innerText;
    
    // On compte le nombre de médicaments pour le QR
    const nbMeds = document.querySelectorAll('#ordo-list li:not(.empty-msg)').length;

    const qrImg = document.getElementById('qr-ref');
    if(qrImg) {
        const data = encodeURIComponent(`OMC|${ref}|PATIENT:${nom}|DR:${medecin}|NB_MEDS:${nbMeds}`);
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
    }
}

// 6. EXPORT IMAGE (Même logique que Décès)
const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282";

async function genererImage() {
    const doc = document.getElementById('document');
    const btn = event.target;
    btn.innerText = "GÉNÉRATION...";
    btn.disabled = true;

    try {
        const canvas = await html2canvas(doc, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            height: doc.scrollHeight,
            windowHeight: doc.scrollHeight
        });

        const imageData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        const formData = new FormData();
        formData.append("image", imageData);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
        const result = await response.json();

        if (result.success) {
            document.getElementById('direct-link').value = result.data.url;
            document.getElementById('preview-img-result').src = result.data.url;
            document.getElementById('image-popup').style.display = 'flex';
        }
    } catch (e) {
        alert("Erreur génération image");
    } finally {
        btn.innerText = "🖼️ GÉNÉRER L'ORDONNANCE";
        btn.disabled = false;
    }
}

// 7. ENVOI DISCORD
async function envoyerDiscord() {
    const url = "https://discord.com/api/webhooks/1462416189526638613/iMpoe9mn6DC4j_0eBS4tOVjaDo_jy1MhfSKIEP80H7Ih3uYGHRcJ5kQSqIFuL0DTqlUy";
    const btn = document.getElementById('discord-btn');
    const doc = document.getElementById('document');

    btn.disabled = true;
    btn.innerText = "ENVOI...";

    try {
        const canvas = await html2canvas(doc, { scale: 2, useCORS: true });
        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            const nom = document.getElementById('input-nom').value || "Inconnu";
            
            formData.append("payload_json", JSON.stringify({
                content: `💊 **Nouvelle Ordonnance**\n👤 Patient : ${nom}`
            }));
            formData.append("file", blob, `ordo_${nom}.png`);

            const response = await fetch(url, { method: 'POST', body: formData });
            if(response.ok) { alert("Envoyé !"); btn.innerText = "ENVOYÉ"; }
        }, 'image/png');
    } catch (e) {
        alert("Erreur envoi Discord");
        btn.disabled = false;
        btn.innerText = "RÉESSAYER";
    }
}

function copyLink() {
    document.getElementById("direct-link").select();
    document.execCommand("copy");
    alert("Lien copié !");
}
function closePopup() { document.getElementById('image-popup').style.display = 'none'; }
