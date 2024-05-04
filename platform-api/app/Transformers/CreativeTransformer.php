<?php

namespace App\Transformers;

use App\Enums\StatusEnum;
use League\Fractal\TransformerAbstract;

class CreativeTransformer extends TransformerAbstract
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected array $availableIncludes = [
        'lineItems',
        'adUnits'
    ];

    /**
     * Turn this item object into a generic array
     *'name',
     * @param $row
     * @return array
     */
    public function transform($row): array
    {
        $data = [
            'id' => $row->id,
            'name' => $row->name,
            'size' => $row->size,
            'code' => $row->code,
            'status' => $row->status ?? StatusEnum::INACTIVE,
        ];

        if (request()->has('with_code')) {
            $data['standard_code'] = $row->standard_code;
        }

        return $data;
    }

    public function includeCode($row)
    {
        return $row->standard_code;
    }

    public function includeLineItems($row): \League\Fractal\Resource\Collection
    {
        return $this->collection($row->lineItems, new LineItemTransformer);
    }
    public function includeAdUnits($row): \League\Fractal\Resource\Collection
    {
        return $this->collection($row->adUnits, new AdUnitTransformer);
    }
}