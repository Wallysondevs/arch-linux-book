import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function PostgreSQL() {
  return (
    <PageContainer
      title="PostgreSQL no Arch"
      subtitle="Instalar, inicializar o cluster, configurar autenticação, criar bancos, fazer backup e restaurar — tudo com saída real."
      difficulty="intermediario"
      timeToRead="40 min"
      category="Bancos de Dados"
    >
      <p>
        O <strong>PostgreSQL</strong> é o SGBD relacional mais avançado do ecossistema livre — usado por
        grandes empresas e projetos open source. No Arch, o pacote oficial é <code>postgresql</code>{" "}
        (servidor + cliente <code>psql</code>). Ao contrário do Debian/Ubuntu, <strong>não há
        inicialização automática do cluster</strong>: você roda <code>initdb</code> manualmente.
      </p>

      <AlertBox type="info" title="O essencial em 5 linhas">
        <code>sudo pacman -S postgresql</code> →
        <code> sudo -iu postgres initdb -D /var/lib/postgres/data --locale=pt_BR.UTF-8 -E UTF8</code> →
        <code> sudo systemctl enable --now postgresql</code> →
        <code> sudo -u postgres psql</code>.
      </AlertBox>

      <h2>1. Instalação</h2>

      <TerminalBlock
        command="sudo pacman -S postgresql"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (2) postgresql-libs-16.4-1  postgresql-16.4-1

Total Download Size:    20.18 MiB
Total Installed Size:   97.42 MiB

:: Proceed with installation? [Y/n] y
(2/2) installing postgresql                        [######################] 100%
==> The default user is now 'postgres'. To use it, run:
        sudo -iu postgres
==> You must initialize a database before starting postgresql.
        See: https://wiki.archlinux.org/title/PostgreSQL`}
      />

      <TerminalBlock
        command="psql --version"
        output="psql (PostgreSQL) 16.4"
      />

      <TerminalBlock
        comment="o pacote criou o usuário/grupo postgres com home /var/lib/postgres"
        command="getent passwd postgres"
        output="postgres:x:88:88:PostgreSQL user:/var/lib/postgres:/bin/bash"
      />

      <h2>2. Inicializando o cluster (initdb)</h2>

      <p>
        Tudo precisa rodar <strong>como o usuário postgres</strong>. Use <code>sudo -iu postgres</code>{" "}
        para abrir um shell com o ambiente correto.
      </p>

      <TerminalBlock
        command={`sudo -iu postgres initdb -D /var/lib/postgres/data --locale=pt_BR.UTF-8 -E UTF8`}
        output={`The files belonging to this database system will be owned by user "postgres".
This user must also own the server process.

The database cluster will be initialized with locale "pt_BR.UTF-8".
The default text search configuration will be set to "portuguese".

Data page checksums are disabled.

creating directory /var/lib/postgres/data ... ok
creating subdirectories ... ok
selecting dynamic shared memory implementation ... posix
selecting default max_connections ... 100
selecting default shared_buffers ... 128MB
selecting default time zone ... America/Sao_Paulo
creating configuration files ... ok
running bootstrap script ... ok
performing post-bootstrap initialization ... ok
syncing data to disk ... ok

initdb: warning: enabling "trust" authentication for local connections
You can change this by editing pg_hba.conf or using the option -A, or
--auth-local and --auth-host, the next time you run initdb.

Success. You can now start the database server using:

    pg_ctl -D /var/lib/postgres/data -l logfile start`}
      />

      <CommandFlagList
        command="initdb"
        items={[
          { flag: "-D DIR", long: "--pgdata=DIR", description: "Diretório do cluster (no Arch, /var/lib/postgres/data)." },
          { flag: "-E ENC", long: "--encoding=ENC", description: "Encoding (sempre UTF8 hoje em dia)." },
          { flag: "--locale=LOC", description: "Locale para colação e formato (pt_BR.UTF-8)." },
          { flag: "-A METHOD", long: "--auth=METHOD", description: "Método padrão (md5, scram-sha-256, peer, trust)." },
          { flag: "-W", long: "--pwprompt", description: "Pede senha para o superuser na criação." },
          { flag: "--data-checksums", description: "Habilita checksums de página (recomendado em SSD)." },
        ]}
      />

      <h2>3. Subindo o serviço</h2>

      <TerminalBlock
        command="sudo systemctl enable --now postgresql"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/postgresql.service → /usr/lib/systemd/system/postgresql.service.`}
      />

      <TerminalBlock
        command="systemctl status postgresql --no-pager"
        output={`{g}● postgresql.service{/} - PostgreSQL database server
     Loaded: loaded (/usr/lib/systemd/system/postgresql.service; enabled; preset: disabled)
     Active: {g}active (running){/} since Tue 2026-03-25 15:01:14 -03; 8s ago
   Main PID: 4218 (postgres)
      Tasks: 7 (limit: 38389)
     Memory: 21.4M
        CPU: 184ms
     CGroup: /system.slice/postgresql.service
             ├─4218 /usr/bin/postgres -D /var/lib/postgres/data
             ├─4220 "postgres: checkpointer"
             ├─4221 "postgres: background writer"
             ├─4223 "postgres: walwriter"
             ├─4224 "postgres: autovacuum launcher"
             ├─4225 "postgres: logical replication launcher"
             └─4226 "postgres: logger"

Mar 25 15:01:14 archlinux postgres[4218]: starting PostgreSQL 16.4
Mar 25 15:01:14 archlinux postgres[4218]: listening on IPv4 address "127.0.0.1", port 5432
Mar 25 15:01:14 archlinux postgres[4218]: listening on Unix socket "/run/postgresql/.s.PGSQL.5432"
Mar 25 15:01:14 archlinux postgres[4218]: database system is ready to accept connections`}
      />

      <h2>4. Primeiro acesso com psql</h2>

      <TerminalBlock
        comment="o usuário postgres tem acesso 'peer' por default"
        command="sudo -u postgres psql"
        output={`psql (16.4)
Type "help" for help.

postgres=#`}
      />

      <TerminalBlock
        command={`postgres=# \\l`}
        output={`                                                List of databases
   Name    |  Owner   | Encoding | Locale Provider |   Collate   |    Ctype    | ICU Locale | ICU Rules |   Access privileges
-----------+----------+----------+-----------------+-------------+-------------+------------+-----------+-----------------------
 postgres  | postgres | UTF8     | libc            | pt_BR.UTF-8 | pt_BR.UTF-8 |            |           |
 template0 | postgres | UTF8     | libc            | pt_BR.UTF-8 | pt_BR.UTF-8 |            |           | =c/postgres          +
           |          |          |                 |             |             |            |           | postgres=CTc/postgres
 template1 | postgres | UTF8     | libc            | pt_BR.UTF-8 | pt_BR.UTF-8 |            |           | =c/postgres          +
           |          |          |                 |             |             |            |           | postgres=CTc/postgres
(3 rows)`}
      />

      <CommandFlagList
        command="psql (meta-comandos)"
        items={[
          { flag: "\\l", description: "Lista bancos de dados." },
          { flag: "\\c BANCO", description: "Conecta a outro banco." },
          { flag: "\\dt", description: "Lista tabelas do schema atual." },
          { flag: "\\d TABELA", description: "Descreve colunas, índices e constraints." },
          { flag: "\\du", description: "Lista roles (usuários) e permissões." },
          { flag: "\\dn", description: "Lista schemas." },
          { flag: "\\df", description: "Lista funções." },
          { flag: "\\x", description: "Alterna 'expanded display' (uma coluna por linha)." },
          { flag: "\\timing", description: "Liga/desliga medição de tempo de cada query." },
          { flag: "\\i ARQ.sql", description: "Executa um script SQL." },
          { flag: "\\q", description: "Sai do psql." },
        ]}
      />

      <h2>5. Criando usuário e banco</h2>

      <TerminalBlock
        command={`postgres=# CREATE ROLE joao WITH LOGIN PASSWORD 'segredo123' CREATEDB;`}
        output="CREATE ROLE"
      />

      <TerminalBlock
        command={`postgres=# CREATE DATABASE blog OWNER joao ENCODING 'UTF8';`}
        output="CREATE DATABASE"
      />

      <TerminalBlock
        comment="ferramentas de linha de comando equivalem a SQL"
        command="sudo -u postgres createuser --interactive --pwprompt"
        output={`Enter name of role to add: maria
Enter password for new role:
Enter it again:
Shall the new role be a superuser? (y/n) n
Shall the new role be allowed to create databases? (y/n) y
Shall the new role be allowed to create more new roles? (y/n) n`}
      />

      <TerminalBlock
        command="sudo -u postgres createdb -O maria loja"
      />

      <TerminalBlock
        command="sudo -u postgres psql -c '\\du'"
        output={`                              List of roles
 Role name |                         Attributes
-----------+------------------------------------------------------------
 joao      | Create DB
 maria     | Create DB
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS`}
      />

      <h2>6. Autenticação (pg_hba.conf)</h2>

      <p>
        O arquivo <code>/var/lib/postgres/data/pg_hba.conf</code> controla{" "}
        <strong>quem pode conectar de onde, por qual método</strong>. Por padrão é tudo{" "}
        <code>trust</code>/<code>peer</code> — bom para localhost, péssimo para produção.
      </p>

      <CodeBlock
        title="/var/lib/postgres/data/pg_hba.conf — exemplo seguro"
        language="conf"
        code={`# TYPE  DATABASE  USER  ADDRESS         METHOD
# sockets locais: usuário do SO bate com o role
local   all       all                   peer

# IPv4 local: senha SCRAM
host    all       all   127.0.0.1/32    scram-sha-256
host    all       all   ::1/128         scram-sha-256

# rede privada: só app_user no banco app_db
host    app_db    app_user 192.168.0.0/24  scram-sha-256

# tudo o resto na rede: NEGADO
host    all       all   0.0.0.0/0       reject`}
      />

      <TerminalBlock
        comment="depois de editar, recarregue (sem derrubar conexões)"
        command="sudo systemctl reload postgresql"
      />

      <AlertBox type="warning" title="Cuide do listen_addresses">
        Por padrão o Postgres só escuta em <code>localhost</code>. Para aceitar conexões externas,
        edite <code>postgresql.conf</code>: <code>listen_addresses = '*'</code> (e abra a porta 5432
        no firewall com <code>sudo ufw allow 5432/tcp</code>). Sem isso, o pg_hba.conf nem é consultado.
      </AlertBox>

      <h2>7. SQL básico — uma sessão completa</h2>

      <TerminalBlock
        command={`psql -U joao -d blog -h 127.0.0.1`}
        output={`Password for user joao:
psql (16.4)
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, ...)
Type "help" for help.

blog=>`}
      />

      <CodeBlock
        title="schema + dados"
        language="sql"
        code={`CREATE TABLE posts (
    id        SERIAL PRIMARY KEY,
    title     TEXT NOT NULL,
    body      TEXT,
    author    TEXT NOT NULL,
    created   TIMESTAMPTZ DEFAULT now(),
    published BOOLEAN DEFAULT false
);

INSERT INTO posts (title, body, author, published) VALUES
  ('Hello Arch',     'Primeiro post',         'joao', true),
  ('Pacman tips',    'Sobre yay e paru',      'joao', true),
  ('Rascunho',       NULL,                    'joao', false);

CREATE INDEX idx_posts_author ON posts(author);
CREATE INDEX idx_posts_pub    ON posts(published) WHERE published;`}
      />

      <TerminalBlock
        command={`blog=> SELECT id, title, published FROM posts ORDER BY created DESC;`}
        output={` id |    title    | published
----+-------------+-----------
  3 | Rascunho    | f
  2 | Pacman tips | t
  1 | Hello Arch  | t
(3 rows)`}
      />

      <TerminalBlock
        command={`blog=> EXPLAIN ANALYZE SELECT * FROM posts WHERE published;`}
        output={`                                                  QUERY PLAN
-------------------------------------------------------------------------------------------------------------
 Index Scan using idx_posts_pub on posts  (cost=0.13..8.15 rows=2 width=72) (actual time=0.022..0.024 rows=2 loops=1)
 Planning Time: 0.412 ms
 Execution Time: 0.052 ms
(3 rows)`}
      />

      <h2>8. Backup e restore</h2>

      <h3>pg_dump — um banco</h3>
      <TerminalBlock
        command="pg_dump -U joao -h 127.0.0.1 -Fc -f blog.dump blog"
        output="Password:"
      />

      <CommandFlagList
        command="pg_dump"
        items={[
          { flag: "-Fc", description: "Formato custom (compactado, restore seletivo com pg_restore)." },
          { flag: "-Fp", description: "Plain SQL (legível, restaura com psql)." },
          { flag: "-Fd", description: "Diretório (paralelo com -j)." },
          { flag: "-j N", description: "Paralelismo (apenas com -Fd)." },
          { flag: "-s", description: "Schema only (sem dados)." },
          { flag: "-a", description: "Data only (sem schema)." },
          { flag: "-t TABELA", description: "Apenas uma tabela." },
          { flag: "-n SCHEMA", description: "Apenas um schema." },
        ]}
      />

      <h3>pg_dumpall — todos os bancos + roles</h3>
      <TerminalBlock
        command="sudo -u postgres pg_dumpall -f /var/backups/pg-full-$(date +%F).sql"
      />

      <h3>Restore</h3>
      <TerminalBlock
        comment="formato custom — recria objetos, ideal pra restaurar uma tabela só"
        command="pg_restore -U postgres -d blog_novo -j 4 blog.dump"
      />

      <TerminalBlock
        comment="formato plain — basta executar com psql"
        command="psql -U postgres -d novo < dump.sql"
      />

      <h2>9. Manutenção e monitoramento</h2>

      <TerminalBlock
        command={`postgres=# SELECT pg_size_pretty(pg_database_size('blog'));`}
        output={` pg_size_pretty
----------------
 8472 kB
(1 row)`}
      />

      <TerminalBlock
        command={`postgres=# SELECT relname, n_live_tup, n_dead_tup
postgres-#   FROM pg_stat_user_tables ORDER BY n_dead_tup DESC LIMIT 5;`}
        output={` relname | n_live_tup | n_dead_tup
---------+------------+------------
 posts   |          3 |          0`}
      />

      <TerminalBlock
        comment="conexões ativas"
        command={`postgres=# SELECT pid, usename, datname, state, query
postgres-#   FROM pg_stat_activity WHERE state != 'idle';`}
        output={`  pid | usename  | datname  | state  | query
------+----------+----------+--------+--------------------------------
 4321 | postgres | postgres | active | SELECT pid, usename, datname...
(1 row)`}
      />

      <TerminalBlock
        comment="VACUUM manual + ANALYZE"
        command={`postgres=# VACUUM (VERBOSE, ANALYZE) posts;`}
        output={`INFO:  vacuuming "blog.public.posts"
INFO:  finished vacuuming "blog.public.posts": index scans: 0
pages: 0 removed, 1 remain, 1 scanned (100.00% of total)
tuples: 0 removed, 3 remain, 0 are dead but not yet removable
VACUUM`}
      />

      <h2>10. Logs</h2>

      <TerminalBlock
        command="sudo journalctl -u postgresql -n 20 --no-pager"
        output={`Mar 25 15:01:14 archlinux systemd[1]: Starting PostgreSQL database server...
Mar 25 15:01:14 archlinux postgres[4218]: starting PostgreSQL 16.4
Mar 25 15:01:14 archlinux postgres[4218]: listening on IPv4 address "127.0.0.1", port 5432
Mar 25 15:01:14 archlinux postgres[4218]: database system was shut down at 2026-03-25 14:59:32 -03
Mar 25 15:01:14 archlinux postgres[4218]: database system is ready to accept connections
Mar 25 15:01:14 archlinux systemd[1]: Started PostgreSQL database server.
Mar 25 15:14:02 archlinux postgres[4231]: connection authorized: user=joao database=blog`}
      />

      <AlertBox type="success" title="Próximos passos">
        Estude <strong>pgBouncer</strong> (pool de conexões), <strong>WAL archiving</strong> +
        <strong> Point-In-Time Recovery</strong>, replicação streaming e a extensão{" "}
        <code>pg_stat_statements</code> (incluída no pacote, basta habilitar em{" "}
        <code>shared_preload_libraries</code>).
      </AlertBox>

      <h2>Cola visual</h2>
      <OutputBlock
        title="comandos do dia-a-dia"
        output={`# instalação
sudo pacman -S postgresql
sudo -iu postgres initdb -D /var/lib/postgres/data --locale=pt_BR.UTF-8 -E UTF8
sudo systemctl enable --now postgresql

# acesso
sudo -u postgres psql

# criar role + db
CREATE ROLE app LOGIN PASSWORD 'xxx';
CREATE DATABASE app_db OWNER app;

# backup / restore
pg_dump  -Fc -f db.dump  -U app db
pg_restore -d db_novo -j 4 db.dump

# conexões / tamanho
SELECT pg_size_pretty(pg_database_size('db'));
SELECT * FROM pg_stat_activity WHERE state='active';`}
      />
    </PageContainer>
  );
}
