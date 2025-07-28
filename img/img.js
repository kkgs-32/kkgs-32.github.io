function applyDarkModeImage(img, lightSrc, darkSrc) {
    if (!img) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const setImage = () => {
        img.src = mq.matches ? darkSrc : lightSrc;
    };
    setImage();
    mq.addEventListener('change', setImage);
}

document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.theme-img');
    images.forEach(img => {
        const lightSrc = img.dataset.light;
        const darkSrc = img.dataset.dark;
        applyDarkModeImage(img, lightSrc, darkSrc);
    });
});