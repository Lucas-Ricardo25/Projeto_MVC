/**
 * data/library.js
 * FONTE ÚNICA DE DADOS do site (livros, categorias, autor e configurações).
 *
 * Como atualizar o site publicado:
 *   1. Edite os dados pelo Painel Admin (admin/index.html)
 *   2. Clique em "Exportar library.js"
 *   3. Substitua ESTE arquivo pelo exportado e publique o site
 *
 * Também é possível editar este arquivo à mão.
 *
 * Campos de livro:
 *   id           identificador único e estável (sem espaços) – usado na URL
 *   status       andamento | concluido | planejamento | pausado
 *   category     id de uma categoria abaixo
 *   chapters     lista de capítulos (texto próprio ou apenas título)
 *   pdf / epub   caminho relativo à raiz do site (ex.: "livros/livro01/livro.pdf")
 *   cover        caminho da capa (ex.: "livros/livro01/capa.webp") ou vazio
 *
 * Campos de artigo da wiki (wiki):
 *   id, title, category (id de wikiCategories), tag + tagColor (selo do cartão),
 *   subtitle, period (opcional, útil para eras), summary (resumo do cartão),
 *   content (artigo completo; parágrafos separados por linha em branco), updatedAt
 *
 * Campos de ficha (sheets):
 *   id, name, type (personagem | raca | artefato), tag + tagColor, meta (canto do cartão),
 *   subtitle, summary, attributes ([{label, value}]), content, image, updatedAt
 *
 * tagColor: primary | secondary | success | warning | danger | info | dark
 */
window.LIBRARY_SEED = {
    version: 1,

    config: {
        siteName: "Silver Fox Archives",
        shortName: "Silver Fox",
        tagline: "Construindo universos, uma página de cada vez.",
        author: "Silver Fox",
        email: "contato@exemplo.com",
        maintenance: false
    },

    categories: [
        { id: "fantasia-epica", name: "Fantasia Épica", description: "Reinos, magia ancestral e grandes jornadas." },
        { id: "mitologia",      name: "Mitologia",      description: "Divindades, renascimentos e cosmologias." },
        { id: "contos",         name: "Contos",         description: "Histórias curtas e lendas populares." },
        { id: "sci-fi",         name: "Sci-Fi",         description: "Tecnologia perdida, ruínas e mistério." }
    ],

    wikiCategories: [
        { id: "reinos",    name: "Reinos & Geografia",    icon: "🌍" },
        { id: "eras",      name: "Linha do Tempo & Eras", icon: "📜" },
        { id: "culturas",  name: "Raças & Culturas",      icon: "👥" },
        { id: "artefatos", name: "Artefatos & Relíquias", icon: "⚔️" }
    ],

    wiki: [
        {
            id: "reinos-elementais",
            title: "Reinos Elementais",
            category: "reinos",
            tag: "Cosmologia", tagColor: "primary",
            subtitle: "Muspelheim, Midgard & Niflheim",
            period: "",
            summary: "Os três pilares do mundo fragmentado. Muspelheim irradia o calor primordial, Midgard abriga as civilizações mortais, e Niflheim guarda o silêncio do gelo eterno.",
            content: "",
            updatedAt: "2026-11-11"
        },
        {
            id: "terras-altas-de-alandria",
            title: "As Terras Altas de Alandria",
            category: "reinos",
            tag: "Continente", tagColor: "secondary",
            subtitle: "Região Central",
            period: "",
            summary: "Montanhas escarpadas cobertas por neblina perpétua, lar de antigas fortalezas esculpidas na rocha viva e rotas comerciais perigosas.",
            content: "",
            updatedAt: "2026-11-11"
        },
        {
            id: "era-do-despertar-mitico",
            title: "A Era do Despertar Mítico",
            category: "eras",
            tag: "Era Primordial", tagColor: "warning",
            subtitle: "",
            period: "Ano 0 – 1200",
            summary: "O período em que as divindades caminhavam entre os mortais, moldando as leis da magia e estabelecendo os primeiros domínios sagrados antes da Fragmentação.",
            content: "",
            updatedAt: "2026-11-11"
        },
        {
            id: "guerra-dos-tres-sois",
            title: "A Guerra dos Três Sóis",
            category: "eras",
            tag: "Era de Conflitos", tagColor: "danger",
            subtitle: "",
            period: "Ano 1450",
            summary: "Um cataclismo celestial que alterou permanentemente o clima de Alandria e destruiu impérios inteiros em questão de semanas.",
            content: "",
            updatedAt: "2026-11-11"
        },
        {
            id: "kallythari-e-nytharis",
            title: "Kallythari & Nytharis",
            category: "culturas",
            tag: "Povos Ancestrais", tagColor: "success",
            subtitle: "Sociedades Matriarcais e Clãs",
            period: "",
            summary: "Culturas profundamente ligadas aos ciclos lunares e à geomancia. Conhecidas por suas tradições marciais rigorosas e arquitetura orgânica.",
            content: "",
            updatedAt: "2026-11-11"
        },
        {
            id: "lamina-de-asminster",
            title: "A Lâmina de Asminster",
            category: "artefatos",
            tag: "Objeto Lendário", tagColor: "warning",
            subtitle: "Ferramenta Dimensional",
            period: "",
            summary: "Forjada com fragmentos de meteorito estelar, esta lâmina possui a propriedade única de rasgar o tecido entre os reinos elementais.",
            content: "",
            updatedAt: "2026-11-11"
        }
    ],

    sheets: [
        {
            id: "valir",
            name: "Valir / Os Reencarnados",
            type: "personagem",
            tag: "Protagonista", tagColor: "dark",
            meta: "Nível: Mítico",
            subtitle: "Raça: Humano / Fragmento Divino",
            summary: "Portador da essência elemental e guerreiro marcado pelo destino. Carrega memórias de vidas passadas e o fardo de unificar os reinos.",
            attributes: [
                { label: "Habilidade Principal", value: "Domínio Elemental" },
                { label: "Origem", value: "Midgard" }
            ],
            content: "",
            image: "",
            updatedAt: "2026-11-11"
        },
        {
            id: "kallythari-nytharis",
            name: "Kallythari & Nytharis",
            type: "raca",
            tag: "Espécie / Raça", tagColor: "success",
            meta: "Ancestral",
            subtitle: "Culturas & Sociedades",
            summary: "Povos ancestrais com traços únicos, conexão profunda com a geomancia e tradições marciais altamente estruturadas.",
            attributes: [
                { label: "Afinidade", value: "Magia Natural" },
                { label: "Habitat", value: "Terras Altas" }
            ],
            content: "",
            image: "",
            updatedAt: "2026-11-11"
        },
        {
            id: "lamina-de-asminster",
            name: "A Lâmina de Asminster",
            type: "artefato",
            tag: "Artefato Mítico", tagColor: "warning",
            meta: "Raridade: Única",
            subtitle: "Objeto Lendário",
            summary: "Relíquia mítica forjada com fragmentos estelares, capaz de cortar barreiras dimensionais e estabilizar fluxos de mana corrompidos.",
            attributes: [
                { label: "Criador", value: "Ferreiros Celestiais" },
                { label: "Estado", value: "Ativo" }
            ],
            content: "",
            image: "",
            updatedAt: "2026-11-11"
        }
    ],

    books: [
        {
            id: "livro01",
            title: "Crônicas de Alandria",
            subtitle: "Fantasia Épica / Aventura",
            status: "andamento",
            category: "fantasia-epica",
            synopsis: "Uma jornada épica através das brumas ancestrais, reinos elementais esquecidos e segredos guardados pelo tempo. Acompanhe os desdobramentos de uma era marcada pelo cataclismo do Dragão Negro.",
            progress: { current: 12, total: 30 },
            cover: "livros/livro01/capa.webp",
            pdf: "",
            epub: "",
            publishedAt: "2026",
            updatedAt: "2026-11-11",
            chapters: [
                { id: "c01", number: 1, title: "O Despertar das Brumas", content: "", date: "2026-11-11" }
            ]
        },
        {
            id: "livro02",
            title: "O Último Reencarnado",
            subtitle: "Webnovel / Mitologia",
            status: "concluido",
            category: "mitologia",
            synopsis: "Nove divindades renascidas em um mundo fragmentado entre reinos elementais. Uma luta implacável pelo equilíbrio cósmico.",
            progress: { current: 1, total: 1 },
            cover: "livros/livro02/capa.webp",
            pdf: "",
            epub: "",
            publishedAt: "2026",
            updatedAt: "2026-11-10",
            chapters: []
        },
        {
            id: "livro03",
            title: "Contos de Asminster",
            subtitle: "Antologia de Contos",
            status: "planejamento",
            category: "contos",
            synopsis: "Histórias curtas explorando os recantos sombrios, as lendas populares e os segredos da era antiga de Asminster.",
            progress: { current: 0, total: 0 },
            cover: "",
            pdf: "",
            epub: "",
            publishedAt: "",
            updatedAt: "2026-11-10",
            chapters: []
        },
        {
            id: "livro04",
            title: "Ecos de Yopith",
            subtitle: "Sci-Fi / Mistério",
            status: "andamento",
            category: "sci-fi",
            synopsis: "Ruínas cibernéticas e relíquias tecnológicas escondem verdades que a civilização moderna esqueceu como decifrar.",
            progress: { current: 5, total: 20 },
            cover: "",
            pdf: "",
            epub: "",
            publishedAt: "2026",
            updatedAt: "2026-11-10",
            chapters: []
        }
    ]
};
