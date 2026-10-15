// Initialize AOS (Animate On Scroll)
if (typeof AOS !== 'undefined') {
    AOS.init({
        once: true
    });
}

/* ========================================================
   PROJECT CARDS MULTI-IMAGE SLIDER & LIGHTBOX CONTROLLER
======================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentProjectImages = [];
    let currentLightboxIndex = 0;
    let currentProjectName = '';

    // Setup each project card image wrapper
    document.querySelectorAll('.project-image-wrapper').forEach((wrapper) => {
        const track = wrapper.querySelector('.slider-track');
        const images = track ? track.querySelectorAll('.slide-img') : [];
        const projectName = wrapper.getAttribute('data-project') || 'Project Preview';
        let currentIndex = 0;

        if (images.length === 0) return;

        // Ensure first image is active
        images.forEach((img, idx) => {
            if (idx === 0) img.classList.add('active');
            else img.classList.remove('active');
        });

        // If multiple images exist, dynamically create controls
        if (images.length > 1) {
            // Prev / Next Arrows
            const prevBtn = document.createElement('button');
            prevBtn.className = 'slider-arrow prev';
            prevBtn.setAttribute('type', 'button');
            prevBtn.setAttribute('aria-label', 'Previous Image');
            prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';

            const nextBtn = document.createElement('button');
            nextBtn.className = 'slider-arrow next';
            nextBtn.setAttribute('type', 'button');
            nextBtn.setAttribute('aria-label', 'Next Image');
            nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

            // Dots container
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'slider-dots';

            // Counter badge
            const countBadge = document.createElement('span');
            countBadge.className = 'image-count-badge';
            countBadge.innerHTML = `<i class="fa-regular fa-images"></i> 1/${images.length}`;

            const updateSlider = (newIndex) => {
                currentIndex = (newIndex + images.length) % images.length;
                images.forEach((img, i) => {
                    img.classList.toggle('active', i === currentIndex);
                });
                dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
                countBadge.innerHTML = `<i class="fa-regular fa-images"></i> ${currentIndex + 1}/${images.length}`;
            };

            images.forEach((_, i) => {
                const dot = document.createElement('span');
                dot.className = `dot ${i === 0 ? 'active' : ''}`;
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    updateSlider(i);
                });
                dotsContainer.appendChild(dot);
            });

            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateSlider(currentIndex - 1);
            });

            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateSlider(currentIndex + 1);
            });

            wrapper.appendChild(prevBtn);
            wrapper.appendChild(nextBtn);
            wrapper.appendChild(dotsContainer);
            wrapper.appendChild(countBadge);
        }

        // Clicking the preview button or image opens the lightbox
        const openCurrentInLightbox = (e) => {
            e.stopPropagation();
            const allImgSrcs = Array.from(images).map(img => ({
                src: img.getAttribute('src'),
                alt: img.getAttribute('alt') || projectName
            }));

            currentProjectImages = allImgSrcs;
            currentLightboxIndex = currentIndex;
            currentProjectName = projectName;

            renderLightbox();
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const previewBtn = wrapper.querySelector('.project-preview-btn');
        if (previewBtn) {
            previewBtn.addEventListener('click', openCurrentInLightbox);
        }
        wrapper.addEventListener('click', (e) => {
            // Don't open lightbox if user clicked slider arrows or dots
            if (e.target.closest('.slider-arrow') || e.target.closest('.slider-dots')) return;
            openCurrentInLightbox(e);
        });
    });

    // Lightbox functions
    function renderLightbox() {
        if (currentProjectImages.length === 0) return;
        const currentItem = currentProjectImages[currentLightboxIndex];
        lightboxImg.src = currentItem.src;
        lightboxImg.alt = currentItem.alt;
        lightboxTitle.textContent = currentProjectName;

        if (currentProjectImages.length > 1) {
            lightboxCounter.textContent = `${currentLightboxIndex + 1} of ${currentProjectImages.length}`;
            lightboxPrev.style.display = 'flex';
            lightboxNext.style.display = 'flex';
        } else {
            lightboxCounter.textContent = '';
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function showPrevImage() {
        if (currentProjectImages.length <= 1) return;
        currentLightboxIndex = (currentLightboxIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
        renderLightbox();
    }

    function showNextImage() {
        if (currentProjectImages.length <= 1) return;
        currentLightboxIndex = (currentLightboxIndex + 1) % currentProjectImages.length;
        renderLightbox();
    }

    // Lightbox Listeners
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrevImage(); });
    if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNextImage(); });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.closest('.lightbox-content') === null) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });

    // View More Projects Toggle
    const toggleProjectsBtn = document.getElementById('toggleProjectsBtn');
    const extraProjectsContainer = document.getElementById('extraProjectsContainer');

    if (toggleProjectsBtn && extraProjectsContainer) {
        toggleProjectsBtn.addEventListener('click', () => {
            const isExpanded = extraProjectsContainer.classList.toggle('expanded');
            toggleProjectsBtn.classList.toggle('active', isExpanded);
            toggleProjectsBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');

            const btnText = toggleProjectsBtn.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = isExpanded ? 'Show Less Projects' : 'View More Projects';
            }

            if (isExpanded) {
                extraProjectsContainer.setAttribute('aria-hidden', 'false');
                if (typeof AOS !== 'undefined') AOS.refresh();
            } else {
                extraProjectsContainer.setAttribute('aria-hidden', 'true');
                toggleProjectsBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
});
