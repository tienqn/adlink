<?php

namespace Database\Seeders;

use App\Models\Creative;
use Illuminate\Database\Seeder;

class CreativeSeeder extends Seeder
{
    public function run(): void
    {
        Creative::truncate();

        $data = [
            [
                '_id' => '6555d3fdca0c26bc8c0353a0',
                'name' => 'Outbrain Creative',
                'code' => 'CREATIVE01',
                'size' => '300x250',
                'standard_code' => '<script type="text/javascript" src="https://widgets.outbrain.com/outbrain.min.js"></script>',
                'status' => 'inactive',
                'line_item_ids' => ['6555d3fdca0c26bc8c0399a0'],
                'ad_unit_ids' => ['6559c3a533255c45e907f892']
            ],
            [
                '_id' => '6555d3fdca0c26bc8c0353a1',
                'name' => 'Outbrain Creative 2',
                'code' => 'CREATIVE02',
                'size' => '300x250',
                'status' => 'inactive',
                'standard_code' => '<script type="text/javascript" src="https://widgets.outbrain.com/outbrain.min.js"></script>',
                'line_item_ids' => ['6555d3fdca0c26bc8c0354aa'],
                'ad_unit_ids' => ['6555d3fdca0c26bc8c0353a2']
            ],
        ];

        foreach ($data as $row) {
            Creative::create($row);
        }
    }
}
