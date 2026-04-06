import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Gpg() {
  return (
    <PageContainer
      title="GPG & Assinaturas Digitais"
      subtitle="Criptografia de e-mail e arquivos, assinaturas digitais e gerenciamento de chaves com GnuPG. Essencial para segurança de comunicação e verificação de integridade."
      difficulty="avancado"
      timeToRead="18 min"
    >
      <h2>O que é GPG?</h2>
      <p>
        O GnuPG (GNU Privacy Guard) é a implementação livre do padrão OpenPGP. Permite:
      </p>
      <ul>
        <li><strong>Criptografar arquivos</strong> — Somente o destinatário pode ler</li>
        <li><strong>Assinar arquivos</strong> — Provar que você criou/aprovou o arquivo</li>
        <li><strong>Verificar assinaturas</strong> — Confirmar autenticidade de arquivos</li>
        <li><strong>Gerenciar keyring</strong> — Importar/exportar chaves de terceiros</li>
      </ul>

      <h2>Gerar Par de Chaves</h2>
      <CodeBlock
        title="Criar sua chave GPG"
        code={`# Gerar par de chaves (modo assistente)
gpg --full-generate-key

# Responder:
# Tipo: RSA e RSA (padrão) ou ED25519 (recomendado)
# Tamanho: 4096 (RSA) ou não se aplica (ED25519)
# Validade: 2y (2 anos - recomendado) ou 0 (sem expiração)
# Nome: Seu Nome Completo
# Email: seu@email.com
# Comentário: (opcional)

# Gerar com opções via linha de comando
gpg --batch --gen-key << EOF
Key-Type: eddsa
Key-Curve: Ed25519
Subkey-Type: ecdh
Subkey-Curve: Curve25519
Name-Real: Seu Nome
Name-Email: seu@email.com
Expire-Date: 2y
%commit
EOF`}
      />

      <h2>Gerenciar Chaves</h2>
      <CodeBlock
        title="Listar, importar e exportar chaves"
        code={`# Listar suas chaves (públicas)
gpg --list-keys
gpg --list-keys --keyid-format long

# Listar suas chaves privadas
gpg --list-secret-keys

# Saída típica:
# pub   ed25519 2025-01-01 [SC] [expires: 2027-01-01]
#       ABCD1234EFGH5678IJKL9012MNOP3456QRST7890
# uid   [ultimate] Seu Nome <seu@email.com>
# sub   cv25519 2025-01-01 [E] [expires: 2027-01-01]

# Exportar chave pública (para compartilhar)
gpg --export --armor seu@email.com > chave-publica.asc
gpg --export --armor ABCD1234

# Exportar chave privada (BACKUP! Guarde com segurança)
gpg --export-secret-keys --armor seu@email.com > chave-privada.asc

# Importar chave de outra pessoa
gpg --import chave-de-alice.asc

# Buscar chave em keyserver
gpg --keyserver keyserver.ubuntu.com --search-keys alice@exemplo.com
gpg --keyserver hkps://keys.openpgp.org --recv-keys FINGERPRINT

# Atualizar chaves do keyring
gpg --refresh-keys`}
      />

      <h2>Criptografar e Descriptografar</h2>
      <CodeBlock
        title="Criptografar arquivos com GPG"
        code={`# Criptografar para um destinatário (usando chave pública dele)
gpg --encrypt --recipient alice@exemplo.com documento.pdf

# Resultado: documento.pdf.gpg

# Criptografar com assimetria E assinar
gpg --encrypt --sign --recipient alice@exemplo.com documento.pdf

# Criptografar para múltiplos destinatários
gpg --encrypt -r alice@exemplo.com -r bob@exemplo.com documento.pdf

# Criptografia simétrica (com senha, sem chaves)
gpg --symmetric arquivo.txt
gpg --symmetric --cipher-algo AES256 arquivo.txt
# Resultado: arquivo.txt.gpg

# Descriptografar (qualquer tipo)
gpg --decrypt arquivo.txt.gpg > arquivo.txt
gpg --output arquivo.txt --decrypt arquivo.txt.gpg`}
      />

      <h2>Assinar Arquivos</h2>
      <CodeBlock
        title="Criar e verificar assinaturas"
        code={`# Assinar um arquivo (cria arquivo .sig separado)
gpg --detach-sign arquivo.tar.gz
# Cria: arquivo.tar.gz.sig

# Assinar com texto ASCII (para e-mails)
gpg --detach-sign --armor arquivo.tar.gz
# Cria: arquivo.tar.gz.asc

# Verificar assinatura
gpg --verify arquivo.tar.gz.sig arquivo.tar.gz

# Saída de verificação bem-sucedida:
# gpg: Signature made Qua 01 Jan 2025 12:00:00 BRT
# gpg:                using EDDSA key ABCD1234...
# gpg: Good signature from "Seu Nome <seu@email.com>"

# Assinar e incorporar no arquivo
gpg --sign arquivo.txt
# Cria: arquivo.txt.gpg (binário, não legível)

# ASCII-armored (texto, para e-mail)
gpg --clearsign mensagem.txt
# Cria: mensagem.txt.asc (texto com assinatura incorporada)`}
      />

      <h2>GPG com Git</h2>
      <CodeBlock
        title="Assinar commits e tags Git"
        code={`# Configurar Git para usar sua chave GPG
gpg --list-secret-keys --keyid-format long

# Pegar o ID da chave (ex: 3AA5C34371567BD2)
git config --global user.signingkey 3AA5C34371567BD2

# Assinar todos os commits por padrão
git config --global commit.gpgsign true

# Assinar tags
git config --global tag.gpgsign true

# Fazer commit assinado
git commit -S -m "Mensagem do commit"
# ou automaticamente se commit.gpgsign = true:
git commit -m "Mensagem do commit"

# Verificar assinatura de um commit
git log --show-signature
git verify-commit HEAD

# Assinar tag
git tag -s v1.0 -m "Versão 1.0"
git verify-tag v1.0`}
      />

      <h2>gpg-agent e Passphrase</h2>
      <CodeBlock
        title="Gerenciar o agente GPG"
        code={`# O gpg-agent armazena a passphrase em memória por um tempo
# Para evitar digitar a senha a cada operação

# Configurar tempo de cache (em ~/.gnupg/gpg-agent.conf)
nano ~/.gnupg/gpg-agent.conf`}
      />
      <CodeBlock
        title="~/.gnupg/gpg-agent.conf"
        code={`# Tempo de cache da passphrase (segundos)
default-cache-ttl 3600          # 1 hora
max-cache-ttl 86400             # 24 horas (máximo)

# Usar Pinentry (UI para solicitar passphrase)
pinentry-program /usr/bin/pinentry-curses  # Para terminal
# pinentry-program /usr/bin/pinentry-gtk2  # Para GTK
# pinentry-program /usr/bin/pinentry-qt    # Para KDE`}
      />
      <CodeBlock
        title="Usar GPG no terminal"
        code={`# Reiniciar o agente GPG
gpgconf --kill gpg-agent
gpgconf --launch gpg-agent

# Limpar cache do agente (limpar passphrase)
gpg-connect-agent reloadagent /bye

# Exportar para keyserver público
gpg --keyserver hkps://keys.openpgp.org --send-keys SEU_FINGERPRINT

# Gerar certificado de revogação (fazer AGORA, guardar seguro!)
gpg --gen-revoke seu@email.com > certificado-revogacao.asc`}
      />

      <AlertBox type="warning" title="Proteja suas chaves">
        A chave privada GPG é extremamente sensível. Faça backup em um local seguro
        (pendrive criptografado guardado fisicamente). Nunca compartilhe a chave privada.
        Crie um certificado de revogação imediatamente após gerar a chave.
      </AlertBox>
    </PageContainer>
  );
}
