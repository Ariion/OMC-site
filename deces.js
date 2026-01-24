const causesData = {
    "Neurologique": ["Hémorragie méningée", "Hémorragie intracérébrale massive", "Infarctus cérébral massif", "Traumatisme cranien sévère", "Etat de mal épileptique"],
    "Hémorragique": ["Hémorragie interne massive", "Hémorragie externe incontrôlable", "Rupture d'anévrisme", "Hémorragie obstétricale sévère"],
    "Infectieuse / Métabolique": ["Choc septique", "Défaillance multiviscérale", "Méningite bactérienne fulminante", "Acidocétose diabétique sévère", "Insuffisance hépatique aiguë"],
    "Cardio-respiratoire": ["Arrêt cardio-respiratoire", "Fibrillation / TV", "Infarctus aigu du myocarde", "Embolie pulmonaire massive", "Oedème aigu du poumon"],
    "Traumatique": ["Polytraumatisme avec choc hémorragique", "Ecrasement thoraco-abdominal", "Section médullaire haute", "Brulures étendues"],
    "Toxique": ["Intoxication médicamenteuse massive", "Overdose opioïdes / cocaïne", "Intoxication monoxyde de carbone", "Empoisonnement chimique"]
};

let typeSelectionne = "";

// Mise à jour du texte simple (Nom, Lieu)
function up(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val || "...";
    updateQR(); // <--- CA DOIT ETRE LA
}

// Mise à jour des dates avec formatage automatique
function upDate(id, val) {
    const el = document.getElementById(id);
    if (el) {
        if (!val) { el.innerText = "..."; }
        else {
            const d = new Date(val);
            el.innerText = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        }
    }
    updateQR();
}
// Mise à jour de la signature manuscrite
function upSignature(val) {
    const el = document.getElementById('display-sig');
    if (el) {
        el.innerText = val || "DOCTEUR";
        updateQR(); // <--- CRUCIAL
    }
}

// Gère le deuxième menu déroulant (Précisions)
function updateCausesSub(type) {
    typeSelectionne = type;
    const select = document.getElementById('cause-precision');
    if (!select) return;

    select.innerHTML = '<option value="">-- Sélectionner la précision --</option>';

    if (causesData[type]) {
        causesData[type].forEach(c => {
            let opt = document.createElement('option');
            opt.value = c;
            opt.innerText = c;
            select.appendChild(opt);
        });
    }
    updateQR();
}

// Affiche la cause finale sur le document
function updateCauseFinale(precision) {
    const el = document.getElementById('d-cause');
    if (el) {
        el.innerText = precision ? `${typeSelectionne} — ${precision}` : "...";
    }
    updateQR();
}

// Génère la référence au format JOUR MOIS HEURE MINUTE
function genererReference() {
    const n = new Date();
    const jj = n.getDate().toString().padStart(2, '0');
    const mm = (n.getMonth() + 1).toString().padStart(2, '0');
    const hh = n.getHours().toString().padStart(2, '0');
    const min = n.getMinutes().toString().padStart(2, '0');

    const ref = `${jj}${mm}${hh}${min}`;
    const refEl = document.getElementById('d-ref');
    if (refEl) {
        refEl.innerText = "#" + ref;
    }
    updateQR();
}

// QR Code dynamique synchronisé sur tous les champs
function updateQR() {
    // 1. On récupère la référence (le numéro #JJMMHHMM)
    const ref = document.getElementById('d-ref') ? document.getElementById('d-ref').innerText : "";

    // 2. On récupère les valeurs directement dans les INPUTS de la sidebar
    // On utilise querySelector pour être sûr de trouver le bon champ même sans ID
    const nomInput = document.querySelector('input[placeholder*="John Doe"]');
    const medecinInput = document.querySelector('input[placeholder*="Nom du médecin"]');
    const dateInput = document.querySelector('input[type="date"][oninput*="d-date"]');

    const nom = nomInput ? nomInput.value : "";
    const medecin = medecinInput ? medecinInput.value : "";
    const dateValue = dateInput ? dateInput.value : "";

    // 3. On prépare l'image du QR
    const qrImg = document.getElementById('qr-ref');
    if (qrImg) {
        // On crée la chaîne d'infos (on peut ajouter la date formatée si on veut)
        const dataStr = `OMC-DECES|REF:${ref}|DEFUNT:${nom}|MEDECIN:${medecin}|DATE:${dateValue}`;
        
        // Encodage pour l'URL
        const dataEncoded = encodeURIComponent(dataStr);
        
        // Mise à jour de l'image
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${dataEncoded}`;
    }
}

// Export Image avec Crop
const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282";

async function genererImage() {
    const doc = document.getElementById('document');
    const btn = event.target;
    btn.innerText = "CAPTURE EN COURS...";
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

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            document.getElementById('direct-link').value = result.data.url;
            document.getElementById('preview-img-result').src = result.data.url;
            document.getElementById('image-popup').style.display = 'flex';
        }
    } catch (e) {
        console.error(e);
        alert("Erreur lors de la création de l'image.");
    } finally {
        btn.innerText = "🖼️ GÉNÉRER L'IMAGE";
        btn.disabled = false;
    }
}

// Envoi Discord
async function envoyerDiscord() {
    const url = "https://discord.com/api/webhooks/1462416189526638613/iMpoe9mn6DC4j_0eBS4tOVjaDo_jy1MhfSKIEP80H7Ih3uYGHRcJ5kQSqIFuL0DTqlUy";
    const btn = document.getElementById('discord-btn');
    const doc = document.getElementById('document');

    if (!doc) return alert("Erreur : Document introuvable");

    btn.disabled = true;
    btn.innerText = "CAPTURING...";

    try {
        const canvas = await html2canvas(doc, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false
        });

        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            const nom = document.getElementById('d-nom').innerText || "Inconnu";

            formData.append("payload_json", JSON.stringify({
                content: `📄 **Nouvel Acte de Décès**\n👤 Défunt : ${nom}`
            }));
            formData.append("file", blob, `deces_${nom}.png`);

            const response = await fetch(url, { method: 'POST', body: formData });

            if (response.ok) {
                alert("✅ Envoyé sur l'intranet !");
                btn.innerText = "ENVOYÉ";
            } else {
                throw new Error("Erreur serveur Discord");
            }
        }, 'image/png');

    } catch (e) {
        console.error(e);
        alert("❌ Erreur lors de l'envoi.");
        btn.disabled = false;
        btn.innerText = "RÉESSAYER";
    }
}

function copyLink() {
    const copyText = document.getElementById("direct-link");
    copyText.select();
    document.execCommand("copy");
    alert("Lien copié ! Vous pouvez le coller en jeu.");
}

function closePopup() {
    document.getElementById('image-popup').style.display = 'none';
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    // 1. Génère la référence (numéro de dossier)
    genererReference();

    // 2. AUTOMATISATION DE LA DATE DU JOUR
    const aujourdhui = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    // Met à jour le champ de saisie (input) dans la sidebar
    const inputDateDeces = document.querySelector('input[type="date"][oninput*="d-date"]');
    if (inputDateDeces) {
        inputDateDeces.value = aujourdhui;
    }

    // Met à jour l'affichage sur le document (le span #d-date)
    upDate('d-date', aujourdhui);

    // 3. Premier rendu du QR Code
    updateQR();
});
