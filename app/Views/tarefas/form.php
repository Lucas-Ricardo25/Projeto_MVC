<?= $this->extend('layout') ?>
<?= $this->section('titulo') ?><?= $tarefa ? 'Editar tarefa' : 'Nova tarefa' ?><?= $this->endSection() ?>
<?= $this->section('conteudo') ?>
<?php
$acao = $tarefa ? site_url('tarefas/' . $tarefa['id']) : site_url('tarefas');
$v    = fn(string $campo, $padrao = '') => old($campo, $tarefa[$campo] ?? $padrao);
?>
<h1 class="h4 mb-3"><?= $tarefa ? 'Editar tarefa' : 'Nova tarefa' ?></h1>

<form method="post" action="<?= $acao ?>" class="bg-white p-4 shadow-sm rounded" novalidate>
    <?= csrf_field() ?>

    <div class="mb-3">
        <label for="titulo" class="form-label">Título *</label>
        <input type="text" id="titulo" name="titulo" class="form-control" maxlength="120" value="<?= esc($v('titulo')) ?>">
    </div>

    <div class="mb-3">
        <label for="descricao" class="form-label">Descrição</label>
        <textarea id="descricao" name="descricao" rows="3" class="form-control"><?= esc($v('descricao')) ?></textarea>
    </div>

    <div class="mb-3">
        <label for="livro_id" class="form-label">Livro</label>
        <select id="livro_id" name="livro_id" class="form-select">
            <option value="">Sem livro</option>
            <?php foreach ($livros as $l): ?>
                <option value="<?= $l['id'] ?>" <?= (string) $v('livro_id') === (string) $l['id'] ? 'selected' : '' ?>><?= esc($l['titulo']) ?></option>
            <?php endforeach; ?>
        </select>
    </div>

    <div class="row">
        <div class="col-md-4 mb-3">
            <label for="prioridade" class="form-label">Prioridade *</label>
            <select id="prioridade" name="prioridade" class="form-select">
                <?php foreach (['baixa' => 'Baixa', 'media' => 'Média', 'alta' => 'Alta'] as $valor => $rotulo): ?>
                    <option value="<?= $valor ?>" <?= $v('prioridade', 'media') === $valor ? 'selected' : '' ?>><?= $rotulo ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="col-md-4 mb-3">
            <label for="status" class="form-label">Status *</label>
            <select id="status" name="status" class="form-select">
                <?php foreach (['pendente' => 'Pendente', 'andamento' => 'Em andamento', 'concluida' => 'Concluída'] as $valor => $rotulo): ?>
                    <option value="<?= $valor ?>" <?= $v('status', 'pendente') === $valor ? 'selected' : '' ?>><?= $rotulo ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="col-md-4 mb-3">
            <label for="prazo" class="form-label">Prazo</label>
            <input type="date" id="prazo" name="prazo" class="form-control" value="<?= esc($v('prazo')) ?>">
        </div>
    </div>

    <button class="btn btn-success">Salvar tarefa</button>
    <a href="<?= site_url('tarefas') ?>" class="btn btn-link">Cancelar</a>
</form>
<?= $this->endSection() ?>
