<?php

namespace Database\Seeders;

use App\Enums\StatusEnum;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Predis\Response\Status;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Seed the default permissions
        $permissions = Permission::defaultPermissions();

        foreach ($permissions as $perms) {
            Permission::firstOrCreate(['name' => $perms]);
        }

        $this->command->info('Default Permissions added.');

        // Ask for roles from input
        $inputRoles = 'Administrator, Manager, Publisher, Advertiser';
        $adminEmail = $this->command->ask('Enter your email address', 'admin@adlink.vn');
        $adminUsername = $this->command->ask('Enter your username', 'admin');
        $adminName = $this->command->ask('Enter your name', 'Admin');

        // Explode roles
        $roles_array = explode(', ', $inputRoles);

        // add roles
        foreach ($roles_array as &$role) {
            $role = Role::firstOrCreate(['name' => trim($role)]);
//            $role->level = config('constants.level_role')[$role->name];
            if ($role->name == 'Administrator') {
                // assign all permissions
                $role->syncPermissions(Permission::all());
                $this->command->info('Administrator granted all the permissions');
            } else if ($role->name == 'Manager') {
                // for others by default only read access
                $role->syncPermissions(Permission::where('name', 'NOT LIKE', '%roles%')->where('name', 'NOT LIKE', '%permissions%')->get());
            } else {
                $role->syncPermissions(Permission::where('name', 'NOT LIKE', '%roles%')
                    ->where('name', 'NOT LIKE', '%permissions%')
                    ->where('name', 'NOT LIKE', '%users%')
                    ->get());
            }

            // create one user for each role
            $this->_createUser($role, $adminEmail, $adminUsername, $adminName);
            $role->save();
        }
    }

    /**
     * Create a user with given role
     *
     * @param $role
     * @param $adminEmail
     * @param $adminUsername
     * @param $adminName
     */
    private function _createUser($role, $adminEmail, $adminUsername, $adminName): void
    {
        $defaultPassword = Hash::make('secret');
        if ($role->name === 'Administrator') {
            $user = User::create(
                [
                    'name' => $adminName,
                    'username' => $adminUsername,
                    'email' => $adminEmail,
                    'email_verified_at' => now()->toString(),
                    'password' => $defaultPassword,
                    'status' => StatusEnum::ACTIVE,
                    'protected' => true,
                ]
            );
        } else {
            $user = User::factory()->create([
                'password' => $defaultPassword,
            ]);
        }

        $user->assignRole($role->name);

        if ($role->name == 'Administrator') {
            $this->command->info('Here is your admin details to login:');
            $this->command->warn($user->email);
            $this->command->warn('Password is "secret"');
        }
    }
}
