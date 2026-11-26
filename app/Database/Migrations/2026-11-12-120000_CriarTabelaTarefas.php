<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CriarTabelaTarefas extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'         => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'titulo'     => ['type' => 'VARCHAR', 'constraint' => 120],
            'descricao'  => ['type' => 'TEXT', 'null' => true],
            'prioridade' => ['type' => 'VARCHAR', 'constraint' => 10, 'default' => 'media'],
            'status'     => ['type' => 'VARCHAR', 'constraint' => 15, 'default' => 'pendente'],
            'prazo'      => ['type' => 'DATE', 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('tarefas');
    }

    public function down()
    {
        $this->forge->dropTable('tarefas');
    }
}
