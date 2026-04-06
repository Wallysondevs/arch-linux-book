import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Mirrors() {
  return (
    <PageContainer
      title="Mirrors & Reflector"
      subtitle="Como configurar, otimizar e manter os espelhos (mirrors) do Arch Linux para downloads mais rápidos e confiáveis."
      difficulty="iniciante"
      timeToRead="15 min"
    >
      <h2>O que são Mirrors?</h2>
      <p>
        Mirrors (espelhos) são servidores distribuídos ao redor do mundo que hospedam cópias dos repositórios oficiais do Arch Linux.
        Quando você roda <code>pacman -Syu</code>, o pacman baixa os pacotes de um desses espelhos.
        Escolher espelhos rápidos e atualizados é crucial para uma experiência fluida.
      </p>

      <h2>O Arquivo mirrorlist</h2>
      <p>
        A lista de espelhos fica em <code>/etc/pacman.d/mirrorlist</code>. O pacman usa os espelhos nesta ordem — 
        o primeiro da lista tem prioridade.
      </p>

      <CodeBlock
        title="Ver a lista atual de mirrors"
        code="cat /etc/pacman.d/mirrorlist"
      />

      <CodeBlock
        title="Fazer backup antes de modificar"
        code="sudo cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.backup"
      />

      <AlertBox type="warning" title="Sempre faça backup">
        Antes de modificar o mirrorlist, sempre faça uma cópia de segurança. 
        Se todos os mirrors falharem, você não conseguirá instalar nada.
      </AlertBox>

      <h2>Reflector — Automação Inteligente</h2>
      <p>
        O <code>reflector</code> é uma ferramenta que busca os mirrors mais recentes da lista oficial do Arch Linux,
        filtra por critérios como velocidade, país e protocolo, e gera um mirrorlist otimizado automaticamente.
      </p>

      <CodeBlock
        title="Instalar o reflector"
        code="sudo pacman -S reflector"
      />

      <CodeBlock
        title="Gerar mirrorlist com os 10 mirrors mais rápidos do Brasil"
        code={`sudo reflector --country Brazil \\
  --age 12 \\
  --protocol https \\
  --sort rate \\
  --number 10 \\
  --save /etc/pacman.d/mirrorlist`}
      />

      <p>Explicação dos parâmetros:</p>
      <ul>
        <li><code>--country Brazil</code> — filtra apenas mirrors brasileiros</li>
        <li><code>--age 12</code> — apenas mirrors sincronizados nas últimas 12 horas</li>
        <li><code>--protocol https</code> — usa apenas conexões seguras HTTPS</li>
        <li><code>--sort rate</code> — ordena por velocidade de download</li>
        <li><code>--number 10</code> — seleciona os 10 melhores</li>
        <li><code>--save</code> — salva diretamente no mirrorlist</li>
      </ul>

      <CodeBlock
        title="Usar mirrors de vários países da América do Sul"
        code={`sudo reflector --country Brazil,Argentina,Chile \\
  --age 24 \\
  --protocol https \\
  --sort rate \\
  --number 20 \\
  --save /etc/pacman.d/mirrorlist`}
      />

      <CodeBlock
        title="Mirrors mais rápidos do mundo (sem filtro de país)"
        code={`sudo reflector \\
  --latest 50 \\
  --age 12 \\
  --protocol https \\
  --sort rate \\
  --number 20 \\
  --save /etc/pacman.d/mirrorlist`}
      />

      <h2>Listar Países Disponíveis</h2>
      <CodeBlock
        title="Ver todos os países com mirrors disponíveis"
        code="reflector --list-countries"
      />

      <h2>Reflector Automático com Systemd</h2>
      <p>
        Você pode configurar o reflector para atualizar os mirrors automaticamente usando um timer do systemd.
      </p>

      <CodeBlock
        title="Configurar o reflector como serviço"
        code={`# Editar a configuração do reflector
sudo vim /etc/xdg/reflector/reflector.conf

# Conteúdo recomendado:
--save /etc/pacman.d/mirrorlist
--country Brazil
--protocol https
--latest 10
--sort rate
--age 12`}
      />

      <CodeBlock
        title="Habilitar o timer do reflector"
        code={`# Habilitar e iniciar o timer (atualiza semanalmente)
sudo systemctl enable --now reflector.timer

# Executar manualmente uma vez
sudo systemctl start reflector.service

# Verificar status
systemctl status reflector.timer
systemctl status reflector.service`}
      />

      <h2>Testar Velocidade dos Mirrors Manualmente</h2>

      <CodeBlock
        title="Usando rankmirrors (pacman-contrib)"
        code={`# Instalar pacman-contrib
sudo pacman -S pacman-contrib

# Fazer backup
sudo cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.backup

# Descommentar todos os mirrors e ranquear os 6 mais rápidos
sed -e 's/^#Server/Server/' -e '/^#/d' /etc/pacman.d/mirrorlist.backup | \\
  rankmirrors -n 6 - | \\
  sudo tee /etc/pacman.d/mirrorlist`}
      />

      <h2>Verificar Status dos Mirrors</h2>

      <CodeBlock
        title="Verificar a saúde dos mirrors"
        code={`# Ver quando o mirror foi sincronizado pela última vez
curl -s 'https://archlinux.org/mirrors/status/json/' | python -m json.tool | head -50

# Ou acessar a página web
# https://archlinux.org/mirrors/status/`}
      />

      <AlertBox type="info" title="Dica importante">
        Após alterar o mirrorlist, sempre force a atualização do banco de dados de pacotes com 
        <code>sudo pacman -Syyu</code> (dois <code>y</code> para forçar o refresh).
      </AlertBox>

      <h2>Mirrors para Repositórios Específicos</h2>
      <p>
        Você também pode configurar mirrors diferentes para repositórios específicos diretamente no <code>/etc/pacman.conf</code>:
      </p>

      <CodeBlock
        title="Configurar mirror específico por repositório"
        code={`# Em /etc/pacman.conf, você pode adicionar:
[core]
Server = https://mirror.ufscar.br/archlinux/$repo/os/$arch

[extra]
Server = https://mirror.ufscar.br/archlinux/$repo/os/$arch

# $repo será substituído pelo nome do repositório (core, extra)
# $arch será substituído pela arquitetura (x86_64)`}
      />

      <h2>Troubleshooting de Mirrors</h2>

      <CodeBlock
        title="Problemas comuns e soluções"
        code={`# Erro: "failed to update core" ou "unable to lock database"
# Solução 1: Remover lock file
sudo rm /var/lib/pacman/db.lck

# Erro: "error: failed retrieving file" 
# Solução: Atualizar mirrors
sudo reflector --country Brazil --sort rate --number 10 --save /etc/pacman.d/mirrorlist
sudo pacman -Syyu

# Erro: "signature is unknown trust"
# Solução: Atualizar keyring
sudo pacman -S archlinux-keyring
sudo pacman -Syyu`}
      />
    </PageContainer>
  );
}
