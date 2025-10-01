const nav = document.querySelector('.nav');

// Ensure navbar hides on page scroll. 
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
        nav.classList.add("hidden");
    } else {
        nav.classList.remove("hidden");
    }
    lastScrollY = window.scrollY;
})

function generateBlobs() {
    const pageHeight = document.body.scrollHeight;
    const blobCount = Math.ceil(pageHeight / 500);

    const templates = [
        document.querySelector('.glow-1'),
        document.querySelector('.glow-2'),
        document.querySelector('.glow-3')
    ].filter(Boolean);

    for (let i = 0; i < blobCount; i++) {
        const template = templates[Math.floor(Math.random() * templates.length)];
        if (!template) continue;

        const pos = (i / blobCount) * pageHeight;

        const clone = template.cloneNode(false);
        clone.style.top = `${pos + Math.random() * 200}px`;
        clone.style.left = `${Math.random() * 80 + 10}%`;
        clone.style.opacity = (Math.random() * 0.4 + 0.3).toFixed(2);
        document.body.appendChild(clone);
    }
}

document.addEventListener("DOMContentLoaded", generateBlobs);