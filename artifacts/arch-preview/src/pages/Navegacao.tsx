import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";

export default function Navegacao() {
  return (
    <PageContainer
      title="Navegação no Terminal"
      subtitle="Domine os comandos essenciais para se mover pelo sistema de arquivos do Linux: cd, ls, pwd, tree, find e locate — com saídas reais e cada coluna explicada."
      difficulty="iniciante"
      timeToRead="35 min"
    >
      <p>
        Navegar pelo sistema de arquivos é a habilidade mais fundamental que você precisa dominar no Linux.
        Diferente de um gerenciador gráfico, no terminal você se move com comandos de texto — e cada comando
        tem uma saída específica que você precisa aprender a ler. Nesta página, todo comando é mostrado com
        sua saída literal e cada coluna anotada.
      </p>

      <h2>1. <code>pwd</code> — Onde eu estou?</h2>
      <p>
        O <code>pwd</code> (<em>Print Working Directory</em>) imprime o caminho absoluto do diretório atual.
        É o GPS do terminal — sempre que estiver perdido, comece por ele.
      </p>

      <TerminalBlock
        title="pwd — caminho absoluto"
        command="pwd"
        output="/home/user"
      />

      <h3>Diferença entre <code>-L</code> e <code>-P</code></h3>
      <p>
        Quando você está em um diretório que é, na verdade, um link simbólico, o <code>pwd</code> pode mostrar
        dois caminhos diferentes: o lógico (do link) ou o físico (resolvido). Veja:
      </p>

      <TerminalBlock
        title="Setup: criar um link simbólico para demonstrar"
        lines={[
          { type: "command", text: "ln -s /mnt/ssd/projetos ~/projetos" },
          { type: "command", text: "cd ~/projetos" },
          { type: "command", text: "pwd" },
          { type: "output", text: "/home/user/projetos" },
          { type: "command", text: "pwd -L" },
          { type: "output", text: "/home/user/projetos" },
          { type: "command", text: "pwd -P" },
          { type: "output", text: "/mnt/ssd/projetos" },
          { type: "comment", text: "-L mostra o caminho lógico (o link), -P resolve para o caminho físico real" },
        ]}
      />

      <CommandFlagList
        command="pwd"
        items={[
          { flag: "-L", long: "--logical", description: "Mostra o caminho lógico (segue links simbólicos). É o padrão.", example: "pwd -L" },
          { flag: "-P", long: "--physical", description: "Mostra o caminho físico real, resolvendo links simbólicos. Útil para depurar pontos de montagem.", example: "pwd -P" },
        ]}
      />

      <AlertBox type="info" title="Quando usar pwd -P?">
        Use <code>pwd -P</code> quando precisar saber onde os arquivos realmente estão no disco — por exemplo
        ao verificar pontos de montagem, debugar problemas de espaço, ou conferir se você caiu em um link
        sem perceber.
      </AlertBox>

      <h2>2. <code>cd</code> — Mudando de diretório</h2>
      <p>
        O <code>cd</code> (<em>Change Directory</em>) é como você se move entre pastas. Ele aceita caminhos
        absolutos (começando com <code>/</code>) e relativos (a partir de onde você está). O <code>cd</code>
        sozinho <strong>não imprime nada</strong> em caso de sucesso — ele só atualiza o prompt.
      </p>

      <TerminalBlock
        title="Caminhos absolutos vs relativos"
        lines={[
          { type: "comment", text: "Caminho ABSOLUTO — começa sempre com /" },
          { type: "command", text: "cd /etc/pacman.d", prompt: "[user@archlinux ~]$ " },
          { type: "command", text: "pwd", prompt: "[user@archlinux pacman.d]$ " },
          { type: "output", text: "/etc/pacman.d" },
          { type: "comment", text: "Caminho RELATIVO — a partir do diretório atual" },
          { type: "command", text: "cd hooks", prompt: "[user@archlinux pacman.d]$ " },
          { type: "command", text: "pwd", prompt: "[user@archlinux hooks]$ " },
          { type: "output", text: "/etc/pacman.d/hooks" },
        ]}
      />

      <h3>Atalhos essenciais do <code>cd</code></h3>

      <TerminalBlock
        title="cd — sem argumentos volta para o $HOME"
        lines={[
          { type: "command", text: "cd /var/log", prompt: "[user@archlinux ~]$ " },
          { type: "command", text: "cd", prompt: "[user@archlinux log]$ " },
          { type: "command", text: "pwd", prompt: "[user@archlinux ~]$ " },
          { type: "output", text: "/home/user" },
        ]}
      />

      <TerminalBlock
        title="cd - — alterna com o diretório anterior (e imprime o destino)"
        lines={[
          { type: "command", text: "cd /etc", prompt: "[user@archlinux ~]$ " },
          { type: "command", text: "cd /var/log", prompt: "[user@archlinux etc]$ " },
          { type: "command", text: "cd -", prompt: "[user@archlinux log]$ " },
          { type: "output", text: "/etc" },
          { type: "command", text: "cd -", prompt: "[user@archlinux etc]$ " },
          { type: "output", text: "/var/log" },
          { type: "comment", text: "cd - é o único cd que imprime algo: o diretório destino" },
        ]}
      />

      <TerminalBlock
        title="cd .. e cd ../.. — subir níveis"
        lines={[
          { type: "command", text: "cd /usr/share/icons/Adwaita/scalable", prompt: "[user@archlinux ~]$ " },
          { type: "command", text: "cd ..", prompt: "[user@archlinux scalable]$ " },
          { type: "command", text: "pwd", prompt: "[user@archlinux Adwaita]$ " },
          { type: "output", text: "/usr/share/icons/Adwaita" },
          { type: "command", text: "cd ../..", prompt: "[user@archlinux Adwaita]$ " },
          { type: "command", text: "pwd", prompt: "[user@archlinux share]$ " },
          { type: "output", text: "/usr/share" },
        ]}
      />

      <TerminalBlock
        title="Erros comuns do cd"
        lines={[
          { type: "command", text: "cd /etc/pacman.conf" },
          { type: "error", text: "bash: cd: /etc/pacman.conf: Not a directory" },
          { type: "command", text: "cd /naoexiste" },
          { type: "error", text: "bash: cd: /naoexiste: No such file or directory" },
          { type: "command", text: "cd /root" },
          { type: "error", text: "bash: cd: /root: Permission denied" },
        ]}
      />

      <AlertBox type="warning" title="O que NÃO fazer com cd">
        <ul>
          <li>Não tente <code>cd</code> para um arquivo — só funciona com diretórios.</li>
          <li>Nomes com espaço precisam de aspas: <code>cd "Meus Documentos"</code> ou escape com <code>\</code>.</li>
          <li>Um <code>cd</code> bem-sucedido <strong>nunca imprime nada</strong>. Se imprimiu, é erro (exceto <code>cd -</code>).</li>
        </ul>
      </AlertBox>

      <h2>3. <code>ls</code> — Listando arquivos e diretórios</h2>
      <p>
        O <code>ls</code> é provavelmente o comando que você mais vai usar. Ele lista o conteúdo de
        diretórios. Sozinho já é útil; com flags vira um raio-X do filesystem.
      </p>

      <h3>Uso básico</h3>

      <TerminalBlock
        title="ls — apenas nomes, ordenados alfabeticamente"
        command="ls"
        output={`Desktop    Downloads  Music      Public     Templates
Documents  Imagens    Pictures   Videos     projetos`}
      />

      <TerminalBlock
        title="ls de um diretório específico"
        command="ls /etc/pacman.d"
        output={`gnupg/  hooks/  mirrorlist  mirrorlist.pacnew`}
      />

      <h3>A flag mais importante: <code>-l</code> (long format)</h3>
      <p>
        Com <code>-l</code> o <code>ls</code> mostra <strong>uma linha por arquivo</strong> com sete colunas
        de informação. Você precisa ler essas colunas como um profissional. Veja:
      </p>

      <TerminalBlock
        title="ls -l ~ — formato longo"
        command="ls -l ~"
        output={`total 36
drwxr-xr-x 2 user user 4096 Jan 12 10:30 Desktop
drwxr-xr-x 5 user user 4096 Jan 14 18:22 Documents
drwxr-xr-x 3 user user 4096 Jan 15 09:12 Downloads
-rw-r--r-- 1 user user  234 Jan 14 09:15 notas.txt
lrwxrwxrwx 1 user user   18 Jan 10 11:00 projetos -> /mnt/ssd/projetos
-rwxr-xr-x 1 user user 1280 Jan 13 14:01 deploy.sh`}
      />

      <OutputBlock
        title="Anatomia da linha do ls -l"
        output={`drwxr-xr-x 2 user user 4096 Jan 12 10:30 Desktop`}
        annotations={[
          { line: 0, note: "tipo+permissões │ links │ dono │ grupo │ tamanho │ data mod │ nome" },
        ]}
        caption={
          <span>
            <code>d</code> = diretório, <code>-</code> = arquivo regular, <code>l</code> = link simbólico,
            <code> c</code>/<code>b</code> = device char/block. Os 9 caracteres seguintes são as permissões
            em três grupos (<em>dono</em> / <em>grupo</em> / <em>outros</em>).
          </span>
        }
      />

      <h3>Combinando <code>-a</code> (all) e <code>-h</code> (human-readable)</h3>

      <TerminalBlock
        title="ls -lah — a combinação que TODOS usam"
        command="ls -lah"
        output={`total 124K
drwx------ 18 user user 4.0K Jan 15 09:12 .
drwxr-xr-x  3 root root 4.0K Jan 01 00:00 ..
-rw-------  1 user user  18K Jan 15 09:15 .bash_history
-rw-r--r--  1 user user  220 Jan 01 00:00 .bash_logout
-rw-r--r--  1 user user 3.7K Jan 12 10:30 .bashrc
drwx------ 14 user user 4.0K Jan 14 18:22 .config
drwxr-xr-x  2 user user 4.0K Jan 12 10:30 Desktop
drwxr-xr-x  5 user user 4.0K Jan 14 18:22 Documents
-rw-r--r--  1 user user  234 Jan 14 09:15 notas.txt`}
      />

      <OutputBlock
        title="O que mudou com -a e -h?"
        output={`-rw-r--r--  1 user user 3.7K Jan 12 10:30 .bashrc
-rw-r--r--  1 user user  234 Jan 14 09:15 notas.txt`}
        annotations={[
          { line: 0, note: "-a inclui arquivos ocultos (começam com .)" },
          { line: 1, note: "-h imprime tamanho legível: 3.7K em vez de 3792" },
        ]}
      />

      <h3>Ordenações úteis</h3>

      <TerminalBlock
        title="ls -lhS — ordena por tamanho, maior primeiro"
        command="ls -lhS /var/log"
        output={`total 14M
-rw-r-----  1 root      systemd-journal 8.0M Jan 15 10:01 journal/system.journal
-rw-r--r--  1 root      root            3.2M Jan 15 10:01 pacman.log
-rw-r--r--  1 root      root            1.1M Jan 14 23:59 Xorg.0.log
-rw-r-----  1 root      systemd-journal 512K Jan 14 18:22 journal/user-1000.journal
-rw-rw-r--  1 root      utmp             64K Jan 15 09:12 wtmp
-rw-r--r--  1 root      root             32K Jan 15 09:12 lastlog`}
      />

      <TerminalBlock
        title="ls -lt — ordena por data de modificação, mais recente primeiro"
        command="ls -lt /var/log | head -5"
        output={`total 14336
-rw-r--r-- 1 root root 3221504 Jan 15 10:01 pacman.log
-rw-r----- 1 root root 8388608 Jan 15 10:01 journal.log
-rw-r--r-- 1 root root  131072 Jan 15 09:34 dmesg
-rw-r--r-- 1 root root 1153024 Jan 14 23:59 Xorg.0.log`}
      />

      <TerminalBlock
        title="ls -F — adiciona indicador de tipo no fim do nome"
        command="ls -F /usr/bin | head -8"
        output={`2to3*
[*
addr2line*
arch*
awk@
base64*
bash*
cat*`}
        comment="* = executável, @ = symlink, / = diretório, | = FIFO, = = socket"
      />

      <TerminalBlock
        title="ls --color=auto — cores por tipo (padrão na maioria das distros)"
        lines={[
          { type: "command", text: "ls --color=auto ~" },
          {
            type: "output",
            text: "{b}Desktop{/}    {b}Downloads{/}  {b}Music{/}      {b}Public{/}     {b}Templates{/}\n{b}Documents{/}  {b}Imagens{/}    {b}Pictures{/}   {b}Videos{/}     {c}projetos{/}\n{w}notas.txt{/}  {g}deploy.sh{/}",
          },
          { type: "comment", text: "azul = diretório, ciano = link simbólico, verde = executável, branco = arquivo comum" },
        ]}
      />

      <CommandFlagList
        command="ls"
        items={[
          { flag: "-l", description: "Formato longo (uma linha por arquivo, com permissões, dono, tamanho, data).", example: "ls -l" },
          { flag: "-a", long: "--all", description: "Inclui arquivos ocultos (começam com '.'), incluindo '.' e '..'.", example: "ls -a" },
          { flag: "-A", long: "--almost-all", description: "Como -a mas sem '.' e '..'.", example: "ls -A" },
          { flag: "-h", long: "--human-readable", description: "Tamanhos legíveis (K, M, G) em vez de bytes. Usar com -l.", example: "ls -lh" },
          { flag: "-S", description: "Ordena por tamanho, maior primeiro.", example: "ls -lhS" },
          { flag: "-t", description: "Ordena por data de modificação, mais recente primeiro.", example: "ls -lt" },
          { flag: "-r", long: "--reverse", description: "Inverte a ordem da ordenação atual.", example: "ls -ltr" },
          { flag: "-R", long: "--recursive", description: "Lista subdiretórios recursivamente.", example: "ls -R /etc/pacman.d" },
          { flag: "-d", long: "--directory", description: "Lista o próprio diretório, não seu conteúdo. Combine com */ para ver só pastas.", example: "ls -d */" },
          { flag: "-F", long: "--classify", description: "Adiciona indicador no fim: */ @ | =.", example: "ls -F" },
          { flag: "-i", long: "--inode", description: "Mostra o número do inode na primeira coluna.", example: "ls -li" },
          { flag: "-1", description: "Um arquivo por linha (padrão quando saída não é terminal).", example: "ls -1 | wc -l" },
          { flag: "--color", description: "auto/always/never. Habilita cores por tipo de arquivo.", example: "ls --color=auto" },
        ]}
      />

      <h3>Combinações que valem ouro</h3>

      <TerminalBlock
        title="Listar APENAS diretórios"
        command="ls -d */"
        output={`Desktop/    Downloads/  Music/      Public/     Templates/
Documents/  Imagens/    Pictures/   Videos/     projetos/`}
      />

      <TerminalBlock
        title="Os 5 maiores arquivos do diretório atual"
        command="ls -lhS | head -6"
        output={`total 240M
-rw-r--r-- 1 user user 180M Jan 14 22:00 video.mp4
-rw-r--r-- 1 user user  42M Jan 13 18:30 backup.tar.gz
-rw-r--r-- 1 user user  12M Jan 12 14:00 dataset.csv
-rw-r--r-- 1 user user 5.8M Jan 11 09:15 apresentacao.pdf
-rw-r--r-- 1 user user 1.2M Jan 10 11:00 logo.png`}
      />

      <TerminalBlock
        title="Contar quantos itens há no diretório"
        command="ls -1 | wc -l"
        output="11"
      />

      <AlertBox type="danger" title="Nunca processe a saída do ls em scripts">
        Em scripts, use <code>find</code> ou globs do shell para iterar arquivos — nomes com espaços,
        quebras de linha ou caracteres especiais quebram o parsing do <code>ls</code>. Esse é um dos
        erros mais comuns em scripts iniciantes.
      </AlertBox>

      <h2>4. <code>tree</code> — Visualização em árvore</h2>
      <p>
        O <code>tree</code> mostra a estrutura de diretórios como árvore — perfeito para entender
        a organização de um projeto de relance. Não vem instalado por padrão no Arch:
      </p>

      <TerminalBlock
        title="Instalando o tree"
        command="sudo pacman -S tree"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (1) tree-2.1.1-3

Total Download Size:   0.05 MiB
Total Installed Size:  0.13 MiB

:: Proceed with installation? [Y/n] y
:: Retrieving packages...
 tree-2.1.1-3-x86_64               48.3 KiB  1024 KiB/s 00:00 [######] 100%
(1/1) checking keys in keyring                              [######] 100%
(1/1) installing tree                                       [######] 100%`}
      />

      <TerminalBlock
        title="tree — árvore completa do diretório atual"
        command="tree ~/projetos/site"
        output={`/home/user/projetos/site
├── public
│   ├── favicon.svg
│   └── robots.txt
├── src
│   ├── components
│   │   ├── Button.tsx
│   │   └── Header.tsx
│   ├── pages
│   │   └── Home.tsx
│   └── main.tsx
├── package.json
└── README.md

4 directories, 8 files`}
      />

      <TerminalBlock
        title="tree -L 1 — apenas 1 nível (visão de topo)"
        command="tree -L 1 /etc"
        output={`/etc
├── X11
├── arch-release
├── bash.bashrc
├── ca-certificates
├── crypttab
├── default
├── environment
├── fstab
├── group
├── hostname
├── hosts
├── locale.conf
├── locale.gen
├── login.defs
├── machine-id
├── mkinitcpio.conf
├── modprobe.d
├── nsswitch.conf
├── os-release
├── pacman.conf
├── pacman.d
├── passwd
├── profile
├── resolv.conf
├── shadow
├── ssh
├── ssl
├── sudoers
├── sysctl.d
├── systemd
└── udev

11 directories, 19 files`}
      />

      <TerminalBlock
        title="tree -d -L 2 — apenas diretórios, 2 níveis"
        command="tree -d -L 2 /var"
        output={`/var
├── cache
│   ├── fontconfig
│   ├── ldconfig
│   └── pacman
├── lib
│   ├── dhcp
│   ├── pacman
│   └── systemd
├── log
│   ├── journal
│   └── old
├── spool
│   └── mail
└── tmp

15 directories`}
      />

      <TerminalBlock
        title="tree -h --du — com tamanho de cada arquivo e total por diretório"
        command="tree -h --du -L 2 ~/projetos/site"
        output={`[ 12K]  /home/user/projetos/site
├── [4.0K]  public
│   ├── [ 612]  favicon.svg
│   └── [  84]  robots.txt
├── [8.4K]  src
│   ├── [4.2K]  components
│   ├── [3.1K]  pages
│   └── [ 240]  main.tsx
├── [ 850]  package.json
└── [1.2K]  README.md`}
      />

      <TerminalBlock
        title="tree ignorando node_modules e .git"
        command={`tree -L 3 -I "node_modules|.git|dist" --dirsfirst`}
        output={`.
├── public
│   ├── favicon.svg
│   └── robots.txt
├── src
│   ├── components
│   │   ├── Button.tsx
│   │   └── Header.tsx
│   ├── pages
│   │   └── Home.tsx
│   └── main.tsx
├── package.json
└── tsconfig.json

4 directories, 7 files`}
      />

      <CommandFlagList
        command="tree"
        items={[
          { flag: "-L N", description: "Limita a profundidade a N níveis. Essencial em diretórios grandes.", example: "tree -L 2" },
          { flag: "-d", description: "Mostra apenas diretórios.", example: "tree -d -L 2" },
          { flag: "-a", description: "Inclui arquivos ocultos.", example: "tree -a" },
          { flag: "-h", description: "Tamanho legível para humanos (K/M/G).", example: "tree -h" },
          { flag: "--du", description: "Soma o tamanho do conteúdo de cada diretório.", example: "tree --du -h" },
          { flag: "-I PADRÃO", description: "Ignora arquivos/diretórios que casam com o padrão (separe com |).", example: "tree -I 'node_modules|.git'" },
          { flag: "-P PADRÃO", description: "Inclui APENAS arquivos que casam com o padrão.", example: "tree -P '*.ts'" },
          { flag: "-C", description: "Força cores na saída (mesmo redirecionando).", example: "tree -C" },
          { flag: "--dirsfirst", description: "Lista diretórios antes dos arquivos.", example: "tree --dirsfirst" },
          { flag: "-f", description: "Imprime o caminho completo de cada arquivo.", example: "tree -f" },
        ]}
      />

      <h2>5. <code>find</code> — Busca poderosa em tempo real</h2>
      <p>
        O <code>find</code> percorre o sistema de arquivos em tempo real e filtra por nome, tipo,
        tamanho, data, permissões e muito mais. Diferente do <code>ls</code>, é recursivo por padrão.
      </p>

      <h3>Sintaxe básica</h3>
      <CodeBlock
        title="Estrutura"
        code={`find [onde-buscar] [critérios] [ação]

# Exemplo completo:
find /var/log -type f -name "*.log" -mtime -7 -print`}
      />

      <h3>Busca por nome</h3>

      <TerminalBlock
        title="Buscar arquivo por nome exato"
        command={`find /etc -name "pacman.conf"`}
        output={`/etc/pacman.conf`}
      />

      <TerminalBlock
        title="Busca com wildcard — todos os .conf em /etc"
        command={`find /etc -name "*.conf" 2>/dev/null | head -10`}
        output={`/etc/pacman.conf
/etc/locale.conf
/etc/resolv.conf
/etc/nsswitch.conf
/etc/mkinitcpio.conf
/etc/sysctl.d/99-sysctl.conf
/etc/systemd/journald.conf
/etc/systemd/logind.conf
/etc/systemd/system.conf
/etc/systemd/user.conf`}
        comment="o 2>/dev/null silencia 'Permission denied' em diretórios protegidos"
      />

      <TerminalBlock
        title="Buscar ignorando maiúsculas/minúsculas (-iname)"
        command={`find ~/Documents -iname "readme*"`}
        output={`/home/user/Documents/projetos/api/README.md
/home/user/Documents/projetos/site/Readme.txt
/home/user/Documents/notas/readme.org`}
      />

      <h3>Busca por tipo</h3>

      <TerminalBlock
        title="Apenas arquivos regulares (-type f) ou diretórios (-type d)"
        lines={[
          { type: "command", text: `find /var/log -type f -name "*.log"` },
          { type: "output", text: `/var/log/pacman.log\n/var/log/Xorg.0.log\n/var/log/Xorg.0.log.old` },
          { type: "command", text: `find /home -type d -name "projetos"` },
          { type: "output", text: `/home/user/projetos\n/home/maria/Documents/projetos` },
          { type: "command", text: `find /usr/bin -type l | head -3` },
          { type: "output", text: `/usr/bin/awk\n/usr/bin/vi\n/usr/bin/sh` },
          { type: "comment", text: "-type l = links simbólicos (note o @ que o ls -F mostraria)" },
        ]}
      />

      <h3>Busca por tamanho</h3>

      <TerminalBlock
        title="Arquivos maiores que 100MB no /var"
        command={`sudo find /var -type f -size +100M -exec ls -lh {} \\;`}
        output={`-rw-r----- 1 root systemd-journal 128M Jan 15 10:01 /var/log/journal/abc123/system.journal
-rw-r--r-- 1 http  http            245M Jan 14 02:00 /var/cache/nginx/large-cache.tmp`}
      />

      <TerminalBlock
        title="Arquivos vazios (size 0)"
        command={`find ~/Downloads -type f -size 0`}
        output={`/home/user/Downloads/.lock
/home/user/Downloads/empty.txt`}
      />

      <h3>Busca por tempo</h3>

      <TerminalBlock
        title="Arquivos modificados nos últimos 7 dias"
        command={`find ~/projetos -type f -mtime -7 | head`}
        output={`/home/user/projetos/site/src/main.tsx
/home/user/projetos/site/src/components/Header.tsx
/home/user/projetos/site/package.json
/home/user/projetos/api/server.js`}
      />

      <TerminalBlock
        title="Arquivos modificados nas últimas 30 minutos"
        command={`find ~ -type f -mmin -30`}
        output={`/home/user/.bash_history
/home/user/projetos/site/src/main.tsx`}
      />

      <h3>Executando ações com <code>-exec</code></h3>

      <TerminalBlock
        title="-exec rm vs -delete (com saída e segurança)"
        lines={[
          { type: "comment", text: "PASSO 1 — sempre liste antes de deletar!" },
          { type: "command", text: `find /tmp -type f -name "*.tmp"` },
          { type: "output", text: `/tmp/cache.tmp\n/tmp/upload-9821.tmp\n/tmp/install.tmp` },
          { type: "comment", text: "PASSO 2 — agora apague" },
          { type: "command", text: `find /tmp -type f -name "*.tmp" -delete` },
          { type: "comment", text: "ou equivalente, mais lento, com -exec:" },
          { type: "command", text: `find /tmp -type f -name "*.tmp" -exec rm -v {} +` },
          { type: "output", text: `removed '/tmp/cache.tmp'\nremoved '/tmp/upload-9821.tmp'\nremoved '/tmp/install.tmp'` },
        ]}
      />

      <CommandFlagList
        command="find"
        items={[
          { flag: "-name PADRÃO", description: "Casa pelo nome (case-sensitive). Use aspas para wildcards.", example: `find . -name "*.log"` },
          { flag: "-iname PADRÃO", description: "Como -name, mas ignora maiúsculas/minúsculas.", example: `find . -iname "readme*"` },
          { flag: "-type T", description: "Filtra por tipo: f (arquivo), d (diretório), l (link), b/c (device).", example: "find . -type f" },
          { flag: "-size N[ckMG]", description: "+N maior que N, -N menor que N, N exato. Unidades: c b, k KiB, M MiB, G GiB.", example: "find / -size +100M" },
          { flag: "-mtime N", description: "Modificado há N dias (+N mais antigo, -N mais recente). Veja também -mmin (minutos).", example: "find . -mtime -7" },
          { flag: "-empty", description: "Arquivos ou diretórios vazios.", example: "find . -type d -empty" },
          { flag: "-perm MODO", description: "Filtra por permissão (ex: 644, /u+x para qualquer um com bit x do dono).", example: "find / -perm -4000" },
          { flag: "-user U", description: "Pertence ao usuário U.", example: "find / -user root" },
          { flag: "-exec CMD {} \\;", description: "Executa CMD para cada match. {} é o arquivo. Use + no fim para passar vários de uma vez.", example: "find . -name '*.sh' -exec chmod +x {} +" },
          { flag: "-delete", description: "Apaga os arquivos encontrados. Mais rápido e seguro que -exec rm.", example: "find /tmp -name '*.tmp' -delete" },
          { flag: "-prune", description: "Não desce em um subdiretório (útil para excluir node_modules, .git).", example: "find . -name node_modules -prune -o -print" },
        ]}
      />

      <AlertBox type="danger" title="Cuidado com find + rm">
        Sempre teste seu comando <code>find</code> <strong>sem</strong> o <code>-delete</code> ou
        <code>-exec rm</code> primeiro, para visualizar os arquivos. Um critério errado pode apagar
        algo importante. Quando estiver inseguro, use <code>-exec rm -i {}</code> para confirmar cada um.
      </AlertBox>

      <h2>6. <code>locate</code> — Busca instantânea via índice</h2>
      <p>
        O <code>locate</code> é muito mais rápido que <code>find</code> porque consulta um banco
        de dados pré-indexado em vez de varrer o disco. A desvantagem: o índice precisa estar atualizado.
      </p>

      <TerminalBlock
        title="Instalando o plocate (versão moderna)"
        command="sudo pacman -S plocate"
        output={`resolving dependencies...
Packages (1) plocate-1.1.22-2

:: Proceed with installation? [Y/n] y
(1/1) installing plocate                                    [######] 100%
:: Running post-transaction hooks...
(1/1) Initializing plocate database (this may take a while)`}
      />

      <TerminalBlock
        title="Atualizar o índice (a primeira vez é obrigatório)"
        command="sudo updatedb"
        output={`(sem saída em sucesso — leva alguns segundos)`}
      />

      <TerminalBlock
        title="locate — busca instantânea"
        command="locate pacman.conf"
        output={`/etc/pacman.conf
/etc/pacman.conf.pacnew
/usr/share/pacman/defaults/pacman.conf
/usr/share/man/man5/pacman.conf.5.gz`}
      />

      <TerminalBlock
        title="locate -i — ignora caso; -c — conta resultados"
        lines={[
          { type: "command", text: "locate -i README | head -5" },
          { type: "output", text: `/etc/skel/README\n/usr/share/doc/bash/README\n/usr/share/doc/curl/README\n/usr/share/licenses/coreutils/README\n/home/user/projetos/site/README.md` },
          { type: "command", text: `locate -c "*.conf"` },
          { type: "output", text: "1842" },
        ]}
      />

      <CommandFlagList
        command="locate"
        items={[
          { flag: "-i", description: "Ignora maiúsculas/minúsculas.", example: "locate -i readme" },
          { flag: "-c", description: "Apenas conta os resultados, não imprime.", example: "locate -c .conf" },
          { flag: "-l N", description: "Limita aos primeiros N resultados.", example: "locate -l 10 .log" },
          { flag: "-e", description: "Mostra apenas arquivos que ainda existem (verifica no disco).", example: "locate -e bashrc" },
          { flag: "-r REGEX", description: "Usa expressão regular em vez de glob.", example: `locate -r "/etc/.*\\.conf$"` },
          { flag: "-b", description: "Casa apenas o basename (último componente do caminho).", example: "locate -b '\\pacman.conf'" },
        ]}
      />

      <AlertBox type="warning" title="O índice fica desatualizado">
        Arquivos criados <em>depois</em> do último <code>updatedb</code> não aparecem.
        O pacote <code>plocate</code> instala um timer systemd que roda diariamente:
        <code>systemctl status plocate-updatedb.timer</code>. Se precisar de algo agora, use <code>find</code>.
      </AlertBox>

      <h2>7. Localizar comandos: <code>which</code>, <code>whereis</code>, <code>type</code></h2>
      <p>
        Esses três comandos respondem perguntas diferentes sobre onde um programa está e o que ele é.
      </p>

      <TerminalBlock
        title="which — qual binário será executado?"
        lines={[
          { type: "command", text: "which pacman" },
          { type: "output", text: "/usr/bin/pacman" },
          { type: "command", text: "which python" },
          { type: "output", text: "/usr/bin/python" },
          { type: "command", text: "which programa_inexistente" },
          { type: "output", text: "(sem saída — exit code 1)" },
        ]}
      />

      <TerminalBlock
        title="whereis — binário + man + sources"
        command="whereis pacman"
        output={`pacman: /usr/bin/pacman /etc/pacman.conf /etc/pacman.d /usr/share/man/man8/pacman.8.gz`}
      />

      <TerminalBlock
        title="type — o que é esse comando? (built-in, alias, função, programa)"
        lines={[
          { type: "command", text: "type cd" },
          { type: "output", text: "cd is a shell builtin" },
          { type: "command", text: "type ls" },
          { type: "output", text: "ls is aliased to `ls --color=auto'" },
          { type: "command", text: "type pacman" },
          { type: "output", text: "pacman is /usr/bin/pacman" },
          { type: "command", text: "type for" },
          { type: "output", text: "for is a shell keyword" },
          { type: "command", text: "type -a python" },
          { type: "output", text: "python is /usr/bin/python\npython is /usr/local/bin/python" },
          { type: "comment", text: "type -a mostra TODAS as ocorrências no PATH (útil quando há conflito de versões)" },
        ]}
      />

      <h2>Tabela de Referência Rápida</h2>
      <CodeBlock
        title="Resumo dos comandos de navegação"
        code={`# NAVEGAÇÃO
pwd                   # Onde estou?
pwd -P                # Caminho real (resolve symlinks)
cd /caminho           # Caminho absoluto
cd pasta              # Caminho relativo
cd ..                 # Subir um nível
cd ~                  # Ir para $HOME
cd -                  # Voltar ao diretório anterior

# LISTAGEM
ls                    # Listar
ls -lah               # Detalhes + ocultos + tamanhos legíveis
ls -lhS               # Ordenar por tamanho
ls -lt                # Ordenar por data (mais recente primeiro)
ls -d */              # Apenas diretórios
tree -L 2             # Árvore até 2 níveis
tree -d -L 2          # Apenas diretórios até 2 níveis

# BUSCA
find . -name "*.txt"             # Por nome (recursivo, em tempo real)
find . -type f -size +100M       # Maiores que 100MB
find . -mtime -7                 # Modificados nos últimos 7 dias
find . -name "*.tmp" -delete     # Encontrar e apagar
locate arquivo                   # Busca instantânea (índice)
sudo updatedb                    # Atualizar índice do locate

# LOCALIZAR PROGRAMAS
which COMANDO                    # Caminho do executável
whereis COMANDO                  # Binário + man + sources
type COMANDO                     # O que é (builtin, alias, fn, prog)`}
      />

      <AlertBox type="success" title="Próximos passos">
        Agora que você sabe se mover e listar, o próximo passo é aprender a <strong>visualizar</strong>
        o conteúdo dos arquivos: <code>cat</code>, <code>less</code>, <code>head</code>, <code>tail</code>,
        <code>grep</code> e companhia. Veja a página de Visualização de Arquivos.
      </AlertBox>
    </PageContainer>
  );
}
