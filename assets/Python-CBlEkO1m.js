import{j as e}from"./ui-K-J8Jkwj.js";import{P as r}from"./PageContainer-tnnsMrcC.js";import{C as t}from"./CodeBlock-DEDRw1y6.js";import{A as o}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function d(){return e.jsxs(r,{title:"Python no Arch Linux",subtitle:"Instale e gerencie Python, ambientes virtuais, pacotes e ferramentas de desenvolvimento. pyenv, uv, pip e boas práticas para desenvolvimento Python no Arch.",difficulty:"iniciante",timeToRead:"15 min",children:[e.jsx("h2",{children:"Python no Arch Linux"}),e.jsxs("p",{children:["O Arch Linux inclui Python 3 por padrão. O pacote ",e.jsx("code",{children:"python"})," sempre aponta para a versão mais recente do Python 3. Não há Python 2 nos repositórios oficiais."]}),e.jsx(t,{title:"Instalar Python e ferramentas básicas",code:`# Python já está instalado, verificar versão
python --version
python3 --version

# pip (gerenciador de pacotes Python) - já incluído
pip --version
pip3 --version

# Instalar pacotes Python essenciais via pacman
sudo pacman -S python python-pip python-setuptools python-wheel

# Ferramentas de desenvolvimento
sudo pacman -S python-virtualenv python-poetry

# IPython (REPL interativo melhorado)
sudo pacman -S ipython

# Jupyter Notebook
sudo pacman -S jupyter-notebook
# ou via pip:
pip install --user jupyterlab`}),e.jsx("h2",{children:"Ambientes Virtuais"}),e.jsxs(o,{type:"warning",title:"Nunca instale pacotes Python globalmente com pip",children:["No Arch Linux, instalar pacotes com ",e.jsx("code",{children:"pip install --global"})," pode quebrar pacotes do sistema. Sempre use ambientes virtuais ou ",e.jsx("code",{children:"pip install --user"}),"."]}),e.jsx(t,{title:"Criar e usar ambientes virtuais",code:`# Criar ambiente virtual (venv)
python -m venv .venv               # Criar em .venv/
python -m venv ~/projetos/meu-env  # Em local específico

# Ativar ambiente virtual
source .venv/bin/activate          # Linux/macOS
# (.venv) $ ← prompt muda para indicar que está ativo

# Instalar pacotes no ambiente virtual
pip install requests flask django

# Ver pacotes instalados
pip list
pip freeze              # Formato requirements.txt
pip freeze > requirements.txt

# Desativar ambiente virtual
deactivate

# Reinstalar dependências em outro lugar
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt`}),e.jsx("h2",{children:"uv - O Gerenciador de Pacotes Moderno"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"uv"})," é um gerenciador de pacotes e projetos Python extremamente rápido, escrito em Rust. Substitui pip, venv, poetry e pyenv em um único comando."]}),e.jsx(t,{title:"Usar uv para gerenciar projetos Python",code:`# Instalar uv
sudo pacman -S uv
# ou:
curl -LsSf https://astral.sh/uv/install.sh | sh

# Criar novo projeto
uv init meu-projeto
cd meu-projeto

# Adicionar dependência
uv add requests
uv add fastapi uvicorn

# Remover dependência
uv remove requests

# Rodar script (cria venv automaticamente)
uv run python main.py
uv run pytest

# Sincronizar dependências
uv sync

# Instalar versão específica do Python
uv python install 3.12
uv python install 3.11

# Executar com versão específica
uv run --python 3.11 python script.py`}),e.jsx("h2",{children:"pyenv - Gerenciar Múltiplas Versões"}),e.jsx(t,{title:"Instalar e usar pyenv",code:`# Instalar pyenv
yay -S pyenv

# Configurar no ~/.bashrc
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc
source ~/.bashrc

# Listar versões disponíveis
pyenv install --list | grep "3."

# Instalar versão específica
pyenv install 3.11.9
pyenv install 3.12.7

# Listar instaladas
pyenv versions

# Definir versão global
pyenv global 3.12.7

# Definir versão local (por projeto, cria .python-version)
pyenv local 3.11.9

# Verificar
python --version`}),e.jsx("h2",{children:"poetry - Gerenciamento de Projetos"}),e.jsx(t,{title:"Usar poetry para projetos Python",code:`# Instalar poetry
sudo pacman -S python-poetry
# ou:
curl -sSL https://install.python-poetry.org | python3 -

# Criar novo projeto
poetry new meu-projeto
cd meu-projeto

# Ou inicializar em projeto existente
poetry init

# Adicionar dependências
poetry add requests
poetry add fastapi uvicorn
poetry add --dev pytest black ruff   # Dependências de desenvolvimento

# Instalar dependências
poetry install

# Rodar no ambiente do projeto
poetry run python main.py
poetry run pytest

# Ativar shell do ambiente
poetry shell

# Exportar requirements.txt
poetry export -f requirements.txt > requirements.txt

# Ver info do projeto
poetry show
poetry env info`}),e.jsx("h2",{children:"Ferramentas de Qualidade de Código"}),e.jsx(t,{title:"Linting, formatação e type checking",code:`# Ruff - Linter e formatter ultra-rápido (substitui black + flake8)
sudo pacman -S ruff
# ou: pip install ruff

# Verificar código
ruff check .
# Corrigir automaticamente
ruff check --fix .
# Formatar
ruff format .

# mypy - Type checking
sudo pacman -S mypy
mypy meu_script.py
mypy src/

# Configuração em pyproject.toml
[tool.ruff]
line-length = 88
select = ["E", "F", "I", "N", "UP"]

[tool.mypy]
python_version = "3.12"
strict = true`}),e.jsx("h2",{children:"Scripts Python Úteis"}),e.jsx(t,{title:"Scripts Python para administração do sistema",code:`#!/usr/bin/env python3
# Script para verificar atualizações de pacotes AUR

import subprocess
import json

def check_aur_updates():
    """Verificar atualizações disponíveis no AUR"""
    result = subprocess.run(
        ['yay', '-Qu', '--aur'],
        capture_output=True, text=True
    )
    if result.returncode == 0 and result.stdout:
        packages = result.stdout.strip().split('\\n')
        print(f"Atualizações AUR disponíveis: {len(packages)}")
        for pkg in packages:
            print(f"  - {pkg}")
    else:
        print("Tudo atualizado!")

if __name__ == '__main__':
    check_aur_updates()`})]})}export{d as default};
