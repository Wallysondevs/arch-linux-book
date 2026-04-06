import{j as e}from"./ui-K-J8Jkwj.js";import{P as o}from"./PageContainer-tnnsMrcC.js";import{C as a}from"./CodeBlock-DEDRw1y6.js";import{A as r}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function u(){return e.jsxs(o,{title:"makepkg & PKGBUILD",subtitle:"Aprenda a construir pacotes do zero no Arch Linux: crie PKGBUILDs, compile software e empacote para distribuição.",difficulty:"avancado",timeToRead:"22 min",children:[e.jsx("h2",{children:"O que é makepkg?"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"makepkg"})," é a ferramenta oficial do Arch Linux para construir pacotes. Ele lê um arquivo",e.jsx("code",{children:"PKGBUILD"})," (que descreve como compilar e empacotar um software) e gera um pacote",e.jsx("code",{children:".pkg.tar.zst"})," que pode ser instalado com o pacman."]}),e.jsx("h2",{children:"Pré-requisitos"}),e.jsx(a,{title:"Instalar ferramentas necessárias",code:`# base-devel inclui make, gcc, binutils, etc.
sudo pacman -S --needed base-devel

# Verificar
makepkg --version`}),e.jsx("h2",{children:"Construindo do AUR"}),e.jsx(a,{title:"Construir pacote do AUR manualmente",code:`# 1. Clonar o PKGBUILD do AUR
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
cd .. && rm -rf yay`}),e.jsxs(r,{type:"warning",title:"Segurança no AUR",children:[e.jsx("strong",{children:"SEMPRE"})," leia o PKGBUILD antes de construir. O AUR é mantido por usuários e não é auditado oficialmente. Um PKGBUILD malicioso pode executar código arbitrário no seu sistema. Verifique especialmente as linhas ",e.jsx("code",{children:"source"}),", ",e.jsx("code",{children:"build()"})," e ",e.jsx("code",{children:"package()"}),"."]}),e.jsx("h2",{children:"Estrutura do PKGBUILD"}),e.jsx(a,{title:"Anatomia de um PKGBUILD",code:`# Maintainer: Seu Nome <seu@email.com>
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
    cd "$pkgname-$pkgver"
    cmake -B build -DCMAKE_INSTALL_PREFIX=/usr
    cmake --build build
}

package() {
    cd "$pkgname-$pkgver"
    DESTDIR="$pkgdir" cmake --install build
    install -Dm644 LICENSE "$pkgdir/usr/share/licenses/$pkgname/LICENSE"
}`}),e.jsx("h3",{children:"Campos Importantes"}),e.jsx(a,{title:"Explicação de cada campo",code:`# pkgname     — nome do pacote (deve ser minúsculo)
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
# replaces    — pacotes que este substitui automaticamente`}),e.jsx("h2",{children:"Criando Seu Primeiro PKGBUILD"}),e.jsx("h3",{children:"Exemplo: Empacotando um Script Shell"}),e.jsx(a,{title:"PKGBUILD para um script simples",code:`# PKGBUILD
pkgname=meu-script
pkgver=1.0
pkgrel=1
pkgdesc="Um script útil para o dia a dia"
arch=('any')
license=('MIT')

source=("meu-script.sh")
sha256sums=('SKIP')

package() {
    install -Dm755 "$srcdir/meu-script.sh" "$pkgdir/usr/bin/meu-script"
}

# Criar o script
# meu-script.sh:
# #!/bin/bash
# echo "Olá do meu script!"

# Construir
makepkg -s`}),e.jsx("h3",{children:"Exemplo: Programa Go"}),e.jsx(a,{title:"PKGBUILD para programa em Go",code:`pkgname=meu-programa-go
pkgver=2.1.0
pkgrel=1
pkgdesc="Um programa escrito em Go"
arch=('x86_64')
url="https://github.com/usuario/meu-programa-go"
license=('MIT')
makedepends=('go')
source=("$pkgname-$pkgver.tar.gz::https://github.com/usuario/$pkgname/archive/v$pkgver.tar.gz")
sha256sums=('SKIP')

build() {
    cd "$pkgname-$pkgver"
    export CGO_CPPFLAGS="$CPPFLAGS"
    export CGO_CFLAGS="$CFLAGS"
    export CGO_CXXFLAGS="$CXXFLAGS"
    export CGO_LDFLAGS="$LDFLAGS"
    export GOFLAGS="-buildmode=pie -trimpath -ldflags=-linkmode=external -mod=readonly -modcacherw"
    go build -o $pkgname .
}

package() {
    cd "$pkgname-$pkgver"
    install -Dm755 $pkgname "$pkgdir/usr/bin/$pkgname"
}`}),e.jsx("h3",{children:"Exemplo: Programa Rust"}),e.jsx(a,{title:"PKGBUILD para programa em Rust",code:`pkgname=meu-programa-rust
pkgver=1.0.0
pkgrel=1
pkgdesc="Programa em Rust rápido"
arch=('x86_64')
url="https://github.com/usuario/meu-programa-rust"
license=('MIT')
makedepends=('rust' 'cargo')
source=("$pkgname-$pkgver.tar.gz::https://github.com/usuario/$pkgname/archive/v$pkgver.tar.gz")
sha256sums=('SKIP')

prepare() {
    cd "$pkgname-$pkgver"
    export RUSTUP_TOOLCHAIN=stable
    cargo fetch --locked --target "$(rustc -vV | sed -n 's/host: //p')"
}

build() {
    cd "$pkgname-$pkgver"
    export RUSTUP_TOOLCHAIN=stable
    cargo build --frozen --release --all-features
}

package() {
    cd "$pkgname-$pkgver"
    install -Dm755 "target/release/$pkgname" "$pkgdir/usr/bin/$pkgname"
}`}),e.jsx("h2",{children:"Comandos do makepkg"}),e.jsx(a,{title:"Opções úteis do makepkg",code:`# Construir e instalar
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
updpkgsums`}),e.jsx("h2",{children:"Configuração Global"}),e.jsx(a,{title:"Configurar /etc/makepkg.conf",code:`# Compilar com todos os cores
MAKEFLAGS="-j$(nproc)"

# Flags de compilação otimizadas
CFLAGS="-march=native -O2 -pipe -fno-plt"
CXXFLAGS="$CFLAGS"

# Diretório de construção na RAM (mais rápido)
BUILDDIR=/tmp/makepkg

# Formato de compressão do pacote
PKGEXT='.pkg.tar.zst'

# Usar ccache
BUILDENV=(... ccache ...)

# Empacotador (aparece no pacote)
PACKAGER="Seu Nome <seu@email.com>"`}),e.jsx("h2",{children:"Publicando no AUR"}),e.jsx(a,{title:"Publicar seu pacote no AUR",code:`# 1. Criar conta em https://aur.archlinux.org

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
git push`}),e.jsxs(r,{type:"info",title:"Namcap — Validador de pacotes",children:["Use ",e.jsx("code",{children:"namcap"})," para verificar problemas no PKGBUILD e no pacote construído:",e.jsx("br",{}),e.jsx("br",{}),e.jsx("code",{children:"namcap PKGBUILD"})," — verifica o PKGBUILD",e.jsx("br",{}),e.jsx("code",{children:"namcap meu-pacote.pkg.tar.zst"})," — verifica o pacote construído"]})]})}export{u as default};
