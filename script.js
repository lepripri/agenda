const dialog = document.querySelector('dialog');
const modeSelect = document.getElementById('agendaMode');
let selectedCell = null;

// 1. Cliquer sur une case pour ouvrir
document.getElementById('grid').addEventListener('click', (e) => {
    const cell = e.target.closest('th, td');
    if (!cell || (cell.tagName === 'TH' && cell.innerText)) return;

    selectedCell = {
        element: cell, // On stocke l'élément pour changer sa couleur plus tard
        row: cell.parentElement.className,
        col: cell.cellIndex
    };
    
    document.querySelector('dialog:not(.message)').showModal();
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
    const mode = document.getElementById('agendaMode').value;
    const user = window.Pripri.auth.currentUser;

    // 1. Vérification du mode
    if (mode === "options") {
        showMessage("Aucun mode choisi");
        return;
    }

    // 2. Vérification de connexion
    if (!user) {
        showMessage("Connecte-toi d'abord");
        return;
    }

    const dateId = `2026_${selectedCell.col}_${selectedCell.row}`;
    
    try {
        const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js");
        const docRef = doc(window.Pripri.db, "users", user.uid, "agenda", dateId);

        await setDoc(docRef, {
            [mode]: { title, text: content, updatedAt: new Date() }
        }, { merge: true });

        // 3. Succès : on ferme la modale de saisie via le callback de showMessage
        showMessage("Enregistré avec succès", () => {
            const entryDialog = document.querySelector('dialog:not(.message)');
            if (entryDialog) entryDialog.close();
            
            // Optionnel : Colorer la case dans la grille pour montrer qu'elle est pleine
            if (selectedCell.element) {
                selectedCell.element.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
            }
        });

    } catch (error) {
        console.error(error);
        showMessage("Échec de l'enregistrement");
    }
};
