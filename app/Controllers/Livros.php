<?php

namespace App\Controllers;

use App\Models\CategoriaModel;
use App\Models\LivroModel;

class Livros extends BaseController
{
    private LivroModel $model;

    public function __construct()
    {
        $this->model = new LivroModel();
    }

    public function index()
    {
        $busca     = trim((string) $this->request->getGet('busca'));
        $categoria = (int) $this->request->getGet('categoria');
        $status    = (string) $this->request->getGet('status');

        $this->model
            ->select('livros.*, categorias.nome AS categoria_nome, (SELECT COUNT(*) FROM tarefas WHERE tarefas.livro_id = livros.id) AS total_tarefas', false)
            ->join('categorias', 'categorias.id = livros.categoria_id', 'left');

        if ($busca !== '') {
            $this->model->like('livros.titulo', $busca);
        }
        if ($categoria > 0) {
            $this->model->where('livros.categoria_id', $categoria);
        }
        if (array_key_exists($status, LivroModel::STATUS)) {
            $this->model->where('livros.status', $status);
        }

        return view('livros/index', [
            'livros'     => $this->model->orderBy('livros.titulo')->paginate(10),
            'pager'      => $this->model->pager,
            'categorias' => (new CategoriaModel())->orderBy('nome')->findAll(),
            'busca'      => $busca,
            'categoria'  => $categoria,
            'status'     => $status,
        ]);
    }

    public function novo()
    {
        return view('livros/form', ['livro' => null, 'categorias' => $this->categorias()]);
    }

    public function salvar()
    {
        if (! $this->model->insert($this->dadosDoFormulario())) {
            return redirect()->back()->withInput()->with('erros', $this->model->errors());
        }

        return redirect()->to('/livros')->with('sucesso', 'Livro cadastrado.');
    }

    public function editar(int $id)
    {
        return view('livros/form', ['livro' => $this->buscar($id), 'categorias' => $this->categorias()]);
    }

    public function atualizar(int $id)
    {
        $this->buscar($id);
        $dados       = $this->dadosDoFormulario();
        $dados['id'] = $id; // necessário para a regra is_unique ignorar o próprio registro

        if (! $this->model->save($dados)) {
            return redirect()->back()->withInput()->with('erros', $this->model->errors());
        }

        return redirect()->to('/livros')->with('sucesso', 'Livro atualizado.');
    }

    public function excluir(int $id)
    {
        $this->buscar($id);
        $this->model->delete($id); // as tarefas do livro ficam sem livro (ON DELETE SET NULL)

        return redirect()->to('/livros')->with('sucesso', 'Livro excluído.');
    }

    private function categorias(): array
    {
        return (new CategoriaModel())->orderBy('nome')->findAll();
    }

    private function dadosDoFormulario(): array
    {
        helper('url');

        $campos = ['slug', 'titulo', 'subtitulo', 'status', 'categoria_id', 'sinopse',
                   'progresso_atual', 'progresso_total', 'publicado_em', 'capa', 'pdf', 'epub'];
        $dados = array_map(
            static fn ($v) => is_string($v) ? trim($v) : $v,
            $this->request->getPost($campos)
        );

        if ($dados['slug'] === '') {
            $dados['slug'] = url_title($dados['titulo'], '-', true);
        }
        foreach (['progresso_atual', 'progresso_total'] as $campo) {
            if ($dados[$campo] === '') {
                $dados[$campo] = 0;
            }
        }

        return $dados;
    }

    private function buscar(int $id): array
    {
        $livro = $this->model->find($id);
        if (! $livro) {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound('Livro não encontrado.');
        }

        return $livro;
    }
}
