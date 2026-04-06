import{j as e}from"./ui-K-J8Jkwj.js";import{P as s}from"./PageContainer-tnnsMrcC.js";import{C as o}from"./CodeBlock-DEDRw1y6.js";import{A as a}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function u(){return e.jsxs(s,{title:"Guia de Instalação Completo",subtitle:"Da criação do pen drive bootável até o primeiro login. Dois métodos: archinstall (assistido) e instalação manual (o verdadeiro aprendizado).",difficulty:"intermediario",timeToRead:"45 min",children:[e.jsx("h2",{children:"Antes de Começar"}),e.jsx("p",{children:"A instalação do Arch Linux é diferente de qualquer outra distribuição. Não existe um instalador gráfico com botões bonitos — tudo é feito pelo terminal. Isso pode parecer assustador, mas é justamente por isso que você aprende de verdade como um sistema Linux funciona por dentro."}),e.jsx("p",{children:"Existem dois caminhos:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"archinstall"}),": Um script assistido com menus de seleção. Você navega com as setas e seleciona as opções. Mais rápido e seguro para iniciantes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Instalação manual"}),": Você digita cada comando, particiona o disco, formata, instala e configura tudo manualmente. Mais trabalhoso, mas ensina muito mais."]})]}),e.jsxs("p",{children:["Este guia cobre ",e.jsx("strong",{children:"ambos os métodos"}),". Se é sua primeira vez, comece com o archinstall. Depois, faça a instalação manual para entender o que o archinstall fez por baixo dos panos."]}),e.jsx("h2",{children:"Pré-Requisitos"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Um pen drive de pelo menos 2GB (será formatado)"}),e.jsx("li",{children:"Conexão com internet (cabo ethernet é mais fácil, Wi-Fi também funciona)"}),e.jsx("li",{children:"Um computador com boot UEFI (quase todos os PCs fabricados depois de 2012)"}),e.jsx("li",{children:"Pelo menos 20GB de espaço livre em disco (recomendado 50GB+)"}),e.jsx("li",{children:"Backup de tudo que é importante no disco — a instalação pode apagar dados"})]}),e.jsx("h2",{children:"1. Baixar a ISO e Criar o Pen Drive Bootável"}),e.jsx("h3",{children:"Baixar a ISO"}),e.jsxs("p",{children:["Acesse ",e.jsx("code",{children:"https://archlinux.org/download/"})," e baixe a ISO mais recente. O Arch Linux lança uma nova ISO todo mês, sempre atualizada. O arquivo tem cerca de 800MB."]}),e.jsx("h3",{children:"Gravar no pen drive"}),e.jsx("h4",{children:"No Linux (usando dd)"}),e.jsx(o,{title:"Gravar ISO no pen drive (Linux)",code:`# Primeiro, descubra qual é o pen drive
lsblk

# Saída esperada:
# NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
# sda      8:0    0 476.9G  0 disk            ← seu HD/SSD principal
# ├─sda1   8:1    0   512M  0 part /boot/efi
# ├─sda2   8:2    0     4G  0 part [SWAP]
# └─sda3   8:3    0 472.4G  0 part /
# sdb      8:16   1  14.5G  0 disk            ← seu pen drive (note o tamanho)
# └─sdb1   8:17   1  14.5G  0 part

# CUIDADO: Certifique-se de que é o dispositivo certo!
# Se errar, pode apagar seu HD principal.

# Desmontar o pen drive se estiver montado
sudo umount /dev/sdb1

# Gravar a ISO (substitua pelo caminho correto do arquivo)
sudo dd bs=4M if=archlinux-2026.03.01-x86_64.iso of=/dev/sdb status=progress oflag=sync

# bs=4M         = Escrever em blocos de 4MB (mais rápido)
# if=...        = Input file (arquivo ISO)
# of=/dev/sdb   = Output file (pen drive inteiro, sem número de partição!)
# status=progress = Mostrar progresso
# oflag=sync    = Garantir que os dados sejam gravados de verdade`}),e.jsx(a,{type:"danger",title:"Cuidado com o dd!",children:e.jsxs("p",{children:["O comando ",e.jsx("code",{children:"dd"}),' é apelidado de "disk destroyer" por um bom motivo. Ele faz exatamente o que você manda, sem perguntar. Se você colocar ',e.jsx("code",{children:"of=/dev/sda"}),"ao invés de ",e.jsx("code",{children:"of=/dev/sdb"}),", ele vai apagar seu disco principal sem pedir confirmação.",e.jsx("strong",{children:"Confira o dispositivo três vezes antes de executar."})]})}),e.jsx("h4",{children:"No Windows"}),e.jsxs("p",{children:["Use o ",e.jsx("strong",{children:"Rufus"})," (rufus.ie) ou o ",e.jsx("strong",{children:"balenaEtcher"}),' (etcher.balena.io). No Rufus, selecione a ISO, selecione o pen drive, escolha "GPT" como esquema de partição e clique em Iniciar. Se perguntar sobre o modo, escolha "Gravar em modo de imagem DD".']}),e.jsx("h4",{children:"No macOS"}),e.jsx(o,{title:"Gravar ISO no pen drive (macOS)",code:`# Listar discos
diskutil list

# Desmontar o pen drive (ex: disk2)
diskutil unmountDisk /dev/disk2

# Gravar (use rdisk para ser mais rápido)
sudo dd bs=4M if=archlinux-2026.03.01-x86_64.iso of=/dev/rdisk2 status=progress`}),e.jsx("h2",{children:"2. Dar Boot pelo Pen Drive"}),e.jsx("p",{children:"Com o pen drive gravado, reinicie o computador e entre no menu de boot. A tecla varia por fabricante:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"ASUS"}),": F8 ou ESC"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Acer"}),": F12"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Dell"}),": F12"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"HP"}),": F9 ou ESC"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Lenovo"}),": F12 ou Fn+F12"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"MSI"}),": F11"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Samsung"}),": F2 ou ESC"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Gigabyte"}),": F12"]})]}),e.jsx("p",{children:'Selecione o pen drive na lista (geralmente aparece como "USB" ou "UEFI: nome_do_pendrive"). Se não aparecer, pode ser que o Secure Boot esteja habilitado — entre na BIOS/UEFI (geralmente F2 ou DEL) e desabilite o Secure Boot.'}),e.jsx(a,{type:"info",title:"BIOS vs UEFI",children:e.jsx("p",{children:"PCs antigos (antes de ~2012) usam BIOS legada. PCs modernos usam UEFI. Este guia assume UEFI, que é o padrão hoje. Se seu PC é antigo com BIOS, o processo de particionamento e bootloader será diferente (sem partição EFI, usando MBR ao invés de GPT)."})}),e.jsx("h3",{children:"Primeira tela"}),e.jsx("p",{children:"Após dar boot pelo pen drive, você verá o menu do bootloader do Arch:"}),e.jsx(o,{title:"Menu de boot da ISO",code:`Arch Linux install medium (x86_64, UEFI)

  Arch Linux install medium (x86_64, UEFI)     ← Selecione este
  Arch Linux install medium (x86_64, UEFI) with speech
  Memtest86+
  EFI Shell

# Use as setas para navegar e Enter para selecionar.
# Após o boot, você cairá num prompt:
# root@archiso ~ #
# É aqui que a instalação começa.`}),e.jsx("h3",{children:"Configurar teclado brasileiro"}),e.jsx("p",{children:"Por padrão, o teclado está em layout americano (US). Se você tem um teclado ABNT2 (padrão brasileiro, com Ç), mude:"}),e.jsx(o,{title:"Mudar layout do teclado",code:`# Carregar layout ABNT2 (teclado brasileiro)
loadkeys br-abnt2

# Agora o Ç, acentos e caracteres especiais funcionam corretamente.
# Para ver todos os layouts disponíveis:
localectl list-keymaps | less`}),e.jsx("h3",{children:"Verificar se deu boot em modo UEFI"}),e.jsx(o,{title:"Confirmar modo UEFI",code:`# Se este diretório existir, você está em modo UEFI
ls /sys/firmware/efi/efivars

# Se mostrar vários arquivos, OK — é UEFI.
# Se der erro "No such file or directory", você está em modo BIOS legada.`}),e.jsx("h3",{children:"Conectar à Internet"}),e.jsx("p",{children:"Sem internet, não dá para instalar nada. Se está com cabo ethernet, provavelmente já está conectado. Teste com:"}),e.jsx(o,{title:"Testar internet",code:`ping -c 3 archlinux.org

# Se funcionar, pule para a próxima seção.
# Se não, veja abaixo como conectar via Wi-Fi.`}),e.jsxs("p",{children:["Para Wi-Fi, use o ",e.jsx("code",{children:"iwctl"})," (veja a página de Primeiros Passos para uma explicação completa de todos os subcomandos):"]}),e.jsx(o,{title:"Conectar Wi-Fi com iwctl",code:`# Entrar no modo interativo
iwctl

# Listar dispositivos wireless (anotar o nome, geralmente wlan0)
[iwd]# device list
#                             Devices
# ---------------------------------------------------------------
#   Name       Address            Powered   Adapter   Mode
# ---------------------------------------------------------------
#   wlan0      xx:xx:xx:xx:xx:xx  on        phy0      station

# Escanear redes
[iwd]# station wlan0 scan

# Listar redes encontradas
[iwd]# station wlan0 get-networks
#                     Available Networks
# ---------------------------------------------------------------
#       Network Name            Security    Signal
# ---------------------------------------------------------------
#       MinhaRede               psk         ****
#       Vizinho_5G              psk         **

# Conectar (vai pedir a senha)
[iwd]# station wlan0 connect "MinhaRede"
# Passphrase: ********

# Verificar se conectou
[iwd]# station wlan0 show
# State: connected   ← Conectado!

# Sair do iwctl
[iwd]# exit

# Testar internet
ping -c 3 archlinux.org`}),e.jsx("h3",{children:"Atualizar relógio do sistema"}),e.jsx(o,{title:"Sincronizar relógio via NTP",code:`# Habilitar sincronização de hora pela internet
timedatectl set-ntp true

# Verificar
timedatectl
# System clock synchronized: yes`}),e.jsx("hr",{}),e.jsx("h2",{children:"Método 1: archinstall (Instalação Assistida)"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"archinstall"})," é um script Python que vem incluído na ISO desde 2021. Ele automatiza todo o processo de instalação usando menus interativos onde você navega com as ",e.jsx("strong",{children:"setas do teclado"}),", marca opções com ",e.jsx("strong",{children:"Enter"}),"ou ",e.jsx("strong",{children:"Espaço"}),", e ele faz todo o trabalho pesado (particionar, formatar, instalar, configurar) sozinho."]}),e.jsx(o,{title:"Iniciar o archinstall",code:"archinstall"}),e.jsxs("p",{children:["Ao executar, aparece uma tela com várias opções de configuração. Cada item é uma categoria que você precisa configurar. Você navega entre elas com as setas",e.jsx("strong",{children:" ↑ ↓"})," e pressiona ",e.jsx("strong",{children:"Enter"})," para abrir as opções de cada item."]}),e.jsx(o,{title:"Tela principal do archinstall",code:`Archinstall v2.8.1

 Archinstall language           : English
 Mirrors                        : (Defined)
 Locales                        : us, UTF-8
 Disk configuration             : Not configured
 Disk encryption                : Not configured
 Bootloader                     : Systemd-boot
 Swap                           : True
 Hostname                       : archlinux
 Root password                  : Not set
 User account                   : Not configured
 Profile                        : Not configured
 Audio                          : Not configured
 Kernels                        : linux
 Additional packages            :
 Network configuration          : Not configured
 Timezone                       : UTC
 Automatic time sync (NTP)      : True
 Optional repositories          :

 Save configuration
 Install

# Use ↑ ↓ para navegar entre os itens
# Pressione Enter para abrir as opções de cada item
# Após configurar tudo, selecione "Install" no final`}),e.jsxs(a,{type:"info",title:"Como navegar no archinstall",children:[e.jsx("p",{children:"O archinstall usa um sistema de menus simples:"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Setas ↑ ↓"})," = Navegar entre opções"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Enter"})," = Selecionar / Confirmar uma opção"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Espaço"})," = Marcar/Desmarcar em listas de múltipla escolha"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Tab"})," = Alternar entre campos (em alguns menus)"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"ESC"})," = Voltar ao menu anterior"]}),e.jsx("p",{children:"Não precisa digitar nenhum comando — é tudo navegação com as setas e seleção!"})]}),e.jsx("h3",{children:"Archinstall Language"}),e.jsx("p",{children:"Idioma da interface do instalador. Selecione e escolha o idioma. Pode deixar em English se preferir — isso não afeta o idioma do sistema instalado."}),e.jsx("h3",{children:"Mirrors (Espelhos)"}),e.jsx("p",{children:"Define de quais servidores os pacotes serão baixados. Ao selecionar, aparece uma lista de regiões/países:"}),e.jsx(o,{title:"Seleção de Mirrors",code:`Mirror region

  Argentina
  Australia
  Austria
> Brazil                  ← Selecione este com Enter
  Canada
  Chile
  China
  ...

# Use ↑ ↓ para navegar
# Pressione Enter em "Brazil" para selecionar mirrors brasileiros
# Isso garante downloads mais rápidos`}),e.jsx("h3",{children:"Locales (Localização)"}),e.jsx("p",{children:"Aqui você configura o layout do teclado, o idioma do sistema e a codificação de caracteres. São três opções que aparecem:"}),e.jsx(o,{title:"Configuração de Locales",code:`Locales

  Keyboard layout    : us
  Locale language    : en_US
  Locale encoding    : UTF-8

# Selecione "Keyboard layout" e mude para:
# br                    ← Para teclado ABNT2 (brasileiro com Ç)

# Selecione "Locale language" e mude para:
# pt_BR                 ← Português do Brasil

# "Locale encoding" pode deixar em UTF-8 (é o padrão correto)

# Ao selecionar "Keyboard layout", aparece uma lista:
#   be
#   bg
> br                    ← Selecione este
#   br-abnt
#   ca
#   ...`}),e.jsx("h3",{children:"Disk configuration (Configuração de Disco)"}),e.jsx("p",{children:"Esta é a parte mais importante. Aqui você define como o disco será particionado e qual sistema de arquivos usar. Ao selecionar, aparecem as opções:"}),e.jsx(o,{title:"Método de particionamento",code:`Disk configuration

> Use a best-effort default partition layout    ← Mais fácil (recomendado)
  Manual partitioning                           ← Para quem quer controle total
  Pre-mounted configuration                     ← Se já montou as partições manualmente

# Selecione "Use a best-effort default partition layout" para iniciantes.
# Ele vai criar as partições automaticamente.`}),e.jsx("p",{children:"Depois de selecionar o layout automático, ele pergunta qual disco usar:"}),e.jsx(o,{title:"Seleção do disco",code:`Select one or more hard drives

> /dev/sda    476.94 GiB    Samsung SSD 870    ← Seu disco principal
  /dev/sdb     14.53 GiB    SanDisk USB        ← Seu pen drive (NÃO selecione este!)

# Use ↑ ↓ para navegar e Enter para selecionar
# CUIDADO: Selecione o disco correto! O pen drive da instalação NÃO é o certo.
# Olhe o tamanho e o nome do fabricante para identificar.`}),e.jsx(a,{type:"danger",title:"Selecione o disco certo!",children:e.jsx("p",{children:"Se você selecionar o pen drive ao invés do disco principal, o archinstall vai instalar o Arch no pen drive (que não é o que você quer). Identifique pelo tamanho: seu HD/SSD principal tem centenas de GB, o pen drive tem ~8-32GB."})}),e.jsxs("p",{children:["Em seguida, a tela mais importante — escolher o ",e.jsx("strong",{children:"sistema de arquivos (filesystem)"}),":"]}),e.jsx(o,{title:"Seleção do Filesystem",code:`Select a filesystem for /dev/sda

> btrfs                 ← Moderno, suporta snapshots e subvolumes
  ext4                  ← Clássico, estável, mais testado
  f2fs                  ← Otimizado para SSDs e flash
  xfs                   ← Bom para arquivos grandes, usado em servidores

# Use ↑ ↓ para navegar e Enter para selecionar

# RECOMENDAÇÕES:
# ext4  → Para iniciantes. É o mais simples, confiável e documentado.
#          Funciona perfeitamente para 99% dos casos.
#
# btrfs → Para quem quer recursos avançados como snapshots (voltar o
#          sistema a um estado anterior), compressão transparente e
#          subvolumes. Mais complexo, mas muito poderoso.
#
# xfs   → Bom para servidores e partições com arquivos muito grandes.
#          Não permite reduzir o tamanho da partição depois.
#
# f2fs  → Otimizado para memória flash (SSDs, pendrives, cartões SD).
#          Menos comum, menos documentado.`}),e.jsxs(a,{type:"info",title:"ext4 ou btrfs? Qual escolher?",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Se é sua primeira instalação:"})," Escolha ",e.jsx("strong",{children:"ext4"}),". É simples, confiável e não precisa de configuração extra. Você pode trocar para btrfs depois quando se sentir confortável."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Se quer snapshots:"})," Escolha ",e.jsx("strong",{children:"btrfs"}),'. Snapshots permitem "tirar uma foto" do estado do sistema antes de uma atualização grande. Se a atualização quebrar algo, você volta ao estado anterior em segundos. Ferramentas como ',e.jsx("code",{children:"timeshift"})," e ",e.jsx("code",{children:"snapper"})," facilitam isso."]})]}),e.jsxs("p",{children:["Se escolher ",e.jsx("strong",{children:"btrfs"}),", o archinstall pergunta se quer usar subvolumes:"]}),e.jsx(o,{title:"Subvolumes btrfs",code:`Would you like to use btrfs subvolumes with a default structure?

> Yes     ← Recomendado (cria @, @home, @log, @cache, @snapshots)
  No      ← Sem subvolumes (perde a vantagem de snapshots)

# Se selecionar Yes, ele cria automaticamente:
# @          → Montado em /          (sistema)
# @home      → Montado em /home     (seus arquivos pessoais)
# @log       → Montado em /var/log  (logs do sistema)
# @cache     → Montado em /var/cache (cache do pacman)
# @snapshots → Montado em /.snapshots (snapshots do sistema)

# Essa estrutura permite fazer snapshot do sistema (@) sem incluir
# seus arquivos pessoais (@home) e sem incluir cache (@cache).`}),e.jsx("p",{children:"Depois pergunta sobre compressão:"}),e.jsx(o,{title:"Compressão btrfs",code:`Would you like to use compression?

> Yes     ← Recomendado (usa zstd, economiza espaço sem perder performance)
  No

# A compressão zstd é muito rápida e em muitos casos até ACELERA
# o sistema porque menos dados são lidos/escritos no disco.
# Não tem desvantagem prática em SSDs modernos.`}),e.jsx("h3",{children:"Disk encryption (Criptografia)"}),e.jsx("p",{children:"Se quiser criptografar o disco inteiro com LUKS (recomendado para notebooks que você leva para fora de casa):"}),e.jsx(o,{title:"Criptografia de disco",code:`Disk encryption

  Encryption type     : Not configured
  Encryption password : Not set
  Partition           : Not configured

# Se selecionar "Encryption type":
> luks                  ← LUKS é o padrão do Linux
  No encryption         ← Sem criptografia

# Se escolher luks, vai pedir uma senha de criptografia.
# Você vai precisar digitá-la TODA VEZ que ligar o computador,
# antes mesmo de fazer login.

# IMPORTANTE: Se esquecer essa senha, seus dados estão perdidos
# para sempre. Não existe recuperação.`}),e.jsx("h3",{children:"Bootloader"}),e.jsx(o,{title:"Seleção do bootloader",code:`Bootloader

> Systemd-boot         ← Mais simples e moderno (recomendado para UEFI)
  GRUB                 ← Mais popular, suporta BIOS e UEFI
  Limine               ← Alternativa leve

# Systemd-boot: Simples, rápido, já faz parte do systemd. Só funciona
#   com UEFI. Se seu PC é moderno, essa é a melhor opção.
#
# GRUB: Mais versátil, funciona com BIOS e UEFI, suporta dual-boot
#   com Windows mais facilmente. Se vai fazer dual-boot, escolha GRUB.
#
# Limine: Alternativa minimalista. Para usuários avançados.`}),e.jsx("h3",{children:"Hostname"}),e.jsx(o,{title:"Nome da máquina",code:`Hostname: archlinux

# Mude para o nome que quiser. Exemplos:
# meupc
# desktop-joao
# arch-notebook
# vader
# Sem espaços, sem caracteres especiais, letras minúsculas.`}),e.jsx("h3",{children:"Root password (Senha do root)"}),e.jsx(o,{title:"Senha do root",code:`Root password: ********

# Digite uma senha para o usuário root (administrador).
# Os caracteres NÃO aparecem enquanto você digita (é normal).
# Depois vai pedir para confirmar a mesma senha.

# Dica: Pode pular (deixar vazio) se for criar um usuário
# com sudo no próximo passo, mas ter senha de root é mais seguro.`}),e.jsx("h3",{children:"User account (Conta de usuário)"}),e.jsx(o,{title:"Criar usuário",code:`User account

  Add a user            ← Selecione para criar seu usuário
  Confirm and exit

# Ao selecionar "Add a user":
# Enter username: joao                ← Seu nome de usuário
# Password: ********                  ← Sua senha
# Confirm password: ********          ← Repetir senha
# Should this user be a superuser (sudo)? Yes  ← IMPORTANTE: Diga Yes!

# O superuser (sudo) permite que seu usuário execute comandos
# como administrador quando necessário (ex: instalar pacotes).
# Se disser "No", você não vai conseguir usar sudo.`}),e.jsx("h3",{children:"Profile (Perfil / Ambiente Gráfico)"}),e.jsx("p",{children:"Aqui você pode já escolher instalar um ambiente gráfico junto com o sistema:"}),e.jsx(o,{title:"Seleção de perfil",code:`Profile type

> Desktop              ← Instalar com ambiente gráfico completo
  Minimal              ← Só o básico, sem interface gráfica
  Server               ← Configuração para servidor
  Xorg                 ← Só o servidor X11 (sem DE)

# Se escolher "Desktop", aparece a lista de ambientes:

Desktop environment

  Awesome              ← Window manager minimalista
  BSPWM                ← Tiling window manager
  Budgie               ← Simples e elegante
  Cinnamon             ← Parecido com Windows (Linux Mint usa)
  COSMIC               ← Novo DE da System76
  CuteFish             ← Visual parecido com macOS
  Deepin               ← Visual bonito, de origem chinesa
> GNOME                ← Popular, moderno, toque amigável
  Hyprland             ← Wayland compositor com animações
  i3                   ← Tiling WM popular (controle por teclado)
  KDE Plasma           ← Muito customizável, parecido com Windows
  LXQT                 ← Super leve (bom para PCs fracos)
  MATE                 ← Fork do GNOME 2, clássico
  Qtile                ← Tiling WM em Python
  Sway                 ← i3 para Wayland
  XFCE                 ← Leve e funcional (equilíbrio perfeito)

# Use ↑ ↓ para navegar e Enter para selecionar
#
# RECOMENDAÇÕES PARA INICIANTES:
# KDE Plasma → Mais parecido com Windows, muito customizável
# GNOME      → Mais parecido com macOS, simples e limpo
# XFCE       → Para PCs mais fracos, leve e funcional`}),e.jsx("p",{children:"Depois de selecionar o DE, ele pergunta sobre o driver de vídeo:"}),e.jsx(o,{title:"Seleção do driver de vídeo",code:`Graphics driver

  All open-source (default)     ← Para Intel e AMD (recomendado)
> AMD / ATI (open-source)       ← Especificamente para AMD
  Intel (open-source)           ← Especificamente para Intel
  Nvidia (open-source nouveau)  ← Driver open-source da Nvidia (mais limitado)
  Nvidia (proprietary)          ← Driver oficial da Nvidia (melhor performance)
  VMware / VirtualBox           ← Se está em máquina virtual

# Se tem placa de vídeo NVIDIA:
#   Escolha "Nvidia (proprietary)" para melhor performance
#
# Se tem AMD ou Intel integrada:
#   Escolha "All open-source" ou o específico
#
# Se não sabe qual placa tem, rode: lspci | grep -i vga`}),e.jsx("h3",{children:"Audio"}),e.jsx(o,{title:"Servidor de áudio",code:`Audio server

  No audio server
> PipeWire              ← Moderno, recomendado
  PulseAudio            ← Antigo, mas funcional

# PipeWire é a escolha moderna. Substitui PulseAudio e JACK.
# Selecione PipeWire a menos que tenha um motivo específico.`}),e.jsx("h3",{children:"Kernels"}),e.jsx(o,{title:"Seleção de kernel",code:`Kernels

> linux                 ← Kernel padrão (recomendado)
  linux-lts             ← Kernel de suporte longo (mais estável)
  linux-hardened        ← Kernel com patches de segurança extras
  linux-zen             ← Kernel otimizado para desktop/gaming

# Você pode selecionar mais de um! Use Espaço para marcar/desmarcar.
# Recomendação: Selecione "linux" E "linux-lts"
# Assim, se o kernel padrão der problema após uma atualização,
# você pode dar boot pelo kernel LTS como backup.`}),e.jsx("h3",{children:"Additional packages (Pacotes adicionais)"}),e.jsx(o,{title:"Pacotes extras para instalar junto",code:`Additional packages (space separated):

# Aqui você digita nomes de pacotes separados por espaço.
# Exemplos úteis:
git vim nano htop wget curl firefox base-devel

# Esses pacotes serão instalados junto com o sistema.
# Você pode instalar mais depois com pacman, mas já deixar
# o git e base-devel economiza tempo depois.`}),e.jsx("h3",{children:"Network configuration"}),e.jsx(o,{title:"Configuração de rede",code:`Network configuration

  Not configured
  Copy ISO network configuration
> Use NetworkManager            ← Selecione este!
  Manual configuration

# "Use NetworkManager" é a melhor opção para desktop.
# Ele gerencia Wi-Fi, ethernet e VPN automaticamente.
# Se selecionar "Not configured", não vai ter internet após reiniciar!`}),e.jsx("h3",{children:"Timezone (Fuso horário)"}),e.jsx(o,{title:"Seleção de timezone",code:`Timezone

  ...
  America/Recife
  America/Rio_Branco
> America/Sao_Paulo            ← Para a maioria do Brasil
  America/Santarem
  ...

# Navegue com ↑ ↓ até encontrar America/Sao_Paulo
# Dica: Digite as primeiras letras para pular na lista`}),e.jsx("h3",{children:"Optional repositories"}),e.jsx(o,{title:"Repositórios opcionais",code:`Optional repositories

> multilib              ← Pacotes 32-bit (necessário para Steam, Wine)
  testing               ← Pacotes em teste (NÃO habilite para uso normal)

# Marque "multilib" com Espaço se pretende jogar ou usar Wine.
# NÃO habilite "testing" a menos que saiba o que está fazendo.`}),e.jsx("h3",{children:"Instalando!"}),e.jsxs("p",{children:["Depois de configurar tudo, navegue até ",e.jsx("strong",{children:'"Install"'})," no final da lista e pressione Enter:"]}),e.jsx(o,{title:"Confirmar instalação",code:`# O archinstall vai mostrar um resumo de tudo que vai fazer e perguntar:
# Would you like to continue? [Y/n] Y

# Depois disso, ele faz tudo automaticamente:
# - Particiona o disco
# - Formata as partições
# - Instala os pacotes base
# - Configura o bootloader
# - Configura usuário, rede, locale, timezone...
# - Instala o ambiente gráfico (se selecionou)

# Progresso:
# [1/45] Installing base...
# [2/45] Installing linux...
# ...
# Installation complete!

# No final, ele pergunta se quer fazer chroot no novo sistema:
# Would you like to chroot into the newly installed system? [Y/n]
# Se não precisa configurar nada extra, digite "n" e reinicie.

# Retire o pen drive e reinicie:
reboot`}),e.jsx(a,{type:"success",title:"Pronto!",children:e.jsx("p",{children:"Se usou o archinstall com Desktop, após reiniciar você já deve ver a tela de login gráfica. Faça login com o usuário e senha que configurou. Se usou Minimal, vai cair num terminal — veja a seção de Primeiros Passos para continuar a configuração."})}),e.jsx("hr",{}),e.jsx("h2",{children:"Método 2: Instalação Manual (O Caminho do Aprendizado)"}),e.jsx("p",{children:"Este é o método original do Arch Linux — você faz tudo manualmente, comando por comando. É mais trabalhoso, mas ensina exatamente como um sistema Linux funciona. Se você só usou o archinstall, volte aqui depois e faça a instalação manual pelo menos uma vez."}),e.jsx("p",{children:"A partir daqui, assumimos que você já deu boot pela ISO, configurou o teclado, verificou o modo UEFI e conectou à internet (passos do início deste guia)."}),e.jsx("h3",{children:"Passo 1: Identificar os Discos"}),e.jsx(o,{title:"Listar discos e partições",code:`lsblk

# Saída esperada:
# NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
# sda      8:0    0 476.9G  0 disk
# ├─sda1   8:1    0   512M  0 part
# └─sda2   8:3    0 476.4G  0 part
# sdb      8:16   1  14.5G  0 disk            ← pen drive (ignorar)
# └─sdb1   8:17   1  14.5G  0 part
# sr0     11:0    1  1024M  0 rom

# Identifique o disco onde vai instalar. Neste exemplo, é /dev/sda
# Se tem NVMe (SSD M.2), o disco aparece como /dev/nvme0n1

# Para mais detalhes sobre os discos:
fdisk -l

# Ou se preferir ver o tamanho em formato legível:
lsblk -f    # Mostra também o filesystem de cada partição`}),e.jsx(a,{type:"danger",title:"Atenção Total",children:e.jsxs("p",{children:["Os próximos comandos vão ",e.jsx("strong",{children:"apagar todos os dados"})," do disco selecionado. Certifique-se de que é o disco correto e que você tem backup de tudo que é importante. Se errar o disco, perderá seus dados permanentemente."]})}),e.jsx("h3",{children:"Passo 2: Particionar o Disco"}),e.jsxs("p",{children:["Vamos usar o ",e.jsx("code",{children:"cfdisk"})," que tem uma interface visual mais fácil de usar que o ",e.jsx("code",{children:"fdisk"}),". Para UEFI, precisamos de pelo menos duas partições:"]}),e.jsx(o,{title:"Particionar com cfdisk",code:`# Abrir o particionador visual
cfdisk /dev/sda

# Se perguntar o tipo de tabela de partição, escolha: gpt

# O cfdisk mostra uma interface assim:
#
#                           Disk: /dev/sda
#                    Size: 476.94 GiB, 512110190592 bytes
#              Label: gpt, identifier: XXXXXXXX-XXXX-XXXX...
#
#   Device          Start        End    Sectors   Size  Type
# >> Free space       2048  1000215215  999213168  476.9G
#
#   [ New ]  [ Quit ]  [ Help ]  [ Sort ]  [ Write ]  [ Dump ]
#
# Use ← → para navegar entre os botões na parte inferior
# Use ↑ ↓ para navegar entre as partições
# Pressione Enter para selecionar a ação

# ESQUEMA DE PARTIÇÕES PARA UEFI:
#
# 1. Selecione o espaço livre → [ New ]
#    Size: 512M                     ← Partição EFI (boot)
#    Depois: selecione a partição → [ Type ] → EFI System
#
# 2. Selecione o espaço livre → [ New ]
#    Size: 4G                       ← Swap (opcional mas recomendado)
#    Depois: selecione a partição → [ Type ] → Linux swap
#
# 3. Selecione o espaço livre → [ New ]
#    Size: (Enter para usar todo o resto)  ← Partição raiz (/)
#    Tipo: Linux filesystem (já é o padrão)
#
# 4. Depois de criar todas: [ Write ]
#    Are you sure? yes
#    [ Quit ]

# Resultado final no cfdisk:
#   Device          Start        End    Sectors   Size  Type
#   /dev/sda1        2048    1050623    1048576   512M  EFI System
#   /dev/sda2     1050624    9439231    8388608     4G  Linux swap
#   /dev/sda3     9439232  1000215215  990775984  472.4G  Linux filesystem`}),e.jsxs("p",{children:["Se preferir usar ",e.jsx("code",{children:"fdisk"})," (mais avançado, sem interface visual):"]}),e.jsx(o,{title:"Particionar com fdisk (alternativa)",code:`fdisk /dev/sda

# Dentro do fdisk:
# g         → Criar nova tabela de partição GPT (apaga tudo!)
# n         → Nova partição
# Número: 1, Primeiro setor: Enter (padrão), Último setor: +512M
# t         → Mudar tipo → 1 (EFI System)
# n         → Nova partição
# Número: 2, Primeiro setor: Enter, Último setor: +4G
# t         → Selecionar partição 2 → 19 (Linux swap)
# n         → Nova partição
# Número: 3, Primeiro setor: Enter, Último setor: Enter (todo o resto)
# w         → Gravar alterações e sair`}),e.jsx("h3",{children:"Passo 3: Formatar as Partições"}),e.jsx(o,{title:"Formatar cada partição",code:`# Formatar a partição EFI em FAT32 (obrigatório para UEFI)
mkfs.fat -F32 /dev/sda1
# mkfs.fat 4.2 (2021-01-31)

# Preparar a partição de swap
mkswap /dev/sda2
# Setting up swapspace version 1, size = 4 GiB

# Formatar a partição raiz
# OPÇÃO A: ext4 (simples e confiável)
mkfs.ext4 /dev/sda3
# Creating filesystem with 123846748 4k blocks...
# Writing superblocks and filesystem accounting information: done

# OPÇÃO B: btrfs (para snapshots e compressão)
mkfs.btrfs /dev/sda3
# Label: (none)
# UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Se escolheu btrfs e quer subvolumes (recomendado):
mount /dev/sda3 /mnt
btrfs subvolume create /mnt/@
btrfs subvolume create /mnt/@home
btrfs subvolume create /mnt/@log
btrfs subvolume create /mnt/@cache
btrfs subvolume create /mnt/@snapshots
umount /mnt`}),e.jsx("h3",{children:"Passo 4: Montar as Partições"}),e.jsx(o,{title:"Montar as partições na ordem correta",code:`# ===== SE USOU EXT4 =====

# Montar a raiz PRIMEIRO (sempre!)
mount /dev/sda3 /mnt

# Ativar a swap
swapon /dev/sda2

# Criar pasta para o boot EFI e montar
mount --mkdir /dev/sda1 /mnt/boot/efi

# ===== SE USOU BTRFS COM SUBVOLUMES =====

# Montar o subvolume raiz (@) com opções de performance
mount -o subvol=@,compress=zstd,noatime /dev/sda3 /mnt

# Criar diretórios e montar os outros subvolumes
mkdir -p /mnt/{home,var/log,var/cache,.snapshots}
mount -o subvol=@home,compress=zstd,noatime /dev/sda3 /mnt/home
mount -o subvol=@log,compress=zstd,noatime /dev/sda3 /mnt/var/log
mount -o subvol=@cache,compress=zstd,noatime /dev/sda3 /mnt/var/cache
mount -o subvol=@snapshots,compress=zstd,noatime /dev/sda3 /mnt/.snapshots

# Ativar swap e montar EFI
swapon /dev/sda2
mount --mkdir /dev/sda1 /mnt/boot/efi

# ===== VERIFICAR =====
# Confirmar que tudo está montado:
lsblk
# NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
# sda      8:0    0 476.9G  0 disk
# ├─sda1   8:1    0   512M  0 part /mnt/boot/efi
# ├─sda2   8:2    0     4G  0 part [SWAP]
# └─sda3   8:3    0 472.4G  0 part /mnt`}),e.jsx("h3",{children:"Passo 5: Instalar o Sistema Base"}),e.jsx(o,{title:"pacstrap - instalar os pacotes base",code:`# O pacstrap instala pacotes dentro do diretório /mnt
# (que é onde montamos nosso novo sistema)

# Instalação mínima:
pacstrap /mnt base linux linux-firmware

# Instalação recomendada (já inclui ferramentas úteis):
pacstrap /mnt base linux linux-firmware \\
    nano vim \\
    networkmanager \\
    base-devel git \\
    sudo

# O que cada pacote é:
# base           = Pacotes fundamentais do sistema (libc, bash, coreutils...)
# linux          = O kernel Linux
# linux-firmware = Drivers/firmwares para hardware (Wi-Fi, Bluetooth, etc)
# nano vim       = Editores de texto (você VAI precisar de pelo menos um)
# networkmanager = Gerenciador de rede (Wi-Fi e ethernet)
# base-devel     = Ferramentas de compilação (gcc, make, etc)
# git            = Controle de versão (necessário para AUR)
# sudo           = Permite executar comandos como root

# Opcional: Instalar kernel LTS como backup
pacstrap /mnt linux-lts linux-lts-headers

# Saída esperada (demora alguns minutos):
# ==> Creating install root at /mnt
# ==> Installing packages to /mnt
# :: Synchronizing package databases...
#  core   130.5 KiB
#  extra    8.2 MiB
# resolving dependencies...
# :: Processing package changes (1/XX)...
# (XX/XX) installing base
# ...
# ==> Generating initial ramdisk...
# ==> Installation complete.`}),e.jsx("h3",{children:"Passo 6: Gerar o fstab"}),e.jsx(o,{title:"Gerar fstab (tabela de partições)",code:`# O fstab diz ao sistema quais partições montar e onde,
# toda vez que o computador liga.

genfstab -U /mnt >> /mnt/etc/fstab

# -U = Usar UUID (identificador único) ao invés de /dev/sdX
#      (UUIDs são mais confiáveis porque não mudam se você
#       adicionar/remover discos)

# Verificar se ficou correto:
cat /mnt/etc/fstab

# Saída esperada (ext4):
# UUID=xxxx-xxxx-xxxx  /           ext4   rw,relatime  0 1
# UUID=xxxx-xxxx-xxxx  /boot/efi   vfat   rw,relatime  0 2
# UUID=xxxx-xxxx-xxxx  none        swap   defaults     0 0

# Se alguma linha estiver errada ou faltando, edite manualmente:
nano /mnt/etc/fstab`}),e.jsx("h3",{children:"Passo 7: Entrar no Novo Sistema (chroot)"}),e.jsx(o,{title:"arch-chroot - mudar para o novo sistema",code:`# O arch-chroot muda a raiz do sistema para /mnt
# Ou seja, a partir daqui, você está "dentro" do novo Arch Linux
# (não mais na ISO do pen drive)
arch-chroot /mnt

# O prompt muda de:
# root@archiso ~ #
# Para:
# [root@archiso /]#

# Tudo que você fizer agora acontece dentro do novo sistema.`}),e.jsx("h3",{children:"Passo 8: Configurar Timezone"}),e.jsx(o,{title:"Configurar fuso horário",code:`# Criar link simbólico para o fuso horário
ln -sf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime

# Sincronizar relógio do hardware
hwclock --systohc

# Verificar
date
# Wed Mar 26 18:30:00 -03 2026`}),e.jsx("h3",{children:"Passo 9: Configurar Localização (Idioma)"}),e.jsx(o,{title:"Configurar locale",code:`# Editar o arquivo de locales
nano /etc/locale.gen

# Procure e DESCOMENTE (remova o # do início) estas linhas:
# pt_BR.UTF-8 UTF-8
# en_US.UTF-8 UTF-8
# (Ter ambos é útil: pt_BR para o sistema, en_US para mensagens de erro
#  que são mais fáceis de pesquisar no Google em inglês)

# Gerar os locales
locale-gen
# Generating locales...
#   en_US.UTF-8... done
#   pt_BR.UTF-8... done
# Generation complete.

# Definir o idioma padrão do sistema
echo "LANG=pt_BR.UTF-8" > /etc/locale.conf

# Definir o layout do teclado permanentemente
echo "KEYMAP=br-abnt2" > /etc/vconsole.conf`}),e.jsx("h3",{children:"Passo 10: Hostname (Nome da Máquina)"}),e.jsx(o,{title:"Definir nome do computador",code:`# Definir o nome da máquina
echo "meupc" > /etc/hostname

# Configurar o arquivo hosts
nano /etc/hosts

# Adicione estas linhas:
# 127.0.0.1    localhost
# ::1          localhost
# 127.0.1.1    meupc.localdomain    meupc

# O /etc/hosts mapeia nomes para IPs localmente.
# Sem isso, alguns programas podem ter problemas de resolução de nomes.`}),e.jsx("h3",{children:"Passo 11: Senha do Root e Usuário"}),e.jsx(o,{title:"Configurar senhas e usuário",code:`# Definir senha do root
passwd
# New password: ********
# Retype new password: ********
# passwd: password updated successfully

# Criar um usuário normal
useradd -m -G wheel -s /bin/bash joao
# -m           = Criar diretório /home/joao
# -G wheel     = Adicionar ao grupo wheel (administradores)
# -s /bin/bash = Shell padrão

# Definir senha do usuário
passwd joao
# New password: ********
# Retype new password: ********

# Configurar sudo (se instalou o pacote sudo)
EDITOR=nano visudo
# Procure a linha:
# # %wheel ALL=(ALL:ALL) ALL
# Remova o # do início para descomentá-la:
# %wheel ALL=(ALL:ALL) ALL
# Salve: Ctrl+O → Enter → Ctrl+X`}),e.jsx("h3",{children:"Passo 12: Instalar o Bootloader"}),e.jsx("p",{children:"O bootloader é o programa que carrega o kernel do Linux quando o computador liga. Sem ele, o computador não sabe como iniciar o sistema."}),e.jsx("h4",{children:"Opção A: GRUB (mais popular, suporta dual-boot)"}),e.jsx(o,{title:"Instalar GRUB (UEFI)",code:`# Instalar os pacotes
pacman -S grub efibootmgr

# Instalar o GRUB na partição EFI
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB

# Saída esperada:
# Installing for x86_64-efi platform.
# Installation finished. No error reported.

# Se for fazer DUAL BOOT com Windows, instale também:
pacman -S os-prober
# E descomente esta linha no /etc/default/grub:
# GRUB_DISABLE_OS_PROBER=false

# Gerar o arquivo de configuração do GRUB
grub-mkconfig -o /boot/grub/grub.cfg

# Saída esperada:
# Generating grub configuration file ...
# Found linux image: /boot/vmlinuz-linux
# Found initrd image: /boot/initramfs-linux.img
# Found fallback initrd image(s): /boot/initramfs-linux-fallback.img
# done`}),e.jsx("h4",{children:"Opção B: systemd-boot (mais simples para UEFI)"}),e.jsx(o,{title:"Instalar systemd-boot",code:`# O systemd-boot já faz parte do systemd, não precisa instalar pacote extra
bootctl --path=/boot/efi install

# Criar entrada de boot
nano /boot/efi/loader/entries/arch.conf

# Adicione:
# title   Arch Linux
# linux   /vmlinuz-linux
# initrd  /initramfs-linux.img
# options root=UUID=XXXX-XXXX-XXXX rw
# (substitua XXXX pelo UUID da partição raiz, veja com: blkid /dev/sda3)

# Configurar o loader
nano /boot/efi/loader/loader.conf

# Adicione:
# default arch.conf
# timeout 5
# console-mode max`}),e.jsx("h3",{children:"Passo 13: Habilitar Serviços Essenciais"}),e.jsx(o,{title:"Habilitar serviços para iniciar no boot",code:`# MUITO IMPORTANTE: Habilitar o NetworkManager
# Sem isso, você não vai ter internet após reiniciar!
systemctl enable NetworkManager

# Se vai usar Wi-Fi e quer que conecte automaticamente:
systemctl enable NetworkManager-wait-online.service`}),e.jsx("h3",{children:"Passo 14: Sair e Reiniciar"}),e.jsx(o,{title:"Finalizar a instalação",code:`# Sair do chroot (volta para a ISO)
exit

# Desmontar todas as partições
umount -R /mnt

# Reiniciar
reboot

# IMPORTANTE: Retire o pen drive durante a reinicialização!
# Se não retirar, vai dar boot pela ISO de novo ao invés do sistema instalado.`}),e.jsx(a,{type:"success",title:"Instalação concluída!",children:e.jsxs("p",{children:["Se tudo deu certo, após reiniciar você verá o menu do GRUB (ou systemd-boot) e depois uma tela preta pedindo login. Digite seu usuário e senha. Parabéns, você tem um Arch Linux funcional! Agora siga para o guia de ",e.jsx("strong",{children:"Primeiros Passos"})," para configurar internet, áudio, fontes e instalar um ambiente gráfico."]})}),e.jsx("h2",{children:"Troubleshooting da Instalação"}),e.jsx("h3",{children:"Problema: Após reiniciar, cai direto na BIOS/UEFI"}),e.jsx(o,{title:"Bootloader não foi instalado corretamente",code:`# Dê boot pela ISO novamente, monte as partições:
mount /dev/sda3 /mnt
mount /dev/sda1 /mnt/boot/efi
arch-chroot /mnt

# Reinstale o GRUB:
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg

# Se ainda não funcionar, verifique se a partição EFI está formatada em FAT32:
file -sL /dev/sda1
# Deve mostrar: DOS/MBR boot sector... FAT32`}),e.jsx("h3",{children:'Problema: "error: no such partition" no GRUB'}),e.jsx(o,{title:"UUID errado no GRUB",code:`# O GRUB não encontrou a partição raiz. Verifique os UUIDs:
blkid

# Compare com o que está em /boot/grub/grub.cfg
# Regenere a configuração:
grub-mkconfig -o /boot/grub/grub.cfg`}),e.jsx("h3",{children:"Problema: Sem internet após instalar"}),e.jsx(o,{title:"NetworkManager não foi habilitado",code:`# Provavelmente você esqueceu de habilitar o NetworkManager
# Dê boot pela ISO, monte e entre no chroot:
mount /dev/sda3 /mnt
arch-chroot /mnt

# Se não instalou o NetworkManager:
pacman -S networkmanager

# Habilitar:
systemctl enable NetworkManager

exit
umount -R /mnt
reboot`}),e.jsx("h3",{children:"Problema: Teclado com layout errado após instalar"}),e.jsx(o,{title:"Corrigir layout do teclado",code:`# Verificar configuração atual
localectl

# Definir layout ABNT2 permanentemente
sudo localectl set-keymap br-abnt2

# Para X11/Wayland:
sudo localectl set-x11-keymap br abnt2`})]})}export{u as default};
