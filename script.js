const dialog = document.querySelector('dialog');
const modeSelect = document.getElementById('agendaMode');
let selectedCell = null;

// 1. Cliquer sur une case pour ouvrir
document.getElementById('grid').addEventListener('click', (e) => {
    const cell = e.target.closest('th, td');
    if (!cell || cell.tagName === 'TH' && cell.innerText) return; // Évite les numéros de ligne

    selectedCell = {
        row: cell.parentElement.className,
        col: cell.cellIndex,
        mode: modeSelect.value
    };

    if (selectedCell.mode === "options") return showMessage("aucun mode choisis");
    
    dialog.showModal();
});

// 2. Bouton Annuler
document.getElementById('cancel').onclick = () => {
    dialog.close();
    document.getElementById('noteTitle').value = "";
    document.getElementById('noteContent').value = "";
};

// 3. Bouton OK (Sauvegarde Firestore)
document.getElementById('ok').onclick = async () => {
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    const user = window.Pripri.auth.currentUser;

    if (!Pripri.isConnected) return showMessage("Connecte-toi !");

    // Chemin : users / UID / agenda / ANNEE_MOIS_JOUR
    // On crée un ID unique basé sur la position dans la grille pour l'exemple
    const dateId = `2026_${selectedCell.col}_${selectedCell.row}`;
    
    try {
        const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js");
        const docRef = doc(window.Pripri.db, "users", user.uid, "agenda", dateId);

        await setDoc(docRef, {
            [selectedCell.mode]: {
                title: title,
                text: content,
                updatedAt: new Date()
            }
        }, { merge: true });

        console.log("Enregistré !");
        showMessage("enregistré avec succes", dialog.close());
    } catch (error) {
        console.error("Erreur:", error);
        showMessage("échec de l'enregistrement");
    }
};
