import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";

export default function PrimeirosPassos() {
  return (
    <PageContainer
      title="Primeiros Passos Pós-Instalação"
      subtitle="Você acabou de logar pela primeira vez. Vamos transformar esse terminal preto em uma estação de trabalho funcional."
      difficulty="iniciante"
      timeToRead="35 min"
      category="Instalação"
    >
      <p>
        Logou no Arch e vê só um cursor piscando? Ótimo. Significa que nada está rodando além do
        essencial. Esse guia vai do <em>tty1</em> ao desktop em poucas etapas.
      </p>

      <AlertBox type="warning" title="Ordem importa">
        Conecte internet → atualize o sistema → instale o resto. Não pule etapas.
      </AlertBox>

      <h2>1. Internet</h2>

      <h3>Cabo (DHCP automático com NetworkManager)</h3>

      <TerminalBlock
        command="ping -c 3 archlinux.org"
        output={`PING archlinux.org (95.217.163.246) 56(84) bytes of data.
64 bytes from archlinux.org: icmp_seq=1 ttl=47 time=142 ms
64 bytes from archlinux.org: icmp_seq=2 ttl=47 time=141 ms
64 bytes from archlinux.org: icmp_seq=3 ttl=47 time=141 ms

--- archlinux.org ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 141.123/141.444/142.456/0.567 ms`}
        comment="se receber resposta, está online"
      />

      <h3>Wi-Fi com nmcli (sucessor do iwctl no sistema instalado)</h3>

      <TerminalBlock
        command="nmcli device wifi list"
        output={`IN-USE  BSSID              SSID            MODE   CHAN  RATE        SIGNAL  BARS  SECURITY
        a4:c3:f0:11:22:33  MinhaCasa_5G    Infra  149   540 Mbit/s  {g}88{/}      {g}▂▄▆█{/}  WPA2
        a4:c3:f0:44:55:66  VivoFibra-1234  Infra  6     270 Mbit/s  {y}54{/}      {y}▂▄▆_{/}  WPA2
        b8:27:eb:77:88:99  Vizinho         Infra  11    144 Mbit/s  {y}38{/}      {y}▂▄__{/}  WPA2`}
      />

      <TerminalBlock
        command='nmcli device wifi connect "MinhaCasa_5G" password "minha_senha"'
        output={`Device 'wlan0' successfully activated with '5f3e9c2a-8b1d-4f6e-9c2a-8b1d4f6e9c2a'.`}
      />

      <TerminalBlock
        command="nmcli connection show"
        output={`NAME            UUID                                  TYPE      DEVICE
MinhaCasa_5G    5f3e9c2a-8b1d-4f6e-9c2a-8b1d4f6e9c2a  wifi      wlan0
lo              00000000-0000-0000-0000-000000000000  loopback  lo`}
      />

      <CommandFlagList
        command="nmcli"
        items={[
          { flag: "device wifi list", description: "lista redes detectadas (faz scan automático)" },
          { flag: "device wifi connect SSID password SENHA", description: "conecta a uma rede WPA2 em uma linha" },
          { flag: "connection show", description: "lista conexões salvas" },
          { flag: "connection up NOME", description: "reativa uma conexão salva" },
          { flag: "connection delete NOME", description: "remove uma conexão salva" },
          { flag: "general status", description: "estado geral (conectado/desconectado, DNS, etc.)" },
          { flag: "device status", description: "estado de cada interface de rede" },
        ]}
      />

      <h2>2. Atualizar tudo</h2>

      <TerminalBlock
        command="sudo pacman -Syu"
        output={`[sudo] password for joao:
{c}::{/} Synchronizing package databases...
 core              130.5 KiB  2.31 MiB/s 00:00 [############] 100%
 extra               8.2 MiB  11.4 MiB/s 00:01 [############] 100%
 multilib          182.6 KiB  3.01 MiB/s 00:00 [############] 100%
{c}::{/} Starting full system upgrade...
resolving dependencies...
looking for conflicting packages...

Packages (12) base-3-2  bash-5.2.026-2  glibc-2.39-5  linux-6.8.7.arch1-1
              linux-firmware-20240410-1  pacman-6.1.0-3  systemd-255.4-1
              ...

Total Download Size:    98.42 MiB
Total Installed Size:   312.51 MiB
Net Upgrade Size:        12.83 MiB

:: Proceed with installation? [Y/n] {g}Y{/}
(12/12) checking keys in keyring                            [############] 100%
(12/12) checking package integrity                          [############] 100%
(12/12) loading package files                               [############] 100%
(12/12) checking for file conflicts                         [############] 100%
(12/12) checking available disk space                       [############] 100%
:: Processing package changes...
(  1/12) upgrading base                                     [############] 100%
... (11 outros) ...
:: Running post-transaction hooks...
(1/5) Reloading system manager configuration...
(2/5) Updating module dependencies...
(3/5) Updating linux initcpios...
(4/5) Arming ConditionNeedsUpdate...
(5/5) Updating the info directory file...`}
      />

      <CommandFlagList
        command="pacman"
        items={[
          { flag: "-S", long: "--sync", description: "operação de sincronização (instalar/atualizar a partir de repos)" },
          { flag: "-y", long: "--refresh", description: "atualiza o banco de dados local dos repositórios" },
          { flag: "-yy", description: "FORÇA re-sincronização (mesmo que esteja atualizado)" },
          { flag: "-u", long: "--sysupgrade", description: "atualiza todos os pacotes que têm versão nova" },
          { flag: "-w", long: "--downloadonly", description: "só baixa, não instala", example: "sudo pacman -Syuw" },
        ]}
      />

      <AlertBox type="danger" title="NUNCA rode -Sy sem -u">
        <code>pacman -Sy pacote</code> deixa o banco apontando para versões novas, mas mantém o
        sistema antigo. Isso é o famoso <em>partial upgrade</em> — quebra o sistema. Sempre use
        <code> -Syu</code> junto.
      </AlertBox>

      <h2>3. Otimizar mirrors com reflector</h2>

      <TerminalBlock
        command="sudo pacman -S reflector"
        output={`resolving dependencies...
Packages (1) reflector-2023.06.05.0.0a3a3a-3
Total Installed Size:  0.30 MiB
:: Proceed with installation? [Y/n] Y
(1/1) installing reflector  [############] 100%`}
      />

      <TerminalBlock
        command="sudo cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.bak"
        output=""
        comment="sempre faça backup antes de mexer em mirrorlist"
      />

      <TerminalBlock
        command="sudo reflector --country Brazil --age 12 --protocol https --sort rate --save /etc/pacman.d/mirrorlist"
        output={`[2024-04-17 12:30:01] INFO: rating 25 mirrors, this may take some time..
[2024-04-17 12:30:48] INFO: retrieved status for 25 mirrors
[2024-04-17 12:30:48] INFO: writing mirrorlist to '/etc/pacman.d/mirrorlist'`}
      />

      <TerminalBlock
        command="head -10 /etc/pacman.d/mirrorlist"
        output={`################################################################################
################# Arch Linux mirrorlist generated by Reflector #################
################################################################################

# With:       reflector --country Brazil --age 12 --protocol https --sort rate
# When:       2024-04-17 12:30:48 UTC
# From:       https://archlinux.org/mirrors/status/json/

Server = https://archlinux.c3sl.ufpr.br/$repo/os/$arch
Server = https://br.mirror.archlinux-br.org/$repo/os/$arch`}
      />

      <CommandFlagList
        command="reflector"
        items={[
          { flag: "--country", description: "filtra por país (use o nome em inglês: 'Brazil', 'United States')" },
          { flag: "--age N", description: "só mirrors atualizados nas últimas N horas" },
          { flag: "--protocol", description: "https | http | rsync | ftp" },
          { flag: "--sort", description: "rate (velocidade) | age (mais recente) | score (combinado) | delay" },
          { flag: "--latest N", description: "limita aos N mirrors mais recentes" },
          { flag: "--save FILE", description: "grava no arquivo (precisa de sudo p/ /etc/pacman.d/mirrorlist)" },
        ]}
      />

      <h2>4. Tunar o pacman.conf</h2>

      <TerminalBlock
        command="sudo nano /etc/pacman.conf"
        output={`# Descomente estas linhas em [options]:
Color
ILoveCandy        # ← adicione esta logo abaixo de Color (Pac-Man na barra de progresso)
VerbosePkgLists
ParallelDownloads = 5

# E habilite o repo multilib se você quer rodar apps 32-bits (Steam, Wine, etc.):
[multilib]
Include = /etc/pacman.d/mirrorlist`}
      />

      <TerminalBlock
        command="sudo pacman -Sy"
        output={`{c}::{/} Synchronizing package databases...
 core             130.5 KiB  2.31 MiB/s 00:00 [############] 100%
 extra              8.2 MiB  11.4 MiB/s 00:01 [############] 100%
 multilib         182.6 KiB  3.01 MiB/s 00:00 [############] 100%`}
        comment="agora multilib aparece na lista"
      />

      <h2>5. Pacotes essenciais</h2>

      <TerminalBlock
        command={"sudo pacman -S base-devel git vim nano htop btop wget curl \\\n  man-db man-pages bash-completion openssh \\\n  usbutils pciutils bluez bluez-utils \\\n  unzip p7zip zip unrar"}
        output={`resolving dependencies...
Packages (32) base-devel-1-2  git-2.44.0-1  vim-9.1.0331-1  htop-3.3.0-1
              btop-1.3.2-1  wget-1.24.5-2  curl-8.7.1-1  man-db-2.12.1-1
              man-pages-6.7-1  bash-completion-2.11-3  openssh-9.7p1-1
              ...

Total Download Size:    87.42 MiB
Total Installed Size:   312.51 MiB

:: Proceed with installation? [Y/n] Y`}
      />

      <OutputBlock
        title="o que cada pacote te dá"
        output={`base-devel       gcc, make, automake, fakeroot — necessário p/ AUR
git              clonar repos, controle de versão
vim / nano       editores no terminal (nano = fácil, vim = poderoso)
htop / btop      monitores interativos (CPU, RAM, processos)
wget / curl      baixar arquivos / falar com APIs
man-db           sistema de manuais (man pacman, man systemd...)
bash-completion  TAB autocompleta comandos, flags, argumentos
openssh          cliente + servidor SSH
usbutils         lsusb (lista USB)
pciutils         lspci (lista PCI: GPU, rede, áudio)
bluez(-utils)    stack Bluetooth + bluetoothctl
unzip / p7zip    descompactar zip e 7z`}
        annotations={[
          { line: 0, note: "obrigatório para AUR" },
          { line: 4, note: "btop é mais bonito" },
          { line: 6, note: "instale SEMPRE" },
        ]}
      />

      <h2>6. Habilitar serviços úteis</h2>

      <TerminalBlock
        command="sudo systemctl enable --now bluetooth"
        output={`Created symlink /etc/systemd/system/dbus-org.bluez.service → /usr/lib/systemd/system/bluetooth.service.
Created symlink /etc/systemd/system/bluetooth.target.wants/bluetooth.service → /usr/lib/systemd/system/bluetooth.service.`}
      />

      <TerminalBlock
        command="sudo systemctl enable --now sshd"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/sshd.service → /usr/lib/systemd/system/sshd.service.`}
      />

      <TerminalBlock
        command="systemctl status sshd"
        output={`● sshd.service - OpenSSH Daemon
     Loaded: loaded (/usr/lib/systemd/system/sshd.service; {g}enabled{/}; preset: disabled)
     Active: {g}active (running){/} since Wed 2024-04-17 12:35:01 -03; 14s ago
   Main PID: 1342 (sshd)
      Tasks: 1 (limit: 9387)
     Memory: 1.4M (peak: 1.6M)
        CPU: 23ms
     CGroup: /system.slice/sshd.service
             └─1342 "sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups"

Apr 17 12:35:01 meu-arch systemd[1]: Started OpenSSH Daemon.
Apr 17 12:35:01 meu-arch sshd[1342]: Server listening on 0.0.0.0 port 22.
Apr 17 12:35:01 meu-arch sshd[1342]: Server listening on :: port 22.`}
      />

      <h2>7. Driver de vídeo</h2>

      <TerminalBlock
        command="lspci | grep -E 'VGA|3D'"
        output={`00:02.0 VGA compatible controller: Intel Corporation Alder Lake-P GT2 [Iris Xe Graphics] (rev 0c)
01:00.0 3D controller: NVIDIA Corporation GA107M [GeForce RTX 3050 Mobile] (rev a1)`}
        comment="híbrido Intel + NVIDIA — caso típico de notebook"
      />

      <TerminalBlock
        command="sudo pacman -S mesa intel-media-driver vulkan-intel"
        output={`Packages (3) intel-media-driver-24.1.5-1  mesa-1:24.0.5-1  vulkan-intel-1:24.0.5-1
Total Download Size:   76.18 MiB
:: Proceed with installation? [Y/n] Y`}
      />

      <p>Para AMD: <code>mesa xf86-video-amdgpu vulkan-radeon</code>. Para NVIDIA proprietário:</p>

      <TerminalBlock
        command="sudo pacman -S nvidia nvidia-utils nvidia-settings"
        output={`Packages (3) nvidia-550.67-12  nvidia-utils-550.67-2  nvidia-settings-550.67-1
Total Download Size:    298.42 MiB
:: Proceed with installation? [Y/n] Y`}
      />

      <h2>8. Yay (helper de AUR)</h2>

      <TerminalBlock
        lines={[
          { type: "command", text: "cd /tmp" },
          { type: "command", text: "git clone https://aur.archlinux.org/yay.git" },
          { type: "output", text: `Cloning into 'yay'...
remote: Enumerating objects: 25, done.
remote: Counting objects: 100% (25/25), done.
Receiving objects: 100% (25/25), 6.42 KiB, done.` },
          { type: "command", text: "cd yay && makepkg -si" },
          { type: "output", text: `==> Making package: yay 12.4.2-1
==> Checking runtime dependencies...
==> Checking buildtime dependencies...
==> Retrieving sources...
==> Validating source files with sha256sums...
==> Extracting sources...
==> Starting build()...
==> Entering fakeroot environment...
==> Tidying install...
==> Creating package "yay"...
==> Finished making: yay 12.4.2-1
[sudo] password for joao:
loading packages...
:: Proceed with installation? [Y/n] Y
(1/1) installing yay  [############] 100%` }
        ]}
      />

      <TerminalBlock
        command="yay -Y --gendb && yay -Y --devel --save"
        output={`==> Generating devel database...
==> Saved settings`}
        comment="diz ao yay para rastrear versões -git/-svn dos pacotes AUR"
      />

      <h2>9. Próximos passos</h2>
      <p>
        Agora você tem um sistema funcional via terminal. Para um ambiente gráfico, vá para
        <strong> Ambiente Gráfico</strong>. Para começar a explorar comandos, vá para
        <strong> Navegação</strong>. Para entender pacman a fundo, vá para <strong>Pacman</strong>.
      </p>

      <AlertBox type="success" title="Bom trabalho!">
        Você passou da ISO ao sistema instalado, conectado, atualizado e com mirrors otimizados.
        O resto é detalhe.
      </AlertBox>
    </PageContainer>
  );
}
