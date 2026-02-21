/* ============================================================
   GENERATION.JS - MOTEUR UNIVERSEL OMC (Version 2026)
   Centralise : Capture, ImgBB, Archivage Firebase & Anti-Doublon
   ============================================================ */

// Verrou pour éviter de créer 2 lignes dans le dossier patient pour le même document
window.omcArchiveLock = {
    done: false,
    url: null,
    type: null
};

/**
 * MOTEUR PRINCIPAL
 * @param {Object} config - { captureId, nomPatientId, typeDoc, pageSource, imgBBKey }
 */
window.omc_moteur_universel = async function(config) {
    const { captureId, nomPatientId, typeDoc, pageSource, imgBBKey } = config;

    // 1. Sécurité : Si déjà archivé durant cette session, on renvoie l'existant
    if (window.omcArchiveLock.done && window.omcArchiveLock.type === typeDoc) {
        console.log("♻️ Document déjà archivé, récupération du lien existant...");
        return { url: window.omcArchiveLock.url, isNew: false };
    }

    try {
        // 2. Capture HTML2Canvas
        const element = document.getElementById(captureId);
        if (!element) throw new Error("Élément à capturer introuvable");

        const canvas = await html2canvas(element, { scale: 1.5, useCORS: true });
        const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.8));

        // 3. Hébergement ImgBB (Lien court RP)
        const formData = new FormData();
        formData.append("image", blob);
        
        const resBB = await fetch(`https://api.imgbb.com/1/upload?key=${imgBBKey}`, {
            method: "POST",
            body: formData
        });
        const jsonBB = await resBB.json();
        if (!jsonBB.success) throw new Error("Erreur ImgBB: " + jsonBB.error.message);
        
        const shortUrl = jsonBB.data.url;

        // 4. Aspiration des données du formulaire (le "Sac à dos")
        const formSnapshot = {};
        document.querySelectorAll('input, textarea, select').forEach(el => {
            if (el.id) {
                formSnapshot[el.id] = (el.type === 'checkbox' || el.type === 'radio') 
                    ? el.checked 
                    : el.value;
            }
        });

        // 5. Archivage Firebase (Dossier Patient)
        // Note: Utilise la fonction de global.js
        const nomPatient = document.getElementById(nomPatientId).value || "Anonyme";
        if (window.ajouterEvenementPatient) {
            await window.ajouterEvenementPatient(
                nomPatient, 
                typeDoc, 
                typeDoc, 
                shortUrl, 
                pageSource, 
                formSnapshot
            );
        }

        // 6. Verrouillage de la session
        window.omcArchiveLock = { done: true, url: shortUrl, type: typeDoc };
        
        return { url: shortUrl, isNew: true };

    } catch (e) {
        console.error("❌ Erreur Moteur Generation:", e);
        alert("Erreur lors de la génération : " + e.message);
        return null;
    }
};

/**
 * UTILITAIRE : RESET DU VERROU
 * À appeler si on change de patient sans recharger la page
 */
window.omc_reset_generation = function() {
    window.omcArchiveLock = { done: false, url: null, type: null };
    console.log("🔄 Verrou de génération réinitialisé.");
};
