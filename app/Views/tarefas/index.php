<?= $this->extend('layout') ?>
<?= $this->section('titulo') ?>Tarefas<?= $this->endSection() ?>
<?= $this->section('conteudo') ?>

<div class="d-flex justify-content-between align-items-center mb-3">
    <h1 class="h4 mb-0">Tarefas</h1>
    <a class="btn btn-success" href="<?= site_url('tarefas/nova') ?>">Nova tarefa</a>
</div>

<form method="get" action="<?= site_url('tarefas') ?>" class="row g-2 mb-3">
    <div class="col-md-4">
        <input type="text" name="busca" class="form-control" placeholder="Buscar pelo título" value="<?= esc($busca) ?>">
    </div>
    <div class="col-md-3">
        <select name="livro" class="form-select">
            <option value="">Todos os livros</option>
            <?php foreach ($livros as $l): ?>
                <option value="<?= $l['id'] ?>" <?= $livro === (int) $l['id'] ? 'selected' : '' ?>><?= esc($l['titulo']) ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div class="col-md-3">
        <select name="status" class="form-select">
            <option value="">Todos os status</option>
            <option value="pendente"  <?= $status === 'pendente' ? 'selected' : '' ?>>Pendente</option>
            <option value="andamento" <?= $status === 'andamento' ? 'selected' : '' ?>>Em andamento</option>
            <option value="concluida" <?= $status === 'concluida' ? 'selected' : '' ?>>Concluída</option>
        </select>
    </div>
    <div class="col-md-2 d-grid">
        <button class="btn btn-outline-dark">Filtrar</button>
    </div>
</form>

<?php if (empty($tarefas)): ?>
    <div class="alert alert-secondary">
        Nenhuma tarefa encontrada. <a href="<?= site_url('tarefas/nova') ?>">Cadastre a primeira tarefa</a>.
    </div>
<?php else: ?>
    <div class="table-responsive bg-white shadow-sm rounded">
        <table class="table table-hover align-middle mb-0">
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Livro</th>
                    <th>Prioridade</th>
                    <th>Status</th>
                    <th>Prazo</th>
                    <th class="text-end">Ações</th>
                </tr>
            </thead>
            <tbody>
            <?php
            $corPrioridade = ['baixa' => 'secondary', 'media' => 'warning', 'alta' => 'danger'];
            $corStatus     = ['pendente' => 'secondary', 'andamento' => 'primary', 'concluida' => 'success'];
            $nomeStatus    = ['pendente' => 'Pendente', 'andamento' => 'Em andamento', 'concluida' => 'Concluída'];
            foreach ($tarefas as $t): ?>
                <tr>
                    <td>
                        <span class="<?= $t['status'] === 'concluida' ? 'text-decoration-line-through text-muted' : '' ?>">
                            <?= esc($t['titulo']) ?>
                        </span>
                        <?php if ($t['descricao']): ?>
                            <div class="small text-muted"><?= esc($t['descricao']) ?></div>
                        <?php endif; ?>
                    </td>
                    <td><?= $t['livro_titulo'] ? esc($t['livro_titulo']) : '<span class="text-muted">-</span>' ?></td>
                    <td><span class="badge text-bg-<?= $corPrioridade[$t['prioridade']] ?? 'secondary' ?>"><?= esc(ucfirst($t['prioridade'])) ?></span></td>
                    <td><span class="badge text-bg-<?= $corStatus[$t['status']] ?? 'secondary' ?>"><?= esc($nomeStatus[$t['status']] ?? $t['status']) ?></span></td>
                    <td><?= $t['prazo'] ? esc(date('d/m/Y', strtotime($t['prazo']))) : '-' ?></td>
                    <td class="text-end text-nowrap">
                        <form method="post" action="<?= site_url('tarefas/' . $t['id'] . '/status') ?>" class="d-inline">
                            <?= csrf_field() ?>
                            <button class="btn btn-sm btn-outline-success">
                                <?= $t['status'] === 'concluida' ? 'Reabrir' : 'Concluir' ?>
                            </button>
                        </form>
                        <a href="<?= site_url('tarefas/' . $t['id'] . '/editar') ?>" class="btn btn-sm btn-outline-primary">Editar</a>
                        <form method="post" action="<?= site_url('tarefas/' . $t['id'] . '/excluir') ?>" class="d-inline"
                              onsubmit="return confirm('Excluir esta tarefa?');">
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
