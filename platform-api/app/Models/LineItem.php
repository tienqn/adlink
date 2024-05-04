<?php

namespace App\Models;

use App\Enums\LineItemStatusEnum;
use Jenssegers\Mongodb\Eloquent\Model;
use Jenssegers\Mongodb\Eloquent\SoftDeletes;

class LineItem extends Model
{

    protected $fillable = [
        'start_time',
        'end_time',
        'goal_type',
        'limit',
        'status',
        'event', // impressions or clicks
    ];

    /**
     * Get model validation store rules.
     *
     * @return array
     */
    public static function getValidationStoreRules(): array
    {
        return [
            'start_time' => ['nullable', 'date'],
            'end_time' => ['nullable', 'date', 'after_or_equal:start_time'],
            'goal_type' => ['required', 'in:' . implode(',', array_keys(config('constants.goal_type')))], // lifetime, daily
            'limit' => ['nullable', 'numeric'],
            'status' => [
                'required',
                'in:' . implode(',', array_values(LineItemStatusEnum::getConstants())),
            ],
            'event' => ['required', 'in:' . implode(',', array_keys(config('constants.event')))], // impressions, clicks
            'creative_ids' => ['nullable', 'array'],
            'creative_ids.*' => ['exists:creatives,_id'],
            'ad_unit_ids' => ['nullable', 'array'],
            'ad_unit_ids.*' => ['exists:ad_units,_id'],
        ];
    }

    /**
     * Get model validation update rules.
     *
     * @return array
     */
    public static function getValidationUpdateRules($id): array
    {
        return [
            'start_time' => ['nullable', 'date'],
            'end_time' => ['nullable', 'date', 'after_or_equal:start_time'],
            'goal_type' => ['required', 'in:' . implode(',', array_keys(config('constants.goal_type')))], // lifetime, daily
            'limit' => ['nullable', 'numeric'],
            'status' => [
                'required',
                'in:' . implode(',', array_values(LineItemStatusEnum::getConstants())),
            ],
            'event' => ['required', 'in:' . implode(',', array_keys(config('constants.event')))], // impressions, clicks
            'creative_ids' => ['nullable', 'array'],
            'creative_ids.*' => ['exists:creatives,_id'],
            'ad_unit_ids' => ['nullable', 'array'],
            'ad_unit_ids.*' => ['exists:ad_units,_id'],
        ];
    }

    public function creatives(): \Jenssegers\Mongodb\Relations\BelongsToMany
    {
        return $this->belongsToMany(Creative::class, null, 'line_item_ids', 'creative_ids');
    }

    public function adUnits(): \Jenssegers\Mongodb\Relations\BelongsToMany
    {
        return $this->belongsToMany(AdUnit::class, null, 'line_item_ids', 'ad_unit_ids');
    }
}
