// 1. BASE DE DONNÉES DES MÉDICAMENTS
const medsDB = {
    "Médecine Générale": [
        { name: "Paracétamol", info: "Antidouleur / Fièvre", doses: ["500 mg", "1 g (1000 mg)"] },
        { name: "Ibuprofène", info: "Anti-inflammatoire", doses: ["200 mg", "400 mg"] },
        { name: "Amoxicilline", info: "Antibiotique", doses: ["250 mg","500 mg", "1 g", "Sirop pédiatrique"] },
        { name: "Spasfon", info: "Douleurs ventre", doses: ["80 mg (Lyoc)", "160 mg (2 cp)"] },
        { name: "Oméprazole", info: "Protection estomac", doses: ["10 mg", "20 mg"] },
        { name: "Prednisolone", info: "Cortisone", doses: ["20 mg", "40 mg"] },
        { name: "Ventoline", info: "Asthme", doses: ["100 µg (1 bouffée)", "200 µg (2 bouffées)"] }
    ],
    "Psychologie": [
        { name: "Sertraline", info: "Antidépresseur", doses: ["25 mg", "50 mg", "100 mg"] },
        { name: "Xanax", info: "Anxiolytique", doses: ["0.25 mg", "0.50 mg", "1 mg"] },
        { name: "Valium", info: "Sédatif / Angoisse", doses: ["5 mg", "10 mg"] },
        { name: "Zolpidem", info: "Somnifère puissant", doses: ["10 mg"] },
        { name: "Quétiapine", info: "Régulateur humeur", doses: ["50 mg", "300 mg (LP)"] }
    ],
    "Chirurgie": [
        { name: "Tramadol", info: "Douleur modérée (Palier 2)", doses: ["50 mg", "100 mg (LP)", "150 mg"] },
        { name: "Izalgi", info: "Douleur intense (Opium)", doses: ["500mg/25mg"] },
        { name: "Augmentin", info: "Antibiotique large spectre", doses: ["1 g"] },
        { name: "Lovenox", info: "Anticoagulant (Injection)", doses: ["2000 UI", "4000 UI", "6000 UI"] },
        { name: "Bétadine", info: "Antiseptique local", doses: ["Solution dermique", "Scrub (Rouge)"] },
        { name: "Morphine", info: "Douleur sévère (Palier 3)", doses: ["10 mg", "30 mg", "60 mg"] }
    ],
    "Gynécologie": [
        { name: "Spasfon", info: "Douleurs règles", doses: ["80 mg", "160 mg"] },
        { name: "Antadys", info: "Anti-inflammatoire règles", doses: ["100 mg"] },
        { name: "Monazol", info: "Antifongique (Ovule)", doses: ["1 ovule le soir"] },
        { name: "Acide Folique", info: "Grossesse", doses: ["0.4 mg", "5 mg"] },
        { name: "Pilule", info: "Contraceptif", doses: ["1 cp/jour"] }
    ],
    "Kiné": [
        { name: "Voltarène Gel", info: "Anti-inflammatoire local", doses: ["Application locale"] },
        { name: "Bi-Profenid", info: "Anti-inflammatoire", doses: ["100 mg"] },
        { name: "Doliprane", info: "Douleur", doses: ["1 g"] },
        { name: "Lumirelax", info: "Décontractant musculaire", doses: ["500 mg"] },
        { name: "Flector Tissugel", info: "Patch anti-douleur", doses: ["1 patch / 12h"] }
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

// 6. RÉFÉRENCE
function genererReference() {
    const n = new Date();
    const ref = `${n.getDate().toString().padStart(2, '0')}${n.getMinutes().toString().padStart(2, '0')}`;
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
