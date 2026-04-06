import{j as a}from"./ui-K-J8Jkwj.js";import{P as r}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import{A as o}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function m(){return a.jsxs(r,{title:"Instalação de Software: Todos os Métodos",subtitle:"Como instalar qualquer programa no Arch Linux: binários, AppImage, tarballs, .deb/.rpm, PATH, atalhos no menu e mais.",difficulty:"iniciante",timeToRead:"25 min",children:[a.jsx("h2",{children:"Visão Geral"}),a.jsx("p",{children:"No Arch Linux, existem várias formas de instalar software. A ordem de preferência é:"}),a.jsxs("ol",{children:[a.jsxs("li",{children:[a.jsx("strong",{children:"Repositórios oficiais"})," — ",a.jsx("code",{children:"pacman -S pacote"})," (a melhor opção)"]}),a.jsxs("li",{children:[a.jsx("strong",{children:"AUR"})," — ",a.jsx("code",{children:"yay -S pacote"})," (pacotes da comunidade)"]}),a.jsxs("li",{children:[a.jsx("strong",{children:"Flatpak"})," — apps sandboxed (isolados)"]}),a.jsxs("li",{children:[a.jsx("strong",{children:"AppImage"})," — executável portátil (sem instalação)"]}),a.jsxs("li",{children:[a.jsx("strong",{children:"Binários avulsos"})," — downloads manuais do site oficial"]}),a.jsxs("li",{children:[a.jsx("strong",{children:".deb / .rpm"})," — pacotes de outras distros (último recurso)"]})]}),a.jsxs(o,{type:"info",title:"Sempre prefira o pacman/AUR",children:["Antes de baixar qualquer coisa manualmente, verifique se o programa existe nos repositórios oficiais (",a.jsx("code",{children:"pacman -Ss nome"}),") ou no AUR (",a.jsx("code",{children:"yay -Ss nome"}),"). Pacotes do pacman são atualizados automaticamente e gerenciados pelo sistema."]}),a.jsx("h2",{children:"1. Binários Standalone (Executável Único)"}),a.jsx("p",{children:"Muitos programas são distribuídos como um único arquivo executável. Basta baixar, dar permissão de execução e rodar. Exemplos: ferramentas CLI em Go, Rust, etc."}),a.jsx(e,{title:"Instalar um binário standalone",code:`# Exemplo: baixar um programa (ex: uma ferramenta CLI)
wget https://exemplo.com/programa-linux-amd64 -O programa

# Dar permissão de execução
chmod +x programa

# Testar
./programa --version

# Mover para um local no PATH (assim pode rodar de qualquer lugar)
sudo mv programa /usr/local/bin/

# Agora pode rodar de qualquer pasta:
programa --version`}),a.jsxs(o,{type:"warning",title:"O que é PATH?",children:["O ",a.jsx("code",{children:"PATH"})," é uma variável de ambiente que lista os diretórios onde o sistema procura executáveis. Quando você digita ",a.jsx("code",{children:"firefox"})," no terminal, o sistema procura em cada diretório do PATH até encontrar. Para ver seu PATH atual: ",a.jsx("code",{children:"echo $PATH"})]}),a.jsx("h3",{children:"Onde colocar executáveis?"}),a.jsx(e,{title:"Diretórios recomendados para executáveis",code:`# Para todos os usuários (precisa de sudo):
/usr/local/bin/      # Programas instalados manualmente
/usr/local/sbin/     # Programas administrativos manuais

# Apenas para seu usuário (sem sudo):
~/.local/bin/        # Recomendado para binários pessoais

# Verificar se ~/.local/bin está no PATH
echo $PATH | tr ':' '\\n' | grep local

# Se não estiver, adicionar ao seu .bashrc ou .zshrc:
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc`}),a.jsx("h2",{children:"2. Tarballs (Pasta com Vários Arquivos)"}),a.jsxs("p",{children:["Muitos programas vêm como um arquivo ",a.jsx("code",{children:".tar.gz"}),", ",a.jsx("code",{children:".tar.xz"})," ou ",a.jsx("code",{children:".tar.bz2"}),"que contém uma pasta com o executável e arquivos de suporte (bibliotecas, ícones, etc.). Exemplos: Firefox, Thunderbird, IntelliJ IDEA, Android Studio."]}),a.jsx(e,{title:"Instalar programa que vem como tarball",code:`# 1. Baixar o tarball
wget https://download.mozilla.org/?product=firefox-latest -O firefox.tar.bz2

# 2. Extrair
tar -xjf firefox.tar.bz2
# Ou para .tar.gz:
# tar -xzf programa.tar.gz
# Ou para .tar.xz:
# tar -xJf programa.tar.xz

# 3. Ver o conteúdo extraído
ls firefox/
# Vai ter: firefox (executável), libxul.so, etc.

# 4. Mover para /opt (diretório padrão para software de terceiros)
sudo mv firefox /opt/firefox

# 5. Criar link simbólico para poder rodar de qualquer lugar
sudo ln -sf /opt/firefox/firefox /usr/local/bin/firefox

# 6. Testar
firefox --version`}),a.jsxs(o,{type:"info",title:"Por que /opt?",children:["O diretório ",a.jsx("code",{children:"/opt"})," é o local padrão no Linux para instalar software de terceiros que vem como pasta completa (não um único executável). Seguir essa convenção mantém o sistema organizado. Cada programa fica em sua própria subpasta: ",a.jsx("code",{children:"/opt/firefox"}),", ",a.jsx("code",{children:"/opt/android-studio"}),", etc."]}),a.jsx("h2",{children:"3. Criar Atalho no Menu (Arquivo .desktop)"}),a.jsxs("p",{children:["Depois de instalar um programa manualmente, ele não aparece no menu do sistema. Para isso, você precisa criar um arquivo ",a.jsx("code",{children:".desktop"}),"."]}),a.jsx(e,{title:"Criar arquivo .desktop para um programa",code:`# Criar arquivo .desktop para o Firefox manual
sudo tee /usr/share/applications/firefox-manual.desktop << 'EOF'
[Desktop Entry]
Name=Firefox
Comment=Navegador Web Mozilla Firefox
Exec=/opt/firefox/firefox %u
Icon=/opt/firefox/browser/chrome/icons/default/default128.png
Terminal=false
Type=Application
Categories=Network;WebBrowser;
MimeType=text/html;text/xml;application/xhtml+xml;
StartupNotify=true
StartupWMClass=firefox
EOF

# Agora o Firefox aparece no menu do sistema!`}),a.jsx(e,{title:"Arquivo .desktop — campos explicados",code:`[Desktop Entry]
Name=Nome do Programa          # Nome que aparece no menu
Comment=Descrição curta         # Tooltip/descrição
Exec=/caminho/para/executavel   # Comando para rodar
Icon=/caminho/para/icone.png    # Ícone (pode ser nome do tema)
Terminal=false                  # true se for app de terminal
Type=Application                # Tipo (sempre Application)
Categories=Development;IDE;     # Categorias do menu
StartupNotify=true              # Mostrar indicador de carregamento
StartupWMClass=nome-da-janela   # Classe da janela (para agrupar)

# Locais para .desktop:
# /usr/share/applications/       — para todos os usuários (sudo)
# ~/.local/share/applications/   — só para seu usuário`}),a.jsx(e,{title:"Criar .desktop para seu usuário (sem sudo)",code:`# Criar diretório se não existir
mkdir -p ~/.local/share/applications

# Criar o .desktop
cat > ~/.local/share/applications/meu-programa.desktop << 'EOF'
[Desktop Entry]
Name=Meu Programa
Exec=/home/usuario/programas/meu-programa
Icon=/home/usuario/programas/icone.png
Terminal=false
Type=Application
Categories=Utility;
EOF

# Atualizar cache de desktop entries
update-desktop-database ~/.local/share/applications/`}),a.jsx("h2",{children:"4. AppImage — Executável Portátil"}),a.jsxs("p",{children:[a.jsx("strong",{children:"AppImage"})," é um formato que empacota o programa com todas as suas dependências em um único arquivo. Não precisa instalar nada — basta baixar, dar permissão e executar."]}),a.jsx(e,{title:"Usar AppImage",code:`# 1. Baixar o AppImage (exemplo: Obsidian)
wget https://github.com/obsidianmd/obsidian-releases/releases/download/v1.5.3/Obsidian-1.5.3.AppImage

# 2. Dar permissão de execução
chmod +x Obsidian-1.5.3.AppImage

# 3. Executar
./Obsidian-1.5.3.AppImage

# 4. (Opcional) Mover para local organizado
mkdir -p ~/AppImages
mv Obsidian-1.5.3.AppImage ~/AppImages/

# 5. Criar atalho no menu
cat > ~/.local/share/applications/obsidian.desktop << 'EOF'
[Desktop Entry]
Name=Obsidian
Exec=/home/usuario/AppImages/Obsidian-1.5.3.AppImage
Icon=obsidian
Terminal=false
Type=Application
Categories=Office;
EOF`}),a.jsx(e,{title:"Gerenciador de AppImages",code:`# AppImageLauncher — integra AppImages ao sistema automaticamente
yay -S appimagelauncher

# Quando você abrir um AppImage, ele pergunta se quer integrar
# Se sim, ele:
# - Move para ~/Applications/
# - Cria .desktop automaticamente
# - Gerencia atualizações

# Ou use o Gear Lever (GNOME)
flatpak install flathub it.mijorus.gearlever`}),a.jsx("h2",{children:"5. Pacotes .deb (Debian/Ubuntu)"}),a.jsxs("p",{children:["Muitos programas populares só distribuem pacotes ",a.jsx("code",{children:".deb"})," (feitos para Debian/Ubuntu). No Arch, você pode converter ou extrair esses pacotes."]}),a.jsx(e,{title:"Instalar pacote .deb no Arch Linux",code:`# Método 1: Converter .deb para pacote do Arch com debtap
# Instalar debtap
yay -S debtap

# Atualizar base de dados (necessário na primeira vez)
sudo debtap -u

# Converter o .deb
debtap pacote.deb
# Responder as perguntas (nome, licença)

# Instalar o pacote convertido
sudo pacman -U pacote-convertido.pkg.tar.zst`}),a.jsx(e,{title:"Método alternativo: extrair .deb manualmente",code:`# O .deb é basicamente um arquivo ar com tarballs dentro

# Extrair
ar x pacote.deb
# Isso cria: control.tar.xz, data.tar.xz, debian-binary

# Extrair os arquivos do programa
tar -xJf data.tar.xz -C /

# Mas CUIDADO: isso não é gerenciado pelo pacman
# Para remover, você precisa saber quais arquivos foram extraídos`}),a.jsx(o,{type:"warning",title:".deb no Arch — último recurso",children:"Converter .deb nem sempre funciona perfeitamente porque as dependências têm nomes diferentes no Arch. Sempre verifique primeiro se existe no AUR ou como Flatpak/AppImage. Muitos programas que só oferecem .deb (como VS Code, Discord, Spotify) estão no AUR."}),a.jsx("h2",{children:"6. Pacotes .rpm (Fedora/RHEL)"}),a.jsx(e,{title:"Converter .rpm para pacote do Arch",code:`# Instalar rpmextract
sudo pacman -S rpmextract

# Extrair conteúdo do .rpm
rpmextract.sh pacote.rpm
# Cria a estrutura de diretórios do pacote

# Ou usar o alien (via AUR) para converter
yay -S alien
alien -t pacote.rpm  # Converte para .tgz
# Depois extrair manualmente`}),a.jsx("h2",{children:"7. Compilar do Código-Fonte"}),a.jsx("p",{children:'Quando não existe pacote pronto, você pode compilar o programa a partir do código-fonte. Este é o método "clássico" do Linux.'}),a.jsx(e,{title:"Compilar programa do código-fonte",code:`# Instalar ferramentas de compilação
sudo pacman -S base-devel

# Padrão clássico: configure, make, make install
# 1. Baixar e extrair fonte
wget https://exemplo.com/programa-1.0.tar.gz
tar -xzf programa-1.0.tar.gz
cd programa-1.0

# 2. Configurar (verifica dependências e gera Makefile)
./configure --prefix=/usr/local
# Se faltar dependência, instale com pacman e tente de novo

# 3. Compilar
make -j$(nproc)
# -j$(nproc) usa todos os cores do CPU

# 4. Instalar
sudo make install

# Para desinstalar depois:
sudo make uninstall
# (nem todos os projetos suportam uninstall)

# Programas com CMake:
mkdir build && cd build
cmake .. -DCMAKE_INSTALL_PREFIX=/usr/local
make -j$(nproc)
sudo make install

# Programas com Meson:
meson setup build
cd build
ninja
sudo ninja install`}),a.jsx("h2",{children:"8. Scripts de Instalação (install.sh, setup.sh)"}),a.jsx("p",{children:"Alguns programas vêm com scripts de instalação. Sempre leia o script antes de executar!"}),a.jsx(e,{title:"Executar scripts de instalação",code:`# SEMPRE leia o script antes de executar
cat install.sh

# Dar permissão e executar
chmod +x install.sh
./install.sh

# Ou executar diretamente com bash
bash install.sh

# Alguns pedem sudo
sudo bash install.sh

# Muitos programas usam curl | bash (cuidado!)
# NUNCA execute sem ler antes:
curl -fsSL https://exemplo.com/install.sh | less  # LER PRIMEIRO
curl -fsSL https://exemplo.com/install.sh | bash  # Só depois de ler`}),a.jsxs(o,{type:"danger",title:"Segurança: curl | bash",children:["Executar ",a.jsx("code",{children:"curl | bash"})," sem ler o script é perigoso. O script pode fazer qualquer coisa no seu sistema. Sempre baixe primeiro, leia, e depois execute."]}),a.jsx("h2",{children:"9. Variável PATH — Tornar Qualquer Programa Acessível"}),a.jsxs("p",{children:["Se você instala um programa em um local personalizado (como ",a.jsx("code",{children:"~/programas/"}),"), precisa adicioná-lo ao PATH para poder rodá-lo de qualquer lugar."]}),a.jsx(e,{title:"Gerenciar o PATH",code:`# Ver PATH atual
echo $PATH

# O PATH é uma lista de diretórios separados por ':'
# /usr/local/bin:/usr/bin:/bin:/home/usuario/.local/bin

# Adicionar diretório ao PATH temporariamente (só nesta sessão)
export PATH="$PATH:/opt/meu-programa/bin"

# Adicionar permanentemente (editar ~/.bashrc ou ~/.zshrc)
echo 'export PATH="$PATH:/opt/meu-programa/bin"' >> ~/.bashrc
source ~/.bashrc

# Ou para ~/.zshrc se usar Zsh
echo 'export PATH="$PATH:/opt/meu-programa/bin"' >> ~/.zshrc
source ~/.zshrc

# Verificar se funcionou
which meu-programa
# Deve mostrar: /opt/meu-programa/bin/meu-programa

# Método alternativo: criar link simbólico
# Em vez de mexer no PATH, criar link em /usr/local/bin
sudo ln -sf /opt/meu-programa/bin/meu-programa /usr/local/bin/meu-programa`}),a.jsx("h2",{children:"10. Variáveis de Ambiente para SDKs"}),a.jsx("p",{children:"SDKs como Java, Flutter, Android Studio precisam de variáveis de ambiente configuradas além do PATH."}),a.jsx(e,{title:"Configurar variáveis de ambiente para SDKs",code:`# Editar ~/.bashrc ou ~/.zshrc

# Java (se instalado manualmente)
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk
export PATH="$JAVA_HOME/bin:$PATH"

# Flutter
export FLUTTER_HOME=~/desenvolvimento/flutter
export PATH="$FLUTTER_HOME/bin:$PATH"

# Android SDK
export ANDROID_HOME=~/Android/Sdk
export PATH="$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$PATH"

# Go
export GOPATH=~/go
export PATH="$GOPATH/bin:$PATH"

# Rust (configurado automaticamente pelo rustup)
# source ~/.cargo/env

# Aplicar mudanças
source ~/.bashrc`}),a.jsx("h2",{children:"Resumo: Qual Método Usar?"}),a.jsx(e,{title:"Árvore de decisão para instalar software",code:`# 1. Existe no pacman?
pacman -Ss nome-do-programa
# SIM → sudo pacman -S nome

# 2. Existe no AUR?
yay -Ss nome-do-programa
# SIM → yay -S nome

# 3. Existe como Flatpak?
flatpak search nome
# SIM → flatpak install flathub nome

# 4. Tem AppImage?
# → Baixar, chmod +x, executar, criar .desktop

# 5. Tem binário/tarball para Linux?
# → Baixar, extrair em /opt, criar link em /usr/local/bin, criar .desktop

# 6. Só tem .deb?
# → Converter com debtap, ou verificar AUR

# 7. Tem código-fonte?
# → Compilar com make/cmake, ou criar PKGBUILD`})]})}export{m as default};
