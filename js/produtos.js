import { db } from "./js/firebase.js";
import { doc, getDoc, setDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function verificarProdutos() {
    const cards = document.querySelectorAll(".card");

    cards.forEach(async card => {
        const produto = card.getAttribute("data-name");
        const ref = doc(db, "produtos", produto);
        const snap = await getDoc(ref);

        if (snap.exists() && snap.data().comprado === true) {
            const botao = card.querySelector(".btn");
            botao.innerText = "Indisponível";
            botao.style.background = "#999";
            botao.style.pointerEvents = "none";
        }
    });
}

document.addEventListener("DOMContentLoaded", verificarProdutos);
