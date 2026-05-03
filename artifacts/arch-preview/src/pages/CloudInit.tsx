import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function CloudInit() {
  return (
    <PageContainer
      title="cloud-init no Arch Linux"
      subtitle="Provisionamento automático na primeira inicialização: hostname, usuários, chaves SSH, pacotes, scripts. O padrão para imagens Arch em VPS, AWS, Azure, GCP, OpenStack e nuvens privadas."
      difficulty="avancado"
      timeToRead="35 min"
      category="Dev & DevOps"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Imagem Arch Cloud (raro mas existe). Mais comum: configurar manualmente para nuvem com <code>cloud-init</code> do AUR/extras.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>cloud-init</strong> — padrão de inicialização para imagens cloud. Lê metadados na primeira boot.
      </p>
      <p>
        <strong>user-data</strong> — YAML que você passa para a VM dizendo o que fazer na primeira boot.
      </p>
      <p>
        <strong>datasource</strong> — de onde o cloud-init lê os metadados (EC2, NoCloud, OpenStack).
      </p>
      <p>
        <strong>#cloud-config</strong> — primeira linha obrigatória do user-data YAML.
      </p>

      <p>
        O <code>cloud-init</code> é o canivete suíço da inicialização em nuvem: na primeira vez que
        a VM sobe, ele lê metadados do provedor (AWS EC2 metadata, ConfigDrive de OpenStack, NoCloud
        ISO etc.), aplica configurações como hostname, chaves SSH autorizadas, usuários, escreve
        arquivos, instala pacotes e roda scripts. É o que permite uma <em>imagem</em> única do Arch
        virar 1000 instâncias diferentes sem intervenção manual.
      </p>

      <AlertBox type="info" title="Quando você precisa">
        Vai subir Arch numa VPS (DigitalOcean, Hetzner, Vultr, Oracle Cloud)? Vai construir suas
        próprias <em>cloud images</em>? Está usando OpenStack/Proxmox com templates? Está testando
        com <code>cloud-localds</code> + qemu? Em todos esses casos, cloud-init é a peça que injeta
        configuração na VM nova sem você ter que abrir um console.
      </AlertBox>

      <h2>1. Instalação no Arch</h2>

      <TerminalBlock
        command="sudo pacman -S cloud-init"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (4) python-jsonpatch-1.33-1  python-jsonpointer-3.0.0-1
             python-netifaces-0.11.0-7  cloud-init-24.4-1

Total Installed Size:  6.42 MiB

:: Proceed with installation? [Y/n] y
(4/4) installing cloud-init                        [######################] 100%`}
      />

      <TerminalBlock
        command="cloud-init --version"
        output="/usr/bin/cloud-init 24.4"
      />

      <TerminalBlock
        comment="verificar suporte a datasources e schema"
        command="cloud-init schema --help | head -8"
        output={`usage: cloud-init schema [-h] [--version] [--config-file CONFIG_FILE | --system | --docs [{ALL ...}]] [--annotate]

Validate cloud-config files using jsonschema.

options:
  -h, --help            show this help message and exit
  --version, -v         show program's version number and exit
  --config-file CONFIG_FILE
                        Path of the cloud-config yaml file to validate`}
      />

      <h2>2. Habilitando os serviços</h2>

      <TerminalBlock
        command={`sudo systemctl enable cloud-init-local.service \\
                       cloud-init.service \\
                       cloud-config.service \\
                       cloud-final.service`}
        output={`Created symlink /etc/systemd/system/cloud-init.target.wants/cloud-init-local.service → /usr/lib/systemd/system/cloud-init-local.service.
Created symlink /etc/systemd/system/cloud-init.target.wants/cloud-init.service → /usr/lib/systemd/system/cloud-init.service.
Created symlink /etc/systemd/system/cloud-init.target.wants/cloud-config.service → /usr/lib/systemd/system/cloud-config.service.
Created symlink /etc/systemd/system/cloud-init.target.wants/cloud-final.service → /usr/lib/systemd/system/cloud-final.service.`}
      />

      <OutputBlock
        title="as 4 fases do cloud-init"
        output={`1. cloud-init-local.service     antes da rede subir
                                  configura nome de host inicial, lê datasource local
2. cloud-init.service           depois da rede
                                  baixa user-data, gera as instruções
3. cloud-config.service         aplica módulos de "config" (users, ssh, ntp...)
4. cloud-final.service          módulos finais (runcmd, packages, scripts)`}
        annotations={[
          { line: 0, note: "ordem importa: cada uma espera a anterior" },
        ]}
      />

      <h2>3. Onde tudo fica</h2>

      <OutputBlock
        title="caminhos importantes"
        output={`/etc/cloud/cloud.cfg          configuração principal (módulos, datasources)
/etc/cloud/cloud.cfg.d/        snippets *.cfg sobrepondo o principal
/var/lib/cloud/                estado/cache (nada toca aqui à mão em produção)
/var/lib/cloud/instance/       symlink p/ a instância atual
  ├── user-data.txt              user-data RECEBIDO (cuidado: pode ter secrets)
  ├── obj.pkl                    objeto Python serializado (debug)
  └── handlers/                  handlers de partes MIME
/var/lib/cloud/seed/             datasources locais (NoCloud)
/var/log/cloud-init.log          log principal de execução
/var/log/cloud-init-output.log   stdout/stderr dos comandos`}
      />

      <h2>4. /etc/cloud/cloud.cfg — anatomia</h2>

      <CodeBlock
        title="/etc/cloud/cloud.cfg (resumido)"
        language="yaml"
        code={`# Usuário criado se nenhum user-data definir nada
users:
   - default

disable_root: true
preserve_hostname: false

# Datasources que o cloud-init tenta na ordem
datasource_list: [ NoCloud, ConfigDrive, OpenStack, Ec2, Azure, GCE, None ]

# Módulos que rodam ANTES da rede
cloud_init_modules:
 - migrator
 - seed_random
 - bootcmd
 - write-files
 - growpart
 - resizefs
 - set_hostname
 - update_hostname
 - update_etc_hosts
 - users-groups
 - ssh

# Módulos pós-rede
cloud_config_modules:
 - locale
 - set-passwords
 - timezone
 - runcmd
 - byobu

# Módulos finais
cloud_final_modules:
 - package-update-upgrade-install
 - write-files-deferred
 - scripts-vendor
 - scripts-per-once
 - scripts-per-boot
 - scripts-per-instance
 - scripts-user
 - ssh-authkey-fingerprints
 - keys-to-console
 - phone-home
 - final-message
 - power-state-change

# Distro-específico (Arch)
system_info:
   distro: arch
   default_user:
     name: arch
     gecos: Arch Cloud User
     shell: /bin/bash
     sudo: ["ALL=(ALL) NOPASSWD:ALL"]
     groups: [wheel]`}
      />

      <h2>5. user-data — o coração da configuração</h2>

      <p>
        O <strong>user-data</strong> é o YAML (ou shell script, ou MIME multipart) que o provedor
        passa pra VM. Começa com <code>#cloud-config</code> e descreve o que aplicar.
      </p>

      <CodeBlock
        title="user-data.yml — exemplo completo para uma VPS Arch"
        language="yaml"
        code={`#cloud-config
# Hostname
hostname: web01-arch
fqdn: web01-arch.example.com
manage_etc_hosts: true

# Timezone & locale
timezone: America/Sao_Paulo
locale: pt_BR.UTF-8

# Usuários
users:
  - name: joao
    gecos: Joao Arch
    primary_group: joao
    groups: [wheel, docker]
    shell: /bin/bash
    sudo: ["ALL=(ALL) NOPASSWD:ALL"]
    ssh_authorized_keys:
      - ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPx... joao@example.com
      - ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIQy... joao@laptop
  - name: deploy
    gecos: Deploy bot
    shell: /bin/bash
    ssh_authorized_keys:
      - ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPdeploy... ci-runner

# Bloqueia login por senha
ssh_pwauth: false
disable_root: true

# Instalar pacotes
package_update: true
package_upgrade: true
packages:
  - htop
  - tmux
  - neovim
  - git
  - fail2ban
  - ufw
  - docker
  - docker-compose

# Escrever arquivos
write_files:
  - path: /etc/motd
    permissions: "0644"
    content: |
      ===========================================
       Servidor Arch (cloud-init provisioned)
       Hostname: web01-arch
      ===========================================

  - path: /etc/sysctl.d/99-network.conf
    permissions: "0644"
    content: |
      net.ipv4.tcp_keepalive_time = 600
      net.ipv4.tcp_max_syn_backlog = 4096
      net.core.somaxconn = 4096

# Comandos pré-rede
bootcmd:
  - [ cloud-init-per, once, mkdir, -p, /opt/app ]

# Comandos pós-rede (em ordem)
runcmd:
  - systemctl enable --now sshd
  - systemctl enable --now docker
  - systemctl enable --now fail2ban
  - sysctl --system
  - curl -fsSL https://example.com/setup.sh | bash

# Mensagem final no console
final_message: "cloud-init levou $UPTIME segundos. Arch pronto em \\$DATETIME."

# Reboot ao final (opcional)
power_state:
  mode: reboot
  delay: 30
  message: "Rebooting after cloud-init"
  condition: True`}
      />

      <h2>6. Validar antes de aplicar</h2>

      <TerminalBlock
        comment="schema valida sintaxe + módulos conhecidos"
        command="cloud-init schema --config-file user-data.yml"
        output={`Valid cloud-config: user-data.yml`}
      />

      <TerminalBlock
        comment="erro de schema é mostrado com linha + dica"
        command="cloud-init schema --config-file user-data-bad.yml"
        output={`{r}Invalid cloud-config provided{/}: user-data-bad.yml
user-data-bad.yml: format-l4.c1: Cloud config schema deprecations: users.0.sudo: Changing the type of 'sudo' from string to a list of strings is deprecated.
{r}Errors: 1{/}`}
      />

      <h2>7. Datasource NoCloud — como testar localmente</h2>

      <p>
        O datasource <strong>NoCloud</strong> é o mais simples e funciona offline: o cloud-init
        procura um <em>seed</em> em <code>/var/lib/cloud/seed/nocloud-net/</code> ou lê de uma ISO
        rotulada <code>cidata</code> com dois arquivos: <code>user-data</code> e{" "}
        <code>meta-data</code>.
      </p>

      <CodeBlock
        title="meta-data — o mínimo necessário"
        language="yaml"
        code={`instance-id: arch-test-01
local-hostname: arch-test-01`}
      />

      <TerminalBlock
        comment="cria a ISO seed (instale cloud-utils)"
        command={`sudo pacman -S cloud-image-utils`}
      />

      <TerminalBlock
        command={`cloud-localds seed.iso user-data.yml meta-data.yml`}
      />

      <TerminalBlock
        command="file seed.iso"
        output={`seed.iso: ISO 9660 CD-ROM filesystem data 'cidata'`}
      />

      <TerminalBlock
        comment="bootando uma imagem Arch oficial em qemu com a seed"
        command={`qemu-system-x86_64 -enable-kvm -cpu host -m 2048 \\
  -drive file=Arch-Linux-x86_64-cloudimg.qcow2,format=qcow2,if=virtio \\
  -drive file=seed.iso,format=raw,if=virtio \\
  -nic user,model=virtio-net-pci`}
      />

      <h2>8. Inspeção e debug</h2>

      <TerminalBlock
        command="cloud-init status --long"
        output={`status: done
boot_status_code: enabled-by-generator
last_update: Wed, 26 Mar 2026 14:32:18 +0000
detail:
DataSourceNoCloud [seed=/dev/sr0][dsmode=net]
errors: []`}
      />

      <TerminalBlock
        command="cloud-init analyze show"
        output={`-- Boot Record 01 --
The total time elapsed since completing an event is printed after the "@" character.
The time the event takes is printed after the "+" character.

Starting stage: init-local
|\`->no cache found @00.00100s +00.00200s
|\`->found local data from DataSourceNoCloud @00.00400s +00.04200s
Finished stage: (init-local) 0.05612 seconds

Starting stage: init
|\`->setting up datasource @00.06200s +00.00300s
|\`->reading and applying user-data @00.06800s +00.41200s
Finished stage: (init) 0.50214 seconds

Starting stage: modules-config
|\`->config-set_hostname @01.10000s +00.00400s
|\`->config-users-groups @01.12000s +0.18420s
|\`->config-ssh @01.31200s +0.04210s
Finished stage: (modules-config) 1.10402 seconds

Total Time: 12.41842 seconds`}
      />

      <TerminalBlock
        command="cloud-init analyze blame | head -8"
        output={`-- Boot Record 01 --
     04.21000s (modules-final/config-package-update-upgrade-install)
     01.84200s (modules-final/config-runcmd)
     00.41200s (init/applying user-data)
     00.18420s (modules-config/config-users-groups)
     00.07412s (modules-final/config-write-files-deferred)
     00.04210s (modules-config/config-ssh)
     00.04200s (init-local/found local data from DataSourceNoCloud)`}
      />

      <TerminalBlock
        comment="user-data efetivamente recebido"
        command="sudo cloud-init query userdata"
        output={`#cloud-config
hostname: web01-arch
fqdn: web01-arch.example.com
...`}
      />

      <TerminalBlock
        command="sudo cloud-init query --list-keys"
        output={`availability_zone
base64_encoded_keys
cloud_name
distro
instance_id
local_hostname
machine
platform
public_ssh_keys
region
sensitive_keys
subplatform
userdata
v1
vendordata`}
      />

      <TerminalBlock
        comment="logs detalhados"
        command="sudo tail -30 /var/log/cloud-init.log"
        output={`2026-03-26 14:32:14,212 - util.py[DEBUG]: Reading from /proc/uptime (quiet=False)
2026-03-26 14:32:14,213 - handlers.py[DEBUG]: start: modules-final/config-package-update-upgrade-install
2026-03-26 14:32:14,214 - cc_package_update_upgrade_install.py[INFO]: Refreshing package cache
2026-03-26 14:32:14,318 - subp.py[DEBUG]: Running command ['pacman', '-Sy'] with allowed return codes [0]
2026-03-26 14:32:18,442 - subp.py[DEBUG]: Running command ['pacman', '-S', '--noconfirm', 'htop', 'tmux', 'neovim', 'git']
2026-03-26 14:32:32,712 - handlers.py[DEBUG]: finish: modules-final/config-package-update-upgrade-install: SUCCESS`}
      />

      <h2>9. Refazer cloud-init (testar mudanças)</h2>

      <TerminalBlock
        comment="apaga estado e força reexecução no próximo boot"
        command="sudo cloud-init clean --logs --seed"
        output={`(removed /var/lib/cloud/* and reset systemd state)`}
      />

      <CommandFlagList
        command="cloud-init"
        items={[
          { flag: "init", description: "Roda a fase init manualmente.", example: "sudo cloud-init init --local" },
          { flag: "modules", description: "Roda módulos de uma fase.", example: "sudo cloud-init modules --mode config" },
          { flag: "single", description: "Executa um único módulo (ótimo para debug).", example: "sudo cloud-init single --name cc_runcmd" },
          { flag: "status", description: "Status atual; com --long, detalhes." },
          { flag: "schema", description: "Valida user-data.", example: "cloud-init schema --config-file ud.yml" },
          { flag: "query", description: "Consulta dados disponíveis (instance-id, userdata...).", example: "cloud-init query userdata" },
          { flag: "clean", description: "Reseta o estado para reexecutar no próximo boot.", example: "cloud-init clean --logs --seed" },
          { flag: "analyze show / blame", description: "Quanto tempo cada fase/módulo levou." },
          { flag: "collect-logs", description: "Empacota logs e config para reportar bug.", example: "cloud-init collect-logs" },
          { flag: "devel net-convert", description: "Converte uma config de rede para o formato cloud-init." },
        ]}
      />

      <h2>10. cloud-init e o módulo pacman do Arch</h2>

      <p>
        O módulo <code>package-update-upgrade-install</code> chama o gerenciador correto da distro.
        No Arch, isso vira <code>pacman -Sy</code> + <code>pacman -S --noconfirm</code>. Ele
        respeita estes campos do cloud-config:
      </p>

      <CodeBlock
        language="yaml"
        code={`#cloud-config

# Equivale a 'pacman -Sy' (atualiza só o índice)
package_update: true

# Equivale a 'pacman -Syu' (sistema completo) – CUIDADO em produção
package_upgrade: true

# Lista de pacotes a instalar
packages:
  - htop
  - neovim
  # também aceita versões e arrays:
  - [ "linux", "6.12.1.arch1-1" ]
  - "git>=2.40"

# Reboot se foi necessário (raro no Arch)
package_reboot_if_required: true`}
      />

      <AlertBox type="warning" title="package_upgrade: true em rolling release">
        Arch é <strong>rolling release</strong>: <code>pacman -Syu</code> pode atualizar 200+
        pacotes na primeira boot, ainda mais se a imagem for antiga. Para imagens reproduzíveis,
        prefira reconstruir a base periodicamente (com <code>archlinux-keyring</code> em dia) e
        deixar <code>package_upgrade: false</code>; faça upgrades como tarefa programada com
        Ansible, runcmd ou systemd timer.
      </AlertBox>

      <h2>11. Receitas curtas</h2>

      <CodeBlock
        title="só chave SSH + hostname"
        language="yaml"
        code={`#cloud-config
hostname: bastion
ssh_authorized_keys:
  - ssh-ed25519 AAAAC3... admin@laptop`}
      />

      <CodeBlock
        title="usuário extra com sudo passwordless"
        language="yaml"
        code={`#cloud-config
users:
  - name: ops
    sudo: "ALL=(ALL) NOPASSWD:ALL"
    groups: [wheel]
    shell: /bin/bash
    lock_passwd: true
    ssh_authorized_keys:
      - ssh-ed25519 AAAAC3... ops@bastion`}
      />

      <CodeBlock
        title="docker pronto pra uso"
        language="yaml"
        code={`#cloud-config
packages: [docker, docker-compose]
runcmd:
  - systemctl enable --now docker
  - usermod -aG docker joao
  - mkdir -p /opt/stacks/web
write_files:
  - path: /opt/stacks/web/compose.yml
    content: |
      services:
        nginx:
          image: nginx:1.27-alpine
          ports: ["80:80"]
          restart: unless-stopped`}
      />

      <CodeBlock
        title="rodar um shell script direto (em vez de #cloud-config)"
        language="bash"
        code={`#!/bin/bash
set -euo pipefail
pacman -Syu --noconfirm
pacman -S --noconfirm git neovim tmux
useradd -m -G wheel -s /bin/bash joao
echo "joao ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/joao`}
      />

      <p>
        Datasources aceitam ambos os formatos. Para combinar (ex.: cloud-config + script), use{" "}
        <strong>MIME multipart</strong>:
      </p>

      <TerminalBlock
        command={`cloud-init devel make-mime -a user-data.yml:cloud-config -a setup.sh:x-shellscript > combined.mime`}
      />

      <h2>12. Datasources mais comuns</h2>

      <OutputBlock
        title="cada nuvem entrega o user-data de um jeito"
        output={`AWS EC2          metadata HTTP em http://169.254.169.254/latest/user-data
DigitalOcean     metadata HTTP em http://169.254.169.254/metadata/v1
Hetzner Cloud    /metadata.example.com (NoCloud + ConfigDrive)
GCP              metadata em http://metadata.google.internal/
Azure            agente waagent + ovf-env.xml em CDROM
OpenStack        ConfigDrive (ISO) ou metadata HTTP
Vultr            ConfigDrive
Oracle Cloud     OpcClient (similar ao EC2)
NoCloud          ISO rotulada cidata, ou /var/lib/cloud/seed/`}
      />

      <TerminalBlock
        command="cloud-init query platform"
        output="nocloud"
      />

      <TerminalBlock
        command="cloud-init query datasource"
        output="DataSourceNoCloud"
      />

      <h2>13. Construindo sua própria imagem Arch para nuvem</h2>

      <p>
        Resumo do fluxo que o projeto Arch usa para gerar as cloud-images oficiais:
      </p>

      <OutputBlock
        title="passo-a-passo simplificado"
        output={`1. Criar qcow2 vazio:        qemu-img create -f qcow2 arch-cloud.qcow2 8G
2. Bootar ISO de instalação e fazer pacstrap mínimo
3. Dentro do chroot:
   - pacman -S cloud-init linux openssh sudo
   - systemctl enable cloud-init.target sshd
   - systemctl enable systemd-networkd systemd-resolved
4. Limpar cache: pacman -Scc, rm -rf /var/log/* /etc/machine-id
5. Configurar /etc/cloud/cloud.cfg para distro: arch
6. Truncar /etc/machine-id (regenerado no 1º boot)
7. Compactar com qemu-img convert -O qcow2 -c arch-cloud.qcow2 final.qcow2`}
      />

      <p>
        O time do Arch publica essas imagens prontas em{" "}
        <code>https://geo.mirror.pkgbuild.com/images/</code> — você raramente precisa fazer à mão.
      </p>

      <h2>14. Problemas comuns</h2>

      <AlertBox type="danger" title="cloud-init rodou só uma vez e não roda mais">
        Por design: o cloud-init usa o <code>instance-id</code> do datasource para decidir se já
        executou. Para forçar reexecução (testes / mudou o user-data), rode{" "}
        <code>sudo cloud-init clean --logs --seed</code> e reinicie. Em produção, mude o
        <code> instance-id</code> no meta-data.
      </AlertBox>

      <AlertBox type="warning" title="runcmd falha silenciosamente?">
        Cada item de <code>runcmd</code> tem que retornar 0. Use <code>set -e</code> em scripts
        embutidos e adicione <code>{`|| { echo "FAIL"; exit 1; }`}</code>. Cheque sempre{" "}
        <code>/var/log/cloud-init-output.log</code> — é onde o stdout dos comandos vai.
      </AlertBox>

      <AlertBox type="info" title="manage_etc_hosts">
        Sem ele, alguns programas reclamam de <code>sudo: unable to resolve host</code>. Quando
        ativo, cloud-init regenera <code>/etc/hosts</code> a cada boot — então edições manuais
        somem. Para preservar adições suas, desative com <code>manage_etc_hosts: false</code>.
      </AlertBox>

      <h2>15. Resumo</h2>

      <OutputBlock
        title="cola de bolso cloud-init"
        output={`# instalar
sudo pacman -S cloud-init
sudo systemctl enable cloud-init-local cloud-init cloud-config cloud-final

# user-data (no provedor) começa com
#cloud-config
hostname: ...
users: [...]
packages: [...]
write_files: [...]
runcmd: [...]

# inspecionar
cloud-init status --long
cloud-init query userdata
cloud-init analyze blame
sudo less /var/log/cloud-init.log
sudo less /var/log/cloud-init-output.log

# validar antes
cloud-init schema --config-file user-data.yml

# refazer / debug local
sudo cloud-init clean --logs --seed
sudo cloud-init init --local
sudo cloud-init modules --mode config
sudo cloud-init single --name cc_runcmd

# testar local com qemu
cloud-localds seed.iso user-data.yml meta-data.yml
qemu-system-x86_64 ... -drive file=seed.iso,format=raw`}
      />
    </PageContainer>
  );
}
