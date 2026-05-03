import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Nginx() {
  return (
    <PageContainer
      title="Nginx — servidor web e proxy reverso"
      subtitle="Instale o Nginx no Arch, monte server blocks, ative HTTPS com Let's Encrypt, faça proxy reverso e load balancing — com saída real."
      difficulty="intermediario"
      timeToRead="40 min"
      category="Servidores Web"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch com <code>sudo pacman -S nginx</code>. Apache parado se rodando na 80.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Nginx</strong> — servidor web event-driven, criado para resolver o "C10K problem".
      </p>
      <p>
        <strong>Server block</strong> — equivalente Nginx do "virtual host" do Apache. Ficam em <code>/etc/nginx/sites-available/</code> (Arch: convenção manual; padrão Arch é <code>/etc/nginx/nginx.conf</code> direto).
      </p>
      <p>
        <strong>Upstream</strong> — grupo de servidores backend para load balancing.
      </p>
      <p>
        <strong>Proxy reverso</strong> — Nginx repassa para Node/PHP-FPM/Python. Padrão moderno de produção.
      </p>

      <p>
        O <strong>Nginx</strong> ("engine-x") é o servidor web/proxy reverso mais usado em
        produção moderna. Não tem <code>.htaccess</code>, mas é leve, assíncrono e brutal em
        arquivos estáticos. No Arch o pacote se chama <code>nginx</code> (mainline) ou{" "}
        <code>nginx-mainline</code> da AUR para versões mais novas.
      </p>

      <AlertBox type="info" title="Diferenças Arch ↔ Debian">
        Não existe <code>sites-available/sites-enabled</code> no Arch — você inclui arquivos
        explicitamente com <code>include</code>. O usuário/grupo é <code>http</code> (não
        <code> www-data</code>). DocumentRoot padrão: <code>/usr/share/nginx/html</code>.
      </AlertBox>

      <h2>1. Instalação</h2>

      <TerminalBlock
        command="sudo pacman -S nginx"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (1) nginx-1.26.2-1

Total Download Size:    1.34 MiB
Total Installed Size:   3.78 MiB

:: Proceed with installation? [Y/n] y
(1/1) installing nginx                             [######################] 100%
:: Running post-transaction hooks...
(1/3) Reloading system manager configuration...
(2/3) Creating system user accounts...
(3/3) Arming ConditionNeedsUpdate...`}
      />

      <TerminalBlock
        command="sudo systemctl enable --now nginx"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/nginx.service → /usr/lib/systemd/system/nginx.service.`}
      />

      <TerminalBlock
        command="curl -sI http://localhost"
        output={`HTTP/1.1 200 OK
Server: nginx/1.26.2
Date: Wed, 26 Mar 2026 18:42:11 GMT
Content-Type: text/html
Content-Length: 720
Last-Modified: Mon, 03 Mar 2026 12:00:00 GMT
Connection: keep-alive
ETag: "65e..."
Accept-Ranges: bytes`}
      />

      <h2>2. Estrutura</h2>

      <OutputBlock
        title="layout dos arquivos no Arch"
        output={`/etc/nginx/nginx.conf            # config principal
/etc/nginx/conf.d/*.conf         # snippets carregados via include (servers, etc)
/etc/nginx/sites-enabled/        # NÃO existe por padrão; convenção opcional
/etc/nginx/mime.types
/etc/nginx/fastcgi.conf
/etc/nginx/scgi_params
/etc/nginx/uwsgi_params
/usr/share/nginx/html/           # DocumentRoot padrão
/var/log/nginx/access.log
/var/log/nginx/error.log
/usr/lib/systemd/system/nginx.service`}
      />

      <CommandFlagList
        command="nginx"
        items={[
          { flag: "-t", description: "Testa a sintaxe da config sem aplicar.", example: "sudo nginx -t" },
          { flag: "-T", description: "Como -t mas IMPRIME toda a config efetiva (todos os includes resolvidos)." },
          { flag: "-s reload", description: "Recarrega sem dropar conexões.", example: "sudo nginx -s reload" },
          { flag: "-s stop / quit / reopen", description: "stop=imediato; quit=graceful; reopen=reabre logs (útil pós-logrotate)." },
          { flag: "-V", description: "Mostra versão + flags de compilação + módulos compilados." },
          { flag: "-c CONF", description: "Usa um arquivo de config alternativo." },
        ]}
      />

      <TerminalBlock
        command="sudo nginx -t"
        output={`nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful`}
      />

      <h2>3. Server blocks (virtual hosts)</h2>

      <TerminalBlock
        command="sudo mkdir -p /srv/http/meusite && echo '<h1>Meu Site</h1>' | sudo tee /srv/http/meusite/index.html && sudo chown -R http:http /srv/http/meusite"
      />

      <CodeBlock
        title="/etc/nginx/conf.d/meusite.conf"
        language="nginx"
        code={`server {
    listen      80;
    listen      [::]:80;
    server_name meusite.com www.meusite.com;
    root        /srv/http/meusite;
    index       index.html index.htm;

    access_log /var/log/nginx/meusite.access.log;
    error_log  /var/log/nginx/meusite.error.log warn;

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}`}
      />

      <p>
        O <code>nginx.conf</code> padrão do Arch já tem
        <code> include /etc/nginx/conf.d/*.conf;</code> dentro do bloco <code>http</code> — basta
        recarregar:
      </p>

      <TerminalBlock
        command="sudo nginx -t && sudo systemctl reload nginx"
        output={`nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful`}
      />

      <TerminalBlock
        command="curl -H 'Host: meusite.com' -s http://localhost"
        output={`<h1>Meu Site</h1>`}
      />

      <h2>4. HTTPS com Let's Encrypt</h2>

      <TerminalBlock
        command="sudo pacman -S certbot certbot-nginx"
        output={`Packages (8) ... certbot-nginx-2.11.0-3 certbot-2.11.0-3
Total Installed Size:  44.21 MiB`}
      />

      <TerminalBlock
        command="sudo certbot --nginx -d meusite.com -d www.meusite.com"
        output={`Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator nginx, Installer nginx
Requesting a certificate for meusite.com and www.meusite.com
Performing the following challenges:
http-01 challenge for meusite.com
http-01 challenge for www.meusite.com
Waiting for verification...
Cleaning up challenges
Deploying Certificate to /etc/nginx/conf.d/meusite.conf for meusite.com
Deploying Certificate to /etc/nginx/conf.d/meusite.conf for www.meusite.com
Redirecting all traffic on port 80 to ssl in /etc/nginx/conf.d/meusite.conf

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/meusite.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/meusite.com/privkey.pem
This certificate expires on 2026-06-24.`}
      />

      <TerminalBlock
        command="sudo systemctl enable --now certbot-renew.timer && systemctl list-timers certbot-renew.timer"
        output={`Created symlink /etc/systemd/system/timers.target.wants/certbot-renew.timer → /usr/lib/systemd/system/certbot-renew.timer.
NEXT                        LEFT      LAST PASSED UNIT                ACTIVATES
Thu 2026-03-27 04:14:08 -03 9h left   n/a  n/a    certbot-renew.timer certbot-renew.service`}
      />

      <CodeBlock
        title="HTTPS manual (sem certbot) — server block + redirect"
        language="nginx"
        code={`server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name meusite.com www.meusite.com;
    root /srv/http/meusite;

    ssl_certificate     /etc/letsencrypt/live/meusite.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/meusite.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 1d;

    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
    add_header X-Content-Type-Options    "nosniff" always;
    add_header X-Frame-Options           "SAMEORIGIN" always;
    add_header Referrer-Policy           "strict-origin-when-cross-origin" always;

    location / { try_files $uri $uri/ =404; }
}

server {
    listen 80;
    listen [::]:80;
    server_name meusite.com www.meusite.com;
    return 301 https://$host$request_uri;
}`}
      />

      <h2>5. Proxy reverso para app (Node, Python, Go…)</h2>

      <CodeBlock
        title="/etc/nginx/conf.d/app.conf"
        language="nginx"
        code={`server {
    listen 80;
    server_name app.meusite.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

    # entrega estáticos direto, mais rápido
    location /static/ {
        alias /srv/http/app/static/;
        expires 30d;
        access_log off;
        add_header Cache-Control "public, immutable";
    }
}`}
      />

      <TerminalBlock
        comment="rapidinho: sobe app na 3000, faz request via nginx"
        command="curl -s http://app.meusite.com/health"
        output={`{"status":"ok","uptime":12482}`}
      />

      <h2>6. Load balancing (upstream)</h2>

      <CodeBlock
        title="upstream com 3 backends"
        language="nginx"
        code={`upstream backend {
    least_conn;                       # estratégia: menos conexões ativas
    server 10.0.0.10:8080 weight=2;   # 2x mais tráfego
    server 10.0.0.11:8080;
    server 10.0.0.12:8080 backup;     # só se os outros caírem
    keepalive 32;                      # pool persistente
}

server {
    listen 80;
    server_name api.meusite.com;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}`}
      />

      <OutputBlock
        title="estratégias de balanceamento"
        output={`(default)        round-robin
least_conn       envia para o backend com menos conexões ativas
ip_hash          mesmo client IP → mesmo backend (sticky por IP)
hash $cookie_x   sticky por valor de cookie
random two       escolhe 2 aleatórios e usa o de menos conexões`}
      />

      <h2>7. PHP-FPM</h2>

      <TerminalBlock
        command="sudo pacman -S php php-fpm && sudo systemctl enable --now php-fpm"
      />

      <CodeBlock
        title="server block que entrega PHP via FPM"
        language="nginx"
        code={`server {
    listen 80;
    server_name php.meusite.com;
    root /srv/http/php;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \\.php$ {
        include fastcgi.conf;
        fastcgi_pass unix:/run/php-fpm/php-fpm.sock;
        fastcgi_index index.php;
    }

    location ~ /\\.ht { deny all; }
}`}
      />

      <h2>8. Cache, gzip, rate limiting</h2>

      <CodeBlock
        title="/etc/nginx/conf.d/optim.conf — adicione no contexto http {}"
        language="nginx"
        code={`# === gzip ===
gzip                  on;
gzip_vary             on;
gzip_min_length       1024;
gzip_proxied          any;
gzip_comp_level       6;
gzip_types            text/plain text/css text/xml application/json
                      application/javascript application/xml
                      image/svg+xml;

# === cache para estáticos ===
map $sent_http_content_type $cache_max_age {
    default                  off;
    ~image/                  365d;
    ~font/                   365d;
    text/css                 30d;
    application/javascript   30d;
}

# === rate limit ===
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;`}
      />

      <CodeBlock
        title="aplicar rate limit dentro de um server"
        language="nginx"
        code={`location /api/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://backend;
}

location = /login {
    limit_req zone=login burst=5 nodelay;
    proxy_pass http://backend;
}`}
      />

      <h2>9. Logs e debug</h2>

      <TerminalBlock
        command="sudo tail -f /var/log/nginx/access.log"
        output={`192.168.1.50 - - [26/Mar/2026:15:48:12 -0300] "GET / HTTP/1.1" 200 18 "-" "Mozilla/5.0"
192.168.1.50 - - [26/Mar/2026:15:48:12 -0300] "GET /favicon.ico HTTP/1.1" 404 153 "http://meusite.com/" "Mozilla/5.0"
203.0.113.42 - - [26/Mar/2026:15:48:55 -0300] "GET /wp-login.php HTTP/1.1" 444 0 "-" "-"`}
      />

      <TerminalBlock
        command="sudo tail -f /var/log/nginx/error.log"
        output={`2026/03/26 15:49:11 [error] 7218#7218: *14 connect() failed (111: Connection refused) while connecting to upstream, client: 192.168.1.50, server: api.meusite.com, request: "GET / HTTP/1.1", upstream: "http://127.0.0.1:3000/", host: "api.meusite.com"`}
      />

      <p>
        Esse erro clássico (502) significa que o app backend não está escutando — verifique{" "}
        <code>ss -tlnp '( sport = :3000 )'</code>.
      </p>

      <h2>10. Hardening</h2>

      <CodeBlock
        title="esconder versão + limite de body"
        language="nginx"
        code={`# em http {}
server_tokens       off;
client_max_body_size 50m;
client_body_timeout  12s;
client_header_timeout 12s;
keepalive_timeout    15s;
send_timeout         10s;
large_client_header_buffers 4 16k;`}
      />

      <h2>11. Troubleshooting</h2>

      <TerminalBlock
        comment="403 — permissões erradas no DocumentRoot"
        command="ls -ld /srv/http/meusite"
        output={`drwxr-xr-x 2 root root 4096 Mar 26 15:42 /srv/http/meusite`}
      />

      <TerminalBlock
        command="sudo chown -R http:http /srv/http/meusite && sudo systemctl reload nginx"
      />

      <TerminalBlock
        comment="502 Bad Gateway — backend off"
        command="sudo ss -tlnp '( sport = :3000 )'"
        output={`(vazio — nada escuta)`}
      />

      <TerminalBlock
        comment="address already in use"
        command="sudo ss -tlnp '( sport = :80 or sport = :443 )'"
        output={`State   Recv-Q  Send-Q  Local Address:Port  Process
LISTEN  0       511     *:80                users:(("httpd",pid=4218,fd=4))
LISTEN  0       511     *:443               users:(("httpd",pid=4218,fd=6))`}
      />

      <p>
        Apache/<code>httpd</code> está rodando junto e ocupando 80/443. Pare:{" "}
        <code>sudo systemctl disable --now httpd</code>.
      </p>

      <AlertBox type="success" title="Receita de bolso de mudança em prod">
        Sempre <code>sudo nginx -t</code> antes de qualquer restart, e use{" "}
        <code>sudo systemctl reload nginx</code> (= <code>nginx -s reload</code>) para aplicar
        — isso preserva conexões abertas. Se uma config nova travar, o Nginx CONTINUA com a
        antiga.
      </AlertBox>

      <h2>12. Cola de bolso</h2>

      <OutputBlock
        title="comandos essenciais Nginx no Arch"
        output={`# Instalar / serviço
sudo pacman -S nginx
sudo systemctl enable --now nginx
sudo systemctl reload nginx

# Validar
sudo nginx -t        # sintaxe
sudo nginx -T        # config efetiva (dump)

# Logs
sudo tail -f /var/log/nginx/{access,error}.log

# HTTPS
sudo pacman -S certbot certbot-nginx
sudo certbot --nginx -d dominio.com

# Estrutura
/etc/nginx/nginx.conf
/etc/nginx/conf.d/*.conf
/srv/http/  (ou /usr/share/nginx/html)
usuário/grupo: http`}
      />
    </PageContainer>
  );
}
