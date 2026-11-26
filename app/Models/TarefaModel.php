<?php

namespace App\Models;

use CodeIgniter\Model;

class TarefaModel extends Model
{
    public const STATUS      = ['pendente', 'andamento', 'concluida'];
    public const PRIORIDADES = ['baixa', 'media', 'alta'];

    protected $table         = 'tarefas';
    protected $primaryKey    = 'id';
    protected $returnType    = 'array';
    protected $useTimestamps = true;
    protected $allowedFields = ['titulo', 'descricao', 'prioridade', 'status', 'prazo', 'livro_id'];

    protected $validationRules = [
        'titulo'     => 'required|min_length[3]|max_length[120]',
        'descricao'  => 'permit_empty|max_length[1000]',
        'prioridade' => 'required|in_list[baixa,media,alta]',
        'status'     => 'required|in_list[pendente,andamento,concluida]',
        'prazo'      => 'permit_empty|valid_date[Y-m-d]',
        'livro_id'   => 'permit_empty|is_natural_no_zero|is_not_unique[livros.id]',
    ];

    protected $validationMessages = [
        'titulo' => [
            'required'   => 'Informe o título da tarefa.',
            'min_length' => 'O título precisa ter pelo menos 3 caracteres.',
            'max_length' => 'O título pode ter no máximo 120 caracteres.',
        ],
        'descricao' => [
            'max_length' => 'A descrição pode ter no máximo 1000 caracteres.',
        ],
        'prioridade' => [
            'required' => 'Escolha a prioridade.',
            'in_list'  => 'Prioridade inválida.',
        ],
        'status' => [
            'required' => 'Escolha o status.',
            'in_list'  => 'Status inválido.',
        ],
        'prazo' => [
            'valid_date' => 'Informe uma data válida.',
        ],
        'livro_id' => [
            'is_not_unique' => 'Livro inexistente.',
        ],
    ];
}
