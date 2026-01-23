const causesData = {
    "Neurologique": ["Hémorragie méningée", "Hémorragie intracérébrale massive", "Infarctus cérébral massif", "Traumatisme cranien sévère", "Etat de mal épileptique"],
    "Hémorragique": ["Hémorragie interne massive", "Hémorragie externe incontrôlable", "Rupture d'anévrisme", "Hémorragie obstétricale sévère"],
    "Infectieuse / Métabolique": ["Choc septique", "Défaillance multiviscérale", "Méningite bactérienne fulminante", "Acidocétose diabétique sévère", "Insuffisance hépatique aiguë"],
    "Cardio-respiratoire": ["Arrêt cardio-respiratoire", "Fibrillation / TV", "Infarctus aigu du myocarde", "Embolie pulmonaire massive", "Oedème aigu du poumon"],
    "Traumatique": ["Polytraumatisme avec choc hémorragique", "Ecrasement thoraco-abdominal", "Section médullaire haute", "Brulures étendues"],
    "Toxique": ["Intoxication médicamenteuse massive", "Overdose opioïdes / cocaïne", "Intoxication monoxyde de carbone", "Empoisonnement chimique"]
};

let typeSelectionne = "";

// Gère le deuxième menu déroulant (Précisions)
function updateCausesSub(type) {
    typeSelectionne = type;
    const select = document.getElementById('cause-precision');
    if(!select) return;
    
    select.innerHTML = '<option value="">-- Sélectionner la précision --</option>';
    
    if (causesData[type]) {
        causesData[type].forEach(c => {
            let opt = document.createElement('option');
            opt.value = c;
            opt.innerText = c;
            select.appendChild(opt);
        });
    }
}

// Affiche la cause finale sur le document
function updateCauseFinale(precision) {
    const el = document.getElementById('d-cause');
    if(el) {
        el.innerText = precision ? `${typeSelectionne} — ${precision}` : "...";
    }
}

// Génère la référence au format JOUR MOIS HEURE MINUTE (JJMMHHMM)
function genererReference() {
    const n = new Date();
    const jj = n.getDate().toString().padStart(2, '0');
    const mm = (n.getMonth() + 1).toString().padStart(2, '0');
    const hh = n.getHours().toString().padStart(2, '0');
    const min = n.getMinutes().toString().padStart(2, '0');
    
    const ref = `${jj}${mm}${hh}${min}`;

    // Mise à jour de la référence texte
    const refEl = document.getElementById('d-ref');
    if(refEl) {
        refEl.innerText = ref;
        refEl.style.color = "#1e293b"; // Noir/Gris foncé
    }

    // Mise à jour du QR Code
    const qrImg = document.getElementById('qr-ref');
    if(qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OMC-DECES-${ref}`;
    }
}

// Clé API ImgBB (Remplace par la tienne pour que ça marche à 100%)
const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 

async function genererImage() {
    const doc = document.getElementById('document');
    const btn = event.target;
    btn.innerText = "CROP & UPLOAD...";
    btn.disabled = true;

    try {
        // html2canvas va maintenant suivre la hauteur réelle de l'élément #document
        const canvas = await html2canvas(doc, { 
            scale: 2,           // Haute qualité
            useCORS: true,      // Pour le QR Code
            backgroundColor: "#ffffff",
            height: doc.offsetHeight, // Force la capture à la hauteur réelle du texte
            windowHeight: doc.offsetHeight
        });

        const imageData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        const formData = new FormData();
        formData.append("image", imageData);

        // Envoi à ImgBB
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
        alert("Erreur lors du crop de l'image.");
    } finally {
        btn.innerText = "🖼️ GÉNÉRER L'IMAGE (CROP)";
        btn.disabled = false;
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

// Fonction d'envoi Discord
async function envoyerDiscord() {
    const url = "https://discord.com/api/webhooks/1462416189526638613/iMpoe9mn6DC4j_0eBS4tOVjaDo_jy1MhfSKIEP80H7Ih3uYGHRcJ5kQSqIFuL0DTqlUy";
    const btn = document.getElementById('discord-btn');
    const doc = document.getElementById('document');
    
    if(!doc) return alert("Erreur : Document introuvable");
    
    btn.disabled = true;
    btn.innerText = "CAPTURING...";

    try {
        // On utilise useCORS pour autoriser la capture d'images venant d'autres sites (comme le QR Code)
        // On ajoute logging pour voir les erreurs en console si besoin
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
        alert("❌ Erreur lors de l'envoi. Vérifiez votre connexion.");
        btn.disabled = false;
        btn.innerText = "RÉESSAYER";
    }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    genererReference();
    // On force un premier rendu du QR Code à vide
    updateQR();
});

// Fonction pour formater la date (ex: 12 Mai 2026)
function formatDateFR(dateStr) {
    if (!dateStr) return "...";
    const date = new Date(dateStr);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}

// Mise à jour des dates
function upDate(id, val) {
    const el = document.getElementById(id);
    if (el) {
        el.innerText = formatDateFR(val);
        updateQR();
    }
}

// Mise à jour du texte et du nom du docteur (signature)
function up(id, val) {
    const el = document.getElementById(id);
    if (el) {
        el.innerText = val || "...";
        // Si on change le docteur, on met à jour la signature manuscrite
        if (id === 'd-sig') {
            const sigDoc = document.getElementById('d-sig-doc');
            if (sigDoc) sigDoc.innerText = "Dr. " + val;
        }
        updateQR();
    }
}

// QR Code dynamique
function updateQR() {
    const ref = document.getElementById('d-ref').innerText;
    const nom = document.getElementById('d-nom').innerText;
    const qrImg = document.getElementById('qr-ref');
    if(qrImg) {
        const data = encodeURIComponent(`OMC-DECES|REF:${ref}|NOM:${nom}`);
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
    }
}
