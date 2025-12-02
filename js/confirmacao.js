// js/confirmacao.js
import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const produto = params.get("produto") || "Produto desconhecido";

function $id(id){ return document.getElementById(id); }

document.addEventListener("DOMContentLoaded", () => {
  $id("nomeProduto").innerText = produto;

  $id("btnSim").addEventListener("click", () => {
    $id("formMensagem").classList.remove("oculto");
    $id("nome").focus();
  });

  $id("btnNao").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  $id("btnEnviar").addEventListener("click", enviarMensagem);
});

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
    btn.disabled = true;
    btn.innerText = "Enviando...";

    const prodRef = doc(db, "produtos", produto);
    const prodSnap = await getDoc(prodRef);

    if (prodSnap.exists() && prodSnap.data().comprado === true) {
      alert("Desculpe — este produto já foi marcado como comprado.");
      btn.disabled = false;
      btn.innerText = "Enviar Mensagem";
      return;
    }

    await setDoc(prodRef, {
      comprado: true,
      comprador: nome,
      produto: produto,
      timestamp: new Date().toISOString()
    });

    await addDoc(collection(db, "mensagens"), {
      produto: produto,
      nome: nome,
      mensagem: mensagem,
      timestamp: new Date().toISOString()
    });

    await addDoc(collection(db, "historico"), {
      evento: `${nome} comprou "${produto}" e deixou mensagem.`,
      produto: produto,
      nome: nome,
      mensagem: mensagem,
      timestamp: new Date().toISOString()
    });

    alert("Obrigado por fazer parte desse nosso Sonho! ❤️🥰");
    window.location.href = "index.html";
  } catch (err) {
    console.error("Erro ao enviar mensagem:", err);
    alert("Ocorreu um erro ao enviar. Tente novamente.");
    btn.disabled = false;
    btn.innerText = "Enviar Mensagem";
  }
}

