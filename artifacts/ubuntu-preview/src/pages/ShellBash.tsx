import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ShellBash() {
  return (
    <PageContainer
      title="Shell Bash e Scripting"
      subtitle="Variáveis, condicionais, loops, funções e boas práticas de scripting Bash — do básico ao intermediário."
      difficulty="intermediario"
      timeToRead="30 min"
    >
      <p>
        O <strong>Bash</strong> (Bourne Again SHell) é o shell padrão do Ubuntu. Além de
        interpretar seus comandos interativos, ele é uma linguagem de programação completa
        para automação de tarefas. Saber escrever scripts Bash é uma das habilidades mais
        úteis para qualquer usuário de Linux.
      </p>

      <h2>Variáveis</h2>
      <CodeBlock
        title="Trabalhando com variáveis"
        code={`# Definir variável (sem espaços ao redor do =!)
nome="João"
idade=25
cidade="São Paulo"

# Usar variável (adicione $ antes do nome)
echo "Olá, $nome!"
echo "Você tem $idade anos."

# Forma segura: chaves para evitar ambiguidade
echo "Arquivo: \${nome}_backup.txt"

# Variáveis de ambiente
echo $HOME        # /home/joao
echo $USER        # joao
echo $PATH        # lista de diretórios para buscar executáveis
echo $SHELL       # /bin/bash
echo $PWD         # diretório atual
echo $HOSTNAME    # nome do computador
echo $$           # PID do shell atual
echo $?           # código de saída do último comando (0 = sucesso)

# Tornar variável exportável para processos filhos
export MINHA_VAR="valor"
export JAVA_HOME="/usr/lib/jvm/java-21-openjdk"

# Variável somente leitura
readonly CONSTANTE="valor-fixo"

# Variável com substituição de comando
data_atual=\$(date +%Y-%m-%d)
arquivos=\$(ls /home/joao/ | wc -l)
echo "Hoje é \$data_atual"

# Aritmética com (( ))
resultado=$((10 + 5 * 2))
echo $resultado   # 20

# Aritmética com let
let x=5
let x=x+3
echo $x   # 8`}
      />

      <h2>Seu Primeiro Script</h2>
      <CodeBlock
        title="Estrutura básica de um script Bash"
        code={`#!/bin/bash
# A primeira linha (shebang) diz ao sistema qual interpretador usar

# Comentários começam com #

# Variáveis
NOME="Mundo"

# Executar comando
echo "Olá, \$NOME!"

# Verificar argumento de linha de comando
# $1 = primeiro argumento, $2 = segundo, etc.
# $0 = nome do script
# $# = número de argumentos
# $@ = todos os argumentos

echo "Script: \$0"
echo "Argumentos: \$#"
echo "Primeiro: \$1"

# --- Como usar ---
# Salve como: meu-script.sh
# Dê permissão de execução:
chmod +x meu-script.sh

# Execute:
./meu-script.sh argumento1 argumento2

# Ou explicite o interpretador:
bash meu-script.sh`}
      />

      <h2>Condicionais — if/elif/else</h2>
      <CodeBlock
        title="Estruturas condicionais"
        code={`#!/bin/bash

# if/elif/else básico
nota=7

if [ \$nota -ge 9 ]; then
    echo "Aprovado com Distinção!"
elif [ \$nota -ge 6 ]; then
    echo "Aprovado"
else
    echo "Reprovado"
fi

# Operadores numéricos:
# -eq = igual           (== não funciona com [ ])
# -ne = diferente
# -gt = maior que
# -ge = maior ou igual
# -lt = menor que
# -le = menor ou igual

# Comparação de strings
cidade="São Paulo"
if [ "\$cidade" = "São Paulo" ]; then
    echo "Bem-vindo à capital!"
fi

# Testar existência de arquivo/diretório
if [ -f /etc/hosts ]; then
    echo "Arquivo /etc/hosts existe"
fi

if [ -d /home/joao ]; then
    echo "Diretório home existe"
fi

if [ -x /usr/bin/python3 ]; then
    echo "Python3 é executável"
fi

# Teste de string vazia
nome=""
if [ -z "\$nome" ]; then
    echo "Nome está vazio"
fi
if [ -n "\$nome" ]; then
    echo "Nome tem conteúdo"
fi

# Operadores lógicos
if [ \$nota -ge 6 ] && [ \$nota -le 10 ]; then
    echo "Aprovado com nota válida"
fi

if [ "\$cidade" = "SP" ] || [ "\$cidade" = "São Paulo" ]; then
    echo "É São Paulo"
fi`}
      />

      <h2>Loops</h2>
      <CodeBlock
        title="for, while e until"
        code={`#!/bin/bash

# for loop — iterar em lista
for fruta in maçã banana laranja pera; do
    echo "Fruta: \$fruta"
done

# for loop — iterar em arquivos
for arquivo in /var/log/*.log; do
    echo "Log: \$arquivo ($(wc -l < "\$arquivo") linhas)"
done

# for loop — intervalo numérico
for i in {1..10}; do
    echo "Número: \$i"
done

# for loop — estilo C
for ((i=0; i<5; i++)); do
    echo "Iteração \$i"
done

# while loop — enquanto condição for verdadeira
contador=1
while [ \$contador -le 5 ]; do
    echo "Contagem: \$contador"
    ((contador++))
done

# while loop — ler linhas de um arquivo
while IFS= read -r linha; do
    echo "Linha: \$linha"
done < /etc/hosts

# until loop — até que condição seja verdadeira
tentativas=0
until ping -c 1 google.com &>/dev/null; do
    echo "Sem internet... tentativa \$((++tentativas))"
    sleep 5
done
echo "Conectado após \$tentativas tentativas!"

# break e continue
for i in {1..10}; do
    if [ \$i -eq 5 ]; then
        continue    # Pular o 5
    fi
    if [ \$i -eq 8 ]; then
        break       # Parar no 8
    fi
    echo \$i
done`}
      />

      <h2>Funções</h2>
      <CodeBlock
        title="Definindo e usando funções"
        code={`#!/bin/bash

# Definir função
saudacao() {
    echo "Olá, \$1!"    # \$1 = primeiro argumento da função
}

# Chamar função
saudacao "João"
saudacao "Maria"

# Função com retorno (usando echo para capturar resultado)
soma() {
    echo \$((\$1 + \$2))
}
resultado=\$(soma 3 5)
echo "3 + 5 = \$resultado"

# Função com variáveis locais
calcular() {
    local a=\$1
    local b=\$2
    local resultado=\$((a * b))
    echo \$resultado
}

# Função prática: verificar se pacote está instalado
esta_instalado() {
    dpkg -l "\$1" &>/dev/null
    return \$?   # retorna 0 se instalado, 1 se não
}

if esta_instalado nginx; then
    echo "Nginx está instalado"
else
    echo "Nginx não está instalado"
    sudo apt install -y nginx
fi`}
      />

      <h2>Arrays</h2>
      <CodeBlock
        title="Trabalhando com arrays"
        code={`#!/bin/bash

# Criar array
frutas=("maçã" "banana" "laranja" "pera")
servidores=("web1" "web2" "db1" "cache1")

# Acessar elemento
echo \${frutas[0]}        # maçã (índice começa em 0)
echo \${frutas[2]}        # laranja

# Ver todos os elementos
echo \${frutas[@]}
echo \${servidores[@]}

# Tamanho do array
echo \${#frutas[@]}       # 4

# Adicionar elemento
frutas+=("uva")

# Iterar no array
for fruta in "\${frutas[@]}"; do
    echo "Fruta: \$fruta"
done

# Fatiar array (do índice 1, pegar 2 elementos)
echo \${frutas[@]:1:2}    # banana laranja`}
      />

      <h2>Tratamento de Erros</h2>
      <CodeBlock
        title="Tornando scripts mais robustos"
        code={`#!/bin/bash

# Parar o script ao primeiro erro (muito recomendado!)
set -e

# Também reportar variáveis não definidas como erro
set -u

# Também tratar erros em pipes
set -o pipefail

# Forma completa (inicia todos os scripts assim):
set -euo pipefail

# Verificar código de saída de comandos
sudo apt update
if [ \$? -ne 0 ]; then
    echo "ERRO: apt update falhou!"
    exit 1
fi

# Forma mais elegante com ||
sudo apt update || { echo "ERRO: apt update falhou!"; exit 1; }

# Trap: executar código ao sair (cleanup)
limpar() {
    echo "Limpando arquivos temporários..."
    rm -f /tmp/meu-script-*.tmp
}
trap limpar EXIT      # Executar ao sair (normal ou erro)
trap limpar ERR       # Executar ao ocorrer erro

# Exemplo de script robusto completo:
#!/bin/bash
set -euo pipefail

BACKUP_DIR="/mnt/backup/\$(date +%Y-%m-%d)"

# Verificar se é root
if [ "\$(id -u)" -ne 0 ]; then
    echo "ERRO: Este script precisa ser executado como root" >&2
    exit 1
fi

mkdir -p "\$BACKUP_DIR"
echo "Backup iniciado em \$BACKUP_DIR"
tar -czf "\$BACKUP_DIR/home.tar.gz" /home/
echo "Backup concluído com sucesso!"`}
      />
    </PageContainer>
  );
}
