import { db } from "./js/firebase.js";
import { doc, getDoc, setDoc, collection, addDoc } 
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);
    const produto = params.get("produto");
    document.getElementById("nomeProduto").innerText = produto;

    const btnSim = document.getElementById("btnSim");
    const btnNao = document.getElementById("btnNao");
    const form = document.getElementById("formMensagem");
    const btnEnviar = document.getElementById("btnEnviar");

    // Verificar se o produto já foi comprado
    const docRef = doc(db, "produtos", produto);
    const snap = await getDoc(docRef);

    if (snap.exists() && snap.data().comprado === true) {
        btnSim.disabled = true;
        btnSim.innerText = "Já foi comprado ❤️";
    }

    // Botão "Sim, comprei!" abre o formulário
    btnSim.addEventListener("click", () => {
        form.classList.remove("oculto");
    });

    // Botão "Não" volta para home
    btnNao.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    // Enviar mensagem + registrar compra
    btnEnviar.addEventListener("click", async () => {
        const nome = document.getElementById("nome").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();

        if (!nome || !mensagem) {
            alert("Preencha seu nome e a mensagem!");
            return;
        }

        // Salvar compra
        await setDoc(doc(db, "produtos", produto), {
            comprado: true,
            comprador: nome,
            data: new Date().toISOString()
        });

        // Registrar mensagem
        await addDoc(collection(db, "mensagens"), {
            produto: produto,
            nome: nome,
            mensagem: mensagem,
            data: new Date().toISOString()
        });

        // Mensagem linda de agradecimento
        alert("Obrigado por fazer parte desse nosso sonho! ❤️💛");

        // Redirecionar
        window.location.href = "index.html";
    });
});
