<?php

//use Illuminate\Support\Facades\Cache;
//
///**
// * @param \App\AdUnit $ad_unit
// */
//function set_cache_ad_unit(\App\Models\AdUnit $ad_unit)
//{
//    $cache_key = 'adunit_' . $ad_unit->_id;
//    Cache::store(config('constants.cache_store'))->forget($cache_key);
//    Cache::store(config('constants.cache_store'))->rememberForever($cache_key, function () use ($ad_unit) {
//        $website    = $ad_unit->website;
//        $ad_sources = $ad_unit->adsources()->where('status', config('constants.crud_active'))->get();
//
//        $data               = $ad_unit->toArray();
//        $data['website']    = !empty($website) ? $website->toArray() : [];
//        $data['ad_sources'] = !empty($ad_sources) ? $ad_sources->toArray() : [];
//        return $data;
//    });
//}
