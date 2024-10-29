mixins.highlight = { 
    data() {
        return { copying: false };
    },
    created() {
        hljs.configure({ ignoreUnescapedHTML: true });
        this.renderers.push(this.highlight);
    },
    methods: {
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        highlight() {
            let codes = document.querySelectorAll("pre code");
            codes.forEach((block) => {
                const pre = block.parentElement;
                const code = block.textContent;
                const language = block.className.replace('language-', '') || 'plaintext';
                let highlighted;
                try {
                    highlighted = hljs.highlight(code, { language }).value;
                } catch {
                    highlighted = code;
                }
                block.innerHTML = highlighted;
                
                // 如果需要行号，启用以下代码
                // hljs.lineNumbersBlock(block);
                
                // 添加语言标签
                if (!pre.querySelector('.language-label')) {
                    const langLabel = document.createElement('div');
                    langLabel.className = 'language-label';
                    langLabel.textContent = language.toUpperCase();
                    pre.insertBefore(langLabel, block);
                }
                
                // 添加复制按钮
                if (!pre.querySelector('.copycode')) {
                    const copyBtn = document.createElement('div');
                    copyBtn.className = 'copycode';
                    copyBtn.innerHTML = `
                        <i class="fa-solid fa-copy fa-fw"></i>
                        <i class="fa-solid fa-check fa-fw"></i>
                    `;
                    pre.appendChild(copyBtn);
                    
                    copyBtn.addEventListener("click", async () => {
                        if (this.copying) return;
                        this.copying = true;
                        copyBtn.classList.add("copied");
                        await navigator.clipboard.writeText(code);
                        await this.sleep(1000);
                        copyBtn.classList.remove("copied");
                        this.copying = false;
                    });
                }
            });
        },
    },
};