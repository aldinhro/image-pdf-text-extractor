"""
Simple HTTP server for serving the portfolio static files.
Run this script to host the portfolio on http://localhost:8000
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Configuration
PORT = 8000
DIRECTORY = Path(__file__).parent  # Use the current directory

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def log_message(self, format, *args):
        """Custom logging to make the output cleaner"""
        print(f"\033[92m[Portfolio Server]\033[0m {self.address_string()} - {args[0]}")

def run_server():
    """Run the HTTP server"""
    handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"\n\033[1m{'='*60}\033[0m")
        print(f"\033[1;36mPortfolio Server Running at:\033[0m \033[1;34mhttp://localhost:{PORT}\033[0m")
        print(f"\033[1;36mPress Ctrl+C to stop the server\033[0m")
        print(f"\033[1m{'='*60}\033[0m\n")
        
        # Open the browser automatically
        webbrowser.open(f"http://localhost:{PORT}")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\033[1;33mShutting down the server...\033[0m")
            httpd.server_close()
            print("\033[1;32mServer stopped successfully!\033[0m")

if __name__ == "__main__":
    run_server()
