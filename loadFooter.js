// loadFooter.js
document.addEventListener('DOMContentLoaded', () => {
    const loadFooter = async () => {
        try {
            const response = await fetch('footer.html');
            if (response.ok) {
                const footerHTML = await response.text();
            } else {
                console.error('Failed to load footer:', response.status);
            }
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    };

    loadFooter();
});
