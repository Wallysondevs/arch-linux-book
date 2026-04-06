import{j as e}from"./ui-K-J8Jkwj.js";import{P as i}from"./PageContainer-tnnsMrcC.js";import{C as a}from"./CodeBlock-DEDRw1y6.js";import{A as o}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function p(){return e.jsxs(i,{title:"Primeiros Passos Pós-Instalação",subtitle:"Acabou de instalar o Arch Linux? Este guia detalhado vai te levar de um sistema mínimo com apenas um terminal até uma máquina completa e pronta para o dia a dia.",difficulty:"iniciante",timeToRead:"40 min",children:[e.jsx("h2",{children:"Parabéns pela Instalação!"}),e.jsx("p",{children:"Se você chegou até aqui, já passou pela parte mais desafiadora do Arch Linux: a instalação manual. Agora você tem um sistema mínimo — apenas um terminal preto com um cursor piscando. Sem interface gráfica, sem navegador, sem nada bonito. E é exatamente assim que deve ser."}),e.jsxs("p",{children:["O Arch Linux não instala nada que você não pediu. Isso significa que ",e.jsx("strong",{children:"você"})," vai escolher cada componente do seu sistema. Parece trabalhoso, mas isso garante que você tenha um sistema limpo, rápido e que você entende completamente."]}),e.jsx("p",{children:"Neste guia, vamos configurar tudo que é necessário para transformar esse terminal em um sistema funcional. Siga na ordem — alguns passos dependem de outros."}),e.jsx(o,{type:"warning",title:"Ordem importa!",children:e.jsx("p",{children:"Siga os passos nesta ordem. Não pule para a instalação do ambiente gráfico sem antes configurar a internet e atualizar o sistema. Instalar pacotes sem internet obviamente não funciona, e instalar coisas sem atualizar pode causar conflitos de versão."})}),e.jsx("h2",{children:"1. Conectar à Internet"}),e.jsx("p",{children:"A primeira coisa que você precisa fazer é conectar à internet. Sem internet, não dá para baixar nenhum pacote adicional. Existem duas formas principais de se conectar."}),e.jsx("h3",{children:"Via Cabo Ethernet (o mais fácil)"}),e.jsxs("p",{children:["Se você plugou um cabo de rede no computador, o Arch Linux já deve estar conectado automaticamente via DHCP. Você pode verificar com o comando ",e.jsx("code",{children:"ping"}),":"]}),e.jsx(a,{title:"Verificar se tem internet",code:`# Enviar 3 pacotes de teste para o site do Arch Linux
ping -c 3 archlinux.org

# Saída esperada (se conectado):
# PING archlinux.org (95.217.163.246) 56(84) bytes of data.
# 64 bytes from archlinux.org (95.217.163.246): icmp_seq=1 ttl=47 time=142 ms
# 64 bytes from archlinux.org (95.217.163.246): icmp_seq=2 ttl=47 time=141 ms
# 64 bytes from archlinux.org (95.217.163.246): icmp_seq=3 ttl=47 time=141 ms
# --- archlinux.org ping statistics ---
# 3 packets transmitted, 3 received, 0% packet loss

# Se aparecer "3 received, 0% packet loss", você já tem internet!
# Se aparecer "Network is unreachable" ou "Name resolution failed", continue lendo.`}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"-c 3"}),' significa "envie 3 pacotes e pare". Sem ele, o ping ficaria rodando eternamente até você apertar ',e.jsx("code",{children:"Ctrl+C"})," para interromper."]}),e.jsx("h3",{children:"Via Wi-Fi com iwctl (Explicação Completa)"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"iwctl"})," é a ferramenta de linha de comando do ",e.jsx("strong",{children:"iwd"})," (iNet wireless daemon). Ele é o gerenciador de Wi-Fi que vem incluído na ISO de instalação do Arch Linux. Diferente de ferramentas como o NetworkManager, o iwd é extremamente leve e rápido — ideal para a instalação ou sistemas minimalistas."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"O que o iwctl faz?"})," Ele permite que você escaneie redes Wi-Fi disponíveis, conecte a elas digitando a senha, gerencie redes salvas e controle seus dispositivos wireless, tudo pelo terminal."]}),e.jsx("h4",{children:"O que aparece quando você digita iwctl --help"}),e.jsxs("p",{children:["Se você digitar ",e.jsx("code",{children:"iwctl --help"})," no terminal, vai ver algo assim:"]}),e.jsx(a,{title:"iwctl --help",code:`$ iwctl --help

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
# Os mais importantes para você são: device, station e known-networks.`}),e.jsxs(o,{type:"info",title:"Modo Interativo vs Linha de Comando",children:[e.jsx("p",{children:"O iwctl tem dois modos de uso:"}),e.jsxs("p",{children:[e.jsx("strong",{children:"1. Modo interativo:"})," Você digita ",e.jsx("code",{children:"iwctl"})," sozinho e entra num prompt especial ",e.jsx("code",{children:"[iwd]#"})," onde pode digitar comandos um por um."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"2. Modo direto:"})," Você digita tudo em uma linha só, como",e.jsx("code",{children:"iwctl station wlan0 scan"}),". Mais rápido se você já sabe o que quer fazer."]})]}),e.jsx("h4",{children:"Passo 1: Descobrir seu dispositivo wireless"}),e.jsxs("p",{children:["Primeiro, você precisa saber o nome do seu adaptador Wi-Fi. Na maioria dos computadores é ",e.jsx("code",{children:"wlan0"}),", mas pode variar."]}),e.jsx(a,{title:"Listar dispositivos wireless",code:`# Entrar no modo interativo
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
[iwd]# adapter phy0 set-property Powered on`}),e.jsxs(o,{type:"danger",title:"Dispositivo não aparece?",children:[e.jsxs("p",{children:["Se o comando ",e.jsx("code",{children:"device list"})," não mostra nada, pode ser que:"]}),e.jsxs("p",{children:["1. Seu computador não tem placa Wi-Fi (verifique com ",e.jsx("code",{children:"lspci | grep -i wireless"}),")"]}),e.jsxs("p",{children:["2. O driver não foi carregado (verifique com ",e.jsx("code",{children:"dmesg | grep -i wifi"}),")"]}),e.jsx("p",{children:"3. O Wi-Fi está desabilitado por hardware (verifique o botão/switch físico do notebook)"}),e.jsxs("p",{children:["4. O Wi-Fi está bloqueado por software (verifique com ",e.jsx("code",{children:"rfkill list"})," e desbloqueie com ",e.jsx("code",{children:"rfkill unblock wifi"}),")"]})]}),e.jsx("h4",{children:"Passo 2: Escanear redes disponíveis"}),e.jsx(a,{title:"Escanear e listar redes Wi-Fi",code:`# Escanear redes (o comando em si não mostra nada, ele só inicia o escaneamento)
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
#   *    = Muito fraco`}),e.jsx("h4",{children:"Passo 3: Conectar a uma rede"}),e.jsx(a,{title:"Conectar ao Wi-Fi",code:`# Conectar a uma rede com senha (vai pedir a passphrase interativamente)
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
[iwd]# exit`}),e.jsx("h4",{children:"Modo Direto (uma linha só)"}),e.jsx("p",{children:"Se você já sabe o nome da rede e quer fazer tudo rápido:"}),e.jsx(a,{title:"iwctl em modo direto (sem entrar no modo interativo)",code:`# Escanear
iwctl station wlan0 scan

# Ver redes
iwctl station wlan0 get-networks

# Conectar (passando a senha diretamente com -p)
iwctl --passphrase "minha_senha_aqui" station wlan0 connect "MinhaRede"

# Verificar status
iwctl station wlan0 show

# Desconectar
iwctl station wlan0 disconnect`}),e.jsx("h4",{children:"Gerenciar redes salvas"}),e.jsx("p",{children:"O iwctl lembra das redes que você já conectou. Você pode ver e gerenciar elas:"}),e.jsx(a,{title:"Redes conhecidas (salvas)",code:`# Listar redes salvas
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
iwctl known-networks "MinhaRede" set-property AutoConnect yes`}),e.jsx(o,{type:"success",title:"Verificar se a internet funciona",children:e.jsxs("p",{children:["Depois de conectar, sempre teste com ",e.jsx("code",{children:"ping -c 3 archlinux.org"}),". Se receber resposta, parabéns, você está online!"]})}),e.jsx("h3",{children:"iwctl vs NetworkManager - Quando usar cada um"}),e.jsxs("p",{children:["Agora que você sabe usar o ",e.jsx("code",{children:"iwctl"}),", precisa entender quando usar ele e quando migrar para o ",e.jsx("code",{children:"NetworkManager"}),":"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"iwctl (iwd)"}),": Ideal para a instalação e sistemas sem interface gráfica. É leve, rápido e já vem na ISO do Arch. Mas ele ",e.jsx("strong",{children:"só gerencia Wi-Fi"})," — não cuida de ethernet, VPN, proxy, etc."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"NetworkManager"}),": Ideal para o dia a dia, especialmente se você vai usar um ambiente gráfico (GNOME, KDE, etc.). Ele gerencia Wi-Fi, ethernet, VPN, proxy, e se integra com os applets gráficos das barras de tarefas. Ele reconecta automaticamente quando você troca de rede."]})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Recomendação:"})," Use o ",e.jsx("code",{children:"iwctl"})," durante a instalação e primeiros passos. Depois que instalar o ",e.jsx("code",{children:"NetworkManager"}),", desabilite o ",e.jsx("code",{children:"iwd"})," para evitar conflitos:"]}),e.jsx(a,{title:"Migrar de iwctl para NetworkManager",code:`# Instalar o NetworkManager
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
nmcli device wifi connect "MinhaRede" password "123456"  # Conectar`}),e.jsx("h4",{children:"O que aparece quando você digita nmcli --help"}),e.jsx(a,{title:"nmcli --help (resumo)",code:`$ nmcli --help

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
#   nmcli general status            → Status geral da rede`}),e.jsx("h2",{children:"2. Atualizar o Sistema"}),e.jsx("p",{children:"Antes de instalar qualquer coisa, atualize o sistema inteiro. Como o Arch Linux é rolling release, sempre existem pacotes novos disponíveis. Atualizar primeiro garante que você não vai ter conflitos de dependência ao instalar novos pacotes."}),e.jsx(a,{title:"Primeira atualização completa",code:`# Sincronizar banco de dados de pacotes (-Sy) E atualizar tudo (-u)
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
# Deixe terminar antes de continuar.`}),e.jsx(o,{type:"danger",title:"NUNCA faça pacman -Sy sem o -u",children:e.jsxs("p",{children:["Rodar ",e.jsx("code",{children:"sudo pacman -Sy"})," (sem o ",e.jsx("code",{children:"u"}),") atualiza o banco de dados mas NÃO atualiza os pacotes. Isso pode causar um estado inconsistente onde o banco de dados aponta para versões novas mas o sistema ainda tem versões antigas. Isso pode quebrar instalações futuras. ",e.jsx("strong",{children:"Sempre use -Syu junto."})]})}),e.jsx("h2",{children:"3. Criar Usuário Comum (Se Ainda Não Criou)"}),e.jsxs("p",{children:["Se durante a instalação você não criou um usuário normal e está logado como ",e.jsx("code",{children:"root"}),", crie um agora. Usar o root no dia a dia é extremamente perigoso — qualquer erro de digitação pode destruir o sistema inteiro, já que o root tem permissão para fazer absolutamente tudo."]}),e.jsx(a,{title:"Criar usuário e configurar sudo",code:`# Criar usuário com diretório home (-m), adicionar ao grupo wheel (-G wheel),
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
# Deve retornar: root`}),e.jsx(o,{type:"info",title:"Por que o grupo wheel?",children:e.jsxs("p",{children:["No Linux, o grupo ",e.jsx("code",{children:"wheel"}),' é tradicionalmente o grupo dos administradores. O nome vem de "big wheel" (pessoa importante/com poder). Quando você configura o',e.jsx("code",{children:"visudo"})," para permitir o grupo wheel, todos os membros desse grupo podem usar o ",e.jsx("code",{children:"sudo"})," para executar comandos como root."]})}),e.jsx("h2",{children:"4. Instalar Pacotes Essenciais"}),e.jsx("p",{children:"O Arch Linux vem com o mínimo absoluto. Vamos instalar as ferramentas que todo sistema precisa. Vou explicar o que cada pacote faz:"}),e.jsx(a,{title:"Pacotes que todo sistema precisa",code:`sudo pacman -S \\
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
    unzip p7zip`}),e.jsx("p",{children:"O que cada um faz:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"base-devel"}),": Grupo de pacotes com ferramentas de compilação (gcc, make, automake, etc). Necessário para compilar pacotes do AUR e qualquer software a partir do código fonte."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"git"}),": Sistema de controle de versão. Essencial para clonar repositórios do AUR e qualquer projeto de código."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"vim nano"}),": Editores de texto no terminal. O ",e.jsx("code",{children:"nano"})," é mais fácil para iniciantes (Ctrl+O salva, Ctrl+X sai). O ",e.jsx("code",{children:"vim"})," é mais poderoso mas tem uma curva de aprendizado maior."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"htop btop"}),": Monitores de sistema interativos. Mostram uso de CPU, memória, processos em execução. O ",e.jsx("code",{children:"btop"})," é mais bonito visualmente."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"wget curl"}),": Ferramentas para baixar arquivos da internet pelo terminal. O ",e.jsx("code",{children:"curl"})," é mais versátil para APIs, o ",e.jsx("code",{children:"wget"})," é melhor para baixar arquivos grandes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"man-db man-pages"}),": Sistema de manuais. Com eles instalados, você pode digitar ",e.jsx("code",{children:"man ls"})," para ver o manual completo do comando ",e.jsx("code",{children:"ls"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"bash-completion"}),": Autocomplete inteligente no terminal. Quando você aperta TAB, ele completa nomes de comandos, arquivos, flags e até argumentos de pacman."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"reflector"}),": Ferramenta para encontrar e ordenar os mirrors mais rápidos do pacman para sua localização."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"openssh"}),": Cliente e servidor SSH. Permite que você acesse seu computador remotamente ou se conecte a servidores."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"usbutils"}),": Inclui o comando ",e.jsx("code",{children:"lsusb"})," que lista todos os dispositivos USB conectados."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"pciutils"}),": Inclui o comando ",e.jsx("code",{children:"lspci"})," que lista todos os dispositivos PCI (placa de vídeo, rede, áudio, etc)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"networkmanager"}),": Gerenciador de rede completo (Wi-Fi, ethernet, VPN). Recomendado para uso diário."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"bluez bluez-utils"}),": Stack Bluetooth do Linux. O ",e.jsx("code",{children:"bluez"})," é o daemon e o ",e.jsx("code",{children:"bluez-utils"})," inclui o ",e.jsx("code",{children:"bluetoothctl"})," para gerenciar dispositivos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"unzip p7zip"}),": Descompactadores de arquivos. O ",e.jsx("code",{children:"unzip"})," lida com .zip e o ",e.jsx("code",{children:"p7zip"})," lida com .7z e outros formatos."]})]}),e.jsx("h2",{children:"5. Otimizar Mirrors (Espelhos)"}),e.jsxs("p",{children:["Os mirrors são servidores que hospedam os pacotes do Arch Linux ao redor do mundo. Usar mirrors mais próximos da sua localização faz os downloads serem muito mais rápidos. O ",e.jsx("code",{children:"reflector"})," testa a velocidade de vários mirrors e ordena do mais rápido para o mais lento."]}),e.jsx(a,{title:"Encontrar os mirrors mais rápidos",code:`# Fazer backup da lista atual (SEMPRE faça backup antes de alterar)
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
# O duplo -yy força a re-sincronização de todos os bancos de dados`}),e.jsx("h2",{children:"6. Configurar o pacman.conf"}),e.jsxs("p",{children:["O arquivo ",e.jsx("code",{children:"/etc/pacman.conf"})," controla o comportamento do gerenciador de pacotes. Algumas opções úteis estão comentadas por padrão. Vamos habilitá-las:"]}),e.jsx(a,{title:"Melhorar a experiência do pacman",code:`sudo nano /etc/pacman.conf

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

# Salve: Ctrl+O → Enter → Ctrl+X`}),e.jsx(o,{type:"success",title:"Dica: ILoveCandy",children:e.jsxs("p",{children:["A opção ",e.jsx("code",{children:"ILoveCandy"})," é um easter egg do pacman. Ela muda a barra de progresso de download para parecer o Pac-Man comendo bolinhas. Puramente cosmético, mas divertido!"]})}),e.jsx("h2",{children:"7. Habilitar Repositório Multilib"}),e.jsxs("p",{children:["O repositório ",e.jsx("code",{children:"multilib"})," contém pacotes de 32-bit que rodam em sistemas 64-bit. Você precisa dele para instalar programas como Steam, Wine (para rodar programas do Windows), e alguns jogos."]}),e.jsx(a,{title:"Habilitar multilib",code:`sudo nano /etc/pacman.conf

# Procure estas linhas (estão perto do final do arquivo):
# [multilib]
# Include = /etc/pacman.d/mirrorlist

# DESCOMENTE AMBAS as linhas (remova o #):
[multilib]
Include = /etc/pacman.d/mirrorlist

# Salve e atualize:
sudo pacman -Syu

# Agora pacotes 32-bit estarão disponíveis, como:
# lib32-mesa, lib32-vulkan-radeon, steam, wine, etc.`}),e.jsx("h2",{children:"8. Instalar um AUR Helper"}),e.jsxs("p",{children:["O ",e.jsx("strong",{children:"AUR"})," (Arch User Repository) é um dos maiores diferenciais do Arch Linux. É um repositório mantido pela comunidade com milhares de pacotes que não estão nos repositórios oficiais — coisas como Google Chrome, Spotify, Discord, Visual Studio Code, e milhares de outras ferramentas."]}),e.jsxs("p",{children:["Um ",e.jsx("strong",{children:"AUR helper"})," automatiza o processo de baixar, compilar e instalar pacotes do AUR. Os dois mais populares são o ",e.jsx("code",{children:"yay"})," e o ",e.jsx("code",{children:"paru"}),"."]}),e.jsx(a,{title:"Instalar o yay (recomendado para iniciantes)",code:`# Clonar o repositório do yay do AUR
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
yay -Qi pacote                # Info sobre pacote instalado`}),e.jsx(o,{type:"warning",title:"Segurança no AUR",children:e.jsxs("p",{children:["Pacotes do AUR são mantidos pela comunidade, não pelos desenvolvedores oficiais do Arch. Antes de instalar, o ",e.jsx("code",{children:"yay"})," vai mostrar o PKGBUILD (script de compilação). Dê uma olhada rápida para garantir que não tem nada suspeito. É raro, mas já aconteceu de pacotes maliciosos serem submetidos ao AUR."]})}),e.jsx("h2",{children:"9. Configurar Áudio"}),e.jsxs("p",{children:["O Arch Linux não vem com servidor de áudio. Sem ele, nenhum som vai sair do seu computador. A escolha moderna é o ",e.jsx("strong",{children:"PipeWire"}),", que substituiu o PulseAudio e o JACK."]}),e.jsx(a,{title:"Instalar PipeWire (servidor de áudio moderno)",code:`# Instalar o PipeWire e seus componentes
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
# Server Name: PulseAudio (on PipeWire x.x.x)  <-- PipeWire!`}),e.jsx(o,{type:"info",title:"PipeWire vs PulseAudio",children:e.jsxs("p",{children:["O ",e.jsx("strong",{children:"PipeWire"})," é a escolha moderna e recomendada. Ele substitui tanto o PulseAudio (áudio do sistema) quanto o JACK (áudio profissional/baixa latência), tudo em um só. Aplicações que foram feitas para PulseAudio continuam funcionando perfeitamente porque o ",e.jsx("code",{children:"pipewire-pulse"})," emula a interface do PulseAudio."]})}),e.jsx("h2",{children:"10. Instalar Fontes"}),e.jsx("p",{children:"Sem fontes adicionais, muitos sites e aplicações vão mostrar quadrados ou caracteres estranhos no lugar de letras, emojis e símbolos. Instale um conjunto bom de fontes:"}),e.jsx(a,{title:"Fontes essenciais",code:`sudo pacman -S \\
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
fc-cache -fv`}),e.jsx("h2",{children:"11. Configurar Bluetooth"}),e.jsx(a,{title:"Habilitar e usar Bluetooth",code:`# Habilitar e iniciar o serviço bluetooth
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
[bluetooth]# exit`}),e.jsx("h2",{children:"12. Configurar Firewall"}),e.jsxs("p",{children:["Um firewall controla quais conexões de rede entram e saem do seu computador. O ",e.jsx("code",{children:"ufw"})," (Uncomplicated Firewall) é a opção mais simples:"]}),e.jsx(a,{title:"Instalar e configurar UFW",code:`# Instalar
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
# 22/tcp         ALLOW IN    Anywhere`}),e.jsx("h2",{children:"13. Configurar Timezone e Sincronização de Hora"}),e.jsx(a,{title:"Timezone e NTP",code:`# Ver timezone atual
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
#            RTC in local TZ: no`}),e.jsx("h2",{children:"14. Habilitar TRIM para SSDs"}),e.jsx("p",{children:"Se o seu disco é um SSD (ou NVMe), habilitar o TRIM melhora a performance e aumenta a vida útil do disco. O TRIM informa ao SSD quais blocos de dados não estão mais em uso e podem ser limpos internamente."}),e.jsx(a,{title:"TRIM para SSDs",code:`# Verificar se seu disco suporta TRIM
lsblk --discard
# Se as colunas DISC-GRAN e DISC-MAX mostrarem valores diferentes de 0,
# seu disco suporta TRIM.

# Habilitar o timer que roda TRIM semanalmente
sudo systemctl enable fstrim.timer
sudo systemctl start fstrim.timer

# Verificar se o timer está ativo
systemctl status fstrim.timer
# Saída: Active: active (waiting)`}),e.jsx("h2",{children:"15. Configurar Swappiness (Opcional)"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"swappiness"})," controla o quanto o sistema prefere usar swap (disco) ao invés da memória RAM. O valor padrão é 60, mas para desktops com bastante RAM, um valor menor é melhor (mais responsivo):"]}),e.jsx(a,{title:"Ajustar swappiness",code:`# Ver valor atual
cat /proc/sys/vm/swappiness
# 60 (padrão)

# Alterar temporariamente (volta ao padrão no reboot)
sudo sysctl vm.swappiness=10

# Alterar permanentemente
echo "vm.swappiness=10" | sudo tee /etc/sysctl.d/99-swappiness.conf

# Recomendações:
# 10-20 = Desktop com 8GB+ de RAM (menos uso de swap, mais responsivo)
# 60    = Padrão (equilíbrio)
# 100   = Usar swap o máximo possível (servidores com pouca RAM)`}),e.jsx(o,{type:"success",title:"Sistema pronto!",children:e.jsxs("p",{children:["Com todos esses passos, seu Arch Linux está configurado e pronto para uso diário. O próximo passo é instalar um ambiente gráfico (GNOME, KDE, XFCE, i3, etc) para ter uma interface visual. Veja o capítulo sobre ",e.jsx("strong",{children:"Ambiente Gráfico"})," no menu lateral."]})}),e.jsx("h2",{children:"Checklist Final"}),e.jsx("p",{children:"Use esta lista para garantir que não esqueceu nada:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Internet funcionando (teste com ",e.jsx("code",{children:"ping archlinux.org"}),")"]}),e.jsx("li",{children:"NetworkManager habilitado e iniciado"}),e.jsxs("li",{children:["Sistema atualizado (",e.jsx("code",{children:"pacman -Syu"}),")"]}),e.jsx("li",{children:"Usuário comum criado com sudo configurado"}),e.jsx("li",{children:"Pacotes essenciais instalados (base-devel, git, etc)"}),e.jsx("li",{children:"Mirrors otimizados com reflector"}),e.jsx("li",{children:"pacman.conf configurado (Color, ParallelDownloads, etc)"}),e.jsx("li",{children:"Repositório multilib habilitado"}),e.jsx("li",{children:"AUR helper instalado (yay ou paru)"}),e.jsx("li",{children:"Áudio funcionando com PipeWire"}),e.jsx("li",{children:"Fontes instaladas (noto-fonts, emojis, etc)"}),e.jsx("li",{children:"Bluetooth configurado"}),e.jsx("li",{children:"Firewall ativo (ufw)"}),e.jsx("li",{children:"Timezone e NTP corretos"}),e.jsx("li",{children:"TRIM habilitado (se SSD)"})]})]})}export{p as default};
