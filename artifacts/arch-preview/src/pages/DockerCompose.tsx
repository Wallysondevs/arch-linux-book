import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function DockerCompose() {
  return (
    <PageContainer
      title="Docker Compose"
      subtitle="Orquestrando múltiplos containers com um único arquivo YAML — pilhas LAMP, Postgres+Adminer, app+cache e muito mais."
      difficulty="intermediario"
      timeToRead="35 min"
      category="Containers"
    >
      <p>
        <strong>Docker Compose</strong> resolve o problema de digitar 5 <code>docker run</code>{" "}
        encadeados toda vez que sobe um stack. Você descreve services, redes e volumes em um{" "}
        <code>compose.yaml</code> (ou <code>docker-compose.yml</code>) e roda{" "}
        <code>docker compose up -d</code>. No Arch, instale com{" "}
        <code>sudo pacman -S docker-compose</code> — é um plugin do Docker CLI moderno
        (<code>docker compose</code>, sem hífen).
      </p>

      <AlertBox type="info" title="docker-compose vs docker compose">
        O comando antigo <code>docker-compose</code> (Python, v1) está deprecated. Hoje use{" "}
        <code>docker compose</code> (Go, v2, plugin do CLI). No Arch o pacote{" "}
        <code>docker-compose</code> instala o binário plugin já como v2.
      </AlertBox>

      <h2>1. Verificar instalação</h2>

      <TerminalBlock
        command="docker compose version"
        output={`Docker Compose version v2.29.7`}
      />

      <h2>2. Anatomia de um compose.yaml</h2>

      <CodeBlock
        title="compose.yaml — estrutura básica"
        language="yaml"
        code={`services:               # cada chave aqui é um container
  nome:
    image: org/img:tag    # imagem do registry, OU
    build: ./path         # diretório com Dockerfile
    ports:
      - "host:container"
    volumes:
      - "src:dst"
    environment:
      VAR: valor
    depends_on:
      - outro_service
    networks:
      - rede1
    restart: unless-stopped

volumes:                   # volumes nomeados
  meuvol:

networks:                  # redes user-defined
  rede1:`}
      />

      <h2>3. Stack LAMP — Apache + PHP + MariaDB</h2>

      <CodeBlock
        title="lamp/compose.yaml"
        language="yaml"
        code={`services:
  web:
    image: php:8.3-apache
    ports:
      - "8080:80"
    volumes:
      - ./html:/var/www/html
    depends_on:
      - db
    networks:
      - lamp

  db:
    image: mariadb:11
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: rootpw
      MYSQL_DATABASE: meusite
      MYSQL_USER: webuser
      MYSQL_PASSWORD: webpw
    volumes:
      - dbdata:/var/lib/mysql
    networks:
      - lamp

  pma:
    image: phpmyadmin:latest
    ports:
      - "8081:80"
    environment:
      PMA_HOST: db
      PMA_USER: root
      PMA_PASSWORD: rootpw
    depends_on:
      - db
    networks:
      - lamp

volumes:
  dbdata:

networks:
  lamp:`}
      />

      <TerminalBlock
        comment="-d sobe em background; cria rede e volumes automaticamente"
        command="docker compose up -d"
        output={`[+] Running 7/7
 ✔ Network lamp_lamp     Created                                                              0.1s
 ✔ Volume "lamp_dbdata"  Created                                                              0.0s
 ✔ web Pulled                                                                                 8.4s
 ✔ db Pulled                                                                                  6.2s
 ✔ pma Pulled                                                                                 5.1s
 ✔ Container lamp-db-1   Started                                                              0.7s
 ✔ Container lamp-web-1  Started                                                              0.4s
 ✔ Container lamp-pma-1  Started                                                              0.4s`}
      />

      <TerminalBlock
        command="docker compose ps"
        output={`NAME          IMAGE                COMMAND                  SERVICE   CREATED          STATUS          PORTS
lamp-db-1     mariadb:11           "docker-entrypoint.s…"   db        18 seconds ago   Up 17 seconds   3306/tcp
lamp-pma-1    phpmyadmin:latest    "/docker-entrypoint.…"   pma       18 seconds ago   Up 17 seconds   0.0.0.0:8081->80/tcp
lamp-web-1    php:8.3-apache       "docker-php-entrypoi…"   web       18 seconds ago   Up 17 seconds   0.0.0.0:8080->80/tcp`}
      />

      <h2>4. Comandos do compose</h2>

      <CommandFlagList
        command="docker compose"
        items={[
          { flag: "up", description: "Cria e inicia tudo. -d = detached, --build = força rebuild.", example: "docker compose up -d --build" },
          { flag: "down", description: "Para e remove containers + redes. -v também remove volumes.", example: "docker compose down -v" },
          { flag: "ps", description: "Status dos services do projeto." },
          { flag: "logs", description: "Logs de todos. -f segue, --tail N limita.", example: "docker compose logs -f web" },
          { flag: "exec", description: "Roda comando em service rodando.", example: "docker compose exec db mysql -u root -p" },
          { flag: "run", description: "Roda comando em NOVO container (descartável).", example: "docker compose run --rm web bash" },
          { flag: "build", description: "Rebuilda services com `build:`.", example: "docker compose build --no-cache" },
          { flag: "pull", description: "Atualiza imagens." },
          { flag: "restart", description: "Reinicia services." },
          { flag: "stop / start", description: "Para/inicia sem remover." },
          { flag: "config", description: "Valida e expande o YAML (mostra resultado final)." },
          { flag: "top", description: "ps dentro de cada container do projeto." },
        ]}
      />

      <TerminalBlock
        command="docker compose logs -f --tail 5 db"
        output={`db-1  | 2026-03-20 14:48:11+00:00 [Note] [Entrypoint]: Initializing database files
db-1  | 2026-03-20 14:48:14 0 [Note] mariadbd: ready for connections.
db-1  | 2026-03-20 14:48:14 0 [Note] Version: '11.5.2-MariaDB'  socket: '/run/mysqld/mysqld.sock'  port: 3306
db-1  | 2026-03-20 14:48:42 8 [Note] Aborted connection 8 to db: 'meusite' user: 'webuser'
db-1  | 2026-03-20 14:48:43 9 [Note] Connection accepted from 172.18.0.4`}
      />

      <h2>5. Stack Postgres + Adminer (dev local)</h2>

      <CodeBlock
        title="dev/compose.yaml"
        language="yaml"
        code={`services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: appdb
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev -d appdb"]
      interval: 5s
      timeout: 3s
      retries: 5

  adminer:
    image: adminer:latest
    ports:
      - "8088:8080"
    environment:
      ADMINER_DEFAULT_SERVER: postgres
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  pgdata:`}
      />

      <TerminalBlock
        command="docker compose up -d && docker compose logs -f postgres | head -8"
        output={`[+] Running 4/4
 ✔ Network dev_default      Created
 ✔ Volume "dev_pgdata"      Created
 ✔ Container dev-postgres-1 Started
 ✔ Container dev-adminer-1  Started

postgres-1  | The files belonging to this database system will be owned by user "postgres".
postgres-1  | This user must also own the server process.
postgres-1  | Data page checksums are disabled.
postgres-1  | initdb: warning: enabling "trust" authentication for local connections
postgres-1  | running bootstrap script ... ok
postgres-1  | performing post-bootstrap initialization ... ok
postgres-1  | 2026-03-20 14:55:11.842 UTC [1] LOG:  database system is ready to accept connections
postgres-1  | /usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/init.sql`}
      />

      <h2>6. Build local + variáveis com .env</h2>

      <CodeBlock
        title="app/Dockerfile"
        language="dockerfile"
        code={`FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`}
      />

      <CodeBlock
        title=".env (mesma pasta do compose.yaml)"
        code={`POSTGRES_PASSWORD=supersecret
APP_PORT=3000
NODE_ENV=production`}
      />

      <CodeBlock
        title="compose.yaml com substituição"
        language="yaml"
        code={`services:
  api:
    build: ./app
    ports:
      - "\${APP_PORT}:3000"
    environment:
      NODE_ENV: \${NODE_ENV}
      DATABASE_URL: postgres://dev:\${POSTGRES_PASSWORD}@db:5432/app
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`}
      />

      <TerminalBlock
        command="docker compose config | head -20"
        output={`name: app
services:
  api:
    build:
      context: /home/user/app
      dockerfile: Dockerfile
    depends_on:
      db:
        condition: service_started
        required: true
    environment:
      DATABASE_URL: postgres://dev:supersecret@db:5432/app
      NODE_ENV: production
    networks:
      default: null
    ports:
      - mode: ingress
        target: 3000
        published: "3000"
        protocol: tcp`}
      />

      <h2>7. Profiles — services opcionais</h2>

      <CodeBlock
        title="profiles para subir só o necessário"
        language="yaml"
        code={`services:
  app:
    image: myapp:1.0
    ports: ["3000:3000"]

  redis:
    image: redis:alpine
    profiles: ["cache"]      # só sobe com --profile cache

  prometheus:
    image: prom/prometheus
    profiles: ["monitoring"]

  grafana:
    image: grafana/grafana
    profiles: ["monitoring"]`}
      />

      <TerminalBlock
        command="docker compose --profile monitoring up -d"
        output={`[+] Running 3/3
 ✔ Container app-app-1         Started
 ✔ Container app-prometheus-1  Started
 ✔ Container app-grafana-1     Started`}
      />

      <h2>8. Override files (dev vs prod)</h2>

      <p>
        O Compose carrega <code>compose.yaml</code> + <code>compose.override.yaml</code>{" "}
        automaticamente, fundindo as configurações. Use isso para sobrescrever em dev:
      </p>

      <CodeBlock
        title="compose.override.yaml (apenas em dev)"
        language="yaml"
        code={`services:
  api:
    volumes:
      - ./app:/app                    # bind mount p/ hot reload
    command: ["npm", "run", "dev"]    # nodemon
    environment:
      NODE_ENV: development
      DEBUG: "*"`}
      />

      <TerminalBlock
        comment="em produção, use só o base file"
        command="docker compose -f compose.yaml up -d"
        output=""
      />

      <h2>9. Healthchecks e depends_on com condition</h2>

      <CodeBlock
        title="garantir que DB está PRONTO antes de subir API"
        language="yaml"
        code={`services:
  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s

  api:
    image: myapi
    depends_on:
      db:
        condition: service_healthy   # espera HEALTHCHECK retornar OK`}
      />

      <TerminalBlock
        command="docker compose ps"
        output={`NAME      IMAGE                 COMMAND                  SERVICE   STATUS                   PORTS
app-db-1  postgres:16-alpine    "docker-entrypoint.s…"   db        Up 8 seconds (healthy)   5432/tcp
app-api-1 myapi                 "node server.js"         api       Up 2 seconds             0.0.0.0:3000->3000/tcp`}
      />

      <h2>10. Networking entre services</h2>

      <p>
        Cada projeto Compose cria uma rede default chamada{" "}
        <code>{`<projeto>_default`}</code>. Dentro dela, services se acham por nome:{" "}
        <code>http://api:3000</code>, <code>db:5432</code>, etc. Use redes nomeadas para
        segmentação fina:
      </p>

      <CodeBlock
        title="multi-redes — frontend e backend isolados"
        language="yaml"
        code={`services:
  web:
    image: nginx
    networks: [front]

  api:
    image: myapi
    networks: [front, back]   # bridge entre frontend e backend

  db:
    image: postgres:16
    networks: [back]          # banco SÓ na rede interna

networks:
  front:
  back:
    internal: true            # sem acesso à internet`}
      />

      <h2>11. Limpeza</h2>

      <TerminalBlock
        comment="para tudo, remove containers e redes (mantém volumes!)"
        command="docker compose down"
        output={`[+] Running 4/4
 ✔ Container lamp-web-1  Removed
 ✔ Container lamp-pma-1  Removed
 ✔ Container lamp-db-1   Removed
 ✔ Network lamp_lamp     Removed`}
      />

      <TerminalBlock
        comment="-v também remove volumes (apaga dados!)"
        command="docker compose down -v"
        output={`[+] Running 5/5
 ✔ Container lamp-web-1  Removed
 ✔ Container lamp-pma-1  Removed
 ✔ Container lamp-db-1   Removed
 ✔ Volume lamp_dbdata    Removed
 ✔ Network lamp_lamp     Removed`}
      />

      <AlertBox type="warning" title="Cuidado com -v">
        <code>docker compose down -v</code> apaga volumes nomeados — todos os dados de DBs vão
        embora. Em produção, NUNCA. Em dev, é a forma mais rápida de "começar do zero".
      </AlertBox>

      <h2>12. Cola visual</h2>

      <OutputBlock
        title="comandos do dia-a-dia"
        output={`docker compose up -d              sobe tudo em background
docker compose up -d --build      reconstrói imagens antes
docker compose down               para e remove (mantém volumes)
docker compose down -v            também remove volumes
docker compose ps                 status
docker compose logs -f svc        segue logs de um service
docker compose exec svc bash      shell em service vivo
docker compose run --rm svc cmd   roda comando em container novo
docker compose restart svc        reinicia
docker compose pull               atualiza imagens
docker compose config             valida + mostra YAML expandido
docker compose --profile X up     ativa profile`}
      />
    </PageContainer>
  );
}
