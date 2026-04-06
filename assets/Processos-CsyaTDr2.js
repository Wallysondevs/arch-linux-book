import{j as e}from"./ui-K-J8Jkwj.js";import{P as a}from"./PageContainer-tnnsMrcC.js";import{C as o}from"./CodeBlock-DEDRw1y6.js";import{A as r}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function m(){return e.jsxs(a,{title:"Processos e Gerenciamento de Tarefas",subtitle:"Entenda como o Linux gerencia processos, como monitorá-los e como controlá-los — desde o básico até sinais avançados.",difficulty:"intermediario",timeToRead:"25 min",children:[e.jsx("p",{children:"Todo programa em execução no Linux é um processo. Cada processo tem um PID (Process ID) único, um dono, prioridade e estado. Saber gerenciar processos é essencial para diagnosticar problemas, liberar recursos e manter o sistema saudável."}),e.jsx("h2",{children:"1. Visualizando Processos - ps"}),e.jsxs("p",{children:["O comando ",e.jsx("code",{children:"ps"})," (process status) mostra um snapshot dos processos em execução. Existem dois estilos de flags: estilo BSD (sem hífen) e estilo UNIX (com hífen)."]}),e.jsx(o,{code:`# Mostrar TODOS os processos do sistema (estilo BSD - mais comum)
ps aux

# Explicação das colunas:
# USER   PID  %CPU %MEM    VSZ   RSS TTY  STAT START  TIME COMMAND
# root     1   0.0  0.1 169516 13280 ?    Ss   jan01  0:05 /sbin/init
# joao  1234   2.3  1.5 456780 120000 ?   Sl   10:30  1:23 /usr/bin/firefox`}),e.jsx("p",{children:"Significado das colunas:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"USER"})," - Dono do processo"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"PID"})," - ID do processo"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"%CPU"})," - Porcentagem de CPU utilizada"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"%MEM"})," - Porcentagem de memória RAM utilizada"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"VSZ"})," - Memória virtual (KB)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"RSS"})," - Memória física real (KB)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"TTY"})," - Terminal associado (? = sem terminal)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"STAT"})," - Estado do processo"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"START"})," - Hora/data de início"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"TIME"})," - Tempo total de CPU usado"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"COMMAND"})," - Comando que iniciou o processo"]})]}),e.jsx("p",{children:"Estados do processo (coluna STAT):"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"R"})," - Running (executando ou na fila)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"S"})," - Sleeping (aguardando um evento)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"D"})," - Uninterruptible sleep (geralmente esperando I/O de disco)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"T"})," - Stopped (pausado, ex: Ctrl+Z)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Z"})," - Zombie (terminou mas o pai não coletou o status)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"s"})," - Líder de sessão"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"l"})," - Multi-thread"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"+"})," - Em foreground"]})]}),e.jsx(o,{code:`# Estilo UNIX com hierarquia (mostra árvore de processos)
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
ps -T -p 1234`}),e.jsx("h3",{children:"pgrep - Buscar PIDs por nome"}),e.jsx(o,{code:`# Encontrar PID de um processo pelo nome
pgrep firefox

# Mostrar nome e PID
pgrep -l firefox

# Mostrar a linha de comando completa
pgrep -a firefox

# Filtrar por usuário
pgrep -u joao

# Contar quantos processos batem
pgrep -c firefox`}),e.jsx("h2",{children:"2. Monitoramento em Tempo Real"}),e.jsx("h3",{children:"top"}),e.jsx("p",{children:"Monitor interativo que vem pré-instalado em praticamente todo sistema Linux."}),e.jsx(o,{code:`# Iniciar o top
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
top -bn1 | head -20`}),e.jsx("h3",{children:"htop"}),e.jsx("p",{children:"Versão melhorada do top, com interface colorida, barras de uso e suporte a mouse."}),e.jsx(o,{code:`# Instalar o htop
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
# /      - Buscar`}),e.jsx("h3",{children:"btop"}),e.jsx("p",{children:"Monitor moderno com gráficos bonitos no terminal. Mostra CPU, memória, disco e rede."}),e.jsx(o,{code:`# Instalar
sudo pacman -S btop

# Executar
btop`}),e.jsx("h2",{children:"3. Sinais (Signals)"}),e.jsx("p",{children:'Sinais são mecanismos de comunicação entre processos. Quando você "mata" um processo, na verdade está enviando um sinal para ele.'}),e.jsx(o,{code:`# Listar todos os sinais disponíveis
kill -l

# Sinais mais importantes:
# 1  - SIGHUP    - Hangup (recarregar configuração)
# 2  - SIGINT    - Interrupt (equivalente a Ctrl+C)
# 9  - SIGKILL   - Kill forçado (NÃO pode ser ignorado)
# 15 - SIGTERM   - Terminate (pede para o processo encerrar graciosamente)
# 18 - SIGCONT   - Continue (retomar processo pausado)
# 19 - SIGSTOP   - Stop (pausar, NÃO pode ser ignorado)
# 20 - SIGTSTP   - Terminal Stop (equivalente a Ctrl+Z)`}),e.jsx(r,{type:"warning",title:"SIGTERM vs SIGKILL",children:"Sempre tente SIGTERM (15) primeiro. Ele permite que o processo salve dados e limpe recursos antes de sair. Use SIGKILL (9) apenas como último recurso — ele mata o processo imediatamente, podendo causar corrupção de dados ou arquivos temporários abandonados."}),e.jsx("h2",{children:"4. Matando Processos"}),e.jsx("h3",{children:"kill"}),e.jsx(o,{code:`# Enviar SIGTERM (padrão, educado) - pede para o processo encerrar
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
kill 1234 5678 9012`}),e.jsx("h3",{children:"killall"}),e.jsx(o,{code:`# Matar TODOS os processos com esse nome
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
killall -y 5m firefox`}),e.jsx("h3",{children:"pkill"}),e.jsx(o,{code:`# Matar por nome (busca parcial, diferente do killall)
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
pkill -P 1234`}),e.jsxs(r,{type:"danger",title:"Cuidado com pkill!",children:["O ",e.jsx("code",{children:"pkill"})," faz busca parcial por padrão. Se você digitar ",e.jsx("code",{children:"pkill fire"}),", ele pode matar processos que você não esperava. Use ",e.jsx("code",{children:"pgrep -l fire"})," antes para verificar quais processos seriam afetados."]}),e.jsx("h3",{children:"xkill"}),e.jsx(o,{code:`# Matar janela gráfica clicando nela (útil quando um app trava)
# Instalar: sudo pacman -S xorg-xkill
xkill
# Agora clique na janela que deseja fechar`}),e.jsx("h2",{children:"5. Prioridade de Processos - nice e renice"}),e.jsx("p",{children:'No Linux, cada processo tem um valor de "niceness" que define sua prioridade. O valor vai de -20 (maior prioridade) a 19 (menor prioridade). O padrão é 0.'}),e.jsx(o,{code:`# Iniciar um processo com prioridade baixa (gentil com outros processos)
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
sudo renice -20 -p 1234`}),e.jsx("h2",{children:"6. Processos em Background e Foreground"}),e.jsx("h3",{children:"Executando em Background"}),e.jsx(o,{code:`# Iniciar um processo em background (adicione & no final)
firefox &

# O terminal mostra o job number e PID:
# [1] 12345

# Redirecionar saída para não poluir o terminal
firefox &>/dev/null &`}),e.jsx("h3",{children:"jobs, fg, bg"}),e.jsx(o,{code:`# Pausar o processo atual (envia SIGTSTP)
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
bg         # continua o mais recente`}),e.jsx("h3",{children:"nohup - Resistindo ao logout"}),e.jsx(o,{code:`# Executar processo que sobrevive ao fechamento do terminal
nohup ./script_longo.sh &

# A saída vai para o arquivo nohup.out por padrão
# Redirecionar saída para outro arquivo
nohup ./script_longo.sh > log.txt 2>&1 &

# Alternativa moderna: usar disown
firefox &
disown %1    # agora o firefox sobrevive ao fechar o terminal`}),e.jsx("h2",{children:"7. Comandos Úteis para Diagnóstico"}),e.jsx("h3",{children:"uptime e load average"}),e.jsx(o,{code:`# Ver há quanto tempo o sistema está ligado e carga média
uptime
# 14:30:22 up 5 days, 3:15, 2 users, load average: 0.52, 0.48, 0.35

# Os 3 números do load average representam:
# Média de processos na fila nos últimos 1, 5 e 15 minutos
# Valor ideal: menor ou igual ao número de cores da CPU`}),e.jsx("h3",{children:"free - Memória do sistema"}),e.jsx(o,{code:`# Ver uso de memória RAM e swap
free -h

# Saída:
#               total    used    free   shared  buff/cache   available
# Mem:          15Gi    4.2Gi    5.1Gi   512Mi     6.1Gi       10Gi
# Swap:         8.0Gi      0B    8.0Gi

# Atualizar a cada 2 segundos
free -h -s 2`}),e.jsx("h3",{children:"pstree - Árvore de processos"}),e.jsx(o,{code:`# Mostrar árvore de processos
pstree

# Mostrar com PIDs
pstree -p

# Mostrar árvore de um processo específico
pstree -p 1234

# Mostrar com nome do usuário
pstree -u`}),e.jsx("h3",{children:"lsof - Arquivos abertos por processos"}),e.jsx(o,{code:`# Listar todos os arquivos abertos (MUITA saída)
sudo lsof

# Ver quais processos estão usando uma porta
sudo lsof -i :8080

# Ver arquivos abertos por um processo
sudo lsof -p 1234

# Ver quais processos estão usando um arquivo/diretório
sudo lsof /var/log/syslog

# Ver conexões de rede de um processo
sudo lsof -i -a -p 1234`}),e.jsx("h3",{children:"strace - Rastrear chamadas do sistema"}),e.jsx(o,{code:`# Rastrear chamadas de sistema de um comando
strace ls

# Rastrear um processo em execução
sudo strace -p 1234

# Rastrear apenas chamadas de rede
strace -e network ls

# Rastrear apenas acesso a arquivos
strace -e trace=open,read,write ls

# Salvar a saída em arquivo
strace -o saida.txt ls`}),e.jsx("h2",{children:"8. Matando Programas Travados na Interface Gráfica"}),e.jsxs("p",{children:["Um dos problemas mais comuns no dia a dia é um programa travar na interface gráfica — ele para de responder, não fecha com o botão X, e às vezes congela a tela inteira. No Windows, você usaria o ",e.jsx("code",{children:"Ctrl+Alt+Del"}),' e o Gerenciador de Tarefas. No Linux, existem várias formas de resolver isso, desde as mais simples até a "nuclear".']}),e.jsx("h3",{children:"Cenário 1: Programa travou mas o resto funciona"}),e.jsx("p",{children:"Se só um programa travou (exemplo: Firefox, Chrome, LibreOffice) mas o resto da interface continua funcionando, você pode matar ele pelo terminal:"}),e.jsx(o,{title:"Matar programa travado pelo terminal",code:`# Abra um terminal (se conseguir) e encontre o processo:
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
pkill -9 firefox`}),e.jsx("h3",{children:"Cenário 2: Chrome/Chromium com dezenas de processos"}),e.jsx("p",{children:"O Chrome (e navegadores baseados em Chromium como Brave, Edge, Vivaldi) cria um processo separado para cada aba, extensão e plugin. Quando trava, pode deixar 20, 30 ou mais processos pendurados."}),e.jsx(o,{title:"Entendendo os processos do Chrome",code:`# Ver todos os processos do Chrome:
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
# 23  (23 processos!)`}),e.jsx("h3",{children:"Cenário 3: Matar janela clicando nela (xkill)"}),e.jsxs("p",{children:["Se o programa travou mas você consegue ver a janela dele, pode usar o ",e.jsx("code",{children:"xkill"}),"para matar clicando na janela (funciona em X11/Xorg):"]}),e.jsx(o,{title:"xkill - Matar janela com clique",code:`# Instalar (se não tiver)
sudo pacman -S xorg-xkill

# Executar:
xkill
# O cursor do mouse vira um X
# Clique na janela que quer fechar → o programa é morto imediatamente

# Cancelar sem matar nada: clique com botão direito ou aperte ESC

# Dica: Adicionar atalho de teclado no seu DE
# No GNOME: Configurações → Teclado → Atalhos → Adicionar
# No KDE: Configurações do Sistema → Atalhos → Adicionar
# Defina algo como Ctrl+Alt+X para rodar "xkill"`}),e.jsx(r,{type:"info",title:"xkill no Wayland",children:e.jsxs("p",{children:["O ",e.jsx("code",{children:"xkill"})," é uma ferramenta do X11 e pode não funcionar em sessões Wayland puras. No GNOME com Wayland, use ",e.jsx("code",{children:"Alt+F2"})," e digite ",e.jsx("code",{children:"r"})," para reiniciar o GNOME Shell, ou use os comandos de terminal (",e.jsx("code",{children:"killall"}),", ",e.jsx("code",{children:"kill"}),")."]})}),e.jsx("h3",{children:"Cenário 4: Não consegue abrir terminal (compositor gráfico travou)"}),e.jsx("p",{children:"Se a interface gráfica inteira congelou e você não consegue abrir nenhuma janela, nem clicar em nada, tente estes atalhos de teclado:"}),e.jsx(o,{title:"Atalhos de emergência na interface gráfica",code:`# === GNOME ===
Alt+F2              → Abre o prompt de execução do GNOME (digite "r" e Enter para reiniciar o Shell)

# === KDE Plasma ===
Ctrl+Alt+Del        → Abre o menu de logout (deslogar, reiniciar, desligar)

# === Geral (funciona em qualquer DE com X11) ===
Ctrl+Alt+Backspace  → Mata o servidor X inteiro (mata TODOS os programas gráficos!)
                       Pode precisar habilitar: setxkbmap -option terminate:ctrl_alt_bksp`}),e.jsx("h2",{children:"9. TTY - O Terminal de Emergência (Quando a Interface Morre)"}),e.jsxs("p",{children:["Essa é a ferramenta mais importante que você precisa conhecer. O ",e.jsx("strong",{children:"TTY"}),"(TeleTYpe) é um terminal virtual puro — uma tela preta com texto branco, sem interface gráfica nenhuma. Ele funciona ",e.jsx("strong",{children:"independentemente"})," da interface gráfica. Mesmo que o GNOME, KDE, X11 ou Wayland travem completamente, o TTY continua funcionando."]}),e.jsx("p",{children:"O Linux tem vários TTYs disponíveis (geralmente 6). A interface gráfica usa o TTY1 ou TTY2, e os outros ficam livres para você usar."}),e.jsx(o,{title:"Acessando o TTY",code:`# === ENTRAR NO TTY ===
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
# - Debugar o que causou o travamento`}),e.jsx(r,{type:"success",title:"O TTY é seu salva-vidas!",children:e.jsxs("p",{children:["Memorize ",e.jsx("strong",{children:"Ctrl+Alt+F2"}),". Quando tudo travar e você não conseguir fazer nada na interface gráfica, essa combinação vai abrir uma tela preta com um terminal funcional onde você pode matar processos, salvar dados e reiniciar o sistema de forma limpa."]})}),e.jsx("h3",{children:"O que fazer no TTY quando a interface trava"}),e.jsx(o,{title:"Procedimento de recuperação via TTY",code:`# 1. Pressione Ctrl+Alt+F2 para abrir o TTY2
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
# Ctrl+Alt+F1`}),e.jsx("h3",{children:"Atalhos de emergência do kernel (SysRq - último recurso)"}),e.jsxs("p",{children:["Quando absolutamente NADA funciona — nem o TTY, nem Ctrl+Alt+Del, nem nada — o Linux tem uma combinação de teclas chamada ",e.jsx("strong",{children:"Magic SysRq"})," que fala diretamente com o kernel, mesmo que todo o resto do sistema esteja congelado."]}),e.jsx(o,{title:"Magic SysRq - REISUB (reiniciar com segurança)",code:`# O famoso REISUB - reinicialização segura quando tudo congela
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
echo "kernel.sysrq=1" | sudo tee /etc/sysctl.d/99-sysrq.conf`}),e.jsx(r,{type:"warning",title:"SysRq no teclado",children:e.jsxs("p",{children:["A tecla SysRq geralmente fica na mesma tecla que ",e.jsx("strong",{children:"Print Screen"}),"(no canto superior direito do teclado). Em notebooks, pode ser necessário pressionar",e.jsx("strong",{children:"Fn + Alt + Print Screen"}),". Em alguns teclados compactos, a tecla pode não existir."]})}),e.jsx("h3",{children:"Resumo: Escala de emergência"}),e.jsx("p",{children:"Use as soluções nesta ordem, da mais leve para a mais pesada:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Nível 1:"})," ",e.jsx("code",{children:"killall programa"})," ou ",e.jsx("code",{children:"kill PID"})," no terminal → mata só o programa travado"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Nível 2:"})," ",e.jsx("code",{children:"xkill"})," → clica na janela travada para fechar"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Nível 3:"})," ",e.jsx("code",{children:"killall -9 programa"})," → força o encerramento do programa"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Nível 4:"})," ",e.jsx("code",{children:"Ctrl+Alt+F2"})," → abre o TTY para usar o terminal quando a interface travou"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Nível 5:"})," No TTY: ",e.jsx("code",{children:"sudo systemctl restart gdm"})," → reinicia a interface gráfica inteira"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Nível 6:"})," No TTY: ",e.jsx("code",{children:"sudo reboot"})," → reinicia o computador"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Nível 7:"})," ",e.jsx("code",{children:"Alt+SysRq+REISUB"})," → reinicialização segura direto pelo kernel (quando NADA responde)"]})]}),e.jsx("h2",{children:"10. O que NÃO fazer"}),e.jsx(r,{type:"danger",title:"Práticas perigosas com processos",children:e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"kill -9"})," como primeiro recurso — sempre tente ",e.jsx("code",{children:"kill"})," (SIGTERM) primeiro"]}),e.jsxs("li",{children:[e.jsx("code",{children:"killall -9 -u root"})," — mata TODOS os processos do root, incluindo o init. O sistema trava instantaneamente"]}),e.jsxs("li",{children:[e.jsx("code",{children:"sudo kill -9 1"})," — matar o PID 1 (systemd/init) causa kernel panic"]}),e.jsxs("li",{children:["Rodar processos pesados com ",e.jsx("code",{children:"nice -n -20"})," sem necessidade — pode prejudicar a responsividade do sistema"]}),e.jsx("li",{children:"Ignorar processos zombie — embora consumam poucos recursos, muitos zombies indicam um bug no programa pai"})]})}),e.jsx("h2",{children:"11. Referências"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"man ps"})," - Manual completo do ps"]}),e.jsxs("li",{children:[e.jsx("code",{children:"man kill"})," - Manual do kill e sinais"]}),e.jsxs("li",{children:[e.jsx("code",{children:"man 7 signal"})," - Lista completa de sinais do Linux"]}),e.jsx("li",{children:e.jsx("a",{href:"https://wiki.archlinux.org/title/Process_management",target:"_blank",rel:"noopener noreferrer",children:"ArchWiki - Process Management"})}),e.jsx("li",{children:e.jsx("a",{href:"https://wiki.archlinux.org/title/Htop",target:"_blank",rel:"noopener noreferrer",children:"ArchWiki - htop"})})]})]})}export{m as default};
