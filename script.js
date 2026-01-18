// ==========================================

// 1. BASES DE DONNÉES (Gardées telles quelles)

// ==========================================

const database = { /* ... tes données ... */ };

const causesData = { /* ... tes causes ... */ };



// ==========================================

// 2. INITIALISATION ET MISES À JOUR

// ==========================================



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

                <span class="help-text">${item.help}</span>

                <label>${item.label}</label>

                <div style="font-size: 0.7em; color: orange; margin-bottom: 5px;">Norme : ${item.norm} ${item.unit}</div>

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



function up(id, val) {

    const el = document.getElementById(id);

    if(el) el.innerText = val || (id==='d-sig' ? "NOM DOCTEUR" : "...");

}



function upDate(id, val) {

    if(!val) return;

    const [y,m,d] = val.split('-');

    const el = document.getElementById(id);

    if(el) el.innerText = `${d}/${m}/${y}`;

}



// ==========================================

// 3. LOGIQUE MÉDICALE (LABO)

// ==========================================



function res(id, val, cat) {

    const row = document.getElementById('row-'+id);

    const valSpan = document.getElementById('val-'+id);

    if(valSpan) valSpan.innerText = val;



    const itemData = Object.values(database).flat().find(i => i.id === id);

    if (val.trim() !== "" && itemData && itemData.norm !== "Négatif" && itemData.norm !== "Conforme") {

        const valNum = parseFloat(val.replace(',', '.'));

        const [min, max] = itemData.norm.replace('0 - ', '0-').split('-').map(n => parseFloat(n));

        valSpan.style.color = (valNum < min || valNum > max) ? "red" : "green";

    } else if (val.toLowerCase() === "positif") { valSpan.style.color = "red"; }

    else if (val.toLowerCase() === "négatif" || val.toLowerCase() === "conforme") { valSpan.style.color = "green"; }



    if(val.trim() !== "") row.classList.add('active'); else row.classList.remove('active');

    const section = document.getElementById('sec-'+cat);

    if(section) section.classList.toggle('active', section.querySelectorAll('.row.active').length > 0);



    analyserTout();

}



function analyserTout() {

    let anomalies = [];

    document.querySelectorAll('.analysis-input').forEach(input => {

        let valText = input.value.trim().replace(',', '.');

        if (!valText) return;

        let label = input.getAttribute('data-label'), norm = input.getAttribute('data-norm');

        if (norm.includes('-') || norm.startsWith('0')) {

            let valNum = parseFloat(valText), [min, max] = norm.replace('0 - ', '0-').split('-').map(n => parseFloat(n));

            if (valNum < min) anomalies.push(`${label} bas`);

            if (valNum > max) anomalies.push(`${label} élevé`);

        } else if (norm === "Négatif" && valText.toLowerCase() === "positif") { anomalies.push(`${label} POSITIF`); }

    });

    let autoConcl = anomalies.length > 0 ? "Points d'attention : " + anomalies.join(', ') + "." : "Bilan biologique satisfaisant.";

    const textZone = document.getElementById('auto-concl-area');

    if(textZone) textZone.value = autoConcl;

    const conclEl = document.getElementById('d-concl');

    if(conclEl) conclEl.innerText = autoConcl;

}



// ==========================================

// 4. LOGIQUE DÉCÈS

// ==========================================



let typeSelectionne = "";



function updateCausesSub(type) {

    typeSelectionne = type;

    const select = document.getElementById('cause-precision');

    if(!select) return;



    select.innerHTML = '<option value="">-- Sélectionner --</option>';

    if (causesData[type]) {

        causesData[type].forEach(c => {

            select.innerHTML += `<option value="${c}">${c}</option>`;

        });

    }

}



function updateCauseFinale(precision) {

    const blocAffichage = document.getElementById('d-cause');

    if (blocAffichage && precision !== "") {

        blocAffichage.innerText = `${typeSelectionne} — ${precision}`;

    }

}



function genererReference() {

    const n = new Date();

    const jour = n.getDate().toString().padStart(2, '0');

    const mois = (n.getMonth() + 1).toString().padStart(2, '0');

    const heure = n.getHours().toString().padStart(2, '0');

    const minute = n.getMinutes().toString().padStart(2, '0');

    const ref = `${jour}${mois}${heure}${minute}`;



    const elements = { 'd-ref': ref, 'stamp-ref': ref };

    for (let id in elements) {

        let el = document.getElementById(id);

        if (el) el.innerText = elements[id];

    }



    const qr = document.getElementById('qr-ref');

    if (qr) qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OMC-DECES-${ref}`;

}



// ==========================================

// 5. ENVOIS DISCORD (FIX COUPE IMAGE)

// ==========================================



async function capturerEtEnvoyer(webhookURL, fileName, contentMsg, patientId) {

    const docElement = document.getElementById('document');

    if(!docElement) return;



    const btn = document.getElementById('discord-btn');

    btn.innerText = "📸 ENVOI...";

    btn.disabled = true;



    try {

        const canvas = await html2canvas(docElement, {

            scale: 2,

            useCORS: true,

            backgroundColor: "#ffffff",

            width: 800,           // On force la photo à faire 800px

            windowWidth: 1200,    // On simule un écran très large pour le rendu

            scrollX: 0,

            scrollY: 0,

            onclone: (clonedDoc) => {

                const d = clonedDoc.getElementById('document');

                d.style.margin = '0';

                d.style.boxShadow = 'none';
            }

        });



        canvas.toBlob(async (blob) => {

            const formData = new FormData();

            const patientName = document.getElementById(patientId)?.innerText || "Inconnu";



            formData.append("payload_json", JSON.stringify({

                content: contentMsg + ` **${patientName}**`

            }));

            formData.append("file", blob, `${fileName}.png`);



            await fetch(webhookURL, { method: 'POST', body: formData });

            alert("✅ RÉUSSI ! Tout est sur Discord.");

        }, 'image/png');



    } catch (error) {

        alert("❌ Erreur. Vérifie ta console (F12)");

    } finally {

        btn.innerText = "ENVOYER SUR L'INTRANET";

        btn.disabled = false;

    }

}



function envoyerDiscord() {

    const url = "https://discord.com/api/webhooks/1462416189526638613/iMpoe9mn6DC4j_0eBS4tOVjaDo_jy1MhfSKIEP80H7Ih3uYGHRcJ5kQSqIFuL0DTqlUy";

    capturerEtEnvoyer(url, "labo", "📑 **NOUVEAU RAPPORT DE LABORATOIRE** | Patient :", "d-nom");

}



function envoyerDiscordDeces() {

    const url = "TON_WEBHOOK_DECES_ICI";

    capturerEtEnvoyer(url, "acte", "💀 **NOUVEL ACTE DE DÉCÈS ÉTABLI** | Défunt :", "d-defunt");

}



// ==========================================

// 6. LANCEMENT

// ==========================================



document.addEventListener('DOMContentLoaded', () => {

    init();

    genererReference();

});
