<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\Site::truncate();
        $data = [
            [
                '_id' => '6559e5fc60c64ebf22054e73',
                'domain' => 'yeah1.com',
                'ads_txt_verified' => true,// true
                'is_verified' => true,
                'status' => 'active',
                'categories' => ['BEAUTY_AND_FITNESS', 'BOOKS_AND_LITERATURE', 'BUSINESS_AND_INDUSTRIAL_MARKETS'],
            ],
            [
                '_id' => '6559e60ad9fb100ae3027c33',
                'domain' => 'yeah1-gamming.com',
                'ads_txt_verified' => false,
                'is_verified' => false,
                'status' => 'active',
                'categories' => [
                    'UNSPECIFIED',
                    'ARTS_AND_ENTERTAINMENT'
                ],
            ]
        ];

        foreach ($data as $row) {
            \App\Models\Site::create($row);
        }
    }
}
