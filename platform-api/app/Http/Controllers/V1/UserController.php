<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Traits\CrudTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    use CrudTrait;

    public function __construct()
    {
        $this->setModelName('User');
        $this->setTransformer('User');
    }

    protected function hookBeforeAdd(Request $request)
    {
        $bindData['password'] = Hash::make($request->password);
        $this->bindData = array_merge($this->bindData, $bindData);
    }

    protected function hookAfterAdd($row, Request $request)
    {
        if ($roles = $request->input('roles', null )) {
            foreach ($roles as $role) {
                $row->assignRole($role);
            }
        }

        if ($permissions = $request->input('permissions', null )) {
            foreach ($permissions as $permission) {
                $row->syncPermissions(Permission::where('name', $permission)->get());
            }
        }

    }

    protected function hookBeforeEdit($row, $request): void
    {
        if ($request->password) {
            $bindData['password'] = Hash::make($request->password);
                $this->bindData = array_merge($this->bindData, $bindData);
        }
    }

    protected function hookAfterEdit($row, Request $request)
    {
        if ($roles = $request->input('roles', null )) {
            foreach ($roles as $role) {
                $row->assignRole($role);
            }
        }
        if ($permissions = $request->input('permissions', null )) {
            foreach ($permissions as $permission) {
                $row->syncPermissions(Permission::where('name', $permission)->get());
            }
        }
    }
}