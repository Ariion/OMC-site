// 1. BASE DE DONNÉES DES MÉDICAMENTS (FICTIFS RP & HRP)
const medsDB = {
    "Médecine Générale": [
        { 
            name: "Acetamax", 
            player_hint: "Paracétamol (Classique) - Attention insuffisance hépatique", 
            doc_label: "Antidouleur / Fièvre",
            doses: ["500 mg", "1000 mg"] 
        },
        { 
            name: "Ibuprolex", 
            player_hint: "Ibuprofène (AINS) - INTERDIT si enceinte ou ulcère", 
            doc_label: "Anti-inflammatoire",
            doses: ["200 mg", "400 mg"] 
        },
        { 
            name: "Bacteryn", 
            player_hint: "Amoxicilline (Antibio) - Attention allergie Pénicilline", 
            doc_label: "Antibiotique",
            doses: ["1 g matin/soir"] 
        },
        { 
            name: "Spasmex", 
            player_hint: "Spasfon - Douleurs ventre/règles", 
            doc_label: "Antispasmodique",
            doses: ["2 cp si douleur"] 
        },
        // ALTERNATIVES
        { 
            name: "Nefolix (Acupan)", 
            player_hint: "PLAN B : Si allergie Aspirine/Ibuprofène", 
            doc_label: "Antidouleur (Palier 1)",
            doses: ["20 mg sur un sucre", "20 mg en injection"] 
        },
        { 
            name: "Azithrox", 
            player_hint: "PLAN B : Si allergie Pénicilline", 
            doc_label: "Antibiotique (Macrolide)",
            doses: ["250 mg (1 cp/jour)"] 
        },
        { 
            name: "Cortisyl", 
            player_hint: "Cortisone - Anti-inflammatoire stéroïdien", 
            doc_label: "Corticoïde",
            doses: ["20 mg", "40 mg"] 
        },
        // CONFORT
        { 
            name: "Gastrol", 
            player_hint: "Pansement gastrique (Gaviscon/Oméprazole)", 
            doc_label: "Protecteur gastrique",
            doses: ["1 gélule le soir"] 
        },
        { 
            name: "AirFlow", 
            player_hint: "Ventoline - Crise d'asthme", 
            doc_label: "Bronchodilatateur",
            doses: ["2 bouffées si crise"] 
        }
    ],

    "Psychologie": [
        { name: "Serenyx", player_hint: "Antidépresseur (Sertraline)", doc_label: "Antidépresseur", doses: ["1 cp le matin"] },
        { name: "Calmax", player_hint: "Xanax - Crise d'angoisse immédiate", doc_label: "Anxiolytique", doses: ["0.5 mg sous la langue"] },
        { name: "Zenith", player_hint: "Valium - Sédatif musculaire et nerveux", doc_label: "Sédatif / Myorelaxant", doses: ["10 mg"] },
        { name: "Noctyl", player_hint: "Somnifère (Zolpidem) - Risque dépendance", doc_label: "Hypnotique", doses: ["1 cp au coucher"] },
        { name: "Laroxyl", player_hint: "Pour douleurs neuro (Si échec antidouleurs)", doc_label: "Traitement de fond", doses: ["25 mg le soir"] }
    ],

    "Chirurgie": [
        // OPIACÉS
        { name: "Tramadolix", player_hint: "Palier 2 (Opium) - Attention nausées", doc_label: "Antalgique Palier 2", doses: ["50 mg", "100 mg LP"] },
        { name: "Morphinax", player_hint: "Morphine - Douleur Sévère", doc_label: "Antalgique Palier 3", doses: ["10 mg", "30 mg"] },
        { name: "Oxycodin", player_hint: "Oxycodone - Douleur Très Sévère", doc_label: "Antalgique Majeur", doses: ["10 mg", "20 mg"] },

        // ALTERNATIVES OPIACÉS
        { name: "Keta-Analgesic", player_hint: "PLAN B : Kétamine faible dose (Sans morphine)", doc_label: "Antalgique non-opiacé", doses: ["Low Dose 10mg"] },
        { name: "Profeniject", player_hint: "PLAN B : Anti-inf injectable (Si allergie morphine)", doc_label: "Anti-inflammatoire Inj.", doses: ["100 mg IM"] },
        { name: "LidoPatch", player_hint: "PLAN B : Patch anesthésiant local", doc_label: "Anesthésique local", doses: ["1 patch sur zone"] },

        // SOINS
        { name: "InfectBlock", player_hint: "Antibiotique post-opératoire", doc_label: "Antibioprophylaxie", doses: ["1 g"] },
        { name: "Fluidex", player_hint: "Anticoagulant (Piqûre ventre)", doc_label: "Anticoagulant", doses: ["0.4 ml SC"] },
        { name: "Dermaclean", player_hint: "Bétadine - Nettoyage plaie", doc_label: "Antiseptique local", doses: ["Pansement tous les 2 jours"] }
    ],

    "Gynécologie": [
        { name: "Spasmex Femina", player_hint: "Douleurs de règles", doc_label: "Antispasmodique", doses: ["160 mg"] },
        { name: "Uteryl", player_hint: "Anti-inflammatoire pelvien (Interdit enceinte)", doc_label: "AINS", doses: ["100 mg"] },
        { name: "MycoStop", player_hint: "Ovule pour Mycose", doc_label: "Antifongique local", doses: ["1 ovule le soir"] },
        { name: "Folix Acid", player_hint: "Vitamines B9 (Début grossesse)", doc_label: "Supplémentation B9", doses: ["0.4 mg"] },
        { name: "FerroMax", player_hint: "Fer (Si fatigue/anémie)", doc_label: "Supplémentation Fer", doses: ["80 mg"] },
        { name: "GastroMum", player_hint: "Anti-acide (OK Grossesse)", doc_label: "Pansement gastrique", doses: ["1 sachet si besoin"] }
    ],

    "Kiné": [
        { name: "FlexiGel", player_hint: "Pommade Diclofénac (Entorse)", doc_label: "Gel Anti-inflammatoire", doses: ["Application locale"] },
        { name: "Ketoflex", player_hint: "Anti-inflammatoire puissant (Dos)", doc_label: "Anti-inflammatoire", doses: ["100 mg"] },
        { name: "Muscloril", player_hint: "Décontractant musculaire", doc_label: "Myorelaxant", doses: ["1 cp le soir"] },
        { name: "Patch-X", player_hint: "Patch chauffant", doc_label: "Dispositif antalgique", doses: ["1 patch matin/soir"] }
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
            // MENU GAUCHE : On montre le nom + l'aide joueur (Allergies, nom réel)
            opt.innerText = `${med.name} — [${med.player_hint}]`;
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
            <span class="med-name">${medData.name} <small style="font-weight: normal; color: #666; font-style:italic;">(${medData.doc_label})</small></span>
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
