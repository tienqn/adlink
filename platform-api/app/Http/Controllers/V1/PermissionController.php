<?php

namespace App\Http\Controllers\V1;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Traits\CrudTrait;
use App\Transformers\PermissionTransformer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class PermissionController extends Controller
{
    use CrudTrait;

    public function __construct()
    {
        $this->setModelName('Permission');
        $this->setTransformer('Permission');
    }


    protected function hookQueryIndex($query, Request $request): mixed
    {
        $user = auth()->user();
        $hasRoleManager = $user->roles()->where('level', config('constants.level_role')['Manager'])->exists();
        if (!$hasRoleManager) {
            return $query;
        }
        return $query->where(function ($query) {
            $query->where('name', 'NOT LIKE', '%roles%')
                ->where('name', 'NOT LIKE', '%permissions%');
        })->orWhereIn('name', [
            'view|roles',
            'view|permissions',
        ]);
    }
    /**
     * Validate the store role request.
     *
     * @return \Illuminate\Contracts\Validation\Validator
     *
     */
    protected function validateStorePermission($request)
    {
        return Validator::make($request->all(), [
            'controller' => 'required|string',
            'actions' => 'required',
        ]);
    }

    /**
     * Handle a Store Permission request to the application.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $is_access = check_access();
        if (empty($is_access)) {
            return error_message(
                statusCode: ResponseAlias::HTTP_FORBIDDEN,
                messages: [__('app.message_access_denied')],
            );
        }

        $validator = $this->validateStorePermission($request);
        if ($validator->fails()) {
            return set_response(statusCode: ResponseAlias::HTTP_UNPROCESSABLE_ENTITY, messages: $validator->errors());
        }

        try {
            $controller = Str::plural($request->controller);
            $actions = array_map('trim', explode(",", $request->actions));
            $data = [];
            foreach ($actions as $action) {
                if ($row = Permission::updateOrCreate(['name' => "{$action}|{$controller}"])) {
                    $data[] = $row;
                }
            }

            if (!empty($data)) {
                return set_response(data: fractal($data, new PermissionTransformer)->toArray(), statusCode: ResponseAlias::HTTP_OK, messages: [__('app.message_add_successful')]);
            } else {
                return set_response(statusCode: ResponseAlias::HTTP_BAD_REQUEST, messages: [__('app.message_add_failed')]);
            }
        } catch (TokenExpiredException $e) {
            return error_message(
                statusCode: 430,
                messages: [__('auth.jwt_token_expired')],
                throwMessage: $e->getMessage(),
            );
        } catch (TokenInvalidException $e) {
            return error_message(
                statusCode: 430,
                messages: [__('auth.jwt_token_invalid')],
                throwMessage: $e->getMessage(),
            );
        } catch (JWTException $e) {
            return error_message(
                statusCode: 430,
                messages: [__('app.500_message')],
                throwMessage: $e->getMessage(),
            );
        } catch (\Exception $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR,
                messages: [__('app.500_message')],
                throwMessage: $e->getMessage(),
            );
        }
    }
}