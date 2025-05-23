<<<<<<< HEAD
// index.js

// Authentication Form Handling
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const loginFormSection = document.getElementById('login-form-section');
const registerFormSection = document.getElementById('register-form-section');
const authErrorDiv = document.getElementById('auth-error');
const authContainer = document.getElementById('auth-container');
const mainContent = document.getElementById('main-content');

// Function to show error message in auth form
function showAuthError(message) {
    authErrorDiv.textContent = message;
}

// Function to clear auth error message
function clearAuthError() {
    authErrorDiv.textContent = '';
}

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAuthError();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    await window.login(email, password);
});

// Register form submission
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAuthError();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
        showAuthError('Passwords do not match');
        return;
    }

    await window.register(email, password);
});

// Show register form
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    clearAuthError();
    loginFormSection.style.display = 'none';
    registerFormSection.style.display = 'block';
});

// Show login form
showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    clearAuthError();
    registerFormSection.style.display = 'none';
    loginFormSection.style.display = 'block';
});

// DOM Elements
const generateImageForm = document.getElementById('image-form');
const formInput = document.getElementById('input-value');
const imageContainerText = document.getElementById('imageContainerText');
const imageGenerated = document.getElementById('generated-image');
const imageContainer = document.getElementById('images-visible');
const loadingSpinner = document.getElementById('loading-spinner');
const suggestionChips = document.querySelectorAll('.chip');
const downloadBtn = document.querySelector('.download-btn');

// API Configuration
// The frontend will now call our backend endpoint, which uses the API key securely.
const GENERATE_ENDPOINT_URL = '/api/generate'; // Endpoint on your server

// Show loading state
function showLoading() {
    loadingSpinner.style.display = 'flex';
    imageContainer.style.display = 'block';
    imageContainerText.innerText = 'Creating your masterpiece...';
    imageGenerated.style.display = 'none';
    imageContainer.classList.add('visible');
    // Remove existing retry button if any
    const existingRetryButton = imageContainer.querySelector('.retry-btn');
    if (existingRetryButton) {
        existingRetryButton.remove();
    }
}

// Hide loading state
function hideLoading() {
    loadingSpinner.style.display = 'none';
    // imageGenerated.style.display = 'block'; // Image display is handled after loading
    imageContainer.classList.add('visible');
}

// Show error message with retry button
function showError(message) {
    imageContainerText.innerText = message;
    imageContainer.style.display = 'block';
    loadingSpinner.style.display = 'none';
    imageGenerated.style.display = 'none';
    imageContainer.classList.add('visible');
    
    // Add retry button
    const retryButton = document.createElement('button');
    retryButton.className = 'retry-btn';
    retryButton.innerHTML = '<i class="fas fa-redo"></i> Try Again';
    retryButton.onclick = () => {
        const prompt = formInput.value.trim();
        if (prompt) {
            generateImage(prompt);
        }
    };
    // Prevent adding multiple retry buttons
    const existingRetryButton = imageContainer.querySelector('.retry-btn');
    if (!existingRetryButton) {
        imageContainer.appendChild(retryButton);
    }
}

// Generate image using our server endpoint
async function generateImage(prompt) {
    try {
        showLoading();
        
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate image');
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        imageContainerText.innerText = 'Here\'s your AI-generated image:';
        imageGenerated.src = imageUrl;
        imageGenerated.style.display = 'block';
        hideLoading();

        // Clean up the object URL when the image is no longer needed
        imageGenerated.onload = () => {
            // URL.revokeObjectURL(imageUrl); // Uncomment if you want to revoke the URL after loading
        };

    } catch (err) {
        console.error('Error:', err);
        showError('Failed to generate image. Please try again.');
    }
}

// Form submission handler
generateImageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const prompt = formInput.value.trim();
    if (!prompt) {
        showError('Please enter a description for your image');
        return;
    }
    generateImage(prompt);
});

// Suggestion chips click handler
suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
        formInput.value = chip.textContent;
        // Optionally trigger image generation immediately on chip click
        // generateImage(chip.textContent);
    });
});

// Download button handler
downloadBtn.addEventListener('click', async () => {
    try {
        // Check if the current src is a blob URL created by URL.createObjectURL
        if (!imageGenerated.src || !imageGenerated.src.startsWith('blob:')) {
             showError('No image available to download');
            return;
        }
        
        // For blob URLs, create a temporary link to download
        const a = document.createElement('a');
        a.href = imageGenerated.src;
        a.download = `ai-generated-image-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    } catch (error) {
        console.error('Error downloading image:', error);
        showError('Failed to download image. Please try again.');
    }
});

// Add input animation
formInput.addEventListener('focus', () => {
    formInput.parentElement.classList.add('focused');
});

formInput.addEventListener('blur', () => {
    formInput.parentElement.classList.remove('focused');
});

// Add image load error handling
imageGenerated.addEventListener('error', () => {
    showError('Failed to load the image. Please try again.');
});
=======
// index.js

// DOM Elements
const generateImageForm = document.getElementById('image-form');
const formInput = document.getElementById('input-value');
const imageContainerText = document.getElementById('imageContainerText');
const imageGenerated = document.getElementById('generated-image');
const imageContainer = document.getElementById('images-visible');
const loadingSpinner = document.getElementById('loading-spinner');
const suggestionChips = document.querySelectorAll('.chip');
const downloadBtn = document.querySelector('.download-btn');

// API Configuration
const API_KEY = 'YOURS';
const API_URL = 'YOURS';

// Show loading state
function showLoading() {
    loadingSpinner.style.display = 'flex';
    imageContainer.style.display = 'block';
    imageContainerText.innerText = 'Creating your masterpiece...';
    imageGenerated.style.display = 'none';
}

// Hide loading state
function hideLoading() {
    loadingSpinner.style.display = 'none';
    imageGenerated.style.display = 'block';
}

// Show error message with retry button
function showError(message) {
    imageContainerText.innerText = message;
    imageContainer.style.display = 'block';
    loadingSpinner.style.display = 'none';
    imageGenerated.style.display = 'none';
    
    // Add retry button for certain errors
    if (message.includes('balance') || message.includes('rate limit')) {
        const retryButton = document.createElement('button');
        retryButton.className = 'retry-btn';
        retryButton.innerHTML = '<i class="fas fa-redo"></i> Try Again';
        retryButton.onclick = () => {
            const prompt = formInput.value.trim();
            if (prompt) {
                generateImage(prompt);
            }
        };
        imageContainer.appendChild(retryButton);
    }
}

// Generate image using Stability AI
async function generateImage(prompt) {
    try {
        showLoading();
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                text_prompts: [{ text: prompt }],
                cfg_scale: 7,
                height: 768,
                width: 768,
                steps: 30,
                samples: 1
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            
            // Handle specific error cases
            if (errorData.message && errorData.message.includes('balance')) {
                showError('API balance is insufficient. Please try again later or contact support.');
            } else if (errorData.message && errorData.message.includes('rate limit')) {
                showError('Rate limit exceeded. Please wait a moment before trying again.');
            } else if (errorData.message && errorData.message.includes('invalid')) {
                showError('Invalid API key or request. Please check your configuration.');
            } else {
                throw new Error(errorData.message || 'Failed to generate image');
            }
            return;
        }

        const result = await response.json();
        
        if (!result.artifacts || !result.artifacts[0]) {
            throw new Error('No image was generated');
        }

        const image = result.artifacts[0].base64;
        imageContainerText.innerText = 'Here\'s your AI-generated image:';
        imageGenerated.src = `data:image/png;base64,${image}`;
        hideLoading();

    } catch (err) {
        console.error('Error:', err);
        let errorMessage = 'Something went wrong. Please try again later.';
        
        // Handle specific error cases
        if (err.message.includes('balance')) {
            errorMessage = 'API balance is insufficient. Please try again later or contact support.';
        } else if (err.message.includes('rate limit')) {
            errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
        } else if (err.message.includes('invalid')) {
            errorMessage = 'Invalid API key or request. Please check your configuration.';
        }
        
        showError(errorMessage);
    }
}

// Form submission handler
generateImageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const prompt = formInput.value.trim();
    if (!prompt) {
        showError('Please enter a description for your image');
        return;
    }
    generateImage(prompt);
});

// Suggestion chips click handler
suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
        formInput.value = chip.textContent;
        generateImage(chip.textContent);
    });
});

// Download button handler
downloadBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(imageGenerated.src);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-generated-image-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error downloading image:', error);
        showError('Failed to download image. Please try again.');
    }
});

// Add input animation
formInput.addEventListener('focus', () => {
    formInput.parentElement.classList.add('focused');
});

formInput.addEventListener('blur', () => {
    formInput.parentElement.classList.remove('focused');
});

// Add image load error handling
imageGenerated.addEventListener('error', () => {
    showError('Failed to load the image. Please try again.');
});
>>>>>>> f94b7f6decff784624f0eadfce621656bc8007d0
