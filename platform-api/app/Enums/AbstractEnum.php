<?php

namespace App\Enums;

abstract class AbstractEnum
{
    /**
     * Return all constants
     *
     * @return array
     */
    static function getConstants(): array
    {
        $rc = new \ReflectionClass(get_called_class());

        return $rc->getConstants();
    }

    /**
     *Return last constants
     *
     * @return array
     */
    static function lastConstants(): array
    {
        $parentConstants = static::getParentConstants();

        $allConstants = static::getConstants();

        return array_diff($allConstants, $parentConstants);
    }

    /**
     * Return parent constants
     *
     * @return array
     */
    static function getParentConstants(): array
    {
        $rc = new \ReflectionClass(get_parent_class(static::class));
        return $rc->getConstants();
    }
}
