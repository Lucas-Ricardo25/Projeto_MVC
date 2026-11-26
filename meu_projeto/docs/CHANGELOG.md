# Changelog

## 2.1

### Novo
- **Wiki dinâmica** (`wiki.html`, `wiki-artigo.html`): categorias com contagem, busca sem acento, filtros na URL e página própria para cada artigo.
- **Fichas dinâmicas** (`ficha.html`, `ficha-detalhe.html`): filtro por tipo (personagem, raça, artefato), busca inclusive nos atributos e página completa de cada ficha.
- **Admin para Wiki e Fichas** (`admin/wiki.html`, `admin/fichas.html`), com cadastro igual ao das obras e gestão das categorias da wiki.
- **Barra do autor** nas páginas públicas: voltar ao painel, ligar/desligar a edição e sair, sem usar a seta do navegador.
- Botão "Abrir o site em modo de edição" no dashboard.
- A Home mostra wiki, fichas e contadores a partir dos dados.

### Corrigido
- Modo de edição direta não funcionava depois de "Ver site": o link abria uma nova aba sem a sessão (que ficava só naquela aba). A sessão agora é compartilhada entre abas (8 h) e "Ver site" abre na mesma aba.
- Edição direta não mexe mais em conteúdo gerado pelos dados.
- Abrir o submenu no celular fechava o menu inteiro.

### Alterado
- **Menu mais enxuto:** 5 entradas na barra; Wiki, Fichas e Curiosidades ficam no submenu **Universo**. No celular o menu é um painel com itens maiores e o submenu aparece por dentro dele.
- **Rodapé em colunas** (Explorar, Universo, Projeto), com últimas obras dinâmicas, links legais e "Voltar ao topo".
- Os contadores "Regiões Mapeadas: 12" e "Personagens Catalogados: 28" da Home eram fixos; agora mostram o total real de artigos e fichas.

## 2.0 – Revisão completa

### Novo
- `data/library.js` como fonte única de dados; as páginas passam a ser montadas a partir dele.
- Páginas novas: `livro.html` (detalhe da obra), `ler.html` (leitor com tamanho/tipo de fonte, progresso e próximo/anterior), `favoritos.html`, `novidades.html`.
- Painel admin funcional: cadastrar, editar e excluir obras, capítulos e categorias; exportar `library.js`; backup/importação em JSON; troca de senha.
- Menu e rodapé em um só lugar (`js/core/layout.js`), com item ativo, contador de favoritos e link "pular para o conteúdo".
- Catálogo com busca sem diferenciar acentos, filtros por status e categoria, ordenação e filtros salvos na URL.
- Progresso de leitura por leitor (continuar de onde parou).
- `manifest.json`, `robots.txt` e `sitemap.xml` preenchidos; descrições (`meta description`) nas páginas.

### Corrigido
- Busca em `livros.html`: dois scripts disputavam o mesmo campo e esvaziavam a lista.
- Admin: formulários só mostravam "salvo" sem salvar nada; agora salvam de verdade.
- Modo manutenção: bloqueava a própria página do admin, apontava para um caminho errado e só valia no navegador do autor; agora vem da configuração publicada.
- Edição direta: a chave de armazenamento mudava ao editar o texto e a alteração se perdia; também editava menu e rodapé.
- Formulário de contato dizia "enviado" sem enviar; agora abre o e-mail do visitante com a mensagem pronta.
- Rodapés com `</li>` solto e link "Apoiar" com classe de menu; 404 com links quebrados.
- Texto dinâmico passava sem escape para `innerHTML` (risco de XSS); agora é escapado.
- Senha do admin ficava em texto puro no JavaScript; agora é guardada como hash e pode ser trocada.
- Código duplicado removido (rolagem suave, menu mobile, ano do rodapé, tema).

### Removido
- `js/modules/filters.js` (função incorporada a `search.js`), `js/admin/admin.js`, `books-manager.js`, `settings.js` (substituídos pelos novos scripts do admin).
- Abas "Wiki", "Fichas" e "Feedback" do admin, que eram apenas simulações; as páginas de wiki/fichas continuam sendo HTML estático.
- Os quatro `.json` vazios de `data/` (substituídos por `library.js`).
