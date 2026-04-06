import{j as o}from"./ui-K-J8Jkwj.js";import{P as s}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import{A as a}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function p(){return o.jsxs(s,{title:"Pacman: O Gerenciador de Pacotes",subtitle:"O coração do Arch Linux. O pacman é responsável por instalar, atualizar e remover softwares de forma rápida e eficiente.",difficulty:"iniciante",timeToRead:"15 min",children:[o.jsxs("p",{children:["O ",o.jsx("code",{children:"pacman"})," combina um formato simples de pacotes binários com um sistema de construção de pacotes fácil de usar. Ele cuida da resolução de dependências, permitindo atualizar o sistema inteiro com um único comando."]}),o.jsx("h2",{children:"A Regra de Ouro do Arch Linux"}),o.jsxs(a,{type:"danger",title:"Nunca atualize pacotes parciais (Partial Upgrades)",children:["No Arch, o sistema sempre assume que você tem ",o.jsx("strong",{children:"tudo"})," atualizado. Se você rodar ",o.jsx("code",{children:"pacman -Sy pacote"}),"(que atualiza o banco de dados e instala um pacote) sem atualizar o resto do sistema, você pode quebrar bibliotecas essenciais (como a glibc) e destruir seu sistema.",o.jsx("br",{}),o.jsx("br",{}),o.jsx("strong",{children:"Ação correta:"})," Sempre instale pacotes e atualize o sistema junto usando ",o.jsx("code",{children:"pacman -Syu pacote"}),"."]}),o.jsx("h2",{children:"1. Instalação e Atualização (-S: Sync)"}),o.jsx("p",{children:"As operações de sincronização lidam com a base de dados remota (repositórios oficiais)."}),o.jsx(e,{title:"Atualizar todo o sistema (O comando que você mais vai usar)",code:"sudo pacman -Syu"}),o.jsxs("p",{className:"text-sm mt-2 mb-6",children:[o.jsx("code",{children:"-S"})," sincroniza, ",o.jsx("code",{children:"-y"})," atualiza o banco de dados local com o servidor, ",o.jsx("code",{children:"-u"})," atualiza os pacotes desatualizados."]}),o.jsx(e,{title:"Instalar um ou mais pacotes",code:"sudo pacman -S firefox vlc discord"}),o.jsx(e,{title:"Forçar a atualização do banco de dados (útil se trocou os mirrors)",code:"sudo pacman -Syyu"}),o.jsx(e,{title:"Buscar pacotes nos repositórios oficiais",code:"pacman -Ss <palavra-chave>"}),o.jsx(e,{title:"Ver informações detalhadas de um pacote ANTES de instalar",code:"pacman -Si <nome-do-pacote>"}),o.jsx("h2",{children:"2. Remoção de Pacotes (-R: Remove)"}),o.jsx(e,{title:"Remover pacote simples (deixa dependências que vieram com ele)",code:"sudo pacman -R <pacote>"}),o.jsxs(a,{type:"warning",title:"A forma correta de remover",children:["Sempre use ",o.jsx("code",{children:"-Rs"})," em vez de apenas ",o.jsx("code",{children:"-R"}),". Isso remove o pacote e todas as dependências que foram instaladas por ele e que não são mais necessárias por nenhum outro programa."]}),o.jsx(e,{title:"Remover pacote e suas dependências órfãs (MUITO RECOMENDADO)",code:"sudo pacman -Rs <pacote>"}),o.jsx(e,{title:"Remover pacote, dependências e arquivos de configuração globais",code:"sudo pacman -Rns <pacote>"}),o.jsx("h2",{children:"3. Consultas Locais (-Q: Query)"}),o.jsxs("p",{children:["Estas flags consultam a base de dados de pacotes que ",o.jsx("strong",{children:"já estão instalados"})," no seu computador."]}),o.jsx(e,{title:"Listar TODOS os pacotes instalados no sistema",code:"pacman -Q"}),o.jsx(e,{title:"Buscar entre os pacotes instalados",code:"pacman -Qs <palavra-chave>"}),o.jsx(e,{title:"Saber a qual pacote um arquivo específico pertence",code:"pacman -Qo /usr/bin/python"}),o.jsx(e,{title:"Listar todos os arquivos instalados por um pacote",code:"pacman -Ql <pacote>"}),o.jsx("h3",{children:"Limpando Dependências Órfãs"}),o.jsx("p",{children:'Com o tempo, pacotes deixam restos chamados de órfãos (arquivos instalados como dependência que não têm mais o pacote "pai"). Para limpar seu sistema:'}),o.jsx(e,{title:"Listar pacotes órfãos",code:"pacman -Qdt"}),o.jsx(e,{title:"Remover todos os órfãos de uma vez",code:"sudo pacman -Rns $(pacman -Qdtq)"}),o.jsx("h2",{children:"4. Limpeza de Cache (-Sc)"}),o.jsxs("p",{children:["O pacman guarda o arquivo `.pkg.tar.zst` de TUDO que ele baixa na pasta ",o.jsx("code",{children:"/var/cache/pacman/pkg/"}),". Se você não limpar, isso vai engolir dezenas de gigabytes do seu disco."]}),o.jsx(e,{title:"Limpar versões antigas, mantendo apenas a atual (SEGURO)",code:"sudo pacman -Sc"}),o.jsx(e,{title:"Limpar o cache INTEIRO (não recomendado se você tem internet ruim e precisa fazer downgrade)",code:"sudo pacman -Scc"}),o.jsx("h2",{children:"5. Como Buscar e Instalar Programas (Guia Prático)"}),o.jsxs("p",{children:["No Windows, para instalar um programa você vai no site, baixa o ",o.jsx("code",{children:".exe"})," e roda o instalador. No Ubuntu/Fedora, você baixa um ",o.jsx("code",{children:".deb"})," ou ",o.jsx("code",{children:".rpm"}),". No Arch Linux, a lógica é completamente diferente — ",o.jsx("strong",{children:"tudo é instalado por comandos no terminal"}),', diretamente dos repositórios. Não precisa abrir site, baixar arquivo, nem clicar em "Next, Next, Finish".']}),o.jsx("h3",{children:"De onde vêm os pacotes?"}),o.jsx("p",{children:'O Arch Linux tem dois "lugares" de onde você pode instalar programas:'}),o.jsxs("ul",{children:[o.jsxs("li",{children:[o.jsx("strong",{children:"Repositórios Oficiais"})," — Mantidos pela equipe do Arch Linux. São os pacotes mais seguros e confiáveis. Instalados com ",o.jsx("code",{children:"pacman -S"}),"."]}),o.jsxs("li",{children:[o.jsx("strong",{children:"AUR (Arch User Repository)"})," — Mantidos pela comunidade. Qualquer pessoa pode enviar. Contém programas que não estão nos repositórios oficiais (como Google Chrome, VS Code, Spotify). Instalados com ",o.jsx("code",{children:"yay -S"})," ou ",o.jsx("code",{children:"paru -S"}),"."]})]}),o.jsx(a,{type:"info",title:"Por que o Chrome e o VS Code não estão no repositório oficial?",children:o.jsx("p",{children:"Porque são softwares proprietários (código fechado). Os repositórios oficiais do Arch priorizam software livre e open-source. Mas a comunidade empacota esses programas no AUR, então você consegue instalar facilmente. Alternativas open-source como Chromium e Code OSS (VS Code sem telemetria da Microsoft) estão nos repositórios oficiais."})}),o.jsx("h3",{children:"Passo 1: Buscar se o programa existe"}),o.jsx(e,{title:"Como procurar um programa",code:`# === BUSCAR NOS REPOSITÓRIOS OFICIAIS ===
pacman -Ss firefox
# extra/firefox 124.0-1
#     Standalone web browser from mozilla.org

pacman -Ss obs
# extra/obs-studio 30.0.2-2
#     Free, open source software for live streaming and recording

pacman -Ss vlc
# extra/vlc 3.0.20-7
#     Multi-platform MPEG, VCD/DVD, and DivX player

# Buscar VS Code nos repositórios oficiais:
pacman -Ss visual-studio
# (nada encontrado — não está no repositório oficial!)

pacman -Ss code
# extra/code 1.87.0-1
#     The Open Source build of Visual Studio Code (vscode) editor
# Esse é o "Code OSS", versão open-source sem telemetria da Microsoft

# === BUSCAR NO AUR (usando yay ou paru) ===
# Para programas que não estão no repositório oficial:
yay -Ss visual-studio-code
# aur/visual-studio-code-bin 1.87.0-1 (+3456 12.34)
#     Visual Studio Code (vscode): Editor for building and debugging...

yay -Ss google-chrome
# aur/google-chrome 123.0.6312.86-1 (+5678 23.45)
#     The popular web browser by Google (Stable Channel)

yay -Ss spotify
# aur/spotify 1.2.31.1205-1 (+9876 45.67)
#     A proprietary music streaming service

# O número entre parênteses (ex: +3456) são os votos da comunidade
# Mais votos = pacote mais confiável e popular`}),o.jsx("h3",{children:"Passo 2: Instalar o programa"}),o.jsx(e,{title:"Instalando programas populares",code:`# === PROGRAMAS NOS REPOSITÓRIOS OFICIAIS (pacman -S) ===
# Estes são confiáveis, mantidos pela equipe do Arch:

sudo pacman -S firefox          # Navegador Firefox
sudo pacman -S chromium         # Navegador Chromium (Chrome open-source)
sudo pacman -S obs-studio       # OBS Studio (gravação de tela/streaming)
sudo pacman -S vlc              # Player de vídeo VLC
sudo pacman -S gimp             # Editor de imagens (tipo Photoshop)
sudo pacman -S libreoffice-fresh # LibreOffice (tipo Microsoft Office)
sudo pacman -S discord          # Discord
sudo pacman -S steam            # Steam (jogos)
sudo pacman -S telegram-desktop # Telegram
sudo pacman -S code             # VS Code OSS (versão open-source)
sudo pacman -S kdenlive         # Editor de vídeo
sudo pacman -S audacity         # Editor de áudio
sudo pacman -S blender          # Modelagem 3D
sudo pacman -S neofetch         # Informações do sistema (aquele print bonito)
sudo pacman -S htop             # Monitor de processos
sudo pacman -S qbittorrent      # Cliente BitTorrent

# Instalar vários de uma vez:
sudo pacman -S firefox vlc obs-studio gimp discord

# === PROGRAMAS NO AUR (yay -S ou paru -S) ===
# Estes são mantidos pela comunidade:

yay -S google-chrome            # Google Chrome
yay -S visual-studio-code-bin   # VS Code da Microsoft (com telemetria)
yay -S spotify                  # Spotify
yay -S brave-bin                # Navegador Brave
yay -S microsoft-edge-stable-bin  # Microsoft Edge
yay -S whatsapp-nativefier-dark # WhatsApp Desktop
yay -S zoom                     # Zoom
yay -S teams                    # Microsoft Teams
yay -S slack-desktop            # Slack
yay -S dropbox                  # Dropbox`}),o.jsx(a,{type:"warning",title:"Diferença entre pacman e yay",children:o.jsxs("p",{children:["Use ",o.jsx("code",{children:"sudo pacman -S"})," para repositórios oficiais. Use ",o.jsx("code",{children:"yay -S"}),"(sem sudo!) para pacotes do AUR. O yay também instala pacotes oficiais, então na dúvida pode usar ",o.jsx("code",{children:"yay -S"})," para tudo — ele procura nos dois lugares automaticamente. Mas pacotes AUR devem ser usados com mais cuidado (veja a página AUR & Helpers)."]})}),o.jsx("h3",{children:"Entendendo os nomes dos pacotes no AUR"}),o.jsx(e,{title:"Sufixos dos pacotes no AUR",code:`# Muitos programas no AUR têm variações:

# google-chrome          → Compila do código-fonte (pode demorar)
# google-chrome-bin      → Baixa o binário pronto (RÁPIDO, recomendado!)

# visual-studio-code-bin → Binário oficial da Microsoft
# code                   → Versão open-source (repositório oficial)

# spotify                → Empacotado pela comunidade
# spotify-dev            → Versão de desenvolvimento

# Resumo dos sufixos:
# -bin   = binário pré-compilado (instala rápido, recomendado!)
# -git   = última versão do código (pode ser instável)
# (nada) = compila do código-fonte (demora mais)

# Na prática, quando existir a versão -bin, prefira ela!
# É mais rápida de instalar e funciona igual.`}),o.jsx("h3",{children:"Exemplo completo: Instalar OBS Studio"}),o.jsx(e,{title:"Instalando OBS Studio passo a passo",code:`# 1. Buscar o pacote:
pacman -Ss obs
# extra/obs-studio 30.0.2-2
#     Free, open source software for live streaming and recording

# Está no repositório oficial! Ótimo, pode instalar com pacman.

# 2. Ver informações do pacote:
pacman -Si obs-studio
# Repository     : extra
# Name           : obs-studio
# Version        : 30.0.2-2
# Description    : Free, open source software for live streaming and recording
# URL            : https://obsproject.com
# Licenses       : GPL2
# Depends On     : curl ffmpeg jack2 jansson libxcomposite ...
# Download Size  : 12.45 MiB
# Installed Size : 45.67 MiB

# 3. Instalar:
sudo pacman -S obs-studio

# O pacman vai mostrar:
# resolving dependencies...
# looking for conflicting packages...
#
# Packages (5) ffmpeg-2:6.1.1-1  jack2-1.9.22-1  ...  obs-studio-30.0.2-2
#
# Total Download Size:   25.34 MiB
# Total Installed Size:  89.12 MiB
#
# :: Proceed with installation? [Y/n]
#
# Aperte Y ou Enter para confirmar.

# 4. Abrir o OBS:
obs
# Ou abra pelo menu de aplicativos do seu desktop`}),o.jsx("h3",{children:"Exemplo completo: Instalar Google Chrome"}),o.jsx(e,{title:"Instalando Google Chrome passo a passo",code:`# 1. Buscar no repositório oficial:
pacman -Ss google-chrome
# (nada encontrado)

# Não está no repositório oficial. Vamos procurar no AUR:
yay -Ss google-chrome
# aur/google-chrome 123.0.6312.86-1 (+5678 23.45)
#     The popular web browser by Google (Stable Channel)
# aur/google-chrome-beta ...
# aur/google-chrome-dev ...

# 2. Instalar a versão estável:
yay -S google-chrome

# O yay vai:
# - Mostrar o PKGBUILD (script de instalação)
# - Perguntar se quer ver as diferenças (diffs)
# - Baixar e instalar

# :: Proceed with installation? [Y/n]
# Aperte Y ou Enter.

# 3. Pronto! Abra pelo menu ou pelo terminal:
google-chrome-stable

# === ALTERNATIVA: Chromium (versão open-source do Chrome) ===
# Se não quer usar o AUR, o Chromium está no repositório oficial:
sudo pacman -S chromium
# É basicamente o Chrome sem os serviços do Google
# (sem login do Google, sem sync automático)`}),o.jsx("h3",{children:"Exemplo completo: Instalar VS Code"}),o.jsx(e,{title:"Instalando VS Code passo a passo",code:`# OPÇÃO 1: VS Code Open Source (repositório oficial)
# É o VS Code sem telemetria da Microsoft
sudo pacman -S code

# OPÇÃO 2: VS Code da Microsoft (AUR - com marketplace e extensões)
# Esta é a versão que você baixaria do site da Microsoft
yay -S visual-studio-code-bin

# A diferença:
# "code" (pacman)              → Open source, sem telemetria, marketplace limitado
# "visual-studio-code-bin" (AUR) → Igual ao do Windows, com todas as extensões

# Na prática, a maioria dos desenvolvedores usa visual-studio-code-bin
# porque tem acesso completo ao marketplace de extensões.

# Abrir:
code           # Se instalou pelo pacman
code           # Se instalou pelo AUR (mesmo comando)`}),o.jsx("h3",{children:"Verificar se um programa já está instalado"}),o.jsx(e,{title:"Consultar pacotes instalados",code:`# Verificar se o Firefox está instalado:
pacman -Qs firefox
# local/firefox 124.0-1
#     Standalone web browser from mozilla.org

# Se não retornar nada, o programa não está instalado.

# Ver todos os programas instalados:
pacman -Q
# (lista enorme com todos os pacotes)

# Contar quantos pacotes você tem instalados:
pacman -Q | wc -l
# 847

# Ver apenas pacotes que VOCÊ instalou (não dependências):
pacman -Qe

# Ver pacotes que vieram do AUR:
pacman -Qm

# Descobrir qual pacote instalou um arquivo:
pacman -Qo /usr/bin/obs
# /usr/bin/obs is owned by obs-studio 30.0.2-2`}),o.jsx("h3",{children:'"Mas no Ubuntu/Fedora o site oferece .deb/.rpm..."'}),o.jsxs("p",{children:["Muitos programas (como VS Code, Chrome, Discord) oferecem download de ",o.jsx("code",{children:".deb"}),"(Debian/Ubuntu) e ",o.jsx("code",{children:".rpm"})," (Fedora/Red Hat) no site oficial. Esses formatos",o.jsx("strong",{children:" NÃO funcionam no Arch Linux"}),"."]}),o.jsx(a,{type:"danger",title:"NÃO baixe .deb nem .rpm para o Arch!",children:o.jsxs("p",{children:["O Arch usa o formato ",o.jsx("code",{children:".pkg.tar.zst"}),". Não tente instalar arquivos .deb ou .rpm — eles são de outras distribuições. Em vez disso, busque o programa no pacman (",o.jsx("code",{children:"pacman -Ss"}),") ou no AUR (",o.jsx("code",{children:"yay -Ss"}),"). A comunidade do Arch já empacotou praticamente tudo que existe para funcionar corretamente no Arch."]})}),o.jsx("h3",{children:"Alternativas a programas populares"}),o.jsx("p",{children:"Alguns programas do Windows não existem no Linux, mas têm alternativas excelentes:"}),o.jsx(e,{title:"Equivalências Windows → Linux",language:"text",code:`Windows               Linux (Arch)              Instalar com
──────────────────────────────────────────────────────────────────
Photoshop          →  GIMP                   →  sudo pacman -S gimp
Microsoft Office   →  LibreOffice            →  sudo pacman -S libreoffice-fresh
Notepad++          →  Kate / VS Code         →  sudo pacman -S kate
Windows Media Player → VLC                   →  sudo pacman -S vlc
Paint              →  Pinta / Drawing        →  sudo pacman -S pinta
WinRAR             →  File Roller (GNOME)    →  sudo pacman -S file-roller
Gerenciador Tarefas → htop / btop            →  sudo pacman -S htop btop
OBS Studio         →  OBS Studio (mesmo!)    →  sudo pacman -S obs-studio
Discord            →  Discord (mesmo!)       →  sudo pacman -S discord
Steam              →  Steam (mesmo!)         →  sudo pacman -S steam
Spotify            →  Spotify                →  yay -S spotify
Chrome             →  Chromium / Chrome      →  pacman -S chromium  OU  yay -S google-chrome
VS Code            →  VS Code                →  yay -S visual-studio-code-bin
Terminal (cmd/PS)  →  Bash/Zsh (já incluído) →  (já vem instalado)
Explorer           →  Nautilus/Dolphin/Thunar →  (vem com o DE)`}),o.jsx("h2",{children:"6. Flatpak e Snap (Alternativas ao pacman)"}),o.jsx("p",{children:"Além do pacman e AUR, existem outros formatos de instalação de programas no Linux. Eles são universais — funcionam em qualquer distribuição (Arch, Ubuntu, Fedora, etc.)."}),o.jsx(e,{title:"Flatpak",code:`# Instalar o Flatpak
sudo pacman -S flatpak

# Buscar programas no Flatpak:
flatpak search spotify

# Instalar um programa via Flatpak:
flatpak install flathub com.spotify.Client

# Rodar programa Flatpak:
flatpak run com.spotify.Client

# Listar programas Flatpak instalados:
flatpak list

# Atualizar todos os Flatpaks:
flatpak update

# Remover:
flatpak uninstall com.spotify.Client

# Vantagem: Programas Flatpak rodam em sandbox (isolados do sistema)
# Desvantagem: Ocupam mais espaço e podem ser um pouco mais lentos`}),o.jsx(a,{type:"info",title:"Quando usar Flatpak?",children:o.jsxs("p",{children:["Prefira sempre o pacman/AUR. Use Flatpak apenas quando o programa não existe no AUR, ou quando quer rodar o programa em sandbox isolado (mais seguro). O site",o.jsx("a",{href:"https://flathub.org",target:"_blank",rel:"noopener noreferrer",children:" flathub.org"})," tem o catálogo completo dos programas disponíveis."]})}),o.jsx("h2",{children:"7. Configurando o /etc/pacman.conf"}),o.jsx("p",{children:"Você pode melhorar a experiência do pacman editando seu arquivo de configuração."}),o.jsx(e,{code:"sudo nano /etc/pacman.conf"}),o.jsx("p",{children:"Algumas opções úteis para descomentar (remover o # do início da linha):"}),o.jsxs("ul",{children:[o.jsxs("li",{children:[o.jsx("code",{children:"Color"}),": Habilita cores na saída do terminal (muito mais legível)."]}),o.jsxs("li",{children:[o.jsx("code",{children:"VerbosePkgLists"}),": Mostra as atualizações em formato de tabela elegante em vez de texto corrido."]}),o.jsxs("li",{children:[o.jsx("code",{children:"ParallelDownloads = 5"}),": Permite baixar 5 pacotes simultaneamente, agilizando MUITO os downloads."]}),o.jsxs("li",{children:["Adicionar a linha ",o.jsx("code",{children:"ILoveCandy"})," abaixo de ",o.jsx("code",{children:"ParallelDownloads"})," transforma a barra de progresso em um Pac-Man comendo pílulas! 👻ᗧ•••"]})]})]})}export{p as default};
