import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Systemd() {
  return (
    <PageContainer
      title="Systemd"
      subtitle="O sistema de init e gerenciador de serviços do Linux moderno. Domine systemctl, journalctl, timers e crie seus próprios serviços."
      difficulty="intermediario"
      timeToRead="25 min"
    >
      <h2>O que é o Systemd?</h2>
      <p>
        O <code>systemd</code> é o sistema de inicialização (init) e gerenciador de serviços usado pelo
        Arch Linux e pela maioria das distribuições modernas. Ele é responsável por iniciar o sistema,
        gerenciar serviços (daemons), montar sistemas de arquivos, gerenciar logs e muito mais.
      </p>
      <p>
        O conceito central do systemd são as <strong>units</strong> — arquivos de configuração que descrevem
        serviços, timers, pontos de montagem e outros recursos do sistema.
      </p>

      <h2>systemctl — O Comando Principal</h2>

      <h3>Gerenciando Serviços</h3>
      <CodeBlock
        title="Operações básicas com serviços"
        code={`# Iniciar um serviço
sudo systemctl start nome-do-servico

# Parar um serviço
sudo systemctl stop nome-do-servico

# Reiniciar um serviço
sudo systemctl restart nome-do-servico

# Recarregar configuração sem reiniciar
sudo systemctl reload nome-do-servico

# Ver status detalhado
systemctl status nome-do-servico

# Habilitar serviço para iniciar no boot
sudo systemctl enable nome-do-servico

# Habilitar E iniciar imediatamente
sudo systemctl enable --now nome-do-servico

# Desabilitar serviço (não inicia no boot)
sudo systemctl disable nome-do-servico

# Desabilitar E parar imediatamente
sudo systemctl disable --now nome-do-servico

# Verificar se está habilitado
systemctl is-enabled nome-do-servico

# Verificar se está ativo
systemctl is-active nome-do-servico`}
      />

      <AlertBox type="info" title="enable vs start">
        <code>start</code> inicia o serviço agora, mas ele não volta após o reboot.
        <code>enable</code> configura para iniciar no boot, mas não inicia agora.
        Use <code>enable --now</code> para fazer ambos de uma vez.
      </AlertBox>

      <h3>Listando e Buscando</h3>
      <CodeBlock
        title="Listar units"
        code={`# Listar todos os serviços ativos
systemctl list-units --type=service

# Listar TODOS os serviços (ativos e inativos)
systemctl list-units --type=service --all

# Listar serviços que falharam
systemctl --failed

# Listar units habilitadas
systemctl list-unit-files --type=service

# Listar timers ativos
systemctl list-timers

# Listar targets
systemctl list-units --type=target

# Buscar por nome
systemctl list-units | grep ssh`}
      />

      <h3>Targets (Runlevels)</h3>
      <p>
        Targets são equivalentes aos runlevels antigos. Definem o estado do sistema.
      </p>
      <CodeBlock
        title="Trabalhando com targets"
        code={`# Ver o target padrão (o que inicia no boot)
systemctl get-default

# Definir para iniciar em modo gráfico
sudo systemctl set-default graphical.target

# Definir para iniciar em modo texto
sudo systemctl set-default multi-user.target

# Mudar para modo gráfico agora
sudo systemctl isolate graphical.target

# Mudar para modo texto agora
sudo systemctl isolate multi-user.target

# Targets comuns:
# poweroff.target     - Desligar
# rescue.target       - Modo de recuperação (single user)
# multi-user.target   - Modo texto (sem GUI)
# graphical.target    - Modo gráfico (com GUI)`}
      />

      <h3>Controle do Sistema</h3>
      <CodeBlock
        title="Comandos de controle do sistema"
        code={`# Reiniciar o sistema
sudo systemctl reboot

# Desligar o sistema
sudo systemctl poweroff

# Suspender (sleep)
sudo systemctl suspend

# Hibernar
sudo systemctl hibernate

# Recarregar todas as units (após editar arquivos de serviço)
sudo systemctl daemon-reload`}
      />

      <h2>journalctl — Logs do Sistema</h2>
      <p>
        O <code>journalctl</code> é a ferramenta para visualizar logs gerenciados pelo systemd.
        Ele substitui o syslog tradicional e oferece filtros muito mais poderosos.
      </p>

      <CodeBlock
        title="Visualizando logs"
        code={`# Ver todos os logs (mais recente no final)
journalctl

# Ver logs do boot atual
journalctl -b

# Ver logs do boot anterior
journalctl -b -1

# Ver logs de um serviço específico
journalctl -u NetworkManager

# Ver logs em tempo real (como tail -f)
journalctl -f

# Logs em tempo real de um serviço
journalctl -fu sshd

# Filtrar por prioridade (emerg, alert, crit, err, warning, notice, info, debug)
journalctl -p err

# Filtrar por data/hora
journalctl --since "2026-03-15"
journalctl --since "2026-03-15 10:00" --until "2026-03-15 12:00"
journalctl --since "1 hour ago"
journalctl --since yesterday

# Limitar número de linhas
journalctl -n 50

# Mostrar sem paginação
journalctl --no-pager

# Formato de saída
journalctl -o json-pretty     # JSON formatado
journalctl -o short-iso       # Data em formato ISO

# Ver espaço usado pelos logs
journalctl --disk-usage

# Limpar logs antigos (manter apenas 500MB)
sudo journalctl --vacuum-size=500M

# Limpar logs mais antigos que 30 dias
sudo journalctl --vacuum-time=30d`}
      />

      <AlertBox type="success" title="Combinando filtros">
        Você pode combinar múltiplos filtros: <code>journalctl -u sshd -p err --since today -f</code>
        mostra erros do SSH de hoje em tempo real.
      </AlertBox>

      <h2>Criando Serviços Personalizados</h2>
      <p>
        Você pode criar seus próprios serviços systemd para executar scripts ou aplicações
        automaticamente no boot.
      </p>

      <h3>Serviço Simples</h3>
      <CodeBlock
        title="/etc/systemd/system/meu-servico.service"
        language="ini"
        code={`[Unit]
Description=Meu Serviço Personalizado
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/meu-script.sh
Restart=on-failure
RestartSec=5
User=meu-usuario
WorkingDirectory=/home/meu-usuario/app

[Install]
WantedBy=multi-user.target`}
      />

      <h3>Serviço para Aplicação Web</h3>
      <CodeBlock
        title="/etc/systemd/system/minha-api.service"
        language="ini"
        code={`[Unit]
Description=Minha API Node.js
After=network.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/bin/node /home/deploy/api/server.js
Restart=always
RestartSec=10
User=deploy
Group=deploy
Environment=NODE_ENV=production
Environment=PORT=3000
WorkingDirectory=/home/deploy/api
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target`}
      />

      <CodeBlock
        title="Ativar o serviço personalizado"
        code={`# Recarregar definições de units
sudo systemctl daemon-reload

# Habilitar e iniciar
sudo systemctl enable --now meu-servico

# Verificar
systemctl status meu-servico

# Ver logs
journalctl -fu meu-servico`}
      />

      <h3>Campos Importantes da Unit</h3>
      <CodeBlock
        title="Referência de campos"
        language="text"
        code={`[Unit]
Description=    Descrição do serviço
After=          Iniciar DEPOIS destes targets/serviços
Before=         Iniciar ANTES destes targets/serviços
Requires=       Dependências obrigatórias
Wants=          Dependências opcionais

[Service]
Type=           simple | forking | oneshot | notify | dbus
ExecStart=      Comando para iniciar
ExecStop=       Comando para parar
ExecReload=     Comando para recarregar
Restart=        no | on-success | on-failure | always
RestartSec=     Tempo em segundos entre restarts
User=           Usuário que executa
Group=          Grupo
Environment=    Variáveis de ambiente
EnvironmentFile= Arquivo com variáveis de ambiente
WorkingDirectory= Diretório de trabalho

[Install]
WantedBy=       Target que ativa este serviço`}
      />

      <h2>Timers — Alternativa ao Cron</h2>
      <p>
        Timers do systemd são a alternativa moderna ao cron. Oferecem melhor integração com logs,
        controle de dependências e configuração mais flexível.
      </p>

      <CodeBlock
        title="/etc/systemd/system/backup.service"
        language="ini"
        code={`[Unit]
Description=Backup Diário

[Service]
Type=oneshot
ExecStart=/home/usuario/scripts/backup.sh
User=usuario`}
      />

      <CodeBlock
        title="/etc/systemd/system/backup.timer"
        language="ini"
        code={`[Unit]
Description=Executar backup diário às 3h

[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true

[Install]
WantedBy=timers.target`}
      />

      <CodeBlock
        title="Ativar o timer"
        code={`sudo systemctl daemon-reload
sudo systemctl enable --now backup.timer

# Verificar timers ativos
systemctl list-timers

# Executar o serviço manualmente para testar
sudo systemctl start backup.service`}
      />

      <h3>Formatos de OnCalendar</h3>
      <CodeBlock
        title="Exemplos de agendamento"
        code={`# Formato: DiaDaSemana Ano-Mês-Dia Hora:Minuto:Segundo
OnCalendar=*-*-* 03:00:00           # Todo dia às 3h
OnCalendar=Mon *-*-* 08:00:00       # Toda segunda às 8h
OnCalendar=*-*-01 00:00:00          # Todo primeiro dia do mês
OnCalendar=hourly                    # A cada hora
OnCalendar=daily                     # Todo dia à meia-noite
OnCalendar=weekly                    # Toda segunda à meia-noite
OnCalendar=monthly                   # Todo primeiro dia do mês

# A cada 15 minutos
OnCalendar=*:0/15

# Verificar se o formato está correto
systemd-analyze calendar "Mon *-*-* 08:00:00"`}
      />

      <h2>Serviços do Usuário</h2>
      <p>
        Além de serviços do sistema, você pode criar serviços que rodam como seu usuário,
        sem precisar de sudo.
      </p>
      <CodeBlock
        title="Serviços por usuário"
        code={`# Serviços do usuário ficam em:
mkdir -p ~/.config/systemd/user/

# Criar serviço de usuário (mesma sintaxe, sem User= e sem sudo)
# ~/.config/systemd/user/meu-app.service

# Gerenciar com --user
systemctl --user start meu-app
systemctl --user enable meu-app
systemctl --user status meu-app
journalctl --user -u meu-app`}
      />

      <AlertBox type="warning" title="daemon-reload após editar">
        Sempre execute <code>sudo systemctl daemon-reload</code> após criar ou editar
        arquivos de serviço. Caso contrário, o systemd usará a versão antiga em cache.
      </AlertBox>
    </PageContainer>
  );
}
