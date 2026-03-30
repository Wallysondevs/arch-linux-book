import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Pacman() {
  return (
    <PageContainer 
      title="Pacman: O Gerenciador de Pacotes" 
      subtitle="O coração do Arch Linux. O pacman é responsável por instalar, atualizar e remover softwares de forma rápida e eficiente."
      difficulty="iniciante"
      timeToRead="15 min"
    >
      <p>
        O <code>pacman</code> combina um formato simples de pacotes binários com um sistema de construção de pacotes fácil de usar.
        Ele cuida da resolução de dependências, permitindo atualizar o sistema inteiro com um único comando.
      </p>

      <h2>A Regra de Ouro do Arch Linux</h2>
      <AlertBox type="danger" title="Nunca atualize pacotes parciais (Partial Upgrades)">
        No Arch, o sistema sempre assume que você tem <strong>tudo</strong> atualizado. Se você rodar <code>pacman -Sy pacote</code> 
        (que atualiza o banco de dados e instala um pacote) sem atualizar o resto do sistema, você pode quebrar bibliotecas essenciais 
        (como a glibc) e destruir seu sistema.
        <br/><br/>
        <strong>Ação correta:</strong> Sempre instale pacotes e atualize o sistema junto usando <code>pacman -Syu pacote</code>.
      </AlertBox>

      <h2>1. Instalação e Atualização (-S: Sync)</h2>
      <p>As operações de sincronização lidam com a base de dados remota (repositórios oficiais).</p>

      <CodeBlock 
        title="Atualizar todo o sistema (O comando que você mais vai usar)"
        code="sudo pacman -Syu" 
      />
      <p className="text-sm mt-2 mb-6">
        <code>-S</code> sincroniza, <code>-y</code> atualiza o banco de dados local com o servidor, <code>-u</code> atualiza os pacotes desatualizados.
      </p>

      <CodeBlock 
        title="Instalar um ou mais pacotes"
        code="sudo pacman -S firefox vlc discord" 
      />

      <CodeBlock 
        title="Forçar a atualização do banco de dados (útil se trocou os mirrors)"
        code="sudo pacman -Syyu" 
      />

      <CodeBlock 
        title="Buscar pacotes nos repositórios oficiais"
        code="pacman -Ss <palavra-chave>" 
      />

      <CodeBlock 
        title="Ver informações detalhadas de um pacote ANTES de instalar"
        code="pacman -Si <nome-do-pacote>" 
      />

      <h2>2. Remoção de Pacotes (-R: Remove)</h2>
      
      <CodeBlock 
        title="Remover pacote simples (deixa dependências que vieram com ele)"
        code="sudo pacman -R <pacote>" 
      />
      
      <AlertBox type="warning" title="A forma correta de remover">
        Sempre use <code>-Rs</code> em vez de apenas <code>-R</code>. Isso remove o pacote e todas as dependências que 
        foram instaladas por ele e que não são mais necessárias por nenhum outro programa.
      </AlertBox>

      <CodeBlock 
        title="Remover pacote e suas dependências órfãs (MUITO RECOMENDADO)"
        code="sudo pacman -Rs <pacote>" 
      />

      <CodeBlock 
        title="Remover pacote, dependências e arquivos de configuração globais"
        code="sudo pacman -Rns <pacote>" 
      />

      <h2>3. Consultas Locais (-Q: Query)</h2>
      <p>Estas flags consultam a base de dados de pacotes que <strong>já estão instalados</strong> no seu computador.</p>

      <CodeBlock 
        title="Listar TODOS os pacotes instalados no sistema"
        code="pacman -Q" 
      />

      <CodeBlock 
        title="Buscar entre os pacotes instalados"
        code="pacman -Qs <palavra-chave>" 
      />

      <CodeBlock 
        title="Saber a qual pacote um arquivo específico pertence"
        code="pacman -Qo /usr/bin/python" 
      />

      <CodeBlock 
        title="Listar todos os arquivos instalados por um pacote"
        code="pacman -Ql <pacote>" 
      />

      <h3>Limpando Dependências Órfãs</h3>
      <p>
        Com o tempo, pacotes deixam restos chamados de órfãos (arquivos instalados como dependência 
        que não têm mais o pacote "pai"). Para limpar seu sistema:
      </p>
      <CodeBlock 
        title="Listar pacotes órfãos"
        code="pacman -Qdt" 
      />
      <CodeBlock 
        title="Remover todos os órfãos de uma vez"
        code="sudo pacman -Rns $(pacman -Qdtq)" 
      />

      <h2>4. Limpeza de Cache (-Sc)</h2>
      <p>
        O pacman guarda o arquivo `.pkg.tar.zst` de TUDO que ele baixa na pasta <code>/var/cache/pacman/pkg/</code>. 
        Se você não limpar, isso vai engolir dezenas de gigabytes do seu disco.
      </p>

      <CodeBlock 
        title="Limpar versões antigas, mantendo apenas a atual (SEGURO)"
        code="sudo pacman -Sc" 
      />

      <CodeBlock 
        title="Limpar o cache INTEIRO (não recomendado se você tem internet ruim e precisa fazer downgrade)"
        code="sudo pacman -Scc" 
      />

      <h2>5. Como Buscar e Instalar Programas (Guia Prático)</h2>
      <p>
        No Windows, para instalar um programa você vai no site, baixa o <code>.exe</code> e roda o instalador.
        No Ubuntu/Fedora, você baixa um <code>.deb</code> ou <code>.rpm</code>. No Arch Linux, a lógica é
        completamente diferente — <strong>tudo é instalado por comandos no terminal</strong>, diretamente dos
        repositórios. Não precisa abrir site, baixar arquivo, nem clicar em "Next, Next, Finish".
      </p>

      <h3>De onde vêm os pacotes?</h3>
      <p>
        O Arch Linux tem dois "lugares" de onde você pode instalar programas:
      </p>
      <ul>
        <li><strong>Repositórios Oficiais</strong> — Mantidos pela equipe do Arch Linux. São os pacotes mais seguros e confiáveis. Instalados com <code>pacman -S</code>.</li>
        <li><strong>AUR (Arch User Repository)</strong> — Mantidos pela comunidade. Qualquer pessoa pode enviar. Contém programas que não estão nos repositórios oficiais (como Google Chrome, VS Code, Spotify). Instalados com <code>yay -S</code> ou <code>paru -S</code>.</li>
      </ul>

      <AlertBox type="info" title="Por que o Chrome e o VS Code não estão no repositório oficial?">
        <p>Porque são softwares proprietários (código fechado). Os repositórios oficiais do Arch priorizam
        software livre e open-source. Mas a comunidade empacota esses programas no AUR, então você
        consegue instalar facilmente. Alternativas open-source como Chromium e Code OSS (VS Code sem
        telemetria da Microsoft) estão nos repositórios oficiais.</p>
      </AlertBox>

      <h3>Passo 1: Buscar se o programa existe</h3>
      <CodeBlock
        title="Como procurar um programa"
        code={`# === BUSCAR NOS REPOSITÓRIOS OFICIAIS ===
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
# Mais votos = pacote mais confiável e popular`}
      />

      <h3>Passo 2: Instalar o programa</h3>
      <CodeBlock
        title="Instalando programas populares"
        code={`# === PROGRAMAS NOS REPOSITÓRIOS OFICIAIS (pacman -S) ===
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
yay -S dropbox                  # Dropbox`}
      />

      <AlertBox type="warning" title="Diferença entre pacman e yay">
        <p>Use <code>sudo pacman -S</code> para repositórios oficiais. Use <code>yay -S</code>
        (sem sudo!) para pacotes do AUR. O yay também instala pacotes oficiais, então na dúvida
        pode usar <code>yay -S</code> para tudo — ele procura nos dois lugares automaticamente.
        Mas pacotes AUR devem ser usados com mais cuidado (veja a página AUR & Helpers).</p>
      </AlertBox>

      <h3>Entendendo os nomes dos pacotes no AUR</h3>
      <CodeBlock
        title="Sufixos dos pacotes no AUR"
        code={`# Muitos programas no AUR têm variações:

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
# É mais rápida de instalar e funciona igual.`}
      />

      <h3>Exemplo completo: Instalar OBS Studio</h3>
      <CodeBlock
        title="Instalando OBS Studio passo a passo"
        code={`# 1. Buscar o pacote:
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
# Ou abra pelo menu de aplicativos do seu desktop`}
      />

      <h3>Exemplo completo: Instalar Google Chrome</h3>
      <CodeBlock
        title="Instalando Google Chrome passo a passo"
        code={`# 1. Buscar no repositório oficial:
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
# (sem login do Google, sem sync automático)`}
      />

      <h3>Exemplo completo: Instalar VS Code</h3>
      <CodeBlock
        title="Instalando VS Code passo a passo"
        code={`# OPÇÃO 1: VS Code Open Source (repositório oficial)
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
code           # Se instalou pelo AUR (mesmo comando)`}
      />

      <h3>Verificar se um programa já está instalado</h3>
      <CodeBlock
        title="Consultar pacotes instalados"
        code={`# Verificar se o Firefox está instalado:
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
# /usr/bin/obs is owned by obs-studio 30.0.2-2`}
      />

      <h3>"Mas no Ubuntu/Fedora o site oferece .deb/.rpm..."</h3>
      <p>
        Muitos programas (como VS Code, Chrome, Discord) oferecem download de <code>.deb</code>
        (Debian/Ubuntu) e <code>.rpm</code> (Fedora/Red Hat) no site oficial. Esses formatos
        <strong> NÃO funcionam no Arch Linux</strong>.
      </p>
      <AlertBox type="danger" title="NÃO baixe .deb nem .rpm para o Arch!">
        <p>O Arch usa o formato <code>.pkg.tar.zst</code>. Não tente instalar arquivos .deb ou .rpm
        — eles são de outras distribuições. Em vez disso, busque o programa no pacman
        (<code>pacman -Ss</code>) ou no AUR (<code>yay -Ss</code>). A comunidade do Arch já empacotou
        praticamente tudo que existe para funcionar corretamente no Arch.</p>
      </AlertBox>

      <h3>Alternativas a programas populares</h3>
      <p>
        Alguns programas do Windows não existem no Linux, mas têm alternativas excelentes:
      </p>
      <CodeBlock
        title="Equivalências Windows → Linux"
        language="text"
        code={`Windows               Linux (Arch)              Instalar com
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
Explorer           →  Nautilus/Dolphin/Thunar →  (vem com o DE)`}
      />

      <h2>6. Flatpak e Snap (Alternativas ao pacman)</h2>
      <p>
        Além do pacman e AUR, existem outros formatos de instalação de programas no Linux.
        Eles são universais — funcionam em qualquer distribuição (Arch, Ubuntu, Fedora, etc.).
      </p>
      <CodeBlock
        title="Flatpak"
        code={`# Instalar o Flatpak
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
# Desvantagem: Ocupam mais espaço e podem ser um pouco mais lentos`}
      />

      <AlertBox type="info" title="Quando usar Flatpak?">
        <p>Prefira sempre o pacman/AUR. Use Flatpak apenas quando o programa não existe
        no AUR, ou quando quer rodar o programa em sandbox isolado (mais seguro). O site
        <a href="https://flathub.org" target="_blank" rel="noopener noreferrer"> flathub.org</a> tem
        o catálogo completo dos programas disponíveis.</p>
      </AlertBox>

      <h2>7. Configurando o /etc/pacman.conf</h2>
      <p>Você pode melhorar a experiência do pacman editando seu arquivo de configuração.</p>
      <CodeBlock code="sudo nano /etc/pacman.conf" />
      <p>Algumas opções úteis para descomentar (remover o # do início da linha):</p>
      <ul>
        <li><code>Color</code>: Habilita cores na saída do terminal (muito mais legível).</li>
        <li><code>VerbosePkgLists</code>: Mostra as atualizações em formato de tabela elegante em vez de texto corrido.</li>
        <li><code>ParallelDownloads = 5</code>: Permite baixar 5 pacotes simultaneamente, agilizando MUITO os downloads.</li>
        <li>Adicionar a linha <code>ILoveCandy</code> abaixo de <code>ParallelDownloads</code> transforma a barra de progresso em um Pac-Man comendo pílulas! 👻ᗧ•••</li>
      </ul>

    </PageContainer>
  );
}
