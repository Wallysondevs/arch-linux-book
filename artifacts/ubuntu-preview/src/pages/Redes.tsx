import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Redes() {
  return (
    <PageContainer
      title="Redes e Conectividade"
      subtitle="ip, nmcli, ping, ss, traceroute, nmap — configuração, monitoramento e diagnóstico de rede no Ubuntu."
      difficulty="intermediario"
      timeToRead="25 min"
    >
      <p>
        No Ubuntu, a rede é gerenciada principalmente pelo <strong>NetworkManager</strong> — ao
        contrário do Arch Linux, onde você configura tudo manualmente. Ainda assim, dominar as
        ferramentas de linha de comando é essencial para diagnóstico de problemas, configuração
        de servidores e automação de rede.
      </p>

      <h2>ip — A Ferramenta Moderna de Rede</h2>
      <CodeBlock
        title="Comandos ip essenciais"
        code={`# Ver todas as interfaces de rede e endereços IP
ip addr
ip a      # atalho

# Saída típica no Ubuntu:
# 1: lo: <LOOPBACK,UP>
#     inet 127.0.0.1/8 scope host lo
# 2: enp3s0: <BROADCAST,MULTICAST,UP>
#     inet 192.168.1.100/24 brd 192.168.1.255 scope global dynamic enp3s0
# 3: wlp2s0: <BROADCAST,MULTICAST,UP>
#     inet 192.168.1.150/24 brd 192.168.1.255 scope global dynamic wlp2s0

# Ver apenas IPv4
ip -4 addr

# Ver apenas IPv6
ip -6 addr

# Ver estado das interfaces (ligado/desligado)
ip link
ip l    # atalho

# Ligar/desligar interface
sudo ip link set enp3s0 up
sudo ip link set enp3s0 down

# Ver tabela de rotas
ip route
ip r    # atalho
# default via 192.168.1.1 dev enp3s0 proto dhcp metric 100

# Adicionar rota estática
sudo ip route add 10.0.0.0/8 via 192.168.1.1

# Ver qual rota usa para chegar a um IP
ip route get 8.8.8.8

# Adicionar IP temporário a interface
sudo ip addr add 192.168.1.200/24 dev enp3s0

# Remover IP de interface
sudo ip addr del 192.168.1.200/24 dev enp3s0`}
      />

      <h2>nmcli — NetworkManager em Linha de Comando</h2>
      <p>
        O <code>nmcli</code> é a interface de linha de comando do NetworkManager — o gerenciador
        de rede padrão do Ubuntu. É mais poderoso para configuração permanente do que o comando
        <code>ip</code> (que não persiste reinicializações).
      </p>
      <CodeBlock
        title="nmcli: gerenciando conexões de rede"
        code={`# Ver status geral da rede
nmcli general status

# Ver todas as conexões salvas
nmcli connection show

# Ver dispositivos de rede
nmcli device status

# === Wi-Fi ===

# Listar redes Wi-Fi disponíveis
nmcli device wifi list

# Conectar a uma rede Wi-Fi
nmcli device wifi connect "MinhaRede" password "minha-senha"

# Conectar a rede Wi-Fi oculta
nmcli device wifi connect "MinhaRede" password "minha-senha" hidden yes

# Ver redes Wi-Fi salvas
nmcli connection show | grep wifi

# Desconectar Wi-Fi
nmcli device disconnect wlp2s0

# Ligar/desligar Wi-Fi
nmcli radio wifi off
nmcli radio wifi on

# === Ethernet ===

# Configurar IP estático em interface ethernet
nmcli connection modify "Wired connection 1" \\
    ipv4.method manual \\
    ipv4.addresses 192.168.1.100/24 \\
    ipv4.gateway 192.168.1.1 \\
    ipv4.dns "8.8.8.8 8.8.4.4"

# Voltar para DHCP
nmcli connection modify "Wired connection 1" \\
    ipv4.method auto

# Reativar conexão para aplicar mudanças:
nmcli connection down "Wired connection 1"
nmcli connection up "Wired connection 1"

# Criar nova conexão de rede
nmcli connection add type ethernet \\
    con-name "Conexao-Trabalho" \\
    ifname enp3s0 \\
    ip4 10.0.0.100/24 \\
    gw4 10.0.0.1

# Deletar conexão salva
nmcli connection delete "Conexao-Velha"`}
      />

      <h2>nmtui — Interface Visual no Terminal</h2>
      <CodeBlock
        title="Configurar rede com interface visual"
        code={`# Abrir interface visual do NetworkManager no terminal
nmtui

# Opções disponíveis:
# > Activate a connection   ← Conectar/desconectar redes
# > Edit a connection       ← Editar configurações de IP, DNS, etc.
# > Set system hostname     ← Mudar o nome do computador

# Muito útil em servidores sem interface gráfica!`}
      />

      <h2>Diagnóstico de Rede</h2>
      <CodeBlock
        title="Ferramentas essenciais de diagnóstico"
        code={`# Testar conectividade básica
ping google.com
ping -c 4 8.8.8.8   # Enviar apenas 4 pacotes

# Testar latência e rota para um destino
traceroute google.com
tracepath google.com  # Alternativa sem precisar de root

# Resolver DNS
nslookup google.com
dig google.com
dig google.com A      # Apenas registros IPv4
dig google.com MX     # Registros de e-mail
host google.com       # Forma simples

# Ver DNS configurado
cat /etc/resolv.conf
nmcli device show | grep DNS

# Testar conectividade HTTP
curl -I https://google.com    # Ver apenas cabeçalhos HTTP
curl -o /dev/null -s -w "%{http_code}" https://google.com  # Ver código HTTP

# Ver rota completa com latência
mtr google.com   # sudo apt install mtr

# Descobrir IP público
curl ifconfig.me
curl ipinfo.io
curl icanhazip.com`}
      />

      <h2>ss e netstat — Conexões e Portas</h2>
      <CodeBlock
        title="Monitorar portas e conexões ativas"
        code={`# ss é o substituto moderno do netstat

# Ver todas as conexões TCP ativas
ss -t

# Ver portas em escuta (serviços rodando)
ss -tlnp

# Explicação das flags:
# -t = TCP
# -u = UDP
# -l = listening (apenas portas em escuta)
# -n = mostrar números ao invés de nomes
# -p = mostrar processo/PID

# Ver conexões UDP
ss -ulnp

# Ver tudo: TCP + UDP
ss -tlunp

# Ver conexões de um programa específico
ss -p | grep nginx

# Verificar se uma porta está em uso
ss -tlnp | grep :80
ss -tlnp | grep :22
ss -tlnp | grep :3306    # MySQL

# Instalar e usar netstat (legado mas ainda útil):
sudo apt install net-tools
netstat -tlnp             # Mesma info que ss -tlnp
netstat -an | grep :80   # Ver conexões na porta 80`}
      />

      <AlertBox type="info" title="Ubuntu e /etc/hosts">
        O arquivo <code>/etc/hosts</code> mapeia nomes para IPs localmente, antes de consultar
        o DNS. Útil para desenvolvimento local: adicione <code>127.0.0.1 meu-projeto.local</code>
        e acesse seu servidor local por nome no navegador.
      </AlertBox>

      <h2>Configurando DNS Personalizado</h2>
      <CodeBlock
        title="Mudar servidores DNS no Ubuntu"
        code={`# No Ubuntu 18.04+, systemd-resolved gerencia o DNS
# Ver DNS em uso:
resolvectl status
systemd-resolve --status | grep "DNS Servers"

# Mudar DNS via nmcli (permanente):
nmcli connection modify "Wired connection 1" \\
    ipv4.dns "1.1.1.1 1.0.0.1"  # Cloudflare
    # ou
    ipv4.dns "8.8.8.8 8.8.4.4"  # Google
    # ou
    ipv4.dns "9.9.9.9 149.112.112.112"  # Quad9

# Aplicar mudanças:
nmcli connection up "Wired connection 1"

# Verificar resolução DNS:
nslookup google.com 8.8.8.8   # Testar com DNS específico
dig @1.1.1.1 google.com       # Testar com Cloudflare`}
      />

      <h2>nmap — Escaner de Rede</h2>
      <CodeBlock
        title="Descobrindo dispositivos e serviços na rede"
        code={`# Instalar nmap
sudo apt install nmap

# Escanear um host
nmap 192.168.1.1

# Descobrir todos os dispositivos na rede local
nmap -sn 192.168.1.0/24
# Hosts na rede: lista de IPs e MACs

# Escanear portas de um servidor
nmap -p 22,80,443,3306 192.168.1.10

# Escanear todas as portas (mais lento)
nmap -p- 192.168.1.10

# Detectar serviços e versões
nmap -sV 192.168.1.10

# Escanear seu próprio IP para ver o que está exposto
nmap localhost
nmap $(hostname -I | awk '{print $1}')`}
      />

      <h2>Firewall UFW e Conectividade</h2>
      <CodeBlock
        title="Verificar e ajustar firewall"
        code={`# Ver regras do firewall (afeta conectividade)
sudo ufw status verbose

# Ver log de bloqueios (para diagnosticar problemas)
sudo tail -f /var/log/ufw.log

# Verificar se UFW está bloqueando uma porta
sudo ufw status numbered | grep 80

# Abrir porta temporariamente para diagnóstico
sudo ufw allow 8080/tcp

# Verificar se iptables tem regras (UFW usa iptables por baixo)
sudo iptables -L -n -v | head -30`}
      />
    </PageContainer>
  );
}
