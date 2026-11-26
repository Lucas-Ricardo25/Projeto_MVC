# Estrutura do projeto

```
index.html                  Splash de entrada
404.html                    Página de erro
manifest.json / robots.txt / sitemap.xml

data/library.js             FONTE ÚNICA de dados (obras, categorias, config)

pages/                      Páginas públicas
  index.html                Início (obras em destaque vêm dos dados)
  livros.html               Catálogo: busca, filtros, ordenação
  livro.html?id=…           Página de uma obra (capítulos, downloads)
  ler.html?livro=…&cap=…    Leitor de capítulos
  favoritos.html            Obras favoritadas pelo leitor
  novidades.html            Linha do tempo de atualizações
  wiki.html                 Wiki: busca, categorias, artigos
  wiki-artigo.html?id=…     Um artigo da wiki
  ficha.html                Fichas: busca e filtro por tipo
  ficha-detalhe.html?id=…   Uma ficha completa
  curiosidades / autor / contato / sobre / patrocinio
  politica-privacidade / termos-uso

livros/livroNN/             Arquivos de cada obra (capa, PDF, EPUB)
                            (index.html só redireciona para pages/livro.html)

admin/                      Painel do autor
  index.html                Login + dashboard + publicar/backup
  livros.html               Obras e capítulos (CRUD)
  wiki.html                 Artigos e categorias da wiki (CRUD)
  fichas.html               Fichas de personagens/raças/artefatos (CRUD)
  categorias.html           Categorias (CRUD)
  configuracoes.html        Nome, e-mail, manutenção, senha

css/                        variables · reset · style · components · responsive · admin
js/core/                    data (Library) · layout (menu/rodapé) · storage · navigation · app
js/modules/                 favorites · search (catálogo) · codex (wiki/fichas) · notifications · theme · reader
js/admin/                   admin-core · dashboard · livros-admin · wiki-admin · fichas-admin · categorias-admin · configuracoes-admin
js/script.js                Efeitos globais (cabeçalho, revelar ao rolar, voltar ao topo)
js/global-admin.js          Manutenção e edição direta
```

## Onde editar o quê

| Quero mudar…                         | Edite…                                  |
|--------------------------------------|-----------------------------------------|
| Itens do menu / rodapé               | `js/core/layout.js` (um único lugar)    |
| Artigos da wiki, fichas              | Painel admin → exportar `library.js`    |
| Obras, capítulos, categorias         | Painel admin → exportar `library.js`    |
| Cores e fontes                       | `css/variables.css` e `css/style.css`   |
| Textos das páginas fixas (sobre etc.)| O próprio `.html` ou a edição direta    |

## Armazenamento no navegador (localStorage)

| Chave                        | Uso                                           |
|------------------------------|-----------------------------------------------|
| `sf_library_override`        | Edições do autor ainda não publicadas         |
| `sf_admin_hash`              | Hash (SHA-256) da senha do painel             |
| `sf_author_session`          | Sessão do autor (8 h, compartilhada entre abas) |
| `sf_direct_edit`             | Edição direta ligada/desligada                |
| `silver_fox_user_favorites`  | Favoritos do leitor                           |
| `sf_reading`                 | Último capítulo e capítulos lidos             |
| `edit_<página>#<n>`          | Textos da edição direta (só no navegador do autor) |
