<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

function resource($router, string $prefix, string $controller, array $methods = [
    'index',
    'show',
    'store',
    'update',
    'destroy'
]): void
{
    foreach ($methods as $method) if ($method == 'index') {
        $router->get('/', ['as' => $prefix . '.index', 'uses' => $controller . '@index']);
    } elseif ($method == 'show') {
        $router->get('/{id}', ['as' => $prefix . '.show', 'uses' => $controller . '@show']);
    } elseif ($method == 'store') {
        $router->post('/', ['as' => $prefix . '.store', 'uses' => $controller . '@store']);
    } elseif ($method == 'update') {
        $router->put('/{id}', ['as' => $prefix . '.update', 'uses' => $controller . '@update']);
    } elseif ($method == 'destroy') {
        $router->delete('/{id}', ['as' => $prefix . '.destroy', 'uses' => $controller . '@destroy']);
    }
}

$router->post('auth/login', 'AuthController@login');

$router->group(['middleware' => 'auth'], function () use ($router) {
    $router->group(['prefix' => 'auth'], function () use ($router) {
        $controller = 'AuthController';
        $router->get('logout', $controller . '@logout');
        $router->get('refresh', $controller . '@refresh');
        $router->get('me', $controller . '@me');
    });

    $prefix = 'roles';
    $router->group(['prefix' => $prefix], function () use ($router, $prefix) {
        resource(router: $router, prefix: $prefix, controller: 'RoleController', methods: [
            'index',
            'store',
            'update',
        ]);
    });

    $prefix = 'permissions';
    $router->group(['prefix' => $prefix], function () use ($router, $prefix) {
        resource(router: $router, prefix: $prefix, controller: 'PermissionController', methods: [
            'index',
            'store',
        ]);
    });

    $prefix = 'users';
    $router->group(['prefix' => $prefix], function () use ($router, $prefix) {
        resource(router: $router, prefix: $prefix, controller: 'UserController');
    });

    $router->group(['prefix' => 'categories'], function () use ($router) {
        $router->get('/', 'CategoryController');
    });

    $prefix = 'ad-units';
    $router->group(['prefix' => $prefix], function () use ($router, $prefix) {
        $controller = 'AdUnitController';
        resource(router: $router, prefix: $prefix, controller: $controller, methods: [
            'index',
            'show',
            'store',
            'update'
        ]);
        $router->put('/{id}/assign',$controller . '@assignCreatives');
    });

    $prefix = 'sites';
    $router->group(['prefix' => $prefix], function () use ($router, $prefix) {
        $controller = 'SiteController';
        resource(router: $router, prefix: $prefix, controller: 'SiteController', methods: [
            'index',
            'show',
            'store',
            'update'
        ]);
        $router->get('/verify-ads-txt/{id}', $controller . '@verifyAdsTxt');
    });

    $prefix = 'creatives';
    $router->group(['prefix' => $prefix], function () use ($router, $prefix) {
        resource(router: $router, prefix: $prefix, controller: 'CreativeController');
    });

    $prefix = 'line-items';
    $router->group(['prefix' => $prefix], function () use ($router, $prefix) {
        resource(router: $router, prefix: $prefix, controller: 'LineItemController');
    });

    $router->group(['prefix' => 'common'], function () use ($router) {
        $router->get('sizes', 'CommonController@sizes');
    });

    $prefix = 'students';
    $router->group(['prefix' => $prefix], function () use ($router, $prefix) {
        resource(router: $router, prefix: $prefix, controller: 'StudentController', methods: [
            'index',
            'show',
            'store',
            'update'
        ]);
    });

});
