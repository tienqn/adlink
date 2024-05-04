<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
class CategoryController extends Controller
{
    public function __invoke()
    {
        return set_response(data: \App\Enums\CategoryTypeEnum::getConstants());
    }
}