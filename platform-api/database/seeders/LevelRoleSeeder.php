<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class LevelRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $inputRoles = 'Administrator, Manager, Publisher, Advertiser';
        $roles_array = explode(', ', $inputRoles);
        foreach ($roles_array as &$role) {
            $role = Role::firstOrCreate(['name' => trim($role)]);
            if ($role->name === 'Advertiser') {
                $role->syncPermissions(Permission::where('name', 'NOT LIKE', '%roles%')
                    ->where('name', 'NOT LIKE', '%permissions%')
                    ->where('name', 'NOT LIKE', '%users%')
                    ->get());
            }
            $role->level = config('constants.level_role')[$role->name];
            $role->save();
        }
    }
}
