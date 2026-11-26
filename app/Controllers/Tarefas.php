<?php

namespace App\Controllers;

use App\Models\LivroModel;
use App\Models\TarefaModel;

class Tarefas extends BaseController
{
    private TarefaModel $model;

    public function __construct()
    {
        $this->model = new TarefaModel();
    }

    // RF02 - Listagem (com busca, filtros e paginação)
    public function index()
    {
        $busca  = trim((string) $this->request->getGet('busca'));
        $status = (string) $this->request->getGet('status');
        $livro  = (int) $this->request->getGet('livro');

        $this->model
            ->select('tarefas.*, livros.titulo AS livro_titulo')
            ->join('livros', 'livros.id = tarefas.livro_id', 'left');

        if ($busca !== '') {
            $this->model->like('tarefas.titulo', $busca);
        }
        if (in_array($status, TarefaModel::STATUS, true)) {
            $this->model->where('tarefas.status', $status);
        }
        if ($livro > 0) {
            $this->model->where('tarefas.livro_id', $livro);
        }

        return view('tarefas/index', [
            'tarefas' => $this->model->orderBy('tarefas.created_at', 'DESC')->paginate(10),
            'pager'   => $this->model->pager,
            'livros'  => $this->listaDeLivros(),
            'busca'   => $busca,
            'status'  => $status,
            'livro'   => $livro,
        ]);
    }

    public function nova()
    {
        return view('tarefas/form', ['tarefa' => null, 'livros' => $this->listaDeLivros()]);
    }

    // RF01 - Cadastro / RF05 - Validação
    public function salvar()
    {
        if (! $this->model->insert($this->dadosDoFormulario())) {
            return redirect()->back()->withInput()->with('erros', $this->model->errors());
        }

        return redirect()->to('/tarefas')->with('sucesso', 'Tarefa cadastrada.');
    }

    public function editar(int $id)
    {
        return view('tarefas/form', ['tarefa' => $this->buscar($id), 'livros' => $this->listaDeLivros()]);
    }

    // RF03 - Edição
    public function atualizar(int $id)
    {
        $this->buscar($id);

        if (! $this->model->update($id, $this->dadosDoFormulario())) {
            return redirect()->back()->withInput()->with('erros', $this->model->errors());
        }

        return redirect()->to('/tarefas')->with('sucesso', 'Tarefa atualizada.');
    }

    public function alternarStatus(int $id)
    {
        $tarefa = $this->buscar($id);
        $novo   = $tarefa['status'] === 'concluida' ? 'pendente' : 'concluida';
        $this->model->update($id, ['status' => $novo]);

        return redirect()->back()->with('sucesso', $novo === 'concluida' ? 'Tarefa concluída.' : 'Tarefa reaberta.');
    }

    // RF04 - Exclusão
    public function excluir(int $id)
    {
        $this->buscar($id);
        $this->model->delete($id);

        return redirect()->to('/tarefas')->with('sucesso', 'Tarefa excluída.');
    }

    private function listaDeLivros(): array
    {
        return (new LivroModel())->select('id, titulo')->orderBy('titulo')->findAll();
    }

    private function dadosDoFormulario(): array
    {
        $dados = $this->request->getPost(['titulo', 'descricao', 'prioridade', 'status', 'prazo', 'livro_id']);
        foreach (['prazo', 'livro_id'] as $campo) {
            if (($dados[$campo] ?? '') === '') {
                $dados[$campo] = null;
            }
        }

        return $dados;
    }

    private function buscar(int $id): array
    {
        $tarefa = $this->model->find($id);
        if (! $tarefa) {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound('Tarefa não encontrada.');
        }

        return $tarefa;
    }
}
