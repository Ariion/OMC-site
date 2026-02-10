const causesData = { 
    "Neurologique": ["Hémorragie méningée", "Hémorragie intracérébrale massive", "Infarctus cérébral massif", "Traumatisme cranien sévère", "Etat de mal épileptique"],
    "Hémorragique": ["Hémorragie interne massive", "Hémorragie externe incontrôlable", "Rupture d'anévrisme", "Hémorragie obstétricale sévère"],
    "Infectieuse / Métabolique": ["Choc septique", "Défaillance multiviscérale", "Méningite bactérienne fulminante", "Acidocétose diabétique sévère", "Insuffisance hépatique aiguë"],
    "Cardio-respiratoire": ["Arrêt cardio-respiratoire", "Fibrillation / TV", "Infarctus aigu du myocarde", "Embolie pulmonaire massive", "Oedème aigu du poumon", "Insuffisance respiratoire aigue", "Asphyxie mécanique", "Noyade"],
    "Traumatique": ["Polytraumatisme avec choc hémorragique", "Ecrasement thoraco-abdominal", "Section médullaire haute", "Brulures étendues"],
    "Toxique": ["Intoxication médicamenteuse massive", "Overdose opioïdes / cocaïne", "Intoxication monoxyde de carbone", "Empoisonnement chimique"]
};

let typeSelectionne = "";

// Mise à jour du texte simple (Nom, Lieu)
function up(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val || "...";
    updateQR(); 
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
        updateQR();
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
    // 1. On récupère la référence
    const ref = document.getElementById('d-ref') ? document.getElementById('d-ref').innerText : "";

    // 2. On récupère les valeurs
    const nomInput = document.getElementById('patientName');
    const medecinInput = document.querySelector('input[placeholder*="Nom du médecin"]');
    const dateInput = document.querySelector('input[type="date"][oninput*="d-date"]');

    const nom = nomInput ? nomInput.value : "";
    const medecin = medecinInput ? medecinInput.value : "";
    const dateValue = dateInput ? dateInput.value : "";

    // 3. On prépare l'image du QR
    const qrImg = document.getElementById('qr-ref');
    if (qrImg) {
        const dataStr = `OMC-DECES|REF:${ref}|DEFUNT:${nom}|MEDECIN:${medecin}|DATE:${dateValue}`;
        const dataEncoded = encodeURIComponent(dataStr);
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${dataEncoded}`;
    }
}

// --- INIT & AUTOCOMPLETE ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Génère la référence
    genererReference();

    // 2. Date du jour auto (Décès)
    const aujourdhui = new Date().toISOString().split('T')[0];
    const inputDateDeces = document.querySelector('input[type="date"][oninput*="d-date"]');
    if (inputDateDeces) inputDateDeces.value = aujourdhui;
    upDate('d-date', aujourdhui);

    // 3. QR Code initial
    updateQR();

    // 4. SYSTÈME AUTOCOMPLETE CENTRALISÉ
    setupPatientAutocomplete({
        nameId: 'patientName',
        birthId: 'patientBirth',
        callback: function(p) {
            // Callback: Mettre à jour visuellement le document quand on clique sur un nom
            up('d-nom', p.nom);
            upDate('d-ddn', p.naissance);
            updateQR(); // Force la mise à jour du QR Code avec les nouvelles données
        }
    });
});

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
    const url = "https://discord.com/api/webhooks/1468221753372446720/g_ItYTLYSb3xDeyRjFrVEsHuIPhwibYEEZoHzfktlzRCCqlqvmG2W3Xv7HNtCLv_hc0K";
    const btn = document.getElementById('discord-btn');
    const doc = document.getElementById('document');

    btn.disabled = true;
    btn.innerText = "CAPTURE...";

    doc.classList.add('mode-capture');

    try {
        const canvas = await html2canvas(doc, { scale: 2, useCORS: true });
        doc.classList.remove('mode-capture');
        btn.innerText = "ENVOI...";

        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            const nom = document.getElementById('d-nom').innerText || "Inconnu";
            const datePost = new Date().toLocaleDateString('fr-FR');

            formData.append("payload_json", JSON.stringify({
                thread_name: `🕯️ DÉCÈS - ${nom} (${datePost})`,
                content: `📄 **Nouvel Acte de Décès enregistré**\n👤 Défunt : ${nom}`
            }));
            
            formData.append("file", blob, `deces_${nom}.png`);

            const response = await fetch(url + "?wait=true", { method: 'POST', body: formData });

            if (response.ok) {
                alert("✅ Acte de décès envoyé !");
                btn.innerText = "ENVOYÉ";
            } else {
                throw new Error("Erreur Discord");
            }
            btn.disabled = false;
        }, 'image/png');

    } catch (e) {
        doc.classList.remove('mode-capture');
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
