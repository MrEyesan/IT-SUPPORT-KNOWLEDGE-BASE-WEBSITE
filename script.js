document.addEventListener('DOMContentLoaded', () => {
    // Element references
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentSections = document.querySelectorAll('.content-section');
    const searchInput = document.getElementById('searchInput');
    const sidebarNav = document.getElementById('sidebarNav');

    // Mobile menu elements (if you add mobile toggle later)
    let mobileMenuToggle = null;
    let sidebar = null;
    let sidebarOverlay = null;

    // Initialize mobile elements if they exist
    const initializeMobileElements = () => {
        mobileMenuToggle = document.getElementById('mobileMenuToggle');
        sidebar = document.querySelector('aside');
        sidebarOverlay = document.getElementById('sidebarOverlay');
    };

    // Function to handle content display
    const showContent = (id) => {
        // Hide all content sections
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Show the target section
        const sectionToShow = document.querySelector(id);
        if (sectionToShow) {
            sectionToShow.classList.add('active');
            sectionToShow.scrollTop = 0; // Reset scroll position
            
            // Update page title
            const sectionTitle = sectionToShow.querySelector('h1, h2');
            if (sectionTitle) {
                document.title = `${sectionTitle.textContent} - IT Knowledge Base`;
            }
        }
    };

    // Function to update active link
    const updateActiveLink = (targetLink) => {
        sidebarLinks.forEach(link => link.classList.remove('active'));
        if (targetLink) {
            targetLink.classList.add('active');
        }
    };

    // Function to close mobile menu
    const closeMobileMenu = () => {
        if (sidebar && sidebarOverlay) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
    };

    // Event listener for sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            // Update URL without page reload
            history.pushState(null, '', targetId);
            
            // Show content and update active link
            showContent(targetId);
            updateActiveLink(link);
            
            // Close mobile menu if open
            closeMobileMenu();
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const currentHash = window.location.hash || '#welcome-message';
        showContent(currentHash);
        
        const currentLink = document.querySelector(`.sidebar-link[href="${currentHash}"]`);
        updateActiveLink(currentLink);
    });

    // Initial content load based on URL hash
    const initialHash = window.location.hash || '#welcome-message';
    showContent(initialHash);
    const initialLink = document.querySelector(`.sidebar-link[href="${initialHash}"]`);
    updateActiveLink(initialLink);

    // Enhanced search functionality
    let searchTimeout = null;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        // Debounce search for better performance
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 150);
    });

    // Search function
    const performSearch = (query) => {
        const items = sidebarNav.querySelectorAll('li');
        let visibleCount = 0;

        items.forEach(item => {
            const link = item.querySelector('.sidebar-link');
            if (!link) return;

            const text = link.textContent.toLowerCase();
            const isVisible = query === '' || text.includes(query);
            
            item.style.display = isVisible ? '' : 'none';
            if (isVisible) visibleCount++;
        });

        // Show "no results" message if needed
        showNoResultsMessage(visibleCount === 0 && query !== '');
    };

    // Function to show/hide no results message
    const showNoResultsMessage = (show) => {
        let noResultsMsg = document.getElementById('noResultsMessage');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('li');
            noResultsMsg.id = 'noResultsMessage';
            noResultsMsg.className = 'p-3 text-gray-500 text-sm italic';
            noResultsMsg.textContent = 'No matching topics found';
            sidebarNav.appendChild(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    };

    // Clear search function
    const clearSearch = () => {
        searchInput.value = '';
        performSearch('');
    };

    // Add escape key to clear search
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            clearSearch();
        }
    });

    // Mobile menu toggle functionality (for future implementation)
    const initializeMobileMenu = () => {
        initializeMobileElements();
        
        if (mobileMenuToggle && sidebar && sidebarOverlay) {
            mobileMenuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                sidebarOverlay.classList.toggle('active');
            });

            sidebarOverlay.addEventListener('click', closeMobileMenu);
        }
    };

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Alt + S to focus search
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Escape to clear search or close mobile menu
        if (e.key === 'Escape') {
            if (searchInput.value) {
                clearSearch();
            } else {
                closeMobileMenu();
            }
        }
    });

    // Print functionality
    const addPrintStyles = () => {
        const printButton = document.getElementById('printButton');
        if (printButton) {
            printButton.addEventListener('click', () => {
                window.print();
            });
        }
    };

    // Smooth scrolling for anchor links within content
    const handleAnchorLinks = () => {
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
                const targetId = e.target.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement && targetElement.closest('.content-section.active')) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    };

    // Performance optimization: Intersection Observer for lazy loading
    const observeContentSections = () => {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('loaded');
                    }
                });
            });

            contentSections.forEach(section => {
                observer.observe(section);
            });
        }
    };

    // Initialize all functionality
    const initialize = () => {
        initializeMobileMenu();
        addPrintStyles();
        handleAnchorLinks();
        observeContentSections();
        
        console.log('IT Knowledge Base initialized successfully');
    };

    // Call initialize function
    initialize();
});

// Utility functions
const utils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Format date for consistency
    formatDate: (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },

    // Copy to clipboard functionality
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    }
};

// Export utils for global access if needed
window.KnowledgeBaseUtils = utils;
