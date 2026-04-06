import{j as a}from"./ui-K-J8Jkwj.js";import{P as r}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function m(){return a.jsxs(r,{title:"Automação com Cron & systemd",subtitle:"Automatize tarefas repetitivas com cron, systemd timers e shell scripts. Backups automáticos, alertas, manutenção e muito mais.",difficulty:"intermediario",timeToRead:"15 min",children:[a.jsx("h2",{children:"Cron vs systemd Timers"}),a.jsxs("ul",{children:[a.jsxs("li",{children:[a.jsx("strong",{children:"Cron"})," — Clássico, simples, funciona bem. Limitações: sem dependências, logs básicos, não sabe se o sistema estava desligado."]}),a.jsxs("li",{children:[a.jsx("strong",{children:"systemd timers"})," — Moderno, integrado ao systemd. Logs no journald, suporte a Persistent (roda quando o sistema liga), dependências, e mais controle."]})]}),a.jsx("h2",{children:"Cron"}),a.jsx(e,{title:"Configurar tarefas cron",code:`# Instalar cron (Arch não vem com cron)
sudo pacman -S cronie

# Habilitar e iniciar
sudo systemctl enable --now cronie

# Editar crontab do usuário atual
crontab -e

# Editar crontab do root
sudo crontab -e

# Listar crontabs
crontab -l
sudo crontab -l

# Formato do crontab:
# minuto hora dia-do-mês mês dia-da-semana comando
# * = qualquer valor
# */5 = a cada 5 unidades
# 1-5 = de 1 a 5
# 1,3,5 = 1, 3 e 5`}),a.jsx(e,{title:"Exemplos de crontabs",code:`# Executar backup todos os dias às 2h da manhã
0 2 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1

# Verificar espaço em disco a cada hora
0 * * * * df -h > /tmp/disk-report.txt

# Atualizar sistema toda segunda às 3h
0 3 * * 1 pacman -Syu --noconfirm >> /var/log/updates.log 2>&1

# Limpar arquivos temporários toda meia-noite
0 0 * * * find /tmp -mtime +7 -delete

# Executar script a cada 5 minutos
*/5 * * * * /usr/local/bin/monitor.sh

# Executar às 9h de segunda a sexta
0 9 * * 1-5 /usr/local/bin/relatorio.sh

# Primeiro dia de cada mês
0 0 1 * * /usr/local/bin/backup-mensal.sh

# Reiniciar serviço a cada 30 minutos (gambiarra - prefira systemd)
*/30 * * * * systemctl restart meu-servico

# Atalhos especiais:
# @reboot  - Ao iniciar o sistema
# @hourly  - A cada hora
# @daily   - Uma vez por dia (00:00)
# @weekly  - Uma vez por semana (domingo 00:00)
# @monthly - Primeiro do mês (00:00)
# @yearly  - 1 de janeiro (00:00)

@reboot /usr/local/bin/inicializar.sh
@daily /usr/local/bin/relatorio-diario.sh`}),a.jsx("h2",{children:"systemd Timers"}),a.jsx(e,{title:"Criar um systemd timer",code:`# Exemplo: Timer para verificar atualizações diariamente

# 1. Criar o service (o que vai ser executado)
sudo nano /etc/systemd/system/verificar-updates.service`}),a.jsx(e,{title:"verificar-updates.service",code:`[Unit]
Description=Verificar atualizações do sistema
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
User=root
ExecStart=/bin/bash -c 'pacman -Sy --noconfirm && checkupdates > /tmp/updates.txt 2>&1'
StandardOutput=journal
StandardError=journal`}),a.jsx(e,{title:"verificar-updates.timer",code:`[Unit]
Description=Verificar atualizações diariamente

[Timer]
# Quando executar:
OnCalendar=daily            # Uma vez por dia (meia-noite)
# OnCalendar=*-*-* 09:00:00 # Todos os dias às 9h
# OnCalendar=weekly         # Uma vez por semana
# OnCalendar=Mon,Wed,Fri    # Segunda, quarta e sexta
# OnCalendar=*:0/15         # A cada 15 minutos

# Se o timer "perdeu" um disparo (sistema estava desligado), executa ao ligar
Persistent=true

# Delay aleatório para não sobrecarregar (0 a 1 hora)
RandomizedDelaySec=1h

[Install]
WantedBy=timers.target`}),a.jsx(e,{title:"Ativar e gerenciar timers",code:`# Recarregar configurações
sudo systemctl daemon-reload

# Habilitar e iniciar o timer
sudo systemctl enable --now verificar-updates.timer

# Ver timers ativos
systemctl list-timers
systemctl list-timers --all

# Ver próxima execução
systemctl status verificar-updates.timer

# Executar service manualmente (para testar)
sudo systemctl start verificar-updates.service

# Ver logs do service
journalctl -u verificar-updates.service -n 50`}),a.jsx("h2",{children:"Shell Scripts de Automação"}),a.jsx(e,{title:"Script de monitoramento do sistema",code:`#!/bin/bash
# monitor.sh - Monitor de recursos do sistema

# Configurações
ALERTA_CPU=90      # Alertar se CPU > 90%
ALERTA_RAM=90      # Alertar se RAM > 90%
ALERTA_DISCO=85    # Alertar se disco > 85%
EMAIL="admin@dominio.com"

# Uso de CPU
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 | cut -d',' -f1)
CPU=\${CPU%.*}    # Remover decimais

# Uso de RAM
RAM=$(free | grep Mem | awk '{print $3/$2 * 100.0}')
RAM=\${RAM%.*}

# Uso de disco
DISCO=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')

# Verificar e alertar
if [ "$CPU" -gt "$ALERTA_CPU" ]; then
    echo "ALERTA: CPU em \${CPU}%!" | mail -s "Alerta de CPU" "$EMAIL"
    echo "ALERTA CPU: \${CPU}%" >> /var/log/sistema-alertas.log
fi

if [ "$RAM" -gt "$ALERTA_RAM" ]; then
    echo "ALERTA: RAM em \${RAM}%!"
    systemctl restart meu-servico-pesado   # Reiniciar se necessário
fi

if [ "$DISCO" -gt "$ALERTA_DISCO" ]; then
    echo "ALERTA: Disco em \${DISCO}%!"
    # Limpar arquivos temporários
    find /tmp -mtime +3 -delete
    journalctl --vacuum-size=500M    # Limpar logs antigos do journald
fi`}),a.jsx("h2",{children:"at - Executar uma Vez no Futuro"}),a.jsx(e,{title:"Agendar tarefas únicas com at",code:`# Instalar at
sudo pacman -S at

# Habilitar
sudo systemctl enable --now atd

# Agendar tarefa para daqui a 1 hora
echo "rsync -av ~/docs /backup/docs" | at now + 1 hour

# Para amanhã às 10h
echo "backup.sh" | at 10:00 tomorrow

# Para uma data específica
echo "relatorio.sh" | at 14:30 2025-12-31

# Listar tarefas agendadas
atq

# Remover tarefa por ID
atrm 3

# Modo interativo
at 10:00
# Digite comandos
# Ctrl+D para finalizar`}),a.jsx("h2",{children:"Notificações de Desktop"}),a.jsx(e,{title:"Notificações automáticas no desktop",code:`# Instalar libnotify
sudo pacman -S libnotify

# Enviar notificação
notify-send "Backup Concluído" "O backup diário foi realizado com sucesso"
notify-send --urgency=critical "ALERTA!" "CPU acima de 90%!"
notify-send --expire-time=5000 "Info" "Processo terminado"  # Desaparece em 5s

# Usar em script cron (precisa de variável DISPLAY)
#!/bin/bash
export DISPLAY=:0
export DBUS_SESSION_BUS_ADDRESS="unix:path=/run/user/$(id -u usuario)/bus"
notify-send "Backup" "Concluído com sucesso"

# Ou usar como usuário via systemd (mais simples)
# O service rodando como usuário já tem acesso ao DISPLAY`})]})}export{m as default};
