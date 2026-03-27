import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Redirecionamento() {
  return (
    <PageContainer
      title="Redirecionamento e Pipes"
      subtitle="stdin, stdout, stderr, pipes e redirecionamentos — conectando comandos e controlando o fluxo de dados no terminal."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <p>
        Uma das funcionalidades mais poderosas do terminal Linux é a capacidade de conectar
        comandos entre si, enviando a saída de um como entrada de outro. Isso permite criar
        fluxos de processamento complexos com comandos simples.
      </p>

      <h2>Streams: stdin, stdout, stderr</h2>
      <CodeBlock
        title="Os três streams padrão do Linux"
        code={`# Cada processo tem três canais de comunicação:
# stdin  (0) = entrada padrão  (por padrão: teclado)
# stdout (1) = saída padrão    (por padrão: tela do terminal)
# stderr (2) = saída de erro   (por padrão: tela do terminal)

# Quando você digita um comando:
ls /home
# ls lê argumentos, processa, e escreve resultado em stdout (tela)

# Quando há um erro:
ls /diretorio-inexistente
# ls escreve a mensagem de erro em stderr (também aparece na tela)

# Você pode redirecionar esses streams independentemente`}
      />

      <h2>Redirecionamento de Saída</h2>
      <CodeBlock
        title="Salvando saídas em arquivos"
        code={`# > Redirecionar stdout para arquivo (cria ou SOBRESCREVE)
ls -la /home > lista-arquivos.txt
date > /tmp/data-atual.txt

# >> Redirecionar stdout para arquivo (ADICIONA ao final)
echo "Nova entrada" >> log.txt
date >> /tmp/historico.txt

# 2> Redirecionar apenas stderr para arquivo
ls /diretorio-inexistente 2> erros.txt
sudo apt update 2> /tmp/apt-erros.log

# 2>> Adicionar stderr ao arquivo (sem sobrescrever)
comando-com-erro 2>> /tmp/erros.log

# Redirecionar stdout E stderr para o mesmo arquivo
sudo apt upgrade > /tmp/saida-completa.log 2>&1
# Ou forma mais moderna (bash 4+):
sudo apt upgrade &> /tmp/saida-completa.log

# Adicionar stdout E stderr ao arquivo:
comando >> /tmp/log.txt 2>&1

# Descartar saída indesejada (jogar no /dev/null)
comando > /dev/null        # Descartar stdout
comando 2> /dev/null       # Descartar stderr
comando > /dev/null 2>&1   # Descartar tudo`}
      />

      <h2>Redirecionamento de Entrada</h2>
      <CodeBlock
        title="Alimentando comandos com arquivos"
        code={`# < Redirecionar arquivo para stdin
sort < lista-desordenada.txt

# Contar linhas de um arquivo
wc -l < /var/log/syslog

# Enviar texto de múltiplas linhas como stdin (Here Document)
cat << EOF
Linha 1
Linha 2
Linha 3
EOF

# Here Document para criar arquivo:
cat << EOF > /tmp/configuracao.txt
host=localhost
port=3306
user=admin
EOF

# Here String — enviar string como stdin
grep "erro" <<< "Esta linha tem um erro aqui"
base64 <<< "texto para codificar"`}
      />

      <h2>Pipes — Encadeando Comandos</h2>
      <CodeBlock
        title="Conectando comandos com | (pipe)"
        code={`# O pipe | conecta stdout de um comando ao stdin do próximo
comando1 | comando2 | comando3

# Exemplos básicos:
ls -la | grep ".txt"           # Listar apenas arquivos .txt
cat /etc/passwd | grep joao   # Filtrar linha do usuário
history | tail -20             # Ver últimos 20 comandos

# Contar arquivos em um diretório:
ls /var/log | wc -l

# Ver processos em ordem de uso de memória:
ps aux | sort -k4 -rn | head -10

# Ver os IPs que mais aparecem em um log:
grep "Failed password" /var/log/auth.log | \\
    grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' | \\
    sort | \\
    uniq -c | \\
    sort -rn | \\
    head -10

# Buscar e matar todos os processos de um programa:
pgrep firefox | xargs kill -9

# Processamento em pipeline com múltiplos comandos:
cat /var/log/nginx/access.log | \\
    cut -d'"' -f2 | \\     # Extrair método + URL
    sort | \\               # Ordenar
    uniq -c | \\            # Contar ocorrências
    sort -rn | \\           # Ordenar por frequência
    head -20                # Top 20 URLs mais acessadas`}
      />

      <h2>tee — Bifurcar a Saída</h2>
      <CodeBlock
        title="Salvar e exibir ao mesmo tempo com tee"
        code={`# tee lê stdin, escreve em stdout E em arquivo ao mesmo tempo
# (como fazer um "T" no fluxo de dados — daí o nome)

# Salvar saída no arquivo E mostrar na tela:
sudo apt update | tee /tmp/apt-update.log

# Adicionar ao arquivo em vez de sobrescrever:
sudo apt upgrade | tee -a /tmp/apt.log

# Salvar em múltiplos arquivos ao mesmo tempo:
ls -la | tee arquivo1.txt arquivo2.txt

# Uso muito comum: executar comando como root mas manter log:
sudo apt install nginx | tee /tmp/nginx-install.log 2>&1`}
      />

      <h2>xargs — Passar Saída como Argumentos</h2>
      <CodeBlock
        title="xargs: transformar stdin em argumentos"
        code={`# xargs converte linhas do stdin em argumentos de outro comando

# Problema: rm não aceita stdin, só argumentos
find /tmp -name "*.log" | rm    # ERRADO!
find /tmp -name "*.log" | xargs rm   # CORRETO

# Exemplos práticos:

# Matar todos os processos do chrome:
pgrep chrome | xargs kill -9

# Baixar uma lista de URLs:
cat urls.txt | xargs wget -P /downloads/

# Instalar lista de pacotes de um arquivo:
cat pacotes.txt | xargs sudo apt install -y

# Compactar múltiplos arquivos individuais:
find /backup -name "*.log" | xargs gzip

# Com substituição de placeholder {}:
find . -name "*.txt" | xargs -I{} cp {} /backup/

# Limitar o número de argumentos por chamada:
echo "a b c d e f" | xargs -n 2 echo
# a b
# c d
# e f

# Executar em paralelo (muito útil para tarefas demoradas):
cat servidores.txt | xargs -P 4 -I{} ssh {} "sudo apt update"`}
      />

      <h2>Substituição de Comandos</h2>
      <CodeBlock
        title="Capturar saída de comandos"
        code={`# Forma moderna: \$( )
data=\$(date +%Y-%m-%d)
usuario=\$(whoami)
ip=\$(hostname -I | awk '{print \$1}')

echo "Data: \$data"
echo "Usuário: \$usuario"
echo "IP: \$ip"

# Usar resultado diretamente em comando:
echo "Arquivos: \$(ls | wc -l)"
cd \$(dirname /etc/nginx/nginx.conf)

# Aninhamento:
echo "PID do bash: \$(echo \$\$)"

# Forma antiga com crases (ainda funciona mas não recomendado):
data=\`date +%Y-%m-%d\`   # evitar — use \$()

# Exemplo prático: criar nome de arquivo com data
tar -czf "backup_\$(date +%Y%m%d_%H%M%S).tar.gz" /home/joao/`}
      />
    </PageContainer>
  );
}
