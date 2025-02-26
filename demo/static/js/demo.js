// Text Extraction Demo
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const resultsContainer = document.querySelector('.results-container');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultsContent = document.querySelector('.results-content');
    const errorState = document.querySelector('.error-state');
    const processTime = document.querySelector('.process-time');
    const fileInfo = document.querySelector('.file-info');
    const fileName = document.querySelector('.file-name');
    const fileMeta = document.querySelector('.file-meta');
    const errorMessage = document.querySelector('.error-message');
    const copyBtn = document.querySelector('.copy-btn');
    const retryBtn = document.querySelector('.retry-btn');
    const pdfPreview = document.getElementById('pdfPreview');
    const sampleButton = document.getElementById('sampleButton');
    const previewSection = document.getElementById('previewSection');

    // Initialize PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    // Configuration
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = {
        'application/pdf': 'PDF',
        'image/jpeg': 'JPEG',
        'image/jpg': 'JPG',
        'image/png': 'PNG'
    };

    // Language names mapping
    const languageNames = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'nl': 'Dutch',
        'pl': 'Polish',
        'ru': 'Russian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh-cn': 'Chinese (Simplified)',
        'zh-tw': 'Chinese (Traditional)',
        'unknown': 'Unknown'
    };

    // Drag and drop handlers
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        uploadArea.classList.add('drag-over');
    }

    function unhighlight() {
        uploadArea.classList.remove('drag-over');
    }

    // Handle file selection
    uploadArea.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFileSelect, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        handleFile(file);
    }

    function handleFileSelect(e) {
        const file = e.target.files[0];
        handleFile(file);
    }

    function validateFile(file) {
        if (!file) {
            throw new Error('No file selected');
        }

        if (file.size > MAX_FILE_SIZE) {
            throw new Error(`File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`);
        }

        if (!ALLOWED_TYPES[file.type]) {
            throw new Error(`File type not supported. Please upload ${Object.values(ALLOWED_TYPES).join(', ')}`);
        }

        return true;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async function handleFile(file) {
        try {
            // Validate file
            validateFile(file);
            
            // Show file info
            fileInfo.style.display = 'block';
            fileName.textContent = file.name;
            fileMeta.textContent = `${formatFileSize(file.size)}`;
            
            // Reset UI state
            resultsContainer.style.display = 'block';
            errorState.hidden = true;
            resultsContent.hidden = true;
            loadingSpinner.style.display = 'flex';
            previewSection.style.display = 'none';

            // Create XMLHttpRequest for progress tracking
            const formData = new FormData();
            formData.append('file', file);

            const startTime = performance.now();

            const response = await fetch('/image-extractor/api/extract', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(response.status === 429 
                    ? 'Rate limit exceeded. Please try again later.' 
                    : 'Error processing file');
            }

            const data = await response.json();
            const endTime = performance.now();
            const timeInSeconds = ((endTime - startTime) / 1000).toFixed(2);
            const wordCount = data.text.trim().split(/\s+/).length;
            const language = languageNames[data.language] || data.language;

            // Update results
            const extractedText = document.querySelector('.extracted-text');
            extractedText.textContent = data.text;
            
            // Add metadata
            fileMeta.textContent = `${formatFileSize(file.size)} • ${language}`;
            
            // Update process time
            processTime.textContent = `Processed in ${timeInSeconds}s • ${wordCount} words`;
            
            // Show preview for PDFs
            if (file.type === 'application/pdf') {
                await loadPdfPreview(URL.createObjectURL(file));
            }

            resultsContent.hidden = false;
        } catch (error) {
            showError(error.message || 'An error occurred while processing the file');
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    async function loadPdfPreview(url) {
        try {
            const loadingTask = pdfjsLib.getDocument(url);
            const pdf = await loadingTask.promise;
            const container = document.querySelector('.pdf-preview-container');
            
            // Clear any existing canvases
            container.innerHTML = '';
            
            // Calculate optimal scale for first page to determine dimensions
            const firstPage = await pdf.getPage(1);
            const viewport = firstPage.getViewport({ scale: 1.0 });
            const containerWidth = Math.min(800, window.innerWidth - 40);
            const scale = containerWidth / viewport.width;
            
            // Set high-quality rendering
            const outputScale = window.devicePixelRatio || 1;
            
            // Render all pages
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const scaledViewport = page.getViewport({ scale });
                
                // Create canvas for this page
                const canvas = document.createElement('canvas');
                canvas.className = 'pdf-preview';
                canvas.style.display = 'block';
                canvas.style.marginBottom = pageNum < pdf.numPages ? '20px' : '0';
                const context = canvas.getContext('2d');
                
                // Set canvas dimensions with high DPI support
                canvas.width = Math.floor(scaledViewport.width * outputScale);
                canvas.height = Math.floor(scaledViewport.height * outputScale);
                canvas.style.width = Math.floor(scaledViewport.width) + "px";
                canvas.style.height = Math.floor(scaledViewport.height) + "px";
                
                // Configure rendering context
                const transform = outputScale !== 1 
                    ? [outputScale, 0, 0, outputScale, 0, 0] 
                    : null;
                
                // Add page number indicator
                const pageIndicator = document.createElement('div');
                pageIndicator.className = 'page-indicator';
                pageIndicator.textContent = `Page ${pageNum} of ${pdf.numPages}`;
                container.appendChild(pageIndicator);
                
                // Add canvas to container
                container.appendChild(canvas);
                
                // Render PDF page
                await page.render({
                    canvasContext: context,
                    viewport: scaledViewport,
                    transform: transform
                }).promise;
            }
            
            // Show preview section after all pages are rendered
            previewSection.style.display = 'block';
        } catch (error) {
            console.error('Error loading PDF preview:', error);
            previewSection.style.display = 'none';
        }
    }

    function updateProgress(percent) {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            progressFill.style.width = `${percent}%`;
            progressText.textContent = `Processing your file... ${Math.round(percent)}%`;
            
            // Add processing animation when upload is complete
            if (percent === 100) {
                progressText.textContent = 'Extracting text...';
            }
        }
    }

    function showError(message) {
        loadingSpinner.style.display = 'none';
        errorState.hidden = false;
        resultsContent.hidden = true;
        errorMessage.textContent = message;
    }

    // Copy button handler
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const extractedText = document.querySelector('.extracted-text');
            navigator.clipboard.writeText(extractedText.textContent)
                .then(() => {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i><span class="font-medium">Copied!</span>';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                })
                .catch(() => {
                    showError('Failed to copy text');
                });
        });
    }

    // Retry button handler
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            resultsContainer.style.display = 'none';
            errorState.hidden = true;
            fileInput.value = '';
        });
    }

    // Sample PDF button handler
    if (sampleButton) {
        sampleButton.addEventListener('click', async () => {
            try {
                // Show loading state
                loadingSpinner.style.display = 'flex';
                resultsContainer.style.display = 'none';
                previewSection.style.display = 'none';

                // Load and preview the sample PDF
                const pdfUrl = window.location.pathname.includes('image-extractor') 
                    ? '/image-extractor/static/sample.pdf'
                    : '/static/sample.pdf';
                
                // Create a File object from the sample PDF
                const response = await fetch(pdfUrl);
                if (!response.ok) {
                    throw new Error('Failed to load sample PDF');
                }
                const blob = await response.blob();
                const file = new File([blob], 'sample.pdf', { type: 'application/pdf' });

                // Process the file
                await handleFile(file);
            } catch (error) {
                console.error('Error processing sample PDF:', error);
                showError('Error processing sample PDF. Please try again.');
            } finally {
                loadingSpinner.style.display = 'none';
            }
        });
    }
});
