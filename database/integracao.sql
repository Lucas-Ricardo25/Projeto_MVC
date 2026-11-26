-- Execute UMA vez no phpMyAdmin (aba Importar) com o banco gerenciador_tarefas já criado.
SET NAMES utf8mb4;
USE gerenciador_tarefas;

CREATE TABLE IF NOT EXISTS categorias (
    id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slug       VARCHAR(60)  NOT NULL UNIQUE,
    nome       VARCHAR(80)  NOT NULL,
    descricao  VARCHAR(255) NULL,
    created_at DATETIME NULL,
    updated_at DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS livros (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slug            VARCHAR(60)  NOT NULL UNIQUE,
    titulo          VARCHAR(150) NOT NULL,
    subtitulo       VARCHAR(150) NULL,
    status          VARCHAR(15)  NOT NULL DEFAULT 'planejamento',
    categoria_id    INT UNSIGNED NOT NULL,
    sinopse         TEXT NULL,
    progresso_atual INT UNSIGNED NOT NULL DEFAULT 0,
    progresso_total INT UNSIGNED NOT NULL DEFAULT 0,
    capa            VARCHAR(255) NULL,
    pdf             VARCHAR(255) NULL,
    epub            VARCHAR(255) NULL,
    publicado_em    VARCHAR(10)  NULL,
    created_at      DATETIME NULL,
    updated_at      DATETIME NULL,
    CONSTRAINT fk_livros_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Cada tarefa pode (opcionalmente) pertencer a um livro
ALTER TABLE tarefas
    ADD COLUMN livro_id INT UNSIGNED NULL AFTER prazo,
    ADD CONSTRAINT fk_tarefas_livro FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE SET NULL;

-- Dados que já estavam no site (data/library.js)
INSERT IGNORE INTO categorias (slug, nome, descricao, created_at, updated_at) VALUES
('fantasia-epica', 'Fantasia Épica', 'Reinos, magia ancestral e grandes jornadas.', NOW(), NOW()),
('mitologia',      'Mitologia',      'Divindades, renascimentos e cosmologias.',    NOW(), NOW()),
('contos',         'Contos',         'Histórias curtas e lendas populares.',        NOW(), NOW()),
('sci-fi',         'Sci-Fi',         'Tecnologia perdida, ruínas e mistério.',      NOW(), NOW());

INSERT IGNORE INTO livros (slug, titulo, subtitulo, status, categoria_id, sinopse, progresso_atual, progresso_total, capa, pdf, epub, publicado_em, created_at, updated_at) VALUES
('livro01', 'Crônicas de Alandria', 'Fantasia Épica / Aventura', 'andamento',
 (SELECT id FROM categorias WHERE slug='fantasia-epica'),
 'Uma jornada épica através das brumas ancestrais, reinos elementais esquecidos e segredos guardados pelo tempo. Acompanhe os desdobramentos de uma era marcada pelo cataclismo do Dragão Negro.',
 12, 30, 'livros/livro01/capa.webp', '', '', '2026', NOW(), '2026-11-11 00:00:00'),
('livro02', 'O Último Reencarnado', 'Webnovel / Mitologia', 'concluido',
 (SELECT id FROM categorias WHERE slug='mitologia'),
 'Nove divindades renascidas em um mundo fragmentado entre reinos elementais. Uma luta implacável pelo equilíbrio cósmico.',
 1, 1, 'livros/livro02/capa.webp', '', '', '2026', NOW(), '2026-11-10 00:00:00'),
('livro03', 'Contos de Asminster', 'Antologia de Contos', 'planejamento',
 (SELECT id FROM categorias WHERE slug='contos'),
 'Histórias curtas explorando os recantos sombrios, as lendas populares e os segredos da era antiga de Asminster.',
 0, 0, '', '', '', '', NOW(), '2026-11-10 00:00:00'),
('livro04', 'Ecos de Yopith', 'Sci-Fi / Mistério', 'andamento',
 (SELECT id FROM categorias WHERE slug='sci-fi'),
 'Ruínas cibernéticas e relíquias tecnológicas escondem verdades que a civilização moderna esqueceu como decifrar.',
 5, 20, '', '', '', '2026', NOW(), '2026-11-10 00:00:00');
