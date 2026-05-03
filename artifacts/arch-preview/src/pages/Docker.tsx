import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Docker() {
  return (
    <PageContainer
      title="Docker no Arch Linux"
      subtitle="Instalação, primeiros containers, gerenciamento de imagens, volumes, redes e dicas específicas do Arch — tudo com saída real."
      difficulty="intermediario"
      timeToRead="40 min"
      category="Containers"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch com <code>sudo pacman -S docker</code>, depois <code>sudo systemctl enable --now docker</code>. Adicione seu usuário ao grupo: <code>sudo usermod -aG docker $USER</code>.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Container</strong> — processo isolado (namespaces + cgroups) com seu próprio FS.
      </p>
      <p>
        <strong>Imagem</strong> — snapshot read-only de um FS. Containers são instâncias mutáveis dela.
      </p>
      <p>
        <strong>Dockerfile</strong> — receita para construir uma imagem.
      </p>
      <p>
        <strong>Volume</strong> — pasta persistente fora do container.
      </p>
      <p>
        <strong>Compose</strong> — orquestrador local (<code>docker-compose-plugin</code>).
      </p>

      <p>
        Docker empacota uma aplicação e <strong>todas</strong> suas dependências (libs, configs,
        runtime) em uma imagem imutável que roda igual em qualquer kernel Linux 4.x+. No Arch o
        pacote oficial chama-se <code>docker</code> e vem do repositório <code>extra</code>; o
        daemon roda como serviço systemd e o CLI <code>docker</code> conversa com ele via socket
        UNIX em <code>/var/run/docker.sock</code>.
      </p>

      <AlertBox type="info" title="Diferente do Ubuntu">
        No Ubuntu você instala <code>docker.io</code> ou o pacote oficial via <code>get.docker.com</code>.
        No Arch é só <code>sudo pacman -S docker docker-compose docker-buildx</code> — tudo nos
        repositórios oficiais, atualizado quase em tempo real com upstream.
      </AlertBox>

      <h2>1. Instalação no Arch</h2>

      <TerminalBlock
        comment="docker = engine + CLI; docker-compose = orquestração local; buildx = builds multi-arch"
        command="sudo pacman -S docker docker-compose docker-buildx"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (5) bridge-utils-1.7.1-2  containerd-1.7.22-1  runc-1.2.1-1
             docker-1:27.3.1-1  docker-compose-2.29.7-1  docker-buildx-0.17.1-1

Total Download Size:    102.43 MiB
Total Installed Size:   428.71 MiB

:: Proceed with installation? [Y/n] y
:: Retrieving packages...
 docker-1:27.3.1-1-x86_64                         28.4 MiB   12.1 MiB/s 00:02 [######################] 100%
 containerd-1.7.22-1-x86_64                       30.2 MiB   11.8 MiB/s 00:03 [######################] 100%
(5/5) installing docker                                                       [######################] 100%
Optional dependencies for docker
    btrfs-progs: btrfs backend support
    pigz: parallel gzip for faster docker save/load
    docker-scan: vulnerability scanning [installed]`}
      />

      <TerminalBlock
        comment="habilita o daemon agora E no boot"
        command="sudo systemctl enable --now docker.service"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/docker.service → /usr/lib/systemd/system/docker.service.`}
      />

      <TerminalBlock
        command="sudo systemctl status docker.service"
        output={`{g}● docker.service{/} - Docker Application Container Engine
     Loaded: loaded (/usr/lib/systemd/system/docker.service; {g}enabled{/}; preset: disabled)
     Active: {g}active (running){/} since Wed 2026-03-20 14:32:18 -03; 12s ago
TriggeredBy: ● docker.socket
       Docs: https://docs.docker.com
   Main PID: 1842 (dockerd)
      Tasks: 19
     Memory: 102.4M
        CPU: 642ms
     CGroup: /system.slice/docker.service
             └─1842 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock`}
      />

      <h3>Rodando docker sem sudo</h3>

      <p>
        Por padrão só <code>root</code> acessa o socket. Adicionar seu usuário ao grupo{" "}
        <code>docker</code> resolve — mas saiba que membros desse grupo são <strong>efetivamente
        root</strong> (podem montar <code>/</code> dentro de um container).
      </p>

      <TerminalBlock
        command="sudo usermod -aG docker $USER"
        output=""
      />

      <TerminalBlock
        comment="reabra a sessão (logout/login) ou rode newgrp para aplicar"
        command="newgrp docker"
        output=""
      />

      <TerminalBlock
        command="docker version"
        output={`Client:
 Version:           27.3.1
 API version:       1.47
 Go version:        go1.23.2
 Git commit:        ce12230
 Built:             Wed Sep 25 09:16:50 2026
 OS/Arch:           linux/amd64
 Context:           default

Server:
 Engine:
  Version:          27.3.1
  API version:      1.47 (minimum version 1.24)
  Go version:       go1.23.2
  OS/Arch:          linux/amd64
 containerd:
  Version:          1.7.22
 runc:
  Version:          1.2.1`}
      />

      <AlertBox type="warning" title="Por que entrar no grupo docker é privilégio root">
        Qualquer usuário do grupo pode rodar
        <code> docker run -v /:/host -it alpine chroot /host sh</code> e virar root real do
        sistema. Em servidores compartilhados, prefira <strong>rootless docker</strong> (
        <code>docker-rootless-extras</code> + <code>dockerd-rootless-setuptool.sh install</code>).
      </AlertBox>

      <h2>2. Primeiro container — hello-world & alpine</h2>

      <TerminalBlock
        command="docker run hello-world"
        output={`Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
c1ec31eb5944: Pull complete
Digest: sha256:1408fec50309afee38f3535383f5b09419e6dc0925bc69891e79d84cc4cdcec6
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
 3. The Docker daemon created a new container from that image.
 4. The Docker daemon streamed that output to the Docker client.`}
      />

      <TerminalBlock
        comment="-it = interativo + tty; --rm = apaga container ao sair"
        command="docker run --rm -it alpine sh"
        output={`Unable to find image 'alpine:latest' locally
latest: Pulling from library/alpine
4f4fb700ef54: Pull complete
Digest: sha256:beefdbd8a1da6d2915566fde36db9db0b524eb737fc57cd1367effd16dc0d06d
Status: Downloaded newer image for alpine:latest
/ # cat /etc/os-release
NAME="Alpine Linux"
VERSION_ID=3.20.3
PRETTY_NAME="Alpine Linux v3.20"
/ # exit`}
      />

      <h2>3. docker run — todas as flags importantes</h2>

      <CommandFlagList
        command="docker run"
        items={[
          { flag: "-d", long: "--detach", description: "Roda em background, retorna o ID.", example: "docker run -d nginx" },
          { flag: "-it", description: "Interativo + TTY — necessário para shell interativo." },
          { flag: "--rm", description: "Remove o container automaticamente ao sair (descartável)." },
          { flag: "--name N", description: "Nome amigável (senão Docker gera).", example: "docker run --name web nginx" },
          { flag: "-p HOST:CT", long: "--publish", description: "Mapeia porta do host → container.", example: "docker run -p 8080:80 nginx" },
          { flag: "-P", long: "--publish-all", description: "Mapeia TODAS as portas EXPOSE em portas aleatórias do host." },
          { flag: "-v SRC:DST", long: "--volume", description: "Bind mount (path) ou named volume.", example: "docker run -v ./app:/app node" },
          { flag: "--mount", description: "Sintaxe verbosa com type=bind|volume|tmpfs e options." },
          { flag: "-e VAR=v", long: "--env", description: "Define variável de ambiente.", example: "docker run -e DB_HOST=db postgres" },
          { flag: "--env-file F", description: "Carrega múltiplas variáveis de um arquivo .env." },
          { flag: "--network N", description: "Conecta a uma rede docker (default = bridge).", example: "docker run --network host nginx" },
          { flag: "--restart POLICY", description: "no | on-failure | always | unless-stopped." },
          { flag: "--user UID:GID", description: "Roda processo como UID:GID dentro do container." },
          { flag: "--memory M", description: "Limita RAM (ex: 512m, 2g)." },
          { flag: "--cpus N", description: "Limita CPU (ex: 1.5 = 1.5 cores)." },
          { flag: "--cap-add", description: "Adiciona capability Linux (ex: NET_ADMIN, SYS_TIME)." },
          { flag: "--cap-drop", description: "Remove capability — recomendado: --cap-drop ALL e adicionar só o necessário." },
          { flag: "--read-only", description: "Filesystem do container em modo somente-leitura (use com tmpfs)." },
        ]}
      />

      <TerminalBlock
        comment="exemplo real: nginx em background, porta 8080, montando html local"
        command="docker run -d --name web -p 8080:80 -v $(pwd)/html:/usr/share/nginx/html:ro nginx:alpine"
        output={`Unable to find image 'nginx:alpine' locally
alpine: Pulling from library/nginx
4f4fb700ef54: Already exists
8b4c75c2b3e8: Pull complete
Digest: sha256:a59278fd22a9d411121e190b8cec8aa57b306aa3332459197777583beb728f59
Status: Downloaded newer image for nginx:alpine
8c4a2f1b3e9d7c2a4b8e6d1f3c5a8b7e9d2c4a6b8e1f3d5c7a9b2e4f6d8c1a3b`}
      />

      <TerminalBlock
        command="docker ps"
        output={`CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                  NAMES
8c4a2f1b3e9d   nginx:alpine   "/docker-entrypoint.…"   8 seconds ago   Up 7 seconds   0.0.0.0:8080->80/tcp   web`}
      />

      <h2>4. Imagens — pull, build, tag, push</h2>

      <TerminalBlock
        command="docker images"
        output={`REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
nginx         alpine    a59278fd22a9   3 days ago     43.2MB
alpine        latest    beefdbd8a1da   2 weeks ago    7.8MB
hello-world   latest    1408fec50309   18 months ago  17.7kB`}
      />

      <CommandFlagList
        command="docker [image]"
        items={[
          { flag: "pull", description: "Baixa imagem do registry (Docker Hub por padrão).", example: "docker pull postgres:16" },
          { flag: "push", description: "Envia imagem para registry. Precisa estar logado.", example: "docker push user/app:1.0" },
          { flag: "tag", description: "Cria alias (apontando para o mesmo digest).", example: "docker tag app:dev user/app:1.0" },
          { flag: "rmi", description: "Remove imagem local.", example: "docker rmi hello-world" },
          { flag: "build", description: "Constrói imagem a partir de Dockerfile.", example: "docker build -t app ." },
          { flag: "history", description: "Mostra layers da imagem (útil para auditar tamanho)." },
          { flag: "save / load", description: "Exporta/importa tar (transferir sem registry)." },
          { flag: "prune", description: "Remove imagens dangling (sem tag).", example: "docker image prune -a" },
        ]}
      />

      <h3>Dockerfile mínimo</h3>

      <CodeBlock
        title="./Dockerfile — Node.js multi-stage"
        language="dockerfile"
        code={`# Estágio 1: build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Estágio 2: runtime mínimo (só o necessário)
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]`}
      />

      <TerminalBlock
        command="docker build -t myapp:1.0 ."
        output={`[+] Building 18.4s (14/14) FINISHED                                                docker:default
 => [internal] load build definition from Dockerfile                                          0.0s
 => => transferring dockerfile: 487B                                                          0.0s
 => [internal] load .dockerignore                                                             0.0s
 => [internal] load metadata for docker.io/library/node:22-alpine                             1.2s
 => [builder 1/6] FROM docker.io/library/node:22-alpine@sha256:a8a8f4...                      3.4s
 => [internal] load build context                                                             0.1s
 => => transferring context: 124.83kB                                                         0.1s
 => [builder 2/6] WORKDIR /app                                                                0.0s
 => [builder 3/6] COPY package*.json ./                                                       0.0s
 => [builder 4/6] RUN npm ci                                                                  8.7s
 => [builder 5/6] COPY . .                                                                    0.0s
 => [builder 6/6] RUN npm run build                                                           4.2s
 => [stage-1 4/6] COPY --from=builder /app/dist ./dist                                        0.0s
 => exporting to image                                                                        0.7s
 => => writing image sha256:7f3a2b9c1d4e6f8a3b5c7d9e2f4a6b8c1d3e5f7                           0.0s
 => => naming to docker.io/library/myapp:1.0                                                  0.0s`}
      />

      <h2>5. Volumes — persistindo dados</h2>

      <CommandFlagList
        command="docker volume"
        items={[
          { flag: "create", description: "Cria volume nomeado (gerenciado pelo Docker).", example: "docker volume create pgdata" },
          { flag: "ls", description: "Lista volumes." },
          { flag: "inspect", description: "Mostra metadata + path em /var/lib/docker/volumes/<name>/_data." },
          { flag: "rm", description: "Remove volume (precisa não estar em uso)." },
          { flag: "prune", description: "Remove TODOS os volumes não usados — cuidado." },
        ]}
      />

      <TerminalBlock
        command="docker volume create pgdata"
        output="pgdata"
      />

      <TerminalBlock
        command="docker volume inspect pgdata"
        output={`[
    {
        "CreatedAt": "2026-03-20T14:48:11-03:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/pgdata/_data",
        "Name": "pgdata",
        "Options": null,
        "Scope": "local"
    }
]`}
      />

      <TerminalBlock
        comment="postgres com dados persistidos no volume pgdata"
        command={`docker run -d --name pg \\
  -e POSTGRES_PASSWORD=secret \\
  -v pgdata:/var/lib/postgresql/data \\
  -p 5432:5432 \\
  postgres:16-alpine`}
        output={`a3b5c7d9e2f4a6b8c1d3e5f7a9b2c4d6e8f1a3b5c7d9e2f4a6b8c1d3e5f7a9b2`}
      />

      <h3>Bind mount vs Named volume</h3>

      <OutputBlock
        title="quando usar cada um"
        output={`bind mount  -v /caminho/host:/dst    desenvolvimento (hot-reload de código)
                                       config files do host
named vol   -v meuvol:/dst             produção, dados de DB
                                       Docker gerencia, fica em /var/lib/docker/volumes
tmpfs       --tmpfs /tmp               dados efêmeros em RAM`}
      />

      <h2>6. Redes</h2>

      <TerminalBlock
        command="docker network ls"
        output={`NETWORK ID     NAME      DRIVER    SCOPE
3a8f7b2c1d4e   bridge    bridge    local
9c2e4b6d8a1f   host      host      local
1f3a5c7e9b2d   none      null      local`}
      />

      <TerminalBlock
        comment="cria rede bridge isolada — containers nessa rede se vêem por nome"
        command="docker network create app-net"
        output="6e8f1a3b5c7d9e2f4a6b8c1d3e5f7a9b2c4d6e8f1a3b5c7d9e2f4a6b8c1d3e5f"
      />

      <TerminalBlock
        command={`docker run -d --name db --network app-net -e POSTGRES_PASSWORD=x postgres:16-alpine
docker run -d --name api --network app-net -e DB_HOST=db myapp:1.0`}
        output={`a3b5c7d9e2f4a6b8c1d3e5f7
b4c6d8e1f3a5b7c9d2e4f6a8`}
      />

      <p>
        Dentro de <code>api</code>, o hostname <code>db</code> resolve para o IP do container
        postgres automaticamente — graças ao DNS embutido do Docker em redes user-defined.
      </p>

      <CommandFlagList
        command="docker network"
        items={[
          { flag: "create", description: "Cria rede (driver bridge por padrão)." },
          { flag: "connect", description: "Conecta container existente a uma rede.", example: "docker network connect app-net web" },
          { flag: "disconnect", description: "Desconecta container de uma rede." },
          { flag: "inspect", description: "Mostra IPs, containers conectados, gateway." },
          { flag: "rm", description: "Remove rede (não pode estar em uso)." },
        ]}
      />

      <h2>7. Logs, exec e inspect</h2>

      <TerminalBlock
        command="docker logs --tail 5 -f web"
        output={`172.17.0.1 - - [20/Mar/2026:14:51:02 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/8.10.1"
172.17.0.1 - - [20/Mar/2026:14:51:08 +0000] "GET /api/health HTTP/1.1" 200 12 "-" "curl/8.10.1"
2026/03/20 14:51:14 [error] 31#31: *3 open() "/usr/share/nginx/html/missing" failed
172.17.0.1 - - [20/Mar/2026:14:51:14 +0000] "GET /missing HTTP/1.1" 404 555 "-" "curl/8.10.1"
^C`}
      />

      <TerminalBlock
        comment="executa um comando dentro do container em execução"
        command="docker exec -it pg psql -U postgres"
        output={`psql (16.4)
Type "help" for help.

postgres=# \\l
                                                List of databases
   Name    |  Owner   | Encoding | Locale Provider |   Collate   |    Ctype    | ICU Locale | ICU Rules |
-----------+----------+----------+-----------------+-------------+-------------+------------+-----------+
 postgres  | postgres | UTF8     | libc            | en_US.utf8  | en_US.utf8  |            |           |
 template0 | postgres | UTF8     | libc            | en_US.utf8  | en_US.utf8  |            |           |
 template1 | postgres | UTF8     | libc            | en_US.utf8  | en_US.utf8  |            |           |
postgres=# \\q`}
      />

      <TerminalBlock
        command="docker stats --no-stream"
        output={`CONTAINER ID   NAME      CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O      PIDS
8c4a2f1b3e9d   web       0.00%     4.8MiB / 15.5GiB      0.03%     1.42kB / 3.08kB   0B / 0B        2
a3b5c7d9e2f4   pg        0.18%     38.2MiB / 15.5GiB     0.24%     12.4kB / 8.71kB   4.1MB / 8.2MB  6
b4c6d8e1f3a5   api       0.04%     62.7MiB / 15.5GiB     0.39%     842B / 0B         0B / 0B        11`}
      />

      <h2>8. Limpeza — recuperando espaço em disco</h2>

      <TerminalBlock
        command="docker system df"
        output={`TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          12        4         2.847GB   1.913GB (67%)
Containers      6         3         128.4MB   42.8MB (33%)
Local Volumes   4         2         1.247GB   612.8MB (49%)
Build Cache     38        0         842.1MB   842.1MB`}
      />

      <TerminalBlock
        comment="remove containers parados, redes não usadas, dangling images, build cache"
        command="docker system prune"
        output={`WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all dangling images
  - unused build cache

Are you sure you want to continue? [y/N] y
Deleted Containers:
8e1f3a5c7d9b2e4f6a8c1d3e5f7a9b2c4d6e8f1a3b5c7d9e2f4a6b8c1d3e5f7a

Deleted Networks:
old-net

Deleted build cache objects:
sha256:7c2b...

Total reclaimed space: 412.8MB`}
      />

      <AlertBox type="danger" title="docker system prune -a --volumes">
        Acrescentar <code>-a</code> (todas imagens não-usadas) e <code>--volumes</code> remove
        também volumes órfãos. <strong>Apaga dados</strong>. Use só se sabe o que está fazendo.
      </AlertBox>

      <h2>9. Storage driver e overlay no Arch</h2>

      <TerminalBlock
        command="docker info | head -20"
        output={`Client: Docker Engine - Community
 Version:    27.3.1
 Context:    default

Server:
 Containers: 6
  Running: 3
  Paused: 0
  Stopped: 3
 Images: 12
 Server Version: 27.3.1
 Storage Driver: overlay2
  Backing Filesystem: ext4
  Supports d_type: true
  Using metacopy: false
  Native Overlay Diff: true
  userxattr: false
 Logging Driver: json-file
 Cgroup Driver: systemd
 Cgroup Version: 2`}
      />

      <p>
        No Arch o driver padrão é <code>overlay2</code> sobre ext4/xfs — o mais rápido e estável.
        Se você usa <strong>btrfs</strong> em <code>/var/lib/docker</code>, o Docker detecta e
        usa o driver <code>btrfs</code> (snapshots nativos). Verifique sempre antes de mudar.
      </p>

      <h2>10. Receitas práticas</h2>

      <CodeBlock
        title="Postgres descartável (testes)"
        code={`docker run --rm -d --name pg-test \\
  -e POSTGRES_PASSWORD=test \\
  -p 5433:5432 \\
  postgres:16-alpine

# após terminar:
docker stop pg-test  # --rm cuida da remoção`}
      />

      <CodeBlock
        title="Build & push para Docker Hub"
        code={`docker login                                # pede usuário/token
docker build -t SEU_USER/app:1.0 .
docker push SEU_USER/app:1.0
# em outro host:
docker pull SEU_USER/app:1.0`}
      />

      <CodeBlock
        title="Container com GPU NVIDIA (precisa nvidia-container-toolkit do AUR)"
        code={`yay -S nvidia-container-toolkit
sudo systemctl restart docker
docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi`}
      />

      <OutputBlock
        title="Cola visual: comandos do dia-a-dia"
        output={`docker ps                          containers rodando
docker ps -a                       todos (incluindo parados)
docker images                      imagens locais
docker pull NAME:TAG               baixa imagem
docker run [opts] IMG [cmd]        cria + inicia container
docker exec -it CT bash            shell em container vivo
docker logs -f CT                  segue logs
docker stop CT                     SIGTERM (depois SIGKILL)
docker rm CT                       remove container parado
docker rmi IMG                     remove imagem
docker stats                       CPU/RAM em tempo real
docker system prune                limpa lixo
docker volume ls                   volumes
docker network ls                  redes
docker inspect CT                  metadata JSON completa`}
      />
    </PageContainer>
  );
}
