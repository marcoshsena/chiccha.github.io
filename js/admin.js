import { auth, onAuthStateChanged, db } from "./firebase.js";
import { 
  collection, onSnapshot, query, orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "login.html";
});

// LISTA DE PRODUTOS COMPRADOS
const qComprados = query(collection(db, "comprados"));
onSnapshot(qComprados, (snap) => {
  const box = document.getElementById("listaComprados");
  box.innerHTML = "";
  snap.forEach((doc) => {
    const d = doc.data();
    box.innerHTML += `<div class="admin-item">${d.produto} — por ${d.nome}</div>`;
  });
});

// MENSAGENS
const qMensagens = query(collection(db, "mensagens"), orderBy("timestamp", "desc"));
onSnapshot(qMensagens, (snap) => {
  const box = document.getElementById("listaMensagens");
  box.innerHTML = "";
  snap.forEach((doc) => {
    const d = doc.data();
    box.innerHTML += `
      <div class="admin-item">
        <b>${d.nome}:</b> ${d.mensagem}
      </div>`;
  });
});

// HISTÓRICO
const qHistorico = query(collection(db, "historico"), orderBy("timestamp", "desc"));
onSnapshot(qHistorico, (snap) => {
  const box = document.getElementById("listaHistorico");
  box.innerHTML = "";
  snap.forEach((doc) => {
    const d = doc.data();
    box.innerHTML += `<div class="admin-item">${d.evento}</div>`;
  });
});

// LOGOUT
window.logout = function () {
  auth.signOut();
};
