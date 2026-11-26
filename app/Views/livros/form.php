<?= $this->extend('layout') ?>
<?= $this->section('titulo') ?><?= $livro ? 'Editar livro' : 'Novo livro' ?><?= $this->endSection() ?>
<?= $this->section('conteudo') ?>
<?php
$acao = $livro ? site_url('livros/' . $livro['id']) : site_url('livros');
$v    = fn(string $campo, $padrao = '') => old($campo, $livro[$campo] ?? $padrao);
?>
<h1 class="h4 mb-3"><?= $livro ? 'Editar livro' : 'Novo livro' ?></h1>

<?php if (empty($categorias)): ?>
    <div class="alert alert-warning">
        Antes de cadastrar um livro, <a href="<?= site_url('categorias/nova') ?>">crie uma categoria</a>.
    </div>
<?php endif; ?>

<form method="post" action="<?= $acao ?>" class="bg-white p-4 shadow-sm rounded" novalidate>
    <?= csrf_field() ?>

    <div class="row">
        <div class="col-md-8 mb-3">
            <label for="titulo" class="form-label">Título *</label>
            <input type="text" id="titulo" name="titulo" class="form-control" maxlength="150" value="<?= esc($v('titulo')) ?>">
        </div>
        <div class="col-md-4 mb-3">
            <label for="slug" class="form-label">Identificador</label>
            <input type="text" id="slug" name="slug" class="form-control" maxlength="60" value="<?= esc($v('slug')) ?>">
            <div class="form-text">Usado na URL do site (ex.: livro05). Em branco, é gerado do título.</div>
        </div>
    </div>

    <div class="mb-3">
        <label for="subtitulo" class="form-label">Subtítulo</label>
        <input type="text" id="subtitulo" name="subtitulo" class="form-control" maxlength="150" value="<?= esc($v('subtitulo')) ?>">
    </div>

    <div class="row">
        <div class="col-md-6 mb-3">
            <label for="categoria_id" class="form-label">Categoria *</label>
            <select id="categoria_id" name="categoria_id" class="form-select">
                <option value="">Escolha...</option>
                <?php foreach ($categorias as $c): ?>
                    <option value="<?= $c['id'] ?>" <?= (string) $v('categoria_id') === (string) $c['id'] ? 'selected' : '' ?>><?= esc($c['nome']) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="col-md-6 mb-3">
            <label for="status" class="form-label">Status *</label>
            <select id="status" name="status" class="form-select">
                <?php foreach (\App\Models\LivroModel::STATUS as $valor => $rotulo): ?>
                    <option value="<?= $valor ?>" <?= $v('status', 'planejamento') === $valor ? 'selected' : '' ?>><?= $rotulo ?></option>
                <?php endforeach; ?>
            </select>
        </div>
    </div>

    <div class="mb-3">
        <label for="sinopse" class="form-label">Sinopse</label>
        <textarea id="sinopse" name="sinopse" rows="4" class="form-control"><?= esc($v('sinopse')) ?></textarea>
    </div>

    <div class="row">
        <div class="col-md-4 mb-3">
            <label for="progresso_atual" class="form-label">Capítulos publicados</label>
            <input type="number" min="0" id="progresso_atual" name="progresso_atual" class="form-control" value="<?= esc($v('progresso_atual', 0)) ?>">
        </div>
        <div class="col-md-4 mb-3">
            <label for="progresso_total" class="form-label">Total previsto</label>
            <input type="number" min="0" id="progresso_total" name="progresso_total" class="form-control" value="<?= esc($v('progresso_total', 0)) ?>">
        </div>
        <div class="col-md-4 mb-3">
            <label for="publicado_em" class="form-label">Ano de publicação</label>
            <input type="text" id="publicado_em" name="publicado_em" class="form-control" maxlength="10" value="<?= esc($v('publicado_em')) ?>">
        </div>
    </div>

    <div class="row">
        <div class="col-md-4 mb-3">
            <label for="capa" class="form-label">Capa</label>
            <input type="text" id="capa" name="capa" class="form-control" placeholder="livros/livro01/capa.webp" value="<?= esc($v('capa')) ?>">
        </div>
        <div class="col-md-4 mb-3">
            <label for="pdf" class="form-label">PDF</label>
            <input type="text" id="pdf" name="pdf" class="form-control" placeholder="livros/livro01/livro.pdf" value="<?= esc($v('pdf')) ?>">
        </div>
        <div class="col-md-4 mb-3">
            <label for="epub" class="form-label">EPUB</label>
            <input type="text" id="epub" name="epub" class="form-control" placeholder="livros/livro01/livro.epub" value="<?= esc($v('epub')) ?>">
        </div>
    </div>
    <p class="form-text">Caminhos relativos à pasta <code>public/meu_projeto</code>.</p>

    <button class="btn btn-success">Salvar livro</button>
    <a href="<?= site_url('livros') ?>" class="btn btn-link">Cancelar</a>
</form>
<?= $this->endSection() ?>
