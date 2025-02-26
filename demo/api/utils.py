"""
Utility functions for file handling and text processing.
"""
import os
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_upload_file(file, upload_folder):
    """Safely save uploaded file and return the path."""
    if not file:
        raise ValueError("No file provided")
        
    filename = secure_filename(file.filename)
    if not filename:
        raise ValueError("Invalid filename")
        
    if not allowed_file(filename):
        raise ValueError(f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}")
        
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)
    return file_path

def cleanup_file(file_path):
    """Remove temporary file if it exists."""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception:
        pass  # Ignore cleanup errors
