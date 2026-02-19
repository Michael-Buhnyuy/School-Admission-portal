<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// API Routes
$routes->group('api', ['namespace' => 'App\Controllers\API'], function ($routes) {
    // Auth routes (public)
    $routes->post('auth/login', 'AuthController::login');
    $routes->post('auth/signup', 'AuthController::signup');
    $routes->post('auth/forgot-password', 'AuthController::forgotPassword');
    $routes->post('auth/reset-password', 'AuthController::resetPassword');
    
    // Auth routes (protected)
    $routes->get('auth/user', 'AuthController::user', ['filter' => 'auth']);
    $routes->post('auth/logout', 'AuthController::logout', ['filter' => 'auth']);
    $routes->put('auth/update-profile', 'AuthController::updateProfile', ['filter' => 'auth']);
    $routes->post('auth/change-password', 'AuthController::changePassword', ['filter' => 'auth']);
});

// Default route
$routes->get('/', 'Home::index');
