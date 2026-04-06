import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AmbienteDev() {
  return (
    <PageContainer
      title="Ambiente de Desenvolvimento"
      subtitle="Instale Java, Python, Node.js, Rust, Go e outras linguagens. Configure PATH, JAVA_HOME, SDKs e variáveis de ambiente — tudo que no Windows seria feito por aquela janela de 'Variáveis do Sistema'."
      difficulty="intermediario"
      timeToRead="35 min"
    >
      <h2>Variáveis de Ambiente no Linux vs Windows</h2>
      <p>
        No Windows, para configurar o Java ou qualquer SDK, você ia em <strong>Painel de Controle → Sistema →
        Configurações avançadas do sistema → Variáveis de Ambiente</strong> e adicionava o caminho na variável
        <code>PATH</code>. No Linux, <strong>não existe essa janela</strong>.
      </p>
      <p>
        No Linux, as variáveis de ambiente são configuradas em <strong>arquivos de texto</strong>. Quando
        você faz login, o sistema lê esses arquivos e carrega as variáveis. É mais simples e mais poderoso
        do que a interface do Windows, porque você tem controle total.
      </p>

      <h3>Onde ficam as variáveis de ambiente</h3>
      <CodeBlock
        title="Arquivos de configuração de variáveis"
        code={`# === VARIÁVEIS DO USUÁRIO (só para você) ===

~/.bashrc           # Carregado toda vez que você abre um terminal
~/.bash_profile     # Carregado quando você faz login (sessão de login)
~/.profile           # Alternativa ao .bash_profile (mais portátil)

# === VARIÁVEIS DO SISTEMA (para todos os usuários) ===

/etc/environment     # Variáveis globais simples (VAR=valor, uma por linha)
/etc/profile         # Script de login global
/etc/profile.d/*.sh  # Scripts adicionais carregados no login

# === QUAL USAR? ===
# Para a maioria dos casos, use o ~/.bashrc
# Para variáveis que precisam existir antes do terminal (ex: display managers),
# use ~/.bash_profile ou /etc/environment`}
      />

      <h3>Como o PATH funciona</h3>
      <p>
        A variável <code>PATH</code> é a mais importante. Ela diz ao sistema <strong>onde procurar
        programas</strong> quando você digita um comando. É uma lista de diretórios separados por <code>:</code>.
      </p>
      <CodeBlock
        title="Entendendo o PATH"
        code={`# Ver o PATH atual
echo $PATH
# /usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin:/home/joao/.local/bin

# Quando você digita "java", o sistema procura nessa ordem:
# 1. /usr/local/bin/java    → existe? Se sim, executa
# 2. /usr/bin/java           → existe? Se sim, executa
# 3. /bin/java               → existe? Se sim, executa
# ... e assim por diante

# Se não encontrar em nenhum diretório do PATH:
# bash: java: command not found

# === ADICIONAR UM DIRETÓRIO AO PATH ===

# Temporário (só neste terminal):
export PATH="$PATH:/caminho/novo"

# Permanente (adicionar ao ~/.bashrc):
echo 'export PATH="$PATH:$HOME/.local/bin"' >> ~/.bashrc
source ~/.bashrc    # Recarregar o arquivo

# IMPORTANTE: Sempre use $PATH: no início para NÃO perder os caminhos existentes!
# ERRADO: export PATH="/caminho/novo"           ← Apaga todo o PATH anterior!
# CERTO:  export PATH="$PATH:/caminho/novo"     ← Adiciona ao PATH existente`}
      />

      <AlertBox type="danger" title="Nunca sobrescreva o PATH inteiro!">
        <p>Se você fizer <code>export PATH="/algum/caminho"</code> sem incluir <code>$PATH</code>,
        vai perder acesso a TODOS os comandos do sistema (ls, cd, sudo, etc). Se isso acontecer,
        use o caminho absoluto: <code>/usr/bin/nano ~/.bashrc</code> para corrigir.</p>
      </AlertBox>

      <hr />

      <h2>1. Java (JDK)</h2>
      <p>
        No Arch Linux existem várias versões do Java disponíveis. O mais comum é usar o OpenJDK.
      </p>

      <h3>Instalar o Java</h3>
      <CodeBlock
        title="Instalar Java no Arch Linux"
        code={`# Ver versões disponíveis
pacman -Ss jdk | grep jre

# Instalar o JDK mais recente (ex: JDK 21)
sudo pacman -S jdk-openjdk

# Instalar uma versão específica
sudo pacman -S jdk17-openjdk     # Java 17 LTS
sudo pacman -S jdk11-openjdk     # Java 11 LTS
sudo pacman -S jdk21-openjdk     # Java 21 LTS

# Instalar apenas o JRE (só para rodar, sem compilar)
sudo pacman -S jre-openjdk

# Verificar se instalou
java --version
# openjdk 21.0.2 2026-01-16
# OpenJDK Runtime Environment (build 21.0.2+13)
# OpenJDK 64-Bit Server VM (build 21.0.2+13, mixed mode, sharing)

javac --version
# javac 21.0.2`}
      />

      <h3>Configurar JAVA_HOME</h3>
      <p>
        No Windows, você ia nas Variáveis de Ambiente e criava <code>JAVA_HOME</code> apontando para
        <code>C:\Program Files\Java\jdk-21</code>. No Linux, fazemos assim:
      </p>
      <CodeBlock
        title="Configurar JAVA_HOME"
        code={`# Descobrir onde o Java foi instalado
which java
# /usr/bin/java

# Seguir o link simbólico para descobrir o caminho real
readlink -f $(which java)
# /usr/lib/jvm/java-21-openjdk/bin/java

# O JAVA_HOME é o diretório pai (sem /bin/java):
# /usr/lib/jvm/java-21-openjdk

# Ou use o archlinux-java para ver:
archlinux-java status
# Available Java environments:
#   java-17-openjdk
#   java-21-openjdk (default)

# === CONFIGURAR PERMANENTEMENTE ===

# Adicionar ao ~/.bashrc:
echo 'export JAVA_HOME=/usr/lib/jvm/default' >> ~/.bashrc
echo 'export PATH="$PATH:$JAVA_HOME/bin"' >> ~/.bashrc
source ~/.bashrc

# Verificar:
echo $JAVA_HOME
# /usr/lib/jvm/default

# NOTA: /usr/lib/jvm/default é um link simbólico que aponta
# para a versão padrão do Java. Assim, se você trocar a versão
# padrão, o JAVA_HOME continua funcionando.`}
      />

      <h3>Alternar entre versões do Java</h3>
      <CodeBlock
        title="Gerenciar múltiplas versões do Java"
        code={`# O Arch Linux tem um gerenciador de versões do Java embutido!

# Ver versões instaladas
archlinux-java status
# Available Java environments:
#   java-17-openjdk
#   java-21-openjdk (default)

# Mudar a versão padrão
sudo archlinux-java set java-17-openjdk

# Verificar
java --version
# openjdk 17.0.x ...

# Voltar para a 21
sudo archlinux-java set java-21-openjdk`}
      />

      <AlertBox type="info" title="Diferença do Windows">
        <p>No Windows, você precisava baixar o instalador do Oracle, rodar o .exe, e depois
        configurar JAVA_HOME manualmente. No Arch, é só <code>pacman -S jdk-openjdk</code> e pronto.
        O gerenciador <code>archlinux-java</code> cuida de trocar versões sem mexer em variáveis.</p>
      </AlertBox>

      <h2>2. Python</h2>
      <CodeBlock
        title="Python no Arch Linux"
        code={`# Python já vem instalado no Arch Linux!
python --version
# Python 3.12.x

# IMPORTANTE: No Arch, "python" = Python 3. Não existe "python2" por padrão.
# Se precisar do Python 2 (raro): sudo pacman -S python2

# === PIP (gerenciador de pacotes Python) ===
# No Arch, o pip já vem com o Python

pip --version
# pip 24.x from /usr/lib/python3.12/site-packages/pip

# Instalar um pacote Python
pip install requests

# ATENÇÃO: No Arch, o pip pode conflitar com o pacman!
# O Arch gerencia pacotes Python pelo pacman. Se instalar pelo pip
# globalmente, pode quebrar coisas.

# SOLUÇÃO: Use ambientes virtuais (venv) SEMPRE!

# === AMBIENTES VIRTUAIS (a forma correta) ===

# Criar um ambiente virtual
python -m venv meu_projeto_env

# Ativar o ambiente virtual
source meu_projeto_env/bin/activate

# Agora o prompt muda:
# (meu_projeto_env) joao@meupc:~$

# Instalar pacotes dentro do venv (seguro, não afeta o sistema)
pip install flask requests numpy pandas

# Ver pacotes instalados
pip list

# Salvar dependências
pip freeze > requirements.txt

# Instalar dependências de um projeto
pip install -r requirements.txt

# Desativar o ambiente virtual
deactivate

# === PACOTES PYTHON VIA PACMAN (alternativa) ===
# Para pacotes que você quer globalmente:
sudo pacman -S python-requests    # Nome: python-<pacote>
sudo pacman -S python-numpy
sudo pacman -S python-flask
sudo pacman -S python-pip`}
      />

      <AlertBox type="warning" title="pip install --break-system-packages">
        <p>Se tentar instalar com <code>pip install</code> sem venv, o Python vai dar erro:
        "externally-managed-environment". Isso é uma proteção! Use <code>python -m venv</code>
        para criar um ambiente virtual, ou instale via <code>pacman</code>. Nunca use
        <code>--break-system-packages</code> a menos que saiba o que está fazendo.</p>
      </AlertBox>

      <h2>3. Node.js (JavaScript/TypeScript)</h2>
      <CodeBlock
        title="Node.js e npm"
        code={`# === OPÇÃO 1: Via pacman (versão dos repositórios) ===
sudo pacman -S nodejs npm

node --version
# v21.x.x

npm --version
# 10.x.x

# === OPÇÃO 2: Via nvm (gerenciador de versões - RECOMENDADO) ===
# O nvm permite instalar e alternar entre múltiplas versões do Node

# Instalar o nvm via AUR
yay -S nvm

# Adicionar ao ~/.bashrc:
echo 'source /usr/share/nvm/init-nvm.sh' >> ~/.bashrc
source ~/.bashrc

# Instalar versões do Node
nvm install --lts          # Instalar a versão LTS mais recente
nvm install 20             # Instalar Node 20 especificamente
nvm install 18             # Instalar Node 18

# Listar versões instaladas
nvm ls
#        v18.19.0
#        v20.11.0
# ->     v20.11.0 (LTS)
# default -> lts/* (-> v20.11.0)

# Alternar entre versões
nvm use 18                 # Usar Node 18
nvm use 20                 # Usar Node 20
nvm alias default 20       # Definir 20 como padrão

# === NPM GLOBAL ===
# Instalar pacotes globais
npm install -g typescript
npm install -g yarn
npm install -g pnpm

# Ver pacotes globais instalados
npm list -g --depth=0

# === PNPM (alternativa mais rápida ao npm) ===
sudo pacman -S pnpm
# ou
npm install -g pnpm`}
      />

      <h2>4. Rust</h2>
      <CodeBlock
        title="Instalar Rust"
        code={`# A forma recomendada é via rustup (gerenciador oficial)
# NÃO instale pelo pacman, use o rustup:

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# O instalador vai perguntar:
# 1) Proceed with standard installation (default - just press enter)
# 2) Customize installation
# 3) Cancel installation
# Escolha 1 (Enter)

# Carregar as variáveis no terminal atual
source $HOME/.cargo/env

# Ou adicionar ao ~/.bashrc (o instalador já faz isso):
# source "$HOME/.cargo/env"

# Verificar
rustc --version
# rustc 1.76.0

cargo --version
# cargo 1.76.0

# === USANDO O RUST ===

# Criar um novo projeto
cargo new meu_projeto
cd meu_projeto

# Compilar e rodar
cargo run

# Compilar sem rodar
cargo build

# Compilar para produção (otimizado)
cargo build --release

# Atualizar o Rust
rustup update

# Instalar componentes extras
rustup component add clippy     # Linter
rustup component add rustfmt    # Formatador de código`}
      />

      <h2>5. Go (Golang)</h2>
      <CodeBlock
        title="Instalar Go"
        code={`# Instalar via pacman
sudo pacman -S go

go version
# go version go1.22.0 linux/amd64

# === CONFIGURAR GOPATH ===
# O Go usa o GOPATH para armazenar código e binários

# Adicionar ao ~/.bashrc:
echo 'export GOPATH=$HOME/go' >> ~/.bashrc
echo 'export PATH="$PATH:$GOPATH/bin"' >> ~/.bashrc
source ~/.bashrc

# O diretório ~/go é criado automaticamente
# ~/go/bin    → Binários instalados com "go install"
# ~/go/pkg    → Pacotes compilados
# ~/go/src    → Código fonte (modo antigo)

# === USANDO O GO ===

# Criar um módulo (projeto)
mkdir meu-projeto && cd meu-projeto
go mod init meu-projeto

# Rodar um programa
go run main.go

# Compilar um binário
go build -o meu_app main.go

# Instalar uma ferramenta Go globalmente
go install github.com/air-verse/air@latest    # Hot reload para Go`}
      />

      <h2>6. C e C++</h2>
      <CodeBlock
        title="Compiladores C/C++"
        code={`# O gcc e g++ já vêm com o base-devel (se você instalou nos Primeiros Passos)
# Se não instalou:
sudo pacman -S base-devel

# Verificar
gcc --version
# gcc (GCC) 13.2.1
g++ --version
# g++ (GCC) 13.2.1

# === COMPILAR C ===
# Criar arquivo
nano hello.c
# #include <stdio.h>
# int main() {
#     printf("Hello, Arch Linux!\\n");
#     return 0;
# }

# Compilar
gcc -o hello hello.c

# Executar
./hello
# Hello, Arch Linux!

# === COMPILAR C++ ===
g++ -o programa programa.cpp

# Com warnings e otimização
gcc -Wall -Wextra -O2 -o programa programa.c

# === FERRAMENTAS EXTRAS ===
sudo pacman -S cmake        # Sistema de build (usado por muitos projetos)
sudo pacman -S gdb          # Debugger
sudo pacman -S valgrind     # Detector de vazamento de memória
sudo pacman -S clang        # Compilador alternativo ao GCC (da LLVM)`}
      />

      <h2>7. Docker</h2>
      <CodeBlock
        title="Instalar e configurar Docker"
        code={`# Instalar
sudo pacman -S docker docker-compose

# Adicionar seu usuário ao grupo docker (para rodar sem sudo)
sudo usermod -aG docker $USER

# IMPORTANTE: Faça logout e login novamente para o grupo fazer efeito!
# Ou use: newgrp docker

# Habilitar e iniciar o serviço
sudo systemctl enable docker
sudo systemctl start docker

# Verificar
docker --version
# Docker version 25.x.x

docker run hello-world
# Hello from Docker!

# === COMANDOS BÁSICOS ===
docker ps                          # Listar containers rodando
docker ps -a                       # Listar todos (incluindo parados)
docker images                      # Listar imagens baixadas
docker pull ubuntu                 # Baixar uma imagem
docker run -it ubuntu bash         # Rodar container interativo
docker stop <container_id>         # Parar container
docker rm <container_id>           # Remover container
docker rmi <image_id>              # Remover imagem

# === DOCKER COMPOSE ===
docker compose up                  # Subir os serviços
docker compose up -d               # Subir em background
docker compose down                # Parar os serviços
docker compose logs -f             # Ver logs em tempo real`}
      />

      <h2>8. Editores de Código e IDEs</h2>
      <CodeBlock
        title="Instalar editores e IDEs"
        code={`# === VS Code ===
# O VS Code oficial da Microsoft (binário pré-compilado):
yay -S visual-studio-code-bin

# Versão open-source (sem telemetria da Microsoft):
sudo pacman -S code

# === JetBrains (IntelliJ, PyCharm, WebStorm, etc.) ===
# Via AUR:
yay -S intellij-idea-community-edition   # IntelliJ IDEA (Java)
yay -S pycharm-community-edition         # PyCharm (Python)
yay -S webstorm                          # WebStorm (JS/TS)
yay -S goland                            # GoLand (Go)
yay -S clion                             # CLion (C/C++)

# Ou instalar o JetBrains Toolbox (gerencia todas as IDEs):
yay -S jetbrains-toolbox

# === Sublime Text ===
yay -S sublime-text-4

# === Neovim (Vim turbinado) ===
sudo pacman -S neovim

# === Emacs ===
sudo pacman -S emacs`}
      />

      <h2>9. Git (Configuração Inicial)</h2>
      <CodeBlock
        title="Configurar Git para desenvolvimento"
        code={`# O git já deve estar instalado (dos Primeiros Passos)
git --version
# git version 2.44.0

# Configurar identidade (obrigatório para commits)
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Configurar editor padrão
git config --global core.editor nano    # ou vim, code, etc.

# Configurar branch padrão
git config --global init.defaultBranch main

# Ver todas as configurações
git config --list

# === CHAVE SSH PARA GITHUB/GITLAB ===

# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu@email.com"
# Pressione Enter para aceitar o caminho padrão (~/.ssh/id_ed25519)
# Digite uma senha (ou Enter para sem senha)

# Iniciar o ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copiar a chave pública para colar no GitHub
cat ~/.ssh/id_ed25519.pub
# ssh-ed25519 AAAAC3NzaC1lZDI... seu@email.com

# Cole essa chave em: GitHub → Settings → SSH and GPG Keys → New SSH Key

# Testar a conexão
ssh -T git@github.com
# Hi usuario! You've successfully authenticated`}
      />

      <h2>10. Android SDK (Desenvolvimento Mobile)</h2>
      <CodeBlock
        title="Configurar Android SDK"
        code={`# === OPÇÃO 1: Via Android Studio (mais fácil) ===
yay -S android-studio

# O Android Studio baixa o SDK automaticamente na primeira execução.
# Geralmente fica em: ~/Android/Sdk

# Adicionar ao ~/.bashrc:
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH="$PATH:$ANDROID_HOME/emulator"' >> ~/.bashrc
echo 'export PATH="$PATH:$ANDROID_HOME/platform-tools"' >> ~/.bashrc
echo 'export PATH="$PATH:$ANDROID_HOME/tools"' >> ~/.bashrc
echo 'export PATH="$PATH:$ANDROID_HOME/tools/bin"' >> ~/.bashrc
source ~/.bashrc

# Verificar
adb --version
# Android Debug Bridge version 1.0.41

# === OPÇÃO 2: Só o SDK (sem Android Studio) ===
yay -S android-sdk android-sdk-platform-tools android-sdk-build-tools

# O SDK fica em /opt/android-sdk
echo 'export ANDROID_HOME=/opt/android-sdk' >> ~/.bashrc
echo 'export PATH="$PATH:$ANDROID_HOME/platform-tools"' >> ~/.bashrc
source ~/.bashrc

# === FLUTTER ===
yay -S flutter

# Verificar se tudo está OK
flutter doctor`}
      />

      <h2>11. Banco de Dados</h2>
      <CodeBlock
        title="Instalar bancos de dados"
        code={`# === POSTGRESQL ===
sudo pacman -S postgresql

# Inicializar o banco de dados (só na primeira vez)
sudo -u postgres initdb -D /var/lib/postgres/data

# Habilitar e iniciar
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Criar seu usuário no PostgreSQL
sudo -u postgres createuser --interactive
# Enter name of role to add: joao
# Shall the new role be a superuser? y

# Criar um banco de dados
sudo -u postgres createdb meu_banco

# Conectar
psql -d meu_banco

# === MYSQL / MARIADB ===
sudo pacman -S mariadb

# Inicializar
sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql

# Habilitar e iniciar
sudo systemctl enable mariadb
sudo systemctl start mariadb

# Configuração de segurança (definir senha do root, etc.)
sudo mysql_secure_installation

# Conectar
mysql -u root -p

# === SQLITE ===
sudo pacman -S sqlite

# SQLite não precisa de servidor, é só um arquivo:
sqlite3 meu_banco.db

# === REDIS ===
sudo pacman -S redis
sudo systemctl enable redis
sudo systemctl start redis
redis-cli ping
# PONG

# === MONGODB ===
yay -S mongodb-bin
sudo systemctl enable mongodb
sudo systemctl start mongodb`}
      />

      <h2>Resumo: Variáveis de Ambiente Comuns para Dev</h2>
      <CodeBlock
        title="~/.bashrc completo para desenvolvedor"
        code={`# Adicione estas linhas ao final do seu ~/.bashrc
# (edite com: nano ~/.bashrc)

# Java
export JAVA_HOME=/usr/lib/jvm/default
export PATH="$PATH:$JAVA_HOME/bin"

# Go
export GOPATH=$HOME/go
export PATH="$PATH:$GOPATH/bin"

# Rust (adicionado automaticamente pelo rustup)
source "$HOME/.cargo/env"

# Node.js via nvm
source /usr/share/nvm/init-nvm.sh

# Android SDK
export ANDROID_HOME=$HOME/Android/Sdk
export PATH="$PATH:$ANDROID_HOME/emulator"
export PATH="$PATH:$ANDROID_HOME/platform-tools"

# Scripts pessoais
export PATH="$PATH:$HOME/.local/bin"
export PATH="$PATH:$HOME/scripts"

# Editor padrão
export EDITOR=nano
export VISUAL=nano

# Depois de editar, recarregue com:
# source ~/.bashrc`}
      />

      <AlertBox type="success" title="Dica: Veja o que está no PATH">
        <p>A qualquer momento, rode <code>echo $PATH | tr ':' '\n'</code> para ver cada diretório
        do PATH em uma linha separada. Isso facilita verificar se o caminho do seu SDK/Java/Node
        está incluído.</p>
      </AlertBox>
    </PageContainer>
  );
}
