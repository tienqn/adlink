<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;

class CommonController extends Controller
{
    public function sizes()
    {
        return set_response(data: config('constants.sizes'));
    }
}