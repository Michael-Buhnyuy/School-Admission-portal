<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// API Routes for Authentication (with CORS filter)
$routes->post('api/auth/login', 'Api\AuthController::login', ['filter' => 'cors']);
$routes->post('api/auth/signup', 'Api\AuthController::signup', ['filter' => 'cors']);
$routes->post('api/auth/logout', 'Api\AuthController::logout', ['filter' => 'cors']);
