import{j as e}from"./ui-K-J8Jkwj.js";import{P as a}from"./PageContainer-tnnsMrcC.js";import{C as o}from"./CodeBlock-DEDRw1y6.js";import{A as i}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function h(){return e.jsxs(a,{title:"NetworkManager",subtitle:"O gerenciador de rede completo: configure Wi-Fi, Ethernet, VPN, hotspot e muito mais com nmcli e nmtui.",difficulty:"iniciante",timeToRead:"20 min",children:[e.jsx("h2",{children:"O que é o NetworkManager?"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"NetworkManager"})," é o daemon de gerenciamento de rede mais popular no Linux. Ele detecta e configura automaticamente conexões de rede, suporta Wi-Fi, Ethernet, VPN, hotspot, bridge, VLAN e muito mais. É a escolha padrão para desktops."]}),e.jsx(o,{title:"Instalar e habilitar o NetworkManager",code:`# Instalar
sudo pacman -S networkmanager

# Habilitar e iniciar
sudo systemctl enable --now NetworkManager

# Verificar status
systemctl status NetworkManager

# IMPORTANTE: Desabilitar outros gerenciadores de rede
# para evitar conflitos:
sudo systemctl disable --now systemd-networkd
sudo systemctl disable --now dhcpcd`}),e.jsxs(i,{type:"warning",title:"Conflito com outros serviços",children:["Não rode NetworkManager junto com ",e.jsx("code",{children:"systemd-networkd"}),", ",e.jsx("code",{children:"dhcpcd"})," ou ",e.jsx("code",{children:"netctl"}),"ao mesmo tempo. Eles vão conflitar e causar problemas de rede."]}),e.jsx("h2",{children:"nmcli — O Comando Principal"}),e.jsx("h3",{children:"Conexões Gerais"}),e.jsx(o,{title:"Operações básicas com nmcli",code:`# Ver status geral da rede
nmcli general status

# Listar todos os dispositivos de rede
nmcli device

# Listar todas as conexões salvas
nmcli connection show

# Listar conexões ativas
nmcli connection show --active

# Ver detalhes de uma conexão
nmcli connection show "Nome da Conexão"

# Ativar uma conexão salva
nmcli connection up "Nome da Conexão"

# Desativar uma conexão
nmcli connection down "Nome da Conexão"

# Deletar uma conexão salva
nmcli connection delete "Nome da Conexão"`}),e.jsx("h3",{children:"Wi-Fi"}),e.jsx(o,{title:"Gerenciar Wi-Fi com nmcli",code:`# Verificar se o Wi-Fi está habilitado
nmcli radio wifi

# Habilitar Wi-Fi
nmcli radio wifi on

# Desabilitar Wi-Fi
nmcli radio wifi off

# Escanear redes Wi-Fi disponíveis
nmcli device wifi list

# Conectar a uma rede Wi-Fi
nmcli device wifi connect "NomeDaRede" password "SuaSenha"

# Conectar a uma rede Wi-Fi oculta
nmcli device wifi connect "NomeDaRede" password "SuaSenha" hidden yes

# Conectar usando interface específica
nmcli device wifi connect "NomeDaRede" password "SuaSenha" ifname wlan0

# Rescan (atualizar lista)
nmcli device wifi rescan`}),e.jsx("h3",{children:"IP Estático"}),e.jsx(o,{title:"Configurar IP estático",code:`# Configurar IP estático em uma conexão existente
nmcli connection modify "Nome da Conexão" \\
  ipv4.addresses 192.168.1.100/24 \\
  ipv4.gateway 192.168.1.1 \\
  ipv4.dns "8.8.8.8 8.8.4.4" \\
  ipv4.method manual

# Reativar a conexão para aplicar
nmcli connection up "Nome da Conexão"

# Voltar para DHCP
nmcli connection modify "Nome da Conexão" \\
  ipv4.method auto \\
  ipv4.addresses "" \\
  ipv4.gateway "" \\
  ipv4.dns ""

nmcli connection up "Nome da Conexão"`}),e.jsx("h3",{children:"Hotspot Wi-Fi"}),e.jsx(o,{title:"Criar um hotspot Wi-Fi",code:`# Criar hotspot
nmcli device wifi hotspot ifname wlan0 ssid "MeuHotspot" password "senha12345"

# Verificar status do hotspot
nmcli connection show --active

# Parar o hotspot
nmcli connection down Hotspot

# Compartilhar internet de Ethernet via Wi-Fi hotspot
nmcli device wifi hotspot ifname wlan0 con-name Hotspot ssid "MeuArch" password "minhasenha"`}),e.jsx("h2",{children:"nmtui — Interface Gráfica no Terminal"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"nmtui"})," é uma interface interativa no terminal, mais amigável que o nmcli."]}),e.jsx(o,{title:"Usar nmtui",code:`# Abrir interface interativa
nmtui

# Opções disponíveis:
# 1. Edit a connection — editar/criar conexões
# 2. Activate a connection — ativar/desativar conexões
# 3. Set system hostname — definir hostname

# Atalhos diretos
nmtui connect   # Ir direto para ativação
nmtui edit      # Ir direto para edição
nmtui hostname  # Ir direto para hostname`}),e.jsx("h2",{children:"DNS"}),e.jsx(o,{title:"Configurar DNS personalizado",code:`# Configurar DNS globalmente
nmcli connection modify "Nome da Conexão" ipv4.dns "1.1.1.1 1.0.0.1"
nmcli connection modify "Nome da Conexão" ipv4.ignore-auto-dns yes
nmcli connection up "Nome da Conexão"

# Verificar DNS ativo
resolvectl status
# ou
cat /etc/resolv.conf

# DNS recomendados:
# Cloudflare: 1.1.1.1, 1.0.0.1
# Google: 8.8.8.8, 8.8.4.4
# Quad9: 9.9.9.9, 149.112.112.112`}),e.jsx("h2",{children:"Hostname"}),e.jsx(o,{title:"Configurar hostname",code:`# Ver hostname atual
hostnamectl

# Alterar hostname
sudo hostnamectl set-hostname meu-arch-linux

# Ou via nmcli
nmcli general hostname meu-arch-linux

# Editar /etc/hosts
sudo vim /etc/hosts
# 127.0.0.1  localhost
# ::1        localhost
# 127.0.1.1  meu-arch-linux.localdomain meu-arch-linux`}),e.jsx("h2",{children:"Monitoramento"}),e.jsx(o,{title:"Monitorar rede em tempo real",code:`# Monitorar mudanças de conexão
nmcli monitor

# Ver log do NetworkManager
journalctl -u NetworkManager -f

# Ver velocidade da conexão Wi-Fi
nmcli device wifi list | grep '*'

# Diagnóstico completo
nmcli general

# Listar endereços IP
ip addr show

# Testar conectividade
nmcli networking connectivity check`}),e.jsx("h2",{children:"Dispatchers (Scripts Automáticos)"}),e.jsx(o,{title:"Executar scripts quando a rede muda",code:`# Scripts em /etc/NetworkManager/dispatcher.d/ são executados
# quando o estado da rede muda

# Exemplo: script que roda ao conectar
sudo tee /etc/NetworkManager/dispatcher.d/10-notify.sh << 'SCRIPT'
#!/bin/bash
if [ "$2" = "up" ]; then
    logger "NetworkManager: Interface $1 conectada"
fi
if [ "$2" = "down" ]; then
    logger "NetworkManager: Interface $1 desconectada"
fi
SCRIPT

sudo chmod 755 /etc/NetworkManager/dispatcher.d/10-notify.sh`}),e.jsxs(i,{type:"info",title:"Alternativas ao NetworkManager",children:[e.jsx("strong",{children:"systemd-networkd"}),": mais leve, ideal para servidores. Configuração por arquivos em ",e.jsx("code",{children:"/etc/systemd/network/"}),".",e.jsx("br",{}),e.jsx("br",{}),e.jsx("strong",{children:"iwd"}),": daemon Wi-Fi moderno e rápido. Pode ser usado sozinho ou como backend do NetworkManager.",e.jsx("br",{}),e.jsx("br",{}),e.jsx("strong",{children:"ConnMan"}),": gerenciador leve usado em sistemas embarcados."]})]})}export{h as default};
