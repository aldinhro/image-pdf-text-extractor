"""
Configuration settings for the text extraction service.
"""
import os

# Base directory of the application
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Upload directory for temporary files
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')

# Ensure upload directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

class Config:
    """Configuration settings for the application."""
    # Basic Flask config
    DEBUG = True
    TESTING = False
    PORT = 5000
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key-change-in-production')
    
    # Rate limiting settings
    RATELIMIT_DEFAULT_LIMITS = ["50 per day", "20 per hour"]
    RATELIMIT_EXTRACT_LIMIT = "5 per minute"
    RATELIMIT_STORAGE_URL = "memory://"  # Use Redis in production
    
    # Upload settings
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = UPLOAD_FOLDER
    
    # CORS settings
    CORS_ORIGINS = ['*']  # Update this in production

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    # Update these for production
    CORS_ORIGINS = ['https://your-frontend-domain.com']
    SECRET_KEY = os.environ.get('SECRET_KEY')
    RATELIMIT_STORAGE_URL = os.environ.get('REDIS_URL')

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
