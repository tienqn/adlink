<?php

namespace App\Models;

class Role extends \Maklad\Permission\Models\Role
{
    public static function getValidationStoreRules(): array
    {
        return [
            'name' => ['required'],
        ];
    }

    /**
     * Get model validation update rules.
     *
     * @param string $id
     * @return array
     */
    public static function getValidationUpdateRules(string $id): array
    {
        return [
            'permissions' => ['required', 'array'],
        ];
    }
}
