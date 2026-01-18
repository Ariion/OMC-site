// Les bases de données restent identiques à tes versions précédentes
const database = { /* ... garde tes données ici ... */ };
const causesData = { /* ... garde tes causes ici ... */ };

// --- INITIALISATION ---
function init() {
    const tabsContainer = document.getElementById('dynamic-tabs');
    const sectionsContainer = document.getElementById('dynamic-sections');
    if (!tabsContainer || !sectionsContainer) return;

    tabsContainer.innerHTML = "";
    sectionsContainer.innerHTML = "";

    for (let cat in database) {
        let btn = document.createElement('button');
        btn.className = 'tab-btn';
        btn.innerHTML = `${cat.toUpperCase()} <span>▼</span>`;
        btn.onclick = (e) => { e.preventDefault(); document.getElementById('t-'+cat).classList.toggle('active'); };
        tabsContainer.appendChild(btn);

        let div = document.createElement('div');
        div.id = 't-'+cat; div.className = 'tab-content';
        let sec = document.createElement('div');
        sec.id = 'sec-'+cat; sec.className = 'section';
        sec.innerHTML = `<div class="section-title">${cat}</div>`;

        database[cat].forEach(item => {
            div.innerHTML += `
            <div class="input-group">
                <label>${item.label}</label>
                <input type="text" class="analysis-input" data-id="${item.id}" data-label="${item.label}" data-norm="${item.norm}" oninput="res('${item.id}', this.value, '${cat}')" placeholder="Valeur...">
            </div>`;

            sec.innerHTML += `
            <div class="row" id="row-${item.id}">
                <span>${item.label}</span>
                <span class="val" id="val-${item.id}"></span>
                <span class="norme">${item.norm} ${item.unit}</span>
            </div>`;
        });
        tabsContainer.appendChild(div);
        sectionsContainer.appendChild(sec);
    }
}

// --- FONCTIONS DE MISE À JOUR ---
function up(id, val) {
    const el = document.getElementById(id);
    if(el) el.innerText = val || "...";
}

function upDate(id, val) {
    if(!val) return;
    const [y,m,d] = val.split('-');
    const el = document.getElementById(id);
    if(el) el.innerText = `${d}/${m}/${y}`;
}

function updateCausesSub(type) {
    const select = document.getElementById('cause-precision');
    if(!select) return;
    select.innerHTML = '<option value="">-- Sélectionner --</option>';
    if (causesData[type]) {
        causesData[type].forEach(c => { select.innerHTML += `<option value="${c}">${c}</option>`; });
    }
}

function updateCauseFinale(precision) {
    const type = document.getElementById('cause-type').value;
    const el = document.getElementById('d-cause');
    if(el) el.innerText = type + " — " + precision;
}

function genererReference() {
    const n = new Date();
    const ref = n.getDate().toString().padStart(2, '0') + (n.getMonth() + 1).toString().padStart(2, '0') + n.getHours().toString().padStart(2, '0') + n.getMinutes().toString().padStart(2, '0');
    if(document.getElementById('d-ref')) document.getElementById('d-ref').innerText = ref;
    if(document.getElementById('stamp-ref')) document.getElementById('stamp-ref').innerText = ref;
    const qr = document.getElementById('qr-ref');
    if (qr) qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OMC-${ref}`;
}

// --- CAPTURE DISCORD ---
async function capturerEtEnvoyer(webhookURL, fileName, contentMsg, patientId) {
    const docElement = document.getElementById('document');
    const btn = document.getElementById('discord-btn');
    btn.innerText = "📸 ENVOI...";
    btn.disabled = true;

    try {
        const canvas = await html2canvas(docElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            width: 800,
            windowWidth: 1200,
            onclone: (clonedDoc) => {
                const d = clonedDoc.getElementById('document');
                d.style.width = '800px';
                d.style.boxShadow = 'none';
            }
        });

        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            const patientName = document.getElementById(patientId)?.innerText || "Inconnu";
            formData.append("payload_json", JSON.stringify({ content: contentMsg + ` **${patientName}**` }));
            formData.append("file", blob, `${fileName}.png`);
            await fetch(webhookURL, { method: 'POST', body: formData });
            alert("✅ RÉUSSI !");
            btn.innerText = "ENVOYER SUR L'INTRANET";
            btn.disabled = false;
        }, 'image/png');
    } catch (e) { alert("Erreur capture"); btn.disabled = false; }
}

function envoyerDiscord() {
    const url = "https://discord.com/api/webhooks/1462416189526638613/iMpoe9mn6DC4j_0eBS4tOVjaDo_jy1MhfSKIEP80H7Ih3uYGHRcJ5kQSqIFuL0DTqlUy";
    capturerEtEnvoyer(url, "labo", "📑 **RAPPORT LABO** | Patient :", "d-nom");
}

function envoyerDiscordDeces() {
    const url = "TON_WEBHOOK_DECES"; // Mets ton lien ici
    capturerEtEnvoyer(url, "acte", "💀 **ACTE DE DÉCÈS** | Défunt :", "d-defunt");
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    genererReference();
});
