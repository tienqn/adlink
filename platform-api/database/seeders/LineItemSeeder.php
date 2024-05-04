<?php

namespace Database\Seeders;

use App\Models\LineItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LineItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        LineItem::truncate();

        $data = [
            [
                '_id' => '6555d3fdca0c26bc8c0399a0',
                'start_time' => '2023-11-27 10:00:00',
                'end_time' => '2023-11-27 20:00:00',
                'goal_type' => 'lifetime',
                'limit' => 100,
                'status' => 'active',
                'event' => 'clicks', // impressions or clicks
                'creative_ids' => ['6555d3fdca0c26bc8c0353a0'],
                'ad_unit_ids' => ['6559c3a533255c45e907f892'],
            ],
            [
                '_id' => '6555d3fdca0c26bc8c0354aa',
                'start_time' => '2023-11-27 14:00:00',
                'end_time' => '2023-11-27 17:00:00',
                'goal_type' => 'daily',
                'limit' => 1000,
                'status' => 'active',
                'event' => 'impressions', // impressions or clicks
                'creative_ids' => ['6555d3fdca0c26bc8c0353a1'],
                'ad_unit_ids' => ['6555d3fdca0c26bc8c0353a2'],
            ],
        ];

        foreach ($data as $row) {
            LineItem::create($row);
        }
    }
}
