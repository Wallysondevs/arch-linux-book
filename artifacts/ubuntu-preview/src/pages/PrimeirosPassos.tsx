import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PrimeirosPassos() {
  return (
    <PageContainer
      title="Primeiros Passos Pós-Instalação"
      subtitle="Acabou de instalar o Ubuntu? Configure drivers, repositórios, idioma e aplicativos essenciais para ter um sistema completo."
      difficulty="iniciante"
      timeToRead="20 min"
    >
      <p>
        Parabéns pela instalação! O Ubuntu já vem bastante completo, mas há algumas configurações
        importantes a fazer logo após a primeira inicialização. Siga estes passos em ordem
        para garantir um sistema atualizado, com todos os drivers corretos e as ferramentas
        que você vai usar no dia a dia.
      </p>

      <h2>1. Atualizar o Sistema Completamente</h2>
      <p>
        A primeira coisa sempre é atualizar — a ISO que você usou para instalar pode ter
        algumas semanas de atraso. Garanta que tudo está na versão mais recente:
      </p>
      <CodeBlock
        title="Atualização completa do sistema"
        code={`# Atualizar a lista de pacotes disponíveis
sudo apt update
# Não instala nada — apenas verifica o que há de novo nos repositórios.

# Instalar todas as atualizações disponíveis
sudo apt upgrade -y
# -y (ou --yes) = responde "sim" automaticamente para todas as confirmações.
# Sem o -y, o apt pergunta "Deseja continuar? [S/n]" antes de cada ação.

# Atualizar também pacotes que requerem remover outros (mudanças maiores)
sudo apt full-upgrade -y
# full-upgrade vai além do upgrade: pode instalar E remover pacotes se necessário.
# Necessário para atualizar o kernel e pacotes com mudanças de dependências.

# Remover pacotes que não são mais necessários
sudo apt autoremove -y
# Com o tempo, pacotes que eram dependências de outros ficam "órfãos".
# autoremove os identifica e remove automaticamente.

# Limpar cache de pacotes baixados (libera espaço em disco)
sudo apt autoclean
# autoclean remove apenas versões ANTIGAS dos .deb do cache.
# Usa apt clean (sem "auto") para apagar o cache inteiro.`}
      />

      <AlertBox type="info" title="apt update vs apt upgrade">
        <code>apt update</code> apenas atualiza a <em>lista</em> de pacotes disponíveis (como
        verificar se há atualizações). Não instala nada. <code>apt upgrade</code> de fato
        instala as atualizações. Sempre faça os dois juntos.
      </AlertBox>

      <h2>2. Instalar Drivers de Hardware</h2>

      <h3>Driver NVIDIA (GPU dedicada)</h3>
      <CodeBlock
        title="Instalar drivers NVIDIA recomendados"
        code={`# Verificar se tem GPU NVIDIA conectada
lspci | grep -i nvidia
# lspci = listar dispositivos PCI (placa de vídeo, placa de rede, etc.)
# | = pipe: passa a saída do lspci como entrada do grep
# grep = filtrar linhas que contêm um texto
# -i = case insensitive (encontrar "NVIDIA", "nvidia", "Nvidia" — qualquer capitalização)

# Método 1: Via utilitário de drivers adicionais (recomendado)
sudo ubuntu-drivers autoinstall
# ubuntu-drivers detecta seu hardware e instala o driver mais adequado automaticamente.

# Método 2: Instalar versão específica manualmente
# Ver drivers disponíveis:
ubuntu-drivers devices
# == /sys/devices/pci0000:00/0000:00:02.0 ==
# modalias : pci:v000010DEd...
# driver   : nvidia-driver-550 - distro non-free recommended ← instale este
# driver   : nvidia-driver-535 - distro non-free

sudo apt install nvidia-driver-550

# Após instalar qualquer driver NVIDIA, o reboot é obrigatório!
sudo reboot

# Verificar se o driver foi carregado corretamente:
nvidia-smi
# smi = System Management Interface — mostra GPU, temperatura, uso de VRAM`}
      />

      <h3>Driver Wi-Fi Proprietário</h3>
      <CodeBlock
        title="Instalar drivers de Wi-Fi"
        code={`# Verificar adaptador Wi-Fi
lspci | grep -i wireless
# -i = ignorar diferença entre maiúsculas e minúsculas na busca
lsusb | grep -i wireless
# lsusb = listar dispositivos USB (adaptadores Wi-Fi USB aparecem aqui)

# Se o Wi-Fi não funcionar, abra:
# Configurações → Software e Atualizações → Drivers Adicionais
# O Ubuntu detecta e lista os drivers proprietários disponíveis para seu hardware.

# Ou via terminal, para Broadcom (comum em notebooks):
sudo apt install broadcom-sta-dkms
# dkms = Dynamic Kernel Module Support (recompila o driver automaticamente
# para cada nova versão do kernel — você não precisa reinstalar manualmente)

# Após instalar:
sudo modprobe -r b43          # -r = remove o módulo antigo do kernel
sudo modprobe wl              # carrega o novo módulo (driver Broadcom)`}
      />

      <h2>3. Configurar Idioma e Fuso Horário</h2>
      <CodeBlock
        title="Configurar localização completa"
        code={`# Verificar configuração atual de idioma e fuso horário
locale        # Mostra as configurações de idioma
timedatectl   # Mostra fuso horário e hora atual

# Configurar fuso horário de São Paulo (GMT-3):
sudo timedatectl set-timezone America/Sao_Paulo

# Outros fusos horários brasileiros:
sudo timedatectl set-timezone America/Manaus      # Amazonas (GMT-4)
sudo timedatectl set-timezone America/Belem       # Pará (GMT-3)
sudo timedatectl set-timezone America/Fortaleza   # Ceará (GMT-3)

# Ativar sincronização automática de hora via NTP:
sudo timedatectl set-ntp true
# NTP = Network Time Protocol — sincroniza o relógio com servidores de tempo na internet
# true = habilitar | false = desabilitar

# Verificar resultado:
timedatectl status`}
      />

      <h2>4. Instalar Pacotes Essenciais</h2>
      <CodeBlock
        title="Ferramentas essenciais para qualquer instalação"
        code={`# A \\ (barra invertida) no final de cada linha significa "continuar na próxima linha".
# É apenas uma forma de deixar o comando mais legível — tudo é um único comando.

sudo apt install -y \\
    build-essential   \\
    # build-essential = grupo de ferramentas de compilação: gcc, make, g++
    # necessário para compilar programas a partir do código-fonte e instalar alguns pacotes

    git               \\
    # git = sistema de controle de versão (essencial para desenvolvimento)

    curl wget         \\
    # curl e wget = baixar arquivos pela internet via terminal
    # curl = mais versátil (suporta APIs, cookies, etc.)
    # wget = mais simples, ótimo para downloads diretos

    vim nano          \\
    # vim e nano = editores de texto no terminal
    # nano = mais simples, ideal para iniciantes
    # vim = poderoso e eficiente, curva de aprendizado maior

    htop btop         \\
    # htop e btop = monitores de sistema interativos (CPU, RAM, processos)
    # são versões visuais e coloridas do comando "top"

    net-tools         \\
    # net-tools = pacote com ifconfig, netstat e outras ferramentas de rede clássicas

    openssh-server    \\
    # openssh-server = servidor SSH, permite acessar este computador remotamente

    ufw               \\
    # ufw = Uncomplicated Firewall — interface simplificada para configurar firewall

    unzip p7zip-full  \\
    # unzip = descompactar arquivos .zip
    # p7zip-full = suporte ao formato .7z (7-Zip)

    tree              \\
    # tree = listar diretórios em formato visual de árvore

    rsync             \\
    # rsync = sincronizar arquivos entre diretórios ou computadores
    # muito usado para backups incrementais (copia apenas o que mudou)

    tldr              \\
    # tldr = "Too Long; Didn't Read" — resumo prático dos manuais de comandos
    # alternativa rápida ao "man" para ver exemplos comuns de uso

    bash-completion   \\
    # bash-completion = autocomplete inteligente no terminal
    # pressione Tab e o bash completa comandos, nomes de pacotes, opções, etc.

    software-properties-common
    # necessário para usar o comando add-apt-repository (adicionar repositórios PPA)`}
      />

      <h2>5. Habilitar Repositórios Extras</h2>
      <CodeBlock
        title="Ativar repositórios universe, multiverse e restricted"
        code={`# Verificar repositórios ativos:
cat /etc/apt/sources.list
# cat = mostrar o conteúdo de um arquivo na tela

# Habilitar repositórios adicionais:
sudo add-apt-repository universe
# universe = pacotes open source mantidos pela comunidade (não pela Canonical)

sudo add-apt-repository multiverse
# multiverse = software proprietário ou com restrições legais (ex: codecs MP3, MP4)

sudo add-apt-repository restricted
# restricted = drivers proprietários (NVIDIA, Wi-Fi Broadcom, etc.)

# Atualizar a lista após adicionar repositórios:
sudo apt update
# Sempre necessário após adicionar um repositório novo!

# Instalar codecs de multimídia (MP3, H.264, AAC, etc.):
sudo apt install ubuntu-restricted-extras
# ubuntu-restricted-extras = pacote que instala os codecs mais comuns
# necessário para reproduzir a maioria dos vídeos e músicas`}
      />

      <AlertBox type="info" title="O que são esses repositórios?">
        <ul className="mt-1 mb-0">
          <li><strong>main</strong>: Pacotes livres suportados oficialmente pela Canonical (já ativo por padrão)</li>
          <li><strong>universe</strong>: Pacotes livres mantidos pela comunidade (sem garantia de suporte)</li>
          <li><strong>restricted</strong>: Drivers proprietários necessários para hardware específico</li>
          <li><strong>multiverse</strong>: Software com restrições de uso (copyright, patentes)</li>
        </ul>
      </AlertBox>

      <h2>6. Configurar o Firewall (UFW)</h2>
      <CodeBlock
        title="Configuração básica do UFW"
        code={`# O UFW já vem instalado no Ubuntu. Verificar status:
sudo ufw status
# Status: inactive  ← desabilitado por padrão

# Configurar política padrão (fazer ANTES de habilitar):
sudo ufw default deny incoming
# deny = negar/bloquear
# incoming = conexões que chegam de fora ao seu computador

sudo ufw default allow outgoing
# allow = permitir
# outgoing = conexões que saem do seu computador para a internet

# Permitir SSH (acesso remoto) — faça isso ANTES de habilitar se for usar SSH:
sudo ufw allow ssh
# Equivalente a: sudo ufw allow 22/tcp
# ssh é um "alias" que o UFW já conhece (porta 22, protocolo TCP)

# Habilitar o firewall:
sudo ufw enable

# Verificar regras ativas:
sudo ufw status verbose
# verbose = modo detalhado (mostra mais informações do que o status simples)`}
      />

      <h2>7. Atualizações Automáticas de Segurança</h2>
      <CodeBlock
        title="Unattended Upgrades (atualizações automáticas)"
        code={`# Verificar se está instalado:
dpkg -l unattended-upgrades
# dpkg = gerenciador de pacotes de baixo nível
# -l = list (listar pacotes instalados)

# Instalar e configurar:
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
# --priority=low = mostrar todas as perguntas de configuração (não pular nenhuma)
# dpkg-reconfigure = refazer as perguntas de configuração de um pacote

# Verificar configuração:
cat /etc/apt/apt.conf.d/20auto-upgrades
# O arquivo deve conter:
# APT::Periodic::Update-Package-Lists "1";   ← atualizar lista diariamente
# APT::Periodic::Unattended-Upgrade "1";    ← instalar atualizações de segurança`}
      />

      <h2>8. Instalar Aplicativos do Dia a Dia</h2>
      <CodeBlock
        title="Aplicativos comuns para Ubuntu Desktop"
        code={`# Navegadores
sudo apt install chromium-browser      # Chromium: versão open-source do Chrome

# Snaps: pacotes independentes do sistema que incluem suas próprias dependências
sudo snap install brave                # Brave: focado em privacidade
# snap install = equivalente ao apt install, mas para pacotes Snap

# Comunicação
sudo snap install discord
sudo snap install telegram-desktop

# Desenvolvimento
sudo snap install code --classic       # VS Code
# --classic = acesso irrestrito ao sistema (necessário para IDEs e editores de código)
# sem --classic, snaps ficam isolados do sistema de arquivos

sudo apt install git gitk git-gui

# Multimídia
sudo apt install vlc                   # VLC: player de vídeo e áudio completo
sudo apt install gimp                  # GIMP: editor de imagens (alternativa ao Photoshop)
sudo snap install spotify              # Spotify: streaming de música

# Utilitários
sudo apt install gparted               # GParted: editor gráfico de partições de disco
sudo apt install timeshift             # Timeshift: backup e restauração do sistema`}
      />
    </PageContainer>
  );
}
