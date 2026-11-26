<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Tarefas::index');

// Tarefas
$routes->get('tarefas', 'Tarefas::index');
$routes->get('tarefas/nova', 'Tarefas::nova');
$routes->post('tarefas', 'Tarefas::salvar');
$routes->get('tarefas/(:num)/editar', 'Tarefas::editar/$1');
$routes->post('tarefas/(:num)', 'Tarefas::atualizar/$1');
$routes->post('tarefas/(:num)/status', 'Tarefas::alternarStatus/$1');
$routes->post('tarefas/(:num)/excluir', 'Tarefas::excluir/$1');

// Livros
$routes->get('livros', 'Livros::index');
$routes->get('livros/novo', 'Livros::novo');
$routes->post('livros', 'Livros::salvar');
$routes->get('livros/(:num)/editar', 'Livros::editar/$1');
$routes->post('livros/(:num)', 'Livros::atualizar/$1');
$routes->post('livros/(:num)/excluir', 'Livros::excluir/$1');

// Categorias
$routes->get('categorias', 'Categorias::index');
$routes->get('categorias/nova', 'Categorias::nova');
$routes->post('categorias', 'Categorias::salvar');
$routes->get('categorias/(:num)/editar', 'Categorias::editar/$1');
$routes->post('categorias/(:num)', 'Categorias::atualizar/$1');
$routes->post('categorias/(:num)/excluir', 'Categorias::excluir/$1');

// Dados do banco para o site estático (meu_projeto)
$routes->get('api/livros.js', 'Api::livrosJs');
