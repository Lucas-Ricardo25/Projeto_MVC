<?= $this->extend('layout') ?>
<?= $this->section('titulo') ?>Livros<?= $this->endSection() ?>
<?= $this->section('conteudo') ?>

<div class="d-flex justify-content-between align-items-center mb-3">
    <h1 class="h4 mb-0">Livros</h1>
    <a class="btn btn-success" href="<?= site_url('livros/novo') ?>">Novo livro</a>
</div>

<form method="get" action="<?= site_url('livros') ?>" class="row g-2 mb-3">
    <div class="col-md-4">
        <input type="text" name="busca" class="form-control" placeholder="Buscar pelo título" value="<?= esc($busca) ?>">
    </div>
    <div class="col-md-3">
        <select name="categoria" class="form-select">
            <option value="">Todas as categorias</option>
            <?php foreach ($categorias as $c): ?>
                <option value="<?= $c['id'] ?>" <?= $categoria === (int) $c['id'] ? 'selected' : '' ?>><?= esc($c['nome']) ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div class="col-md-3">
        <select name="status" class="form-select">
            <option value="">Todos os status</option>
            <?php foreach (\App\Models\LivroModel::STATUS as $valor => $rotulo): ?>
                <option value="<?= $valor ?>" <?= $status === $valor ? 'selected' : '' ?>><?= $rotulo ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div class="col-md-2 d-grid">
        <button class="btn btn-outline-dark">Filtrar</button>
    </div>
</form>

<?php if (empty($livros)): ?>
    <div class="alert alert-secondary">
        Nenhum livro encontrado. <a href="<?= site_url('livros/novo') ?>">Cadastre o primeiro livro</a>.
    </div>
<?php else: ?>
    <div class="table-responsive bg-white shadow-sm rounded">
        <table class="table table-hover align-middle mb-0">
            <thead>
                <tr>
                    <th>Livro</th>
                    <th>Categoria</th>
                    <th>Status</th>
                    <th>Progresso</th>
                    <th>Tarefas</th>
                    <th class="text-end">Ações</th>
                </tr>
            </thead>
            <tbody>
            <?php
            $corStatus = ['andamento' => 'primary', 'concluido' => 'success', 'planejamento' => 'secondary', 'pausado' => 'warning'];
            foreach ($livros as $l): ?>
                <tr>
                    <td>
                        <?= esc($l['titulo']) ?>
                        <div class="small text-muted"><?= esc($l['subtitulo']) ?></div>
                    </td>
                    <td><?= esc($l['categoria_nome']) ?></td>
                    <td><span class="badge text-bg-<?= $corStatus[$l['status']] ?? 'secondary' ?>"><?= esc(\App\Models\LivroModel::STATUS[$l['status']] ?? $l['status']) ?></span></td>
                    <td><?= (int) $l['progresso_atual'] ?> / <?= (int) $l['progresso_total'] ?></td>
                    <td><a href="<?= site_url('tarefas?livro=' . $l['id']) ?>"><?= (int) $l['total_tarefas'] ?></a></td>
                    <td class="text-end text-nowrap">
                        <a href="<?= base_url('meu_projeto/pages/livro.html?id=' . urlencode($l['slug'])) ?>" target="_blank" rel="noopener" class="btn btn-sm btn-outline-secondary">Ver no site</a>
                        <a href="<?= site_url('livros/' . $l['id'] . '/editar') ?>" class="btn btn-sm btn-outline-primary">Editar</a>
                        <form method="post" action="<?= site_url('livros/' . $l['id'] . '/excluir') ?>" class="d-inline"
                              onsubmit="return confirm('Excluir este livro? As tarefas dele ficarão sem livro.');">
                            <?= csrf_field() ?>
                            <button class="btn btn-sm btn-outline-danger">Excluir</button>
                        </form>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <div class="mt-3"><?= $pager->links() ?></div>
<?php endif; ?>

<?= $this->endSection() ?>
