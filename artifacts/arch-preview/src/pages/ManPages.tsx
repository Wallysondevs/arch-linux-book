import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";

export default function ManPages() {
  return (
    <PageContainer
      title="Documentação Local: man, info, tldr e ArchWiki"
      subtitle="Antes de googlear, leia o que já está instalado. man pages, info, apropos, tldr e o ecossistema de docs do Arch — tudo offline."
      difficulty="iniciante"
      timeToRead="30 min"
      category="Shell"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch com <code>man-db</code> instalado (vem em <code>base</code>).
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>man</strong> — manual do comando. Seções: 1 (user), 2 (syscalls), 5 (formatos), 8 (admin).
      </p>
      <p>
        <strong>man -k</strong> — busca por palavra (apropos).
      </p>
      <p>
        <strong>ArchWiki</strong> — wiki oficial — frequentemente mais útil que o man para temas Arch-específicos.
      </p>
      <p>
        <strong>info</strong> — formato GNU mais detalhado, navegável (raramente usado hoje).
      </p>

      <p>
        Cada utilitário do Linux vem com sua documentação <strong>localmente instalada</strong>.
        Aprender a navegar essas páginas é o que separa quem cola comandos do Stack Overflow de
        quem realmente entende o sistema. Esta página percorre as ferramentas de documentação
        do Arch — man, info, apropos, tldr — e como combiná-las com a ArchWiki.
      </p>

      <AlertBox type="info" title="Pacotes desta página">
        <code>man</code>, <code>man-db</code>, <code>man-pages</code>, <code>texinfo</code> já
        vêm no <code>base</code>. <code>tldr</code> está no AUR:{" "}
        <code>yay -S tldr</code> (cliente em Rust) ou <code>npm i -g tldr</code>. Para HTML
        bonito também existe <code>most</code> como pager alternativo.
      </AlertBox>

      <h2>1. <code>man</code> — manual em seções</h2>

      <p>
        O comando <code>man PAGE</code> abre a página de manual usando seu pager (default{" "}
        <code>less</code>). Cada manual é numerado em <strong>seções</strong> que evitam
        ambiguidade quando o mesmo nome existe em mais de um lugar (ex: <code>printf</code> é
        comando shell em 1 e função C em 3).
      </p>

      <h3>1.1. As 9 seções</h3>

      <OutputBlock
        title="seções do manual (Filesystem Hierarchy Standard)"
        output={`1   Comandos do usuário                  ls, grep, vim
2   Chamadas de sistema                  open, read, fork, mmap
3   Funções de biblioteca C              printf, malloc, strlen
4   Arquivos especiais (devices)         /dev/null, /dev/sda, tty
5   Formatos de arquivo / config         passwd, fstab, sudoers, crontab
6   Jogos e screensavers                 cowsay, fortune
7   Convenções, padrões, miscelânea      regex, signal, utf-8, locale, ascii
8   Comandos de admin (sudo)             mount, mkfs, iptables, systemctl
9   Rotinas de kernel                    raros, internos do kernel`}
      />

      <TerminalBlock
        comment="abre seção 1 (a primeira que casar)"
        command="man ls"
      />

      <TerminalBlock
        comment="força uma seção específica"
        command="man 5 passwd"
      />

      <TerminalBlock
        comment="lista TODAS as páginas com aquele nome"
        command="man -f passwd"
        output={`passwd (1)               - change user password
passwd (1ssl)            - compute password hashes
passwd (5)               - the password file`}
      />

      <TerminalBlock
        comment="ver uma página de cada seção, em sequência"
        command="man -a printf"
        output={`--Man-- next: printf(1) [ view (return) | skip (Ctrl-D) | quit (Ctrl-C) ]`}
      />

      <h3>1.2. Anatomia de uma página</h3>

      <OutputBlock
        title="seções típicas de uma manpage"
        output={`NAME              breve descrição
SYNOPSIS          assinatura: comando [opções] argumentos
DESCRIPTION       texto longo
OPTIONS           cada flag explicada
EXAMPLES          casos de uso (nem sempre presente)
EXIT STATUS       códigos de retorno
ENVIRONMENT       variáveis lidas
FILES             arquivos relacionados
SEE ALSO          outras páginas correlatas
BUGS / AUTHORS    rodapé`}
      />

      <h3>1.3. Navegando dentro do less (o pager)</h3>

      <CommandFlagList
        command="atalhos do less (pager padrão do man)"
        items={[
          { flag: "Espaço / b", description: "Próxima / anterior página." },
          { flag: "j / k", description: "Linha por linha (estilo vim)." },
          { flag: "g / G", description: "Início / fim do arquivo." },
          { flag: "/PAT", description: "Busca para frente." },
          { flag: "?PAT", description: "Busca para trás." },
          { flag: "n / N", description: "Próxima / anterior ocorrência." },
          { flag: "h", description: "Mostra ajuda do less." },
          { flag: "q", description: "Sai do pager (e do man)." },
          { flag: "v", description: "Abre o conteúdo no $EDITOR (vim)." },
          { flag: "&PAT", description: "Filtra: mostra só as linhas que casam." },
        ]}
      />

      <h3>1.4. Flags úteis do man</h3>

      <CommandFlagList
        command="man"
        items={[
          { flag: "-k PAT", description: "Igual a apropos: busca em descrições.", example: "man -k 'list directory'" },
          { flag: "-f PAT", description: "Igual a whatis: lista páginas com nome exato." },
          { flag: "-K PAT", description: "Busca o termo no CONTEÚDO de TODAS as páginas (lento)." },
          { flag: "-w", description: "Mostra apenas o caminho do arquivo da página." },
          { flag: "-P CMD", description: "Usa CMD como pager.", example: "man -P most ls" },
          { flag: "-Tpdf > out.pdf", description: "Renderiza a página em PDF (precisa groff)." },
          { flag: "-H", description: "Renderiza em HTML e abre no navegador." },
          { flag: "-L LANG", description: "Idioma específico.", example: "man -L pt_BR ls" },
        ]}
      />

      <TerminalBlock
        command="man -w ls"
        output="/usr/share/man/man1/ls.1.gz"
      />

      <h2>2. <code>apropos</code> e <code>whatis</code></h2>

      <p>
        Não lembra o nome do comando? Procure por palavra-chave em <em>todas</em> as descrições
        com <code>apropos</code> (alias <code>man -k</code>):
      </p>

      <TerminalBlock
        command="apropos 'list directory'"
        output={`dir (1)                  - list directory contents
ls (1)                   - list directory contents
ntfsls (8)               - list directory contents on an NTFS filesystem
vdir (1)                 - list directory contents`}
      />

      <TerminalBlock
        command="whatis cron"
        output={`cron (8)                 - daemon to execute scheduled commands
cron (1)                 - run scheduled jobs`}
      />

      <AlertBox type="warning" title="apropos vazio? rode mandb">
        Se <code>apropos</code> não retorna nada, o índice está desatualizado. Atualize com{" "}
        <code>sudo mandb</code>. O Arch já roda isso semanalmente via{" "}
        <code>man-db.timer</code> (<code>systemctl list-timers</code>).
      </AlertBox>

      <h2>3. <code>info</code> — manuais GNU em hipertexto</h2>

      <p>
        Projetos GNU (gcc, bash, coreutils, gawk, ...) costumam ter documentação <em>maior</em> em
        formato Info — uma espécie de hipertexto local com nós e links.
      </p>

      <TerminalBlock command="info coreutils" />

      <CommandFlagList
        command="info — atalhos de navegação"
        items={[
          { flag: "Espaço / DEL", description: "Próxima / anterior tela." },
          { flag: "n / p", description: "Próximo / anterior nó (mesmo nível)." },
          { flag: "u", description: "Sobe para o nó pai (Up)." },
          { flag: "TAB", description: "Pula para o próximo link." },
          { flag: "ENTER", description: "Segue o link sob o cursor." },
          { flag: "l", description: "Volta (last) — como botão back." },
          { flag: "s PAT", description: "Busca." },
          { flag: "i", description: "Vai ao índice (index)." },
          { flag: "?", description: "Lista todos os comandos." },
          { flag: "q", description: "Sai." },
        ]}
      />

      <TerminalBlock
        comment="ir direto para um nó específico"
        command="info coreutils 'ls invocation'"
      />

      <h2>4. <code>tldr</code> — exemplos práticos</h2>

      <p>
        Manpages são completas mas verbosas. <code>tldr</code> mostra <strong>5–10 exemplos
        comuns</strong> em uma tela só — é o "Stack Overflow offline" para o caso típico.
      </p>

      <TerminalBlock
        command="yay -S tldr"
        output={`==> Making package: tldr 1.6.1-2 (Wed Mar 26 11:00:42 2026)
:: Proceed with installation? [Y/n] y`}
      />

      <TerminalBlock
        comment="atualiza o cache de páginas"
        command="tldr --update"
        output={`Successfully updated local cache (12,847 pages)`}
      />

      <TerminalBlock
        command="tldr tar"
        output={`tar
  Archiving utility.

- Create an archive from files:
  tar cf target.tar file1 file2 file3

- Create a gzipped archive:
  tar czf target.tar.gz file1 file2

- Extract a (compressed) archive into the current directory:
  tar xf source.tar[.gz|.bz2|.xz]

- Extract an archive into a target directory:
  tar xf source.tar -C directory

- List the contents of an archive:
  tar tvf source.tar`}
      />

      <TerminalBlock
        command="tldr ssh"
        output={`ssh
  Secure Shell client.

- Connect to a remote server:
  ssh username@host

- Connect with a specific identity (private key):
  ssh -i ~/.ssh/id_ed25519 user@host

- Forward a local port:
  ssh -L 8080:localhost:80 user@host

- Run a single command on the remote and exit:
  ssh user@host 'uptime'`}
      />

      <h2>5. <code>--help</code> e <code>-h</code></h2>

      <p>
        Antes de chamar man, tente o próprio binário. Praticamente todo utilitário GNU aceita{" "}
        <code>--help</code>:
      </p>

      <TerminalBlock
        command="ls --help | head -15"
        output={`Usage: ls [OPTION]... [FILE]...
List information about the FILEs (the current directory by default).
Sort entries alphabetically if neither -cftuvSUX nor --sort is specified.

Mandatory arguments to long options are mandatory for short options too.
  -a, --all                  do not ignore entries starting with .
  -A, --almost-all           do not list . and ..
      --author               with -l, print the author of each file
  -b, --escape               print C-style escapes for nongraphic names
      --block-size=SIZE      with -l, scale sizes by SIZE before printing
  -B, --ignore-backups       do not list entries ending with ~
  -c                         with -lt: sort by ctime; with -l: show ctime
      --color[=WHEN]         color the output WHEN ('always', 'auto', 'never')
  -C                         list entries by columns
  -d, --directory            list this entry only`}
      />

      <h2>6. <code>/usr/share/doc</code> — README do pacote</h2>

      <p>
        Muitos pacotes instalam READMEs, exemplos e changelogs em{" "}
        <code>/usr/share/doc/PACKAGE/</code>. Quando a manpage cala, vasculhe ali.
      </p>

      <TerminalBlock
        command="ls /usr/share/doc | head"
        output={`bash/
btrfs-progs/
ca-certificates/
chrony/
docker/
fail2ban/
git/
gnupg/
htop/
nginx/`}
      />

      <TerminalBlock
        command="ls /usr/share/doc/git/"
        output={`contrib/
diff-highlight/
git-jump/
git-prompt.sh
git-completion.bash
SubmittingPatches`}
      />

      <h2>7. ArchWiki — o melhor recurso de documentação Linux</h2>

      <p>
        A <strong>ArchWiki</strong> (<code>https://wiki.archlinux.org</code>) é considerada a
        melhor referência de Linux <em>existente</em> — usuários de outras distros consultam
        constantemente. Tópicos são profundos, exemplos completos, com discussão de prós/contras.
      </p>

      <h3>7.1. Workflow recomendado</h3>

      <OutputBlock
        title="quando uma coisa não funciona"
        output={`1. man COMANDO              ← sintaxe oficial
2. tldr COMANDO             ← exemplo do mundo real
3. /usr/share/doc/PKG/      ← README + changelog
4. wiki.archlinux.org       ← cenários, dicas, troubleshooting
5. archlinux.org/news/      ← problema recente conhecido?
6. bbs.archlinux.org        ← fórum (em inglês, severo mas técnico)
7. Google                   ← último recurso`}
      />

      <h3>7.2. Acessando offline com arch-wiki-lite</h3>

      <TerminalBlock command="sudo pacman -S arch-wiki-lite" output="Packages (1) arch-wiki-lite-20260301-1" />

      <TerminalBlock
        command="wiki-search-html bluetooth"
        output={`1) Bluetooth
2) Bluetooth headset
3) Bluetooth keyboard
4) Bluetooth (Italiano)
Selection (q to abort): 1`}
      />

      <p>
        Existe também <code>arch-wiki-docs</code> (todo o HTML) e o app gráfico{" "}
        <code>archwiki-gui</code> no AUR. Para terminal puro, <code>wiki-search</code> retorna
        URLs e <code>wiki-search-html</code> abre no <code>w3m</code>/<code>lynx</code>.
      </p>

      <h2>8. Pager alternativo: <code>most</code></h2>

      <p>
        O <code>less</code> é ótimo, mas o <code>most</code> mostra <strong>cores</strong> e
        suporta múltiplos arquivos em janelas. Defina como pager padrão:
      </p>

      <TerminalBlock command="sudo pacman -S most" output="Packages (1) most-5.2.0-2" />

      <TerminalBlock
        command={`echo 'export PAGER=most' >> ~/.bashrc && source ~/.bashrc`}
        output=""
      />

      <h2>9. Pesquisa global no conteúdo das páginas</h2>

      <TerminalBlock
        comment="busca o termo 'inotify' em TODAS as manpages instaladas"
        command="man -K inotify | head"
        output={`--Man-- next: inotify(7) [ view (return) | skip (Ctrl-D) | quit (Ctrl-C) ]`}
      />

      <TerminalBlock
        comment="alternativa rápida: zgrep nos arquivos comprimidos"
        command={`zgrep -l 'inotify' /usr/share/man/man1/*.gz | head`}
        output={`/usr/share/man/man1/incrontab.1.gz
/usr/share/man/man1/inotifywait.1.gz
/usr/share/man/man1/inotifywatch.1.gz`}
      />

      <h2>10. Cheat sheet</h2>

      <OutputBlock
        title="documentação local — atalhos diários"
        output={`man ls                  manual padrão (seção 1)
man 5 fstab             manual de formato de arquivo
man -k texto            apropos: busca por palavra
man -f cron             whatis: nome exato
man -K palavra          busca no CONTEÚDO
man -P most ls          pager diferente
man -Tpdf ls > ls.pdf   exporta em PDF

info coreutils          hipertexto GNU
tldr tar                exemplos rápidos
COMANDO --help          ajuda integrada

/usr/share/doc/PKG/     README do pacote
wiki.archlinux.org      MELHOR documentação Linux
arch-wiki-lite          ArchWiki offline (terminal)`}
      />

      <AlertBox type="success" title="O hábito que muda tudo">
        Antes de copiar e colar do Google, gaste <strong>30 segundos</strong> em{" "}
        <code>man</code> ou <code>tldr</code>. Em duas semanas você vai conhecer flags que nunca
        viu, evitar bugs e ganhar autonomia. <em>RTFM</em> não é insulto — é caminho mais curto.
      </AlertBox>
    </PageContainer>
  );
}
