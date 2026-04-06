import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Polkit() {
  return (
    <PageContainer
      title="Polkit: Controle de Privilégios"
      subtitle="Entenda como o Polkit gerencia permissões de ações privilegiadas sem usar sudo para tudo."
      difficulty="avancado"
      timeToRead="15 min"
    >
      <h2>O que é o Polkit?</h2>
      <p>
        O <strong>Polkit</strong> (PolicyKit) é um framework que controla permissões para ações privilegiadas
        no sistema. Ele é o responsável por aquelas janelas que pedem sua senha quando você tenta
        montar um disco, instalar software ou alterar configurações de rede sem usar <code>sudo</code>.
      </p>

      <CodeBlock
        title="Instalar Polkit"
        code={`# Polkit geralmente já vem instalado, mas verifique
sudo pacman -S polkit

# Para ambientes sem desktop (tiling WMs), instale um agente
sudo pacman -S polkit-gnome
# ou
sudo pacman -S polkit-kde-agent
# ou para terminal:
yay -S polkit-dumb-agent`}
      />

      <h2>Como Funciona</h2>
      <p>
        Quando um programa precisa de privilégio (como montar um USB), ele pergunta ao Polkit.
        O Polkit verifica as regras e decide se permite, nega, ou pede autenticação ao usuário.
      </p>

      <CodeBlock
        title="Verificar status do Polkit"
        code={`# Verificar se o serviço está rodando
systemctl status polkit

# Listar ações disponíveis
pkaction

# Ver detalhes de uma ação
pkaction --verbose --action-id org.freedesktop.login1.power-off

# Verificar se você pode executar uma ação
pkcheck --action-id org.freedesktop.login1.reboot --process $$ 2>&1`}
      />

      <h2>Agentes de Autenticação</h2>

      <CodeBlock
        title="Iniciar agente Polkit em tiling WMs"
        code={`# Em tiling WMs (i3, Sway, Hyprland), você precisa iniciar
# o agente manualmente no autostart

# i3 (em ~/.config/i3/config)
exec --no-startup-id /usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1

# Sway (em ~/.config/sway/config)
exec /usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1

# Hyprland (em ~/.config/hypr/hyprland.conf)
exec-once = /usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1`}
      />

      <h2>Criando Regras Polkit</h2>

      <CodeBlock
        title="Estrutura de regras"
        code={`# Regras ficam em:
# /etc/polkit-1/rules.d/      — regras personalizadas (prioridade)
# /usr/share/polkit-1/rules.d/ — regras de pacotes

# Regras são arquivos .rules escritos em JavaScript

# Exemplo: permitir que o grupo "wheel" reinicie sem senha
# /etc/polkit-1/rules.d/10-power.rules
polkit.addRule(function(action, subject) {
    if ((action.id == "org.freedesktop.login1.reboot" ||
         action.id == "org.freedesktop.login1.power-off" ||
         action.id == "org.freedesktop.login1.suspend" ||
         action.id == "org.freedesktop.login1.hibernate") &&
        subject.isInGroup("wheel")) {
        return polkit.Result.YES;
    }
});`}
      />

      <CodeBlock
        title="Permitir montar discos sem senha"
        code={`# /etc/polkit-1/rules.d/10-udisks2.rules
polkit.addRule(function(action, subject) {
    if ((action.id == "org.freedesktop.udisks2.filesystem-mount" ||
         action.id == "org.freedesktop.udisks2.filesystem-mount-system" ||
         action.id == "org.freedesktop.udisks2.filesystem-unmount-others") &&
        subject.isInGroup("storage")) {
        return polkit.Result.YES;
    }
});

// Adicionar seu usuário ao grupo storage
// sudo gpasswd -a usuario storage`}
      />

      <CodeBlock
        title="Permitir NetworkManager sem senha"
        code={`# /etc/polkit-1/rules.d/10-network.rules
polkit.addRule(function(action, subject) {
    if (action.id.indexOf("org.freedesktop.NetworkManager.") == 0 &&
        subject.isInGroup("network")) {
        return polkit.Result.YES;
    }
});

// sudo gpasswd -a usuario network`}
      />

      <CodeBlock
        title="Log detalhado de decisões do Polkit"
        code={`# /etc/polkit-1/rules.d/00-log.rules
polkit.addRule(function(action, subject) {
    polkit.log("action=" + action.id + " user=" + subject.user);
});

// Ver logs
journalctl -u polkit -f`}
      />

      <h2>Ações Comuns do Polkit</h2>

      <CodeBlock
        title="IDs de ações mais usadas"
        code={`# Energia
org.freedesktop.login1.power-off          # Desligar
org.freedesktop.login1.reboot             # Reiniciar
org.freedesktop.login1.suspend            # Suspender
org.freedesktop.login1.hibernate          # Hibernar

# Discos
org.freedesktop.udisks2.filesystem-mount  # Montar
org.freedesktop.udisks2.filesystem-unmount-others # Desmontar

# Rede
org.freedesktop.NetworkManager.settings.modify.system # Modificar rede

# Pacotes
org.freedesktop.packagekit.system-update  # Atualizar sistema

# Systemd
org.freedesktop.systemd1.manage-units     # Gerenciar serviços

# Listar todas
pkaction | sort`}
      />

      <AlertBox type="warning" title="Segurança">
        Cuidado ao criar regras que permitem ações sem senha. Cada regra deve ser específica 
        (ação + grupo) e nunca use <code>return polkit.Result.YES</code> sem verificar o grupo do usuário.
      </AlertBox>
    </PageContainer>
  );
}
