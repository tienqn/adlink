<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Models\Creative;
use App\Repositories\AdUnitRepository;
use App\Repositories\CreativeRepository;
use App\Services\AdUnitCacheService;
use App\Traits\CrudTrait;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class AdUnitController extends Controller
{
    use CrudTrait;
    protected $creativeRepo;
    protected $adUnitRepo;
    protected $adUnitCacheService;
    public function __construct(
        CreativeRepository $creativeRepo,
        AdUnitRepository $adUnitRepo,
        AdUnitCacheService $adUnitCacheService
    )
    {
        $this->creativeRepo = $creativeRepo;
        $this->adUnitRepo = $adUnitRepo;
        $this->adUnitCacheService = $adUnitCacheService;
        $this->setModelName('AdUnit');
        $this->setTransformer('AdUnit');
    }

    protected function hookQueryIndex($query, Request $request): mixed
    {
        $user = auth()->user();
        $hasManageRole = $user->roles()->where('level','<=', config('constants.level_role')['Manager'])->exists();
        if ($hasManageRole) {
            return $query;
        }
        return $query->where('publisher_id', $user->_id);
    }

    protected function hookBeforeAdd(Request $request)
   {
       $user = auth()->user();
       if($user) {
           $this->bindData['publisher_id'] = $user->_id;
       }
   }

    protected function hookAfterAdd($row, Request $request)
    {
        $creativeIds = $request->input('creative_ids', []);
        if (!empty($creativeIds)) {
            $row->creatives()->sync($creativeIds);
            $this->syncLineItems($creativeIds, $row);
            $this->adUnitCacheService->setCacheAdUnit($row);
        }
    }

    protected function hookBeforeEdit($row, Request $request)
    {
        unset($this->bindData['code']);
        if ($sizes = $request->input('sizes')) {
            $creativeIds = $row['creative_ids'] ?? [];
            $creativeSizes = $this->creativeRepo->findByIds($creativeIds)
                ->pluck('size')
                ->unique()
                ->toArray();
            $compare = array_diff($creativeSizes, $sizes);
            if (count($compare) > 0) {
              throw new \Exception(__('app.message_adunit_not_fit_in_size_creative'));
            }
        }
    }

    protected function hookAfterEdit($row, Request $request)
    {
        $creativeIds = $request->input('creative_ids', []);
        if (!empty($creativeIds)) {
            $row->creatives()->sync($creativeIds);
            $this->syncLineItems($creativeIds, $row);
            $this->adUnitCacheService->setCacheAdUnit($row);
        }
    }

    protected function hookBeforeShow($row, Request $request)
    {
        $user = auth()->user();
        $hasManageRole = $user->roles()->where('level','<=', config('constants.level_role')['Manager'])->exists();
        if (!$hasManageRole && $row['publisher_id'] !== $user->_id) {
            throw new \Exception(__('app.message_access_denied'), ResponseAlias::HTTP_FORBIDDEN);
        }
    }

    public function assignCreatives($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'creative_ids' => 'nullable',
            'creative_ids.*' => 'exists:creatives,_id',

        ]);
        if ($validator->fails()) {
            return set_response(statusCode: ResponseAlias::HTTP_UNPROCESSABLE_ENTITY, messages: $validator->errors());
        }
        $creativeIds = $request->input('creative_ids', []);
        $row = $this->adUnitRepo->find($id);
        if (empty($row)) {
            return error_message(
                statusCode: ResponseAlias::HTTP_NOT_FOUND,
                messages: [__('app.404_message')],
                throwMessage: __('app.404_message'),
            );
        }

        $sizes = $row['sizes'];
        $creativeSizes = $this->creativeRepo->findByIds($creativeIds)
            ->pluck('size')
            ->unique()
            ->toArray();
        $compare = array_diff($creativeSizes, $sizes);
        if (count($compare) > 0) {
            return error_message(
                statusCode: ResponseAlias::HTTP_CONFLICT,
                messages: [__('app.message_creative_not_fit_in_size')],
                throwMessage: __('app.message_creative_not_fit_in_size'),
            );
        }
        if (empty($creativeIds)) {
            $row->creatives()->sync([]);
            $row->lineItems()->sync([]);
            $row->position = null;
            $row->save();
        } else {
            $row->position = $creativeIds;
            $row->save();
            $row->creatives()->sync($creativeIds);
            $this->syncLineItems($creativeIds, $row);
        }

        $this->adUnitCacheService->setCacheAdUnit($row);
        $transformer = $this->getTransformer();
        $response = fractal($row, new $transformer);
        $this->parseIncludes($response, $request);
        return set_response(data: $response->toArray(), statusCode: ResponseAlias::HTTP_OK, messages: [__('app.message_add_successful')]);

    }

    public function show(Request $request, string $id): JsonResponse
    {
        try {
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
        $results = $response->toArray();
        $results['data']['creatives']['data'] = $this->adUnitRepo->sortCreativeByPosition(
            Arr::get($results,'data.creatives.data', []),
            Arr::get($results,'data.position', [])
        );
        return set_response(data: $results['data'], statusCode: ResponseAlias::HTTP_OK, messages: [__('app.message_add_successful')]);
    }

    protected function syncLineItems(array $creativeIds, $row)
    {
        $creatives = Creative::with('lineItems')
            ->whereIn('_id', $creativeIds)
            ->get();
        $lineItemIds = [];
        foreach ($creatives as $creative) {
            if (empty($creative->line_item_ids)) {
                continue;
            }
            $lineItemIds = array_merge($lineItemIds, $creative->line_item_ids);
        }
        if (!empty($lineItemIds)) {
            $row->lineItems()->sync($lineItemIds);
        }
    }


}