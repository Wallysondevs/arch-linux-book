import { PageContainer } from "@/components/layout/PageContainer";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ScriptsBash() {
  return (
    <PageContainer
      title="Scripts em Bash"
      subtitle="Shebang, set -euo pipefail, argumentos, condicionais, loops, funções, arrays, traps e exemplos completos rodando em Arch."
      difficulty="intermediario"
      timeToRead="45 min"
      category="Shell"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch com terminal.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Shebang</strong> — primeira linha <code>#!/bin/bash</code> ou <code>#!/usr/bin/env bash</code>.
      </p>
      <p>
        <strong>chmod +x</strong> — dá permissão de execução para o script.
      </p>
      <p>
        <strong>Argumentos posicionais</strong> — <code>{"\$1, \$2, \$@"}</code> — argumentos individuais e a lista completa.
      </p>
      <p>
        <strong>set -euo pipefail</strong> — boas práticas: erra ao primeiro erro, ao usar var indefinida, e dentro de pipe.
      </p>
      <p>
        <strong>Função</strong> — bloco reutilizável definido com <code>{"nome() { ... }"}</code>.
      </p>

      <p>
        Um <em>script</em> é apenas um arquivo de texto com comandos que o shell executa
        em ordem. No Arch o <code>bash</code> já vem instalado por padrão (pacote{" "}
        <code>bash</code> do grupo <code>base</code>). Esta página é um guia compacto e
        prático: do shebang ao <code>trap</code>, passando por <code>getopts</code>,{" "}
        arrays, <code>case</code>, funções e os boas práticas que fazem um script ser
        confiável em produção.
      </p>

      <AlertBox type="info" title="Pré-requisitos">
        Já instalados: <code>bash</code>, <code>coreutils</code>, <code>grep</code>,{" "}
        <code>sed</code>, <code>awk</code> (gawk). Recomendados:{" "}
        <code>sudo pacman -S shellcheck bash-completion</code> para validar a sintaxe e
        completar comandos.
      </AlertBox>

      <h2>1. Anatomia de um script</h2>

      <CodeBlock
        title="hello.sh — primeiro script"
        language="bash"
        code={`#!/usr/bin/env bash
# hello.sh — saúda o usuário atual

echo "Olá, $USER! Hoje é $(date +%F) às $(date +%T)."
echo "Você está em $PWD rodando $(uname -srm)."
`}
      />

      <TerminalBlock
        comment="dar permissão de execução e rodar"
        command="chmod +x hello.sh && ./hello.sh"
        output={`Olá, joao! Hoje é 2026-03-26 às 14:32:08.
Você está em /home/joao/scripts rodando Linux 6.12.1-arch1-1 x86_64.`}
      />

      <h3>Shebang — qual interpretador usar?</h3>

      <OutputBlock
        title="formas comuns de shebang"
        output={`#!/bin/bash               # caminho fixo (assume /bin/bash existe)
#!/usr/bin/env bash       # mais portável: usa o bash do PATH
#!/usr/bin/env -S bash -e # passa flags ao bash (Linux moderno)
#!/usr/bin/env python3    # script python
#!/bin/sh                 # POSIX shell (sh = bash em modo posix no Arch via /bin/sh -> bash)`}
        annotations={[
          { line: 1, note: "preferido — funciona se /bin/bash for /usr/bin/bash" },
          { line: 4, note: "no Arch /bin/sh é symlink para bash" },
        ]}
      />

      <AlertBox type="warning" title="No Arch, /bin é /usr/bin">
        Desde 2012 o Arch fez o <em>usrmerge</em>: <code>/bin</code>, <code>/sbin</code>{" "}
        e <code>/lib</code> são <em>symlinks</em> para <code>/usr/bin</code> e{" "}
        <code>/usr/lib</code>. Por isso <code>#!/bin/bash</code> funciona, mas{" "}
        <code>#!/usr/bin/env bash</code> ainda é o padrão recomendado.
      </AlertBox>

      <h2>2. Strict mode — as três flags que salvam vidas</h2>

      <CodeBlock
        title="boilerplate seguro"
        language="bash"
        code={`#!/usr/bin/env bash
set -euo pipefail
IFS=$'\\n\\t'

# -e             sai imediatamente em qualquer erro (exit code != 0)
# -u             variável não-definida = erro fatal
# -o pipefail    pipe falha se QUALQUER etapa falhar (não só a última)
# IFS=...        evita word-splitting em espaços (separa só por \\n e \\t)
`}
      />

      <TerminalBlock
        comment="exemplo: sem strict mode, o bug passa silencioso"
        command={`bash -c 'cat /arquivo/que/nao/existe | wc -l; echo "tudo ok"'`}
        output={`cat: /arquivo/que/nao/existe: No such file or directory
0
tudo ok`}
      />

      <TerminalBlock
        comment="com pipefail, o pipe falha"
        command={`bash -c 'set -eo pipefail; cat /arquivo/que/nao/existe | wc -l; echo "tudo ok"'`}
        exitCode={1}
        output={`cat: /arquivo/que/nao/existe: No such file or directory`}
      />

      <h2>3. Variáveis</h2>

      <CodeBlock
        title="declaração e expansão"
        language="bash"
        code={`nome="Arch"
versao=2026

# expansão simples
echo "$nome $versao"          # Arch 2026

# expansão entre chaves (recomendado em strings concatenadas)
echo "\${nome}_linux"          # Arch_linux

# variável read-only
readonly PI=3.14159
PI=4                          # bash: PI: readonly variable

# default se não-definida
echo "\${EDITOR:-nano}"        # nano se EDITOR vazio

# erro se não-definida (com -u já ajuda)
echo "\${OBRIGATORIA:?precisa setar OBRIGATORIA}"

# substring
str="archlinux"
echo "\${str:0:4}"             # arch
echo "\${str: -5}"             # linux

# tamanho
echo "\${#str}"                # 9
`}
      />

      <h3>Argumentos da linha de comando</h3>

      <OutputBlock
        title="variáveis especiais"
        output={`$0       nome do script (ex: ./meu.sh)
$1..$9   primeiro a nono argumento
\${10}    décimo (precisa chaves)
$#       número de argumentos
$@       todos como lista ("a" "b" "c")
$*       todos como string única ("a b c")
$?       exit code do último comando
$$       PID do shell atual
$!       PID do último processo em background
$_       último argumento do último comando`}
      />

      <CodeBlock
        title="args.sh"
        language="bash"
        code={`#!/usr/bin/env bash
echo "script: $0"
echo "argc:   $#"
echo "todos:  $@"
for arg in "$@"; do
    echo "  -> $arg"
done`}
      />

      <TerminalBlock
        command="./args.sh foo bar 'meu valor' baz"
        output={`script: ./args.sh
argc:   4
todos:  foo bar meu valor baz
  -> foo
  -> bar
  -> meu valor
  -> baz`}
      />

      <h2>4. Condicionais — if, [[ ]], case</h2>

      <CodeBlock
        title="if / elif / else"
        language="bash"
        code={`#!/usr/bin/env bash
arquivo="/etc/pacman.conf"

if [[ -f "$arquivo" ]]; then
    echo "$arquivo é arquivo regular"
elif [[ -d "$arquivo" ]]; then
    echo "$arquivo é diretório"
else
    echo "$arquivo não existe"
fi

# operadores numéricos
n=42
if (( n > 40 && n < 50 )); then
    echo "$n está na faixa"
fi

# combinando com &&/||
[[ -f /etc/os-release ]] && grep '^NAME=' /etc/os-release
`}
      />

      <CommandFlagList
        command="test / [ ] / [[ ]]"
        items={[
          { flag: "-f ARQ", description: "Existe e é arquivo regular." },
          { flag: "-d DIR", description: "Existe e é diretório." },
          { flag: "-L LINK", description: "É um link simbólico." },
          { flag: "-r / -w / -x", description: "Tem permissão de leitura/escrita/execução." },
          { flag: "-s ARQ", description: "Existe e tem tamanho > 0." },
          { flag: "-z STR", description: "String vazia." },
          { flag: "-n STR", description: "String não-vazia." },
          { flag: "STR1 = STR2", description: "Strings iguais (em [[ ]] use ==)." },
          { flag: "STR1 != STR2", description: "Strings diferentes." },
          { flag: "STR =~ REGEX", description: "Match regex (só em [[ ]]).", example: '[[ "$x" =~ ^[0-9]+$ ]]' },
          { flag: "N -eq M", description: "Igual numérico. Outros: -ne -lt -le -gt -ge." },
          { flag: "ARQ1 -nt ARQ2", description: "ARQ1 mais novo que ARQ2 (newer than)." },
        ]}
      />

      <CodeBlock
        title="case — múltiplos padrões"
        language="bash"
        code={`#!/usr/bin/env bash
case "$1" in
    start|up)
        echo "iniciando..."
        ;;
    stop|down)
        echo "parando..."
        ;;
    status)
        echo "status..."
        ;;
    -h|--help|"")
        echo "uso: $0 {start|stop|status}"
        ;;
    *)
        echo "comando desconhecido: $1" >&2
        exit 2
        ;;
esac`}
      />

      <h2>5. Loops — for, while, until</h2>

      <CodeBlock
        title="for em lista, faixa e arquivos"
        language="bash"
        code={`# lista literal
for cor in vermelho verde azul; do
    echo "$cor"
done

# faixa numérica (brace expansion)
for i in {1..5}; do
    echo "iter $i"
done

# C-style
for ((i=0; i<5; i++)); do
    printf "%02d\\n" "$i"
done

# arquivos (cuidado: use quotes!)
for f in /etc/*.conf; do
    [[ -f "$f" ]] || continue
    echo "$(wc -l <"$f") linhas em $f"
done`}
      />

      <CodeBlock
        title="while ler linha a linha de um arquivo"
        language="bash"
        code={`#!/usr/bin/env bash
# IFS= preserva espaços; -r não interpreta \\
while IFS= read -r linha; do
    echo "[$linha]"
done < /etc/hostname

# while + pipe (cuidado: subshell perde variáveis!)
contador=0
grep -c '^' /etc/passwd | while read -r n; do
    contador=$n   # essa atribuição vive só no subshell
done
echo "contador (errado): $contador"   # 0

# forma correta com process substitution
contador=0
while read -r _; do
    ((contador++))
done < <(grep -v '^#' /etc/passwd)
echo "contador (certo): $contador"`}
      />

      <h2>6. Funções</h2>

      <CodeBlock
        title="definição, retorno e variáveis locais"
        language="bash"
        code={`#!/usr/bin/env bash

# definição clássica
saudar() {
    local nome="\${1:-mundo}"
    echo "olá, $nome"
}

# retorno por exit code (0..255)
ehpar() {
    local n="$1"
    (( n % 2 == 0 ))    # último comando vira o exit code
}

# retorno por stdout (mais comum em bash)
soma() {
    echo $(( $1 + $2 ))
}

saudar "Arch"            # olá, Arch
ehpar 42 && echo "par"   # par
total=$(soma 3 4)
echo "total=$total"      # total=7
`}
      />

      <h2>7. Arrays</h2>

      <CodeBlock
        title="arrays indexados e associativos"
        language="bash"
        code={`#!/usr/bin/env bash

# array indexado
distros=("arch" "fedora" "debian" "void")
echo "\${distros[0]}"        # arch
echo "\${distros[@]}"        # todos
echo "\${#distros[@]}"       # 4
distros+=("nixos")           # append

for d in "\${distros[@]}"; do
    echo "- $d"
done

# array associativo (precisa declare -A)
declare -A pkg_mgr=(
    [arch]="pacman"
    [fedora]="dnf"
    [debian]="apt"
    [void]="xbps"
)

echo "\${pkg_mgr[arch]}"     # pacman
for distro in "\${!pkg_mgr[@]}"; do
    echo "$distro -> \${pkg_mgr[$distro]}"
done`}
      />

      <TerminalBlock
        command="bash arrays.sh"
        output={`arch
arch fedora debian void
4
- arch
- fedora
- debian
- void
- nixos
pacman
arch -> pacman
fedora -> dnf
debian -> apt
void -> xbps`}
      />

      <h2>8. Exit codes e tratamento de erros</h2>

      <OutputBlock
        title="convenção de exit codes"
        output={`0       sucesso
1       erro genérico
2       uso incorreto / args inválidos
126     comando encontrado mas não executável
127     comando não encontrado
128+N   morto pelo sinal N (130 = Ctrl+C, 137 = kill -9)`}
      />

      <CodeBlock
        title="trap — limpeza ao sair"
        language="bash"
        code={`#!/usr/bin/env bash
set -euo pipefail

TMP=$(mktemp -d)
echo "trabalho em $TMP"

cleanup() {
    local rc=$?
    echo ">> cleanup (rc=$rc)"
    rm -rf "$TMP"
}
trap cleanup EXIT INT TERM

# trabalho real
touch "$TMP/dados.txt"
echo "criado $TMP/dados.txt"
sleep 2
echo "fim normal"`}
      />

      <TerminalBlock
        command="./trap.sh"
        output={`trabalho em /tmp/tmp.AbC123XyZ
criado /tmp/tmp.AbC123XyZ/dados.txt
fim normal
>> cleanup (rc=0)`}
      />

      <TerminalBlock
        comment="se você apertar Ctrl+C no meio (sinal INT = 130)"
        command="./trap.sh"
        exitCode={130}
        output={`trabalho em /tmp/tmp.XyZ987
criado /tmp/tmp.XyZ987/dados.txt
^C
>> cleanup (rc=130)`}
      />

      <h2>9. getopts — parsing de flags</h2>

      <CodeBlock
        title="parseargs.sh — uso típico"
        language="bash"
        code={`#!/usr/bin/env bash
set -euo pipefail

verbose=0
saida=""

uso() {
    cat <<EOF
uso: $0 [-v] [-o ARQ] [-h] alvos...
  -v          verbose
  -o ARQ      escreve resultado em ARQ
  -h          mostra esta ajuda
EOF
}

while getopts ":vo:h" opt; do
    case $opt in
        v) verbose=1 ;;
        o) saida=$OPTARG ;;
        h) uso; exit 0 ;;
        \\?) echo "opção inválida: -$OPTARG" >&2; uso; exit 2 ;;
        :)  echo "-$OPTARG requer argumento" >&2; exit 2 ;;
    esac
done
shift $((OPTIND - 1))

(( verbose )) && echo "verbose=on saida=\${saida:-stdout} alvos=$#"
for alvo in "$@"; do
    echo "processando $alvo"
done`}
      />

      <TerminalBlock
        command="./parseargs.sh -v -o out.txt foo bar"
        output={`verbose=on saida=out.txt alvos=2
processando foo
processando bar`}
      />

      <h2>10. Exemplo completo: backup incremental para Arch</h2>

      <CodeBlock
        title="/usr/local/bin/backup-home.sh"
        language="bash"
        code={`#!/usr/bin/env bash
#
# backup-home.sh — snapshot incremental de /home com rsync --link-dest
# Arch: requer rsync (já no base-devel) e cron/timer para agendar
#
set -euo pipefail
IFS=$'\\n\\t'

readonly SRC="/home/"
readonly DEST_BASE="/mnt/backup/home"
readonly LATEST="$DEST_BASE/latest"
readonly STAMP=$(date +%Y-%m-%d_%H-%M)
readonly NOW="$DEST_BASE/$STAMP"
readonly LOG="/var/log/backup-home.log"
readonly EXCLUDES=(
    --exclude='.cache/'
    --exclude='.local/share/Trash/'
    --exclude='node_modules/'
    --exclude='.steam/'
)

log() { printf '[%s] %s\\n' "$(date +%FT%T)" "$*" | tee -a "$LOG" >&2; }
fail() { log "FAIL: $*"; exit 1; }

require_root() { [[ $EUID -eq 0 ]] || fail "rode como root (sudo)"; }
require_dest() { [[ -d $DEST_BASE ]] || fail "$DEST_BASE não montado"; }

main() {
    require_root
    require_dest

    log "iniciando snapshot em $NOW"
    mkdir -p "$NOW"

    local link_arg=()
    [[ -d $LATEST ]] && link_arg=(--link-dest="$LATEST")

    rsync -aAXH --delete --info=stats2,progress2 \\
        "\${EXCLUDES[@]}" "\${link_arg[@]}" \\
        "$SRC" "$NOW/" || fail "rsync falhou"

    rm -f "$LATEST"
    ln -s "$NOW" "$LATEST"

    log "ok — snapshot $STAMP completo"

    # rotação: mantém últimos 14
    find "$DEST_BASE" -maxdepth 1 -mindepth 1 -type d -name '20*' \\
        | sort -r | tail -n +15 | xargs -r rm -rf
    log "rotação aplicada"
}

main "$@"`}
      />

      <TerminalBlock
        command="sudo /usr/local/bin/backup-home.sh"
        output={`[2026-03-26T03:00:01] iniciando snapshot em /mnt/backup/home/2026-03-26_03-00
              412,938 files
            8.7G/8.7G (100%)
[2026-03-26T03:14:42] ok — snapshot 2026-03-26_03-00 completo
[2026-03-26T03:14:42] rotação aplicada`}
      />

      <h2>11. Debug e validação</h2>

      <CommandFlagList
        command="bash"
        items={[
          { flag: "-n", description: "Verifica sintaxe SEM executar.", example: "bash -n script.sh" },
          { flag: "-x", description: "Imprime cada comando antes de executar (xtrace).", example: "bash -x script.sh" },
          { flag: "-v", description: "Imprime cada linha do script ao ler." },
          { flag: "-c CMD", description: "Executa CMD diretamente sem arquivo." },
        ]}
      />

      <TerminalBlock
        command="bash -x hello.sh"
        output={`+ echo 'Olá, joao! Hoje é 2026-03-26 às 14:32:08.'
Olá, joao! Hoje é 2026-03-26 às 14:32:08.
+ echo 'Você está em /home/joao/scripts rodando Linux 6.12.1-arch1-1 x86_64.'
Você está em /home/joao/scripts rodando Linux 6.12.1-arch1-1 x86_64.`}
      />

      <TerminalBlock
        comment="dentro do script: liga/desliga xtrace pontual"
        command={`bash -c 'echo on; set -x; ls /etc/hostname; set +x; echo off'`}
        output={`on
+ ls /etc/hostname
/etc/hostname
+ set +x
off`}
      />

      <h3>shellcheck — o linter obrigatório</h3>

      <TerminalBlock
        command="sudo pacman -S shellcheck"
        output={`Packages (1)  shellcheck-0.10.0-1
Total Installed Size:  35.8 MiB`}
      />

      <TerminalBlock
        command="shellcheck backup-home.sh"
        output={`In backup-home.sh line 27:
    [[ -d $DEST_BASE ]] || fail "$DEST_BASE não montado"
          ^---------^ {y}SC2086{/}: Double quote to prevent globbing and word splitting.

Did you mean:
    [[ -d "$DEST_BASE" ]] || fail "$DEST_BASE não montado"

For more information:
  https://www.shellcheck.net/wiki/SC2086 -- Double quote to prevent globbing ...`}
      />

      <AlertBox type="success" title="Receita do iniciado">
        Para todo script &gt; 20 linhas: <strong>(1)</strong> shebang com{" "}
        <code>env bash</code>, <strong>(2)</strong> <code>set -euo pipefail</code>,{" "}
        <strong>(3)</strong> rode <code>shellcheck</code>, <strong>(4)</strong> use{" "}
        <code>trap cleanup EXIT</code> se criar arquivos temporários,{" "}
        <strong>(5)</strong> sempre <code>"</code>aspas<code>"</code> em variáveis.
        Isso elimina ~80% dos bugs típicos de shell.
      </AlertBox>

      <h2>12. Cola visual — sobrevivência rápida</h2>

      <OutputBlock
        title="receitas curtas"
        output={`# pega 2ª coluna de um log
awk '{print $2}' arquivo.log

# soma uma coluna
awk '{s+=$1} END{print s}' nums.txt

# se arquivo existe...
[[ -f /etc/pacman.conf ]] && echo existe

# loop de arquivos com espaço
find . -name '*.jpg' -print0 | while IFS= read -rd '' f; do
    echo "$f"
done

# default de variável
porta="\${PORT:-8080}"

# captura saída + exit code
saida=$(comando 2>&1) && rc=0 || rc=$?

# argv parsing rápido
case "$1" in -v) verbose=1 ;; *) ;; esac`}
      />
    </PageContainer>
  );
}
