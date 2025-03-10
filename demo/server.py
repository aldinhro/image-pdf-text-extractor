from flask import Flask, request, jsonify, send_from_directory, Blueprint
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.utils import secure_filename
import os
import time
import gc

from api.extract import process_pdf, process_image, detect_language
from api.utils import allowed_file, save_upload_file, cleanup_file
from config import Config

app = Flask(__name__, static_folder='static')
CORS(app)  # Enable CORS for development

# Load configuration
app.config.from_object(Config)

# Create blueprint for the application
bp = Blueprint('image_extractor', __name__, url_prefix='/image-extractor', static_folder='static')
# Configure rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=Config.RATELIMIT_DEFAULT_LIMITS
)

# Custom error handler for rate limiting
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": "Too many requests. Please try again later."}), 429

# Configure upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def process_file(file):
    """Process uploaded file and extract text."""
    filename = secure_filename(file.filename)
    temp_path = save_upload_file(file, UPLOAD_FOLDER)
    
    try:
        start_time = time.time()
        
        # Process based on file type
        if filename.lower().endswith('.pdf'):
            try:
                app.logger.info(f"Processing PDF file: {filename}")
                text = process_pdf(temp_path)
                app.logger.info(f"PDF processing complete: {len(text)} characters extracted")
                
                return {
                    'clean_text': text,
                    'processing_time': time.time() - start_time
                }
                
            except Exception as pdf_error:
                app.logger.error(f"PDF processing error for {filename}: {str(pdf_error)}")
                app.logger.error(f"PDF error type: {type(pdf_error)}")
                app.logger.error(f"PDF error traceback:", exc_info=True)
                raise
            
        else:
            try:
                app.logger.info(f"Processing image file: {filename}")
                text = process_image(temp_path)
                app.logger.info(f"Image processing complete: {len(text)} characters extracted")
                
                return {
                    'clean_text': text,
                    'processing_time': time.time() - start_time
                }
                
            except Exception as img_error:
                app.logger.error(f"Image processing error for {filename}: {str(img_error)}")
                app.logger.error(f"Image error traceback:", exc_info=True)
                raise
    
    finally:
        # Clean up the temporary file
        cleanup_file(temp_path)
        app.logger.info(f"Cleaned up temporary file for {filename}")

@bp.route('/')
def index():
    return send_from_directory('static', 'index.html')

@bp.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('static/css', filename)

@bp.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('static/js', filename)

@bp.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

@bp.route('/api/extract', methods=['POST'])
@limiter.limit(Config.RATELIMIT_EXTRACT_LIMIT)
def extract_text():
    """Extract text from uploaded file."""
    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        filename = secure_filename(file.filename)
        if not allowed_file(filename):
            return jsonify({'error': 'File type not allowed'}), 400
            
        app.logger.info(f"Processing file: {filename}")
        
        try:
            result = process_file(file)
        except Exception as e:
            app.logger.error(f"Processing failed for {filename}: {str(e)}")
            return jsonify({'error': f'Failed to process file: {str(e)}'}), 500
        
        # Detect language using clean text
        try:
            lang = detect_language(result['clean_text'])
            app.logger.info(f"Detected language for {filename}: {lang}")
        except Exception as lang_error:
            app.logger.warning(f"Language detection failed for {filename}: {str(lang_error)}")
            lang = 'unknown'

        return jsonify({
            'text': result['clean_text'],
            'filename': filename,
            'language': lang,
            'processing_time': result['processing_time']
        })

    except Exception as e:
        app.logger.error(f'Unexpected error processing file: {str(e)}')
        app.logger.error("Full traceback:", exc_info=True)
        return jsonify({'error': str(e)}), 500

@bp.route('/../../styles.css')
def serve_portfolio_css():
    return send_from_directory(os.path.dirname(os.path.dirname(__file__)), 'styles.css')

app.register_blueprint(bp)

@app.after_request
def cleanup(response):
    """Clean up memory after each request"""
    gc.collect()
    return response

if __name__ == '__main__':
    app.run(debug=Config.DEBUG, port=Config.PORT)#   T e s t   c o m m e n t  
 