// js/confirmacao.js
import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const produto = params.get("produto") || "Produto desconhecido";

function $id(id){ return document.getElementById(id); }

document.addEventListener("DOMContentLoaded", () => {
  // preenche o nome do produto
  $id("nomeProduto").innerText = produto;

  // botões
  $id("btnSim").addEventListener("click", abrirFormulario);
  $id("btnNao").addEventListener("click", () => { window.location.href = "index.html"; });

  // enviar
  $id("btnEnviar").addEventListener("click", enviarMensagem);
});

function abrirFormulario() {
  const form = $id("formMensagem");
  form.classList.remove("oculto");
  form.setAttribute("aria-hidden", "false");
  // opcional: focar no campo nome
  $id("nome").focus();
}

async function enviarMensagem(e) {
  e.preventDefault();

  const btn = $id("btnEnviar");
  const nome = $id("nome").value.trim();
  const mensagem = $id("mensagem").value.trim();

  if (!nome || !mensagem) {
    alert("Por favor, preencha seu nome e a mensagem.");
    return;
  }

  try {
    // desativa botão para evitar múltiplos cliques
    btn.disabled = true;
    btn.innerText = "Enviando...";

    // primeiro: verifica se o produto já foi marcado como comprado
    const prodRef = doc(db, "produtos", produto);
    const prodSnap = await getDoc(prodRef);

    if (prodSnap.exists() && prodSnap.data().comprado === true) {
      alert("Desculpe — este produto já foi marcado como comprado por outra pessoa.");
      btn.disabled = false;
      btn.innerText = "Enviar Mensagem";
      return;
    }

    // marca o produto como comprado (create/update)
    await setDoc(prodRef, {
      comprado: true,
      comprador: nome,
      produto: produto,
      timestamp: new Date().toISOString()
    });

    // salva mensagem em "mensagens"
    await addDoc(collection(db, "mensagens"), {
      produto: produto,
      nome: nome,
      mensagem: mensagem,
      timestamp: new Date().toISOString()
    });

    // registra um evento no histórico
    await addDoc(collection(db, "historico"), {
      evento: `${nome} comprou "${produto}" e enviou mensagem.`,
      produto: produto,
      nome: nome,
      mensagem: mensagem,
      timestamp: new Date().toISOString()
    });

    // feedback bonito (alert + redireciona em 1.6s)
    alert("Obrigado por fazer parte desse nosso Sonho! ❤️🥰");
    window.location.href = "index.html";

  } catch (err) {
    console.error("Erro ao enviar mensagem:", err);
    alert("Ocorreu um erro ao enviar. Tente novamente.");
    $id("btnEnviar").disabled = false;
    $id("btnEnviar").innerText = "Enviar Mensagem";
  }
}
