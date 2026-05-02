import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function LUKS() {
  return (
    <PageContainer
      title="LUKS — Criptografia de Disco"
      subtitle="cryptsetup, /etc/crypttab, root encriptada com mkinitcpio. Tudo o que você precisa para um Arch totalmente criptografado, com saída real do cryptsetup luksDump."
      difficulty="avancado"
      timeToRead="40 min"
      category="Storage"
    >
      <p>
        <strong>LUKS</strong> (Linux Unified Key Setup) é o padrão de criptografia full-disk
        do Linux. O kernel usa <code>dm-crypt</code> para mapear o device cifrado em um
        device "limpo" em <code>/dev/mapper/</code> que você formata e usa normalmente.
        Tudo é AES-XTS-256 por default, com chaves derivadas via Argon2id (LUKS2).
      </p>

      <AlertBox type="danger" title="luksFormat APAGA TUDO">
        <code>cryptsetup luksFormat</code> sobrescreve o início da partição com um cabeçalho
        LUKS — é destrutivo. Faça backup, e durante a instalação confirme TRÊS vezes o
        device alvo. Se você perder a senha E a chave de recuperação, os dados são
        criptograficamente irrecuperáveis.
      </AlertBox>

      <h2>1. Instalando o cryptsetup</h2>

      <TerminalBlock command="sudo pacman -S cryptsetup" output={`Packages (1)  cryptsetup-2.7.5-1\n:: Proceed with installation? [Y/n]`} />

      <p>
        Em uma instalação fresca de Arch (ISO live), o <code>cryptsetup</code> já está
        presente. Se você for criptografar a raiz, precisará também do hook{" "}
        <code>encrypt</code> em <code>mkinitcpio</code> (já vem por padrão no
        <code>linux-firmware</code>).
      </p>

      <h2>2. Criando uma partição LUKS</h2>

      <TerminalBlock
        comment="1) confirme o device — vamos cifrar /dev/sdb1 (HD externo)"
        command="lsblk /dev/sdb"
        output={`NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sdb      8:16   0   1.8T  0 disk
└─sdb1   8:17   0   1.8T  0 part`}
      />

      <TerminalBlock
        comment="2) luksFormat — vai pedir 'YES' (em maiúsculas) e a senha"
        command="sudo cryptsetup luksFormat /dev/sdb1"
        output={`WARNING!
========
This will overwrite data on /dev/sdb1 irrevocably.

Are you sure? (Type 'yes' in capital letters): YES
Enter passphrase for /dev/sdb1: ********
Verify passphrase: ********

Key slot 0 created.
Command successful.`}
      />

      <TerminalBlock
        comment="3) abre o container — pede a senha e cria /dev/mapper/backup"
        command="sudo cryptsetup open /dev/sdb1 backup"
        output={`Enter passphrase for /dev/sdb1: ********`}
      />

      <TerminalBlock
        command="ls -l /dev/mapper/"
        output={`total 0
crw------- 1 root root 10, 236 Mar 26 14:10 control
lrwxrwxrwx 1 root root       7 Mar 26 14:10 backup -> ../dm-0`}
      />

      <TerminalBlock
        comment="4) formata e monta o device CLARO"
        command="sudo mkfs.ext4 -L backup /dev/mapper/backup"
        output={`mke2fs 1.47.0 (5-Feb-2023)
Creating filesystem with 488373760 4k blocks and 122093568 inodes
Filesystem UUID: 9876aaaa-bbbb-cccc-dddd-eeeeffff0001
Allocating group tables: done
Writing inode tables: done
Creating journal (262144 blocks): done
Writing superblocks and filesystem accounting information: done`}
      />

      <TerminalBlock command="sudo mount /dev/mapper/backup /mnt/backup" output="" />

      <TerminalBlock
        command="lsblk /dev/sdb"
        output={`NAME          MAJ:MIN RM   SIZE RO TYPE  MOUNTPOINTS
sdb             8:16   0   1.8T  0 disk
└─sdb1          8:17   0   1.8T  0 part
  └─backup    254:0    0   1.8T  0 crypt /mnt/backup`}
      />

      <h2>3. Inspecionando o cabeçalho — luksDump</h2>

      <TerminalBlock
        command="sudo cryptsetup luksDump /dev/sdb1"
        output={`LUKS header information
Version:        2
Epoch:          3
Metadata area:  16384 [bytes]
Keyslots area:  16744448 [bytes]
UUID:           5e7f8a9b-1234-4567-89ab-cdef01234567
Label:          (no label)
Subsystem:      (no subsystem)
Flags:          (no flags)

Data segments:
  0: crypt
        offset: 16777216 [bytes]
        length: (whole device)
        cipher: aes-xts-plain64
        sector: 512 [bytes]

Keyslots:
  0: luks2
        Key:        512 bits
        Priority:   normal
        Cipher:     aes-xts-plain64
        Cipher key: 512 bits
        PBKDF:      argon2id
        Time cost:  7
        Memory:     1048576
        Threads:    4
        Salt:       e1 02 ... (omitted)
        AF stripes: 4000
        AF hash:    sha256
        Area offset:32768 [bytes]
        Area length:258048 [bytes]
        Digest ID:  0
Tokens:
Digest:
  0: pbkdf2
        Hash:       sha256
        Iterations: 219879
        Salt:       7c a4 ... (omitted)
        Digest:     45 91 ... (omitted)`}
      />

      <h2>4. cryptsetup — o cheat sheet</h2>

      <CommandFlagList
        command="cryptsetup"
        items={[
          { flag: "luksFormat DEV", description: "Inicializa um container LUKS no device (DESTRUTIVO).", example: "sudo cryptsetup luksFormat /dev/sdb1" },
          { flag: "open DEV NOME", description: "Desbloqueia, criando /dev/mapper/NOME.", example: "sudo cryptsetup open /dev/sdb1 backup" },
          { flag: "close NOME", description: "Fecha o mapeamento (apenas se desmontado).", example: "sudo cryptsetup close backup" },
          { flag: "luksDump DEV", description: "Mostra metadata do header." },
          { flag: "luksAddKey DEV [KEY-FILE]", description: "Adiciona uma nova senha/chave em outro slot (até 8 slots LUKS1, 32 LUKS2).", example: "sudo cryptsetup luksAddKey /dev/sdb1" },
          { flag: "luksRemoveKey DEV", description: "Remove uma senha (pede a própria senha)." },
          { flag: "luksKillSlot DEV N", description: "Mata o slot N (sem precisar da senha — só de outra)." },
          { flag: "luksHeaderBackup DEV --header-backup-file F", description: "Salva backup do header (faça SEMPRE!)." },
          { flag: "luksHeaderRestore", description: "Restaura header (recuperação após corrupção)." },
          { flag: "luksChangeKey DEV", description: "Troca a senha do slot atual." },
          { flag: "status NOME", description: "Mostra cipher, tamanho, mode do mapeamento ativo." },
          { flag: "benchmark", description: "Mede velocidade de cada cipher na sua CPU (escolha o melhor)." },
        ]}
      />

      <h2>5. Backup e restauração do header</h2>

      <p>
        Se os primeiros 16 MiB do disco forem corrompidos (write acidental, badblock,
        firmware), <strong>ninguém</strong> consegue mais abrir o LUKS — nem você. Sempre
        guarde o header em outro lugar:
      </p>

      <TerminalBlock
        command={`sudo cryptsetup luksHeaderBackup /dev/sdb1 --header-backup-file ~/sdb1.luks-header.bin`}
        output={`(arquivo binário criado, ~16MB)`}
      />

      <TerminalBlock
        comment="se o pior acontecer:"
        command={`sudo cryptsetup luksHeaderRestore /dev/sdb1 --header-backup-file ~/sdb1.luks-header.bin`}
        output={`WARNING!
========
Device /dev/sdb1 already contains LUKS2 header. Replacing header will destroy
existing keyslots.

Are you sure? (Type 'yes' in capital letters): YES`}
      />

      <h2>6. Múltiplas senhas (key slots)</h2>

      <TerminalBlock
        comment="adicionar uma segunda senha (slot 1)"
        command="sudo cryptsetup luksAddKey /dev/sdb1"
        output={`Enter any existing passphrase: ********    (uma das atuais)
Enter new passphrase for key slot: ********
Verify passphrase: ********`}
      />

      <TerminalBlock
        comment="conferir os slots ocupados"
        command={`sudo cryptsetup luksDump /dev/sdb1 | grep -E "^Key|Keyslots:"`}
        output={`Keyslots:
  0: luks2
  1: luks2`}
      />

      <h2>7. Auto-desbloqueio com /etc/crypttab</h2>

      <p>
        Para desbloquear partições secundárias no boot sem digitar senha (ou com), use
        <code> /etc/crypttab</code>. Cada linha:
        <strong> nome  device  chave  opções</strong>.
      </p>

      <CodeBlock
        title="/etc/crypttab"
        code={`# nome      device                                            chave/senha          opções
backup     UUID=5e7f8a9b-1234-4567-89ab-cdef01234567        /etc/luks-keys/backup  luks,nofail,timeout=10
secrets    UUID=ffff1111-2222-3333-4444-555566667777        none                   luks,timeout=30
swap-encr  UUID=aaaa1111-2222-3333-4444-555566660000        /dev/urandom           swap,cipher=aes-xts-plain64,size=512`}
      />

      <p>
        Em <code>none</code>, o systemd pede a senha no boot. Para usar arquivo de chave:
      </p>

      <TerminalBlock
        comment="1) gerar arquivo de chave aleatório"
        command="sudo dd if=/dev/urandom of=/etc/luks-keys/backup bs=512 count=4"
        output={`4+0 records in
4+0 records out
2048 bytes (2.0 kB, 2.0 KiB) copied, 0.000218 s, 9.4 MB/s`}
      />
      <TerminalBlock command="sudo chmod 0400 /etc/luks-keys/backup" output="" />

      <TerminalBlock
        comment="2) registrar a chave em um slot LUKS"
        command="sudo cryptsetup luksAddKey /dev/sdb1 /etc/luks-keys/backup"
        output="Enter any existing passphrase: ********"
      />

      <TerminalBlock
        comment="3) adicione no /etc/fstab a entrada para /dev/mapper/backup"
        command="cat /etc/fstab | grep backup"
        output="/dev/mapper/backup  /mnt/backup  ext4  defaults,nofail  0  2"
      />

      <h2>8. Root totalmente criptografado (instalação Arch)</h2>

      <p>
        O fluxo clássico de Arch com root LUKS+ext4 (ou btrfs):
      </p>

      <TerminalBlock
        comment="1) particionar (de dentro do live ISO)"
        command="sudo cfdisk /dev/nvme0n1"
        output="(criar /dev/nvme0n1p1 EFI 512M e /dev/nvme0n1p2 Linux do resto)"
      />

      <TerminalBlock command="sudo cryptsetup luksFormat /dev/nvme0n1p2" output={`...\nKey slot 0 created.`} />
      <TerminalBlock command="sudo cryptsetup open /dev/nvme0n1p2 cryptroot" output="" />

      <TerminalBlock command="sudo mkfs.ext4 /dev/mapper/cryptroot" output="" />
      <TerminalBlock command="sudo mkfs.fat -F32 /dev/nvme0n1p1" output="" />

      <TerminalBlock command="sudo mount /dev/mapper/cryptroot /mnt && sudo mount --mkdir /dev/nvme0n1p1 /mnt/boot" output="" />
      <TerminalBlock command="sudo pacstrap -K /mnt base linux linux-firmware vim" output="(... pacotes baixados ...)" />
      <TerminalBlock command="sudo genfstab -U /mnt >> /mnt/etc/fstab" output="" />
      <TerminalBlock command="sudo arch-chroot /mnt" output="" />

      <h3>8.1. Editar mkinitcpio.conf — adicionar o hook encrypt</h3>

      <CodeBlock
        title="/etc/mkinitcpio.conf (apenas a linha HOOKS)"
        code={`# ANTES:
HOOKS=(base udev autodetect microcode modconf kms keyboard keymap consolefont block filesystems fsck)

# DEPOIS — encrypt PRECISA vir antes de filesystems:
HOOKS=(base udev autodetect microcode modconf kms keyboard keymap consolefont block encrypt filesystems fsck)`}
      />

      <TerminalBlock command="mkinitcpio -P" output={`==> Building image from preset: /etc/mkinitcpio.d/linux.preset: 'default'
==> Starting build: '6.12.1-arch1-1'
  -> Running build hook: [base]
  -> Running build hook: [udev]
  -> Running build hook: [autodetect]
  -> Running build hook: [microcode]
  -> Running build hook: [modconf]
  -> Running build hook: [kms]
  -> Running build hook: [keyboard]
  -> Running build hook: [keymap]
  -> Running build hook: [consolefont]
  -> Running build hook: [block]
  -> Running build hook: [encrypt]
  -> Running build hook: [filesystems]
  -> Running build hook: [fsck]
==> Generating module dependencies
==> Creating zstd-compressed initcpio image: '/boot/initramfs-linux.img'
==> Image generation successful`} />

      <h3>8.2. Configurar GRUB ou systemd-boot</h3>

      <p>
        Você precisa dizer ao kernel qual device descriptografar e onde montá-lo.
        O parâmetro é <code>cryptdevice=UUID=&lt;uuid-do-LUKS&gt;:cryptroot</code>{" "}
        e <code>root=/dev/mapper/cryptroot</code>.
      </p>

      <CodeBlock
        title="/etc/default/grub (com GRUB)"
        code={`GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 quiet cryptdevice=UUID=5e7f8a9b-...-1234:cryptroot root=/dev/mapper/cryptroot"`}
      />
      <TerminalBlock command="grub-mkconfig -o /boot/grub/grub.cfg" output="Generating grub configuration file ...\ndone" />

      <CodeBlock
        title="/boot/loader/entries/arch.conf (com systemd-boot)"
        code={`title   Arch Linux
linux   /vmlinuz-linux
initrd  /initramfs-linux.img
options cryptdevice=UUID=5e7f8a9b-...-1234:cryptroot root=/dev/mapper/cryptroot rw`}
      />

      <AlertBox type="info" title="Boot pedirá a senha LUKS">
        Ao reiniciar, antes do systemd subir você verá:
        <code>Enter passphrase for /dev/nvme0n1p2 (cryptroot):</code>. Digite a senha;
        o initramfs abre o container e passa o controle para o sistema.
      </AlertBox>

      <h2>9. Trocar / remover senha</h2>

      <TerminalBlock
        comment="trocar senha do slot atual"
        command="sudo cryptsetup luksChangeKey /dev/sdb1"
        output={`Enter passphrase to be changed: ********
Enter new passphrase: ********
Verify passphrase: ********`}
      />

      <TerminalBlock
        comment="remover slot 1 (precisa de outra senha de outro slot)"
        command="sudo cryptsetup luksKillSlot /dev/sdb1 1"
        output={`Enter any remaining passphrase: ********
Keyslot 1 is selected for deletion.
Are you sure? (Type 'yes' in capital letters): YES`}
      />

      <h2>10. Performance — escolha do cipher</h2>

      <TerminalBlock
        command="cryptsetup benchmark"
        output={`# Tests are approximate using memory only (no storage IO).
PBKDF2-sha256       2412385 iterations per second for 256-bit key
PBKDF2-sha512       1283412 iterations per second for 256-bit key
argon2i             7 iterations, 1048576 memory, 4 parallel threads (CPUs) for 256-bit key (requested 2000 ms time)
argon2id            7 iterations, 1048576 memory, 4 parallel threads (CPUs) for 256-bit key (requested 2000 ms time)
#     Algorithm |       Key |      Encryption |      Decryption
        aes-cbc        128b      1421.3 MiB/s      4623.7 MiB/s
        aes-cbc        256b      1078.4 MiB/s      3617.2 MiB/s
        aes-xts        256b      4112.8 MiB/s      4126.1 MiB/s
        aes-xts        512b      3408.2 MiB/s      3416.7 MiB/s
   chacha20-poly1305   256b      1832.4 MiB/s      1832.7 MiB/s`}
      />

      <p>
        O default <code>aes-xts-plain64 256b</code> está perto do topo em qualquer CPU
        moderna com AES-NI. Desabilite o cifrado só se a CPU não tiver AES-NI
        (verifique com <code>grep -m1 -o 'aes' /proc/cpuinfo</code>).
      </p>

      <h2>11. Cola final</h2>

      <OutputBlock
        title="ciclo de vida"
        output={`# criar
sudo cryptsetup luksFormat /dev/sdb1
sudo cryptsetup open /dev/sdb1 backup
sudo mkfs.ext4 /dev/mapper/backup
sudo mount /dev/mapper/backup /mnt/backup

# usar (já existe)
sudo cryptsetup open /dev/sdb1 backup
sudo mount /dev/mapper/backup /mnt/backup
sudo umount /mnt/backup
sudo cryptsetup close backup

# manutenção
sudo cryptsetup luksDump /dev/sdb1
sudo cryptsetup luksAddKey /dev/sdb1
sudo cryptsetup luksHeaderBackup /dev/sdb1 --header-backup-file h.bin`}
      />
    </PageContainer>
  );
}
