import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function CodigoFonte() {
  return (
    <PageContainer
      title="Compilando do código-fonte"
      subtitle="O fluxo clássico ./configure && make && sudo make install + introdução ao PKGBUILD/makepkg do Arch."
      difficulty="avancado"
      timeToRead="35 min"
      category="Pacotes & Build"
    >
      <p>
        Antes do <code>pacman</code>, do <code>apt</code> e dos formatos universais, instalar
        software no Linux era sempre <em>baixar tarball, compilar, instalar</em>. Saber esse
        fluxo continua útil para: rodar versões patcheadas, contribuir com upstream, criar
        seu próprio PKGBUILD para o AUR ou simplesmente entender de onde vem cada binário.
      </p>

      <AlertBox type="info" title="No Arch, prefira makepkg + PKGBUILD">
        Compilar com <code>./configure && make && sudo make install</code> instala arquivos
        que <strong>o pacman não conhece</strong> — eles ficam órfãos. Encapsule sempre num
        <code> PKGBUILD</code> e use <code>makepkg -si</code>: o resultado vira pacote
        rastreável (aparece em <code>pacman -Q</code>, sai com <code>pacman -R</code>).
      </AlertBox>

      <h2>1. Pré-requisitos: base-devel</h2>

      <TerminalBlock
        comment="grupo com gcc, make, autoconf, automake, pkg-config, patch, fakeroot etc."
        command="sudo pacman -S --needed base-devel"
        output={`:: There are 26 members in group base-devel:
:: Repository core
   1) autoconf  2) automake  3) binutils  4) bison  5) debugedit  6) fakeroot
   7) file  8) findutils  9) flex  10) gawk  11) gcc  12) gettext  13) grep
   14) groff  15) gzip  16) libtool  17) m4  18) make  19) pacman  20) patch
   21) pkgconf  22) sed  23) sudo  24) systemd  25) texinfo  26) which

Enter a selection (default=all):
:: Proceed with installation? [Y/n] y`}
      />

      <TerminalBlock
        command="gcc --version | head -1"
        output={`gcc (GCC) 14.2.1 20240910`}
      />

      <h2>2. O fluxo clássico: ./configure && make && make install</h2>

      <h3>Passo 1: baixar e desempacotar</h3>

      <TerminalBlock
        command={`curl -LO https://github.com/exemplo/projeto/archive/refs/tags/v1.4.0.tar.gz`}
        output={`  % Total    % Received % Xferd  Average Speed
100  842k  100  842k    0     0  4842k      0 --:--:-- --:--:-- --:--:-- 4842k`}
      />

      <TerminalBlock
        command="tar xf v1.4.0.tar.gz && cd projeto-1.4.0"
        output=""
      />

      <h3>Passo 2: ler README/INSTALL</h3>

      <TerminalBlock
        command="ls"
        output={`AUTHORS  ChangeLog  configure.ac  INSTALL  LICENSE  Makefile.am
NEWS     README     src         tests       docs    autogen.sh`}
      />

      <TerminalBlock
        command="head -40 README"
        output={`projeto - utilitário de exemplo
================================

Build dependencies:
  - gcc >= 9.0 ou clang >= 11
  - autoconf >= 2.69
  - libssl-dev (no Arch: openssl)
  - zlib (no Arch: zlib)

Quick install:
    ./autogen.sh        # (só se você baixou do git)
    ./configure --prefix=/usr/local
    make -j$(nproc)
    sudo make install`}
      />

      <h3>Passo 3: ./configure</h3>

      <p>
        O <code>configure</code> é um script gerado por <code>autoconf</code> que detecta seu
        sistema (compiler, libs, headers) e gera o <code>Makefile</code>. Aceita flags como{" "}
        <code>--prefix</code> (onde instalar), <code>--enable-X</code>/<code>--disable-X</code>,{" "}
        <code>--with-Y</code>/<code>--without-Y</code>:
      </p>

      <TerminalBlock
        command="./configure --prefix=/usr/local --enable-debug=no"
        output={`checking for a BSD-compatible install... /usr/bin/install -c
checking whether build environment is sane... yes
checking for a thread-safe mkdir -p... /usr/bin/mkdir -p
checking for gawk... gawk
checking whether make sets $(MAKE)... yes
checking for gcc... gcc
checking whether the C compiler works... yes
checking for C compiler default output file name... a.out
checking for suffix of executables...
checking whether we are cross compiling... no
checking for suffix of object files... o
checking whether we are using the GNU C compiler... yes
checking whether gcc accepts -g... yes
checking for gcc option to accept ISO C89... none needed
checking dependency style of gcc... gcc3
checking for openssl >= 1.1.0... yes
checking for zlib... yes
configure: creating ./config.status
config.status: creating Makefile
config.status: creating src/Makefile
config.status: creating tests/Makefile
config.status: executing depfiles commands

projeto 1.4.0 configured for x86_64-pc-linux-gnu
  prefix:        /usr/local
  CC:            gcc
  CFLAGS:        -O2 -g -Wall
  openssl:       yes
  zlib:          yes
  debug:         no`}
      />

      <CommandFlagList
        command="./configure"
        items={[
          { flag: "--prefix=DIR", description: "Onde instalar. Padrão /usr/local. Pacotes da distro usam /usr." },
          { flag: "--bindir / --libdir / --sysconfdir", description: "Override de subpaths individuais." },
          { flag: "--enable-X / --disable-X", description: "Liga/desliga features compiladas." },
          { flag: "--with-Y / --without-Y", description: "Liga/desliga dependências externas." },
          { flag: "--help", description: "Lista TODAS as opções específicas do projeto." },
          { flag: "CC=clang CFLAGS=...", description: "Variáveis de ambiente passadas ao compilador.", example: "CFLAGS='-O3 -march=native' ./configure" },
        ]}
      />

      <h3>Passo 4: make</h3>

      <TerminalBlock
        comment="-j N = N threads paralelas; $(nproc) usa todos os cores"
        command="make -j$(nproc)"
        output={`make  all-recursive
make[1]: Entering directory '/home/user/projeto-1.4.0'
Making all in src
make[2]: Entering directory '/home/user/projeto-1.4.0/src'
  CC       main.o
  CC       util.o
  CC       net.o
  CCLD     projeto
make[2]: Leaving directory '/home/user/projeto-1.4.0/src'
Making all in tests
make[2]: Nothing to be done for 'all'.
make[2]: Leaving directory '/home/user/projeto-1.4.0/tests'
make[1]: Leaving directory '/home/user/projeto-1.4.0'`}
      />

      <h3>Passo 5: make install</h3>

      <TerminalBlock
        command="sudo make install"
        output={`Making install in src
make[1]: Entering directory '/home/user/projeto-1.4.0/src'
 /usr/bin/mkdir -p '/usr/local/bin'
  /usr/bin/install -c projeto '/usr/local/bin'
 /usr/bin/mkdir -p '/usr/local/share/man/man1'
 /usr/bin/install -c -m 644 projeto.1 '/usr/local/share/man/man1'
make[1]: Leaving directory '/home/user/projeto-1.4.0/src'`}
      />

      <TerminalBlock
        command="which projeto && projeto --version"
        output={`/usr/local/bin/projeto
projeto 1.4.0`}
      />

      <h3>Desinstalando o que make install copiou</h3>

      <TerminalBlock
        comment="se o Makefile suporta:"
        command="sudo make uninstall"
        output={`( cd '/usr/local/bin' && rm -f projeto )
( cd '/usr/local/share/man/man1' && rm -f projeto.1 )`}
      />

      <AlertBox type="warning" title="Sem 'make uninstall' você fica órfão">
        Muitos projetos pequenos não implementam <code>uninstall</code>. Por isso{" "}
        <strong>nunca</strong> rode <code>sudo make install</code> sem antes registrar o que
        vai ser instalado. A ferramenta <code>checkinstall</code> (no AUR) intercepta as
        instalações e gera um pacote <code>.deb</code>/<code>.rpm</code>, mas no Arch o
        idiomático é PKGBUILD.
      </AlertBox>

      <h2>3. CMake — alternativa moderna a autotools</h2>

      <p>
        Muitos projetos C++ atuais usam CMake em vez de autotools. O fluxo equivalente:
      </p>

      <TerminalBlock
        command="sudo pacman -S --needed cmake ninja"
        output={`Packages (2)  cmake-3.30.5-1  ninja-1.12.1-1
Total Installed Size:  56.4 MiB`}
      />

      <TerminalBlock
        command={`cmake -B build -G Ninja \\
  -DCMAKE_INSTALL_PREFIX=/usr/local \\
  -DCMAKE_BUILD_TYPE=Release`}
        output={`-- The C compiler identification is GNU 14.2.1
-- The CXX compiler identification is GNU 14.2.1
-- Detecting C compiler ABI info - done
-- Check for working C compiler: /usr/bin/cc - skipped
-- Detecting C compiler features - done
-- Found OpenSSL: /usr/lib/libssl.so (found version "3.4.0")
-- Found ZLIB: /usr/lib/libz.so (found version "1.3.1")
-- Configuring done (1.2s)
-- Generating done (0.1s)
-- Build files have been written to: /home/user/projeto-1.4.0/build`}
      />

      <TerminalBlock
        command="cmake --build build -j$(nproc)"
        output={`[1/12] Building C object src/CMakeFiles/projeto.dir/main.c.o
[2/12] Building C object src/CMakeFiles/projeto.dir/util.c.o
...
[12/12] Linking C executable src/projeto`}
      />

      <TerminalBlock
        command="sudo cmake --install build"
        output={`-- Install configuration: "Release"
-- Installing: /usr/local/bin/projeto
-- Installing: /usr/local/share/man/man1/projeto.1`}
      />

      <h2>4. Meson — usado por GNOME, systemd, vários</h2>

      <TerminalBlock
        command="sudo pacman -S --needed meson"
        output={`Packages (1) meson-1.5.2-1
Total Installed Size:  9.42 MiB`}
      />

      <TerminalBlock
        command="meson setup build --prefix=/usr/local --buildtype=release"
        output={`The Meson build system
Version: 1.5.2
Source dir: /home/user/projeto-1.4.0
Build dir: /home/user/projeto-1.4.0/build
Build type: native build
Project name: projeto
C compiler for the host machine: cc (gcc 14.2.1)
Build targets in project: 4

Found ninja-1.12.1 at /usr/bin/ninja`}
      />

      <TerminalBlock
        command="meson compile -C build && sudo meson install -C build"
        output={`ninja: Entering directory \`/home/user/projeto-1.4.0/build'
[12/12] Linking target src/projeto
Installing src/projeto to /usr/local/bin
Installing manpage projeto.1 to /usr/local/share/man/man1`}
      />

      <h2>5. PKGBUILD — o jeito Arch</h2>

      <p>
        Um <strong>PKGBUILD</strong> é um script bash com variáveis e funções que
        descreve <em>como</em> baixar, compilar e empacotar um software. O{" "}
        <code>makepkg</code> lê esse arquivo, executa tudo em uma sandbox{" "}
        <code>fakeroot</code> e produz um <code>.pkg.tar.zst</code> instalável.
      </p>

      <CodeBlock
        title="PKGBUILD — exemplo mínimo"
        code={`# Maintainer: Seu Nome <email@exemplo.com>
pkgname=projeto
pkgver=1.4.0
pkgrel=1
pkgdesc="Utilitário de exemplo compilado do código-fonte"
arch=('x86_64')
url="https://github.com/exemplo/projeto"
license=('MIT')
depends=('openssl' 'zlib')
makedepends=('gcc' 'make' 'autoconf')
source=("$url/archive/refs/tags/v$pkgver.tar.gz")
sha256sums=('SKIP')   # depois substitua por hash real (updpkgsums)

build() {
    cd "$pkgname-$pkgver"
    ./configure --prefix=/usr
    make -j$(nproc)
}

check() {
    cd "$pkgname-$pkgver"
    make check
}

package() {
    cd "$pkgname-$pkgver"
    make DESTDIR="$pkgdir" install
}`}
      />

      <h3>Construindo e instalando</h3>

      <TerminalBlock
        comment="-s = sincroniza dependências; -i = instala o pacote no fim"
        command="makepkg -si"
        output={`==> Making package: projeto 1.4.0-1 (Wed 20 Mar 2026 17:18:42)
==> Checking runtime dependencies...
==> Checking buildtime dependencies...
==> Retrieving sources...
  -> Downloading v1.4.0.tar.gz...
==> Validating source files with sha256sums...
    v1.4.0.tar.gz ... Skipped
==> Extracting sources...
  -> Extracting v1.4.0.tar.gz with bsdtar
==> Starting build()...
  ... (saída do ./configure e make) ...
==> Starting check()...
  ... (testes) ...
==> Entering fakeroot environment...
==> Starting package()...
==> Tidying install...
  -> Removing libtool files...
  -> Purging unwanted files...
  -> Removing static library files...
  -> Stripping unneeded symbols from binaries and libraries...
  -> Compressing man and info pages...
==> Creating package "projeto"...
  -> Generating .PKGINFO file...
  -> Generating .BUILDINFO file...
  -> Generating .MTREE file...
  -> Compressing package...
==> Finished making: projeto 1.4.0-1 (Wed 20 Mar 2026 17:19:48)
==> Installing package projeto with pacman -U...
[sudo] password for user:
loading packages...
resolving dependencies...
looking for conflicting packages...

Packages (1) projeto-1.4.0-1

Total Installed Size:  0.42 MiB

:: Proceed with installation? [Y/n] y
(1/1) installing projeto                                                      [#####] 100%`}
      />

      <TerminalBlock
        command="pacman -Q projeto && pacman -Qo /usr/bin/projeto"
        output={`projeto 1.4.0-1
/usr/bin/projeto is owned by projeto 1.4.0-1`}
      />

      <h3>Removendo</h3>

      <TerminalBlock
        command="sudo pacman -R projeto"
        output={`checking dependencies...

Packages (1) projeto-1.4.0-1

Total Removed Size:  0.42 MiB

:: Do you want to remove these packages? [Y/n] y
(1/1) removing projeto                                                        [#####] 100%`}
      />

      <h2>6. Flags úteis do makepkg</h2>

      <CommandFlagList
        command="makepkg"
        items={[
          { flag: "-s", long: "--syncdeps", description: "Instala dependências faltantes via pacman antes do build." },
          { flag: "-i", long: "--install", description: "Instala o pacote gerado no fim com pacman -U." },
          { flag: "-r", long: "--rmdeps", description: "Remove dependências de build após terminar." },
          { flag: "-c", long: "--clean", description: "Limpa src/ e pkg/ antes/depois do build." },
          { flag: "-f", long: "--force", description: "Força build mesmo se já existe pacote." },
          { flag: "--skipchecksums", description: "Não valida hashes dos sources (perigoso, só p/ teste)." },
          { flag: "--nocheck", description: "Pula a função check()." },
          { flag: "-A", long: "--ignorearch", description: "Build em arquitetura não listada." },
          { flag: "-p PATH", description: "Usa PKGBUILD em outro path." },
        ]}
      />

      <h2>7. AUR — PKGBUILDs da comunidade</h2>

      <p>
        O <strong>Arch User Repository</strong> hospeda 80.000+ PKGBUILDs mantidos por
        usuários. Você pode clonar à mão e rodar <code>makepkg -si</code>:
      </p>

      <TerminalBlock
        command="git clone https://aur.archlinux.org/visual-studio-code-bin.git"
        output={`Cloning into 'visual-studio-code-bin'...
remote: Enumerating objects: 1842, done.
remote: Counting objects: 100% (1842/1842), done.
remote: Total 1842 (delta 942), reused 1842 (delta 942)
Receiving objects: 100% (1842/1842), 248.42 KiB | 1.2 MiB/s, done.
Resolving deltas: 100% (942/942), done.`}
      />

      <TerminalBlock
        command="cd visual-studio-code-bin && less PKGBUILD   # SEMPRE leia antes de buildar!"
        output=""
      />

      <TerminalBlock
        command="makepkg -si"
        output={`==> Making package: visual-studio-code-bin 1.93.1-1 (Wed 20 Mar 2026)
==> Retrieving sources...
  -> Downloading code-stable-x64-1726782882.tar.gz...
... (build + instalação) ...
==> Finished making: visual-studio-code-bin 1.93.1-1`}
      />

      <p>
        Ferramentas helper como <code>yay</code> ou <code>paru</code> automatizam o ciclo
        clone-makepkg-update. Veja a página <strong>AUR</strong> para mais.
      </p>

      <h2>8. Boas práticas</h2>

      <AlertBox type="success" title="Receita do iniciado">
        <ul className="list-disc ml-5 space-y-1 mt-1">
          <li>SEMPRE leia o <code>PKGBUILD</code> antes de rodar <code>makepkg</code> — é
            um shell script com privilégios potenciais.</li>
          <li>Para uso pontual, prefira instalar em <code>/usr/local</code> (não conflita com
            pacman). Para algo permanente, vire um PKGBUILD.</li>
          <li>Use <code>--prefix=/usr/local</code> em <code>./configure</code> e mantenha{" "}
            <code>/usr</code> exclusivo para pacman.</li>
          <li>Compile com <code>-march=native</code> só quando o binário ficar nessa máquina
            — ele <em>não</em> roda em outras CPUs.</li>
          <li>Documente quem instalou o quê:{" "}
            <code>echo "projeto 1.4.0 from source $(date)" {">>"} /etc/installed-from-src.log</code>.</li>
        </ul>
      </AlertBox>

      <h2>9. Cola visual</h2>

      <OutputBlock
        title="fluxos de compilação"
        output={`# autotools
./configure --prefix=/usr/local
make -j$(nproc)
sudo make install
sudo make uninstall                  # se suportar

# cmake
cmake -B build -G Ninja -DCMAKE_INSTALL_PREFIX=/usr/local
cmake --build build -j$(nproc)
sudo cmake --install build

# meson
meson setup build --prefix=/usr/local
meson compile -C build
sudo meson install -C build

# arch idiomático (PKGBUILD)
makepkg -si                          # build + instala c/ pacman
pacman -Q nome                       # confirma
sudo pacman -R nome                  # remove limpo

# AUR à mão
git clone https://aur.archlinux.org/PKG.git
cd PKG && less PKGBUILD              # AUDITE!
makepkg -si`}
      />
    </PageContainer>
  );
}
