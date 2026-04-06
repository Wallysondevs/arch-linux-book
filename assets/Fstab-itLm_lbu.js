import{j as e}from"./ui-K-J8Jkwj.js";import{P as a}from"./PageContainer-tnnsMrcC.js";import{C as s}from"./CodeBlock-DEDRw1y6.js";import{A as o}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function u(){return e.jsxs(a,{title:"fstab: Montagem de Sistemas de Arquivos",subtitle:"Entenda o /etc/fstab, como configurar montagens automáticas, opções de performance e segurança para cada partição.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"O que é o fstab?"}),e.jsxs("p",{children:["O arquivo ",e.jsx("code",{children:"/etc/fstab"})," (File System Table) define como os sistemas de arquivos devem ser montados automaticamente durante o boot. Cada linha especifica um dispositivo, ponto de montagem, tipo de filesystem, opções de montagem e configurações de backup/verificação."]}),e.jsx(s,{title:"Ver o fstab atual",code:"cat /etc/fstab"}),e.jsx("h2",{children:"Estrutura do fstab"}),e.jsx("p",{children:"Cada linha segue este formato:"}),e.jsx(s,{title:"Formato de uma entrada do fstab",code:`# <dispositivo>    <ponto_montagem>    <tipo>    <opções>    <dump>    <pass>

# Exemplos:
UUID=abc123-def456   /           ext4    defaults,noatime       0 1
UUID=789ghi-012jkl   /home       ext4    defaults,noatime       0 2
UUID=mno345-pqr678   /boot/efi   vfat    defaults,umask=0077    0 2
UUID=stu901-vwx234   none        swap    defaults               0 0`}),e.jsx("h3",{children:"Explicação dos Campos"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Dispositivo"})," — O dispositivo ou UUID. Prefira sempre UUID para evitar problemas com mudanças na ordem dos discos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Ponto de montagem"})," — Onde o filesystem será montado (ex: ",e.jsx("code",{children:"/"}),", ",e.jsx("code",{children:"/home"}),", ",e.jsx("code",{children:"/mnt/dados"}),")."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Tipo"})," — O tipo do filesystem (",e.jsx("code",{children:"ext4"}),", ",e.jsx("code",{children:"btrfs"}),", ",e.jsx("code",{children:"vfat"}),", ",e.jsx("code",{children:"ntfs"}),", ",e.jsx("code",{children:"swap"}),", etc.)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Opções"})," — Opções de montagem separadas por vírgula."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Dump"})," — Usado pelo utilitário dump (0 = não fazer backup, quase sempre 0)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Pass"})," — Ordem de verificação do fsck (0 = não verificar, 1 = root, 2 = outros)."]})]}),e.jsx("h2",{children:"Identificando Dispositivos"}),e.jsx(s,{title:"Descobrir UUID dos discos e partições",code:`# Listar todos os UUIDs
sudo blkid

# Formato mais limpo
lsblk -f

# Apenas UUID de uma partição específica
sudo blkid /dev/sda2 -s UUID -o value`}),e.jsxs(o,{type:"warning",title:"Sempre use UUID",children:["Nunca use ",e.jsx("code",{children:"/dev/sda1"})," diretamente no fstab. Os nomes dos dispositivos podem mudar entre boots (especialmente com USBs ou discos externos). O UUID é único e permanente."]}),e.jsx("h2",{children:"Opções de Montagem Importantes"}),e.jsx(s,{title:"Opções de montagem comuns",code:`# defaults — equivale a: rw,suid,dev,exec,auto,nouser,async
# noatime  — não atualizar o tempo de acesso (melhora performance SSD)
# relatime — atualizar atime apenas se mtime/ctime mudou (padrão moderno)
# noexec   — impedir execução de binários nesta partição
# nosuid   — ignorar bits SUID/SGID (segurança)
# nodev    — não interpretar dispositivos de bloco/caractere
# ro       — montar como somente leitura
# rw       — montar como leitura/escrita
# discard  — habilitar TRIM para SSDs (ou use fstrim.timer)
# compress=zstd — compressão em Btrfs
# subvol=@ — montar subvolume específico do Btrfs`}),e.jsx("h3",{children:"Exemplos Práticos por Cenário"}),e.jsx(s,{title:"fstab otimizado para SSD com ext4",code:`# Root
UUID=abc123   /        ext4   defaults,noatime,discard   0 1

# Home
UUID=def456   /home    ext4   defaults,noatime,discard   0 2

# EFI
UUID=ghi789   /boot/efi  vfat  defaults,umask=0077       0 2

# Swap
UUID=jkl012   none     swap   defaults                   0 0`}),e.jsx(s,{title:"fstab com Btrfs e subvolumes",code:`# Root subvolume
UUID=abc123   /        btrfs  defaults,noatime,compress=zstd,subvol=@        0 0

# Home subvolume
UUID=abc123   /home    btrfs  defaults,noatime,compress=zstd,subvol=@home    0 0

# Snapshots subvolume
UUID=abc123   /.snapshots  btrfs  defaults,noatime,compress=zstd,subvol=@snapshots  0 0

# Log subvolume (evitar snapshots de logs)
UUID=abc123   /var/log     btrfs  defaults,noatime,compress=zstd,subvol=@log        0 0`}),e.jsxs(o,{type:"info",title:"Btrfs e fsck",children:["Para Btrfs, o campo pass (último) deve ser ",e.jsx("code",{children:"0"}),", pois o Btrfs faz sua própria verificação de integridade. Usar fsck em Btrfs pode causar problemas."]}),e.jsx("h2",{children:"Montando Partições NTFS (Windows)"}),e.jsx(s,{title:"Montar partição Windows automaticamente",code:`# Instalar suporte NTFS
sudo pacman -S ntfs-3g

# Adicionar ao fstab (somente leitura por segurança)
UUID=XXXX-XXXX  /mnt/windows  ntfs-3g  defaults,ro,uid=1000,gid=1000  0 0

# Ou com leitura/escrita
UUID=XXXX-XXXX  /mnt/windows  ntfs-3g  defaults,rw,uid=1000,gid=1000,dmask=022,fmask=133  0 0`}),e.jsx("h2",{children:"Montando Compartilhamentos de Rede"}),e.jsx(s,{title:"Montar NFS no fstab",code:`# NFS
servidor:/dados  /mnt/nfs  nfs  defaults,_netdev,noauto,x-systemd.automount  0 0`}),e.jsx(s,{title:"Montar Samba/CIFS no fstab",code:`# Samba/CIFS — usando arquivo de credenciais
//servidor/share  /mnt/samba  cifs  credentials=/etc/samba/credentials,uid=1000,gid=1000,_netdev  0 0

# Criar arquivo de credenciais
# /etc/samba/credentials:
# username=seu_usuario
# password=sua_senha
# domain=WORKGROUP

# Proteger o arquivo de credenciais
sudo chmod 600 /etc/samba/credentials`}),e.jsx("h2",{children:"Swap File no fstab"}),e.jsx(s,{title:"Configurar swap file no fstab",code:`# Criar swap file de 8GB
sudo dd if=/dev/zero of=/swapfile bs=1M count=8192 status=progress
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Adicionar ao fstab
/swapfile  none  swap  defaults  0 0`}),e.jsx("h2",{children:"tmpfs — Filesystem na RAM"}),e.jsx(s,{title:"Configurar tmpfs para diretórios temporários",code:`# /tmp na RAM (limpa automaticamente a cada reboot)
tmpfs  /tmp  tmpfs  defaults,noatime,mode=1777,size=4G  0 0

# Cache do navegador na RAM (mais rápido + preserva SSD)
tmpfs  /home/usuario/.cache  tmpfs  defaults,noatime,size=2G  0 0`}),e.jsx("h2",{children:"Testando o fstab"}),e.jsx(s,{title:"Verificar e testar o fstab antes de reiniciar",code:`# Verificar erros de sintaxe
sudo findmnt --verify

# Montar tudo que está no fstab sem reiniciar
sudo mount -a

# Se não deu erro, o fstab está correto!

# Ver montagens ativas
findmnt

# Ver em formato tabela
lsblk -f`}),e.jsxs(o,{type:"danger",title:"Sempre teste antes de reiniciar!",children:["Um erro no fstab pode impedir o sistema de inicializar. Sempre rode ",e.jsx("code",{children:"sudo mount -a"}),"e ",e.jsx("code",{children:"sudo findmnt --verify"})," antes de reiniciar. Se o sistema não bootar, use um Live USB para editar o fstab e corrigir o erro."]}),e.jsx("h2",{children:"Gerar fstab Automaticamente"}),e.jsx(s,{title:"Gerar fstab com genfstab (durante instalação)",code:`# Durante a instalação do Arch, após montar tudo:
genfstab -U /mnt >> /mnt/etc/fstab

# -U usa UUID (recomendado)
# -L usa LABEL (alternativa)

# Sempre revise o resultado:
cat /mnt/etc/fstab`})]})}export{u as default};
