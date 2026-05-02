import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";

export default function Referencias() {
  return (
    <PageContainer
      title="Referências e Recursos"
      subtitle="A documentação que vive dentro do seu terminal — man, info, apropos, tldr, pacman -F — e os links externos que valem a pena salvar."
      difficulty="iniciante"
      timeToRead="15 min"
      category="Extras"
    >
      <h2>A documentação está no seu terminal</h2>
      <p>
        No Arch (e em qualquer Unix) a documentação principal vive em <em>páginas man</em> e
        <em> info</em>, instaladas junto com cada pacote. Aprenda a usá-las e você raramente
        precisará de uma busca no Google.
      </p>

      <h2>man — manuais clássicos</h2>
      <TerminalBlock
        comment="A estrutura: man <comando>"
        command="man ls"
        output={`LS(1)                            User Commands                            LS(1)

NAME
       ls - list directory contents

SYNOPSIS
       ls [OPTION]... [FILE]...

DESCRIPTION
       List information about the FILEs (the current directory by default).
       Sort entries alphabetically if none of -cftuvSUX nor --sort is specified.

       Mandatory arguments to long options are mandatory for short options too.

       -a, --all
              do not ignore entries starting with .

       -A, --almost-all
              do not ignore implied . and ..
 Manual page ls(1) line 1 (press h for help or q to quit)`}
      />

      <h3>Seções do man</h3>
      <OutputBlock
        title="As 9 seções do manual Unix"
        output={`1  Programas executáveis e comandos do shell    (ex: ls, grep, mv)
2  Chamadas de sistema (kernel)                  (ex: open, read, fork)
3  Funções de bibliotecas C                      (ex: printf, malloc)
4  Arquivos especiais (geralmente em /dev)       (ex: tty, null)
5  Formatos de arquivo e convenções              (ex: passwd, fstab)
6  Jogos                                         (ex: nethack)
7  Convenções, padrões, miscelânea               (ex: ascii, regex)
8  Comandos de administração de sistema          (ex: mount, fdisk)
9  Rotinas do kernel`}
        annotations={[
          { line: 0, note: "o que você usa todo dia" },
          { line: 4, note: "para programar em C" },
          { line: 7, note: "config files" },
        ]}
      />

      <TerminalBlock
        comment="Forçar uma seção específica (passwd existe em 1 e 5)"
        command="man 5 passwd"
        output={`PASSWD(5)              File Formats Manual              PASSWD(5)

NAME
       passwd - the password file

DESCRIPTION
       /etc/passwd contains one line for each user account, with seven fields
       delimited by colons (":"). These fields are:

       •   login name
       •   optional encrypted password
       •   numerical user ID
       •   numerical group ID
       •   user name or comment field
       •   user home directory
       •   optional user command interpreter`}
      />

      <CommandFlagList
        command="man"
        items={[
          { flag: "-k PADRÃO", long: "--apropos", description: "Busca pelo padrão nas descrições curtas (mesmo que apropos).", example: "man -k 'list directory'" },
          { flag: "-f COMANDO", long: "--whatis", description: "Mostra a descrição de uma linha (mesmo que whatis).", example: "man -f ls" },
          { flag: "-K PADRÃO", description: "Busca pelo padrão DENTRO do texto de TODOS os manuais (lento).", example: "man -K 'inode quota'" },
          { flag: "-a", long: "--all", description: "Mostra TODAS as páginas que correspondem (passwd em 1 e em 5).", example: "man -a passwd" },
          { flag: "SEÇÃO COMANDO", description: "Abre o comando numa seção específica.", example: "man 5 fstab" },
          { flag: "--path", description: "Mostra o arquivo real da página man.", example: "man --path ls" },
        ]}
      />

      <h2>apropos e whatis</h2>
      <TerminalBlock
        comment="Não lembra o nome? Busque pela descrição."
        command="apropos 'partition table'"
        output={`cfdisk (8)           - display or manipulate a disk partition table
fdisk (8)            - manipulate disk partition table
gdisk (8)            - Interactive GUID partition table (GPT) manipulator
parted (8)           - a partition manipulation program
partprobe (8)        - inform the OS of partition table changes
sfdisk (8)           - display or manipulate a disk partition table`}
      />

      <TerminalBlock
        command="whatis grep awk sed"
        output={`grep (1)             - print lines that match patterns
awk (1)              - pattern scanning and processing language
sed (1)              - stream editor for filtering and transforming text`}
      />

      <h2>info — manuais GNU estendidos</h2>
      <p>
        Programas GNU (coreutils, gcc, bash) frequentemente têm <em>info pages</em> mais detalhadas
        que o man. Use teclas estilo Emacs: <code>n</code> próximo, <code>p</code> anterior,
        <code>u</code> sobe, <code>q</code> sai.
      </p>
      <TerminalBlock
        command="info coreutils 'ls invocation'"
        output={`Next: dir invocation,  Up: Directory listing

10.1 'ls': List directory contents
==================================

The 'ls' program lists information about files (of any type, including
directories).  Options and file arguments can be intermixed arbitrarily,
as usual.

   For non-option command-line arguments that are directories, by default
'ls' lists the contents of directories, not recursively, and omitting
files with names beginning with '.'.  For other non-option arguments, by
default 'ls' lists just the file name.`}
      />

      <h2>tldr — exemplos rápidos</h2>
      <TerminalBlock
        command="sudo pacman -S tldr && tldr update"
        output={`(1/1) installing tldr                    [######################] 100%
Updated cache for [en, pt_BR]`}
      />

      <TerminalBlock
        command="tldr tar"
        output={`{c}tar{/}

Archiving utility.

{dim}- [c]reate an archive and write it to a [f]ile:{/}
   {y}tar cf target.tar file1 file2 file3{/}

{dim}- [c]reate a g[z]ipped archive and write it to a [f]ile:{/}
   {y}tar czf target.tar.gz file1 file2 file3{/}

{dim}- [x]tract a (compressed) archive [f]ile into the current directory:{/}
   {y}tar xf source.tar[.gz|.bz2|.xz]{/}

{dim}- E[x]tract a (compressed) archive [f]ile into the target directory:{/}
   {y}tar xf source.tar[.gz|.bz2|.xz] -C directory{/}

{dim}- [c]reate a compressed archive, using suffix to determine compression:{/}
   {y}tar caf target.tar.xz file1 file2 file3{/}`}
      />

      <h2>pacman -F — descubra qual pacote tem o binário</h2>
      <TerminalBlock
        command="sudo pacman -Fy"
        output={`:: Synchronizing files databases...
 core.files                  21.4 KiB   612 KiB/s 00:00 [######################] 100%
 extra.files                 14.2 MiB  4.20 MiB/s 00:03 [######################] 100%
 multilib.files             186.8 KiB  1.52 MiB/s 00:00 [######################] 100%`}
      />

      <TerminalBlock
        comment="Não tem o comando? Descubra o pacote que o fornece."
        command="pacman -F /usr/bin/htop"
        output={`extra/htop 3.3.0-1
    usr/bin/htop`}
      />

      <TerminalBlock
        command="pacman -Fx '^perf$'"
        output={`extra/linux-tools 6.12-1 [installed]
    usr/bin/perf`}
      />

      <h2>pacman -Q* — explorando o que está instalado</h2>
      <TerminalBlock
        command="pacman -Qi firefox | head -20"
        output={`Name            : firefox
Version         : 134.0-1
Description     : Standalone web browser from mozilla.org
Architecture    : x86_64
URL             : https://www.mozilla.org/firefox/
Licenses        : MPL-2.0
Groups          : None
Provides        : None
Depends On      : alsa-lib  at-spi2-core  cairo  dbus  ffmpeg  gtk3  hicolor-icon-theme
                  libpulse  mime-types  nspr  nss  ttf-font
Optional Deps   : networkmanager: Location detection via available WiFi networks
                  libnotify: Notification integration
                  pulseaudio: Audio support
                  speech-dispatcher: Text-to-Speech
Required By     : None
Optional For    : None
Conflicts With  : firefox-beta firefox-developer-edition firefox-nightly
Replaces        : None
Installed Size  : 256.42 MiB
Packager        : Jan Alexander Steffens (heftig) <heftig@archlinux.org>`}
      />

      <TerminalBlock
        command="pacman -Qo /usr/bin/curl"
        output={`/usr/bin/curl is owned by curl 8.11.1-1`}
      />

      <h2>Documentação oficial</h2>
      <h3>ArchWiki</h3>
      <p>
        A <a href="https://wiki.archlinux.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ArchWiki</a> é
        considerada a melhor documentação Linux. Páginas essenciais:
      </p>
      <ul>
        <li><a href="https://wiki.archlinux.org/title/Installation_guide" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Installation Guide</a></li>
        <li><a href="https://wiki.archlinux.org/title/General_recommendations" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">General Recommendations</a></li>
        <li><a href="https://wiki.archlinux.org/title/List_of_applications" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">List of Applications</a></li>
        <li><a href="https://wiki.archlinux.org/title/Pacman" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Pacman</a></li>
        <li><a href="https://wiki.archlinux.org/title/Arch_User_Repository" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">AUR</a></li>
        <li><a href="https://wiki.archlinux.org/title/System_maintenance" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">System Maintenance</a></li>
        <li><a href="https://wiki.archlinux.org/title/Security" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Security</a></li>
      </ul>

      <h3>Recursos oficiais</h3>
      <ul>
        <li><a href="https://archlinux.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">archlinux.org</a> — site oficial</li>
        <li><a href="https://aur.archlinux.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">aur.archlinux.org</a> — Arch User Repository</li>
        <li><a href="https://security.archlinux.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">security.archlinux.org</a> — advisories</li>
        <li><a href="https://bugs.archlinux.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">bugs.archlinux.org</a> — bug tracker</li>
        <li><a href="https://archlinux.org/packages/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">archlinux.org/packages</a> — busca de pacotes</li>
      </ul>

      <h2>Comunidades</h2>
      <ul>
        <li><a href="https://bbs.archlinux.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Arch Linux Forums</a></li>
        <li><a href="https://www.reddit.com/r/archlinux/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">r/archlinux</a></li>
        <li><a href="https://www.reddit.com/r/unixporn/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">r/unixporn</a> — rices/customizações</li>
        <li><code>#archlinux</code> em Libera.Chat (IRC)</li>
        <li><code>#archlinux-br</code> em Libera.Chat — Brasil</li>
      </ul>

      <AlertBox type="info" title="Etiqueta ao pedir ajuda">
        Sempre informe: descrição clara do problema, mensagens de erro literais, o que já tentou,
        e a saída de <code>journalctl -b -p err</code>, <code>systemctl --failed</code> e qualquer
        comando relevante. Perguntas vagas raramente recebem ajuda.
      </AlertBox>

      <h2>Canais de YouTube</h2>
      <h3>Brasil</h3>
      <ul>
        <li><strong>Diolinux</strong> — tutoriais e reviews</li>
        <li><strong>Slackjeff</strong> — Linux, shell, customização</li>
        <li><strong>LinuxTips</strong> — DevOps e infra</li>
        <li><strong>Akitando (Fábio Akita)</strong> — conteúdo técnico aprofundado</li>
        <li><strong>Toca do Tux</strong> — Linux para iniciantes</li>
      </ul>
      <h3>Internacional</h3>
      <ul>
        <li><strong>DistroTube (DT)</strong></li>
        <li><strong>Luke Smith</strong></li>
        <li><strong>Chris Titus Tech</strong></li>
        <li><strong>The Linux Experiment</strong></li>
        <li><strong>Mental Outlaw</strong></li>
        <li><strong>Learn Linux TV</strong></li>
      </ul>

      <h2>Livros recomendados</h2>
      <h3>Gratuitos online</h3>
      <ul>
        <li><a href="https://linuxcommand.org/tlcl.php" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">The Linux Command Line</a> — William Shotts</li>
        <li><a href="https://tldp.org/LDP/abs/html/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Advanced Bash-Scripting Guide</a></li>
        <li><a href="https://www.gnu.org/software/bash/manual/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Bash Reference Manual</a></li>
      </ul>
      <h3>Livros físicos</h3>
      <ul>
        <li><strong>How Linux Works</strong> — Brian Ward</li>
        <li><strong>Linux Bible</strong> — Christopher Negus</li>
        <li><strong>UNIX and Linux System Administration Handbook</strong> — Evi Nemeth et al.</li>
        <li><strong>The Linux Programming Interface</strong> — Michael Kerrisk</li>
      </ul>

      <h2>Ferramentas online</h2>
      <ul>
        <li><a href="https://explainshell.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ExplainShell</a> — explica cada parte de um comando</li>
        <li><a href="https://www.shellcheck.net/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ShellCheck</a> — linter de scripts shell</li>
        <li><a href="https://crontab.guru/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Crontab Guru</a> — explica expressões cron</li>
        <li><a href="https://regex101.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Regex101</a> — testador de regex</li>
        <li><a href="https://cheat.sh/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cheat.sh</a> — <code>curl cheat.sh/tar</code></li>
      </ul>

      <h2>cheat.sh — sua biblioteca em uma linha</h2>
      <TerminalBlock
        command="curl cheat.sh/find/recursive+grep"
        output={`# To find files containing a specific string recursively
grep -r "string" /path/to/dir

# To find files matching a pattern AND containing a string
find /path -name '*.py' -exec grep -l "TODO" {} +

# To exclude directories
grep -r --exclude-dir={node_modules,.git} "pattern" .`}
      />

      <h2>Distribuições baseadas no Arch</h2>
      <ul>
        <li><strong>EndeavourOS</strong> — Arch puro com instalador gráfico</li>
        <li><strong>CachyOS</strong> — kernels otimizados para performance</li>
        <li><strong>Garuda</strong> — focada em gaming</li>
        <li><strong>ArcoLinux</strong> — voltada a ensinar Arch</li>
        <li><strong>Manjaro</strong> — repositórios próprios (atrasados em ~2 semanas)</li>
      </ul>

      <AlertBox type="warning" title="Arch puro vs derivadas">
        Derivadas têm repositórios e configurações diferentes. Ao pedir ajuda nos fóruns do Arch,
        sempre mencione qual distribuição você usa — soluções podem divergir.
      </AlertBox>

      <h2>Certificações Linux</h2>
      <ul>
        <li><strong>LPI Linux Essentials</strong></li>
        <li><strong>LPIC-1 / LPIC-2</strong></li>
        <li><strong>CompTIA Linux+</strong></li>
        <li><strong>RHCSA</strong> — prática, muito valorizada no mercado</li>
      </ul>

      <AlertBox type="success" title="O ciclo virtuoso do Arch">
        Cada vez que você quebra algo, lê o erro e conserta, ganha entendimento profundo do Linux.
        Use o terminal como sua sala de aula: <code>man</code>, <code>apropos</code>,
        <code>tldr</code>, <code>info</code>, <code>pacman -Qi</code>, <code>journalctl</code> —
        e o ArchWiki numa aba aberta no navegador. Essa é a fórmula.
      </AlertBox>
    </PageContainer>
  );
}
