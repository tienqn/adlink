<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Models\AdUnit;
use App\Repositories\SiteRepository;
use App\Services\AdUnitCacheService;
use App\Services\SiteCacheService;
use App\Traits\CrudTrait;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class SiteController extends Controller
{
    protected $siteRepo;
    protected $cacheService;
    protected $adUnitCacheService;
    use CrudTrait;

    public function __construct(
        SiteRepository     $siteRepo,
        SiteCacheService   $cacheService,
        AdUnitCacheService $adUnitCacheService
    )
    {
        $this->siteRepo = $siteRepo;
        $this->cacheService = $cacheService;
        $this->adUnitCacheService = $adUnitCacheService;
        $this->setModelName('Site');
        $this->setTransformer('Site');
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

    protected function hookBeforeShow($row, Request $request)
    {
        $user = auth()->user();
        $hasManageRole = $user->roles()->where('level','<=', config('constants.level_role')['Manager'])->exists();
        if ($hasManageRole && $row['publisher_id'] !== $user->_id) {
            throw new \Exception(__('app.message_access_denied'), ResponseAlias::HTTP_FORBIDDEN);
        }
    }
    protected function hookBeforeAdd(Request $request)
    {
        $bindData['ads_txt_verified'] = false;
        $bindData['is_verified'] = false;
        $bindData['domain'] = get_domain($request->domain);
        $user = auth()->user();
        if($user) {
            $bindData['publisher_id'] = $user->_id;
        }
        $this->bindData = array_merge($this->bindData, $bindData);
    }

    protected function hookAfterAdd($row, Request $request)
    {
        $this->updateAdUnitCache($row['_id']);
    }

    protected function hookAfterEdit($row, Request $request)
    {
        $this->updateAdUnitCache($row['_id']);

    }

    public function verifyAdsTxt($id)
    {
        $this->loadModel();
        $site = $this->getModel()::find($id);
        if(empty($site)) {
            return error_message(
                statusCode: ResponseAlias::HTTP_NOT_FOUND,
                messages: [__('app.404_message')],
                throwMessage: 'site_not_found',
            );
        }
        $verifyData = $this->siteRepo->verifyAdsTxt($id, $site['domain']);
        if ($verifyData['status'] === false) {
            return error_message(
                statusCode: $verifyData['statusCode'],
                messages: $verifyData['messages'],
                throwMessage: 'verify ads.txt failed',
            );
        }
        $this->cacheService->setCacheSite($site);
        return set_response(data: $verifyData['data'], statusCode: ResponseAlias::HTTP_OK, messages: ['verify ads.txt success']);
    }

    private function updateAdUnitCache($siteId)
    {
        $adUnits = AdUnit::where('site_id', $siteId)->get();
        if ($adUnits->isEmpty()) {
            return false;
        }
        foreach ($adUnits as $row) {
            $this->adUnitCacheService->setCacheAdUnit($row);
        }
    }
}