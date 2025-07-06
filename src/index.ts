import express, { Request, Response, NextFunction } from 'express';
import { Innertube } from 'youtubei.js';

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Serve the frontend page
app.get('/', (req: Request, res: Response) => {
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
                .fetch-button {
                    padding: 4px 8px;
                    font-size: 14px;
                    background: #17a2b8;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .fetch-button:hover {
                    background: #138496;
                }
                .fetch-button:disabled {
                    background: #6c757d;
                    cursor: not-allowed;
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
                
                /* Modal styles */
                .modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 1000;
                }
                .modal.visible {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal-content {
                    background: var(--card-bg);
                    color: var(--text-color);
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                }
                .modal-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    padding: 4px 12px;
                    background: #28a745;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.2s;
                }
                .modal-button:hover {
                    background: #218838;
                }
                .modal pre {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    margin-top: 30px;
                }
            </style>
        </head>
        <body>
            <div class="theme-selector">
                <button class="theme-button" data-theme="light" title="Light Theme">☀️</button>
                <button class="theme-button" data-theme="dark" title="Dark Theme">🌙</button>
                <button class="theme-button" data-theme="system" title="System Theme">💻</button>
            </div>
            
            <!-- Add modal dialog -->
            <div class="modal" id="contentModal">
                <div class="modal-content">
                    <button class="modal-button" onclick="copyAndClose()">Copy & Close</button>
                    <pre id="modalContent"></pre>
                </div>
            </div>

            <h1>YouTube Metadata and Captions Extractor</h1>
            <div class="input-group">
                <label for="youtubeUrl">YouTube URL:</label>
                <div class="input-wrapper">
                    <button class="paste-button" id="pasteButton" title="Paste (Ctrl+V)">📋 Paste</button>
                    <input type="text" id="youtubeUrl" placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ" autofocus>
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
                                        <button class="fetch-button" onclick="fetchAndCopy('\${link}', this)">Fetch & Copy</button>
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

                // Paste handling
                async function pasteFromClipboard() {
                    try {
                        const text = await navigator.clipboard.readText();
                        const urlInput = document.getElementById('youtubeUrl');
                        urlInput.value = text;
                        updateLinks();
                        // Focus and select the input after pasting
                        urlInput.focus();
                        urlInput.select();
                    } catch (err) {
                        console.error('Failed to read clipboard:', err);
                    }
                }

                // Input event listeners
                const urlInput = document.getElementById('youtubeUrl');
                urlInput.addEventListener('input', updateLinks);
                
                // Clear button
                document.getElementById('clearButton').addEventListener('click', () => {
                    urlInput.value = '';
                    updateLinks();
                    urlInput.focus();
                });
                
                // Paste button
                document.getElementById('pasteButton').addEventListener('click', pasteFromClipboard);

                // Global keyboard shortcut for paste
                document.addEventListener('keydown', (e) => {
                    // Check if Ctrl+V or Cmd+V is pressed
                    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                        // Only handle if we're not in an input field (browser will handle those)
                        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                            e.preventDefault();
                            pasteFromClipboard();
                        }
                    }
                });

                async function copyToClipboard(text, button) {
                    try {
                        await navigator.clipboard.writeText(text);
                        showCopyFeedback(button);
                    } catch (err) {
                        console.error('Failed to copy text: ', err);
                    }
                }

                async function fetchAndCopy(url, button) {
                    try {
                        // Disable the button and show loading state
                        button.disabled = true;
                        button.textContent = 'Fetching...';
                        
                        // Fetch the content
                        const response = await fetch(url);
                        const content = await response.text();
                        
                        // Show content in modal
                        const modalContent = document.getElementById('modalContent');
                        modalContent.textContent = content;
                        document.getElementById('contentModal').classList.add('visible');
                        
                        // Reset button
                        button.disabled = false;
                        button.textContent = 'Fetch & Copy';
                    } catch (err) {
                        console.error('Failed to fetch:', err);
                        button.textContent = 'Error';
                        setTimeout(() => {
                            button.disabled = false;
                            button.textContent = 'Fetch & Copy';
                        }, 2000);
                    }
                }
                
                function showCopyFeedback(button) {
                    const feedback = button.nextElementSibling;
                    feedback.classList.add('visible');
                    setTimeout(() => {
                        feedback.classList.remove('visible');
                    }, 2000);
                }

                function closeModal() {
                    document.getElementById('contentModal').classList.remove('visible');
                }

                function copyAndClose() {
                    const content = document.getElementById('modalContent').textContent;
                    const textarea = document.createElement('textarea');
                    textarea.value = content;
                    document.body.appendChild(textarea);
                    textarea.select();
                    
                    try {
                        document.execCommand('copy');
                        const copyButton = document.querySelector('.modal-button');
                        copyButton.textContent = 'Copied!';
                        
                        // Close the modal after 500ms
                        setTimeout(() => {
                            closeModal();
                            // Reset button text after modal is closed
                            setTimeout(() => {
                                copyButton.textContent = 'Copy';
                            }, 100);
                        }, 500);
                    } catch (err) {
                        console.error('Failed to copy:', err);
                        copyButton.textContent = 'Error';
                        setTimeout(() => {
                            copyButton.textContent = 'Copy';
                        }, 2000);
                    } finally {
                        document.body.removeChild(textarea);
                    }
                }

                // Close modal when clicking outside
                document.getElementById('contentModal').addEventListener('click', (e) => {
                    if (e.target.id === 'contentModal') {
                        closeModal();
                    }
                });

                // Close modal with Escape key
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        closeModal();
                    }
                });

                // Focus input field on page load
                document.addEventListener('DOMContentLoaded', () => {
                    document.getElementById('youtubeUrl').focus();
                });
            </script>
        </body>
        </html>
    `);
});

// Helper function to format seconds to HH:MM:SS
function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Service to get metadata and captions
app.get('/getMetadataAndCaptions', async (req: Request, res: Response): Promise<void> => {
    const videoId = req.query.videoId as string;
    const format = req.query.format as string;

    if (!videoId) {
        res.status(400).json({ error: 'Missing videoId parameter' });
        return;
    }

    try {
        // Initialize YouTube.js client
        const yt = await Innertube.create({ 
            generate_session_locally: true 
        });

        // Get video info
        const info = await yt.getInfo(videoId);
        
        // Extract basic metadata
        const metadata = {
            title: info.basic_info.title || 'Untitled',
            description: info.basic_info.short_description || 'No description available.',
            author: info.basic_info.author || 'Unknown author',
            uploadDate: info.primary_info?.published?.text || 'Unknown date',
            views: info.basic_info.view_count?.toString() || '0',
            duration: info.basic_info.duration ? formatTime(info.basic_info.duration) : 'Unknown duration',
        };

        // Format description for HTML
        const htmlDescription = metadata.description.replace(/\n/g, '<br>');

        // Get transcript
        let captionsText = 'No captions available.';
        try {
            const transcriptInfo = await info.getTranscript();
            
            if (transcriptInfo && transcriptInfo.transcript?.content?.body?.initial_segments) {
                const segments = transcriptInfo.transcript.content.body.initial_segments;
                
                captionsText = segments
                    .map((segment: any) => {
                        const startTime = segment.start_ms ? (segment.start_ms / 1000).toFixed(1) : '0.0';
                        const text = segment.snippet?.text || '';
                        return `(${startTime}s) ${text}`;
                    })
                    .filter((line: string) => line.length > 0)
                    .join('\n');
            }
        } catch (transcriptError) {
            console.error('Failed to fetch transcript:', transcriptError);
            captionsText = 'No captions available or captions are disabled for this video.';
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
        <div class="description">${htmlDescription}</div>
        
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
        console.error('Error fetching video data:', error);
        res.status(500).json({ 
            error: 'Failed to fetch video data',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Web service is running at http://0.0.0.0:${port}`);
});