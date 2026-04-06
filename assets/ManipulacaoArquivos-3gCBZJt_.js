import{j as a}from"./ui-K-J8Jkwj.js";import{P as r}from"./PageContainer-tnnsMrcC.js";import{C as o}from"./CodeBlock-DEDRw1y6.js";import{A as e}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function u(){return a.jsxs(r,{title:"Manipulação de Arquivos e Diretórios",subtitle:"Comandos essenciais: cp, mv, rm, mkdir, touch. A base da sobrevivência no terminal.",difficulty:"iniciante",timeToRead:"12 min",children:[a.jsx("p",{children:'No Linux, "tudo é um arquivo". Portanto, saber criar, copiar, mover e deletar arquivos via linha de comando é uma habilidade obrigatória.'}),a.jsx("h2",{children:"Criando Arquivos e Pastas"}),a.jsx("h3",{children:"touch (Criar arquivos vazios / Atualizar data)"}),a.jsx("p",{children:"Cria um arquivo vazio, ou se ele já existir, atualiza a data de modificação para a hora atual."}),a.jsx(o,{code:`touch novo_arquivo.txt
touch arquivo1.txt arquivo2.txt arquivo3.txt`}),a.jsx("h3",{children:"mkdir (Make Directory)"}),a.jsx("p",{children:"Cria novos diretórios (pastas)."}),a.jsx(o,{code:`mkdir nova_pasta
mkdir pasta1 pasta2
# A flag -p cria toda a árvore de diretórios necessária
mkdir -p projetos/2026/janeiro`}),a.jsx("h2",{children:"Copiando e Movendo"}),a.jsx("h3",{children:"cp (Copy)"}),a.jsxs("p",{children:["Sintaxe básica: ",a.jsx("code",{children:"cp [origem] [destino]"})]}),a.jsx(o,{code:`# Copiar arquivo para a mesma pasta com outro nome
cp foto.jpg foto_backup.jpg

# Copiar arquivo para outro diretório
cp documento.pdf /home/usuario/Documentos/

# Copiar múltiplos arquivos para uma pasta
cp doc1.txt doc2.txt /home/usuario/Documentos/

# Copiar uma pasta inteira e seu conteúdo (requer a flag -r de recursivo)
cp -r pasta_projetos/ backup_projetos/

# Flag -i (interactive) avisa antes de sobrescrever
cp -i importante.txt /backup/`}),a.jsx("h3",{children:"mv (Move)"}),a.jsxs("p",{children:["O ",a.jsx("code",{children:"mv"})," serve tanto para ",a.jsx("strong",{children:"mover"})," arquivos para outra pasta quanto para ",a.jsx("strong",{children:"renomear"}),' arquivos (já que renomear no Linux é apenas mover de "nome A" para "nome B" na mesma pasta).']}),a.jsx(o,{code:`# Renomear um arquivo
mv projeto_velho.txt projeto_novo.txt

# Mover arquivo para outra pasta
mv relatorio.pdf /home/usuario/Documentos/

# Mover múltiplos arquivos usando wildcard (*)
mv *.jpg /home/usuario/Imagens/`}),a.jsx("h2",{children:"Deletando: O Perigoso comando RM"}),a.jsx("h3",{children:"rm (Remove)"}),a.jsxs("p",{children:["O ",a.jsx("code",{children:"rm"})," apaga arquivos. ",a.jsx("strong",{children:"Ele não envia para a lixeira. Apagou, sumiu."})]}),a.jsx(o,{code:`# Apagar um arquivo simples
rm arquivo.txt

# Apagar múltiplos arquivos
rm arquivo1.txt arquivo2.txt

# Apagar todos os arquivos com extensão .log
rm *.log

# AVISAR antes de apagar cada arquivo (seguro)
rm -i importante.txt`}),a.jsxs(e,{type:"danger",title:"Apagando pastas e o infame rm -rf",children:["O comando ",a.jsx("code",{children:"rm"})," por padrão se recusa a apagar pastas. Para apagar uma pasta, você precisa usar a flag ",a.jsx("code",{children:"-r"})," (recursivo) para entrar na pasta e apagar os arquivos, e a flag ",a.jsx("code",{children:"-f"})," (force) para não pedir confirmação."]}),a.jsx(o,{title:"Cuidado com os comandos abaixo",code:`# Apaga uma pasta inteira silenciosamente
rm -rf pasta_antiga/

# Apaga todos os arquivos java especificos (Exemplo do usuário)
rm -rf java.jav java2.jav

# O FIM DO MUNDO (Não faça isso)
# rm -rf / 
# Apagaria tudo a partir da raiz do sistema. O Linux moderno exige a flag --no-preserve-root 
# para executar isso, mas a versão em diretórios de sistema como 'rm -rf /usr' ainda é fatal.`}),a.jsx("h3",{children:"Alternativa segura para pastas vazias: rmdir"}),a.jsxs("p",{children:["O ",a.jsx("code",{children:"rmdir"})," só consegue apagar uma pasta se ela estiver completamente vazia, evitando desastres."]}),a.jsx(o,{code:"rmdir pasta_vazia/"}),a.jsx("h2",{children:"Links e Atalhos: ln"}),a.jsxs("p",{children:['Links são "atalhos". Existem links físicos (hard links) e links simbólicos (symlinks). 99% das vezes você usará Symlinks (',a.jsx("code",{children:"-s"}),")."]}),a.jsx(o,{code:`# Cria um atalho (link simbólico) de arquivo_real.txt chamado atalho.txt
ln -s arquivo_real.txt atalho.txt

# Criar atalho de uma configuração para uma pasta central
ln -s /etc/nginx/sites-available/meusite.conf /etc/nginx/sites-enabled/`})]})}export{u as default};
