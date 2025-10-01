/*
    File: contact.js
    Description: Specific functionality for the contact page.
    Date: 27.09.2025
    Author: Isak Dombestein (isak@dombesteindata.net)
*/

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    const formContainer = document.querySelector('.contact-form');
    formContainer.innerHTML = `
        <h2>Thank you!</h2>
        <p>Your message has been received, I'll get back to you as soon as possible.</p>
    `;
});