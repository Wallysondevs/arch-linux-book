import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Processos() {
  return (
    <PageContainer
      title="Processos e Monitoramento"
      subtitle="ps, top, htop, kill, nice — monitorando, controlando e otimizando processos no Ubuntu."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <p>
        Um processo é um programa em execução. O Linux gerencia centenas de processos
        simultaneamente — do kernel aos seus aplicativos abertos. Saber monitorar e
        controlar processos é essencial para administrar um sistema Ubuntu com eficiência.
      </p>

      <h2>ps — Listar Processos</h2>
      <CodeBlock
        title="Listando processos com ps"
        code={`# Ver processos do usuário atual na sessão atual
ps

# Ver TODOS os processos do sistema (o mais usado)
ps aux

# Explicação das colunas do ps aux:
# USER   PID  %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
# root     1   0.0  0.2 167808  9876 ?        Ss   09:00   0:01 /sbin/init
# joao  1234   2.5  1.5 4567890 61440 pts/0  Sl+  10:00   0:15 firefox

# USER   = dono do processo
# PID    = Process ID (número único do processo)
# %CPU   = uso de CPU em porcentagem
# %MEM   = uso de memória RAM em porcentagem
# VSZ    = memória virtual total (KB)
# RSS    = memória física usada (KB)
# TTY    = terminal associado (? = sem terminal)
# STAT   = estado (S=sleeping, R=running, Z=zombie, T=stopped)
# START  = hora/data de início
# TIME   = tempo de CPU consumido
# COMMAND= comando que iniciou o processo

# Ver em formato de árvore (hierarquia pai→filho)
ps auxf
ps --forest

# Buscar um processo específico
ps aux | grep nginx
ps aux | grep python

# Ver apenas os PIDs de um programa
pgrep nginx
pgrep -l nginx  # Com o nome também`}
      />

      <h2>top e htop — Monitor em Tempo Real</h2>
      <CodeBlock
        title="Monitoramento interativo de processos"
        code={`# Abrir o top (vem pré-instalado)
top

# Dentro do top:
# q  → Sair
# k  → Matar processo (pede o PID)
# r  → Mudar prioridade (renice)
# P  → Ordenar por uso de CPU
# M  → Ordenar por uso de memória
# 1  → Ver cada core de CPU separado
# u  → Filtrar por usuário
# s  → Mudar intervalo de atualização
# Espaço → Atualizar imediatamente

# Instalar o htop (muito mais amigável):
sudo apt install htop
htop

# Dentro do htop:
# F6 ou < > → Ordenar por coluna
# F5        → Modo de árvore (ver hierarquia)
# F9        → Matar processo (lista de sinais)
# F4        → Filtrar por nome
# F2        → Configurações (personalizar colunas)
# q         → Sair

# Para monitorar apenas um processo específico:
htop -p 1234,5678

# Instalar btop (mais bonito ainda):
sudo apt install btop
btop`}
      />

      <h2>Sinais e Kill — Controlando Processos</h2>
      <CodeBlock
        title="Enviando sinais para processos"
        code={`# Ver lista de sinais disponíveis
kill -l

# Os mais importantes:
# SIGTERM (15) = Pedir educadamente para o processo terminar
# SIGKILL  (9) = Matar o processo imediatamente (sem chance de limpeza)
# SIGHUP   (1) = Recarregar configuração (usado por nginx, apache, etc.)
# SIGSTOP (19) = Pausar o processo
# SIGCONT (18) = Continuar processo pausado

# Terminar um processo pelo PID
kill 1234           # Envia SIGTERM (15) — padrão
kill -15 1234       # Explícito: SIGTERM
kill -9 1234        # SIGKILL — forçado (use apenas se SIGTERM não funcionar)
kill -SIGKILL 1234  # Equivalente ao -9

# Terminar processo pelo nome (mata todos com esse nome)
pkill nginx
pkill -9 firefox    # Forçar

# Matar processo e todos os seus filhos
pkill -TERM -P 1234  # Matar filhos do PID 1234
kill -- -1234         # Matar grupo do processo

# Matar todas as instâncias de um programa interativamente
killall firefox
killall -9 firefox   # Forçado

# Verificar qual processo está usando uma porta específica
sudo ss -tlnp | grep :80
sudo lsof -i :80
# Depois matar o processo que ocupa a porta:
sudo kill $(sudo lsof -t -i:80)`}
      />

      <h2>nice e renice — Prioridade de Processos</h2>
      <CodeBlock
        title="Controlando prioridade de CPU"
        code={`# Nice value: de -20 (máxima prioridade) a 19 (mínima prioridade)
# Padrão: 0
# Processos comuns: 0
# Usuário root pode usar negativos (prioridade maior)
# Usuário normal só pode diminuir prioridade (aumentar niceness)

# Iniciar um processo com prioridade menor (menos CPU)
nice -n 10 tar -czf backup.tar.gz /home/  # Compressão pesada com baixa prioridade
nice -n 19 make -j4   # Compilar com mínima prioridade

# Iniciar com alta prioridade (apenas root)
sudo nice -n -10 ./programa-critico

# Mudar prioridade de um processo já em execução
renice -n 5 -p 1234      # Diminuir prioridade do PID 1234
renice -n 5 -u joao      # Diminuir prioridade de todos os processos do usuário
sudo renice -n -5 -p 1234 # Aumentar prioridade (precisa de root)

# Ver niceness dos processos no top:
# Coluna "NI" = niceness
# Coluna "PR" = prioridade real (20 + niceness)`}
      />

      <h2>Jobs — Processos em Background</h2>
      <CodeBlock
        title="Gerenciando jobs em background"
        code={`# Executar comando em background (adicione & no final)
wget https://exemplo.com/arquivo-grande.iso &
# [1] 1234   ← [número do job] PID

# Ver jobs em background
jobs
# [1]+  Running    wget https://exemplo.com/arquivo-grande.iso &

# Pausar um processo em foreground
# Ctrl+Z  ← pausa e coloca em background como STOPPED

# Continuar processo pausado em background
bg %1   # Continuar job número 1 em background
bg      # Continuar o último job pausado

# Trazer processo do background para o foreground
fg %1   # Trazer job número 1 para foreground
fg      # Trazer o último job

# Matar um job específico
kill %1

# Exemplo prático: iniciar e gerenciar múltiplas tarefas
long-running-script.sh &     # [1] 1234
another-script.sh &          # [2] 1235
jobs                          # Ver ambos
fg %1                         # Trazer o primeiro para foreground
Ctrl+Z                        # Pausar
bg %1                         # Mandar de volta para background`}
      />

      <h2>nohup — Processos Imunes ao Logout</h2>
      <CodeBlock
        title="Manter processos rodando após desconectar"
        code={`# nohup = No HangUP — processo continua após fechar terminal
nohup python3 meu-script.py &

# A saída vai para nohup.out por padrão
tail -f nohup.out

# Redirecionar saída para arquivo específico:
nohup python3 meu-script.py > /var/log/meu-script.log 2>&1 &

# Alternativa moderna: screen ou tmux
sudo apt install screen

# Criar nova sessão screen
screen -S minha-sessao

# Dentro do screen: Ctrl+A D  para desconectar (detach)
# Listar sessões screen
screen -ls

# Reconectar a uma sessão
screen -r minha-sessao

# Alternativa: tmux (mais poderoso)
sudo apt install tmux
tmux new-session -s minha-sessao
# Ctrl+B D para desconectar
tmux attach-session -t minha-sessao`}
      />

      <h2>Informações de Memória e CPU</h2>
      <CodeBlock
        title="Monitorando recursos do sistema"
        code={`# Uso de memória RAM e swap
free -h
# total  usado  livre  compartilhado  buff/cache  disponível
# Mem:   15Gi  5.2Gi   3.1Gi  410Mi  6.8Gi  9.5Gi
# Swap:   2Gi  100Mi   1.9Gi

# Informações da CPU
lscpu
cat /proc/cpuinfo | grep "model name" | head -1

# Uso de CPU por core em tempo real
mpstat -P ALL 1
# (precisa instalar: sudo apt install sysstat)

# Estatísticas de I/O de disco
iostat -x 1
# (sudo apt install sysstat)

# Ver memória virtual e estatísticas do sistema
vmstat 1 5     # Atualizar a cada 1s, 5 vezes

# Ver quanta memória cada processo usa (ordenado):
ps aux --sort=-%mem | head -20    # Top 20 por memória
ps aux --sort=-%cpu | head -20    # Top 20 por CPU`}
      />
    </PageContainer>
  );
}
