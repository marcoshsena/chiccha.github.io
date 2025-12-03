// js/produto.js
import { db } from "./firebase.js";
import { doc, getDoc } 
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

async function verificarProdutos() {
    const cards = document.querySelectorAll(".card");

    cards.forEach(async card => {
        const produto = card.getAttribute("data-name");

        const ref = doc(db, "produtos", produto);
        const snap = await getDoc(ref);

        if (snap.exists() && snap.data().comprado === true) {

            const botao = card.querySelector(".btn");
            botao.innerText = "Indisponível ❌";
            botao.style.background = "#777";
            botao.style.pointerEvents = "none";
            botao.style.cursor = "not-allowed";

            // opcional: deixar o card cinza
            card.style.opacity = "0.6";
        }
    });
}

document.addEventListener("DOMContentLoaded", verificarProdutos);
