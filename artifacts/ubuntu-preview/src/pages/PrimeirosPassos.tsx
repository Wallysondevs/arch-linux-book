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

# Instalar todas as atualizações disponíveis
sudo apt upgrade -y

# Atualizar também pacotes que requerem remover outros (mudanças maiores)
sudo apt full-upgrade -y

# Remover pacotes que não são mais necessários
sudo apt autoremove -y

# Limpar cache de pacotes baixados
sudo apt autoclean`}
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
        code={`# Verificar se tem GPU NVIDIA
lspci | grep -i nvidia

# Método 1: Via utilitário de drivers adicionais (recomendado)
sudo ubuntu-drivers autoinstall

# Método 2: Instalar versão específica manualmente
# Ver drivers disponíveis:
ubuntu-drivers devices
# == /sys/devices/pci0000:00/0000:00:02.0 ==
# modalias : pci:v000010DEd...
# driver   : nvidia-driver-550 - distro non-free recommended ← instale este
# driver   : nvidia-driver-535 - distro non-free

sudo apt install nvidia-driver-550

# Após instalar qualquer driver NVIDIA:
sudo reboot  # OBRIGATÓRIO reiniciar!

# Verificar se o driver foi carregado:
nvidia-smi`}
      />

      <h3>Driver Wi-Fi Proprietário</h3>
      <CodeBlock
        title="Instalar drivers de Wi-Fi"
        code={`# Verificar adaptador Wi-Fi
lspci | grep -i wireless
lsusb | grep -i wireless

# Se o Wi-Fi não funcionar, tente instalar drivers adicionais:
# Configurações → Software e Atualizações → Drivers Adicionais
# Ou via terminal:

# Para Broadcom (comum em notebooks):
sudo apt install broadcom-sta-dkms

# Para Realtek:
sudo apt install rtl8821ce-dkms  # Modelo específico, varia

# Para Intel (raramente precisa):
sudo apt install firmware-misc-nonfree  # Não disponível no Ubuntu padrão

# Após instalar:
sudo modprobe -r <driver_antigo>
sudo modprobe <driver_novo>
# Ou simplesmente reinicie`}
      />

      <h2>3. Configurar Idioma e Fuso Horário</h2>
      <CodeBlock
        title="Configurar localização completa"
        code={`# Verificar configuração atual
locale
timedatectl

# Instalar suporte completo ao idioma (se precisar):
# Configurações → Região e Idioma → Instalar idiomas
# Ou via terminal:
sudo apt install language-pack-pt language-pack-gnome-pt

# Configurar fuso horário de São Paulo (GMT-3):
sudo timedatectl set-timezone America/Sao_Paulo

# Ou para outras cidades brasileiras:
sudo timedatectl set-timezone America/Manaus      # Amazonas (GMT-4)
sudo timedatectl set-timezone America/Belem       # Pará (GMT-3)
sudo timedatectl set-timezone America/Fortaleza   # Ceará (GMT-3)
sudo timedatectl set-timezone America/Recife      # Pernambuco (GMT-3)

# Ativar sincronização de hora via NTP (normalmente já está ativo):
sudo timedatectl set-ntp true

# Verificar:
timedatectl status`}
      />

      <h2>4. Instalar Pacotes Essenciais</h2>
      <CodeBlock
        title="Ferramentas essenciais para qualquer instalação"
        code={`sudo apt install -y \\
    build-essential      \\  # gcc, make, g++ (compilação de software)
    git                  \\  # controle de versão
    curl wget            \\  # baixar arquivos pela internet
    vim nano             \\  # editores de texto no terminal
    htop btop            \\  # monitores de sistema interativos
    net-tools            \\  # ifconfig, netstat (ferramentas de rede clássicas)
    openssh-server       \\  # servidor SSH (para acesso remoto)
    ufw                  \\  # firewall simplificado
    unzip p7zip-full     \\  # descompactar arquivos .zip e .7z
    tree                 \\  # listar diretórios em formato de árvore
    rsync                \\  # sincronização de arquivos
    tldr                 \\  # versão simplificada dos manuais (man)
    bash-completion      \\  # autocomplete inteligente no terminal
    software-properties-common  # gerenciar repositórios PPA`}
      />

      <h2>5. Habilitar Repositórios Extras</h2>
      <CodeBlock
        title="Ativar repositórios universe, multiverse e restricted"
        code={`# Verificar repositórios ativos:
cat /etc/apt/sources.list

# Habilitar repositórios adicionais:
sudo add-apt-repository universe    # Pacotes mantidos pela comunidade
sudo add-apt-repository multiverse  # Pacotes não-livres (proprietários)
sudo add-apt-repository restricted  # Drivers proprietários

# Atualizar após adicionar repositórios:
sudo apt update

# Instalar codecs de multimídia (MP3, H.264, AAC etc.):
sudo apt install ubuntu-restricted-extras

# Para DVD (criptografia):
sudo apt install libdvd-pkg
sudo dpkg-reconfigure libdvd-pkg`}
      />

      <AlertBox type="info" title="O que são esses repositórios?">
        <ul className="mt-1 mb-0">
          <li><strong>main</strong>: Pacotes livres suportados oficialmente pela Canonical (já ativo)</li>
          <li><strong>universe</strong>: Pacotes livres mantidos pela comunidade (não há garantia de suporte)</li>
          <li><strong>restricted</strong>: Drivers proprietários necessários para hardware específico</li>
          <li><strong>multiverse</strong>: Software com restrições de uso (copyright, patentes)</li>
        </ul>
      </AlertBox>

      <h2>6. Configurar o Firewall (UFW)</h2>
      <CodeBlock
        title="Configuração básica do UFW"
        code={`# O UFW já vem instalado no Ubuntu. Verificar status:
sudo ufw status
# Status: inactive

# Configurar política padrão:
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Permitir SSH (se for usar acesso remoto):
sudo ufw allow ssh

# Habilitar o firewall:
sudo ufw enable

# Verificar regras ativas:
sudo ufw status verbose`}
      />

      <h2>7. Configurar Atualizações Automáticas de Segurança</h2>
      <CodeBlock
        title="Unattended Upgrades (atualizações automáticas)"
        code={`# Verificar se está instalado e configurado:
dpkg -l unattended-upgrades

# Instalar e configurar:
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades

# Verificar configuração:
cat /etc/apt/apt.conf.d/20auto-upgrades
# APT::Periodic::Update-Package-Lists "1";
# APT::Periodic::Unattended-Upgrade "1";

# Ver log de atualizações automáticas:
cat /var/log/unattended-upgrades/unattended-upgrades.log`}
      />

      <h2>8. Instalar Aplicativos do Dia a Dia</h2>
      <CodeBlock
        title="Aplicativos comuns para Ubuntu Desktop"
        code={`# Navegadores
sudo apt install chromium-browser         # Chromium (open-source)
sudo snap install brave                    # Brave (mais privado)

# Comunicação
sudo snap install discord
sudo snap install telegram-desktop

# Desenvolvimento
sudo snap install code --classic           # VS Code
sudo apt install git gitk git-gui

# Multimídia
sudo apt install vlc                       # Player de vídeo/áudio
sudo apt install gimp                      # Editor de imagens
sudo snap install spotify                  # Streaming de música

# Produtividade
sudo snap install notion-snap-reborn
sudo apt install obsidian                  # Notas em Markdown

# Utilitários
sudo apt install gparted                   # Editor de partições gráfico
sudo apt install timeshift                 # Backup e restauração do sistema
sudo snap install deja-dup                 # Backup simples de arquivos`}
      />

      <h2>9. Terminal: Melhorar a Experiência</h2>
      <CodeBlock
        title="Configurar um terminal mais produtivo"
        code={`# Instalar Zsh (shell mais moderno que Bash)
sudo apt install zsh

# Instalar Oh My Zsh (gerenciador de plugins e temas para Zsh)
sh -c "\$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Instalar terminal com abas e splits:
sudo apt install tilix       # Tilix: excelente para Linux
# Ou:
sudo apt install terminator  # Terminator: clássico e confiável

# Instalar fontes Nerd Fonts para ícones no terminal:
sudo apt install fonts-firacode  # Fira Code (uma das mais populares)

# Configurar cores e temas no GNOME Terminal:
# Clique direito no terminal → Preferências`}
      />
    </PageContainer>
  );
}
