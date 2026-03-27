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
        code={`# Verificar status de um serviço
sudo systemctl status ssh
sudo systemctl status nginx
sudo systemctl status mysql

# Iniciar um serviço (apenas até o próximo reboot)
sudo systemctl start nginx

# Parar um serviço
sudo systemctl stop nginx

# Reiniciar um serviço (para + inicia)
sudo systemctl restart nginx

# Recarregar configuração SEM reiniciar (quando suportado)
sudo systemctl reload nginx

# Habilitar: iniciar automaticamente no boot
sudo systemctl enable nginx

# Habilitar E iniciar imediatamente
sudo systemctl enable --now nginx

# Desabilitar: NÃO iniciar no boot
sudo systemctl disable nginx

# Verificar se um serviço está habilitado no boot
sudo systemctl is-enabled nginx

# Verificar se um serviço está ativo
sudo systemctl is-active nginx`}
      />

      <h3>Listando Serviços</h3>
      <CodeBlock
        title="Listar e filtrar serviços"
        code={`# Listar todos os serviços (units) ativos
systemctl list-units --type=service

# Listar TODOS os serviços (incluindo inativos e falhos)
systemctl list-units --type=service --all

# Listar apenas serviços com falha
systemctl list-units --type=service --state=failed

# Listar todos os arquivos de unit (habilitados e desabilitados)
systemctl list-unit-files --type=service

# Verificar serviços que falharam no boot
systemctl --failed`}
      />

      <AlertBox type="info" title="Diferença entre enable e start">
        <code>start</code> = iniciar o serviço AGORA (até o próximo reboot).<br/>
        <code>enable</code> = configurar para iniciar NO BOOT (não inicia agora).<br/>
        <code>enable --now</code> = faz os dois ao mesmo tempo. É o mais usado na prática.
      </AlertBox>

      <h2>Journalctl: Os Logs do Sistema</h2>
      <p>
        O systemd centraliza todos os logs do sistema no <strong>journal</strong>. O comando
        <code>journalctl</code> é a ferramenta para ler e filtrar esses logs.
      </p>
      <CodeBlock
        title="Lendo logs com journalctl"
        code={`# Ver todos os logs (mais antigo primeiro — use q para sair)
journalctl

# Ver logs em tempo real (como tail -f)
journalctl -f

# Ver logs de um serviço específico
journalctl -u ssh
journalctl -u nginx
journalctl -u mysql

# Ver logs de um serviço em tempo real
journalctl -u nginx -f

# Ver apenas os últimos 50 logs
journalctl -n 50

# Ver logs desde o último boot
journalctl -b

# Ver logs do boot anterior
journalctl -b -1

# Ver logs de uma data específica
journalctl --since "2024-04-01 10:00:00"
journalctl --since "2024-04-01" --until "2024-04-02"
journalctl --since "1 hour ago"
journalctl --since "yesterday"

# Filtrar por prioridade (0=emerg, 1=alert, 2=crit, 3=err, 4=warn, 5=notice, 6=info, 7=debug)
journalctl -p err          # Apenas erros
journalctl -p warning      # Avisos e acima

# Ver logs de um PID específico
journalctl _PID=1234

# Saída em JSON (útil para scripts)
journalctl -u nginx -o json

# Ver tamanho do journal em disco
journalctl --disk-usage`}
      />

      <h2>Anatomia de um Arquivo de Unit</h2>
      <p>
        Os serviços do systemd são configurados via arquivos chamados <strong>units</strong>.
        Eles ficam em:
      </p>
      <ul>
        <li><code>/lib/systemd/system/</code> — Units do sistema (instaladas por pacotes)</li>
        <li><code>/etc/systemd/system/</code> — Units personalizadas (prioridade maior)</li>
        <li><code>~/.config/systemd/user/</code> — Units do usuário (sem root)</li>
      </ul>
      <CodeBlock
        title="Estrutura de um arquivo .service"
        code={`# Ver o arquivo de um serviço existente:
cat /lib/systemd/system/ssh.service

# Saída típica:
[Unit]
Description=OpenBSD Secure Shell server
Documentation=man:sshd(8) man:sshd_config(5)
After=network.target auditd.service
ConditionPathExists=!/etc/ssh/sshd_not_to_be_run

[Service]
EnvironmentFile=-/etc/default/ssh
ExecStartPre=/usr/sbin/sshd -t
ExecStart=/usr/sbin/sshd -D \$SSHD_OPTS
ExecReload=/usr/sbin/sshd -t
ExecReload=/bin/kill -HUP \$MAINPID
KillMode=process
Restart=on-failure
RestartPreventExitStatus=255
Type=notify
RuntimeDirectory=sshd
RuntimeDirectoryMode=0755

[Install]
WantedBy=multi-user.target`}
      />

      <h3>Criando um Serviço Personalizado</h3>
      <CodeBlock
        title="Criar um serviço systemd customizado"
        code={`# Exemplo: criar um serviço que roda um script Python
# 1. Criar o arquivo de service:
sudo nano /etc/systemd/system/meu-app.service

# Conteúdo do arquivo:
[Unit]
Description=Meu Aplicativo Python
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/meu-app
ExecStart=/usr/bin/python3 /opt/meu-app/main.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target

# 2. Recarregar o daemon para reconhecer o novo arquivo:
sudo systemctl daemon-reload

# 3. Habilitar e iniciar o serviço:
sudo systemctl enable --now meu-app

# 4. Verificar se está rodando:
sudo systemctl status meu-app

# 5. Ver logs do serviço:
journalctl -u meu-app -f`}
      />

      <h2>Systemd Timers (Substituindo o Cron)</h2>
      <p>
        Timers do systemd são mais poderosos que o cron clássico — suportam logging integrado,
        dependências, e são mais fáceis de depurar.
      </p>
      <CodeBlock
        title="Criar um timer systemd"
        code={`# Timer que roda um script todos os dias às 3h da manhã

# 1. Criar o arquivo de service (o que vai executar):
sudo nano /etc/systemd/system/backup-diario.service

[Unit]
Description=Backup Diário

[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup.sh

# 2. Criar o arquivo de timer:
sudo nano /etc/systemd/system/backup-diario.timer

[Unit]
Description=Rodar backup todo dia às 3h

[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true     # Roda se o sistema estava desligado no horário

[Install]
WantedBy=timers.target

# 3. Ativar o timer:
sudo systemctl daemon-reload
sudo systemctl enable --now backup-diario.timer

# 4. Verificar timers ativos:
systemctl list-timers

# 5. Ver quando vai executar da próxima vez:
systemctl status backup-diario.timer`}
      />

      <h2>Targets (Runlevels)</h2>
      <CodeBlock
        title="Targets do systemd"
        code={`# Ver o target padrão (equivalente ao runlevel)
systemctl get-default
# graphical.target  ← Com interface gráfica (padrão no Desktop)
# multi-user.target ← Sem interface gráfica (padrão no Server)

# Mudar o target padrão para modo texto (servidor)
sudo systemctl set-default multi-user.target

# Mudar o target padrão para modo gráfico (desktop)
sudo systemctl set-default graphical.target

# Mudar para um target AGORA (sem reboot)
sudo systemctl isolate multi-user.target  # Mata o desktop agora

# Desligar o sistema
sudo systemctl poweroff

# Reiniciar o sistema
sudo systemctl reboot

# Suspender
sudo systemctl suspend

# Hibernar
sudo systemctl hibernate`}
      />

      <h2>Analisando o Boot</h2>
      <CodeBlock
        title="Diagnóstico de tempo de boot"
        code={`# Ver tempo total do boot e quais serviços demoram mais
systemd-analyze

# Saída:
# Startup finished in 2.315s (kernel) + 15.234s (userspace) = 17.549s
# graphical.target reached after 14.892s in userspace

# Ver os serviços que mais demoram (do mais lento ao mais rápido)
systemd-analyze blame

# Gerar gráfico SVG do tempo de boot (abre no navegador)
systemd-analyze plot > boot-plot.svg
firefox boot-plot.svg`}
      />
    </PageContainer>
  );
}
