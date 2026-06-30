document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       FAQ ACCORDION
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        
        questionButton.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other open items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle active class on current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       COUNTDOWN TIMER (Persistent with LocalStorage)
       ========================================================================== */
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const timerDurationMinutes = 15; // Duration in minutes
    
    function startTimer() {
        let timerEnd = localStorage.getItem('copa2026_timer_end');
        const now = new Date().getTime();
        
        // If timer end time doesn't exist or is in the past, set a new one
        if (!timerEnd || parseInt(timerEnd) < now) {
            timerEnd = now + (timerDurationMinutes * 60 * 1000);
            localStorage.setItem('copa2026_timer_end', timerEnd.toString());
        }
        
        updateTimerDisplay(parseInt(timerEnd));
        
        const timerInterval = setInterval(() => {
            const currentTime = new Date().getTime();
            const distance = parseInt(timerEnd) - currentTime;
            
            if (distance < 0) {
                // Reset timer when it ends to keep the scarcity effect active
                const newEnd = currentTime + (timerDurationMinutes * 60 * 1000);
                localStorage.setItem('copa2026_timer_end', newEnd.toString());
                timerEnd = newEnd;
            } else {
                updateTimerDisplay(parseInt(timerEnd));
            }
        }, 1000);
    }
    
    function updateTimerDisplay(endTime) {
        const now = new Date().getTime();
        const distance = endTime - now;
        
        if (distance < 0) return;
        
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Format with leading zeros
        minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
        secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    }
    
    startTimer();

    /* ==========================================================================
       SMOOTH SCROLL FALLBACK
       ========================================================================== */
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Get header height for offset
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 10;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ==========================================================================
       SIMULATED LIVE PURCHASES (Social Proof Toast)
       ========================================================================== */
    const mockPurchases = [
        { name: 'Lucas S.', city: 'São Paulo/SP', time: '1 min atrás' },
        { name: 'Mariana R.', city: 'Porto Alegre/RS', time: '3 min atrás' },
        { name: 'Thiago M.', city: 'Rio de Janeiro/RJ', time: '5 min atrás' },
        { name: 'Beatriz G.', city: 'Belo Horizonte/MG', time: '2 min atrás' },
        { name: 'Felipe A.', city: 'Salvador/BA', time: '4 min atrás' },
        { name: 'Juliana C.', city: 'Brasília/DF', time: '1 min atrás' },
        { name: 'Rodrigo P.', city: 'Curitiba/PR', time: '6 min atrás' },
        { name: 'Aline N.', city: 'Fortaleza/CE', time: '3 min atrás' }
    ];

    // Create container for notifications
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
    
    // Inject toast CSS dynamically to keep setup simple
    const toastStyles = `
        .toast-container {
            position: fixed;
            bottom: 24px;
            left: 24px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-width: 320px;
            pointer-events: none;
        }
        .purchase-toast {
            background-color: #111422;
            border: 1px solid rgba(250, 204, 21, 0.3);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(250, 204, 21, 0.05);
            border-radius: 8px;
            padding: 14px 18px;
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateX(-120%);
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: auto;
        }
        .purchase-toast.show {
            transform: translateX(0);
            opacity: 1;
        }
        .toast-icon {
            font-size: 1.5rem;
            background-color: rgba(34, 197, 94, 0.1);
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }
        .toast-content {
            display: flex;
            flex-direction: column;
        }
        .toast-title {
            font-family: 'Outfit', sans-serif;
            font-size: 0.85rem;
            font-weight: 700;
            color: #f8fafc;
        }
        .toast-desc {
            font-size: 0.75rem;
            color: #94a3b8;
        }
        .toast-time {
            font-size: 0.65rem;
            color: #22c55e;
            font-weight: 700;
            margin-top: 2px;
        }
        @media (max-width: 576px) {
            .toast-container {
                left: 16px;
                right: 16px;
                bottom: 16px;
                max-width: none;
            }
            .purchase-toast {
                transform: translateY(150%);
            }
            .purchase-toast.show {
                transform: translateY(0);
            }
        }
    `;
    
    const styleSheet = document.createElement("style");
    styleSheet.innerText = toastStyles;
    document.head.appendChild(styleSheet);

    function showRandomPurchase() {
        const randomIndex = Math.floor(Math.random() * mockPurchases.length);
        const purchase = mockPurchases[randomIndex];
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'purchase-toast';
        toast.innerHTML = `
            <div class="toast-icon">⚡</div>
            <div class="toast-content">
                <span class="toast-title">${purchase.name} comprou!</span>
                <span class="toast-desc">Adquiriu o PDF completo - ${purchase.city}</span>
                <span class="toast-time">Confirmado há ${purchase.time}</span>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger reflow to enable animation
        toast.offsetHeight;
        
        // Show the toast
        toast.classList.add('show');
        
        // Remove the toast after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            // Wait for transition to complete before removing from DOM
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 5000);
    }

    // Show first toast after 6 seconds, then repeat every 18 seconds
    setTimeout(() => {
        showRandomPurchase();
        setInterval(showRandomPurchase, 18000);
    }, 6000);

});
