import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function WifiAvancado() {
  return (
    <PageContainer
      title="Wi-Fi Avançado"
      subtitle="iwd, wpa_supplicant, NetworkManager e diagnóstico de Wi-Fi no Arch Linux. Conecte a redes corporativas WPA2-Enterprise, crie hotspots e resolva problemas de conectividade."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <h2>Ferramentas de Wi-Fi no Arch</h2>
      <p>
        O Arch Linux oferece múltiplas opções para gerenciar Wi-Fi:
      </p>
      <ul>
        <li><strong>iwd</strong> — iNet wireless daemon. Moderno, eficiente, da Intel. Melhor para uso standalone.</li>
        <li><strong>wpa_supplicant</strong> — Clássico. Funciona como backend do NetworkManager.</li>
        <li><strong>NetworkManager</strong> — Gerenciador de rede completo (cabeado + WiFi + VPN). Mais comum em desktops.</li>
        <li><strong>connman</strong> — Alternativa leve ao NetworkManager.</li>
      </ul>

      <h2>iwd - Gerenciamento Moderno</h2>
      <CodeBlock
        title="Configurar e usar o iwd"
        code={`# Instalar iwd
sudo pacman -S iwd

# Habilitar e iniciar
sudo systemctl enable iwd
sudo systemctl start iwd

# Entrar no modo interativo
iwctl

# Comandos dentro do iwctl:

# Listar adaptadores Wi-Fi
device list
# wlan0    ...  connected    ...

# Escanear redes disponíveis
station wlan0 scan
station wlan0 get-networks

# Conectar a uma rede
station wlan0 connect "Nome da Rede"
# (Será solicitada a senha)

# Conectar com senha na linha de comando
iwctl --passphrase "senha123" station wlan0 connect "Nome da Rede"

# Ver status da conexão
station wlan0 show

# Desconectar
station wlan0 disconnect

# Listar redes salvas (conhecidas)
known-networks list

# Remover rede salva
known-networks "Nome da Rede" forget

# Sair
quit`}
      />

      <h2>iwd com Opções Avançadas</h2>
      <CodeBlock
        title="/etc/iwd/main.conf - Configuração do iwd"
        code={`[General]
# Habilitar interface de endereço MAC aleatório (privacidade)
AddressRandomization=network    # Novo endereço por rede
# AddressRandomization=once     # Novo endereço por sessão
# AddressRandomization=disabled # Desabilitar (usa endereço real)

[Network]
# Resolver DNS via systemd-resolved
NameResolvingService=systemd

[Scan]
# Intervalo de scan (segundos)
InitialPeriodicScanInterval=10
MaximumPeriodicScanInterval=300`}
      />

      <h2>NetworkManager - Uso Diário</h2>
      <CodeBlock
        title="Gerenciar Wi-Fi com nmcli"
        code={`# Listar interfaces
nmcli device

# Listar redes disponíveis
nmcli device wifi list

# Conectar a uma rede
nmcli device wifi connect "Nome da Rede" password "senha123"

# Listar conexões salvas
nmcli connection show

# Conectar a uma conexão salva
nmcli connection up "Nome da Rede"

# Desconectar
nmcli device disconnect wlan0

# Ligar/desligar Wi-Fi
nmcli radio wifi on
nmcli radio wifi off

# Ver status geral de conectividade
nmcli general status

# Editar conexão interativamente
nmcli connection edit "Nome da Rede"`}
      />

      <h2>Redes Corporativas (WPA2-Enterprise)</h2>
      <CodeBlock
        title="Conectar a redes WPA2-Enterprise (PEAP/MSCHAPv2)"
        code={`# Para redes de empresa/universidade com login/senha

# Via NetworkManager (arquivo de conexão)
# Criar arquivo: /etc/NetworkManager/system-connections/empresa.nmconnection
sudo nano /etc/NetworkManager/system-connections/empresa.nmconnection`}
      />
      <CodeBlock
        title="empresa.nmconnection - WPA2-Enterprise"
        code={`[connection]
id=RedeEmpresa
uuid=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
type=wifi
autoconnect=true

[wifi]
ssid=Nome-da-Rede-Empresa
mode=infrastructure

[wifi-security]
key-mgmt=wpa-eap

[802-1x]
eap=peap;
identity=usuario@empresa.com
password=suasenha
phase2-auth=mschapv2
# Se precisar de certificado:
# ca-cert=/path/to/ca.crt

[ipv4]
method=auto

[ipv6]
method=auto`}
      />
      <CodeBlock
        title="Ativar conexão WPA2-Enterprise"
        code={`# Aplicar permissões corretas (segurança!)
sudo chmod 600 /etc/NetworkManager/system-connections/empresa.nmconnection

# Recarregar configurações do NetworkManager
sudo nmcli connection reload

# Conectar
nmcli connection up RedeEmpresa

# Via iwd (também suporta WPA2-Enterprise)
# Arquivo: /var/lib/iwd/Nome-da-Rede.8021x
[Security]
EAP-Method=PEAP
EAP-Identity=usuario@empresa.com
EAP-PEAP-Phase2-Method=MSCHAPV2
EAP-Password=suasenha`}
      />

      <h2>Criar Hotspot (Access Point)</h2>
      <CodeBlock
        title="Compartilhar internet via Wi-Fi"
        code={`# Via NetworkManager (mais fácil)
nmcli device wifi hotspot ifname wlan0 ssid "MeuHotspot" password "senha123"

# Parar hotspot
nmcli device disconnect wlan0
nmcli connection delete Hotspot

# Modo mais permanente:
nmcli connection add type wifi ifname wlan0 con-name Hotspot \
    autoconnect yes ssid MeuHotspot mode ap ipv4.method shared \
    wifi-sec.key-mgmt wpa-psk wifi-sec.psk "senha123"

nmcli connection up Hotspot`}
      />

      <h2>Diagnóstico de Problemas Wi-Fi</h2>
      <CodeBlock
        title="Resolver problemas de Wi-Fi"
        code={`# Ver interfaces Wi-Fi
ip link | grep wlan
iw dev

# Ver status da interface
iw dev wlan0 info
iw dev wlan0 link

# Escanear redes manualmente
sudo iw dev wlan0 scan | grep -E "SSID|signal"

# Ver qualidade do sinal
watch -n 1 'iw dev wlan0 link | grep "signal"'

# Verificar driver em uso
lspci -k | grep -A 3 "Network"    # Adaptadores PCI
lsusb | grep -i wifi               # Adaptadores USB

# Ver firmware carregado
dmesg | grep -i "firmware\|wlan\|wifi" | tail -20

# Verificar se rfkill está bloqueando
rfkill list

# Resolver problema de conexão lenta: desabilitar power saving
sudo iw dev wlan0 set power_save off
# Permanente:
echo "options iwlwifi power_save=0" | sudo tee /etc/modprobe.d/iwlwifi.conf`}
      />

      <AlertBox type="info" title="Firmware Wi-Fi">
        Muitos adaptadores Wi-Fi precisam de firmware proprietário incluído no pacote
        <code>linux-firmware</code>. Se o Wi-Fi não funcionar, instale:
        <code>sudo pacman -S linux-firmware</code> e reinicie.
        Para chips Broadcom: <code>yay -S broadcom-wl-dkms</code>.
      </AlertBox>
    </PageContainer>
  );
}
