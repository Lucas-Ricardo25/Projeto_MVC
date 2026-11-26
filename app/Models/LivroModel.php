<?php

namespace App\Models;

use CodeIgniter\Model;

class LivroModel extends Model
{
    public const STATUS = [
        'andamento'    => 'Em andamento',
        'concluido'    => 'Concluído',
        'planejamento' => 'Planejamento',
        'pausado'      => 'Pausado',
    ];

    protected $table         = 'livros';
    protected $primaryKey    = 'id';
    protected $returnType    = 'array';
    protected $useTimestamps = true;
    protected $allowedFields = [
        'slug', 'titulo', 'subtitulo', 'status', 'categoria_id', 'sinopse',
        'progresso_atual', 'progresso_total', 'capa', 'pdf', 'epub', 'publicado_em',
    ];

    protected $validationRules = [
        'slug'            => 'required|max_length[60]|alpha_dash|is_unique[livros.slug,id,{id}]',
        'titulo'          => 'required|min_length[2]|max_length[150]',
        'subtitulo'       => 'permit_empty|max_length[150]',
        'status'          => 'required|in_list[andamento,concluido,planejamento,pausado]',
        'categoria_id'    => 'required|is_natural_no_zero|is_not_unique[categorias.id]',
        'sinopse'         => 'permit_empty|max_length[2000]',
        'progresso_atual' => 'permit_empty|is_natural',
        'progresso_total' => 'permit_empty|is_natural',
        'capa'            => 'permit_empty|max_length[255]',
        'pdf'             => 'permit_empty|max_length[255]',
        'epub'            => 'permit_empty|max_length[255]',
        'publicado_em'    => 'permit_empty|max_length[10]',
    ];

    protected $validationMessages = [
        'slug' => [
            'required'   => 'Informe o identificador do livro (ex.: livro05).',
            'alpha_dash' => 'O identificador aceita apenas letras, números, hífen e sublinhado.',
            'is_unique'  => 'Já existe um livro com esse identificador.',
        ],
        'titulo' => [
            'required'   => 'Informe o título do livro.',
            'min_length' => 'O título precisa ter pelo menos 2 caracteres.',
        ],
        'status' => [
            'required' => 'Escolha o status.',
            'in_list'  => 'Status inválido.',
        ],
        'categoria_id' => [
            'required'         => 'Escolha a categoria.',
            'is_not_unique'    => 'Categoria inexistente.',
            'is_natural_no_zero' => 'Escolha a categoria.',
        ],
        'progresso_atual' => ['is_natural' => 'O progresso atual deve ser um número inteiro.'],
        'progresso_total' => ['is_natural' => 'O total de capítulos deve ser um número inteiro.'],
    ];
}
