import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function VPN() {
  return (
    <PageContainer
      title="VPN — WireGuard, OpenVPN e NetworkManager"
      subtitle="Túneis cifrados no Arch: instale, configure e diagnostique WireGuard e OpenVPN, com saída real de wg-quick, wg show, openvpn e nmcli."
      difficulty="intermediario"
      timeToRead="40 min"
      category="Redes"
    >
      <p>
        Uma VPN cria um túnel cifrado entre dois pontos. No Arch você tem dois protocolos
        principais: <strong>WireGuard</strong> (kernel-side, ~4 mil linhas de código,
        ChaCha20+Curve25519) e <strong>OpenVPN</strong> (userspace, TLS, mais flexível e antigo).
        Para integração com o ambiente gráfico, ambos plugam no <code>NetworkManager</code>.
      </p>

      <AlertBox type="info" title="Qual escolher?">
        <strong>WireGuard</strong> para tudo novo: simples, rápido e nativo no kernel desde 5.6.
        <strong> OpenVPN</strong> quando o serviço corporativo só fornece <code>.ovpn</code>, ou
        quando precisa autenticação por certificado/LDAP.
      </AlertBox>

      <h2>1. WireGuard</h2>

      <h3>Instalação</h3>

      <TerminalBlock
        command="sudo pacman -S wireguard-tools"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (1)  wireguard-tools-1.0.20210914-3

Total Installed Size:  0.40 MiB

:: Proceed with installation? [Y/n] y
(1/1) installing wireguard-tools                   [######################] 100%`}
      />

      <p>
        O módulo <code>wireguard.ko</code> já vem no kernel padrão do Arch. Verifique:
      </p>

      <TerminalBlock
        command="modinfo wireguard | head -3"
        output={`filename:       /lib/modules/6.12.1-arch1-1/kernel/drivers/net/wireguard/wireguard.ko.zst
intree:         Y
version:        1.0.0`}
      />

      <h3>Gerando chaves</h3>

      <TerminalBlock
        command="umask 077 && wg genkey | tee server-priv.key | wg pubkey > server-pub.key"
        output=""
      />

      <TerminalBlock
        command="wg genkey | tee client-priv.key | wg pubkey > client-pub.key && ls -l *.key"
        output={`-rw------- 1 user user 45 Mar 26 14:50 client-priv.key
-rw-r--r-- 1 user user 45 Mar 26 14:50 client-pub.key
-rw------- 1 user user 45 Mar 26 14:50 server-priv.key
-rw-r--r-- 1 user user 45 Mar 26 14:50 server-pub.key`}
      />

      <TerminalBlock
        command="cat server-pub.key"
        output={`xT5Jb4sYr7nP9kQwL2vH8mR3cN4tD6sV1zA5fG0iE9w=`}
      />

      <h3>Servidor WireGuard</h3>

      <CodeBlock
        title="/etc/wireguard/wg0.conf (servidor, 10.66.66.1/24)"
        language="ini"
        code={`[Interface]
Address    = 10.66.66.1/24
ListenPort = 51820
PrivateKey = SUA_CHAVE_PRIVADA_DO_SERVIDOR

# NAT para clientes saírem pela WAN (enp3s0)
PostUp   = iptables -A FORWARD -i %i -j ACCEPT; iptables -t nat -A POSTROUTING -o enp3s0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -t nat -D POSTROUTING -o enp3s0 -j MASQUERADE

# Cliente 1
[Peer]
PublicKey  = CHAVE_PUBLICA_DO_CLIENTE
AllowedIPs = 10.66.66.2/32`}
      />

      <TerminalBlock
        command="sudo install -m 600 -o root -g root /dev/stdin /etc/wireguard/wg0.conf < wg0.conf"
        output=""
      />

      <TerminalBlock
        comment="habilita IP forwarding (persistente)"
        command={`echo 'net.ipv4.ip_forward = 1' | sudo tee /etc/sysctl.d/30-wg.conf && sudo sysctl --system | tail -3`}
        output={`* Applying /etc/sysctl.d/30-wg.conf ...
net.ipv4.ip_forward = 1
* Applying /etc/sysctl.d/99-sysctl.conf ...`}
      />

      <TerminalBlock
        command="sudo systemctl enable --now wg-quick@wg0"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/wg-quick@wg0.service → /usr/lib/systemd/system/wg-quick@.service.`}
      />

      <TerminalBlock
        command="sudo wg show"
        output={`interface: wg0
  public key: xT5Jb4sYr7nP9kQwL2vH8mR3cN4tD6sV1zA5fG0iE9w=
  private key: (hidden)
  listening port: 51820

peer: pK9rT4nL6vX2hM8wD0yQ5fI7sA3bN1cE6jR9uG4pZxc=
  allowed ips: 10.66.66.2/32
  latest handshake: 1 minute, 18 seconds ago
  transfer: 184.2 KiB received, 1.42 MiB sent`}
      />

      <OutputBlock
        title="Lendo wg show"
        output={`interface: wg0
  public key: xT5Jb4sYr7nP9kQwL2vH8mR3cN4tD6sV1zA5fG0iE9w=
  listening port: 51820

peer: pK9rT4nL6vX2hM8wD0yQ5fI7sA3bN1cE6jR9uG4pZxc=
  allowed ips: 10.66.66.2/32
  latest handshake: 1 minute, 18 seconds ago
  transfer: 184.2 KiB received, 1.42 MiB sent`}
        annotations={[
          { line: 1, note: "chave pública do servidor — clientes precisam dela" },
          { line: 2, note: "porta UDP que precisa estar aberta no firewall/router" },
          { line: 4, note: "1 peer = 1 cliente; rotas internas para esse peer" },
          { line: 6, note: "se 'never' = peer nunca conectou; se >2min, está offline" },
          { line: 7, note: "contadores de bytes (RX = entrou, TX = saiu)" },
        ]}
      />

      <h3>Cliente WireGuard</h3>

      <CodeBlock
        title="/etc/wireguard/wg0.conf (cliente)"
        language="ini"
        code={`[Interface]
Address    = 10.66.66.2/32
PrivateKey = CHAVE_PRIVADA_DO_CLIENTE
DNS        = 1.1.1.1, 9.9.9.9

[Peer]
PublicKey           = CHAVE_PUBLICA_DO_SERVIDOR
Endpoint            = vpn.exemplo.com:51820
AllowedIPs          = 0.0.0.0/0, ::/0
PersistentKeepalive = 25`}
      />

      <TerminalBlock
        command="sudo wg-quick up wg0"
        output={`[#] ip link add wg0 type wireguard
[#] wg setconf wg0 /dev/fd/63
[#] ip -4 address add 10.66.66.2/32 dev wg0
[#] ip link set mtu 1420 up dev wg0
[#] resolvconf -a wg0 -m 0 -x
[#] wg set wg0 fwmark 51820
[#] ip -4 route add 0.0.0.0/0 dev wg0 table 51820
[#] ip -4 rule add not fwmark 51820 table 51820
[#] ip -4 rule add table main suppress_prefixlength 0`}
      />

      <TerminalBlock
        command="ip -br addr show wg0"
        output={`wg0              UNKNOWN        10.66.66.2/32`}
      />

      <TerminalBlock
        command="curl -s ifconfig.me && echo"
        output={`203.0.113.42`}
        comment="IP visto pela internet agora é o do servidor VPN"
      />

      <TerminalBlock
        command="sudo wg-quick down wg0"
        output={`[#] ip -4 rule delete table 51820
[#] ip -4 rule delete table main suppress_prefixlength 0
[#] ip link delete dev wg0
[#] resolvconf -d wg0 -f`}
      />

      <h3>WireGuard via NetworkManager (GUI)</h3>

      <TerminalBlock
        command="sudo nmcli connection import type wireguard file /etc/wireguard/wg0.conf"
        output={`Connection 'wg0' (a3f1c0b2-1d4f-4d2a-9c11-7e9a4d2e1f00) successfully added.`}
      />

      <TerminalBlock
        command="nmcli connection up wg0"
        output={`Connection successfully activated (D-Bus active path: /org/freedesktop/NetworkManager/ActiveConnection/4)`}
      />

      <h2>2. OpenVPN</h2>

      <TerminalBlock
        command="sudo pacman -S openvpn"
        output={`Packages (1)  openvpn-2.6.10-1
Total Installed Size:  3.42 MiB`}
      />

      <h3>Cliente .ovpn (caso típico de VPN corporativa)</h3>

      <p>
        Para um único arquivo <code>.ovpn</code> com tudo embutido (CA, cert, key, ta), basta:
      </p>

      <TerminalBlock
        command="sudo openvpn --config /etc/openvpn/client/empresa.ovpn"
        output={`2026-03-26 15:02:11 OpenVPN 2.6.10 [git:makepkg/...] x86_64-pc-linux-gnu [SSL (OpenSSL)] [LZO]
2026-03-26 15:02:11 library versions: OpenSSL 3.4.0 9 Sep 2024, LZO 2.10
2026-03-26 15:02:11 TCP/UDP: Preserving recently used remote address: [AF_INET]198.51.100.42:1194
2026-03-26 15:02:11 UDP link local: (not bound)
2026-03-26 15:02:11 UDP link remote: [AF_INET]198.51.100.42:1194
2026-03-26 15:02:12 [vpn-srv] Peer Connection Initiated with [AF_INET]198.51.100.42:1194
2026-03-26 15:02:13 TUN/TAP device tun0 opened
2026-03-26 15:02:13 /usr/bin/ip link set dev tun0 up mtu 1500
2026-03-26 15:02:13 /usr/bin/ip addr add dev tun0 10.8.0.6/24
2026-03-26 15:02:13 {g}Initialization Sequence Completed{/}`}
      />

      <h3>Como systemd unit</h3>

      <p>
        Coloque o arquivo em <code>/etc/openvpn/client/empresa.conf</code> (renomeie de{" "}
        <code>.ovpn</code> para <code>.conf</code>) e use o template:
      </p>

      <TerminalBlock
        command="sudo systemctl enable --now openvpn-client@empresa.service"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/openvpn-client@empresa.service → /usr/lib/systemd/system/openvpn-client@.service.`}
      />

      <TerminalBlock
        command="systemctl status openvpn-client@empresa"
        output={`{g}● openvpn-client@empresa.service{/} - OpenVPN tunnel for empresa
     Loaded: loaded (/usr/lib/systemd/system/openvpn-client@.service; enabled; preset: disabled)
     Active: {g}active (running){/} since Wed 2026-03-26 15:02:11 -03; 4min ago
   Main PID: 4218 (openvpn)
     Status: "Initialization Sequence Completed"
      Tasks: 1 (limit: 38389)
     Memory: 5.4M
        CPU: 92ms
     CGroup: /system.slice/system-openvpn\\x2dclient.slice/openvpn-client@empresa.service
             └─4218 /usr/bin/openvpn --suppress-timestamps --nobind --config empresa.conf`}
      />

      <TerminalBlock
        command="ip -br addr show tun0"
        output={`tun0             UNKNOWN        10.8.0.6/24`}
      />

      <h3>Plugins do NetworkManager</h3>

      <TerminalBlock
        comment="adiciona suporte gráfico/CLI a OpenVPN no NM"
        command="sudo pacman -S networkmanager-openvpn networkmanager-openconnect"
      />

      <TerminalBlock
        command="nmcli connection import type openvpn file empresa.ovpn"
        output={`Connection 'empresa' (b5c9d801-8e22-4e89-9d4f-77c1de00aa11) successfully added.`}
      />

      <TerminalBlock
        command="nmcli connection up empresa --ask"
        output={`Password (vpn.secrets.password): ********
Connection successfully activated (D-Bus active path: /org/freedesktop/NetworkManager/ActiveConnection/5)`}
      />

      <h2>3. Servidor WireGuard — guia completo</h2>

      <CommandFlagList
        command="wg-quick"
        items={[
          { flag: "up IFACE", description: "Sobe a interface a partir de /etc/wireguard/IFACE.conf, configurando rotas e DNS." },
          { flag: "down IFACE", description: "Derruba a interface, removendo rotas e regras criadas pelo PostUp." },
          { flag: "save IFACE", description: "Persiste mudanças em runtime (wg set) de volta no .conf." },
          { flag: "strip IFACE", description: "Imprime a config sem as diretivas extras (Address, DNS, PostUp)." },
        ]}
      />

      <CommandFlagList
        command="wg"
        items={[
          { flag: "show", description: "Mostra todas interfaces WireGuard e seus peers.", example: "sudo wg show" },
          { flag: "show IFACE", description: "Detalhes de uma interface específica." },
          { flag: "show all dump", description: "Saída tabular sem cores — fácil de parsear." },
          { flag: "set IFACE peer KEY ...", description: "Adiciona/atualiza peer em runtime (sem reiniciar)." },
          { flag: "genkey | pubkey | genpsk", description: "Geração de chave privada / derivação de pública / pre-shared key." },
        ]}
      />

      <TerminalBlock
        command="sudo wg show all dump"
        output={`wg0     SERVER_PRIV_HIDDEN      xT5Jb4sYr7nP9kQwL2vH8mR3cN4tD6sV1zA5fG0iE9w=    51820   off
wg0     pK9rT4nL6vX2hM8wD0yQ5fI7sA3bN1cE6jR9uG4pZxc=    (none)  198.51.100.10:54192     10.66.66.2/32   1711465932      188512  1490642 25`}
      />

      <h3>Adicionar peer ao quente, sem restart</h3>

      <TerminalBlock
        command={`sudo wg set wg0 peer NOVA_CHAVE_PUBLICA allowed-ips 10.66.66.3/32`}
        output=""
      />

      <TerminalBlock
        comment="grava no .conf"
        command="sudo wg-quick save wg0"
        output=""
      />

      <h2>4. Firewall</h2>

      <p>
        WireGuard escuta em <strong>UDP/51820</strong> (configurável). Libere no firewall (aqui
        com <code>nftables</code>, padrão do Arch):
      </p>

      <CodeBlock
        title="/etc/nftables.conf (trecho relevante)"
        code={`table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;
        ct state established,related accept
        iif lo accept
        udp dport 51820 accept comment "wireguard"
        tcp dport 22 accept comment "ssh"
    }
}`}
      />

      <TerminalBlock
        command="sudo nft -f /etc/nftables.conf && sudo nft list chain inet filter input"
        output={`table inet filter {
        chain input {
                type filter hook input priority filter; policy drop;
                ct state established,related accept
                iif "lo" accept
                udp dport 51820 accept comment "wireguard"
                tcp dport 22 accept comment "ssh"
        }
}`}
      />

      <p>OpenVPN tradicionalmente usa <strong>UDP/1194</strong> (TCP/443 para "modo stealth").</p>

      <h2>5. Kill switch (impede vazamento se a VPN cair)</h2>

      <CodeBlock
        title="WireGuard com kill switch — adicione ao [Interface]"
        language="ini"
        code={`[Interface]
Address = 10.66.66.2/32
PrivateKey = ...
DNS = 1.1.1.1

# bloqueia tráfego que não passe pela wg0 enquanto ela existir
PostUp   = iptables -I OUTPUT ! -o %i -m mark ! --mark $(wg show %i fwmark) -m addrtype ! --dst-type LOCAL -j REJECT
PostDown = iptables -D OUTPUT ! -o %i -m mark ! --mark $(wg show %i fwmark) -m addrtype ! --dst-type LOCAL -j REJECT`}
      />

      <h2>6. VPNs comerciais (Mullvad, ProtonVPN, IVPN…)</h2>

      <p>
        A maioria oferece configs WireGuard prontas. Exemplo Mullvad:
      </p>

      <TerminalBlock
        command="yay -S mullvad-vpn-bin"
        output={`(via AUR)
Resolving dependencies...
==> Downloading mullvad-vpn-bin-2025.4-1-x86_64.pkg.tar.zst...`}
      />

      <TerminalBlock
        command="mullvad account login MULLVAD_ACCOUNT_NUMBER"
        output={`Mullvad account "abcd1234..." set
Logging in to Mullvad account "abcd1234..."
Login successful`}
      />

      <TerminalBlock
        command="mullvad relay set location br sao"
        output={`Updated constraints, will see effect on next connection`}
      />

      <TerminalBlock
        command="mullvad connect && mullvad status"
        output={`Connecting...
Connected to br-sao-wg-001 in São Paulo, Brazil
  Visible IP: 169.150.227.42`}
      />

      <p>
        Sem o cliente proprietário você pode baixar configs <code>.conf</code> WireGuard direto do
        portal e usar com <code>wg-quick</code>.
      </p>

      <h2>7. Troubleshooting</h2>

      <TerminalBlock
        comment="túnel sobe mas internet não funciona — IP forwarding?"
        command="sysctl net.ipv4.ip_forward"
        output={`net.ipv4.ip_forward = 0`}
      />

      <TerminalBlock
        command={`echo 'net.ipv4.ip_forward = 1' | sudo tee /etc/sysctl.d/30-wg.conf && sudo sysctl -p /etc/sysctl.d/30-wg.conf`}
        output={`net.ipv4.ip_forward = 1`}
      />

      <TerminalBlock
        comment="latest handshake = nunca → pacotes UDP/51820 não chegam ao servidor"
        command="sudo wg show wg0 latest-handshakes"
        output={`pK9rT4nL6vX2hM8wD0yQ5fI7sA3bN1cE6jR9uG4pZxc=    0`}
      />

      <TerminalBlock
        comment="testa do cliente: a porta abre?"
        command="nc -uvz vpn.exemplo.com 51820"
        output={`Connection to vpn.exemplo.com (198.51.100.42) 51820 port [udp/*] succeeded!`}
      />

      <TerminalBlock
        comment="DNS leak: IP da VPN ok, mas DNS vai pelo provedor?"
        command="resolvectl status | grep 'Current DNS'"
        output={`Current DNS Server: 192.168.1.1`}
      />

      <p>
        Solução: adicione <code>DNS = 1.1.1.1</code> no <code>[Interface]</code> do WG (precisa do
        pacote <code>openresolv</code> ou <code>systemd-resolved</code> ativo).
      </p>

      <TerminalBlock
        comment="rotas inseridas pela VPN"
        command="ip route show table 51820"
        output={`default dev wg0 scope link`}
      />

      <AlertBox type="danger" title="MTU pode estragar tudo">
        Se TCP funciona (curl <code>example.com</code>) mas grandes downloads travam, o MTU está
        errado. WireGuard padrão = 1420; tente <code>MTU = 1380</code> ou
        <code> 1280</code> no <code>[Interface]</code>.
      </AlertBox>

      <h2>8. Resumo</h2>

      <OutputBlock
        title="Cola de bolso"
        output={`# WireGuard
sudo pacman -S wireguard-tools
wg genkey | tee priv | wg pubkey > pub      # gera par
sudo install -m600 wg0.conf /etc/wireguard/
sudo systemctl enable --now wg-quick@wg0
sudo wg show                                 # status
sudo wg-quick up   wg0
sudo wg-quick down wg0

# OpenVPN
sudo pacman -S openvpn networkmanager-openvpn
sudo systemctl enable --now openvpn-client@perfil

# NetworkManager
nmcli connection import type wireguard file wg0.conf
nmcli connection up wg0
nmcli connection down wg0`}
      />
    </PageContainer>
  );
}
