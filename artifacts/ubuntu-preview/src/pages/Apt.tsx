import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Apt() {
  return (
    <PageContainer
      title="APT — Gerenciador de Pacotes"
      subtitle="O coração do Ubuntu. APT instala, remove, atualiza e gerencia todo o software do sistema com comandos simples e poderosos."
      difficulty="iniciante"
      timeToRead="25 min"
    >
      <p>
        O <strong>APT</strong> (Advanced Package Tool) é o gerenciador de pacotes do Ubuntu e de
        todas as distribuições baseadas em Debian. Ele é responsável por instalar, remover e
        atualizar software, resolvendo dependências automaticamente. Com um único comando, você
        pode instalar um aplicativo completo com todas as bibliotecas que ele precisa.
      </p>

      <h2>Os Comandos: apt vs apt-get</h2>
      <p>
        Você vai encontrar dois comandos na documentação: <code>apt</code> e <code>apt-get</code>.
        O <code>apt</code> é a versão moderna, com saída mais amigável e barra de progresso.
        O <code>apt-get</code> é o clássico, mais estável para scripts. Para uso no terminal
        do dia a dia, use sempre <code>apt</code>.
      </p>

      <h2>1. Atualização do Sistema</h2>
      <CodeBlock
        title="Manter o sistema atualizado"
        code={`# PASSO 1: Atualizar a lista de pacotes disponíveis
sudo apt update
# Baixa informações dos repositórios sobre versões novas
# NÃO instala nada, só verifica o que há de novo

# PASSO 2: Instalar as atualizações
sudo apt upgrade
# Instala versões mais novas dos pacotes já instalados
# Não remove pacotes nem instala novos

# PASSO AVANÇADO: Atualização completa (inclui mudanças de dependências)
sudo apt full-upgrade
# Pode instalar e remover pacotes se necessário
# Necessário para grandes atualizações (ex: nova versão do kernel)

# Fazer os dois de uma vez (o mais comum):
sudo apt update && sudo apt upgrade -y

# Ver o que seria atualizado sem instalar:
apt list --upgradable`}
      />

      <AlertBox type="danger" title="Sempre faça apt update antes de instalar">
        Se você rodar <code>sudo apt install alguma-coisa</code> sem antes fazer
        <code>sudo apt update</code>, pode instalar uma versão desatualizada do pacote ou
        receber erros de dependência. Sempre atualize a lista primeiro.
      </AlertBox>

      <h2>2. Instalação de Pacotes</h2>
      <CodeBlock
        title="Instalar software com apt"
        code={`# Instalar um único pacote
sudo apt install vim

# Instalar múltiplos pacotes de uma vez
sudo apt install git curl wget htop

# Instalar sem confirmação (útil em scripts)
sudo apt install -y nginx mysql-server php

# Instalar uma versão específica
sudo apt install firefox=124.0+build3-0ubuntu0.24.04.1

# Instalar pacote .deb local
sudo apt install ./nome-do-arquivo.deb
# (O apt resolve as dependências automaticamente!)

# Reinstalar um pacote (útil se ficou corrompido)
sudo apt install --reinstall nginx

# Instalar sem pacotes recomendados (instalação mais enxuta)
sudo apt install --no-install-recommends python3`}
      />

      <h2>3. Busca e Informações</h2>
      <CodeBlock
        title="Pesquisar e inspecionar pacotes"
        code={`# Buscar pacotes pelo nome ou descrição
apt search vlc
apt search "video player"

# Ver informações detalhadas de um pacote (ANTES de instalar)
apt show nginx

# Saída do apt show:
# Package: nginx
# Version: 1.24.0-2ubuntu7
# Priority: optional
# Section: web
# Installed-Size: 3.021 kB
# Depends: libpcre2-8-0, ...
# Description: small, powerful, scalable web/proxy server

# Listar todos os pacotes instalados
apt list --installed

# Ver se um pacote específico está instalado
dpkg -l nginx
apt list --installed | grep nginx

# Ver quais arquivos um pacote instalou
dpkg -L nginx

# Descobrir qual pacote fornece um arquivo específico
dpkg -S /usr/bin/python3

# Ver dependências de um pacote
apt depends nginx

# Ver quais pacotes dependem de um dado pacote
apt rdepends nginx`}
      />

      <h2>4. Remoção de Pacotes</h2>
      <CodeBlock
        title="Remover software de forma limpa"
        code={`# Remover pacote (mantém arquivos de configuração)
sudo apt remove nginx

# Remover pacote E arquivos de configuração (purge)
sudo apt purge nginx
# Use purge quando quiser começar do zero com um serviço

# Remover dependências que não são mais necessárias
sudo apt autoremove

# Remover E limpar dependências (o mais completo):
sudo apt purge nginx && sudo apt autoremove

# Remover múltiplos pacotes de uma vez
sudo apt purge apache2 apache2-utils apache2-data`}
      />

      <AlertBox type="warning" title="remove vs purge">
        <code>apt remove</code> remove os binários mas mantém arquivos de configuração em
        <code>/etc/</code>. <code>apt purge</code> remove tudo, incluindo as configurações.
        Se você vai reinstalar o serviço, use <code>remove</code>. Se quer começar do zero
        (ex: limpar configurações ruins do MySQL), use <code>purge</code>.
      </AlertBox>

      <h2>5. Limpeza de Cache</h2>
      <CodeBlock
        title="Liberar espaço em disco"
        code={`# O APT guarda todos os .deb baixados em /var/cache/apt/archives/
# Com o tempo, isso pode ocupar vários GB

# Ver quanto espaço o cache ocupa:
du -sh /var/cache/apt/archives/

# Remover .deb de versões antigas (mantém a versão atual)
sudo apt autoclean

# Remover TODOS os .deb do cache (economiza mais espaço)
sudo apt clean

# Ver o que o autoremove iria remover sem fazer nada:
sudo apt autoremove --dry-run

# Remover pacotes desnecessários + limpar cache:
sudo apt autoremove -y && sudo apt clean`}
      />

      <h2>6. Repositórios e Sources.list</h2>
      <p>
        O APT busca pacotes em <strong>repositórios</strong>. A lista de repositórios fica em
        <code>/etc/apt/sources.list</code> e nos arquivos em <code>/etc/apt/sources.list.d/</code>.
      </p>
      <CodeBlock
        title="Entendendo e gerenciando repositórios"
        code={`# Ver repositórios configurados:
cat /etc/apt/sources.list

# Formato de uma linha de repositório:
# deb https://archive.ubuntu.com/ubuntu noble main restricted universe multiverse
# ^   ^                                 ^      ^    ^         ^        ^
# tipo  URL do servidor                  codinome componentes

# Habilitar repositório universe (pacotes da comunidade):
sudo add-apt-repository universe

# Habilitar multiverse (software com restrições de licença):
sudo add-apt-repository multiverse

# Adicionar repositório PPA (Personal Package Archive):
sudo add-apt-repository ppa:nome/repositorio

# Exemplos de PPAs populares:
sudo add-apt-repository ppa:graphics-drivers/ppa     # Drivers NVIDIA recentes
sudo add-apt-repository ppa:neovim-ppa/unstable      # Neovim mais recente
sudo add-apt-repository ppa:librecad-dev/librecad    # LibreCAD atualizado

# Remover um PPA:
sudo add-apt-repository --remove ppa:nome/repositorio

# Após adicionar qualquer repositório, sempre atualize:
sudo apt update`}
      />

      <h2>7. Repositório de Terceiros (Manual)</h2>
      <CodeBlock
        title="Adicionar repositório de terceiros com chave GPG"
        code={`# Exemplo: Adicionar repositório oficial do VS Code (Microsoft)

# 1. Baixar e instalar a chave GPG do repositório
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | \\
    gpg --dearmor | \\
    sudo tee /usr/share/keyrings/microsoft.gpg > /dev/null

# 2. Adicionar o repositório
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft.gpg] \\
    https://packages.microsoft.com/repos/code stable main" | \\
    sudo tee /etc/apt/sources.list.d/vscode.list

# 3. Atualizar e instalar
sudo apt update
sudo apt install code

# O mesmo processo funciona para: Docker, NodeJS, PostgreSQL,
# MongoDB, Google Chrome, GitHub CLI, e muitos outros.`}
      />

      <h2>8. Comandos Úteis do dpkg</h2>
      <CodeBlock
        title="dpkg — gerenciador de pacotes de baixo nível"
        code={`# Instalar um arquivo .deb manualmente
sudo dpkg -i google-chrome-stable_current_amd64.deb
# Se faltar dependências, corrija com:
sudo apt install -f

# Ver todos os pacotes instalados
dpkg -l

# Ver arquivos instalados por um pacote
dpkg -L firefox

# Ver qual pacote instalou um arquivo específico
dpkg -S /usr/bin/firefox

# Verificar status de um pacote
dpkg -s nginx

# Extrair arquivos de um .deb sem instalar
dpkg -x arquivo.deb /pasta/destino

# Reconfigurar pacote (útil quando pede perguntas de configuração)
sudo dpkg-reconfigure tzdata
sudo dpkg-reconfigure locales`}
      />

      <h2>9. apt-cache: Consultas Avançadas</h2>
      <CodeBlock
        title="apt-cache para consultas rápidas"
        code={`# Buscar pacotes (mais rápido que apt search)
apt-cache search python3

# Ver informações de um pacote
apt-cache show python3

# Ver dependências
apt-cache depends python3

# Ver o que depende de um pacote
apt-cache rdepends python3

# Mostrar estatísticas dos repositórios
apt-cache stats`}
      />
    </PageContainer>
  );
}
