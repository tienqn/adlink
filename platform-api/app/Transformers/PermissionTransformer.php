<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;

class PermissionTransformer extends TransformerAbstract
{
    /**
     * Turn this item object into a generic array
     *
     * @param $row
     * @return array
     */
    public function transform($row): array
    {
        list($action, $controller) = explode('|', $row->name);
        return [
            'name' => $row->name,
            'controller' => $controller,
            'action' => $action,
        ];
    }
}