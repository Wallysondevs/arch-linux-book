import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Bluetooth() {
  return (
    <PageContainer
      title="Bluetooth no Arch Linux"
      subtitle="Configure e gerencie dispositivos Bluetooth no Arch Linux com bluetoothctl, BlueZ e interfaces gráficas. Fones, teclados, mice e muito mais."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <h2>BlueZ - Stack Bluetooth do Linux</h2>
      <p>
        O BlueZ é a implementação oficial do protocolo Bluetooth para Linux. Fornece a camada
        de sistema e a ferramenta <code>bluetoothctl</code> para gerenciamento.
      </p>
      <CodeBlock
        title="Instalar e ativar Bluetooth"
        code={`# Instalar BlueZ
sudo pacman -S bluez bluez-utils

# Habilitar e iniciar o serviço
sudo systemctl enable bluetooth
sudo systemctl start bluetooth

# Verificar status
sudo systemctl status bluetooth

# Ver adaptadores Bluetooth presentes
hciconfig
# hci0: Type: Primary  Bus: USB
#       BD Address: AA:BB:CC:DD:EE:FF
#       ...

# Ativar adaptador manualmente (se desligado)
sudo hciconfig hci0 up`}
      />

      <h2>bluetoothctl - Interface de Linha de Comando</h2>
      <CodeBlock
        title="Gerenciar Bluetooth via bluetoothctl"
        code={`# Entrar no modo interativo
bluetoothctl

# Comandos dentro do bluetoothctl:

# Ver status geral
show

# Ligar/desligar
power on
power off

# Listar dispositivos conhecidos
devices

# Escanear por dispositivos próximos
scan on
# Aguarde aparecer seu dispositivo, depois:
scan off

# Parear com um dispositivo
pair AA:BB:CC:DD:EE:FF

# Conectar
connect AA:BB:CC:DD:EE:FF

# Conectar automaticamente (trust)
trust AA:BB:CC:DD:EE:FF

# Desconectar
disconnect AA:BB:CC:DD:EE:FF

# Remover dispositivo
remove AA:BB:CC:DD:EE:FF

# Ver informações de um dispositivo
info AA:BB:CC:DD:EE:FF

# Sair
exit`}
      />

      <h2>Fluxo Completo: Conectar Fone Bluetooth</h2>
      <CodeBlock
        title="Passo a passo para conectar fone"
        code={`# 1. Abrir bluetoothctl
bluetoothctl

# 2. Ligar adaptador
power on

# 3. Ativar agente (para autenticação automática)
agent on
default-agent

# 4. Colocar fone no modo de pareamento
# (normalmente segurar botão por 3-5 segundos até LED piscar)

# 5. Escanear
scan on

# 6. Aguardar aparecer (ex: [NEW] Device 00:1B:66:xx:xx:xx JBL Flip 5)
# Quando aparecer:
scan off

# 7. Parear
pair 00:1B:66:xx:xx:xx

# 8. Confiar para conexão automática futura
trust 00:1B:66:xx:xx:xx

# 9. Conectar
connect 00:1B:66:xx:xx:xx

# 10. Verificar
info 00:1B:66:xx:xx:xx

exit`}
      />

      <h2>Bluetooth e PipeWire/PulseAudio</h2>
      <CodeBlock
        title="Configurar áudio Bluetooth"
        code={`# Para áudio Bluetooth funcionar com PipeWire
sudo pacman -S pipewire-pulse bluez-plugins

# Verificar se o módulo Bluetooth está carregado
pactl list cards | grep -A 20 "bluetooth"

# Ver perfis disponíveis do dispositivo Bluetooth
pactl list cards | grep -i "profile"
# Exemplo: a2dp_sink (alta qualidade), headset_head_unit (fone+mic)

# Trocar perfil (Alta Qualidade vs Headset com Microfone)
pactl set-card-profile bluez_card.XX_XX_XX_XX_XX_XX a2dp_sink
pactl set-card-profile bluez_card.XX_XX_XX_XX_XX_XX headset_head_unit

# Com PipeWire via wpctl:
wpctl status | grep -i bluetooth
wpctl set-default SINK_ID    # Definir como padrão`}
      />

      <h2>Interfaces Gráficas</h2>
      <CodeBlock
        title="Instalar GUIs para Bluetooth"
        code={`# blueman - Interface completa e popular
sudo pacman -S blueman

# Iniciar applet na bandeja do sistema
blueman-applet &

# Ou abrir o gerenciador completo
blueman-manager

# Para GNOME (incluído no GNOME)
# Configurações → Bluetooth

# Para KDE (incluído no KDE)
# Configurações do Sistema → Bluetooth

# bluedevil (KDE)
sudo pacman -S bluedevil`}
      />

      <h2>Solução de Problemas</h2>
      <CodeBlock
        title="Resolver problemas comuns de Bluetooth"
        code={`# Problema: Bluetooth não aparece (rfkill)
# Ver se está bloqueado por rfkill
rfkill list
# 0: hci0: Bluetooth
#         Soft blocked: yes   ← Problema!
#         Hard blocked: no

# Desbloquear
rfkill unblock bluetooth
rfkill unblock all

# Problema: Adaptador não encontrado
# Verificar se módulo está carregado
lsmod | grep bluetooth
dmesg | grep -i "bluetooth\|btusb"

# Carregar módulos necessários
sudo modprobe bluetooth
sudo modprobe btusb

# Problema: Pareamento falha (PIN incorreto)
# Alguns dispositivos usam PIN "0000" ou "1234"
# Outros geram um código para confirmar nos dois dispositivos

# Problema: Fone conecta mas sem áudio
# Verificar serviços de áudio
systemctl --user status pipewire pipewire-pulse wireplumber

# Reiniciar PipeWire
systemctl --user restart pipewire pipewire-pulse wireplumber

# Verificar logs
journalctl --user -u pipewire -n 50
journalctl -u bluetooth -n 50`}
      />

      <AlertBox type="info" title="Auto-conexão no boot">
        Após usar <code>trust</code>, o dispositivo deve conectar automaticamente sempre que
        estiver ao alcance e o Bluetooth estiver ligado. Se não conectar, verifique se o
        serviço bluetooth está habilitado com <code>systemctl enable bluetooth</code>.
      </AlertBox>
    </PageContainer>
  );
}
