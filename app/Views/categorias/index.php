<?= $this->extend('layout') ?>
<?= $this->section('titulo') ?>Categorias<?= $this->endSection() ?>
<?= $this->section('conteudo') ?>

<div class="d-flex justify-content-between align-items-center mb-3">
    <h1 class="h4 mb-0">Categorias</h1>
    <a class="btn btn-success" href="<?= site_url('categorias/nova') ?>">Nova categoria</a>
</div>

<?php if (empty($categorias)): ?>
    <div class="alert alert-secondary">
        Nenhuma categoria cadastrada. <a href="<?= site_url('categorias/nova') ?>">Crie a primeira categoria</a>.
    </div>
<?php else: ?>
    <div class="table-responsive bg-white shadow-sm rounded">
        <table class="table table-hover align-middle mb-0">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Identificador</th>
                    <th>Livros</th>
                    <th class="text-end">Ações</th>
                </tr>
            </thead>
            <tbody>
            <?php foreach ($categorias as $c): ?>
                <tr>
                    <td>
                        <?= esc($c['nome']) ?>
                        <div class="small text-muted"><?= esc($c['descricao']) ?></div>
                    </td>
                    <td><code><?= esc($c['slug']) ?></code></td>
                    <td><a href="<?= site_url('livros?categoria=' . $c['id']) ?>"><?= (int) $c['total_livros'] ?></a></td>
                    <td class="text-end text-nowrap">
                        <a href="<?= site_url('categorias/' . $c['id'] . '/editar') ?>" class="btn btn-sm btn-outline-primary">Editar</a>
                        <form method="post" action="<?= site_url('categorias/' . $c['id'] . '/excluir') ?>" class="d-inline"
                              onsubmit="return confirm('Excluir esta categoria?');">
                            <?= csrf_field() ?>
                            <button class="btn btn-sm btn-outline-danger">Excluir</button>
                        </form>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
<?php endif; ?>

<?= $this->endSection() ?>
