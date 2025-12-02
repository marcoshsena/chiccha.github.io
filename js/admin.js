// js/admin.js
import { auth, onAuthStateChanged, db } from "./firebase.js";
import { collection, query, orderBy, onSnapshot } 
  from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "login.html";
});

// LISTA DE PRODUTOS COMPRADOS
const qComprados = query(collection(db, "produtos"));
onSnapshot(qComprados, (snap) => {
  const box = document.getElementById("listaComprados");
  box.innerHTML = "";
  snap.forEach((docSnap) => {
    const d = docSnap.data();
    if (d.comprado) {
      box.innerHTML += `
        <div class="admin-item">
          <b>${d.produto}</b> — comprado por <b>${d.comprador}</b>
        </div>`;
    }
  });
});

const qMensagens = query(collection(db, "mensagens"), orderBy("timestamp", "desc"));
onSnapshot(qMensagens, (snap) => {
  const box = document.getElementById("listaMensagens");
  box.innerHTML = "";
  snap.forEach((doc) => {
    const d = doc.data();
    box.innerHTML += `<div class="admin-item"><b>${d.nome}</b> (${d.produto}): ${d.mensagem}</div>`;
  });
});

const qHistorico = query(collection(db, "historico"), orderBy("timestamp", "desc"));
onSnapshot(qHistorico, (snap) => {
  const box = document.getElementById("listaHistorico");
  box.innerHTML = "";
  snap.forEach((doc) => {
    const d = doc.data();
    box.innerHTML += `<div class="admin-item">${d.evento}</div>`;
  });
});

window.logout = () => auth.signOut();
