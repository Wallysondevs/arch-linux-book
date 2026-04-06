import{j as o}from"./ui-K-J8Jkwj.js";import{P as a}from"./PageContainer-tnnsMrcC.js";import{C as s}from"./CodeBlock-DEDRw1y6.js";import{A as e}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function u(){return o.jsxs(a,{title:"ZFS",subtitle:"O sistema de arquivos mais avançado: pools, datasets, snapshots automáticos, compressão e proteção de dados.",difficulty:"avancado",timeToRead:"22 min",children:[o.jsx("h2",{children:"O que é ZFS?"}),o.jsxs("p",{children:["O ",o.jsx("strong",{children:"ZFS"})," (Zettabyte File System) é um sistema de arquivos e gerenciador de volumes combinado. Desenvolvido pela Sun Microsystems, ele é considerado o filesystem mais avançado disponível, oferecendo checksums em todos os dados, RAID integrado, snapshots instantâneos, compressão transparente e auto-reparo de dados corrompidos."]}),o.jsx(e,{type:"warning",title:"Licença e Kernel",children:"O ZFS não está incluído no kernel Linux por incompatibilidade de licença (CDDL vs GPL). Ele é instalado via DKMS (módulo externo). Isso significa que a cada atualização do kernel, o módulo ZFS precisa ser recompilado automaticamente."}),o.jsx("h2",{children:"Instalação"}),o.jsx(s,{title:"Instalar ZFS no Arch Linux",code:`# Instalar do AUR
yay -S zfs-dkms zfs-utils

# Habilitar serviços
sudo systemctl enable zfs-import-cache
sudo systemctl enable zfs-mount
sudo systemctl enable zfs-import.target
sudo systemctl enable zfs.target

# Carregar módulo
sudo modprobe zfs

# Verificar
zfs version`}),o.jsx("h2",{children:"Conceitos Fundamentais"}),o.jsx(s,{title:"Hierarquia ZFS",code:`# Pool (vdev) → Dataset/Zvol
# 
# Pool: agrupa discos físicos (como um volume group no LVM)
# Dataset: filesystem dentro do pool (como um subvolume no Btrfs)
# Zvol: volume de bloco dentro do pool (para VMs, swap)
# Snapshot: cópia instantânea e read-only de um dataset
# Clone: cópia read-write de um snapshot`}),o.jsx("h2",{children:"Criando Pools"}),o.jsx(s,{title:"Criar pools ZFS",code:`# Pool simples (1 disco)
sudo zpool create meupool /dev/sdb

# Pool com mirror (RAID1 — 2 discos)
sudo zpool create meupool mirror /dev/sdb /dev/sdc

# Pool RAIDZ1 (como RAID5 — mínimo 3 discos)
sudo zpool create meupool raidz1 /dev/sdb /dev/sdc /dev/sdd

# Pool RAIDZ2 (como RAID6 — mínimo 4 discos)
sudo zpool create meupool raidz2 /dev/sdb /dev/sdc /dev/sdd /dev/sde

# Pool com cache SSD (L2ARC) e log SSD (SLOG)
sudo zpool create meupool mirror /dev/sdb /dev/sdc \\
  cache /dev/nvme0n1p1 \\
  log mirror /dev/nvme0n1p2 /dev/nvme1n1p1

# Verificar pool
zpool status
zpool list`}),o.jsx("h2",{children:"Datasets"}),o.jsx(s,{title:"Gerenciar datasets",code:`# Criar dataset
sudo zfs create meupool/dados
sudo zfs create meupool/dados/documentos
sudo zfs create meupool/dados/fotos

# Datasets são montados automaticamente em /meupool/dados

# Listar datasets
zfs list

# Configurar propriedades
sudo zfs set compression=zstd meupool/dados
sudo zfs set atime=off meupool/dados
sudo zfs set quota=100G meupool/dados/fotos
sudo zfs set mountpoint=/home/usuario/dados meupool/dados

# Ver propriedades
zfs get all meupool/dados
zfs get compression,compressratio meupool/dados`}),o.jsx("h2",{children:"Snapshots"}),o.jsx(s,{title:"Gerenciar snapshots ZFS",code:`# Criar snapshot
sudo zfs snapshot meupool/dados@antes-da-mudanca
sudo zfs snapshot meupool/dados@2024-01-15

# Snapshot recursivo (todos os datasets filhos)
sudo zfs snapshot -r meupool/dados@backup-completo

# Listar snapshots
zfs list -t snapshot

# Ver diferenças entre estado atual e snapshot
zfs diff meupool/dados@antes-da-mudanca

# Restaurar para um snapshot (ROLLBACK)
sudo zfs rollback meupool/dados@antes-da-mudanca

# Acessar arquivos de um snapshot (sem restaurar)
ls /meupool/dados/.zfs/snapshot/antes-da-mudanca/

# Deletar snapshot
sudo zfs destroy meupool/dados@snapshot-antigo`}),o.jsx("h2",{children:"Envio e Recebimento (Backup)"}),o.jsx(s,{title:"Backup com send/receive",code:`# Enviar snapshot para arquivo
sudo zfs send meupool/dados@backup > /backup/dados.zfs

# Receber snapshot de arquivo
sudo zfs receive outropool/restaurado < /backup/dados.zfs

# Enviar para outro servidor via SSH
sudo zfs send meupool/dados@backup | ssh servidor sudo zfs receive backuppool/dados

# Envio incremental (apenas diferenças)
sudo zfs send -i meupool/dados@snap1 meupool/dados@snap2 | \\
  ssh servidor sudo zfs receive backuppool/dados

# Envio comprimido
sudo zfs send meupool/dados@backup | zstd | \\
  ssh servidor "zstd -d | sudo zfs receive backuppool/dados"`}),o.jsx("h2",{children:"Compressão"}),o.jsx(s,{title:"Configurar compressão ZFS",code:`# Habilitar compressão (recomendado sempre)
sudo zfs set compression=zstd meupool/dados

# Algoritmos disponíveis:
# zstd   — melhor geral (bom ratio, boa velocidade)
# lz4    — mais rápido, menos compressão
# gzip-9 — melhor compressão, mais lento
# off    — sem compressão

# Ver ratio de compressão
zfs get compressratio meupool/dados

# Compressão por dataset
sudo zfs set compression=lz4 meupool/dados/logs     # Rápido para logs
sudo zfs set compression=zstd-19 meupool/dados/backup  # Máximo para backup`}),o.jsx("h2",{children:"Monitoramento e Manutenção"}),o.jsx(s,{title:"Monitorar e manter pool ZFS",code:`# Status do pool
zpool status -v

# Espaço usado
zpool list
zfs list

# Verificar integridade (scrub)
sudo zpool scrub meupool

# Ver progresso do scrub
zpool status meupool

# Agendar scrub semanal
sudo systemctl enable --now zfs-scrub-weekly@meupool.timer

# Histórico de operações
zpool history meupool

# Estatísticas de I/O
zpool iostat meupool 1`}),o.jsxs(e,{type:"info",title:"ARC (Adaptive Replacement Cache)",children:["O ZFS usa a RAM como cache de leitura (ARC). Por padrão, ele pode usar até metade da RAM. Para limitar: ",o.jsx("code",{children:'echo "options zfs zfs_arc_max=4294967296" | sudo tee /etc/modprobe.d/zfs.conf'}),"(limita a 4GB). Reinicie para aplicar."]})]})}export{u as default};
