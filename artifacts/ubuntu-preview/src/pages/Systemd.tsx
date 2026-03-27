import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Systemd() {
  return (
    <PageContainer
      title="Systemd e Serviços"
      subtitle="Gerenciando serviços, timers, logs e o processo de boot no Ubuntu com systemd e systemctl."
      difficulty="intermediario"
      timeToRead="25 min"
    >
      <p>
        O <strong>systemd</strong> é o sistema de inicialização (init system) e gerenciador de
        serviços do Ubuntu (desde o Ubuntu 15.04). Ele substitui o antigo SysVinit e é responsável
        por iniciar todos os serviços do sistema — do NetworkManager ao servidor SSH, do cron ao
        servidor de impressão.
      </p>

      <h2>systemctl: O Comando Principal</h2>

      <h3>Gerenciando Serviços</h3>
      <CodeBlock
        title="Operações básicas com serviços"
        code={`# Verificar status de um serviço (mostra se está ativo, com falha, logs recentes)
sudo systemctl status ssh
sudo systemctl status nginx
sudo systemctl status mysql

# Iniciar um serviço AGORA (efeito até o próximo reboot)
sudo systemctl start nginx

# Parar um serviço
sudo systemctl stop nginx

# Reiniciar um serviço (para e inicia novamente)
sudo systemctl restart nginx

# Recarregar configuração SEM derrubar o serviço (quando o serviço suporta)
sudo systemctl reload nginx
# Útil para aplicar mudanças no nginx.conf sem causar downtime

# Habilitar: configurar para iniciar AUTOMATICAMENTE no boot
sudo systemctl enable nginx
# Cria um link simbólico em /etc/systemd/system/ mas NÃO inicia agora

# --now = fazer a ação "enable" E "start" ao mesmo tempo
sudo systemctl enable --now nginx
# Habilita no boot E inicia imediatamente (o mais comum na prática!)

# Desabilitar: remover do boot (NÃO para o serviço que está rodando)
sudo systemctl disable nginx

# Desabilitar E parar ao mesmo tempo:
sudo systemctl disable --now nginx

# Verificar se um serviço está configurado para iniciar no boot
sudo systemctl is-enabled nginx
# Saída: enabled | disabled | static | masked

# Verificar se um serviço está rodando neste momento
sudo systemctl is-active nginx
# Saída: active | inactive | failed`}
      />

      <h3>Listando Serviços</h3>
      <CodeBlock
        title="Listar e filtrar serviços com flags"
        code={`# Listar todos os serviços ATIVOS no momento
systemctl list-units --type=service
# --type=service = filtrar apenas unidades do tipo "service"
# (existem outros tipos: socket, timer, mount, device, etc.)

# Listar TODOS os serviços, incluindo inativos e com falha
systemctl list-units --type=service --all
# --all = incluir unidades inativas e não carregadas

# Listar apenas serviços que FALHARAM
systemctl list-units --type=service --state=failed
# --state=failed = filtrar pelo estado: failed (falhou ao iniciar)
# Outros valores: active, inactive, activating, deactivating

# Listar todos os ARQUIVOS de unit (independente do estado)
systemctl list-unit-files --type=service
# Mostra todos os serviços instalados e se estão enabled/disabled

# Atalho: ver serviços que falharam no boot
systemctl --failed
# --failed = equivalente a --state=failed (atalho conveniente)`}
      />

      <AlertBox type="info" title="Diferença entre enable e start">
        <code>start</code> = iniciar o serviço AGORA (até o próximo reboot).<br/>
        <code>enable</code> = configurar para iniciar NO BOOT (não inicia agora).<br/>
        <code>enable --now</code> = faz os dois ao mesmo tempo. É o mais usado na prática.
      </AlertBox>

      <h2>journalctl: Lendo os Logs do Sistema</h2>
      <p>
        O systemd centraliza todos os logs do sistema no <strong>journal</strong>. O comando
        <code>journalctl</code> é a ferramenta para ler e filtrar esses logs — muito mais poderoso
        que abrir arquivos de log manualmente.
      </p>
      <CodeBlock
        title="journalctl com todas as flags explicadas"
        code={`# Ver todos os logs (do mais antigo ao mais novo — pressione q para sair)
journalctl

# -f = follow (seguir/monitorar em tempo real, como tail -f)
# Fica exibindo novas mensagens à medida que aparecem. Ctrl+C para sair.
journalctl -f

# -u = unit (filtrar por unidade/serviço específico)
journalctl -u ssh        # logs do serviço SSH
journalctl -u nginx      # logs do Nginx
journalctl -u mysql      # logs do MySQL

# Combinar -u e -f para monitorar um serviço em tempo real:
journalctl -u nginx -f

# -n = number of lines (ver apenas as últimas N linhas)
journalctl -n 50         # Ver as últimas 50 linhas
journalctl -n 100 -u nginx  # Últimas 100 linhas do Nginx

# -e = end (pular para o FIM do journal imediatamente)
# Sem -e, o journalctl começa do início e você precisa descer até o fim.
journalctl -e

# -b = boot (filtrar por sessão de boot)
journalctl -b            # Logs desde o ÚLTIMO boot (boot atual)
journalctl -b -1         # Logs do boot ANTERIOR ao atual
journalctl -b -2         # Dois boots atrás

# --since e --until = filtrar por intervalo de tempo
journalctl --since "2024-04-01 10:00:00"
journalctl --since "2024-04-01" --until "2024-04-02"
journalctl --since "1 hour ago"   # Última hora
journalctl --since "yesterday"    # Desde ontem

# -p = priority (filtrar por prioridade/gravidade)
# Níveis: 0=emerg, 1=alert, 2=crit, 3=err, 4=warning, 5=notice, 6=info, 7=debug
journalctl -p err         # Apenas erros (nível 3 e acima: err, crit, alert, emerg)
journalctl -p warning     # Avisos e mais graves
journalctl -p info        # Tudo até info (nível 6)

# -o = output format (formato de saída)
journalctl -u nginx -o json       # Saída em formato JSON (útil para scripts)
journalctl -u nginx -o short      # Formato padrão (padrão quando não especificado)
journalctl -u nginx -o verbose    # Todos os campos de cada entrada de log

# --disk-usage = ver quanto espaço o journal ocupa em disco
journalctl --disk-usage`}
      />

      <h2>Anatomia de um Arquivo de Unit</h2>
      <p>
        Os serviços do systemd são configurados via arquivos chamados <strong>units</strong>.
        Eles ficam em:
      </p>
      <ul>
        <li><code>/lib/systemd/system/</code> — Units do sistema (instaladas por pacotes)</li>
        <li><code>/etc/systemd/system/</code> — Units personalizadas (têm prioridade maior)</li>
        <li><code>~/.config/systemd/user/</code> — Units do usuário (sem root)</li>
      </ul>
      <CodeBlock
        title="Estrutura de um arquivo .service"
        code={`# Ver o arquivo de um serviço existente:
cat /lib/systemd/system/ssh.service

# Saída típica (cada seção tem um propósito):
[Unit]
Description=OpenBSD Secure Shell server
# After= define dependências de ORDEM: iniciar após essas units
After=network.target auditd.service
# ConditionPathExists= só inicia se o caminho EXISTIR (! = não existir)
ConditionPathExists=!/etc/ssh/sshd_not_to_be_run

[Service]
# EnvironmentFile= arquivo com variáveis de ambiente para o serviço
# O - antes do caminho significa "ignorar se o arquivo não existir"
EnvironmentFile=-/etc/default/ssh
# ExecStartPre= comando a rodar ANTES do serviço iniciar (checagem de config)
ExecStartPre=/usr/sbin/sshd -t
# ExecStart= o comando principal que inicia o serviço
ExecStart=/usr/sbin/sshd -D \$SSHD_OPTS
# ExecReload= comando para recarregar sem reiniciar
ExecReload=/bin/kill -HUP \$MAINPID
# Restart= quando reiniciar automaticamente
# on-failure = reiniciar somente se o processo terminar com erro
Restart=on-failure
# Type= tipo do serviço
# notify = o processo avisa o systemd quando terminar de inicializar
Type=notify

[Install]
# WantedBy= em qual target este serviço deve ser incluído
# multi-user.target = modo multiusuário (sem interface gráfica)
WantedBy=multi-user.target`}
      />

      <h3>Criando um Serviço Personalizado</h3>
      <CodeBlock
        title="Criar um serviço systemd customizado"
        code={`# Exemplo: rodar um script Python como serviço do sistema

# 1. Criar o arquivo de service em /etc/systemd/system/
sudo nano /etc/systemd/system/meu-app.service

# Conteúdo do arquivo:
[Unit]
Description=Meu Aplicativo Python
# After=network.target = só iniciar APÓS a rede estar disponível
After=network.target

[Service]
# Type=simple = processo principal é o próprio ExecStart
Type=simple
# User= rodar o serviço como este usuário (não como root!)
User=ubuntu
# WorkingDirectory= diretório de trabalho do processo
WorkingDirectory=/opt/meu-app
ExecStart=/usr/bin/python3 /opt/meu-app/main.py
# Restart=always = reiniciar o serviço se ele parar (por qualquer motivo)
Restart=always
# RestartSec= aguardar 10 segundos antes de tentar reiniciar
RestartSec=10
# StandardOutput= onde enviar a saída padrão (stdout)
# journal = enviado para o journalctl (pode ler com journalctl -u meu-app)
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target

# 2. Recarregar o daemon para reconhecer o novo arquivo:
sudo systemctl daemon-reload
# daemon-reload = necessário SEMPRE que criar ou editar um arquivo .service

# 3. Habilitar E iniciar o serviço:
sudo systemctl enable --now meu-app

# 4. Verificar se está rodando:
sudo systemctl status meu-app

# 5. Ver logs do serviço em tempo real:
journalctl -u meu-app -f`}
      />

      <h2>Systemd Timers (Substituto do Cron)</h2>
      <p>
        Timers do systemd são mais poderosos que o cron clássico — têm logging integrado,
        suporte a dependências, e são mais fáceis de depurar.
      </p>
      <CodeBlock
        title="Criar um timer systemd"
        code={`# Timer que roda um script de backup todos os dias às 3h da manhã

# 1. Criar o arquivo de SERVICE (define O QUE vai executar):
sudo nano /etc/systemd/system/backup-diario.service

[Unit]
Description=Backup Diário

[Service]
# Type=oneshot = serviço que executa uma única vez e termina (não fica em loop)
Type=oneshot
ExecStart=/usr/local/bin/backup.sh

# 2. Criar o arquivo de TIMER (define QUANDO vai executar):
sudo nano /etc/systemd/system/backup-diario.timer

[Unit]
Description=Rodar backup todo dia às 3h

[Timer]
# OnCalendar= formato: DIA-DA-SEMANA ANO-MÊS-DIA HH:MM:SS
# * = qualquer valor (curinga)
# *-*-* 03:00:00 = todo dia (qualquer ano-mês-dia) às 03:00:00
OnCalendar=*-*-* 03:00:00
# Persistent=true = se o sistema estava desligado no horário agendado,
# rodar assim que ligar (não pular a execução)
Persistent=true

[Install]
WantedBy=timers.target

# 3. Ativar o timer:
sudo systemctl daemon-reload
sudo systemctl enable --now backup-diario.timer

# 4. Ver todos os timers ativos e quando executam:
systemctl list-timers

# 5. Ver quando vai executar da próxima vez:
systemctl status backup-diario.timer`}
      />

      <h2>Targets (Equivalente aos Runlevels)</h2>
      <CodeBlock
        title="Targets: modos de operação do sistema"
        code={`# Ver o target padrão (modo em que o sistema inicia)
systemctl get-default
# graphical.target  ← Com interface gráfica (padrão no Ubuntu Desktop)
# multi-user.target ← Sem interface gráfica (padrão no Ubuntu Server)

# Mudar o target padrão para modo TEXTO (servidor sem desktop)
sudo systemctl set-default multi-user.target

# Mudar o target padrão para modo GRÁFICO (desktop)
sudo systemctl set-default graphical.target

# Mudar para um target AGORA (sem reboot) — cuidado: pode matar o desktop!
sudo systemctl isolate multi-user.target

# Desligar o sistema de forma ordenada (equivale a "desligar" no menu)
sudo systemctl poweroff

# Reiniciar o sistema
sudo systemctl reboot

# Suspender (economizar energia, RAM mantida)
sudo systemctl suspend

# Hibernar (desligar salvando RAM no disco, mais lento para acordar)
sudo systemctl hibernate`}
      />

      <h2>Analisando o Tempo de Boot</h2>
      <CodeBlock
        title="Diagnóstico de velocidade de boot"
        code={`# Ver o tempo total do boot e quanto foi kernel vs userspace
systemd-analyze
# Saída:
# Startup finished in 2.315s (kernel) + 15.234s (userspace) = 17.549s
# graphical.target reached after 14.892s in userspace

# Ver QUAIS serviços demoram mais (do mais lento ao mais rápido)
systemd-analyze blame
# Saída:
# 5.123s NetworkManager-wait-online.service
# 3.456s apt-daily.service
# 1.234s snapd.service
# ...

# Gerar um gráfico SVG visual do tempo de boot
systemd-analyze plot > boot-plot.svg
firefox boot-plot.svg`}
      />
    </PageContainer>
  );
}
