<?php

namespace App\Enums;

class StatusEnum extends AbstractEnum
{
    public const INACTIVE = 'inactive';
    public const ACTIVE = 'active';
    public const BAN = 'ban';
    public const REJECT = 'reject';
}