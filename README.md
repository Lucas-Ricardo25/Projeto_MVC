# Gerenciador de Tarefas

Projeto final da disciplina **Linguagem de Programação para Web** (PHP + CodeIgniter 4).

## Integrantes
- Lucas Ricardo
- Erick Alessander
- Pablo Santiago

## Objetivo
Aplicação web para cadastrar, listar, editar e excluir tarefas do dia a dia, com prioridade, status e prazo.

## Funcionalidades
| Requisito | Onde está |
|---|---|
| RF01 Cadastro | `Tarefas::nova` e `Tarefas::salvar` |
| RF02 Listagem | `Tarefas::index` (com busca, filtro por status e paginação) |
| RF03 Edição | `Tarefas::editar` e `Tarefas::atualizar` |
| RF04 Exclusão | `Tarefas::excluir` |
| RF05 Validação | Regras e mensagens em `TarefaModel` |
| RF06 Persistência | Banco de dados via `TarefaModel` |

Extras: busca, filtro, paginação e botão de concluir/reabrir.

## Tecnologias
PHP 8.1+, CodeIgniter 4, Bootstrap 5 (CDN), HTML5, CSS3, MySQL/MariaDB ou SQLite, Git/GitHub.

## Estrutura MVC
- **Model:** `app/Models/TarefaModel.php`
- **View:** `app/Views/layout.php`, `app/Views/tarefas/index.php`, `app/Views/tarefas/form.php`
- **Controller:** `app/Controllers/Tarefas.php`
- **Rotas:** `app/Config/Routes.php`

## Instalação
1. Instale o PHP 8.1+ (extensões `intl`, `mbstring`, `mysqlnd` ou `sqlite3`) e o Composer.
2. Crie o projeto base e entre na pasta:
   ```bash
   composer create-project codeigniter4/appstarter gerenciador-tarefas
   cd gerenciador-tarefas
   ```
3. Copie para dentro dele os arquivos desta entrega, mantendo as pastas
   (`app/Controllers`, `app/Models`, `app/Views`, `app/Config/Routes.php`, `app/Database/Migrations`, `database/`),
   e substitua o `Routes.php` existente.
4. Copie `env.exemplo` para `.env` e ajuste os dados do banco.

## Banco de dados (escolha uma opção)
**A) Migration (recomendado)**: crie o banco `gerenciador_tarefas` e rode:
```bash
php spark migrate
```
**B) Arquivo SQL (MySQL/MariaDB)**: importe `database/tarefas.sql`:
```bash
mysql -u root -p < database/tarefas.sql
```
**C) SQLite**: use o bloco SQLite do `.env` e rode `php spark migrate` (o arquivo é criado em `writable/`).

## Execução
```bash
php spark serve
```
Acesse http://localhost:8080
