import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Gaming() {
  return (
    <PageContainer
      title="Gaming no Arch — Steam, Proton, MangoHud"
      subtitle="Habilitar multilib, instalar Steam + Proton-GE, Lutris para games fora-da-Steam, gamemode + mangohud para overlay e ganho de FPS."
      difficulty="intermediario"
      timeToRead="40 min"
      category="Desktop"
    >
      <p>
        Arch é uma plataforma de gaming surpreendentemente boa em 2026: <strong>Proton</strong>{" "}
        (camada Wine + DXVK + VKD3D mantida pela Valve) roda boa parte do catálogo Windows quase nativo.
        Esta página cobre o setup completo: <strong>multilib</strong>, drivers (NVIDIA/AMD/Intel),
        <strong> Steam</strong>, <strong>Lutris</strong>, <strong>Proton-GE</strong>,{" "}
        <strong>gamemode</strong> e <strong>MangoHud</strong>.
      </p>

      <h2>1. Habilitar o repositório multilib (32-bit)</h2>

      <p>
        Steam e muitos games são 32-bit. Edite <code>/etc/pacman.conf</code> e descomente as duas linhas
        de <code>[multilib]</code>:
      </p>

      <TerminalBlock command="sudoedit /etc/pacman.conf" />

      <CodeBlock
        title="/etc/pacman.conf (trecho)"
        code={`[multilib]
Include = /etc/pacman.d/mirrorlist`}
      />

      <TerminalBlock
        command="sudo pacman -Syu"
        output={`:: Synchronizing package databases...
 core         137.7 KiB  ...
 extra         8.4 MiB   ...
 multilib    166.5 KiB  ...
:: Starting full system upgrade...`}
      />

      <h2>2. Drivers de GPU</h2>

      <h3>NVIDIA (proprietário, recomendado para gaming)</h3>

      <TerminalBlock
        command="sudo pacman -S nvidia nvidia-utils lib32-nvidia-utils nvidia-settings"
        output={`Packages (5) lib32-nvidia-utils-565.77-1  nvidia-565.77-3  nvidia-utils-565.77-3  ...

Total Installed Size:  642.18 MiB`}
      />

      <TerminalBlock
        comment="se você usa o kernel linux-lts, instale o módulo correspondente"
        command="sudo pacman -S nvidia-lts"
      />

      <TerminalBlock
        command="nvidia-smi | head -8"
        output={`Wed Mar 26 15:42:18 2026
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 565.77                 Driver Version: 565.77         CUDA Version: 12.7     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|=========================================+========================+======================|
|   0  NVIDIA GeForce RTX 4070      Off   |   00000000:01:00.0  On |                  N/A |
| 30%   42C    P8              12W /  200W|     312MiB / 12282MiB  |      2%      Default |`}
      />

      <h3>AMD (open-source, melhor experiência)</h3>

      <TerminalBlock
        command="sudo pacman -S mesa lib32-mesa vulkan-radeon lib32-vulkan-radeon vulkan-icd-loader lib32-vulkan-icd-loader"
        output={`Packages (6) ...
Total Installed Size:  104.32 MiB`}
      />

      <h3>Intel (iGPU)</h3>

      <TerminalBlock
        command="sudo pacman -S mesa lib32-mesa vulkan-intel lib32-vulkan-intel intel-media-driver"
      />

      <TerminalBlock
        comment="confirme suporte Vulkan"
        command="vulkaninfo | head -5"
        output={`==========
VULKANINFO
==========

Vulkan Instance Version: 1.4.303`}
      />

      <h2>3. Steam</h2>

      <TerminalBlock
        command="sudo pacman -S steam"
        output={`resolving dependencies...
:: There are 4 providers available for steam:
:: Repository multilib
   1) lib32-vulkan-intel  2) lib32-vulkan-radeon  3) lib32-amdvlk  4) lib32-nvidia-utils

Enter a number (default=1): 4

Packages (32) lib32-libdrm-2.4.123-1  ... steam-1:1.0.0.81-2

Total Installed Size:  18.42 MiB`}
      />

      <TerminalBlock command="steam &" />

      <p>
        No primeiro launch, Steam baixa ~300 MB de runtime. Depois, vá em
        <strong> Settings → Compatibility → Enable Steam Play for all other titles</strong> para
        ativar Proton em jogos sem Linux nativo.
      </p>

      <AlertBox type="info" title="Qual versão de Proton usar?">
        <strong>Proton Experimental</strong> da Valve cobre 90% dos casos. Para jogos problemáticos,
        baixe <strong>Proton-GE</strong> (Glorious Eggroll) que adiciona patches mais agressivos,
        codecs proprietários e correções específicas.
      </AlertBox>

      <h2>4. ProtonUp-Qt — gerenciar versões de Proton-GE</h2>

      <TerminalBlock
        command="yay -S protonup-qt"
        output={`==> Making package: protonup-qt 2.10.3-1 (...)
==> Starting build()...
==> Finished making: protonup-qt 2.10.3-1 (...)
:: (1/1) Installing protonup-qt...`}
      />

      <TerminalBlock command="protonup-qt &" />

      <p>
        Na GUI: clique em <strong>Add version</strong> → escolha "GE-Proton" → versão mais recente
        (ex: GE-Proton9-22) → Install. Em ~1 min ela aparece no Steam após reiniciar o cliente.
      </p>

      <TerminalBlock
        comment="verificação manual: Proton-GE vai pra esta pasta"
        command="ls ~/.steam/root/compatibilitytools.d/"
        output={`GE-Proton9-22/
GE-Proton9-20/`}
      />

      <p>
        Em cada jogo: <em>Properties → Compatibility → Force the use of a specific Steam Play tool</em>{" "}
        → escolha o GE-Proton.
      </p>

      <h2>5. Lutris — games fora da Steam (Battle.net, Epic, GOG, retro)</h2>

      <TerminalBlock
        command="sudo pacman -S lutris wine wine-mono wine-gecko winetricks"
        output={`Packages (15) wine-10.0-1  wine-mono-9.4.0-1  wine-gecko-2.47.4-1  winetricks-20240105-2  lutris-0.5.18-1 ...`}
      />

      <p>
        Em <code>lutris</code>, instale via "Install from search" ou direto da
        <a href="https://lutris.net">lutris.net</a>: Battle.net, Epic Games Launcher, GOG Galaxy,
        EA App, etc. Cada install cria um prefixo Wine isolado em
        <code> ~/Games/&lt;nome&gt;/drive_c</code>.
      </p>

      <h2>6. gamemode — boost automático de performance</h2>

      <TerminalBlock
        command="sudo pacman -S gamemode lib32-gamemode"
        output={`Packages (2) gamemode-1.8.2-1  lib32-gamemode-1.8.2-1`}
      />

      <p>
        Quando um jogo executa via <code>gamemoderun</code> (ou via Steam launch options
        <code> gamemoderun %command%</code>), o daemon:
      </p>

      <OutputBlock
        title="o que o gamemode faz automaticamente"
        output={`✓ governor da CPU vira "performance"
✓ schedutil → modo de baixa latência
✓ I/O scheduler vira "none" (NVMe) ou "mq-deadline"
✓ inhibits screensaver
✓ ajusta power profile da GPU (NVIDIA: prefer max performance)
✓ I/O priority do processo vira realtime
✓ libera kernel.sched_autogroup_enabled=0`}
      />

      <TerminalBlock
        comment="ative no Steam: launch options"
        command="echo 'gamemoderun %command%'"
      />

      <TerminalBlock
        command="gamemoded -t"
        output={`[gamemoded] INFO: gamemoded 1.8.2 starting...
[gamemoded] INFO: GameMode is currently active (1 client)
[gamemoded] INFO: Performance governor enabled
[gamemoded] INFO: Inhibiting screensaver
{g}TEST PASSED{/}`}
      />

      <h2>7. MangoHud — overlay com FPS, GPU, CPU, frametime</h2>

      <TerminalBlock
        command="sudo pacman -S mangohud lib32-mangohud goverlay"
        output={`Packages (3) mangohud-0.7.2-1  lib32-mangohud-0.7.2-1  goverlay-1.2-1`}
      />

      <CodeBlock
        title="~/.config/MangoHud/MangoHud.conf"
        code={`# preset visual
position=top-left
font_size=20
background_alpha=0.4
round_corners=10

# métricas
fps
fps_color_change
frametime=1
frame_timing=1

# CPU/GPU
cpu_stats
cpu_temp
cpu_power
gpu_stats
gpu_temp
gpu_power
gpu_mem_clock
gpu_core_clock
vram
ram

# tempo dentro do jogo
time
time_format=%H:%M

# atalhos
toggle_hud=Shift_R+F12
toggle_logging=Shift_L+F2`}
      />

      <TerminalBlock
        comment="testar fora do Steam"
        command="mangohud glxgears"
        output={`(janela do glxgears com overlay no canto superior esquerdo)
GPU 1450MHz · 67% · 58°C · 142W
CPU @ 4.2GHz · 32% · 64°C · 48W
RAM 8.4G · VRAM 2.1G/12G
fps 12345 · 0.08ms`}
      />

      <p>
        Para usar no Steam, em launch options:
      </p>

      <CodeBlock code="mangohud gamemoderun %command%" />

      <p>
        <strong>goverlay</strong> é uma GUI para configurar MangoHud sem editar o conf à mão — tem
        preview em tempo real.
      </p>

      <h2>8. DXVK / VKD3D — o que faz Proton funcionar</h2>

      <p>
        Proton inclui <strong>DXVK</strong> (DirectX 9/10/11 → Vulkan) e <strong>VKD3D-Proton</strong>{" "}
        (DirectX 12 → Vulkan). Você raramente precisa pensar nisso, mas é útil saber:
      </p>

      <TerminalBlock
        comment="ver versão DXVK em uso por um jogo (com DXVK_HUD)"
        command="DXVK_HUD=devinfo,fps,version mangohud %command%"
      />

      <h2>9. Ajustes de kernel para gaming</h2>

      <CodeBlock
        title="/etc/sysctl.d/99-gaming.conf"
        code={`# evita o "OOM killer" travar o desktop por causa de jogo grande
vm.swappiness=10

# baixar latência de input
kernel.sched_autogroup_enabled=0

# memória virtual maior para Wine 64-bit
vm.max_map_count=2147483642`}
      />

      <TerminalBlock command="sudo sysctl --system" output="...applying 99-gaming.conf" />

      <AlertBox type="warning" title="vm.max_map_count alto é obrigatório">
        Jogos modernos (Star Citizen, Hogwarts Legacy, Cities Skylines 2) crasham com erro de
        <em> mmap</em> se <code>vm.max_map_count</code> estiver no default (65530). O valor acima é
        seguro e recomendado pela Steam Deck.
      </AlertBox>

      <h2>10. Kernel-zen — alternativa com tunes para latência</h2>

      <TerminalBlock
        command="sudo pacman -S linux-zen linux-zen-headers"
        output={`Packages (2) linux-zen-6.12.4.zen1-1  linux-zen-headers-6.12.4.zen1-1`}
      />

      <p>
        Adicione na config do GRUB / systemd-boot e reinicie escolhendo a entrada
        <em> linux-zen</em>. Trade-off: ~5% mais throughput em jogos, possível instabilidade em alguns
        drivers proprietários.
      </p>

      <h2>11. Heroic Games Launcher — Epic + GOG + Amazon nativo</h2>

      <TerminalBlock
        command="yay -S heroic-games-launcher-bin"
        output={`==> Making package: heroic-games-launcher-bin 2.15.2-1
:: (1/1) Installing heroic-games-launcher-bin...`}
      />

      <p>
        Funciona melhor que Lutris para Epic e GOG porque conversa direto com a API oficial e
        deixa baixar o Proton-GE de dentro do app.
      </p>

      <h2>12. Bottles — gerenciar prefixos Wine como containers</h2>

      <TerminalBlock command="flatpak install flathub com.usebottles.bottles" />

      <p>
        Pra rodar um .exe avulso (instalador, app antigo), Bottles é o caminho moderno. Cria
        prefixos isolados com runner Wine ou Proton de sua escolha.
      </p>

      <h2>13. Anti-cheat — o ponto sensível</h2>

      <OutputBlock
        title="status atual de anti-cheats no Linux"
        output={`✓ EAC (Easy Anti-Cheat)        suporta Proton SE habilitado pelo dev
✓ BattlEye                     suporta Proton SE habilitado pelo dev
✗ Vanguard (Valorant)          NÃO funciona (kernel-level, Riot bloqueia)
✗ Ricochet (Call of Duty)      NÃO funciona (kernel-level)
✗ Roblox Hyperion              NÃO funciona desde out/2024
✓ FACEIT/ESEA                  funciona em alguns jogos
↺ checar areweanticheatyet.com antes de comprar`}
      />

      <h2>14. Resumo prático</h2>

      <OutputBlock
        title="setup gaming completo"
        output={`# 1. multilib em /etc/pacman.conf, depois:
sudo pacman -Syu

# 2. driver (NVIDIA exemplo)
sudo pacman -S nvidia nvidia-utils lib32-nvidia-utils nvidia-settings

# 3. stack
sudo pacman -S steam lutris wine winetricks gamemode lib32-gamemode mangohud lib32-mangohud goverlay
yay -S protonup-qt heroic-games-launcher-bin

# 4. tunes
sudo sysctl -w vm.max_map_count=2147483642

# 5. nas opções de cada jogo (Steam → Properties)
gamemoderun mangohud %command%

# 6. Force Proton-GE (Properties → Compatibility)`}
      />

      <AlertBox type="success" title="Já era para você estar jogando">
        Com tudo acima, jogos AAA modernos rodam com 90-100% do FPS do Windows na mesma máquina.
        Casos de teste: Cyberpunk 2077, Elden Ring, Baldur's Gate 3, Helldivers 2 — todos funcionam
        com Proton Experimental ou Proton-GE.
      </AlertBox>
    </PageContainer>
  );
}
