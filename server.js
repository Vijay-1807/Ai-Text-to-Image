require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Make sure node-fetch is installed (npm install node-fetch)
const path = require('path');
const FormData = require('form-data'); // Make sure form-data is installed (npm install form-data)
const app = express();
const port = process.env.PORT || 3000;

// Clipdrop API Configuration (Hardcoded - Consider using .env for production)
const CLIPDROP_API_KEY = 'YOUR_API';
const CLIPDROP_API_URL = 'https://clipdrop-api.co/text-to-image/v1';

// Middleware
app.use(cors());
// Use express.json() to parse JSON bodies for API requests
app.use(express.json());
// Serve static files from current directory - place after API middleware
app.use(express.static(path.join(__dirname)));

// Start generation endpoint for Clipdrop
app.post('/api/generate', async (req, res) => {
    try {
        // Prompt is expected in the JSON body
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Clipdrop API expects 'prompt' as form-data, so create FormData
        const formData = new FormData();
        formData.append('prompt', prompt);

        const response = await fetch(CLIPDROP_API_URL, {
            method: 'POST',
            headers: {
                'x-api-key': CLIPDROP_API_KEY,
                 // fetch with FormData sets the Content-Type automatically to multipart/form-data
            },
            body: formData
        });

        if (!response.ok) {
            // Clipdrop returns JSON for errors
            const errorData = await response.json();
            console.error('Clipdrop API Error:', errorData);
            return res.status(response.status).json(errorData);
        }

        // Clipdrop returns the image data directly on success
        // Set the appropriate content type for the image
        res.setHeader('Content-Type', response.headers.get('Content-Type'));
        // Pipe the image data from the Clipdrop response to the client response
        response.body.pipe(res);

    } catch (error) {
        console.error('Server generation error:', error);
        res.status(500).json({ 
            error: 'Something went wrong on the server. Please try again later.',
            // Include details in development environment
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(port, () => {
    console.log('Server configuration:', {
        port,
        environment: process.env.NODE_ENV || 'development',
        clipdropApiUrl: CLIPDROP_API_URL
    });
    console.log(`Server running at http://localhost:${port}`);
    console.log('Ready to generate images using Clipdrop!');
});

require('dotenv').config();
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Debug logging (remove in production)
console.log('Environment variables loaded:', {
    token: process.env.REPLICATE_API_TOKEN ? 'Token is set' : 'Token is missing',
    port: process.env.PORT || 'Using default port 3000'
});

// Environment variable validation
if (!process.env.REPLICATE_API_TOKEN) {
    console.error('Error: REPLICATE_API_TOKEN is not set in environment variables');
    console.error('Please create a .env file in the project root with:');
    console.error('REPLICATE_API_TOKEN= "YOURS-API"');
    console.error('PORT=3000');
    console.error('NODE_ENV=development');
    process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files from current directory

// Replicate API Configuration
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_API_URL = 'https://api.........YOURS';

// Cache for storing generation status
const generationCache = new Map();

// Start generation endpoint
app.post('/api/generate', async (req, res) => {
    try {
        console.log('Received generation request:', {
            prompt: req.body.input?.prompt,
            version: req.body.version
        });

        if (!req.body.input || !req.body.input.prompt) {
            console.error('Missing prompt in request');
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const response = await fetch(REPLICATE_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(errorData.detail || 'Failed to start generation');
        }

        const data = await response.json();
        console.log('Generation started:', { id: data.id });
        
        // Store initial status in cache
        generationCache.set(data.id, {
            status: 'starting',
            output: null,
            error: null
        });

        res.json(data);
    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({ 
            error: 'Something went wrong. Please try again later.',
            details: error.message 
        });
    }
});

// Check status endpoint
app.get('/api/status/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            console.error('Missing prediction ID in status check');
            return res.status(400).json({ error: 'Prediction ID is required' });
        }

        console.log('Checking status for:', req.params.id);

        const cachedStatus = generationCache.get(req.params.id);
        
        if (cachedStatus && cachedStatus.status !== 'starting') {
            console.log('Returning cached status:', cachedStatus.status);
            return res.json(cachedStatus);
        }

        const response = await fetch(`${REPLICATE_API_URL}/${req.params.id}`, {
            headers: {
                'Authorization': `Token ${REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Status check API error:', errorData);
            throw new Error(errorData.detail || 'Failed to check status');
        }

        const data = await response.json();
        console.log('Status update:', { 
            id: req.params.id, 
            status: data.status 
        });
        
        // Update cache with new status
        generationCache.set(req.params.id, {
            status: data.status,
            output: data.output,
            error: data.error
        });

        // Clean up cache if generation is complete
        if (data.status === 'succeeded' || data.status === 'failed') {
            setTimeout(() => {
                generationCache.delete(req.params.id);
                console.log('Cleaned up cache for:', req.params.id);
            }, 60000);
        }

        res.json(data);
    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({ 
            error: 'Something went wrong. Please try again later.',
            details: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(port, () => {
    console.log('Server configuration:', {
        port,
        environment: process.env.NODE_ENV || 'development',
        apiUrl: REPLICATE_API_URL
    });
    console.log(`Server running at http://localhost:${port}`);
    console.log('Ready to generate images!');
});

