<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Models\AdUnit;
use App\Models\LineItem;
use App\Services\AdUnitCacheService;
use App\Traits\CrudTrait;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class CreativeController extends Controller
{
    protected $adUnitCacheService;
    use CrudTrait;

    public function __construct(AdUnitCacheService $adUnitCacheService)
    {
        $this->adUnitCacheService = $adUnitCacheService;
        $this->setModelName('Creative');
        $this->setTransformer('Creative');
    }

    protected function hookQueryIndex($query, Request $request): mixed
    {
        $user = auth()->user();
        $hasManageRole = $user->roles()->where('level','<=', config('constants.level_role')['Manager'])->exists();
        $siteId = $request->input('site_id');
        if (!empty($siteId)) {
            $query->whereHas('adUnits', function ($query) use ($siteId) {
                $query->where('site_id', $siteId);
            });
        }
        if ($hasManageRole) {
            return $query;
        }
        return $query->where('publisher_id', $user->_id);
    }

    protected function hookBeforeShow($row, Request $request)
    {
        $user = auth()->user();
        $hasManageRole = $user->roles()->where('level','<=', config('constants.level_role')['Manager'])->exists();
        if (!$hasManageRole && $row['publisher_id'] !== $user->_id) {
            throw new \Exception(__('app.message_access_denied'), ResponseAlias::HTTP_FORBIDDEN);
        }
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
        $lineItemIds = $request->input('line_item_ids', []);
        $adUnitIds = $request->input('ad_unit_ids', []);
        if (!empty($lineItemIds)) {
            $row->lineItems()->sync($lineItemIds);
            $this->updateCacheAdUnitFromLineItem($lineItemIds);
        }
        if (!empty($adUnitIds)) {
            $row->adUnits()->sync($adUnitIds);
            $this->updateCacheAdUnit($adUnitIds);
        }
    }

    protected function hookAfterEdit($row, Request $request)
    {
        $lineItemIds = $request->input('line_item_ids', []);
        $adUnitIds = $request->input('ad_unit_ids', []);
        if (!empty($lineItemIds)) {
            $row->lineItems()->sync($lineItemIds);
            $this->updateCacheAdUnitFromLineItem($lineItemIds);
        }
        if (!empty($adUnitIds)) {
            $row->adUnits()->sync($adUnitIds);
        }
    }

    // Ngầm hiểu lineItem - creative là 1 -1
    // Khi xoá relations creative với adunit thì phải xoá creative với lineItem
    protected function hookBeforeDelete($row)
    {
        $lineItems = $row->lineItems;
        $adUnits = $row->adUnits;
        $adUnitIds = [];
        if ($adUnits) {
            $adUnitIds = $adUnits->pluck('_id')->toArray();
            foreach($adUnits as $adUnit) {
                $creativeIds = array_diff($adUnit->creative_ids, [$row['_id']]);
                $adUnitSync = AdUnit::where('_id', $adUnit['_id'])->first();
                $adUnitSync->creatives()->sync($creativeIds);
                if ($lineItems->isNotEmpty()) {
                    $tempLineItems = array_diff($adUnit->line_item_ids ?? [], $lineItems->pluck('_id')->toArray());
                    $adUnitSync->lineItems()->sync($tempLineItems);
                }
            }
        }
        if ($lineItems) {
            foreach($lineItems as &$lineItem) {
                $creatives = array_diff($lineItem->creative_ids, [$row['_id']]);
                $lineItemSync = LineItem::where('_id', $lineItem['_id'])->first();
                $lineItemSync->creatives()->sync($creatives);
                if ($adUnits->isNotEmpty()) {
                    $tempAdUnits = array_diff($lineItem->ad_unit_ids ?? [], $adUnitIds);
                    $lineItemSync->adUnits()->sync($tempAdUnits);
                }
                LineItem::where('_id', $lineItem['_id'])->delete();
            }
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
    private function updateCacheAdUnitFromLineItem($line_item_ids) {
        foreach ($line_item_ids as $line_item_id) {
            $lineItem = LineItem::where('_id', $line_item_id)->first();
            $ad_unit_ids = $lineItem->ad_unit_ids;
            if (!empty($ad_unit_ids)) {
               $this->updateCacheAdUnit($ad_unit_ids);
            }
        }
    }

}