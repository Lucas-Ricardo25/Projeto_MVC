<?php

namespace App\Models;

use CodeIgniter\Model;

class CategoriaModel extends Model
{
    protected $table         = 'categorias';
    protected $primaryKey    = 'id';
    protected $returnType    = 'array';
    protected $useTimestamps = true;
    protected $allowedFields = ['slug', 'nome', 'descricao'];

    protected $validationRules = [
        'slug'      => 'required|max_length[60]|alpha_dash|is_unique[categorias.slug,id,{id}]',
        'nome'      => 'required|min_length[2]|max_length[80]',
        'descricao' => 'permit_empty|max_length[255]',
    ];

    protected $validationMessages = [
        'slug' => [
            'required'   => 'Informe o identificador da categoria.',
            'alpha_dash' => 'O identificador aceita apenas letras, números, hífen e sublinhado.',
            'is_unique'  => 'Já existe uma categoria com esse identificador.',
        ],
        'nome' => [
            'required'   => 'Informe o nome da categoria.',
            'min_length' => 'O nome precisa ter pelo menos 2 caracteres.',
        ],
    ];
}
