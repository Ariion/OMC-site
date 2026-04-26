const DATA = [
    {
        title: "Plaie par balle",
        tags: ["trauma", "urgence"],
        content: `
            <div class="guide-section">
                <div class="guide-section-title">Types</div>
                - Traversante<br>
                - Perforante<br>
            </div>

            <div class="guide-section">
                <div class="guide-section-title">Procédure RP</div>
                - Vérifier conscience<br>
                - Contrôler hémorragie<br>
                - Immobilisation<br>
                - Transport bloc
            </div>
        `
    },
    {
        title: "Arrêt cardiaque",
        tags: ["urgence"],
        content: `
            <div class="guide-section">
                <div class="guide-section-title">Procédure</div>
                - Massage cardiaque<br>
                - Défibrillateur<br>
                - Adrénaline<br>
            </div>
        `
    }
];

const list = document.getElementById("guide-list");
const display = document.getElementById("guide-display");
const search = document.getElementById("search");

function renderList(filter = "") {
    list.innerHTML = "";

    DATA
    .filter(item =>
        item.title.toLowerCase().includes(filter.toLowerCase()) ||
        item.tags.some(t => t.includes(filter.toLowerCase()))
    )
    .forEach(item => {
        const div = document.createElement("div");
        div.className = "guide-item";

        div.innerHTML = `
            <strong>${item.title}</strong><br>
            ${item.tags.map(t => `<span class="tag">${t}</span>`).join("")}
        `;

        div.onclick = () => renderContent(item);

        list.appendChild(div);
    });
}

function renderContent(item) {
    display.innerHTML = `
        <h2>${item.title}</h2>
        ${item.content}
    `;
}

search.addEventListener("input", e => {
    renderList(e.target.value);
});

renderList();