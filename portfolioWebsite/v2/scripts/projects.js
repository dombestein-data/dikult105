/*
    File: projects.js
    Description: Functional backbone for the projects page, part of the functional portfolio site project.
    Date: 27.09.2025
    Author: Isak Dombestein (isak@dombesteindata.net)
*/

const modal = document.getElementById('project-modal');
const title = document.getElementById('modal-title');
const desc = document.getElementById('modal-description');
const techList = document.getElementById('modal-techstack');
const linkLive = document.getElementById('modal-live');
const linkGithub = document.getElementById('modal-github');
const closeBtn = document.getElementById('modal-close');
const backdrop = document.getElementById('modal-backdrop');

// When a card is clicked, we dynamically fill in the required info using the structure in /data/projInfo.js
function openProjectModal(key) {
    const project = window.projects[key];
    if (!project) {
        alert('Project ID not found.');
        return;
    }

    title.textContent = project.title;
    desc.textContent = project.description;

    techList.innerHTML = "";

    // For every element in our techList (TechStack), we insert a new list element
    project.tech.forEach((t) => {
        const li = document.createElement('li');
        li.textContent = t;
        techList.appendChild(li);
    });

    // If we have a link that leads to the live version of the project,
    // We show a button that leads there. Otherwise, the button stays hidden.
    if (project.live) {
        linkLive.href = project.live;
        linkLive.classList.remove('hidden');
    } else {
        linkLive.classList.add('hidden')
    }

    // ...and the same goes for a project github link.
    if (project.github) {
        linkGithub.href = project.github;
        linkGithub.classList.remove('hidden');
    } else {
        linkGithub.classList.add('hidden');
    }

    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

// We can close the modal in three main ways;
// 1) Clicking the X in the top right of that modal
// 2) Clicking anywhere outside the modal
// 3) Clicking the escape key on the keyboard

closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeModal();
});