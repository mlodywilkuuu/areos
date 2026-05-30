class DomestosEngine {
    constructor(container) {
        this.container = container;
        this.styles = {}; // Nasz CSSOM (CSS Object Model)
    }

    // 1. Parser: Rozbija tekst na DOM i ekstrahuje style
    parse(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Wyciągamy style ze znacznika <style>
        const styleTag = doc.querySelector('style');
        if (styleTag) {
            this.parseCSS(styleTag.textContent);
            styleTag.remove();
        }
        
        return doc.body;
    }

    // 2. CSS Parser: Bardzo prosta konwersja tekstu CSS na obiekt JS
    parseCSS(cssText) {
        const rules = cssText.split('}');
        rules.forEach(rule => {
            const [selector, body] = rule.split('{');
            if (selector && body) {
                const cleanSelector = selector.trim();
                const declarations = body.trim().split(';');
                this.styles[cleanSelector] = {};
                declarations.forEach(dec => {
                    const [prop, val] = dec.split(':');
                    if (prop && val) this.styles[cleanSelector][prop.trim()] = val.trim();
                });
            }
        });
    }

    // 3. Renderowanie z aplikowaniem stylów
    applyEngineStyles(node, parent) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = document.createElement('div');
            el.className = "engine-node";
            
            // Nakładanie stylów z naszego "CSSOM"
            const tag = node.tagName.toLowerCase();
            if (this.styles[tag]) {
                Object.assign(el.style, this.styles[tag]);
            }

            parent.appendChild(el);
            node.childNodes.forEach(child => this.applyEngineStyles(child, el));
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            parent.appendChild(document.createTextNode(node.textContent));
        }
    }

    render(html) {
        this.container.innerHTML = '';
        this.styles = {}; // Reset stylów przy nowym renderowaniu
        const dom = this.parse(html);
        this.applyEngineStyles(dom, this.container);
    }
}
