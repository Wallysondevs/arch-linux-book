import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Ansible() {
  return (
    <PageContainer
      title="Ansible no Arch Linux"
      subtitle="Automação agentless via SSH: instale uma vez, gerencie 1 ou 1000 máquinas. Inventário, ad-hoc, playbooks YAML, roles e o módulo pacman para Arch."
      difficulty="avancado"
      timeToRead="45 min"
      category="Dev & DevOps"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch/qualquer Linux com Python 3 nos nós gerenciados. Acesso SSH com chave para os hosts. Útil ter visto <a href="#/ssh">SSH</a>.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Ansible</strong> — ferramenta de automação agentless: usa SSH em vez de instalar agente em cada máquina.
      </p>
      <p>
        <strong>Inventory</strong> — arquivo (INI ou YAML) que lista os hosts gerenciados, agrupados por função.
      </p>
      <p>
        <strong>Playbook</strong> — arquivo YAML que descreve as tarefas a executar nos hosts.
      </p>
      <p>
        <strong>Role</strong> — playbook estruturado e reutilizável (tasks, handlers, vars, templates) — padrão da comunidade.
      </p>
      <p>
        <strong>Idempotência</strong> — rodar o playbook várias vezes deixa o sistema no mesmo estado. Pilar do Ansible.
      </p>

      <p>
        O <code>ansible</code> é uma ferramenta de automação <strong>agentless</strong>: você
        descreve o estado desejado dos seus servidores em arquivos YAML (<em>playbooks</em>) e o
        Ansible aplica via SSH, sem instalar nada do lado dos hosts gerenciados (basta Python). É
        perfeito tanto para gerir um único Arch desktop (provisionamento idempotente de dotfiles e
        pacotes) quanto para frota de servidores.
      </p>

      <AlertBox type="info" title="Agentless = só precisa de SSH + Python no alvo">
        Diferente de Puppet/Chef/Salt, o Ansible NÃO instala daemon nas máquinas gerenciadas. Roda
        do seu PC ou de um <em>control node</em>, conecta via SSH e executa módulos Python on-the-fly.
        Os alvos só precisam ter um Python qualquer (<code>python</code> no Arch já vem).
      </AlertBox>

      <h2>1. Instalação no Arch</h2>

      <TerminalBlock
        command="sudo pacman -S ansible"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (8) ansible-core-2.18.1-1  python-jinja-3.1.4-1
             python-markupsafe-3.0.2-1  python-packaging-24.2-1
             python-pyyaml-6.0.2-1  python-resolvelib-1.0.1-1
             sshpass-1.10-1  ansible-11.0.0-1

Total Installed Size:  148.21 MiB

:: Proceed with installation? [Y/n] y
(8/8) installing ansible                           [######################] 100%`}
      />

      <TerminalBlock
        command="ansible --version"
        output={`ansible [core 2.18.1]
  config file = /etc/ansible/ansible.cfg
  configured module search path = ['/home/user/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
  ansible python module location = /usr/lib/python3.13/site-packages/ansible
  ansible collection location = /home/user/.ansible/collections:/usr/share/ansible/collections
  executable location = /usr/bin/ansible
  python version = 3.13.1 (main, Dec  3 2024, 17:59:52) [GCC 14.2.1]
  jinja version = 3.1.4
  libyaml = True`}
      />

      <OutputBlock
        title="dois pacotes possíveis no Arch"
        output={`ansible-core    apenas o motor + módulos builtins (ansible.builtin.*)
ansible         o "tudo dentro": ansible-core + dezenas de coleções
                (community.general, community.crypto, ansible.posix, etc.)`}
      />

      <h2>2. Estrutura de um projeto Ansible</h2>

      <OutputBlock
        title="layout recomendado"
        output={`projeto-infra/
├── ansible.cfg              defaults locais (sobrepõe /etc/ansible/ansible.cfg)
├── inventory/
│   ├── hosts.ini            inventário simples
│   └── group_vars/
│       └── all.yml          variáveis para todos os hosts
├── playbooks/
│   ├── site.yml             playbook "guarda-chuva"
│   ├── webservers.yml
│   └── desktop-arch.yml
├── roles/
│   └── nginx/
│       ├── tasks/main.yml
│       ├── handlers/main.yml
│       ├── templates/nginx.conf.j2
│       ├── files/
│       ├── vars/main.yml
│       ├── defaults/main.yml
│       └── meta/main.yml
└── requirements.yml         coleções e roles externas a instalar`}
      />

      <h2>3. Inventário — quem você gerencia</h2>

      <CodeBlock
        title="inventory/hosts.ini"
        language="ini"
        code={`# Hosts soltos
arch-laptop ansible_host=192.168.0.10 ansible_user=joao

# Grupos
[webservers]
web01 ansible_host=10.0.0.21
web02 ansible_host=10.0.0.22
web03 ansible_host=10.0.0.23

[dbservers]
db01 ansible_host=10.0.0.31

# Grupo de grupos
[production:children]
webservers
dbservers

# Variáveis para todo o grupo
[webservers:vars]
ansible_user=deploy
ansible_python_interpreter=/usr/bin/python3
http_port=80`}
      />

      <CodeBlock
        title="inventory/hosts.yml — formato YAML (preferido em projetos novos)"
        language="yaml"
        code={`all:
  vars:
    ansible_user: deploy
    ansible_python_interpreter: /usr/bin/python3
  children:
    webservers:
      hosts:
        web01:
          ansible_host: 10.0.0.21
        web02:
          ansible_host: 10.0.0.22
      vars:
        http_port: 80
    dbservers:
      hosts:
        db01:
          ansible_host: 10.0.0.31
    production:
      children:
        webservers:
        dbservers:`}
      />

      <TerminalBlock
        command="ansible-inventory -i inventory/hosts.yml --graph"
        output={`@all:
  |--@ungrouped:
  |--@webservers:
  |  |--web01
  |  |--web02
  |--@dbservers:
  |  |--db01
  |--@production:
  |  |--@webservers:
  |  |  |--web01
  |  |  |--web02
  |  |--@dbservers:
  |  |  |--db01`}
      />

      <TerminalBlock
        command="ansible-inventory -i inventory/hosts.yml --list --yaml | head -15"
        output={`all:
  children:
    dbservers:
      hosts:
        db01:
          ansible_host: 10.0.0.31
          ansible_user: deploy
    webservers:
      hosts:
        web01:
          ansible_host: 10.0.0.21
          ansible_user: deploy
          http_port: 80`}
      />

      <h2>4. ansible.cfg — configuração local</h2>

      <CodeBlock
        title="ansible.cfg"
        language="ini"
        code={`[defaults]
inventory       = inventory/hosts.yml
roles_path      = roles
collections_path = collections
host_key_checking = False
retry_files_enabled = False
forks           = 20
stdout_callback = yaml
deprecation_warnings = False
interpreter_python = auto_silent

[ssh_connection]
pipelining = True
ssh_args   = -o ControlMaster=auto -o ControlPersist=300s -o PreferredAuthentications=publickey

[privilege_escalation]
become = False
become_method = sudo
become_user   = root
become_ask_pass = False`}
      />

      <h2>5. Comandos ad-hoc — uma vez, agora</h2>

      <p>
        Antes dos playbooks: <code>ansible</code> na CLI executa um único módulo em N hosts.
        Excelente para inspeção e tarefas pontuais.
      </p>

      <TerminalBlock
        comment="ping (não é ICMP — testa SSH + Python no alvo)"
        command="ansible all -m ping"
        output={`web01 | {g}SUCCESS{/} => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
web02 | {g}SUCCESS{/} => {
    "changed": false,
    "ping": "pong"
}
db01 | {g}SUCCESS{/} => {
    "changed": false,
    "ping": "pong"
}`}
      />

      <TerminalBlock
        comment="rodar comando shell em todos da prod"
        command={`ansible production -a "uptime"`}
        output={`web01 | {g}CHANGED{/} | rc=0 >>
 14:32:18 up 3 days,  4:21,  2 users,  load average: 0.42, 0.38, 0.31
web02 | {g}CHANGED{/} | rc=0 >>
 14:32:18 up 3 days,  4:21,  1 user,  load average: 0.21, 0.18, 0.15
db01  | {g}CHANGED{/} | rc=0 >>
 14:32:18 up 12 days, 8:42,  0 users,  load average: 1.84, 1.65, 1.42`}
      />

      <TerminalBlock
        comment="instalar pacote em todos os Arch via módulo pacman"
        command={`ansible all -b -m ansible.builtin.pacman -a "name=htop state=present update_cache=yes"`}
        output={`arch-laptop | {g}CHANGED{/} => {
    "changed": true,
    "msg": "installed 1 package(s). 1 package(s) installed: htop"
}`}
      />

      <TerminalBlock
        comment="coletar facts de uma máquina (descobre tudo do alvo)"
        command="ansible arch-laptop -m setup | head -30"
        output={`arch-laptop | {g}SUCCESS{/} => {
    "ansible_facts": {
        "ansible_architecture": "x86_64",
        "ansible_distribution": "Archlinux",
        "ansible_distribution_release": "rolling",
        "ansible_kernel": "6.12.1-arch1-1",
        "ansible_pkg_mgr": "pacman",
        "ansible_processor_count": 1,
        "ansible_processor_cores": 8,
        "ansible_processor_threads_per_core": 2,
        "ansible_processor_vcpus": 12,
        "ansible_memtotal_mb": 15876,
        "ansible_default_ipv4": {
            "address": "192.168.0.10",
            "interface": "wlan0"
        }
    }
}`}
      />

      <CommandFlagList
        command="ansible (ad-hoc)"
        items={[
          { flag: "-i ARQ", description: "Caminho do inventário.", example: "ansible -i inventory/hosts.yml all -m ping" },
          { flag: "-m MOD", description: "Módulo a executar (default: ansible.builtin.command).", example: "-m ansible.builtin.pacman" },
          { flag: "-a 'ARGS'", description: "Argumentos do módulo, key=value separados por espaço." },
          { flag: "-b", long: "--become", description: "Sobe para root (sudo) no alvo." },
          { flag: "-K", long: "--ask-become-pass", description: "Pergunta a senha do sudo antes de iniciar." },
          { flag: "-u USUARIO", description: "SSH como esse usuário." },
          { flag: "-l PADRAO", long: "--limit", description: "Limita o pattern do inventário.", example: "-l 'webservers:!web03'" },
          { flag: "-C", long: "--check", description: "Dry-run: simula sem aplicar." },
          { flag: "-D", long: "--diff", description: "Mostra diff de arquivos modificados." },
          { flag: "-v / -vvv", description: "Mais verbosidade (até -vvvv para debug do SSH)." },
        ]}
      />

      <h2>6. Playbooks — declarando o estado desejado</h2>

      <CodeBlock
        title="playbooks/desktop-arch.yml — provisionar um Arch básico"
        language="yaml"
        code={`---
- name: Provisiona desktop Arch
  hosts: arch-laptop
  become: true
  vars:
    pacotes_essenciais:
      - htop
      - neovim
      - git
      - tmux
      - fzf
      - ripgrep
      - bat
      - eza
      - zsh
    usuario: joao
    timezone: America/Sao_Paulo

  tasks:
    - name: Atualiza o sistema completamente (Syu)
      ansible.builtin.pacman:
        update_cache: yes
        upgrade: yes

    - name: Instala pacotes essenciais
      ansible.builtin.pacman:
        name: "{{ pacotes_essenciais }}"
        state: present

    - name: Define o timezone
      community.general.timezone:
        name: "{{ timezone }}"

    - name: Habilita systemd-timesyncd
      ansible.builtin.systemd:
        name: systemd-timesyncd
        enabled: true
        state: started

    - name: Garante diretório ~/.config
      ansible.builtin.file:
        path: "/home/{{ usuario }}/.config"
        state: directory
        owner: "{{ usuario }}"
        group: "{{ usuario }}"
        mode: "0755"

    - name: Coloca o .zshrc no lugar
      ansible.builtin.copy:
        src: files/zshrc
        dest: "/home/{{ usuario }}/.zshrc"
        owner: "{{ usuario }}"
        group: "{{ usuario }}"
        mode: "0644"
        backup: yes

    - name: Define zsh como shell padrão
      ansible.builtin.user:
        name: "{{ usuario }}"
        shell: /usr/bin/zsh`}
      />

      <TerminalBlock
        comment="rodar checagem (dry-run com diff)"
        command="ansible-playbook playbooks/desktop-arch.yml --check --diff"
        output={`PLAY [Provisiona desktop Arch] *********************************************

TASK [Gathering Facts] *****************************************************
ok: [arch-laptop]

TASK [Atualiza o sistema completamente (Syu)] ******************************
ok: [arch-laptop]

TASK [Instala pacotes essenciais] *******************************************
{y}changed{/}: [arch-laptop]

TASK [Define o timezone] ****************************************************
ok: [arch-laptop]

PLAY RECAP ******************************************************************
arch-laptop : ok=4    changed=1    unreachable=0    failed=0    skipped=0`}
      />

      <TerminalBlock
        command="ansible-playbook playbooks/desktop-arch.yml -K"
        output={`BECOME password:

PLAY [Provisiona desktop Arch] *********************************************

TASK [Gathering Facts] *****************************************************
ok: [arch-laptop]

TASK [Atualiza o sistema completamente (Syu)] ******************************
{g}changed{/}: [arch-laptop]

TASK [Instala pacotes essenciais] *******************************************
{g}changed{/}: [arch-laptop]

TASK [Define o timezone] ****************************************************
ok: [arch-laptop]

TASK [Habilita systemd-timesyncd] *******************************************
ok: [arch-laptop]

TASK [Garante diretório ~/.config] ******************************************
ok: [arch-laptop]

TASK [Coloca o .zshrc no lugar] *********************************************
{g}changed{/}: [arch-laptop]

TASK [Define zsh como shell padrão] *****************************************
{g}changed{/}: [arch-laptop]

PLAY RECAP ******************************************************************
arch-laptop : ok=8    changed=4    unreachable=0    failed=0    skipped=0`}
      />

      <AlertBox type="success" title="Idempotência">
        Rode o mesmo playbook 10 vezes — só a primeira muda algo. Tasks que já estão no estado
        desejado retornam <code>ok</code>; só virou <code>changed</code> se realmente foi
        modificado. Esse é o pilar do Ansible.
      </AlertBox>

      <h2>7. Apt → Pacman: tradução do mundo Ubuntu</h2>

      <p>
        Vindo de tutoriais Ubuntu? Os módulos mudam o nome, mas a estrutura YAML é a mesma:
      </p>

      <OutputBlock
        title="módulos correspondentes"
        output={`Ubuntu / Debian                 Arch
─────────────────────────────  ────────────────────────────────
ansible.builtin.apt            ansible.builtin.pacman
ansible.builtin.apt_repository community.general.pacman_key
ansible.builtin.apt_key        community.general.pacman_key
PPA (add-apt-repository)       AUR (community.general.pacman + paru/yay)
service / systemd              ansible.builtin.systemd  (igual)
ufw                            firewalld / iptables / nftables
update-alternatives            archlinux-java
locale-gen                     edit /etc/locale.gen + locale-gen`}
      />

      <CodeBlock
        title="módulo ansible.builtin.pacman — exemplos"
        language="yaml"
        code={`# Instalar
- name: Instala um pacote
  ansible.builtin.pacman:
    name: nginx
    state: present

# Lista de pacotes + cache fresh
- name: Garante várias coisas
  ansible.builtin.pacman:
    name:
      - htop
      - tmux
      - neovim
    state: present
    update_cache: yes

# Atualizar todo o sistema (Syu)
- name: System upgrade
  ansible.builtin.pacman:
    update_cache: yes
    upgrade: yes

# Remover
- name: Bota o nano fora (eu sou time vim)
  ansible.builtin.pacman:
    name: nano
    state: absent

# Forçar reinstalação
- name: Reinstala
  ansible.builtin.pacman:
    name: openssh
    state: latest
    force: yes`}
      />

      <CodeBlock
        title="instalar pacotes do AUR via paru (community.general.pacman não suporta direto)"
        language="yaml"
        code={`- name: Instala paru se faltar
  become: true
  become_user: aur_builder
  ansible.builtin.command:
    cmd: paru -Sy --noconfirm yay-bin
    creates: /usr/bin/yay

- name: Instala pacotes do AUR
  become: true
  become_user: aur_builder
  ansible.builtin.command: "paru -S --noconfirm --needed {{ item }}"
  loop:
    - visual-studio-code-bin
    - google-chrome
    - spotify
  register: aur_result
  changed_when: "'is up to date' not in aur_result.stdout"`}
      />

      <h2>8. Templates Jinja2</h2>

      <CodeBlock
        title="templates/nginx.conf.j2"
        language="jinja2"
        code={`# {{ ansible_managed }}
worker_processes {{ ansible_processor_vcpus }};

events {
    worker_connections 1024;
}

http {
    upstream backend {
        {% for h in groups['appservers'] %}
        server {{ hostvars[h].ansible_host }}:{{ app_port | default(3000) }};
        {% endfor %}
    }

    server {
        listen {{ http_port | default(80) }};
        server_name {{ inventory_hostname }};

        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
        }
    }
}`}
      />

      <CodeBlock
        language="yaml"
        code={`- name: Renderiza nginx.conf
  ansible.builtin.template:
    src: templates/nginx.conf.j2
    dest: /etc/nginx/nginx.conf
    owner: root
    group: root
    mode: "0644"
    validate: "nginx -tc %s"
    backup: yes
  notify: reload nginx

handlers:
  - name: reload nginx
    ansible.builtin.systemd:
      name: nginx
      state: reloaded`}
      />

      <h2>9. Roles — agrupando e reaproveitando</h2>

      <TerminalBlock
        comment="cria a estrutura padrão de uma role"
        command="ansible-galaxy role init roles/nginx"
        output={`- Role roles/nginx was created successfully`}
      />

      <OutputBlock
        title="estrutura criada"
        output={`roles/nginx/
├── README.md
├── defaults/main.yml      valores default das vars (sobrepostos por tudo)
├── files/                 arquivos copiados crus
├── handlers/main.yml      handlers (reload, restart...)
├── meta/main.yml          metadados, dependências
├── tasks/main.yml         tarefas principais
├── templates/             arquivos Jinja2
├── tests/                 testes
└── vars/main.yml          vars de role (alta prioridade)`}
      />

      <CodeBlock
        title="roles/nginx/tasks/main.yml"
        language="yaml"
        code={`---
- name: Instala nginx
  ansible.builtin.pacman:
    name: nginx
    state: present

- name: Coloca configuração
  ansible.builtin.template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
    validate: "nginx -tc %s"
  notify: reload nginx

- name: Habilita e inicia
  ansible.builtin.systemd:
    name: nginx
    enabled: true
    state: started`}
      />

      <CodeBlock
        title="usando a role num playbook"
        language="yaml"
        code={`---
- hosts: webservers
  become: true
  roles:
    - common
    - role: nginx
      vars:
        http_port: 8080
    - { role: php-fpm, when: ansible_distribution == "Archlinux" }`}
      />

      <h2>10. Variables, Vault e secrets</h2>

      <TerminalBlock
        comment="cria arquivo cifrado"
        command="ansible-vault create group_vars/production/secrets.yml"
        output={`New Vault password:
Confirm New Vault password:
(abre $EDITOR — você digita YAML normalmente, ele salva criptografado)`}
      />

      <TerminalBlock
        command="cat group_vars/production/secrets.yml"
        output={`$ANSIBLE_VAULT;1.1;AES256
38343933623332626239663438633732316561373966616638646162653234343965303666316233
...
30353164373063653464633862316538633962653662336666393839636164363930333435373039`}
      />

      <TerminalBlock
        command="ansible-vault edit group_vars/production/secrets.yml"
        output={`Vault password:
(abre o editor com o conteúdo descriptografado)`}
      />

      <TerminalBlock
        command="ansible-playbook playbooks/site.yml --ask-vault-pass"
        output="Vault password:"
      />

      <h2>11. Coleções e ansible-galaxy</h2>

      <CodeBlock
        title="requirements.yml"
        language="yaml"
        code={`collections:
  - name: community.general
    version: ">=10.0.0"
  - name: ansible.posix
  - name: community.crypto

roles:
  - name: geerlingguy.docker
    version: "7.4.0"
  - src: https://github.com/me/role-arch-base.git
    name: arch-base
    version: main`}
      />

      <TerminalBlock
        command="ansible-galaxy install -r requirements.yml"
        output={`Starting galaxy collection install process
Installing 'community.general:10.2.0' to '/home/user/.ansible/collections/...'
Collection 'community.general:10.2.0' was installed successfully
Installing 'ansible.posix:1.6.2' to '/home/user/.ansible/collections/...'
Collection 'ansible.posix:1.6.2' was installed successfully
Starting galaxy role install process
- downloading role 'docker', owned by geerlingguy
- extracting geerlingguy.docker to /home/user/.ansible/roles/geerlingguy.docker
- geerlingguy.docker (7.4.0) was installed successfully`}
      />

      <h2>12. Filtros, loops e condicionais</h2>

      <CodeBlock
        title="exemplos comuns de Jinja2 + condições"
        language="yaml"
        code={`- name: Loop simples
  ansible.builtin.debug:
    msg: "Olá {{ item }}"
  loop:
    - mundo
    - arch
    - linux

- name: Loop com dict
  ansible.builtin.user:
    name: "{{ item.name }}"
    uid:  "{{ item.uid }}"
  loop:
    - { name: alice, uid: 1001 }
    - { name: bob,   uid: 1002 }

- name: Condição
  ansible.builtin.pacman:
    name: nvidia
    state: present
  when: ansible_facts['gpu'] | default('') | search('NVIDIA')

- name: Filtro útil
  ansible.builtin.debug:
    msg: "{{ pacotes | length }} pacotes; primeiro = {{ pacotes | first }}"

- name: Tag específica
  ansible.builtin.pacman: { name: nginx, state: present }
  tags: [web, install]`}
      />

      <TerminalBlock
        comment="rodar só tasks com tag 'web'"
        command="ansible-playbook playbooks/site.yml --tags web"
      />

      <TerminalBlock
        comment="pular tasks com tag 'slow'"
        command="ansible-playbook playbooks/site.yml --skip-tags slow"
      />

      <h2>13. Debugging</h2>

      <TerminalBlock
        comment="lista o que SERÁ executado, sem rodar"
        command="ansible-playbook playbooks/site.yml --list-tasks"
        output={`playbook: playbooks/site.yml

  play #1 (webservers): Configura web servers   TAGS: []
    tasks:
      Instala nginx                              TAGS: [web, install]
      Coloca configuração                        TAGS: [web, config]
      Habilita e inicia                          TAGS: [web]`}
      />

      <TerminalBlock
        command="ansible-playbook playbooks/site.yml --start-at-task='Coloca configuração'"
      />

      <TerminalBlock
        command="ansible-playbook playbooks/site.yml --step"
        output={`Perform task: TASK: Instala nginx (N)o/(y)es/(c)ontinue: y`}
      />

      <TerminalBlock
        command="ansible-lint playbooks/site.yml"
        output={`WARNING  Listing 2 violation(s) that are fatal
yaml[line-length]: Line too long (165 > 160 characters)
playbooks/site.yml:42

risky-shell-pipe: Shells that use pipes should set the pipefail option
playbooks/site.yml:88 Task/Handler: Run pipeline

Rule violations summary
 count tag                profile    rule associated tags
     1 yaml               basic      formatting
     1 risky-shell-pipe   shell-use  command-shell, risk

Failed: 2 failure(s), 0 warning(s) on 1 file.`}
      />

      <h2>14. ansible-pull — modo "pull" (sem control node)</h2>

      <p>
        Útil em desktops Arch que se autoprovisionam: a máquina puxa o repo do Ansible e roda{" "}
        <em>nela mesma</em>.
      </p>

      <TerminalBlock
        command={`ansible-pull -U https://github.com/joao/arch-dotfiles.git playbooks/local.yml`}
        output={`Starting Ansible Pull at 2026-03-26 14:32:18
/usr/bin/ansible-pull -U https://github.com/joao/arch-dotfiles.git playbooks/local.yml
arch-laptop | {g}SUCCESS{/} => {
    "after": "8a3f2c1...",
    "before": "b2c4d8e...",
    "changed": true,
    "msg": "Updated successfully"
}

PLAY [Local provisioning] **************************************************
TASK [Instala pacotes] ******************************************************
{g}ok{/}: [localhost]
PLAY RECAP ******************************************************************
localhost : ok=12   changed=2    unreachable=0    failed=0`}
      />

      <CodeBlock
        title="agendando ansible-pull com systemd timer"
        language="ini"
        code={`# /etc/systemd/system/ansible-pull.service
[Unit]
Description=Ansible pull provisioning
Wants=network-online.target
After=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/bin/ansible-pull -U https://github.com/joao/arch-dotfiles.git playbooks/local.yml

# /etc/systemd/system/ansible-pull.timer
[Unit]
Description=Roda ansible-pull a cada hora

[Timer]
OnBootSec=5min
OnUnitActiveSec=1h
RandomizedDelaySec=10min

[Install]
WantedBy=timers.target`}
      />

      <h2>15. Resumo de comandos</h2>

      <OutputBlock
        title="cola de bolso ansible"
        output={`# install
sudo pacman -S ansible

# inventário
ansible-inventory -i hosts.yml --graph
ansible-inventory -i hosts.yml --list --yaml

# ad-hoc
ansible all -m ping
ansible web -b -m pacman -a "name=htop state=present"
ansible all -a "uptime"

# playbooks
ansible-playbook -i hosts.yml playbook.yml
ansible-playbook playbook.yml --check --diff      # dry-run
ansible-playbook playbook.yml --tags web          # só tag 'web'
ansible-playbook playbook.yml --limit 'web01'

# vault
ansible-vault create  secrets.yml
ansible-vault edit    secrets.yml
ansible-vault rekey   secrets.yml
ansible-playbook --ask-vault-pass

# galaxy
ansible-galaxy install -r requirements.yml
ansible-galaxy role init roles/minha-role

# pull mode
ansible-pull -U <url-do-repo> playbook.yml`}
      />
    </PageContainer>
  );
}
