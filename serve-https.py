import http.server, ssl, os, sys

os.chdir(os.path.dirname(os.path.abspath(__file__)))
PORT = 8443
handler = http.server.SimpleHTTPRequestHandler
httpd = http.server.HTTPServer(("0.0.0.0", PORT), handler)
ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.load_cert_chain("cert.pem", "key.pem")
httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)
print(f"HTTPS PWA servindo em https://0.0.0.0:{PORT}")
print("Abra no celular: https://<IP-DO-PC>:8443/init_screen/init_screen.html")
print("Aceite o aviso de certificado (autoassinado) no primeiro acesso.")
httpd.serve_forever()
