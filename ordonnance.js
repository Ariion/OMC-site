// 1. BASE DE DONNÉES DES MÉDICAMENTS (FICTIFS RP)
const medsDB = {
    "Médecine Générale": [
        // CLASSIQUES
        { name: "Acetamax 1000", info: "Paracétamol (Douleur/Fièvre)", doses: ["1 cp", "2 cp"] },
        { name: "Ibuprolex", info: "Anti-inflammatoire (AINS)", doses: ["200 mg", "400 mg"] },
        { name: "Bacteryn", info: "Antibiotique (Pénicilline)", doses: ["1 g matin/soir"] },
        { name: "Spasmex", info: "Douleurs abdominales", doses: ["2 cp si douleur"] },
        
        // ALTERNATIVES ALLERGIES
        { name: "Nefolix (Acupan)", info: "Douleur (Alt. aux AINS/Opioïdes)", doses: ["20 mg (1 ampoule buvable)"] },
        { name: "Azithrox", info: "Antibiotique (Alt. Pénicilline)", doses: ["250 mg (1 cp/jour)"] },
        { name: "Cortisyl", info: "Cortisone (Alt. aux AINS)", doses: ["20 mg", "40 mg"] },
        
        // AUTRES
        { name: "Gastrol", info: "Protection estomac", doses: ["1 gélule le soir"] },
        { name: "AirFlow", info: "Inhalateur Asthme", doses: ["2 bouffées si crise"] }
    ],
    "Psychologie & Neurologie": [
        { name: "Serenyx", info: "Antidépresseur", doses: ["1 cp le matin"] },
        { name: "Calmax", info: "Anxiolytique (Crise)", doses: ["0.5 mg sous la langue"] },
        { name: "Zenith", info: "Sédatif puissant", doses: ["10 mg"] },
        { name: "Noctyl", info: "Somnifère", doses: ["1 cp au coucher"] },
        { name: "Laroxyl", info: "Douleurs neuro (Alt. classiques)", doses: ["25 mg le soir"] }
    ],
    "Chirurgie & Urgence": [
        // PALIERS 2 & 3
        { name: "Tramadolix", info: "Douleur modérée (Contient Opium)", doses: ["50 mg", "100 mg LP"] },
        { name: "Morphinax", info: "Douleur sévère (Morphine)", doses: ["10 mg", "30 mg"] },
        { name: "Oxycodin", info: "Douleur très sévère (Oxycodone)", doses: ["10 mg", "20 mg"] },

        // ALTERNATIVES ALLERGIES OPIOÏDES
        { name: "Keta-Analgesic", info: "Douleur (Alt. Morphine)", doses: ["Low Dose 10mg"] },
        { name: "LidoPatch", info: "Patch anesthésiant local (Alt. Morphine)", doses: ["1 patch sur zone"] },
        { name: "Profeniject", info: "Anti-inflammatoire inj. (Alt. Morphine)", doses: ["100 mg IM"] },

        // SOINS
        { name: "InfectBlock", info: "Antibiotique post-op", doses: ["1 g"] },
        { name: "Fluidex", info: "Anticoagulant", doses: ["0.4 ml SC"] },
        { name: "Dermaclean", info: "Soins infirmiers", doses: ["Pansement tous les 2 jours"] }
    ],
    "Gynécologie & Obstétrique": [
        { name: "Spasmex Femina", info: "Douleurs menstruelles", doses: ["160 mg"] },
        { name: "Uteryl", info: "Anti-inflammatoire pelvien", doses: ["100 mg"] },
        { name: "MycoStop", info: "Antifongique", doses: ["1 ovule le soir"] },
        
        // GROSSESSE
        { name: "Folix Acid", info: "Vitamines Grossesse", doses: ["0.4 mg"] },
        { name: "FerroMax", info: "Fer (Anémie)", doses: ["80 mg"] },
        { name: "GastroMum", info: "Anti-acide (Grossesse OK)", doses: ["1 sachet si besoin"] }
    ],
    "Kiné & Rhumatologie": [
        { name: "FlexiGel", info: "Pommade (Diclofenac)", doses: ["Application locale"] },
        { name: "Ketoflex", info: "Anti-inflammatoire puissant", doses: ["100 mg"] },
        { name: "Muscloril", info: "Décontractant musculaire", doses: ["1 cp le soir"] },
        { name: "Patch-X", info: "Patch diffusant (12h)", doses: ["1 patch matin/soir"] }
    ]
};

// 2. INITIALISATION
document.addEventListener('DOMContentLoaded', () => {
    updateMeds("Médecine Générale");
    genererReference();
    
    // Date du jour auto
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('input-date');
    if(dateInput) dateInput.value = today;
    upDate('d-date', today);
    
    // AUTOCOMPLETE CENTRALISÉ
    setupPatientAutocomplete({
        nameId: 'patientName',
        birthId: 'patientBirth',
        callback: function(p) {
            up('d-nom', p.nom);
            upDate('d-ddn', p.naissance);
        }
    });

    updateQR();
});

// GESTION INSTRUCTIONS SPÉCIFIQUES
function upInst(val) {
    const container = document.getElementById('inst-container');
    const text = document.getElementById('d-inst');
    
    if (val.trim() !== "") {
        container.style.display = "block";
        text.innerText = val;
    } else {
        container.style.display = "none";
        text.innerText = "";
    }
    updateQR();
}

// 3. LOGIQUE D'AFFICHAGE
function up(id, val) {
    const el = document.getElementById(id);
    if(el) {
        el.innerText = val || "...";
        if(id === 'd-inst') document.getElementById('inst-container').style.display = val ? 'block' : 'none';
    }
    updateQR();
}

function upSignature(val) {
    const el = document.getElementById('display-sig');
    if(el) el.innerText = val || "...";
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


// 4. GESTION MÉDICAMENTS
function updateMeds(service) {
    const select = document.getElementById('med-select');
    select.innerHTML = "";
    
    if(medsDB[service]) {
        medsDB[service].forEach((med, index) => {
            let opt = document.createElement('option');
            opt.value = index; 
            opt.innerText = `${med.name} - ${med.info}`;
            select.appendChild(opt);
        });
        updateDosages();
    }
}
document.getElementById('med-select').addEventListener('change', selectMed);

function updateDosages() {
    const service = document.getElementById('service-select').value;
    const medIndex = document.getElementById('med-select').value; 
    const dosageSelect = document.getElementById('dosage-select');
    
    dosageSelect.innerHTML = ""; 
    
    if (medsDB[service] && medsDB[service][medIndex]) {
        const med = medsDB[service][medIndex];
        med.doses.forEach(dose => {
            let opt = document.createElement('option');
            opt.value = dose;
            opt.innerText = dose;
            dosageSelect.appendChild(opt);
        });
    }
}

function selectMed() {
    const select = document.getElementById('med-select');
    const selectedOption = select.options[select.selectedIndex];
    if(selectedOption && selectedOption.dataset.dose) {
        document.getElementById('input-dosage').value = selectedOption.dataset.dose;
    }
}

function fillPoso(val) {
    const input = document.getElementById('input-poso');
    if(input && val) input.value = val;
}

function ajouterLigne() {
    const service = document.getElementById('service-select').value;
    const select = document.getElementById('med-select');
    if (select.selectedIndex === -1) return;

    const medIndex = select.value;
    const medData = medsDB[service][medIndex];
    const dosage = document.getElementById('dosage-select').value;
    const duree = document.getElementById('input-duree').value || "-";
    const poso = document.getElementById('input-poso').value || "Selon instructions";

    const list = document.getElementById('ordo-list');
    const emptyMsg = list.querySelector('.empty-msg');
    if(emptyMsg) emptyMsg.remove();

    const li = document.createElement('li');
    li.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span class="med-name">${medData.name} <small style="font-weight: normal; color: #666;">(${medData.info})</small></span>
            <span style="font-weight: bold; font-size: 14px;">${dosage} / ${duree}</span>
        </div>
        <div class="med-details">➤ ${poso}</div>
        <span class="del-btn" onclick="supprimerLigne(this)">✖</span>
    `;
    list.appendChild(li);

    document.getElementById('poso-select').value = "";
    document.getElementById('input-poso').value = "";
    updateQR();
}

function supprimerLigne(btn) {
    const li = btn.closest('li');
    li.remove();
    const list = document.getElementById('ordo-list');
    if (list.children.length === 0) {
        list.innerHTML = '<li class="empty-msg">Aucune prescription en cours...</li>';
    }
    updateQR();
}

function viderOrdonnance() {
    if(confirm("Tout effacer ?")) {
        document.getElementById('ordo-list').innerHTML = '<li class="empty-msg">Aucune prescription en cours...</li>';
        updateQR();
    }
}

// 6. RÉFÉRENCE (CORRIGÉE : MOIS-JOUR-HEURE-MINUTE)
function genererReference() {
    const n = new Date();
    const mm = (n.getMonth() + 1).toString().padStart(2, '0'); // MOIS D'ABORD
    const jj = n.getDate().toString().padStart(2, '0');        // PUIS JOUR
    const hh = n.getHours().toString().padStart(2, '0');
    const min = n.getMinutes().toString().padStart(2, '0');
    
    // FORMAT : MOIS JOUR HEURE MIN
    const ref = `${mm}${jj}${hh}${min}`;
    document.getElementById('d-ref').innerText = "#" + ref;
    updateQR();
}

function updateQR() {
    const ref = document.getElementById('d-ref').innerText;
    const nom = document.getElementById('patientName').value || "Inconnu";
    const medecin = document.getElementById('display-sig').innerText;
    const nbMeds = document.querySelectorAll('#ordo-list li:not(.empty-msg)').length;

    const qrImg = document.getElementById('qr-ref');
    if(qrImg) {
        const data = encodeURIComponent(`OMC|${ref}|PATIENT:${nom}|DR:${medecin}|NB_MEDS:${nbMeds}`);
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
    }
}

// 7. EXPORT
const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282";

async function genererImage() {
    const doc = document.getElementById('document');
    const btn = event.target;
    btn.innerText = "GÉNÉRATION...";
    btn.disabled = true;
    doc.classList.add('mode-capture');
    
    // Fix anti-crop
    const originalHeight = doc.style.height;
    doc.style.height = (doc.scrollHeight + 50) + "px";

    try {
        const canvas = await html2canvas(doc, {
            scale: 2, useCORS: true, backgroundColor: "#ffffff",
            height: doc.scrollHeight + 50, 
            windowHeight: doc.scrollHeight + 50
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
    } catch (e) { alert("Erreur génération image"); } 
    finally {
        doc.style.height = originalHeight;
        doc.classList.remove('mode-capture');
        btn.innerText = "🖼️ GÉNÉRER L'ORDONNANCE";
        btn.disabled = false;
    }
}

async function envoyerDiscord() {
    const url = "https://discord.com/api/webhooks/1424039813593698456/ew_fnKRv1gLQooCf64qMKWP1IOxth2iOpHYsRE9UaJMKWd-aUfcTc69amPI7ye4ppWxA";
    const btn = document.getElementById('discord-btn');
    const doc = document.getElementById('document');

    btn.disabled = true;
    btn.innerText = "CAPTURE...";
    doc.classList.add('mode-capture');
    
    // Fix anti-crop
    const originalHeight = doc.style.height;
    doc.style.height = (doc.scrollHeight + 50) + "px";

    try {
        const canvas = await html2canvas(doc, { 
            scale: 2, 
            useCORS: true,
            height: doc.scrollHeight + 50,
            windowHeight: doc.scrollHeight + 50
        });

        doc.classList.remove('mode-capture');
        btn.innerText = "ENVOI...";

       canvas.toBlob(async (blob) => {
            const formData = new FormData();
            const nom = document.getElementById('patientName').value || "Inconnu";
            const datePost = new Date().toLocaleDateString('fr-FR');

            formData.append("payload_json", JSON.stringify({
                thread_name: `Ordo - ${nom} (${datePost})`, 
                content: `💊 **Nouvelle Ordonnance médicale enregistrée**\n👤 Patient : ${nom}`
            }));
            
            formData.append("file", blob, `ordo_${nom}.png`);

            const response = await fetch(url + "?wait=true", { method: 'POST', body: formData });
            
            if(response.ok) { 
                alert("✅ Envoyé sur l'intranet !"); 
                btn.innerText = "ENVOYÉ"; 
            } else {
                throw new Error("Erreur serveur Discord");
            }
            btn.disabled = false;
            setTimeout(() => { btn.innerText = "ENVOYER SUR DISCORD"; }, 2000);

        }, 'image/png');

    } catch (e) {
        console.error(e);
        alert("❌ Erreur lors de l'envoi.");
        doc.classList.remove('mode-capture');
        btn.disabled = false;
        btn.innerText = "RÉESSAYER";
    } finally {
        doc.style.height = originalHeight;
    }
}

function copyLink() {
    document.getElementById("direct-link").select();
    document.execCommand("copy");
    alert("Lien copié !");
}
function closePopup() { document.getElementById('image-popup').style.display = 'none'; }
