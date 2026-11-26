<?= $this->extend('layout') ?>
<?= $this->section('titulo') ?><?= $categoria ? 'Editar categoria' : 'Nova categoria' ?><?= $this->endSection() ?>
<?= $this->section('conteudo') ?>
<?php
$acao = $categoria ? site_url('categorias/' . $categoria['id']) : site_url('categorias');
$v    = fn(string $campo, $padrao = '') => old($campo, $categoria[$campo] ?? $padrao);
?>
<h1 class="h4 mb-3"><?= $categoria ? 'Editar categoria' : 'Nova categoria' ?></h1>

<form method="post" action="<?= $acao ?>" class="bg-white p-4 shadow-sm rounded" novalidate>
    <?= csrf_field() ?>

    <div class="row">
        <div class="col-md-8 mb-3">
            <label for="nome" class="form-label">Nome *</label>
            <input type="text" id="nome" name="nome" class="form-control" maxlength="80" value="<?= esc($v('nome')) ?>">
        </div>
        <div class="col-md-4 mb-3">
            <label for="slug" class="form-label">Identificador</label>
            <input type="text" id="slug" name="slug" class="form-control" maxlength="60" value="<?= esc($v('slug')) ?>">
            <div class="form-text">Em branco, é gerado do nome.</div>
        </div>
    </div>

    <div class="mb-3">
        <label for="descricao" class="form-label">Descrição</label>
        <input type="text" id="descricao" name="descricao" class="form-control" maxlength="255" value="<?= esc($v('descricao')) ?>">
    </div>

    <button class="btn btn-success">Salvar categoria</button>
    <a href="<?= site_url('categorias') ?>" class="btn btn-link">Cancelar</a>
</form>
<?= $this->endSection() ?>
