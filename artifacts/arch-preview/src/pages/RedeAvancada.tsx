import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function RedeAvancada() {
  return (
    <PageContainer
      title="Rede Avançada — systemd-networkd, NetworkManager, iwd"
      subtitle="O Arch não tem Netplan. Aqui você aprende as três pilhas que de fato fazem rede no Arch — quando usar cada uma, com configs reais."
      difficulty="avancado"
      timeToRead="50 min"
      category="Redes"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch com <code>sudo</code>. Útil ter visto <a href="#/redes">Redes</a>.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>nftables</strong> — sucessor do iptables. Padrão moderno para firewall no Linux.
      </p>
      <p>
        <strong>systemd-networkd</strong> — gerenciador de rede leve do systemd (alternativa ao NetworkManager).
      </p>
      <p>
        <strong>NetworkManager</strong> — gerenciador GUI/CLI mais comum em desktops.
      </p>
      <p>
        <strong>Bonding / Bridging</strong> — agregar interfaces (bond) ou criar pontes virtuais (bridge) para VMs/containers.
      </p>
      <p>
        <strong>VLAN</strong> — segmentação lógica de rede via tag 802.1Q.
      </p>

      <p>
        Diferente do Ubuntu (que usa <code>Netplan</code> sobre <code>systemd-networkd</code> ou
        <code> NetworkManager</code>), o Arch deixa <em>você</em> escolher. As três opções
        mainstream são <strong>systemd-networkd</strong> (servidores e setups headless),{" "}
        <strong>NetworkManager</strong> (desktops, integração com GNOME/KDE) e <strong>iwd</strong>{" "}
        (Wi-Fi puro, leve, ótimo para laptops). Esta página mostra como configurar IP estático,
        bridges, VLANs, bonds e Wi-Fi WPA-Enterprise com cada uma.
      </p>

      <AlertBox type="warning" title="Escolha UMA pilha por vez">
        Rodar <code>systemd-networkd</code> e <code>NetworkManager</code> ao mesmo tempo gera
        conflitos sutis (rotas duplicadas, DHCP em loop, DNS pingue-pongando). Habilite
        apenas <strong>uma</strong>.
      </AlertBox>

      <h2>1. systemd-networkd — declarativo, leve, server-grade</h2>

      <p>
        <code>systemd-networkd</code> já vem instalado no Arch. Bastam três tipos de arquivo INI em{" "}
        <code>/etc/systemd/network/</code>:
      </p>

      <OutputBlock
        title="Tipos de arquivo do systemd-networkd"
        output={`*.link      → propriedades de baixo nível (MAC, MTU, nome)   — udev
*.netdev    → criação de devices virtuais (bridge, bond, vlan, wireguard)
*.network   → atribui IP/rotas/DNS a uma interface (física ou virtual)`}
      />

      <TerminalBlock
        command="sudo systemctl enable --now systemd-networkd systemd-resolved"
        output={`Created symlink /etc/systemd/system/dbus-org.freedesktop.network1.service → /usr/lib/systemd/system/systemd-networkd.service.
Created symlink /etc/systemd/system/multi-user.target.wants/systemd-networkd.service → /usr/lib/systemd/system/systemd-networkd.service.`}
      />

      <h3>1.1. DHCP simples (laptop/cabo)</h3>

      <CodeBlock
        title="/etc/systemd/network/20-wired.network"
        language="ini"
        code={`[Match]
Name=enp3s0

[Network]
DHCP=yes
IPv6AcceptRA=yes
DNSSEC=allow-downgrade`}
      />

      <TerminalBlock
        command="sudo networkctl reload && networkctl status enp3s0"
        output={`● 2: enp3s0
                     Link File: /usr/lib/systemd/network/99-default.link
                  Network File: /etc/systemd/network/20-wired.network
                          Type: ether
                         State: routable (configured)
                Online state: online
                  HW Address: 8c:16:45:1a:9b:42 (Intel Corporate)
                         MTU: 1500
                       Driver: e1000e
                Address: 192.168.1.100
                          fe80::8e16:45ff:fe1a:9b42
                Gateway: 192.168.1.1
                    DNS: 192.168.1.1
                          1.1.1.1`}
      />

      <h3>1.2. IP estático + rotas</h3>

      <CodeBlock
        title="/etc/systemd/network/25-static.network"
        language="ini"
        code={`[Match]
Name=enp3s0

[Network]
Address=192.168.1.50/24
Gateway=192.168.1.1
DNS=1.1.1.1
DNS=9.9.9.9
Domains=lan

[Route]
Destination=10.20.0.0/16
Gateway=192.168.1.254
Metric=200`}
      />

      <h3>1.3. Bridge (br0) para libvirt/KVM</h3>

      <CodeBlock
        title="/etc/systemd/network/30-br0.netdev"
        language="ini"
        code={`[NetDev]
Name=br0
Kind=bridge`}
      />

      <CodeBlock
        title="/etc/systemd/network/30-br0.network — IP da bridge"
        language="ini"
        code={`[Match]
Name=br0

[Network]
Address=192.168.1.10/24
Gateway=192.168.1.1
DNS=1.1.1.1
IPMasquerade=ipv4`}
      />

      <CodeBlock
        title="/etc/systemd/network/35-enp3s0-slave.network — anexa eth na bridge"
        language="ini"
        code={`[Match]
Name=enp3s0

[Network]
Bridge=br0`}
      />

      <TerminalBlock
        command="sudo networkctl reload && networkctl"
        output={`IDX LINK    TYPE     OPERATIONAL SETUP
  1 lo      loopback carrier     unmanaged
  2 enp3s0  ether    enslaved    configured
  3 wlan0   wlan     no-carrier  unmanaged
  4 br0     bridge   routable    configured

4 links listed.`}
      />

      <h3>1.4. VLAN tagged</h3>

      <CodeBlock
        title="/etc/systemd/network/40-vlan10.netdev"
        language="ini"
        code={`[NetDev]
Name=vlan10
Kind=vlan

[VLAN]
Id=10`}
      />

      <CodeBlock
        title="/etc/systemd/network/40-enp3s0.network (parent)"
        language="ini"
        code={`[Match]
Name=enp3s0

[Network]
VLAN=vlan10
DHCP=yes`}
      />

      <CodeBlock
        title="/etc/systemd/network/40-vlan10.network (a tagged)"
        language="ini"
        code={`[Match]
Name=vlan10

[Network]
Address=10.10.10.5/24
Gateway=10.10.10.1`}
      />

      <h3>1.5. Bond (LACP 802.3ad)</h3>

      <CodeBlock
        title="/etc/systemd/network/50-bond0.netdev"
        language="ini"
        code={`[NetDev]
Name=bond0
Kind=bond

[Bond]
Mode=802.3ad
LACPTransmitRate=fast
TransmitHashPolicy=layer3+4
MIIMonitorSec=100ms`}
      />

      <CodeBlock
        title="bond0.network + slaves"
        language="ini"
        code={`# 50-bond0.network
[Match]
Name=bond0

[Network]
DHCP=yes

# 50-eno1.network e 50-eno2.network
[Match]
Name=eno1

[Network]
Bond=bond0`}
      />

      <h2>2. NetworkManager (NM) — para desktops</h2>

      <TerminalBlock
        command="sudo pacman -S networkmanager"
        output={`Packages (3) libnewt-0.52.24-2  networkmanager-1.46.0-1  newt-0.52.24-2
Total Installed Size:  16.78 MiB`}
      />

      <TerminalBlock
        command="sudo systemctl enable --now NetworkManager"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/NetworkManager.service → /usr/lib/systemd/system/NetworkManager.service.`}
      />

      <h3>2.1. nmcli — referência rápida</h3>

      <CommandFlagList
        command="nmcli"
        items={[
          { flag: "general status", description: "estado geral do NM (online/offline, DNS, WiFi-HW)." },
          { flag: "device status", description: "lista todas as interfaces e a connection ativa em cada." },
          { flag: "connection show", description: "todas as conexões salvas (UUID, tipo, device)." },
          { flag: "device wifi list", description: "scan de Wi-Fi com SSID/sinal/segurança/canal." },
          { flag: "device wifi connect SSID password SENHA", description: "conecta rapidamente a uma rede aberta/WPA-PSK.", example: "nmcli device wifi connect Casa password 'minha-senha'" },
          { flag: "connection add", description: "cria uma connection nova (qualquer tipo).", example: "nmcli con add type ethernet ifname enp3s0 con-name dock" },
          { flag: "connection modify NOME PROP VALOR", description: "ajusta uma conexão; prop usa notação dot-path (ipv4.method, 802-1x.identity)." },
          { flag: "connection up / down NOME", description: "ativa/desativa." },
          { flag: "device disconnect IFACE", description: "desconecta sem deletar a conexão." },
          { flag: "-f IP4,IP6 ...", description: "filtra colunas; -t = sem cabeçalho (script-friendly)." },
        ]}
      />

      <TerminalBlock
        command="nmcli general status"
        output={`STATE      CONNECTIVITY  WIFI-HW  WIFI     WWAN-HW  WWAN
{g}connected{/}  {g}full{/}          enabled  enabled  enabled  enabled`}
      />

      <h3>2.2. IP estático com nmcli</h3>

      <TerminalBlock
        command={`nmcli connection modify "Wired connection 1" \\
    ipv4.method manual \\
    ipv4.addresses 192.168.1.50/24 \\
    ipv4.gateway 192.168.1.1 \\
    ipv4.dns "1.1.1.1,9.9.9.9" \\
    ipv4.dns-search lan`}
        output=""
      />

      <TerminalBlock
        command={`nmcli connection up "Wired connection 1"`}
        output={`Connection successfully activated (D-Bus active path: /org/freedesktop/NetworkManager/ActiveConnection/4)`}
      />

      <h3>2.3. Wi-Fi WPA-Enterprise (corporativo)</h3>

      <TerminalBlock
        command={`nmcli connection add type wifi con-name "EmpresaWiFi" ifname wlan0 ssid "EmpresaWiFi" \\
  -- 802-11-wireless-security.key-mgmt wpa-eap \\
     802-1x.eap peap \\
     802-1x.phase2-auth mschapv2 \\
     802-1x.identity "joao.silva" \\
     802-1x.password "senha-secreta"`}
        output={`Connection 'EmpresaWiFi' (a3f1c0b2-...) successfully added.`}
      />

      <TerminalBlock
        command="nmcli connection up EmpresaWiFi"
        output={`Connection successfully activated (D-Bus active path: /org/freedesktop/NetworkManager/ActiveConnection/5)`}
      />

      <h3>2.4. Bridge no NM</h3>

      <TerminalBlock
        command={`nmcli con add type bridge con-name br0 ifname br0
nmcli con modify br0 ipv4.method manual ipv4.addresses 192.168.1.10/24 ipv4.gateway 192.168.1.1
nmcli con add type bridge-slave con-name br0-eno1 ifname eno1 master br0
nmcli con up br0`}
        output={`Connection 'br0' successfully added.
Connection 'br0-eno1' successfully added.
Connection successfully activated`}
      />

      <h3>2.5. nmtui — TUI fullscreen</h3>

      <TerminalBlock
        command="nmtui"
        output={`┌─ NetworkManager TUI ────────────────┐
│                                      │
│   Edit a connection                  │
│   Activate a connection              │
│   Set system hostname                │
│                                      │
│   <Quit>                             │
│                                      │
└──────────────────────────────────────┘`}
      />

      <AlertBox type="info" title="NM + iwd como backend Wi-Fi">
        Por padrão NM usa <code>wpa_supplicant</code>. Para usar o <code>iwd</code> (mais leve e
        rápido em roaming): crie{" "}
        <code>/etc/NetworkManager/conf.d/wifi_backend.conf</code> com{" "}
        <code>[device]\nwifi.backend=iwd</code>, depois{" "}
        <code>sudo systemctl restart NetworkManager iwd</code>.
      </AlertBox>

      <h2>3. iwd — Wi-Fi puro (sem NM)</h2>

      <TerminalBlock
        command="sudo pacman -S iwd && sudo systemctl enable --now iwd"
        output={`Packages (1)  iwd-2.20-1
Total Installed Size:  2.91 MiB
Created symlink /etc/systemd/system/multi-user.target.wants/iwd.service → /usr/lib/systemd/system/iwd.service.`}
      />

      <h3>3.1. Sessão interativa do iwctl</h3>

      <TerminalBlock command="iwctl" output="{c}[iwd]#{/}" />

      <TerminalBlock
        prompt="[iwd]# "
        command="device list"
        output={`                                Devices                                
--------------------------------------------------------------------------
  {bold}Name{/}      {bold}Address{/}            {bold}Powered{/}    {bold}Adapter{/}    {bold}Mode{/}
--------------------------------------------------------------------------
  wlan0     b4:6b:fc:88:21:7e  {g}on{/}         phy0       station`}
      />

      <TerminalBlock
        prompt="[iwd]# "
        command="station wlan0 scan"
        comment="async — espere ~2s"
      />

      <TerminalBlock
        prompt="[iwd]# "
        command="station wlan0 get-networks"
        output={`                          Available networks                          
--------------------------------------------------------------------------
      {bold}Network name{/}                    {bold}Security{/}     {bold}Signal{/}
--------------------------------------------------------------------------
  >   {g}MinhaRede{/}                       psk          {g}****{/}
      Vizinho_5G                      psk          {y}***{/}
      Cafe_Aberto                     open         {y}**{/}`}
      />

      <TerminalBlock
        prompt="[iwd]# "
        command={`station wlan0 connect "MinhaRede"`}
        output={`Type the network passphrase for {c}MinhaRede{/} psk.
Passphrase: {dim}********{/}`}
      />

      <h3>3.2. iwd + systemd-networkd para IP/DHCP</h3>

      <p>
        Por padrão <code>iwd</code> só faz Wi-Fi (associação). Para que ele também faça DHCP, edite:
      </p>

      <CodeBlock
        title="/etc/iwd/main.conf"
        language="ini"
        code={`[General]
EnableNetworkConfiguration=true

[Network]
NameResolvingService=systemd`}
      />

      <p>
        Alternativa mais comum: deixe o <code>iwd</code> só associar e use <code>systemd-networkd</code>{" "}
        com o <code>20-wlan.network</code> abaixo.
      </p>

      <CodeBlock
        title="/etc/systemd/network/25-wlan0.network"
        language="ini"
        code={`[Match]
Name=wlan0

[Network]
DHCP=yes
IgnoreCarrierLoss=3s`}
      />

      <h2>4. dhcpcd — alternativa minimalista</h2>

      <TerminalBlock
        command="sudo pacman -S dhcpcd && sudo systemctl enable --now dhcpcd@enp3s0.service"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/dhcpcd@enp3s0.service → /usr/lib/systemd/system/dhcpcd@.service.`}
      />

      <CodeBlock
        title="/etc/dhcpcd.conf — IP estático"
        code={`hostname

interface enp3s0
static ip_address=192.168.1.50/24
static routers=192.168.1.1
static domain_name_servers=1.1.1.1 9.9.9.9`}
      />

      <h2>5. ip / iproute2 — operações em runtime</h2>

      <CommandFlagList
        command="ip"
        items={[
          { flag: "addr", description: "endereços IPv4/IPv6 das interfaces.", example: "ip -br -c addr" },
          { flag: "link", description: "estado L2 (up/down, MTU, MAC).", example: "ip link set enp3s0 mtu 9000" },
          { flag: "route", description: "tabela de roteamento.", example: "ip route get 8.8.8.8" },
          { flag: "neigh", description: "tabela ARP/NDP." },
          { flag: "rule", description: "regras de policy routing (multi-tabela)." },
          { flag: "tunnel / netns / vrf", description: "túneis (gre, ipip, sit), namespaces, VRFs." },
          { flag: "-s", description: "estatísticas de tráfego/erros.", example: "ip -s link show enp3s0" },
          { flag: "-c", description: "saída colorida (em TTY já é default)." },
          { flag: "-br", description: "saída resumida (uma linha por interface)." },
          { flag: "-j -p", description: "JSON formatado (parse com jq)." },
        ]}
      />

      <TerminalBlock
        command="ip -s link show enp3s0"
        output={`2: enp3s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP mode DEFAULT group default qlen 1000
    link/ether 8c:16:45:1a:9b:42 brd ff:ff:ff:ff:ff:ff
    RX: bytes  packets  errors  dropped overrun mcast
    18472913   142318   0       12      0       4218
    TX: bytes  packets  errors  dropped carrier collsns
    8472113    98214    0       0       0       0`}
      />

      <h2>6. Troubleshooting</h2>

      <TerminalBlock
        command="networkctl"
        output={`IDX LINK    TYPE     OPERATIONAL SETUP
  1 lo      loopback carrier     unmanaged
  2 enp3s0  ether    {g}routable{/}    configured
  3 wlan0   wlan     {y}degraded{/}    configuring
4 links listed.`}
      />

      <OutputBlock
        title="Estados OPERATIONAL relevantes"
        output={`missing      iface não existe
off          desligada (link down)
no-carrier   cabo desconectado / Wi-Fi desassociado
dormant      autenticando 802.1x
degraded     IP local-link só (sem default route)
routable     tem rota default — internet OK
carrier      L2 ok mas SETUP=unmanaged (NM cuida)`}
      />

      <TerminalBlock
        command="networkctl status enp3s0"
        output={`● 2: enp3s0
                     Link File: /usr/lib/systemd/network/99-default.link
                  Network File: /etc/systemd/network/20-wired.network
                         State: routable (configured)
                Online state: online
                       Driver: e1000e
                          MTU: 1500
                Address: 192.168.1.100
                Gateway: 192.168.1.1
                          fe80::1`}
      />

      <TerminalBlock
        command="journalctl -u systemd-networkd -b --no-pager | tail -10"
        output={`Mar 26 14:22:11 archlinux systemd-networkd[412]: enp3s0: Link UP
Mar 26 14:22:11 archlinux systemd-networkd[412]: enp3s0: Gained carrier
Mar 26 14:22:13 archlinux systemd-networkd[412]: enp3s0: DHCPv4 address 192.168.1.100/24 via 192.168.1.1
Mar 26 14:22:13 archlinux systemd-networkd[412]: enp3s0: Configured`}
      />

      <TerminalBlock
        comment="testa em camadas"
        command="ip route get 1.1.1.1"
        output={`1.1.1.1 via 192.168.1.1 dev enp3s0 src 192.168.1.100 uid 1000
    cache`}
      />

      <AlertBox type="success" title="Receita de bolso de troubleshooting">
        1) <code>ip -br link</code> — interface UP? 2) <code>ip -br addr</code> — tem IP? 3){" "}
        <code>ip route</code> — tem default? 4) <code>ping 1.1.1.1</code> — L3 ok? 5){" "}
        <code>dig @1.1.1.1 example.com</code> — DNS direto funciona? Cada NÃO = camada onde
        focar.
      </AlertBox>

      <h2>7. Comparativo final</h2>

      <OutputBlock
        title="Quem usar quando"
        output={`cenário                                     escolha
servidor headless, IP estático              systemd-networkd
laptop multi-Wi-Fi, troca de redes ao vivo  NetworkManager
desktop GNOME/KDE                           NetworkManager
laptop minimalista, só Wi-Fi                iwd (puro)
container LXC/host KVM com bridge           systemd-networkd
config como código/IaC (Ansible, NixOS)     systemd-networkd
802.1x corporativo com GUI                  NetworkManager
embedded / raspberry com pouca RAM          dhcpcd ou networkd`}
      />

      <h2>8. Cola de bolso</h2>

      <OutputBlock
        title="Comandos por pilha"
        output={`# systemd-networkd
sudo systemctl enable --now systemd-networkd systemd-resolved
sudo networkctl reload | status | up | down
networkctl                          # estado
ls /etc/systemd/network/

# NetworkManager
nmcli general status
nmcli device status
nmcli connection show
nmcli device wifi list
nmcli device wifi connect SSID password SENHA
nmcli connection up|down NAME

# iwd
sudo systemctl enable --now iwd
iwctl
  device list
  station wlan0 scan
  station wlan0 get-networks
  station wlan0 connect SSID

# iproute2 (qualquer pilha)
ip -br -c link
ip -br -c addr
ip route
ip route get IP`}
      />
    </PageContainer>
  );
}
