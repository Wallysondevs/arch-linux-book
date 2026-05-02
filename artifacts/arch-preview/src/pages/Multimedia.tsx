import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";

export default function Multimedia() {
  return (
    <PageContainer
      title="Multimídia no Arch — ffmpeg, mpv, vlc, áudio"
      subtitle="Codecs, conversões com ffmpeg, players (mpv/vlc), e o stack de áudio: PipeWire (default moderno) vs PulseAudio."
      difficulty="intermediario"
      timeToRead="35 min"
      category="Multimídia"
    >
      <p>
        Arch entrega um stack multimídia <em>limpo</em> — você instala apenas o que usa. Esta página
        cobre: <strong>ffmpeg</strong> (canivete suíço), <strong>mpv/vlc</strong> (players),
        <strong> codecs</strong> (gstreamer plugins) e o <strong>stack de áudio moderno (PipeWire)</strong>{" "}
        substituindo PulseAudio + JACK.
      </p>

      <h2>1. Instalando o básico</h2>

      <TerminalBlock
        command="sudo pacman -S ffmpeg mpv vlc"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (3) ffmpeg-2:7.1-1  mpv-0.39.0-3  vlc-3.0.21-3

Total Download Size:   58.32 MiB
Total Installed Size:  214.71 MiB

:: Proceed with installation? [Y/n] y`}
      />

      <h2>2. ffmpeg — o canivete suíço</h2>

      <TerminalBlock
        command="ffmpeg -version | head -3"
        output={`ffmpeg version n7.1 Copyright (c) 2000-2024 the FFmpeg developers
built with gcc 14.2.1 (GCC) 20240910
configuration: --prefix=/usr --disable-debug --disable-static --enable-amf --enable-avisynth --enable-cuda-llvm --enable-lto --enable-fontconfig ...`}
      />

      <CommandFlagList
        command="ffmpeg"
        items={[
          { flag: "-i FILE", description: "Arquivo de entrada (pode repetir para múltiplas entradas).", example: "ffmpeg -i in.mp4 -i audio.aac out.mp4" },
          { flag: "-c:v CODEC", description: "Codec de vídeo. Comuns: libx264, libx265, libvpx-vp9, copy.", example: "-c:v libx264" },
          { flag: "-c:a CODEC", description: "Codec de áudio. Comuns: aac, libopus, libmp3lame, copy." },
          { flag: "-c copy", description: "Sem reencode — só recipiente. RÁPIDO." },
          { flag: "-b:v BITRATE", description: "Bitrate vídeo. Ex: 2M = 2 Mbit/s." },
          { flag: "-crf N", description: "Qualidade constante (x264/x265). 18=visualmente perfeito, 23=padrão, 28=grão." },
          { flag: "-preset NAME", description: "Trade-off velocidade/tamanho. ultrafast→placebo." },
          { flag: "-vf FILTER", description: "Video filtergraph (scale, crop, fps, drawtext...).", example: "-vf 'scale=1280:-2,fps=30'" },
          { flag: "-af FILTER", description: "Audio filtergraph (volume, atempo, loudnorm)." },
          { flag: "-ss TIME", description: "Seek inicial (HH:MM:SS ou segundos). Antes de -i = rápido.", example: "ffmpeg -ss 00:01:30 -i in.mp4 ..." },
          { flag: "-t DUR", description: "Duração a processar a partir do -ss." },
          { flag: "-to TIME", description: "Pare nesse timestamp (alternativa a -t)." },
          { flag: "-map", description: "Selecione streams específicas.", example: "-map 0:v -map 1:a" },
          { flag: "-loglevel", description: "quiet/error/warning/info/verbose/debug." },
          { flag: "-y / -n", description: "Sobrescreve sem perguntar / nunca sobrescreve." },
        ]}
      />

      <h3>Inspecionar um arquivo</h3>

      <TerminalBlock
        command="ffprobe -hide_banner video.mp4"
        output={`Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'video.mp4':
  Metadata:
    major_brand     : isom
    minor_version   : 512
    compatible_brands: isomiso2avc1mp41
    encoder         : Lavf60.16.100
  Duration: 00:04:32.18, start: 0.000000, bitrate: 4218 kb/s
  Stream #0:0[0x1](und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709, progressive), 1920x1080 [SAR 1:1 DAR 16:9], 4096 kb/s, 30 fps, 30 tbr, 15360 tbn (default)
      Metadata:
        handler_name    : VideoHandler
        vendor_id       : [0][0][0][0]
  Stream #0:1[0x2](und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 128 kb/s (default)
      Metadata:
        handler_name    : SoundHandler`}
      />

      <h3>Conversões clássicas</h3>

      <TerminalBlock
        comment="MP4 → WebM (VP9 + Opus)"
        command="ffmpeg -i in.mp4 -c:v libvpx-vp9 -crf 32 -b:v 0 -c:a libopus -b:a 128k out.webm"
      />

      <TerminalBlock
        comment="reduzir resolução (720p, mantendo proporção)"
        command="ffmpeg -i in.mp4 -vf 'scale=-2:720' -c:v libx264 -crf 20 -preset slow -c:a copy out_720p.mp4"
      />

      <TerminalBlock
        comment="extrair só áudio (sem reencode)"
        command="ffmpeg -i video.mp4 -vn -c:a copy audio.m4a"
      />

      <TerminalBlock
        comment="MP3 com qualidade VBR ~190kbps"
        command="ffmpeg -i video.mkv -vn -c:a libmp3lame -q:a 2 audio.mp3"
        output={`size=    6213kB time=00:04:32.16 bitrate= 187.0kbits/s speed=44.2x`}
      />

      <TerminalBlock
        comment="cortar trecho (rápido, sem reencode)"
        command="ffmpeg -ss 00:01:30 -to 00:02:45 -i in.mp4 -c copy clip.mp4"
      />

      <TerminalBlock
        comment="GIF de alta qualidade (palette de 2 passos)"
        command={`ffmpeg -i in.mp4 -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" out.gif`}
      />

      <TerminalBlock
        comment="screencast da tela inteira (X11) com áudio do mic"
        command={`ffmpeg -f x11grab -framerate 30 -video_size 1920x1080 -i :0.0 \\
       -f pulse -i default \\
       -c:v libx264 -preset ultrafast -crf 18 \\
       -c:a aac -b:a 160k screencast.mp4`}
      />

      <TerminalBlock
        comment="hardware encoder NVIDIA (NVENC) — bem mais rápido"
        command="ffmpeg -i in.mkv -c:v h264_nvenc -preset p5 -tune hq -b:v 5M out.mp4"
      />

      <TerminalBlock
        comment="hardware Intel (VA-API)"
        command="ffmpeg -hwaccel vaapi -hwaccel_output_format vaapi -i in.mp4 -c:v h264_vaapi -b:v 4M out.mp4"
      />

      <h3>Aceleração de hardware no Arch</h3>

      <OutputBlock
        title="pacotes por GPU"
        output={`Intel iGPU      sudo pacman -S intel-media-driver libva-utils
NVIDIA          sudo pacman -S nvidia-utils libva-nvidia-driver
AMD             sudo pacman -S libva-mesa-driver mesa-vdpau

vainfo                       lista codecs HW disponíveis (VA-API)
nvidia-smi                   status da GPU NVIDIA
sudo pacman -S vdpauinfo     info VDPAU (legacy)`}
      />

      <TerminalBlock
        command="vainfo"
        output={`libva info: VA-API version 1.22.0
libva info: User environment variable requested driver 'iHD'
libva info: Trying to open /usr/lib/dri/iHD_drv_video.so
vainfo: VA-API version: 1.22 (libva 2.22.0)
vainfo: Driver version: Intel iHD driver for Intel(R) Gen Graphics - 24.3.4
vainfo: Supported profile and entrypoints
      VAProfileH264Main               : VAEntrypointVLD
      VAProfileH264Main               : VAEntrypointEncSlice
      VAProfileH264High               : VAEntrypointVLD
      VAProfileH264High               : VAEntrypointEncSlice
      VAProfileHEVCMain               : VAEntrypointVLD
      VAProfileHEVCMain               : VAEntrypointEncSlice
      VAProfileVP9Profile0            : VAEntrypointVLD
      VAProfileAV1Profile0            : VAEntrypointVLD`}
      />

      <h2>3. mpv — o player que respeita o terminal</h2>

      <TerminalBlock
        command="mpv video.mkv"
        output={`Playing: video.mkv
 (+) Video --vid=1 (h264 1920x1080 30.000fps)
 (+) Audio --aid=1 --alang=jpn (aac 2ch 48000Hz)
     Subs  --sid=1 --slang=eng (ass) (default)
AO: [pipewire] 48000Hz stereo 2ch float
VO: [gpu] 1920x1080 yuv420p
AV: 00:00:42 / 00:24:18 (3%) A-V: -0.001`}
      />

      <OutputBlock
        title="atalhos essenciais do mpv"
        output={`espaço/p     play/pause
seta ←/→     ±5 segundos
seta ↑/↓     ±60 segundos
[ / ]        velocidade -10% / +10%
{ / }        velocidade /2 / x2
backspace    velocidade reset
m            mudo
9 / 0        volume ±2
f            fullscreen toggle
s            screenshot (atalho-screenshot)
S            screenshot SEM subtítulos
j / J        próx/ant subtitle track
# (shift+3)  próx audio track
o            mostra timer
q            sair (salva posição se save-position-on-quit)
Q            sair SEM salvar`}
      />

      <h3>~/.config/mpv/mpv.conf</h3>

      <TerminalBlock
        command="cat ~/.config/mpv/mpv.conf"
        output={`# qualidade alta de upscale
profile=high-quality

# salva onde parou
save-position-on-quit=yes

# áudio padrão pt → en → ja
alang=por,pt,eng,en,jpn,ja
# subs padrão pt → en
slang=por,pt,eng,en

# hardware decode (auto detecta vaapi/nvdec/...)
hwdec=auto-safe

# no Wayland
gpu-context=wayland`}
      />

      <h2>4. VLC — o "all-in-one"</h2>

      <p>
        VLC inclui codecs (não depende de gstreamer plugins), tem GUI rica e modo CLI <code>cvlc</code>.
        É a melhor escolha quando o arquivo é estranho (m2ts, vob, .ts de DVB) ou quando você precisa
        streamar.
      </p>

      <TerminalBlock
        comment="streamar um arquivo via HTTP na porta 8080"
        command={`cvlc video.mp4 --sout '#standard{access=http,mux=ts,dst=:8080}' --sout-keep`}
        output={`VLC media player 3.0.21 Vetinari (revision 3.0.21-0-gdd8bfdbabb)
[ts @ 0x...] muxing started, port 8080`}
      />

      <TerminalBlock
        comment="receber em outra máquina"
        command="mpv http://192.168.0.10:8080"
      />

      <h2>5. Codec packs — gstreamer e libdvdcss</h2>

      <p>
        Aplicações GTK (Totem, GNOME Videos, Cheese, OBS quando não usa ffmpeg) dependem de
        <code> gstreamer plugins</code>. Instale o conjunto completo:
      </p>

      <TerminalBlock
        command="sudo pacman -S gst-plugins-base gst-plugins-good gst-plugins-bad gst-plugins-ugly gst-libav"
        output={`Packages (12) gst-libav-1.24.10-1  gst-plugins-bad-1.24.10-2 ...

Total Installed Size:  84.21 MiB`}
      />

      <OutputBlock
        title="o que é o quê (gst-plugins-*)"
        output={`base    elementos fundamentais (audioconvert, decodebin etc)
good    plugins com licença OK e bem testados
bad     plugins com qualidade variável mas úteis
ugly    plugins com restrições legais (mp3, dvd...)
libav   ponte para ffmpeg (decodifica praticamente tudo)`}
      />

      <p>
        Para tocar DVD comercial criptografado, instale também <code>libdvdcss</code>:
      </p>

      <TerminalBlock command="sudo pacman -S libdvdcss libdvdread libdvdnav" />

      <h2>6. PipeWire — o stack de áudio moderno</h2>

      <p>
        Desde 2022 o Arch usa <strong>PipeWire</strong> como servidor padrão de áudio + vídeo
        (substitui PulseAudio e JACK). Ele expõe APIs de compatibilidade com ambos, então apps
        antigos continuam funcionando.
      </p>

      <TerminalBlock
        command="sudo pacman -S pipewire pipewire-pulse pipewire-jack wireplumber pavucontrol"
        output={`Packages (5) pipewire-1:1.2.7-1  pipewire-pulse-1:1.2.7-1  pipewire-jack-1:1.2.7-1  wireplumber-0.5.7-1  pavucontrol-1:5.0-3`}
      />

      <TerminalBlock
        comment="ativar como serviço de usuário (não use sudo)"
        command="systemctl --user enable --now pipewire pipewire-pulse wireplumber"
      />

      <TerminalBlock
        command="systemctl --user status pipewire | head -5"
        output={`{g}● pipewire.service{/} - PipeWire Multimedia Service
     Loaded: loaded (/usr/lib/systemd/user/pipewire.service; enabled; preset: enabled)
     Active: {g}active (running){/} since Wed 2026-03-26 15:12:08 -03; 12s ago`}
      />

      <TerminalBlock
        comment="confirma que apps PulseAudio veem o PipeWire"
        command="pactl info | head -8"
        output={`Server String: /run/user/1000/pulse/native
Library Protocol Version: 35
Server Protocol Version: 35
Is Local: yes
Client Index: 17
Tile Size: 65472
User Name: user
Host Name: archlinux
Server Name: PulseAudio (on PipeWire 1.2.7)`}
      />

      <h3>Comandos úteis: pactl, wpctl, pw-cli</h3>

      <CommandFlagList
        command="wpctl (WirePlumber)"
        items={[
          { flag: "status", description: "Mostra grafo completo de áudio/vídeo, defaults, sinks, sources." },
          { flag: "set-default ID", description: "Define sink/source padrão." },
          { flag: "set-volume ID 0.5", description: "Volume 50%." },
          { flag: "set-mute ID toggle", description: "Mute on/off." },
          { flag: "inspect ID", description: "Detalhe de um node específico." },
        ]}
      />

      <TerminalBlock
        command="wpctl status"
        output={`PipeWire 'pipewire-0' [1.2.7, user@archlinux, cookie:1234567890]
 └─ Clients:
        32. WirePlumber                         [1.2.7, user@archlinux, pid:1487]
        33. WirePlumber [export]                [1.2.7, user@archlinux, pid:1487]
        45. pipewire                            [1.2.7, user@archlinux, pid:1485]
        62. Firefox                             [1.2.7, user@archlinux, pid:3421]

Audio
 ├─ Devices:
 │      48. Built-in Audio                     [alsa]
 │
 ├─ Sinks:
 │  *   54. Built-in Audio Analog Stereo       [vol: 0.85]
 │
 ├─ Sources:
 │  *   55. Built-in Audio Analog Stereo       [vol: 1.00]
 │
 └─ Streams:
        67. Firefox
            68. output_FL                       > Built-in Audio Analog Stereo:playback_FL
            69. output_FR                       > Built-in Audio Analog Stereo:playback_FR

Video
 └─ Devices:
        71. Integrated_Webcam_HD               [v4l2]`}
      />

      <TerminalBlock
        comment="volume: 75% no sink padrão"
        command="wpctl set-volume @DEFAULT_AUDIO_SINK@ 0.75"
      />

      <TerminalBlock
        comment="mutar/desmutar mic"
        command="wpctl set-mute @DEFAULT_AUDIO_SOURCE@ toggle"
      />

      <h3>pavucontrol — GUI de mixagem</h3>

      <p>
        Roteamento por aplicativo (mover Firefox pro headset, jogo pra speakers) é trivial em
        <code> pavucontrol</code>. Aba <em>Playback</em> mostra cada stream em execução e permite trocar
        o sink em tempo real.
      </p>

      <h3>JACK — áudio profissional sobre PipeWire</h3>

      <p>
        Se você usa Ardour, Carla, Reaper ou plugins LV2, instale <code>pipewire-jack</code> (já feito
        acima). Programas JACK enxergam o PipeWire automaticamente — sem precisar do <code>jackd</code>{" "}
        rodando. Confirme:
      </p>

      <TerminalBlock command="pw-jack jack_lsp" output="(lista as portas JACK virtuais)" />

      <h2>7. PulseAudio puro (legado, NÃO recomendado em 2026)</h2>

      <AlertBox type="warning" title="PulseAudio ainda existe mas...">
        Você só deve usar <code>pulseaudio</code> + <code>pulseaudio-alsa</code> em vez de PipeWire em
        casos muito específicos (hardware muito antigo com bug, ambiente embarcado leve). Para
        desktop normal, PipeWire é estritamente superior: latência menor, suporte JACK nativo,
        screen-share Wayland e roteamento melhor.
      </AlertBox>

      <h2>8. Resumo prático</h2>

      <OutputBlock
        title="cheatsheet multimídia"
        output={`# instalação base
sudo pacman -S ffmpeg mpv vlc gst-plugins-{base,good,bad,ugly} gst-libav

# áudio (PipeWire stack)
sudo pacman -S pipewire pipewire-pulse pipewire-jack wireplumber pavucontrol
systemctl --user enable --now pipewire pipewire-pulse wireplumber

# verificar
ffprobe arquivo.mp4              # codecs/streams
mpv arquivo                      # tocar
wpctl status                     # áudio do sistema
vainfo / nvidia-smi              # HW decode disponível

# conversão típica
ffmpeg -i in.mkv -c:v libx264 -crf 20 -preset slow -c:a aac -b:a 192k out.mp4

# extrair áudio
ffmpeg -i video.mp4 -vn -c:a libmp3lame -q:a 2 audio.mp3

# corte rápido
ffmpeg -ss 00:01:30 -to 00:02:45 -i in.mp4 -c copy clip.mp4`}
      />
    </PageContainer>
  );
}
