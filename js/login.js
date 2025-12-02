import { auth, signInWithEmailAndPassword } from "./js/firebase.js";

window.login = async function () {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    window.location.href = "admin.html";
  } catch (e) {
    alert("Login inválido!");
  }
};
