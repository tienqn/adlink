<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class UpdateManagerRole extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $manager = 'Manager';
        $role = Role::where(['name' => trim($manager)])->first();
        if ($role) {
            $query = Permission::where(function ($query) {
                    $query->where('name', 'NOT LIKE', '%roles%')
                        ->where('name', 'NOT LIKE', '%permissions%');
                })
                ->orWhereIn('name', [
                    'view|roles',
                    'view|permissions',
                ])->get();
            $role->syncPermissions($query);
        }
    }
}
