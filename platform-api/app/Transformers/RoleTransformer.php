<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;

class RoleTransformer extends TransformerAbstract
{
    /**
     * Include resources without needing it to be requested.
     */
    protected array $defaultIncludes = [
        'permissions'
    ];

    /**
     * List of resources possible to include
     *
     */
    protected array $availableIncludes = [
        'permissions'
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
            'level' => $row->level,
        ];
    }

    /**
     * Include Permission
     *
     * @param $row
     * @return \League\Fractal\Resource\Collection
     */
    public function includePermissions($row): \League\Fractal\Resource\Collection
    {
        return $this->collection($row->permissions, new PermissionTransformer);
    }
}