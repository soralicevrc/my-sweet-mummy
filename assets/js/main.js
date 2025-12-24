document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. Mobile Menu Logic (操作性向上)
       ========================================= */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // ハンバーガーボタンクリック時
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // メニュー内のリンクをクリックしたら閉じる
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    /* =========================================
       2. Scroll Detection (表示アニメーション)
       ========================================= */
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

    /* =========================================
       3. Countdown Timer (情報更新)
       ========================================= */
    function updateCountdown() {
        const now = new Date();
        const nextTuesday = new Date();
        
        // 次の火曜日を計算
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

    /* =========================================
       4. Particle Effect (雰囲気作り)
       ========================================= */
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
            this.color = `rgba(212, 175, 55, ${Math.random() * 0.4 + 0.1})`; 
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
        for (let i = 0; i < 40; i++) particles.push(new Particle());
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    init();
    animate();
});