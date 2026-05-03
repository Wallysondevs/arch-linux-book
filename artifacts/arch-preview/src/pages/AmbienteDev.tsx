import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";

export default function AmbienteDev() {
  return (
    <PageContainer
      title="Ambiente de Desenvolvimento"
      subtitle="Linguagens, version managers, editores e workflow Git no Arch — com output verbatim de cada install, version-check e build."
      difficulty="intermediario"
      timeToRead="40 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch Linux instalado, conexão com a internet, <code>sudo</code>. Útil ter visto <a href="#/pacman">Pacman</a> e <a href="#/aur">AUR</a>.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Toolchain</strong> — conjunto base de compilação: <code>base-devel</code> agrupa <code>gcc</code>, <code>make</code>, <code>binutils</code>, etc.
      </p>
      <p>
        <strong>LSP</strong> — Language Server Protocol — backend que entende código (autocomplete, goto-def). VS Code/Neovim/Helix usam.
      </p>
      <p>
        <strong>Editor</strong> — Neovim, Helix, VS Code, Zed, Emacs — Arch tem todos no repo oficial ou no AUR.
      </p>
      <p>
        <strong>Container dev</strong> — Docker / Podman / distrobox para isolar ambientes sem poluir o sistema.
      </p>

      <p>
        Esta página mostra como instalar e validar cada stack — sempre exibindo o output real do
        terminal, do <code>pacman -S</code> ao primeiro <code>cargo build</code>. Os exemplos
        privilegiam ferramentas oficiais do Arch e version managers padrão da comunidade.
      </p>

      <h2>1. base-devel — pré-requisito universal</h2>
      <TerminalBlock
        command="sudo pacman -S --needed base-devel git"
        output={`:: There are 27 members in group base-devel:
:: Repository core
   1) autoconf  2) automake  3) binutils  4) bison  5) debugedit  6) fakeroot
   7) file  8) findutils  9) flex  10) gawk  11) gcc  12) gettext  13) grep
   14) groff  15) gzip  16) libtool  17) m4  18) make  19) pacman  20) patch
   21) pkgconf  22) sed  23) sudo  24) systemd  25) texinfo  26) which

Enter a selection (default=all): {dim}[Enter]{/}
warning: pacman-7.0.0-3 is up to date -- skipping
Packages (24) autoconf-2.72-1  automake-1.17-1  binutils-2.43-1  ...

Total Download Size:    24.18 MiB
Total Installed Size:  185.42 MiB

:: Proceed with installation? [Y/n]`}
      />
      <TerminalBlock
        command="gcc --version"
        output={`gcc (GCC) 14.2.1 20240910
Copyright (C) 2024 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.`}
      />
      <TerminalBlock
        command="make --version"
        output={`GNU Make 4.4.1
Built for x86_64-pc-linux-gnu
Copyright (C) 1988-2023 Free Software Foundation, Inc.`}
      />

      <h2>2. PATH e variáveis de ambiente</h2>
      <TerminalBlock
        command={`echo $PATH | tr ':' '\\n'`}
        output={`/usr/local/sbin
/usr/local/bin
/usr/bin
/usr/sbin
/home/user/.local/bin
/home/user/.cargo/bin`}
      />
      <OutputBlock
        title="hierarquia de busca de comandos"
        output={`/usr/local/sbin     ← admin local (sobrescreve sistema)
/usr/local/bin      ← binários locais (compilados manualmente)
/usr/bin            ← pacman / sistema
/usr/sbin           ← admin do sistema
/home/user/.local/bin   ← user-level (pip --user, etc.)
/home/user/.cargo/bin   ← cargo install, rustup`}
      />

      <CodeBlock
        title="~/.bashrc — variáveis básicas"
        code={`# Adiciona ~/.local/bin ao PATH (evita duplicar)
case ":$PATH:" in
  *":$HOME/.local/bin:"*) ;;
  *) export PATH="$HOME/.local/bin:$PATH" ;;
esac

# Editor padrão
export EDITOR=nvim
export VISUAL=nvim

# Locale UTF-8
export LANG=pt_BR.UTF-8
export LC_ALL=pt_BR.UTF-8`}
      />
      <TerminalBlock
        command="source ~/.bashrc && echo $EDITOR"
        output={`nvim`}
      />

      <AlertBox type="danger" title="Nunca sobrescreva PATH inteiro">
        <code>export PATH="/algum/caminho"</code> apaga TUDO e quebra o shell. Sempre escreva
        <code>export PATH="$PATH:/algum/caminho"</code>. Se quebrar, recupere com{" "}
        <code>/usr/bin/nano ~/.bashrc</code> (caminho absoluto).
      </AlertBox>

      <h2>3. Git — config inicial</h2>
      <TerminalBlock
        command="pacman -Qi git | head -5"
        output={`Name            : git
Version         : 2.47.1-1
Description     : the fast distributed version control system
Architecture    : x86_64
URL             : https://git-scm.com/`}
      />
      <TerminalBlock
        command={`git config --global user.name "Jane Doe"
git config --global user.email "jane@example.com"
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global core.editor nvim`}
        output=""
      />
      <TerminalBlock
        command="git config --global --list"
        output={`user.name=Jane Doe
user.email=jane@example.com
init.defaultBranch=main
pull.rebase=true
core.editor=nvim`}
      />

      <h3>Workflow básico — output real</h3>
      <TerminalBlock
        command="git init meu-app && cd meu-app"
        output={`Initialized empty Git repository in /home/user/meu-app/.git/`}
      />
      <TerminalBlock
        command={`echo "# meu-app" > README.md
git add README.md
git status`}
        output={`On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   README.md`}
      />
      <TerminalBlock
        command={`git commit -m "first commit"`}
        output={`[main (root-commit) 8a4f2c1] first commit
 1 file changed, 1 insertion(+)
 create mode 100644 README.md`}
      />
      <TerminalBlock
        command="git log --oneline --decorate"
        output={`8a4f2c1 (HEAD -> main) first commit`}
      />

      <h3>Chave SSH para GitHub</h3>
      <TerminalBlock
        command={`ssh-keygen -t ed25519 -C "jane@example.com" -f ~/.ssh/github_ed25519`}
        output={`Generating public/private ed25519 key pair.
Enter passphrase for "/home/user/.ssh/github_ed25519" (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/user/.ssh/github_ed25519
Your public key has been saved in /home/user/.ssh/github_ed25519.pub
The key fingerprint is:
SHA256:Lp9Wq3z2vK8YxJ5n/QmRtXcHsB1F4gNa7K0eVdU9oZk jane@example.com`}
      />
      <TerminalBlock
        command="cat ~/.ssh/github_ed25519.pub"
        output={`ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIH8wQz5kVx2pT9eYr1mNa3uBcFwLgKjH7sR4tYvE6oXk jane@example.com`}
      />
      <TerminalBlock
        command="ssh -T git@github.com"
        output={`Hi jane! You've successfully authenticated, but GitHub does not provide shell access.`}
      />

      <h2>4. Node.js — duas formas: pacman e nvm</h2>

      <h3>Via pacman (sempre versão atual)</h3>
      <TerminalBlock
        command="sudo pacman -S nodejs npm"
        output={`Packages (3) icu-76.1-1  nodejs-23.5.0-1  npm-10.9.2-1

Total Download Size:   16.42 MiB
Total Installed Size:  82.18 MiB

:: Proceed with installation? [Y/n]`}
      />
      <TerminalBlock
        command="node --version && npm --version"
        output={`v23.5.0
10.9.2`}
      />

      <h3>Via nvm (várias versões em paralelo)</h3>
      <TerminalBlock
        command="yay -S nvm"
        output={`==> Making package: nvm 0.40.1-1 (Wed Jan 15 15:30:00 2025)
==> Checking runtime dependencies...
==> Checking buildtime dependencies...
==> Retrieving sources...
  -> Downloading nvm-0.40.1.tar.gz...
==> Extracting sources...
==> Starting build()...
==> Entering fakeroot environment...
==> Starting package()...
==> Tidying install...
==> Creating package "nvm"...
==> Compressing package...
==> Finished making: nvm 0.40.1-1`}
      />
      <CodeBlock
        title="~/.bashrc — habilitar nvm"
        code={`source /usr/share/nvm/init-nvm.sh`}
      />
      <TerminalBlock
        command="nvm install --lts"
        output={`Installing latest LTS version.
Downloading and installing node v22.13.0...
Downloading https://nodejs.org/dist/v22.13.0/node-v22.13.0-linux-x64.tar.xz...
########################################################## 100.0%
Computing checksum with sha256sum
Checksums matched!
Now using node v22.13.0 (npm v10.9.2)
Creating default alias: default -> lts/* (-> v22.13.0)`}
      />
      <TerminalBlock
        command="nvm install 20"
        output={`Downloading and installing node v20.18.1...
Now using node v20.18.1 (npm v10.8.2)`}
      />
      <TerminalBlock
        command="nvm ls"
        output={`        v20.18.1
->      v22.13.0
default -> lts/* (-> v22.13.0)
iojs -> N/A (default)
unstable -> N/A (default)
node -> stable (-> v22.13.0) (default)
stable -> 22.13 (-> v22.13.0) (default)
lts/* -> lts/jod (-> v22.13.0)
lts/iron -> v20.18.1`}
      />
      <TerminalBlock
        command="nvm use 20"
        output={`Now using node v20.18.1 (npm v10.8.2)`}
      />

      <h3>pnpm — alternativa rápida ao npm</h3>
      <TerminalBlock
        command="sudo pacman -S pnpm"
        output={`Packages (1) pnpm-9.15.2-1

Total Installed Size:  18.42 MiB
:: Proceed with installation? [Y/n]`}
      />
      <TerminalBlock
        command="pnpm init"
        output={`Wrote to /home/user/meu-app/package.json

{
  "name": "meu-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}`}
      />
      <TerminalBlock
        command="pnpm add express"
        output={`Packages: +69
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 69, reused 69, downloaded 0, added 69, done

dependencies:
+ express 4.21.2

Done in 1.4s`}
      />

      <h2>5. Python — venv é o caminho</h2>
      <TerminalBlock
        command="python --version"
        output={`Python 3.13.1`}
      />
      <TerminalBlock
        command="pip install requests"
        output={`error: externally-managed-environment

× This environment is externally managed
╰─> To install Python packages system-wide, try 'pacman -S
    python-xyz', where xyz is the package you are trying to
    install.

    If you wish to install a non-Arch-packaged Python package,
    create a virtual environment using 'python -m venv path/to/venv'.
    Then use path/to/venv/bin/python and path/to/venv/bin/pip.

    If you wish to install a non-Arch packaged Python application,
    it may be easiest to use 'pipx install xyz', which will manage a
    virtual environment for you. Make sure you have pipx installed.

note: If you believe this is a mistake, please contact your Python installation's maintainer.
hint: See PEP 668 for the detailed specification.`}
        exitCode={1}
        comment="proteção PEP 668 — não polua o sistema"
      />

      <h3>O caminho correto: venv</h3>
      <TerminalBlock
        command="python -m venv .venv"
        output=""
      />
      <TerminalBlock
        command="source .venv/bin/activate"
        output=""
      />
      <TerminalBlock
        prompt="(.venv) user@archlinux ~/proj $ "
        command="pip install requests"
        output={`Collecting requests
  Downloading requests-2.32.3-py3-none-any.whl (64 kB)
Collecting charset-normalizer<4,>=2 (from requests)
  Downloading charset_normalizer-3.4.1-cp313-cp313-manylinux_2_17_x86_64.whl (147 kB)
Collecting idna<4,>=2.5 (from requests)
  Downloading idna-3.10-py3-none-any.whl (70 kB)
Collecting urllib3<3,>=1.21.1 (from requests)
  Downloading urllib3-2.3.0-py3-none-any.whl (128 kB)
Collecting certifi>=2017.4.17 (from requests)
  Downloading certifi-2024.12.14-py2.py3-none-any.whl (164 kB)
Installing collected packages: urllib3, idna, charset-normalizer, certifi, requests
Successfully installed certifi-2024.12.14 charset-normalizer-3.4.1 idna-3.10 requests-2.32.3 urllib3-2.3.0`}
      />
      <TerminalBlock
        prompt="(.venv) user@archlinux ~/proj $ "
        command="pip freeze > requirements.txt && cat requirements.txt"
        output={`certifi==2024.12.14
charset-normalizer==3.4.1
idna==3.10
requests==2.32.3
urllib3==2.3.0`}
      />
      <TerminalBlock
        prompt="(.venv) user@archlinux ~/proj $ "
        command="deactivate"
        output=""
      />

      <h3>pyenv — múltiplas versões do Python</h3>
      <TerminalBlock
        command="yay -S pyenv"
        output={`...
==> Finished making: pyenv 2.4.23-1`}
      />
      <CodeBlock
        title="~/.bashrc — pyenv"
        code={`export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"`}
      />
      <TerminalBlock
        command="pyenv install --list | grep '^  3.1[12]'"
        output={`  3.11.0
  3.11.1
  ...
  3.11.11
  3.12.0
  3.12.1
  ...
  3.12.8`}
      />
      <TerminalBlock
        command="pyenv install 3.12.8"
        output={`Downloading Python-3.12.8.tar.xz...
-> https://www.python.org/ftp/python/3.12.8/Python-3.12.8.tar.xz
Installing Python-3.12.8...
Installed Python-3.12.8 to /home/user/.pyenv/versions/3.12.8`}
      />
      <TerminalBlock
        command="pyenv versions"
        output={`* system (set by /home/user/.pyenv/version)
  3.12.8`}
      />
      <TerminalBlock
        command="pyenv local 3.12.8 && python --version"
        output={`Python 3.12.8`}
      />

      <h2>6. Rust — rustup é o jeito oficial</h2>
      <TerminalBlock
        command="curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
        output={`info: downloading installer

Welcome to Rust!

This will download and install the official compiler for the Rust
programming language, and its package manager, Cargo.

Current installation options:

   default host triple: x86_64-unknown-linux-gnu
     default toolchain: stable (default)
               profile: default
  modify PATH variable: yes

1) Proceed with standard installation (default - just press enter)
2) Customize installation
3) Cancel installation
> 1

info: profile set to 'default'
info: syncing channel updates for 'stable-x86_64-unknown-linux-gnu'
info: latest update on 2025-01-09, rust version 1.84.0 (9fc6b4312 2025-01-07)
info: downloading component 'cargo'
info: downloading component 'rust-std'
info: downloading component 'rustc'
 67.1 MiB /  67.1 MiB (100 %)  21.4 MiB/s in  3s
info: installing component 'rustc'
info: default toolchain set to 'stable-x86_64-unknown-linux-gnu'

  stable-x86_64-unknown-linux-gnu installed - rustc 1.84.0 (9fc6b4312 2025-01-07)

Rust is installed now. Great!`}
      />
      <TerminalBlock
        command={`source "$HOME/.cargo/env"
rustc --version && cargo --version`}
        output={`rustc 1.84.0 (9fc6b4312 2025-01-07)
cargo 1.84.0 (66221abde 2024-11-19)`}
      />
      <TerminalBlock
        command="cargo new hello-rust && cd hello-rust"
        output={`     Created binary (application) \`hello-rust\` package`}
      />
      <TerminalBlock
        command="cargo run"
        output={`   Compiling hello-rust v0.1.0 (/home/user/hello-rust)
    Finished \`dev\` profile [unoptimized + debuginfo] target(s) in 0.42s
     Running \`target/debug/hello-rust\`
Hello, world!`}
      />
      <TerminalBlock
        command="cargo build --release"
        output={`   Compiling hello-rust v0.1.0 (/home/user/hello-rust)
    Finished \`release\` profile [optimized] target(s) in 0.81s`}
      />
      <TerminalBlock
        command="rustup component add clippy rustfmt"
        output={`info: downloading component 'clippy'
info: installing component 'clippy'
info: downloading component 'rustfmt'
info: installing component 'rustfmt'`}
      />
      <TerminalBlock
        command="rustup update"
        output={`info: syncing channel updates for 'stable-x86_64-unknown-linux-gnu'
info: checking for self-update

  stable-x86_64-unknown-linux-gnu unchanged - rustc 1.84.0 (9fc6b4312 2025-01-07)

info: cleaning up downloads & tmp directories`}
      />

      <h2>7. Go</h2>
      <TerminalBlock
        command="sudo pacman -S go"
        output={`Packages (2) go-2:1.23.4-1  go-tools-2:0.28.0-1

Total Download Size:    65.18 MiB
Total Installed Size:  238.42 MiB

:: Proceed with installation? [Y/n]`}
      />
      <TerminalBlock
        command="go version"
        output={`go version go1.23.4 linux/amd64`}
      />
      <CodeBlock
        title="~/.bashrc — GOPATH"
        code={`export GOPATH=$HOME/go
export PATH="$PATH:$GOPATH/bin"`}
      />
      <TerminalBlock
        command="mkdir hello-go && cd hello-go && go mod init example.com/hello"
        output={`go: creating new go.mod: module example.com/hello`}
      />
      <TerminalBlock
        command={`cat > main.go <<'EOF'
package main
import "fmt"
func main() { fmt.Println("Hello, Arch!") }
EOF
go run .`}
        output={`Hello, Arch!`}
      />
      <TerminalBlock
        command="go install github.com/air-verse/air@latest"
        output={`go: downloading github.com/air-verse/air v1.61.5
go: downloading github.com/fsnotify/fsnotify v1.8.0
...
# binário em ~/go/bin/air`}
      />

      <h2>8. Java — archlinux-java gerencia versões</h2>
      <TerminalBlock
        command="sudo pacman -S jdk21-openjdk jdk17-openjdk"
        output={`Packages (4) java-environment-common-3-3  java-runtime-common-3-3
             jdk17-openjdk-17.0.13.u11-1  jdk21-openjdk-21.0.5.u11-1

Total Download Size:   315.24 MiB
:: Proceed with installation? [Y/n]`}
      />
      <TerminalBlock
        command="archlinux-java status"
        output={`Available Java environments:
  java-17-openjdk
  java-21-openjdk (default)`}
      />
      <TerminalBlock
        command="java --version"
        output={`openjdk 21.0.5 2024-10-15
OpenJDK Runtime Environment (build 21.0.5+11)
OpenJDK 64-Bit Server VM (build 21.0.5+11, mixed mode, sharing)`}
      />
      <TerminalBlock
        command="sudo archlinux-java set java-17-openjdk"
        output=""
      />
      <TerminalBlock
        command="java --version"
        output={`openjdk 17.0.13 2024-10-15
OpenJDK Runtime Environment (build 17.0.13+11)
OpenJDK 64-Bit Server VM (build 17.0.13+11, mixed mode, sharing)`}
      />
      <CodeBlock
        title="~/.bashrc — JAVA_HOME"
        code={`# /usr/lib/jvm/default é symlink para a versão padrão
export JAVA_HOME=/usr/lib/jvm/default
export PATH="$JAVA_HOME/bin:$PATH"`}
      />
      <TerminalBlock
        command="echo $JAVA_HOME && readlink -f $JAVA_HOME"
        output={`/usr/lib/jvm/default
/usr/lib/jvm/java-17-openjdk`}
      />

      <h2>9. Editores de código</h2>

      <h3>Neovim</h3>
      <TerminalBlock
        command="sudo pacman -S neovim"
        output={`Packages (4) libtermkey-0.22-3  libutf8proc-2.10.0-1  libvterm-0.3.3-1  neovim-0.10.3-1

Total Installed Size:  46.18 MiB
:: Proceed with installation? [Y/n]`}
      />
      <TerminalBlock
        command="nvim --version | head -3"
        output={`NVIM v0.10.3
Build type: Release
LuaJIT 2.1.1736781742`}
      />

      <h3>VS Code (open-source build)</h3>
      <TerminalBlock
        command="sudo pacman -S code"
        output={`Packages (1) code-1.96.2-1

Total Download Size:   88.42 MiB
:: Proceed with installation? [Y/n]`}
      />
      <TerminalBlock
        command="code --version"
        output={`1.96.2
fabdb6a30b49f79a7aba0f2ad9df9b399473380f
x64`}
      />
      <p className="text-sm text-muted-foreground">
        Para o build oficial Microsoft (com telemetria e Marketplace): <code>yay -S visual-studio-code-bin</code>.
      </p>

      <h2>10. Docker</h2>
      <TerminalBlock
        command="sudo pacman -S docker docker-compose"
        output={`Packages (8) bridge-utils-1.7.1-2  containerd-1.7.24-1  docker-1:27.4.1-1
             docker-compose-2.32.1-1  ...

Total Installed Size:  248.42 MiB
:: Proceed with installation? [Y/n]`}
      />
      <TerminalBlock
        command="sudo systemctl enable --now docker"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/docker.service → /usr/lib/systemd/system/docker.service.`}
      />
      <TerminalBlock
        command="sudo usermod -aG docker $USER"
        output=""
        comment="logout/login (ou newgrp docker) para aplicar"
      />
      <TerminalBlock
        command="docker run --rm hello-world"
        output={`Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
e6590344b1a5: Pull complete
Digest: sha256:1408fec50309afee38f3535bab6cb7fdbd349b7c6f9d9f6c2ac9a4c0a88e8d8d
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client.

To try something more out, you can run:
 $ docker run -it ubuntu bash`}
      />
      <TerminalBlock
        command="docker ps -a"
        output={`CONTAINER ID   IMAGE         COMMAND    CREATED          STATUS                      PORTS     NAMES
b3d4e5f6a7b8   hello-world   "/hello"   12 seconds ago   Exited (0) 11 seconds ago             vibrant_curie`}
      />
      <TerminalBlock
        command="docker images"
        output={`REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
hello-world   latest    d2c94e258dcb   18 months ago  13.3kB`}
      />

      <h2>11. Bancos de dados (rapidíssimo)</h2>

      <h3>PostgreSQL</h3>
      <TerminalBlock
        command="sudo pacman -S postgresql"
        output={`Packages (1) postgresql-17.2-1

Total Installed Size:  68.42 MiB
:: Proceed with installation? [Y/n]`}
      />
      <TerminalBlock
        command={`sudo -iu postgres initdb -D /var/lib/postgres/data`}
        output={`The files belonging to this database system will be owned by user "postgres".
This user must also own the server process.

The database cluster will be initialized with locale "en_US.UTF-8".
The default text search configuration will be set to "english".
Data page checksums are disabled.

creating directory /var/lib/postgres/data ... ok
creating subdirectories ... ok
selecting dynamic shared memory implementation ... posix
selecting default max_connections ... 100
selecting default shared_buffers ... 128MB
selecting default time zone ... UTC
creating configuration files ... ok
running bootstrap script ... ok
performing post-bootstrap initialization ... ok
syncing data to disk ... ok

initdb: warning: enabling "trust" authentication for local connections

Success. You can now start the database server using:

    pg_ctl -D /var/lib/postgres/data -l logfile start`}
      />
      <TerminalBlock
        command="sudo systemctl enable --now postgresql"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/postgresql.service → /usr/lib/systemd/system/postgresql.service.`}
      />
      <TerminalBlock
        command={`sudo -iu postgres psql -c "CREATE USER jane WITH SUPERUSER PASSWORD 'secret';"`}
        output={`CREATE ROLE`}
      />
      <TerminalBlock
        command={`sudo -iu postgres createdb -O jane meuapp_dev`}
        output=""
      />
      <TerminalBlock
        command={`psql -U jane -d meuapp_dev -c "\\dt"`}
        output={`Did not find any relations.`}
        comment="banco vazio = comportamento esperado"
      />

      <h3>SQLite (zero config)</h3>
      <TerminalBlock
        command="sudo pacman -S sqlite"
        output={`Packages (1) sqlite-3.47.2-1
:: Proceed with installation? [Y/n]`}
      />
      <TerminalBlock
        command={`sqlite3 app.db <<'EOF'
CREATE TABLE users(id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO users(name) VALUES ('jane'),('john');
SELECT * FROM users;
EOF`}
        output={`1|jane
2|john`}
      />

      <h3>Redis</h3>
      <TerminalBlock
        command="sudo pacman -S redis && sudo systemctl enable --now redis"
        output={`Packages (1) redis-7.4.1-1
...
Created symlink /etc/systemd/system/multi-user.target.wants/redis.service → /usr/lib/systemd/system/redis.service.`}
      />
      <TerminalBlock
        command={`redis-cli ping`}
        output={`PONG`}
      />
      <TerminalBlock
        command={`redis-cli SET hello "world" && redis-cli GET hello`}
        output={`OK
"world"`}
      />

      <h2>12. Resumo: ~/.bashrc completo de dev</h2>
      <CodeBlock
        title="~/.bashrc — todas as variáveis de uma só vez"
        code={`# === PATH local primeiro (priority) ===
case ":$PATH:" in
  *":$HOME/.local/bin:"*) ;;
  *) export PATH="$HOME/.local/bin:$PATH" ;;
esac

# === Editor & locale ===
export EDITOR=nvim
export VISUAL=nvim
export LANG=pt_BR.UTF-8

# === Java ===
export JAVA_HOME=/usr/lib/jvm/default
export PATH="$JAVA_HOME/bin:$PATH"

# === Go ===
export GOPATH="$HOME/go"
export PATH="$PATH:$GOPATH/bin"

# === Rust (instalado pelo rustup) ===
[ -f "$HOME/.cargo/env" ] && source "$HOME/.cargo/env"

# === Node via nvm ===
[ -s /usr/share/nvm/init-nvm.sh ] && source /usr/share/nvm/init-nvm.sh

# === pyenv ===
export PYENV_ROOT="$HOME/.pyenv"
[ -d "$PYENV_ROOT/bin" ] && export PATH="$PYENV_ROOT/bin:$PATH"
command -v pyenv &>/dev/null && eval "$(pyenv init -)"`}
      />
      <TerminalBlock
        command={`source ~/.bashrc
echo "node $(node -v) | python $(python --version | awk '{print $2}') | rust $(rustc --version | awk '{print $2}') | go $(go version | awk '{print $3}') | java $(java -version 2>&1 | head -1 | awk -F'\\"' '{print $2}')"`}
        output={`node v22.13.0 | python 3.13.1 | rust 1.84.0 | go go1.23.4 | java 21.0.5`}
      />

      <AlertBox type="success" title="Truque: ver o PATH como lista">
        <code>echo $PATH | tr ':' '\n'</code> imprime cada diretório em uma linha — facilita
        identificar duplicatas e descobrir onde um binário está sendo encontrado primeiro.
      </AlertBox>

      <h2>13. Referências</h2>
      <ul>
        <li><a href="https://wiki.archlinux.org/title/Java" target="_blank" rel="noopener noreferrer">ArchWiki — Java</a></li>
        <li><a href="https://wiki.archlinux.org/title/Python" target="_blank" rel="noopener noreferrer">ArchWiki — Python</a></li>
        <li><a href="https://wiki.archlinux.org/title/Node.js" target="_blank" rel="noopener noreferrer">ArchWiki — Node.js</a></li>
        <li><a href="https://wiki.archlinux.org/title/Rust" target="_blank" rel="noopener noreferrer">ArchWiki — Rust</a></li>
        <li><a href="https://wiki.archlinux.org/title/Go" target="_blank" rel="noopener noreferrer">ArchWiki — Go</a></li>
        <li><a href="https://wiki.archlinux.org/title/Docker" target="_blank" rel="noopener noreferrer">ArchWiki — Docker</a></li>
        <li><a href="https://wiki.archlinux.org/title/PostgreSQL" target="_blank" rel="noopener noreferrer">ArchWiki — PostgreSQL</a></li>
      </ul>
    </PageContainer>
  );
}
