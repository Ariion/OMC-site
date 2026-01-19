const causesData = {
    "Neurologique": ["Hémorragie méningée", "Traumatisme cranien sévère"],
    "Hémorragique": ["Hémorragie interne massive", "Rupture d'anévrisme"],
    "Infectieuse": ["Choc septique", "Méningite"],
    "Traumatique": ["Polytraumatisme", "Plaie par balle"]
};

function updateCausesSub(type) {
    const select = document.getElementById('cause-precision');
    if(!select) return;
    select.innerHTML = '<option value="">-- Sélectionner --</option>';
    if (causesData[type]) {
        causesData[type].forEach(c => select.innerHTML += `<option value="${c}">${c}</option>`);
    }
}

function updateCauseFinale(val) { document.getElementById('d-cause').innerText = val; }

function genererReference() {
    const ref = Math.floor(Math.random() * 900000) + 100000;
    document.getElementById('d-ref').innerText = ref;
    document.getElementById('qr-ref').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OMC-${ref}`;
}

document.addEventListener('DOMContentLoaded', genererReference);
