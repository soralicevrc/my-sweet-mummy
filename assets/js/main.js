document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 0. Loading Screen & Init
    // =========================================
    // ローディングアニメーション(3.5s) + 余韻(1.5s) = 5000ms
    setTimeout(() => {
        document.body.classList.add('loaded');
        checkTodayCast();
    }, 5000); 

    // =========================================
    // 1. Mobile Menu
    // =========================================
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

    // =========================================
    // 2. Custom Cursor
    // =========================================
    const cursorDot = document.getElementById('cursor-dot');

    if (window.matchMedia("(min-width: 769px)").matches) {
        document.addEventListener('mousemove', function firstMove() {
            if(cursorDot) cursorDot.style.display = 'block';
            document.removeEventListener('mousemove', firstMove);
        });

        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            if(cursorDot) {
                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;
            }

            if (Math.random() > 0.8) { 
                createSparkle(posX, posY);
            }
        });
    }

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('cursor-sparkle');
        document.body.appendChild(sparkle);

        const size = Math.random() * 5 + 2; 
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;

        const offsetX = (Math.random() - 0.5) * 20; 
        const offsetY = (Math.random() - 0.5) * 20;
        sparkle.style.left = `${x + offsetX}px`;
        sparkle.style.top = `${y + offsetY}px`;

        setTimeout(() => {
            sparkle.remove();
        }, 800);
    }

    // =========================================
    // 3. Scroll Detection & Parallax
    // =========================================
    const particleCanvas = document.getElementById('particleCanvas');
    const backToTopBtn = document.getElementById('back-to-top');

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

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if(particleCanvas) {
            particleCanvas.style.transform = `translateY(${scrollY * 0.2}px)`;
        }

        if(backToTopBtn) {
            if (scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    if(backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =========================================
    // 4. Countdown Timer
    // =========================================
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

    // =========================================
    // 5. Particle Effect (Background)
    // =========================================
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

// =========================================
// 6. Global Logic (Today's Cast, Modal, Gift)
// =========================================

function checkTodayCast() {
    const instanceMembers = document.querySelectorAll('.member-list .member-item span');
    const todayNames = [];
    
    instanceMembers.forEach(span => {
        todayNames.push(span.textContent.trim());
    });

    const castCards = document.querySelectorAll('.cast-card');
    castCards.forEach(card => {
        const cardName = card.querySelector('.data-name').textContent;
        const isToday = todayNames.some(name => cardName.includes(name));
        
        if (isToday) {
            card.classList.add('today-cast');
        } else {
            card.classList.remove('today-cast');
        }
    });
}

function openModal(cardElement) {
    const modal = document.getElementById('cast-modal');
    
    const imgSrc = cardElement.querySelector('img').src;
    const name = cardElement.querySelector('.data-name').textContent;
    const comment = cardElement.querySelector('.data-comment').textContent;
    const twitterLink = cardElement.querySelector('.data-twitter').textContent;

    document.getElementById('modal-img').src = imgSrc;
    document.getElementById('modal-name').textContent = name;
    document.getElementById('modal-comment').textContent = comment;
    document.getElementById('modal-twitter').href = twitterLink;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(event) {
    if (event.target.id === 'cast-modal') {
        closeModalBtn();
    }
}

function closeModalBtn() {
    const modal = document.getElementById('cast-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function openGift() {
    const giftWrapper = document.getElementById('gift-box-wrapper');
    const giftContent = document.getElementById('gift-content');

    giftWrapper.style.opacity = '0';
    giftWrapper.style.pointerEvents = 'none';

    setTimeout(() => {
        giftWrapper.style.display = 'none';
        giftContent.style.display = 'block';
    }, 500);
}