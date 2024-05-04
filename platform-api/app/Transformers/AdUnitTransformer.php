<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Enums\StatusEnum;

class AdUnitTransformer extends TransformerAbstract
{


    /**
     * List of resources possible to include
     *
     */
    protected array $availableIncludes = [
        'site',
        'lineItems',
        'creatives'
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
            'parent_id' => $row->parent_id,
            'site_id' => $row->site_id,
            'code' => $row->code,
            'status' => $row->status ?? StatusEnum::INACTIVE,
            'sizes' => $row->sizes,
            'div' => $row->div,
            'div_mode' => $row->div_mode,
            'position' => $row->position
        ];
    }

    public function includeSite($row): \League\Fractal\Resource\Item
    {
        return $this->item($row->site, new SiteTransformer);
    }
    public function includeLineItems($row): \League\Fractal\Resource\Collection
    {
        return $this->collection($row->lineItems, new LineItemTransformer);
    }

    public function includeCreatives($row): \League\Fractal\Resource\Collection
    {
        return $this->collection($row->creatives, new CreativeTransformer);
    }

}