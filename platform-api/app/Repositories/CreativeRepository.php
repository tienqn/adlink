<?php

namespace App\Repositories;

use App\Models\Creative;

class CreativeRepository extends BaseRepository
{
    public function __construct(Creative $model)
    {
        parent::__construct($model);
    }


    public function findByIds(array|null $ids = [], $select = ['*'])
    {
        return $this->model->whereIn('_id', $ids)
            ->select($select)
            ->get();
    }

    public function removeRelationship(string $adUnitId, $creativeIds)
    {
        $creatives = $this->model->whereIn('_id', $creativeIds)->get();
        if ($creatives->isEmpty()) {
            return;
        }
        foreach ($creatives as &$creative) {
            $adUnitIds = $creative['ad_unit_ids'] ?? [];
            if (in_array($adUnitId, $adUnitIds)) {
                $adUnitIds = array_diff($adUnitIds, [$adUnitId]);
            }
            $creative['ad_unit_ids'] = array_unique($adUnitIds);
            $creative->save();
        }
    }


}
