// JavaScript pour les interactions du site

// Création de la barre de progression
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
const scrollBar = document.createElement('div');
scrollBar.className = 'scroll-progress-bar';
scrollProgress.appendChild(scrollBar);
document.body.appendChild(scrollProgress);

// Gestion de la barre de progression
window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollBar.style.height = `${scrolled}%`;
});

// Bouton retour en haut
const backToTop = document.createElement('a');
backToTop.className = 'back-to-top';
backToTop.innerHTML = '↑';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Animation des sections au scroll
const observeSections = () => {
    const sections = document.querySelectorAll('.section-main');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    sections.forEach(section => {
        observer.observe(section);
    });
};

// Animation des phases au scroll
const observePhases = () => {
    const phases = document.querySelectorAll('.phase');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        },
        { threshold: 0.1 }
    );

    phases.forEach(phase => {
        phase.style.opacity = '0';
        phase.style.transform = 'translateX(-20px)';
        phase.style.transition = 'all 0.5s ease';
        observer.observe(phase);
    });
};

// Initialisation du carrousel Swiper
if (document.querySelector('.swiper-container')) {
    const swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });
}

// Gestion du formulaire de commande
const orderForm = document.getElementById('orderForm');
if (orderForm) {
    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Merci pour votre commande ! Nous vous contacterons bientôt pour finaliser votre achat.');
        orderForm.reset();
    });
}

// Gestion du formulaire de contact
const contactForm = document.querySelector('form');
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
        contactForm.reset();
    });
}

// Gestion des images au survol des cartes
const initializeCardHoverImages = () => {
    const cards = document.querySelectorAll('.card[data-image]');
    
    cards.forEach(card => {
        const imageUrl = card.dataset.image;
        card.style.setProperty('--hover-image', `url(${imageUrl})`);
        
        // Préchargement des images
        const img = new Image();
        img.src = imageUrl;
        
        // Applique l'image au pseudo-élément
        card.addEventListener('mouseenter', () => {
            card.style.setProperty('--hover-image', `url(${imageUrl})`);
            card.querySelector('::before').style.backgroundImage = `url(${imageUrl})`;
        });
    });
};

// Animation des cartes flottantes
const handleFloatingCards = () => {
    const cards = document.querySelectorAll('.floating-card');
    const container = document.querySelector('.cards-container');

    if (!container) return;

    const handleMouseMove = (e) => {
        const containerRect = container.getBoundingClientRect();
        const mouseX = e.clientX - containerRect.left;
        const mouseY = e.clientY - containerRect.top;

        cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2 - containerRect.left;
            const cardCenterY = cardRect.top + cardRect.height / 2 - containerRect.top;

            // Calculer la distance entre la souris et le centre de la carte
            const deltaX = mouseX - cardCenterX;
            const deltaY = mouseY - cardCenterY;

            // Effet 3D ajusté
            const angleX = (deltaY / containerRect.height) * 30;
            const angleY = (deltaX / containerRect.width) * -30;

            // Effet de profondeur progressif
            const translateZ = (6 - index) * 30;
            const scale = 1.05 - (index * 0.01);

            // Appliquer la transformation
            card.style.transform = `
                translateY(-50%)
                translateZ(${translateZ}px)
                rotateX(${angleX}deg)
                rotateY(${angleY}deg)
                rotate(${card.dataset.originalRotation || '0deg'})
                scale(${scale})
            `;
        });
    };

    const handleMouseLeave = () => {
        cards.forEach((card, index) => {
            const rotations = ['-5deg', '-3deg', '-1deg', '1deg', '3deg', '5deg'];
            const translateY = 45 + (index * 2);
            card.dataset.originalRotation = rotations[index];
            card.style.transform = `translateY(-50%) rotate(${rotations[index]})`;
            card.style.top = `${translateY}%`;
        });
    };

    // Initialiser les positions par défaut
    handleMouseLeave();

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
};

// Animation des territoires flottants
const handleFloatingTerritories = () => {
    const territories = document.querySelectorAll('.floating-territory');
    const container = document.querySelector('.territories-container');

    if (!container) return;

    territories.forEach(territory => {
        let rotation = 0;
        let isRotating = false;
        const inner = territory.querySelector('.territory-inner');

        territory.addEventListener('mouseenter', () => {
            isRotating = true;
            rotateTerritory();
        });

        territory.addEventListener('mouseleave', () => {
            isRotating = false;
            // Revenir à la position initiale
            rotation = 0;
            inner.style.transform = `rotateY(${rotation}deg)`;
        });

        function rotateTerritory() {
            if (!isRotating) return;
            
            rotation += 5; // Vitesse de rotation
            if (rotation >= 360) rotation = 0;
            
            inner.style.transform = `rotateY(${rotation}deg)`;
            requestAnimationFrame(rotateTerritory);
        }
    });

    const handleMouseMove = (e) => {
        const containerRect = container.getBoundingClientRect();
        const mouseX = e.clientX - containerRect.left;
        const mouseY = e.clientY - containerRect.top;

        territories.forEach((territory, index) => {
            const territoryRect = territory.getBoundingClientRect();
            const territoryCenterX = territoryRect.left + territoryRect.width / 2 - containerRect.left;
            const territoryCenterY = territoryRect.top + territoryRect.height / 2 - containerRect.top;

            const deltaX = mouseX - territoryCenterX;
            const deltaY = mouseY - territoryCenterY;

            // Effet 3D
            const angleX = (deltaY / containerRect.height) * 25;
            const angleY = (deltaX / containerRect.width) * -25;

            // Effet de profondeur
            const translateZ = (4 - index) * 25;

            territory.style.transform = `
                translateY(-50%)
                translateZ(${translateZ}px)
                rotateX(${angleX}deg)
                rotateY(${angleY}deg)
                rotate(${territory.dataset.originalRotation || '0deg'})
            `;
        });
    };

    const handleMouseLeave = () => {
        territories.forEach((territory, index) => {
            const rotations = ['-3deg', '-1deg', '1deg', '3deg'];
            territory.dataset.originalRotation = rotations[index];
            territory.style.transform = `translateY(-50%) rotate(${rotations[index]})`;
            territory.style.top = '50%';
        });
    };

    // Initialiser les positions par défaut
    handleMouseLeave();

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
};

// Appel des fonctions d'initialisation
document.addEventListener('DOMContentLoaded', () => {
    observeSections();
    observePhases();
    initializeCardHoverImages();
    handleFloatingCards();
    handleFloatingTerritories();
});
