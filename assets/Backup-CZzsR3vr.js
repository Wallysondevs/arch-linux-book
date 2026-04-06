import{j as e}from"./ui-K-J8Jkwj.js";import{P as o}from"./PageContainer-tnnsMrcC.js";import{C as a}from"./CodeBlock-DEDRw1y6.js";import{A as r}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function p(){return e.jsxs(o,{title:"Backup & Recuperação",subtitle:"Proteja seus dados com estratégias eficientes de backup. rsync, Borg, Timeshift e snapshots Btrfs — do backup simples ao sistema de recuperação completo.",difficulty:"intermediario",timeToRead:"18 min",children:[e.jsx("h2",{children:"A Regra 3-2-1 de Backup"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"3"})," cópias dos dados"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"2"})," mídias diferentes (HD, SSD, nuvem...)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"1"})," cópia offsite (fora de casa/escritório)"]})]}),e.jsx("h2",{children:"rsync - Sincronização de Arquivos"}),e.jsx(a,{title:"rsync - Backup incremental eficiente",code:`# Instalar rsync
sudo pacman -S rsync

# Sintaxe básica
rsync [opções] origem/ destino/

# Opções essenciais:
# -a = archive (preserva permissões, timestamps, links, recursivo)
# -v = verbose (mostrar progresso)
# -z = compressão durante transferência
# -P = progresso + parcial (útil para conexões lentas)
# --delete = remover arquivos no destino que não existem na origem
# -n = dry-run (simular sem fazer nada)

# Backup local simples
rsync -avP ~/documentos/ /backup/documentos/

# Backup incremental com hard links (economiza espaço)
rsync -avP --delete ~/documentos/ /backup/documentos/

# Backup via SSH (remoto)
rsync -avzP ~/documentos/ usuario@servidor:/backup/documentos/

# Backup do sistema inteiro (excluindo FS virtuais)
sudo rsync -avP --delete     --exclude=/proc     --exclude=/sys     --exclude=/dev     --exclude=/run     --exclude=/tmp     --exclude=/mnt     --exclude=/media     --exclude=/lost+found     / /backup/sistema/

# Simular antes de fazer (dry-run)
rsync -avP --dry-run --delete ~/documentos/ /backup/documentos/`}),e.jsx("h2",{children:"Script de Backup com rsync"}),e.jsx(a,{title:"Script de backup automatizado",code:`#!/bin/bash
# backup.sh - Script de backup com rotação

set -euo pipefail

# Configurações
ORIGEM="$HOME"
DESTINO="/backup"
REMOTE="usuario@servidor:/backup"
DATA=$(date +%Y-%m-%d_%H-%M)
LOG="/var/log/backup.log"

# Função de log
log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG"; }

log "=== Iniciando backup ==="

# Backup local incremental
log "Backup local..."
rsync -avP --delete     --exclude='.cache/'     --exclude='Downloads/'     --exclude='.local/share/Trash/'     --link-dest="$DESTINO/latest"     "$ORIGEM/" "$DESTINO/$DATA/"

# Atualizar link 'latest'
rm -f "$DESTINO/latest"
ln -s "$DESTINO/$DATA" "$DESTINO/latest"

# Backup remoto (offsite)
log "Backup remoto..."
rsync -avzP --delete "$DESTINO/latest/" "$REMOTE/"

# Remover backups mais antigos que 30 dias
log "Limpando backups antigos..."
find "$DESTINO" -maxdepth 1 -type d -mtime +30 -exec rm -rf {} ;

log "=== Backup concluído ==="

# Rodar como cron: 0 2 * * * /usr/local/bin/backup.sh`}),e.jsx("h2",{children:"Borg Backup - Deduplicação e Criptografia"}),e.jsx("p",{children:"O BorgBackup é uma ferramenta de backup com deduplicação, compressão e criptografia. Muito mais eficiente que o rsync puro para backups frequentes."}),e.jsx(a,{title:"Instalar e usar BorgBackup",code:`# Instalar Borg
sudo pacman -S borg

# Inicializar repositório local
borg init --encryption=repokey ~/borg-backup

# Inicializar repositório remoto via SSH
borg init --encryption=repokey usuario@servidor:~/borg-backup

# Criar arquivo (backup incremental)
borg create --progress --stats     ~/borg-backup::backup-{hostname}-{now}     ~/documentos ~/projetos ~/.config     --exclude '~/.cache'     --exclude '~/Downloads'

# Listar arquivos no repositório
borg list ~/borg-backup

# Listar conteúdo de um arquivo específico
borg list ~/borg-backup::backup-pc-2025-01-01

# Extrair (restaurar) um arquivo
borg extract ~/borg-backup::backup-pc-2025-01-01
borg extract ~/borg-backup::backup-pc-2025-01-01 home/user/documentos/importante.pdf

# Verificar integridade do repositório
borg check ~/borg-backup

# Informações sobre o repositório
borg info ~/borg-backup

# Compactar (remover dados de arquivos deletados)
borg compact ~/borg-backup

# Apagar arquivos antigos (manter apenas últimos 7 diários, 4 semanais, 6 mensais)
borg prune --keep-daily=7 --keep-weekly=4 --keep-monthly=6 ~/borg-backup`}),e.jsx("h2",{children:"Borgmatic - Automatizar Borg"}),e.jsx(a,{title:"borgmatic - Wrapper simplificado",code:`# Instalar borgmatic
sudo pacman -S borgmatic

# Configurar
sudo mkdir -p /etc/borgmatic
sudo borgmatic config generate

# Editar configuração
sudo nano /etc/borgmatic/config.yaml`}),e.jsx(a,{title:"/etc/borgmatic/config.yaml",code:`location:
    source_directories:
        - /home
        - /etc
        - /var/log

    repositories:
        - path: /backup/borg
          label: local
        - path: usuario@servidor:backup
          label: remoto

    exclude_patterns:
        - '*.pyc'
        - /home/*/.cache
        - /home/*/Downloads

storage:
    encryption_passphrase: "sua-senha-segura"
    compression: lz4
    archive_name_format: '{hostname}-{now}'

retention:
    keep_daily: 7
    keep_weekly: 4
    keep_monthly: 6

consistency:
    checks:
        - name: repository
        - name: archives`}),e.jsx(a,{title:"Usar borgmatic",code:`# Fazer backup
sudo borgmatic --verbosity 1

# Verificar
sudo borgmatic check

# Listar backups
sudo borgmatic list

# Restaurar
sudo borgmatic extract --archive latest

# Criar serviço systemd para backup automático
sudo nano /etc/systemd/system/borgmatic.timer

# Conteúdo:
[Unit]
Description=Run borgmatic backup

[Timer]
OnCalendar=daily
Persistent=true
RandomizedDelaySec=1h

[Install]
WantedBy=timers.target

sudo systemctl enable --now borgmatic.timer`}),e.jsx("h2",{children:"Timeshift - Snapshots do Sistema"}),e.jsx(a,{title:"Timeshift para snapshots do sistema",code:`# Instalar Timeshift
yay -S timeshift

# Para Btrfs: cria snapshots de subvolumes instantaneamente!
# Para ext4/outros: usa rsync

# Configurar via interface gráfica
sudo timeshift-gtk

# Ou via linha de comando:
# Criar snapshot
sudo timeshift --create --comments "Antes de atualização"

# Listar snapshots
sudo timeshift --list

# Restaurar snapshot
sudo timeshift --restore --snapshot "2025-01-01_12-00-00"

# Automatizar com systemd timer (instalado automaticamente)
sudo systemctl enable --now cronie    # Para cron-based
# ou
sudo systemctl enable --now timeshift.timer`}),e.jsx(r,{type:"success",title:"Testar o backup é tão importante quanto fazê-lo",children:"Um backup não testado não é um backup confiável. Periodicamente, teste a restauração em uma máquina de teste ou VM. Configure alertas se o backup falhar."})]})}export{p as default};
