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
    
    // テーマカードのホバーエフェクトとグリッチエフェクト強化
    const themeCards = document.querySelectorAll('.theme-card');
    
    themeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // ランダムな回転角度を設定
            const rotateY = 180 + (Math.random() * 10 - 5);
            const rotateX = Math.random() * 10 - 5;
            
            this.querySelector('.card-inner').style.transform = 
                `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            // マウスが離れたら元に戻す
            this.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
        });
    });
    
    // CTAバナーのグリッチエフェクト強化
    const ctaBanner = document.querySelector('.cta-banner');
    const glitchEffect = document.querySelector('.glitch-effect');
    
    if (ctaBanner && glitchEffect) {
        // グリッチエフェクトのランダムな強化
        setInterval(() => {
            // ランダムにグリッチを強調
            if (Math.random() > 0.7) {
                glitchEffect.style.opacity = Math.random() * 0.8 + 0.2;
                
                // テキストのグリッチ効果
                const ctaText = ctaBanner.querySelector('h4');
                if (ctaText && Math.random() > 0.8) {
                    const originalText = ctaText.textContent;
                    ctaText.style.textShadow = `
                        ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 rgba(255,0,0,0.7),
                        ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 rgba(0,255,255,0.7)
                    `;
                    
                    setTimeout(() => {
                        ctaText.style.textShadow = '0 0 15px rgba(110, 142, 251, 0.7)';
                    }, 100);
                }
            } else {
                glitchEffect.style.opacity = 0.4;
            }
        }, 1000);
    }
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

// ポリゴン背景アニメーション - パフォーマンス最適化バージョン
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('polygonBackground');
    if (!canvas || !canvas.getContext) return; // キャンバスがサポートされていなければ終了
    
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let scrollOffset = 0;
    let isLowPerfDevice = false;
    let lastTime = 0;
    let fpsThrottle = 1; // フレームスキップ用カウンター
    
    // デバイス性能のチェック
    function checkDevicePerformance() {
        // モバイルデバイスの判定
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // デバイスのピクセル比をチェック
        const pixelRatio = window.devicePixelRatio || 1;
        
        // 画面サイズをチェック
        const smallScreen = window.innerWidth < 768;
        
        // これらの条件に基づいて性能を判断
        isLowPerfDevice = (isMobile || pixelRatio > 2 || smallScreen);
        
        // 低性能デバイスの場合はフレームレートを下げる
        if (isLowPerfDevice) {
            fpsThrottle = 2; // 2フレームに1回だけ描画
        }
        
        return isLowPerfDevice;
    }
    
    // キャンバスサイズをウィンドウに合わせる
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        
        // 高DPIデバイス対応（ただし低性能デバイスではスケールを下げる）
        const scale = isLowPerfDevice ? 1 : (window.devicePixelRatio || 1);
        canvas.width = width * scale;
        canvas.height = height * scale;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        if (scale !== 1) {
            ctx.scale(scale, scale);
        }
    }
    
    // デバイス性能チェックと初期設定
    checkDevicePerformance();
    resizeCanvas();
    
    // ウィンドウサイズが変更されたらキャンバスをリサイズ
    window.addEventListener('resize', function() {
        checkDevicePerformance();
        resizeCanvas();
        initPolygons(); // ポリゴンを再生成
    });
    
    // ポリゴンの配列
    let polygons = [];
    
    // ポリゴン数をデバイス性能に応じて調整
    function getPolygonCount() {
        if (isLowPerfDevice) {
            return Math.min(15, Math.floor(width * height / 50000));
        }
        return Math.min(30, Math.floor(width * height / 30000));
    }
    
    // ポリゴンを生成
    function initPolygons() {
        polygons = [];
        const count = getPolygonCount();
        
        for (let i = 0; i < count; i++) {
            polygons.push(generatePolygon());
        }
    }
    
    // ポリゴンの生成関数
    function generatePolygon() {
        // 単純な形状（パフォーマンス向上のため）
        const sides = Math.floor(Math.random() * 2) + 3; // 3〜4角形に制限
        const size = Math.random() * 120 + 40;
        const x = Math.random() * width;
        const y = Math.random() * height;
        const rotation = Math.random() * Math.PI * 2;
        const rotationSpeed = (Math.random() - 0.5) * 0.005; // 回転速度を下げる
        const moveSpeed = (Math.random() - 0.5) * 1; // 移動速度を下げる
        const depth = Math.random() * 0.5 + 0.2;
        
        // 位置に応じた透明度の調整（画面中央に近いほど少し強く）
        const centerDistance = Math.sqrt(
            Math.pow((x / width) - 0.5, 2) + 
            Math.pow((y / height) - 0.5, 2)
        );
        const opacityAdjust = Math.max(0.05, 0.1 - centerDistance * 0.05);
        
        // シンプルな色パレット
        const colors = [
            `rgba(110, 0, 255, ${opacityAdjust})`,
            `rgba(0, 212, 255, ${opacityAdjust})`,
            `rgba(110, 142, 251, ${opacityAdjust})`,
            `rgba(81, 152, 255, ${opacityAdjust})`
        ];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const edgeColor = color.replace(opacityAdjust.toString(), (opacityAdjust * 3).toString()); // エッジの色
        
        return {
            sides,
            size,
            x,
            y,
            rotation,
            rotationSpeed,
            moveSpeed,
            color,
            edgeColor,
            depth,
            opacityAdjust
        };
    }
    
    // ポリゴンを描画
    function drawPolygon(polygon) {
        const { sides, size, x, y, rotation, color, edgeColor } = polygon;
        const angle = (Math.PI * 2) / sides;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const px = Math.cos(angle * i) * size;
            const py = Math.sin(angle * i) * size;
            
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        
        // グラデーション効果（低負荷バージョン）
        if (!isLowPerfDevice) {
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
            const baseColor = color.split(',');
            const baseOpacity = parseFloat(baseColor[3]);
            
            // 中心から外側へのグラデーション
            gradient.addColorStop(0, baseColor[0] + ',' + baseColor[1] + ',' + baseColor[2] + ',' + (baseOpacity * 1.5) + ')');
            gradient.addColorStop(1, color);
            
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = color;
        }
        
        ctx.fill();
        
        // 低性能デバイスでもエッジを表示するが、一部のポリゴンのみ
        const shouldDrawEdge = !isLowPerfDevice || Math.random() > 0.6;
        
        if (shouldDrawEdge) {
            ctx.strokeStyle = edgeColor;
            ctx.lineWidth = isLowPerfDevice ? 0.5 : 1;
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    // スクロールイベントの追跡（スロットリング適用）
    let scrollTimeout;
    let lastScrollY = 0;
    let scrollDirection = 0;
    let scrollSpeed = 0;
    
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
                
                // スクロール方向と速度を計算
                scrollDirection = currentScrollY > lastScrollY ? 1 : (currentScrollY < lastScrollY ? -1 : 0);
                scrollSpeed = Math.min(Math.abs(currentScrollY - lastScrollY) * 0.05, 5);
                
                scrollOffset = currentScrollY;
                lastScrollY = currentScrollY;
                scrollTimeout = null;
            }, 20); // 20msごとに更新（スクロールイベントの頻度を制限）
        }
    });
    
    // フレームレート制御のための変数
    let frameCount = 0;
    
    // アニメーションループ
    function animate(timestamp) {
        // フレームスキップによるパフォーマンス最適化
        frameCount++;
        if (frameCount % fpsThrottle !== 0) {
            requestAnimationFrame(animate);
            return;
        }
        
        ctx.clearRect(0, 0, width, height);
        
        polygons.forEach(polygon => {
            // スクロールに基づいた位置調整（単純化）
            const yOffset = scrollOffset * polygon.depth;
            const adjustedY = polygon.y - yOffset % (height * 2);
            
            // 軽量なスクロール効果
            let additionalRotation = 0;
            let additionalScale = 1;
            
            if (scrollSpeed > 0.5 && !isLowPerfDevice) {
                // スクロール方向に少し傾ける（低負荷版）
                additionalRotation = scrollDirection * 0.001 * polygon.depth;
                
                // スケール効果（低負荷版）
                if (Math.random() > 0.9) { // 一部のポリゴンだけに適用して負荷軽減
                    additionalScale = 1 + (scrollSpeed * 0.01);
                }
            }
            
            // 画面外のポリゴンを反対側に配置
            let drawY = adjustedY;
            if (adjustedY < -polygon.size) {
                drawY = height + adjustedY;
            } else if (adjustedY > height + polygon.size) {
                drawY = adjustedY - height;
            }
            
            // 位置と回転の更新
            polygon.y += polygon.moveSpeed * (isLowPerfDevice ? 1 : (1 + scrollSpeed * 0.1));
            polygon.rotation += polygon.rotationSpeed + additionalRotation;
            
            // 画面範囲チェック
            if (polygon.y < -polygon.size * 2) polygon.y = height + polygon.size;
            if (polygon.y > height + polygon.size * 2) polygon.y = -polygon.size;
            
            // 描画
            drawPolygon({
                ...polygon,
                y: drawY,
                size: polygon.size * additionalScale
            });
        });
        
        // スクロール速度の減衰
        if (scrollSpeed > 0) {
            scrollSpeed *= 0.95;
            if (scrollSpeed < 0.1) scrollSpeed = 0;
        }
        
        requestAnimationFrame(animate);
    }
    
    // ポリゴンを初期化して描画開始
    initPolygons();
    requestAnimationFrame(animate);
});

// いいね機能の実装
document.addEventListener('DOMContentLoaded', function() {
    initLikeSystem();
});

function initLikeSystem() {
    // いいねボタンの要素を取得
    const likeButtons = document.querySelectorAll('.like-button');
    if (!likeButtons.length) return;
    
    // ローカルストレージからいいね情報を取得
    const likeData = getLikeDataFromStorage();
    
    // 各ボタンの状態を初期化
    likeButtons.forEach(button => {
        const interviewId = button.getAttribute('data-interview-id');
        const likeCount = button.querySelector('.like-count');
        
        // このインタビューの現在のいいね数を表示
        if (likeData.counters[interviewId]) {
            likeCount.textContent = likeData.counters[interviewId];
        }
        
        // すでにいいねしている場合はボタンの状態を変更
        if (likeData.liked[interviewId]) {
            button.classList.add('liked');
        }
        
        // いいねボタンのクリックイベント
        button.addEventListener('click', function() {
            handleLikeButtonClick(button, interviewId);
        });
    });
}

// いいねボタンクリック時の処理
function handleLikeButtonClick(button, interviewId) {
    // ローカルストレージからいいね情報を取得
    const likeData = getLikeDataFromStorage();
    
    // カウント表示要素
    const likeCount = button.querySelector('.like-count');
    
    // いいね状態を切り替え
    if (likeData.liked[interviewId]) {
        // すでにいいねしている場合は取り消し
        likeData.liked[interviewId] = false;
        button.classList.remove('liked');
        
        if (likeData.counters[interviewId] > 0) {
            likeData.counters[interviewId]--;
            likeCount.textContent = likeData.counters[interviewId];
        }
        
        // グリッチエフェクト
        createGlitchEffect(button, 'unlike');
    } else {
        // まだいいねしていない場合はいいねする
        likeData.liked[interviewId] = true;
        button.classList.add('liked');
        
        // いいねカウンターを増やす
        if (!likeData.counters[interviewId]) {
            likeData.counters[interviewId] = 0;
        }
        likeData.counters[interviewId]++;
        likeCount.textContent = likeData.counters[interviewId];
        
        // パーティクルエフェクト
        createLikeParticles(button);
    }
    
    // ローカルストレージに保存
    saveLikeDataToStorage(likeData);
}

// ローカルストレージからいいねデータを取得
function getLikeDataFromStorage() {
    const storedData = localStorage.getItem('hackathon_interview_likes');
    if (storedData) {
        return JSON.parse(storedData);
    } else {
        // 初期データを作成
        return {
            liked: {}, // いいね状態を保存するオブジェクト
            counters: {} // いいね数を保存するオブジェクト
        };
    }
}

// ローカルストレージにいいねデータを保存
function saveLikeDataToStorage(likeData) {
    localStorage.setItem('hackathon_interview_likes', JSON.stringify(likeData));
}

// いいねエフェクト - パーティクル
function createLikeParticles(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // いいね時のエフェクト数
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        document.body.appendChild(particle);
        
        // ランダムな角度と距離
        const angle = (Math.PI * 2) * (i / particleCount);
        const distance = Math.random() * 60 + 20;
        
        // パーティクルの位置
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        // パーティクルのスタイル
        particle.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${Math.random() > 0.5 ? '#ff3366' : '#a777e3'};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            opacity: 1;
            transform: translate(-50%, -50%);
        `;
        
        // パーティクルのアニメーション
        const animation = particle.animate([
            { 
                opacity: 1, 
                transform: 'translate(-50%, -50%) scale(1)'
            },
            { 
                opacity: 0, 
                transform: `translate(calc(${x - centerX}px), calc(${y - centerY}px)) scale(0)`
            }
        ], {
            duration: Math.random() * 600 + 400,
            easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)'
        });
        
        animation.onfinish = () => {
            particle.remove();
        };
    }
}

// グリッチエフェクト
function createGlitchEffect(element, type = 'like') {
    const glitchCount = 3;
    const glitchDuration = 50;
    
    const baseTransform = element.style.transform || '';
    const color = type === 'like' ? '#ff3366' : 'rgba(110, 142, 251, 1)';
    
    for (let i = 0; i < glitchCount; i++) {
        setTimeout(() => {
            // X軸オフセット
            const offsetX = (Math.random() - 0.5) * 10;
            element.style.transform = `${baseTransform} translateX(${offsetX}px)`;
            
            // 色変更
            element.style.borderColor = color;
            
            // 元に戻す
            setTimeout(() => {
                element.style.transform = baseTransform;
                element.style.borderColor = '';
            }, glitchDuration);
        }, i * glitchDuration * 2);
    }
} 