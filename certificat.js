const IMGBB_API_KEY = "5eed3e87aedfe942a0bbd78503174282"; 
let lastImageUrl = ""; 

// Gère l'affichage des listes de motifs selon la conclusion cochée
function toggleMotifs() {
    const concl = document.querySelector('input[name="concl"]:checked').value;
    
    if(document.getElementById('motif-reserve-group')) {
        document.getElementById('motif-reserve-group').style.display = (concl === "Réserve") ? "block" : "none";
    }
    if(document.getElementById('motif-inapte-group')) {
        document.getElementById('motif-inapte-group').style.display = (concl === "Inapte") ? "block" : "none";
    }
    
    updateCertif();
}

function updateCertif() {
    const type = document.getElementById('f-type').value;
    
    document.getElementById('side-entreprise-block').style.display = (type === "Aptitude professionnelle") ? "block" : "none";
    document.getElementById('doc-entreprise-block').style.display = (type === "Aptitude professionnelle") ? "block" : "none";
    
    document.getElementById('side-concl-block').style.display = (type !== "Divers") ? "block" : "none";
    document.getElementById('doc-concl-block').style.display = (type !== "Divers") ? "block" : "none";
    
    document.getElementById('side-divers-block').style.display = (type === "Divers") ? "block" : "none";
    document.getElementById('doc-divers-block').style.display = (type === "Divers") ? "block" : "none";

    const titres = {
        "Aptitude professionnelle": "CERTIFICAT D'APTITUDE PROFESSIONNELLE",
        "Port d'arme (PPA)": "CERTIFICAT DE CAPACITÉ À PASSER L'EXAMEN DU PPA",
        "Divers": "CERTIFICAT — DIVERS"
    };
    document.getElementById('d-titre-doc').innerText = titres[type] || "CERTIFICAT MÉDICAL";

    const inputNom = document.getElementById('patientName');
    const inputDate = document.getElementById('patientBirth');

    document.getElementById('d-nom').innerText = inputNom && inputNom.value ? inputNom.value : "...";
    
    if(inputDate && inputDate.value) {
        document.getElementById('d-naiss').innerText = new Date(inputDate.value).toLocaleDateString('fr-FR');
    } else {
        document.getElementById('d-naiss').innerText = "...";
    }

    document.getElementById('d-entreprise').innerText = document.getElementById('f-entreprise').value || "...";
    document.getElementById('d-sig').innerText = document.getElementById('f-medecin').value || "DOCTEUR";

    if (type !== "Divers") {
        const c = document.querySelector('input[name="concl"]:checked').value;
        let texteFinal = "";

        if (c === "Apte") texteFinal = "Apte — Aucune contre-indication clinique.";
        else if (c === "Réserve") {
            const motif = document.getElementById('f-motif-reserve').value;
            texteFinal = "Apte avec réserve" + (motif ? ` — ${motif}` : ".");
        } 
        else if (c === "Inapte") {
            const motif = document.getElementById('f-motif-inapte').value;
            texteFinal = "Inapte" + (motif ? ` — ${motif}` : ".");
        }
        document.getElementById('d-concl').innerText = texteFinal;
    } else {
        document.getElementById('d-divers-text').innerText = document.getElementById('f-divers').value || "...";
    }
}

function genererReference() {
    const n = new Date();
    const ref = `${n.getDate()}${n.getMonth()+1}${n.getHours()}${n.getMinutes()}`;
    
    if(document.getElementById('d-ref')) {
        document.getElementById('d-ref').innerText = "#" + ref;
    }
    if(document.getElementById('qr-ref')) {
        document.getElementById('qr-ref').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OMC-CERT-${ref}`;
    }
}

function upDate(targetId, val) {
    if(!val) return;
    document.getElementById(targetId).innerText = new Date(val).toLocaleDateString('fr-FR');
}

// --- INIT & AUTOCOMPLETE AVEC PATCH ---
window.onload = function() {
    // 1. Date du jour auto (seulement si on n'est pas en mode édition)
    const urlParams = new URLSearchParams(window.location.search);
    const isEdit = urlParams.get('mode') === 'edit';

    if(document.getElementById('d-date')) {
        const today = new Date();
        document.getElementById('d-date').innerText = today.toLocaleDateString('fr-FR');
        if(!isEdit) { // On ne change pas la date si on modifie un vieux rapport
            const dateInput = document.querySelector('input[oninput*="d-date"]');
            if(dateInput) dateInput.valueAsDate = today;
        }
    }
    
    genererReference();

    // 2. SYSTÈME DE PATIENT CENTRALISÉ
    setupPatientAutocomplete({
        nameId: 'patientName',
        birthId: 'patientBirth',
        callback: function(p) {
            updateCertif();
        }
    });

    // 3. MODE ÉDITION (RESTAURATION COMPLÈTE)
    if (isEdit) {
        const data = JSON.parse(localStorage.getItem('edit_snapshot'));
        if (data) {
            console.log("Restaurations des données du rapport...", data);
            Object.keys(data).forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    if (el.type === 'checkbox' || el.type === 'radio') {
                        el.checked = data[id];
                    } else {
                        el.value = data[id];
                    }
                }
            });
            
            // On force la mise à jour visuelle du document
            setTimeout(() => {
                toggleMotifs(); // Gère l'affichage des groupes (Inapte/Réserve)
                updateCertif(); 
                if (typeof upNom === 'function') upNom();
            }, 100);

            localStorage.removeItem('edit_snapshot');
        }
    } 
    // 4. MODE PRÉ-REMPLISSAGE SIMPLE (Depuis le dossier, mais nouveau rapport)
    else {
        const patientFromUrl = urlParams.get('patient');
        if (patientFromUrl) {
            const inputNom = document.getElementById('patientName');
            if (inputNom) {
                inputNom.value = decodeURIComponent(patientFromUrl);
                inputNom.dispatchEvent(new Event('input'));
                setTimeout(() => {
                    const firstItem = document.querySelector('.autocomplete-item');
                    if (firstItem) firstItem.click();
                }, 800);
            }
        }
    }
};
// --- FONCTIONS DE GÉNÉRATION AVEC ARCHIVAGE ---

async function genererImage() {
    const btn = event.currentTarget;
    const popup = document.getElementById('image-popup');
    const imgResult = document.getElementById('preview-img-result');

    btn.innerText = "⏳ GÉNÉRATION...";
    btn.disabled = true;

    try {
        // L'archivage se fait en arrière-plan
        const imageUrl = await window.archiverDocument({
            captureId: 'document',
            nomPatientId: 'patientName',
            typeDoc: 'Certificat Médical',
            pageSource: 'certificat.html',
            onSuccess: function(url) {
                // On prépare l'image AVANT d'afficher la popup
                if (url) {
                    imgResult.src = url;
                    document.getElementById('direct-link').value = url;
                    lastImageUrl = url;
                    
                    // On affiche la popup SEULEMENT ici
                    popup.style.display = 'flex';
                }
            }
        });

        if (!imageUrl) {
            throw new Error("L'image n'a pas pu être générée.");
        }

    } catch (e) {
        console.error(e);
        alert("❌ Erreur : Impossible de générer l'aperçu. Vérifiez le nom du patient.");
        popup.style.display = 'none'; // Sécurité : on cache si erreur
    } finally {
        btn.innerText = "🖼️ GÉNÉRER L'IMAGE";
        btn.disabled = false;
    }
}
// Nouvelle fonction pour copier l'IMAGE directement (pas juste le lien)
async function copierImageDirecte() {
    const imgElement = document.getElementById('preview-img-result');
    if (!imgElement.src) return;

    try {
        const response = await fetch(imgElement.src);
        const blob = await response.blob();
        const item = new ClipboardItem({ [blob.type]: blob });
        await navigator.clipboard.write([item]);
        alert("✅ Image copiée ! Tu peux faire CTRL+V sur Discord.");
    } catch (err) {
        console.error("Erreur de copie d'image:", err);
        alert("❌ Impossible de copier l'image directement. Utilise le lien.");
    }
}
async function envoyerDiscord() {
    const url = "https://discord.com/api/webhooks/1421827797965471855/aBgwIgdIRP3TO0Qp_culr5GJHVLDRnwtKnxjv7N62ThG8L_bRQ1gwsqV_aYXhu4eCHa2";
    const btn = document.getElementById('discord-btn');
    const doc = document.getElementById('document');
    
    btn.disabled = true;
    btn.innerText = "ARCHIVAGE & CAPTURE...";

    try {
        // 1. Archivage local (rapide)
        const firebaseUrl = await window.archiverDocument({
            captureId: 'document',
            nomPatientId: 'patientName',
            typeDoc: 'Certificat Médical',
            pageSource: 'certificat.html'
        });

        // 2. Capture de l'image
        const canvas = await html2canvas(doc, { scale: 2, useCORS: true });
        const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
        
        const nom = document.getElementById('d-nom').innerText || "Inconnu";
        const typeDoc = document.getElementById('d-titre-doc').innerText || "Certificat";

        const formData = new FormData();
        formData.append("payload_json", JSON.stringify({
            username: "Intranet OMC",
            // AJOUT CRUCIAL POUR LES SALONS FORUM :
            thread_name: `📝 ${typeDoc} - ${nom}`, 
            content: `📜 **Nouveau Rapport Médical**\n👤 Patient : ${nom}\n📋 Type : ${typeDoc}`
        }));

        formData.append("file", blob, "certificat.png");
        
        // Envoi avec attente de confirmation
        const response = await fetch(url + "?wait=true", { method: 'POST', body: formData });
        
        if(response.ok) {
            alert("✅ Certificat envoyé et archivé !");
            btn.innerText = "ENVOYÉ";
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur Discord");
        }
    } catch (e) {
        console.error(e);
        alert("❌ Erreur d'envoi : " + e.message);
        btn.innerText = "RÉESSAYER";
    } finally {
        btn.disabled = false;
    }
}

function copyLink() {
    const copyText = document.getElementById("direct-link");
    copyText.select();
    document.execCommand("copy");
    alert("✅ Lien copié !");
}

function closePopup() {
    document.getElementById('image-popup').style.display = 'none';
}
