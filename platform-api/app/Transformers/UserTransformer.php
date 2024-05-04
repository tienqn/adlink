<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;

class UserTransformer extends TransformerAbstract
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected array $availableIncludes = [
        'roles',
        'permissions',
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
            'email' => $row->email,
            'status' => $row->status,
            'email_verified_at' => $row->email_verified_at,
        ];
    }

    /**
     * Include Role
     *
     * @param $row
     * @return \League\Fractal\Resource\Collection
     */
    public function includeRoles($row): \League\Fractal\Resource\Collection
    {
        return $this->collection($row->roles, new RoleTransformer);
    }

    /**
     * Include Permisson
     *
     * @param $row
     * @return \League\Fractal\Resource\Collection
     */
    public function includePermissions($row): \League\Fractal\Resource\Collection
    {
        return $this->collection($row->permissions, new PermissionTransformer);
    }
}