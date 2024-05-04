<?php

namespace App\Transformers;

use App\Enums\StatusEnum;
use League\Fractal\TransformerAbstract;

class LineItemTransformer extends TransformerAbstract
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected array $availableIncludes = [
        'creatives',
        'adUnits'
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
            'start_time' => $row->start_time,
            'end_time' => $row->end_time,
            'goal_type' => $row->goal_type,
            'status' => $row->status ?? StatusEnum::INACTIVE,
            'limit' => $row->limit,
        ];
    }

    public function includeCreatives($row): \League\Fractal\Resource\Collection
    {
        return $this->collection($row->creatives, new CreativeTransformer);
    }

    public function includeAdUnits($row): \League\Fractal\Resource\Collection
    {
        return $this->collection($row->adUnits, new AdUnitTransformer);
    }
}