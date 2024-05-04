# Dashboard API

> **Note:** Make sure start adlink_an_docker before run app.

## Setup

__Install package__

`composer install`

__Copy ENV and change value__

`cp .env.example .env`

__Generate keys__

`php artisan key:generate`

`php artisan jwt:secret`

__Seeder database__

`php artisan db:seed`

## CRUD
1. Create **migration** to **INDEX** collection
2. Create **model**
   1. `$fillable`
   2. `getValidationStoreRules()`: validation rules for store action.
   3. `getValidationUpdateRules($id)`: validation rules for update action.
   4. Relationship `(hasOne, hasMany, belongToMany,...)`
3. Create **route** (current v1): `routes/v1/web.php`
4. Create **transformers**: `app/Transformers`
5. Create **controller**
   1. Path `app/Http/Controllers/V1` 
   2. `use CrudTrait;` if you want to 
      1. use CRUD actions `(index/store/show/update/destroy/restore)`
      2. use custom hook for CRUD

## License

The Lumen framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
