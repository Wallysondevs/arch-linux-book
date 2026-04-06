import{j as e}from"./ui-K-J8Jkwj.js";import{P as o}from"./PageContainer-tnnsMrcC.js";import{C as a}from"./CodeBlock-DEDRw1y6.js";import{A as s}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function m(){return e.jsxs(o,{title:"Gerenciamento de Energia",subtitle:"Otimize a bateria do notebook com TLP, powertop, auto-cpufreq, hibernação e configurações de energia no Arch Linux.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"Por que gerenciar energia?"}),e.jsx("p",{children:"O Arch Linux não vem com otimizações de bateria por padrão. Em notebooks, sem configuração adequada, a bateria pode durar significativamente menos que em outras distribuições. Felizmente, existem ferramentas poderosas para resolver isso."}),e.jsx("h2",{children:"TLP — O Otimizador de Bateria"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"TLP"})," é a ferramenta mais popular para otimização de energia em notebooks Linux. Ele aplica automaticamente as melhores configurações quando na bateria ou na tomada."]}),e.jsx(a,{title:"Instalar e configurar TLP",code:`# Instalar
sudo pacman -S tlp tlp-rdw

# Habilitar e iniciar
sudo systemctl enable --now tlp.service

# Se estiver usando NetworkManager:
sudo systemctl enable --now NetworkManager-dispatcher.service

# Desabilitar serviços conflitantes
sudo systemctl mask systemd-rfkill.service
sudo systemctl mask systemd-rfkill.socket

# Verificar status
sudo tlp-stat -s

# Ver configuração completa
sudo tlp-stat

# Ver estatísticas de bateria
sudo tlp-stat -b`}),e.jsx(a,{title:"Configurações do TLP",code:`# Editar /etc/tlp.conf (principais opções)
sudo vim /etc/tlp.conf

# CPU — governador e frequência
CPU_SCALING_GOVERNOR_ON_AC=performance
CPU_SCALING_GOVERNOR_ON_BAT=powersave

# Turbo boost
CPU_BOOST_ON_AC=1
CPU_BOOST_ON_BAT=0

# Disco
DISK_DEVICES="sda nvme0n1"
DISK_APM_LEVEL_ON_AC="254 254"
DISK_APM_LEVEL_ON_BAT="128 128"

# Wi-Fi
WIFI_PWR_ON_AC=off
WIFI_PWR_ON_BAT=on

# USB autosuspend
USB_AUTOSUSPEND=1

# Bateria — limiares de carga (ThinkPad)
START_CHARGE_THRESH_BAT0=75
STOP_CHARGE_THRESH_BAT0=80

# Aplicar mudanças
sudo tlp start`}),e.jsxs(s,{type:"info",title:"Limiares de bateria",children:["Em ThinkPads, você pode configurar limiares de carga para preservar a vida útil da bateria.",e.jsx("code",{children:"STOP_CHARGE_THRESH_BAT0=80"})," para de carregar em 80%, prolongando a saúde da bateria. Outras marcas podem precisar de drivers específicos (como ",e.jsx("code",{children:"asus-nb-ctrl"}),")."]}),e.jsx("h2",{children:"powertop — Análise de Consumo"}),e.jsx(a,{title:"Usar powertop para analisar consumo",code:`# Instalar
sudo pacman -S powertop

# Rodar powertop (interface interativa)
sudo powertop

# Abas disponíveis:
# Overview — consumo geral
# Idle stats — estados de idle do CPU
# Frequency stats — frequências do CPU
# Device stats — consumo por dispositivo
# Tunables — otimizações sugeridas

# Calibrar (rodar em bateria, leva ~20 min)
sudo powertop --calibrate

# Aplicar todas as otimizações recomendadas automaticamente
sudo powertop --auto-tune

# Gerar relatório HTML
sudo powertop --html=powertop-report.html`}),e.jsx(a,{title:"Tornar otimizações do powertop permanentes",code:`# Criar serviço systemd para powertop --auto-tune
sudo tee /etc/systemd/system/powertop.service << 'EOF'
[Unit]
Description=PowerTOP auto-tune
After=multi-user.target

[Service]
Type=oneshot
ExecStart=/usr/bin/powertop --auto-tune
RemainAfterExit=true

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable --now powertop.service`}),e.jsx("h2",{children:"auto-cpufreq — CPU Automático"}),e.jsx(a,{title:"Instalar e usar auto-cpufreq",code:`# Instalar do AUR
yay -S auto-cpufreq

# Modo monitor (apenas observa)
sudo auto-cpufreq --monitor

# Modo live (aplica otimizações sem persistir)
sudo auto-cpufreq --live

# Instalar como serviço (persistente)
sudo auto-cpufreq --install

# Verificar status
systemctl status auto-cpufreq

# Ver estatísticas
auto-cpufreq --stats`}),e.jsx(s,{type:"warning",title:"TLP vs auto-cpufreq",children:"Não use TLP e auto-cpufreq ao mesmo tempo — eles podem conflitar nas configurações do CPU. Escolha um dos dois. TLP é mais abrangente (disco, Wi-Fi, USB, etc.), auto-cpufreq é mais focado no CPU."}),e.jsx("h2",{children:"Governadores de CPU"}),e.jsx(a,{title:"Gerenciar frequência do CPU manualmente",code:`# Instalar cpupower
sudo pacman -S cpupower

# Ver governador atual
cpupower frequency-info

# Listar governadores disponíveis
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_available_governors

# Mudar governador
sudo cpupower frequency-set -g powersave    # Economia
sudo cpupower frequency-set -g performance  # Performance máxima
sudo cpupower frequency-set -g schedutil    # Dinâmico (recomendado)
sudo cpupower frequency-set -g ondemand     # Sob demanda

# Definir frequência máxima
sudo cpupower frequency-set -u 2.0GHz

# Definir frequência mínima
sudo cpupower frequency-set -d 800MHz

# Habilitar serviço para persistir
sudo systemctl enable cpupower`}),e.jsx("h2",{children:"Suspensão e Hibernação"}),e.jsx(a,{title:"Configurar suspensão e hibernação",code:`# Suspender (sleep) — mantém na RAM, rápido mas usa bateria
systemctl suspend

# Hibernar — salva na swap, desliga completamente
systemctl hibernate

# Suspensão híbrida — salva na swap + mantém na RAM
systemctl hybrid-sleep

# Suspend-then-hibernate — suspende e hiberna após tempo
systemctl suspend-then-hibernate`}),e.jsx(a,{title:"Configurar hibernate",code:`# 1. Precisa de swap >= tamanho da RAM
# Verificar swap
swapon --show
free -h

# 2. Para swap file, descobrir o offset
sudo filefrag -v /swapfile | head -4
# Anotar o primeiro valor de "physical_offset"

# 3. Adicionar parâmetros ao kernel
# GRUB: editar /etc/default/grub
GRUB_CMDLINE_LINUX_DEFAULT="... resume=UUID=XXXX resume_offset=YYYY"
sudo grub-mkconfig -o /boot/grub/grub.cfg

# systemd-boot: editar entrada
options ... resume=UUID=XXXX resume_offset=YYYY

# 4. Adicionar hook do resume no mkinitcpio
sudo vim /etc/mkinitcpio.conf
# HOOKS=(... filesystems resume fsck)
# "resume" deve vir APÓS "filesystems"

sudo mkinitcpio -P

# 5. Testar
systemctl hibernate`}),e.jsx(a,{title:"Configurar lid close (fechar a tampa)",code:`# Editar /etc/systemd/logind.conf
sudo vim /etc/systemd/logind.conf

[Login]
# Ao fechar a tampa:
HandleLidSwitch=suspend
# Opções: ignore, poweroff, reboot, halt, 
#          suspend, hibernate, hybrid-sleep,
#          suspend-then-hibernate, lock

# Ao fechar tampa com dock/monitor externo:
HandleLidSwitchDocked=ignore

# Ao apertar botão power:
HandlePowerKey=poweroff

# Tempo antes de hibernate após suspend
HoldoffTimeoutSec=30s

# Reiniciar serviço
sudo systemctl restart systemd-logind`}),e.jsx("h2",{children:"TRIM para SSDs"}),e.jsx(a,{title:"Habilitar TRIM periódico",code:`# Verificar se o SSD suporta TRIM
sudo hdparm -I /dev/sda | grep TRIM
# ou
lsblk --discard

# Habilitar timer do fstrim (recomendado)
sudo systemctl enable --now fstrim.timer

# Verificar timer
systemctl status fstrim.timer

# Executar TRIM manual
sudo fstrim -av`}),e.jsx("h2",{children:"Monitoramento de Bateria"}),e.jsx(a,{title:"Monitorar saúde e uso da bateria",code:`# Informações da bateria
upower -i /org/freedesktop/UPower/devices/battery_BAT0

# Via sysfs
cat /sys/class/power_supply/BAT0/capacity      # Porcentagem
cat /sys/class/power_supply/BAT0/status         # Charging/Discharging
cat /sys/class/power_supply/BAT0/cycle_count    # Ciclos de carga

# Calcular saúde da bateria
echo "scale=2; $(cat /sys/class/power_supply/BAT0/energy_full) / $(cat /sys/class/power_supply/BAT0/energy_full_design) * 100" | bc

# Monitorar consumo em tempo real
sudo powertop

# Via TLP
sudo tlp-stat -b`})]})}export{m as default};
