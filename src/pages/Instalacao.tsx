import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Instalacao() {
  return (
    <PageContainer
      title="Guia de Instalação Completo"
      subtitle="Da criação do pen drive bootável até o primeiro login. Dois métodos: archinstall (assistido) e instalação manual (o verdadeiro aprendizado)."
      difficulty="intermediario"
      timeToRead="45 min"
    >
      <h2>Antes de Começar</h2>
      <p>
        A instalação do Arch Linux é diferente de qualquer outra distribuição. Não existe um instalador
        gráfico com botões bonitos — tudo é feito pelo terminal. Isso pode parecer assustador, mas
        é justamente por isso que você aprende de verdade como um sistema Linux funciona por dentro.
      </p>
      <p>Existem dois caminhos:</p>
      <ul>
        <li><strong>archinstall</strong>: Um script assistido com menus de seleção. Você navega com as setas e seleciona as opções. Mais rápido e seguro para iniciantes.</li>
        <li><strong>Instalação manual</strong>: Você digita cada comando, particiona o disco, formata, instala e configura tudo manualmente. Mais trabalhoso, mas ensina muito mais.</li>
      </ul>
      <p>
        Este guia cobre <strong>ambos os métodos</strong>. Se é sua primeira vez, comece com o archinstall.
        Depois, faça a instalação manual para entender o que o archinstall fez por baixo dos panos.
      </p>

      <h2>Pré-Requisitos</h2>
      <ul>
        <li>Um pen drive de pelo menos 2GB (será formatado)</li>
        <li>Conexão com internet (cabo ethernet é mais fácil, Wi-Fi também funciona)</li>
        <li>Um computador com boot UEFI (quase todos os PCs fabricados depois de 2012)</li>
        <li>Pelo menos 20GB de espaço livre em disco (recomendado 50GB+)</li>
        <li>Backup de tudo que é importante no disco — a instalação pode apagar dados</li>
      </ul>

      <h2>1. Baixar a ISO e Criar o Pen Drive Bootável</h2>

      <h3>Baixar a ISO</h3>
      <p>
        Acesse <code>https://archlinux.org/download/</code> e baixe a ISO mais recente.
        O Arch Linux lança uma nova ISO todo mês, sempre atualizada. O arquivo tem cerca de 800MB.
      </p>

      <h3>Gravar no pen drive</h3>

      <h4>No Linux (usando dd)</h4>
      <CodeBlock
        title="Gravar ISO no pen drive (Linux)"
        code={`# Primeiro, descubra qual é o pen drive
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
# oflag=sync    = Garantir que os dados sejam gravados de verdade`}
      />

      <AlertBox type="danger" title="Cuidado com o dd!">
        <p>O comando <code>dd</code> é apelidado de "disk destroyer" por um bom motivo.
        Ele faz exatamente o que você manda, sem perguntar. Se você colocar <code>of=/dev/sda</code>
        ao invés de <code>of=/dev/sdb</code>, ele vai apagar seu disco principal sem pedir confirmação.
        <strong>Confira o dispositivo três vezes antes de executar.</strong></p>
      </AlertBox>

      <h4>No Windows</h4>
      <p>
        Use o <strong>Rufus</strong> (rufus.ie) ou o <strong>balenaEtcher</strong> (etcher.balena.io).
        No Rufus, selecione a ISO, selecione o pen drive, escolha "GPT" como esquema de partição
        e clique em Iniciar. Se perguntar sobre o modo, escolha "Gravar em modo de imagem DD".
      </p>

      <h4>No macOS</h4>
      <CodeBlock
        title="Gravar ISO no pen drive (macOS)"
        code={`# Listar discos
diskutil list

# Desmontar o pen drive (ex: disk2)
diskutil unmountDisk /dev/disk2

# Gravar (use rdisk para ser mais rápido)
sudo dd bs=4M if=archlinux-2026.03.01-x86_64.iso of=/dev/rdisk2 status=progress`}
      />

      <h2>2. Dar Boot pelo Pen Drive</h2>
      <p>
        Com o pen drive gravado, reinicie o computador e entre no menu de boot. A tecla varia
        por fabricante:
      </p>
      <ul>
        <li><strong>ASUS</strong>: F8 ou ESC</li>
        <li><strong>Acer</strong>: F12</li>
        <li><strong>Dell</strong>: F12</li>
        <li><strong>HP</strong>: F9 ou ESC</li>
        <li><strong>Lenovo</strong>: F12 ou Fn+F12</li>
        <li><strong>MSI</strong>: F11</li>
        <li><strong>Samsung</strong>: F2 ou ESC</li>
        <li><strong>Gigabyte</strong>: F12</li>
      </ul>
      <p>
        Selecione o pen drive na lista (geralmente aparece como "USB" ou "UEFI: nome_do_pendrive").
        Se não aparecer, pode ser que o Secure Boot esteja habilitado — entre na BIOS/UEFI (geralmente
        F2 ou DEL) e desabilite o Secure Boot.
      </p>

      <AlertBox type="info" title="BIOS vs UEFI">
        <p>PCs antigos (antes de ~2012) usam BIOS legada. PCs modernos usam UEFI. Este guia
        assume UEFI, que é o padrão hoje. Se seu PC é antigo com BIOS, o processo de particionamento
        e bootloader será diferente (sem partição EFI, usando MBR ao invés de GPT).</p>
      </AlertBox>

      <h3>Primeira tela</h3>
      <p>
        Após dar boot pelo pen drive, você verá o menu do bootloader do Arch:
      </p>
      <CodeBlock
        title="Menu de boot da ISO"
        code={`Arch Linux install medium (x86_64, UEFI)

  Arch Linux install medium (x86_64, UEFI)     ← Selecione este
  Arch Linux install medium (x86_64, UEFI) with speech
  Memtest86+
  EFI Shell

# Use as setas para navegar e Enter para selecionar.
# Após o boot, você cairá num prompt:
# root@archiso ~ #
# É aqui que a instalação começa.`}
      />

      <h3>Configurar teclado brasileiro</h3>
      <p>
        Por padrão, o teclado está em layout americano (US). Se você tem um teclado ABNT2
        (padrão brasileiro, com Ç), mude:
      </p>
      <CodeBlock
        title="Mudar layout do teclado"
        code={`# Carregar layout ABNT2 (teclado brasileiro)
loadkeys br-abnt2

# Agora o Ç, acentos e caracteres especiais funcionam corretamente.
# Para ver todos os layouts disponíveis:
localectl list-keymaps | less`}
      />

      <h3>Verificar se deu boot em modo UEFI</h3>
      <CodeBlock
        title="Confirmar modo UEFI"
        code={`# Se este diretório existir, você está em modo UEFI
ls /sys/firmware/efi/efivars

# Se mostrar vários arquivos, OK — é UEFI.
# Se der erro "No such file or directory", você está em modo BIOS legada.`}
      />

      <h3>Conectar à Internet</h3>
      <p>
        Sem internet, não dá para instalar nada. Se está com cabo ethernet, provavelmente
        já está conectado. Teste com:
      </p>
      <CodeBlock
        title="Testar internet"
        code={`ping -c 3 archlinux.org

# Se funcionar, pule para a próxima seção.
# Se não, veja abaixo como conectar via Wi-Fi.`}
      />

      <p>
        Para Wi-Fi, use o <code>iwctl</code> (veja a página de Primeiros Passos para uma explicação
        completa de todos os subcomandos):
      </p>
      <CodeBlock
        title="Conectar Wi-Fi com iwctl"
        code={`# Entrar no modo interativo
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
ping -c 3 archlinux.org`}
      />

      <h3>Atualizar relógio do sistema</h3>
      <CodeBlock
        title="Sincronizar relógio via NTP"
        code={`# Habilitar sincronização de hora pela internet
timedatectl set-ntp true

# Verificar
timedatectl
# System clock synchronized: yes`}
      />

      <hr />

      <h2>Método 1: archinstall (Instalação Assistida)</h2>
      <p>
        O <code>archinstall</code> é um script Python que vem incluído na ISO desde 2021.
        Ele automatiza todo o processo de instalação usando menus interativos onde você
        navega com as <strong>setas do teclado</strong>, marca opções com <strong>Enter</strong>
        ou <strong>Espaço</strong>, e ele faz todo o trabalho pesado (particionar, formatar,
        instalar, configurar) sozinho.
      </p>

      <CodeBlock
        title="Iniciar o archinstall"
        code={`archinstall`}
      />

      <p>
        Ao executar, aparece uma tela com várias opções de configuração. Cada item é uma
        categoria que você precisa configurar. Você navega entre elas com as setas
        <strong> ↑ ↓</strong> e pressiona <strong>Enter</strong> para abrir as opções de cada item.
      </p>

      <CodeBlock
        title="Tela principal do archinstall"
        code={`Archinstall v2.8.1

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
# Após configurar tudo, selecione "Install" no final`}
      />

      <AlertBox type="info" title="Como navegar no archinstall">
        <p>O archinstall usa um sistema de menus simples:</p>
        <p><strong>Setas ↑ ↓</strong> = Navegar entre opções</p>
        <p><strong>Enter</strong> = Selecionar / Confirmar uma opção</p>
        <p><strong>Espaço</strong> = Marcar/Desmarcar em listas de múltipla escolha</p>
        <p><strong>Tab</strong> = Alternar entre campos (em alguns menus)</p>
        <p><strong>ESC</strong> = Voltar ao menu anterior</p>
        <p>Não precisa digitar nenhum comando — é tudo navegação com as setas e seleção!</p>
      </AlertBox>

      <h3>Archinstall Language</h3>
      <p>
        Idioma da interface do instalador. Selecione e escolha o idioma. Pode deixar em English
        se preferir — isso não afeta o idioma do sistema instalado.
      </p>

      <h3>Mirrors (Espelhos)</h3>
      <p>
        Define de quais servidores os pacotes serão baixados. Ao selecionar, aparece uma lista
        de regiões/países:
      </p>
      <CodeBlock
        title="Seleção de Mirrors"
        code={`Mirror region

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
# Isso garante downloads mais rápidos`}
      />

      <h3>Locales (Localização)</h3>
      <p>
        Aqui você configura o layout do teclado, o idioma do sistema e a codificação de caracteres.
        São três opções que aparecem:
      </p>
      <CodeBlock
        title="Configuração de Locales"
        code={`Locales

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
#   ...`}
      />

      <h3>Disk configuration (Configuração de Disco)</h3>
      <p>
        Esta é a parte mais importante. Aqui você define como o disco será particionado e
        qual sistema de arquivos usar. Ao selecionar, aparecem as opções:
      </p>
      <CodeBlock
        title="Método de particionamento"
        code={`Disk configuration

> Use a best-effort default partition layout    ← Mais fácil (recomendado)
  Manual partitioning                           ← Para quem quer controle total
  Pre-mounted configuration                     ← Se já montou as partições manualmente

# Selecione "Use a best-effort default partition layout" para iniciantes.
# Ele vai criar as partições automaticamente.`}
      />

      <p>Depois de selecionar o layout automático, ele pergunta qual disco usar:</p>
      <CodeBlock
        title="Seleção do disco"
        code={`Select one or more hard drives

> /dev/sda    476.94 GiB    Samsung SSD 870    ← Seu disco principal
  /dev/sdb     14.53 GiB    SanDisk USB        ← Seu pen drive (NÃO selecione este!)

# Use ↑ ↓ para navegar e Enter para selecionar
# CUIDADO: Selecione o disco correto! O pen drive da instalação NÃO é o certo.
# Olhe o tamanho e o nome do fabricante para identificar.`}
      />

      <AlertBox type="danger" title="Selecione o disco certo!">
        <p>Se você selecionar o pen drive ao invés do disco principal, o archinstall vai instalar
        o Arch no pen drive (que não é o que você quer). Identifique pelo tamanho: seu HD/SSD
        principal tem centenas de GB, o pen drive tem ~8-32GB.</p>
      </AlertBox>

      <p>Em seguida, a tela mais importante — escolher o <strong>sistema de arquivos (filesystem)</strong>:</p>
      <CodeBlock
        title="Seleção do Filesystem"
        code={`Select a filesystem for /dev/sda

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
#          Menos comum, menos documentado.`}
      />

      <AlertBox type="info" title="ext4 ou btrfs? Qual escolher?">
        <p><strong>Se é sua primeira instalação:</strong> Escolha <strong>ext4</strong>. É simples, confiável
        e não precisa de configuração extra. Você pode trocar para btrfs depois quando se sentir confortável.</p>
        <p><strong>Se quer snapshots:</strong> Escolha <strong>btrfs</strong>. Snapshots permitem "tirar uma foto"
        do estado do sistema antes de uma atualização grande. Se a atualização quebrar algo, você volta ao estado
        anterior em segundos. Ferramentas como <code>timeshift</code> e <code>snapper</code> facilitam isso.</p>
      </AlertBox>

      <p>Se escolher <strong>btrfs</strong>, o archinstall pergunta se quer usar subvolumes:</p>
      <CodeBlock
        title="Subvolumes btrfs"
        code={`Would you like to use btrfs subvolumes with a default structure?

> Yes     ← Recomendado (cria @, @home, @log, @cache, @snapshots)
  No      ← Sem subvolumes (perde a vantagem de snapshots)

# Se selecionar Yes, ele cria automaticamente:
# @          → Montado em /          (sistema)
# @home      → Montado em /home     (seus arquivos pessoais)
# @log       → Montado em /var/log  (logs do sistema)
# @cache     → Montado em /var/cache (cache do pacman)
# @snapshots → Montado em /.snapshots (snapshots do sistema)

# Essa estrutura permite fazer snapshot do sistema (@) sem incluir
# seus arquivos pessoais (@home) e sem incluir cache (@cache).`}
      />

      <p>Depois pergunta sobre compressão:</p>
      <CodeBlock
        title="Compressão btrfs"
        code={`Would you like to use compression?

> Yes     ← Recomendado (usa zstd, economiza espaço sem perder performance)
  No

# A compressão zstd é muito rápida e em muitos casos até ACELERA
# o sistema porque menos dados são lidos/escritos no disco.
# Não tem desvantagem prática em SSDs modernos.`}
      />

      <h3>Disk encryption (Criptografia)</h3>
      <p>
        Se quiser criptografar o disco inteiro com LUKS (recomendado para notebooks que você
        leva para fora de casa):
      </p>
      <CodeBlock
        title="Criptografia de disco"
        code={`Disk encryption

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
# para sempre. Não existe recuperação.`}
      />

      <h3>Bootloader</h3>
      <CodeBlock
        title="Seleção do bootloader"
        code={`Bootloader

> Systemd-boot         ← Mais simples e moderno (recomendado para UEFI)
  GRUB                 ← Mais popular, suporta BIOS e UEFI
  Limine               ← Alternativa leve

# Systemd-boot: Simples, rápido, já faz parte do systemd. Só funciona
#   com UEFI. Se seu PC é moderno, essa é a melhor opção.
#
# GRUB: Mais versátil, funciona com BIOS e UEFI, suporta dual-boot
#   com Windows mais facilmente. Se vai fazer dual-boot, escolha GRUB.
#
# Limine: Alternativa minimalista. Para usuários avançados.`}
      />

      <h3>Hostname</h3>
      <CodeBlock
        title="Nome da máquina"
        code={`Hostname: archlinux

# Mude para o nome que quiser. Exemplos:
# meupc
# desktop-joao
# arch-notebook
# vader
# Sem espaços, sem caracteres especiais, letras minúsculas.`}
      />

      <h3>Root password (Senha do root)</h3>
      <CodeBlock
        title="Senha do root"
        code={`Root password: ********

# Digite uma senha para o usuário root (administrador).
# Os caracteres NÃO aparecem enquanto você digita (é normal).
# Depois vai pedir para confirmar a mesma senha.

# Dica: Pode pular (deixar vazio) se for criar um usuário
# com sudo no próximo passo, mas ter senha de root é mais seguro.`}
      />

      <h3>User account (Conta de usuário)</h3>
      <CodeBlock
        title="Criar usuário"
        code={`User account

  Add a user            ← Selecione para criar seu usuário
  Confirm and exit

# Ao selecionar "Add a user":
# Enter username: joao                ← Seu nome de usuário
# Password: ********                  ← Sua senha
# Confirm password: ********          ← Repetir senha
# Should this user be a superuser (sudo)? Yes  ← IMPORTANTE: Diga Yes!

# O superuser (sudo) permite que seu usuário execute comandos
# como administrador quando necessário (ex: instalar pacotes).
# Se disser "No", você não vai conseguir usar sudo.`}
      />

      <h3>Profile (Perfil / Ambiente Gráfico)</h3>
      <p>
        Aqui você pode já escolher instalar um ambiente gráfico junto com o sistema:
      </p>
      <CodeBlock
        title="Seleção de perfil"
        code={`Profile type

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
# XFCE       → Para PCs mais fracos, leve e funcional`}
      />

      <p>Depois de selecionar o DE, ele pergunta sobre o driver de vídeo:</p>
      <CodeBlock
        title="Seleção do driver de vídeo"
        code={`Graphics driver

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
# Se não sabe qual placa tem, rode: lspci | grep -i vga`}
      />

      <h3>Audio</h3>
      <CodeBlock
        title="Servidor de áudio"
        code={`Audio server

  No audio server
> PipeWire              ← Moderno, recomendado
  PulseAudio            ← Antigo, mas funcional

# PipeWire é a escolha moderna. Substitui PulseAudio e JACK.
# Selecione PipeWire a menos que tenha um motivo específico.`}
      />

      <h3>Kernels</h3>
      <CodeBlock
        title="Seleção de kernel"
        code={`Kernels

> linux                 ← Kernel padrão (recomendado)
  linux-lts             ← Kernel de suporte longo (mais estável)
  linux-hardened        ← Kernel com patches de segurança extras
  linux-zen             ← Kernel otimizado para desktop/gaming

# Você pode selecionar mais de um! Use Espaço para marcar/desmarcar.
# Recomendação: Selecione "linux" E "linux-lts"
# Assim, se o kernel padrão der problema após uma atualização,
# você pode dar boot pelo kernel LTS como backup.`}
      />

      <h3>Additional packages (Pacotes adicionais)</h3>
      <CodeBlock
        title="Pacotes extras para instalar junto"
        code={`Additional packages (space separated):

# Aqui você digita nomes de pacotes separados por espaço.
# Exemplos úteis:
git vim nano htop wget curl firefox base-devel

# Esses pacotes serão instalados junto com o sistema.
# Você pode instalar mais depois com pacman, mas já deixar
# o git e base-devel economiza tempo depois.`}
      />

      <h3>Network configuration</h3>
      <CodeBlock
        title="Configuração de rede"
        code={`Network configuration

  Not configured
  Copy ISO network configuration
> Use NetworkManager            ← Selecione este!
  Manual configuration

# "Use NetworkManager" é a melhor opção para desktop.
# Ele gerencia Wi-Fi, ethernet e VPN automaticamente.
# Se selecionar "Not configured", não vai ter internet após reiniciar!`}
      />

      <h3>Timezone (Fuso horário)</h3>
      <CodeBlock
        title="Seleção de timezone"
        code={`Timezone

  ...
  America/Recife
  America/Rio_Branco
> America/Sao_Paulo            ← Para a maioria do Brasil
  America/Santarem
  ...

# Navegue com ↑ ↓ até encontrar America/Sao_Paulo
# Dica: Digite as primeiras letras para pular na lista`}
      />

      <h3>Optional repositories</h3>
      <CodeBlock
        title="Repositórios opcionais"
        code={`Optional repositories

> multilib              ← Pacotes 32-bit (necessário para Steam, Wine)
  testing               ← Pacotes em teste (NÃO habilite para uso normal)

# Marque "multilib" com Espaço se pretende jogar ou usar Wine.
# NÃO habilite "testing" a menos que saiba o que está fazendo.`}
      />

      <h3>Instalando!</h3>
      <p>
        Depois de configurar tudo, navegue até <strong>"Install"</strong> no final da lista
        e pressione Enter:
      </p>
      <CodeBlock
        title="Confirmar instalação"
        code={`# O archinstall vai mostrar um resumo de tudo que vai fazer e perguntar:
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
reboot`}
      />

      <AlertBox type="success" title="Pronto!">
        <p>Se usou o archinstall com Desktop, após reiniciar você já deve ver a tela de login
        gráfica. Faça login com o usuário e senha que configurou. Se usou Minimal, vai cair
        num terminal — veja a seção de Primeiros Passos para continuar a configuração.</p>
      </AlertBox>

      <hr />

      <h2>Método 2: Instalação Manual (O Caminho do Aprendizado)</h2>
      <p>
        Este é o método original do Arch Linux — você faz tudo manualmente, comando por comando.
        É mais trabalhoso, mas ensina exatamente como um sistema Linux funciona. Se você só usou
        o archinstall, volte aqui depois e faça a instalação manual pelo menos uma vez.
      </p>
      <p>
        A partir daqui, assumimos que você já deu boot pela ISO, configurou o teclado,
        verificou o modo UEFI e conectou à internet (passos do início deste guia).
      </p>

      <h3>Passo 1: Identificar os Discos</h3>
      <CodeBlock
        title="Listar discos e partições"
        code={`lsblk

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
lsblk -f    # Mostra também o filesystem de cada partição`}
      />

      <AlertBox type="danger" title="Atenção Total">
        <p>Os próximos comandos vão <strong>apagar todos os dados</strong> do disco selecionado.
        Certifique-se de que é o disco correto e que você tem backup de tudo que é importante.
        Se errar o disco, perderá seus dados permanentemente.</p>
      </AlertBox>

      <h3>Passo 2: Particionar o Disco</h3>
      <p>
        Vamos usar o <code>cfdisk</code> que tem uma interface visual mais fácil de usar
        que o <code>fdisk</code>. Para UEFI, precisamos de pelo menos duas partições:
      </p>
      <CodeBlock
        title="Particionar com cfdisk"
        code={`# Abrir o particionador visual
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
#   /dev/sda3     9439232  1000215215  990775984  472.4G  Linux filesystem`}
      />

      <p>Se preferir usar <code>fdisk</code> (mais avançado, sem interface visual):</p>
      <CodeBlock
        title="Particionar com fdisk (alternativa)"
        code={`fdisk /dev/sda

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
# w         → Gravar alterações e sair`}
      />

      <h3>Passo 3: Formatar as Partições</h3>
      <CodeBlock
        title="Formatar cada partição"
        code={`# Formatar a partição EFI em FAT32 (obrigatório para UEFI)
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
umount /mnt`}
      />

      <h3>Passo 4: Montar as Partições</h3>
      <CodeBlock
        title="Montar as partições na ordem correta"
        code={`# ===== SE USOU EXT4 =====

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
# └─sda3   8:3    0 472.4G  0 part /mnt`}
      />

      <h3>Passo 5: Instalar o Sistema Base</h3>
      <CodeBlock
        title="pacstrap - instalar os pacotes base"
        code={`# O pacstrap instala pacotes dentro do diretório /mnt
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
# ==> Installation complete.`}
      />

      <h3>Passo 6: Gerar o fstab</h3>
      <CodeBlock
        title="Gerar fstab (tabela de partições)"
        code={`# O fstab diz ao sistema quais partições montar e onde,
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
nano /mnt/etc/fstab`}
      />

      <h3>Passo 7: Entrar no Novo Sistema (chroot)</h3>
      <CodeBlock
        title="arch-chroot - mudar para o novo sistema"
        code={`# O arch-chroot muda a raiz do sistema para /mnt
# Ou seja, a partir daqui, você está "dentro" do novo Arch Linux
# (não mais na ISO do pen drive)
arch-chroot /mnt

# O prompt muda de:
# root@archiso ~ #
# Para:
# [root@archiso /]#

# Tudo que você fizer agora acontece dentro do novo sistema.`}
      />

      <h3>Passo 8: Configurar Timezone</h3>
      <CodeBlock
        title="Configurar fuso horário"
        code={`# Criar link simbólico para o fuso horário
ln -sf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime

# Sincronizar relógio do hardware
hwclock --systohc

# Verificar
date
# Wed Mar 26 18:30:00 -03 2026`}
      />

      <h3>Passo 9: Configurar Localização (Idioma)</h3>
      <CodeBlock
        title="Configurar locale"
        code={`# Editar o arquivo de locales
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
echo "KEYMAP=br-abnt2" > /etc/vconsole.conf`}
      />

      <h3>Passo 10: Hostname (Nome da Máquina)</h3>
      <CodeBlock
        title="Definir nome do computador"
        code={`# Definir o nome da máquina
echo "meupc" > /etc/hostname

# Configurar o arquivo hosts
nano /etc/hosts

# Adicione estas linhas:
# 127.0.0.1    localhost
# ::1          localhost
# 127.0.1.1    meupc.localdomain    meupc

# O /etc/hosts mapeia nomes para IPs localmente.
# Sem isso, alguns programas podem ter problemas de resolução de nomes.`}
      />

      <h3>Passo 11: Senha do Root e Usuário</h3>
      <CodeBlock
        title="Configurar senhas e usuário"
        code={`# Definir senha do root
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
# Salve: Ctrl+O → Enter → Ctrl+X`}
      />

      <h3>Passo 12: Instalar o Bootloader</h3>
      <p>
        O bootloader é o programa que carrega o kernel do Linux quando o computador liga.
        Sem ele, o computador não sabe como iniciar o sistema.
      </p>

      <h4>Opção A: GRUB (mais popular, suporta dual-boot)</h4>
      <CodeBlock
        title="Instalar GRUB (UEFI)"
        code={`# Instalar os pacotes
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
# done`}
      />

      <h4>Opção B: systemd-boot (mais simples para UEFI)</h4>
      <CodeBlock
        title="Instalar systemd-boot"
        code={`# O systemd-boot já faz parte do systemd, não precisa instalar pacote extra
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
# console-mode max`}
      />

      <h3>Passo 13: Habilitar Serviços Essenciais</h3>
      <CodeBlock
        title="Habilitar serviços para iniciar no boot"
        code={`# MUITO IMPORTANTE: Habilitar o NetworkManager
# Sem isso, você não vai ter internet após reiniciar!
systemctl enable NetworkManager

# Se vai usar Wi-Fi e quer que conecte automaticamente:
systemctl enable NetworkManager-wait-online.service`}
      />

      <h3>Passo 14: Sair e Reiniciar</h3>
      <CodeBlock
        title="Finalizar a instalação"
        code={`# Sair do chroot (volta para a ISO)
exit

# Desmontar todas as partições
umount -R /mnt

# Reiniciar
reboot

# IMPORTANTE: Retire o pen drive durante a reinicialização!
# Se não retirar, vai dar boot pela ISO de novo ao invés do sistema instalado.`}
      />

      <AlertBox type="success" title="Instalação concluída!">
        <p>Se tudo deu certo, após reiniciar você verá o menu do GRUB (ou systemd-boot) e depois
        uma tela preta pedindo login. Digite seu usuário e senha. Parabéns, você tem um Arch
        Linux funcional! Agora siga para o guia de <strong>Primeiros Passos</strong> para configurar
        internet, áudio, fontes e instalar um ambiente gráfico.</p>
      </AlertBox>

      <h2>Troubleshooting da Instalação</h2>

      <h3>Problema: Após reiniciar, cai direto na BIOS/UEFI</h3>
      <CodeBlock
        title="Bootloader não foi instalado corretamente"
        code={`# Dê boot pela ISO novamente, monte as partições:
mount /dev/sda3 /mnt
mount /dev/sda1 /mnt/boot/efi
arch-chroot /mnt

# Reinstale o GRUB:
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg

# Se ainda não funcionar, verifique se a partição EFI está formatada em FAT32:
file -sL /dev/sda1
# Deve mostrar: DOS/MBR boot sector... FAT32`}
      />

      <h3>Problema: "error: no such partition" no GRUB</h3>
      <CodeBlock
        title="UUID errado no GRUB"
        code={`# O GRUB não encontrou a partição raiz. Verifique os UUIDs:
blkid

# Compare com o que está em /boot/grub/grub.cfg
# Regenere a configuração:
grub-mkconfig -o /boot/grub/grub.cfg`}
      />

      <h3>Problema: Sem internet após instalar</h3>
      <CodeBlock
        title="NetworkManager não foi habilitado"
        code={`# Provavelmente você esqueceu de habilitar o NetworkManager
# Dê boot pela ISO, monte e entre no chroot:
mount /dev/sda3 /mnt
arch-chroot /mnt

# Se não instalou o NetworkManager:
pacman -S networkmanager

# Habilitar:
systemctl enable NetworkManager

exit
umount -R /mnt
reboot`}
      />

      <h3>Problema: Teclado com layout errado após instalar</h3>
      <CodeBlock
        title="Corrigir layout do teclado"
        code={`# Verificar configuração atual
localectl

# Definir layout ABNT2 permanentemente
sudo localectl set-keymap br-abnt2

# Para X11/Wayland:
sudo localectl set-x11-keymap br abnt2`}
      />
    </PageContainer>
  );
}
