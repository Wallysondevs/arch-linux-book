import{j as e}from"./ui-K-J8Jkwj.js";import{P as s}from"./PageContainer-tnnsMrcC.js";import{C as o}from"./CodeBlock-DEDRw1y6.js";import{A as d}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function l(){return e.jsxs(s,{title:"udev: Regras de Dispositivos",subtitle:"Crie regras personalizadas para dispositivos USB, discos, teclados e mais. Automatize ações quando hardware é conectado.",difficulty:"avancado",timeToRead:"18 min",children:[e.jsx("h2",{children:"O que é o udev?"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"udev"})," (userspace device manager) é o subsistema do Linux responsável por gerenciar dispositivos de hardware. Quando você conecta um USB, pen drive, teclado ou qualquer dispositivo, o udev detecta e cria o arquivo de dispositivo em ",e.jsx("code",{children:"/dev/"}),". Com regras udev, você pode automatizar ações quando dispositivos são conectados ou removidos."]}),e.jsx("h2",{children:"Monitorando Dispositivos"}),e.jsx(o,{title:"Monitorar eventos udev em tempo real",code:`# Monitorar eventos (conecte/desconecte algo para ver)
sudo udevadm monitor

# Monitorar apenas eventos do kernel
sudo udevadm monitor --kernel

# Monitorar eventos do udev (após processamento de regras)
sudo udevadm monitor --udev

# Formato detalhado
sudo udevadm monitor --property`}),e.jsx(o,{title:"Obter informações de um dispositivo",code:`# Informações de um dispositivo específico
udevadm info /dev/sdb

# Informações com atributos (necessário para criar regras)
udevadm info --attribute-walk /dev/sdb

# Informações por caminho sysfs
udevadm info --path=/sys/class/block/sdb

# Encontrar informações de dispositivo USB
lsusb
# Bus 001 Device 005: ID 046d:c077 Logitech, Inc. M105 Optical Mouse

udevadm info /dev/input/mouse0`}),e.jsx("h2",{children:"Criando Regras udev"}),e.jsxs("p",{children:["Regras ficam em ",e.jsx("code",{children:"/etc/udev/rules.d/"}),". O formato do nome é ",e.jsx("code",{children:"NN-descricao.rules"}),"onde NN é um número que define a ordem de execução (números menores executam primeiro)."]}),e.jsx(o,{title:"Estrutura de uma regra udev",code:`# Formato: condições de match, ações
# Condições usam == (igual) ou != (diferente)
# Ações usam = (atribuir) ou += (adicionar)

# Exemplo básico: dar permissão a um dispositivo USB
# /etc/udev/rules.d/99-meu-dispositivo.rules
SUBSYSTEM=="usb", ATTR{idVendor}=="046d", ATTR{idProduct}=="c077", MODE="0666"

# Explicação:
# SUBSYSTEM=="usb"     → aplica apenas a dispositivos USB
# ATTR{idVendor}       → vendor ID do fabricante
# ATTR{idProduct}      → product ID do dispositivo
# MODE="0666"          → permissão de leitura/escrita para todos`}),e.jsx("h3",{children:"Exemplos Práticos"}),e.jsx(o,{title:"Nome fixo para pen drive USB",code:`# /etc/udev/rules.d/99-usb-storage.rules
# Dar nome fixo a um pen drive específico
SUBSYSTEM=="block", ATTRS{idVendor}=="0951", ATTRS{idProduct}=="1666", SYMLINK+="meu-pendrive"

# Agora o pen drive sempre estará em /dev/meu-pendrive
# além do nome dinâmico como /dev/sdb1`}),e.jsx(o,{title:"Auto-montar pen drive",code:`# /etc/udev/rules.d/99-automount.rules
# Montar automaticamente quando conectar
ACTION=="add", SUBSYSTEM=="block", ENV{ID_FS_TYPE}=="vfat", \\
  RUN+="/usr/bin/mkdir -p /mnt/usb", \\
  RUN+="/usr/bin/mount -o uid=1000,gid=1000 /dev/%k /mnt/usb"

# Desmontar quando remover
ACTION=="remove", SUBSYSTEM=="block", ENV{ID_FS_TYPE}=="vfat", \\
  RUN+="/usr/bin/umount /mnt/usb"`}),e.jsx(o,{title:"Executar script ao conectar dispositivo",code:`# /etc/udev/rules.d/99-backup-auto.rules
# Iniciar backup quando HD externo específico for conectado
ACTION=="add", SUBSYSTEM=="block", ATTRS{idVendor}=="1058", ATTRS{idProduct}=="25a2", \\
  RUN+="/home/usuario/scripts/backup-automatico.sh"

# O script deve ser executável:
# chmod +x /home/usuario/scripts/backup-automatico.sh`}),e.jsx(o,{title:"Permissões para Android (ADB)",code:`# /etc/udev/rules.d/51-android.rules
# Permitir ADB sem root para dispositivos Android
SUBSYSTEM=="usb", ATTR{idVendor}=="18d1", MODE="0666", GROUP="adbusers"
SUBSYSTEM=="usb", ATTR{idVendor}=="04e8", MODE="0666", GROUP="adbusers"  # Samsung
SUBSYSTEM=="usb", ATTR{idVendor}=="2717", MODE="0666", GROUP="adbusers"  # Xiaomi
SUBSYSTEM=="usb", ATTR{idVendor}=="22b8", MODE="0666", GROUP="adbusers"  # Motorola

# Adicionar seu usuário ao grupo
sudo gpasswd -a $USER adbusers`}),e.jsx(o,{title:"Desabilitar wake-on-USB (evitar que USB acorde o PC)",code:`# /etc/udev/rules.d/90-disable-usb-wakeup.rules
ACTION=="add", SUBSYSTEM=="usb", ATTR{power/wakeup}="disabled"`}),e.jsx(o,{title:"Ajustar brilho do teclado USB",code:`# /etc/udev/rules.d/99-keyboard-brightness.rules
# Dar permissão para ajustar brilho sem sudo
ACTION=="add", SUBSYSTEM=="leds", RUN+="/bin/chmod 666 /sys/class/leds/%k/brightness"`}),e.jsx("h2",{children:"Aplicando Regras"}),e.jsx(o,{title:"Recarregar regras sem reiniciar",code:`# Recarregar regras
sudo udevadm control --reload-rules

# Aplicar regras a dispositivos já conectados
sudo udevadm trigger

# Aplicar para um subsistema específico
sudo udevadm trigger --subsystem-match=usb

# Testar uma regra sem aplicar
sudo udevadm test /sys/class/block/sdb`}),e.jsx("h2",{children:"Variáveis Úteis em Regras"}),e.jsx(o,{title:"Variáveis disponíveis nas regras udev",code:`# Chaves de match (condições):
# ACTION        → add, remove, change
# SUBSYSTEM     → usb, block, input, net, etc
# KERNEL        → nome do dispositivo (sda, input0)
# ATTR{...}     → atributos do dispositivo
# ATTRS{...}    → atributos do dispositivo pai
# ENV{...}      → variáveis de ambiente
# DRIVER        → driver em uso
# TAG           → tags do dispositivo

# Chaves de ação:
# NAME          → renomear dispositivo
# SYMLINK       → criar link simbólico
# MODE          → permissões
# OWNER         → dono do arquivo
# GROUP         → grupo do arquivo
# RUN           → executar comando
# ENV{...}      → definir variável
# TAG           → adicionar tag

# Substituições:
# %k → nome do kernel (sda1)
# %n → número do dispositivo (1)
# %p → caminho sysfs
# %b → nome do arquivo base`}),e.jsx("h2",{children:"Troubleshooting"}),e.jsx(o,{title:"Diagnosticar problemas com regras udev",code:`# Ver logs do udev
journalctl -u systemd-udevd -f

# Testar regra em um dispositivo
sudo udevadm test /sys/class/block/sdb 2>&1 | grep -i "rule"

# Ver regras que se aplicam a um dispositivo
udevadm info --query=all /dev/sdb

# Aumentar nível de log para debug
sudo udevadm control --log-priority=debug
# Não esquecer de voltar:
sudo udevadm control --log-priority=info`}),e.jsxs(d,{type:"info",title:"Alternativa: systemd.device",children:["Para ações mais complexas ao conectar dispositivos, considere usar units",e.jsx("code",{children:"systemd.device"})," em vez de regras udev com RUN. Units systemd oferecem melhor controle de dependências, logs e gerenciamento de processos."]})]})}export{l as default};
