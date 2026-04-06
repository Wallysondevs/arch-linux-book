import{j as e}from"./ui-K-J8Jkwj.js";import{P as i}from"./PageContainer-tnnsMrcC.js";import{C as a}from"./CodeBlock-DEDRw1y6.js";import{A as o}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function m(){return e.jsxs(i,{title:"AUR — Arch User Repository",subtitle:"Entenda o repositório mantido pela comunidade, aprenda a usar makepkg, yay e paru, e saiba como se proteger.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"O que é o AUR?"}),e.jsxs("p",{children:["O AUR (Arch User Repository) é um repositório mantido pela comunidade que contém descrições de como compilar pacotes (",e.jsx("strong",{children:"PKGBUILDs"}),") que não estão nos repositórios oficiais. É uma das maiores razões pelas quais o Arch é tão popular — praticamente qualquer software que existe no Linux está disponível no AUR."]}),e.jsxs("ul",{children:[e.jsx("li",{children:"Repositórios oficiais: ~13.000 pacotes"}),e.jsx("li",{children:"AUR: ~90.000+ pacotes"})]}),e.jsx(o,{type:"danger",title:"O AUR NÃO é oficialmente suportado",children:"Pacotes do AUR são mantidos por usuários da comunidade, não pela equipe do Arch Linux. Qualquer pessoa pode enviar um PKGBUILD. Sempre leia o PKGBUILD antes de instalar para verificar que ele não contém comandos maliciosos."}),e.jsx("h2",{children:"Como o AUR Funciona"}),e.jsxs("p",{children:["O AUR não distribui binários (programas prontos). Ele distribui ",e.jsx("strong",{children:"PKGBUILDs"})," — scripts que contêm instruções de como baixar o código-fonte, compilar e empacotar o software no formato do pacman."]}),e.jsx("p",{children:"O fluxo é:"}),e.jsxs("ol",{children:[e.jsx("li",{children:"Baixar o PKGBUILD do AUR"}),e.jsx("li",{children:"Verificar o PKGBUILD (segurança)"}),e.jsxs("li",{children:["Executar ",e.jsx("code",{children:"makepkg"})," para compilar"]}),e.jsxs("li",{children:["Instalar o pacote gerado com ",e.jsx("code",{children:"pacman -U"})]})]}),e.jsx("h2",{children:"Instalação Manual (sem AUR helper)"}),e.jsx(a,{title:"Instalar pacote do AUR manualmente",code:`# Pré-requisito: ter base-devel e git instalados
sudo pacman -S --needed base-devel git

# 1. Clonar o repositório do pacote
git clone https://aur.archlinux.org/nome-do-pacote.git
cd nome-do-pacote

# 2. LER o PKGBUILD (SEMPRE faça isso!)
cat PKGBUILD

# 3. Compilar o pacote
makepkg -si
# -s: instala dependências automaticamente
# -i: instala o pacote após compilar

# 4. Limpar
cd ..
rm -rf nome-do-pacote`}),e.jsx("h2",{children:"Anatomia de um PKGBUILD"}),e.jsx(a,{title:"Exemplo de PKGBUILD",language:"bash",code:`# Maintainer: Nome do Mantenedor <email@exemplo.com>
pkgname=meu-programa
pkgver=1.0.0
pkgrel=1
pkgdesc="Descrição do programa"
arch=('x86_64')
url="https://github.com/usuario/programa"
license=('MIT')
depends=('python' 'qt5-base')
makedepends=('cmake' 'git')
source=("$pkgname-$pkgver.tar.gz::https://github.com/usuario/programa/archive/v$pkgver.tar.gz")
sha256sums=('abc123...')

build() {
    cd "$pkgname-$pkgver"
    cmake -B build -DCMAKE_INSTALL_PREFIX=/usr
    cmake --build build
}

package() {
    cd "$pkgname-$pkgver"
    DESTDIR="$pkgdir" cmake --install build
}`}),e.jsx("p",{children:"Campos importantes:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"pkgname"})," — Nome do pacote"]}),e.jsxs("li",{children:[e.jsx("code",{children:"pkgver"})," — Versão do software"]}),e.jsxs("li",{children:[e.jsx("code",{children:"depends"})," — Dependências de runtime"]}),e.jsxs("li",{children:[e.jsx("code",{children:"makedepends"})," — Dependências necessárias apenas para compilar"]}),e.jsxs("li",{children:[e.jsx("code",{children:"source"})," — De onde baixar o código-fonte"]}),e.jsxs("li",{children:[e.jsx("code",{children:"sha256sums"})," — Checksums para verificar integridade"]}),e.jsxs("li",{children:[e.jsx("code",{children:"build()"})," — Função que compila o software"]}),e.jsxs("li",{children:[e.jsx("code",{children:"package()"})," — Função que empacota os arquivos"]})]}),e.jsx("h2",{children:"makepkg"}),e.jsx(a,{title:"Flags úteis do makepkg",code:`makepkg -s        # Instalar dependências antes de compilar
makepkg -i        # Instalar o pacote após compilar
makepkg -si       # Combinar: dependências + instalar
makepkg -c        # Limpar arquivos de build após compilar
makepkg -f        # Forçar recompilação mesmo se o pacote já existe
makepkg -d        # Ignorar verificação de dependências (perigoso!)
makepkg -L        # Criar log da compilação
makepkg --nocheck # Pular testes (útil se os testes falham mas o programa funciona)
makepkg -sr       # Remover makedepends após compilar`}),e.jsxs(o,{type:"warning",title:"Nunca rode makepkg como root",children:["O ",e.jsx("code",{children:"makepkg"})," se recusa a executar como root por segurança. Sempre execute como seu usuário normal. Ele usará sudo internamente apenas quando necessário."]}),e.jsx("h2",{children:"yay — O AUR Helper mais popular"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"yay"})," (Yet Another Yogurt) automatiza todo o processo do AUR e funciona como um wrapper do pacman."]}),e.jsx("h3",{children:"Instalação"}),e.jsx(a,{title:"Instalar o yay",code:`sudo pacman -S --needed base-devel git
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
cd .. && rm -rf yay`}),e.jsx("h3",{children:"Comandos do yay"}),e.jsx(a,{title:"Usando o yay",code:`# Instalar pacote (busca em repositórios oficiais E no AUR)
yay -S nome-do-pacote

# Atualizar tudo (sistema + AUR)
yay -Syu

# Atualizar apenas pacotes do AUR
yay -Sua

# Buscar pacotes
yay -Ss palavra-chave

# Buscar interativamente (sem argumentos)
yay nome-do-pacote

# Remover pacote e dependências
yay -Rns nome-do-pacote

# Limpar cache de builds antigos
yay -Sc

# Mostrar informações de um pacote
yay -Si nome-do-pacote

# Mostrar estatísticas
yay -Ps

# Listar pacotes instalados do AUR
yay -Qm

# Ver diff do PKGBUILD antes de instalar
yay --editmenu -S nome-do-pacote`}),e.jsx("h2",{children:"paru — Alternativa ao yay"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"paru"})," é um AUR helper escrito em Rust. Mais rápido e com mais features que o yay."]}),e.jsx(a,{title:"Instalar e usar paru",code:`# Instalar paru
git clone https://aur.archlinux.org/paru.git
cd paru
makepkg -si
cd .. && rm -rf paru

# Os comandos são praticamente iguais ao yay:
paru -S pacote
paru -Syu
paru -Ss busca
paru -Rns pacote

# Paru mostra o PKGBUILD por padrão antes de instalar
# Você pode desabilitar com:
paru --skipreview -S pacote

# Ver diff de atualizações do PKGBUILD
paru -Sua --upgrademenu`}),e.jsx("h2",{children:"Segurança no AUR"}),e.jsx(o,{type:"danger",title:"Regras de segurança",children:e.jsxs("ul",{children:[e.jsx("li",{children:"SEMPRE leia o PKGBUILD antes de instalar um pacote novo"}),e.jsx("li",{children:"Verifique os comentários na página do AUR do pacote"}),e.jsx("li",{children:"Verifique a reputação do mantenedor e número de votos"}),e.jsx("li",{children:"Desconfie de PKGBUILDs que baixam scripts e executam com bash/curl"}),e.jsx("li",{children:'Prefira pacotes com "-bin" no nome se não quer compilar (são binários pré-compilados)'}),e.jsx("li",{children:'Cuidado com pacotes "órfãos" (sem mantenedor) — podem estar desatualizados ou inseguros'})]})}),e.jsx(a,{title:"Verificando um pacote no AUR",code:`# Ver informações no terminal
yay -Si google-chrome

# Verificar no site
# https://aur.archlinux.org/packages/nome-do-pacote

# Ver o PKGBUILD no terminal antes de instalar
yay --editmenu -S pacote

# Ver comentários e votos diretamente
# Abra: https://aur.archlinux.org/packages/pacote#comments`}),e.jsx("h2",{children:"Dicas Úteis"}),e.jsx(a,{title:"Dicas para o dia a dia",code:`# Pacotes -bin vs compilados:
# google-chrome      -> compila do source (pode demorar MUITO)
# google-chrome-bin  -> baixa o binário pronto (rápido)

# Pacotes -git:
# programa-git       -> compila a versão mais recente do código
#                       (pode ser instável, mas tem as features mais novas)

# Ver pacotes do AUR que precisam de atualização
yay -Qua

# Limpar cache de build do yay
yay -Sc

# Recompilar um pacote do AUR
yay -S --rebuild pacote

# Se um pacote do AUR falhar na compilação:
# 1. Atualize o sistema primeiro: yay -Syu
# 2. Verifique os comentários no AUR
# 3. Tente com --nocheck (pula testes)
# 4. Reporte o problema na página do AUR`}),e.jsxs(o,{type:"info",title:"Sufixos de pacotes no AUR",children:[e.jsx("code",{children:"-bin"})," = binário pré-compilado (instala rápido).",e.jsx("code",{children:"-git"}),' = versão de desenvolvimento (última versão do código). Sem sufixo = compila do código-fonte (pode demorar, mas é a forma "pura").']})]})}export{m as default};
