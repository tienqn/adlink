<?php

namespace App\Http\Controllers\V1;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Traits\CrudTrait;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    use CrudTrait;

    public function __construct()
    {
        $this->setModelName('Role');
        $this->setTransformer('Role');
    }

    protected function hookQueryIndex($query, Request $request): mixed
    {
        return $query;
        $user = auth()->user();
        $minLevel = $user->roles()->min('level');
        return $query->where('level', '>=', $minLevel);
    }

    protected function hookBeforeEdit($row, $request): void
    {
        if ($row->name === 'Administrator') {
            $this->bindData['permissions'] = Permission::select('name')->get()->pluck('name')->toArray();
        }
    }

    protected function hookAfterEdit($row, $request): void
    {
        $permissions = $this->bindData['permissions'];
        $row->syncPermissions($permissions);
    }
}