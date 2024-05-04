<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class AdUnit extends Model
{
    protected $fillable = [
        'site_id',
        'parent_id',
        'name',
        'code',
        'status',
        'sizes',
        'div_mode',
        'div',
        'position',
        'publisher_id',
    ];

    public static function getValidationStoreRules(): array
    {
        return [
            'site_id' => 'required|exists:sites,_id',
            'name' => 'required',
            'code' => [
                'required',
                'unique:ad_units'
            ],
            'sizes' => ['required', 'array'],
            'sizes.*' => ['required', 'string'],
            'status' => ['required', 'in:active,inactive'],
            'div_mode' => ['nullable', 'in:after,before'],
            'line_item_ids' => ['nullable', 'array'],
            'line_item_ids.*' => ['exists:line_items,_id'],
            'creative_ids' => ['nullable', 'array'],
            'creative_ids.*' => ['exists:creatives,_id'],
        ];
    }

    public static function getValidationUpdateRules($id): array
    {
        return [
            'site_id' => 'required|exists:sites,_id',
            'name' => 'required',
            'sizes' => ['nullable', 'array'],
            'status' => ['required', 'in:active,inactive'],
            'div_mode' => ['nullable', 'in:after,before'],
            'line_item_ids' => ['nullable', 'array'],
            'line_item_ids.*' => ['exists:line_items,_id'],
            'creative_ids' => ['nullable', 'array'],
            'creative_ids.*' => ['exists:creatives,_id'],
        ];
    }

    public function site(): \Jenssegers\Mongodb\Relations\HasOne
    {
        return $this->hasOne(Site::class, '_id', 'site_id');
    }


    public function lineItems(): \Jenssegers\Mongodb\Relations\BelongsToMany
    {
        return $this->belongsToMany(LineItem::class, null, 'ad_unit_ids', 'line_item_ids');
    }


    public function creatives(): \Jenssegers\Mongodb\Relations\BelongsToMany
    {
        return $this->belongsToMany(Creative::class, null, 'ad_unit_ids', 'creative_ids');
    }
}
