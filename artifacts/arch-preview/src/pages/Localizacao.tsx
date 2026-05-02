import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Localizacao() {
  return (
    <PageContainer
      title="Localização — locale, teclado, hostname e relógio"
      subtitle="locale.conf, locale-gen, /etc/vconsole.conf, /etc/hostname, hwclock e timedatectl. Tudo o que define a 'identidade regional' do seu Arch."
      difficulty="intermediario"
      timeToRead="35 min"
      category="Sistema"
    >
      <p>
        Logo após o <code>pacstrap</code>, todo Arch precisa ser localizado: idioma das mensagens
        (<em>locale</em>), layout do teclado no console TTY, hostname, fuso horário e configuração
        do relógio de hardware. Esta página percorre cada arquivo e cada comando, com saída real.
      </p>

      <h2>1. Locale — idioma e formatação numérica/data</h2>

      <p>
        Um <strong>locale</strong> dita o idioma das mensagens, formato de números, datas, ordem
        alfabética e codificação de caracteres. No Arch eles vêm desligados — você habilita os que
        quer em <code>/etc/locale.gen</code> e gera com <code>locale-gen</code>.
      </p>

      <TerminalBlock
        comment="ver os locales atualmente compilados"
        command="locale -a"
        output={`C
C.UTF-8
POSIX
en_US.utf8
pt_BR.utf8`}
      />

      <h3>Habilitar mais locales</h3>

      <TerminalBlock
        comment="descomente as linhas que quer no /etc/locale.gen"
        command="sudo nano /etc/locale.gen"
      />

      <CodeBlock
        title="/etc/locale.gen (trecho relevante)"
        code={`#en_AU.UTF-8 UTF-8
#en_BW.UTF-8 UTF-8
en_US.UTF-8 UTF-8
#en_US ISO-8859-1
pt_BR.UTF-8 UTF-8
#pt_PT.UTF-8 UTF-8
#es_ES.UTF-8 UTF-8`}
      />

      <TerminalBlock
        command="sudo locale-gen"
        output={`Generating locales...
  en_US.UTF-8... done
  pt_BR.UTF-8... done
Generation complete.`}
      />

      <h3>/etc/locale.conf — locale do sistema</h3>

      <TerminalBlock
        comment="forma manual"
        command={`echo 'LANG=pt_BR.UTF-8' | sudo tee /etc/locale.conf`}
        output="LANG=pt_BR.UTF-8"
      />

      <TerminalBlock
        comment="forma idempotente via localectl (recomendada)"
        command="sudo localectl set-locale LANG=pt_BR.UTF-8"
      />

      <TerminalBlock command="cat /etc/locale.conf" output="LANG=pt_BR.UTF-8" />

      <p>
        Após reabrir a sessão, <code>locale</code> mostra os valores ativos:
      </p>

      <TerminalBlock
        command="locale"
        output={`LANG=pt_BR.UTF-8
LC_CTYPE="pt_BR.UTF-8"
LC_NUMERIC="pt_BR.UTF-8"
LC_TIME="pt_BR.UTF-8"
LC_COLLATE="pt_BR.UTF-8"
LC_MONETARY="pt_BR.UTF-8"
LC_MESSAGES="pt_BR.UTF-8"
LC_PAPER="pt_BR.UTF-8"
LC_NAME="pt_BR.UTF-8"
LC_ADDRESS="pt_BR.UTF-8"
LC_TELEPHONE="pt_BR.UTF-8"
LC_MEASUREMENT="pt_BR.UTF-8"
LC_IDENTIFICATION="pt_BR.UTF-8"
LC_ALL=`}
      />

      <CommandFlagList
        command="categorias LC_*"
        items={[
          { flag: "LANG", description: "Default p/ TODAS as outras categorias se elas não forem definidas." },
          { flag: "LC_MESSAGES", description: "Idioma das mensagens de programas." },
          { flag: "LC_TIME", description: "Formato de data/hora (date, ls -l)." },
          { flag: "LC_NUMERIC", description: "Separador decimal/milhar (1,234.56 vs 1.234,56)." },
          { flag: "LC_COLLATE", description: "Ordem alfabética em sort, ls." },
          { flag: "LC_MONETARY", description: "Símbolo de moeda e formato monetário." },
          { flag: "LC_ALL", description: "OVERRIDE forçado em todas (vale mais que LANG e LC_*). Use para 'forçar' algo." },
        ]}
      />

      <AlertBox type="info" title="Mensagens em inglês mas formato em PT-BR">
        Comum em programador: quer mensagens em inglês (mais googláveis) mas data/número em PT-BR.
        Combine: <code>LANG=pt_BR.UTF-8</code> + <code>LC_MESSAGES=en_US.UTF-8</code>.
      </AlertBox>

      <CodeBlock
        title="/etc/locale.conf — exemplo combinado"
        code={`LANG=pt_BR.UTF-8
LC_MESSAGES=en_US.UTF-8`}
      />

      <h3>localectl — ferramenta oficial do systemd</h3>

      <TerminalBlock
        command="localectl status"
        output={`   System Locale: LANG=pt_BR.UTF-8
                  LC_MESSAGES=en_US.UTF-8
       VC Keymap: br-abnt2
      X11 Layout: br
       X11 Model: pc105
     X11 Variant: abnt2`}
      />

      <TerminalBlock
        comment="lista todos os locales gerados"
        command="localectl list-locales"
        output={`C.UTF-8
en_US.UTF-8
pt_BR.UTF-8`}
      />

      <h2>2. Teclado no console (TTY)</h2>

      <p>
        Quando você está num TTY virtual (Ctrl+Alt+F2..F6), o Xorg/Wayland nem entrou — então o
        layout vem de <code>/etc/vconsole.conf</code> (lido pelo systemd-vconsole-setup). Para
        Xorg/Wayland o layout fica em <code>/etc/X11/xorg.conf.d/</code> ou nas configurações do DE.
      </p>

      <TerminalBlock
        command="localectl list-keymaps | grep ^br"
        output={`br-abnt
br-abnt2
br-latin1-abnt2
br-latin1-us
br-nodeadkeys`}
      />

      <TerminalBlock
        comment="aplica imediatamente E persiste em /etc/vconsole.conf"
        command="sudo localectl set-keymap br-abnt2"
      />

      <TerminalBlock
        command="cat /etc/vconsole.conf"
        output={`KEYMAP=br-abnt2
FONT=ter-v18n`}
      />

      <CommandFlagList
        command="/etc/vconsole.conf"
        items={[
          { flag: "KEYMAP=", description: "Layout do teclado no TTY (br-abnt2, us, us-acentos, dvorak...)." },
          { flag: "FONT=", description: "Fonte do TTY (em /usr/share/kbd/consolefonts). Maior = legível em 4K (ter-v32n).", example: "FONT=ter-v32n" },
          { flag: "FONT_MAP=", description: "Mapeamento de caracteres (raramente necessário com UTF-8)." },
          { flag: "KEYMAP_TOGGLE=", description: "Layout secundário trocável com Ctrl+Alt+barra-de-espaço." },
        ]}
      />

      <TerminalBlock
        comment="testar momentaneamente (não persiste)"
        command="sudo loadkeys br-abnt2"
      />

      <h3>Layout do teclado no Xorg/Wayland</h3>

      <TerminalBlock
        comment="aplica para X (e persiste). Para Wayland, depende do DE/compositor."
        command="sudo localectl set-x11-keymap br pc105 abnt2"
      />

      <TerminalBlock command="cat /etc/X11/xorg.conf.d/00-keyboard.conf" output={`# Written by systemd-localed(8), read by systemd-localed and Xorg. It's
# probably wise not to edit this file manually. Use localectl(1) to
# update this file.
Section "InputClass"
        Identifier "system-keyboard"
        MatchIsKeyboard "on"
        Option "XkbLayout" "br"
        Option "XkbModel" "pc105"
        Option "XkbVariant" "abnt2"
EndSection`} />

      <h2>3. Hostname</h2>

      <p>
        O systemd entende <strong>três tipos</strong>: <code>static</code> (em{" "}
        <code>/etc/hostname</code>, persistente), <code>pretty</code> (rótulo bonito UTF-8) e{" "}
        <code>transient</code> (vindo do DHCP).
      </p>

      <TerminalBlock command="cat /etc/hostname" output="archlinux" />

      <TerminalBlock
        comment="forma manual"
        command={`echo 'maquina-do-joao' | sudo tee /etc/hostname`}
        output="maquina-do-joao"
      />

      <TerminalBlock
        comment="forma recomendada — atualiza tudo de uma vez"
        command={`sudo hostnamectl set-hostname maquina-do-joao`}
      />

      <TerminalBlock
        command="hostnamectl"
        output={`   Static hostname: maquina-do-joao
         Icon name: computer-laptop
           Chassis: laptop 💻
        Machine ID: 8c2b1d4a0e5a4f229a3e4f6e8e3b7c11
           Boot ID: e9b2f4a1c7d8e3b5a8a1c4d6f2e9b7c5
  Operating System: Arch Linux
            Kernel: Linux 6.12.1-arch1-1
      Architecture: x86-64
   Hardware Vendor: Dell Inc.
    Hardware Model: Latitude 5430`}
      />

      <h3>/etc/hosts — resolução local</h3>

      <CodeBlock
        title="/etc/hosts (recomendado)"
        code={`127.0.0.1   localhost
::1         localhost
127.0.1.1   maquina-do-joao.localdomain  maquina-do-joao`}
      />

      <AlertBox type="warning" title="A linha 127.0.1.1 é importante">
        Sem ela, alguns programas (sudo, DNS reverso) demoram porque tentam resolver o hostname e
        recebem timeout. <code>127.0.1.1</code> é o atalho convencional para "esta máquina".
      </AlertBox>

      <h2>4. Fuso horário</h2>

      <TerminalBlock
        command="timedatectl list-timezones | grep -i sao_paulo"
        output={`America/Sao_Paulo`}
      />

      <TerminalBlock
        command="sudo timedatectl set-timezone America/Sao_Paulo"
      />

      <TerminalBlock command="ls -l /etc/localtime" output={`lrwxrwxrwx 1 root root 36 Mar 26 09:00 /etc/localtime -> /usr/share/zoneinfo/America/Sao_Paulo`} />

      <TerminalBlock
        command="timedatectl"
        output={`               Local time: Fri 2026-03-26 14:32:18 -03
           Universal time: Fri 2026-03-26 17:32:18 UTC
                 RTC time: Fri 2026-03-26 17:32:18
                Time zone: America/Sao_Paulo (-03, -0300)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no`}
      />

      <h3>NTP — sincronização automática</h3>

      <TerminalBlock
        command="sudo timedatectl set-ntp true"
      />

      <TerminalBlock
        command="systemctl status systemd-timesyncd"
        output={`{g}● systemd-timesyncd.service{/} - Network Time Synchronization
     Loaded: loaded (/usr/lib/systemd/system/systemd-timesyncd.service; {g}enabled{/}; preset: enabled)
     Active: {g}active (running){/} since Fri 2026-03-26 09:00:18 -03; 5h ago
   Main PID: 542 (systemd-timesyn)
     Status: "Initial synchronization to time server 192.53.103.108:123 (0.arch.pool.ntp.org)."
      Tasks: 2 (limit: 38389)
     Memory: 1.6M`}
      />

      <TerminalBlock
        command="timedatectl timesync-status"
        output={`       Server: 192.53.103.108 (0.arch.pool.ntp.org)
Poll interval: 34min 8s (min: 32s; max 34min 8s)
         Leap: normal
      Version: 4
      Stratum: 2
    Reference: 1085A6FA
    Precision: 1us (-24)
Root distance: 56.012ms (max: 5s)
       Offset: -1.218ms
        Delay: 174.123ms
       Jitter: 8.412ms
 Packet count: 14
    Frequency: -12.241ppm`}
      />

      <CommandFlagList
        command="timedatectl"
        items={[
          { flag: "status", description: "Estado completo (default sem args)." },
          { flag: "set-time", description: "Define manualmente. Só se NTP desligado.", example: "sudo timedatectl set-time '2026-03-26 14:30:00'" },
          { flag: "set-timezone TZ", description: "Define timezone.", example: "sudo timedatectl set-timezone America/Recife" },
          { flag: "list-timezones", description: "Lista todas as zonas conhecidas." },
          { flag: "set-ntp BOOL", description: "Liga/desliga NTP.", example: "sudo timedatectl set-ntp true" },
          { flag: "set-local-rtc BOOL", description: "Define se o relógio de hardware está em hora local (true) ou UTC (false)." },
          { flag: "timesync-status", description: "Estatísticas do timesyncd." },
        ]}
      />

      <h2>5. hwclock — relógio de hardware</h2>

      <p>
        O RTC (<em>Real Time Clock</em>) da placa-mãe mantém a hora mesmo desligado. O Arch (e Linux
        em geral) prefere <strong>RTC em UTC</strong>; o Windows prefere local. Em dual-boot, isso
        causa o famoso "Windows desbobinou meu relógio".
      </p>

      <TerminalBlock command="sudo hwclock --show" output={`2026-03-26 14:32:42.184232-03:00`} />

      <TerminalBlock
        comment="copiar a hora do sistema PARA o RTC"
        command="sudo hwclock --systohc"
      />

      <TerminalBlock
        comment="copiar do RTC PARA o sistema"
        command="sudo hwclock --hctosys"
      />

      <TerminalBlock
        comment="ver se o RTC está em UTC ou local"
        command="timedatectl | grep 'RTC in local TZ'"
        output={`          RTC in local TZ: no`}
      />

      <AlertBox type="warning" title="Dual-boot Windows/Linux">
        Para evitar conflito, <strong>force o Windows a usar UTC</strong> com este registro
        (regedit como admin):
        <br />
        <code>HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\TimeZoneInformation</code>
        <br />
        Crie DWORD32 <code>RealTimeIsUniversal = 1</code>. Mantém o Linux em UTC e tudo passa a
        funcionar.
      </AlertBox>

      <h2>6. Resumo do fluxo de pós-instalação</h2>

      <CodeBlock
        title="receita pós-pacstrap (em arch-chroot)"
        language="bash"
        code={`# 1. Locale
sed -i 's/^#en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen
sed -i 's/^#pt_BR.UTF-8 UTF-8/pt_BR.UTF-8 UTF-8/' /etc/locale.gen
locale-gen
echo 'LANG=pt_BR.UTF-8' > /etc/locale.conf

# 2. Teclado no TTY
echo 'KEYMAP=br-abnt2' > /etc/vconsole.conf

# 3. Hostname + hosts
echo 'maquina-do-joao' > /etc/hostname
cat > /etc/hosts <<'EOF'
127.0.0.1   localhost
::1         localhost
127.0.1.1   maquina-do-joao.localdomain maquina-do-joao
EOF

# 4. Timezone + RTC em UTC
ln -sf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime
hwclock --systohc

# 5. Habilita NTP no primeiro boot
systemctl enable systemd-timesyncd`}
      />

      <h2>7. Variáveis no shell por sessão</h2>

      <p>
        Você pode <em>sobrescrever</em> o locale só para um comando ou só para sua sessão sem mexer
        em <code>/etc/locale.conf</code>:
      </p>

      <TerminalBlock
        comment="comando único em inglês"
        command="LC_ALL=C date"
        output="Fri Mar 26 02:32:42 PM -03 2026"
      />

      <TerminalBlock command="date" output={`sex 26 mar 2026 14:32:42 -03`} />

      <TerminalBlock
        comment="exportar para a sessão inteira"
        command={`export LC_TIME=en_US.UTF-8 && date`}
        output="Fri Mar 26 02:32:42 PM -03 2026"
      />

      <h2>8. Resumo prático</h2>

      <OutputBlock
        title="cheat sheet"
        output={`# locale
sudo nano /etc/locale.gen     # descomente os que quer
sudo locale-gen
sudo localectl set-locale LANG=pt_BR.UTF-8
locale -a
locale

# teclado TTY
sudo localectl set-keymap br-abnt2
cat /etc/vconsole.conf

# teclado X/Wayland
sudo localectl set-x11-keymap br pc105 abnt2

# hostname
sudo hostnamectl set-hostname novo-nome
hostnamectl

# timezone + NTP
sudo timedatectl set-timezone America/Sao_Paulo
sudo timedatectl set-ntp true
timedatectl
timedatectl timesync-status

# hwclock
sudo hwclock --show
sudo hwclock --systohc       # depois de set-timezone, sincroniza RTC`}
      />
    </PageContainer>
  );
}
