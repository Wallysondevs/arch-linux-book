import{j as e}from"./ui-K-J8Jkwj.js";import{P as a}from"./PageContainer-tnnsMrcC.js";import{C as o}from"./CodeBlock-DEDRw1y6.js";import{A as s}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function p(){return e.jsxs(a,{title:"Discos, Partições e Sistemas de Arquivos",subtitle:"Gerencie discos, crie partições, formate, monte e monitore o espaço de armazenamento do seu sistema.",difficulty:"intermediario",timeToRead:"25 min",children:[e.jsx("p",{children:"O gerenciamento de discos é uma das tarefas mais importantes (e perigosas) na administração Linux. Entender como o sistema organiza discos, partições e pontos de montagem é fundamental para instalar o sistema, adicionar armazenamento e manter backups."}),e.jsx("h2",{children:"1. Visualizando Discos e Partições"}),e.jsx("h3",{children:"lsblk - Listar Block Devices"}),e.jsx(o,{code:`# Listar todos os discos e partições
lsblk

# Saída típica:
# NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
# sda      8:0    0 500.0G  0 disk
# ├─sda1   8:1    0   512M  0 part /boot
# ├─sda2   8:2    0 450.0G  0 part /
# └─sda3   8:3    0  49.5G  0 part [SWAP]
# sdb      8:16   1  32.0G  0 disk
# └─sdb1   8:17   1  32.0G  0 part /mnt/usb
# nvme0n1  259:0  0   1.0T  0 disk
# ├─nvme0n1p1 ...

# Mostrar com sistema de arquivos e UUID
lsblk -f

# Mostrar tamanho em bytes
lsblk -b

# Mostrar apenas discos (sem partições)
lsblk -d

# Mostrar com mais informações
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT,UUID`}),e.jsx("p",{children:"Nomenclatura dos dispositivos:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"sda, sdb, sdc..."})," - Discos SATA/USB (sd = SCSI disk)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"nvme0n1, nvme1n1..."})," - Discos NVMe"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"sda1, sda2..."})," - Partições do disco sda"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"nvme0n1p1, nvme0n1p2..."})," - Partições do disco NVMe"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"sr0"})," - Drive de CD/DVD"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"loop0, loop1..."})," - Dispositivos de loop (snaps, ISOs montadas)"]})]}),e.jsx("h3",{children:"fdisk -l - Informações Detalhadas"}),e.jsx(o,{code:`# Listar todos os discos com detalhes (precisa de root)
sudo fdisk -l

# Listar informações de um disco específico
sudo fdisk -l /dev/sda`}),e.jsx("h3",{children:"blkid - UUIDs e Tipos"}),e.jsx(o,{code:`# Mostrar UUID e tipo de sistema de arquivos de todas as partições
sudo blkid

# Saída:
# /dev/sda1: UUID="XXXX-XXXX" TYPE="vfat" PARTUUID="..."
# /dev/sda2: UUID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" TYPE="ext4" PARTUUID="..."

# Mostrar informações de uma partição específica
sudo blkid /dev/sda1`}),e.jsx("h2",{children:"2. Particionamento de Discos"}),e.jsxs(s,{type:"danger",title:"CUIDADO EXTREMO!",children:["Particionar o disco errado pode destruir TODOS os seus dados. Sempre confirme o dispositivo correto com ",e.jsx("code",{children:"lsblk"})," antes de qualquer operação. Nunca particione o disco que contém seu sistema operacional em execução (a menos que saiba exatamente o que está fazendo)."]}),e.jsx("h3",{children:"fdisk - Particionamento Interativo"}),e.jsx(o,{code:`# Abrir o fdisk para um disco (CUIDADO: escolha o disco certo!)
sudo fdisk /dev/sdb

# Comandos dentro do fdisk:
# m     - Mostrar ajuda (menu)
# p     - Mostrar tabela de partições atual
# n     - Criar nova partição
# d     - Deletar uma partição
# t     - Mudar o tipo da partição
# l     - Listar tipos de partição disponíveis
# w     - Gravar mudanças e sair (IRREVERSÍVEL)
# q     - Sair SEM salvar mudanças

# Exemplo: criar partição EFI + root em disco GPT
# 1. sudo fdisk /dev/sdb
# 2. g (criar nova tabela GPT)
# 3. n (nova partição - EFI, +512M)
# 4. t (tipo 1 = EFI System)
# 5. n (nova partição - root, usar todo espaço restante)
# 6. w (gravar)`}),e.jsx("h3",{children:"cfdisk - Particionamento com Interface Visual"}),e.jsx(o,{code:`# Abrir interface visual de particionamento (muito mais fácil que fdisk)
sudo cfdisk /dev/sdb

# Use as setas para navegar
# Selecione "New" para criar partição
# Selecione "Type" para mudar o tipo
# Selecione "Write" para salvar (digite "yes" para confirmar)
# Selecione "Quit" para sair`}),e.jsxs(s,{type:"success",title:"Recomendação para iniciantes",children:["Use ",e.jsx("code",{children:"cfdisk"})," em vez de ",e.jsx("code",{children:"fdisk"})," quando possível. A interface visual torna muito mais difícil cometer erros e é mais intuitiva."]}),e.jsx("h3",{children:"parted - Particionamento Avançado"}),e.jsx(o,{code:`# Abrir parted para um disco
sudo parted /dev/sdb

# Comandos dentro do parted:
# print           - Mostrar partições
# mklabel gpt     - Criar tabela de partições GPT
# mklabel msdos   - Criar tabela de partições MBR
# mkpart primary ext4 1MiB 100GiB   - Criar partição
# rm 1            - Remover partição 1
# resizepart 1 200GiB               - Redimensionar partição
# quit            - Sair

# Usar parted em modo não interativo
sudo parted /dev/sdb --script mklabel gpt
sudo parted /dev/sdb --script mkpart primary ext4 1MiB 100%`}),e.jsx("h2",{children:"3. Sistemas de Arquivos - mkfs"}),e.jsx(o,{code:`# Formatar como ext4 (o mais comum no Linux)
sudo mkfs.ext4 /dev/sdb1

# Formatar com label (nome)
sudo mkfs.ext4 -L "MeuDisco" /dev/sdb1

# Formatar como FAT32 (para EFI, pendrives)
sudo mkfs.fat -F 32 /dev/sdb1

# Formatar como Btrfs (sistema moderno com snapshots)
sudo mkfs.btrfs /dev/sdb1

# Formatar com label em Btrfs
sudo mkfs.btrfs -L "BtrfsDisco" /dev/sdb1

# Formatar como XFS
sudo mkfs.xfs /dev/sdb1

# Formatar como NTFS (para compatibilidade com Windows)
sudo mkfs.ntfs /dev/sdb1

# Formatar como exFAT (para pendrives grandes, compatível com todos os SO)
sudo mkfs.exfat /dev/sdb1`}),e.jsxs(s,{type:"warning",title:"Formatar apaga tudo!",children:["O ",e.jsx("code",{children:"mkfs"})," destrói todos os dados da partição. Não há como desfazer. Sempre faça backup antes e confirme que está formatando a partição correta."]}),e.jsx("p",{children:"Comparação de sistemas de arquivos:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"ext4"})," - Confiável, maduro, desempenho excelente. O padrão para maioria dos casos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Btrfs"})," - Moderno, suporta snapshots, compressão, subvolumes. Bom para quem quer funcionalidades avançadas."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"XFS"})," - Excelente para arquivos grandes e servidores. Usado por padrão no RHEL."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"FAT32"})," - Obrigatório para partição EFI. Limite de 4GB por arquivo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"exFAT"})," - Sem limite de 4GB, boa compatibilidade. Ideal para pendrives."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"NTFS"})," - Sistema de arquivos do Windows. Suporte no Linux via ntfs-3g."]})]}),e.jsx("h2",{children:"4. Montagem e Desmontagem"}),e.jsx("h3",{children:"mount"}),e.jsx(o,{code:`# Montar uma partição
sudo mount /dev/sdb1 /mnt

# Montar com tipo específico de sistema de arquivos
sudo mount -t ntfs-3g /dev/sdb1 /mnt/windows

# Montar como somente leitura
sudo mount -o ro /dev/sdb1 /mnt

# Montar com opções específicas
sudo mount -o rw,noatime,compress=zstd /dev/sdb1 /mnt

# Montar ISO
sudo mount -o loop arquivo.iso /mnt/iso

# Ver todos os sistemas montados
mount | column -t

# Montar tudo que está no fstab
sudo mount -a`}),e.jsx("h3",{children:"umount"}),e.jsx(o,{code:`# Desmontar uma partição
sudo umount /mnt

# Desmontar pelo dispositivo
sudo umount /dev/sdb1

# Forçar desmontagem (se estiver ocupada)
sudo umount -f /mnt

# Desmontar de forma lazy (desmontar quando não estiver mais em uso)
sudo umount -l /mnt`}),e.jsxs(s,{type:"warning",title:"device is busy",children:["Se aparecer esse erro, significa que algum processo está usando arquivos na partição. Use ",e.jsx("code",{children:"lsof /mnt"})," ou ",e.jsx("code",{children:"fuser -m /mnt"})," para descobrir qual processo. Feche os programas ou mude de diretório antes de desmontar."]}),e.jsx("h3",{children:"/etc/fstab - Montagem Automática"}),e.jsxs("p",{children:["O arquivo ",e.jsx("code",{children:"/etc/fstab"})," define quais partições devem ser montadas automaticamente durante o boot."]}),e.jsx(o,{code:`# Formato de cada linha:
# <dispositivo>    <ponto_montagem>  <tipo>  <opções>      <dump> <pass>

# Exemplo de fstab típico no Arch:
UUID=xxxx-xxxx                        /boot    vfat    defaults,noatime          0 2
UUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx /        ext4    defaults,noatime          0 1
UUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx none     swap    defaults                  0 0
UUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx /home    ext4    defaults,noatime          0 2

# Montar disco externo automaticamente
UUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx /mnt/backup ext4 defaults,nofail,noatime  0 2`,title:"/etc/fstab"}),e.jsx("p",{children:"Explicação dos campos:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"dispositivo"})," - UUID (recomendado) ou caminho do dispositivo"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"ponto de montagem"})," - Diretório onde será montado"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"tipo"})," - Sistema de arquivos (ext4, vfat, btrfs, swap)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"opções"})," - defaults, noatime, ro, nofail, etc."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"dump"})," - Backup (0 = não, 1 = sim). Geralmente 0."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"pass"})," - Ordem de verificação no boot (0 = não verificar, 1 = raiz, 2 = outros)"]})]}),e.jsxs(s,{type:"danger",title:"Erro no fstab pode impedir o boot!",children:["Sempre use ",e.jsx("code",{children:"nofail"})," para discos externos/removíveis. Sem isso, se o disco não estiver conectado durante o boot, o sistema pode entrar em modo de emergência. Após editar o fstab, teste com ",e.jsx("code",{children:"sudo mount -a"})," antes de reiniciar."]}),e.jsx("h2",{children:"5. Monitoramento de Espaço em Disco"}),e.jsx("h3",{children:"df - Disk Free"}),e.jsx(o,{code:`# Ver espaço livre em todas as partições montadas
df -h

# Saída típica:
# Filesystem      Size  Used Avail Use% Mounted on
# /dev/sda2       450G  120G  307G  29% /
# /dev/sda1       512M   64M  448M  13% /boot
# tmpfs           7.8G  1.2G  6.6G  16% /tmp

# Mostrar tipo de sistema de arquivos
df -Th

# Mostrar informações de um diretório específico
df -h /home

# Mostrar apenas sistemas de arquivos locais (sem tmpfs, etc)
df -h -x tmpfs -x devtmpfs`}),e.jsx("h3",{children:"du - Disk Usage"}),e.jsx(o,{code:`# Ver tamanho de um diretório
du -sh /home/joao

# Ver tamanho de cada subdiretório
du -h --max-depth=1 /home/joao

# Ver os 10 maiores diretórios
du -h --max-depth=1 / 2>/dev/null | sort -rh | head -10

# Ver tamanho de cada arquivo em um diretório
du -ah /var/log | sort -rh | head -20

# Excluir certos padrões
du -sh --exclude='*.log' /var`}),e.jsx("h3",{children:"ncdu - NCurses Disk Usage"}),e.jsx(o,{code:`# Instalar
sudo pacman -S ncdu

# Analisar diretório atual
ncdu

# Analisar diretório específico
ncdu /home

# Analisar o sistema inteiro
sudo ncdu /

# Atalhos dentro do ncdu:
# d     - Deletar arquivo/diretório selecionado
# n     - Ordenar por nome
# s     - Ordenar por tamanho
# q     - Sair
# Enter - Entrar no diretório`}),e.jsx("h2",{children:"6. Formatando um Pendrive pelo Terminal (Passo a Passo)"}),e.jsx("p",{children:'Na interface gráfica (Nautilus/Files, Dolphin, Thunar), quando você clica com o botão direito no pendrive e escolhe "Formatar", muitas vezes aparece um erro e não consegue formatar. Isso é extremamente comum — a interface gráfica não é 100% confiável para operações de disco. Pelo terminal, funciona sempre.'}),e.jsx(s,{type:"warning",title:"Formatar apaga TUDO do pendrive!",children:e.jsx("p",{children:"Antes de formatar, copie tudo que precisa do pendrive para outro lugar. Depois de formatar, não tem como recuperar."})}),e.jsx("h3",{children:"Passo 1: Identificar o pendrive"}),e.jsx(o,{title:"Descobrir qual dispositivo é o pendrive",code:`# ANTES de plugar o pendrive, veja os discos:
lsblk

# Agora plugue o pendrive e rode novamente:
lsblk

# O dispositivo NOVO que apareceu é o pendrive. Exemplo:
# NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
# sda      8:0    0 500.0G  0 disk              ← Disco principal (NÃO MEXER)
# ├─sda1   8:1    0   512M  0 part /boot
# └─sda2   8:2    0 499.5G  0 part /
# sdb      8:16   1  14.5G  0 disk              ← PENDRIVE! (RM=1 = removível)
# └─sdb1   8:17   1  14.5G  0 part /run/media/joao/MEUUSB

# DICAS para identificar o pendrive:
# - RM = 1 (removível)
# - Tamanho bate com o pendrive (8G, 16G, 32G, 64G...)
# - Montado em /run/media/ (montagem automática)

# Confirmar com mais detalhes:
lsblk -f /dev/sdb
# NAME FSTYPE LABEL  UUID                                 MOUNTPOINTS
# sdb
# └sdb1 vfat  MEUUSB XXXX-XXXX                            /run/media/joao/MEUUSB

# Ou verificar o fabricante:
sudo fdisk -l /dev/sdb
# Disk /dev/sdb: 14.5 GiB, 15502147584 bytes
# Disk model: Kingston DT 101 G2`}),e.jsx(s,{type:"danger",title:"NUNCA confunda o disco!",children:e.jsxs("p",{children:["Se você formatar ",e.jsx("code",{children:"/dev/sda"})," pensando que é o pendrive, vai apagar o sistema operacional inteiro. SEMPRE confirme olhando o tamanho (SIZE), se é removível (RM=1), e o ponto de montagem. Na dúvida, plugue e desplugue o pendrive para ver qual dispositivo aparece e desaparece."]})}),e.jsx("h3",{children:"Passo 2: Desmontar o pendrive"}),e.jsx(o,{title:"Desmontar antes de formatar",code:`# O pendrive geralmente é montado automaticamente. Você PRECISA desmontar antes de formatar.

# Desmontar a partição (NÃO o disco inteiro):
sudo umount /dev/sdb1

# Se tiver mais de uma partição:
sudo umount /dev/sdb1
sudo umount /dev/sdb2

# Se der erro "target is busy" (algum programa está usando o pendrive):
# 1. Feche qualquer gerenciador de arquivos que esteja mostrando o pendrive
# 2. Saia de qualquer terminal que esteja dentro do pendrive (cd ~)
# 3. Tente novamente:
sudo umount /dev/sdb1

# Se ainda não funcionar, force:
sudo umount -f /dev/sdb1

# Verificar se desmontou:
lsblk /dev/sdb
# sdb      8:16   1  14.5G  0 disk
# └─sdb1   8:17   1  14.5G  0 part    ← Sem MOUNTPOINTS = desmontado ✓`}),e.jsx("h3",{children:"Passo 3: Criar nova tabela de partições"}),e.jsx(o,{title:"Recriar a tabela de partições (opcional mas recomendado)",code:`# Se quer apenas formatar a partição existente, pule para o Passo 4.
# Se quer recriar do zero (como se fosse um pendrive novo):

# Abrir o cfdisk (interface visual, mais fácil):
sudo cfdisk /dev/sdb

# O cfdisk mostra:
# ┌─────────────────────────────────────────────────────────┐
# │                    Disk: /dev/sdb                        │
# │              Size: 14.5 GiB, 15502147584 bytes          │
# │     Label: dos, identifier: 0x00000000                  │
# │                                                         │
# │ Device    Boot   Start      End   Sectors  Size Id Type │
# │ /dev/sdb1         2048 30277631  30275584 14.5G  c W95  │
# │                                                         │
# │ [ Delete ] [ Resize ] [  Quit  ] [  Type  ] [ Help ]   │
# │ [  Write  ] [ Dump  ]  [  New  ]                       │
# └─────────────────────────────────────────────────────────┘

# Para recriar do zero:
# 1. Selecione a partição existente e escolha [ Delete ]
# 2. Agora o espaço aparece como "Free space"
# 3. Selecione o espaço livre e escolha [ New ]
# 4. Aceite o tamanho padrão (usa todo o espaço) → Enter
# 5. Escolha "primary"
# 6. Se for para usar em Windows também, vá em [ Type ]:
#    - "0c" para FAT32 (W95 FAT32 LBA)
#    - "07" para NTFS
#    - "83" para Linux (ext4)
# 7. Escolha [ Write ] e digite "yes" para confirmar
# 8. Escolha [ Quit ]

# === ALTERNATIVA: pelo fdisk (sem interface visual) ===
sudo fdisk /dev/sdb
# Dentro do fdisk:
# o     → Criar nova tabela MBR (apaga tudo)
# n     → Nova partição
# p     → Primária
# 1     → Número 1
# Enter → Primeiro setor (padrão)
# Enter → Último setor (padrão, usa todo o espaço)
# t     → Mudar tipo
# c     → FAT32 (ou 83 para Linux)
# w     → Gravar e sair`}),e.jsx("h3",{children:"Passo 4: Formatar a partição"}),e.jsx(o,{title:"Formatar o pendrive",code:`# === FAT32 (compatível com TUDO: Windows, Mac, Linux, TV, carro, videogame) ===
# Limitação: arquivos de no máximo 4 GB
sudo mkfs.fat -F 32 -n "MEUUSB" /dev/sdb1

# Explicação:
# -F 32    → FAT32 (e não FAT12 ou FAT16)
# -n "MEUUSB" → Nome/label do pendrive (aparece no gerenciador de arquivos)
# /dev/sdb1   → A PARTIÇÃO (sdb1), não o disco (sdb)

# === exFAT (melhor opção para pendrives modernos) ===
# Compatível com Windows, Mac, Linux. Sem limite de 4 GB por arquivo.
sudo mkfs.exfat -n "MEUUSB" /dev/sdb1

# === NTFS (sistema de arquivos do Windows) ===
# Útil se vai usar muito no Windows
sudo mkfs.ntfs -f -L "MEUUSB" /dev/sdb1
# -f = formatação rápida (sem ele demora MUITO)

# === ext4 (Linux nativo) ===
# Melhor desempenho no Linux, mas Windows não lê sem software extra
sudo mkfs.ext4 -L "MEUUSB" /dev/sdb1`}),e.jsx("h3",{children:"Passo 5: Verificar e montar"}),e.jsx(o,{title:"Verificar se formatou e montar",code:`# Verificar:
lsblk -f /dev/sdb
# NAME FSTYPE LABEL  UUID                 MOUNTPOINTS
# sdb
# └sdb1 vfat  MEUUSB XXXX-XXXX

# Montar manualmente:
sudo mount /dev/sdb1 /mnt
ls /mnt    # Deve estar vazio (pendrive formatado)

# Desmontar:
sudo umount /mnt

# Ou simplesmente: remova e plugue o pendrive novamente
# O sistema vai montar automaticamente em /run/media/seu_usuario/MEUUSB`}),e.jsx(s,{type:"success",title:"Qual formato escolher?",children:e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"FAT32"})," — Funciona em TUDO (Windows, Mac, Linux, TV, carro, PS4/PS5, impressora). Limite de 4GB por arquivo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"exFAT"})," — A melhor opção geral. Sem limite de 4GB, funciona em Windows, Mac e Linux modernos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"NTFS"})," — Se vai usar principalmente no Windows e precisa de arquivos maiores que 4GB."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"ext4"})," — Se vai usar SOMENTE no Linux. Melhor desempenho e suporte a permissões."]})]})}),e.jsx("h3",{children:"Resolvendo erros comuns"}),e.jsx(o,{title:"Erros frequentes ao formatar pendrive",code:`# ERRO: "device is busy" ou "target is busy"
# Causa: O pendrive ainda está sendo usado
# Solução:
sudo umount /dev/sdb1           # Desmontar primeiro
# Se não funcionar:
sudo fuser -km /dev/sdb1        # Mata processos usando o pendrive
sudo umount -f /dev/sdb1        # Força desmontagem

# ERRO: "Permission denied"
# Causa: Faltou o sudo
# Solução: Adicione sudo antes do comando
sudo mkfs.fat -F 32 /dev/sdb1

# ERRO: "No such file or directory: /dev/sdb1"
# Causa: O pendrive não tem partição (ou foi removido)
# Solução: Verifique com lsblk. Se não aparece, o pendrive foi desconectado.
# Se aparece /dev/sdb sem sdb1, precisa criar partição (Passo 3)

# ERRO: Pendrive aparece como somente leitura (read-only)
# Causa: Alguns pendrives têm trava física de proteção contra gravação
# Solução 1: Verificar se tem uma chave física no pendrive (slider)
# Solução 2: Remover atributo de somente leitura:
sudo hdparm -r0 /dev/sdb

# ERRO: O pendrive não aparece no lsblk
# Possíveis causas:
# 1. Porta USB com defeito — tente outra porta
# 2. Pendrive com defeito
# 3. Módulo USB não carregado (raro)
# Verificar logs para ver se o sistema detectou o pendrive:
dmesg | tail -20
# Deve aparecer algo como:
# [12345.678] usb 2-1: new high-speed USB device number 3 using xhci_hcd
# [12345.789] sd 3:0:0:0: [sdb] 30277632 512-byte logical blocks`}),e.jsx("h3",{children:"Ejetar o pendrive com segurança"}),e.jsx(o,{title:"Remover pendrive com segurança",code:`# IMPORTANTE: Sempre desmonte antes de remover fisicamente!
# Se puxar o pendrive sem desmontar, pode corromper os dados.

# Desmontar:
sudo umount /dev/sdb1

# Ejetar (desliga a energia do dispositivo USB em alguns sistemas):
sudo eject /dev/sdb

# Agora pode remover o pendrive fisicamente com segurança.

# Ou pelo udisksctl (ferramenta de desktop):
udisksctl unmount -b /dev/sdb1
udisksctl power-off -b /dev/sdb`}),e.jsx("h2",{children:"7. Criar Pendrive Bootável (ISO)"}),e.jsxs("p",{children:["Para instalar Linux ou outro sistema operacional, você precisa gravar a ISO em um pendrive. No Windows, usaria o Rufus ou Etcher. No Linux, o ",e.jsx("code",{children:"dd"})," faz isso direto pelo terminal."]}),e.jsx(o,{title:"Gravar ISO em pendrive bootável",code:`# 1. Baixe a ISO (exemplo: Arch Linux)
# https://archlinux.org/download/

# 2. Identifique o pendrive (lsblk)
lsblk
# sdb      8:16   1  14.5G  0 disk   ← Este é o pendrive

# 3. Desmonte TODAS as partições do pendrive
sudo umount /dev/sdb1

# 4. Grave a ISO diretamente no DISCO (sdb, NÃO sdb1!)
sudo dd if=archlinux-2026.03.01-x86_64.iso of=/dev/sdb bs=4M status=progress oflag=sync

# Explicação:
# if=       → Input File (arquivo de entrada = a ISO)
# of=       → Output File (saída = o pendrive, o DISCO /dev/sdb, sem número!)
# bs=4M     → Block Size (grava 4 MB por vez, mais rápido)
# status=progress → Mostra o progresso
# oflag=sync     → Garante que os dados foram gravados antes de terminar

# 5. Espere terminar (pode demorar alguns minutos)
# 30277632+0 records in
# 30277632+0 records out
# 858783744 bytes (859 MB, 819 MiB) copied, 45.123 s, 19.0 MB/s

# 6. Sincronizar (garantir que tudo foi escrito)
sync

# 7. Agora pode reiniciar e dar boot pelo pendrive
# (Configure o BIOS/UEFI para bootar pelo USB)`}),e.jsx(s,{type:"danger",title:"dd grava no DISCO, não na partição!",children:e.jsxs("p",{children:["Para ISOs bootáveis, use ",e.jsx("code",{children:"/dev/sdb"})," (o disco inteiro), NÃO ",e.jsx("code",{children:"/dev/sdb1"}),"(a partição). A ISO já contém sua própria tabela de partições. E NUNCA confunda com ",e.jsx("code",{children:"/dev/sda"}),"— ou vai apagar seu sistema operacional!"]})}),e.jsx("h2",{children:"8. dd - Cópia de Baixo Nível (Outros Usos)"}),e.jsxs(s,{type:"danger",title:"dd é apelidado de 'disk destroyer'",children:["O ",e.jsx("code",{children:"dd"})," grava dados diretamente no dispositivo sem perguntar. Se você trocar",e.jsx("code",{children:" of="})," (saída) pelo dispositivo errado, pode sobrescrever seu disco principal. Sempre confira 3 vezes antes de executar."]}),e.jsx(o,{code:`# Criar pendrive bootável a partir de uma ISO
sudo dd if=archlinux.iso of=/dev/sdb bs=4M status=progress oflag=sync

# Explicação:
# if=    arquivo de entrada (input file)
# of=    dispositivo de saída (output file)
# bs=    tamanho do bloco (4 megabytes)
# status=progress    mostra progresso
# oflag=sync         força gravação síncrona

# Criar backup de uma partição inteira
sudo dd if=/dev/sda1 of=backup_sda1.img bs=4M status=progress

# Restaurar backup
sudo dd if=backup_sda1.img of=/dev/sda1 bs=4M status=progress

# Zerar um disco completamente (DESTRÓI TUDO)
sudo dd if=/dev/zero of=/dev/sdb bs=4M status=progress

# Gerar arquivo de teste de 1GB
dd if=/dev/zero of=teste_1gb.bin bs=1M count=1024 status=progress`}),e.jsx("h2",{children:"9. Swap"}),e.jsx("p",{children:"O swap é um espaço em disco usado como extensão da RAM. Quando a memória RAM está cheia, o sistema move dados menos usados para o swap."}),e.jsx("h3",{children:"Swap como partição"}),e.jsx(o,{code:`# Criar partição swap (após particionar com fdisk/cfdisk)
sudo mkswap /dev/sda3

# Ativar swap
sudo swapon /dev/sda3

# Adicionar ao fstab para montagem automática
# UUID=xxxx  none  swap  defaults  0  0

# Ver swap ativo
swapon --show

# Desativar swap
sudo swapoff /dev/sda3`}),e.jsx("h3",{children:"Swap como arquivo (alternativa)"}),e.jsx(o,{code:`# Criar arquivo de swap de 4GB
sudo dd if=/dev/zero of=/swapfile bs=1M count=4096 status=progress

# Definir permissões corretas
sudo chmod 600 /swapfile

# Formatar como swap
sudo mkswap /swapfile

# Ativar
sudo swapon /swapfile

# Adicionar ao fstab
# /swapfile  none  swap  defaults  0  0

# Verificar
free -h
swapon --show`}),e.jsx("h3",{children:"Swappiness"}),e.jsx(o,{code:`# Ver valor atual de swappiness (0-100, padrão: 60)
cat /proc/sys/vm/swappiness

# Mudar temporariamente (volta ao padrão após reiniciar)
sudo sysctl vm.swappiness=10

# Mudar permanentemente
echo "vm.swappiness=10" | sudo tee /etc/sysctl.d/99-swappiness.conf

# Valores recomendados:
# 10-20  para desktops com bastante RAM
# 60     padrão (bom equilíbrio)
# 100    usa swap agressivamente`}),e.jsx("h2",{children:"10. Verificação de Sistemas de Arquivos"}),e.jsx(o,{code:`# Verificar sistema de arquivos ext4 (a partição NÃO pode estar montada)
sudo fsck.ext4 /dev/sda2

# Verificar e corrigir automaticamente
sudo fsck.ext4 -y /dev/sda2

# Verificar Btrfs (pode ser feito com a partição montada)
sudo btrfs check /dev/sda2

# Ver informações do sistema de arquivos ext4
sudo tune2fs -l /dev/sda2`}),e.jsxs(s,{type:"danger",title:"Nunca rode fsck em partição montada!",children:["Executar ",e.jsx("code",{children:"fsck"})," em uma partição montada pode causar corrupção de dados. Desmonte a partição primeiro ou faça a verificação a partir de um live USB."]}),e.jsx("h2",{children:"11. O que NÃO fazer"}),e.jsx(s,{type:"danger",title:"Erros fatais com discos",children:e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"dd of=/dev/sda"})," quando queria ",e.jsx("code",{children:"/dev/sdb"})," — sobrescreve o sistema inteiro"]}),e.jsxs("li",{children:["Formatar a partição errada — sempre confirme com ",e.jsx("code",{children:"lsblk"})]}),e.jsx("li",{children:"Editar o fstab com UUID errado — sistema não inicia"}),e.jsxs("li",{children:["Rodar ",e.jsx("code",{children:"fsck"})," em partição montada — corrupção de dados"]}),e.jsxs("li",{children:["Não usar ",e.jsx("code",{children:"nofail"})," no fstab para discos externos"]}),e.jsxs("li",{children:["Criar swap sem ",e.jsx("code",{children:"chmod 600"})," — risco de segurança"]})]})}),e.jsx("h2",{children:"12. Referências"}),e.jsxs("ul",{children:[e.jsx("li",{children:e.jsx("a",{href:"https://wiki.archlinux.org/title/File_systems",target:"_blank",rel:"noopener noreferrer",children:"ArchWiki - File Systems"})}),e.jsx("li",{children:e.jsx("a",{href:"https://wiki.archlinux.org/title/Partitioning",target:"_blank",rel:"noopener noreferrer",children:"ArchWiki - Partitioning"})}),e.jsx("li",{children:e.jsx("a",{href:"https://wiki.archlinux.org/title/Fstab",target:"_blank",rel:"noopener noreferrer",children:"ArchWiki - fstab"})}),e.jsx("li",{children:e.jsx("a",{href:"https://wiki.archlinux.org/title/Swap",target:"_blank",rel:"noopener noreferrer",children:"ArchWiki - Swap"})}),e.jsxs("li",{children:[e.jsx("code",{children:"man lsblk"}),", ",e.jsx("code",{children:"man fdisk"}),", ",e.jsx("code",{children:"man mount"}),", ",e.jsx("code",{children:"man fstab"})]})]})]})}export{p as default};
