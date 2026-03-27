import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Redes() {
  return (
    <PageContainer
      title="Redes e Conectividade"
      subtitle="Configure conexões com fio e Wi-Fi, diagnostique problemas de rede e domine as ferramentas essenciais de networking no Linux."
      difficulty="intermediario"
      timeToRead="30 min"
    >
      <p>
        No Arch Linux, a rede não vem configurada automaticamente como em distribuições mais amigáveis.
        Você precisa entender como as interfaces funcionam e como configurá-las — especialmente o Wi-Fi,
        que requer ferramentas específicas como o <code>iwctl</code>.
      </p>

      <h2>1. Interfaces de Rede - ip</h2>
      <p>
        O comando <code>ip</code> (do pacote iproute2) substituiu os antigos <code>ifconfig</code>,
        <code>route</code> e <code>arp</code>. É a ferramenta moderna e recomendada.
      </p>

      <h3>ip addr - Endereços IP</h3>
      <CodeBlock code={`# Mostrar todas as interfaces e seus endereços IP
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
sudo ip addr del 192.168.1.200/24 dev enp3s0`} />

      <AlertBox type="info" title="Nomes de interfaces no Arch">
        O Arch usa nomes previsíveis de interfaces: <code>enp3s0</code> (ethernet), <code>wlan0</code> ou
        <code> wlp2s0</code> (Wi-Fi). Os antigos <code>eth0</code> e <code>wlan0</code> podem não aparecer
        dependendo da configuração do systemd.
      </AlertBox>

      <h3>ip link - Estado das Interfaces</h3>
      <CodeBlock code={`# Listar todas as interfaces e seus estados
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
sudo ip link set enp3s0 up`} />

      <h3>ip route - Tabela de Rotas</h3>
      <CodeBlock code={`# Ver a tabela de rotas
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
ip route get 8.8.8.8`} />

      <h2>2. Wi-Fi com iwctl (iwd)</h2>
      <p>
        O <code>iwctl</code> é a ferramenta do <strong>iwd</strong> (iNet Wireless Daemon), o gerenciador
        de Wi-Fi padrão da instalação do Arch Linux. É rápido, leve e muito poderoso.
      </p>

      <AlertBox type="info" title="iwd vs NetworkManager vs wpa_supplicant">
        O <code>iwd</code> é usado no live ISO do Arch durante a instalação. Após instalar, muitos usuários
        preferem o <code>NetworkManager</code> (que pode usar iwd como backend). Ambos funcionam, mas o iwd
        é mais leve e direto.
      </AlertBox>

      <h3>Modo Interativo</h3>
      <CodeBlock code={`# Entrar no modo interativo do iwctl
iwctl

# Dentro do iwctl, você verá o prompt:
# [iwd]#`} />

      <h3>Todos os Subcomandos Importantes</h3>
      <CodeBlock code={`# === DENTRO DO MODO INTERATIVO [iwd]# ===

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
exit`} />

      <h3>Usando iwctl sem modo interativo</h3>
      <CodeBlock code={`# Todos os comandos podem ser usados direto no terminal:
iwctl device list
iwctl station wlan0 scan
iwctl station wlan0 get-networks
iwctl station wlan0 connect "MinhaRede"

# Habilitar e iniciar o serviço iwd
sudo systemctl enable --now iwd`} />

      <AlertBox type="warning" title="O scan é assíncrono!">
        Após rodar <code>station wlan0 scan</code>, espere 2-3 segundos antes de rodar
        <code> station wlan0 get-networks</code>. O scan acontece em background e as redes
        podem demorar um instante para aparecer na lista.
      </AlertBox>

      <h2>3. NetworkManager (nmcli e nmtui)</h2>
      <p>
        O NetworkManager é o gerenciador de rede mais popular para desktops Linux. Ele cuida tanto
        de conexões Ethernet quanto Wi-Fi automaticamente.
      </p>

      <CodeBlock code={`# Instalar e habilitar
sudo pacman -S networkmanager
sudo systemctl enable --now NetworkManager

# IMPORTANTE: desabilite outros gerenciadores antes
sudo systemctl disable --now iwd
sudo systemctl disable --now dhcpcd`} />

      <h3>nmcli - Interface de linha de comando</h3>
      <CodeBlock code={`# Ver status geral da rede
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
nmcli connection add type ethernet con-name "Estatico" ifname enp3s0 \
  ipv4.method manual ipv4.addresses 192.168.1.100/24 \
  ipv4.gateway 192.168.1.1 ipv4.dns "8.8.8.8,8.8.4.4"

# Mudar DNS de uma conexão existente
nmcli connection modify "MinhaRede" ipv4.dns "1.1.1.1,1.0.0.1"

# Reativar uma conexão para aplicar mudanças
nmcli connection down "MinhaRede" && nmcli connection up "MinhaRede"

# Deletar uma conexão salva
nmcli connection delete "ConexaoAntiga"

# Ativar/desativar Wi-Fi
nmcli radio wifi off
nmcli radio wifi on`} />

      <h3>nmtui - Interface visual no terminal</h3>
      <CodeBlock code={`# Abrir interface visual (recomendado para iniciantes)
nmtui

# Menu com 3 opções:
# 1. Edit a connection    - Editar/criar conexões
# 2. Activate a connection - Conectar/desconectar
# 3. Set system hostname   - Mudar nome do computador`} />

      <h2>4. Diagnóstico de Rede</h2>

      <h3>ping</h3>
      <CodeBlock code={`# Testar conectividade com um host
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
sudo ping -f google.com`} />

      <h3>traceroute / tracepath</h3>
      <CodeBlock code={`# Ver o caminho até um host (cada salto/roteador)
traceroute google.com

# Usando tracepath (não precisa de root)
tracepath google.com

# Usar ICMP em vez de UDP (mais confiável atrás de firewalls)
sudo traceroute -I google.com

# Usando mtr (combinação de ping + traceroute em tempo real)
sudo pacman -S mtr
mtr google.com`} />

      <h3>ss - Socket Statistics (substituto do netstat)</h3>
      <CodeBlock code={`# Listar todas as conexões TCP ativas
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
# -p  Mostra o processo (precisa de sudo para ver todos)`} />

      <AlertBox type="info" title="netstat está depreciado">
        O <code>netstat</code> (do pacote net-tools) está obsoleto. Use <code>ss</code> no lugar.
        Equivalência: <code>netstat -tulnp</code> = <code>ss -tulnp</code>.
      </AlertBox>

      <h3>curl e wget</h3>
      <CodeBlock code={`# === curl ===

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
curl -X POST -H "Content-Type: application/json" \
  -d '{"nome":"joao","email":"j@email.com"}' \
  https://api.example.com/json

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
wget --limit-rate=500k https://example.com/arquivo.iso`} />

      <h2>5. DNS - Resolução de Nomes</h2>

      <h3>dig</h3>
      <CodeBlock code={`# Instalar (não vem por padrão)
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
dig -x 8.8.8.8`} />

      <h3>nslookup</h3>
      <CodeBlock code={`# Consulta simples
nslookup google.com

# Usar servidor DNS específico
nslookup google.com 8.8.8.8

# Consulta reversa
nslookup 8.8.8.8`} />

      <h3>/etc/resolv.conf</h3>
      <CodeBlock code={`# Arquivo que define os servidores DNS do sistema
cat /etc/resolv.conf

# Conteúdo típico:
# nameserver 192.168.1.1
# nameserver 8.8.8.8
# nameserver 8.8.4.4`} title="/etc/resolv.conf" />

      <AlertBox type="warning" title="resolv.conf é gerenciado automaticamente">
        Se você usa NetworkManager ou systemd-resolved, eles sobrescrevem o <code>/etc/resolv.conf</code>.
        Para mudar DNS permanentemente, configure pelo gerenciador de rede ou edite
        <code> /etc/systemd/resolved.conf</code>.
      </AlertBox>

      <h2>6. Firewall Básico</h2>

      <h3>iptables (tradicional)</h3>
      <CodeBlock code={`# Ver regras atuais
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
sudo iptables-save > /etc/iptables/iptables.rules`} />

      <h3>ufw (interface simplificada)</h3>
      <CodeBlock code={`# Instalar
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
sudo ufw reset`} />

      <h2>7. Configuração de Rede Estática</h2>
      <CodeBlock code={`# Configurar IP estático temporariamente (perde ao reiniciar)
sudo ip addr add 192.168.1.100/24 dev enp3s0
sudo ip route add default via 192.168.1.1

# Para configuração persistente, use NetworkManager:
nmcli connection modify "Ethernet" \
  ipv4.method manual \
  ipv4.addresses 192.168.1.100/24 \
  ipv4.gateway 192.168.1.1 \
  ipv4.dns "8.8.8.8,1.1.1.1"

nmcli connection up "Ethernet"`} />

      <h2>8. O que NÃO fazer</h2>

      <AlertBox type="danger" title="Erros comuns de rede">
        <ul>
          <li>Rodar dois gerenciadores de rede ao mesmo tempo (ex: iwd + NetworkManager sem integração) — causa conflitos</li>
          <li>Usar <code>ifconfig</code> — está obsoleto, use <code>ip</code></li>
          <li>Editar <code>/etc/resolv.conf</code> diretamente quando há um gerenciador de rede ativo</li>
          <li><code>sudo ufw enable</code> antes de permitir SSH em um servidor remoto — você perde acesso</li>
          <li><code>iptables -P INPUT DROP</code> sem regra para ESTABLISHED — todas as conexões param de funcionar</li>
        </ul>
      </AlertBox>

      <h2>9. Consultas de DNS e Domínios</h2>
      <CodeBlock
        title="whois, dig, nslookup e host"
        code={`# === whois ===
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
# archlinux.org mail is handled by 10 mail.archlinux.org`}
      />

      <h2>10. Referências</h2>
      <ul>
        <li><a href="https://wiki.archlinux.org/title/Network_configuration" target="_blank" rel="noopener noreferrer">ArchWiki - Network Configuration</a></li>
        <li><a href="https://wiki.archlinux.org/title/Iwd" target="_blank" rel="noopener noreferrer">ArchWiki - iwd</a></li>
        <li><a href="https://wiki.archlinux.org/title/NetworkManager" target="_blank" rel="noopener noreferrer">ArchWiki - NetworkManager</a></li>
        <li><a href="https://wiki.archlinux.org/title/Uncomplicated_Firewall" target="_blank" rel="noopener noreferrer">ArchWiki - UFW</a></li>
        <li><code>man ip</code>, <code>man ss</code>, <code>man iwctl</code></li>
      </ul>

    </PageContainer>
  );
}
