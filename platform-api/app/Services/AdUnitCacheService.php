<?php
namespace App\Services;
use Illuminate\Support\Facades\Cache;
class AdUnitCacheService
{

    public function setCacheAdUnit($row)
    {
        $row->load(['site', 'lineItems', 'lineItems.creatives']);
        $row->makeHidden(['created_at', 'updated_at']);
        if (!empty($row->site)) {
            $row->site->makeHidden(['created_at', 'updated_at']);
        }
        $data = $row->toArray();
        $lineItems = [];
        if (!empty($data['line_items'])) {
            $tempLineItems = [];
            foreach ($data['line_items'] as $lineItem) {
                if (!empty($lineItem['creatives'])) {
                    $creativeIdPosition = $lineItem['creatives'][0]['_id'];
                    $lineItem['position_id'] = $creativeIdPosition;
                    $tempLineItems[$creativeIdPosition] = $lineItem;
                }
            }
            //sort by position
            if (!empty($data['position'])) {
                foreach ($data['position'] as $position) {
                    $lineItems[] = $tempLineItems[$position];
                }
            } else {
                $lineItems = $data['line_items'];
            }
        }
        $data['line_items'] = $lineItems;
        $cacheKey = 'adunit.' . $row->code;
        Cache::forget($cacheKey);
        Cache::rememberForever($cacheKey, function () use($data) {
            return $data;
        });
    }

}