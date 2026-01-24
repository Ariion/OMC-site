// 1. BASE DE DONNÉES DES MÉDICAMENTS
const medsDB = {
    "Médecine Générale": [
        "Paracétamol (Antidouleur/Fièvre)", 
        "Ibuprofène (Anti-inflammatoire)", 
        "Amoxicilline (Antibiotique)", 
        "Oméprazole (Protection estomac)", 
        "Salbutamol (Asthme/Ventoline)", 
        "Prednisolone (Cortisone)", 
        "Spasfon (Douleurs ventre)"
    ],
    "Psychologie": [
        "Sertraline (Antidépresseur)", 
        "Alprazolam (Anxiolytique/Xanax)", 
        "Quétiapine (Régulateur humeur)", 
        "Hydroxyzine (Sédatif léger)", 
        "Zolpidem (Somnifère)"
    ],
    "Chirurgie": [
        "Tramadol (Douleur modérée)", 
        "Paracétamol Codéiné (Douleur forte)", 
        "Augmentin (Antibiotique puissant)", 
        "Lovenox (Anticoagulant)", 
        "Bétadine (Désinfectant)", 
        "Morphine (Douleur intense)"
    ],
    "Gynécologie": [
        "Spasfon (Douleurs règles)", 
        "Amoxicilline (Infection)", 
        "Acide folique (Grossesse)", 
        "Pilule contraceptive", 
        "Ovule antifongique (Mycose)"
    ],
    "Kiné": [
        "Diclofénac Gel (Anti-inflammatoire)", 
        "Paracétamol (Douleur)", 
        "Baclofène (Décontractant musculaire)", 
        "Patch Chauffant (Douleur dos)", 
        "Ketoprofène (Anti-inflammatoire fort)"
    ]
};

// 2. INITIALISATION
document.addEventListener('DOMContentLoaded', () => {
    updateMeds("Médecine Générale");
    genererReference();
    
    // Date du jour
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('input-date');
    if(dateInput) dateInput.value = today;
    upDate('d-date', today);
    
    updateQR();
});

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
    // Correction : On affiche juste "Dr. Nom" ou "..." si vide
    if(el) el.innerText = val ? "Dr. " + val : "...";
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

// 4. AIDE POSOLOGIE
function fillPoso(val) {
    const input = document.getElementById('input-poso');
    if(input && val) input.value = val;
}

// 5. GESTION MÉDICAMENTS
function updateMeds(service) {
    const select = document.getElementById('med-select');
    select.innerHTML = "";
    if(medsDB[service]) {
        medsDB[service].forEach(med => {
            let opt = document.createElement('option');
            opt.value = med.split(' (')[0]; // On garde juste le nom pour la valeur
            opt.innerText = med; // On affiche Nom + (Famille)
            select.appendChild(opt);
        });
    }
}

function ajouterLigne() {
    const select = document.getElementById('med-select');
    // Sécurité si la liste est vide
    if (select.selectedIndex === -1) return; 

    const medFull = select.options[select.selectedIndex].text;
    const dosage = document.getElementById('input-dosage').value || "-";
    const duree = document.getElementById('input-duree').value || "-";
    const poso = document.getElementById('input-poso').value || "Selon instructions";

    const list = document.getElementById('ordo-list');
    
    // Enlève le message "Aucune prescription" si présent
    const emptyMsg = list.querySelector('.empty-msg');
    if(emptyMsg) emptyMsg.remove();

    const li = document.createElement('li');
    const medName = medFull.split(' (')[0]; 
    
    li.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span class="med-name">${medName} <small style="font-weight: normal; color: #666;">${dosage}</small></span>
            <span style="font-weight: bold; font-size: 14px;">${duree}</span>
        </div>
        <div class="med-details">➤ ${poso}</div>
        <span class="del-btn" onclick="supprimerLigne(this)">✖</span>
    `;
    
    list.appendChild(li);
    updateQR();
}

// NOUVELLE FONCTION
function supprimerLigne(btn) {
    // Supprime la ligne parent (li) du bouton cliqué
    const li = btn.closest('li');
    li.remove();

    // Si la liste est vide, on remet le message par défaut
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

// 6. RÉFÉRENCE JJMMHHMM
function genererReference() {
    const n = new Date();
    const jj = n.getDate().toString().padStart(2, '0');
    const mm = (n.getMonth() + 1).toString().padStart(2, '0');
    const hh = n.getHours().toString().padStart(2, '0');
    const min = n.getMinutes().toString().padStart(2, '0');
    
    const ref = `${jj}${mm}${hh}${min}`;
    document.getElementById('d-ref').innerText = "#" + ref;
    updateQR();
}

function updateQR() {
    const ref = document.getElementById('d-ref').innerText;
    const nom = document.getElementById('input-nom').value || "Inconnu";
    const medecin = document.getElementById('display-sig').innerText;
    const nbMeds = document.querySelectorAll('#ordo-list li:not(.empty-msg)').length;

    const qrImg = document.getElementById('qr-ref');
    if(qrImg) {
        const data = encodeURIComponent(`OMC|${ref}|PATIENT:${nom}|DR:${medecin}|NB_MEDS:${nbMeds}`);
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
    }
}

// 7. EXPORT IMAGE (Même logique que Décès)
const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282";

async function genererImage() {
    const doc = document.getElementById('document');
    const btn = event.target;
    btn.innerText = "GÉNÉRATION...";
    btn.disabled = true;

    // 1. On ajoute la classe qui cache les croix rouges
    doc.classList.add('mode-capture');

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
        // 2. On retire la classe pour réafficher les croix
        doc.classList.remove('mode-capture');
        btn.innerText = "🖼️ GÉNÉRER L'ORDONNANCE";
        btn.disabled = false;
    }
}

// 8. ENVOI DISCORD
async function envoyerDiscord() {
    const url = "https://discord.com/api/webhooks/1462416189526638613/iMpoe9mn6DC4j_0eBS4tOVjaDo_jy1MhfSKIEP80H7Ih3uYGHRcJ5kQSqIFuL0DTqlUy";
    const btn = document.getElementById('discord-btn');
    const doc = document.getElementById('document');

    btn.disabled = true;
    btn.innerText = "CAPTURE...";

    // 1. On cache les croix rouges
    doc.classList.add('mode-capture');

    try {
        // On capture le document propre
        const canvas = await html2canvas(doc, { 
            scale: 2, 
            useCORS: true,
            // On s'assure de tout capturer même si c'est long
            height: doc.scrollHeight,
            windowHeight: doc.scrollHeight
        });

        // 2. On réaffiche les croix tout de suite après la photo (pas besoin d'attendre l'envoi)
        doc.classList.remove('mode-capture');
        
        btn.innerText = "ENVOI...";

        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            const nom = document.getElementById('input-nom').value || "Inconnu";
            
            formData.append("payload_json", JSON.stringify({
                content: `💊 **Nouvelle Ordonnance**\n👤 Patient : ${nom}`
            }));
            formData.append("file", blob, `ordo_${nom}.png`);

            const response = await fetch(url, { method: 'POST', body: formData });
            
            if(response.ok) { 
                alert("✅ Envoyé sur l'intranet !"); 
                btn.innerText = "ENVOYÉ"; 
            } else {
                throw new Error("Erreur serveur Discord");
            }
            
            // On réactive le bouton après l'envoi
            btn.disabled = false;
            setTimeout(() => { btn.innerText = "ENVOYER SUR DISCORD"; }, 2000);

        }, 'image/png');

    } catch (e) {
        console.error(e);
        alert("❌ Erreur lors de l'envoi.");
        
        // Sécurité : on réaffiche les croix si ça plante
        doc.classList.remove('mode-capture');
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
