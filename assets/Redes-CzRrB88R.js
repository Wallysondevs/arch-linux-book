import{j as e}from"./ui-K-J8Jkwj.js";import{P as s}from"./PageContainer-tnnsMrcC.js";import{C as o}from"./CodeBlock-DEDRw1y6.js";import{A as a}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function m(){return e.jsxs(s,{title:"Redes e Conectividade",subtitle:"Configure conexões com fio e Wi-Fi, diagnostique problemas de rede e domine as ferramentas essenciais de networking no Linux.",difficulty:"intermediario",timeToRead:"30 min",children:[e.jsxs("p",{children:["No Arch Linux, a rede não vem configurada automaticamente como em distribuições mais amigáveis. Você precisa entender como as interfaces funcionam e como configurá-las — especialmente o Wi-Fi, que requer ferramentas específicas como o ",e.jsx("code",{children:"iwctl"}),"."]}),e.jsx("h2",{children:"1. Interfaces de Rede - ip"}),e.jsxs("p",{children:["O comando ",e.jsx("code",{children:"ip"})," (do pacote iproute2) substituiu os antigos ",e.jsx("code",{children:"ifconfig"}),",",e.jsx("code",{children:"route"})," e ",e.jsx("code",{children:"arp"}),". É a ferramenta moderna e recomendada."]}),e.jsx("h3",{children:"ip addr - Endereços IP"}),e.jsx(o,{code:`# Mostrar todas as interfaces e seus endereços IP
ip addr
ip a          # atalho

# Saída típica:
# 1: lo: <LOOPBACK,UP> ...
#     inet 127.0.0.1/8 scope host lo
# 2: enp3s0: <BROADCAST,MULTICAST,UP> ...
#     inet 192.168.1.100/24 brd 192.168.1.255 scope global enp3s0
# 3: wlan0: <BROADCAST,MULTICAST,UP> ...
#     inet 192.168.1.150/24 brd 192.168.1.255 scope global wlan0

# Mostrar apenas IPv4
ip -4 addr

# Mostrar apenas IPv6
ip -6 addr

# Mostrar informações de uma interface específica
ip addr show enp3s0

# Adicionar um endereço IP manualmente
sudo ip addr add 192.168.1.200/24 dev enp3s0

# Remover um endereço IP
sudo ip addr del 192.168.1.200/24 dev enp3s0`}),e.jsxs(a,{type:"info",title:"Nomes de interfaces no Arch",children:["O Arch usa nomes previsíveis de interfaces: ",e.jsx("code",{children:"enp3s0"})," (ethernet), ",e.jsx("code",{children:"wlan0"})," ou",e.jsx("code",{children:" wlp2s0"})," (Wi-Fi). Os antigos ",e.jsx("code",{children:"eth0"})," e ",e.jsx("code",{children:"wlan0"})," podem não aparecer dependendo da configuração do systemd."]}),e.jsx("h3",{children:"ip link - Estado das Interfaces"}),e.jsx(o,{code:`# Listar todas as interfaces e seus estados
ip link
ip l          # atalho

# Ativar uma interface
sudo ip link set enp3s0 up

# Desativar uma interface
sudo ip link set enp3s0 down

# Mudar o MTU
sudo ip link set enp3s0 mtu 9000

# Mudar o MAC address (spoofing)
sudo ip link set enp3s0 down
sudo ip link set enp3s0 address XX:XX:XX:XX:XX:XX
sudo ip link set enp3s0 up`}),e.jsx("h3",{children:"ip route - Tabela de Rotas"}),e.jsx(o,{code:`# Ver a tabela de rotas
ip route
ip r          # atalho

# Saída típica:
# default via 192.168.1.1 dev enp3s0 proto dhcp metric 100
# 192.168.1.0/24 dev enp3s0 proto kernel scope link src 192.168.1.100

# Adicionar uma rota padrão (gateway)
sudo ip route add default via 192.168.1.1

# Adicionar uma rota específica
sudo ip route add 10.0.0.0/8 via 192.168.1.1

# Remover uma rota
sudo ip route del 10.0.0.0/8

# Ver qual rota será usada para alcançar um IP
ip route get 8.8.8.8`}),e.jsx("h2",{children:"2. Wi-Fi com iwctl (iwd)"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"iwctl"})," é a ferramenta do ",e.jsx("strong",{children:"iwd"})," (iNet Wireless Daemon), o gerenciador de Wi-Fi padrão da instalação do Arch Linux. É rápido, leve e muito poderoso."]}),e.jsxs(a,{type:"info",title:"iwd vs NetworkManager vs wpa_supplicant",children:["O ",e.jsx("code",{children:"iwd"})," é usado no live ISO do Arch durante a instalação. Após instalar, muitos usuários preferem o ",e.jsx("code",{children:"NetworkManager"})," (que pode usar iwd como backend). Ambos funcionam, mas o iwd é mais leve e direto."]}),e.jsx("h3",{children:"Modo Interativo"}),e.jsx(o,{code:`# Entrar no modo interativo do iwctl
iwctl

# Dentro do iwctl, você verá o prompt:
# [iwd]#`}),e.jsx("h3",{children:"Todos os Subcomandos Importantes"}),e.jsx(o,{code:`# === DENTRO DO MODO INTERATIVO [iwd]# ===

# Listar dispositivos Wi-Fi disponíveis
device list

# Saída:
#                            Devices
# -------------------------------------------------------
# Name    Address            Powered   Adapter   Mode
# wlan0   XX:XX:XX:XX:XX:XX  on        phy0      station

# Ligar o dispositivo (se estiver desligado)
device wlan0 set-property Powered on

# Buscar redes Wi-Fi disponíveis
station wlan0 scan

# Listar as redes encontradas
station wlan0 get-networks

# Saída:
#                     Available Networks
# -------------------------------------------------------
# Network Name        Security   Signal
# MinhaRede           psk        ****
# Vizinho_5G          psk        **
# Cafe_Aberto         open       ***

# Conectar a uma rede (vai pedir senha se for protegida)
station wlan0 connect "MinhaRede"
# Passphrase: ********

# Conectar passando a senha direto (sem prompt)
station wlan0 connect "MinhaRede" --passphrase "minha_senha_aqui"

# Ver o status da conexão atual
station wlan0 show

# Desconectar da rede atual
station wlan0 disconnect

# Ver redes conhecidas (que já conectou antes)
known-networks list

# Esquecer uma rede salva
known-networks "MinhaRede" forget

# Sair do modo interativo
exit`}),e.jsx("h3",{children:"Usando iwctl sem modo interativo"}),e.jsx(o,{code:`# Todos os comandos podem ser usados direto no terminal:
iwctl device list
iwctl station wlan0 scan
iwctl station wlan0 get-networks
iwctl station wlan0 connect "MinhaRede"

# Habilitar e iniciar o serviço iwd
sudo systemctl enable --now iwd`}),e.jsxs(a,{type:"warning",title:"O scan é assíncrono!",children:["Após rodar ",e.jsx("code",{children:"station wlan0 scan"}),", espere 2-3 segundos antes de rodar",e.jsx("code",{children:" station wlan0 get-networks"}),". O scan acontece em background e as redes podem demorar um instante para aparecer na lista."]}),e.jsx("h2",{children:"3. NetworkManager (nmcli e nmtui)"}),e.jsx("p",{children:"O NetworkManager é o gerenciador de rede mais popular para desktops Linux. Ele cuida tanto de conexões Ethernet quanto Wi-Fi automaticamente."}),e.jsx(o,{code:`# Instalar e habilitar
sudo pacman -S networkmanager
sudo systemctl enable --now NetworkManager

# IMPORTANTE: desabilite outros gerenciadores antes
sudo systemctl disable --now iwd
sudo systemctl disable --now dhcpcd`}),e.jsx("h3",{children:"nmcli - Interface de linha de comando"}),e.jsx(o,{code:`# Ver status geral da rede
nmcli general status

# Listar todas as conexões
nmcli connection show

# Listar conexões ativas
nmcli connection show --active

# Listar redes Wi-Fi disponíveis
nmcli device wifi list

# Conectar a uma rede Wi-Fi
nmcli device wifi connect "MinhaRede" password "minha_senha"

# Conectar a Wi-Fi oculta
nmcli device wifi connect "RedeOculta" password "senha" hidden yes

# Desconectar
nmcli device disconnect wlan0

# Criar conexão Ethernet com IP estático
nmcli connection add type ethernet con-name "Estatico" ifname enp3s0   ipv4.method manual ipv4.addresses 192.168.1.100/24   ipv4.gateway 192.168.1.1 ipv4.dns "8.8.8.8,8.8.4.4"

# Mudar DNS de uma conexão existente
nmcli connection modify "MinhaRede" ipv4.dns "1.1.1.1,1.0.0.1"

# Reativar uma conexão para aplicar mudanças
nmcli connection down "MinhaRede" && nmcli connection up "MinhaRede"

# Deletar uma conexão salva
nmcli connection delete "ConexaoAntiga"

# Ativar/desativar Wi-Fi
nmcli radio wifi off
nmcli radio wifi on`}),e.jsx("h3",{children:"nmtui - Interface visual no terminal"}),e.jsx(o,{code:`# Abrir interface visual (recomendado para iniciantes)
nmtui

# Menu com 3 opções:
# 1. Edit a connection    - Editar/criar conexões
# 2. Activate a connection - Conectar/desconectar
# 3. Set system hostname   - Mudar nome do computador`}),e.jsx("h2",{children:"4. Diagnóstico de Rede"}),e.jsx("h3",{children:"ping"}),e.jsx(o,{code:`# Testar conectividade com um host
ping google.com

# Enviar apenas 5 pacotes
ping -c 5 google.com

# Definir intervalo entre pacotes (0.2 segundos)
ping -i 0.2 google.com

# Definir tamanho do pacote
ping -s 1500 google.com

# Ping com timestamp
ping -D google.com

# Ping rápido (flood - precisa de root, CUIDADO)
sudo ping -f google.com`}),e.jsx("h3",{children:"traceroute / tracepath"}),e.jsx(o,{code:`# Ver o caminho até um host (cada salto/roteador)
traceroute google.com

# Usando tracepath (não precisa de root)
tracepath google.com

# Usar ICMP em vez de UDP (mais confiável atrás de firewalls)
sudo traceroute -I google.com

# Usando mtr (combinação de ping + traceroute em tempo real)
sudo pacman -S mtr
mtr google.com`}),e.jsx("h3",{children:"ss - Socket Statistics (substituto do netstat)"}),e.jsx(o,{code:`# Listar todas as conexões TCP ativas
ss -t

# Listar portas TCP em escuta (listening)
ss -tln

# Listar portas TCP em escuta COM o processo associado
ss -tlnp

# Listar portas UDP em escuta
ss -uln

# Listar TODAS as portas (TCP + UDP) em escuta
ss -tulnp

# Filtrar por porta específica
ss -tlnp | grep :8080

# Filtrar por estado
ss -t state established

# Ver conexões de um processo específico
ss -tp | grep firefox

# Significado das flags:
# -t  TCP
# -u  UDP
# -l  Listening (em escuta)
# -n  Numérico (não resolve nomes)
# -p  Mostra o processo (precisa de sudo para ver todos)`}),e.jsxs(a,{type:"info",title:"netstat está depreciado",children:["O ",e.jsx("code",{children:"netstat"})," (do pacote net-tools) está obsoleto. Use ",e.jsx("code",{children:"ss"})," no lugar. Equivalência: ",e.jsx("code",{children:"netstat -tulnp"})," = ",e.jsx("code",{children:"ss -tulnp"}),"."]}),e.jsx("h3",{children:"curl e wget"}),e.jsx(o,{code:`# === curl ===

# Fazer requisição GET simples
curl https://api.example.com/dados

# Baixar arquivo
curl -O https://example.com/arquivo.tar.gz

# Baixar e salvar com outro nome
curl -o meuarquivo.tar.gz https://example.com/arquivo.tar.gz

# Seguir redirecionamentos
curl -L https://example.com/redireciona

# Mostrar apenas os headers da resposta
curl -I https://example.com

# Enviar dados POST
curl -X POST -d "nome=joao&email=j@email.com" https://api.example.com/form

# Enviar JSON
curl -X POST -H "Content-Type: application/json"   -d '{"nome":"joao","email":"j@email.com"}'   https://api.example.com/json

# Autenticação básica
curl -u usuario:senha https://api.example.com/privado

# Modo silencioso com barra de progresso
curl -# -O https://example.com/arquivo_grande.iso

# === wget ===

# Baixar arquivo
wget https://example.com/arquivo.tar.gz

# Baixar com outro nome
wget -O meuarquivo.tar.gz https://example.com/arquivo.tar.gz

# Baixar em background
wget -b https://example.com/arquivo_grande.iso

# Continuar download interrompido
wget -c https://example.com/arquivo_grande.iso

# Baixar site inteiro (mirror)
wget -m https://example.com

# Limitar velocidade de download
wget --limit-rate=500k https://example.com/arquivo.iso`}),e.jsx("h2",{children:"5. DNS - Resolução de Nomes"}),e.jsx("h3",{children:"dig"}),e.jsx(o,{code:`# Instalar (não vem por padrão)
sudo pacman -S bind

# Consulta DNS básica
dig google.com

# Consulta resumida
dig +short google.com

# Consultar registro MX (email)
dig MX google.com

# Consultar registro NS (nameservers)
dig NS archlinux.org

# Consultar registro TXT
dig TXT google.com

# Usar um servidor DNS específico
dig @8.8.8.8 google.com

# Rastrear toda a cadeia de resolução
dig +trace google.com

# Consulta reversa (IP para nome)
dig -x 8.8.8.8`}),e.jsx("h3",{children:"nslookup"}),e.jsx(o,{code:`# Consulta simples
nslookup google.com

# Usar servidor DNS específico
nslookup google.com 8.8.8.8

# Consulta reversa
nslookup 8.8.8.8`}),e.jsx("h3",{children:"/etc/resolv.conf"}),e.jsx(o,{code:`# Arquivo que define os servidores DNS do sistema
cat /etc/resolv.conf

# Conteúdo típico:
# nameserver 192.168.1.1
# nameserver 8.8.8.8
# nameserver 8.8.4.4`,title:"/etc/resolv.conf"}),e.jsxs(a,{type:"warning",title:"resolv.conf é gerenciado automaticamente",children:["Se você usa NetworkManager ou systemd-resolved, eles sobrescrevem o ",e.jsx("code",{children:"/etc/resolv.conf"}),". Para mudar DNS permanentemente, configure pelo gerenciador de rede ou edite",e.jsx("code",{children:" /etc/systemd/resolved.conf"}),"."]}),e.jsx("h2",{children:"6. Firewall Básico"}),e.jsx("h3",{children:"iptables (tradicional)"}),e.jsx(o,{code:`# Ver regras atuais
sudo iptables -L -v -n

# Bloquear todo tráfego de entrada (CUIDADO)
sudo iptables -P INPUT DROP

# Permitir conexões já estabelecidas
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Permitir loopback
sudo iptables -A INPUT -i lo -j ACCEPT

# Permitir SSH (porta 22)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Permitir HTTP e HTTPS
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Bloquear um IP específico
sudo iptables -A INPUT -s 192.168.1.50 -j DROP

# Salvar regras (para persistência, instale iptables-nft)
sudo iptables-save > /etc/iptables/iptables.rules`}),e.jsx("h3",{children:"ufw (interface simplificada)"}),e.jsx(o,{code:`# Instalar
sudo pacman -S ufw

# Habilitar o ufw
sudo ufw enable
sudo systemctl enable --now ufw

# Ver status e regras
sudo ufw status verbose

# Política padrão: bloquear entrada, permitir saída
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Permitir SSH
sudo ufw allow ssh
sudo ufw allow 22/tcp

# Permitir uma porta
sudo ufw allow 8080

# Permitir range de portas
sudo ufw allow 6000:6007/tcp

# Permitir de um IP específico
sudo ufw allow from 192.168.1.0/24

# Deletar uma regra
sudo ufw delete allow 8080

# Desabilitar o firewall
sudo ufw disable

# Resetar todas as regras
sudo ufw reset`}),e.jsx("h2",{children:"7. Configuração de Rede Estática"}),e.jsx(o,{code:`# Configurar IP estático temporariamente (perde ao reiniciar)
sudo ip addr add 192.168.1.100/24 dev enp3s0
sudo ip route add default via 192.168.1.1

# Para configuração persistente, use NetworkManager:
nmcli connection modify "Ethernet"   ipv4.method manual   ipv4.addresses 192.168.1.100/24   ipv4.gateway 192.168.1.1   ipv4.dns "8.8.8.8,1.1.1.1"

nmcli connection up "Ethernet"`}),e.jsx("h2",{children:"8. O que NÃO fazer"}),e.jsx(a,{type:"danger",title:"Erros comuns de rede",children:e.jsxs("ul",{children:[e.jsx("li",{children:"Rodar dois gerenciadores de rede ao mesmo tempo (ex: iwd + NetworkManager sem integração) — causa conflitos"}),e.jsxs("li",{children:["Usar ",e.jsx("code",{children:"ifconfig"})," — está obsoleto, use ",e.jsx("code",{children:"ip"})]}),e.jsxs("li",{children:["Editar ",e.jsx("code",{children:"/etc/resolv.conf"})," diretamente quando há um gerenciador de rede ativo"]}),e.jsxs("li",{children:[e.jsx("code",{children:"sudo ufw enable"})," antes de permitir SSH em um servidor remoto — você perde acesso"]}),e.jsxs("li",{children:[e.jsx("code",{children:"iptables -P INPUT DROP"})," sem regra para ESTABLISHED — todas as conexões param de funcionar"]})]})}),e.jsx("h2",{children:"9. Consultas de DNS e Domínios"}),e.jsx(o,{title:"whois, dig, nslookup e host",code:`# === whois ===
# Consultar informações de registro de um domínio
# Instalar: sudo pacman -S whois

whois archlinux.org
# Saída: Registrant, Admin Contact, Name Servers, datas de criação/expiração...
# Útil para descobrir quem é dono de um domínio, quando expira, etc.

# === dig ===
# Consultar registros DNS detalhadamente
# Instalar: sudo pacman -S bind (inclui dig)

dig archlinux.org
# Mostra registros A (IPv4), tempo de resposta, servidor DNS usado

dig archlinux.org MX       # Registros de e-mail
dig archlinux.org NS       # Servidores de nome
dig archlinux.org AAAA     # IPv6
dig +short archlinux.org   # Só o IP, sem detalhes

# === nslookup ===
# Consulta DNS simples (alternativa ao dig)
nslookup archlinux.org
# Server:  192.168.1.1
# Address: 95.217.163.246

# === host ===
# Consulta DNS mais simples ainda
host archlinux.org
# archlinux.org has address 95.217.163.246
# archlinux.org mail is handled by 10 mail.archlinux.org`}),e.jsx("h2",{children:"10. Referências"}),e.jsxs("ul",{children:[e.jsx("li",{children:e.jsx("a",{href:"https://wiki.archlinux.org/title/Network_configuration",target:"_blank",rel:"noopener noreferrer",children:"ArchWiki - Network Configuration"})}),e.jsx("li",{children:e.jsx("a",{href:"https://wiki.archlinux.org/title/Iwd",target:"_blank",rel:"noopener noreferrer",children:"ArchWiki - iwd"})}),e.jsx("li",{children:e.jsx("a",{href:"https://wiki.archlinux.org/title/NetworkManager",target:"_blank",rel:"noopener noreferrer",children:"ArchWiki - NetworkManager"})}),e.jsx("li",{children:e.jsx("a",{href:"https://wiki.archlinux.org/title/Uncomplicated_Firewall",target:"_blank",rel:"noopener noreferrer",children:"ArchWiki - UFW"})}),e.jsxs("li",{children:[e.jsx("code",{children:"man ip"}),", ",e.jsx("code",{children:"man ss"}),", ",e.jsx("code",{children:"man iwctl"})]})]})]})}export{m as default};
