import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function MySQL() {
  return (
    <PageContainer
      title="MySQL / MariaDB no Arch"
      subtitle="No Arch, 'mysql' é na verdade o MariaDB. Veja como instalar, inicializar, securizar, criar bancos e fazer backup."
      difficulty="intermediario"
      timeToRead="35 min"
      category="Bancos de Dados"
    >
      <AlertBox type="info" title="MySQL ou MariaDB?">
        O repositório oficial do Arch <strong>não traz MySQL</strong> — traz o{" "}
        <strong>MariaDB</strong>, fork drop-in compatível mantido pelos criadores originais do MySQL.
        Se você precisar do MySQL "puro" da Oracle, use o pacote <code>mysql</code> do AUR
        (<code>yay -S mysql</code>). Para 99% dos casos, MariaDB resolve.
      </AlertBox>

      <h2>1. Instalação do MariaDB</h2>

      <TerminalBlock
        command="sudo pacman -S mariadb"
        output={`resolving dependencies...
Packages (2) mariadb-libs-11.4.3-1  mariadb-11.4.3-1

Total Download Size:    27.81 MiB
Total Installed Size:  207.42 MiB

:: Proceed with installation? [Y/n] y
(2/2) installing mariadb                           [######################] 100%
==> Before running mariadb you should run mariadb-install-db --user=mysql ...`}
      />

      <TerminalBlock
        command="mariadb --version"
        output="mariadb  Ver 15.1 Distrib 11.4.3-MariaDB, for Linux (x86_64) using readline 5.1"
      />

      <h2>2. Inicializando o data directory</h2>

      <TerminalBlock
        command="sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql"
        output={`Installing MariaDB/MySQL system tables in '/var/lib/mysql' ...
OK

To start mariadbd at boot time you have to copy
support-files/mariadb.service to the right place for your system

PLEASE REMEMBER TO SET A PASSWORD FOR THE MariaDB root USER !
To do so, start the server, then issue the following commands:

'/usr/bin/mariadb-secure-installation'

which will also give you the option of removing the test
databases and anonymous user created by default. This is
strongly recommended for production servers.

The latest information about MariaDB is available at https://mariadb.org/.

Consider joining MariaDB's strong and vibrant community:
https://mariadb.org/get-involved/`}
      />

      <h2>3. Iniciando o serviço</h2>

      <TerminalBlock
        command="sudo systemctl enable --now mariadb"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/mariadb.service → /usr/lib/systemd/system/mariadb.service.`}
      />

      <TerminalBlock
        command="systemctl status mariadb --no-pager"
        output={`{g}● mariadb.service{/} - MariaDB 11.4.3 database server
     Loaded: loaded (/usr/lib/systemd/system/mariadb.service; enabled; preset: disabled)
     Active: {g}active (running){/} since Tue 2026-03-25 15:42:11 -03; 6s ago
   Main PID: 4912 (mariadbd)
     Status: "Taking your SQL requests now..."
      Tasks: 12 (limit: 38389)
     Memory: 84.2M
        CPU: 312ms
     CGroup: /system.slice/mariadb.service
             └─4912 /usr/bin/mariadbd

Mar 25 15:42:11 archlinux mariadbd[4912]: 2026-03-25 15:42:11 0 [Note] /usr/bin/mariadbd: ready for connections.
Mar 25 15:42:11 archlinux mariadbd[4912]: Version: '11.4.3-MariaDB'  socket: '/run/mysqld/mysqld.sock'  port: 3306`}
      />

      <h2>4. Securizando — mariadb-secure-installation</h2>

      <p>
        Roteiro interativo que define a senha de root, remove usuários anônimos, desabilita login
        remoto de root e remove o banco <code>test</code>. <strong>Sempre rode</strong> em qualquer
        instalação nova.
      </p>

      <TerminalBlock
        command="sudo mariadb-secure-installation"
        output={`NOTE: RUNNING ALL PARTS OF THIS SCRIPT IS RECOMMENDED FOR ALL MariaDB
      SERVERS IN PRODUCTION USE!  PLEASE READ EACH STEP CAREFULLY!

In order to log into MariaDB to secure it, we'll need the current
password for the root user. If you've just installed MariaDB, and
haven't set the root password yet, you should just press enter here.

Enter current password for root (enter for none): {dim}<Enter>{/}
OK, successfully used password, moving on...

Switch to unix_socket authentication [Y/n] {y}Y{/}
Enabled successfully!

Change the root password? [Y/n] {y}Y{/}
New password: ********
Re-enter new password: ********
Password updated successfully!

Remove anonymous users? [Y/n] {y}Y{/}      ... Success.
Disallow root login remotely? [Y/n] {y}Y{/} ... Success.
Remove test database? [Y/n] {y}Y{/}        ... Success.
Reload privilege tables now? [Y/n] {y}Y{/}  ... Success.

Cleaning up...

All done!  If you've completed all of the above steps, your MariaDB
installation should now be secure.

Thanks for using MariaDB!`}
      />

      <h2>5. Conectando com o cliente</h2>

      <TerminalBlock
        comment="auth via unix_socket: como root do SO, entra direto"
        command="sudo mariadb"
        output={`Welcome to the MariaDB monitor.  Commands end with ; or \\g.
Your MariaDB connection id is 8
Server version: 11.4.3-MariaDB

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\\h' for help. Type '\\c' to clear the current input statement.

MariaDB [(none)]>`}
      />

      <CommandFlagList
        command="mariadb (cliente)"
        items={[
          { flag: "-u USER", description: "Usuário SQL.", example: "mariadb -u joao -p" },
          { flag: "-p", description: "Pede senha (sem espaço se passar inline: -psenha)." },
          { flag: "-h HOST", description: "Conecta a outro servidor (default localhost)." },
          { flag: "-P PORT", description: "Porta (default 3306)." },
          { flag: "-D BANCO", description: "USE BANCO automaticamente." },
          { flag: "-e SQL", description: "Executa um único SQL e sai (script-friendly)." },
          { flag: "--ssl", description: "Força conexão TLS." },
          { flag: "-t", description: "Saída em formato tabela (default no terminal interativo)." },
        ]}
      />

      <h2>6. Criando usuário e banco</h2>

      <CodeBlock
        title="comandos SQL"
        language="sql"
        code={`-- novo banco
CREATE DATABASE loja CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- novo usuário (host '%' = qualquer IP; 'localhost' = só local)
CREATE USER 'app'@'localhost' IDENTIFIED BY 'senha_super_forte';

-- permissões
GRANT ALL PRIVILEGES ON loja.* TO 'app'@'localhost';
FLUSH PRIVILEGES;

-- conferir
SHOW GRANTS FOR 'app'@'localhost';`}
      />

      <TerminalBlock
        command={`MariaDB [(none)]> SHOW DATABASES;`}
        output={`+--------------------+
| Database           |
+--------------------+
| information_schema |
| loja               |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.001 sec)`}
      />

      <TerminalBlock
        command={`MariaDB [(none)]> SELECT user, host, plugin FROM mysql.user;`}
        output={`+-------------+-----------+-----------------------+
| user        | host      | plugin                |
+-------------+-----------+-----------------------+
| app         | localhost | mysql_native_password |
| mariadb.sys | localhost | mysql_native_password |
| root        | localhost | unix_socket           |
+-------------+-----------+-----------------------+`}
      />

      <h2>7. CRUD básico</h2>

      <CodeBlock
        title="schema + dados (loja.sql)"
        language="sql"
        code={`USE loja;

CREATE TABLE produtos (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(120) NOT NULL,
    preco       DECIMAL(10,2) NOT NULL,
    estoque     INT NOT NULL DEFAULT 0,
    criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nome (nome)
) ENGINE=InnoDB;

INSERT INTO produtos (nome, preco, estoque) VALUES
  ('Teclado Mecânico ABNT2', 320.00, 14),
  ('Mouse 16K DPI',          189.90, 32),
  ('Mousepad XL',             79.90, 50);`}
      />

      <TerminalBlock
        command={`mariadb -u app -p loja < loja.sql`}
        output="Enter password:"
      />

      <TerminalBlock
        command={`mariadb -u app -p loja -e "SELECT id, nome, preco FROM produtos ORDER BY preco DESC;"`}
        output={`+----+------------------------+--------+
| id | nome                   | preco  |
+----+------------------------+--------+
|  1 | Teclado Mecânico ABNT2 | 320.00 |
|  2 | Mouse 16K DPI          | 189.90 |
|  3 | Mousepad XL            |  79.90 |
+----+------------------------+--------+`}
      />

      <h2>8. Configuração — /etc/my.cnf.d/</h2>

      <p>
        No Arch, o arquivo principal é <code>/etc/my.cnf</code>, que faz <code>!includedir</code> de
        <code> /etc/my.cnf.d/</code>. Crie seus overrides ali.
      </p>

      <CodeBlock
        title="/etc/my.cnf.d/server.cnf"
        language="ini"
        code={`[mariadb]
bind-address           = 127.0.0.1
character-set-server   = utf8mb4
collation-server       = utf8mb4_unicode_ci
max_connections        = 200
innodb_buffer_pool_size = 1G
slow_query_log         = 1
slow_query_log_file    = /var/log/mariadb/slow.log
long_query_time        = 1`}
      />

      <TerminalBlock command="sudo systemctl restart mariadb" />

      <h2>9. Backup com mysqldump</h2>

      <TerminalBlock
        command={`mariadb-dump -u root -p --single-transaction --routines --triggers loja > loja-$(date +%F).sql`}
        output="Enter password:"
      />

      <CommandFlagList
        command="mariadb-dump"
        items={[
          { flag: "--all-databases", description: "Despeja TODOS os bancos." },
          { flag: "--single-transaction", description: "Snapshot consistente sem lock (InnoDB)." },
          { flag: "--routines", description: "Inclui stored procedures e funções." },
          { flag: "--triggers", description: "Inclui triggers (default true)." },
          { flag: "--events", description: "Inclui scheduled events." },
          { flag: "--no-data", description: "Apenas DDL (schema)." },
          { flag: "--where=COND", description: "Exporta só linhas que casam.", example: "--where='criado_em > NOW()-INTERVAL 7 DAY'" },
          { flag: "--master-data=2", description: "Comentário com posição binlog (replicação)." },
        ]}
      />

      <TerminalBlock
        comment="restaurar é só pipe pro cliente"
        command="mariadb -u root -p loja_restore < loja-2026-03-25.sql"
      />

      <TerminalBlock
        comment="comprimir on-the-fly"
        command={`mariadb-dump -u root -p loja | zstd -19 -o loja.sql.zst`}
      />

      <h2>10. Monitoramento básico</h2>

      <TerminalBlock
        command={`MariaDB [(none)]> SHOW PROCESSLIST;`}
        output={`+----+------+-----------+------+---------+------+----------+------------------+
| Id | User | Host      | db   | Command | Time | State    | Info             |
+----+------+-----------+------+---------+------+----------+------------------+
|  8 | root | localhost | loja | Query   |    0 | starting | SHOW PROCESSLIST |
+----+------+-----------+------+---------+------+----------+------------------+`}
      />

      <TerminalBlock
        command={`MariaDB [(none)]> SHOW STATUS LIKE 'Threads_%';`}
        output={`+-------------------+-------+
| Variable_name     | Value |
+-------------------+-------+
| Threads_cached    | 0     |
| Threads_connected | 1     |
| Threads_created   | 1     |
| Threads_running   | 1     |
+-------------------+-------+`}
      />

      <TerminalBlock
        command={`MariaDB [loja]> EXPLAIN SELECT * FROM produtos WHERE nome LIKE 'Mouse%';`}
        output={`+------+-------------+----------+-------+----------+----------+----------------------+
| id   | select_type | table    | type  | key      | rows     | Extra                |
+------+-------------+----------+-------+----------+----------+----------------------+
|    1 | SIMPLE      | produtos | range | idx_nome |        2 | Using index condition|
+------+-------------+----------+-------+----------+----------+----------------------+`}
      />

      <h2>11. Logs</h2>

      <TerminalBlock
        command="sudo journalctl -u mariadb -n 10 --no-pager"
        output={`Mar 25 15:42:11 archlinux systemd[1]: Starting MariaDB 11.4.3 database server...
Mar 25 15:42:11 archlinux mariadbd[4912]: 2026-03-25 15:42:11 0 [Note] InnoDB: Buffer pool(s) load completed at 154211
Mar 25 15:42:11 archlinux mariadbd[4912]: 2026-03-25 15:42:11 0 [Note] /usr/bin/mariadbd: ready for connections.
Mar 25 15:42:11 archlinux systemd[1]: Started MariaDB 11.4.3 database server.`}
      />

      <AlertBox type="warning" title="Sempre faça backup ANTES de upgrade">
        Quando o pacote <code>mariadb</code> sobe de versão (ex: 11.4 → 11.6), rode{" "}
        <code>sudo mariadb-upgrade -u root -p</code> após o restart. Esse comando atualiza tabelas de
        sistema. Se algo quebrar, o backup é seu único amigo.
      </AlertBox>

      <h2>Cola visual</h2>
      <OutputBlock
        title="comandos de produção"
        output={`# instalação
sudo pacman -S mariadb
sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
sudo systemctl enable --now mariadb
sudo mariadb-secure-installation

# acesso
sudo mariadb                 # via socket (sem senha)
mariadb -u app -p loja       # remoto/usuário comum

# criar
CREATE DATABASE x CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'a'@'localhost' IDENTIFIED BY 'pwd';
GRANT ALL ON x.* TO 'a'@'localhost'; FLUSH PRIVILEGES;

# backup / restore
mariadb-dump --single-transaction -u root -p x > x.sql
mariadb -u root -p x < x.sql`}
      />
    </PageContainer>
  );
}
