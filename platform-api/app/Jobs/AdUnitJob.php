<?php

namespace App\Jobs;

use App\Enums\AdSetStatusEnum;
use App\Models\AdUnit;
use Illuminate\Support\Facades\Cache;

class AdUnitJob extends Job
{
    protected $adUnitId;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($adUnitId)
    {
        $this->adUnitId = $adUnitId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $cacheKey = 'adUnit_' . $this->adUnitId;
        Cache::forget($cacheKey);
        $adUnit = AdUnit::with([
            'adSets' => function ($adSetQuery) {
                $adSetQuery->with([
                    'creatives'
                ]);
                $adSetQuery->whereIn('status', [AdSetStatusEnum::READY, AdSetStatusEnum::DELIVERING]);
            },
        ] )->findOrFail($this->adUnitId);
        if (!$adUnit->isNotEmpty()) {
            Cache::put($cacheKey, $adUnit->toArray(), -1);
        }
    }
}
