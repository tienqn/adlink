<?php

/**
 * @param array|null $data
 * @param int $statusCode
 * @param null $messages
 *
 * @return \Illuminate\Http\JsonResponse
 */
function set_response(array $data = null, int $statusCode = 200, $messages = null): \Illuminate\Http\JsonResponse
{
    $result = [];

    if (!empty($data)) {
        $result['data'] = $data;
    }

    if (!empty($messages)) {
        $result['messages'] = $messages;
    }

    return response()->json(
        $result,
        $statusCode
    );
}

/**
 * @param string|null $controller
 * @param string|null $action
 * @return bool
 */
function check_access(string $controller = null, string $action = null): bool
{
    $user = auth()->user();
    // dd([app('request')->route(), $user]);
    if (empty($user)) {
        return false;
    }

    if (empty($controller) && empty($action)) {
        list($found, $route, $params) = app('request')->route() ?: [false, [], []];
        $route_name = $route['as'];
        list($controller, $action) = explode('.', $route_name);
    }
    $action = abilities($action);

    // dd([
    //     'action' => $action,
    // ]);

    return $user->can("{$action}|{$controller}");
}

/**
 * Get abilities by method
 *
 * @param null $method
 *
 * @return array|mixed|null
 */
function abilities($method = null): mixed
{
    $abilities = [
        'index' => 'view',
        'edit' => 'edit',
        'show' => 'view',
        'update' => 'edit',
        'create' => 'add',
        'store' => 'add',
        'destroy' => 'delete',
        'edit_status' => 'edit_status',
        'reload_cache' => 'edit',
        'restore' => 'delete',
    ];

    return $method ? (!empty($abilities[$method]) ? $abilities[$method] : $method) : $abilities;
}

/**
 * Generates an error message response.
 *
 * @param int $statusCode The status code of the response.
 * @param array|null $messages An array of error messages (optional).
 * @param string|null $throwMessage A specific error message to be thrown (optional).
 *
 * @return \Illuminate\Http\JsonResponse The generated error message response.
 */
function error_message(int $statusCode, array $messages = null, string $throwMessage = null): \Illuminate\Http\JsonResponse
{
    if (app()->environment('local', 'develop', 'staging') && !empty($throwMessage)) {
        return set_response(statusCode: $statusCode, messages: [$throwMessage]);
    }
    return set_response(statusCode: $statusCode, messages: $messages);
}

/**
 * Check user is admin?
 *
 * @param string|null $user_id
 *
 * @return bool
 */
function is_admin(string $user_id = null): bool
{
    $user = empty($user_id) ? auth()->user() : \App\Models\User::findOrFail($user_id);
    $user_roles = $user->getRoleNames();

    if (in_array('Administrator', $user_roles->toArray())) {
        return true;
    }

    return false;
}

/**
 * Return a formatted string
 *
 * @param string $format
 * @param array $arr
 *
 * @return string
 */
function sprintf_array(string $format, array $arr): string
{
    return call_user_func_array('sprintf', array_merge((array)$format, $arr));
}

function dump_sql($connection = 'mongodb'): void
{
    $db = app('db')->connection($connection);

    $db->enableQueryLog();

    $db->listen(function ($sql) {

        $singleSql = $sql->sql;

        if ($sql->bindings) {
            foreach ($sql->bindings as $replace) {
                $value = is_numeric($replace) ? $replace : "'" . $replace . "'";
                $singleSql = preg_replace('/\?/', $value, $singleSql, 1);
            }
        }

        dump($singleSql);
    });
}