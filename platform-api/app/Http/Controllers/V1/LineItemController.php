<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Models\AdUnit;
use App\Models\Creative;
use App\Services\AdUnitCacheService;
use App\Traits\CrudTrait;
use Illuminate\Http\Request;

class LineItemController extends Controller
{
    protected $adUnitCacheService;
    use CrudTrait;

    public function __construct(AdUnitCacheService $adUnitCacheService)
    {
        $this->adUnitCacheService = $adUnitCacheService;
        $this->setModelName('LineItem');
        $this->setTransformer('LineItem');
    }


    protected function hookAfterAdd($row, Request $request)
    {
        $adUnitIds = $request->input('ad_unit_ids', []);
        $creativeIds = $request->input('creative_ids', []);
        if (!empty($adUnitIds)) {
            $row->adUnits()->sync($adUnitIds);
            $this->updateCacheAdUnit($adUnitIds);
        }
        if (!empty($creativeIds)) {
            $row->creatives()->sync($creativeIds);
            $this->updateCacheAdUnitByCreative($creativeIds);
        }
    }

    protected function hookAfterEdit($row, Request $request)
    {
        $adUnitIds = $request->input('ad_unit_ids', []);
        $creativeIds = $request->input('creative_ids', []);
        if (!empty($adUnitIds)) {
            $row->adUnits()->sync($adUnitIds);
            $this->updateCacheAdUnit($adUnitIds);
        }
        if (!empty($creativeIds)) {
            $row->creatives()->sync($creativeIds);
            $this->updateCacheAdUnitByCreative($creativeIds);
        }
    }

    private function updateCacheAdUnit($ad_unit_ids) {
        if (!empty($ad_unit_ids)) {
            foreach ($ad_unit_ids as $ad_unit_id) {
                $row = AdUnit::where('_id', $ad_unit_id)->first();
                if (!empty($row)) {
                    $this->adUnitCacheService->setCacheAdUnit($row);
                }
            }
        }
    }

    private function updateCacheAdUnitByCreative($creative_ids) {
        if (!empty($creative_ids)) {
            foreach ($creative_ids as $creative_id) {
                $creative = Creative::where('_id', $creative_id)->first();
                $ad_unit_ids = $creative->ad_unit_ids;
                if (!empty($ad_unit_ids)) {
                    foreach ($ad_unit_ids as $ad_unit_id) {
                        $row = AdUnit::where('_id', $ad_unit_id)->first();
                        if (!empty($row)) {
                            $this->adUnitCacheService->setCacheAdUnit($row);
                        }
                    }
                }
            }
        }
    }
}