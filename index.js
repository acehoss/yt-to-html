"use strict";

import express from 'express';
import ytdl from '@distube/ytdl-core';
import fetch from 'node-fetch';
import xml2js from 'xml2js';
const app = express();
const port = 3001;

// Serve the frontend page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>YouTube Metadata and Captions Extractor</title>
            <style>
                :root {
                    --bg-color: #f5f5f5;
                    --text-color: #333;
                    --card-bg: #fff;
                    --border-color: #ddd;
                    --link-color: #007bff;
                    --code-bg: #f8f9fa;
                    --error-color: #dc3545;
                    --shadow-color: rgba(0,0,0,0.1);
                }

                @media (prefers-color-scheme: dark) {
                    :root[data-theme="system"] {
                        --bg-color: #1a1a1a;
                        --text-color: #e0e0e0;
                        --card-bg: #2d2d2d;
                        --border-color: #404040;
                        --link-color: #66b3ff;
                        --code-bg: #363636;
                        --error-color: #dc3545;
                        --shadow-color: rgba(0,0,0,0.3);
                    }
                }

                :root[data-theme="dark"] {
                    --bg-color: #1a1a1a;
                    --text-color: #e0e0e0;
                    --card-bg: #2d2d2d;
                    --border-color: #404040;
                    --link-color: #66b3ff;
                    --code-bg: #363636;
                    --error-color: #dc3545;
                    --shadow-color: rgba(0,0,0,0.3);
                }

                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 20px auto;
                    padding: 0 20px;
                    line-height: 1.6;
                    background: var(--bg-color);
                    color: var(--text-color);
                }

                .theme-selector {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                .theme-button {
                    padding: 8px;
                    font-size: 18px;
                    background: var(--card-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                    cursor: pointer;
                    color: var(--text-color);
                    opacity: 0.7;
                    transition: all 0.2s ease;
                }

                .theme-button:hover {
                    opacity: 1;
                    transform: scale(1.1);
                }

                .theme-button.active {
                    opacity: 1;
                    border-color: var(--link-color);
                    color: var(--link-color);
                }

                .input-group {
                    margin: 20px 0;
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .input-wrapper {
                    position: relative;
                    flex: 1;
                    min-width: 200px;
                    display: flex;
                    gap: 5px;
                }
                input[type="text"] {
                    padding: 8px;
                    padding-right: 30px;
                    font-size: 16px;
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                    width: 100%;
                    background: var(--card-bg);
                    color: var(--text-color);
                }
                .paste-button {
                    padding: 8px;
                    font-size: 14px;
                    background: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    white-space: nowrap;
                }
                .paste-button:hover {
                    background: #5a6268;
                }
                .clear-button {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: #999;
                    cursor: pointer;
                    padding: 4px;
                    font-size: 18px;
                    line-height: 1;
                }
                .clear-button:hover {
                    color: #666;
                }
                #output {
                    margin-top: 20px;
                }
                .format-group {
                    background: var(--card-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                    padding: 15px;
                    margin: 10px 0;
                    box-shadow: 0 2px 4px var(--shadow-color);
                }
                .format-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 10px;
                }
                .format-label {
                    font-weight: bold;
                    min-width: 100px;
                }
                .url-display {
                    font-family: monospace;
                    background: var(--code-bg);
                    padding: 8px;
                    border-radius: 4px;
                    margin: 5px 0;
                    word-break: break-all;
                }
                .format-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }
                .format-group a {
                    color: var(--link-color);
                    text-decoration: none;
                }
                .format-group a:hover {
                    text-decoration: underline;
                }
                .copy-button {
                    padding: 4px 8px;
                    font-size: 14px;
                    background: #28a745;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .copy-button:hover {
                    background: #218838;
                }
                .copy-feedback {
                    color: #28a745;
                    font-size: 14px;
                    margin-left: 10px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .copy-feedback.visible {
                    opacity: 1;
                }
                .error-message {
                    color: var(--error-color);
                    padding: 15px;
                    background: var(--card-bg);
                    border: 1px solid var(--error-color);
                    border-radius: 4px;
                }
            </style>
        </head>
        <body>
            <div class="theme-selector">
                <button class="theme-button" data-theme="light" title="Light Theme">☀️</button>
                <button class="theme-button" data-theme="dark" title="Dark Theme">🌙</button>
                <button class="theme-button" data-theme="system" title="System Theme">💻</button>
            </div>
            <h1>YouTube Metadata and Captions Extractor</h1>
            <div class="input-group">
                <label for="youtubeUrl">YouTube URL:</label>
                <div class="input-wrapper">
                    <button class="paste-button" id="pasteButton">📋 Paste</button>
                    <input type="text" id="youtubeUrl" placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ">
                    <button class="clear-button" id="clearButton">×</button>
                </div>
            </div>
            <div id="output"></div>
            <script>
                // Theme handling
                function setTheme(theme) {
                    document.documentElement.setAttribute('data-theme', theme);
                    localStorage.setItem('theme', theme);
                    
                    // Update active button
                    document.querySelectorAll('.theme-button').forEach(button => {
                        button.classList.toggle('active', button.dataset.theme === theme);
                    });
                }

                // Initialize theme
                const savedTheme = localStorage.getItem('theme') || 'system';
                setTheme(savedTheme);

                // Theme button listeners
                document.querySelectorAll('.theme-button').forEach(button => {
                    button.addEventListener('click', () => {
                        setTheme(button.dataset.theme);
                    });
                });

                function updateLinks() {
                    const urlInput = document.getElementById('youtubeUrl').value;
                    const videoIdMatch = urlInput.match(/(?:v=|\\/)([0-9A-Za-z_-]{11})/);
                    
                    if (!urlInput.trim()) {
                        document.getElementById('output').innerHTML = '';
                        return;
                    }
                    
                    if (videoIdMatch && videoIdMatch[1]) {
                        const videoId = videoIdMatch[1];
                        const pathSegments = window.location.pathname.split('/').filter(Boolean);
                        const basePath = pathSegments.length > 0 ? '/' + pathSegments.join('/') : '';
                        
                        const formats = [
                            { name: 'Markdown', value: 'markdown' },
                            { name: 'HTML', value: 'html' },
                            { name: 'JSON', value: 'json' }
                        ];
                        
                        const output = formats.map(format => {
                            const link = \`\${window.location.protocol}//\${window.location.host}\${basePath}/getMetadataAndCaptions?videoId=\${videoId}&format=\${format.value}\`;
                            return \`
                                <div class="format-group">
                                    <div class="format-header">
                                        <span class="format-label">\${format.name}:</span>
                                    </div>
                                    <div class="url-display">\${link}</div>
                                    <div class="format-actions">
                                        <a href="\${link}" target="_blank">View</a>
                                        <button class="copy-button" onclick="copyToClipboard('\${link}', this)">Copy URL</button>
                                        <span class="copy-feedback">Copied!</span>
                                    </div>
                                </div>
                            \`;
                        }).join('');
                        
                        document.getElementById('output').innerHTML = output;
                    } else {
                        document.getElementById('output').innerHTML = '<div class="error-message">Invalid YouTube URL. Please enter a valid YouTube video URL.</div>';
                    }
                }

                // Input event listeners
                const urlInput = document.getElementById('youtubeUrl');
                urlInput.addEventListener('input', updateLinks);
                
                // Clear button
                document.getElementById('clearButton').addEventListener('click', () => {
                    urlInput.value = '';
                    updateLinks();
                });
                
                // Paste button
                document.getElementById('pasteButton').addEventListener('click', async () => {
                    try {
                        const text = await navigator.clipboard.readText();
                        urlInput.value = text;
                        updateLinks();
                    } catch (err) {
                        console.error('Failed to read clipboard:', err);
                    }
                });

                function copyToClipboard(text, button) {
                    navigator.clipboard.writeText(text).then(() => {
                        const feedback = button.nextElementSibling;
                        feedback.classList.add('visible');
                        setTimeout(() => {
                            feedback.classList.remove('visible');
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
                }
            </script>
        </body>
        </html>
    `);
});

// Service to get metadata and captions
app.get('/getMetadataAndCaptions', async (req, res) => {
    const videoId = req.query.videoId;
    const format = req.query.format;

    if (!videoId) {
        return res.status(400).json({ error: 'Missing videoId parameter' });
    }

    try {
        const videoURL = `https://www.youtube.com/watch?v=${videoId}`;
        const info = await ytdl.getInfo(videoURL, {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9'
                }
            }
        });
        const metadata = {
            title: info.videoDetails.title || 'Untitled',
            description: (info.videoDetails.description || info.videoDetails.shortDescription || 'No description available.').replace(/\n/g, '<br>'),
            author: info.videoDetails.author?.name || 'Unknown author',
            uploadDate: info.videoDetails.uploadDate || info.videoDetails.publishDate || 'Unknown date',
            views: info.videoDetails.viewCount || '0',
            duration: info.videoDetails.lengthSeconds ? `${Math.floor(info.videoDetails.lengthSeconds / 60)}:${(info.videoDetails.lengthSeconds % 60).toString().padStart(2, '0')}` : 'Unknown duration',
        };

        const captions = info.player_response.captions?.playerCaptionsTracklistRenderer?.captionTracks?.find(
            (track) => track.languageCode === 'en'
        );

        let captionsText = 'No captions available in English.';
        if (captions) {
            const captionsResponse = await fetch(captions.baseUrl);
            const xmlText = await captionsResponse.text();
            
            // Parse the XML using xml2js
            const parser = new xml2js.Parser();
            const result = await parser.parseStringPromise(xmlText);
            
            if (result.transcript && result.transcript.text) {
                captionsText = result.transcript.text
                    .map(text => {
                        const start = parseFloat(text.$.start || 0).toFixed(1);
                        // Normalize whitespace: trim and collapse multiple spaces/newlines
                        const cleanText = (text._ || '').replace(/\s+/g, ' ').trim();
                        return `(${start}s) ${cleanText}`;
                    })
                    .filter(line => line.length > 0)
                    .join('\n');
            }
        }

        if (format === 'markdown') {
            res.setHeader('Content-Type', 'text/markdown');
            res.send(`# ${metadata.title}

**Description:**  
${metadata.description}

**Author:** ${metadata.author}  
**Upload Date:** ${metadata.uploadDate}  
**Views:** ${metadata.views}
**Duration:** ${metadata.duration}

---

## Captions:

${captionsText}`);
        } else if (!format || format === 'html') {
            res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>${metadata.title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        h1 {
            color: #333;
            border-bottom: 2px solid #ddd;
            padding-bottom: 10px;
        }
        .metadata {
            background: #fff;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .captions {
            background: #fff;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            white-space: pre-line;
        }
        .timestamp {
            color: #666;
            font-family: monospace;
        }
        .description {
            white-space: normal;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <h1>${metadata.title}</h1>
    
    <div class="metadata">
        <h2>Description:</h2>
        <div class="description">${metadata.description}</div>
        
        <p><strong>Author:</strong> ${metadata.author}</p>
        <p><strong>Upload Date:</strong> ${metadata.uploadDate}</p>
        <p><strong>Views:</strong> ${metadata.views}</p>
        <p><strong>Duration:</strong> ${metadata.duration}</p>
    </div>

    <div class="captions">
        <h2>Captions:</h2>
        ${captionsText}
    </div>
</body>
</html>`);
        } else {
            res.json({ metadata, captions: captionsText });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch video data' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Web service is running at http://0.0.0.0:${port}`);
});