document.addEventListener('DOMContentLoaded', () => {
    
    // スクロール検知
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // カウントダウン
    function updateCountdown() {
        const now = new Date();
        const nextTuesday = new Date();
        
        nextTuesday.setDate(now.getDate() + (2 + 7 - now.getDay()) % 7);
        nextTuesday.setHours(22, 0, 0, 0);

        if (now.getDay() === 2 && now.getHours() < 22) {
            nextTuesday.setDate(now.getDate());
        } else if (now >= nextTuesday) {
            nextTuesday.setDate(nextTuesday.getDate() + 7);
        }

        const diff = nextTuesday - now;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);

        const timer = document.getElementById('countdown');
        if(timer) timer.textContent = `Next: ${d}日 ${h}時間 ${m}分`;
    }
    setInterval(updateCountdown, 60000);
    updateCountdown();

    // パーティクル（明るさ調整）
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            // 少し明るめのゴールド
            this.color = `rgba(255, 215, 0, ${Math.random() * 0.5 + 0.2})`; 
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < 50; i++) particles.push(new Particle());
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    init();
    animate();
});