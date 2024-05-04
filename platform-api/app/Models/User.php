<?php

namespace App\Models;

use App\Enums\RoleEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Jenssegers\Mongodb\Eloquent\Model;
use Jenssegers\Mongodb\Eloquent\SoftDeletes;
use Maklad\Permission\Traits\HasPermissions;
use Maklad\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Laravel\Lumen\Auth\Authorizable;

class User extends Model implements AuthenticatableContract, AuthorizableContract, JWTSubject
{
    use Authenticatable, Authorizable, HasFactory, HasRoles, SoftDeletes, HasPermissions;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
    protected $hidden = [
        'password',
        'role_ids',
        'permission_ids',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get model validation store rules.
     *
     * @return array
     */
    public static function getValidationStoreRules(): array
    {
        $result = [
            'name' => ['required'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
            'roles' => ['required', 'array'],
            'roles.*' => ['required', 'string', 'exists:roles,name'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['nullable', 'string', 'exists:permissions,name'],
            'status' => ['in:active,inactive,suspended'],
        ];
        self::filterManagerValidations($result);
        return $result;


    }

    /**
     * Get model validation update rules.
     *
     * @param string $id
     * @return array
     */
    public static function getValidationUpdateRules(string $id): array
    {
        $result = [
            'name' => 'required',
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($id, '_id'),
            ],
            'password' => [
                'nullable',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
            'roles' => ['required', 'array'],
            'roles.*' => ['required', 'string', 'exists:roles,name'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['nullable', 'string', 'exists:permissions,name'],
            'status' => ['in:active,inactive,suspended'],
        ];
        self::filterManagerValidations($result);
        return $result;
    }

    private static function filterManagerValidations(&$result)
    {
        $user = auth()->user();
        $roles = $user->roles->pluck('name')->toArray();
        if (in_array(RoleEnum::MANAGER, $roles)) {
            $result['roles.*'] = array_merge($result['roles.*'], [
                'not_in:'.RoleEnum::ADMINISTRATOR
            ]);
            $result['permissions.*'] = array_merge($result['permissions.*'], [
                'not_in:'.implode(',', Permission::EXCEPT_MANAGER)
            ]);
        }
    }

    // Rest omitted for brevity

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims(): array
    {
        return [];
    }
}
