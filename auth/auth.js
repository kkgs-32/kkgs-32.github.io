import { db, auth, doc, getDoc, setDoc, onAuthStateChanged, signOut } from "/app/firebase.js";

let loginCheckIntervalId = null;
onAuthStateChanged(auth, (user) => {
    if (loginCheckIntervalId) {
        clearInterval(loginCheckIntervalId);
        loginCheckIntervalId = null;
    }
    if (user) {
        checkAndUpdateLastLogin(user);
        loginCheckIntervalId = setInterval(() => {
            checkAndUpdateLastLogin(auth.currentUser);
        }, 60000);
    } else {
        if (!window.location.pathname.startsWith('/auth/')) {
            window.location.href = '/auth/';
        }
    }
});

function getJstDateString() {
    const now = new Date();
    const JST_OFFSET_MINUTES = 9 * 60;
    const localTimezoneOffsetMinutes = now.getTimezoneOffset();
    const jstDate = new Date(now.getTime() + (JST_OFFSET_MINUTES + localTimezoneOffsetMinutes) * 60 * 1000);
    const year = jstDate.getFullYear();
    const month = String(jstDate.getMonth() + 1).padStart(2, '0');
    const day = String(jstDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function checkAndUpdateLastLogin(user) {
    if (!user) return;
    const todayJst = getJstDateString();
    const userDocRef = doc(db, "user", user.uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists() && docSnap.data().lastLoginDate === todayJst) return;
    await setDoc(userDocRef, { lastLoginDate: todayJst }, { merge: true });
}

document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = '/auth/';
});