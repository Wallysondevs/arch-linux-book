import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";

export default function Redes() {
  return (
    <PageContainer
      title="Redes e Conectividade"
      subtitle="Configure conexões com fio e Wi-Fi, diagnostique problemas de rede e domine ip, ss, nmcli, iwctl, dig, curl e tcpdump — com output real de cada comando."
      difficulty="intermediario"
      timeToRead="45 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch com terminal. Alguns comandos exigem <code>sudo</code>.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Interface</strong> — dispositivo de rede: <code>enp3s0</code> (cabo), <code>wlp2s0</code> (Wi-Fi), <code>lo</code> (loopback).
      </p>
      <p>
        <strong>IP</strong> — endereço único na rede. IPv4 e IPv6.
      </p>
      <p>
        <strong>Gateway</strong> — roteador padrão para sair da rede local.
      </p>
      <p>
        <strong>ip / iw</strong> — <code>ip</code> é o moderno (vem em <code>iproute2</code>); <code>iw</code> é específico para Wi-Fi.
      </p>
      <p>
        <strong>ping / traceroute / ss</strong> — testar conectividade, rastrear rota, listar sockets.
      </p>

      <p>
        No Arch Linux a rede não vem configurada como em distros amigáveis: você precisa entender as
        ferramentas modernas (<code>iproute2</code>, <code>iwd</code>, <code>systemd-resolved</code>,{" "}
        <code>NetworkManager</code>) e ler suas saídas. Esta página mostra o output verbatim de cada
        comando — coluna a coluna.
      </p>

      <h2>1. ip — A ferramenta universal (iproute2)</h2>
      <p>
        O comando <code>ip</code> substituiu <code>ifconfig</code>, <code>route</code> e{" "}
        <code>arp</code>. É a forma moderna e completa de gerenciar tudo: endereços, rotas, links,
        vizinhos, namespaces.
      </p>

      <h3>ip addr — endereços IPv4/IPv6</h3>
      <TerminalBlock
        command="ip addr"
        output={`1: {y}lo{/}: <{g}LOOPBACK,UP,LOWER_UP{/}> mtu 65536 qdisc noqueue state {g}UNKNOWN{/} group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet {b}127.0.0.1/8{/} scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: {y}enp3s0{/}: <{g}BROADCAST,MULTICAST,UP,LOWER_UP{/}> mtu 1500 qdisc fq_codel state {g}UP{/} group default qlen 1000
    link/ether 8c:16:45:1a:9b:42 brd ff:ff:ff:ff:ff:ff
    inet {b}192.168.1.100/24{/} brd 192.168.1.255 scope global dynamic noprefixroute enp3s0
       valid_lft 86234sec preferred_lft 86234sec
    inet6 fe80::8e16:45ff:fe1a:9b42/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
3: {y}wlan0{/}: <{r}NO-CARRIER,BROADCAST,MULTICAST,UP{/}> mtu 1500 qdisc noqueue state {r}DOWN{/} group default qlen 1000
    link/ether b4:6b:fc:88:21:7e brd ff:ff:ff:ff:ff:ff`}
      />
      <OutputBlock
        title="lendo a saída de ip addr coluna a coluna"
        output={`2: enp3s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 ... state UP
    link/ether 8c:16:45:1a:9b:42 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.100/24 brd 192.168.1.255 scope global dynamic`}
        annotations={[
          { line: 0, note: "índice : nome : flags da interface (UP, LOWER_UP = cabo conectado)" },
          { line: 1, note: "MAC address (link-layer) e broadcast" },
          { line: 2, note: "IPv4, máscara /24, scope global = roteável; dynamic = veio do DHCP" },
        ]}
      />

      <h3>Variações úteis de ip addr</h3>
      <TerminalBlock
        command="ip -4 -br addr"
        comment="-br = brief (uma linha por interface), -4 = só IPv4"
        output={`lo               UNKNOWN        127.0.0.1/8
enp3s0           UP             192.168.1.100/24
wlan0            DOWN`}
      />
      <TerminalBlock
        command="ip -c addr show enp3s0"
        comment="-c liga as cores ANSI mesmo sem TTY"
        output={`2: {y}enp3s0{/}: <{g}BROADCAST,MULTICAST,UP,LOWER_UP{/}> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 8c:16:45:1a:9b:42 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.100/24 brd 192.168.1.255 scope global dynamic noprefixroute enp3s0`}
      />
      <TerminalBlock
        command="sudo ip addr add 192.168.1.200/24 dev enp3s0"
        output=""
        comment="adiciona um IP secundário (não tem output em sucesso)"
      />
      <TerminalBlock
        command="sudo ip addr add 192.168.1.200/24 dev enp3s0"
        output={`{r}RTNETLINK answers: File exists{/}`}
        exitCode={2}
        comment="rodar o mesmo comando 2x → já existe"
      />

      <AlertBox type="info" title="Nomes de interface no Arch (Predictable Network Interface Names)">
        O systemd renomeia interfaces para nomes previsíveis baseados em barramento:
        <code>enp3s0</code> = ethernet PCI bus 3 slot 0; <code>wlp2s0</code> = wireless PCI 2/0;
        <code>wlan0</code> aparece se você desabilitar esse esquema (kernel parameter{" "}
        <code>net.ifnames=0</code>).
      </AlertBox>

      <h3>ip link — estado da camada 2</h3>
      <TerminalBlock
        command="ip -br link"
        output={`lo               UNKNOWN        00:00:00:00:00:00 <LOOPBACK,UP,LOWER_UP>
enp3s0           UP             8c:16:45:1a:9b:42 <BROADCAST,MULTICAST,UP,LOWER_UP>
wlan0            DOWN           b4:6b:fc:88:21:7e <NO-CARRIER,BROADCAST,MULTICAST,UP>`}
      />
      <TerminalBlock command="sudo ip link set enp3s0 down" output="" comment="desliga a interface" />
      <TerminalBlock
        command="ip -br link show enp3s0"
        output={`enp3s0           DOWN           8c:16:45:1a:9b:42 <BROADCAST,MULTICAST>`}
        comment="agora aparece DOWN, sem UP/LOWER_UP"
      />
      <TerminalBlock command="sudo ip link set enp3s0 up" output="" />
      <TerminalBlock
        command="sudo ip link set enp3s0 mtu 9000"
        output=""
        comment="ativa jumbo frames (precisa do switch suportar)"
      />

      <h3>ip route — tabela de rotas</h3>
      <TerminalBlock
        command="ip route"
        output={`default via 192.168.1.1 dev enp3s0 proto dhcp src 192.168.1.100 metric 100
192.168.1.0/24 dev enp3s0 proto kernel scope link src 192.168.1.100 metric 100
169.254.0.0/16 dev enp3s0 scope link metric 1000`}
      />
      <OutputBlock
        title="ip route linha por linha"
        output={`default via 192.168.1.1 dev enp3s0 proto dhcp src 192.168.1.100 metric 100
192.168.1.0/24 dev enp3s0 proto kernel scope link src 192.168.1.100 metric 100
169.254.0.0/16 dev enp3s0 scope link metric 1000`}
        annotations={[
          { line: 0, note: "rota default = gateway; proto dhcp = veio do DHCP server" },
          { line: 1, note: "rota da rede local; scope link = só vizinhos diretos" },
          { line: 2, note: "rota link-local IPv4 (auto-IP); metric alto = só se nada mais funcionar" },
        ]}
      />
      <TerminalBlock
        command="ip route get 8.8.8.8"
        output={`8.8.8.8 via 192.168.1.1 dev enp3s0 src 192.168.1.100 uid 1000
    cache`}
        comment="responde QUAL rota seria usada (ótimo para debug)"
      />
      <TerminalBlock
        command="sudo ip route add 10.20.0.0/16 via 192.168.1.254 dev enp3s0"
        output=""
      />
      <TerminalBlock
        command="sudo ip route del 10.20.0.0/16"
        output=""
      />

      <h3>ip neigh — tabela ARP / vizinhos</h3>
      <TerminalBlock
        command="ip neigh"
        output={`192.168.1.1 dev enp3s0 lladdr a4:2b:b0:5e:11:c0 {g}REACHABLE{/}
192.168.1.50 dev enp3s0 lladdr 00:25:b3:01:aa:fe {y}STALE{/}
192.168.1.99 dev enp3s0  {dim}FAILED{/}`}
      />
      <p className="text-sm text-muted-foreground">
        REACHABLE = vizinho confirmado. STALE = não responde há &gt;30s, será re-checado.
        FAILED = ARP não respondeu (host desligado).
      </p>

      <h2>2. Wi-Fi com iwctl (iwd)</h2>
      <p>
        O <code>iwd</code> é o daemon Wi-Fi padrão do live ISO do Arch. É leve, rápido e completo.
      </p>

      <TerminalBlock
        command="sudo systemctl enable --now iwd"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/iwd.service → /usr/lib/systemd/system/iwd.service.`}
      />

      <h3>Sessão interativa típica do iwctl</h3>
      <TerminalBlock
        command="iwctl"
        output={`{c}[iwd]#{/}`}
      />
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
        output=""
        comment="scan é assíncrono — espere 2s antes do get-networks"
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
      Cafe_Aberto                     open         {y}**{/}
      IoT-Setup                       psk          {r}*{/}`}
      />
      <TerminalBlock
        prompt="[iwd]# "
        command='station wlan0 connect "MinhaRede"'
        output={`Type the network passphrase for {c}MinhaRede{/} psk.
Passphrase: {dim}********{/}`}
      />
      <TerminalBlock
        prompt="[iwd]# "
        command="station wlan0 show"
        output={`                            Station: wlan0                             
--------------------------------------------------------------------------
            {bold}Settable{/}    {bold}Property{/}              {bold}Value{/}
--------------------------------------------------------------------------
                        Scanning              no
                        State                 {g}connected{/}
                        Connected network     MinhaRede
                        IPv4 address          192.168.1.150
            *           ConnectedAccessPoint  a4:2b:b0:5e:11:c0`}
      />

      <h3>Modo não-interativo (scriptável)</h3>
      <TerminalBlock
        command="iwctl --passphrase 'minha_senha' station wlan0 connect MinhaRede"
        output=""
      />
      <TerminalBlock
        command="iwctl known-networks list"
        output={`                          Known Networks                           
--------------------------------------------------------------------------
  {bold}Name{/}            {bold}Security{/}    {bold}Hidden{/}    {bold}Auto-connect{/}     {bold}Last connected{/}
--------------------------------------------------------------------------
  MinhaRede       psk         No        Yes              now
  Cafe_Aberto     open        No        Yes              7 days ago`}
      />

      <AlertBox type="warning" title="iwd vs NetworkManager">
        Ambos funcionam, mas <strong>não rode os dois ao mesmo tempo</strong>. NetworkManager pode
        usar iwd como backend (<code>/etc/NetworkManager/conf.d/wifi_backend.conf</code>). Em
        servidores headless, iwd puro é suficiente.
      </AlertBox>

      <h2>3. NetworkManager (nmcli)</h2>
      <TerminalBlock
        command="sudo pacman -S networkmanager"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (3) libnewt-0.52.24-2  networkmanager-1.46.0-1  newt-0.52.24-2

Total Download Size:    3.42 MiB
Total Installed Size:  16.78 MiB

:: Proceed with installation? [Y/n] `}
      />
      <TerminalBlock
        command="sudo systemctl enable --now NetworkManager"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/NetworkManager.service → /usr/lib/systemd/system/NetworkManager.service.`}
      />

      <h3>nmcli — visão geral</h3>
      <TerminalBlock
        command="nmcli general status"
        output={`STATE      CONNECTIVITY  WIFI-HW  WIFI     WWAN-HW  WWAN
{g}connected{/}  {g}full{/}          enabled  enabled  enabled  enabled`}
      />
      <TerminalBlock
        command="nmcli device status"
        output={`DEVICE   TYPE      STATE                   CONNECTION
enp3s0   ethernet  {g}connected{/}               Wired connection 1
wlan0    wifi      {g}connected{/}               MinhaRede
lo       loopback  unmanaged               --`}
      />
      <TerminalBlock
        command="nmcli connection show"
        output={`NAME                 UUID                                  TYPE      DEVICE
MinhaRede            a3f1c0b2-1d4f-4d2a-9c11-7e9a4d2e1f00  wifi      wlan0
Wired connection 1   3c8b9d4a-22ee-4a01-8f12-1abc9d77b210  ethernet  enp3s0
Cafe_Aberto          11a2b3c4-5566-7788-99aa-bbccddeeff00  wifi      --`}
      />

      <h3>Listar e conectar Wi-Fi via nmcli</h3>
      <TerminalBlock
        command="nmcli device wifi list"
        output={`IN-USE  BSSID              SSID         MODE   CHAN  RATE        SIGNAL  BARS  SECURITY
*       A4:2B:B0:5E:11:C0  MinhaRede    Infra  6     270 Mbit/s  {g}88{/}      ▂▄▆█  WPA2
        58:EF:68:11:22:33  Vizinho_5G   Infra  44    540 Mbit/s  {y}65{/}      ▂▄▆_  WPA3
        00:11:22:33:44:55  Cafe_Aberto  Infra  11    130 Mbit/s  {y}54{/}      ▂▄▆_  --
        AC:DE:48:00:11:22  IoT-Setup    Infra  1     54 Mbit/s   {r}28{/}      ▂___  WPA2`}
      />
      <TerminalBlock
        command='nmcli device wifi connect "MinhaRede" password "minha_senha"'
        output={`Device 'wlan0' successfully activated with 'a3f1c0b2-1d4f-4d2a-9c11-7e9a4d2e1f00'.`}
      />

      <h3>Configurar IP estático via nmcli</h3>
      <TerminalBlock
        command={`nmcli connection modify "Wired connection 1" \\
    ipv4.method manual \\
    ipv4.addresses 192.168.1.50/24 \\
    ipv4.gateway 192.168.1.1 \\
    ipv4.dns "1.1.1.1,1.0.0.1"`}
        output=""
      />
      <TerminalBlock
        command={`nmcli connection up "Wired connection 1"`}
        output={`Connection successfully activated (D-Bus active path: /org/freedesktop/NetworkManager/ActiveConnection/4)`}
      />
      <TerminalBlock
        command={`nmcli -f IP4 connection show "Wired connection 1"`}
        output={`IP4.ADDRESS[1]:                         192.168.1.50/24
IP4.GATEWAY:                            192.168.1.1
IP4.ROUTE[1]:                           dst = 0.0.0.0/0, nh = 192.168.1.1, mt = 100
IP4.ROUTE[2]:                           dst = 192.168.1.0/24, nh = 0.0.0.0, mt = 100
IP4.DNS[1]:                             1.1.1.1
IP4.DNS[2]:                             1.0.0.1`}
      />

      <h2>4. ss — Socket statistics (substituto do netstat)</h2>

      <TerminalBlock
        command="ss -tunlp"
        output={`Netid  State   Recv-Q  Send-Q   Local Address:Port    Peer Address:Port  Process
udp    UNCONN  0       0              127.0.0.54:53           0.0.0.0:*      users:(("systemd-resolve",pid=412,fd=15))
udp    UNCONN  0       0          127.0.0.53%lo:53           0.0.0.0:*      users:(("systemd-resolve",pid=412,fd=13))
tcp    LISTEN  0       4096           127.0.0.54:53           0.0.0.0:*      users:(("systemd-resolve",pid=412,fd=16))
tcp    LISTEN  0       4096       127.0.0.53%lo:53           0.0.0.0:*      users:(("systemd-resolve",pid=412,fd=14))
tcp    LISTEN  0       128                0.0.0.0:22            0.0.0.0:*      users:(("sshd",pid=789,fd=3))
tcp    LISTEN  0       128                   [::]:22               [::]:*      users:(("sshd",pid=789,fd=4))
tcp    LISTEN  0       4096           127.0.0.1:631           0.0.0.0:*      users:(("cupsd",pid=901,fd=7))`}
      />
      <OutputBlock
        title="anatomia da saída do ss -tunlp"
        output={`Netid  State   Recv-Q  Send-Q   Local Address:Port    Peer Address:Port  Process
tcp    LISTEN  0       128            0.0.0.0:22            0.0.0.0:*      users:(("sshd",pid=789,fd=3))`}
        annotations={[
          { line: 0, note: "cabeçalho fixo" },
          { line: 1, note: "Netid=tcp; LISTEN; bind 0.0.0.0 (todas as interfaces); sshd PID 789" },
        ]}
      />

      <h3>Flags do ss explicadas</h3>
      <TerminalBlock
        command="ss -t state established"
        output={`Recv-Q   Send-Q   Local Address:Port      Peer Address:Port    Process
0        0        192.168.1.100:42118    140.82.121.4:443
0        0        192.168.1.100:55320    104.21.59.10:443
0        36       192.168.1.100:22       192.168.1.50:51234`}
        comment="só conexões TCP estabelecidas (Send-Q 36 = 36 bytes na fila de envio)"
      />
      <TerminalBlock
        command="ss -s"
        output={`Total: 412
TCP:   28 (estab 12, closed 8, orphaned 0, timewait 8)

Transport Total     IP        IPv6
RAW       1         0         1
UDP       9         5         4
TCP       20        14        6
INET      30        19        11
FRAG      0         0         0`}
        comment="-s = summary (estatísticas globais)"
      />

      <AlertBox type="info" title="netstat está obsoleto">
        Equivalências: <code>netstat -tulnp</code> = <code>ss -tulnp</code>;{" "}
        <code>netstat -rn</code> = <code>ip route</code>; <code>netstat -i</code> ={" "}
        <code>ip -s link</code>.
      </AlertBox>

      <h2>5. Diagnóstico: ping, traceroute, mtr</h2>

      <h3>ping</h3>
      <TerminalBlock
        command="ping -c 4 archlinux.org"
        output={`PING archlinux.org (95.217.163.246) 56(84) bytes of data.
64 bytes from apollo.archlinux.org (95.217.163.246): icmp_seq=1 ttl=51 time=148 ms
64 bytes from apollo.archlinux.org (95.217.163.246): icmp_seq=2 ttl=51 time=147 ms
64 bytes from apollo.archlinux.org (95.217.163.246): icmp_seq=3 ttl=51 time=149 ms
64 bytes from apollo.archlinux.org (95.217.163.246): icmp_seq=4 ttl=51 time=147 ms

--- archlinux.org ping statistics ---
4 packets transmitted, 4 received, {g}0% packet loss{/}, time 3004ms
rtt min/avg/max/mdev = 147.012/147.882/149.144/0.821 ms`}
      />
      <TerminalBlock
        command="ping -c 2 10.99.99.99"
        output={`PING 10.99.99.99 (10.99.99.99) 56(84) bytes of data.
From 192.168.1.1 icmp_seq=1 {r}Destination Host Unreachable{/}
From 192.168.1.1 icmp_seq=2 {r}Destination Host Unreachable{/}

--- 10.99.99.99 ping statistics ---
2 packets transmitted, 0 received, +2 errors, {r}100% packet loss{/}, time 1015ms`}
        exitCode={1}
        comment="host inexistente — gateway responde 'Destination Host Unreachable'"
      />

      <h3>traceroute & mtr</h3>
      <TerminalBlock
        command="traceroute -n archlinux.org"
        output={`traceroute to archlinux.org (95.217.163.246), 30 hops max, 60 byte packets
 1  192.168.1.1       0.412 ms  0.385 ms  0.358 ms
 2  100.64.0.1        9.214 ms  9.118 ms  9.022 ms
 3  10.255.255.1     11.512 ms  11.408 ms  11.302 ms
 4  187.32.96.13     12.117 ms  12.045 ms  11.998 ms
 5  * * *
 6  213.248.96.250   72.114 ms  71.880 ms  71.745 ms
 7  62.115.122.235  144.120 ms  144.011 ms  143.880 ms
 8  95.217.163.246  148.220 ms  148.118 ms  147.985 ms`}
        comment="* * * = roteador não responde a ICMP (firewall, normal)"
      />
      <TerminalBlock
        command="mtr -rwc 5 archlinux.org"
        output={`Start: 2025-01-15T14:22:08+0000
HOST: archlinux                                Loss%   Snt   Last   Avg  Best  Wrst StDev
  1.|-- _gateway                                0.0%     5    0.4   0.4   0.3   0.5   0.1
  2.|-- 100.64.0.1                              0.0%     5    9.1   9.2   9.0   9.5   0.2
  3.|-- 10.255.255.1                            0.0%     5   11.4  11.5  11.3  11.7   0.1
  4.|-- 187.32.96.13                            0.0%     5   12.0  12.1  12.0  12.3   0.1
  5.|-- ???                                    100.0     5    0.0   0.0   0.0   0.0   0.0
  6.|-- 213.248.96.250                          0.0%     5   71.9  72.0  71.7  72.5   0.3
  7.|-- 62.115.122.235                          0.0%     5  144.0 144.1 143.8 144.5   0.2
  8.|-- apollo.archlinux.org                    0.0%     5  148.0 148.2 147.9 148.5   0.2`}
        comment="-r relatório, -w wide, -c 5 = 5 ciclos"
      />

      <h2>6. DNS — dig, host, nslookup, resolvectl</h2>

      <h3>dig (do pacote bind)</h3>
      <TerminalBlock
        command="dig archlinux.org +noall +answer"
        output={`archlinux.org.          1800    IN      A       95.217.163.246`}
        comment="+noall +answer = só os RRs da resposta"
      />
      <TerminalBlock
        command="dig archlinux.org"
        output={`; <<>> DiG 9.20.0 <<>> archlinux.org
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: {g}NOERROR{/}, id: 41258
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;archlinux.org.                 IN      A

;; ANSWER SECTION:
archlinux.org.          1800    IN      A       95.217.163.246

;; Query time: 12 msec
;; SERVER: 127.0.0.53#53(127.0.0.53) (UDP)
;; WHEN: Wed Jan 15 14:30:42 UTC 2025
;; MSG SIZE  rcvd: 58`}
      />
      <OutputBlock
        title="seções da saída padrão de dig"
        output={`;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 41258
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1
;; QUESTION SECTION:
;archlinux.org.                 IN      A
;; ANSWER SECTION:
archlinux.org.          1800    IN      A       95.217.163.246
;; SERVER: 127.0.0.53#53(127.0.0.53) (UDP)`}
        annotations={[
          { line: 0, note: "status NOERROR (NXDOMAIN = não existe)" },
          { line: 1, note: "rd = recursão desejada; ra = recursão disponível" },
          { line: 2, note: "o que foi perguntado (registro A IPv4)" },
          { line: 4, note: "TTL=1800s; classe IN; resposta" },
          { line: 6, note: "qual servidor respondeu (resolved local em 127.0.0.53)" },
        ]}
      />
      <TerminalBlock
        command="dig MX gmail.com +short"
        output={`5 gmail-smtp-in.l.google.com.
10 alt1.gmail-smtp-in.l.google.com.
20 alt2.gmail-smtp-in.l.google.com.
30 alt3.gmail-smtp-in.l.google.com.
40 alt4.gmail-smtp-in.l.google.com.`}
      />
      <TerminalBlock
        command="dig @1.1.1.1 archlinux.org +short"
        output={`95.217.163.246`}
        comment="@1.1.1.1 força usar o resolvedor da Cloudflare"
      />
      <TerminalBlock
        command="dig -x 8.8.8.8 +short"
        output={`dns.google.`}
        comment="reverse lookup (PTR)"
      />

      <h3>host & nslookup</h3>
      <TerminalBlock
        command="host archlinux.org"
        output={`archlinux.org has address 95.217.163.246
archlinux.org mail is handled by 10 mail.archlinux.org.`}
      />
      <TerminalBlock
        command="nslookup archlinux.org 1.1.1.1"
        output={`Server:         1.1.1.1
Address:        1.1.1.1#53

Non-authoritative answer:
Name:   archlinux.org
Address: 95.217.163.246`}
      />

      <h3>systemd-resolved (resolvectl)</h3>
      <TerminalBlock
        command="resolvectl status"
        output={`Global
       Protocols: -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
resolv.conf mode: stub

Link 2 (enp3s0)
    Current Scopes: DNS
         Protocols: +DefaultRoute +LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
Current DNS Server: 192.168.1.1
       DNS Servers: 192.168.1.1 1.1.1.1
        DNS Domain: ~.`}
      />
      <TerminalBlock
        command="resolvectl query archlinux.org"
        output={`archlinux.org: 95.217.163.246           -- link: enp3s0

-- Information acquired via protocol DNS in 14.2ms.
-- Data is authenticated: no; Data was acquired via local or encrypted transport: no
-- Data from: network`}
      />

      <h2>7. curl — cliente HTTP / debug</h2>
      <TerminalBlock
        command="curl -I https://archlinux.org"
        output={`HTTP/2 200
server: nginx
date: Wed, 15 Jan 2025 14:35:21 GMT
content-type: text/html; charset=utf-8
strict-transport-security: max-age=31536000; includeSubDomains
x-frame-options: DENY
referrer-policy: strict-origin-when-cross-origin`}
        comment="-I = HEAD request (só headers)"
      />
      <TerminalBlock
        command="curl -v https://archlinux.org/ -o /dev/null"
        output={`*   Trying 95.217.163.246:443...
* Connected to archlinux.org (95.217.163.246) port 443
* ALPN: curl offers h2,http/1.1
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 / X25519 / RSASSA-PSS
* Server certificate:
*  subject: CN=archlinux.org
*  start date: Dec  3 00:00:00 2024 GMT
*  expire date: Mar  3 23:59:59 2025 GMT
*  issuer: C=US; O=Let's Encrypt; CN=R10
* using HTTP/2
> GET / HTTP/2
> Host: archlinux.org
> User-Agent: curl/8.10.1
> Accept: */*
< HTTP/2 200
< server: nginx
< content-type: text/html; charset=utf-8
{ [3920 bytes data]
* Connection #0 to host archlinux.org left intact`}
      />
      <TerminalBlock
        command={`curl -X POST https://httpbin.org/post \\
    -H "Content-Type: application/json" \\
    -d '{"user":"jane","role":"admin"}'`}
        output={`{
  "args": {},
  "data": "{\\"user\\":\\"jane\\",\\"role\\":\\"admin\\"}",
  "files": {},
  "form": {},
  "headers": {
    "Accept": "*/*",
    "Content-Length": "30",
    "Content-Type": "application/json",
    "Host": "httpbin.org",
    "User-Agent": "curl/8.10.1"
  },
  "json": {
    "role": "admin",
    "user": "jane"
  },
  "url": "https://httpbin.org/post"
}`}
      />
      <TerminalBlock
        command="curl -O https://releases.ubuntu.com/24.04/ubuntu-24.04-desktop-amd64.iso"
        output={`  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  3 5870M    3  198M    0     0  21.4M      0  0:04:33  0:00:09  0:04:24 22.1M`}
      />

      <h2>8. wget</h2>
      <TerminalBlock
        command="wget https://archlinux.org/iso/latest/archlinux-x86_64.iso"
        output={`--2025-01-15 14:40:01--  https://archlinux.org/iso/latest/archlinux-x86_64.iso
Resolving archlinux.org (archlinux.org)... 95.217.163.246
Connecting to archlinux.org (archlinux.org)|95.217.163.246|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://geo.mirror.pkgbuild.com/iso/2025.01.01/archlinux-2025.01.01-x86_64.iso [following]
--2025-01-15 14:40:01--  https://geo.mirror.pkgbuild.com/iso/2025.01.01/archlinux-2025.01.01-x86_64.iso
Resolving geo.mirror.pkgbuild.com (geo.mirror.pkgbuild.com)... 88.198.227.1
HTTP request sent, awaiting response... 200 OK
Length: 1162870784 (1.1G) [application/octet-stream]
Saving to: 'archlinux-x86_64.iso'

archlinux-x86_64.is  12%[==>                ] 137.42M  21.4MB/s    eta 47s`}
      />

      <h2>9. nc (netcat) — testar portas e conectividade</h2>
      <TerminalBlock
        command="nc -zv archlinux.org 443"
        output={`Connection to archlinux.org (95.217.163.246) 443 port [tcp/https] {g}succeeded!{/}`}
      />
      <TerminalBlock
        command="nc -zv archlinux.org 23"
        output={`nc: connect to archlinux.org (95.217.163.246) port 23 (tcp) failed: {r}Connection refused{/}`}
        exitCode={1}
      />
      <TerminalBlock
        command="nc -zv -w 3 192.168.99.99 22"
        output={`nc: connect to 192.168.99.99 port 22 (tcp) failed: {r}Connection timed out{/}`}
        exitCode={1}
        comment="-w 3 = timeout 3s; timeout = host inexistente ou firewall"
      />

      <h2>10. tcpdump — ver os pacotes na rede</h2>
      <TerminalBlock
        command="sudo tcpdump -i enp3s0 -n -c 5 port 53"
        output={`tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on enp3s0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
14:42:11.001234 IP 192.168.1.100.45128 > 192.168.1.1.53: 41258+ A? archlinux.org. (31)
14:42:11.014880 IP 192.168.1.1.53 > 192.168.1.100.45128: 41258 1/0/1 A 95.217.163.246 (60)
14:42:11.124001 IP 192.168.1.100.45128 > 192.168.1.1.53: 8801+ AAAA? archlinux.org. (31)
14:42:11.139500 IP 192.168.1.1.53 > 192.168.1.100.45128: 8801 0/1/0 (96)
14:42:13.500120 IP 192.168.1.100.45129 > 192.168.1.1.53: 30021+ A? google.com. (28)
5 packets captured
5 packets received by filter
0 packets dropped by kernel`}
      />
      <p className="text-sm text-muted-foreground">
        <code>-i enp3s0</code> interface; <code>-n</code> não resolve nomes; <code>-c 5</code> para
        após 5 pacotes; <code>port 53</code> só DNS.
      </p>

      <h2>11. /etc/resolv.conf e /etc/hosts</h2>
      <TerminalBlock
        command="cat /etc/resolv.conf"
        output={`# This file is managed by man:systemd-resolved(8). Do not edit.
nameserver 127.0.0.53
options edns0 trust-ad
search .`}
      />
      <TerminalBlock
        command="cat /etc/hosts"
        output={`127.0.0.1       localhost
::1             localhost ip6-localhost ip6-loopback
127.0.1.1       archlinux.localdomain   archlinux

# entradas locais
192.168.1.10    nas.local       nas
192.168.1.20    pi-hole.local   pihole`}
      />
      <CodeBlock
        title="/etc/systemd/resolved.conf — DNS estático global"
        code={`[Resolve]
DNS=1.1.1.1 1.0.0.1 9.9.9.9
FallbackDNS=8.8.8.8
DNSOverTLS=yes
DNSSEC=allow-downgrade
Cache=yes`}
      />
      <TerminalBlock
        command="sudo systemctl restart systemd-resolved"
        output=""
      />

      <h2>12. Configuração estática persistente (resumo)</h2>
      <CodeBlock
        title="systemd-networkd — /etc/systemd/network/20-wired.network"
        code={`[Match]
Name=enp3s0

[Network]
Address=192.168.1.50/24
Gateway=192.168.1.1
DNS=1.1.1.1
DNS=1.0.0.1`}
      />
      <TerminalBlock
        command="sudo systemctl enable --now systemd-networkd systemd-resolved"
        output=""
      />

      <h2>13. Erros comuns — leitura de output</h2>

      <AlertBox type="danger" title="Erros que você vai ver">
        <ul>
          <li><code>{`Network is unreachable`}</code> — sem rota (sem default gateway)</li>
          <li><code>{`No route to host`}</code> — gateway não sabe como chegar lá</li>
          <li><code>{`Connection refused`}</code> — chegou no host, mas nada escuta na porta</li>
          <li><code>{`Connection timed out`}</code> — host não responde (firewall/desligado)</li>
          <li><code>{`Temporary failure in name resolution`}</code> — DNS não resolve</li>
        </ul>
      </AlertBox>

      <TerminalBlock
        command="ping 1.1.1.1"
        output={`{r}connect: Network is unreachable{/}`}
        exitCode={2}
        comment="solução: ip route show — falta default route"
      />
      <TerminalBlock
        command="curl https://archlinux.org"
        output={`curl: (6) Could not resolve host: archlinux.org`}
        exitCode={6}
        comment="DNS quebrado — checar /etc/resolv.conf e resolvectl status"
      />

      <h2>14. Referências</h2>
      <ul>
        <li><a href="https://wiki.archlinux.org/title/Network_configuration" target="_blank" rel="noopener noreferrer">ArchWiki — Network configuration</a></li>
        <li><a href="https://wiki.archlinux.org/title/Iwd" target="_blank" rel="noopener noreferrer">ArchWiki — iwd</a></li>
        <li><a href="https://wiki.archlinux.org/title/NetworkManager" target="_blank" rel="noopener noreferrer">ArchWiki — NetworkManager</a></li>
        <li><a href="https://wiki.archlinux.org/title/Systemd-networkd" target="_blank" rel="noopener noreferrer">ArchWiki — systemd-networkd</a></li>
        <li><code>man ip</code>, <code>man ss</code>, <code>man iwctl</code>, <code>man dig</code>, <code>man tcpdump</code></li>
      </ul>
    </PageContainer>
  );
}
