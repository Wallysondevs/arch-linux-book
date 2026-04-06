import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Fstab() {
  return (
    <PageContainer
      title="fstab: Montagem de Sistemas de Arquivos"
      subtitle="Entenda o /etc/fstab, como configurar montagens automáticas, opções de performance e segurança para cada partição."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <h2>O que é o fstab?</h2>
      <p>
        O arquivo <code>/etc/fstab</code> (File System Table) define como os sistemas de arquivos devem ser montados
        automaticamente durante o boot. Cada linha especifica um dispositivo, ponto de montagem, tipo de filesystem,
        opções de montagem e configurações de backup/verificação.
      </p>

      <CodeBlock
        title="Ver o fstab atual"
        code="cat /etc/fstab"
      />

      <h2>Estrutura do fstab</h2>
      <p>Cada linha segue este formato:</p>

      <CodeBlock
        title="Formato de uma entrada do fstab"
        code={`# <dispositivo>    <ponto_montagem>    <tipo>    <opções>    <dump>    <pass>

# Exemplos:
UUID=abc123-def456   /           ext4    defaults,noatime       0 1
UUID=789ghi-012jkl   /home       ext4    defaults,noatime       0 2
UUID=mno345-pqr678   /boot/efi   vfat    defaults,umask=0077    0 2
UUID=stu901-vwx234   none        swap    defaults               0 0`}
      />

      <h3>Explicação dos Campos</h3>
      <ul>
        <li><strong>Dispositivo</strong> — O dispositivo ou UUID. Prefira sempre UUID para evitar problemas com mudanças na ordem dos discos.</li>
        <li><strong>Ponto de montagem</strong> — Onde o filesystem será montado (ex: <code>/</code>, <code>/home</code>, <code>/mnt/dados</code>).</li>
        <li><strong>Tipo</strong> — O tipo do filesystem (<code>ext4</code>, <code>btrfs</code>, <code>vfat</code>, <code>ntfs</code>, <code>swap</code>, etc.).</li>
        <li><strong>Opções</strong> — Opções de montagem separadas por vírgula.</li>
        <li><strong>Dump</strong> — Usado pelo utilitário dump (0 = não fazer backup, quase sempre 0).</li>
        <li><strong>Pass</strong> — Ordem de verificação do fsck (0 = não verificar, 1 = root, 2 = outros).</li>
      </ul>

      <h2>Identificando Dispositivos</h2>

      <CodeBlock
        title="Descobrir UUID dos discos e partições"
        code={`# Listar todos os UUIDs
sudo blkid

# Formato mais limpo
lsblk -f

# Apenas UUID de uma partição específica
sudo blkid /dev/sda2 -s UUID -o value`}
      />

      <AlertBox type="warning" title="Sempre use UUID">
        Nunca use <code>/dev/sda1</code> diretamente no fstab. Os nomes dos dispositivos podem mudar entre boots
        (especialmente com USBs ou discos externos). O UUID é único e permanente.
      </AlertBox>

      <h2>Opções de Montagem Importantes</h2>

      <CodeBlock
        title="Opções de montagem comuns"
        code={`# defaults — equivale a: rw,suid,dev,exec,auto,nouser,async
# noatime  — não atualizar o tempo de acesso (melhora performance SSD)
# relatime — atualizar atime apenas se mtime/ctime mudou (padrão moderno)
# noexec   — impedir execução de binários nesta partição
# nosuid   — ignorar bits SUID/SGID (segurança)
# nodev    — não interpretar dispositivos de bloco/caractere
# ro       — montar como somente leitura
# rw       — montar como leitura/escrita
# discard  — habilitar TRIM para SSDs (ou use fstrim.timer)
# compress=zstd — compressão em Btrfs
# subvol=@ — montar subvolume específico do Btrfs`}
      />

      <h3>Exemplos Práticos por Cenário</h3>

      <CodeBlock
        title="fstab otimizado para SSD com ext4"
        code={`# Root
UUID=abc123   /        ext4   defaults,noatime,discard   0 1

# Home
UUID=def456   /home    ext4   defaults,noatime,discard   0 2

# EFI
UUID=ghi789   /boot/efi  vfat  defaults,umask=0077       0 2

# Swap
UUID=jkl012   none     swap   defaults                   0 0`}
      />

      <CodeBlock
        title="fstab com Btrfs e subvolumes"
        code={`# Root subvolume
UUID=abc123   /        btrfs  defaults,noatime,compress=zstd,subvol=@        0 0

# Home subvolume
UUID=abc123   /home    btrfs  defaults,noatime,compress=zstd,subvol=@home    0 0

# Snapshots subvolume
UUID=abc123   /.snapshots  btrfs  defaults,noatime,compress=zstd,subvol=@snapshots  0 0

# Log subvolume (evitar snapshots de logs)
UUID=abc123   /var/log     btrfs  defaults,noatime,compress=zstd,subvol=@log        0 0`}
      />

      <AlertBox type="info" title="Btrfs e fsck">
        Para Btrfs, o campo pass (último) deve ser <code>0</code>, pois o Btrfs faz sua própria verificação
        de integridade. Usar fsck em Btrfs pode causar problemas.
      </AlertBox>

      <h2>Montando Partições NTFS (Windows)</h2>

      <CodeBlock
        title="Montar partição Windows automaticamente"
        code={`# Instalar suporte NTFS
sudo pacman -S ntfs-3g

# Adicionar ao fstab (somente leitura por segurança)
UUID=XXXX-XXXX  /mnt/windows  ntfs-3g  defaults,ro,uid=1000,gid=1000  0 0

# Ou com leitura/escrita
UUID=XXXX-XXXX  /mnt/windows  ntfs-3g  defaults,rw,uid=1000,gid=1000,dmask=022,fmask=133  0 0`}
      />

      <h2>Montando Compartilhamentos de Rede</h2>

      <CodeBlock
        title="Montar NFS no fstab"
        code={`# NFS
servidor:/dados  /mnt/nfs  nfs  defaults,_netdev,noauto,x-systemd.automount  0 0`}
      />

      <CodeBlock
        title="Montar Samba/CIFS no fstab"
        code={`# Samba/CIFS — usando arquivo de credenciais
//servidor/share  /mnt/samba  cifs  credentials=/etc/samba/credentials,uid=1000,gid=1000,_netdev  0 0

# Criar arquivo de credenciais
# /etc/samba/credentials:
# username=seu_usuario
# password=sua_senha
# domain=WORKGROUP

# Proteger o arquivo de credenciais
sudo chmod 600 /etc/samba/credentials`}
      />

      <h2>Swap File no fstab</h2>

      <CodeBlock
        title="Configurar swap file no fstab"
        code={`# Criar swap file de 8GB
sudo dd if=/dev/zero of=/swapfile bs=1M count=8192 status=progress
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Adicionar ao fstab
/swapfile  none  swap  defaults  0 0`}
      />

      <h2>tmpfs — Filesystem na RAM</h2>

      <CodeBlock
        title="Configurar tmpfs para diretórios temporários"
        code={`# /tmp na RAM (limpa automaticamente a cada reboot)
tmpfs  /tmp  tmpfs  defaults,noatime,mode=1777,size=4G  0 0

# Cache do navegador na RAM (mais rápido + preserva SSD)
tmpfs  /home/usuario/.cache  tmpfs  defaults,noatime,size=2G  0 0`}
      />

      <h2>Testando o fstab</h2>

      <CodeBlock
        title="Verificar e testar o fstab antes de reiniciar"
        code={`# Verificar erros de sintaxe
sudo findmnt --verify

# Montar tudo que está no fstab sem reiniciar
sudo mount -a

# Se não deu erro, o fstab está correto!

# Ver montagens ativas
findmnt

# Ver em formato tabela
lsblk -f`}
      />

      <AlertBox type="danger" title="Sempre teste antes de reiniciar!">
        Um erro no fstab pode impedir o sistema de inicializar. Sempre rode <code>sudo mount -a</code> 
        e <code>sudo findmnt --verify</code> antes de reiniciar. Se o sistema não bootar, use um Live USB 
        para editar o fstab e corrigir o erro.
      </AlertBox>

      <h2>Gerar fstab Automaticamente</h2>

      <CodeBlock
        title="Gerar fstab com genfstab (durante instalação)"
        code={`# Durante a instalação do Arch, após montar tudo:
genfstab -U /mnt >> /mnt/etc/fstab

# -U usa UUID (recomendado)
# -L usa LABEL (alternativa)

# Sempre revise o resultado:
cat /mnt/etc/fstab`}
      />
    </PageContainer>
  );
}
