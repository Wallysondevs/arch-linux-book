import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PrimeirosPassos() {
  return (
    <PageContainer
      title="Primeiros Passos Pós-Instalação"
      subtitle="Acabou de instalar o Arch Linux? Este guia detalhado vai te levar de um sistema mínimo com apenas um terminal até uma máquina completa e pronta para o dia a dia."
      difficulty="iniciante"
      timeToRead="40 min"
    >
      <h2>Parabéns pela Instalação!</h2>
      <p>
        Se você chegou até aqui, já passou pela parte mais desafiadora do Arch Linux: a instalação manual.
        Agora você tem um sistema mínimo — apenas um terminal preto com um cursor piscando. Sem interface
        gráfica, sem navegador, sem nada bonito. E é exatamente assim que deve ser.
      </p>
      <p>
        O Arch Linux não instala nada que você não pediu. Isso significa que <strong>você</strong> vai
        escolher cada componente do seu sistema. Parece trabalhoso, mas isso garante que você tenha um
        sistema limpo, rápido e que você entende completamente.
      </p>
      <p>
        Neste guia, vamos configurar tudo que é necessário para transformar esse terminal em um sistema
        funcional. Siga na ordem — alguns passos dependem de outros.
      </p>

      <AlertBox type="warning" title="Ordem importa!">
        <p>Siga os passos nesta ordem. Não pule para a instalação do ambiente gráfico sem antes
        configurar a internet e atualizar o sistema. Instalar pacotes sem internet obviamente não funciona,
        e instalar coisas sem atualizar pode causar conflitos de versão.</p>
      </AlertBox>

      <h2>1. Conectar à Internet</h2>
      <p>
        A primeira coisa que você precisa fazer é conectar à internet. Sem internet, não dá para baixar
        nenhum pacote adicional. Existem duas formas principais de se conectar.
      </p>

      <h3>Via Cabo Ethernet (o mais fácil)</h3>
      <p>
        Se você plugou um cabo de rede no computador, o Arch Linux já deve estar conectado automaticamente
        via DHCP. Você pode verificar com o comando <code>ping</code>:
      </p>
      <CodeBlock
        title="Verificar se tem internet"
        code={`# Enviar 3 pacotes de teste para o site do Arch Linux
ping -c 3 archlinux.org

# Saída esperada (se conectado):
# PING archlinux.org (95.217.163.246) 56(84) bytes of data.
# 64 bytes from archlinux.org (95.217.163.246): icmp_seq=1 ttl=47 time=142 ms
# 64 bytes from archlinux.org (95.217.163.246): icmp_seq=2 ttl=47 time=141 ms
# 64 bytes from archlinux.org (95.217.163.246): icmp_seq=3 ttl=47 time=141 ms
# --- archlinux.org ping statistics ---
# 3 packets transmitted, 3 received, 0% packet loss

# Se aparecer "3 received, 0% packet loss", você já tem internet!
# Se aparecer "Network is unreachable" ou "Name resolution failed", continue lendo.`}
      />
      <p>
        O <code>-c 3</code> significa "envie 3 pacotes e pare". Sem ele, o ping ficaria rodando
        eternamente até você apertar <code>Ctrl+C</code> para interromper.
      </p>

      <h3>Via Wi-Fi com iwctl (Explicação Completa)</h3>
      <p>
        O <code>iwctl</code> é a ferramenta de linha de comando do <strong>iwd</strong> (iNet wireless daemon).
        Ele é o gerenciador de Wi-Fi que vem incluído na ISO de instalação do Arch Linux.
        Diferente de ferramentas como o NetworkManager, o iwd é extremamente leve e rápido — ideal
        para a instalação ou sistemas minimalistas.
      </p>
      <p>
        <strong>O que o iwctl faz?</strong> Ele permite que você escaneie redes Wi-Fi disponíveis,
        conecte a elas digitando a senha, gerencie redes salvas e controle seus dispositivos wireless,
        tudo pelo terminal.
      </p>

      <h4>O que aparece quando você digita iwctl --help</h4>
      <p>
        Se você digitar <code>iwctl --help</code> no terminal, vai ver algo assim:
      </p>
      <CodeBlock
        title="iwctl --help"
        code={`$ iwctl --help

Usage: iwctl [OPTIONS] [COMMAND [ARGS...]]

Options:
  -p, --passphrase          Passphrase to connect to the network
  -v, --version             Display version
  -h, --help                Display help

Available commands:
  ad-hoc                    Manage ad-hoc devices
  adapter                   Manage adapters
  ap                        Manage access point devices
  debug                     Manage debug utilities
  device                    Manage devices
  dpp                       Manage DPP operations
  known-networks            Manage known networks
  station                   Manage station devices
  wsc                       Manage WSC operations

# Cada um desses "comandos" é na verdade uma CATEGORIA de subcomandos.
# Os mais importantes para você são: device, station e known-networks.`}
      />

      <AlertBox type="info" title="Modo Interativo vs Linha de Comando">
        <p>O iwctl tem dois modos de uso:</p>
        <p><strong>1. Modo interativo:</strong> Você digita <code>iwctl</code> sozinho e entra num prompt
        especial <code>[iwd]#</code> onde pode digitar comandos um por um.</p>
        <p><strong>2. Modo direto:</strong> Você digita tudo em uma linha só, como
        <code>iwctl station wlan0 scan</code>. Mais rápido se você já sabe o que quer fazer.</p>
      </AlertBox>

      <h4>Passo 1: Descobrir seu dispositivo wireless</h4>
      <p>
        Primeiro, você precisa saber o nome do seu adaptador Wi-Fi. Na maioria dos computadores
        é <code>wlan0</code>, mas pode variar.
      </p>
      <CodeBlock
        title="Listar dispositivos wireless"
        code={`# Entrar no modo interativo
iwctl

# Dentro do iwctl, listar dispositivos:
[iwd]# device list

# Saída esperada:
#                             Devices
# ---------------------------------------------------------------
#   Name       Address            Powered   Adapter   Mode
# ---------------------------------------------------------------
#   wlan0      xx:xx:xx:xx:xx:xx  on        phy0      station
#
# "Name" = nome do dispositivo (geralmente wlan0)
# "Powered" = se está ligado (on) ou desligado (off)
# "Mode" = modo de operação (station = modo cliente normal)

# Se "Powered" estiver "off", ligue o dispositivo:
[iwd]# device wlan0 set-property Powered on

# Ou via adapter:
[iwd]# adapter phy0 set-property Powered on`}
      />

      <AlertBox type="danger" title="Dispositivo não aparece?">
        <p>Se o comando <code>device list</code> não mostra nada, pode ser que:</p>
        <p>1. Seu computador não tem placa Wi-Fi (verifique com <code>lspci | grep -i wireless</code>)</p>
        <p>2. O driver não foi carregado (verifique com <code>dmesg | grep -i wifi</code>)</p>
        <p>3. O Wi-Fi está desabilitado por hardware (verifique o botão/switch físico do notebook)</p>
        <p>4. O Wi-Fi está bloqueado por software (verifique com <code>rfkill list</code> e desbloqueie com <code>rfkill unblock wifi</code>)</p>
      </AlertBox>

      <h4>Passo 2: Escanear redes disponíveis</h4>
      <CodeBlock
        title="Escanear e listar redes Wi-Fi"
        code={`# Escanear redes (o comando em si não mostra nada, ele só inicia o escaneamento)
[iwd]# station wlan0 scan

# Agora sim, listar as redes encontradas:
[iwd]# station wlan0 get-networks

# Saída esperada:
#                     Available Networks
# ---------------------------------------------------------------
#       Network Name            Security    Signal
# ---------------------------------------------------------------
#       MinhaRede               psk         ****
#       Vizinho_5G              psk         **
#       Cafe_WiFi               open        ***
#       Escritorio              psk         ****
#
# "Security":
#   psk  = WPA/WPA2 (tem senha - é o mais comum)
#   open = Rede aberta (sem senha)
#   8021x = Rede corporativa (com certificado)
#
# "Signal": quantidade de asteriscos = força do sinal
#   **** = Excelente
#   ***  = Bom
#   **   = Fraco
#   *    = Muito fraco`}
      />

      <h4>Passo 3: Conectar a uma rede</h4>
      <CodeBlock
        title="Conectar ao Wi-Fi"
        code={`# Conectar a uma rede com senha (vai pedir a passphrase interativamente)
[iwd]# station wlan0 connect "MinhaRede"

# O iwctl vai pedir a senha:
# Passphrase: ********
# (você digita a senha e aperta Enter - os caracteres não aparecem)

# Se a conexão foi bem sucedida, não vai mostrar mensagem de erro.
# Você pode verificar o status da conexão:
[iwd]# station wlan0 show

# Saída esperada:
#                         Station: wlan0
# ---------------------------------------------------------------
#   Settable  Property            Value
# ---------------------------------------------------------------
#             Scanning            no
#             State               connected        <-- CONECTADO!
#             Connected network   MinhaRede        <-- Nome da rede
#
# "State: connected" = Você está conectado com sucesso!
# "State: disconnected" = Não conectou, verifique a senha.

# Sair do iwctl
[iwd]# exit`}
      />

      <h4>Modo Direto (uma linha só)</h4>
      <p>Se você já sabe o nome da rede e quer fazer tudo rápido:</p>
      <CodeBlock
        title="iwctl em modo direto (sem entrar no modo interativo)"
        code={`# Escanear
iwctl station wlan0 scan

# Ver redes
iwctl station wlan0 get-networks

# Conectar (passando a senha diretamente com -p)
iwctl --passphrase "minha_senha_aqui" station wlan0 connect "MinhaRede"

# Verificar status
iwctl station wlan0 show

# Desconectar
iwctl station wlan0 disconnect`}
      />

      <h4>Gerenciar redes salvas</h4>
      <p>
        O iwctl lembra das redes que você já conectou. Você pode ver e gerenciar elas:
      </p>
      <CodeBlock
        title="Redes conhecidas (salvas)"
        code={`# Listar redes salvas
iwctl known-networks list

# Saída esperada:
#                     Known Networks
# ---------------------------------------------------------------
#       Name                Security    Hidden    Last connected
# ---------------------------------------------------------------
#       MinhaRede           psk         no        Mar 26, 2026
#       Cafe_WiFi           open        no        Mar 20, 2026

# Esquecer uma rede salva
iwctl known-networks "Cafe_WiFi" forget

# Configurar conexão automática para uma rede salva
iwctl known-networks "MinhaRede" set-property AutoConnect yes`}
      />

      <AlertBox type="success" title="Verificar se a internet funciona">
        <p>Depois de conectar, sempre teste com <code>ping -c 3 archlinux.org</code>.
        Se receber resposta, parabéns, você está online!</p>
      </AlertBox>

      <h3>iwctl vs NetworkManager - Quando usar cada um</h3>
      <p>
        Agora que você sabe usar o <code>iwctl</code>, precisa entender quando usar ele e quando
        migrar para o <code>NetworkManager</code>:
      </p>
      <ul>
        <li><strong>iwctl (iwd)</strong>: Ideal para a instalação e sistemas sem interface gráfica. É leve, rápido e já vem na ISO do Arch. Mas ele <strong>só gerencia Wi-Fi</strong> — não cuida de ethernet, VPN, proxy, etc.</li>
        <li><strong>NetworkManager</strong>: Ideal para o dia a dia, especialmente se você vai usar um ambiente gráfico (GNOME, KDE, etc.). Ele gerencia Wi-Fi, ethernet, VPN, proxy, e se integra com os applets gráficos das barras de tarefas. Ele reconecta automaticamente quando você troca de rede.</li>
      </ul>
      <p>
        <strong>Recomendação:</strong> Use o <code>iwctl</code> durante a instalação e primeiros passos.
        Depois que instalar o <code>NetworkManager</code>, desabilite o <code>iwd</code> para evitar conflitos:
      </p>
      <CodeBlock
        title="Migrar de iwctl para NetworkManager"
        code={`# Instalar o NetworkManager
sudo pacman -S networkmanager

# Parar e desabilitar o iwd (para não conflitar)
sudo systemctl stop iwd
sudo systemctl disable iwd

# Habilitar e iniciar o NetworkManager
sudo systemctl enable NetworkManager
sudo systemctl start NetworkManager

# Agora conectar via nmtui (interface visual no terminal)
nmtui
# Use as setas para navegar:
# > "Activate a connection" → seleciona a rede Wi-Fi → digita a senha

# Ou via linha de comando com nmcli:
nmcli device wifi list                              # Listar redes
nmcli device wifi connect "MinhaRede" password "123456"  # Conectar`}
      />

      <h4>O que aparece quando você digita nmcli --help</h4>
      <CodeBlock
        title="nmcli --help (resumo)"
        code={`$ nmcli --help

Usage: nmcli [OPTIONS] OBJECT { COMMAND | help }

OPTIONS:
  -a, --ask                    Ask for missing parameters
  -c, --colors auto|yes|no     Whether to use colors in output
  -f, --fields <field,...>     Specify fields to output
  -t, --terse                  Terse output (script-friendly)
  -w, --wait <seconds>         Set timeout waiting for operations

OBJECT:
  general       NetworkManager's general status and operations
  networking    Overall networking control
  radio         NetworkManager radio switches
  connection    NetworkManager's connections
  device        Devices managed by NetworkManager
  agent         NetworkManager secret agent or polkit agent
  monitor       Monitor NetworkManager changes

# Os mais usados:
#   nmcli device wifi list          → Ver redes disponíveis
#   nmcli device wifi connect ...   → Conectar a uma rede
#   nmcli connection show           → Ver conexões salvas
#   nmcli connection delete "nome"  → Apagar conexão salva
#   nmcli general status            → Status geral da rede`}
      />

      <h2>2. Atualizar o Sistema</h2>
      <p>
        Antes de instalar qualquer coisa, atualize o sistema inteiro. Como o Arch Linux é rolling release,
        sempre existem pacotes novos disponíveis. Atualizar primeiro garante que você não vai ter
        conflitos de dependência ao instalar novos pacotes.
      </p>
      <CodeBlock
        title="Primeira atualização completa"
        code={`# Sincronizar banco de dados de pacotes (-Sy) E atualizar tudo (-u)
sudo pacman -Syu

# O que esse comando faz:
# -S  = Operação de sincronização (download/install)
# -y  = Atualizar o banco de dados local dos repositórios
# -u  = Atualizar todos os pacotes que têm versão nova disponível

# Saída esperada:
# :: Synchronizing package databases...
#  core                   130.5 KiB  1234 KiB/s 00:00
#  extra                    8.2 MiB  5678 KiB/s 00:01
#  multilib               ...
# :: Starting full system upgrade...
# resolving dependencies...
# looking for conflicting packages...
# Packages (15) base-1-2  linux-6.x.x  ...
# Total Download Size:   45.23 MiB
# Total Installed Size:  189.45 MiB
# :: Proceed with installation? [Y/n] Y

# Na primeira vez pode baixar bastante coisa (especialmente o kernel).
# Deixe terminar antes de continuar.`}
      />

      <AlertBox type="danger" title="NUNCA faça pacman -Sy sem o -u">
        <p>Rodar <code>sudo pacman -Sy</code> (sem o <code>u</code>) atualiza o banco de dados
        mas NÃO atualiza os pacotes. Isso pode causar um estado inconsistente onde o banco
        de dados aponta para versões novas mas o sistema ainda tem versões antigas. Isso
        pode quebrar instalações futuras. <strong>Sempre use -Syu junto.</strong></p>
      </AlertBox>

      <h2>3. Criar Usuário Comum (Se Ainda Não Criou)</h2>
      <p>
        Se durante a instalação você não criou um usuário normal e está logado como <code>root</code>,
        crie um agora. Usar o root no dia a dia é extremamente perigoso — qualquer erro de digitação
        pode destruir o sistema inteiro, já que o root tem permissão para fazer absolutamente tudo.
      </p>
      <CodeBlock
        title="Criar usuário e configurar sudo"
        code={`# Criar usuário com diretório home (-m), adicionar ao grupo wheel (-G wheel),
# e definir o bash como shell padrão (-s /bin/bash)
useradd -m -G wheel -s /bin/bash seu_usuario

# O que cada flag faz:
# -m              Cria o diretório /home/seu_usuario automaticamente
# -G wheel        Adiciona ao grupo "wheel" (grupo dos administradores)
# -s /bin/bash    Define o shell (programa que interpreta seus comandos)

# Definir senha para o novo usuário
passwd seu_usuario
# New password: ********
# Retype new password: ********
# passwd: password updated successfully

# Instalar o sudo (se não foi instalado durante a instalação)
pacman -S sudo

# Configurar o sudo para permitir que membros do grupo "wheel" usem
EDITOR=nano visudo

# Dentro do arquivo, procure e DESCOMENTE (remova o #) esta linha:
# %wheel ALL=(ALL:ALL) ALL
# Salve com Ctrl+O, Enter, Ctrl+X

# Agora faça logout do root e login com o novo usuário:
exit
# No prompt de login, digite seu_usuario e a senha

# Teste se o sudo funciona:
sudo whoami
# Deve retornar: root`}
      />

      <AlertBox type="info" title="Por que o grupo wheel?">
        <p>No Linux, o grupo <code>wheel</code> é tradicionalmente o grupo dos administradores.
        O nome vem de "big wheel" (pessoa importante/com poder). Quando você configura o
        <code>visudo</code> para permitir o grupo wheel, todos os membros desse grupo podem
        usar o <code>sudo</code> para executar comandos como root.</p>
      </AlertBox>

      <h2>4. Instalar Pacotes Essenciais</h2>
      <p>
        O Arch Linux vem com o mínimo absoluto. Vamos instalar as ferramentas que todo sistema
        precisa. Vou explicar o que cada pacote faz:
      </p>
      <CodeBlock
        title="Pacotes que todo sistema precisa"
        code={`sudo pacman -S \\
    base-devel          \\
    git                 \\
    vim nano            \\
    htop btop           \\
    wget curl           \\
    man-db man-pages    \\
    bash-completion     \\
    reflector           \\
    openssh             \\
    usbutils            \\
    pciutils            \\
    networkmanager      \\
    bluez bluez-utils   \\
    unzip p7zip`}
      />
      <p>O que cada um faz:</p>
      <ul>
        <li><strong>base-devel</strong>: Grupo de pacotes com ferramentas de compilação (gcc, make, automake, etc). Necessário para compilar pacotes do AUR e qualquer software a partir do código fonte.</li>
        <li><strong>git</strong>: Sistema de controle de versão. Essencial para clonar repositórios do AUR e qualquer projeto de código.</li>
        <li><strong>vim nano</strong>: Editores de texto no terminal. O <code>nano</code> é mais fácil para iniciantes (Ctrl+O salva, Ctrl+X sai). O <code>vim</code> é mais poderoso mas tem uma curva de aprendizado maior.</li>
        <li><strong>htop btop</strong>: Monitores de sistema interativos. Mostram uso de CPU, memória, processos em execução. O <code>btop</code> é mais bonito visualmente.</li>
        <li><strong>wget curl</strong>: Ferramentas para baixar arquivos da internet pelo terminal. O <code>curl</code> é mais versátil para APIs, o <code>wget</code> é melhor para baixar arquivos grandes.</li>
        <li><strong>man-db man-pages</strong>: Sistema de manuais. Com eles instalados, você pode digitar <code>man ls</code> para ver o manual completo do comando <code>ls</code>.</li>
        <li><strong>bash-completion</strong>: Autocomplete inteligente no terminal. Quando você aperta TAB, ele completa nomes de comandos, arquivos, flags e até argumentos de pacman.</li>
        <li><strong>reflector</strong>: Ferramenta para encontrar e ordenar os mirrors mais rápidos do pacman para sua localização.</li>
        <li><strong>openssh</strong>: Cliente e servidor SSH. Permite que você acesse seu computador remotamente ou se conecte a servidores.</li>
        <li><strong>usbutils</strong>: Inclui o comando <code>lsusb</code> que lista todos os dispositivos USB conectados.</li>
        <li><strong>pciutils</strong>: Inclui o comando <code>lspci</code> que lista todos os dispositivos PCI (placa de vídeo, rede, áudio, etc).</li>
        <li><strong>networkmanager</strong>: Gerenciador de rede completo (Wi-Fi, ethernet, VPN). Recomendado para uso diário.</li>
        <li><strong>bluez bluez-utils</strong>: Stack Bluetooth do Linux. O <code>bluez</code> é o daemon e o <code>bluez-utils</code> inclui o <code>bluetoothctl</code> para gerenciar dispositivos.</li>
        <li><strong>unzip p7zip</strong>: Descompactadores de arquivos. O <code>unzip</code> lida com .zip e o <code>p7zip</code> lida com .7z e outros formatos.</li>
      </ul>

      <h2>5. Otimizar Mirrors (Espelhos)</h2>
      <p>
        Os mirrors são servidores que hospedam os pacotes do Arch Linux ao redor do mundo.
        Usar mirrors mais próximos da sua localização faz os downloads serem muito mais rápidos.
        O <code>reflector</code> testa a velocidade de vários mirrors e ordena do mais rápido
        para o mais lento.
      </p>
      <CodeBlock
        title="Encontrar os mirrors mais rápidos"
        code={`# Fazer backup da lista atual (SEMPRE faça backup antes de alterar)
sudo cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.bak

# Usar reflector para encontrar os melhores mirrors do Brasil
# --country Brazil    = Filtrar apenas mirrors no Brasil
# --age 12            = Apenas mirrors atualizados nas últimas 12 horas
# --protocol https    = Apenas mirrors com HTTPS (mais seguro)
# --sort rate          = Ordenar por velocidade de download
# --save ...          = Salvar o resultado no arquivo de mirrors
sudo reflector --country Brazil --age 12 --protocol https \\
    --sort rate --save /etc/pacman.d/mirrorlist

# Se não encontrar mirrors no Brasil suficientes, amplie a busca:
sudo reflector --country Brazil,"United States" --age 24 \\
    --protocol https --sort rate --save /etc/pacman.d/mirrorlist

# Atualizar banco de dados com os novos mirrors
sudo pacman -Syyu
# O duplo -yy força a re-sincronização de todos os bancos de dados`}
      />

      <h2>6. Configurar o pacman.conf</h2>
      <p>
        O arquivo <code>/etc/pacman.conf</code> controla o comportamento do gerenciador de pacotes.
        Algumas opções úteis estão comentadas por padrão. Vamos habilitá-las:
      </p>
      <CodeBlock
        title="Melhorar a experiência do pacman"
        code={`sudo nano /etc/pacman.conf

# Procure e DESCOMENTE (remova o #) estas linhas:

# Color
# → Habilita cores na saída do pacman. Muito mais fácil de ler.

# VerbosePkgLists
# → Mostra uma tabela detalhada com versão antiga → nova ao atualizar.

# ParallelDownloads = 5
# → Baixa até 5 pacotes ao mesmo tempo (padrão é 1 por vez).
# → Acelera muito as atualizações!

# Para diversão, adicione abaixo de "Color":
# ILoveCandy
# → Troca a barra de progresso padrão por um Pac-Man comendo dots 🟡

# Salve: Ctrl+O → Enter → Ctrl+X`}
      />

      <AlertBox type="success" title="Dica: ILoveCandy">
        <p>A opção <code>ILoveCandy</code> é um easter egg do pacman. Ela muda a barra de
        progresso de download para parecer o Pac-Man comendo bolinhas. Puramente cosmético,
        mas divertido!</p>
      </AlertBox>

      <h2>7. Habilitar Repositório Multilib</h2>
      <p>
        O repositório <code>multilib</code> contém pacotes de 32-bit que rodam em sistemas 64-bit.
        Você precisa dele para instalar programas como Steam, Wine (para rodar programas do Windows),
        e alguns jogos.
      </p>
      <CodeBlock
        title="Habilitar multilib"
        code={`sudo nano /etc/pacman.conf

# Procure estas linhas (estão perto do final do arquivo):
# [multilib]
# Include = /etc/pacman.d/mirrorlist

# DESCOMENTE AMBAS as linhas (remova o #):
[multilib]
Include = /etc/pacman.d/mirrorlist

# Salve e atualize:
sudo pacman -Syu

# Agora pacotes 32-bit estarão disponíveis, como:
# lib32-mesa, lib32-vulkan-radeon, steam, wine, etc.`}
      />

      <h2>8. Instalar um AUR Helper</h2>
      <p>
        O <strong>AUR</strong> (Arch User Repository) é um dos maiores diferenciais do Arch Linux.
        É um repositório mantido pela comunidade com milhares de pacotes que não estão nos
        repositórios oficiais — coisas como Google Chrome, Spotify, Discord, Visual Studio Code,
        e milhares de outras ferramentas.
      </p>
      <p>
        Um <strong>AUR helper</strong> automatiza o processo de baixar, compilar e instalar pacotes do AUR.
        Os dois mais populares são o <code>yay</code> e o <code>paru</code>.
      </p>
      <CodeBlock
        title="Instalar o yay (recomendado para iniciantes)"
        code={`# Clonar o repositório do yay do AUR
git clone https://aur.archlinux.org/yay.git

# Entrar na pasta
cd yay

# Compilar e instalar (-s instala dependências, -i instala o pacote)
makepkg -si

# Limpar a pasta de compilação
cd ..
rm -rf yay

# Pronto! Agora você pode instalar pacotes do AUR facilmente:
yay -S google-chrome          # Navegador Chrome
yay -S spotify                # Spotify
yay -S visual-studio-code-bin # VS Code
yay -S discord                # Discord

# O yay usa a mesma sintaxe do pacman:
yay -Syu                      # Atualizar sistema + AUR
yay -Ss nome                  # Buscar pacote
yay -R pacote                 # Remover pacote
yay -Qi pacote                # Info sobre pacote instalado`}
      />

      <AlertBox type="warning" title="Segurança no AUR">
        <p>Pacotes do AUR são mantidos pela comunidade, não pelos desenvolvedores oficiais do Arch.
        Antes de instalar, o <code>yay</code> vai mostrar o PKGBUILD (script de compilação). Dê uma
        olhada rápida para garantir que não tem nada suspeito. É raro, mas já aconteceu de pacotes
        maliciosos serem submetidos ao AUR.</p>
      </AlertBox>

      <h2>9. Configurar Áudio</h2>
      <p>
        O Arch Linux não vem com servidor de áudio. Sem ele, nenhum som vai sair do seu computador.
        A escolha moderna é o <strong>PipeWire</strong>, que substituiu o PulseAudio e o JACK.
      </p>
      <CodeBlock
        title="Instalar PipeWire (servidor de áudio moderno)"
        code={`# Instalar o PipeWire e seus componentes
sudo pacman -S \\
    pipewire          \\
    pipewire-alsa     \\
    pipewire-pulse    \\
    pipewire-jack     \\
    wireplumber

# O que cada pacote faz:
# pipewire        = O servidor de áudio/vídeo principal
# pipewire-alsa   = Compatibilidade com ALSA (driver de áudio do kernel)
# pipewire-pulse  = Compatibilidade com PulseAudio (apps que usam PA)
# pipewire-jack   = Compatibilidade com JACK (áudio profissional)
# wireplumber     = Gerenciador de sessão (controla routing de áudio)

# Habilitar os serviços como usuário (SEM sudo!)
systemctl --user enable pipewire pipewire-pulse wireplumber
systemctl --user start pipewire pipewire-pulse wireplumber

# Testar áudio (vai tocar ruído branco nas caixas de som)
speaker-test -c 2
# -c 2 = 2 canais (estéreo: esquerdo e direito)
# Aperte Ctrl+C para parar

# Verificar se o PipeWire está rodando
pactl info | head -5
# Saída esperada:
# Server String: /run/user/1000/pulse/native
# Server Name: PulseAudio (on PipeWire x.x.x)  <-- PipeWire!`}
      />

      <AlertBox type="info" title="PipeWire vs PulseAudio">
        <p>O <strong>PipeWire</strong> é a escolha moderna e recomendada. Ele substitui tanto o
        PulseAudio (áudio do sistema) quanto o JACK (áudio profissional/baixa latência), tudo em um só.
        Aplicações que foram feitas para PulseAudio continuam funcionando perfeitamente porque
        o <code>pipewire-pulse</code> emula a interface do PulseAudio.</p>
      </AlertBox>

      <h2>10. Instalar Fontes</h2>
      <p>
        Sem fontes adicionais, muitos sites e aplicações vão mostrar quadrados ou caracteres estranhos
        no lugar de letras, emojis e símbolos. Instale um conjunto bom de fontes:
      </p>
      <CodeBlock
        title="Fontes essenciais"
        code={`sudo pacman -S \\
    noto-fonts              \\
    noto-fonts-cjk          \\
    noto-fonts-emoji        \\
    ttf-liberation          \\
    ttf-dejavu              \\
    ttf-firacode-nerd       \\
    ttf-jetbrains-mono-nerd

# O que cada pacote faz:
# noto-fonts          = Família Google Noto, cobre quase todos os idiomas
# noto-fonts-cjk      = Chinês, Japonês, Coreano (sem ele, sites asiáticos ficam quebrados)
# noto-fonts-emoji     = Emojis coloridos 😀🎉
# ttf-liberation       = Fontes compatíveis com Arial, Times New Roman e Courier
# ttf-dejavu           = Família DejaVu (muito legível)
# ttf-firacode-nerd    = Fira Code + ícones Nerd (ótimo para terminal e programação)
# ttf-jetbrains-mono-nerd = JetBrains Mono + ícones (outra opção top para terminal)

# Depois de instalar, atualize o cache de fontes:
fc-cache -fv`}
      />

      <h2>11. Configurar Bluetooth</h2>
      <CodeBlock
        title="Habilitar e usar Bluetooth"
        code={`# Habilitar e iniciar o serviço bluetooth
sudo systemctl enable bluetooth
sudo systemctl start bluetooth

# Usar o bluetoothctl (ferramenta interativa)
bluetoothctl

# Dentro do bluetoothctl:
[bluetooth]# power on             # Ligar o adaptador bluetooth
[bluetooth]# agent on             # Habilitar agente de pareamento
[bluetooth]# default-agent        # Definir como agente padrão
[bluetooth]# scan on              # Iniciar escaneamento

# Quando o dispositivo aparecer na lista:
# [NEW] Device XX:XX:XX:XX:XX:XX Nome_Do_Fone
[bluetooth]# pair XX:XX:XX:XX:XX:XX       # Parear com o dispositivo
[bluetooth]# connect XX:XX:XX:XX:XX:XX    # Conectar
[bluetooth]# trust XX:XX:XX:XX:XX:XX      # Salvar confiança (reconectar auto)

# Para desconectar:
[bluetooth]# disconnect XX:XX:XX:XX:XX:XX

# Sair:
[bluetooth]# exit`}
      />

      <h2>12. Configurar Firewall</h2>
      <p>
        Um firewall controla quais conexões de rede entram e saem do seu computador.
        O <code>ufw</code> (Uncomplicated Firewall) é a opção mais simples:
      </p>
      <CodeBlock
        title="Instalar e configurar UFW"
        code={`# Instalar
sudo pacman -S ufw

# Configuração básica: bloquear tudo que entra, liberar tudo que sai
sudo ufw default deny incoming    # Bloquear conexões de entrada
sudo ufw default allow outgoing   # Permitir conexões de saída

# Se você precisa de SSH (acesso remoto), libere a porta:
sudo ufw allow ssh    # Equivalente a: sudo ufw allow 22/tcp

# Habilitar o firewall
sudo ufw enable
# Command may disrupt existing SSH connections. Proceed with operation (y|n)? y
# Firewall is active and enabled on system startup

# Habilitar o serviço para iniciar no boot
sudo systemctl enable ufw

# Verificar status e regras ativas
sudo ufw status verbose
# Saída esperada:
# Status: active
# Logging: on (low)
# Default: deny (incoming), allow (outgoing), disabled (routed)
# To             Action      From
# --             ------      ----
# 22/tcp         ALLOW IN    Anywhere`}
      />

      <h2>13. Configurar Timezone e Sincronização de Hora</h2>
      <CodeBlock
        title="Timezone e NTP"
        code={`# Ver timezone atual
timedatectl

# Listar timezones disponíveis do Brasil
timedatectl list-timezones | grep Sao
# America/Sao_Paulo

# Configurar timezone
sudo timedatectl set-timezone America/Sao_Paulo

# Habilitar sincronização automática de hora via NTP
sudo timedatectl set-ntp true

# Verificar se está tudo certo
timedatectl
# Saída esperada:
#                Local time: Wed 2026-03-26 18:30:00 -03
#            Universal time: Wed 2026-03-26 21:30:00 UTC
#                  RTC time: Wed 2026-03-26 21:30:00
#                 Time zone: America/Sao_Paulo (-03, -0300)
#  System clock synchronized: yes       <-- NTP funcionando!
#                NTP service: active
#            RTC in local TZ: no`}
      />

      <h2>14. Habilitar TRIM para SSDs</h2>
      <p>
        Se o seu disco é um SSD (ou NVMe), habilitar o TRIM melhora a performance e aumenta
        a vida útil do disco. O TRIM informa ao SSD quais blocos de dados não estão mais em
        uso e podem ser limpos internamente.
      </p>
      <CodeBlock
        title="TRIM para SSDs"
        code={`# Verificar se seu disco suporta TRIM
lsblk --discard
# Se as colunas DISC-GRAN e DISC-MAX mostrarem valores diferentes de 0,
# seu disco suporta TRIM.

# Habilitar o timer que roda TRIM semanalmente
sudo systemctl enable fstrim.timer
sudo systemctl start fstrim.timer

# Verificar se o timer está ativo
systemctl status fstrim.timer
# Saída: Active: active (waiting)`}
      />

      <h2>15. Configurar Swappiness (Opcional)</h2>
      <p>
        O <code>swappiness</code> controla o quanto o sistema prefere usar swap (disco) ao invés
        da memória RAM. O valor padrão é 60, mas para desktops com bastante RAM, um valor menor
        é melhor (mais responsivo):
      </p>
      <CodeBlock
        title="Ajustar swappiness"
        code={`# Ver valor atual
cat /proc/sys/vm/swappiness
# 60 (padrão)

# Alterar temporariamente (volta ao padrão no reboot)
sudo sysctl vm.swappiness=10

# Alterar permanentemente
echo "vm.swappiness=10" | sudo tee /etc/sysctl.d/99-swappiness.conf

# Recomendações:
# 10-20 = Desktop com 8GB+ de RAM (menos uso de swap, mais responsivo)
# 60    = Padrão (equilíbrio)
# 100   = Usar swap o máximo possível (servidores com pouca RAM)`}
      />

      <AlertBox type="success" title="Sistema pronto!">
        <p>Com todos esses passos, seu Arch Linux está configurado e pronto para uso diário.
        O próximo passo é instalar um ambiente gráfico (GNOME, KDE, XFCE, i3, etc) para ter
        uma interface visual. Veja o capítulo sobre <strong>Ambiente Gráfico</strong> no menu lateral.</p>
      </AlertBox>

      <h2>Checklist Final</h2>
      <p>Use esta lista para garantir que não esqueceu nada:</p>
      <ul>
        <li>Internet funcionando (teste com <code>ping archlinux.org</code>)</li>
        <li>NetworkManager habilitado e iniciado</li>
        <li>Sistema atualizado (<code>pacman -Syu</code>)</li>
        <li>Usuário comum criado com sudo configurado</li>
        <li>Pacotes essenciais instalados (base-devel, git, etc)</li>
        <li>Mirrors otimizados com reflector</li>
        <li>pacman.conf configurado (Color, ParallelDownloads, etc)</li>
        <li>Repositório multilib habilitado</li>
        <li>AUR helper instalado (yay ou paru)</li>
        <li>Áudio funcionando com PipeWire</li>
        <li>Fontes instaladas (noto-fonts, emojis, etc)</li>
        <li>Bluetooth configurado</li>
        <li>Firewall ativo (ufw)</li>
        <li>Timezone e NTP corretos</li>
        <li>TRIM habilitado (se SSD)</li>
      </ul>
    </PageContainer>
  );
}
