# Text Extraction Demo

This demo showcases a Python-based text extraction tool that can process both images and PDFs. It uses EasyOCR for image text extraction and PyMuPDF for PDF processing.

⚠️ Note: This is an experimental demo. PDF extraction may be unreliable, especially for documents containing images.

## Features

- Supports PDF and image files (JPG, PNG)
- Drag and drop file upload
- Real-time text extraction
- Copy extracted text to clipboard
- Progress tracking
- Rate limiting for API protection
- File size validation (max 16MB)
- Automatic file cleanup after processing
- Language detection for extracted text

## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/aldinhro/image-pdf-text-extractor.git
cd image-pdf-text-extractor
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the Flask development server:
```bash
python server.py
```

5. Open your browser and navigate to:
```
http://localhost:5000
```

## Production Deployment

### Prerequisites
- Python 3.x
- Nginx
- Supervisor
- Git

### Server Setup

1. Clone the repository:
```bash
cd ~
git clone https://github.com/aldinhro/image-pdf-text-extractor.git text-extraction-api
cd text-extraction-api
```

2. Create virtual environment and install dependencies:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. Configure Nginx:
```nginx
server {
    listen 80;
    server_name your_domain;
    client_max_body_size 16M;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

4. Configure Supervisor:
```ini
[program:text-extraction]
directory=/home/username/text-extraction-api
command=/home/username/text-extraction-api/venv/bin/gunicorn -w 2 -b 127.0.0.1:5000 server:app
user=username
autostart=true
autorestart=true
```

5. Create deployment script:
```bash
#!/bin/bash
echo "Starting deployment..."
cd ~/text-extraction-api
git pull origin master
sudo supervisorctl restart text-extraction
echo "Deployment completed!"
```

Run it on the VPS/VM:
~/deploy.sh

### Monitoring

- Application logs: `/var/log/supervisor/text-extraction.err.log`
- Nginx access logs: `/var/log/nginx/text-extraction-access.log`
- Check status: `sudo supervisorctl status text-extraction`

## Tech Stack

- Flask: Web framework
- EasyOCR: Image text extraction
- PyMuPDF: PDF processing
- Gunicorn: WSGI HTTP Server
- Nginx: Reverse proxy
- Supervisor: Process management
- Redis: Rate limiting

## API Usage

### Extract Text
Endpoint to extract text from PDF or image files.

```
POST /api/extract
```

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Max file size: 16MB
- Supported formats: PDF, JPG, PNG

**cURL Example:**
```bash
# Linux/Mac
curl -X POST -F "file=@/path/to/your/document.pdf" http://your-domain/api/extract

# Windows PowerShell (use curl.exe)
curl.exe -X POST -F "file=@document.pdf" http://your-domain/api/extract

# Alternative PowerShell method
$form = @{
    file = Get-Item -Path "document.pdf"
}
Invoke-RestMethod -Uri "http://your-domain/api/extract" -Method Post -Form $form
```

**Python Example:**
```python
import requests

def extract_text(file_path):
    url = 'http://your-domain/api/extract'
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        response = requests.post(url, files=files)
    
    if response.status_code == 200:
        result = response.json()
        print(f"Extracted Text: {result['text']}")
        print(f"Language: {result['language']}")
        print(f"Processing Time: {result['processing_time']}s")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

# Usage
extract_text('document.pdf')
```

**Response Format:**
```json
{
    "text": "Extracted text content...",
    "language": "en",
    "processing_time": 1.23,
    "filename": "document.pdf"
}
```

**Rate Limits:**
- 200 requests per day
- 50 requests per hour
- 30 requests per minute

**Error Responses:**
- 400: Invalid file type or no file provided
- 413: File too large (>16MB)
- 429: Rate limit exceeded
- 500: Server error during processing
