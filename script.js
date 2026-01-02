// Główny plik JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Animowane tło gradientowe
    const background = document.getElementById('background');
    if (background) {
        background.style.animation = 'gradientShift 15s ease infinite';
    }
    
    // Pokazanie cookie bannera po 2 sekundach
    setTimeout(() => {
        const cookieBanner = document.getElementById('cookieBanner');
        if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
            cookieBanner.classList.add('show');
        }
    }, 2000);
    
    // Płynne przewijanie do sekcji
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href.startsWith('#!')) return;
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('show');
            mobileMenuBtn.innerHTML = mainNav.classList.contains('show') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Scroll header effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('mainHeader');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Auto-slide testimonials
    setInterval(() => {
        const slider = document.querySelector('.testimonial-slider');
        if (slider) {
            slider.scrollBy({ left: 370, behavior: 'smooth' });
            
            if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 100) {
                setTimeout(() => {
                    slider.scrollTo({ left: 0, behavior: 'smooth' });
                }, 3000);
            }
        }
    }, 5000);
});

// Cookie functions
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    const cookieBanner = document.getElementById('cookieBanner');
    if (cookieBanner) {
        cookieBanner.classList.remove('show');
    }
}

function rejectCookies() {
    localStorage.setItem('cookiesAccepted', 'false');
    const cookieBanner = document.getElementById('cookieBanner');
    if (cookieBanner) {
        cookieBanner.classList.remove('show');
    }
}

// FAQ toggle
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    answer.classList.toggle('active');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
    
    // Zamknij inne otwarte FAQ
    document.querySelectorAll('.faq-answer').forEach(otherAnswer => {
        if (otherAnswer !== answer && otherAnswer.classList.contains('active')) {
            otherAnswer.classList.remove('active');
            otherAnswer.previousElementSibling.querySelector('i').classList.remove('fa-chevron-up');
            otherAnswer.previousElementSibling.querySelector('i').classList.add('fa-chevron-down');
        }
    });
}

// Animacja statystyk
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString() + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString() + '+';
        }
    }, 16);
}

// Inicjalizacja animacji dla elementów
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Dodanie opóźnienia dla elementów w sekcji
                if (entry.target.classList.contains('step-card')) {
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
                
                if (entry.target.classList.contains('feature-card')) {
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.05}s`;
                }
                
                if (entry.target.classList.contains('monitoring-card')) {
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);
    
    // Obserwuj elementy do animacji
    document.querySelectorAll('.step-card, .feature-card, .server-plan, .coin-card, .testimonial-card, .monitoring-card, .link-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Uruchom animacje po załadowaniu strony
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}
// Funkcja dla animacji link-cards
function initLinkCardsAnimation() {
    const linkCards = document.querySelectorAll('.link-card');
    linkCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animated');
        }, index * 100);
    });
}

// Wywołaj po załadowaniu strony
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLinkCardsAnimation);
} else {
    initLinkCardsAnimation();
}
