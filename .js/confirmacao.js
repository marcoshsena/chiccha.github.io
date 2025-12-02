import { db } from "./firebase.js";
import { doc, setDoc, updateDoc, collection, addDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const produto = params.get("produto");
document.getElementById("nomeProduto").innerText = produto;

// Quando clica "Sim, comprei!"
document.querySelector(".btn-yes").addEventListener("click", () => {
    document.getElementById("formMensagem").classList.remove("oculto");
});

// Enviar mensagem + registrar compra
document.getElementById("btnEnviar").addEventListener("click", async () => {
    const nome = document.getElementById("nome").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!nome || !mensagem) {
        alert("Preencha seu nome e a mensagem!");
        return;
    }

    // Marca o produto como comprado
    await setDoc(doc(db, "produtos", produto), {
        comprado: true,
        comprador: nome,
        data: new Date().toISOString()
    });

    // Salva mensagem em uma coleção separada
    await addDoc(collection(db, "mensagens"), {
        produto: produto,
        nome: nome,
        mensagem: mensagem,
        data: new Date().toISOString()
    });

    alert("Mensagem enviada! Obrigado 💛");
    window.location.href = "index.html";
});
