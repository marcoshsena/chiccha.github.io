import {
  db,
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp
} from "./firebase.js";

const params = new URLSearchParams(window.location.search);
const produto = params.get("produto") || "Produto desconhecido";

function $(id) { return document.getElementById(id); }

document.addEventListener("DOMContentLoaded", () => {
  $("#nomeProduto").innerText = produto;

  $("#btnSim").addEventListener("click", () => {
    $("#formMensagem").classList.remove("oculto");
  });

  $("#btnNao").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  $("#btnEnviar").addEventListener("click", enviarMensagem);
});

async function enviarMensagem(e) {
  e.preventDefault();

  const nome = $("#nome").value.trim();
  const mensagem = $("#mensagem").value.trim();

  if (!nome || !mensagem) {
    alert("Preencha seu nome e sua mensagem!");
    return;
  }

  const prodRef = doc(collection(db, "produtos"), produto);
  const snap = await getDoc(prodRef);

  if (snap.exists() && snap.data().comprado) {
    alert("Este produto já foi comprado!");
    return;
  }

  await setDoc(prodRef, {
    comprado: true,
    comprador: nome,
    produto: produto,
    timestamp: serverTimestamp()
  });

  await addDoc(collection(db, "mensagens"), {
    produto,
    nome,
    mensagem,
    timestamp: serverTimestamp()
  });

  await addDoc(collection(db, "historico"), {
    evento: `${nome} comprou ${produto}`,
    nome, produto, mensagem,
    timestamp: serverTimestamp()
  });

  alert("Obrigado por fazer parte desse nosso sonho! ❤️🥰");
  window.location.href = "index.html";
}
