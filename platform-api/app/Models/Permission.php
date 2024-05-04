<?php

namespace App\Models;

class Permission extends \Maklad\Permission\Models\Permission
{
    protected $fillable = [
        'name',
        'guard_name',
    ];

    public const EXCEPT_MANAGER = [
        'add|roles',
        'edit|roles',
        'delete|roles',
        'add|permissions',
        'delete|permissions',
    ];
    public static function defaultPermissions(): array
    {
        return [
            'view|users',
            'add|users',
            'edit|users',
            'edit_status|users',
            'delete|users',

            'view|roles',
            'add|roles',
            'edit|roles',
            'delete|roles',

            'view|permissions',
            'add|permissions',
            'delete|permissions',

            # Delivery
            'view|line-items',
            'add|line-items',
            'edit|line-items',
            'delete|line-items',

            'view|creatives',
            'add|creatives',
            'edit|creatives',
            'delete|creatives',

            # Inventory
            'view|sites',
            'add|sites',
            'edit|sites',
            'edit_status|sites',

            'view|ad-units',
            'add|ad-units',
            'edit|ad-units',
        ];
    }


}
