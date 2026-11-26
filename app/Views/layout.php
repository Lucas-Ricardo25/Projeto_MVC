<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= $this->renderSection('titulo') ?> - Painel do Autor</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<nav class="navbar navbar-expand navbar-dark bg-dark mb-4">
    <div class="container">
        <a class="navbar-brand" href="<?= site_url('tarefas') ?>">Painel do Autor</a>
        <ul class="navbar-nav me-auto">
            <li class="nav-item"><a class="nav-link" href="<?= site_url('tarefas') ?>">Tarefas</a></li>
            <li class="nav-item"><a class="nav-link" href="<?= site_url('livros') ?>">Livros</a></li>
            <li class="nav-item"><a class="nav-link" href="<?= site_url('categorias') ?>">Categorias</a></li>
        </ul>
        <a class="btn btn-outline-light btn-sm" href="<?= base_url('meu_projeto/pages/livros.html') ?>" target="_blank" rel="noopener">Ver o site</a>
    </div>
</nav>
<main class="container pb-5">
    <?php if (session()->getFlashdata('sucesso')): ?>
        <div class="alert alert-success"><?= esc(session()->getFlashdata('sucesso')) ?></div>
    <?php endif; ?>
    <?php if (session()->getFlashdata('erros')): ?>
        <div class="alert alert-danger">
            <strong>Não foi possível concluir:</strong>
            <ul class="mb-0">
                <?php foreach (session()->getFlashdata('erros') as $erro): ?>
                    <li><?= esc($erro) ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>
    <?= $this->renderSection('conteudo') ?>
</main>
</body>
</html>
