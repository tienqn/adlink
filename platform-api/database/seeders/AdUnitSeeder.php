<?php

namespace Database\Seeders;

use App\Models\AdUnit;
use Illuminate\Database\Seeder;

class AdUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        AdUnit::truncate();
        $data = [
            [
                '_id' => '6555d3fdca0c26bc8c0353a2',
                'site_id' => '6559e5fc60c64ebf22054e73',
                'parent_id' => '6559bfbc890216d98c0593e5',
                'name' => 'Hoka',
                'code' => 'shoehoka01',
                'status' => 'inactive',
                'sizes' => ['300x250'],
                'div_mode' => 'after',
                'div' => '.sample-1',
                'line_item_ids' => ['6555d3fdca0c26bc8c0354aa'],
                'creative_ids' => ['6555d3fdca0c26bc8c0353a1'],
            ],
            [
                '_id' => '6559c3a533255c45e907f892',
                'site_id' => '6559e60ad9fb100ae3027c33',
                'parent_id' => null,
                'name' => 'Menswear',
                'code' => 'menswear01',
                'status' => 'inactive',
                'sizes' => ['300x250', '300x600'],
                'div_mode' => 'after',
                'div' => '.sample-2',
                'line_item_ids' => ['6555d3fdca0c26bc8c0399a0'],
                'creative_ids' => ['6555d3fdca0c26bc8c0353a0'],
            ]
        ];
        foreach ($data as $row) {
            \App\Models\AdUnit::create($row);
        }
    }
}
