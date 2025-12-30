// Sample text chunks - Replace with your own!
const textChunks = [
    {
        id: 1,
        title: "Taxi Driver review",
        text: "Taxi Driver is the fevered story of an outsider in New York—a man who can’t find any point of entry into human society. Travis Bickle (Robert De Niro), the protagonist of Martin Scorsese’s new film, from a script by Paul Schrader, can’t find a life."
    },
    {
        id: 2,
        text: " He’s an ex-Marine from the Midwest who takes a job driving a cab nights, because he can’t sleep anyway, and he is surrounded by the night world of the uprooted—whores, pimps, transients. Schrader, who grew up in Michigan, in the Christian Reformed Church, a zealous Calvinist splinter (he didn’t see a movie until he was seventeen), has created a protagonist who is an ascetic not by choice but out of fear. "
    },
    {
        id: 3,
        text: " And Scorsese with his sultry moodiness and his appetite for the pulp sensationalism of forties movies, is just the director to define an American underground man’s resentment. Travis wants to conform, but he can’t find a group pattern to conform to. So he sits and drives in the stupefied languor of anomie."
    },
    {
        id: 4,
        text: "He hates New York with a Biblical fury; it gives off the stench of Hell, and its filth and smut obsess him. He manages to get a date with Betsy (Cybill Shepherd), a political campaigner whose blondness and white clothes represent purity to him, but he is so out of touch that he inadvertently offends her and she won’t have anything more to do with him. "
    },
    {
        id: 5,
        text: "When he fumblingly asks advice from Wizard (Peter Boyle), an older cabdriver, and indicates the pressure building up in him, Wizard doesn’t know what he’s talking about. Travis becomes sick with loneliness and frustration, and then,"
    }
];

class TextReels {
    constructor() {
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.isDragging = false;
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.currentDragY = 0;
        this.minSwipeDistance = 50;
        this.threshold = 100; // Distance needed to trigger page change
        
        this.init();
    }

    init() {
        this.renderReels();
        this.setupEventListeners();
        this.updateProgress();
        this.showSwipeHint();
    }

    renderReels() {
        const container = document.getElementById('reels-container');
        container.innerHTML = '';
        
        textChunks.forEach((chunk, index) => {
            const reelItem = document.createElement('div');
            reelItem.className = 'reel-item';
            if (index === 0) reelItem.classList.add('active');
            
            reelItem.innerHTML = `
                <div class="text-container">
                    ${chunk.title ? `<div class="reel-title">${chunk.title}</div>` : ''}
                    <div class="reel-text">${chunk.text}</div>
                </div>
            `;
            
            container.appendChild(reelItem);
        });
        
        document.getElementById('total-pages').textContent = textChunks.length;
    }

    setupEventListeners() {
        // Touch events
        const container = document.getElementById('reels-container');
        
        container.addEventListener('touchstart', (e) => {
            if (this.isTransitioning) return;
            this.isDragging = true;
            this.touchStartY = e.touches[0].clientY;
            this.currentDragY = 0;
        }, { passive: true });
        
        container.addEventListener('touchmove', (e) => {
            if (!this.isDragging || this.isTransitioning) return;
            
            const currentY = e.touches[0].clientY;
            const deltaY = currentY - this.touchStartY;
            this.currentDragY = deltaY;
            
            // Prevent default scrolling
            e.preventDefault();
            
            // Apply real-time transform
            this.updateDragPosition(deltaY);
        }, { passive: false });
        
        container.addEventListener('touchend', (e) => {
            if (!this.isDragging) return;
            
            this.isDragging = false;
            this.touchEndY = e.changedTouches[0].clientY;
            const finalDelta = this.touchEndY - this.touchStartY;
            
            // Determine if we should change pages or snap back
            if (Math.abs(finalDelta) > this.threshold) {
                if (finalDelta < 0) {
                    // Swiped up enough - go to next
                    this.goToNext();
                } else {
                    // Swiped down enough - go to previous
                    this.goToPrevious();
                }
            } else {
                // Snap back to current page
                this.snapBack();
            }
        }, { passive: true });

        // Mouse events for desktop testing
        let mouseStartY = 0;
        let mouseEndY = 0;
        let isMouseDragging = false;
        
        container.addEventListener('mousedown', (e) => {
            if (this.isTransitioning) return;
            isMouseDragging = true;
            mouseStartY = e.clientY;
            this.currentDragY = 0;
        });
        
        container.addEventListener('mousemove', (e) => {
            if (!isMouseDragging || this.isTransitioning) return;
            const deltaY = e.clientY - mouseStartY;
            this.currentDragY = deltaY;
            this.updateDragPosition(deltaY);
        });
        
        container.addEventListener('mouseup', (e) => {
            if (!isMouseDragging) return;
            isMouseDragging = false;
            mouseEndY = e.clientY;
            const finalDelta = mouseEndY - mouseStartY;
            
            if (Math.abs(finalDelta) > this.threshold) {
                if (finalDelta < 0) {
                    this.goToNext();
                } else {
                    this.goToPrevious();
                }
            } else {
                this.snapBack();
            }
        });

        // Keyboard navigation for testing
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                this.goToNext();
            } else if (e.key === 'ArrowUp') {
                this.goToPrevious();
            }
        });
    }

    updateDragPosition(deltaY) {
        const items = document.querySelectorAll('.reel-item');
        const currentItem = items[this.currentIndex];
        const screenHeight = window.innerHeight;
        
        // Limit drag distance
        const maxDrag = screenHeight * 0.5;
        const clampedDelta = Math.max(-maxDrag, Math.min(maxDrag, deltaY));
        
        // Move current item
        currentItem.style.transform = `translateY(${clampedDelta}px)`;
        currentItem.style.transition = 'none';
        
        // Move next/previous item into view
        if (deltaY < 0 && this.currentIndex < textChunks.length - 1) {
            // Dragging up - show next item below
            const nextItem = items[this.currentIndex + 1];
            nextItem.style.transform = `translateY(${screenHeight + clampedDelta}px)`;
            nextItem.style.transition = 'none';
            nextItem.style.opacity = '1';
        } else if (deltaY > 0 && this.currentIndex > 0) {
            // Dragging down - show previous item above
            const prevItem = items[this.currentIndex - 1];
            prevItem.style.transform = `translateY(${-screenHeight + clampedDelta}px)`;
            prevItem.style.transition = 'none';
            prevItem.style.opacity = '1';
        }
    }

    snapBack() {
        const items = document.querySelectorAll('.reel-item');
        const currentItem = items[this.currentIndex];
        
        // Reset all items with smooth transition
        items.forEach((item, index) => {
            item.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
            
            if (index === this.currentIndex) {
                item.style.transform = 'translateY(0)';
                item.style.opacity = '1';
            } else {
                item.style.transform = '';
                item.style.opacity = '';
            }
        });
        
        // Clean up after animation
        setTimeout(() => {
            items.forEach((item) => {
                item.style.transition = '';
            });
        }, 300);
    }

    goToNext() {
        if (this.isTransitioning || this.currentIndex >= textChunks.length - 1) {
            this.snapBack();
            return;
        }
        
        this.isTransitioning = true;
        const items = document.querySelectorAll('.reel-item');
        
        // Reset all inline styles and use classes
        items.forEach((item) => {
            item.style.transform = '';
            item.style.transition = '';
            item.style.opacity = '';
        });
        
        items[this.currentIndex].classList.remove('active');
        items[this.currentIndex].classList.add('prev');
        
        this.currentIndex++;
        items[this.currentIndex].classList.remove('next');
        items[this.currentIndex].classList.add('active');
        
        this.updateProgress();
        
        setTimeout(() => {
            this.isTransitioning = false;
            items.forEach((item, index) => {
                item.classList.remove('prev', 'next');
            });
        }, 300);
    }

    goToPrevious() {
        if (this.isTransitioning || this.currentIndex <= 0) {
            this.snapBack();
            return;
        }
        
        this.isTransitioning = true;
        const items = document.querySelectorAll('.reel-item');
        
        // Reset all inline styles and use classes
        items.forEach((item) => {
            item.style.transform = '';
            item.style.transition = '';
            item.style.opacity = '';
        });
        
        // Position the previous item above before transitioning
        const prevIndex = this.currentIndex - 1;
        items[prevIndex].style.transform = 'translateY(-100%)';
        items[prevIndex].style.opacity = '0';
        void items[prevIndex].offsetHeight;
        
        items[this.currentIndex].classList.remove('active');
        items[this.currentIndex].classList.add('next');
        
        this.currentIndex--;
        items[this.currentIndex].classList.remove('prev');
        items[this.currentIndex].classList.add('active');
        
        items[this.currentIndex].style.transform = '';
        items[this.currentIndex].style.opacity = '';
        
        this.updateProgress();
        
        setTimeout(() => {
            this.isTransitioning = false;
            items.forEach((item, index) => {
                item.classList.remove('prev', 'next');
                item.style.transform = '';
                item.style.opacity = '';
            });
        }, 300);
    }

    updateProgress() {
        document.getElementById('current-page').textContent = this.currentIndex + 1;
    }

    showSwipeHint() {
        if (textChunks.length <= 1) return;
        
        const hint = document.createElement('div');
        hint.className = 'swipe-hint';
        hint.textContent = '↑ Swipe up';
        document.getElementById('app').appendChild(hint);
        
        setTimeout(() => {
            hint.remove();
        }, 5000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TextReels();
});

// Prevent pull-to-refresh on mobile
let lastTouchY = 0;
document.addEventListener('touchstart', (e) => {
    lastTouchY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const touchYDelta = touchY - lastTouchY;
    lastTouchY = touchY;
    
    if (touchYDelta > 0 && window.scrollY === 0) {
        e.preventDefault();
    }
}, { passive: false });

