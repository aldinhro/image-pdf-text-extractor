"""
Core text extraction functionality for PDF and image files.
"""
import os
import fitz  # PyMuPDF
import easyocr
from PIL import Image
from langdetect import detect, LangDetectException

def process_pdf(file_path):
    """Extract text from PDF file."""
    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text.strip()
    except Exception as e:
        raise Exception(f"Error processing PDF: {str(e)}")

def process_image(file_path, reader=None):
    """Extract text from image file using EasyOCR."""
    try:
        if reader is None:
            reader = easyocr.Reader(['en'])
        
        # Open and process image with PIL first
        with Image.open(file_path) as img:
            # Convert to RGB if needed
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Save as temporary file if needed
            if img.format not in ['PNG', 'JPEG']:
                temp_path = file_path + '.jpg'
                img.save(temp_path, 'JPEG')
                file_path = temp_path

        # Extract text
        result = reader.readtext(file_path)
        text = '\n'.join([item[1] for item in result])
        
        # Clean up temporary file if created
        if os.path.exists(file_path + '.jpg'):
            os.remove(file_path + '.jpg')
            
        return text.strip()
    except Exception as e:
        raise Exception(f"Error processing image: {str(e)}")

def detect_language(text):
    """Detect the language of the extracted text."""
    try:
        return detect(text) if text.strip() else 'en'
    except LangDetectException:
        return 'en'  # Default to English if detection fails
