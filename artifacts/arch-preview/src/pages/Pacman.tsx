import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Pacman() {
  return (
    <PageContainer
      title="Pacman: O Gerenciador de Pacotes"
      subtitle="O coração do Arch Linux. Cada operação demonstrada com a saída real do terminal — mirrors, resolução de dependências, hooks e tudo o que aparece quando você roda o comando."
      difficulty="iniciante"
      timeToRead="25 min"
      category="Pacotes"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch Linux instalado, <code>sudo</code>. Conexão à internet para sincronizar repos.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>pacman</strong> — package manager — gerenciador oficial do Arch. Comando único <code>pacman</code>.
      </p>
      <p>
        <strong>Repositório</strong> — core, extra, multilib são os oficiais. <code>/etc/pacman.conf</code> habilita/desabilita.
      </p>
      <p>
        <strong>Mirror</strong> — espelho de download. Ordem em <code>/etc/pacman.d/mirrorlist</code>. Otimize com <code>reflector</code>.
      </p>
      <p>
        <strong>Sync vs Update</strong> — <code>-Sy</code> só sincroniza db, <code>-Syu</code> atualiza tudo. <strong>Nunca rode -Sy sozinho!</strong>
      </p>
      <p>
        <strong>.pkg.tar.zst</strong> — formato dos pacotes do Arch — tar comprimido com zstd.
      </p>

      <p>
        O <code>pacman</code> combina um formato simples de pacotes binários (<code>.pkg.tar.zst</code>)
        com um sistema de construção fácil de usar. Ele resolve dependências, executa hooks, valida
        assinaturas e mantém o sistema rolling-release sempre coerente. As <strong>operações</strong> são
        identificadas pela primeira letra: <code>-S</code> sync, <code>-Q</code> query, <code>-R</code> remove,
        <code>-U</code> upgrade local, <code>-F</code> files, <code>-D</code> database.
      </p>

      <h2>Anatomia de uma operação pacman</h2>
      <p>
        Antes de qualquer coisa, veja o que acontece quando você roda o comando mais comum do Arch.
        Cada bloco abaixo mostra o comando e <strong>exatamente</strong> o que aparece no terminal.
      </p>

      <h3>1. <code>pacman -Syu</code> — atualizar todo o sistema</h3>

      <TerminalBlock
        comment="A regra de ouro do Arch: SEMPRE atualize tudo junto, nunca pacotes parciais."
        command="sudo pacman -Syu"
        output={`{c}:: Synchronizing package databases...{/}
 core.db                          165.4 KiB   1284 KiB/s 00:00 [{g}######################{/}] 100%
 extra.db                          11.2 MiB   8.92 MiB/s 00:01 [{g}######################{/}] 100%
 multilib.db                      178.0 KiB   2.05 MiB/s 00:00 [{g}######################{/}] 100%
{c}:: Starting full system upgrade...{/}
{c}:: Replacing python-pyqt5 with extra/python-pyqt5-sip?{/} [Y/n]
resolving dependencies...
looking for conflicting packages...

Packages (12) glibc-2.39-2  linux-6.8.1.arch1-1  linux-firmware-20240318-1
              linux-headers-6.8.1.arch1-1  mesa-24.0.3-1  nvidia-550.67-2
              nvidia-utils-550.67-2  python-3.12.2-1  qt6-base-6.6.2-1
              systemd-255.4-1  systemd-libs-255.4-1  vulkan-icd-loader-1.3.281-1

Total Download Size:    412.78 MiB
Total Installed Size:  1623.45 MiB
Net Upgrade Size:        18.92 MiB

{c}:: Proceed with installation?{/} [Y/n] y
{c}:: Retrieving packages...{/}
 linux-6.8.1.arch1-1-x86_64       128.4 MiB  9.21 MiB/s 00:14 [{g}######################{/}] 100%
 nvidia-550.67-2-x86_64            68.2 MiB  8.04 MiB/s 00:08 [{g}######################{/}] 100%
 ...
{c}(12/12) checking keys in keyring                              {/}[{g}######################{/}] 100%
{c}(12/12) checking package integrity                            {/}[{g}######################{/}] 100%
{c}(12/12) loading package files                                 {/}[{g}######################{/}] 100%
{c}(12/12) checking for file conflicts                           {/}[{g}######################{/}] 100%
{c}(12/12) checking available disk space                         {/}[{g}######################{/}] 100%
{c}:: Processing package changes...{/}
{c}( 1/12) upgrading glibc                                       {/}[{g}######################{/}] 100%
{y}>>> Generating locales...{/}
{c}( 2/12) upgrading linux                                       {/}[{g}######################{/}] 100%
{y}>>> Updating module dependencies. Please wait ...{/}
{y}>>> Generating initcpio for linux...{/}
{c}:: Running post-transaction hooks...{/}
{c}( 1/9) Reloading system manager configuration...{/}
{c}( 2/9) Updating module dependencies...{/}
{c}( 3/9) Updating linux initcpios...{/}
{c}( 4/9) Arming ConditionNeedsUpdate...{/}
{c}( 5/9) Updating the desktop file MIME type cache...{/}
{c}( 6/9) Updating icon theme caches...{/}
{c}( 7/9) Updating the info directory file...{/}
{c}( 8/9) Refreshing PackageKit...{/}
{c}( 9/9) Rebuilding certificate stores...{/}
{g}:: Transaction completed successfully{/}`}
      />

      <OutputBlock
        title="O que cada parte significa"
        output={`Synchronizing package databases     core.db / extra.db / multilib.db
Starting full system upgrade        compara local vs remoto
Packages (12)                       lista plana de tudo que vai mudar
Total Download Size                 quanto vai baixar (cache miss)
Net Upgrade Size                    +/- de espaço em disco
checking keys in keyring            valida assinatura GPG
checking package integrity          confere SHA-256 do .pkg.tar.zst
Processing package changes          fase de install/upgrade real
Running post-transaction hooks      hooks de /usr/share/libalpm/hooks/`}
        annotations={[
          { line: 0, note: "vem dos mirrors em /etc/pacman.d/mirrorlist" },
          { line: 5, note: "qualquer falha aqui = pacman-key --refresh-keys" },
          { line: 7, note: "chamados pelos pacotes (mkinitcpio, glib2…)" },
        ]}
      />

      <AlertBox type="danger" title="Nunca rode pacman -Sy <pacote> sozinho">
        <code>-Sy</code> só atualiza o banco de dados local. Se você instalar um pacote logo depois sem
        atualizar o resto do sistema (<code>-Syu</code>), você está fazendo um <em>partial upgrade</em>
        — bibliotecas como <code>glibc</code> e <code>qt6</code> ficam fora de sincronia e o sistema
        quebra. <strong>Sempre</strong> use <code>sudo pacman -Syu pacote</code>.
      </AlertBox>

      <h2>Operações de Sincronização (<code>-S</code>)</h2>

      <CommandFlagList
        command="pacman -S"
        items={[
          { flag: "-y", long: "--refresh", description: "Sincroniza o banco de dados com os mirrors. Repetido (-yy) força mesmo que esteja atualizado.", example: "sudo pacman -Sy" },
          { flag: "-u", long: "--sysupgrade", description: "Atualiza todos os pacotes desatualizados. Sempre combinado com -y.", example: "sudo pacman -Syu" },
          { flag: "-s", long: "--search", description: "Busca por palavra-chave nos repositórios remotos. Aceita regex.", example: "pacman -Ss '^firefox$'" },
          { flag: "-i", long: "--info", description: "Mostra todos os metadados de um pacote remoto.", example: "pacman -Si firefox" },
          { flag: "-w", long: "--downloadonly", description: "Baixa o pacote para o cache mas não instala.", example: "sudo pacman -Sw linux" },
          { flag: "-c", long: "--clean", description: "Remove versões antigas do cache. -cc remove tudo.", example: "sudo pacman -Sc" },
          { flag: "-g", long: "--groups", description: "Lista pacotes de um grupo (ex: base-devel, plasma).", example: "pacman -Sg base-devel" },
          { flag: "--needed", description: "Pula pacotes que já estão na versão mais recente.", example: "sudo pacman -S --needed git base-devel" },
          { flag: "--asdeps", description: "Marca o pacote como dependência (não como explicit).", example: "sudo pacman -S --asdeps libfoo" },
        ]}
      />

      <h3>Buscar pacotes — <code>pacman -Ss</code></h3>

      <TerminalBlock
        command="pacman -Ss '^neovim$'"
        output={`{m}extra/neovim{/} {g}0.9.5-3{/}
    Fork of Vim aiming to improve user experience, plugins, and GUIs
{m}extra/neovim-qt{/} {g}0.2.18-2{/}
    Neovim client library and Qt GUI`}
      />

      <OutputBlock
        title="Decifrando a saída"
        output={`extra/neovim 0.9.5-3
└─repo └─pkg └─version-pkgrel
    Fork of Vim aiming to improve user experience...
    └─ pkgdesc do PKGBUILD`}
        caption="Cor magenta = nome qualificado, verde = versão. Se aparecer [installed] em amarelo no final, o pacote já está instalado."
      />

      <h3>Informações detalhadas — <code>pacman -Si</code></h3>

      <TerminalBlock
        command="pacman -Si firefox"
        output={`Repository      : extra
Name            : firefox
Version         : 124.0.1-1
Description     : Standalone web browser from mozilla.org
Architecture    : x86_64
URL             : https://www.mozilla.org/firefox/
Licenses        : MPL2
Groups          : None
Provides        : None
Depends On      : gtk3  libxt  mime-types  dbus-glib  ffmpeg  nss  ttf-font
                  libpulse
Optional Deps   : networkmanager: Location detection via available WiFi networks
                  libnotify: Notification integration
                  pulseaudio: Audio support
                  speech-dispatcher: Text-to-Speech
                  hunspell-en_US: Spell checking
Conflicts With  : firefox-beta  firefox-developer-edition  firefox-nightly
Replaces        : None
Download Size   : 65.42 MiB
Installed Size  : 232.18 MiB
Packager        : Jan Alexander Steffens (heftig) <heftig@archlinux.org>
Build Date      : Tue 19 Mar 2024 08:14:22 PM UTC
Validated By    : MD5 Sum  SHA-256 Sum  Signature`}
      />

      <AlertBox type="info" title="Optional Deps">
        Pacotes em "Optional Deps" <strong>não</strong> são instalados automaticamente. Para ter
        notificações nativas no Firefox, instale <code>libnotify</code> manualmente.
      </AlertBox>

      <h2>Consultas Locais (<code>-Q</code>)</h2>

      <CommandFlagList
        command="pacman -Q"
        items={[
          { flag: "-i", long: "--info", description: "Info completa de um pacote já instalado (Install Reason, Backup Files, etc).", example: "pacman -Qi linux" },
          { flag: "-l", long: "--list", description: "Lista todos os arquivos que o pacote instalou.", example: "pacman -Ql bash" },
          { flag: "-o", long: "--owns", description: "Mostra a qual pacote um arquivo pertence.", example: "pacman -Qo /usr/bin/python" },
          { flag: "-s", long: "--search", description: "Busca entre os pacotes instalados.", example: "pacman -Qs firefox" },
          { flag: "-e", long: "--explicit", description: "Lista apenas pacotes instalados explicitamente (não como dep).", example: "pacman -Qe" },
          { flag: "-d", long: "--deps", description: "Lista apenas pacotes instalados como dependência.", example: "pacman -Qd" },
          { flag: "-t", long: "--unrequired", description: "Pacotes que nada depende (órfãos quando combinado com -d).", example: "pacman -Qdt" },
          { flag: "-m", long: "--foreign", description: "Pacotes não pertencentes a nenhum repo (geralmente AUR).", example: "pacman -Qm" },
          { flag: "-n", long: "--native", description: "O oposto de -m: apenas pacotes dos repos oficiais.", example: "pacman -Qn" },
          { flag: "-k", long: "--check", description: "Verifica se todos os arquivos do pacote ainda existem.", example: "pacman -Qkk linux" },
        ]}
      />

      <h3>Quem é o dono desse arquivo? — <code>pacman -Qo</code></h3>

      <TerminalBlock
        command="pacman -Qo /usr/bin/python"
        output={`/usr/bin/python is owned by {m}python{/} {g}3.12.2-1{/}`}
      />

      <TerminalBlock
        command="pacman -Qo /etc/pacman.conf"
        output={`/etc/pacman.conf is owned by {m}pacman{/} {g}6.1.0-2{/}`}
      />

      <h3>Listar arquivos — <code>pacman -Ql</code></h3>

      <TerminalBlock
        command="pacman -Ql bash | head -10"
        output={`bash /etc/
bash /etc/bash.bash_logout
bash /etc/bash.bashrc
bash /etc/skel/
bash /etc/skel/.bash_logout
bash /etc/skel/.bash_profile
bash /etc/skel/.bashrc
bash /usr/
bash /usr/bin/
bash /usr/bin/bash`}
      />

      <h3>Pacote ↔ Info detalhada — <code>pacman -Qi</code></h3>

      <TerminalBlock
        command="pacman -Qi linux"
        output={`Name            : linux
Version         : 6.8.1.arch1-1
Description     : The Linux kernel and modules
Architecture    : x86_64
URL             : https://github.com/archlinux/linux
Licenses        : GPL2
Groups          : None
Provides        : KSMBD-MODULE  VIRTUALBOX-GUEST-MODULES  WIREGUARD-MODULE
Depends On      : coreutils  kmod  initramfs
Optional Deps   : wireless-regdb: to set the correct wireless channels [installed]
                  linux-firmware: firmware images needed for some devices [installed]
Required By     : nvidia
Optional For    : None
Conflicts With  : None
Replaces        : None
Installed Size  : 138.92 MiB
Packager        : Jan Alexander Steffens (heftig) <heftig@archlinux.org>
Build Date      : Mon 18 Mar 2024 11:09:33 AM UTC
Install Date    : Wed 20 Mar 2024 02:18:47 AM UTC
Install Reason  : {y}Explicitly installed{/}
Install Script  : Yes
Validated By    : Signature`}
      />

      <OutputBlock
        title="Campos exclusivos de -Qi (não aparecem em -Si)"
        output={`Required By     pacotes que dependem deste
Install Date    quando você instalou
Install Reason  Explicitly installed | Installed as a dependency
Install Script  rodou .INSTALL após instalar?`}
      />

      <h3>Encontrar e remover órfãos</h3>

      <TerminalBlock
        comment="Pacotes instalados como dependência mas que ninguém mais precisa."
        command="pacman -Qdt"
        output={`{m}gst-plugins-bad-libs{/} {g}1.22.10-1{/}
{m}libdvdnav{/} {g}6.1.1-3{/}
{m}libdvdread{/} {g}6.1.3-3{/}
{m}python-pycairo{/} {g}1.26.0-1{/}`}
      />

      <TerminalBlock
        command="sudo pacman -Rns $(pacman -Qdtq)"
        output={`checking dependencies...

Packages (4) gst-plugins-bad-libs-1.22.10-1  libdvdnav-6.1.1-3
             libdvdread-6.1.3-3  python-pycairo-1.26.0-1

Total Removed Size:  18.42 MiB

{c}:: Do you want to remove these packages?{/} [Y/n] y
{c}(4/4) removing python-pycairo                   {/}[{g}#######################{/}] 100%
{c}(3/4) removing libdvdnav                        {/}[{g}#######################{/}] 100%
{c}(2/4) removing libdvdread                       {/}[{g}#######################{/}] 100%
{c}(1/4) removing gst-plugins-bad-libs             {/}[{g}#######################{/}] 100%
{c}:: Running post-transaction hooks...{/}
{c}(1/2) Arming ConditionNeedsUpdate...{/}
{c}(2/2) Updating icon theme caches...{/}`}
      />

      <h2>Remoção (<code>-R</code>)</h2>

      <CommandFlagList
        command="pacman -R"
        items={[
          { flag: "-s", long: "--recursive", description: "Remove dependências que se tornaram órfãs.", example: "sudo pacman -Rs vim" },
          { flag: "-n", long: "--nosave", description: "Remove arquivos de configuração (.pacsave).", example: "sudo pacman -Rn nginx" },
          { flag: "-c", long: "--cascade", description: "Remove TUDO que depende deste pacote (cuidado!).", example: "sudo pacman -Rc gtk3" },
          { flag: "-u", long: "--unneeded", description: "Não remove se algo ainda depende.", example: "sudo pacman -Ru pacote" },
          { flag: "-d", long: "--nodeps", description: "Pula a verificação de dependências (perigoso).", example: "sudo pacman -Rdd glibc" },
        ]}
      />

      <TerminalBlock
        command="sudo pacman -Rns firefox"
        output={`checking dependencies...

Packages (8) ffmpeg-2:6.1.1-1  hunspell-en_US-2020.12.07-3  libpulse-17.0-1
             libxt-1.3.0-1  mailcap-2.1.54-2  mime-types-9-1  nss-3.99-1
             firefox-124.0.1-1

Total Removed Size:  263.71 MiB

{c}:: Do you want to remove these packages?{/} [Y/n]`}
      />

      <h2>Instalação local (<code>-U</code>)</h2>

      <TerminalBlock
        comment="Para instalar um pacote .pkg.tar.zst do disco (ex: gerado por makepkg)."
        command="sudo pacman -U meu-pacote-1.0.0-1-x86_64.pkg.tar.zst"
        output={`loading packages...
resolving dependencies...
looking for conflicting packages...

Packages (1) meu-pacote-1.0.0-1

Total Installed Size:  2.45 MiB

{c}:: Proceed with installation?{/} [Y/n] y
{c}(1/1) checking keys in keyring                  {/}[{g}#######################{/}] 100%
{c}(1/1) checking package integrity                {/}[{g}#######################{/}] 100%
{c}(1/1) loading package files                     {/}[{g}#######################{/}] 100%
{c}(1/1) checking for file conflicts               {/}[{g}#######################{/}] 100%
{c}(1/1) installing meu-pacote                     {/}[{g}#######################{/}] 100%`}
      />

      <h2>Banco de arquivos (<code>-F</code>)</h2>

      <TerminalBlock
        comment="-F descobre qual pacote oferece um arquivo, mesmo se você ainda não o instalou."
        command="sudo pacman -Fy"
        output={`{c}:: Synchronizing package databases...{/}
 core.files                       1234.5 KiB   3.21 MiB/s 00:00 [{g}######################{/}] 100%
 extra.files                       89.45 MiB   8.92 MiB/s 00:10 [{g}######################{/}] 100%
 multilib.files                   1023.4 KiB   4.05 MiB/s 00:00 [{g}######################{/}] 100%`}
      />

      <TerminalBlock
        command="pacman -F ifconfig"
        output={`{m}extra/net-tools{/} 2.10-2 [installed]
    usr/bin/ifconfig`}
      />

      <TerminalBlock
        command="pacman -Fl iproute2 | head -5"
        output={`iproute2 etc/
iproute2 etc/iproute2/
iproute2 etc/iproute2/bpf_pinning
iproute2 etc/iproute2/ematch_map
iproute2 etc/iproute2/group`}
      />

      <h2>Limpeza de cache (<code>-Sc</code>)</h2>

      <TerminalBlock
        command="sudo pacman -Sc"
        output={`{c}Cache directory: /var/cache/pacman/pkg/{/}
{y}:: Do you want to remove all other packages from cache?{/} [Y/n] y
{c}removing old packages from cache...{/}

{c}Database directory: /var/lib/pacman/{/}
{y}:: Do you want to remove unused repositories?{/} [Y/n] y
removing unused sync repositories...
{g}finished: 412 packages cleaned, 1.89 GiB disk space freed{/}`}
      />

      <AlertBox type="warning" title="-Sc vs -Scc">
        <code>-Sc</code> mantém as versões instaladas no cache (útil para downgrade). <code>-Scc</code>
        apaga <strong>tudo</strong>. Se sua internet é boa, faça <code>-Sc</code> de vez em quando.
      </AlertBox>

      <h2>Conflito real: o que aparece quando dá ruim</h2>

      <TerminalBlock
        command="sudo pacman -S iputils"
        exitCode={1}
        output={`resolving dependencies...
looking for conflicting packages...
{r}:: iputils and iputils-arping are in conflict. Remove iputils-arping? [y/N]{/} y

Packages (2) iputils-arping-3:20221126-1 [removal]  iputils-20221126-1

Total Installed Size:  0.62 MiB
Net Upgrade Size:      0.04 MiB

{c}:: Proceed with installation?{/} [Y/n] y
{r}error: failed to commit transaction (conflicting files){/}
{r}iputils: /usr/bin/ping exists in filesystem (owned by inetutils){/}
{y}Errors occurred, no packages were upgraded.{/}`}
      />

      <OutputBlock
        title="Como ler esse erro"
        output={`error: failed to commit transaction (conflicting files)
iputils: /usr/bin/ping exists in filesystem (owned by inetutils)
                                              └─ outro pacote já dono do mesmo arquivo`}
        caption="Resolução: descobrir o dono (pacman -Qo /usr/bin/ping) e decidir qual remover."
      />

      <h2>Hooks: o que são essas linhas após o upgrade</h2>

      <TerminalBlock
        command="ls /usr/share/libalpm/hooks/ | head -10"
        output={`30-systemd-binfmt.hook
30-systemd-catalog.hook
30-systemd-daemon-reload-system.hook
30-systemd-hwdb.hook
30-systemd-sysctl.hook
30-systemd-sysusers.hook
30-systemd-tmpfiles.hook
30-systemd-udev-reload.hook
30-systemd-update.hook
60-mkinitcpio-remove.hook
70-mkinitcpio-install.hook`}
      />

      <p>
        Hooks são definidos em <code>/usr/share/libalpm/hooks/</code> (oficiais) e
        <code> /etc/pacman.d/hooks/</code> (seus). Cada um declara <code>When</code>,
        <code> Operation</code> e <code>Exec</code>.
      </p>

      <CodeBlock
        title="Exemplo de hook personalizado: /etc/pacman.d/hooks/mirror-update.hook"
        language="ini"
        code={`[Trigger]
Operation = Upgrade
Type = Package
Target = pacman-mirrorlist

[Action]
Description = Updating pacman-mirrorlist with reflector...
When = PostTransaction
Depends = reflector
Exec = /usr/bin/reflector --country Brazil --latest 20 --sort rate --save /etc/pacman.d/mirrorlist`}
      />

      <h2>/etc/pacman.conf — opções essenciais</h2>

      <CodeBlock
        title="/etc/pacman.conf (recortes recomendados)"
        language="ini"
        code={`[options]
HoldPkg     = pacman glibc
Architecture = auto

# Visual
Color
ILoveCandy
VerbosePkgLists

# Performance
ParallelDownloads = 5

# Segurança
CheckSpace
SigLevel    = Required DatabaseOptional
LocalFileSigLevel = Optional

[core]
Include = /etc/pacman.d/mirrorlist

[extra]
Include = /etc/pacman.d/mirrorlist

[multilib]
Include = /etc/pacman.d/mirrorlist`}
      />

      <TerminalBlock
        comment="Depois de habilitar [multilib], rode -Sy para baixar o novo db."
        command="sudo pacman -Sy"
        output={`{c}:: Synchronizing package databases...{/}
 core            is up to date
 extra           is up to date
 multilib.db                      178.0 KiB   2.05 MiB/s 00:00 [{g}######################{/}] 100%`}
      />

      <h2>Mirrors — onde os pacotes vêm</h2>

      <TerminalBlock
        command="cat /etc/pacman.d/mirrorlist | head -8"
        output={`##
## Arch Linux repository mirrorlist
## Generated on 2024-03-20
##

Server = https://br.mirror.archlinux-br.org/$repo/os/$arch
Server = https://archlinux.c3sl.ufpr.br/$repo/os/$arch
Server = https://mirror.ufscar.br/archlinux/$repo/os/$arch`}
      />

      <TerminalBlock
        comment="Reflector reescreve sua mirrorlist com os mais rápidos."
        command="sudo reflector --country Brazil --latest 10 --protocol https --sort rate --save /etc/pacman.d/mirrorlist"
        output={`[2024-03-20 14:22:03] INFO: rating 10 mirror(s) by download rate
[2024-03-20 14:22:08] INFO: Server = https://br.mirror.archlinux-br.org/$repo/os/$arch
[2024-03-20 14:22:12] INFO: Server = https://archlinux.c3sl.ufpr.br/$repo/os/$arch
[2024-03-20 14:22:14] INFO: Server = https://mirror.ufscar.br/archlinux/$repo/os/$arch
[2024-03-20 14:22:16] INFO: Saved 10 mirrors to /etc/pacman.d/mirrorlist`}
      />

      <h2>pacman.log — histórico do sistema</h2>

      <TerminalBlock
        command="tail -8 /var/log/pacman.log"
        output={`[2024-03-20T02:18:47-0300] [ALPM] upgraded linux (6.7.9.arch1-1 -> 6.8.1.arch1-1)
[2024-03-20T02:18:48-0300] [ALPM] upgraded linux-headers (6.7.9.arch1-1 -> 6.8.1.arch1-1)
[2024-03-20T02:18:49-0300] [ALPM] upgraded mesa (24.0.2-1 -> 24.0.3-1)
[2024-03-20T02:18:50-0300] [ALPM] upgraded nvidia (550.54.14-3 -> 550.67-2)
[2024-03-20T02:18:55-0300] [ALPM-SCRIPTLET] >>> Updating module dependencies. Please wait ...
[2024-03-20T02:19:02-0300] [ALPM-SCRIPTLET] >>> Generating initcpio for linux...
[2024-03-20T02:19:18-0300] [ALPM] running '90-mkinitcpio-install.hook'...
[2024-03-20T02:19:18-0300] [ALPM] transaction completed`}
      />

      <AlertBox type="success" title="Resumo dos comandos do dia a dia">
        <ul>
          <li><code>sudo pacman -Syu</code> — atualizar tudo</li>
          <li><code>sudo pacman -S --needed pacote</code> — instalar</li>
          <li><code>sudo pacman -Rns pacote</code> — remover limpo</li>
          <li><code>pacman -Qe</code> — listar pacotes que VOCÊ instalou</li>
          <li><code>pacman -Qo /caminho</code> — quem é o dono?</li>
          <li><code>pacman -F arquivo</code> — qual pacote oferece esse arquivo?</li>
          <li><code>sudo pacman -Sc</code> — limpar cache antigo</li>
        </ul>
      </AlertBox>
    </PageContainer>
  );
}
