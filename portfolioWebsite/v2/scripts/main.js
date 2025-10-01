/*
    File: main.js
    Description: This file is a general functional backbone for the entire website. All pages should import this file at the bottom of its body element.
    Date: 25.09.2025
    Author: Isak Dombestein (isak@dombesteindata.net)
*/

const themeToggle = document.getElementById('theme-toggle') ;
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Render the moon and sun icons used for the switch theme toggle as SVGs for best resolution and compatibility.
const moonSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2a9.99 9.99 0 0 0-8.68 15.26.5.5 0 0 0 .72.11A8.978 8.978 0 0 1 12 16a8.978 8.978 0 0 1 7.96 1.37.5.5 0 0 0 .72-.11A10 10 0 0 0 12 2z"/>
  </svg>
`;

const sunSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.48 0l1.8-1.79 1.41 1.41-1.79 1.8-1.42-1.42zM12 4V1h-1v3h1zm0 19v-3h-1v3h1zm8-9h3v-1h-3v1zM1 12h3v-1H1v1zm15.24 7.16l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42zM6.76 19.16l-1.8 1.79 1.41 1.41 1.79-1.8-1.42-1.42zM12 6a6 6 0 100 12 6 6 0 000-12z"/>
  </svg>
`

// We do the same for the social icons at the top of the footer.
const emailSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
    <path d="M2 4h20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.01L12 13 22 6.01V6H2zm0 2.23V18h20V8.23l-10 6.99L2 8.23z"/>
  </svg>
`

const xSVG = `
  <svg width="28" height="28" viewBox="0 0 1200 1227" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"/>
  </svg>
`

const linkedInSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.3h.1c.53-1 1.83-2.3 3.9-2.3 4.18 0 4.95 2.8 4.95 6.43V24h-4v-8.4c0-2-.04-4.6-2.8-4.6-2.8 0-3.23 2.18-3.23 4.43V24h-4V8z"/>
  </svg>
`

const githubSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="28" height="28">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577v-2.234c-3.338.726-4.033-1.415-4.033-1.415-.546-1.387-1.333-1.756-1.333-1.756-1.09-.746.083-.73.083-.73 1.205.085 1.84 1.236 1.84 1.236 1.07 1.834 2.807 1.304 3.492.997.107-.776.42-1.305.763-1.605-2.665-.3-5.467-1.332-5.467-5.932 0-1.31.468-2.38 1.235-3.22-.123-.302-.535-1.52.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.045.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.653 1.657.242 2.875.12 3.176.77.84 1.232 1.91 1.232 3.22 0 4.61-2.807 5.628-5.48 5.922.43.37.824 1.1.824 2.22v3.293c0 .32.22.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.373-12-12-12z"/>
  </svg>
`

function setTheme(isLight) {
    body.classList.toggle('light', isLight);
    // Save light / dark mode preference to localstorage
    localStorage.setItem('theme', isLight ? 'light' : 'dark');

    if (themeIcon) {
      themeIcon.innerHTML = isLight ? sunSVG : moonSVG;
    }
}

// Fetch the theme item from localStorage if it exists and set the theme to that.
const storedTheme = localStorage.getItem('theme');
setTheme(storedTheme === 'light');

// toggle event listener
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light');
    setTheme(!isLight);
  });
}

function injectSVGIcons() {
  const iconMap = {
    email: emailSVG,
    github: githubSVG,
    linkedin: linkedInSVG,
    x: xSVG,
  };

  document.querySelectorAll('[data-icon]').forEach(el => {
    const type = el.getAttribute('data-icon');
    if (iconMap[type]) {
      el.innerHTML = iconMap[type];
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  injectSVGIcons();
})