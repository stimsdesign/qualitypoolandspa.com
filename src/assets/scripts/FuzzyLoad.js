export class FuzzyLoad {
    /** @type {HTMLElement} */
    root;
    /** @type {HTMLImageElement | null} */
    img;

    constructor(root) {
        this.root = root;
        this.img = root.querySelector('img');
        if (!this.img) return;
        this.init();
    }

    async init() {
        if (!this.img) return;
        if (this.img.complete) {
            await this.tryDecode();
        } else {
            this.img.addEventListener('load', async () => {
                await this.tryDecode();
            }, { once: true });
        }
    }

    async tryDecode() {
        if (!this.img) return;
        try {
            // Wait for the browser to actually decode the high-res pixels
            await this.img.decode();
            this.markLoaded();
        } catch (e) {
            // Fallback for older browsers or broken decodes
            this.markLoaded();
        }
    }

    markLoaded() {
        this.root.classList.add('loaded');
    }
}

/**
 * Initialize FuzzyLoad for all elements matching the selector.
 * @param {string} selector 
 */
export function functionFuzzyLoad(selector = '.fuzzy-load') {
    document.querySelectorAll(selector).forEach((el) => {
        new FuzzyLoad(el);
    });
}
