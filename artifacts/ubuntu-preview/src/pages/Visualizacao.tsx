import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Visualizacao() {
  return (
    <PageContainer
      title="Visualizando Arquivos e Logs"
      subtitle="cat, less, head, tail, grep, wc — lendo, filtrando e analisando conteúdo de arquivos de forma eficiente."
      difficulty="iniciante"
      timeToRead="15 min"
    >
      <p>
        Saber ler e filtrar conteúdo de arquivos é fundamental no Linux — especialmente para
        analisar logs, verificar configurações e processar dados. Esses comandos são suas
        ferramentas de leitura e inspeção do dia a dia.
      </p>

      <h2>cat — Mostrar Conteúdo de Arquivos</h2>
      <CodeBlock
        title="cat: concatenar e exibir arquivos"
        code={`# Exibir o conteúdo de um arquivo na tela
cat arquivo.txt
# cat = concatenate (concatenar). Pode mostrar um ou vários arquivos em sequência.

# Exibir múltiplos arquivos em sequência (um após o outro)
cat arquivo1.txt arquivo2.txt

# -n = number (numerar as linhas)
cat -n arquivo.txt
# Saída:
#      1	Primeira linha
#      2	Segunda linha
#      3	Terceira linha

# -A = show all (mostrar tudo, incluindo caracteres especiais)
# Tabs aparecem como ^I, fim de linha como $
# Útil para detectar problemas de formatação em scripts
cat -A script.sh

# Criar um arquivo novo digitando o conteúdo diretamente:
cat > novo-arquivo.txt
# Digite o conteúdo, pressione Enter para nova linha.
# Pressione Ctrl+D quando terminar (EOF = End Of File).

# Concatenar dois arquivos em um terceiro:
cat parte1.txt parte2.txt > completo.txt
# > = redirecionar saída para arquivo (cria ou sobrescreve)

# Adicionar conteúdo ao FINAL de um arquivo existente:
cat adicao.txt >> arquivo-existente.txt
# >> = append (adicionar ao fim, sem apagar o que já existe)`}
      />

      <h2>less — Navegação em Arquivos Longos</h2>
      <CodeBlock
        title="less: ler arquivos sem travamento"
        code={`# Abrir arquivo com paginação (essencial para arquivos longos!)
less /var/log/syslog
# Diferente do cat, o less não despeja tudo na tela de uma vez.
# Você navega pelo arquivo como num leitor.

# === TECLAS DE NAVEGAÇÃO DENTRO DO LESS ===
# Espaço ou PgDown  → Avançar uma página
# b ou PgUp         → Voltar uma página
# ↑ ↓               → Avançar/voltar uma linha
# g                 → Ir para o INÍCIO do arquivo
# G                 → Ir para o FIM do arquivo
# q                 → Sair do less

# Pesquisar dentro do less:
# /termo    → buscar "termo" para frente (n = próxima ocorrência, N = anterior)
# ?termo    → buscar "termo" para trás

# Monitorar arquivo em tempo real (como logs ao vivo):
less +F /var/log/syslog
# +F = Follow mode (equivalente ao tail -f, mas dentro do less)
# Ctrl+C para sair do modo follow e voltar a navegar normalmente
# q para sair do less completamente

# -N = Number lines (mostrar número de cada linha)
less -N arquivo.txt`}
      />

      <h2>head e tail — Começo e Fim de Arquivos</h2>
      <CodeBlock
        title="head e tail: ver partes do arquivo"
        code={`# head: ver as primeiras linhas de um arquivo

# Ver as primeiras 10 linhas (padrão)
head /etc/passwd

# -n = number of lines (número de linhas)
head -n 20 /var/log/syslog   # Ver as primeiras 20 linhas
head -n 5 arquivo.txt        # Ver as primeiras 5 linhas

# -c = bytes count (número de bytes em vez de linhas)
head -c 500 arquivo.txt      # Ver os primeiros 500 bytes

# ---

# tail: ver as últimas linhas de um arquivo

# Ver as últimas 10 linhas (padrão)
tail /var/log/auth.log

# -n = number of lines (número de linhas)
tail -n 30 /var/log/syslog   # Ver as últimas 30 linhas
tail -n 50 /var/log/nginx/access.log

# -f = follow (seguir/monitorar em tempo real)
# O comando não termina — fica mostrando novas linhas à medida que aparecem
# Pressione Ctrl+C para sair
tail -f /var/log/syslog

# Monitorar MÚLTIPLOS arquivos ao mesmo tempo
tail -f /var/log/syslog /var/log/auth.log
# O tail indica qual arquivo tem novas entradas com um cabeçalho

# Combinar head e tail para ver um arquivo de ambos os lados:
echo "=== INÍCIO ===" && head -n 5 arquivo.txt
echo "=== FIM ===" && tail -n 5 arquivo.txt`}
      />

      <h2>grep — Filtrar Linhas por Padrão</h2>
      <CodeBlock
        title="grep: seu melhor amigo para analisar logs"
        code={`# Buscar uma palavra em um arquivo
grep "erro" /var/log/syslog
# Mostra apenas as linhas que CONTÊM a palavra "erro"

# -i = ignore case (ignorar diferença entre maiúsculas e minúsculas)
grep -i "error" /var/log/syslog
# Encontra "error", "Error", "ERROR", etc.

# -n = number (mostrar o NÚMERO da linha)
grep -n "SSH" /etc/ssh/sshd_config
# Saída: 15:PermitRootLogin no    ← número 15 = linha 15 do arquivo

# -v = invert (inverter = mostrar linhas que NÃO contêm o padrão)
grep -v "^#" /etc/ssh/sshd_config
# ^# = linhas que COMEÇAM com # (comentários)
# -v inverte: mostra apenas as linhas que NÃO são comentários

# -c = count (contar quantas linhas combinam)
grep -c "Failed" /var/log/auth.log
# Saída: 47   ← há 47 linhas com "Failed"

# -l = list files (listar apenas os NOMES dos arquivos que contêm o padrão)
grep -rl "ubuntu" /etc/
# -r = recursive (buscar em todos os arquivos do diretório)
# -l = mostrar apenas o nome do arquivo, não o conteúdo

# -r = recursive (buscar em todos os arquivos de um diretório)
grep -r "PermitRootLogin" /etc/ssh/

# -B = before (mostrar N linhas ANTES da linha correspondente)
grep -B 2 "error" /var/log/nginx/error.log
# Mostra 2 linhas antes de cada linha com "error"

# -A = after (mostrar N linhas DEPOIS da linha correspondente)
grep -A 3 "FAILED" /var/log/auth.log
# Mostra 3 linhas depois de cada linha com "FAILED"

# -C = context (mostrar N linhas antes E depois)
grep -C 2 "error" /var/log/syslog
# Mostra 2 linhas antes E 2 depois de cada match

# -E = extended regex (usar expressão regular estendida)
grep -E "error|warning|critical" /var/log/syslog
# O | (pipe) dentro do grep -E significa OU: encontrar "error" OU "warning" OU "critical"

# === EXEMPLOS PRÁTICOS PARA O DIA A DIA ===

# Ver tentativas de login SSH falhas:
grep "Failed password" /var/log/auth.log

# Ver uso de sudo (quem rodou o quê como root):
grep "sudo" /var/log/auth.log

# Ver conexões bloqueadas pelo firewall UFW:
grep "UFW BLOCK" /var/log/ufw.log

# Ver erros do Nginx:
grep -i "error" /var/log/nginx/error.log

# Ver mensagens recentes do kernel:
grep "kernel" /var/log/syslog | tail -20
# O | passa a saída do grep para o tail, que mostra apenas as últimas 20`}
      />

      <h2>wc — Contar Linhas, Palavras e Bytes</h2>
      <CodeBlock
        title="wc: word count (contador)"
        code={`# wc = word count (contagem de palavras)
# Por padrão mostra: linhas, palavras e bytes

wc arquivo.txt
# 42 315 1823 arquivo.txt
# ^   ^   ^
# linhas  palavras  bytes/caracteres

# -l = lines (contar apenas LINHAS)
wc -l /var/log/syslog
# 12345 /var/log/syslog   ← 12345 linhas no arquivo

# -w = words (contar apenas PALAVRAS)
wc -w arquivo.txt

# -c = characters/bytes (contar apenas BYTES)
wc -c arquivo.txt

# Uso com pipe (muito comum na prática):

# Quantas tentativas de login falhas houve?
grep "Failed password" /var/log/auth.log | wc -l

# Quantos processos estão rodando?
ps aux | wc -l

# Quantos arquivos há em um diretório?
ls /var/log | wc -l`}
      />

      <h2>sort e uniq — Ordenar e Deduplicar</h2>
      <CodeBlock
        title="sort e uniq: organizando dados"
        code={`# sort: ordenar linhas de um arquivo

# Ordenar alfabeticamente (padrão)
sort arquivo.txt

# -r = reverse (ordem reversa/decrescente)
sort -r arquivo.txt

# -n = numeric (ordenar NUMERICAMENTE, não alfabeticamente)
# Sem -n: "10" vem antes de "2" (pois "1" < "2" alfabeticamente)
# Com -n: "2" vem antes de "10" (numericamente correto)
sort -n numeros.txt

# -k = key (ordenar por uma coluna específica)
# -k5 = ordenar pela 5ª coluna
ls -l | sort -k5 -n    # Ordenar pela coluna de tamanho (5ª), numericamente

# ---

# uniq: remover ou contar linhas DUPLICADAS
# IMPORTANTE: o arquivo precisa estar ordenado para o uniq funcionar corretamente!

sort lista.txt | uniq       # Remover duplicatas
sort lista.txt | uniq -c   # Contar ocorrências de cada linha
# -c = count (contar)
# Saída:
#       3 apple    ← "apple" aparece 3 vezes
#       1 banana
#       2 cherry

sort lista.txt | uniq -d   # -d = duplicates: mostrar apenas linhas duplicadas
sort lista.txt | uniq -u   # -u = unique: mostrar apenas linhas que aparecem UMA vez

# EXEMPLO PRÁTICO: IPs que mais tentaram invadir via SSH
grep "Failed password" /var/log/auth.log | \\
    grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | \\
    # -o = only matching (mostrar APENAS a parte que combina, não a linha inteira)
    # -E = extended regex (para usar o padrão de IP)
    sort | \\
    uniq -c | \\
    sort -rn | \\
    # -r = reverso (maior primeiro)
    # -n = numérico
    head -10   # Top 10 IPs mais frequentes`}
      />

      <h2>Lendo Logs Importantes do Ubuntu</h2>
      <CodeBlock
        title="Os logs mais úteis do dia a dia"
        code={`# Log geral do sistema (tudo que acontece no Ubuntu)
tail -f /var/log/syslog

# Autenticação: login, SSH, sudo (monitorar segurança)
tail -f /var/log/auth.log

# Log do kernel (hardware, drivers, erros de boot)
dmesg              # Mostrar todas as mensagens do kernel
dmesg | tail -30   # Apenas as 30 mais recentes
dmesg | grep -i error  # Apenas erros

# Histórico de instalações de pacotes
cat /var/log/apt/history.log | tail -50
cat /var/log/dpkg.log | tail -50

# Logs de serviços web
sudo tail -f /var/log/nginx/access.log   # Todas as requisições ao Nginx
sudo tail -f /var/log/nginx/error.log    # Apenas erros do Nginx

# Todos os logs via journalctl (sistema do systemd):
journalctl -n 50        # -n = número: ver as últimas 50 linhas
journalctl -f           # -f = follow: monitorar em tempo real
journalctl -p err       # -p = priority: apenas erros (err = nível de erro)
journalctl -u nginx -f  # -u = unit: logs de um serviço específico`}
      />
    </PageContainer>
  );
}
