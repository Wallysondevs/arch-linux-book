import{j as s}from"./ui-K-J8Jkwj.js";import{P as e}from"./PageContainer-tnnsMrcC.js";import{C as o}from"./CodeBlock-DEDRw1y6.js";import{A as a}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function p(){return s.jsxs(e,{title:"Btrfs Avançado",subtitle:"O sistema de arquivos moderno do Linux. Snapshots, compressão transparente, subvolumes, RAID integrado e auto-reparo. Domine o Btrfs do básico ao avançado.",difficulty:"avancado",timeToRead:"22 min",children:[s.jsx("h2",{children:"Por que Btrfs?"}),s.jsx("p",{children:"O Btrfs (B-tree filesystem) é o sistema de arquivos moderno do Linux, com funcionalidades que os sistemas tradicionais (ext4, XFS) não têm nativamente:"}),s.jsxs("ul",{children:[s.jsxs("li",{children:[s.jsx("strong",{children:"Copy-on-Write (CoW)"})," — Dados nunca são sobrescritos, apenas novos blocos são escritos. Essencial para snapshots."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Snapshots instantâneos"})," — Criados em microssegundos, independente do tamanho do volume."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Subvolumes"})," — Partições virtuais dentro do mesmo FS, com políticas independentes."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Compressão transparente"})," — zstd, lzo ou zlib sem configuração adicional."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"RAID integrado"})," — RAID 0, 1, 10, 5, 6 sem mdadm."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Deduplicação"})," — Remove blocos idênticos para economizar espaço."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Checksums"})," — Verificação de integridade automática dos dados."]})]}),s.jsx("h2",{children:"Formatação e Subvolumes"}),s.jsx(o,{title:"Criar e organizar Btrfs",code:`# Formatar partição como Btrfs
sudo mkfs.btrfs -L "Arch Linux" /dev/sda2
sudo mkfs.btrfs --label "Arch Linux" /dev/sda2

# Montar temporariamente para criar subvolumes
sudo mount /dev/sda2 /mnt

# Criar subvolumes (convenção para usar com snapper)
sudo btrfs subvolume create /mnt/@          # Subvolume root
sudo btrfs subvolume create /mnt/@home      # Subvolume home
sudo btrfs subvolume create /mnt/@snapshots # Para snapshots
sudo btrfs subvolume create /mnt/@log       # Para /var/log

# Listar subvolumes
sudo btrfs subvolume list /mnt

# Desmontar e montar com subvolumes
sudo umount /mnt
sudo mount -o subvol=@ /dev/sda2 /mnt
sudo mkdir -p /mnt/{home,.snapshots,var/log,boot}
sudo mount -o subvol=@home /dev/sda2 /mnt/home
sudo mount -o subvol=@snapshots /dev/sda2 /mnt/.snapshots
sudo mount -o subvol=@log /dev/sda2 /mnt/var/log
sudo mount /dev/sda1 /mnt/boot  # Partição EFI`}),s.jsx("h2",{children:"fstab para Btrfs"}),s.jsx(o,{title:"/etc/fstab com opções Btrfs",code:`# UUID do disco Btrfs
# blkid /dev/sda2

UUID=xxxx-xxxx  /           btrfs  rw,relatime,compress=zstd,subvol=@          0 0
UUID=xxxx-xxxx  /home       btrfs  rw,relatime,compress=zstd,subvol=@home      0 0
UUID=xxxx-xxxx  /.snapshots btrfs  rw,relatime,compress=zstd,subvol=@snapshots 0 0
UUID=xxxx-xxxx  /var/log    btrfs  rw,relatime,compress=zstd,subvol=@log       0 0

# Opções comuns do Btrfs:
# compress=zstd      - Compressão com zstd (melhor equilíbrio)
# compress=zstd:3    - Nível 3 de compressão (mais agressivo)
# compress=lzo       - Compressão mais rápida, menor taxa
# noatime            - Não atualizar tempo de acesso (performance)
# ssd                - Otimizações para SSD
# discard=async      - TRIM assíncrono para SSD
# space_cache=v2     - Cache de espaço livre (recomendado)`}),s.jsx("h2",{children:"Snapshots"}),s.jsx(o,{title:"Criar e gerenciar snapshots manualmente",code:`# Criar snapshot somente-leitura (para backup)
sudo btrfs subvolume snapshot -r / /.snapshots/root_$(date +%Y%m%d_%H%M%S)

# Criar snapshot de leitura/escrita (para reverter)
sudo btrfs subvolume snapshot / /.snapshots/root_before_update

# Listar snapshots
sudo btrfs subvolume list / | grep snapshot
sudo ls -la /.snapshots/

# Deletar snapshot
sudo btrfs subvolume delete /.snapshots/root_20250101_120000

# Restaurar sistema para um snapshot
# (Boot pela ISO do Arch, montar partição e trocar subvolumes)
sudo mount /dev/sda2 /mnt
sudo btrfs subvolume list /mnt

# Renomear @ atual para backup
sudo mv /mnt/@ /mnt/@_old
# Criar novo @ a partir do snapshot
sudo btrfs subvolume snapshot /mnt/@snapshots/root_20250101 /mnt/@
sudo umount /mnt
# Reiniciar`}),s.jsx("h2",{children:"Snapper - Gerenciamento Automático de Snapshots"}),s.jsx(o,{title:"Configurar snapper para snapshots automáticos",code:`# Instalar snapper e grub-btrfs
sudo pacman -S snapper snap-pac grub-btrfs

# Criar configuração para root
sudo snapper -c root create-config /

# Ver configurações
sudo snapper list-configs

# Criar snapshot manual
sudo snapper -c root create -d "Antes de atualização importante"

# Listar snapshots
sudo snapper -c root list

# Configurar política de retenção automática
sudo nano /etc/snapper/configs/root`}),s.jsx(o,{title:"/etc/snapper/configs/root - Política de retenção",code:`# Limite de snapshots a manter
NUMBER_LIMIT="10"
NUMBER_LIMIT_IMPORTANT="10"

# Snapshots por hora/dia/semana/mês
TIMELINE_LIMIT_HOURLY="5"
TIMELINE_LIMIT_DAILY="7"
TIMELINE_LIMIT_WEEKLY="0"
TIMELINE_LIMIT_MONTHLY="0"
TIMELINE_LIMIT_YEARLY="0"

# Habilitar timeline automática
TIMELINE_CREATE="yes"
TIMELINE_CLEANUP="yes"`}),s.jsx(o,{title:"Snapper com pacman (snap-pac)",code:`# Com snap-pac instalado, snapshots são criados automaticamente
# antes e depois de cada operação do pacman!

# Atualizar sistema (cria snapshot antes e depois automaticamente)
sudo pacman -Syu

# Listar snapshots (verá pares pre/post de atualizações)
sudo snapper -c root list

# Comparar dois snapshots
sudo snapper -c root diff 5..6

# Ver arquivos modificados entre snapshots
sudo snapper -c root status 5..6

# Reverter um arquivo para versão anterior
sudo snapper -c root undochange 5..6 /etc/nginx/nginx.conf

# Reverter TODOS os arquivos entre dois snapshots
sudo snapper -c root undochange 5..6`}),s.jsx("h2",{children:"Compressão e Deduplicação"}),s.jsx(o,{title:"Compressão e economia de espaço",code:`# Ver taxa de compressão atual
sudo compsize /home    # Requer pacote compsize: sudo pacman -S compsize

# Saída:
# Processed 123456 files, 45678 regular extents (45678 refs), 1234 inline.
# Type       Perc     Disk Usage   Uncompressed Referenced
# TOTAL       42%      5.2G         12.4G        12.4G
# none       100%      123M         123M         123M
# zstd        38%      5.1G         13.4G        12.3G

# Ativar compressão em diretório existente
sudo btrfs filesystem defragment -r -czstd /home

# Verificar espaço usado
sudo btrfs filesystem usage /
sudo btrfs filesystem df /

# Deduplicação (requer duperemove do AUR)
yay -S duperemove
sudo duperemove -rdh /home  # -r recursive, -d dedupe, -h human readable`}),s.jsx("h2",{children:"Balanceamento e Manutenção"}),s.jsx(o,{title:"Manutenção do Btrfs",code:`# Verificar e reparar o filesystem
sudo btrfs scrub start /        # Inicia verificação de integridade
sudo btrfs scrub status /       # Ver status
sudo btrfs scrub cancel /       # Cancelar

# Balancear chunks de dados (redistribuir entre discos)
sudo btrfs balance start /

# Balance com filtro (mais suave, para uso diário)
sudo btrfs balance start -dusage=50 /   # Apenas chunks com < 50% de uso

# Ver status do balance
sudo btrfs balance status /

# Desfragmentar (raramente necessário no Btrfs)
sudo btrfs filesystem defragment -r /home

# Redimensionar Btrfs (não precisa desmontar!)
sudo btrfs filesystem resize max /     # Expandir ao máximo disponível
sudo btrfs filesystem resize -10G /    # Reduzir 10GB
sudo btrfs filesystem resize 100G /    # Definir tamanho exato`}),s.jsx(a,{type:"warning",title:"RAID 5/6 no Btrfs",children:"O RAID 5 e RAID 6 do Btrfs ainda são considerados instáveis e não recomendados para dados importantes. Para RAID com redundância, prefira RAID 1 no Btrfs ou use mdadm com outro sistema de arquivos."})]})}export{p as default};
