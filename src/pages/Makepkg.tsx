import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Makepkg() {
  return (
    <PageContainer
      title="makepkg & PKGBUILD"
      subtitle="Aprenda a construir pacotes do zero no Arch Linux: crie PKGBUILDs, compile software e empacote para distribuição."
      difficulty="avancado"
      timeToRead="22 min"
    >
      <h2>O que é makepkg?</h2>
      <p>
        O <code>makepkg</code> é a ferramenta oficial do Arch Linux para construir pacotes. Ele lê um arquivo 
        <code>PKGBUILD</code> (que descreve como compilar e empacotar um software) e gera um pacote 
        <code>.pkg.tar.zst</code> que pode ser instalado com o pacman.
      </p>

      <h2>Pré-requisitos</h2>

      <CodeBlock
        title="Instalar ferramentas necessárias"
        code={`# base-devel inclui make, gcc, binutils, etc.
sudo pacman -S --needed base-devel

# Verificar
makepkg --version`}
      />

      <h2>Construindo do AUR</h2>

      <CodeBlock
        title="Construir pacote do AUR manualmente"
        code={`# 1. Clonar o PKGBUILD do AUR
git clone https://aur.archlinux.org/yay.git
cd yay

# 2. IMPORTANTE: Sempre inspecione o PKGBUILD antes!
cat PKGBUILD
# Verifique: source, sha256sums, build(), package()

# 3. Construir e instalar
makepkg -si
# -s = instalar dependências automaticamente
# -i = instalar o pacote após construir

# 4. Limpar (opcional)
cd .. && rm -rf yay`}
      />

      <AlertBox type="warning" title="Segurança no AUR">
        <strong>SEMPRE</strong> leia o PKGBUILD antes de construir. O AUR é mantido por usuários e não é
        auditado oficialmente. Um PKGBUILD malicioso pode executar código arbitrário no seu sistema.
        Verifique especialmente as linhas <code>source</code>, <code>build()</code> e <code>package()</code>.
      </AlertBox>

      <h2>Estrutura do PKGBUILD</h2>

      <CodeBlock
        title="Anatomia de um PKGBUILD"
        code={`# Maintainer: Seu Nome <seu@email.com>
pkgname=meu-programa
pkgver=1.0.0
pkgrel=1
pkgdesc="Descrição curta do programa"
arch=('x86_64')
url="https://github.com/usuario/meu-programa"
license=('MIT')
depends=('glibc' 'openssl')
makedepends=('cmake' 'git')
optdepends=('python: para scripts auxiliares')
source=("https://github.com/usuario/meu-programa/archive/v\${pkgver}.tar.gz")
sha256sums=('SKIP')  # Usar 'updpkgsums' para calcular

build() {
    cd "\$pkgname-\$pkgver"
    cmake -B build -DCMAKE_INSTALL_PREFIX=/usr
    cmake --build build
}

package() {
    cd "\$pkgname-\$pkgver"
    DESTDIR="\$pkgdir" cmake --install build
    install -Dm644 LICENSE "\$pkgdir/usr/share/licenses/\$pkgname/LICENSE"
}`}
      />

      <h3>Campos Importantes</h3>

      <CodeBlock
        title="Explicação de cada campo"
        code={`# pkgname     — nome do pacote (deve ser minúsculo)
# pkgver      — versão do software
# pkgrel      — release do pacote (incrementar quando mudar o PKGBUILD sem mudar pkgver)
# pkgdesc     — descrição (máx ~80 caracteres)
# arch        — arquiteturas suportadas: ('x86_64') ou ('any') para scripts
# url         — homepage do projeto
# license     — licença: ('MIT'), ('GPL'), ('Apache'), etc.
# depends     — dependências de runtime
# makedepends — dependências de build (só para compilar)
# optdepends  — dependências opcionais
# source      — URLs ou arquivos locais para baixar
# sha256sums  — checksums dos arquivos source
# backup      — arquivos de config que devem ser preservados em upgrades
# install     — arquivo .install com hooks pre/post install
# conflicts   — pacotes que conflitam com este
# provides    — pacotes que este substitui
# replaces    — pacotes que este substitui automaticamente`}
      />

      <h2>Criando Seu Primeiro PKGBUILD</h2>

      <h3>Exemplo: Empacotando um Script Shell</h3>
      <CodeBlock
        title="PKGBUILD para um script simples"
        code={`# PKGBUILD
pkgname=meu-script
pkgver=1.0
pkgrel=1
pkgdesc="Um script útil para o dia a dia"
arch=('any')
license=('MIT')

source=("meu-script.sh")
sha256sums=('SKIP')

package() {
    install -Dm755 "\$srcdir/meu-script.sh" "\$pkgdir/usr/bin/meu-script"
}

# Criar o script
# meu-script.sh:
# #!/bin/bash
# echo "Olá do meu script!"

# Construir
makepkg -s`}
      />

      <h3>Exemplo: Programa Go</h3>
      <CodeBlock
        title="PKGBUILD para programa em Go"
        code={`pkgname=meu-programa-go
pkgver=2.1.0
pkgrel=1
pkgdesc="Um programa escrito em Go"
arch=('x86_64')
url="https://github.com/usuario/meu-programa-go"
license=('MIT')
makedepends=('go')
source=("\$pkgname-\$pkgver.tar.gz::https://github.com/usuario/\$pkgname/archive/v\$pkgver.tar.gz")
sha256sums=('SKIP')

build() {
    cd "\$pkgname-\$pkgver"
    export CGO_CPPFLAGS="\$CPPFLAGS"
    export CGO_CFLAGS="\$CFLAGS"
    export CGO_CXXFLAGS="\$CXXFLAGS"
    export CGO_LDFLAGS="\$LDFLAGS"
    export GOFLAGS="-buildmode=pie -trimpath -ldflags=-linkmode=external -mod=readonly -modcacherw"
    go build -o \$pkgname .
}

package() {
    cd "\$pkgname-\$pkgver"
    install -Dm755 \$pkgname "\$pkgdir/usr/bin/\$pkgname"
}`}
      />

      <h3>Exemplo: Programa Rust</h3>
      <CodeBlock
        title="PKGBUILD para programa em Rust"
        code={`pkgname=meu-programa-rust
pkgver=1.0.0
pkgrel=1
pkgdesc="Programa em Rust rápido"
arch=('x86_64')
url="https://github.com/usuario/meu-programa-rust"
license=('MIT')
makedepends=('rust' 'cargo')
source=("\$pkgname-\$pkgver.tar.gz::https://github.com/usuario/\$pkgname/archive/v\$pkgver.tar.gz")
sha256sums=('SKIP')

prepare() {
    cd "\$pkgname-\$pkgver"
    export RUSTUP_TOOLCHAIN=stable
    cargo fetch --locked --target "\$(rustc -vV | sed -n 's/host: //p')"
}

build() {
    cd "\$pkgname-\$pkgver"
    export RUSTUP_TOOLCHAIN=stable
    cargo build --frozen --release --all-features
}

package() {
    cd "\$pkgname-\$pkgver"
    install -Dm755 "target/release/\$pkgname" "\$pkgdir/usr/bin/\$pkgname"
}`}
      />

      <h2>Comandos do makepkg</h2>

      <CodeBlock
        title="Opções úteis do makepkg"
        code={`# Construir e instalar
makepkg -si

# Construir sem verificar checksums
makepkg -si --skipinteg

# Apenas baixar sources (sem construir)
makepkg -o

# Limpar diretórios de build
makepkg -c

# Forçar reconstrução
makepkg -f

# Não compilar, apenas empacotar
makepkg -R

# Gerar .SRCINFO (necessário para AUR)
makepkg --printsrcinfo > .SRCINFO

# Calcular/atualizar checksums automaticamente
updpkgsums`}
      />

      <h2>Configuração Global</h2>

      <CodeBlock
        title="Configurar /etc/makepkg.conf"
        code={`# Compilar com todos os cores
MAKEFLAGS="-j$(nproc)"

# Flags de compilação otimizadas
CFLAGS="-march=native -O2 -pipe -fno-plt"
CXXFLAGS="\$CFLAGS"

# Diretório de construção na RAM (mais rápido)
BUILDDIR=/tmp/makepkg

# Formato de compressão do pacote
PKGEXT='.pkg.tar.zst'

# Usar ccache
BUILDENV=(... ccache ...)

# Empacotador (aparece no pacote)
PACKAGER="Seu Nome <seu@email.com>"`}
      />

      <h2>Publicando no AUR</h2>

      <CodeBlock
        title="Publicar seu pacote no AUR"
        code={`# 1. Criar conta em https://aur.archlinux.org

# 2. Configurar SSH key
ssh-keygen -t ed25519 -C "seu@email.com"
# Adicionar a chave pública no perfil do AUR

# 3. Clonar repositório (novo pacote)
git clone ssh://aur@aur.archlinux.org/nome-do-pacote.git
cd nome-do-pacote

# 4. Adicionar PKGBUILD e .SRCINFO
cp /caminho/do/PKGBUILD .
makepkg --printsrcinfo > .SRCINFO

# 5. Commit e push
git add PKGBUILD .SRCINFO
git commit -m "Initial upload: nome-do-pacote 1.0.0"
git push`}
      />

      <AlertBox type="info" title="Namcap — Validador de pacotes">
        Use <code>namcap</code> para verificar problemas no PKGBUILD e no pacote construído:
        <br/><br/>
        <code>namcap PKGBUILD</code> — verifica o PKGBUILD
        <br/>
        <code>namcap meu-pacote.pkg.tar.zst</code> — verifica o pacote construído
      </AlertBox>
    </PageContainer>
  );
}
