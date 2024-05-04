<?php

namespace App\Models;

use App\Rules\SizeRule;
use Jenssegers\Mongodb\Eloquent\Model;
use Illuminate\Validation\Rule;

class Creative extends Model
{
    protected $fillable = [
        'name',
        'code',
        'status',
        'size',
        'standard_code',
        'publisher_id',
    ];

    /**
     * Get model validation store rules.
     *
     * @return array
     */
    public static function getValidationStoreRules(): array
    {
        return [
            'name' => ['required'],
            'size' => ['required', 'string', new SizeRule()],
            'code' => ['required', 'unique:creatives,code'],
            'status' => ['required', 'in:active,inactive'],
            'standard_code' => ['required'],
            'line_item_ids' => ['nullable', 'array'],
            'line_item_ids.*' => ['exists:line_items,_id'],
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
            'name' => ['required'],
            'size' => ['required', 'string', new SizeRule()],
            'code' => [
                'nullable',
                Rule::unique('creatives')->ignore($id, '_id'),

            ],
            'standard_code' => ['required'],
            'status' => ['required', 'in:active,inactive'],
            'line_item_ids' => ['nullable', 'array'],
            'line_item_ids.*' => ['exists:line_items,_id'],
            'ad_unit_ids' => ['nullable', 'array'],
            'ad_unit_ids.*' => ['exists:ad_units,_id'],
        ];
    }

    public function lineItems(): \Jenssegers\Mongodb\Relations\BelongsToMany
    {
        return $this->belongsToMany(LineItem::class, null, 'creative_ids', 'line_item_ids');
    }

    public function adUnits(): \Jenssegers\Mongodb\Relations\BelongsToMany
    {
        return $this->belongsToMany(AdUnit::class, null, 'creative_ids', 'ad_unit_ids');
    }
}
