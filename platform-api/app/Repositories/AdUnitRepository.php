<?php

namespace App\Repositories;

use App\Models\AdUnit;

class AdUnitRepository extends BaseRepository
{
    public function __construct(AdUnit $model)
    {
        parent::__construct($model);
    }


    public function findByIds($ids, $select = ['*'])
    {
        return $this->model->whereIn('_id', $ids)
            ->select($select)
            ->get();
    }

    public function sortCreativeByPosition($creatives, $positions)
    {
        $creativeRes = [];
        $creatives = array_column($creatives, null, 'id');
        if (!empty($positions) && !empty($creatives)) {
            foreach ($positions as $position) {
                $creativeRes[] = $creatives[$position];
            }
        } else {
            $creativeRes = array_values($creatives);
        }
        return $creativeRes;
    }

}
