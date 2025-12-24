document.addEventListener('DOMContentLoaded', () => {
    
    // 1. スクロールアニメーション (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // 一度表示したら監視終了
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // 2. カウントダウンタイマー (次の火曜日22:00まで)
    function updateCountdown() {
        const now = new Date();
        const nextTuesday = new Date();
        
        // 次の火曜日を計算
        nextTuesday.setDate(now.getDate() + (2 + 7 - now.getDay()) % 7);
        nextTuesday.setHours(22, 0, 0, 0);

        // もし今日が火曜日で、まだ22時前なら今日の22時。過ぎてれば来週。
        if (now.getDay() === 2 && now.getHours() < 22) {
            nextTuesday.setDate(now.getDate());
        } else if (now >= nextTuesday) {
            nextTuesday.setDate(nextTuesday.getDate() + 7);
        }

        const diff = nextTuesday - now;
        
        // 時間の計算
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);

        const timerElement = document.getElementById('timer');
        if(timerElement) {
            timerElement.textContent = `あと ${d}日 ${h}時間 ${m}分`;
        }
    }
    setInterval(updateCountdown, 60000); // 1分ごとに更新
    updateCountdown(); // 初回実行

    // 3. 背景パーティクル (温かい光の粒)
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const particleCount = 40; // 粒子の数（多すぎると重いので調整）

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5; // サイズ
            this.speedX = Math.random() * 0.5 - 0.25; // 横移動
            this.speedY = Math.random() * 0.5 - 0.25; // 縦移動
            this.color = `rgba(212, 175, 55, ${Math.random() * 0.5 + 0.1})`; // ゴールドの半透明
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // 画面外に出たら反対側へ
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

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
});