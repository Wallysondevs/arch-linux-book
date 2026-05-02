import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";

export default function Visualizacao() {
  return (
    <PageContainer
      title="Visualização de Arquivos"
      subtitle="Leia, inspecione e analise arquivos no terminal: cat, less, head, tail, tac, nl, wc, file, stat, od, xxd, strings — com saídas reais e cada coluna explicada."
      difficulty="iniciante"
      timeToRead="40 min"
    >
      <p>
        Tudo no Linux é arquivo de texto: logs, configurações, código-fonte. Saber escolher o comando
        certo para ler cada tipo de arquivo, e <strong>entender o que cada coluna da saída significa</strong>,
        é o que separa um usuário casual de um administrador competente.
      </p>

      <h2>1. <code>cat</code> — Concatenar e exibir</h2>
      <p>
        O <code>cat</code> despeja todo o conteúdo de uma vez no terminal. Excelente para arquivos curtos,
        péssimo para arquivos grandes (que devem ir para <code>less</code>).
      </p>

      <TerminalBlock
        title="cat — exibir um arquivo curto"
        command="cat /etc/hostname"
        output="archlinux"
      />

      <TerminalBlock
        title="cat /etc/os-release — informações da distro"
        command="cat /etc/os-release"
        output={`NAME="Arch Linux"
PRETTY_NAME="Arch Linux"
ID=arch
BUILD_ID=rolling
ANSI_COLOR="38;2;23;147;209"
HOME_URL="https://archlinux.org/"
DOCUMENTATION_URL="https://wiki.archlinux.org/"
SUPPORT_URL="https://bbs.archlinux.org/"
BUG_REPORT_URL="https://gitlab.archlinux.org/groups/arch/-/issues"
PRIVACY_POLICY_URL="https://terms.archlinux.org/docs/privacy-policy/"
LOGO=archlinux-logo`}
      />

      <h3>Flags de visualização do <code>cat</code></h3>

      <TerminalBlock
        title="cat -n — numerar TODAS as linhas"
        command="cat -n /etc/hostname"
        output={`     1\tarchlinux`}
      />

      <TerminalBlock
        title="cat -b — numerar apenas linhas NÃO vazias"
        lines={[
          { type: "command", text: `printf 'linha 1\\n\\nlinha 3\\n\\nlinha 5\\n' | cat -b` },
          { type: "output", text: `     1\tlinha 1\n       \n     2\tlinha 3\n       \n     3\tlinha 5` },
          { type: "comment", text: "as linhas vazias permanecem, mas só as não-vazias recebem número" },
        ]}
      />

      <TerminalBlock
        title="cat -A — mostrar caracteres invisíveis (tabs, fim-de-linha)"
        lines={[
          { type: "command", text: `printf 'col1\\tcol2\\nfim\\n' | cat -A` },
          { type: "output", text: `col1^Icol2$\nfim$` },
          { type: "comment", text: "^I = tab, $ = fim de linha (LF). Útil para detectar CRLF (^M$) em arquivos vindos do Windows" },
        ]}
      />

      <TerminalBlock
        title="cat -s — comprimir múltiplas linhas em branco em uma só"
        lines={[
          { type: "command", text: `printf 'a\\n\\n\\n\\nb\\n' | cat -s` },
          { type: "output", text: `a\n\nb` },
        ]}
      />

      <CommandFlagList
        command="cat"
        items={[
          { flag: "-n", long: "--number", description: "Numera todas as linhas.", example: "cat -n arquivo.txt" },
          { flag: "-b", long: "--number-nonblank", description: "Numera apenas linhas não vazias.", example: "cat -b arquivo.txt" },
          { flag: "-A", long: "--show-all", description: "Mostra caracteres invisíveis: tab=^I, fim-de-linha=$.", example: "cat -A arquivo.txt" },
          { flag: "-T", description: "Mostra tabs como ^I (subset de -A).", example: "cat -T arquivo.txt" },
          { flag: "-E", description: "Mostra $ no fim de cada linha.", example: "cat -E arquivo.txt" },
          { flag: "-s", long: "--squeeze-blank", description: "Comprime múltiplas linhas em branco em uma só.", example: "cat -s arquivo.txt" },
        ]}
      />

      <AlertBox type="warning" title="Useless Use of Cat (UUOC)">
        Não escreva <code>cat arquivo | grep padrão</code>. Use <code>grep padrão arquivo</code> direto —
        a maioria dos comandos aceita o arquivo como argumento, e usar <code>cat</code> só adiciona um
        processo desnecessário. É um meme clássico entre devs Unix.
      </AlertBox>

      <h2>2. <code>tac</code> — O inverso do <code>cat</code></h2>

      <TerminalBlock
        title="tac — última linha primeiro"
        lines={[
          { type: "command", text: "cat numeros.txt" },
          { type: "output", text: "1\n2\n3\n4\n5" },
          { type: "command", text: "tac numeros.txt" },
          { type: "output", text: "5\n4\n3\n2\n1" },
        ]}
      />

      <TerminalBlock
        title="Uso real: ver as últimas linhas de um log do mais recente para o mais antigo"
        command="tac /var/log/pacman.log | head -3"
        output={`[2025-01-15T10:01:55+0000] [ALPM] upgraded linux (6.7.0.arch3-1 -> 6.7.1.arch1-1)
[2025-01-15T10:01:53+0000] [ALPM] upgraded systemd (255.2-1 -> 255.3-1)
[2025-01-15T10:01:52+0000] [PACMAN] starting full system upgrade`}
      />

      <h2>3. <code>nl</code> — Numerar linhas com formato</h2>

      <TerminalBlock
        title="nl — como cat -n, mas mais flexível"
        command="nl /etc/pacman.d/mirrorlist | head -8"
        output={`     1\t##
     2\t## Arch Linux repository mirrorlist
     3\t## Generated on 2025-01-15
     4\t##
       \t
     5\t## Brazil
     6\tServer = https://mirror.example.br/$repo/os/$arch
     7\tServer = https://mirror2.example.br/$repo/os/$arch`}
        comment="Por padrão, nl pula linhas em branco na numeração (note linha 4 vazia sem número)"
      />

      <TerminalBlock
        title="nl -ba — numera TODAS as linhas (até as vazias)"
        command="nl -ba /etc/pacman.d/mirrorlist | head -8"
        output={`     1\t##
     2\t## Arch Linux repository mirrorlist
     3\t## Generated on 2025-01-15
     4\t##
     5\t
     6\t## Brazil
     7\tServer = https://mirror.example.br/$repo/os/$arch
     8\tServer = https://mirror2.example.br/$repo/os/$arch`}
      />

      <h2>4. <code>less</code> — O paginador moderno</h2>
      <p>
        O <code>less</code> permite navegar interativamente em arquivos enormes sem carregá-los inteiros
        para a memória. Substitui o antigo <code>more</code> em todos os casos.
      </p>

      <TerminalBlock
        title="Abrir um log para leitura"
        command="less /var/log/pacman.log"
        output={`[2024-12-01T03:14:01+0000] [PACMAN] Running 'pacman -Syu'
[2024-12-01T03:14:02+0000] [ALPM] transaction started
[2024-12-01T03:14:05+0000] [ALPM] upgraded glibc (2.40-1 -> 2.40-2)
[2024-12-01T03:14:08+0000] [ALPM] upgraded linux (6.6.6.arch1-1 -> 6.7.0.arch3-1)
...
:`}
        comment="O ':' no fim é o prompt do less aguardando comandos"
      />

      <TerminalBlock
        title="less -N — abre com números de linha"
        command="less -N /etc/pacman.conf"
        output={`      1 #
      2 # /etc/pacman.conf
      3 #
      4 # See the pacman.conf(5) manpage for option and repository directives
      5
      6 #
      7 # GENERAL OPTIONS
      8 #
      9 [options]
     10 # The following paths are commented out with their default values listed.
     11 # If you wish to use different paths, uncomment and update the paths.
     12 #RootDir     = /
:`}
      />

      <CodeBlock
        title="Atalhos dentro do less"
        language="text"
        code={`NAVEGAÇÃO
  Espaço / Page Down    Avançar uma página
  b / Page Up           Voltar uma página
  j / ↓                 Uma linha para baixo
  k / ↑                 Uma linha para cima
  G                     Ir para o FIM do arquivo
  g                     Ir para o INÍCIO do arquivo
  50g                   Ir para a linha 50

BUSCA
  /padrão               Buscar para frente
  ?padrão               Buscar para trás
  n                     Próxima ocorrência
  N                     Ocorrência anterior
  &padrão               Mostrar APENAS linhas que contêm o padrão

OUTROS
  q                     Sair
  h                     Ajuda completa
  F                     Modo "follow" (como tail -f), Ctrl+C para parar
  v                     Abrir no editor padrão ($EDITOR)
  =                     Mostrar nome, posição e total de linhas`}
      />

      <CommandFlagList
        command="less"
        items={[
          { flag: "-N", description: "Mostra números de linha.", example: "less -N arquivo.txt" },
          { flag: "-i", description: "Busca insensível a caso (a menos que o termo tenha maiúscula).", example: "less -i log.txt" },
          { flag: "-S", description: "Não quebra linhas longas (rola horizontalmente).", example: "less -S log.txt" },
          { flag: "-R", description: "Interpreta cores ANSI (essencial para logs coloridos).", example: "ls --color=always | less -R" },
          { flag: "-F", description: "Sai automaticamente se o arquivo cabe em uma tela.", example: "less -F arquivo.txt" },
          { flag: "+G", description: "Abre direto no FIM do arquivo (útil para logs).", example: "less +G /var/log/pacman.log" },
          { flag: "+/PADRÃO", description: "Abre e busca o padrão imediatamente.", example: "less +/error /var/log/Xorg.0.log" },
        ]}
      />

      <h2>5. <code>head</code> — Início do arquivo</h2>

      <TerminalBlock
        title="head — primeiras 10 linhas (padrão)"
        command="head /var/log/pacman.log"
        output={`[2024-12-01T03:14:01+0000] [PACMAN] Running 'pacman -Syu'
[2024-12-01T03:14:02+0000] [ALPM] transaction started
[2024-12-01T03:14:05+0000] [ALPM] upgraded glibc (2.40-1 -> 2.40-2)
[2024-12-01T03:14:08+0000] [ALPM] upgraded linux (6.6.6.arch1-1 -> 6.7.0.arch3-1)
[2024-12-01T03:14:10+0000] [ALPM] upgraded systemd (254.7-1 -> 255.0-1)
[2024-12-01T03:14:12+0000] [ALPM] upgraded mesa (24.2.1-1 -> 24.2.2-1)
[2024-12-01T03:14:13+0000] [ALPM] transaction completed
[2024-12-01T03:14:13+0000] [PACMAN] command finished
[2024-12-01T03:15:00+0000] [PACMAN] Running 'pacman -S firefox'
[2024-12-01T03:15:05+0000] [ALPM] installed firefox (122.0-1)`}
      />

      <TerminalBlock
        title="head -n 3 — primeiras 3 linhas"
        command="head -n 3 /etc/pacman.conf"
        output={`#
# /etc/pacman.conf
#`}
      />

      <TerminalBlock
        title="head -c 50 — primeiros 50 BYTES"
        command="head -c 50 /etc/os-release"
        output={`NAME="Arch Linux"
PRETTY_NAME="Arch Linux"
ID=ar`}
      />

      <TerminalBlock
        title="head -n -5 — TUDO menos as últimas 5 linhas (truque!)"
        lines={[
          { type: "command", text: "wc -l /etc/passwd" },
          { type: "output", text: "42 /etc/passwd" },
          { type: "command", text: "head -n -5 /etc/passwd | wc -l" },
          { type: "output", text: "37" },
        ]}
      />

      <CommandFlagList
        command="head"
        items={[
          { flag: "-n N", description: "Imprime as primeiras N linhas (padrão: 10).", example: "head -n 20 arq" },
          { flag: "-n -N", description: "Imprime tudo MENOS as últimas N linhas.", example: "head -n -5 arq" },
          { flag: "-c N", description: "Imprime os primeiros N bytes (use K/M para múltiplos).", example: "head -c 1K arq" },
          { flag: "-q", description: "Suprime cabeçalhos quando dado múltiplos arquivos.", example: "head -q a.txt b.txt" },
          { flag: "-v", description: "Sempre imprime cabeçalho (mesmo com 1 arquivo).", example: "head -v arq" },
        ]}
      />

      <h2>6. <code>tail</code> — Final do arquivo</h2>

      <TerminalBlock
        title="tail — últimas 10 linhas"
        command="tail /var/log/pacman.log"
        output={`[2025-01-15T09:50:01+0000] [PACMAN] Running 'pacman -S neovim'
[2025-01-15T09:50:03+0000] [ALPM] transaction started
[2025-01-15T09:50:10+0000] [ALPM] installed libtermkey (0.22-3)
[2025-01-15T09:50:11+0000] [ALPM] installed libuv (1.49.0-1)
[2025-01-15T09:50:11+0000] [ALPM] installed libvterm (0.3.3-2)
[2025-01-15T09:50:11+0000] [ALPM] installed luajit (2.1.1736781742-1)
[2025-01-15T09:50:12+0000] [ALPM] installed msgpack-c (6.0.0-3)
[2025-01-15T09:50:12+0000] [ALPM] installed tree-sitter (0.24.4-1)
[2025-01-15T09:50:12+0000] [ALPM] installed unibilium (2.1.2-1)
[2025-01-15T09:50:13+0000] [ALPM] installed neovim (0.10.3-1)`}
      />

      <TerminalBlock
        title="tail -n +100 — desde a linha 100 ATÉ O FIM"
        lines={[
          { type: "command", text: "wc -l /etc/pacman.conf" },
          { type: "output", text: "108 /etc/pacman.conf" },
          { type: "command", text: "tail -n +100 /etc/pacman.conf" },
          { type: "output", text: `[multilib]\n#Include = /etc/pacman.d/mirrorlist\n\n# An example of using a custom package repository\n#[custom]\n#SigLevel = Optional TrustAll\n#Server = file:///home/custompkgs\n` },
        ]}
      />

      <h3><code>tail -f</code>: monitoramento em tempo real (essencial para sysadmins)</h3>

      <TerminalBlock
        title="tail -f — segue o arquivo enquanto ele cresce"
        lines={[
          { type: "command", text: "sudo tail -f /var/log/pacman.log" },
          { type: "output", text: `[2025-01-15T10:30:01+0000] [PACMAN] Running 'pacman -Syu'\n[2025-01-15T10:30:02+0000] [ALPM] transaction started\n[2025-01-15T10:30:08+0000] [ALPM] upgraded curl (8.11.0-1 -> 8.11.1-1)\n[2025-01-15T10:30:09+0000] [ALPM] upgraded git (2.47.1-1 -> 2.47.2-1)` },
          { type: "comment", text: "novas linhas aparecem AUTOMATICAMENTE conforme são gravadas. Ctrl+C para sair." },
        ]}
      />

      <TerminalBlock
        title="tail -F — segue MESMO se o arquivo for rotacionado/recriado"
        command="sudo tail -F /var/log/nginx/access.log"
        output={`192.168.1.10 - - [15/Jan/2025:10:30:01 +0000] "GET / HTTP/1.1" 200 1842
192.168.1.11 - - [15/Jan/2025:10:30:02 +0000] "GET /favicon.svg HTTP/1.1" 200 612
192.168.1.10 - - [15/Jan/2025:10:30:05 +0000] "POST /api/login HTTP/1.1" 401 89
tail: '/var/log/nginx/access.log' has become inaccessible: No such file or directory
tail: '/var/log/nginx/access.log' has appeared;  following new file
192.168.1.12 - - [15/Jan/2025:10:30:15 +0000] "GET / HTTP/1.1" 200 1842`}
        comment="Logrotate rotacionou o arquivo no meio — -F (maiúsculo) reabre automaticamente"
      />

      <CommandFlagList
        command="tail"
        items={[
          { flag: "-n N", description: "Últimas N linhas (padrão: 10).", example: "tail -n 50 arq" },
          { flag: "-n +N", description: "Da linha N ATÉ o fim.", example: "tail -n +100 arq" },
          { flag: "-c N", description: "Últimos N bytes.", example: "tail -c 200 arq" },
          { flag: "-f", description: "Segue o arquivo (escutando novas linhas).", example: "tail -f log" },
          { flag: "-F", description: "Como -f, mas reabre o arquivo se for rotacionado/recriado.", example: "tail -F log" },
          { flag: "-s N", description: "Intervalo (segundos) entre verificações no modo -f.", example: "tail -fs 5 log" },
        ]}
      />

      <AlertBox type="info" title="tail -f vs journalctl -f">
        No Arch (e qualquer sistema systemd), prefira <code>journalctl -f -u nome-servico</code> para
        seguir logs de serviços. O <code>tail -f</code> ainda é insubstituível para logs de aplicações
        que escrevem em arquivos próprios (nginx, postgresql, etc).
      </AlertBox>

      <h2>7. <code>wc</code> — Contar linhas, palavras, bytes</h2>

      <TerminalBlock
        title="wc — três contagens de uma vez"
        command="wc /etc/pacman.conf"
        output={`108  386  3017 /etc/pacman.conf`}
      />

      <OutputBlock
        title="As três colunas do wc"
        output={`108  386  3017 /etc/pacman.conf`}
        annotations={[
          { line: 0, note: "linhas │ palavras │ bytes │ nome" },
        ]}
      />

      <TerminalBlock
        title="wc -l — contar APENAS linhas"
        lines={[
          { type: "command", text: "wc -l /etc/passwd" },
          { type: "output", text: "42 /etc/passwd" },
          { type: "command", text: "ls /usr/bin | wc -l" },
          { type: "output", text: "2384" },
          { type: "comment", text: "Quantos comandos existem em /usr/bin? 2384." },
        ]}
      />

      <TerminalBlock
        title="wc -L — comprimento da linha mais longa"
        command="wc -L /etc/services"
        output={`128 /etc/services`}
      />

      <CommandFlagList
        command="wc"
        items={[
          { flag: "-l", description: "Conta apenas linhas.", example: "wc -l /etc/passwd" },
          { flag: "-w", description: "Conta apenas palavras.", example: "wc -w arq" },
          { flag: "-c", description: "Conta apenas bytes.", example: "wc -c arq.bin" },
          { flag: "-m", description: "Conta caracteres (importante para UTF-8 vs bytes).", example: "wc -m arq" },
          { flag: "-L", description: "Comprimento da linha mais longa.", example: "wc -L arq" },
        ]}
      />

      <h2>8. <code>file</code> — Identificar tipo de arquivo</h2>
      <p>
        Lê os "magic bytes" no início do arquivo e identifica o tipo real, ignorando extensão.
      </p>

      <TerminalBlock
        title="file — vários tipos diferentes"
        lines={[
          { type: "command", text: "file /bin/bash" },
          { type: "output", text: `/bin/bash: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=abc..., for GNU/Linux 4.4.0, stripped` },
          { type: "command", text: "file /etc/pacman.conf" },
          { type: "output", text: "/etc/pacman.conf: ASCII text" },
          { type: "command", text: "file /usr/share/icons/Adwaita/scalable/devices/computer-symbolic.svg" },
          { type: "output", text: "/usr/share/icons/Adwaita/scalable/devices/computer-symbolic.svg: SVG Scalable Vector Graphics image" },
          { type: "command", text: "file foto.jpg" },
          { type: "output", text: `foto.jpg: JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16, baseline, precision 8, 1920x1080, components 3` },
          { type: "command", text: "file documento.pdf" },
          { type: "output", text: "documento.pdf: PDF document, version 1.7, 24 pages" },
        ]}
      />

      <TerminalBlock
        title="file -i — saída em formato MIME"
        command="file -i documento.pdf"
        output="documento.pdf: application/pdf; charset=binary"
      />

      <TerminalBlock
        title="Caso real — alguém renomeou um executável para .txt"
        command="file suspeito.txt"
        output={`suspeito.txt: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, stripped`}
        comment="A extensão é .txt mas é um executável ELF. NÃO execute!"
      />

      <CommandFlagList
        command="file"
        items={[
          { flag: "-b", description: "Sem incluir o nome do arquivo na saída (brief).", example: "file -b arq" },
          { flag: "-i", description: "Saída em MIME type (ex: application/pdf).", example: "file -i arq" },
          { flag: "-L", description: "Segue links simbólicos.", example: "file -L /bin/sh" },
          { flag: "-z", description: "Olha dentro de arquivos comprimidos.", example: "file -z arq.gz" },
        ]}
      />

      <h2>9. <code>stat</code> — Metadata completa do arquivo</h2>
      <p>
        Mostra tudo que o filesystem sabe sobre um arquivo: tamanho, inode, permissões, datas (3!),
        dispositivo. É o "DNA" do arquivo.
      </p>

      <TerminalBlock
        title="stat — saída completa"
        command="stat /etc/pacman.conf"
        output={`  File: /etc/pacman.conf
  Size: 3017      \tBlocks: 8          IO Block: 4096   regular file
Device: 254,1\tInode: 1310741     Links: 1
Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)
Access: 2025-01-15 09:02:14.123456789 +0000
Modify: 2024-12-20 14:33:08.987654321 +0000
Change: 2024-12-20 14:33:08.987654321 +0000
 Birth: 2024-11-01 10:00:00.000000000 +0000`}
      />

      <OutputBlock
        title="As três (na verdade quatro) datas do stat"
        output={`Access: 2025-01-15 09:02:14   ← atime: última vez LIDO
Modify: 2024-12-20 14:33:08   ← mtime: conteúdo modificado
Change: 2024-12-20 14:33:08   ← ctime: metadados (perm, dono...) mudados
 Birth: 2024-11-01 10:00:00   ← btime: criação (nem todo FS suporta)`}
        annotations={[
          { line: 0, note: "atualiza com cat/less/grep" },
          { line: 1, note: "atualiza com edição do conteúdo" },
          { line: 2, note: "atualiza com chmod/chown também" },
          { line: 3, note: "ext4 e btrfs suportam; XFS antigo não" },
        ]}
      />

      <TerminalBlock
        title={`stat -c "%n %s %y" — formato customizado`}
        command={`stat -c "%n %s %y" /etc/*.conf | head -5`}
        output={`/etc/asound.conf 117 2024-09-12 18:22:01.000000000 +0000
/etc/host.conf 9 2024-08-20 09:00:00.000000000 +0000
/etc/locale.conf 19 2024-12-01 10:00:00.000000000 +0000
/etc/pacman.conf 3017 2024-12-20 14:33:08.987654321 +0000
/etc/resolv.conf 86 2025-01-15 09:00:00.000000000 +0000`}
      />

      <CommandFlagList
        command="stat"
        items={[
          { flag: "-c FMT", description: "Saída customizada. Tokens: %n nome, %s tamanho, %a perm octal, %A perm simb, %U dono, %G grupo, %y mtime, %x atime, %z ctime, %i inode.", example: `stat -c "%n %s %y" *` },
          { flag: "-f", description: "Mostra info do FILESYSTEM em vez do arquivo (espaço livre, inodes, tipo).", example: "stat -f /" },
          { flag: "-L", description: "Segue links simbólicos.", example: "stat -L /bin/sh" },
          { flag: "-t", description: "Saída em uma linha (terse), boa para scripts.", example: "stat -t arq" },
        ]}
      />

      <h2>10. <code>od</code> e <code>xxd</code> — Inspeção em hexadecimal</h2>
      <p>
        Quando você precisa olhar os <strong>bytes brutos</strong> de um arquivo binário, esses são
        seus amigos. <code>xxd</code> tem saída mais legível; <code>od</code> é mais flexível.
      </p>

      <TerminalBlock
        title="xxd — hex à esquerda, ASCII à direita"
        command="xxd /etc/hostname"
        output={`00000000: 6172 6368 6c69 6e75 780a                 archlinux.`}
      />

      <OutputBlock
        title="Anatomia da linha do xxd"
        output={`00000000: 6172 6368 6c69 6e75 780a                 archlinux.`}
        annotations={[
          { line: 0, note: "offset │ 16 bytes em hex (8 grupos de 2) │ representação ASCII" },
        ]}
        caption={
          <span>
            O <code>0a</code> no fim é o byte LF (newline, <code>\n</code>). Caracteres não imprimíveis
            aparecem como <code>.</code> na coluna ASCII.
          </span>
        }
      />

      <TerminalBlock
        title="xxd em um PNG — note o magic 89 50 4E 47"
        command="xxd /usr/share/icons/Adwaita/16x16/devices/computer.png | head -3"
        output={`00000000: 8950 4e47 0d0a 1a0a 0000 000d 4948 4452  .PNG........IHDR
00000010: 0000 0010 0000 0010 0806 0000 001f f3ff  ................
00000020: 6100 0000 1974 4558 7453 6f66 7477 6172  a....tEXtSoftwar`}
        comment="89 50 4E 47 = magic bytes do formato PNG. É assim que o file identifica tipos."
      />

      <TerminalBlock
        title="od -c — bytes como caracteres (com escapes)"
        command={`printf 'olá\\n\\t' | od -c`}
        output={`0000000   o   l 303 251  \\n  \\t
0000006`}
        comment="'á' em UTF-8 são 2 bytes: 303 251 (octal). \\n e \\t aparecem como escapes."
      />

      <TerminalBlock
        title="od -An -tx1 — só hex, sem offset"
        command={`printf 'olá' | od -An -tx1`}
        output={` 6f 6c c3 a1`}
      />

      <h2>11. <code>strings</code> — Extrair texto de binários</h2>

      <TerminalBlock
        title="strings — sequências de caracteres legíveis em um binário"
        command="strings /usr/bin/ls | head -10"
        output={`/lib64/ld-linux-x86-64.so.2
xkn1
TT@PT
__gmon_start__
_ITM_deregisterTMCloneTable
_ITM_registerTMCloneTable
__libc_start_main
free
abort
__errno_location`}
      />

      <TerminalBlock
        title="Caso real: descobrir a versão de um binário compilado"
        command={`strings /usr/bin/git | grep -i "git version" | head -3`}
        output={`git version 2.47.1
git version %s
not a git version: %s`}
      />

      <TerminalBlock
        title="Inspecionar URLs em um binário suspeito (sem executar!)"
        command={`strings programa-suspeito | grep -E "^https?://"`}
        output={`http://evil.example.com/payload.sh
https://api.evil.example.com/exfil`}
        comment="Se você ver URLs estranhas, NÃO execute o arquivo."
      />

      <CommandFlagList
        command="strings"
        items={[
          { flag: "-n N", description: "Mínimo de N caracteres por string (padrão: 4).", example: "strings -n 10 bin" },
          { flag: "-t x", description: "Mostra offset em hex à esquerda.", example: "strings -t x bin" },
          { flag: "-t d", description: "Mostra offset em decimal.", example: "strings -t d bin" },
          { flag: "-a", description: "Lê o arquivo inteiro (não só seções de dados).", example: "strings -a bin" },
        ]}
      />

      <AlertBox type="danger" title="Segurança: nunca execute o que não inspecionou">
        Recebeu um binário desconhecido? Use <code>file</code>, <code>strings</code>, <code>xxd</code>
        e <code>ldd</code> para inspecioná-lo <strong>antes</strong> de dar <code>chmod +x</code>.
        Olhe pelas URLs, comandos shell embutidos, e nomes de função suspeitos.
      </AlertBox>

      <h2>Tabela de Referência Rápida</h2>
      <CodeBlock
        title="Quando usar cada comando"
        language="text"
        code={`EXIBIÇÃO
  cat arq             Despeja tudo (arquivos curtos)
  tac arq             Inverte (última linha primeiro)
  less arq            Paginação interativa (arquivos grandes)
  nl  arq             Numera linhas (formato configurável)

PARTES
  head -n 20 arq      Primeiras 20 linhas
  tail -n 20 arq      Últimas 20 linhas
  tail -f log         SEGUE em tempo real
  tail -F log         SEGUE com reabertura (logrotate-safe)

CONTAGEM
  wc -l arq           Conta linhas
  wc -L arq           Comprimento da linha mais longa

INSPEÇÃO
  file arq            Identifica tipo real (magic bytes)
  stat arq            Metadata completa (perm, datas, inode)
  xxd arq             Hex dump legível
  od -c arq           Hex dump alternativo
  strings binario     Texto legível em arquivos binários`}
      />

      <AlertBox type="success" title="Próximos passos">
        Agora você sabe ler arquivos. O próximo passo é <strong>manipulá-los</strong>:
        criar, copiar, mover, apagar, linkar. Veja a página de Manipulação de Arquivos.
      </AlertBox>
    </PageContainer>
  );
}
