<?php
namespace App\Services;
use Illuminate\Support\Facades\Cache;

class SiteCacheService
{

    public function setCacheSite($row)
    {
        $row->load(['adUnits']);
        $data = $row->toArray();
        $cacheKey = 'site.' . $row->domain;
        Cache::forget($cacheKey);
        Cache::rememberForever($cacheKey, function () use($data) {
            return $data;
        });
    }

}