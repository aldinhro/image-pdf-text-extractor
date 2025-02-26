/**
 * Logo Marquee - Vertical Infinite Scroll
 * This script creates a seamless infinite scroll effect for logo showcases
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize both marquee tracks
    initMarquee('.marquee-track.downward');
    initMarquee('.marquee-track.upward');
    
    // Pause animation on hover for better UX
    setupHoverPause();
    
    // Adjust animation speed on window resize
    window.addEventListener('resize', function() {
        adjustAnimationSpeed();
    });
    
    // Initial speed adjustment
    adjustAnimationSpeed();
    
    // Add tooltips to all marquee items
    addTooltips();
});

/**
 * Initialize a marquee track by duplicating its content for seamless scrolling
 * @param {string} selector - CSS selector for the marquee track
 */
function initMarquee(selector) {
    const track = document.querySelector(selector);
    if (!track) return;
    
    const content = track.querySelector('.marquee-content');
    const items = track.querySelectorAll('.marquee-item');
    
    // Clear any existing clones first (in case this is called multiple times)
    const existingClones = track.querySelectorAll('.clone-item');
    existingClones.forEach(clone => clone.remove());
    
    // Clone items to ensure continuous scrolling
    items.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('clone-item');
        content.appendChild(clone);
    });
    
    // Adjust animation duration based on number of items
    adjustAnimationDuration(track);
}

/**
 * Adjust animation duration based on the number of items and track height
 * @param {HTMLElement} track - The marquee track element
 */
function adjustAnimationDuration(track) {
    const content = track.querySelector('.marquee-content');
    const items = content.querySelectorAll('.marquee-item');
    const trackHeight = track.offsetHeight;
    
    // Calculate appropriate duration based on track height and number of items
    // Slower for taller tracks, faster for shorter ones
    const baseDuration = trackHeight / 100 * 2; // 5 seconds per 100px of height
    const totalItems = items.length;
    
    // Set animation duration
    content.style.animationDuration = `${baseDuration + (totalItems * 1.5)}s`;
}

/**
 * Adjust animation speed for all tracks based on viewport size
 */
function adjustAnimationSpeed() {
    const tracks = document.querySelectorAll('.marquee-track');
    
    tracks.forEach(track => {
        adjustAnimationDuration(track);
    });
}

/**
 * Setup hover pause functionality for better user experience
 */
function setupHoverPause() {
    const tracks = document.querySelectorAll('.marquee-track');
    
    tracks.forEach(track => {
        track.addEventListener('mouseenter', () => {
            const content = track.querySelector('.marquee-content');
            content.style.animationPlayState = 'paused';
        });
        
        track.addEventListener('mouseleave', () => {
            const content = track.querySelector('.marquee-content');
            content.style.animationPlayState = 'running';
        });
    });
}

/**
 * Add tooltips to all marquee items
 */
function addTooltips() {
    const items = document.querySelectorAll('.marquee-item');
    
    items.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            // Extract technology name from image src or alt
            let techName = '';
            
            if (img.alt) {
                techName = img.alt;
            } else {
                // Extract from filename
                const src = img.src;
                const filename = src.substring(src.lastIndexOf('/') + 1);
                techName = filename.split('.')[0]; // Remove file extension
                
                // Convert dash/underscore to space and capitalize
                techName = techName
                    .replace(/[-_]/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase());
            }
            
            // Set the tooltip content
            item.setAttribute('data-tooltip', techName);
        }
    });
}
