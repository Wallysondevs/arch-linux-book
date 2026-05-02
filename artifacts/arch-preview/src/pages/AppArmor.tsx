import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function AppArmor() {
  return (
    <PageContainer
      title="AppArmor no Arch Linux"
      subtitle="MAC (Mandatory Access Control) baseado em path: profiles, modos complain/enforce, ferramentas aa-* e integração com o kernel via parâmetros do GRUB."
      difficulty="avancado"
      timeToRead="35 min"
      category="Segurança"
    >
      <p>
        O <code>AppArmor</code> é um <strong>LSM</strong> (Linux Security Module) que aplica políticas
        baseadas em caminho — diferente do SELinux (baseado em rótulos). Cada profile descreve o que um
        binário pode fazer: ler/escrever em quais paths, fazer quais syscalls de rede, capabilities etc.
        No Arch ele <em>não vem ativo por padrão</em>: você instala, habilita o LSM no kernel e ativa o
        serviço.
      </p>

      <AlertBox type="info" title="AppArmor vs SELinux no Arch">
        Arch oferece os dois mas <strong>AppArmor é o caminho mais simples</strong> — profiles em texto,
        modo "complain" para aprender, e o time do Arch publica <code>apparmor</code> em
        <code> [extra]</code>. SELinux exige um sistema base re-rotulado, normalmente reservado para
        derivadas como <code>archlinux-selinux</code>.
      </AlertBox>

      <h2>1. Instalação</h2>

      <TerminalBlock
        command="sudo pacman -S apparmor"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (3) audit-4.0.2-1  libapparmor-4.0.2-1  apparmor-4.0.2-1

Total Download Size:   2.13 MiB
Total Installed Size:  9.47 MiB

:: Proceed with installation? [Y/n] y
:: Processing package changes...
(1/3) installing audit                              [####################] 100%
(2/3) installing libapparmor                        [####################] 100%
(3/3) installing apparmor                           [####################] 100%
:: Running post-transaction hooks...
(1/2) Reloading system manager configuration...
(2/2) Arming ConditionNeedsUpdate...`}
      />

      <h2>2. Habilitar o LSM no kernel (GRUB)</h2>

      <p>
        O kernel do Arch já vem compilado com AppArmor, mas o LSM precisa estar na linha de comando do
        boot. Edite <code>/etc/default/grub</code>:
      </p>

      <TerminalBlock
        command="sudoedit /etc/default/grub"
        comment="adicione lsm= e apparmor=1 security=apparmor"
      />

      <CodeBlock
        title="/etc/default/grub (trecho relevante)"
        code={`GRUB_CMDLINE_LINUX_DEFAULT="quiet splash lsm=landlock,lockdown,yama,integrity,apparmor,bpf"`}
      />

      <TerminalBlock
        command="sudo grub-mkconfig -o /boot/grub/grub.cfg"
        output={`Generating grub configuration file ...
Found linux image: /boot/vmlinuz-linux
Found initrd image: /boot/initramfs-linux.img
Found fallback initrd image(s): /boot/initramfs-linux-fallback.img
done`}
      />

      <AlertBox type="warning" title="Ordem do parâmetro lsm= importa">
        Se você usar apenas <code>apparmor=1 security=apparmor</code> sem o <code>lsm=</code>, o kernel
        recente do Arch ignora silenciosamente. A flag <code>lsm=</code> precisa listar
        <strong> todos</strong> os LSMs que você quer (incluindo os já ativos como <code>landlock</code> e
        <code> yama</code>). Confira com <code>cat /sys/kernel/security/lsm</code> após o reboot.
      </AlertBox>

      <h2>3. Habilitar o serviço e reiniciar</h2>

      <TerminalBlock
        command="sudo systemctl enable apparmor.service"
        output={`Created symlink '/etc/systemd/system/sysinit.target.wants/apparmor.service' → '/usr/lib/systemd/system/apparmor.service'.`}
      />

      <TerminalBlock command="sudo reboot" />

      <TerminalBlock
        comment="após o reboot, confirme que o LSM está ativo"
        command="cat /sys/kernel/security/lsm"
        output="landlock,lockdown,yama,integrity,apparmor,bpf"
      />

      <h2>4. aa-status — visão geral</h2>

      <TerminalBlock
        command="sudo aa-status"
        output={`apparmor module is loaded.
36 profiles are loaded.
22 profiles are in enforce mode.
   /usr/bin/Discord
   /usr/bin/evince
   /usr/bin/firefox
   /usr/bin/man
   /usr/bin/thunderbird
   /usr/lib/cups/backend/cups-pdf
   /usr/sbin/cups-browsed
   /usr/sbin/cupsd
   ...
14 profiles are in complain mode.
   /usr/bin/code
   /usr/bin/keepassxc
   /usr/lib/snapd/snap-confine
   ...
0 profiles are in kill mode.
0 profiles are in unconfined mode.
8 processes have profiles defined.
6 processes are in enforce mode.
   /usr/bin/firefox (3421) firefox
   /usr/sbin/cupsd (812) cupsd
   ...
2 processes are in complain mode.
   /usr/bin/code (4112) code
0 processes are unconfined but have a profile defined.
0 processes are in mixed mode.
0 processes don't have a profile.`}
      />

      <OutputBlock
        title="Os 5 estados de um profile"
        output={`enforce      — bloqueia o que não está permitido (e loga em audit)
complain     — APENAS loga violações (modo "aprendizado")
kill         — mata o processo na primeira violação
unconfined   — profile carregado mas inativo (sem efeito)
disabled     — não carregado no kernel`}
        annotations={[
          { line: 0, note: "produção" },
          { line: 1, note: "para criar/refinar profile" },
          { line: 2, note: "raro, apenas extremo paranoico" },
        ]}
      />

      <h2>5. Pacote de profiles oficiais</h2>

      <TerminalBlock
        comment="conjunto de profiles mantidos pelo upstream"
        command="sudo pacman -S apparmor"
        output="(já instalado — profiles vivem em /etc/apparmor.d/)"
      />

      <TerminalBlock
        command="ls /etc/apparmor.d/ | head -15"
        output={`abstractions/
disable/
local/
tunables/
usr.bin.evince
usr.bin.firefox
usr.bin.man
usr.bin.thunderbird
usr.lib.cups.backend.cups-pdf
usr.sbin.cups-browsed
usr.sbin.cupsd
usr.sbin.dnsmasq
usr.sbin.mdnsd
usr.sbin.ntpd
usr.sbin.smbd`}
      />

      <p>
        Profiles extras vêm via AUR (<code>apparmor-profiles-git</code>) e cobrem dezenas de
        binários comuns (browsers, ferramentas de rede, etc).
      </p>

      <TerminalBlock command="yay -S apparmor-profiles-git" />

      <h2>6. Carregar / descarregar profiles manualmente</h2>

      <CommandFlagList
        command="apparmor_parser"
        items={[
          { flag: "-r", description: "Reload (substitui o profile já carregado).", example: "sudo apparmor_parser -r /etc/apparmor.d/usr.bin.firefox" },
          { flag: "-a", description: "Add (carrega novo, falha se já existir)." },
          { flag: "-R", description: "Remove (descarrega do kernel).", example: "sudo apparmor_parser -R /etc/apparmor.d/usr.bin.firefox" },
          { flag: "-Q", description: "Skip cache, força recompilação." },
          { flag: "--print-cache-dir", description: "Mostra onde os profiles compilados são cacheados." },
        ]}
      />

      <TerminalBlock
        command="sudo apparmor_parser -r /etc/apparmor.d/usr.bin.firefox"
        output=""
      />

      <h2>7. Trocar entre enforce e complain</h2>

      <CommandFlagList
        command="aa-* (utilitários de profile)"
        items={[
          { flag: "aa-enforce", description: "Coloca um profile em modo enforce.", example: "sudo aa-enforce /etc/apparmor.d/usr.bin.firefox" },
          { flag: "aa-complain", description: "Coloca em complain (só loga).", example: "sudo aa-complain /usr/bin/firefox" },
          { flag: "aa-disable", description: "Desativa totalmente o profile (sem remover do disco)." },
          { flag: "aa-audit", description: "Liga audit em TODAS as regras (até as permitidas)." },
          { flag: "aa-genprof", description: "Cria profile do zero monitorando o programa." },
          { flag: "aa-logprof", description: "Lê o /var/log/audit/audit.log e propõe regras novas." },
          { flag: "aa-unconfined", description: "Lista processos com porta aberta sem profile." },
        ]}
      />

      <TerminalBlock
        command="sudo aa-complain /usr/bin/firefox"
        output={`Setting /usr/bin/firefox to complain mode.`}
      />

      <TerminalBlock
        command="sudo aa-enforce /usr/bin/firefox"
        output={`Setting /usr/bin/firefox to enforce mode.`}
      />

      <h2>8. Anatomia de um profile</h2>

      <CodeBlock
        title="/etc/apparmor.d/usr.bin.man"
        language="apparmor"
        code={`# vim:syntax=apparmor
abi <abi/4.0>,
include <tunables/global>

profile man /usr/bin/man {
  include <abstractions/base>
  include <abstractions/consoles>
  include <abstractions/nameservice>

  capability setuid,
  capability setgid,

  /usr/bin/man      mr,
  /usr/bin/preconv  ix,
  /usr/bin/tbl      ix,
  /usr/bin/nroff    ix,
  /usr/bin/less     ix,

  /etc/manpath.config            r,
  /etc/man_db.conf               r,
  /usr/share/man/**              r,
  /usr/local/share/man/**        r,
  /var/cache/man/**              rw,

  owner @{HOME}/.manpath         r,
  owner @{HOME}/.cache/man/**    rwk,

  deny /etc/shadow r,
  deny /home/*/.ssh/** r,
}`}
      />

      <OutputBlock
        title="Sintaxe das permissões"
        output={`r   read
w   write
a   append (subset of w)
m   memory map executable (mmap PROT_EXEC)
k   lock (file lock)
l   link (criar hard/symlink)
ix  inherit execute (filho herda profile)
Px  execute, transição para profile do alvo
Cx  execute, criar child profile
Ux  execute UNCONFINED (perigoso)
ux  unconfined sem environment scrub`}
      />

      <h2>9. Criando um profile do zero (aa-genprof)</h2>

      <TerminalBlock
        command="sudo aa-genprof /usr/local/bin/meu-script.sh"
        output={`Updating AppArmor profiles in /etc/apparmor.d.
Writing updated profile for /usr/local/bin/meu-script.sh.
Setting /usr/local/bin/meu-script.sh to complain mode.

Before you begin, you may wish to check if a
profile already exists for the application you
wish to confine. See the following wiki page for
more information:
https://gitlab.com/apparmor/apparmor/wikis/Profiles

Please start the application to be profiled in
another window and exercise its functionality now.

Once completed, select the "Scan" option below in
order to scan the system logs for AppArmor events.

For each AppArmor event, you will be given the
opportunity to choose whether the access should be
allowed or denied.

[(S)can system log for AppArmor events] / (F)inish`}
      />

      <p>
        Em outro terminal, execute o programa normalmente. Volte ao <code>aa-genprof</code> e
        pressione <kbd>S</kbd>:
      </p>

      <TerminalBlock
        command="(em outro terminal) /usr/local/bin/meu-script.sh"
        output="(roda normalmente, syscalls são logadas)"
      />

      <OutputBlock
        title="Diálogo do aa-genprof após pressionar S"
        output={`Profile:  /usr/local/bin/meu-script.sh
Path:     /etc/passwd
New Mode: r
Severity: 4

 [1 - include <abstractions/nameservice>]
  2 - /etc/passwd r,
(A)llow / [(D)eny] / (I)gnore / (G)lob / Glob with (E)xtension /
(N)ew / Audi(t) / Abo(r)t / (F)inish`}
      />

      <p>
        Pressione <kbd>A</kbd> para aceitar a regra. Repita até zerar os eventos. No final, escolha
        <kbd>F</kbd> e o profile fica gravado em <code>/etc/apparmor.d/usr.local.bin.meu-script.sh</code>.
      </p>

      <h2>10. Refinando um profile existente (aa-logprof)</h2>

      <p>
        Quando um profile em <strong>enforce</strong> está bloqueando algo legítimo, você não precisa
        editar o arquivo na mão. Coloque em complain temporariamente, exercite, depois rode:
      </p>

      <TerminalBlock
        command="sudo aa-logprof"
        output={`Reading log entries from /var/log/audit/audit.log.
Updating AppArmor profiles in /etc/apparmor.d.

Profile:  /usr/bin/firefox
Path:     /home/user/Downloads/test.pdf
New Mode: r
Severity: 6

 [1 - owner /home/*/Downloads/** r,]
  2 - owner /home/user/Downloads/test.pdf r,
(A)llow / [(D)eny] / (I)gnore / (G)lob / Glob with (E)xtension /
(N)ew / Audi(t) / Abo(r)t / (F)inish`}
      />

      <h2>11. Olhando os logs de violação</h2>

      <TerminalBlock
        command="sudo journalctl -k | grep -i 'apparmor=' | tail -3"
        output={`Mar 26 14:12:08 archlinux kernel: audit: type=1400 audit(1711479128.451:42): apparmor="DENIED" operation="open" profile="firefox" name="/etc/shadow" pid=3421 comm="firefox" requested_mask="r" denied_mask="r" fsuid=1000 ouid=0
Mar 26 14:18:32 archlinux kernel: audit: type=1400 audit(1711479512.123:43): apparmor="ALLOWED" operation="exec" profile="firefox" name="/usr/lib/firefox/firefox" pid=3422
Mar 26 14:22:15 archlinux kernel: audit: type=1400 audit(1711479735.892:44): apparmor="DENIED" operation="connect" profile="firefox" pid=3421 family="inet" sock_type="stream"`}
      />

      <OutputBlock
        title="Decifrando uma linha de DENIED"
        output={`apparmor="DENIED"     status (DENIED ou ALLOWED+audit)
operation="open"      tipo de operação
profile="firefox"     profile ATIVO no momento
name="/etc/shadow"    o que o programa tentou tocar
pid=3421              processo
requested_mask="r"    o que pediu (r=read, w=write, x=exec...)
denied_mask="r"       o que foi negado (subset do requested)`}
      />

      <h2>12. Desabilitar um profile temporariamente</h2>

      <TerminalBlock
        command="sudo aa-disable /usr/bin/firefox"
        output={`Disabling /usr/bin/firefox.`}
      />

      <p>
        Cria um link em <code>/etc/apparmor.d/disable/</code>. Para reabilitar:
      </p>

      <TerminalBlock command="sudo rm /etc/apparmor.d/disable/usr.bin.firefox" />
      <TerminalBlock command="sudo apparmor_parser -r /etc/apparmor.d/usr.bin.firefox" />

      <h2>13. Receita comum: confinar um daemon customizado</h2>

      <CodeBlock
        title="/etc/apparmor.d/usr.local.bin.meu-bot"
        language="apparmor"
        code={`abi <abi/4.0>,
include <tunables/global>

profile meu-bot /usr/local/bin/meu-bot {
  include <abstractions/base>
  include <abstractions/nameservice>
  include <abstractions/openssl>
  include <abstractions/python>

  network inet stream,
  network inet6 stream,

  /usr/local/bin/meu-bot           mr,
  /usr/bin/python3.12              ix,
  /usr/lib/python3.12/**           r,

  /etc/meu-bot/config.yml          r,
  /var/log/meu-bot/**              w,
  owner /var/lib/meu-bot/**        rwk,

  # nada de filesystem do usuário
  deny /home/** rwxlk,
  deny /root/** rwxlk,
  deny @{PROC}/sys/** w,
}`}
      />

      <TerminalBlock
        command="sudo apparmor_parser -r /etc/apparmor.d/usr.local.bin.meu-bot"
      />

      <TerminalBlock
        command="sudo systemctl restart meu-bot && sudo aa-status | grep meu-bot"
        output={`   /usr/local/bin/meu-bot (4521) meu-bot`}
      />

      <AlertBox type="success" title="Workflow padrão recomendado">
        1) <code>aa-genprof</code> em complain → 2) exercite o app por uns dias →
        3) <code>aa-logprof</code> para colher regras → 4) <code>aa-enforce</code> →
        5) monitore <code>journalctl -k | grep DENIED</code> e ajuste.
      </AlertBox>

      <h2>14. Referências rápidas</h2>

      <OutputBlock
        title="comandos do dia-a-dia"
        output={`sudo aa-status                              quem está confinado?
sudo aa-complain /usr/bin/X                 colocar em complain
sudo aa-enforce  /usr/bin/X                 voltar para enforce
sudo aa-disable  /usr/bin/X                 desligar
sudo aa-genprof  /caminho/binario           criar profile do zero
sudo aa-logprof                             aprender com os logs
sudo apparmor_parser -r /etc/apparmor.d/X   recarregar profile
sudo journalctl -k | grep apparmor=DENIED   o que foi bloqueado`}
      />
    </PageContainer>
  );
}
