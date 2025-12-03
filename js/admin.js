import { auth, onAuthStateChanged, db } from "./firebase.js";
import { 
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ----------------------------------------------------
// 1) REDIRECIONAR SE NÃO ESTIVER LOGADO
// ----------------------------------------------------
onAuthStateChanged(auth, (user) => {
  if (!user) {
    console.log("Usuário não logado → redirecionando");
    window.location.href = "login.html";
  }
});

// ----------------------------------------------------
// 2) LISTA DE PRODUTOS COMPRADOS
// ----------------------------------------------------
const qProdutos = query(collection(db, "produtos"));

onSnapshot(qProdutos, (snap) => {
  const box = document.getElementById("listaComprados");
  box.innerHTML = "";

  snap.forEach((docSnap) => {
    const d = docSnap.data();

    if (!d.comprado) return;

    box.innerHTML += `
      <div class="admin-item">
        <b>${d.produto}</b><br>
        Comprado por: <b>${d.comprador}</b>
        <button onclick="reverter('${docSnap.id}')">Desfazer</button>
      </div>
    `;
  });
});

// ----------------------------------------------------
// 3) LISTA DE MENSAGENS
// ----------------------------------------------------
const qMensagens = query(collection(db, "mensagens"), orderBy("timestamp", "desc"));

onSnapshot(qMensagens, (snap) => {
  const box = document.getElementById("listaMensagens");
  box.innerHTML = "";

  snap.forEach((docSnap) => {
    const d = docSnap.data();
    box.innerHTML += `
      <div class="admin-item">
        <b>${d.nome}:</b> ${d.mensagem}
      </div>
    `;
  });
});

// ----------------------------------------------------
// 4) LISTA DO HISTÓRICO
// ----------------------------------------------------
const qHistorico = query(collection(db, "historico"), orderBy("timestamp", "desc"));

onSnapshot(qHistorico, (snap) => {
  const box = document.getElementById("listaHistorico");
  box.innerHTML = "";

  snap.forEach((docSnap) => {
    const d = docSnap.data();
    box.innerHTML += `
      <div class="admin-item">${d.evento}</div>
    `;
  });
});

// ----------------------------------------------------
// 5) FUNÇÃO PARA REVERTER PRODUTO
// ----------------------------------------------------
window.reverter = async function (produtoID) {
  if (!confirm("Deseja realmente reverter este produto para ficar disponível novamente?")) return;

  const ref = doc(db, "produtos", produtoID);

  await updateDoc(ref, {
    comprado: false,
    comprador: "",
    timestamp: new Date()
  });

  await addDoc(collection(db, "historico"), {
    evento: `Produto revertido: ${produtoID}`,
    timestamp: new Date()
  });

  alert("Produto revertido com sucesso!");
};

// ----------------------------------------------------
// 6) LOGOUT
// ----------------------------------------------------
window.logout = function () {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
};

