// js/admin.js
import { auth, onAuthStateChanged, db } from "./firebase.js";
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- Verifica login ---
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "login.html";
});

// ---------------------------------------------------------------------
// 1. LISTA DE PRODUTOS COMPRADOS
// ---------------------------------------------------------------------

const prodQuery = query(collection(db, "produtos"));
onSnapshot(prodQuery, (snap) => {
  const box = document.getElementById("listaComprados");
  box.innerHTML = "";

  snap.forEach((docSnap) => {
    const d = docSnap.data();

    if (d.comprado === true) {
      box.innerHTML += `
        <div class="admin-item">
          <b>${d.produto}</b><br>
          Comprado por: ${d.comprador}<br>
          <button class="undo-btn" onclick="desfazerCompra('${docSnap.id}')">
            Desfazer compra
          </button>
        </div>
      `;
    }
  });
});

// Função global p/ desfazer compra
window.desfazerCompra = async function (produtoID) {
  if (!confirm("Tem certeza que deseja marcar este produto como disponível novamente?")) return;

  try {
    await updateDoc(doc(db, "produtos", produtoID), {
      comprado: false,
      comprador: null
    });

    // Adiciona registro no histórico
    await addHistorico(`O item "${produtoID}" foi marcado como disponível novamente.`);

    alert("Item marcado como disponível!");
  } catch (e) {
    console.error("Erro ao desfazer compra:", e);
    alert("Erro ao desfazer compra.");
  }
};

// ---------------------------------------------------------------------
// 2. LISTA DE MENSAGENS
// ---------------------------------------------------------------------

const msgQuery = query(collection(db, "mensagens"), orderBy("timestamp", "desc"));
onSnapshot(msgQuery, (snap) => {
  const box = document.getElementById("listaMensagens");
  box.innerHTML = "";

  snap.forEach((docSnap) => {
    const d = docSnap.data();
    box.innerHTML += `
      <div class="admin-item">
        <b>${d.nome}</b> sobre <i>${d.produto}</i>:<br>
        ${d.mensagem}
      </div>
    `;
  });
});

// ---------------------------------------------------------------------
// 3. HISTÓRICO
// ---------------------------------------------------------------------

const histQuery = query(collection(db, "historico"), orderBy("timestamp", "desc"));
onSnapshot(histQuery, (snap) => {
  const box = document.getElementById("listaHistorico");
  box.innerHTML = "";

  snap.forEach((docSnap) => {
    const d = docSnap.data();
    box.innerHTML += `
      <div class="admin-item">
        ${d.evento} <br>
        <small>${new Date(d.timestamp).toLocaleString("pt-BR")}</small>
      </div>
    `;
  });
});

// Função para registrar histórico
async function addHistorico(evento) {
  const col = collection(db, "historico");
  await addDoc(col, {
    evento: evento,
    timestamp: new Date().toISOString()
  });
}

// ---------------------------------------------------------------------
// 4. LOGOUT
// ---------------------------------------------------------------------

window.logout = function () {
  auth.signOut();
};
