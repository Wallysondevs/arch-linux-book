import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function GPG() {
  return (
    <PageContainer
      title="GPG — chaves, assinatura e criptografia"
      subtitle="GnuPG: gerar par de chaves, assinar/criptografar arquivos, exportar/importar e a integração com pacman keyring no Arch."
      difficulty="intermediario"
      timeToRead="35 min"
      category="Segurança"
    >
      <p>
        O <code>gpg</code> (GNU Privacy Guard) é a implementação livre do padrão OpenPGP. No Arch ele
        já vem instalado (parte do <code>base</code>) e é usado pelo próprio <code>pacman</code> para
        verificar assinaturas de pacotes. Para o usuário ele serve para: assinar arquivos/commits,
        criptografar emails e backups, autenticar via SSH e validar releases de software.
      </p>

      <h2>1. Confirmar instalação</h2>

      <TerminalBlock
        command="gpg --version | head -3"
        output={`gpg (GnuPG) 2.4.5
libgcrypt 1.10.3
Copyright (C) 2024 g10 Code GmbH`}
      />

      <TerminalBlock
        comment="se faltar (raro)"
        command="sudo pacman -S gnupg"
      />

      <h2>2. Gerar seu primeiro par de chaves</h2>

      <TerminalBlock
        command="gpg --full-generate-key"
        output={`gpg (GnuPG) 2.4.5; Copyright (C) 2024 g10 Code GmbH
This is free software: you are free to change and redistribute it.

Please select what kind of key you want:
   (1) RSA and RSA
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
   (9) ECC (sign and encrypt) *default*
  (10) ECC (sign only)
  (14) Existing key from card
Your selection? 9

Please select which elliptic curve you want:
   (1) Curve 25519 *default*
   (4) NIST P-384
   (6) Brainpool P-256
Your selection? 1

Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 2y
Key expires at qua 26 mar 2028 14:48:12 -03
Is this correct? (y/N) y

GnuPG needs to construct a user ID to identify your key.

Real name: João Silva
Email address: joao@example.com
Comment: chave pessoal
You selected this USER-ID:
    "João Silva (chave pessoal) <joao@example.com>"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O

We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.

gpg: revocation certificate stored as '/home/user/.gnupg/openpgp-revocs.d/9F3...A2C.rev'
public and secret key created and signed.

pub   ed25519 2026-03-26 [SC] [expires: 2028-03-26]
      9F3CA1B8B4E72D1F0B2E4A9C5D6F1E2B3A8C9D7E
uid                      João Silva (chave pessoal) <joao@example.com>
sub   cv25519 2026-03-26 [E] [expires: 2028-03-26]`}
      />

      <OutputBlock
        title="Anatomia de uma chave"
        output={`pub   ed25519 2026-03-26 [SC] [expires: 2028-03-26]
      9F3CA1B8B4E72D1F0B2E4A9C5D6F1E2B3A8C9D7E
uid                      João Silva <joao@example.com>
sub   cv25519 2026-03-26 [E] [expires: 2028-03-26]`}
        annotations={[
          { line: 0, note: "PRIMARY: ed25519 · capabilities [S]ign, [C]ertify" },
          { line: 1, note: "fingerprint completo (40 hex)" },
          { line: 2, note: "user ID associado" },
          { line: 3, note: "SUBKEY: cv25519 · capability [E]ncrypt" },
        ]}
      />

      <AlertBox type="warning" title="ECC vs RSA — qual escolher?">
        <strong>ECC (Curve 25519)</strong> é o default moderno: chaves bem menores, mais rápidas e tão
        seguras quanto RSA-3072. Use RSA-4096 só se precisar interagir com sistemas legados que ainda
        não suportam Curve25519 (raríssimo em 2026).
      </AlertBox>

      <h2>3. Listar chaves</h2>

      <TerminalBlock
        command="gpg --list-keys"
        output={`/home/user/.gnupg/pubring.kbx
-----------------------------
pub   ed25519 2026-03-26 [SC] [expires: 2028-03-26]
      9F3CA1B8B4E72D1F0B2E4A9C5D6F1E2B3A8C9D7E
uid           [ultimate] João Silva (chave pessoal) <joao@example.com>
sub   cv25519 2026-03-26 [E] [expires: 2028-03-26]`}
      />

      <TerminalBlock
        comment="suas privadas"
        command="gpg --list-secret-keys --keyid-format=long"
        output={`/home/user/.gnupg/pubring.kbx
-----------------------------
sec   ed25519/B4E72D1F0B2E4A9C 2026-03-26 [SC] [expires: 2028-03-26]
      9F3CA1B8B4E72D1F0B2E4A9C5D6F1E2B3A8C9D7E
uid                 [ultimate] João Silva <joao@example.com>
ssb   cv25519/5D6F1E2B3A8C9D7E 2026-03-26 [E] [expires: 2028-03-26]`}
      />

      <h2>4. Exportar chave pública</h2>

      <TerminalBlock
        command="gpg --armor --export joao@example.com > joao.pub.asc"
        output=""
      />

      <TerminalBlock
        command="head -3 joao.pub.asc"
        output={`-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEZgGYRRYJKwYBBAHaRw8BAQdALhE5XfV...`}
      />

      <TerminalBlock
        comment="para um keyserver público (opcional)"
        command="gpg --keyserver hkps://keys.openpgp.org --send-keys 9F3CA1B8B4E72D1F0B2E4A9C5D6F1E2B3A8C9D7E"
        output={`gpg: sending key 5D6F1E2B3A8C9D7E to hkps://keys.openpgp.org
gpg: requesting verification at https://keys.openpgp.org/upload/?token=...`}
      />

      <h2>5. Importar chave de outra pessoa</h2>

      <TerminalBlock
        command="gpg --import maria.pub.asc"
        output={`gpg: key A1B2C3D4E5F60718: public key "Maria Souza <maria@example.com>" imported
gpg: Total number processed: 1
gpg:               imported: 1`}
      />

      <TerminalBlock
        command="gpg --keyserver hkps://keys.openpgp.org --recv-keys A1B2C3D4E5F60718"
        output={`gpg: key A1B2C3D4E5F60718: "Maria Souza <maria@example.com>" not changed
gpg: Total number processed: 1
gpg:              unchanged: 1`}
      />

      <h2>6. Assinar (validar) chave de terceiro</h2>

      <TerminalBlock
        command="gpg --sign-key maria@example.com"
        output={`pub  ed25519/A1B2C3D4E5F60718
     created: 2025-11-12  expires: 2027-11-12  usage: SC
     trust: unknown       validity: unknown
sub  cv25519/8F9E7D6C5B4A3210
     created: 2025-11-12  expires: 2027-11-12  usage: E
[ unknown] (1). Maria Souza <maria@example.com>

Are you sure that you want to sign this key with your
key "João Silva <joao@example.com>" (B4E72D1F0B2E4A9C)

Really sign? (y/N) y`}
      />

      <h2>7. Criptografar e descriptografar arquivos</h2>

      <CommandFlagList
        command="gpg"
        items={[
          { flag: "-e / --encrypt", description: "Criptografa para um destinatário (usa chave pública dele).", example: "gpg -e -r maria@example.com arquivo.txt" },
          { flag: "-d / --decrypt", description: "Decripta com sua chave privada.", example: "gpg -d arquivo.txt.gpg > arquivo.txt" },
          { flag: "-c / --symmetric", description: "Criptografia simétrica com senha (sem chaves).", example: "gpg -c backup.tar" },
          { flag: "-a / --armor", description: "Saída ASCII (.asc) em vez de binária (.gpg)." },
          { flag: "-s / --sign", description: "Assina com sua privada." },
          { flag: "--clear-sign", description: "Assina mas mantém o texto legível." },
          { flag: "--detach-sign", description: "Cria assinatura em arquivo separado (.sig)." },
          { flag: "--verify", description: "Verifica uma assinatura.", example: "gpg --verify arquivo.sig arquivo" },
          { flag: "-r / --recipient", description: "Destinatário (chave pública para criptografar)." },
          { flag: "-o / --output", description: "Especifica arquivo de saída." },
        ]}
      />

      <TerminalBlock
        comment="criptografar para Maria (saída ASCII)"
        command="gpg -e -a -r maria@example.com mensagem.txt"
        output={`gpg: 8F9E7D6C5B4A3210: There is no assurance this key belongs to the named user
sub  cv25519/8F9E7D6C5B4A3210 2025-11-12 Maria Souza <maria@example.com>
 Primary key fingerprint: A1B2 C3D4 E5F6 0718 ...
      Subkey fingerprint: 8F9E 7D6C 5B4A 3210 ...

It is NOT certain that the key belongs to the person named
in the user ID.  If you *really* know what you are doing,
you may answer the next question with yes.

Use this key anyway? (y/N) y`}
      />

      <TerminalBlock
        command="cat mensagem.txt.asc | head -5"
        output={`-----BEGIN PGP MESSAGE-----

hF4DjJ59bFtKMhASAQdAi8X5aQfV3dN1...
=8aZP
-----END PGP MESSAGE-----`}
      />

      <TerminalBlock
        comment="Maria descriptografa"
        command="gpg -d mensagem.txt.asc"
        output={`gpg: encrypted with cv25519 key, ID 8F9E7D6C5B4A3210, created 2025-11-12
      "Maria Souza <maria@example.com>"
Olá! Esta é a mensagem secreta.`}
      />

      <h3>Criptografia simétrica (sem chave, só senha)</h3>

      <TerminalBlock
        command="gpg -c backup.tar"
        output={`Enter passphrase:
Repeat passphrase:`}
      />

      <TerminalBlock
        command="ls backup.tar*"
        output={`backup.tar  backup.tar.gpg`}
      />

      <TerminalBlock
        command="gpg -d backup.tar.gpg > backup.tar.restored"
        output={`gpg: AES256.CFB encrypted data
gpg: encrypted with 1 passphrase
Enter passphrase:`}
      />

      <h2>8. Assinar arquivos</h2>

      <TerminalBlock
        comment="assinatura embutida (binária)"
        command="gpg --sign release.tar.gz"
        output={`(gera release.tar.gz.gpg contendo arquivo + assinatura)`}
      />

      <TerminalBlock
        comment="assinatura clara (texto + bloco PGP no fim)"
        command="gpg --clear-sign README.md"
      />

      <TerminalBlock
        command="head -5 README.md.asc"
        output={`-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

# Meu Projeto
Texto normal aqui.`}
      />

      <TerminalBlock
        comment="assinatura DESTACADA (mais comum em releases)"
        command="gpg --detach-sign --armor release.tar.gz"
        output="(gera release.tar.gz.asc)"
      />

      <TerminalBlock
        command="gpg --verify release.tar.gz.asc release.tar.gz"
        output={`gpg: Signature made qua 26 mar 2026 15:14:08 -03
gpg:                using EDDSA key 9F3CA1B8B4E72D1F0B2E4A9C5D6F1E2B3A8C9D7E
gpg: {g}Good signature{/} from "João Silva <joao@example.com>" [ultimate]`}
      />

      <h2>9. Pacman keyring — como o Arch confia em pacotes</h2>

      <p>
        O <code>pacman</code> usa GPG para validar TODA assinatura de pacote. As chaves dos
        desenvolvedores ficam em <code>/etc/pacman.d/gnupg/</code>, gerenciadas pelo
        <code> pacman-key</code>.
      </p>

      <TerminalBlock
        command="sudo pacman-key --list-keys | head -20"
        output={`/etc/pacman.d/gnupg/pubring.gpg
-------------------------------
pub   rsa3072 2011-09-28 [SC]
      9741E8AC ABCDEF1234567890ABCDEF1234567890ABCD
uid           [  full  ] Pierre Schmitz <pierre@archlinux.de>
sub   rsa3072 2011-09-28 [E]

pub   rsa3072 2014-01-04 [SC]
      A0B0F19E CCCCDDDDEEEEFFFFGGGGHHHHIIIIJJJJKKKK
uid           [  full  ] Levente Polyak (anthraxx) <anthraxx@archlinux.org>
sub   rsa3072 2014-01-04 [E]
...`}
      />

      <TerminalBlock
        comment="atualizar o keyring oficial após muito tempo sem update"
        command="sudo pacman -S archlinux-keyring && sudo pacman-key --populate"
        output={`==> Appending keys from archlinux.gpg...
==> Locally signing trusted keys in keyring...
==> Importing owner trust values...
==> Disabling revoked keys in keyring...
==> Updating trust database...`}
      />

      <TerminalBlock
        comment="verificar assinatura de um pacote manualmente"
        command="pacman -Q --info linux | grep -i pgp"
        output="Signatures      : Yes (PGP)"
      />

      <h2>10. Editar chave (--edit-key)</h2>

      <TerminalBlock
        command="gpg --edit-key joao@example.com"
        output={`gpg (GnuPG) 2.4.5; Copyright (C) 2024 g10 Code GmbH

Secret key is available.

sec  ed25519/B4E72D1F0B2E4A9C
     created: 2026-03-26  expires: 2028-03-26  usage: SC
     trust: ultimate      validity: ultimate
ssb  cv25519/5D6F1E2B3A8C9D7E
     created: 2026-03-26  expires: 2028-03-26  usage: E
[ultimate] (1). João Silva <joao@example.com>

gpg>`}
      />

      <OutputBlock
        title="comandos do prompt gpg>"
        output={`adduid           adicionar email/uid extra
deluid           remover uid
addkey           gerar subkey nova
expire           mudar validade
passwd           trocar passphrase
trust            ajustar trust
revkey           revogar subkey
save             salvar e sair
quit             sair sem salvar`}
      />

      <h2>11. Backup (e revogação) — o passo que TODO MUNDO esquece</h2>

      <TerminalBlock
        comment="exportar chave privada para backup offline"
        command="gpg --export-secret-keys --armor joao@example.com > joao.priv.asc"
      />

      <TerminalBlock
        comment="exportar trust DB"
        command="gpg --export-ownertrust > ownertrust.txt"
      />

      <TerminalBlock
        comment="restaurar em outra máquina"
        command="gpg --import joao.priv.asc && gpg --import-ownertrust ownertrust.txt"
      />

      <p>
        O certificado de revogação foi gerado automaticamente em
        <code> ~/.gnupg/openpgp-revocs.d/</code>. Guarde esse <code>.rev</code> em um pendrive offline:
        é seu único jeito de invalidar a chave caso a privada seja comprometida.
      </p>

      <AlertBox type="danger" title="Se perder a passphrase, perde tudo">
        Não existe "esqueci minha senha" no GPG. Sem o backup da chave privada e sem o cert de
        revogação, sua chave é zumbi: ninguém consegue revogar nem recuperar. Salve em um lugar
        confiável (cofre físico, KeePassXC offline, papel impresso com paperkey).
      </AlertBox>

      <h2>12. GPG agent + SSH (bonus)</h2>

      <p>
        O <code>gpg-agent</code> pode atuar como agente SSH usando uma subkey de autenticação.
        Configure em <code>~/.gnupg/gpg-agent.conf</code>:
      </p>

      <CodeBlock
        title="~/.gnupg/gpg-agent.conf"
        code={`enable-ssh-support
default-cache-ttl 3600
max-cache-ttl 28800`}
      />

      <CodeBlock
        title="~/.bashrc"
        code={`export SSH_AUTH_SOCK="$(gpgconf --list-dirs agent-ssh-socket)"
gpgconf --launch gpg-agent`}
      />

      <h2>13. Resumo prático</h2>

      <OutputBlock
        title="cola de bolso"
        output={`gpg --full-generate-key            criar par
gpg --list-keys                    listar públicas
gpg --list-secret-keys             listar privadas
gpg --armor --export EMAIL         exportar pública (ASCII)
gpg --import arq.asc               importar pública
gpg --send-keys FPR                publicar em keyserver
gpg --recv-keys FPR                baixar de keyserver

gpg -e -r EMAIL ARQ                criptografar p/ alguém
gpg -d ARQ.gpg                     descriptografar
gpg -c ARQ                         simétrico (senha)
gpg --detach-sign --armor ARQ      assinatura .asc
gpg --verify ARQ.asc ARQ           verificar

sudo pacman-key --populate         repovoar keyring do pacman
sudo pacman -S archlinux-keyring   keys novas`}
      />
    </PageContainer>
  );
}
