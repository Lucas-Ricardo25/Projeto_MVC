-- Banco de dados: MySQL / MariaDB
CREATE DATABASE IF NOT EXISTS gerenciador_tarefas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gerenciador_tarefas;

CREATE TABLE IF NOT EXISTS tarefas (
    id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    titulo     VARCHAR(120) NOT NULL,
    descricao  TEXT NULL,
    prioridade VARCHAR(10) NOT NULL DEFAULT 'media',
    status     VARCHAR(15) NOT NULL DEFAULT 'pendente',
    prazo      DATE NULL,
    created_at DATETIME NULL,
    updated_at DATETIME NULL
);

INSERT INTO tarefas (titulo, descricao, prioridade, status, prazo, created_at, updated_at) VALUES
('Estudar rotas do CodeIgniter 4', 'Revisar o arquivo Routes.php', 'alta', 'andamento', '2026-11-20', NOW(), NOW()),
('Montar o README do projeto', NULL, 'media', 'pendente', NULL, NOW(), NOW()),
('Configurar o repositório no GitHub', 'Todos os integrantes precisam de 1 commit', 'baixa', 'concluida', NULL, NOW(), NOW());
