import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, updatePassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCjZmvq16kBPs_xhlJp5FkiCzw42WhX5fM",
    authDomain: "kkgs-32.firebaseapp.com",
    projectId: "kkgs-32",
    storageBucket: "kkgs-32.firebasestorage.app",
    messagingSenderId: "76744845820",
    appId: "1:76744845820:web:0c566764c5c1ae1bc4ea79",
    measurementId: "G-H3Q5DXL6SV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("changePasswordForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
        alert("新しいパスワードが一致しません。");
        return;
    }
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, currentPassword);
        await updatePassword(userCredential.user, newPassword);
        window.location.href = "https://kkgs-32.github.io";
        alert("パスワードが変更されました");
    } catch (error) {
        alert("エラー");
    }
});