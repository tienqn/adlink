<?php

namespace App\Transformers;

use App\Enums\StatusEnum;
use League\Fractal\TransformerAbstract;

class SiteTransformer extends TransformerAbstract
{

    /**
     * List of resources possible to include
     *
     */
    protected array $availableIncludes = [
        'adUnits',
    ];

    /**
     * Turn this item object into a generic array
     *
     * @param $row
     * @return array
     */
    public function transform($row): array
    {
        return [
            'id' => $row->id,
            'domain' => $row->domain,
            'publisher_id' => $row->publisher_id,
            'categories' => $row->categories,
            'ads_txt_verified' => $row->ads_txt_verified,
            'is_verified' => $row->is_verified,
            'status' => $row->status ?? StatusEnum::INACTIVE,
        ];
    }
    public function includeAdUnits($row): \League\Fractal\Resource\Collection
    {
        return $this->collection($row->adUnits, new AdUnitTransformer);
    }
}