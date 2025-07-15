#!/usr/bin/env python3
"""
Server HTTP locale per testare il Printing Capacity Manager
Usa questo script per hostare il sito localmente
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import json
import urllib.parse
from datetime import datetime

PORT = 8001

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)
    
    def do_POST(self):
        if self.path == '/save-json':
            # Gestisce il salvataggio dei file JSON
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                # Crea il nome del file con timestamp
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"printing_capacity_backup_{timestamp}.json"
                filepath = os.path.join(os.path.dirname(os.path.abspath(__file__)), filename)
                
                # Salva il file JSON
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                
                # Risposta di successo
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {
                    'success': True, 
                    'message': f'File salvato come {filename}',
                    'filename': filename
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {'success': False, 'error': str(e)}
                self.wfile.write(json.dumps(response).encode('utf-8'))
        
        elif self.path == '/list-backups':
            # Lista i file di backup disponibili
            try:
                backup_files = []
                for file in os.listdir(os.path.dirname(os.path.abspath(__file__))):
                    if file.startswith('printing_capacity_backup_') and file.endswith('.json'):
                        backup_files.append(file)
                
                backup_files.sort(reverse=True)  # I più recenti per primi
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {'success': True, 'files': backup_files}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {'success': False, 'error': str(e)}
                self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        # Gestisce le richieste CORS preflight
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def main():
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"🚀 Server avviato su http://localhost:{PORT}")
            print(f"📁 Servendo i file da: {os.path.dirname(os.path.abspath(__file__))}")
            print(f"💾 I backup JSON verranno salvati in questa directory")
            print(f"🌐 Il sito sarà aperto automaticamente nel browser")
            print(f"⏹️  Premi Ctrl+C per fermare il server")
            
            # Apri automaticamente il browser
            webbrowser.open(f'http://localhost:{PORT}')
            
            # Avvia il server
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n👋 Server fermato")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Porta {PORT} già in uso. Prova con un'altra porta.")
            sys.exit(1)
        else:
            print(f"❌ Errore: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()
