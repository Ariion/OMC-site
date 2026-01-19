const causesData = {
    "Neurologique": ["Hémorragie méningée", "Hémorragie intracérébrale massive", "Infarctus cérébral massif", "Traumatisme cranien sévère", "Etat de mal épileptique"],
    "Hémorragique": ["Hémorragie interne massive", "Hémorragie externe incontrôlable", "Rupture d'anévrisme", "Hémorragie obstétricale sévère"],
    "Infectieuse / Métabolique": ["Choc septique", "Défaillance multiviscérale", "Méningite bactérienne fulminante", "Acidocétose diabétique sévère", "Insuffisance hépatique aiguë"],
    "Cardio-respiratoire": ["Arrêt cardio-respiratoire", "Fibrillation / TV", "Infarctus aigu du myocarde", "Embolie pulmonaire massive", "Oedème aigu du poumon"],
    "Traumatique": ["Polytraumatisme avec choc hémorragique", "Ecrasement thoraco-abdominal", "Section médullaire haute", "Brulures étendues"],
    "Toxique": ["Intoxication médicamenteuse massive", "Overdose opioïdes / cocaïne", "Intoxication monoxyde de carbone", "Empoisonnement chimique"]
};

let typeSelectionne = "";

function updateCausesSub(type) {
    typeSelectionne = type;
    const select = document.getElementById('cause-precision');
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

function updateCauseFinale(precision) {
    const el = document.getElementById('d-cause');
    el.innerText = precision ? `${typeSelectionne} — ${precision}` : "...";
}

function genererReference() {
    const now = new Date();
    const ref = "OMC-DEC-" + now.getTime().toString().slice(-6);
    document.getElementById('d-ref').innerText = ref;
    document.getElementById('qr-ref').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ref}`;
}

async function envoyerDiscord() {
    const url = "TA_WEBHOOK_DISCORD_ICI"; // Remplace par ton URL
    const btn = document.getElementById('discord-btn');
    btn.disabled = true;
    btn.innerText = "ENVOI EN COURS...";

    try {
        const canvas = await html2canvas(document.getElementById('document'), { scale: 2 });
        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            const nom = document.getElementById('d-nom').innerText;
            formData.append("payload_json", JSON.stringify({
                content: `🚨 **Nouvel Acte de Décès établi**\n👤 Défunt: ${nom}`
            }));
            formData.append("file", blob, "certificat-deces.png");
            
            await fetch(url, { method: 'POST', body: formData });
            alert("✅ Certificat envoyé sur Discord !");
            btn.innerText = "ENVOYÉ";
        }, 'image/png');
    } catch (e) {
        alert("❌ Erreur lors de l'envoi.");
        btn.disabled = false;
        btn.innerText = "RÉESSAYER";
    }
}

// Lancement automatique
document.addEventListener('DOMContentLoaded', genererReference);
