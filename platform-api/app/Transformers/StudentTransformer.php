<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;

class StudentTransformer extends TransformerAbstract
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
            'name' => $row->name,
            'code' => $row->code,
        ];
    }
}