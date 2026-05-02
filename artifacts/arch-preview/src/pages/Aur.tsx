import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Aur() {
  return (
    <PageContainer
      title="AUR — Arch User Repository"
      subtitle="Aprenda a clonar PKGBUILDs, rodar makepkg, dominar yay e paru — tudo demonstrado com a saída real do terminal."
      difficulty="intermediario"
      timeToRead="25 min"
      category="Pacotes"
    >
      <h2>O que é o AUR?</h2>
      <p>
        O AUR (<strong>Arch User Repository</strong>) é um repositório mantido pela comunidade que
        contém <strong>PKGBUILDs</strong> — receitas que descrevem como compilar e empacotar software
        que não está nos repositórios oficiais. Hoje são mais de <strong>90.000 pacotes</strong>,
        comparado aos ~13.000 dos repos oficiais.
      </p>

      <AlertBox type="danger" title="O AUR NÃO é oficialmente suportado">
        Pacotes do AUR são mantidos por usuários, não pela equipe do Arch. Qualquer um pode submeter.
        <strong> Sempre leia o PKGBUILD</strong> antes de instalar — é apenas um shell script.
      </AlertBox>

      <h2>Pré-requisitos: base-devel</h2>

      <TerminalBlock
        command="sudo pacman -S --needed base-devel git"
        output={`warning: autoconf-2.72-1 is up to date -- skipping
warning: bison-3.8.2-7 is up to date -- skipping
warning: fakeroot-1.33-1 is up to date -- skipping
warning: gcc-13.2.1-6 is up to date -- skipping
warning: git-2.44.0-1 is up to date -- skipping
warning: make-4.4.1-2 is up to date -- skipping
warning: pkgconf-2.1.1-1 is up to date -- skipping
 there is nothing to do`}
      />

      <h2>Instalação manual: o fluxo completo</h2>

      <p>O fluxo padrão para instalar qualquer pacote do AUR sem helper é:</p>

      <TerminalBlock
        comment="Passo 1: clonar o repositório git do AUR (apenas a receita, NÃO o código)."
        command="git clone https://aur.archlinux.org/yay.git"
        output={`Cloning into 'yay'...
remote: Enumerating objects: 12, done.
remote: Counting objects: 100% (12/12), done.
remote: Compressing objects: 100% (10/10), done.
remote: Total 12 (delta 1), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (12/12), 4.85 KiB | 4.85 MiB/s, done.
Resolving deltas: 100% (1/1), done.`}
      />

      <TerminalBlock
        command="cd yay && ls -la"
        output={`total 32
drwxr-xr-x  3 user user 4096 Mar 20 14:28 .
drwxr-xr-x 12 user user 4096 Mar 20 14:28 ..
drwxr-xr-x  8 user user 4096 Mar 20 14:28 .git
-rw-r--r--  1 user user  337 Mar 20 14:28 .gitignore
-rw-r--r--  1 user user 1284 Mar 20 14:28 .SRCINFO
-rw-r--r--  1 user user 1024 Mar 20 14:28 PKGBUILD`}
      />

      <TerminalBlock
        comment="Passo 2: SEMPRE leia o PKGBUILD antes de compilar."
        command="cat PKGBUILD"
        output={`# Maintainer: morganamilo <morganamilo@archlinux.org>
# Maintainer: Jguer <joaogg3@gmail.com>
pkgname=yay
pkgver=12.3.5
pkgrel=1
pkgdesc='Yet another yogurt. Pacman wrapper and AUR helper written in go.'
arch=('x86_64' 'i686' 'armv7h' 'aarch64')
url="https://github.com/Jguer/yay"
license=('GPL3')
depends=('pacman>6' 'git')
makedepends=('go')
optdepends=('sudo: privilege elevation')
source=("\${pkgname}-\${pkgver}.tar.gz::https://github.com/Jguer/yay/archive/v\${pkgver}.tar.gz")
sha256sums=('aa3e21f9a89e2f9a9d8f7c...')

build() {
  cd "\${pkgname}-\${pkgver}"
  make VERSION=\${pkgver} DESTDIR="\${pkgdir}" PREFIX=/usr
}

package() {
  cd "\${pkgname}-\${pkgver}"
  make VERSION=\${pkgver} DESTDIR="\${pkgdir}" PREFIX=/usr install
}`}
      />

      <TerminalBlock
        comment="Passo 3: makepkg compila e empacota. -s instala makedeps, -i instala o pacote final."
        command="makepkg -si"
        output={`==> Making package: yay 12.3.5-1 (Wed 20 Mar 2024 02:32:08 PM -03)
==> Checking runtime dependencies...
==> Checking buildtime dependencies...
==> Installing missing dependencies...
[sudo] password for user:
resolving dependencies...
looking for conflicting packages...

Packages (1) go-2:1.22.1-1

Total Download Size:   62.08 MiB
Total Installed Size:  223.45 MiB

{c}:: Proceed with installation?{/} [Y/n] y
 go-2:1.22.1-1-x86_64        62.0 MiB  9.42 MiB/s 00:07 [{g}################{/}] 100%
{g}(1/1) installing go{/}
==> Retrieving sources...
  -> Downloading yay-12.3.5.tar.gz...
==> Validating source files with sha256sums...
    yay-12.3.5.tar.gz ... {g}Passed{/}
==> Extracting sources...
  -> Extracting yay-12.3.5.tar.gz with bsdtar
==> Starting build()...
go build -trimpath -mod=readonly -modcacherw \\
    -ldflags "-X main.version=12.3.5" -o yay
==> Entering fakeroot environment...
==> Starting package()...
==> Tidying install...
  -> Removing libtool files...
  -> Purging unwanted files...
  -> Removing static library files...
  -> Stripping unneeded symbols from binaries and libraries...
  -> Compressing man and info pages...
==> Checking for packaging issues...
==> Creating package "yay"...
  -> Generating .PKGINFO file...
  -> Generating .BUILDINFO file...
  -> Generating .MTREE file...
  -> Compressing package...
==> Leaving fakeroot environment.
{g}==> Finished making: yay 12.3.5-1 (Wed 20 Mar 2024 02:33:21 PM -03){/}
==> Installing package yay with pacman -U...
loading packages...
resolving dependencies...
looking for conflicting packages...

Packages (1) yay-12.3.5-1

Total Installed Size:  9.42 MiB

{c}:: Proceed with installation?{/} [Y/n] y
{g}(1/1) installing yay{/}
{c}:: Running post-transaction hooks...{/}
{c}(1/2) Reloading system manager configuration...{/}
{c}(2/2) Arming ConditionNeedsUpdate...{/}`}
      />

      <OutputBlock
        title="Fases do makepkg"
        output={`Checking dependencies         depends + makedepends do PKGBUILD
Installing missing deps       chama sudo pacman -S
Retrieving sources            baixa source=()
Validating sha256sums         compara checksums
Extracting sources            descompacta tudo em src/
Starting build()              função build() do PKGBUILD
fakeroot environment          simula root sem ser root
Starting package()            move arquivos para pkg/
Creating package              cria yay-12.3.5-1.pkg.tar.zst
Installing with pacman -U     instala localmente`}
        annotations={[
          { line: 4, note: "PKGBUILD diz a fonte" },
          { line: 5, note: "checksum NÃO casou? Pare!" },
          { line: 8, note: "fakeroot impede que você quebre seu sistema" },
        ]}
      />

      <h2>makepkg — referência de flags</h2>

      <CommandFlagList
        command="makepkg"
        items={[
          { flag: "-s", long: "--syncdeps", description: "Instala dependências ausentes via pacman.", example: "makepkg -s" },
          { flag: "-i", long: "--install", description: "Roda pacman -U após criar o pacote.", example: "makepkg -i" },
          { flag: "-c", long: "--clean", description: "Limpa src/ e pkg/ depois de compilar.", example: "makepkg -ci" },
          { flag: "-C", long: "--cleanbuild", description: "Apaga src/ ANTES de compilar (recompilação limpa).", example: "makepkg -Csi" },
          { flag: "-f", long: "--force", description: "Sobrescreve o pacote já existente no diretório.", example: "makepkg -fsi" },
          { flag: "-r", long: "--rmdeps", description: "Remove makedepends instaladas após o build.", example: "makepkg -sri" },
          { flag: "-d", long: "--nodeps", description: "Pula a checagem de deps (perigoso).", example: "makepkg -d" },
          { flag: "--nocheck", description: "Pula a função check() (testes).", example: "makepkg -si --nocheck" },
          { flag: "--skippgpcheck", description: "Pula validação PGP das fontes.", example: "makepkg -si --skippgpcheck" },
          { flag: "--printsrcinfo", description: "Imprime .SRCINFO no stdout (usado por AUR helpers).", example: "makepkg --printsrcinfo > .SRCINFO" },
        ]}
      />

      <AlertBox type="warning" title="Nunca rode makepkg como root">
        O <code>makepkg</code> se recusa a rodar como root e termina com:
        <code> error: Running makepkg as root is not allowed as it can cause permanent, catastrophic damage to your system.</code>
      </AlertBox>

      <h2>Anatomia de um PKGBUILD</h2>

      <CodeBlock
        title="PKGBUILD canônico"
        language="bash"
        code={`# Maintainer: Seu Nome <email@exemplo.com>
pkgname=meu-programa
pkgver=1.0.0
pkgrel=1
pkgdesc="Descrição curta"
arch=('x86_64')
url="https://github.com/usuario/programa"
license=('MIT')
depends=('python' 'qt5-base')
makedepends=('cmake' 'git')
checkdepends=('python-pytest')
optdepends=('libnotify: notifications')
provides=('meu-programa')
conflicts=('meu-programa-git')
source=("$pkgname-$pkgver.tar.gz::https://github.com/usuario/programa/archive/v$pkgver.tar.gz")
sha256sums=('SKIP')

prepare() {
  cd "$pkgname-$pkgver"
  patch -p1 < "$srcdir/fix-build.patch"
}

build() {
  cd "$pkgname-$pkgver"
  cmake -B build -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_BUILD_TYPE=Release
  cmake --build build
}

check() {
  cd "$pkgname-$pkgver"
  ctest --test-dir build
}

package() {
  cd "$pkgname-$pkgver"
  DESTDIR="$pkgdir" cmake --install build
}`}
      />

      <h2>yay — o helper mais usado</h2>

      <h3>Comandos básicos</h3>

      <TerminalBlock
        comment="Sintaxe é praticamente idêntica ao pacman."
        command="yay -Ss spotify"
        output={`{m}aur/spotify{/} {g}1:1.2.31.1205-1{/} (+9876 {y}45.67{/}) ({y}Installed{/})
    A proprietary music streaming service
{m}aur/spotify-launcher{/} {g}1.0.4-1{/} (+542 {y}3.21{/})
    Open source launcher for the official Spotify client (Linux)
{m}aur/spicetify-cli{/} {g}2.32.1-1{/} (+187 {y}1.45{/})
    Command-line tool to customize the official Spotify client`}
      />

      <OutputBlock
        title="Decifrando a saída do yay"
        output={`aur/spotify  1:1.2.31.1205-1  (+9876  45.67)  (Installed)
└─repo └─pkg   └─epoch:ver-rel    └─votos  └─pop    └─status local`}
        caption="Mais votos = pacote mais confiável. 'Installed' aparece se você já tem."
      />

      <TerminalBlock
        command="yay -S spotify"
        output={`{c}:: Resolving dependencies...{/}
{c}:: Calculating conflicts...{/}
{c}:: Calculating inner conflicts...{/}

Repo (1) ffmpeg-compat-59-6.0-1
Aur (1) spotify-1:1.2.31.1205-1

{c}:: PGP keys need importing:{/}
 -> 4505FA0AD737B9CE, required by: spotify
{c}:: Import?{/} [Y/n] y
gpg: key 4505FA0AD737B9CE: public key "Spotify Public Repository Signing Key" imported
gpg: Total number processed: 1
gpg:               imported: 1

{c}:: Proceed with installation?{/} [Y/n] y
{c}:: (1/1) Downloaded PKGBUILD: spotify{/}
{c}  1 spotify                          (Build Files Exist){/}
{c}==> Diffs to show?{/}
==> [N]one [A]ll [Ab]ort [I]nstalled [No]tInstalled or (1 2 3, 1-3, ^4)
==> n
{c}:: (1/1) Parsing SRCINFO: spotify{/}
==> Making package: spotify 1:1.2.31.1205-1
==> Retrieving sources...
  -> Downloading spotify-client_1.2.31.1205.gd1124d6e_amd64.deb...
==> Validating source files with sha512sums...
    spotify-client_1.2.31.1205.gd1124d6e_amd64.deb ... {g}Passed{/}
==> Extracting sources...
==> Starting package()...
{g}==> Finished making: spotify 1:1.2.31.1205-1{/}
loading packages...
Packages (1) spotify-1:1.2.31.1205-1
{c}:: Proceed with installation?{/} [Y/n] y
{g}(1/1) installing spotify{/}`}
      />

      <h3>Atualização (sistema + AUR)</h3>

      <TerminalBlock
        command="yay -Syu"
        output={`{c}:: Synchronizing package databases...{/}
 core           is up to date
 extra          is up to date
 multilib       is up to date
{c}:: Starting full system upgrade...{/}
 there is nothing to do
{c}:: Searching AUR for updates...{/}
 -> Missing AUR Packages:  brave-bin
{c}:: 3 AUR packages out of date:{/}
   spotify     1:1.2.30.1135-1 -> 1:1.2.31.1205-1
   visual-studio-code-bin  1.86.2-1 -> 1.87.0-1
   yay         12.3.4-1 -> 12.3.5-1

{c}:: Proceed with upgrade?{/} [Y/n]`}
      />

      <h3>yay — flags úteis</h3>

      <CommandFlagList
        command="yay"
        items={[
          { flag: "-S", description: "Instalar (mesma sintaxe do pacman, mas busca também no AUR).", example: "yay -S google-chrome" },
          { flag: "-Syu", description: "Atualizar sistema oficial + pacotes do AUR de uma vez." },
          { flag: "-Sua", description: "Atualizar APENAS pacotes do AUR.", example: "yay -Sua" },
          { flag: "-Ss", description: "Buscar (igual pacman -Ss, mas inclui AUR).", example: "yay -Ss obsidian" },
          { flag: "-Si", description: "Info detalhada de um pacote (oficial ou AUR).", example: "yay -Si paru" },
          { flag: "-Rns", description: "Remover (passa direto para pacman).", example: "yay -Rns spotify" },
          { flag: "-Qua", description: "Mostrar apenas pacotes do AUR que precisam atualizar.", example: "yay -Qua" },
          { flag: "-Yc", description: "Limpar deps órfãs (alias para pacman -Qdtq | rns).", example: "yay -Yc" },
          { flag: "-Ps", description: "Estatísticas do sistema (kernel, pacotes, AUR, foreign).", example: "yay -Ps" },
          { flag: "-Pw", description: "Mostrar notícias do Arch antes de atualizar.", example: "yay -Pw" },
          { flag: "--editmenu", description: "Permite editar o PKGBUILD antes de compilar.", example: "yay --editmenu -S pacote" },
          { flag: "--cleanafter", description: "Apaga sources após instalar (economiza disco).", example: "yay --cleanafter -S pacote" },
        ]}
      />

      <TerminalBlock
        command="yay -Ps"
        output={`{c}==> Yay version v12.3.5{/}
{c}==> System Info{/}
   Operating System         Arch Linux
   Kernel Release           Linux 6.8.1-arch1-1
   CPU                      AMD Ryzen 7 5800X (16) @ 3.800GHz
   RAM                      8204 MiB / 32007 MiB
{c}==> Pacman Info{/}
   Pacman Version           v6.1.0
   Total Installed Packages  1247
   Explicitly Installed      221
   AUR Installed             34
   Foreign Installed         34`}
      />

      <h3>Ler notícias do Arch antes de atualizar</h3>

      <TerminalBlock
        command="yay -Pw"
        output={`{y}2024-03-15 grub 2:2.12-1 update requires manual intervention{/}
The grub package prior to version 2:2.12-1 had an incomplete fix for
detecting other installed operating systems. As a result GRUB might not
detect Windows on dual boot setups. Re-run grub-mkconfig:
  grub-mkconfig -o /boot/grub/grub.cfg

{y}2024-02-12 The xz package has been backdoored{/}
The upstream releases of xz 5.6.0 and 5.6.1 contain malicious code...`}
      />

      <h2>paru — alternativa em Rust</h2>

      <TerminalBlock
        command="git clone https://aur.archlinux.org/paru.git && cd paru && makepkg -si"
        output={`Cloning into 'paru'...
...
==> Making package: paru 2.0.3-1
==> Retrieving sources...
==> Starting build()...
   Compiling paru v2.0.3
    Finished release [optimized] target(s) in 1m 24s
==> Creating package "paru"...
==> Installing package paru with pacman -U...
{g}(1/1) installing paru{/}`}
      />

      <p>
        Por padrão o <code>paru</code> mostra o PKGBUILD e o diff antes de instalar
        (algo que no <code>yay</code> exige <code>--editmenu</code>):
      </p>

      <TerminalBlock
        command="paru -S google-chrome"
        output={`{c}:: Resolving dependencies...{/}
{c}:: Conflicts found:{/}
   google-chrome and google-chrome-beta
{c}:: Conflicting packages will have to be confirmed manually{/}

{c}Aur ({/}1{c}){/}                Old Version  New Version  Make Only
{c}aur/google-chrome{/}        -            123.0.6312.86-1  No

{c}:: Proceed to review?{/} [Y/n] y
{c}:: Downloaded PKGBUILD (1/1): google-chrome{/}

{c}:: Diffs to show?{/}
   1 google-chrome  No diff for new package
{c}:: Proceed with install?{/} [Y/n] y
{c}:: PGP keys need importing:{/}
 -> EB4C1BFD4F042F6DDDCCEC917721F63BD38B4796, required by: google-chrome
{c}:: Import?{/} [Y/n] y
==> Making package: google-chrome 123.0.6312.86-1
==> Retrieving sources...
  -> Downloading google-chrome-stable_current_x86_64.rpm...
{g}==> Finished making: google-chrome 123.0.6312.86-1{/}
{g}(1/1) installing google-chrome{/}
{c}Optional dependencies for google-chrome{/}
    kdialog: for file dialogs in KDE
    gnome-keyring: for storing passwords in GNOME keyring
    libgnome-keyring: for storing passwords in GNOME keyring [installed]`}
      />

      <h2>Sufixos comuns no AUR</h2>

      <OutputBlock
        title="Como ler nomes de pacotes AUR"
        output={`google-chrome           compila do .rpm fornecido pelo Google (rápido)
google-chrome-bin       binário pré-empacotado (mais rápido ainda)
google-chrome-beta      canal beta
google-chrome-dev       canal dev
neovim-git              compila o último commit do master (instável!)
spotify                 baixa o .deb oficial e empacota
visual-studio-code-bin  binário oficial Microsoft
code                    repo oficial — open source, sem telemetria`}
        annotations={[
          { line: 1, note: "prefira -bin quando existir" },
          { line: 4, note: "-git: pkgver muda toda hora" },
        ]}
      />

      <h2>Quando dá erro: cenários reais</h2>

      <h3>1. Chave PGP não importada</h3>

      <TerminalBlock
        command="makepkg -si"
        exitCode={1}
        output={`==> Verifying source file signatures with gpg...
    spotify ... FAILED ({r}unknown public key 4505FA0AD737B9CE{/})
==> ERROR: One or more PGP signatures could not be verified!`}
      />

      <TerminalBlock
        comment="Solução: importar a chave manualmente."
        command="gpg --recv-keys 4505FA0AD737B9CE"
        output={`gpg: key 4505FA0AD737B9CE: public key "Spotify Public Repository Signing Key" imported
gpg: Total number processed: 1
gpg:               imported: 1`}
      />

      <h3>2. Build falha após atualização do sistema</h3>

      <TerminalBlock
        command="yay -S algum-pacote-git"
        exitCode={1}
        output={`==> Starting build()...
error[E0599]: no method named \`unwrap_or\` found for type \`Option<&str>\` in the current scope
==> ERROR: A failure occurred in build().
{r}    Aborting...{/}
error: failed to build 'algum-pacote-git-r123.abc1234-1': exit status 4
error: packages failed to build: algum-pacote-git-r123.abc1234-1`}
      />

      <AlertBox type="info" title="Como resolver builds quebrados">
        <ol>
          <li>Atualize o sistema primeiro: <code>sudo pacman -Syu</code></li>
          <li>Veja os comentários no AUR (<code>aur.archlinux.org/packages/&lt;pkg&gt;</code>)</li>
          <li>Tente <code>--nocheck</code> se forem só os testes que falham</li>
          <li>Procure pelo erro no <code>aur-general</code> mailing list</li>
        </ol>
      </AlertBox>

      <h3>3. Pacote órfão (sem mantenedor)</h3>

      <TerminalBlock
        command="yay -Si algum-pacote"
        output={`Repository      : aur
Name            : algum-pacote
Version         : 1.0.0-3
Description     : ...
Maintainer      : {r}None{/}
Last Updated    : 2021-08-12 (mais de 2 anos atrás)
Out Of Date     : {r}2023-04-15{/}
Votes           : 12
Popularity      : 0.000123`}
      />

      <p>
        <strong>Sinais de alerta:</strong> Maintainer = None, Last Updated antigo, Out Of Date marcado.
        Considere alternativas ou adote o pacote você mesmo.
      </p>

      <h2>Adicionando seu próprio pacote</h2>

      <TerminalBlock
        comment="Após criar o PKGBUILD, gere o .SRCINFO e teste."
        command="makepkg --printsrcinfo > .SRCINFO && makepkg -fcs"
        output={`==> Making package: meu-app 1.0.0-1
==> Checking runtime dependencies...
==> Checking buildtime dependencies...
==> Retrieving sources...
==> Validating source files with sha256sums...
==> Extracting sources...
==> Starting build()...
==> Tidying install...
==> Creating package "meu-app"...
{g}==> Finished making: meu-app 1.0.0-1{/}`}
      />

      <TerminalBlock
        command="git remote add aur ssh://aur@aur.archlinux.org/meu-app.git && git push aur master"
        output={`Enumerating objects: 4, done.
Counting objects: 100% (4/4), done.
Delta compression using up to 16 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (4/4), 1.42 KiB | 1.42 MiB/s, done.
Total 4 (delta 0), reused 0 (delta 0), pack-reused 0
remote: Welcome to AUR, user!
To ssh://aur@aur.archlinux.org/meu-app.git
 * [new branch]      master -> master`}
      />

      <AlertBox type="success" title="Resumo prático">
        <ul>
          <li><code>git clone https://aur.archlinux.org/&lt;pkg&gt;.git &amp;&amp; cd &lt;pkg&gt;</code></li>
          <li><code>cat PKGBUILD</code> — sempre antes de instalar</li>
          <li><code>makepkg -si</code> — compila e instala</li>
          <li><code>yay -S &lt;pkg&gt;</code> — automatiza tudo</li>
          <li><code>yay -Syu</code> — atualiza sistema + AUR juntos</li>
          <li><code>yay -Qua</code> — apenas updates AUR pendentes</li>
        </ul>
      </AlertBox>
    </PageContainer>
  );
}
