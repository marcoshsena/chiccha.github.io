import { db } from "./js/firebase.js";
import { 
    doc, setDoc, addDoc, collection, getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const produto = params.get("produto");

// Preenche o nome do produto ao carregar
document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("nomeProduto").innerText = produto;
});


/* ============================================
   ➤ Impedir compras duplicadas
   Se o produto já estiver marcado como comprado,
   o formulário será bloqueado.
   ============================================ */
async function verificarDisponibilidade() {
    const ref = doc(db, "produtos", produto);
    const snap = await getDoc(ref);

    if (snap.exists() && snap.data().comprado === true) {
        alert("Este presente já foi confirmado por outra pessoa. Muito obrigado!");
        window.location.href = "lista.html";
        return false;
    }
    return true;
}


/* ============================================
   ➤ Mostrar formulário quando clicar "Sim, comprei!"
   ============================================ */
document.querySelector(".btn-yes").addEventListener("click", async () => {
    const disponivel = await verificarDisponibilidade();
    if (disponivel) {
        document.getElementById("formMensagem").classList.remove("oculto");
    }
});


/* ============================================
   ➤ Enviar mensagem + registrar compra
   ============================================ */
document.getElementById("btnEnviar").addEventListener("click", async () => {

    const nome = document.getElementById("nome").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!nome || !mensagem) {
        alert("Por gentileza, preencha o seu nome e a mensagem.");
        return;
    }

    // Verifica novamente antes de gravar
    const disponivel = await verificarDisponibilidade();
    if (!disponivel) return;

    // Marca o produto como comprado
    await setDoc(doc(db, "produtos", produto), {
        comprado: true,
        comprador: nome,
        data: new Date().toISOString()
    });

    // Salva a mensagem para o painel admin
    await addDoc(collection(db, "mensagens"), {
        produto: produto,
        nome: nome,
        mensagem: mensagem,
        data: new Date().toISOString()
    });

    // Confirmação estilizada
    alert("Obrigado por fazer parte desse nosso sonho! ❤️✨");

    // Retorna à página inicial
    window.location.href = "index.html";
});

