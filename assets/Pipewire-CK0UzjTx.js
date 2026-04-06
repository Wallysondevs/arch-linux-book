import{j as e}from"./ui-K-J8Jkwj.js";import{P as o}from"./PageContainer-tnnsMrcC.js";import{C as i}from"./CodeBlock-DEDRw1y6.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function n(){return e.jsxs(o,{title:"PipeWire & Áudio no Linux",subtitle:"PipeWire é o novo sistema de áudio do Linux — substitui PulseAudio e JACK. Configure áudio, Bluetooth, HDMI, microfones e produza música profissional no Arch.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsx("h2",{children:"Evolução do Áudio no Linux"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"ALSA"})," — Camada básica de áudio no kernel. Baixo nível, sem mixer de software."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"PulseAudio"})," — Servidor de som de alto nível. Mixing, roteamento, rede. Padrão por anos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"JACK"})," — Para áudio profissional de baixa latência. Complexo para uso geral."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"PipeWire"})," — Substitui ambos! Compatível com PulseAudio E JACK. Baixa latência. Suporte a Bluetooth e screensharing."]})]}),e.jsx("h2",{children:"Instalação do PipeWire"}),e.jsx(i,{title:"Instalar PipeWire completo",code:`# Instalar PipeWire e todos os componentes
sudo pacman -S pipewire pipewire-alsa pipewire-pulse pipewire-jack wireplumber

# Componentes:
# pipewire        - Core do PipeWire
# pipewire-alsa   - Redirecionar apps ALSA para PipeWire
# pipewire-pulse  - Compatibilidade com PulseAudio (apps que usam PA)
# pipewire-jack   - Compatibilidade com JACK
# wireplumber     - Session manager (substitui pipewire-media-session)

# Habilitar para o usuário (NÃO use sudo - é serviço de usuário)
systemctl --user enable pipewire pipewire-pulse wireplumber
systemctl --user start pipewire pipewire-pulse wireplumber

# Verificar status
systemctl --user status pipewire
pactl info | grep "Server Name"
# Server Name: PulseAudio (on PipeWire 1.x.x)  ← Correto!

# Se tinha PulseAudio instalado, remover
sudo pacman -R pulseaudio pulseaudio-bluetooth  # Pode conflitar`}),e.jsx("h2",{children:"Gerenciar Áudio: pactl e wpctl"}),e.jsx(i,{title:"Controlar áudio via linha de comando",code:`# === pactl (compatível com PulseAudio) ===

# Listar sinks (saídas de áudio)
pactl list sinks short
# 0  alsa_output.pci-0000_00_1f.3.analog-stereo  running
# 1  bluez_output.AA_BB_CC_DD_EE_FF.1             suspended

# Listar sources (entradas - microfones)
pactl list sources short

# Definir sink padrão (saída de áudio)
pactl set-default-sink alsa_output.pci-0000_00_1f.3.analog-stereo
pactl set-default-sink 0    # Por índice

# Definir source padrão (microfone)
pactl set-default-source alsa_input.pci-0000_00_1f.3.analog-stereo

# Controlar volume
pactl set-sink-volume @DEFAULT_SINK@ 80%    # Definir 80%
pactl set-sink-volume @DEFAULT_SINK@ +5%    # Aumentar 5%
pactl set-sink-volume @DEFAULT_SINK@ -5%    # Diminuir 5%

# Mudo
pactl set-sink-mute @DEFAULT_SINK@ toggle

# === wpctl (nativo WirePlumber) ===
# Mais moderno e recomendado

# Status completo
wpctl status

# Definir padrão
wpctl set-default SINK_ID

# Volume
wpctl set-volume @DEFAULT_AUDIO_SINK@ 80%
wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+
wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-
wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle`}),e.jsx("h2",{children:"Ferramentas Gráficas"}),e.jsx(i,{title:"Mixers e GUIs para áudio",code:`# pavucontrol - Mixer PulseAudio (funciona com PipeWire)
sudo pacman -S pavucontrol

# easyeffects - Efeitos de áudio (EQ, compressor, etc.)
sudo pacman -S easyeffects

# qpwgraph - Visualizar e roteamento de áudio (como JACK patchbay)
sudo pacman -S qpwgraph

# helvum - Patchbay gráfico para PipeWire
yay -S helvum`}),e.jsx("h2",{children:"Bluetooth e PipeWire"}),e.jsx(i,{title:"Configurar Bluetooth com PipeWire",code:`# Instalar suporte Bluetooth para PipeWire
sudo pacman -S bluez bluez-utils

# O PipeWire já tem suporte a Bluetooth integrado!
# Não precisa de módulo especial como o PulseAudio precisava

# Verificar dispositivos Bluetooth no PipeWire
wpctl status | grep -i blue

# Perfis Bluetooth disponíveis
pactl list cards | grep -A 30 "bluez"

# Trocar perfil: A2DP (alta qualidade) vs HFP (com microfone)
pactl set-card-profile bluez_card.XX_XX_XX_XX_XX_XX a2dp-sink
pactl set-card-profile bluez_card.XX_XX_XX_XX_XX_XX handsfree-head-unit`}),e.jsx("h2",{children:"Roteamento de Áudio Avançado"}),e.jsx(i,{title:"Rotear áudio entre aplicativos",code:`# Ver streams (aplicativos com áudio ativo)
pactl list sink-inputs short
# 0  protocol-native.c  alsa_output.pci... running  firefox
# 1  protocol-native.c  alsa_output.pci... running  spotify

# Mover stream para outro sink
pactl move-sink-input STREAM_ID SINK_ID
pactl move-sink-input 0 1    # Firefox → sink 1 (ex: HDMI)

# Com qpwgraph ou helvum, fazer isso visualmente!

# Roteamento via arquivo de configuração
# /etc/pipewire/pipewire.conf.d/
# ~/.config/pipewire/pipewire.conf.d/`}),e.jsx("h2",{children:"Áudio Profissional e Baixa Latência"}),e.jsx(i,{title:"Configurar PipeWire para baixa latência",code:`# Ver configuração atual de latência
pw-metadata -n settings | grep quantum

# Configurar quantum (tamanho do buffer - menor = menor latência)
# Em ~/.config/pipewire/pipewire.conf.d/10-lowlatency.conf:
context.properties = {
    default.clock.rate = 48000       # Sample rate
    default.clock.quantum = 64       # Buffer size (64 samples ~ 1.3ms a 48kHz)
    default.clock.min-quantum = 32
    default.clock.max-quantum = 8192
}

# Reload PipeWire
systemctl --user restart pipewire wireplumber

# Verificar latência atual
pw-top    # Monitor em tempo real do PipeWire`}),e.jsx("h2",{children:"Solução de Problemas"}),e.jsx(i,{title:"Diagnosticar problemas de áudio",code:`# Verificar se PipeWire está rodando
systemctl --user status pipewire pipewire-pulse wireplumber

# Reiniciar tudo
systemctl --user restart pipewire pipewire-pulse wireplumber

# Ver logs
journalctl --user -u pipewire -n 50 -f
journalctl --user -u wireplumber -n 50

# Sem áudio? Verificar se está mutado no ALSA
alsamixer    # Pressionar M para unmute

# Ver dispositivos ALSA
aplay -l     # Devices de saída
arecord -l   # Devices de entrada (microfone)

# Testar reprodução direta via ALSA
aplay /usr/share/sounds/alsa/Front_Left.wav

# Verificar driver de áudio carregado
lspci -k | grep -A 3 "Audio"
lsmod | grep snd

# Problema: nenhum sink disponível
pactl list sinks  # Deve mostrar ao menos um
# Se vazio, reinstalar pipewire-alsa e reiniciar`})]})}export{n as default};
