// js/produtos.js
import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

async function verificarProdutos() {
    const cards = document.querySelectorAll(".card");

    cards.forEach(async card => {
        const produtoId = card.getAttribute("data-id");
        if (!produtoId) return;

        const ref = doc(db, "produtos", produtoId);
        try {
            const snap = await getDoc(ref);
            if (snap.exists() && snap.data().comprado === true) {
                const botao = card.querySelector(".btn");
                botao.innerText = "Indisponível ❌";
                botao.style.background = "#777";
                botao.style.pointerEvents = "none";
                botao.style.cursor = "not-allowed";
                card.style.opacity = "0.6";
            }
        } catch (err) {
            console.error("Erro ao verificar produto:", produtoId, err);
        }
    });
}

document.addEventListener("DOMContentLoaded", verificarProdutos);
