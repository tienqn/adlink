<?php

namespace App\Enums;

class LineItemStatusEnum extends AbstractEnum
{
    public const DRAFT = 'draft';
    public const PENDING_APPROVAL = 'pending_approval';
    public const DISAPPROVED = 'disapproved';
    public const INACTIVE = 'inactive';
    public const ACTIVE = 'active';
    public const READY = 'ready';
    public const DELIVERING = 'delivering';
    public const DELIVERY_EXTENDED = 'delivery_extended';
    public const PAUSED = 'paused';
    public const COMPLETED = 'completed';
    public const INVENTORY_RELEASED = 'inventory_released';
    public const ARCHIVED = 'archived';
}