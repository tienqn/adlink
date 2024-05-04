<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Vinkla\Hashids\Facades\Hashids;

trait CrudTrait
{
    use CrudVariables;

    public array $bindData = [];


    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $isAccess = $this->checkAccess();
            if (empty($isAccess)) {
                return set_response(statusCode: ResponseAlias::HTTP_FORBIDDEN, messages: [__('app.message_access_denied')]);
            }

            $this->loadModel();

            $query = $this->getModel();
            if ($request->has('trash')) {
                $query = $query->onlyTrashed();
            } else {
                if (!$request->has('filters')) {
                    $query = $query->latest();
                }
            }

            if ($request->has('includes')) {
                $includes = explode(',', $request->input('includes'));
                $query = $query->with($includes);
            }

            if ($request->has('ft')) {
                $query = $this->_conditionSortFilter($query, $request['ft']);
            }

            $query = $this->hookQueryIndex($query, $request);

            if ($request->has('per_page')) {
                $this->setRowsPerPage($request->input('per_page'));
            }

            $paginator = $query->paginate($request->limit ?? $this->getRowsPerPage())->withQueryString();
            $rows = $paginator->getCollection();
            $transformer = $this->getTransformer();
            $response = fractal($rows, new $transformer);
            $this->parseIncludes($response, $request);
            $response->paginateWith(new IlluminatePaginatorAdapter($paginator));
        } catch (TokenExpiredException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_UNAUTHORIZED,
                messages: [__('auth.jwt_token_expired')],
                throwMessage: $e->getMessage(),
            );
        } catch (TokenInvalidException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_UNAUTHORIZED,
                messages: [__('auth.jwt_token_invalid')],
                throwMessage: $e->getMessage(),
            );
        } catch (JWTException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_UNAUTHORIZED,
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
        return $response->respond();
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param string $id
     *
     * @return JsonResponse
     */
    public function show(Request $request, string $id): JsonResponse
    {
        try {
//            $id = Hashids::decodeHex($id);
            $isAccess = $this->checkAccess();
            if (empty($isAccess)) {
                return set_response(statusCode: ResponseAlias::HTTP_FORBIDDEN, messages: [__('app.message_access_denied')]);
            }

            $this->loadModel();
            $row = $this->getModel()::findOrFail($id);
            $this->hookBeforeShow($row, $request);
            $transformer = $this->getTransformer();
            $response = fractal($row, new $transformer);
            $this->parseIncludes($response, $request);
        } catch (TokenExpiredException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_UNAUTHORIZED,
                messages: [__('auth.jwt_token_expired')],
                throwMessage: $e->getMessage(),
            );
        } catch (TokenInvalidException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_UNAUTHORIZED,
                messages: [__('auth.jwt_token_invalid')],
                throwMessage: $e->getMessage(),
            );
        } catch (JWTException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_UNAUTHORIZED,
                messages: [__('app.500_message')],
                throwMessage: $e->getMessage(),
            );
        } catch (ModelNotFoundException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_NOT_FOUND,
                messages: [__('app.404_message')],
                throwMessage: $e->getMessage(),
            );
        } catch (\Exception $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_INTERNAL_SERVER_ERROR,
                messages: [__('app.500_message')],
                throwMessage: $e->getMessage(),
            );
        }

        return $response->respond();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $isAccess = $this->checkAccess();
            if (empty($isAccess)) {
                return set_response(statusCode: ResponseAlias::HTTP_FORBIDDEN, messages: [__('app.message_access_denied')]);
            }

            $this->loadModel();
            if (method_exists($this->getModel(), 'getValidationStoreRules')) {
                $validator = Validator::make($request->all(), $this->getModel()::getValidationStoreRules());
                if ($validator->fails()) {
                    return set_response(statusCode: ResponseAlias::HTTP_UNPROCESSABLE_ENTITY, messages: $validator->errors());
                }
            }

            $this->inputAssignment($request);
            if (empty($this->bindData)) {
                return set_response(statusCode: ResponseAlias::HTTP_BAD_REQUEST, messages: [__('app.message_entity_empty')]);
            }
            $this->hookBeforeAdd($request);

            if ($row = $this->getModel()::create($this->bindData)) {
                $this->hookAfterAdd($row, $request);

                $transformer = $this->getTransformer();
                $response = fractal($row, new $transformer);
                $this->parseIncludes($response, $request);
                return set_response(data: $response->toArray(), statusCode: ResponseAlias::HTTP_OK, messages: [__('app.message_add_successful')]);
            } else {
                return set_response(statusCode: ResponseAlias::HTTP_UNPROCESSABLE_ENTITY, messages: [__('app.message_add_failed')]);
            }
        } catch (TokenExpiredException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_UNAUTHORIZED,
                messages: [__('auth.jwt_token_expired')],
                throwMessage: $e->getMessage(),
            );
        } catch (TokenInvalidException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_UNAUTHORIZED,
                messages: [__('auth.jwt_token_invalid')],
                throwMessage: $e->getMessage(),
            );
        } catch (JWTException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_UNAUTHORIZED,
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

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param string $id
     *
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
//            $id = Hashids::decodeHex($id);
            $isAccess = $this->checkAccess();
            if (empty($isAccess)) {
                return set_response(statusCode: ResponseAlias::HTTP_FORBIDDEN, messages: [__('app.message_access_denied')]);
            }

            $this->loadModel();
            if (method_exists($this->getModel(), 'getValidationUpdateRules')) {
                $validator = Validator::make($request->all(), $this->getModel()::getValidationUpdateRules($id));

                if ($validator->fails()) {
                    return set_response(statusCode: ResponseAlias::HTTP_UNPROCESSABLE_ENTITY, messages: $validator->errors());
                }
            }

            $this->inputAssignment($request);
            if (empty($this->bindData)) {
                return set_response(statusCode: ResponseAlias::HTTP_BAD_REQUEST, messages: [__('app.message_entity_empty')]);
            }
            $row = $this->getModel()::findOrFail($id);

            $this->hookBeforeEdit($row, $request);

            $row->fill($this->bindData);
            if ($row->save()) {
                $this->hookAfterEdit($row, $request);

                $transformer = $this->getTransformer();
                $response = fractal($row, new $transformer);
                $this->parseIncludes($response, $request);
                return set_response(data: $response->toArray(), statusCode: ResponseAlias::HTTP_OK, messages: [__('app.message_update_successful')]);
            } else {
                return set_response(statusCode: ResponseAlias::HTTP_UNPROCESSABLE_ENTITY, messages: __('app.message_update_failed'));
            }
        } catch (TokenExpiredException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_UNAUTHORIZED,
                messages: [__('auth.jwt_token_expired')],
                throwMessage: $e->getMessage(),
            );
        } catch (TokenInvalidException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_UNAUTHORIZED,
                messages: [__('auth.jwt_token_invalid')],
                throwMessage: $e->getMessage(),
            );
        } catch (JWTException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_UNAUTHORIZED,
                messages: [__('app.500_message')],
                throwMessage: $e->getMessage(),
            );
        } catch (ModelNotFoundException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_NOT_FOUND,
                messages: [__('app.404_message')],
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

    /**
     * Remove the specified resource from storage.
     *
     * @param string $id
     *
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        try {
//            $id = Hashids::decodeHex($id);
            $isAccess = $this->checkAccess();
            if (empty($isAccess)) {
                return set_response(statusCode: ResponseAlias::HTTP_FORBIDDEN, messages: [__('app.message_access_denied')]);
            }

            $this->loadModel();

            $row = $this->getModel()::findOrFail($id);
            if ($this->getModelName() === 'User') {
                if ($row->protected) {
                    return set_response(statusCode: ResponseAlias::HTTP_FORBIDDEN, messages: [__('app.message_access_denied')]);
                }

                $user = auth()->user();
                if (strval($user->id) === $id) {
                    return set_response(statusCode: ResponseAlias::HTTP_FORBIDDEN, messages: [__('app.message_not_allow_delete_my_self')]);
                }
            }


            $this->hookBeforeDelete($row);
            if ($row->delete()) {
                $this->hookAfterDelete($id);
                return set_response(statusCode: ResponseAlias::HTTP_OK, messages: [__('app.message_delete_successful')]);
            }
            return set_response(statusCode: ResponseAlias::HTTP_UNPROCESSABLE_ENTITY, messages: [__('app.message_delete_failed')]);
        } catch (TokenExpiredException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_UNAUTHORIZED,
                messages: [__('auth.jwt_token_expired')],
                throwMessage: $e->getMessage(),
            );
        } catch (TokenInvalidException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_UNAUTHORIZED,
                messages: [__('auth.jwt_token_invalid')],
                throwMessage: $e->getMessage(),
            );
        } catch (JWTException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_UNAUTHORIZED,
                messages: [__('app.500_message')],
                throwMessage: $e->getMessage(),
            );
        } catch (ModelNotFoundException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_NOT_FOUND,
                messages: [__('app.404_message')],
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

    /**
     * Restore the specified resource from trash.
     *
     * @param string $id
     *
     * @return JsonResponse
     */
    public function restore(string $id): JsonResponse
    {
        try {
//            $id = Hashids::decodeHex($id);
            $isAccess = $this->checkAccess();
            if (empty($isAccess)) {
                return set_response(statusCode: ResponseAlias::HTTP_FORBIDDEN, messages: [__('app.message_access_denied')]);
            }

            $this->loadModel();
            $row = $this->getModel()::onlyTrashed()->findOrFail($id);
            $this->hookBeforeRestore($row);
            if ($row->restore()) {
                $this->hookAfterRestore($id);
                return set_response(statusCode: ResponseAlias::HTTP_OK, messages: [__('app.message_restore_successful')]);
            }
            return set_response(statusCode: ResponseAlias::HTTP_UNPROCESSABLE_ENTITY, messages: [__('app.message_restore_failed')]);
        } catch (TokenExpiredException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_UNAUTHORIZED,
                messages: [__('auth.jwt_token_expired')],
                throwMessage: $e->getMessage(),
            );
        } catch (TokenInvalidException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_UNAUTHORIZED,
                messages: [__('auth.jwt_token_invalid')],
                throwMessage: $e->getMessage(),
            );
        } catch (JWTException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_UNAUTHORIZED,
                messages: [__('app.500_message')],
                throwMessage: $e->getMessage(),
            );
        } catch (ModelNotFoundException $e) {
            return error_message(
                statusCode: ResponseAlias::HTTP_NOT_FOUND,
                messages: [__('app.404_message')],
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

    /**
     * Condition when query
     *
     * @param       $query
     * @param array $filters
     * @return mixed
     */
    private function _conditionSortFilter($query, array $filters): mixed
    {
        $sorted = [];
        foreach ($filters as $field => $filter) {
            $value = !empty($filter['v']) ? $filter['v'] : null;
            $operator = !empty($filter['o']) ? $filter['o'] : null;
            if ($operator === 'off') {
                continue;
            }

            $sorting = !empty($filter['s']) ? $filter['s'] : null;

            if (!is_null($sorting)) {
                $sorted[$field] = $sorting;
            }

            if (!is_null($sorting)) {
                if ($field) {
                    $query = $query->orderBy($field, $sorting);
                }
            }

            // Filter
            if (!is_null($operator)) {
                $query = match ($operator) {
                    'ne' => $query->where($field, '!=', $value),
                    'gt' => $query->where($field, '>', $value),
                    'ge' => $query->where($field, '>=', $value),
                    'lt' => $query->where($field, '<', $value),
                    'le' => $query->where($field, '<=', $value),
                    'bw' => $query->where($field, 'LIKE', $value . '%'),
                    'bn' => $query->where($field, 'NOT LIKE', $value . '%'),
                    'ew' => $query->where($field, 'LIKE', '%' . $value),
                    'en' => $query->where($field, 'NOT LIKE', '%' . $value),
                    'cn' => $query->where($field, 'LIKE', '%' . $value . '%'),
                    'nc' => $query->where($field, 'NOT LIKE', $value),
                    'nu' => $query->whereNull($field),
                    'nn' => $query->whereNotNull($field),
                    'in' => $query->whereIn($field, explode(',', $value)),
                    'ni' => $query->whereNotIn($field, explode(',', $value)),
                    'bt' => $query->whereBetween($field, $value),
                    default => $query->where($field, $value),
                };
            }

            if (!empty($sorted)) {
                foreach ($sorted as $k => $v) {
                    $query = $query->orderBy($k, $v);
                }
            }
        }

        return $query;
    }



    /**
     * Check user can access current url
     *
     * @return bool
     */
    public function checkAccess(): bool
    {
        // Check access action
        return check_access();
    }

    /**
     * Load model
     */
    protected function loadModel(): void
    {
        if ($this->getModelName()) {
            $this->setModel('\\App\\Models\\' . $this->getModelName());
        }
    }


    /**
     * Input assignment from request
     *
     * @param Request $request
     */
    protected function inputAssignment(Request $request): void
    {
        if (!empty($request->all())) {
            foreach ($request->all() as $fieldName => $value) {
                $this->bindData[$fieldName] = $value;
            }
        }
    }

    /**
     * @param \Spatie\Fractal\Fractal $response
     * @param Request $request
     */
    protected function parseIncludes(\Spatie\Fractal\Fractal $response, Request $request): void
    {
        if ($request->has('includes')) {
            $includes = explode(',', $request->includes);
            $response->parseIncludes($includes);
        }
    }

    # START CUSTOM HOOK

    /**
     * @param $row
     * @param Request $request
     * @return void
     */
    protected function hookBeforeShow($row, Request $request)
    {

    }

    /**
     * @param $query
     * @param Request $request
     * @return mixed
     */
    protected function hookQueryIndex($query, Request $request): mixed
    {
        return $query;
    }

    /**
     * @param Request $request
     * @return void
     */
    protected function hookBeforeAdd(Request $request)
    {
    }

    /**
     * @param $row
     * @param Request $request
     * @return void
     */
    protected function hookAfterAdd($row, Request $request)
    {
    }

    /**
     * @param $row
     * @param Request $request
     * @return void
     */
    protected function hookBeforeEdit($row, Request $request)
    {
    }

    /**
     * @param $row
     * @param Request $request
     * @return void
     */
    protected function hookAfterEdit($row, Request $request)
    {
    }

    /**
     * @param $row
     * @return void
     */
    protected function hookBeforeDelete($row)
    {
    }

    /**
     * @param $id
     * @return void
     */
    protected function hookAfterDelete($id)
    {
    }

    /**
     * @param $row
     * @return void
     */
    protected function hookBeforeRestore($row)
    {
    }

    /**
     * @param $id
     * @return void
     */
    protected function hookAfterRestore($id)
    {
    }
    # END CUSTOM HOOK
}