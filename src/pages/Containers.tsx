import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Containers() {
  return (
    <PageContainer
      title="Docker & Podman no Arch"
      subtitle="Containers no Arch Linux — instale Docker e Podman, crie imagens, gerencie redes e volumes, use Docker Compose e entenda a diferença entre os dois engines."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <h2>Docker vs Podman</h2>
      <ul>
        <li><strong>Docker</strong> — O mais popular. Usa daemon (dockerd) rodando como root. Excelente ecosystem e documentação.</li>
        <li><strong>Podman</strong> — Daemonless, rootless por padrão. Compatível com Docker CLI. Melhor segurança. Da Red Hat.</li>
      </ul>

      <h2>Instalando Docker</h2>
      <CodeBlock
        title="Instalar e configurar Docker"
        code={`# Instalar Docker e plugins
sudo pacman -S docker docker-compose docker-buildx

# Habilitar e iniciar o daemon
sudo systemctl enable docker
sudo systemctl start docker

# Adicionar usuário ao grupo docker (evita usar sudo)
sudo usermod -aG docker $USER

# IMPORTANTE: Fazer logout e login para o grupo ter efeito
# Ou usar: newgrp docker

# Verificar instalação
docker --version
docker compose version
docker info

# Testar com container hello-world
docker run hello-world`}
      />

      <h2>Comandos Essenciais Docker</h2>
      <CodeBlock
        title="Gerenciar containers"
        code={`# === Containers ===

# Baixar imagem
docker pull ubuntu:24.04
docker pull nginx:alpine
docker pull python:3.12-slim

# Listar imagens
docker images
docker image ls

# Rodar container interativo
docker run -it ubuntu:24.04 bash
docker run -it --rm ubuntu:24.04 bash  # Remove ao sair

# Rodar em background (detached)
docker run -d --name meu-nginx nginx:alpine

# Com portas mapeadas
docker run -d -p 8080:80 --name web nginx:alpine
# Agora: http://localhost:8080

# Com volume montado
docker run -d -v /host/dados:/dados:ro nginx:alpine

# Listar containers
docker ps           # Em execução
docker ps -a        # Todos (incluindo parados)

# Ver logs
docker logs meu-nginx
docker logs -f meu-nginx    # Follow (tempo real)

# Executar comando em container rodando
docker exec -it meu-nginx sh
docker exec meu-nginx ls /etc/nginx

# Parar, iniciar, remover
docker stop meu-nginx
docker start meu-nginx
docker restart meu-nginx
docker rm meu-nginx          # Remove container parado
docker rm -f meu-nginx       # Remove forçado (mesmo rodando)`}
      />

      <h2>Dockerfile</h2>
      <CodeBlock
        title="Criar imagem personalizada"
        code={`# Dockerfile para app Python/FastAPI
cat > Dockerfile << 'EOF'
# Imagem base
FROM python:3.12-slim

# Informações
LABEL maintainer="usuario@email.com"

# Diretório de trabalho
WORKDIR /app

# Copiar e instalar dependências primeiro (aproveita cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 8000

# Usuário não-root (segurança)
RUN useradd -m appuser
USER appuser

# Comando padrão
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

# Construir imagem
docker build -t minha-api:latest .
docker build -t minha-api:1.0 -f Dockerfile.prod .

# Inspecionar camadas
docker history minha-api:latest

# Rodar a imagem
docker run -d -p 8000:8000 --name api minha-api:latest`}
      />

      <h2>Docker Compose</h2>
      <CodeBlock
        title="docker-compose.yml - Orquestrar múltiplos containers"
        code={`# docker-compose.yml
version: '3.9'

services:
  # API Python
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://user:pass@db:5432/mydb
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./src:/app/src    # Para desenvolvimento

  # Banco de dados PostgreSQL
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d mydb"]
      interval: 5s
      timeout: 5s
      retries: 5

  # Redis para cache
  redis:
    image: redis:7-alpine
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru

  # Nginx como reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - api

volumes:
  postgres_data:`}
      />
      <CodeBlock
        title="Comandos Docker Compose"
        code={`# Iniciar todos os serviços
docker compose up
docker compose up -d         # Background
docker compose up --build    # Reconstruir imagens

# Ver status
docker compose ps
docker compose logs
docker compose logs -f api   # Logs de serviço específico

# Parar
docker compose down
docker compose down -v       # Remove volumes também

# Escalar serviço
docker compose up -d --scale api=3

# Executar comando em serviço
docker compose exec api bash
docker compose exec db psql -U user -d mydb`}
      />

      <h2>Podman - A Alternativa Rootless</h2>
      <CodeBlock
        title="Instalar e usar Podman"
        code={`# Instalar Podman
sudo pacman -S podman podman-compose

# Podman é compatível com Docker (maioria dos comandos iguais)
podman run -d --name web nginx:alpine
podman ps
podman images
podman exec -it web sh

# Podman funciona sem daemon e sem root!
# Containers rodam como seu usuário

# Criar alias para compatibilidade total
alias docker=podman

# Para rootful (como root, para recursos avançados)
sudo podman run --rm -it ubuntu bash

# Redes no Podman (requer rootful para bridged networking)
podman network create minha-rede
podman run -d --network minha-rede --name db postgres:16-alpine`}
      />

      <h2>Volumes e Redes</h2>
      <CodeBlock
        title="Gerenciar volumes e redes Docker"
        code={`# === Volumes ===
# Criar volume nomeado
docker volume create meus-dados

# Usar volume
docker run -d -v meus-dados:/dados postgres:16

# Listar volumes
docker volume ls

# Inspecionar
docker volume inspect meus-dados

# Remover volumes não usados
docker volume prune

# === Redes ===
# Listar redes
docker network ls

# Criar rede personalizada
docker network create minha-rede
docker network create --driver bridge --subnet 172.20.0.0/16 minha-rede

# Conectar container a rede
docker network connect minha-rede meu-container

# Containers na mesma rede se comunicam pelo nome!
docker run -d --name api --network minha-rede minha-api
docker run -d --name db --network minha-rede postgres

# De dentro do container 'api', você pode alcançar 'db' por nome:
# psql -h db -U user meudb`}
      />

      <AlertBox type="info" title="Limpeza do sistema">
        Docker pode usar muito espaço. Para limpar tudo não usado:
        <code>docker system prune -a --volumes</code> — remove todos os containers parados,
        imagens não usadas e volumes órfãos. Use com cuidado!
      </AlertBox>
    </PageContainer>
  );
}
