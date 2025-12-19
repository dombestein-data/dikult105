(function () {
    const form = document.querySelector("form.contact");
    const formContainer = document.querySelector('.contact-form');
    const toastRoot = document.getElementById('toast-root');

    function toast({ title, description = '', type = 'info', duration = 3500 }) {
        if (!toastRoot) return;
        const el = document.createElement('div');
        el.className = `toast toast--${type}`;
        el.innerHTML = `
            <div class="toast__title">${title}</div>
            ${description ? `<div class="toast__desc">${description}</div>` : ''}
        `;

        toastRoot.appendChild(el);

        const remove = () => {
            el.classList.add('is-leaving');
            setTimeout(() => el.remove(), 200);
        };

        const t = setTimeout(remove, duration);

        el.addEventListener('click', () => {
            clearTimeout(t);
            remove();
        });
    }

    toast.success = (title, description) => toast({ title, description, type: 'success' });
    toast.error = (title, description) => toast({ title, description, type: 'error' });
    toast.info = (title, description) => toast({ title, description, type: 'info' });

    if (!form || !formContainer || !toastRoot) return;

    const submitBtn = form.querySelector('button[type="submit"]');

    function getTurnstileToken() {
        return (
            form.querySelector('input[name="cf-turnstile-response"]')?.value?.trim() || ''
        );
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async function postJSON(url, payload) {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));
        return { res, data };
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name')?.value?.trim() || '';
        const email = document.getElementById('email')?.value?.trim() || '';
        const message = document.getElementById('message')?.value?.trim() || '';
        const turnstileToken = getTurnstileToken();

        // Light client-side validation (server also re-validates)
        if (name.length < 2) return toast.error('Error:', 'Please enter your name.');
        if (!isValidEmail(email)) return toast.error('Error:', 'Please enter a valid email.');
        if (message.length < 10) 
            return toast.error('Error:', 'Your message is a bit short, maybe elaborate a bit more?');
        if (!turnstileToken)
            return toast.error('Error:', 'Please complete the verification before sending.');

        const payload = {
            name,
            email,
            message,
            turnstileToken,
        };

        const originalBtnText = submitBtn?.textContent || 'Submit';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            submitBtn.classList.add('is-loading');
            form.setAttribute('aria-busy', 'true');
            toast.info('Sending...', 'Your message is on its way.');
        }

        try {
            const { res, data } = await postJSON(
                'https://api.dombesteindata.net/v1/contact/send',
                payload
            );

            if (!res.ok || data?.ok === false || data?.error) {
                const msg = data?.error || 'Something went wrong while sending. Please try again.';
                toast.error('Error', msg);

                // Reset Turnstile so user can retry with a fresh token
                if (window.turnstile && typeof window.turnstile.reset === 'function') {
                    window.turnstile.reset();
                }
                return;
            }

            toast.success('Success!', 'Your message has been sent. I will get back to you as soon as I can.');
            form.reset();
            window.turnstile?.reset?.();
        } catch (err) {
            toast.error('Network Error', 'Please try again in a moment.');

            if (window.turnstile && typeof window.turnstile.reset === 'function') {
                window.turnstile.reset();
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                submitBtn.classList.remove('is-loading');
                form.removeAttribute('aria-busy');
            }
        }
    });
})();