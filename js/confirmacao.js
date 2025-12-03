// js/confirmacao.js
import { db } from "./firebase.js";
import {
  doc, getDoc, setDoc, addDoc, collection
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const produtoId = params.get("id"); // slug, ex: "micro-ondas-panasonic"
const produtoNomeExibicao = params.get("nome") || null; // opcional, se quiser passar o nome legível

function $id(id){ return document.getElementById(id); }

document.addEventListener("DOMContentLoaded", () => {
  // preenche o nome do produto: se tiver nome pela URL, usa; senão tenta buscar no Firestore (campo produto)
  if (produtoNomeExibicao) {
    $id("nomeProduto").innerText = decodeURIComponent(produtoNomeExibicao);
  } else {
    $id("nomeProduto").innerText = produtoId || "Produto desconhecido";
  }

  $id("btnSim").addEventListener("click", abrirFormulario);
  $id("btnNao").addEventListener("click", () => { window.location.href = "index.html"; });
  $id("btnEnviar").addEventListener("click", enviarMensagem);
});

function abrirFormulario() {
  $id("formMensagem").classList.remove("oculto");
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

  if (!produtoId) {
    alert("Produto inválido. Tente novamente.");
    return;
  }

  try {
    btn.disabled = true;
    btn.innerText = "Enviando...";

    const prodRef = doc(db, "produtos", produtoId);
    const prodSnap = await getDoc(prodRef);

    if (prodSnap.exists() && prodSnap.data().comprado === true) {
      alert("Desculpe — este produto já foi marcado como comprado por outra pessoa.");
      btn.disabled = false;
      btn.innerText = "Enviar Mensagem";
      return;
    }

    await setDoc(prodRef, {
      comprado: true,
      comprador: nome,
      produtoNome: produtoNomeExibicao || "", // opcional
      timestamp: new Date().toISOString()
    });

    await addDoc(collection(db, "mensagens"), {
      produtoId: produtoId,
      produtoNome: produtoNomeExibicao || "",
      nome,
      mensagem,
      timestamp: new Date().toISOString()
    });

    await addDoc(collection(db, "historico"), {
      evento: `${nome} comprou "${produtoId}" e enviou mensagem.`,
      produtoId,
      nome,
      mensagem,
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
