import { auth, onAuthStateChanged, db } from "./firebase.js";
import { 
  collection, onSnapshot, query, orderBy, updateDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Redireciona se não estiver logado
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "login.html";
});

// -----------------------------
// LISTA DE PRODUTOS COMPRADOS
// -----------------------------
const qProdutos = query(collection(db, "produtos"));

onSnapshot(qProdutos, (snap) => {
  const box = document.getElementById("listaComprados");
  box.innerHTML = "";

  snap.forEach((docSnap) => {
    const d = docSnap.data();

    if (!d.comprado) return; // só mostra comprados

    box.innerHTML += `
      <div class="admin-item">
        <b>${d.produto}</b> — comprado por ${d.comprador}
        <button onclick="reverter('${docSnap.id}')">Desfazer</button>
      </div>
    `;
  });
});

// -----------------------------
// MENSAGENS
// -----------------------------
const qMensagens = query(collection(db, "mensagens"), orderBy("timestamp", "desc"));
onSnapshot(qMensagens, (snap) => {
  const box = document.getElementById("listaMensagens");
  box.innerHTML = "";
  snap.forEach((docSnap) => {
    const d = docSnap.data();
    box.innerHTML += `
      <div class="admin-item">
        <b>${d.nome}:</b> ${d.mensagem}
      </div>`;
  });
});

// -----------------------------
// HISTÓRICO
// -----------------------------
const qHistorico = query(collection(db, "historico"), orderBy("timestamp", "desc"));
onSnapshot(qHistorico, (snap) => {
  const box = document.getElementById("listaHistorico");
  box.innerHTML = "";
  snap.forEach((docSnap) => {
    const d = docSnap.data();
    box.innerHTML += `<div class="admin-item">${d.evento}</div>`;
  });
});

// -----------------------------
// REVERTER PRODUTO
// -----------------------------
window.reverter = async function (produtoID) {
  if (!confirm("Deseja realmente reverter este produto para disponível?")) return;

  const ref = doc(db, "produtos", produtoID);
  await updateDoc(ref, {
    comprado: false,
    comprador: "",
    timestamp: new Date().toISOString()
  });

  alert("Produto revertido!");
};

// LOGOUT
window.logout = function () {
  auth.signOut();
};
