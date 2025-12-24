document.addEventListener('DOMContentLoaded', () => {
    
    // (既存のコードはそのまま維持)
    // ... Mobile Menu, Scroll Detection, Countdown, Particle Effect ...

    // Mobile Menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    if(navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Scroll Detection
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

    // Countdown Timer
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

    // Particle Effect
    const canvas = document.getElementById('particleCanvas');
    if(canvas) {
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
    }
});

/* =========================================
   Modal Logic (New)
   ========================================= */

// モーダルを開く
function openModal(cardElement) {
    const modal = document.getElementById('cast-modal');
    
    // カード内の隠しデータを取得
    const imgSrc = cardElement.querySelector('img').src;
    const name = cardElement.querySelector('.data-name').textContent;
    const comment = cardElement.querySelector('.data-comment').textContent;
    const twitterLink = cardElement.querySelector('.data-twitter').textContent;

    // モーダルにデータをセット
    document.getElementById('modal-img').src = imgSrc;
    document.getElementById('modal-name').textContent = name;
    document.getElementById('modal-comment').textContent = comment;
    document.getElementById('modal-twitter').href = twitterLink;

    // 表示
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 背景スクロール禁止
}

// モーダルを閉じる (背景クリック)
function closeModal(event) {
    if (event.target.id === 'cast-modal') {
        closeModalBtn();
    }
}

// 閉じるボタン
function closeModalBtn() {
    const modal = document.getElementById('cast-modal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // スクロール解除
}