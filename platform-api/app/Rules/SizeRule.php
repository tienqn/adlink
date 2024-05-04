<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\InvokableRule;

class SizeRule implements InvokableRule
{
    /**
     * Run the validation rule.
     *
     * @param string $attribute
     * @param mixed $value
     * @param \Closure $fail
     * @return void
     */
    public function __invoke($attribute, $value, $fail): void
    {
        if (!in_array($value, array_keys(config('constants.sizes'))) && !preg_match('/\d+x\d+/', $value)) {
            $fail('The :attribute is not a valid or wrong format [width:number]x[height:number].');
        }
    }
}