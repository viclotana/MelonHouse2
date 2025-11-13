#!/usr/bin/env python3
"""
Simple HTTP server with SPA routing support.
All routes serve index.html so client-side routing works.
"""
import http.server
import socketserver
from urllib.parse import urlparse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # If it's a file that exists, serve it
        if path != '/' and not path.startswith('/news') and not path.startswith('/index.html'):
            try:
                super().do_GET()
                return
            except:
                pass
        
        # For all other routes (including /news/*), serve index.html
        self.path = '/index.html'
        return super().do_GET()

if __name__ == '__main__':
    PORT = 8000
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}/")
        print("Press Ctrl+C to stop")
        httpd.serve_forever()

