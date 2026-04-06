import{j as o}from"./ui-K-J8Jkwj.js";import{P as r}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import{A as a}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function u(){return o.jsxs(r,{title:"Logs do Sistema",subtitle:"Domine o journalctl e o sistema de logs do Linux. Diagnose problemas, filtre mensagens e configure o journald para monitorar seu Arch Linux eficientemente.",difficulty:"intermediario",timeToRead:"15 min",children:[o.jsx("h2",{children:"systemd-journald"}),o.jsxs("p",{children:["O Arch Linux usa o ",o.jsx("code",{children:"systemd-journald"})," para coletar e armazenar logs do sistema. Diferente do syslog tradicional (arquivos de texto em ",o.jsx("code",{children:"/var/log/"}),"), o journald armazena logs em formato binário estruturado com metadados ricos."]}),o.jsx("p",{children:"Vantagens do journald:"}),o.jsxs("ul",{children:[o.jsx("li",{children:"Logs indexados para busca rápida"}),o.jsx("li",{children:"Metadados automáticos (PID, UID, serviço, prioridade)"}),o.jsx("li",{children:"Compressão automática de logs antigos"}),o.jsx("li",{children:"Rotação de logs integrada"}),o.jsx("li",{children:"Corrupção de logs detectada por checksums"})]}),o.jsx("h2",{children:"journalctl - Comandos Essenciais"}),o.jsx(e,{title:"Navegando pelos logs",code:`# Ver todos os logs (do mais antigo ao mais recente)
journalctl

# Ver logs do boot atual (mais comum)
journalctl -b

# Ver logs do boot anterior
journalctl -b -1

# Ver logs dos últimos N boots
journalctl --list-boots  # Listar todos os boots
journalctl -b -2         # 2 boots atrás

# Ver logs em tempo real (como 'tail -f')
journalctl -f

# Ver apenas os últimos N registros
journalctl -n 50         # Últimas 50 linhas
journalctl -n 100 -f     # Últimas 100 + seguir em tempo real`}),o.jsx("h2",{children:"Filtragem por Serviço"}),o.jsx(e,{title:"Filtrar logs por unidade systemd",code:`# Logs de um serviço específico
journalctl -u nginx
journalctl -u sshd
journalctl -u NetworkManager

# Seguir logs de um serviço em tempo real
journalctl -u nginx -f

# Logs de múltiplos serviços
journalctl -u nginx -u postgresql

# Ver últimas 50 linhas de um serviço
journalctl -u sshd -n 50

# Logs do boot atual de um serviço
journalctl -u NetworkManager -b`}),o.jsx("h2",{children:"Filtragem por Prioridade"}),o.jsx(e,{title:"Filtrar por nível de severidade",code:`# Prioridades (do mais crítico ao menos crítico):
# 0 = emerg    (sistema inutilizável)
# 1 = alert    (ação imediata necessária)
# 2 = crit     (condição crítica)
# 3 = err      (erro)
# 4 = warning  (aviso)
# 5 = notice   (normal mas significativo)
# 6 = info     (informacional)
# 7 = debug    (debug)

# Ver apenas erros e acima
journalctl -p err

# Ver apenas warnings e acima
journalctl -p warning

# Ver range de prioridade
journalctl -p err..warning

# Combinar com outros filtros
journalctl -b -p err -u nginx`}),o.jsx("h2",{children:"Filtragem por Tempo"}),o.jsx(e,{title:"Filtrar por período de tempo",code:`# Logs desde uma data específica
journalctl --since "2025-01-15 10:00:00"

# Logs até uma data
journalctl --until "2025-01-15 12:00:00"

# Logs em um intervalo
journalctl --since "2025-01-15 10:00:00" --until "2025-01-15 12:00:00"

# Notação relativa
journalctl --since "1 hour ago"
journalctl --since "30 min ago"
journalctl --since yesterday
journalctl --since today

# Combinar com serviço
journalctl -u nginx --since "2 hours ago" -f`}),o.jsx("h2",{children:"Filtragem por Processo e Usuário"}),o.jsx(e,{title:"Filtrar por PID, UID ou programa",code:`# Logs de um PID específico
journalctl _PID=1234

# Logs de um usuário específico (UID)
journalctl _UID=1000
journalctl _UID=$(id -u)  # Seu próprio usuário

# Logs de um executável específico
journalctl _EXE=/usr/bin/python3
journalctl _EXE=/usr/bin/sshd

# Logs do kernel
journalctl -k        # Equivalente a dmesg
journalctl -k -b     # Kernel do boot atual
journalctl -k -f     # Kernel em tempo real

# Busca por texto
journalctl | grep "error"
journalctl -b -u nginx | grep "404"`}),o.jsx("h2",{children:"Formatos de Saída"}),o.jsx(e,{title:"Diferentes formatos de saída",code:`# Formato padrão (curto com data/hora)
journalctl -b -u sshd

# Formato verbose (todos os campos)
journalctl -o verbose -b -u sshd

# Formato JSON (para processar programaticamente)
journalctl -o json -b -u nginx | python3 -m json.tool | head -30

# Formato JSON compacto (uma linha por entrada)
journalctl -o json-pretty -u nginx | head -50

# Formato cat (sem metadados, apenas mensagem)
journalctl -o cat -u nginx

# Formato curto com monotonic time
journalctl -o short-monotonic -b

# Exportar logs para arquivo
journalctl -b -u nginx > /tmp/nginx-logs.txt
journalctl -b --output=json > /tmp/journal.json`}),o.jsx("h2",{children:"Configuração do Journald"}),o.jsx(e,{title:"/etc/systemd/journald.conf",code:`[Journal]
# Limitar tamanho dos logs em disco
SystemMaxUse=500M        # Máximo 500MB de logs persistentes
SystemMaxFileSize=50M    # Tamanho máximo de cada arquivo
RuntimeMaxUse=100M       # Logs em memória RAM (/run/log/journal/)

# Quanto manter livre no disco
SystemKeepFree=1G

# Compressão (padrão: yes)
Compress=yes

# Persistência dos logs (importante!)
# volatile:   Apenas em RAM (perdido no reboot) - padrão sem /var/log/journal/
# persistent: Salvo em /var/log/journal/ (sobrevive reboots)
# auto:       Persistente se /var/log/journal/ existe
Storage=persistent

# Retenção por tempo (ex: 1month, 1week, 2days)
MaxRetentionSec=1month

# Nível de log do kernel
MaxLevelKMsg=notice`}),o.jsx(e,{title:"Ativar logs persistentes",code:`# Por padrão no Arch, logs NÃO são persistentes (perdidos no reboot)
# Para tornar persistentes:

sudo mkdir -p /var/log/journal
sudo systemd-tmpfiles --create --prefix /var/log/journal

# Ou definir Storage=persistent no journald.conf e reiniciar
sudo systemctl restart systemd-journald

# Verificar se está funcionando
ls /var/log/journal/    # Deve haver um diretório com UID

# Verificar uso atual
journalctl --disk-usage`}),o.jsx("h2",{children:"Logs Tradicionais em /var/log"}),o.jsx(e,{title:"Arquivos de log tradicionais",code:`# Alguns serviços ainda escrevem em /var/log/
ls /var/log/

# Arquivos comuns:
# /var/log/Xorg.0.log      - Log do servidor X11
# /var/log/pacman.log       - Histórico do pacman
# /var/log/nginx/           - Logs do Nginx
# /var/log/postgresql/      - Logs do PostgreSQL

# Monitorar arquivo de log em tempo real
tail -f /var/log/nginx/error.log
tail -f /var/log/pacman.log

# Ver últimas 100 linhas
tail -100 /var/log/pacman.log

# Histórico completo de instalações/remoções do pacman
cat /var/log/pacman.log | grep "installed|removed|upgraded"`}),o.jsxs(a,{type:"info",title:"rsyslog e syslog-ng",children:["Se você precisar de logs no formato tradicional (compatível com ferramentas antigas), pode instalar o ",o.jsx("code",{children:"rsyslog"})," ou ",o.jsx("code",{children:"syslog-ng"})," que coexistem com o journald e criam arquivos em ",o.jsx("code",{children:"/var/log/syslog"}),"."]}),o.jsx("h2",{children:"Analisar Erros do Sistema"}),o.jsx(e,{title:"Workflow de diagnóstico",code:`# 1. Ver erros do boot atual
journalctl -b -p err

# 2. Ver erros do boot (kernel + serviços)
journalctl -b -p err --no-pager | head -50

# 3. Verificar serviços com falha
systemctl --failed

# 4. Ver logs do serviço com falha
journalctl -u nome-servico -n 50

# 5. Identificar o problema exato
journalctl -u nome-servico -b --no-pager | grep -i "error|failed|critical"

# 6. Verificar quando o problema começou
journalctl -u nome-servico --since "1 week ago" | grep -i error

# Relatório de erros de hardware (importante!)
journalctl -k -b | grep -iE "error|fail|hardware|mce|thermal"

# Verificar memória com erro corrigível (ECC)
journalctl -k | grep -i "EDAC|mce|machine check"`})]})}export{u as default};
