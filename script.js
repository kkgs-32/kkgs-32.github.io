import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot, where, Timestamp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Firebase 設定
const firebaseConfig = {
    apiKey: "AIzaSyCjZmvq16kBPs_xhlJp5FkiCzw42WhX5fM",
    authDomain: "kkgs-32.firebaseapp.com",
    databaseURL: "https://kkgs-32-default-rtdb.firebaseio.com",
    projectId: "kkgs-32",
    storageBucket: "kkgs-32.firebasestorage.app",
    messagingSenderId: "76744845820",
    appId: "1:76744845820:web:0c566764c5c1ae1bc4ea79",
    measurementId: "G-H3Q5DXL6SV"
};

// 定数
const POSTS_COLLECTION = "posts";
const LAST_LOGIN_DATE_KEY = "lastLoginDate";
const LOGIN_FORM_CONTAINER_ID = "loginFormContainer";
const BLOG_MANAGEMENT_CONTAINER_ID = "blogManagementContainer";
const POST_LIST_ID = "postList";
const USER_EMAIL_ID = "userEmail";
const SEARCH_INPUT_ID = "searchInput";
const POST_MODAL_ID = "postModal";
const MY_MODAL_ID = "myModal";
const MODAL_CONTENT_ID = "modalContent";
const MODAL_CLOSE_CLASS = ".Modal-close";
const TIME_ZONE_OFFSET = 9 * 60; // 日本（JST）とUTCの時差（分）

// Firebase の初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// HTML要素の取得
const postList = document.getElementById(POST_LIST_ID);
const loginFormContainer = document.getElementById(LOGIN_FORM_CONTAINER_ID);
const blogManagementContainer = document.getElementById(BLOG_MANAGEMENT_CONTAINER_ID);
const searchInput = document.getElementById(SEARCH_INPUT_ID);
const userEmailElement = document.getElementById(USER_EMAIL_ID);
const postModalContent = document.getElementById(MODAL_CONTENT_ID);
const myModal = document.getElementById(MY_MODAL_ID);

// ログインフォームの送信処理
document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    handleLogin();
});

// ログアウトボタンのクリック処理
document.getElementById("logoutButton").addEventListener("click", handleLogout);

// DOMContentLoaded イベント
document.addEventListener("DOMContentLoaded", () => {
    checkLastLoginAndLogout();
    setupAuthStateListener();
    setupModal();
    setupMenuModal();
    //定期的に自動ログアウトを確認
    setInterval(checkLastLoginAndLogout, 60000);
});

// ログイン処理
function handleLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            // ログイン成功時の処理は onAuthStateChanged に委ねる
        })
        .catch((error) => {
            console.error("ログインエラー:", error.message);
            alert("ログインエラー");
        });
}

// ログアウト処理
function handleLogout() {
    signOut(auth).then(() => {
        localStorage.removeItem(LAST_LOGIN_DATE_KEY);
        location.reload();
    }).catch((error) => {
        console.error("ログアウトエラー:", error.message);
        alert("ログアウトエラー");
    });
}

// ログイン状況の監視
function setupAuthStateListener() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // ユーザーがログインしている場合
            userEmailElement.textContent = `${user.email}`;
            showBlogManagement();
            loadPosts();
            localStorage.setItem(LAST_LOGIN_DATE_KEY, getToday());
        } else {
            // ユーザーがログアウトしている場合
            showLoginForm();
        }
    });
}

// 最終ログイン日を確認して自動ログアウトする
function checkLastLoginAndLogout() {
    const lastLoginDate = localStorage.getItem(LAST_LOGIN_DATE_KEY);
    if (lastLoginDate && lastLoginDate !== getToday()) {
        handleLogout();
    }
}

//今日の年月日を取得
function getToday() {
    const now = new Date();
    const jstDate = new Date(now.getTime() + TIME_ZONE_OFFSET * 60 * 1000);
    return jstDate.toISOString().split('T')[0];
}

// 投稿を読み込む
function loadPosts() {
    postList.innerHTML = "読み込み中…";
    const today = getToday()

    const q = query(collection(db, POSTS_COLLECTION),
        orderBy("date", "desc"),
        where("date", "<=", today)
    );

    onSnapshot(q, (querySnapshot) => {
        const posts = processPosts(querySnapshot);
        displayPosts(posts);
        setupSearch(posts);
    }, (error) => {
        console.error("投稿読み込みエラー:", error);
        postList.innerHTML = "<p>投稿を取得できませんでした。</p>";
    });
}

// 投稿データを処理する
function processPosts(querySnapshot) {
    const posts = [];
    querySnapshot.forEach((doc) => {
        const post = { id: doc.id, ...doc.data() };
        posts.push(post);
    });
    return posts;
}

// 投稿を表示する
function displayPosts(posts) {
    postList.innerHTML = "";
    posts.forEach(post => {
        const postItem = createPostElement(post);
        postList.appendChild(postItem);
    });
}

// 投稿要素を作成する
function createPostElement(post) {
    const postItem = document.createElement("div");
    postItem.classList.add("box");
    postItem.style.cursor = "pointer";
    const jstDate = convertTimestampToJST(post.date);
    postItem.innerHTML = `
        <p class="subtitle is-6 is-spaced">${jstDate}</p>
        <p class="title is-4 is-spaced">${post.title}</p>
        <p class="subtitle is-5">${post.subtitle}</p>
    `;
    postItem.addEventListener("click", () => showPostDetail(post));
    return postItem;
}

// 投稿の詳細を表示する
function showPostDetail(post) {
    let urlButton = "";
    if (post.attachment && post.attachment.trim() !== "") {
        urlButton = `<a class="button is-info is-outlined" href="${post.attachment}" target="_blank">移動する</a>`;
    }
    const jstDate = convertTimestampToJST(post.date);
    postModalContent.innerHTML = `
        <header class="modal-card-head">
            <p class="title is-4">${post.title}</p>
        </header>
        <section class="modal-card-body">
            <p class="subtitle is-6 is-spaced">${jstDate}</p>
            <p class="title is-5">${post.subtitle}</p>
            <hr>
            <p class="subtitle is-6">${post.content}</p>
            ${urlButton}
        </section>
    `;
    document.getElementById(POST_MODAL_ID).classList.add("is-active");
}

// 検索機能をセットアップする
function setupSearch(posts) {
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredPosts = filterPosts(posts, searchTerm);
        displayPosts(filteredPosts);
    });
}

// 投稿を検索する
function filterPosts(posts, searchTerm) {
    return posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.subtitle.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        convertTimestampToJST(post.date).includes(searchTerm) ||
        (post.attachment && post.attachment.toLowerCase().includes(searchTerm))
    );
}

// ブログ画面を表示する
function showBlogManagement() {
    loginFormContainer.style.display = "none";
    blogManagementContainer.style.display = "block";
}

// ログインフォームを表示する
function showLoginForm() {
    loginFormContainer.style.display = "block";
    blogManagementContainer.style.display = "none";
}

// モーダルのセットアップ(postModalをセットアップ)
function setupModal() {
    const postModal = document.getElementById(POST_MODAL_ID);
    const postModalClose = document.querySelectorAll(`${MODAL_CLOSE_CLASS}`);
    postModalClose.forEach(closeButton => {
        closeButton.addEventListener("click", () => {
            postModal.classList.remove("is-active");
        });
    })
    document.querySelector(`#${POST_MODAL_ID} .modal-background`).addEventListener("click", function (e) {
        e.stopPropagation();
        postModal.classList.remove("is-active");
    });
}

// メニューモーダルのセットアップ(myModalをセットアップ)
function setupMenuModal() {
    const openMenuModalButton = document.getElementById('openModal');
    const closeMenuModalButtons = document.querySelectorAll(`#${MY_MODAL_ID} ${MODAL_CLOSE_CLASS}`);

    openMenuModalButton.addEventListener('click', () => {
        myModal.classList.add('is-active');
    });

    closeMenuModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            myModal.classList.remove('is-active');
        });
    });
    document.querySelector(`#${MY_MODAL_ID} .modal-background`).addEventListener("click", function (e) {
        e.stopPropagation();
        myModal.classList.remove("is-active");
    });
}

//Timestamp形式をJSTに変換する関数
function convertTimestampToJST(timestamp) {
    //日付形式かどうかを確認する
    if (!(timestamp instanceof Timestamp)) {
        return timestamp
    }
    const date = timestamp.toDate();
    const jstDate = new Date(date.getTime() + TIME_ZONE_OFFSET * 60 * 1000);
    return jstDate.toISOString().split('T')[0];
}