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
        ferramentas de leitura e inspeção.
      </p>

      <h2>cat — Concatenar e Exibir</h2>
      <CodeBlock
        title="Usando o cat"
        code={`# Exibir o conteúdo de um arquivo
cat arquivo.txt

# Exibir múltiplos arquivos em sequência
cat arquivo1.txt arquivo2.txt

# Exibir com número de linha
cat -n arquivo.txt

# Exibir mostrando caracteres especiais (tabs como ^I, fim de linha como $)
cat -A arquivo.txt

# Criar um arquivo digitando diretamente (Ctrl+D para terminar):
cat > novo-arquivo.txt
Conteúdo que você quer escrever
Ctrl+D

# Concatenar dois arquivos em um terceiro:
cat parte1.txt parte2.txt > completo.txt

# Adicionar ao final de um arquivo (append):
cat adicao.txt >> arquivo-existente.txt`}
      />

      <h2>less e more — Paginação</h2>
      <CodeBlock
        title="Navegando em arquivos longos"
        code={`# Abrir arquivo com paginação
less /var/log/syslog

# Navegação dentro do less:
# Espaço ou PgDown  → Avançar uma página
# b ou PgUp         → Voltar uma página
# ↑ ↓               → Avançar/voltar uma linha
# /termo            → Pesquisar "termo" (n para próximo, N para anterior)
# ?termo            → Pesquisar para trás
# g                 → Ir para o início do arquivo
# G                 → Ir para o final do arquivo
# q                 → Sair do less

# Ver arquivo em tempo real (como journalctl -f):
less +F /var/log/syslog
# Ctrl+C para sair do modo follow, q para sair do less

# Abrir com pesquisa já ativada
less +/termo arquivo.txt

# Mostrar número de linhas
less -N arquivo.txt`}
      />

      <h2>head e tail — Começo e Fim</h2>
      <CodeBlock
        title="Lendo começo e fim de arquivos"
        code={`# Ver as primeiras 10 linhas (padrão)
head /etc/passwd

# Ver as primeiras 20 linhas
head -n 20 /var/log/syslog

# Ver os primeiros 500 bytes
head -c 500 arquivo.txt

# Ver as últimas 10 linhas (padrão)
tail /var/log/auth.log

# Ver as últimas 30 linhas
tail -n 30 /var/log/syslog

# MUITO ÚTIL: monitorar log em tempo real
tail -f /var/log/syslog

# Monitorar múltiplos arquivos simultaneamente
tail -f /var/log/syslog /var/log/auth.log

# Ver do início e do fim ao mesmo tempo para um arquivo novo:
head -n 5 arquivo.txt && tail -n 5 arquivo.txt`}
      />

      <h2>grep — Filtrar Linhas</h2>
      <CodeBlock
        title="O comando grep — seu melhor amigo para logs"
        code={`# Buscar uma palavra em um arquivo
grep "erro" /var/log/syslog

# Sem diferenciar maiúsculas/minúsculas
grep -i "error" /var/log/syslog

# Mostrar apenas o número das linhas que combinam
grep -n "SSH" /etc/ssh/sshd_config

# Inverter a busca (mostrar linhas que NÃO contêm o padrão)
grep -v "^#" /etc/ssh/sshd_config  # Excluir comentários e linhas vazias

# Contar quantas linhas combinam
grep -c "Failed" /var/log/auth.log

# Mostrar X linhas antes da linha correspondente
grep -B 2 "error" /var/log/nginx/error.log

# Mostrar X linhas depois da linha correspondente
grep -A 3 "FAILED" /var/log/auth.log

# Mostrar X linhas antes E depois (context)
grep -C 2 "error" /var/log/syslog

# Buscar recursivamente em todos os arquivos de um diretório
grep -r "PermitRootLogin" /etc/ssh/

# Mostrar apenas o nome dos arquivos que contêm o padrão
grep -rl "ubuntu" /etc/

# Usar expressão regular
grep -E "error|warning|critical" /var/log/syslog

# Exemplos práticos para análise de logs do Ubuntu:
grep "Failed password" /var/log/auth.log        # tentativas de login SSH falhas
grep "sudo" /var/log/auth.log                   # uso de sudo
grep "UFW BLOCK" /var/log/ufw.log               # conexões bloqueadas pelo firewall
grep -i "error" /var/log/nginx/error.log        # erros do Nginx
grep "kernel" /var/log/syslog | tail -20        # mensagens recentes do kernel`}
      />

      <h2>wc — Contar Linhas, Palavras e Caracteres</h2>
      <CodeBlock
        title="Contando com wc"
        code={`# Contar linhas, palavras e caracteres de um arquivo
wc arquivo.txt
# 42 315 1823 arquivo.txt
# ^   ^   ^   nome
# linhas  palavras  bytes

# Contar apenas linhas
wc -l /var/log/syslog

# Contar apenas palavras
wc -w arquivo.txt

# Contar apenas bytes/caracteres
wc -c arquivo.txt

# Uso com pipe: contar quantas tentativas de login falhou
grep "Failed password" /var/log/auth.log | wc -l

# Contar quantos processos estão rodando:
ps aux | wc -l`}
      />

      <h2>sort e uniq — Ordenar e Deduplicar</h2>
      <CodeBlock
        title="Ordenando e removendo duplicatas"
        code={`# Ordenar linhas de um arquivo (alfabético)
sort arquivo.txt

# Ordenar em ordem reversa
sort -r arquivo.txt

# Ordenar numericamente (não alfanumericamente)
sort -n numeros.txt

# Ordenar por tamanho de arquivo (combinado com ls)
ls -l | sort -k5 -n    # -k5 = ordenar pela 5a coluna (tamanho)

# Remover linhas duplicadas (o arquivo deve estar ordenado!)
sort lista.txt | uniq

# Contar ocorrências de cada linha
sort lista.txt | uniq -c

# Mostrar apenas as linhas duplicadas
sort lista.txt | uniq -d

# Mostrar apenas linhas únicas (não duplicadas)
sort lista.txt | uniq -u

# Exemplo prático: IPs que mais tentaram acessar via SSH
grep "Failed password" /var/log/auth.log | \\
    grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | \\
    sort | uniq -c | sort -rn | head -10`}
      />

      <h2>Lendo Logs do Ubuntu</h2>
      <CodeBlock
        title="Logs mais importantes do Ubuntu"
        code={`# Log geral do sistema
tail -f /var/log/syslog

# Autenticação, SSH, sudo (MUITO importante para segurança)
tail -f /var/log/auth.log
sudo grep "Failed password" /var/log/auth.log | tail -20

# Log do kernel
dmesg
dmesg | tail -30
dmesg | grep -i error

# Logs do APT (histórico de instalações)
cat /var/log/apt/history.log | tail -50
cat /var/log/dpkg.log | tail -50

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Ver todos os logs via journalctl (systemd)
journalctl -n 50              # Últimas 50 linhas
journalctl -f                 # Tempo real
journalctl --since "1 hour ago"
journalctl -p err             # Apenas erros
journalctl -u nginx -f        # Logs de um serviço específico`}
      />
    </PageContainer>
  );
}
