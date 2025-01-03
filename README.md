# YouTube Metadata and Captions Extractor

A simple web service that extracts metadata and captions from YouTube videos, with support for multiple output formats. Serves an index page with a form to input a YouTube URL.

This tool was created to allow ChatGPT to "see" YouTube videos. ChatGPT's web tool can't access YouTube videos directly. Also note that ChatGPT's web tool can only access pages with a `text/html` content type, so if you're planning to ask ChatGPT to browse to the URL, use HTML. Alternatively, you can grab the markdown and paste it into ChatGPT. This is sometimes more reliable.

You would, of course, need to deploy this service to a server that can be accessed by ChatGPT.

*Use in ChatGPT*
![Use in ChatGPT](chatgpt.png)

*Link Generator*
![Link Generator](generator.png)

*HTML Output*
![HTML Output](html-output.png)

## Features

- 🎯 Extract video metadata and captions from any YouTube video
- 📝 Multiple output formats:
  - HTML (styled, default)
  - Markdown
  - JSON
- 🎨 UI with:
  - Live URL validation
  - One-click clipboard operations

## Metadata Extracted

- Title
- Description
- Author
- Upload Date
- View Count
- Duration
- Captions (English)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/acehoss/yt-to-html.git
   cd yt-to-html
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node index.js
   ```

The service will be available at `http://localhost:3001`

## Usage

1. Open the web interface in your browser
2. Paste a YouTube URL (supports various formats)
3. Get instant access to three format options:
   - HTML: Slightly styled presentation (default)
   - Markdown: Great for documentation
   - JSON: Perfect for API integration

### API Endpoints

#### GET /getMetadataAndCaptions

Extracts metadata and captions from a YouTube video.

Parameters:
- `videoId` (required): YouTube video ID
- `format` (optional): Output format (`markdown`, `html`, or `json`, defaults to `html`)

Example:
```bash
curl "http://localhost:3001/getMetadataAndCaptions?videoId=dQw4w9WgXcQ"  # Returns HTML by default
curl "http://localhost:3001/getMetadataAndCaptions?videoId=dQw4w9WgXcQ&format=markdown"  # Returns markdown
```

## Nginx Configuration

To serve behind a reverse proxy, use this Nginx configuration:

```nginx
location /yt/ {
    rewrite ^/yt/(.*) /$1 break;
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Development

The project uses:
- Express.js for the web server
- @distube/ytdl-core for YouTube interaction
- xml2js for caption parsing

To modify the theme, edit the CSS variables in `index.js`.

## License

MIT License

## Contributing

I'd probably accept a PR if you want to add a feature.