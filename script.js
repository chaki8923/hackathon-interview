document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.interview-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const currentPageEl = document.querySelector('.current-page');
    const totalPagesEl = document.querySelector('.total-pages');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const introSection = document.querySelector('.intro');
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    // Swiperの初期化
    const swiper = new Swiper('.swiper-container', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
            rotate: 5,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: true,
        },
        breakpoints: {
            // スマホ表示
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            // タブレット表示
            768: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            // PC表示
            1024: {
                slidesPerView: 2.5,
                spaceBetween: 40
            }
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        speed: 800,
        on: {
            init: function() {
                // スライダー初期化時のアニメーション
                document.querySelectorAll('.swiper-slide').forEach((slide, index) => {
                    slide.style.opacity = '0';
                    setTimeout(() => {
                        slide.style.opacity = '1';
                        slide.style.transition = 'opacity 0.8s ease';
                    }, 300 + (index * 100));
                });
            },
            slideChangeTransitionStart: function() {
                // スライド変更時の輝きエフェクト
                const activeSlide = document.querySelector('.swiper-slide-active .gallery-item');
                if (activeSlide) {
                    activeSlide.classList.add('shine-effect');
                    setTimeout(() => {
                        activeSlide.classList.remove('shine-effect');
                    }, 1000);
                }
            }
        }
    });
    
    // 3Dパララックス効果（マウスホバー時）
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = x / rect.width - 0.5;
            const yPercent = y / rect.height - 0.5;
            
            const rotateY = xPercent * 10; // X軸の動きによるY軸回転
            const rotateX = yPercent * -10; // Y軸の動きによるX軸回転
            
            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            
            // 光の効果も追加
            const image = item.querySelector('.gallery-image');
            if (image) {
                image.style.backgroundPosition = `${x / 5 + 50}% ${y / 5 + 50}%`;
            }
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });
    
    // 光のパーティクルを生成
    const gallerySection = document.querySelector('.hackathon-gallery');
    if (gallerySection) {
        for (let i = 0; i < 15; i++) {
            createLightParticle(gallerySection);
        }
    }
    
    function createLightParticle(parent) {
        const particle = document.createElement('div');
        particle.classList.add('light-particle');
        
        const size = Math.random() * 15 + 5;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const animDuration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: radial-gradient(circle at center, rgba(110, 0, 255, 0.7), rgba(0, 212, 255, 0.4) 60%, transparent);
            filter: blur(${size / 3}px);
            top: ${posY}%;
            left: ${posX}%;
            pointer-events: none;
            opacity: 0;
            animation: floatLight ${animDuration}s ease-in-out infinite;
            animation-delay: -${delay}s;
            z-index: 0;
        `;
        
        parent.appendChild(particle);
    }
    
    // スクロールプログレスバーの更新
    function updateProgressBar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrolled + '%';
        
        // プログレスバーの色を動的に変更
        const hue = 260 + (scrolled / 100) * 60; // 紫(260)→青(220)のグラデーション
        progressBar.style.background = `linear-gradient(90deg, hsl(${hue}, 100%, 50%), var(--secondary-color))`;
    }
    
    // スクロールイベントリスナー
    window.addEventListener('scroll', () => {
        updateProgressBar();
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'all';
        }
    });
    
    // 初期化時にもプログレスバーを更新
    updateProgressBar();
    
    // スクロールインジケーターのクリックイベント
    scrollIndicator.addEventListener('click', () => {
        scrollToSection(introSection);
    });
    
    // スムーズスクロール関数
    function scrollToSection(element) {
        const offsetTop = element.offsetTop - 50;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    // 合計ページ数を設定
    totalPagesEl.textContent = totalCards.toString();
    
    // 初期カードを表示
    updateCards();
    
    // 次のカードボタン
    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalCards - 1) {
            currentIndex++;
            updateCards();
        }
    });
    
    // 前のカードボタン
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCards();
        }
    });
    
    // カードの表示を更新する関数
    function updateCards() {
        cards.forEach((card, index) => {
            card.classList.remove('active', 'prev');
            
            if (index === currentIndex) {
                card.classList.add('active');
            } else if (index === currentIndex - 1) {
                card.classList.add('prev');
            }
        });
        
        // ページ番号を更新
        currentPageEl.textContent = (currentIndex + 1).toString();
        
        // ボタンの無効化状態を更新
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex === totalCards - 1 ? '0.5' : '1';
    }
    
    // カードをキーボードでも操作できるようにする
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            if (currentIndex < totalCards - 1) {
                currentIndex++;
                updateCards();
            }
        } else if (e.key === 'ArrowLeft') {
            if (currentIndex > 0) {
                currentIndex--;
                updateCards();
            }
        }
    });
    
    // タッチスワイプでカードを切り替えられるようにする
    let touchStartX = 0;
    let touchEndX = 0;
    
    const interviews = document.querySelector('.interviews');
    
    interviews.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    interviews.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        // 右から左へのスワイプ (次へ)
        if (touchStartX - touchEndX > 50) {
            if (currentIndex < totalCards - 1) {
                currentIndex++;
                updateCards();
            }
        }
        
        // 左から右へのスワイプ (前へ)
        if (touchEndX - touchStartX > 50) {
            if (currentIndex > 0) {
                currentIndex--;
                updateCards();
            }
        }
    }
    
    // スクロール時のアニメーション
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    // アニメーション対象の要素を監視
    document.querySelectorAll('.intro, .cta, .hackathon-gallery').forEach(el => {
        observer.observe(el);
    });
    
    // CTAのボタンクリックでスムーズスクロール
    const applyBtn = document.querySelector('.apply-btn');
    applyBtn.addEventListener('click', () => {
        // ここにモーダルを表示するか、別ページに遷移するなどの処理を追加できます
        alert('ハッカソンへの応募フォームは準備中です。お楽しみに！');
    });
    
    // パーティクル背景効果
    createParticles();
});

// パーティクル効果を作成する関数
function createParticles() {
    const header = document.querySelector('header');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // ランダムなサイズと位置
        const size = Math.random() * 10 + 3;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 ${size}px rgba(255, 255, 255, 0.3);
            top: ${posY}%;
            left: ${posX}%;
            animation: float 15s linear infinite;
            animation-delay: -${delay}s;
        `;
        
        header.appendChild(particle);
    }
}

// スクロールアニメーション用のスタイルを追加
document.head.insertAdjacentHTML('beforeend', `
<style>
    .intro, .cta {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 1s ease, transform 1s ease;
    }
    
    .intro.animate, .cta.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    @keyframes float {
        0% { transform: translateY(0) translateX(0) rotate(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(20px) rotate(360deg); opacity: 0; }
    }
</style>
`); 