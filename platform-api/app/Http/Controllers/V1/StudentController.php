<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Traits\CrudTrait;

class StudentController extends Controller
{
    use CrudTrait;

    public function __construct()
    {
        $this->setModelName('Student');
        $this->setTransformer('Student');
    }
}