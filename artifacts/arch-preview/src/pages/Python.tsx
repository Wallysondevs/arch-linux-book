import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Python() {
  return (
    <PageContainer
      title="Python no Arch"
      subtitle="O Python já vem instalado. Aqui você aprende a usar pip, venv, pipx, pyenv e uv — sem brigar com o pacman."
      difficulty="iniciante"
      timeToRead="35 min"
      category="Linguagens"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch já vem com Python 3 (<code>python</code> = Python 3, diferente de Ubuntu).
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Python</strong> — linguagem interpretada, generalista, com sintaxe limpa.
      </p>
      <p>
        <strong>python</strong> — no Arch <code>python</code> aponta para Python 3 (sem <code>python3</code> separado).
      </p>
      <p>
        <strong>pip</strong> — gerenciador. <code>python-pip</code>. Desde Python 3.11 só funciona em venv (PEP 668).
      </p>
      <p>
        <strong>venv</strong> — ambiente virtual isolado. <strong>Sempre use venv para projetos.</strong>
      </p>
      <p>
        <strong>pipx</strong> — instala apps Python isoladamente — recomendado para CLIs.
      </p>

      <p>
        O Arch <strong>já vem com Python 3</strong> — ele é dependência do <code>pacman</code> e de
        muito hook do sistema. Por isso a regra de ouro: <strong>nunca</strong> rode{" "}
        <code>sudo pip install</code> globalmente. Use <code>venv</code>, <code>pipx</code> ou
        gerenciadores como <code>uv</code>/<code>pyenv</code>.
      </p>

      <AlertBox type="danger" title="PEP 668 — externally-managed-environment">
        Desde 2023 o Python no Arch tem o marcador <code>EXTERNALLY-MANAGED</code>. Tentar{" "}
        <code>pip install requests</code> sem venv resulta em erro pedindo <code>--break-system-packages</code>.
        <strong>Não use essa flag</strong>. Crie um venv ou instale via <code>pipx</code>.
      </AlertBox>

      <h2>1. O que já está instalado</h2>

      <TerminalBlock
        command="python --version"
        output="Python 3.12.7"
      />

      <TerminalBlock
        comment="no Arch, 'python' já é o 3 (não existe /usr/bin/python2 oficial)"
        command="readlink -f $(which python)"
        output="/usr/bin/python3.12"
      />

      <TerminalBlock
        command="python -c 'import sys; print(sys.executable, sys.version_info)'"
        output={`/usr/bin/python sys.version_info(major=3, minor=12, micro=7, releaselevel='final', serial=0)`}
      />

      <h2>2. pip — a tentativa ingênua e o porquê de falhar</h2>

      <TerminalBlock
        command="pip install requests"
        exitCode={1}
        output={`error: externally-managed-environment

× This environment is externally managed
╰─> To install Python packages system-wide, try 'pacman -S
    python-xyz', where xyz is the package you are trying to
    install.

    If you wish to install a non-Arch-packaged Python package,
    create a virtual environment using 'python -m venv path/to/venv'.
    Then use path/to/venv/bin/python and path/to/venv/bin/pip.

    If you wish to install a non-Arch-packaged Python application,
    it may be easiest to use 'pipx install xyz', which will manage a
    virtual environment for you. Make sure you have python-pipx
    installed via pacman.

note: If you believe this is a mistake, please contact your Python installation's maintainer.
hint: See PEP 668 for the detailed specification.`}
      />

      <h2>3. venv — a forma oficial</h2>

      <TerminalBlock
        comment="cria um venv local em ./.venv"
        command="python -m venv .venv"
      />

      <TerminalBlock
        comment="ativa: a partir daqui, pip e python apontam pro venv"
        command="source .venv/bin/activate"
        output={`(.venv) [user@archlinux ~]$`}
      />

      <TerminalBlock
        command="which python && python --version"
        output={`/home/user/projeto/.venv/bin/python
Python 3.12.7`}
      />

      <TerminalBlock
        command="pip install requests beautifulsoup4"
        output={`Collecting requests
  Downloading requests-2.32.3-py3-none-any.whl (64 kB)
Collecting beautifulsoup4
  Downloading beautifulsoup4-4.12.3-py3-none-any.whl (147 kB)
Collecting charset-normalizer<4,>=2 (from requests)
  Downloading charset_normalizer-3.3.2-py3-none-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (140 kB)
Collecting idna<4,>=2.5 (from requests)
  Downloading idna-3.7-py3-none-any.whl (66 kB)
Installing collected packages: charset-normalizer, idna, urllib3, certifi, soupsieve, requests, beautifulsoup4
Successfully installed beautifulsoup4-4.12.3 certifi-2024.7.4 charset-normalizer-3.3.2 idna-3.7 requests-2.32.3 soupsieve-2.5 urllib3-2.2.2`}
      />

      <TerminalBlock
        command="pip list"
        output={`Package            Version
------------------ ---------
beautifulsoup4     4.12.3
certifi            2024.7.4
charset-normalizer 3.3.2
idna               3.7
pip                24.0
requests           2.32.3
soupsieve          2.5
urllib3            2.2.2`}
      />

      <TerminalBlock
        command="pip freeze > requirements.txt && cat requirements.txt"
        output={`beautifulsoup4==4.12.3
certifi==2024.7.4
charset-normalizer==3.3.2
idna==3.7
requests==2.32.3
soupsieve==2.5
urllib3==2.2.2`}
      />

      <TerminalBlock
        comment="sai do venv (volta ao Python do sistema)"
        command="deactivate"
      />

      <CommandFlagList
        command="python -m venv"
        items={[
          { flag: "--system-site-packages", description: "Permite o venv enxergar pacotes globais." },
          { flag: "--clear", description: "Apaga conteúdo prévio antes de criar." },
          { flag: "--upgrade", description: "Atualiza Python no venv existente (após upgrade do sistema)." },
          { flag: "--prompt NOME", description: "Customiza o prefixo do PS1 do venv." },
          { flag: "--without-pip", description: "Não inclui pip (raro)." },
        ]}
      />

      <h2>4. pipx — para apps CLI globais</h2>

      <p>
        Quer instalar uma ferramenta como <code>black</code>, <code>httpie</code> ou{" "}
        <code>poetry</code> e usá-la em qualquer pasta? <code>pipx</code> cria um venv isolado para
        cada app e expõe o binário em <code>~/.local/bin/</code>.
      </p>

      <TerminalBlock command="sudo pacman -S python-pipx" />

      <TerminalBlock
        command="pipx ensurepath"
        output={`Success! Added /home/user/.local/bin to the PATH environment variable.
Consider adding shell completions for pipx. Run 'pipx completions' for instructions.

You will need to open a new terminal or re-login for the PATH changes to take effect.`}
      />

      <TerminalBlock
        command="pipx install httpie"
        output={`  installed package httpie 3.2.2, installed using Python 3.12.7
  These apps are now globally available
    - http
    - https
    - httpie
done! ✨ 🌟 ✨`}
      />

      <TerminalBlock
        command="pipx list"
        output={`venvs are in /home/user/.local/share/pipx/venvs
apps are exposed on your $PATH at /home/user/.local/bin
manual pages are exposed at /home/user/.local/share/man

   package httpie 3.2.2, installed using Python 3.12.7
    - http
    - https
    - httpie`}
      />

      <h2>5. uv — o instalador ultra-rápido (escrito em Rust)</h2>

      <TerminalBlock command="sudo pacman -S uv" />

      <TerminalBlock
        comment="cria venv 100x mais rápido que python -m venv"
        command="uv venv .venv"
        output={`Using CPython 3.12.7 interpreter at: /usr/bin/python
Creating virtual environment at: .venv
Activate with: source .venv/bin/activate`}
      />

      <TerminalBlock
        command="source .venv/bin/activate && uv pip install fastapi uvicorn"
        output={`Resolved 14 packages in 312ms
Downloaded 14 packages in 421ms
Installed 14 packages in 28ms
 + annotated-types==0.7.0
 + anyio==4.4.0
 + click==8.1.7
 + fastapi==0.111.0
 + h11==0.14.0
 + idna==3.7
 + pydantic==2.7.4
 + pydantic-core==2.18.4
 + sniffio==1.3.1
 + starlette==0.37.2
 + typing-extensions==4.12.2
 + uvicorn==0.30.1`}
      />

      <h3>Projetos com uv (pyproject.toml)</h3>

      <TerminalBlock
        command="uv init meu_app && cd meu_app"
        output={`Initialized project \`meu_app\` at \`/home/user/meu_app\`
Created: pyproject.toml, .python-version, README.md, hello.py`}
      />

      <TerminalBlock
        command="uv add httpx rich"
        output={`Resolved 11 packages in 184ms
Installed 11 packages in 12ms`}
      />

      <TerminalBlock
        command="uv run hello.py"
        output="Hello from meu_app!"
      />

      <h2>6. pyenv — múltiplas versões de Python</h2>

      <p>
        O Arch sempre carrega a versão mais recente. Se você precisa de Python 3.10 para um projeto
        antigo (e 3.13 pra outro), instale via AUR:
      </p>

      <TerminalBlock command="yay -S pyenv" />

      <TerminalBlock
        comment="adicione no ~/.bashrc ou ~/.zshrc"
        command={`cat >> ~/.bashrc <<'EOF'
export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init - bash)"
EOF`}
      />

      <TerminalBlock
        command="pyenv install --list | grep -E '^\\s*3\\.(10|11|12|13)' | head -8"
        output={`  3.10.0
  3.10.14
  3.11.9
  3.12.7
  3.13.0`}
      />

      <TerminalBlock
        comment="compila do source (precisa base-devel)"
        command="pyenv install 3.10.14"
        output={`Downloading Python-3.10.14.tar.xz...
-> https://www.python.org/ftp/python/3.10.14/Python-3.10.14.tar.xz
Installing Python-3.10.14...
Installed Python-3.10.14 to /home/user/.pyenv/versions/3.10.14`}
      />

      <TerminalBlock
        command="pyenv local 3.10.14 && python --version"
        output="Python 3.10.14"
      />

      <h2>7. Pacotes Python via pacman</h2>

      <p>
        Muitas libs populares têm pacote oficial — <code>python-requests</code>,{" "}
        <code>python-numpy</code>, <code>python-django</code> etc. Use isso quando o pacote precisa
        ser usado por <strong>scripts do sistema</strong> ou ferramentas globais.
      </p>

      <TerminalBlock
        command="sudo pacman -S python-requests python-numpy python-pandas"
        output={`Packages (3) python-numpy-1.26.4-1  python-pandas-2.2.2-2  python-requests-2.32.3-2

Total Installed Size:  68.42 MiB`}
      />

      <TerminalBlock
        command="pacman -Q | grep '^python-' | head -5"
        output={`python-numpy 1.26.4-1
python-pandas 2.2.2-2
python-requests 2.32.3-2
python-pipx 1.6.0-2
python-pip 24.0-2`}
      />

      <h2>8. Hello world FastAPI (exemplo completo)</h2>

      <CodeBlock
        title="api.py"
        language="python"
        code={`from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Arch API")

class Pacote(BaseModel):
    nome: str
    versao: str
    repo: str = "extra"

@app.get("/")
def root():
    return {"msg": "olá do Arch", "fastapi": True}

@app.get("/pacotes")
def lista() -> list[Pacote]:
    return [
        Pacote(nome="linux",  versao="6.12.1", repo="core"),
        Pacote(nome="pacman", versao="7.0.0",  repo="core"),
    ]`}
      />

      <TerminalBlock
        command="uvicorn api:app --reload"
        output={`INFO:     Will watch for changes in these directories: ['/home/user/projeto']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [4382] using StatReload
INFO:     Started server process [4384]
INFO:     Application startup complete.`}
      />

      <TerminalBlock
        command="http :8000/pacotes"
        output={`HTTP/1.1 200 OK
content-length: 110
content-type: application/json

[
    {"nome": "linux",  "versao": "6.12.1", "repo": "core"},
    {"nome": "pacman", "versao": "7.0.0",  "repo": "core"}
]`}
      />

      <h2>9. Tabela de decisão</h2>

      <OutputBlock
        title="qual ferramenta usar?"
        output={`cenário                              ferramenta
-----------------------------------  ---------------------------
projeto local com deps específicas   uv venv  ou  python -m venv
app CLI global (black, httpie)       pipx
ferramenta usada por scripts SO      pacman -S python-xyz
testar em outra versão de Python     pyenv
projeto novo com pyproject.toml      uv init / uv add
data science / jupyter               uv pip install jupyter
ML pesado com CUDA                   pacman -S python-pytorch (oficial!)`}
      />

      <h2>10. Troubleshooting</h2>

      <TerminalBlock
        comment="venv 'quebrado' após upgrade do Python (3.12 → 3.13)"
        command="source .venv/bin/activate && python"
        exitCode={1}
        output={`bash: .venv/bin/python: No such file or directory`}
      />

      <p>Solução: recrie o venv (Python no Arch não suporta upgrade de venv):</p>
      <TerminalBlock command="rm -rf .venv && python -m venv .venv && pip install -r requirements.txt" />

      <AlertBox type="success" title="Padrão recomendado para projetos novos">
        Em 2026 a maioria dos projetos Arch+Python pode adotar <code>uv</code> de cabo a rabo:
        <code> uv init</code>, <code>uv add</code>, <code>uv run</code>. Ele substitui pip + venv +
        pip-tools + (parcialmente) poetry, num único binário rápido.
      </AlertBox>
    </PageContainer>
  );
}
