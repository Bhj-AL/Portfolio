document.addEventListener("DOMContentLoaded", () => {
    const titleContainer = document.querySelector(".hero-title");
    const titleSpans = document.querySelectorAll(".hero-title span");
    const contactBtn = document.querySelector(".hero-btn-contact");
    const descSection = document.querySelector("#DescrTxtSec");
    const descP = document.querySelector("#DescrTxtSec p");
    
    // Website states: 'loading', 'main', 'animating', 'desc'
    let state = 'loading'; 

    // ==========================================
    // 1. TYPING ANIMATION (ON LOAD)
    // ==========================================
    let typeIndex = 0;
    
    function typeText() {
        if (typeIndex < titleSpans.length) {
            // Remove cursor from previous letter
            if (typeIndex > 0) titleSpans[typeIndex - 1].classList.remove('cursor');
            
            // Show current letter and add cursor
            titleSpans[typeIndex].style.opacity = 1;
            titleSpans[typeIndex].classList.add('cursor');
            
            typeIndex++;
            setTimeout(typeText, 80); // Speed of typing
        } else {
            // Finish typing
            titleSpans[typeIndex - 1].classList.remove('cursor');
            contactBtn.classList.add('fade-in');
            state = 'main'; // Unlock scrolling
        }
    }
    
    // Start typing shortly after load
    setTimeout(typeText, 400);

    // ==========================================
    // 2. SCROLL DOWN LOGIC (Main -> Desc)
    // ==========================================
    function transitionToDesc() {
        if (state !== 'main') return;
        state = 'animating';
        
        // 1. Smoke out the title
        titleContainer.classList.add('animate-smoke');
        
        // 2. Fade out button
        contactBtn.classList.remove('fade-in');
        contactBtn.classList.add('animate-exit');
        
        // 3. Pop in the description text
        descSection.classList.add('is-active');
        descSection.classList.add('animate-lines');
        
        // Reset the drag transform in case it was modified before
        descP.style.transform = 'translateY(0)';
        
        // Wait for animations to finish before allowing scroll up
        setTimeout(() => {
            state = 'desc';
        }, 1500); 
    }

    // ==========================================
    // 3. SCROLL UP LOGIC (Desc -> Main)
    // ==========================================
    function transitionToMain() {
        if (state !== 'desc') return;
        state = 'animating';
        
        // 1. Push description text down
        descP.style.transition = 'transform 0.6s cubic-bezier(.15,.15,.04,.99)';
        descP.style.transform = 'translateY(100vh)';
        
        // 2. Bring back Hero text & Button
        setTimeout(() => {
            // Remove smoke classes
            titleContainer.classList.remove('animate-smoke');
            
            // Force a re-flow to reset CSS states, then fade title in
            titleSpans.forEach(span => {
                span.style.transition = 'none';
                span.style.opacity = 0;
            });
            
            // Brief timeout to ensure the browser registers the reset
            setTimeout(() => {
                titleSpans.forEach(span => {
                    span.style.transition = 'opacity 0.8s ease';
                    span.style.opacity = 1;
                });
                
                // Bring back button
                contactBtn.classList.remove('animate-exit');
                contactBtn.classList.add('fade-in');
            }, 50);

            // Clean up states
            setTimeout(() => {
                descSection.classList.remove('animate-lines');
                descSection.classList.remove('is-active');
                state = 'main';
            }, 800);

        }, 200); // Slight delay so text moves out of the way first
    }

    // ==========================================
    // 4. EVENT LISTENERS (Mouse Wheel & Touch)
    // ==========================================

    // Desktop: Mouse Wheel
    window.addEventListener('wheel', (e) => {
        if (state === 'main' && e.deltaY > 0) {
            transitionToDesc();
        } else if (state === 'desc' && e.deltaY < 0) {
            transitionToMain();
        }
    });

    // Mobile/Trackpad: Touch & Drag
    let touchStartY = 0;
    let currentDragY = 0;
    let isDragging = false;

    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        if (state === 'desc') {
            isDragging = true;
            descP.style.transition = 'none'; // Remove transition for real-time tracking
        }
    });
    
    window.addEventListener('touchmove', (e) => {
        // Handle dragging the description text down in real-time
        if (state === 'desc' && isDragging) {
            const touchY = e.touches[0].clientY;
            const deltaY = touchY - touchStartY;
            
            // Only allow dragging downwards
            if (deltaY > 0) {
                descP.style.transform = `translateY(${deltaY}px)`;
                currentDragY = deltaY;
            }
        }
    }, { passive: false }); // Passive false sometimes needed to prevent default browser overscroll
    
    window.addEventListener('touchend', (e) => {
        // Scrolling Down from Main Screen
        if (state === 'main') {
            const touchEndY = e.changedTouches[0].clientY;
            // If swiped UP (scrolling down the page)
            if (touchStartY - touchEndY > 50) {
                transitionToDesc();
            }
        } 
        // Releasing the drag on the Description Screen
        else if (state === 'desc' && isDragging) {
            isDragging = false;
            
            // If dragged down far enough, commit to the transition
            if (currentDragY > 120) {
                transitionToMain();
            } else {
                // Not dragged enough: Snap back to original position
                descP.style.transition = 'transform 0.4s ease';
                descP.style.transform = 'translateY(0)';
            }
            currentDragY = 0;
        }
    });
});