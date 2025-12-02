import { auth, onAuthStateChanged, db } from "./firebase.js";
import { 
  collection, onSnapshot, query, orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "login.html";
});

// 🟡 PRODUTOS — mostra somente produtos marcados como comprados
const qProdutos = query(collection(db, "produtos"));
onSnapshot(qProdutos, (snap) => {
  const box = document.getElementById("listaComprados");
  box.innerHTML = "";
  snap.forEach((doc) => {
    const d = doc.data();
    if (d.comprado === true) {
      box.innerHTML += `
        <div class="admin-item">
          <b>${d.produto}</b><br>
          Comprado por: ${d.comprador}
        </div>`;
    }
  });
});

// 🟡 MENSAGENS
const qMensagens = query(collection(db, "mensagens"), orderBy("timestamp", "desc"));
onSnapshot(qMensagens, (snap) => {
  const box = document.getElementById("listaMensagens");
  box.innerHTML = "";
  snap.forEach((doc) => {
    const d = doc.data();
    box.innerHTML += `
      <div class="admin-item">
        <b>${d.nome}:</b> ${d.mensagem}<br>
        <small>Produto: ${d.produto}</small>
      </div>`;
  });
});

// 🟡 HISTÓRICO
const qHistorico = query(collection(db, "historico"), orderBy("timestamp", "desc"));
onSnapshot(qHistorico, (snap) => {
  const box = document.getElementById("listaHistorico");
  box.innerHTML = "";
  snap.forEach((doc) => {
    const d = doc.data();
    box.innerHTML += `
      <div class="admin-item">
        ${d.evento}<br>
        <small>${d.timestamp}</small>
      </div>`;
  });
});

// LOGOUT
window.logout = function () {
  auth.signOut();
};

//-------------------------------------------
// REVERTER PRODUTO PARA “NÃO COMPRADO”
//-------------------------------------------
import { doc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

window.reverterProduto = async function (produtoId) {
  if (!confirm("Tem certeza que deseja tornar este produto disponível novamente?")) {
      return;
  }

  try {
      await updateDoc(doc(db, "produtos", produtoId), {
          comprado: false,
          comprador: null,
          timestamp: new Date().toISOString()
      });

      alert("Produto revertido e agora está disponível! 🟢");

  } catch (error) {
      console.error("Erro ao reverter produto:", error);
      alert("Erro ao reverter produto.");
  }
};
