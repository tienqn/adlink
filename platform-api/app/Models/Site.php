<?php

namespace App\Models;

use App\Enums\CategoryTypeEnum;
use Jenssegers\Mongodb\Eloquent\Model;

class Site extends Model
{
    protected $fillable = [
        'publisher_id',
        'domain',
        'ads_txt_verified',// true
        'is_verified',
        'status',
        'categories',
    ];

    /**
     * Get model validation store rules.
     *
     * @return array
     */
    public static function getValidationStoreRules(): array
    {
        return [
            'domain' => 'required|url',
            'categories' => 'required|array',
            'status' => ['required', 'in:active,inactive'],
            'categories.*' => 'required|in:'. implode(',' , array_keys(CategoryTypeEnum::getConstants()))
        ];
    }

    public function adUnits(): \Jenssegers\Mongodb\Relations\HasMany
    {
        return $this->hasMany(AdUnit::class, 'site_id', '_id');
    }
}
