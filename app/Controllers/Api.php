<?php

namespace App\Controllers;

use App\Models\CategoriaModel;
use App\Models\LivroModel;

/**
 * Entrega os livros e categorias do banco no formato que o site estático
 * (public/meu_projeto) espera em window.LIBRARY_SEED. Os capítulos continuam
 * vindo de data/library.js (livros com o mesmo id).
 */
class Api extends BaseController
{
    public function livrosJs()
    {
        $categorias = (new CategoriaModel())->orderBy('nome')->findAll();
        $slugPorId  = array_column($categorias, 'slug', 'id');

        $categories = array_map(static fn ($c) => [
            'id'          => $c['slug'],
            'name'        => $c['nome'],
            'description' => $c['descricao'] ?? '',
        ], $categorias);

        $books = array_map(static fn ($l) => [
            'id'          => $l['slug'],
            'title'       => $l['titulo'],
            'subtitle'    => $l['subtitulo'] ?? '',
            'status'      => $l['status'],
            'category'    => $slugPorId[$l['categoria_id']] ?? '',
            'synopsis'    => $l['sinopse'] ?? '',
            'progress'    => ['current' => (int) $l['progresso_atual'], 'total' => (int) $l['progresso_total']],
            'cover'       => $l['capa'] ?? '',
            'pdf'         => $l['pdf'] ?? '',
            'epub'        => $l['epub'] ?? '',
            'publishedAt' => $l['publicado_em'] ?? '',
            'updatedAt'   => substr((string) $l['updated_at'], 0, 10),
        ], (new LivroModel())->orderBy('id')->findAll());

        $json = json_encode(
            ['categories' => $categories, 'books' => $books],
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG
        );

        $js = '(function(){var s=window.LIBRARY_SEED;if(!s){return;}'
            . 'var d=' . $json . ';'
            . 'var old={};(s.books||[]).forEach(function(b){old[b.id]=b;});'
            . 'd.books.forEach(function(b){b.chapters=(old[b.id]&&old[b.id].chapters)||[];});'
            . 's.categories=d.categories;s.books=d.books;})();';

        return $this->response
            ->setContentType('application/javascript')
            ->setHeader('Cache-Control', 'no-store')
            ->setBody($js);
    }
}
