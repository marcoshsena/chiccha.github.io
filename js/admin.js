import { db } from "./firebase.js";
import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Produtos comprados
async function carregarCompras() {
    const comprasDiv = document.getElementById("listaCompras");
    const snap = await getDocs(collection(db, "produtos"));

    snap.forEach(doc => {
        const p = doc.data();
        if (p.comprado) {
            comprasDiv.innerHTML += `
                <p><strong>${doc.id}</strong> — comprado por <strong>${p.comprador}</strong></p>
            `;
        }
    });
}

// Mensagens
async function carregarMensagens() {
    const msgDiv = document.getElementById("listaMensagens");
    const snap = await getDocs(collection(db, "mensagens"));

    snap.forEach(doc => {
        const m = doc.data();
        msgDiv.innerHTML += `
            <p><strong>${m.nome}</strong> sobre <em>${m.produto}</em>: ${m.mensagem}</p>
        `;
    });
}

carregarCompras();
carregarMensagens();
