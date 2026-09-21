export class ContactFormHandler {
    constructor(root) {
        if (!root || root.dataset.contactFormBound === "true") return;
        root.dataset.contactFormBound = "true";

        this.root = root;
        this.telephoneFields = Array.from(this.root.querySelectorAll('input[type="tel"]'));
        this.formModalOverlay = document.querySelector('.form-modal-overlay');
        this.closeModalBtn = this.formModalOverlay?.querySelector('.close-modal') || null;

        this.bindEvents();
    }

    formatPhoneInput(inputEl) {
        let input = inputEl.value.replace(/\D/g, ""); // Remove non-numeric characters
        if (input.length > 10) {
            input = input.substring(0, 10); // Limit to 10 digits
        }
        const formatted = input.replace(
            /(\d{0,3})(\d{0,3})(\d{0,4})/,
            (_match, p1, p2, p3) => {
                if (p3) {
                    return `(${p1}) ${p2}-${p3}`;
                } else if (p2) {
                    return `(${p1}) ${p2}`;
                } else if (p1) {
                    return `(${p1})`;
                }
                return input;
            }
        );
        inputEl.value = formatted;
    }

    closeModal = () => {
        if (!this.formModalOverlay) return;
        this.formModalOverlay.classList.remove('active');
    };

    handleFormSubmit = async (event) => {
        event.preventDefault();

        const myForm = event.currentTarget;
        if (myForm.dataset.submitting === "true") return;
        myForm.dataset.submitting = "true";

        const submitBtn = myForm.querySelector('.submit-btn, button[type="submit"]');
        const btnText = submitBtn?.querySelector('.btn-text');
        const originalText = btnText ? btnText.textContent : (submitBtn ? submitBtn.textContent : "");
        if (btnText) btnText.textContent = "Sending...";
        if (submitBtn) submitBtn.disabled = true;

        // Dynamically format subject line with user name if present
        const subjectInput = myForm.querySelector('input[name="subject"]');
        const firstName = myForm.querySelector('input[name="first_name"], input[name="first-name"], input[name="name"]')?.value?.trim();
        const lastName = myForm.querySelector('input[name="last_name"], input[name="last-name"]')?.value?.trim();
        const fullName = [firstName, lastName].filter(Boolean).join(' ');

        if (subjectInput && fullName) {
            const formName = myForm.getAttribute('name') || 'Contact Form';
            subjectInput.value = `${formName}: ${fullName}`;
        }

        const formData = new FormData(myForm);
        const body = new URLSearchParams(formData).toString();

        try {
            const res = await fetch(window.location.pathname, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body
            });
            if (res.ok) {
                // show the thank you modal
                if (this.formModalOverlay) this.formModalOverlay.classList.add('active');
                myForm.reset();
            } else {
                console.error('Form failed', res.status);
                alert("There was an error submitting your form. Please try again or call us directly.");
            }
        } catch (e) {
            console.error('Form error', e);
            alert("There was a network error submitting your form. Please check your connection.");
        } finally {
            myForm.dataset.submitting = "false";
            if (btnText) btnText.textContent = originalText || "Send Message";
            if (submitBtn) submitBtn.disabled = false;
        }
    };

    bindEvents() {
        this.telephoneFields.forEach(field => {
            field.addEventListener('input', (e) => this.formatPhoneInput(e.target));
        });

        this.root.addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });

        // Handle Modal Close (click)
        if (this.closeModalBtn && !this.closeModalBtn.dataset.modalCloseBound) {
            this.closeModalBtn.dataset.modalCloseBound = "true";
            this.closeModalBtn.addEventListener('click', this.closeModal);
        }

        // Close modal on escape key
        if (!window.formEscapeBound) {
            window.formEscapeBound = true;
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const activeOverlay = document.querySelector('.form-modal-overlay.active');
                    if (activeOverlay) {
                        activeOverlay.classList.remove('active');
                    }
                }
            });
        }
    }
}
