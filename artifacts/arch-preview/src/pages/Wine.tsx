import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Wine() {
  return (
    <PageContainer
      title="Wine — rodando aplicativos Windows no Arch"
      subtitle="Instalação com multilib, configuração de prefixes, winetricks, Lutris, Bottles, e como rodar .exe nativamente sem reboot."
      difficulty="intermediario"
      timeToRead="30 min"
      category="Compatibilidade"
    >
      <p>
        <strong>Wine</strong> (Wine Is Not an Emulator) é uma camada de compatibilidade que
        traduz chamadas Win32/Win64 para chamadas POSIX em tempo real. Não é um emulador —
        executa binários Windows diretamente. No Arch é trivial instalar, mas você precisa
        habilitar o repositório <code>multilib</code> primeiro (para libs 32-bit).
      </p>

      <AlertBox type="info" title="Wine, Proton ou Bottles?">
        <strong>Wine</strong> = base. <strong>Proton</strong> = fork da Valve com patches para
        jogos (DXVK, VKD3D, Esync). <strong>Bottles</strong> = GUI moderna que gerencia
        múltiplos prefixes com Wine ou Proton. <strong>Lutris</strong> = lançador de jogos com
        scripts comunitários. Para aplicativos de produtividade, use Wine puro.
      </AlertBox>

      <h2>1. Habilitando multilib (libs 32-bit)</h2>

      <TerminalBlock
        comment="muitos .exe ainda são 32-bit; o Wine precisa de libs 32-bit"
        command="sudo nano /etc/pacman.conf"
        output=""
      />

      <p>Descomente as duas linhas do bloco <code>[multilib]</code>:</p>

      <CodeBlock
        title="/etc/pacman.conf — habilite multilib"
        code={`[multilib]
Include = /etc/pacman.d/mirrorlist`}
      />

      <TerminalBlock
        command="sudo pacman -Syu"
        output={`:: Synchronizing package databases...
 core                    132.4 KiB  ...
 extra                  8.4 MiB  ...
 multilib              188.7 KiB  ...
:: Starting full system upgrade...
 there is nothing to do`}
      />

      <h2>2. Instalando Wine</h2>

      <TerminalBlock
        comment="wine puro + winetricks (helper) + dependências comuns p/ jogos e DirectX"
        command={`sudo pacman -S wine wine-mono wine-gecko winetricks \\
  lib32-mesa vulkan-icd-loader lib32-vulkan-icd-loader \\
  lib32-alsa-plugins lib32-libpulse lib32-openal \\
  lib32-libxcomposite lib32-libxinerama lib32-gnutls lib32-gst-plugins-base-libs`}
        output={`resolving dependencies...
looking for conflicting packages...

Packages (24) wine-9.18-1  wine-mono-9.4.0-1  wine-gecko-2.47.4-1
              winetricks-20240105-2  lib32-mesa-1:24.2.5-1 ...

Total Installed Size:   612.4 MiB

:: Proceed with installation? [Y/n] y`}
      />

      <OutputBlock
        title="o que cada pacote faz"
        output={`wine                 a engine principal
wine-mono            implementação .NET para apps que precisam
wine-gecko           HTML rendering interno (substitui IE)
winetricks           script p/ instalar runtimes Windows (vcrun, dotnet, ...)
lib32-mesa           OpenGL 32-bit
lib32-vulkan-*       Vulkan 32-bit (DXVK, VKD3D)
lib32-alsa/pulse     audio 32-bit
lib32-libxinerama    multi-monitor
lib32-gnutls         TLS para apps que fazem HTTPS`}
      />

      <h2>3. Confirmando instalação</h2>

      <TerminalBlock
        command="wine --version"
        output={`wine-9.18`}
      />

      <TerminalBlock
        command="winecfg"
        output={`(abre janela de configuração do Wine)`}
      />

      <p>
        Na primeira execução, o Wine cria o <strong>prefix padrão</strong> em{" "}
        <code>~/.wine/</code> — um diretório que simula uma instalação Windows completa, com{" "}
        <code>drive_c/</code>, registry, etc.
      </p>

      <h2>4. Anatomia de um Wine prefix</h2>

      <TerminalBlock
        command="ls -la ~/.wine/"
        output={`total 24
drwxr-xr-x 4 user user 4096 Mar 20 16:42 .
drwxr-xr-x 38 user user 4096 Mar 20 16:42 ..
drwxr-xr-x 4 user user 4096 Mar 20 16:42 dosdevices
drwxr-xr-x 6 user user 4096 Mar 20 16:42 drive_c
-rw-r--r-- 1 user user  166 Mar 20 16:42 system.reg
-rw-r--r-- 1 user user 1842 Mar 20 16:42 user.reg
-rw-r--r-- 1 user user  486 Mar 20 16:42 userdef.reg`}
      />

      <TerminalBlock
        command="ls ~/.wine/drive_c/"
        output={`'Program Files'  'Program Files (x86)'   ProgramData   users  windows`}
      />

      <h3>Múltiplos prefixes (recomendado)</h3>

      <p>
        Use <strong>um prefix por aplicativo</strong>: se um Office quebrar, não derruba seu
        Photoshop. Defina <code>WINEPREFIX</code>:
      </p>

      <TerminalBlock
        comment="cria prefix novo (32-bit, mais compatível com apps antigos)"
        command="WINEPREFIX=~/.wine-office WINEARCH=win32 winecfg"
        output={`wine: created the configuration directory '/home/user/.wine-office'
wine: configuration in L"/home/user/.wine-office" has been updated.`}
      />

      <TerminalBlock
        command="ls ~/.wine-office/drive_c/"
        output={`'Program Files'   ProgramData   users   windows`}
      />

      <h2>5. winecfg — versão do Windows, libs, drives</h2>

      <p>
        A janela <code>winecfg</code> tem 8 abas. As mais usadas:
      </p>

      <OutputBlock
        title="Abas do winecfg"
        output={`Applications     escolhe a versão do Windows simulada (XP, 7, 10, 11)
Libraries        força DLL: nativa (do Windows) vs builtin (do Wine)
Graphics         habilita DXVA, screen size virtual
Drives           mapeia letras de unidade Windows ↔ paths Linux
Audio            seleciona driver (PulseAudio, ALSA)
Theme            aparência das janelas
Staging          features experimentais (CSMT)
About            versão`}
      />

      <h2>6. Rodando aplicativos</h2>

      <TerminalBlock
        comment="copia o instalador para a unidade C: do prefix"
        command="cp ~/Downloads/notepad++.exe ~/.wine/drive_c/users/$USER/Desktop/"
        output=""
      />

      <TerminalBlock
        comment="executa direto (Wine cria atalhos automaticamente)"
        command="wine ~/Downloads/npp.8.7.Installer.x64.exe"
        output={`002c:fixme:advapi:RegisterTraceGuidsW (...) stub
002c:fixme:bcrypt:BCryptOpenAlgorithmProvider unsupported algorithm L"AES"
0048:fixme:winediag:loader_init wine-mono is not installed
(janela do instalador do Notepad++ abre)`}
      />

      <TerminalBlock
        comment="depois de instalado, rode pelo path completo"
        command={`wine "C:\\Program Files\\Notepad++\\notepad++.exe"`}
        output=""
      />

      <h3>Em outro prefix</h3>

      <TerminalBlock
        command={`WINEPREFIX=~/.wine-office wine ~/Downloads/word_setup.exe`}
        output=""
      />

      <h2>7. winetricks — runtime Windows em 1 comando</h2>

      <p>
        <code>winetricks</code> é um script comunitário que instala dependências comuns:
        Visual C++ Runtime, .NET Framework, DirectX, fontes, codecs. Salva muito tempo.
      </p>

      <CommandFlagList
        command="winetricks"
        items={[
          { flag: "list-all", description: "Lista TODOS os componentes disponíveis (centenas)." },
          { flag: "list-installed", description: "Mostra o que já está no prefix atual." },
          { flag: "vcrun2019", description: "Visual C++ Redistributable 2015–2019.", example: "winetricks vcrun2019" },
          { flag: "dotnet48", description: ".NET Framework 4.8.", example: "winetricks dotnet48" },
          { flag: "corefonts", description: "Fontes core do Windows (Arial, Times)." },
          { flag: "dxvk", description: "Camada DXVK (DirectX 9/10/11 → Vulkan, performance gamer)." },
          { flag: "d3dcompiler_47", description: "DLL D3D necessária para muitos jogos modernos." },
          { flag: "win10 / win7", description: "Muda versão do Windows simulada (alias de winecfg)." },
          { flag: "--gui", description: "Abre interface gráfica zenity." },
        ]}
      />

      <TerminalBlock
        command="WINEPREFIX=~/.wine-game winetricks --no-isolate vcrun2019 dxvk corefonts"
        output={`Executing w_do_call vcrun2019
------------------------------------------------------
Downloading https://aka.ms/vs/16/release/vc_redist.x64.exe to ...
[####################################] 100%
Executing wine vc_redist.x64.exe /q /norestart
------------------------------------------------------
Executing w_do_call dxvk
Setting up DXVK 2.4.1 ...
   d3d9.dll, d3d10core.dll, d3d11.dll, dxgi.dll  →  builtin
Executing w_do_call corefonts
Installing corefonts ... (Andale Mono, Arial, Comic Sans, ...)
done.`}
      />

      <h2>8. Lutris — front-end para jogos</h2>

      <TerminalBlock
        command="sudo pacman -S lutris"
        output={`Packages (1) lutris-0.5.18-1
Total Installed Size:  18.74 MiB
:: Proceed with installation? [Y/n] y`}
      />

      <p>
        Lutris baixa "scripts de instalação" (cookies prontos) para jogos como Battle.net,
        Epic, Steam Windows, GOG. Cada jogo fica em seu próprio prefix com a versão certa de
        Wine/Proton.
      </p>

      <TerminalBlock
        comment="abre a GUI"
        command="lutris &"
        output=""
      />

      <h2>9. Bottles — alternativa moderna (Flatpak)</h2>

      <TerminalBlock
        command="flatpak install flathub com.usebottles.bottles"
        output={`Looking for matches…
com.usebottles.bottles permissions:
    ipc, network, pulseaudio, wayland, x11, devices=all,
    file access [4], dbus access [3]

        ID                          Branch        Op
 1.     com.usebottles.bottles      stable        i

Proceed with these changes to the user installation? [Y/n]: y`}
      />

      <p>
        Bottles isola tudo via Flatpak e oferece "ambientes" pré-configurados para Gaming,
        Software ou Custom. Ideal para quem não quer mexer em <code>winecfg</code>/winetricks.
      </p>

      <h2>10. Esync, Fsync e DXVK — performance gamer</h2>

      <CodeBlock
        title="variáveis de ambiente úteis"
        code={`# Esync (sincronização rápida via eventfd) — quase sempre on
WINEESYNC=1 wine app.exe

# Fsync (ainda mais rápido, precisa kernel >= 5.16) — Arch tem
WINEFSYNC=1 wine game.exe

# Forçar versão do Windows
WINEPREFIX=~/.wine-x WINE=wine WINEARCH=win64 wine setup.exe

# Mostrar mais logs
WINEDEBUG=+all wine app.exe 2> wine.log

# Silenciar fixme spam (recomendado)
WINEDEBUG=fixme-all wine app.exe`}
      />

      <h2>11. Desinstalando aplicativos</h2>

      <TerminalBlock
        command="wine uninstaller"
        output={`(abre janela "Add/Remove Programs" do Wine)`}
      />

      <TerminalBlock
        comment="remove um prefix inteiro"
        command="rm -rf ~/.wine-office"
        output=""
      />

      <AlertBox type="warning" title="NUNCA rode wine como root">
        <code>sudo wine instalador.exe</code> dá ao .exe acesso de root ao seu sistema.
        Sempre rode como usuário normal — o prefix é dentro do <code>~/</code> e não precisa
        de privilégio.
      </AlertBox>

      <h2>12. Casos comuns</h2>

      <CodeBlock
        title="Notepad++"
        code={`wine ~/Downloads/npp.8.7.Installer.x64.exe
# depois:
wine ~/.wine/drive_c/Program\\ Files/Notepad++/notepad++.exe`}
      />

      <CodeBlock
        title="Microsoft Office 2010 (prefixo isolado)"
        code={`WINEPREFIX=~/.wine-office WINEARCH=win32 winecfg   # criar prefix 32-bit
WINEPREFIX=~/.wine-office winetricks corefonts msxml6 riched20 vcrun2010
WINEPREFIX=~/.wine-office wine setup.exe`}
      />

      <CodeBlock
        title="Steam (Windows) via Lutris"
        code={`# Ou — para Steam Linux nativo:
sudo pacman -S steam   # já roda jogos Windows via Proton

# Para Steam para Windows (raro): use Lutris e procure 'Steam Windows'.`}
      />

      <h2>13. Cola visual</h2>

      <OutputBlock
        title="comandos do dia-a-dia"
        output={`wine app.exe                          executa
wine64 app.exe                        força 64-bit
WINEPREFIX=~/.wine-x wine app.exe     prefix isolado
winecfg                               GUI de config do prefix
winetricks <pkg>                      instala runtime
wine uninstaller                      remove apps
WINEDEBUG=fixme-all wine app          silencia warnings
killall wineserver                    mata tudo (último recurso)
rm -rf ~/.wine                        recomeçar do zero`}
      />
    </PageContainer>
  );
}
