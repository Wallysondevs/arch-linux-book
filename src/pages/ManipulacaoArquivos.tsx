import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ManipulacaoArquivos() {
  return (
    <PageContainer 
      title="Manipulação de Arquivos e Diretórios" 
      subtitle="Comandos essenciais: cp, mv, rm, mkdir, touch. A base da sobrevivência no terminal."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        No Linux, "tudo é um arquivo". Portanto, saber criar, copiar, mover e deletar arquivos 
        via linha de comando é uma habilidade obrigatória.
      </p>

      <h2>Criando Arquivos e Pastas</h2>
      
      <h3>touch (Criar arquivos vazios / Atualizar data)</h3>
      <p>Cria um arquivo vazio, ou se ele já existir, atualiza a data de modificação para a hora atual.</p>
      <CodeBlock code={`touch novo_arquivo.txt
touch arquivo1.txt arquivo2.txt arquivo3.txt`} />

      <h3>mkdir (Make Directory)</h3>
      <p>Cria novos diretórios (pastas).</p>
      <CodeBlock code={`mkdir nova_pasta
mkdir pasta1 pasta2
# A flag -p cria toda a árvore de diretórios necessária
mkdir -p projetos/2026/janeiro`} />


      <h2>Copiando e Movendo</h2>

      <h3>cp (Copy)</h3>
      <p>Sintaxe básica: <code>cp [origem] [destino]</code></p>
      <CodeBlock code={`# Copiar arquivo para a mesma pasta com outro nome
cp foto.jpg foto_backup.jpg

# Copiar arquivo para outro diretório
cp documento.pdf /home/usuario/Documentos/

# Copiar múltiplos arquivos para uma pasta
cp doc1.txt doc2.txt /home/usuario/Documentos/

# Copiar uma pasta inteira e seu conteúdo (requer a flag -r de recursivo)
cp -r pasta_projetos/ backup_projetos/

# Flag -i (interactive) avisa antes de sobrescrever
cp -i importante.txt /backup/`} />

      <h3>mv (Move)</h3>
      <p>O <code>mv</code> serve tanto para <strong>mover</strong> arquivos para outra pasta quanto para <strong>renomear</strong> arquivos (já que renomear no Linux é apenas mover de "nome A" para "nome B" na mesma pasta).</p>
      <CodeBlock code={`# Renomear um arquivo
mv projeto_velho.txt projeto_novo.txt

# Mover arquivo para outra pasta
mv relatorio.pdf /home/usuario/Documentos/

# Mover múltiplos arquivos usando wildcard (*)
mv *.jpg /home/usuario/Imagens/`} />


      <h2>Deletando: O Perigoso comando RM</h2>

      <h3>rm (Remove)</h3>
      <p>O <code>rm</code> apaga arquivos. <strong>Ele não envia para a lixeira. Apagou, sumiu.</strong></p>
      <CodeBlock code={`# Apagar um arquivo simples
rm arquivo.txt

# Apagar múltiplos arquivos
rm arquivo1.txt arquivo2.txt

# Apagar todos os arquivos com extensão .log
rm *.log

# AVISAR antes de apagar cada arquivo (seguro)
rm -i importante.txt`} />

      <AlertBox type="danger" title="Apagando pastas e o infame rm -rf">
        O comando <code>rm</code> por padrão se recusa a apagar pastas. Para apagar uma pasta, você precisa 
        usar a flag <code>-r</code> (recursivo) para entrar na pasta e apagar os arquivos, e a flag <code>-f</code> (force) para não pedir confirmação.
      </AlertBox>

      <CodeBlock title="Cuidado com os comandos abaixo" code={`# Apaga uma pasta inteira silenciosamente
rm -rf pasta_antiga/

# Apaga todos os arquivos java especificos (Exemplo do usuário)
rm -rf java.jav java2.jav

# O FIM DO MUNDO (Não faça isso)
# rm -rf / 
# Apagaria tudo a partir da raiz do sistema. O Linux moderno exige a flag --no-preserve-root 
# para executar isso, mas a versão em diretórios de sistema como 'rm -rf /usr' ainda é fatal.`} />

      <h3>Alternativa segura para pastas vazias: rmdir</h3>
      <p>O <code>rmdir</code> só consegue apagar uma pasta se ela estiver completamente vazia, evitando desastres.</p>
      <CodeBlock code="rmdir pasta_vazia/" />

      <h2>Links e Atalhos: ln</h2>
      <p>Links são "atalhos". Existem links físicos (hard links) e links simbólicos (symlinks). 99% das vezes você usará Symlinks (<code>-s</code>).</p>
      <CodeBlock code={`# Cria um atalho (link simbólico) de arquivo_real.txt chamado atalho.txt
ln -s arquivo_real.txt atalho.txt

# Criar atalho de uma configuração para uma pasta central
ln -s /etc/nginx/sites-available/meusite.conf /etc/nginx/sites-enabled/`} />

    </PageContainer>
  );
}
