import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Aur() {
  return (
    <PageContainer
      title="AUR — Arch User Repository"
      subtitle="Entenda o repositório mantido pela comunidade, aprenda a usar makepkg, yay e paru, e saiba como se proteger."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <h2>O que é o AUR?</h2>
      <p>
        O AUR (Arch User Repository) é um repositório mantido pela comunidade que contém descrições
        de como compilar pacotes (<strong>PKGBUILDs</strong>) que não estão nos repositórios oficiais.
        É uma das maiores razões pelas quais o Arch é tão popular — praticamente qualquer software
        que existe no Linux está disponível no AUR.
      </p>
      <ul>
        <li>Repositórios oficiais: ~13.000 pacotes</li>
        <li>AUR: ~90.000+ pacotes</li>
      </ul>

      <AlertBox type="danger" title="O AUR NÃO é oficialmente suportado">
        Pacotes do AUR são mantidos por usuários da comunidade, não pela equipe do Arch Linux.
        Qualquer pessoa pode enviar um PKGBUILD. Sempre leia o PKGBUILD antes de instalar
        para verificar que ele não contém comandos maliciosos.
      </AlertBox>

      <h2>Como o AUR Funciona</h2>
      <p>
        O AUR não distribui binários (programas prontos). Ele distribui <strong>PKGBUILDs</strong> —
        scripts que contêm instruções de como baixar o código-fonte, compilar e empacotar o software
        no formato do pacman.
      </p>
      <p>O fluxo é:</p>
      <ol>
        <li>Baixar o PKGBUILD do AUR</li>
        <li>Verificar o PKGBUILD (segurança)</li>
        <li>Executar <code>makepkg</code> para compilar</li>
        <li>Instalar o pacote gerado com <code>pacman -U</code></li>
      </ol>

      <h2>Instalação Manual (sem AUR helper)</h2>
      <CodeBlock
        title="Instalar pacote do AUR manualmente"
        code={`# Pré-requisito: ter base-devel e git instalados
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
rm -rf nome-do-pacote`}
      />

      <h2>Anatomia de um PKGBUILD</h2>
      <CodeBlock
        title="Exemplo de PKGBUILD"
        language="bash"
        code={`# Maintainer: Nome do Mantenedor <email@exemplo.com>
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
}`}
      />

      <p>Campos importantes:</p>
      <ul>
        <li><code>pkgname</code> — Nome do pacote</li>
        <li><code>pkgver</code> — Versão do software</li>
        <li><code>depends</code> — Dependências de runtime</li>
        <li><code>makedepends</code> — Dependências necessárias apenas para compilar</li>
        <li><code>source</code> — De onde baixar o código-fonte</li>
        <li><code>sha256sums</code> — Checksums para verificar integridade</li>
        <li><code>build()</code> — Função que compila o software</li>
        <li><code>package()</code> — Função que empacota os arquivos</li>
      </ul>

      <h2>makepkg</h2>
      <CodeBlock
        title="Flags úteis do makepkg"
        code={`makepkg -s        # Instalar dependências antes de compilar
makepkg -i        # Instalar o pacote após compilar
makepkg -si       # Combinar: dependências + instalar
makepkg -c        # Limpar arquivos de build após compilar
makepkg -f        # Forçar recompilação mesmo se o pacote já existe
makepkg -d        # Ignorar verificação de dependências (perigoso!)
makepkg -L        # Criar log da compilação
makepkg --nocheck # Pular testes (útil se os testes falham mas o programa funciona)
makepkg -sr       # Remover makedepends após compilar`}
      />

      <AlertBox type="warning" title="Nunca rode makepkg como root">
        O <code>makepkg</code> se recusa a executar como root por segurança. Sempre execute
        como seu usuário normal. Ele usará sudo internamente apenas quando necessário.
      </AlertBox>

      <h2>yay — O AUR Helper mais popular</h2>
      <p>
        O <code>yay</code> (Yet Another Yogurt) automatiza todo o processo do AUR e funciona
        como um wrapper do pacman.
      </p>

      <h3>Instalação</h3>
      <CodeBlock
        title="Instalar o yay"
        code={`sudo pacman -S --needed base-devel git
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
cd .. && rm -rf yay`}
      />

      <h3>Comandos do yay</h3>
      <CodeBlock
        title="Usando o yay"
        code={`# Instalar pacote (busca em repositórios oficiais E no AUR)
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
yay --editmenu -S nome-do-pacote`}
      />

      <h2>paru — Alternativa ao yay</h2>
      <p>
        O <code>paru</code> é um AUR helper escrito em Rust. Mais rápido e com mais features que o yay.
      </p>
      <CodeBlock
        title="Instalar e usar paru"
        code={`# Instalar paru
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
paru -Sua --upgrademenu`}
      />

      <h2>Segurança no AUR</h2>
      <AlertBox type="danger" title="Regras de segurança">
        <ul>
          <li>SEMPRE leia o PKGBUILD antes de instalar um pacote novo</li>
          <li>Verifique os comentários na página do AUR do pacote</li>
          <li>Verifique a reputação do mantenedor e número de votos</li>
          <li>Desconfie de PKGBUILDs que baixam scripts e executam com bash/curl</li>
          <li>Prefira pacotes com "-bin" no nome se não quer compilar (são binários pré-compilados)</li>
          <li>Cuidado com pacotes "órfãos" (sem mantenedor) — podem estar desatualizados ou inseguros</li>
        </ul>
      </AlertBox>

      <CodeBlock
        title="Verificando um pacote no AUR"
        code={`# Ver informações no terminal
yay -Si google-chrome

# Verificar no site
# https://aur.archlinux.org/packages/nome-do-pacote

# Ver o PKGBUILD no terminal antes de instalar
yay --editmenu -S pacote

# Ver comentários e votos diretamente
# Abra: https://aur.archlinux.org/packages/pacote#comments`}
      />

      <h2>Dicas Úteis</h2>
      <CodeBlock
        title="Dicas para o dia a dia"
        code={`# Pacotes -bin vs compilados:
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
# 4. Reporte o problema na página do AUR`}
      />

      <AlertBox type="info" title="Sufixos de pacotes no AUR">
        <code>-bin</code> = binário pré-compilado (instala rápido).
        <code>-git</code> = versão de desenvolvimento (última versão do código).
        Sem sufixo = compila do código-fonte (pode demorar, mas é a forma "pura").
      </AlertBox>
    </PageContainer>
  );
}
