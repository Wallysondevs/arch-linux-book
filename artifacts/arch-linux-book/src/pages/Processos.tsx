import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Processos() {
  return (
    <PageContainer
      title="Processos e Gerenciamento de Tarefas"
      subtitle="Entenda como o Linux gerencia processos, como monitorá-los e como controlá-los — desde o básico até sinais avançados."
      difficulty="intermediario"
      timeToRead="25 min"
    >
      <p>
        Todo programa em execução no Linux é um processo. Cada processo tem um PID (Process ID) único,
        um dono, prioridade e estado. Saber gerenciar processos é essencial para diagnosticar problemas,
        liberar recursos e manter o sistema saudável.
      </p>

      <h2>1. Visualizando Processos - ps</h2>
      <p>
        O comando <code>ps</code> (process status) mostra um snapshot dos processos em execução.
        Existem dois estilos de flags: estilo BSD (sem hífen) e estilo UNIX (com hífen).
      </p>

      <CodeBlock code={`# Mostrar TODOS os processos do sistema (estilo BSD - mais comum)
ps aux

# Explicação das colunas:
# USER   PID  %CPU %MEM    VSZ   RSS TTY  STAT START  TIME COMMAND
# root     1   0.0  0.1 169516 13280 ?    Ss   jan01  0:05 /sbin/init
# joao  1234   2.3  1.5 456780 120000 ?   Sl   10:30  1:23 /usr/bin/firefox`} />

      <p>Significado das colunas:</p>
      <ul>
        <li><strong>USER</strong> - Dono do processo</li>
        <li><strong>PID</strong> - ID do processo</li>
        <li><strong>%CPU</strong> - Porcentagem de CPU utilizada</li>
        <li><strong>%MEM</strong> - Porcentagem de memória RAM utilizada</li>
        <li><strong>VSZ</strong> - Memória virtual (KB)</li>
        <li><strong>RSS</strong> - Memória física real (KB)</li>
        <li><strong>TTY</strong> - Terminal associado (? = sem terminal)</li>
        <li><strong>STAT</strong> - Estado do processo</li>
        <li><strong>START</strong> - Hora/data de início</li>
        <li><strong>TIME</strong> - Tempo total de CPU usado</li>
        <li><strong>COMMAND</strong> - Comando que iniciou o processo</li>
      </ul>

      <p>Estados do processo (coluna STAT):</p>
      <ul>
        <li><strong>R</strong> - Running (executando ou na fila)</li>
        <li><strong>S</strong> - Sleeping (aguardando um evento)</li>
        <li><strong>D</strong> - Uninterruptible sleep (geralmente esperando I/O de disco)</li>
        <li><strong>T</strong> - Stopped (pausado, ex: Ctrl+Z)</li>
        <li><strong>Z</strong> - Zombie (terminou mas o pai não coletou o status)</li>
        <li><strong>s</strong> - Líder de sessão</li>
        <li><strong>l</strong> - Multi-thread</li>
        <li><strong>+</strong> - Em foreground</li>
      </ul>

      <CodeBlock code={`# Estilo UNIX com hierarquia (mostra árvore de processos)
ps -ef

# Mostrar em formato de árvore
ps -ef --forest

# Filtrar processos de um usuário
ps -u joao

# Filtrar por nome do processo
ps aux | grep firefox

# Mostrar apenas PID e nome do comando
ps -eo pid,comm

# Ordenar por uso de memória (mais pesados primeiro)
ps aux --sort=-%mem | head -20

# Ordenar por uso de CPU
ps aux --sort=-%cpu | head -20

# Mostrar threads de um processo
ps -T -p 1234`} />

      <h3>pgrep - Buscar PIDs por nome</h3>
      <CodeBlock code={`# Encontrar PID de um processo pelo nome
pgrep firefox

# Mostrar nome e PID
pgrep -l firefox

# Mostrar a linha de comando completa
pgrep -a firefox

# Filtrar por usuário
pgrep -u joao

# Contar quantos processos batem
pgrep -c firefox`} />

      <h2>2. Monitoramento em Tempo Real</h2>

      <h3>top</h3>
      <p>Monitor interativo que vem pré-instalado em praticamente todo sistema Linux.</p>
      <CodeBlock code={`# Iniciar o top
top

# Atalhos dentro do top:
# q     - Sair
# h     - Ajuda
# k     - Matar processo (pede PID e sinal)
# r     - Renice (mudar prioridade)
# M     - Ordenar por memória
# P     - Ordenar por CPU
# 1     - Mostrar cada core de CPU separado
# c     - Mostrar caminho completo do comando
# u     - Filtrar por usuário
# s     - Mudar intervalo de atualização

# Iniciar top mostrando processos de um usuário
top -u joao

# Atualizar a cada 2 segundos
top -d 2

# Modo batch (para scripts, saída única)
top -bn1 | head -20`} />

      <h3>htop</h3>
      <p>Versão melhorada do top, com interface colorida, barras de uso e suporte a mouse.</p>
      <CodeBlock code={`# Instalar o htop
sudo pacman -S htop

# Executar
htop

# Atalhos do htop:
# F1     - Ajuda
# F2     - Configurações
# F3     - Buscar processo
# F4     - Filtrar
# F5     - Modo árvore (toggle)
# F6     - Ordenar por coluna
# F9     - Matar processo (escolha o sinal)
# F10    - Sair
# Space  - Marcar processo
# u      - Filtrar por usuário
# t      - Modo árvore (toggle)
# /      - Buscar`} />

      <h3>btop</h3>
      <p>Monitor moderno com gráficos bonitos no terminal. Mostra CPU, memória, disco e rede.</p>
      <CodeBlock code={`# Instalar
sudo pacman -S btop

# Executar
btop`} />

      <h2>3. Sinais (Signals)</h2>
      <p>
        Sinais são mecanismos de comunicação entre processos. Quando você "mata" um processo,
        na verdade está enviando um sinal para ele.
      </p>

      <CodeBlock code={`# Listar todos os sinais disponíveis
kill -l

# Sinais mais importantes:
# 1  - SIGHUP    - Hangup (recarregar configuração)
# 2  - SIGINT    - Interrupt (equivalente a Ctrl+C)
# 9  - SIGKILL   - Kill forçado (NÃO pode ser ignorado)
# 15 - SIGTERM   - Terminate (pede para o processo encerrar graciosamente)
# 18 - SIGCONT   - Continue (retomar processo pausado)
# 19 - SIGSTOP   - Stop (pausar, NÃO pode ser ignorado)
# 20 - SIGTSTP   - Terminal Stop (equivalente a Ctrl+Z)`} />

      <AlertBox type="warning" title="SIGTERM vs SIGKILL">
        Sempre tente SIGTERM (15) primeiro. Ele permite que o processo salve dados e limpe recursos antes de sair.
        Use SIGKILL (9) apenas como último recurso — ele mata o processo imediatamente, podendo causar corrupção
        de dados ou arquivos temporários abandonados.
      </AlertBox>

      <h2>4. Matando Processos</h2>

      <h3>kill</h3>
      <CodeBlock code={`# Enviar SIGTERM (padrão, educado) - pede para o processo encerrar
kill 1234

# Equivalente explícito
kill -15 1234
kill -SIGTERM 1234

# Enviar SIGKILL (forçado, bruto) - mata imediatamente
kill -9 1234
kill -SIGKILL 1234

# Enviar SIGHUP (recarregar configuração)
kill -1 1234
kill -SIGHUP 1234

# Matar múltiplos processos
kill 1234 5678 9012`} />

      <h3>killall</h3>
      <CodeBlock code={`# Matar TODOS os processos com esse nome
killall firefox

# Matar com SIGKILL
killall -9 firefox

# Pedir confirmação antes de matar
killall -i firefox

# Matar apenas processos do usuário atual
killall -u joao firefox

# Matar processos mais velhos que 1 hora
killall -o 1h firefox

# Matar processos mais novos que 5 minutos
killall -y 5m firefox`} />

      <h3>pkill</h3>
      <CodeBlock code={`# Matar por nome (busca parcial, diferente do killall)
pkill fire    # mata firefox, firewalld, etc.

# Matar por nome exato
pkill -x firefox

# Matar processos de um usuário específico
pkill -u maria

# Matar por nome do terminal
pkill -t pts/0

# Enviar sinal específico
pkill -9 firefox

# Matar processo e todos os filhos
pkill -P 1234`} />

      <AlertBox type="danger" title="Cuidado com pkill!">
        O <code>pkill</code> faz busca parcial por padrão. Se você digitar <code>pkill fire</code>,
        ele pode matar processos que você não esperava. Use <code>pgrep -l fire</code> antes para
        verificar quais processos seriam afetados.
      </AlertBox>

      <h3>xkill</h3>
      <CodeBlock code={`# Matar janela gráfica clicando nela (útil quando um app trava)
# Instalar: sudo pacman -S xorg-xkill
xkill
# Agora clique na janela que deseja fechar`} />

      <h2>5. Prioridade de Processos - nice e renice</h2>
      <p>
        No Linux, cada processo tem um valor de "niceness" que define sua prioridade. O valor vai de -20
        (maior prioridade) a 19 (menor prioridade). O padrão é 0.
      </p>

      <CodeBlock code={`# Iniciar um processo com prioridade baixa (gentil com outros processos)
nice -n 10 tar czf backup.tar.gz /home

# Iniciar com prioridade máxima (precisa de root)
sudo nice -n -20 processo_importante

# Ver a prioridade de processos
ps -eo pid,ni,comm | head

# Mudar a prioridade de um processo que já está rodando
renice 10 -p 1234

# Mudar prioridade de todos os processos de um usuário
sudo renice 5 -u maria

# Dar prioridade máxima a um processo existente
sudo renice -20 -p 1234`} />

      <h2>6. Processos em Background e Foreground</h2>

      <h3>Executando em Background</h3>
      <CodeBlock code={`# Iniciar um processo em background (adicione & no final)
firefox &

# O terminal mostra o job number e PID:
# [1] 12345

# Redirecionar saída para não poluir o terminal
firefox &>/dev/null &`} />

      <h3>jobs, fg, bg</h3>
      <CodeBlock code={`# Pausar o processo atual (envia SIGTSTP)
# Pressione Ctrl+Z no terminal

# Listar processos em background/parados
jobs
# [1]+  Stopped                 vim arquivo.txt
# [2]-  Running                 firefox &

# Listar com PIDs
jobs -l

# Trazer processo para foreground
fg %1      # job número 1
fg         # traz o mais recente

# Continuar processo parado em background
bg %1      # continua job 1 em background
bg         # continua o mais recente`} />

      <h3>nohup - Resistindo ao logout</h3>
      <CodeBlock code={`# Executar processo que sobrevive ao fechamento do terminal
nohup ./script_longo.sh &

# A saída vai para o arquivo nohup.out por padrão
# Redirecionar saída para outro arquivo
nohup ./script_longo.sh > log.txt 2>&1 &

# Alternativa moderna: usar disown
firefox &
disown %1    # agora o firefox sobrevive ao fechar o terminal`} />

      <h2>7. Comandos Úteis para Diagnóstico</h2>

      <h3>uptime e load average</h3>
      <CodeBlock code={`# Ver há quanto tempo o sistema está ligado e carga média
uptime
# 14:30:22 up 5 days, 3:15, 2 users, load average: 0.52, 0.48, 0.35

# Os 3 números do load average representam:
# Média de processos na fila nos últimos 1, 5 e 15 minutos
# Valor ideal: menor ou igual ao número de cores da CPU`} />

      <h3>free - Memória do sistema</h3>
      <CodeBlock code={`# Ver uso de memória RAM e swap
free -h

# Saída:
#               total    used    free   shared  buff/cache   available
# Mem:          15Gi    4.2Gi    5.1Gi   512Mi     6.1Gi       10Gi
# Swap:         8.0Gi      0B    8.0Gi

# Atualizar a cada 2 segundos
free -h -s 2`} />

      <h3>pstree - Árvore de processos</h3>
      <CodeBlock code={`# Mostrar árvore de processos
pstree

# Mostrar com PIDs
pstree -p

# Mostrar árvore de um processo específico
pstree -p 1234

# Mostrar com nome do usuário
pstree -u`} />

      <h3>lsof - Arquivos abertos por processos</h3>
      <CodeBlock code={`# Listar todos os arquivos abertos (MUITA saída)
sudo lsof

# Ver quais processos estão usando uma porta
sudo lsof -i :8080

# Ver arquivos abertos por um processo
sudo lsof -p 1234

# Ver quais processos estão usando um arquivo/diretório
sudo lsof /var/log/syslog

# Ver conexões de rede de um processo
sudo lsof -i -a -p 1234`} />

      <h3>strace - Rastrear chamadas do sistema</h3>
      <CodeBlock code={`# Rastrear chamadas de sistema de um comando
strace ls

# Rastrear um processo em execução
sudo strace -p 1234

# Rastrear apenas chamadas de rede
strace -e network ls

# Rastrear apenas acesso a arquivos
strace -e trace=open,read,write ls

# Salvar a saída em arquivo
strace -o saida.txt ls`} />

      <h2>8. Matando Programas Travados na Interface Gráfica</h2>
      <p>
        Um dos problemas mais comuns no dia a dia é um programa travar na interface gráfica —
        ele para de responder, não fecha com o botão X, e às vezes congela a tela inteira.
        No Windows, você usaria o <code>Ctrl+Alt+Del</code> e o Gerenciador de Tarefas. No Linux,
        existem várias formas de resolver isso, desde as mais simples até a "nuclear".
      </p>

      <h3>Cenário 1: Programa travou mas o resto funciona</h3>
      <p>
        Se só um programa travou (exemplo: Firefox, Chrome, LibreOffice) mas o resto da
        interface continua funcionando, você pode matar ele pelo terminal:
      </p>
      <CodeBlock
        title="Matar programa travado pelo terminal"
        code={`# Abra um terminal (se conseguir) e encontre o processo:
ps aux | grep firefox
# joao  3456  15.2  8.3 3456789 678901 ?  Rl  14:30  5:23 /usr/lib/firefox/firefox
# joao  3460   2.1  3.2 1234567 234567 ?  Sl  14:30  0:45 /usr/lib/firefox/firefox -content...
# joao  3478   0.5  1.1  987654 112233 ?  Sl  14:30  0:12 /usr/lib/firefox/firefox -content...

# O Firefox/Chrome criam VÁRIOS processos (um para cada aba + extensões)
# Matar todos de uma vez:
killall firefox

# Se não responder ao SIGTERM (killall normal), force:
killall -9 firefox

# Ou use pkill (faz busca parcial pelo nome):
pkill firefox
pkill -9 firefox`}
      />

      <h3>Cenário 2: Chrome/Chromium com dezenas de processos</h3>
      <p>
        O Chrome (e navegadores baseados em Chromium como Brave, Edge, Vivaldi) cria um processo
        separado para cada aba, extensão e plugin. Quando trava, pode deixar 20, 30 ou mais
        processos pendurados.
      </p>
      <CodeBlock
        title="Entendendo os processos do Chrome"
        code={`# Ver todos os processos do Chrome:
ps aux | grep chrome
# joao  5001  3.2  4.5 2345678 345678 ? Sl 15:00 1:23 /opt/google/chrome/chrome
# joao  5010  0.8  2.1 1234567 167890 ? Sl 15:00 0:30 /opt/google/chrome/chrome --type=renderer
# joao  5015  0.3  1.5 1123456 123456 ? Sl 15:00 0:10 /opt/google/chrome/chrome --type=renderer
# joao  5020  0.1  0.8  987654  65432 ? Sl 15:00 0:05 /opt/google/chrome/chrome --type=gpu-process
# joao  5025  0.2  1.2 1098765  98765 ? Sl 15:00 0:08 /opt/google/chrome/chrome --type=utility
# ... (mais 10-20 processos)

# Cada "--type=renderer" é uma aba ou extensão
# "--type=gpu-process" é o processo de renderização da GPU
# "--type=utility" são processos auxiliares

# === MATAR TUDO DO CHROME DE UMA VEZ ===
killall chrome
# ou
killall google-chrome
# ou para Chromium:
killall chromium

# Se não funcionar (os processos não morrem):
killall -9 chrome

# === VERIFICAR SE MORREU TUDO ===
ps aux | grep chrome
# Se ainda aparecer processos, mate pelo PID:
kill -9 5001 5010 5015 5020 5025

# Ou mate todos os processos do Chrome do seu usuário:
pkill -9 -u joao chrome

# === CONTAR QUANTOS PROCESSOS O CHROME TEM ===
pgrep -c chrome
# 23  (23 processos!)`}
      />

      <h3>Cenário 3: Matar janela clicando nela (xkill)</h3>
      <p>
        Se o programa travou mas você consegue ver a janela dele, pode usar o <code>xkill</code>
        para matar clicando na janela (funciona em X11/Xorg):
      </p>
      <CodeBlock
        title="xkill - Matar janela com clique"
        code={`# Instalar (se não tiver)
sudo pacman -S xorg-xkill

# Executar:
xkill
# O cursor do mouse vira um X
# Clique na janela que quer fechar → o programa é morto imediatamente

# Cancelar sem matar nada: clique com botão direito ou aperte ESC

# Dica: Adicionar atalho de teclado no seu DE
# No GNOME: Configurações → Teclado → Atalhos → Adicionar
# No KDE: Configurações do Sistema → Atalhos → Adicionar
# Defina algo como Ctrl+Alt+X para rodar "xkill"`}
      />

      <AlertBox type="info" title="xkill no Wayland">
        <p>O <code>xkill</code> é uma ferramenta do X11 e pode não funcionar em sessões Wayland
        puras. No GNOME com Wayland, use <code>Alt+F2</code> e digite <code>r</code> para reiniciar
        o GNOME Shell, ou use os comandos de terminal (<code>killall</code>, <code>kill</code>).</p>
      </AlertBox>

      <h3>Cenário 4: Não consegue abrir terminal (compositor gráfico travou)</h3>
      <p>
        Se a interface gráfica inteira congelou e você não consegue abrir nenhuma janela,
        nem clicar em nada, tente estes atalhos de teclado:
      </p>
      <CodeBlock
        title="Atalhos de emergência na interface gráfica"
        code={`# === GNOME ===
Alt+F2              → Abre o prompt de execução do GNOME (digite "r" e Enter para reiniciar o Shell)

# === KDE Plasma ===
Ctrl+Alt+Del        → Abre o menu de logout (deslogar, reiniciar, desligar)

# === Geral (funciona em qualquer DE com X11) ===
Ctrl+Alt+Backspace  → Mata o servidor X inteiro (mata TODOS os programas gráficos!)
                       Pode precisar habilitar: setxkbmap -option terminate:ctrl_alt_bksp`}
      />

      <h2>9. TTY - O Terminal de Emergência (Quando a Interface Morre)</h2>
      <p>
        Essa é a ferramenta mais importante que você precisa conhecer. O <strong>TTY</strong>
        (TeleTYpe) é um terminal virtual puro — uma tela preta com texto branco, sem interface
        gráfica nenhuma. Ele funciona <strong>independentemente</strong> da interface gráfica.
        Mesmo que o GNOME, KDE, X11 ou Wayland travem completamente, o TTY continua funcionando.
      </p>
      <p>
        O Linux tem vários TTYs disponíveis (geralmente 6). A interface gráfica usa o TTY1 ou TTY2,
        e os outros ficam livres para você usar.
      </p>

      <CodeBlock
        title="Acessando o TTY"
        code={`# === ENTRAR NO TTY ===
# Pressione a combinação de teclas:

Ctrl + Alt + F2    → Abre o TTY2 (terminal de emergência)
Ctrl + Alt + F3    → Abre o TTY3
Ctrl + Alt + F4    → Abre o TTY4
Ctrl + Alt + F5    → Abre o TTY5
Ctrl + Alt + F6    → Abre o TTY6

# O que aparece:
# Uma tela preta com texto branco pedindo login:
#
# Arch Linux 6.12.1-arch1-1 (tty2)
#
# meupc login: _
#
# Digite seu usuário e senha (a senha NÃO aparece enquanto digita)

# === VOLTAR PARA A INTERFACE GRÁFICA ===
Ctrl + Alt + F1    → Volta para o TTY1 (onde geralmente está a interface gráfica)
# ou
Ctrl + Alt + F2    → Dependendo da distro, a interface pode estar no TTY2

# === NO TTY VOCÊ PODE: ===
# - Matar processos travados
# - Reiniciar a interface gráfica
# - Fazer login e usar qualquer comando
# - Salvar arquivos importantes antes de reiniciar
# - Debugar o que causou o travamento`}
      />

      <AlertBox type="success" title="O TTY é seu salva-vidas!">
        <p>Memorize <strong>Ctrl+Alt+F2</strong>. Quando tudo travar e você não conseguir
        fazer nada na interface gráfica, essa combinação vai abrir uma tela preta com
        um terminal funcional onde você pode matar processos, salvar dados e reiniciar
        o sistema de forma limpa.</p>
      </AlertBox>

      <h3>O que fazer no TTY quando a interface trava</h3>
      <CodeBlock
        title="Procedimento de recuperação via TTY"
        code={`# 1. Pressione Ctrl+Alt+F2 para abrir o TTY2
# 2. Faça login com seu usuário e senha

# 3. Descobrir o que está consumindo recursos:
top
# (Aperte 'q' para sair do top)

# Ou ver os processos mais pesados:
ps aux --sort=-%cpu | head -10     # Top 10 por CPU
ps aux --sort=-%mem | head -10     # Top 10 por memória

# 4. Matar o programa que travou:
killall firefox
killall chrome
killall nome_do_programa

# Se não funcionar com killall normal:
killall -9 nome_do_programa

# 5. Se a interface gráfica em si travou, reinicie ela:

# Para GNOME (GDM):
sudo systemctl restart gdm

# Para KDE (SDDM):
sudo systemctl restart sddm

# Para LightDM:
sudo systemctl restart lightdm

# ATENÇÃO: Reiniciar o display manager FECHA todas as janelas abertas!
# Salve seu trabalho antes se possível.

# 6. Se nada funcionar e quiser reiniciar o computador de forma limpa:
sudo reboot

# Se até o reboot travar:
sudo reboot -f       # Força o reboot (mais agressivo)

# 7. Voltar para a interface gráfica (se ela voltou ao normal):
# Ctrl+Alt+F1`}
      />

      <h3>Atalhos de emergência do kernel (SysRq - último recurso)</h3>
      <p>
        Quando absolutamente NADA funciona — nem o TTY, nem Ctrl+Alt+Del, nem nada —
        o Linux tem uma combinação de teclas chamada <strong>Magic SysRq</strong> que fala
        diretamente com o kernel, mesmo que todo o resto do sistema esteja congelado.
      </p>
      <CodeBlock
        title="Magic SysRq - REISUB (reiniciar com segurança)"
        code={`# O famoso REISUB - reinicialização segura quando tudo congela
# Segure Alt+SysRq (ou Alt+Print Screen) e pressione estas teclas
# UMA POR VEZ, esperando ~2 segundos entre cada uma:

# R - unRaw    → Retoma o controle do teclado (tira do modo raw)
# E - tErminat → Envia SIGTERM para todos os processos (pede para fechar)
# I - kIll     → Envia SIGKILL para todos os processos (força fechar)
# S - Sync     → Sincroniza os discos (salva dados pendentes no disco)
# U - Unmount  → Desmonta todos os sistemas de arquivos (remonta read-only)
# B - reBoot   → Reinicia o computador

# === PASSO A PASSO ===
# 1. Segure  Alt + SysRq (Print Screen)
# 2. Aperte  R  (espere 2 segundos)
# 3. Aperte  E  (espere 5 segundos - processos estão fechando)
# 4. Aperte  I  (espere 5 segundos - matando o que sobrou)
# 5. Aperte  S  (espere 3 segundos - salvando dados no disco)
# 6. Aperte  U  (espere 3 segundos - desmontando discos)
# 7. Aperte  B  (reinicia o computador)

# DICA PARA MEMORIZAR: "Reboot Even If System Utterly Broken"
# (Reinicie Mesmo Se o Sistema Estiver Completamente Quebrado)

# === VERIFICAR SE SYSRQ ESTÁ HABILITADO ===
cat /proc/sys/kernel/sysrq
# 1 = habilitado (todas as funções)
# 0 = desabilitado
# 16 = apenas sync
# 176 = valor padrão do Arch (sync + remount + reboot)

# Habilitar todas as funções do SysRq:
echo 1 | sudo tee /proc/sys/kernel/sysrq

# Tornar permanente:
echo "kernel.sysrq=1" | sudo tee /etc/sysctl.d/99-sysrq.conf`}
      />

      <AlertBox type="warning" title="SysRq no teclado">
        <p>A tecla SysRq geralmente fica na mesma tecla que <strong>Print Screen</strong>
        (no canto superior direito do teclado). Em notebooks, pode ser necessário pressionar
        <strong>Fn + Alt + Print Screen</strong>. Em alguns teclados compactos, a tecla pode
        não existir.</p>
      </AlertBox>

      <h3>Resumo: Escala de emergência</h3>
      <p>Use as soluções nesta ordem, da mais leve para a mais pesada:</p>
      <ul>
        <li><strong>Nível 1:</strong> <code>killall programa</code> ou <code>kill PID</code> no terminal → mata só o programa travado</li>
        <li><strong>Nível 2:</strong> <code>xkill</code> → clica na janela travada para fechar</li>
        <li><strong>Nível 3:</strong> <code>killall -9 programa</code> → força o encerramento do programa</li>
        <li><strong>Nível 4:</strong> <code>Ctrl+Alt+F2</code> → abre o TTY para usar o terminal quando a interface travou</li>
        <li><strong>Nível 5:</strong> No TTY: <code>sudo systemctl restart gdm</code> → reinicia a interface gráfica inteira</li>
        <li><strong>Nível 6:</strong> No TTY: <code>sudo reboot</code> → reinicia o computador</li>
        <li><strong>Nível 7:</strong> <code>Alt+SysRq+REISUB</code> → reinicialização segura direto pelo kernel (quando NADA responde)</li>
      </ul>

      <h2>10. O que NÃO fazer</h2>

      <AlertBox type="danger" title="Práticas perigosas com processos">
        <ul>
          <li><code>kill -9</code> como primeiro recurso — sempre tente <code>kill</code> (SIGTERM) primeiro</li>
          <li><code>killall -9 -u root</code> — mata TODOS os processos do root, incluindo o init. O sistema trava instantaneamente</li>
          <li><code>sudo kill -9 1</code> — matar o PID 1 (systemd/init) causa kernel panic</li>
          <li>Rodar processos pesados com <code>nice -n -20</code> sem necessidade — pode prejudicar a responsividade do sistema</li>
          <li>Ignorar processos zombie — embora consumam poucos recursos, muitos zombies indicam um bug no programa pai</li>
        </ul>
      </AlertBox>

      <h2>11. Referências</h2>
      <ul>
        <li><code>man ps</code> - Manual completo do ps</li>
        <li><code>man kill</code> - Manual do kill e sinais</li>
        <li><code>man 7 signal</code> - Lista completa de sinais do Linux</li>
        <li><a href="https://wiki.archlinux.org/title/Process_management" target="_blank" rel="noopener noreferrer">ArchWiki - Process Management</a></li>
        <li><a href="https://wiki.archlinux.org/title/Htop" target="_blank" rel="noopener noreferrer">ArchWiki - htop</a></li>
      </ul>

    </PageContainer>
  );
}
