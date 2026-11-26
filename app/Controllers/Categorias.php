<?php

namespace App\Controllers;

use App\Models\CategoriaModel;
use App\Models\LivroModel;

class Categorias extends BaseController
{
    private CategoriaModel $model;

    public function __construct()
    {
        $this->model = new CategoriaModel();
    }

    public function index()
    {
        $this->model->select('categorias.*, (SELECT COUNT(*) FROM livros WHERE livros.categoria_id = categorias.id) AS total_livros', false);

        return view('categorias/index', ['categorias' => $this->model->orderBy('nome')->findAll()]);
    }

    public function nova()
    {
        return view('categorias/form', ['categoria' => null]);
    }

    public function salvar()
    {
        if (! $this->model->insert($this->dadosDoFormulario())) {
            return redirect()->back()->withInput()->with('erros', $this->model->errors());
        }

        return redirect()->to('/categorias')->with('sucesso', 'Categoria cadastrada.');
    }

    public function editar(int $id)
    {
        return view('categorias/form', ['categoria' => $this->buscar($id)]);
    }

    public function atualizar(int $id)
    {
        $this->buscar($id);
        $dados       = $this->dadosDoFormulario();
        $dados['id'] = $id;

        if (! $this->model->save($dados)) {
            return redirect()->back()->withInput()->with('erros', $this->model->errors());
        }

        return redirect()->to('/categorias')->with('sucesso', 'Categoria atualizada.');
    }

    public function excluir(int $id)
    {
        $this->buscar($id);

        if ((new LivroModel())->where('categoria_id', $id)->countAllResults() > 0) {
            return redirect()->to('/categorias')->with('erros', ['Não é possível excluir: existem livros nesta categoria.']);
        }

        $this->model->delete($id);

        return redirect()->to('/categorias')->with('sucesso', 'Categoria excluída.');
    }

    private function dadosDoFormulario(): array
    {
        helper('url');

        $dados = array_map(
            static fn ($v) => is_string($v) ? trim($v) : $v,
            $this->request->getPost(['slug', 'nome', 'descricao'])
        );
        if ($dados['slug'] === '') {
            $dados['slug'] = url_title($dados['nome'], '-', true);
        }

        return $dados;
    }

    private function buscar(int $id): array
    {
        $categoria = $this->model->find($id);
        if (! $categoria) {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound('Categoria não encontrada.');
        }

        return $categoria;
    }
}
