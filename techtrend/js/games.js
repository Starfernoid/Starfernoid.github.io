document.addEventListener('DOMContentLoaded', function() {
    // Tab chuyển đổi giữa các game
    const gameTabs = document.querySelectorAll('.game-tab');
    const gameContainers = document.querySelectorAll('.game-container');

    gameTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Đổi tab active
            gameTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Hiển thị game tương ứng
            gameContainers.forEach(container => {
                if (container.id === `${tabName}-game`) {
                    container.classList.remove('hidden');
                } else {
                    container.classList.add('hidden');
                }
            });
        });
    });

    // 1. Vòng quay may mắn
    const wheel = document.querySelector('.wheel');
    const spinButton = document.querySelector('.spin-button');
    let isSpinning = false;
    let currentRotation = 0;
    
    // Giải thưởng (góc quay từ 0-360)
    const prizes = [
        { text: 'Giảm 50%', value: '50off', angle: 0, color: '#FF3B30' },
        { text: 'Giảm 20%', value: '20off', angle: 60, color: '#FF9500' },
        { text: 'Giảm 10%', value: '10off', angle: 120, color: '#FFCC00' },
        { text: 'Voucher 500.000đ', value: '500k', angle: 180, color: '#34C759' },
        { text: 'Miễn phí vận chuyển', value: 'freeship', angle: 240, color: '#007AFF' },
        { text: 'Quay lại lần nữa', value: 'spinagain', angle: 300, color: '#5856D6' }
    ];
    
    // Vẽ vòng quay
    function drawWheel() {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        wheel.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const center = canvas.width / 2;
        const radius = center - 10;
        
        // Vẽ các phần
        prizes.forEach((prize, i) => {
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, 
                    (prize.angle - 30) * Math.PI / 180, 
                    (prize.angle + 30) * Math.PI / 180);
            ctx.closePath();
            ctx.fillStyle = prize.color;
            ctx.fill();
            
            // Vẽ text
            ctx.save();
            ctx.translate(center, center);
            ctx.rotate((prize.angle) * Math.PI / 180);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(prize.text, radius - 10, 5);
            ctx.restore();
        });
        
        // Vẽ trung tâm
        ctx.beginPath();
        ctx.arc(center, center, 20, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }
    
    // Quay vòng quay
    function spinWheel() {
        if (isSpinning) return;
        
        isSpinning = true;
        spinButton.disabled = true;
        
        // Random giải thưởng (thực tế nên xử lý phía server)
        const prizeIndex = Math.floor(Math.random() * prizes.length);
        const prize = prizes[prizeIndex];
        const targetAngle = 360 * 5 + prize.angle; // Quay 5 vòng + góc giải thưởng
        
        // Animation quay
        const duration = 5000; // 5 giây
        const startTime = performance.now();
        const startRotation = currentRotation;
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = easeOutCubic(progress);
            
            currentRotation = startRotation + (targetAngle - startRotation) * easeProgress;
            wheel.style.transform = `rotate(${-currentRotation}deg)`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Kết thúc quay
                isSpinning = false;
                spinButton.disabled = false;
                showPrizeResult(prize);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Hiệu ứng easing
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    // Hiển thị kết quả
    function showPrizeResult(prize) {
        const modal = document.createElement('div');
        modal.className = 'prize-modal';
        modal.innerHTML = `
            <div class="prize-modal-content">
                <h3>Chúc mừng!</h3>
                <p>Bạn đã nhận được: <strong>${prize.text}</strong></p>
                <p>Mã ưu đãi: <code>TT${Math.floor(1000 + Math.random() * 9000)}</code></p>
                <button class="use-voucher">Sử dụng ngay</button>
                <button class="close-modal">Đóng</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Sự kiện nút
        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
        
        modal.querySelector('.use-voucher').addEventListener('click', function() {
            // Chuyển đến trang sản phẩm với mã giảm giá
            window.location.href = `products.html?voucher=${prize.value}`;
        });
    }
    
    // Sự kiện nút quay
    spinButton.addEventListener('click', spinWheel);
    
    // Vẽ vòng quay khi tải trang
    drawWheel();
    
    // 2. Game cào thẻ trúng thưởng
    const scratchGame = document.getElementById('scratch-game');
    const scratchCanvas = document.getElementById('scratch-canvas');
    const scratchPrize = document.querySelector('.scratch-prize');
    
    if (scratchCanvas) {
        const ctx = scratchCanvas.getContext('2d');
        let isDrawing = false;
        let scratchedPixels = 0;
        const totalPixels = scratchCanvas.width * scratchCanvas.height;
        const revealThreshold = 0.5; // 50% cào mới hiện giải thưởng
        
        // Kích thước canvas
        scratchCanvas.width = 300;
        scratchCanvas.height = 200;
        
        // Vẽ thẻ cào
        function drawScratchCard() {
            // Lớp dưới - giải thưởng
            ctx.fillStyle = '#FF3B30';
            ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
            
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Bạn đã trúng', scratchCanvas.width/2, scratchCanvas.height/2 - 20);
            
            // Random giải thưởng
            const prizes = ['100.000đ', '200.000đ', '500.000đ', 'Giảm 10%', 'Giảm 20%', 'Freeship'];
            const prize = prizes[Math.floor(Math.random() * prizes.length)];
            ctx.font = 'bold 24px Arial';
            ctx.fillText(`Voucher ${prize}`, scratchCanvas.width/2, scratchCanvas.height/2 + 20);
            
            // Lớp trên - để cào
            ctx.fillStyle = '#86868b';
            ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
            
            ctx.fillStyle = '#fff';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Dùng chuột cào lớp phủ để xem giải thưởng', 
                         scratchCanvas.width/2, scratchCanvas.height/2);
        }
        
        // Sự kiện cào
        scratchCanvas.addEventListener('mousedown', startScratching);
        scratchCanvas.addEventListener('mousemove', scratch);
        scratchCanvas.addEventListener('mouseup', stopScratching);
        scratchCanvas.addEventListener('mouseleave', stopScratching);
        
        // Touch events cho mobile
        scratchCanvas.addEventListener('touchstart', startScratching);
        scratchCanvas.addEventListener('touchmove', scratch);
        scratchCanvas.addEventListener('touchend', stopScratching);
        
        function startScratching(e) {
            isDrawing = true;
            scratch(e);
        }
        
        function scratch(e) {
            if (!isDrawing) return;
            
            const rect = scratchCanvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;
            
            // Vẽ vòng tròn trong suốt
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.fill();
            
            // Kiểm tra % đã cào
            checkScratchedArea();
        }
        
        function stopScratching() {
            isDrawing = false;
        }
        
        function checkScratchedArea() {
            const imageData = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
            const pixels = imageData.data;
            let transparentPixels = 0;
            
            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] === 0) { // Alpha = 0 (trong suốt)
                    transparentPixels++;
                }
            }
            
            const scratchedPercent = transparentPixels / (scratchCanvas.width * scratchCanvas.height);
            
            if (scratchedPercent >= revealThreshold) {
                showScratchPrize();
            }
        }
        
        function showScratchPrize() {
            scratchPrize.classList.remove('hidden');
            scratchCanvas.removeEventListener('mousedown', startScratching);
            scratchCanvas.removeEventListener('mousemove', scratch);
            
            // Lưu vào localStorage để không cho chơi lại
            localStorage.setItem('lastScratchPlay', new Date().toDateString());
        }
        
        // Kiểm tra nếu đã chơi hôm nay
        const lastPlay = localStorage.getItem('lastScratchPlay');
        if (lastPlay === new Date().toDateString()) {
            scratchCanvas.style.opacity = '0.5';
            scratchCanvas.style.cursor = 'not-allowed';
            scratchPrize.classList.remove('hidden');
            scratchPrize.querySelector('.prize-amount').textContent = '100.000đ'; // Giải mặc định
        } else {
            drawScratchCard();
        }
    }
    
    // CSS cho các game
    const style = document.createElement('style');
    style.textContent = `
        /* Vòng quay may mắn */
        .wheel {
            width: 300px;
            height: 300px;
            position: relative;
            margin: 0 auto;
            transition: transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99);
        }
        
        .wheel-center {
            position: absolute;
            width: 40px;
            height: 40px;
            background: #fff;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
        
        .spin-button {
            display: block;
            margin: 20px auto;
            padding: 10px 30px;
            background: #0066cc;
            color: white;
            border: none;
            border-radius: 30px;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .spin-button:hover {
            background: #004d99;
            transform: scale(1.05);
        }
        
        .spin-button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        
        /* Game cào thẻ */
        .scratch-card {
            position: relative;
            width: 300px;
            height: 200px;
            margin: 0 auto;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        #scratch-canvas {
            display: block;
            background: #f5f5f7;
            cursor: crosshair;
        }
        
        .scratch-prize {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #FF3B30;
            color: white;
            text-align: center;
            padding: 20px;
        }
        
        .scratch-prize.hidden {
            display: none;
        }
        
        .scratch-prize h3 {
            margin-bottom: 10px;
            font-size: 24px;
        }
        
        .scratch-prize .prize-amount {
            font-size: 28px;
            font-weight: bold;
        }
        
        .use-voucher {
            margin-top: 15px;
            padding: 8px 20px;
            background: white;
            color: #FF3B30;
            border: none;
            border-radius: 20px;
            font-weight: bold;
            cursor: pointer;
        }
        
        /* Modal giải thưởng */
        .prize-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .prize-modal.show {
            opacity: 1;
        }
        
        .prize-modal-content {
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        
        .prize-modal h3 {
            color: #0066cc;
            margin-bottom: 15px;
        }
        
        .prize-modal p {
            margin-bottom: 10px;
        }
        
        .prize-modal code {
            background: #f5f5f7;
            padding: 5px 10px;
            border-radius: 5px;
            font-family: monospace;
        }
        
        .prize-modal button {
            margin: 10px 5px;
            padding: 8px 20px;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
        }
        
        .prize-modal .use-voucher {
            background: #0066cc;
            color: white;
        }
        
        .prize-modal .close-modal {
            background: #f5f5f7;
            color: #1d1d1f;
        }
    `;
    document.head.appendChild(style);
});