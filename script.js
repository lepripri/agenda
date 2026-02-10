async function ajouterNote(dateId, mode, contenu) {
    if (!Pripri.isConnected) return showMessage("connection réquise");

    // On utilise directement la DB exposée
    const { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
    
    const docRef = doc(window.Pripri.db, "users", user.uid, "agenda", dateId);
    
    try {
        await setDoc(docRef, {
            [mode]: contenu, // Utilise le mode (journal, devoirs...) comme clé
            derniereModif: new Date()
        }, { merge: true });
        console.log("Données synchronisées !");
    } catch (e) {
        console.error("Erreur Firestore:", e);
    }
}
