export class RequestFormHandler {
    constructor() {
        this.wrapper = document.getElementById('request-form-wrapper');
        if (!this.wrapper) return;

        this.form = this.wrapper.querySelector('#request-form');
        this.closeBtn = this.wrapper.querySelector('#request-form-close');
        this.paragraphs = Array.from(this.wrapper.querySelectorAll('p')); // 0: intro, 1: thank you
        this.phoneField = this.form?.querySelector('input[type="tel"]');
        const selectBox = this.form?.querySelector('#request-service');
        if (selectBox) {
            this.originalOptGroups = Array.from(selectBox.querySelectorAll('optgroup'));
        }
        
        this.init();
    }

    init() {
        this.bindTriggers();
        this.bindEvents();
    }

    bindTriggers() {
        // We use event delegation on document to handle triggers that might be added dynamically or across page transitions
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('.request-form-trigger');
            if (trigger) {
                e.preventDefault();
                const serviceGroup = trigger.getAttribute('data-service-group');
                this.showForm(serviceGroup);
            }
        });
    }

    bindEvents() {
        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hideForm());
        }

        // Phone formatting
        if (this.phoneField) {
            this.phoneField.addEventListener('input', (e) => this.formatPhoneInput(e.target));
        }

        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.wrapper.classList.contains('active')) {
                this.hideForm();
            }
        });
    }

    showForm(serviceGroup) {
        this.wrapper.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Reset message/form states just in case
        this.paragraphs[0].classList.add('active');
        this.paragraphs[0].classList.remove('hidden');
        this.paragraphs[1].classList.add('hidden');
        this.paragraphs[1].classList.remove('active');
        this.form.classList.remove('hidden');
        this.form.classList.add('active');

        // Filter service drop down options
        const selectBox = this.form.querySelector('#request-service');
        const defaultOption = selectBox?.querySelector('option[value=""]');
        
        if (defaultOption) {
            if (serviceGroup) {
                const groupName = serviceGroup.split('-')[0];
                const capitalized = groupName.charAt(0).toUpperCase() + groupName.slice(1);
                defaultOption.textContent = `Select a ${capitalized} Service`;
            } else {
                defaultOption.textContent = 'Select a Service';
            }
        }

        if (this.originalOptGroups && selectBox) {
            // First detach all currently attached optgroups and standalone options (except default)
            selectBox.querySelectorAll('optgroup').forEach(group => group.remove());
            selectBox.querySelectorAll('option').forEach(opt => {
                if (opt.value !== "") opt.remove();
            });
            
            // Then append only the requisite ones back
            this.originalOptGroups.forEach(group => {
                if (serviceGroup) {
                    if (group.classList.contains(`${serviceGroup}-opts`)) {
                        // Unpack the optgroup and append options flatly
                        Array.from(group.querySelectorAll('option')).forEach(opt => {
                            selectBox.appendChild(opt.cloneNode(true));
                        });
                    }
                } else {
                    selectBox.appendChild(group);
                }
            });
        }
        if (selectBox) selectBox.value = "";
    }

    hideForm() {
        this.wrapper.classList.remove('active');
        document.body.style.overflow = '';

        // Reset service drop down options
        const selectBox = this.form?.querySelector('#request-service');
        const defaultOption = selectBox?.querySelector('option[value=""]');
        if (defaultOption) defaultOption.textContent = 'Select a Service';

        if (this.originalOptGroups && selectBox) {
            selectBox.querySelectorAll('optgroup').forEach(group => group.remove());
            selectBox.querySelectorAll('option').forEach(opt => {
                if (opt.value !== "") opt.remove();
            });
            this.originalOptGroups.forEach(group => {
                selectBox.appendChild(group);
            });
        }
    }

    formatPhoneInput(inputEl) {
        let input = inputEl.value.replace(/\D/g, "");
        if (input.length > 10) {
            input = input.substring(0, 10);
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

    async handleFormSubmit(event) {
        event.preventDefault();

        const myForm = event.currentTarget;
        const submitBtn = myForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        const formData = new FormData(myForm);
        const body = new URLSearchParams(formData).toString();

        try {
            const res = await fetch(window.location.pathname, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body
            });

            if (res.ok) {
                // Success transitions
                this.paragraphs[0].classList.remove('active');
                this.paragraphs[0].classList.add('hidden');
                
                this.paragraphs[1].classList.remove('hidden');
                this.paragraphs[1].classList.add('active');

                this.form.classList.remove('active');
                this.form.classList.add('hidden');

                myForm.reset();

                // Auto-hide entire wrapper after 3 seconds
                setTimeout(() => {
                    this.hideForm();
                }, 3000);
            } else {
                console.error('Form submission failed', res.status);
                alert("There was an error submitting your request. Please try again or call us directly.");
            }
        } catch (e) {
            console.error('Form error', e);
            alert("There was an error submitting your request. Please check your connection.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    }
}
