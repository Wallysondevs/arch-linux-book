import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Vpn() {
  return (
    <PageContainer
      title="VPN no Arch Linux"
      subtitle="WireGuard, OpenVPN e VPNs comerciais. Configure sua própria VPN segura ou conecte a provedores comerciais para proteger sua privacidade e acessar redes remotas."
      difficulty="avancado"
      timeToRead="18 min"
    >
      <h2>WireGuard - VPN Moderna e Rápida</h2>
      <p>
        O WireGuard é um protocolo VPN moderno integrado ao kernel Linux (desde 5.6).
        É muito mais simples de configurar que o OpenVPN, mais rápido e com criptografia moderna.
      </p>
      <CodeBlock
        title="Instalar e configurar WireGuard"
        code={`# WireGuard está integrado ao kernel linux no Arch
# Instalar ferramentas de espaço de usuário
sudo pacman -S wireguard-tools

# Gerar par de chaves (no servidor e no cliente)
wg genkey | tee privatekey | wg pubkey > publickey
cat privatekey   # Chave privada (NUNCA compartilhe!)
cat publickey    # Chave pública (pode compartilhar)

# Criar interface WireGuard
ip link add wg0 type wireguard

# Ou usar wg-quick (mais fácil)`}
      />

      <h2>WireGuard com wg-quick</h2>
      <h3>Configuração do Servidor</h3>
      <CodeBlock
        title="/etc/wireguard/wg0.conf - Servidor"
        code={`[Interface]
# Endereço IP do servidor na VPN
Address = 10.0.0.1/24
# Porta de escuta
ListenPort = 51820
# Chave privada do servidor
PrivateKey = CHAVE_PRIVADA_DO_SERVIDOR

# Habilitar NAT (para clientes acessarem internet via VPN)
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Peer: Cliente 1
[Peer]
PublicKey = CHAVE_PUBLICA_DO_CLIENTE_1
# IPs que este peer pode usar
AllowedIPs = 10.0.0.2/32

# Peer: Cliente 2
[Peer]
PublicKey = CHAVE_PUBLICA_DO_CLIENTE_2
AllowedIPs = 10.0.0.3/32`}
      />
      <CodeBlock
        title="Ativar servidor WireGuard"
        code={`# Habilitar IP forwarding no servidor
echo "net.ipv4.ip_forward=1" | sudo tee /etc/sysctl.d/99-forwarding.conf
sudo sysctl -p /etc/sysctl.d/99-forwarding.conf

# Iniciar WireGuard
sudo wg-quick up wg0

# Habilitar na inicialização
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0

# Ver status
sudo wg show`}
      />

      <h3>Configuração do Cliente</h3>
      <CodeBlock
        title="/etc/wireguard/wg0.conf - Cliente"
        code={`[Interface]
# Endereço do cliente na VPN
Address = 10.0.0.2/24
# Chave privada do cliente
PrivateKey = CHAVE_PRIVADA_DO_CLIENTE
# DNS via VPN (opcional)
DNS = 1.1.1.1

[Peer]
# Chave pública do servidor
PublicKey = CHAVE_PUBLICA_DO_SERVIDOR
# IP e porta do servidor
Endpoint = IP_PUBLICO_DO_SERVIDOR:51820
# Rotas pelo túnel:
# 0.0.0.0/0 = TODO o tráfego pela VPN (full tunnel)
# 10.0.0.0/24 = Apenas a rede VPN (split tunnel)
AllowedIPs = 0.0.0.0/0, ::/0
# Manter conexão ativa (para NAT traversal)
PersistentKeepalive = 25`}
      />
      <CodeBlock
        title="Conectar ao servidor WireGuard"
        code={`# Conectar
sudo wg-quick up wg0

# Desconectar
sudo wg-quick down wg0

# Ver status da conexão
sudo wg show

# Verificar se está roteando pelo VPN
curl ifconfig.me    # Deve mostrar IP do servidor VPN

# Conectar automaticamente no boot
sudo systemctl enable wg-quick@wg0`}
      />

      <h2>OpenVPN</h2>
      <CodeBlock
        title="Instalar e usar OpenVPN"
        code={`# Instalar OpenVPN
sudo pacman -S openvpn

# Conectar com arquivo .ovpn
sudo openvpn --config arquivo.ovpn

# Conectar em background
sudo openvpn --config arquivo.ovpn --daemon

# Com autenticação por arquivo
sudo openvpn --config arquivo.ovpn --auth-user-pass credenciais.txt

# Habilitar como serviço systemd
sudo cp arquivo.ovpn /etc/openvpn/client/minha-vpn.conf
sudo systemctl enable openvpn-client@minha-vpn
sudo systemctl start openvpn-client@minha-vpn

# NetworkManager com OpenVPN (GUI)
sudo pacman -S networkmanager-openvpn
# Importar .ovpn via: nm-connection-editor ou interface do NM`}
      />

      <h2>VPNs Comerciais</h2>
      <CodeBlock
        title="Provedores VPN populares no Arch"
        code={`# Mullvad VPN (foco em privacidade, usa WireGuard)
# Baixar app: https://mullvad.net
yay -S mullvad-vpn

# ProtonVPN (suporte bom para Linux)
yay -S protonvpn-gui
# ou CLI:
yay -S protonvpn-cli

# NordVPN
yay -S nordvpn-bin
sudo systemctl enable nordvpnd
nordvpn login
nordvpn connect Brazil

# ExpressVPN
yay -S expressvpn

# Verificar vazamento de DNS após conectar
curl https://dnsleaktest.com/api/v1/leak-test | jq
# ou usar site: browserleaks.com`}
      />

      <h2>NetworkManager e VPN</h2>
      <CodeBlock
        title="Gerenciar VPNs via NetworkManager"
        code={`# Instalar plugins VPN para NM
sudo pacman -S networkmanager-openvpn    # OpenVPN
sudo pacman -S networkmanager-vpnc      # Cisco VPN
sudo pacman -S networkmanager-pptp      # PPTP
sudo pacman -S networkmanager-l2tp      # L2TP/IPSec

# Para WireGuard via NM
sudo pacman -S networkmanager-wireguard

# Importar config VPN
nmcli connection import type openvpn file /path/to/config.ovpn
nmcli connection import type wireguard file /etc/wireguard/wg0.conf

# Listar conexões VPN
nmcli connection show | grep vpn

# Ativar/desativar VPN
nmcli connection up minha-vpn
nmcli connection down minha-vpn

# GUI com nm-applet (para ambientes de desktop)
# Clique no ícone de rede → VPN → Conectar`}
      />

      <AlertBox type="info" title="Kill Switch">
        Para máxima privacidade, configure um "kill switch" que bloqueia todo tráfego de
        internet se a VPN cair. Com o WireGuard, use a opção <code>AllowedIPs = 0.0.0.0/0</code>
        combinada com regras de firewall que bloqueiam tráfego fora do túnel WireGuard.
      </AlertBox>
    </PageContainer>
  );
}
