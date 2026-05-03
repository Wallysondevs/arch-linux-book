import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function PHP() {
  return (
    <PageContainer
      title="PHP no Arch"
      subtitle="Servidor de desenvolvimento embutido, Composer, php-fpm e integração com Nginx/Apache. Tudo via repositório oficial."
      difficulty="intermediario"
      timeToRead="35 min"
      category="Linguagens"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch com <code>sudo pacman -S php</code>. Para Apache: <code>php-apache</code>; para Nginx: <code>php-fpm</code>.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>PHP</strong> — linguagem de scripting voltada para web, executada no servidor.
      </p>
      <p>
        <strong>PHP-FPM</strong> — FastCGI Process Manager — recomendado em produção.
      </p>
      <p>
        <strong>mod_php / php-apache</strong> — módulo Apache que roda PHP no mesmo processo.
      </p>
      <p>
        <strong>php.ini</strong> — arquivo de configuração principal. Arch: <code>/etc/php/php.ini</code>.
      </p>
      <p>
        <strong>composer</strong> — gerenciador de pacotes PHP — equivalente ao npm/pip.
      </p>

      <p>
        O PHP no Arch é simples: um pacote <code>php</code> traz a CLI e o módulo Apache; pacotes
        opcionais como <code>php-fpm</code>, <code>php-gd</code>, <code>php-pgsql</code> adicionam
        extensões. A versão é sempre a mais recente — se precisar de PHP 8.1 antigo, use container
        Docker ou o AUR.
      </p>

      <h2>1. Instalação</h2>

      <TerminalBlock
        command="sudo pacman -S php composer"
        output={`Packages (2) composer-2.7.7-1  php-8.3.12-1

Total Download Size:    23.42 MiB
Total Installed Size:   78.91 MiB

:: Proceed with installation? [Y/n] y`}
      />

      <TerminalBlock
        command="php --version"
        output={`PHP 8.3.12 (cli) (built: Sep 26 2024 14:11:18) (NTS)
Copyright (c) The PHP Group
Zend Engine v4.3.12, Copyright (c) Zend Technologies
    with Zend OPcache v8.3.12, Copyright (c), by Zend Technologies`}
      />

      <TerminalBlock
        comment="extensões já compiladas (built-in)"
        command="php -m | head -20"
        output={`[PHP Modules]
Core
ctype
curl
date
dom
fileinfo
filter
hash
iconv
json
libxml
mbstring
openssl
pcre
PDO
pdo_sqlite
Phar
posix
random
readline`}
      />

      <h3>Extensões úteis (instale conforme o projeto)</h3>

      <TerminalBlock
        command="sudo pacman -S php-gd php-intl php-pgsql php-sqlite php-redis"
        output={`Packages (5) php-gd-8.3.12-1  php-intl-8.3.12-1  php-pgsql-8.3.12-1
             php-sqlite-8.3.12-1  php-redis-6.1.0-1

Total Installed Size:  4.32 MiB`}
      />

      <p>
        <strong>Para MySQL/MariaDB:</strong> a extensão <code>pdo_mysql</code> e <code>mysqli</code>{" "}
        já vêm no pacote <code>php</code>, mas ficam <em>desabilitadas</em> por padrão. Habilite no{" "}
        <code>php.ini</code> (ver seção 5).
      </p>

      <h2>2. Servidor de desenvolvimento embutido</h2>

      <p>
        O PHP traz um web server simples para desenvolvimento — sem precisar instalar Apache/Nginx.
      </p>

      <CodeBlock
        title="public/index.php"
        language="php"
        code={`<?php
declare(strict_types=1);

header('Content-Type: application/json');

echo json_encode([
    'host'    => gethostname(),
    'php'     => PHP_VERSION,
    'method'  => $_SERVER['REQUEST_METHOD'],
    'uri'     => $_SERVER['REQUEST_URI'],
    'time'    => date('c'),
], JSON_PRETTY_PRINT);`}
      />

      <TerminalBlock
        command="php -S 127.0.0.1:8000 -t public"
        output={`[Tue Mar 25 16:11:42 2026] PHP 8.3.12 Development Server (http://127.0.0.1:8000) started
[Tue Mar 25 16:12:08 2026] 127.0.0.1:51234 Accepted
[Tue Mar 25 16:12:08 2026] 127.0.0.1:51234 [200]: GET /
[Tue Mar 25 16:12:08 2026] 127.0.0.1:51234 Closing`}
      />

      <TerminalBlock
        command="curl -s http://127.0.0.1:8000"
        output={`{
    "host": "archlinux",
    "php": "8.3.12",
    "method": "GET",
    "uri": "/",
    "time": "2026-03-25T16:12:08-03:00"
}`}
      />

      <CommandFlagList
        command="php -S"
        items={[
          { flag: "-S host:porta", description: "Inicia o server embutido.", example: "php -S 0.0.0.0:8000" },
          { flag: "-t DIR", description: "Document root (onde estão os .php)." },
          { flag: "-d K=V", description: "Sobrescreve diretiva do php.ini.", example: "php -d display_errors=1 -S :8000" },
          { flag: "ROUTER.php", description: "Script roteador opcional (para SPA-style routing)." },
        ]}
      />

      <AlertBox type="warning" title="Apenas para desenvolvimento">
        O server embutido é <strong>single-threaded</strong> e não suporta SSL nativamente.
        Em produção, use sempre <code>php-fpm</code> + Nginx (ou Apache mod_php).
      </AlertBox>

      <h2>3. Composer — gerenciador de dependências</h2>

      <TerminalBlock
        command="composer --version"
        output="Composer version 2.7.7 2024-06-10 22:11:12"
      />

      <TerminalBlock
        command="composer init"
        output={`
                                            
  Welcome to the Composer config generator  
                                            

This command will guide you through creating your composer.json config.

Package name (<vendor>/<name>) [user/projeto]: meuusuario/blog
Description []: Blog em PHP 8
Author [Joao <joao@example.com>, n to skip]: 
Minimum Stability []: stable
Package Type (e.g. library, project, metapackage, composer-plugin) []: project
License []: MIT

Define your dependencies.

Would you like to define your dependencies (require) interactively [yes]? no
Would you like to define your dev dependencies (require-dev) interactively [yes]? no

Add PSR-4 autoload mapping? Maps namespace "MeuUsuario\\Blog" to the entered relative path. [src/, n to skip]: src/
Generating autoload files
Generated autoload files
PSR-4 autoloading configured. Use "namespace MeuUsuario\\Blog;" in src/
Include the Composer autoloader with: require 'vendor/autoload.php';`}
      />

      <TerminalBlock
        command={`composer require monolog/monolog symfony/dotenv guzzlehttp/guzzle`}
        output={`./composer.json has been updated
Running composer update monolog/monolog symfony/dotenv guzzlehttp/guzzle
Loading composer repositories with package information
Updating dependencies
Lock file operations: 8 installs, 0 updates, 0 removals
  - Locking guzzlehttp/guzzle (7.9.2)
  - Locking guzzlehttp/promises (2.0.3)
  - Locking guzzlehttp/psr7 (2.7.0)
  - Locking monolog/monolog (3.7.0)
  - Locking psr/http-client (1.0.3)
  - Locking psr/http-factory (1.1.0)
  - Locking psr/http-message (2.0)
  - Locking psr/log (3.0.2)
  - Locking symfony/dotenv (7.1.5)
Writing lock file
Installing dependencies from lock file (including require-dev)
Package operations: 8 installs, 0 updates, 0 removals
Generating autoload files`}
      />

      <CommandFlagList
        command="composer"
        items={[
          { flag: "init", description: "Wizard para criar composer.json." },
          { flag: "require PKG", description: "Adiciona dependência.", example: "composer require monolog/monolog" },
          { flag: "require --dev PKG", description: "Adiciona em require-dev (phpunit, etc)." },
          { flag: "install", description: "Instala respeitando composer.lock (deploy / CI)." },
          { flag: "update", description: "Atualiza versões dentro dos ranges do composer.json." },
          { flag: "remove PKG", description: "Remove pacote." },
          { flag: "dump-autoload -o", description: "Regenera autoloader (otimizado em -o)." },
          { flag: "show", description: "Lista pacotes instalados." },
          { flag: "outdated", description: "Pacotes com versão nova disponível." },
          { flag: "global require PKG", description: "Instala global em ~/.config/composer/vendor/." },
        ]}
      />

      <h2>4. php-fpm + Nginx (produção)</h2>

      <TerminalBlock
        command="sudo pacman -S php-fpm nginx"
        output={`Packages (2) nginx-1.27.2-1  php-fpm-8.3.12-1`}
      />

      <TerminalBlock
        command="sudo systemctl enable --now php-fpm"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/php-fpm.service → /usr/lib/systemd/system/php-fpm.service.`}
      />

      <TerminalBlock
        command="systemctl status php-fpm --no-pager"
        output={`{g}● php-fpm.service{/} - The PHP FastCGI Process Manager
     Loaded: loaded (/usr/lib/systemd/system/php-fpm.service; enabled; preset: disabled)
     Active: {g}active (running){/} since Tue 2026-03-25 16:24:01 -03; 5s ago
   Main PID: 5012 (php-fpm)
     Status: "Processes active: 0, idle: 2, Requests: 0, slow: 0, Traffic: 0req/sec"
      Tasks: 3 (limit: 38389)
     Memory: 13.4M
        CPU: 84ms
     CGroup: /system.slice/php-fpm.service
             ├─5012 "php-fpm: master process (/etc/php/php-fpm.conf)"
             ├─5013 "php-fpm: pool www"
             └─5014 "php-fpm: pool www"`}
      />

      <CodeBlock
        title="/etc/php/php-fpm.d/www.conf — pool padrão (trecho)"
        language="ini"
        code={`[www]
user = http
group = http

listen = /run/php-fpm/php-fpm.sock
listen.owner = http
listen.group = http
listen.mode = 0660

pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35

slowlog = /var/log/php-fpm/slow.log
request_slowlog_timeout = 5s`}
      />

      <CodeBlock
        title="/etc/nginx/nginx.conf — server block PHP"
        language="nginx"
        code={`server {
    listen 80;
    server_name blog.local;
    root /srv/http/blog/public;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \\.php$ {
        include /etc/nginx/fastcgi.conf;
        fastcgi_pass unix:/run/php-fpm/php-fpm.sock;
        fastcgi_index index.php;
    }

    location ~ /\\.(?!well-known).* { deny all; }
}`}
      />

      <TerminalBlock
        command="sudo nginx -t && sudo systemctl restart nginx"
        output={`nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful`}
      />

      <h2>5. php.ini — configurações importantes</h2>

      <TerminalBlock
        command="php --ini"
        output={`Configuration File (php.ini) Path: /etc/php
Loaded Configuration File:         /etc/php/php.ini
Scan for additional .ini files in: /etc/php/conf.d
Additional .ini files parsed:      (none)`}
      />

      <p>
        Para habilitar extensões opcionais já compiladas (mysqli, pdo_mysql, gd, etc), edite{" "}
        <code>/etc/php/php.ini</code> e remova o <code>;</code> da linha:
      </p>

      <CodeBlock
        title="/etc/php/php.ini (mudanças comuns)"
        language="ini"
        code={`; antes:
;extension=pdo_mysql
;extension=mysqli
;extension=gd

; depois:
extension=pdo_mysql
extension=mysqli
extension=gd

; produção
display_errors = Off
log_errors = On
error_log = /var/log/php_errors.log
memory_limit = 256M
post_max_size = 64M
upload_max_filesize = 32M
max_execution_time = 60
date.timezone = America/Sao_Paulo

; OPcache (PERFORMANCE — sempre ligue em produção)
opcache.enable = 1
opcache.memory_consumption = 256
opcache.max_accelerated_files = 20000
opcache.validate_timestamps = 0`}
      />

      <TerminalBlock
        command="php -m | grep -iE 'mysql|gd|opcache'"
        output={`gd
mysqli
mysqlnd
pdo_mysql
Zend OPcache`}
      />

      <h2>6. Composer scripts</h2>

      <CodeBlock
        title="composer.json (trecho)"
        language="json"
        code={`{
    "scripts": {
        "test":       "phpunit",
        "lint":       "phpcs --standard=PSR12 src",
        "fix":        "phpcbf --standard=PSR12 src",
        "stan":       "phpstan analyse src --level=8",
        "serve":      "php -S 127.0.0.1:8000 -t public"
    }
}`}
      />

      <TerminalBlock
        command="composer serve"
        output={`> php -S 127.0.0.1:8000 -t public
[Tue Mar 25 16:35:01 2026] PHP 8.3.12 Development Server (http://127.0.0.1:8000) started`}
      />

      <h2>7. Frameworks populares (instalação rápida)</h2>

      <TerminalBlock
        comment="Laravel"
        command="composer create-project laravel/laravel meu-laravel"
        output={`Creating a "laravel/laravel" project at "./meu-laravel"
Installing laravel/laravel (v11.3.0)
  - Downloading laravel/laravel (v11.3.0)
  - Installing laravel/laravel (v11.3.0): Extracting archive
Created project in /home/user/meu-laravel
Loading composer repositories with package information
...
> @php artisan key:generate --ansi
   INFO  Application key set successfully.`}
      />

      <TerminalBlock
        comment="Symfony skeleton"
        command="composer create-project symfony/skeleton meu-symfony"
      />

      <h2>8. Diagnóstico</h2>

      <TerminalBlock
        comment="grava info detalhada (apenas em ambiente isolado!)"
        command={`php -r 'phpinfo();' | head -30`}
        output={`phpinfo()
PHP Version => 8.3.12

System => Linux archlinux 6.12.1-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64
Build Date => Sep 26 2024 14:11:18
Build System => Linux
Configuration File (php.ini) Path => /etc/php
Loaded Configuration File => /etc/php/php.ini
Scan this dir for additional .ini files => /etc/php/conf.d
PHP API => 20230831
PHP Extension => 20230831
Zend Extension => 420230831
Zend Extension Build => API420230831,NTS
PHP Extension Build => API20230831,NTS
Debug Build => no
Thread Safety => disabled`}
      />

      <TerminalBlock
        command="composer diagnose"
        output={`Checking composer.json: OK
Checking platform settings: OK
Checking git settings: OK
Checking http connectivity to packagist: OK
Checking https connectivity to packagist: OK
Checking github.com rate limit: OK
Checking disk free space: OK
Checking pubkeys: OK
Checking composer version: OK
Composer version: 2.7.7
PHP version: 8.3.12 - Package overrides can be applied`}
      />

      <h2>9. Logs</h2>

      <TerminalBlock
        command="sudo tail -f /var/log/php_errors.log"
        output={`[25-Mar-2026 16:42:11 America/Sao_Paulo] PHP Warning:  Undefined variable $foo in /srv/http/blog/index.php on line 12
[25-Mar-2026 16:42:18 America/Sao_Paulo] PHP Fatal error:  Uncaught TypeError: ...`}
      />

      <TerminalBlock
        command="sudo journalctl -u php-fpm -n 10"
        output={`Mar 25 16:24:01 archlinux systemd[1]: Starting The PHP FastCGI Process Manager...
Mar 25 16:24:01 archlinux php-fpm[5012]: NOTICE: fpm is running, pid 5012
Mar 25 16:24:01 archlinux php-fpm[5012]: NOTICE: ready to handle connections
Mar 25 16:24:01 archlinux systemd[1]: Started The PHP FastCGI Process Manager.`}
      />

      <AlertBox type="success" title="Stack moderna recomendada">
        <strong>php + composer + php-fpm + nginx</strong> — todos no repo oficial. Para PostgreSQL,
        use <code>php-pgsql</code>; para Redis, <code>php-redis</code>. Em desenvolvimento puro,
        <code> php -S</code> resolve sem precisar de servidor web nenhum.
      </AlertBox>

      <h2>Cola visual</h2>
      <OutputBlock
        title="comandos do cotidiano"
        output={`# instalação
sudo pacman -S php composer
sudo pacman -S php-fpm php-gd php-intl php-pgsql

# dev rápido
php -S 127.0.0.1:8000 -t public

# composer
composer init
composer require monolog/monolog
composer install            # respeita lock
composer dump-autoload -o   # otimizado

# php-fpm + nginx
sudo systemctl enable --now php-fpm nginx
sudo nginx -t && sudo systemctl restart nginx`}
      />
    </PageContainer>
  );
}
