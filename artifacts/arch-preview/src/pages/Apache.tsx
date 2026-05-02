import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Apache() {
  return (
    <PageContainer
      title="Apache HTTP Server (httpd)"
      subtitle="No Arch o Apache se chama httpd. Aqui você instala, sobe vhosts, ativa HTTPS com certbot, mexe com módulos e proxy reverso — output real."
      difficulty="intermediario"
      timeToRead="40 min"
      category="Servidores Web"
    >
      <p>
        O <strong>Apache HTTP Server</strong> está há décadas no topo. No Arch ele é instalado pelo
        pacote <code>apache</code>, e o binário/serviço/config se chamam{" "}
        <strong><code>httpd</code></strong> (não <code>apache2</code> como no Ubuntu/Debian). Os
        diretórios também são diferentes — nada de <code>sites-available</code> ou
        <code> a2enmod</code>: você edita <code>httpd.conf</code> e usa <code>Include</code>.
      </p>

      <AlertBox type="info" title="Diferenças Arch ↔ Debian em uma tabela">
        <code>apache2</code> → <code>httpd</code> · <code>apachectl</code> ainda existe ·
        <code> /etc/apache2/</code> → <code>/etc/httpd/</code> · <code>sites-enabled/</code> →
        <code> /etc/httpd/conf/extra/*.conf</code> via <code>Include</code> ·
        <code> www-data</code> → <code>http</code> (usuário/grupo) · DocumentRoot padrão:
        <code> /srv/http/</code>.
      </AlertBox>

      <h2>1. Instalação</h2>

      <TerminalBlock
        command="sudo pacman -S apache"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (3) apr-1.7.5-1  apr-util-1.6.3-2  apache-2.4.62-1

Total Download Size:    2.18 MiB
Total Installed Size:   8.74 MiB

:: Proceed with installation? [Y/n] y
(1/3) installing apr                               [######################] 100%
(2/3) installing apr-util                          [######################] 100%
(3/3) installing apache                            [######################] 100%
:: Running post-transaction hooks...
(1/3) Reloading system manager configuration...
(2/3) Creating system user accounts...
Creating group 'http' with GID 33.
Creating user 'http' (HTTP daemon) with UID 33 and GID 33.
(3/3) Arming ConditionNeedsUpdate...`}
      />

      <TerminalBlock
        command="sudo systemctl enable --now httpd"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/httpd.service → /usr/lib/systemd/system/httpd.service.`}
      />

      <TerminalBlock
        command="systemctl status httpd --no-pager"
        output={`{g}● httpd.service{/} - Apache Web Server
     Loaded: loaded (/usr/lib/systemd/system/httpd.service; enabled; preset: disabled)
     Active: {g}active (running){/} since Wed 2026-03-26 15:12:08 -03; 3s ago
   Main PID: 5218 (httpd)
      Tasks: 82 (limit: 38389)
     Memory: 12.4M
        CPU: 78ms
     CGroup: /system.slice/httpd.service
             ├─5218 /usr/bin/httpd -k start -DFOREGROUND
             ├─5219 /usr/bin/httpd -k start -DFOREGROUND
             └─5220 /usr/bin/httpd -k start -DFOREGROUND

Mar 26 15:12:08 archlinux systemd[1]: Started Apache Web Server.
Mar 26 15:12:08 archlinux httpd[5218]: AH00558: httpd: Could not reliably determine the server's fully qualified domain name, using 127.0.0.1.`}
      />

      <TerminalBlock
        command="curl -sI http://localhost"
        output={`HTTP/1.1 403 Forbidden
Date: Wed, 26 Mar 2026 18:12:14 GMT
Server: Apache/2.4.62 (Unix)
Last-Modified: Wed, 26 Mar 2026 18:12:08 GMT
ETag: "29cd-..."
Accept-Ranges: bytes
Content-Length: 10701
Content-Type: text/html`}
      />

      <h2>2. Estrutura no Arch</h2>

      <OutputBlock
        title="Layout de /etc/httpd e /srv/http"
        output={`/etc/httpd/conf/httpd.conf            # config principal
/etc/httpd/conf/extra/*.conf          # snippets carregados via Include (ssl, mpm, vhosts)
/etc/httpd/conf/httpd-vhosts.conf     # NÃO existe por padrão; você cria + Include
/etc/httpd/conf/mime.types
/etc/httpd/modules/                   # *.so dos módulos (linkado para /usr/lib/httpd)
/srv/http/                            # DocumentRoot padrão
/var/log/httpd/access_log             # logs
/var/log/httpd/error_log
/usr/lib/systemd/system/httpd.service # unit padrão`}
      />

      <TerminalBlock
        command="grep -E '^(Include|LoadModule)' /etc/httpd/conf/httpd.conf | head -8"
        output={`LoadModule authn_file_module modules/mod_authn_file.so
LoadModule authn_core_module modules/mod_authn_core.so
LoadModule authz_host_module modules/mod_authz_host.so
LoadModule authz_groupfile_module modules/mod_authz_groupfile.so
LoadModule authz_user_module modules/mod_authz_user.so
LoadModule authz_core_module modules/mod_authz_core.so
LoadModule access_compat_module modules/mod_access_compat.so
LoadModule auth_basic_module modules/mod_auth_basic.so`}
      />

      <h3>Validar e recarregar</h3>

      <CommandFlagList
        command="apachectl"
        items={[
          { flag: "-t", description: "Verifica a sintaxe (configtest) sem reiniciar.", example: "sudo apachectl -t" },
          { flag: "-S", description: "Mostra a árvore de virtual hosts efetivamente carregada.", example: "sudo apachectl -S" },
          { flag: "-M", description: "Lista todos os módulos carregados (built-in + dinâmicos)." },
          { flag: "-V", description: "Versão, MPM compilado, paths." },
          { flag: "graceful", description: "Recarrega sem matar conexões abertas (= systemctl reload httpd)." },
          { flag: "stop / start / restart", description: "Operações simples (prefira systemctl no Arch)." },
        ]}
      />

      <TerminalBlock
        command="sudo apachectl -t"
        output={`AH00558: httpd: Could not reliably determine the server's fully qualified domain name, using 127.0.0.1. Set the 'ServerName' directive globally to suppress this message
Syntax OK`}
      />

      <h2>3. Servindo arquivos</h2>

      <TerminalBlock
        command={`echo '<h1>Olá do Arch!</h1>' | sudo tee /srv/http/index.html`}
        output={`<h1>Olá do Arch!</h1>`}
      />

      <TerminalBlock
        command="curl http://localhost"
        output={`<h1>Olá do Arch!</h1>`}
      />

      <h2>4. Virtual Hosts</h2>

      <TerminalBlock
        command="sudo mkdir -p /srv/http/meusite && sudo chown -R http:http /srv/http/meusite"
        output=""
      />

      <CodeBlock
        title="/etc/httpd/conf/extra/httpd-vhosts.conf"
        language="apache"
        code={`<VirtualHost *:80>
    ServerAdmin admin@meusite.com
    ServerName  meusite.com
    ServerAlias www.meusite.com

    DocumentRoot "/srv/http/meusite"
    ErrorLog  "/var/log/httpd/meusite-error_log"
    CustomLog "/var/log/httpd/meusite-access_log" combined

    <Directory "/srv/http/meusite">
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

<VirtualHost *:80>
    ServerName api.meusite.com
    DocumentRoot "/srv/http/api"

    <Directory "/srv/http/api">
        Require all granted
    </Directory>
</VirtualHost>`}
      />

      <p>Inclua o snippet em <code>/etc/httpd/conf/httpd.conf</code>:</p>

      <CodeBlock
        title="/etc/httpd/conf/httpd.conf — descomente / adicione"
        language="apache"
        code={`# Virtual hosts
Include conf/extra/httpd-vhosts.conf`}
      />

      <TerminalBlock
        command="sudo apachectl -S"
        output={`VirtualHost configuration:
*:80                   is a NameVirtualHost
         default server meusite.com (/etc/httpd/conf/extra/httpd-vhosts.conf:1)
         port 80 namevhost meusite.com (/etc/httpd/conf/extra/httpd-vhosts.conf:1)
                 alias www.meusite.com
         port 80 namevhost api.meusite.com (/etc/httpd/conf/extra/httpd-vhosts.conf:18)
ServerRoot: "/etc/httpd"
Main DocumentRoot: "/srv/http"
Main ErrorLog: "/var/log/httpd/error_log"`}
      />

      <TerminalBlock
        command="sudo systemctl reload httpd"
        output=""
      />

      <h2>5. HTTPS com Let's Encrypt (certbot)</h2>

      <TerminalBlock
        command="sudo pacman -S certbot certbot-apache"
        output={`Packages (8) ... certbot-apache-2.11.0-3 certbot-2.11.0-3
Total Installed Size:  44.21 MiB`}
      />

      <p>
        Habilite o módulo SSL editando o <code>httpd.conf</code> (descomente as linhas):
      </p>

      <CodeBlock
        title="/etc/httpd/conf/httpd.conf — habilita SSL"
        language="apache"
        code={`LoadModule ssl_module modules/mod_ssl.so
LoadModule socache_shmcb_module modules/mod_socache_shmcb.so

Include conf/extra/httpd-ssl.conf`}
      />

      <TerminalBlock
        command="sudo certbot --apache -d meusite.com -d www.meusite.com"
        output={`Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator apache, Installer apache
Requesting a certificate for meusite.com and www.meusite.com
Performing the following challenges:
http-01 challenge for meusite.com
http-01 challenge for www.meusite.com
Waiting for verification...
Cleaning up challenges
Deploying Certificate to VirtualHost /etc/httpd/conf/extra/httpd-vhosts.conf
Redirecting all traffic on port 80 to ssl in /etc/httpd/conf/extra/httpd-vhosts.conf

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/meusite.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/meusite.com/privkey.pem
This certificate expires on 2026-06-24.`}
      />

      <TerminalBlock
        comment="renovação automática via timer systemd"
        command="sudo systemctl enable --now certbot-renew.timer"
        output={`Created symlink /etc/systemd/system/timers.target.wants/certbot-renew.timer → /usr/lib/systemd/system/certbot-renew.timer.`}
      />

      <TerminalBlock
        command="sudo certbot certificates"
        output={`Found the following certs:
  Certificate Name: meusite.com
    Domains: meusite.com www.meusite.com
    Expiry Date: 2026-06-24 14:32:11+00:00 (VALID: 89 days)
    Certificate Path: /etc/letsencrypt/live/meusite.com/fullchain.pem
    Private Key Path: /etc/letsencrypt/live/meusite.com/privkey.pem`}
      />

      <h2>6. Módulos comuns</h2>

      <p>
        No Arch não há <code>a2enmod</code>: edite o <code>httpd.conf</code> e remova o
        <code> #</code> da diretiva <code>LoadModule</code> correspondente. Os <code>.so</code>{" "}
        já vêm em <code>/etc/httpd/modules/</code>.
      </p>

      <CodeBlock
        title="/etc/httpd/conf/httpd.conf — módulos úteis"
        language="apache"
        code={`LoadModule rewrite_module      modules/mod_rewrite.so
LoadModule headers_module      modules/mod_headers.so
LoadModule expires_module      modules/mod_expires.so
LoadModule deflate_module      modules/mod_deflate.so
LoadModule proxy_module        modules/mod_proxy.so
LoadModule proxy_http_module   modules/mod_proxy_http.so
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so
LoadModule ssl_module          modules/mod_ssl.so
LoadModule status_module       modules/mod_status.so
LoadModule info_module         modules/mod_info.so`}
      />

      <TerminalBlock
        command="sudo apachectl -M | grep -E 'rewrite|ssl|proxy_http' | head"
        output={` proxy_http_module (shared)
 rewrite_module (shared)
 ssl_module (shared)`}
      />

      <h2>7. PHP via php-fpm</h2>

      <TerminalBlock
        command="sudo pacman -S php php-fpm"
        output={`Packages (2)  php-8.3.10-1  php-fpm-8.3.10-1
Total Installed Size:  56.80 MiB`}
      />

      <TerminalBlock
        command="sudo systemctl enable --now php-fpm"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/php-fpm.service → /usr/lib/systemd/system/php-fpm.service.`}
      />

      <CodeBlock
        title="/etc/httpd/conf/extra/php-fpm.conf — proxy ao FPM via socket"
        language="apache"
        code={`# Habilite no httpd.conf:
#   LoadModule proxy_module modules/mod_proxy.so
#   LoadModule proxy_fcgi_module modules/mod_proxy_fcgi.so
#   Include conf/extra/php-fpm.conf

DirectoryIndex index.php index.html

<FilesMatch \\.php$>
    SetHandler "proxy:unix:/run/php-fpm/php-fpm.sock|fcgi://localhost/"
</FilesMatch>`}
      />

      <TerminalBlock
        command={`echo '<?php phpinfo();' | sudo tee /srv/http/info.php > /dev/null && curl -sI http://localhost/info.php | head -3`}
        output={`HTTP/1.1 200 OK
Date: Wed, 26 Mar 2026 18:24:11 GMT
Content-Type: text/html; charset=UTF-8`}
      />

      <h2>8. Proxy reverso para uma app Node.js</h2>

      <CodeBlock
        title="/etc/httpd/conf/extra/httpd-vhosts.conf (vhost extra)"
        language="apache"
        code={`<VirtualHost *:80>
    ServerName app.meusite.com

    ProxyPreserveHost On
    ProxyPass        / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    # WebSockets
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) "ws://127.0.0.1:3000/$1" [P,L]

    ErrorLog  "/var/log/httpd/app-error_log"
    CustomLog "/var/log/httpd/app-access_log" combined
</VirtualHost>`}
      />

      <h2>9. Hardening básico</h2>

      <CodeBlock
        title="/etc/httpd/conf/extra/security.conf"
        language="apache"
        code={`# esconde versão
ServerTokens Prod
ServerSignature Off

# headers
<IfModule headers_module>
    Header always set X-Content-Type-Options  "nosniff"
    Header always set X-Frame-Options         "SAMEORIGIN"
    Header always set Referrer-Policy         "strict-origin-when-cross-origin"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>

# desabilita TRACE
TraceEnable off`}
      />

      <p>
        Adicione <code>Include conf/extra/security.conf</code> no <code>httpd.conf</code> e recarregue.
      </p>

      <h2>10. Firewall</h2>

      <TerminalBlock
        comment="nftables (default Arch)"
        command={`sudo nft add rule inet filter input tcp dport { 80, 443 } accept comment '"http/https"'`}
      />

      <h2>11. Logs em tempo real</h2>

      <TerminalBlock
        command="sudo tail -f /var/log/httpd/access_log"
        output={`192.168.1.50 - - [26/Mar/2026:15:32:11 -0300] "GET / HTTP/1.1" 200 18 "-" "Mozilla/5.0 (X11; Linux x86_64)"
192.168.1.50 - - [26/Mar/2026:15:32:14 -0300] "GET /favicon.ico HTTP/1.1" 404 196 "-" "Mozilla/5.0"
203.0.113.42 - - [26/Mar/2026:15:33:02 -0300] "GET /wp-login.php HTTP/1.1" 404 196 "-" "Mozilla/5.0"`}
      />

      <TerminalBlock
        command="sudo journalctl -u httpd -f"
        output={`Mar 26 15:32:11 archlinux httpd[5219]: AH00094: Command line: '/usr/bin/httpd -D FOREGROUND'
Mar 26 15:33:02 archlinux httpd[5220]: [Wed Mar 26 15:33:02.121 2026] [authz_core:error] [pid 5220:tid 7f...] [client 203.0.113.42:54122] AH01630: client denied by server configuration: /srv/http/wp-login.php`}
      />

      <h2>12. Troubleshooting</h2>

      <TerminalBlock
        comment="403 Forbidden"
        command="sudo tail -1 /var/log/httpd/error_log"
        output={`[Wed Mar 26 15:34:11 2026] [authz_core:error] [pid 5220] AH01630: client denied by server configuration: /srv/http/meusite/`}
      />

      <p>Verifique o bloco <code>&lt;Directory&gt;</code>: precisa ter <code>Require all granted</code>.</p>

      <TerminalBlock
        comment="porta 80 já em uso?"
        command="sudo ss -tlnp '( sport = :80 or sport = :443 )'"
        output={`State   Recv-Q   Send-Q   Local Address:Port   Peer Address:Port  Process
LISTEN  0        511      *:80                 *:*                users:(("httpd",pid=5218,fd=4))
LISTEN  0        511      *:443                *:*                users:(("httpd",pid=5218,fd=6))`}
      />

      <TerminalBlock
        comment="testa sintaxe + recarrega sem dropar conexões"
        command="sudo apachectl -t && sudo systemctl reload httpd"
        output={`Syntax OK`}
      />

      <AlertBox type="warning" title="Sempre apachectl -t antes do reload">
        Um <code>httpd.conf</code> com erro de sintaxe + <code>restart</code> deixa o servidor
        DOWN. <code>apachectl -t</code> diz se vai subir. <code>systemctl reload</code>{" "}
        recarrega sem perder conexões — mesmo da app de produção.
      </AlertBox>

      <h2>13. Cola de bolso</h2>

      <OutputBlock
        title="comandos essenciais Apache no Arch"
        output={`# Instalar / serviço
sudo pacman -S apache
sudo systemctl enable --now httpd
sudo systemctl reload httpd

# Validar config
sudo apachectl -t        # sintaxe
sudo apachectl -S        # vhosts
sudo apachectl -M        # módulos

# Logs
sudo tail -f /var/log/httpd/{access,error}_log
sudo journalctl -u httpd -f

# HTTPS
sudo pacman -S certbot certbot-apache
sudo certbot --apache -d dominio.com

# Estrutura
/etc/httpd/conf/httpd.conf
/etc/httpd/conf/extra/*.conf
/srv/http/`}
      />
    </PageContainer>
  );
}
