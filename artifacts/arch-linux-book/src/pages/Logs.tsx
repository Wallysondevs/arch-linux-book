import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Logs() {
  return (
    <PageContainer
      title="Logs do Sistema"
      subtitle="Domine o journalctl e o sistema de logs do Linux. Diagnose problemas, filtre mensagens e configure o journald para monitorar seu Arch Linux eficientemente."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <h2>systemd-journald</h2>
      <p>
        O Arch Linux usa o <code>systemd-journald</code> para coletar e armazenar logs do sistema.
        Diferente do syslog tradicional (arquivos de texto em <code>/var/log/</code>), o journald
        armazena logs em formato binário estruturado com metadados ricos.
      </p>
      <p>Vantagens do journald:</p>
      <ul>
        <li>Logs indexados para busca rápida</li>
        <li>Metadados automáticos (PID, UID, serviço, prioridade)</li>
        <li>Compressão automática de logs antigos</li>
        <li>Rotação de logs integrada</li>
        <li>Corrupção de logs detectada por checksums</li>
      </ul>

      <h2>journalctl - Comandos Essenciais</h2>
      <CodeBlock
        title="Navegando pelos logs"
        code={`# Ver todos os logs (do mais antigo ao mais recente)
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
journalctl -n 100 -f     # Últimas 100 + seguir em tempo real`}
      />

      <h2>Filtragem por Serviço</h2>
      <CodeBlock
        title="Filtrar logs por unidade systemd"
        code={`# Logs de um serviço específico
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
journalctl -u NetworkManager -b`}
      />

      <h2>Filtragem por Prioridade</h2>
      <CodeBlock
        title="Filtrar por nível de severidade"
        code={`# Prioridades (do mais crítico ao menos crítico):
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
journalctl -b -p err -u nginx`}
      />

      <h2>Filtragem por Tempo</h2>
      <CodeBlock
        title="Filtrar por período de tempo"
        code={`# Logs desde uma data específica
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
journalctl -u nginx --since "2 hours ago" -f`}
      />

      <h2>Filtragem por Processo e Usuário</h2>
      <CodeBlock
        title="Filtrar por PID, UID ou programa"
        code={`# Logs de um PID específico
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
journalctl -b -u nginx | grep "404"`}
      />

      <h2>Formatos de Saída</h2>
      <CodeBlock
        title="Diferentes formatos de saída"
        code={`# Formato padrão (curto com data/hora)
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
journalctl -b --output=json > /tmp/journal.json`}
      />

      <h2>Configuração do Journald</h2>
      <CodeBlock
        title="/etc/systemd/journald.conf"
        code={`[Journal]
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
MaxLevelKMsg=notice`}
      />

      <CodeBlock
        title="Ativar logs persistentes"
        code={`# Por padrão no Arch, logs NÃO são persistentes (perdidos no reboot)
# Para tornar persistentes:

sudo mkdir -p /var/log/journal
sudo systemd-tmpfiles --create --prefix /var/log/journal

# Ou definir Storage=persistent no journald.conf e reiniciar
sudo systemctl restart systemd-journald

# Verificar se está funcionando
ls /var/log/journal/    # Deve haver um diretório com UID

# Verificar uso atual
journalctl --disk-usage`}
      />

      <h2>Logs Tradicionais em /var/log</h2>
      <CodeBlock
        title="Arquivos de log tradicionais"
        code={`# Alguns serviços ainda escrevem em /var/log/
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
cat /var/log/pacman.log | grep "installed\|removed\|upgraded"`}
      />

      <AlertBox type="info" title="rsyslog e syslog-ng">
        Se você precisar de logs no formato tradicional (compatível com ferramentas antigas),
        pode instalar o <code>rsyslog</code> ou <code>syslog-ng</code> que coexistem com o
        journald e criam arquivos em <code>/var/log/syslog</code>.
      </AlertBox>

      <h2>Analisar Erros do Sistema</h2>
      <CodeBlock
        title="Workflow de diagnóstico"
        code={`# 1. Ver erros do boot atual
journalctl -b -p err

# 2. Ver erros do boot (kernel + serviços)
journalctl -b -p err --no-pager | head -50

# 3. Verificar serviços com falha
systemctl --failed

# 4. Ver logs do serviço com falha
journalctl -u nome-servico -n 50

# 5. Identificar o problema exato
journalctl -u nome-servico -b --no-pager | grep -i "error\|failed\|critical"

# 6. Verificar quando o problema começou
journalctl -u nome-servico --since "1 week ago" | grep -i error

# Relatório de erros de hardware (importante!)
journalctl -k -b | grep -iE "error|fail|hardware|mce|thermal"

# Verificar memória com erro corrigível (ECC)
journalctl -k | grep -i "EDAC\|mce\|machine check"`}
      />
    </PageContainer>
  );
}
