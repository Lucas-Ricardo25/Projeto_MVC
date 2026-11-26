# Silver Fox Archives

Site/repositório de livros e worldbuilding (Bootstrap 5 + JavaScript puro, sem build).
Funciona abrindo `index.html` direto no navegador ou em qualquer hospedagem estática
(GitHub Pages, Netlify, Cloudflare Pages, servidor comum).

## Como funciona

Todo o conteúdo dinâmico (obras, capítulos, categorias, **artigos da wiki, fichas**, nome do site) vem de **um único arquivo**:
`data/library.js`. As páginas leem esse arquivo e se montam sozinhas.

## Fluxo para atualizar o site

1. Abra `admin/index.html` e entre com a senha (inicial: `silverfox2026` – **troque em Configurações**).
2. Cadastre/edite obras, capítulos, categorias, **artigos da Wiki e Fichas**.
3. Clique em **Exportar library.js**.
4. Substitua `data/library.js` pelo arquivo exportado e publique o site.

> O painel edita uma cópia guardada **no navegador do autor**. Os visitantes só enxergam o que estiver
> publicado em `data/library.js`. É por isso que existe o passo de exportar.
> Faça backups com **Backup em JSON** de vez em quando (limpar os dados do navegador apaga as edições não exportadas).

## Edição direta de textos (páginas fixas)

Para ajustar textos de páginas como Sobre ou Autor: no painel, clique em **✏️ Abrir o site em modo de edição**
(ou ligue a chave no dashboard). No site aparece a **barra do autor** (canto inferior esquerdo) com
**⚙ Painel** (voltar ao admin), **✏️ Edição** (ligar/desligar) e **Sair**. A sessão vale em todas as abas por 8 horas.
Listas geradas pelos dados (livros, wiki, fichas) não são editadas assim: use as telas do painel.

## Wiki e Fichas

- **Wiki:** `admin/wiki.html` – artigos com categoria, selo colorido, período (para eras) e texto completo.
  As categorias da wiki também são editáveis na mesma tela.
- **Fichas:** `admin/fichas.html` – personagens, raças e artefatos, com atributos no formato `Nome: valor` (um por linha).
- Artigo e ficha com o **mesmo id** (ex.: `lamina-de-asminster`) ganham links um para o outro automaticamente.

## Adicionando o texto ou o arquivo de um livro

- **Ler no site:** em *Livros & Capítulos > Capítulos*, cole o texto do capítulo (parágrafos separados por linha em branco).
- **PDF/EPUB:** copie o arquivo para `livros/<id-da-obra>/` e informe o caminho no cadastro da obra
  (ex.: `livros/livro01/livro.pdf`).
- **Capa:** copie a imagem para `livros/<id-da-obra>/` e informe o caminho (ex.: `livros/livro01/capa.webp`).

## Antes de publicar (checklist)

- [ ] Trocar a senha do painel (Configurações).
- [ ] Trocar o e-mail `contato@exemplo.com` em Configurações.
- [ ] `pages/patrocinio.html`: a chave Pix e o QR Code são **exemplos**; coloque os reais.
- [ ] `sitemap.xml` e `robots.txt`: trocar `SEU-DOMINIO.com` pelo endereço real.
- [ ] Revisar `pages/politica-privacidade.html`, `pages/termos-uso.html` e `legal/COPYRIGHT.md` (este último está vazio).
- [ ] Colocar capas e PDFs reais (os `capa.webp` e `livro.epub` atuais têm 0 bytes).
- [ ] Se possível, restringir `/admin` no servidor (a senha do painel roda no navegador e não é segurança forte).
