<?php

namespace App\Repositories;

use App\Enums\SiteEnum;
use App\Enums\StatusEnum;
use App\Models\Site;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class SiteRepository extends BaseRepository
{
    public function __construct(Site $model)
    {
        parent::__construct($model);
    }

    public function verifyAdsTxt(string $id, string $domain)
    {
        $url =  "https://${domain}/ads.txt";
        $adsTxtContent = $this->getAdsTxtContent($url);
        $adsTxtNeedVerifies = SiteEnum::ADS_TXT_CONTENT;
        $result = [];
        foreach ($adsTxtNeedVerifies as $line) {
            $cleanLine = preg_replace('/\s/', '', $line);
            $foundLines = array_filter($adsTxtContent, function ($item) use ($cleanLine) {
                return str_starts_with($item, $cleanLine);
            });
            if (!empty($foundLines)) {
                $result[] = $line;
            }
        }
        $urlNotVerified = array_diff($adsTxtNeedVerifies, $result);
        if (count($urlNotVerified) > 0) {
            return [
                'status' => false,
                'code' => ResponseAlias::HTTP_CONFLICT,
                'messages' => [__('app.404_message')]
            ];
        }
        $this->updateBy([
            '_id' => $id
        ], [
            'ads_txt_verified' => true,
            'status' => StatusEnum::ACTIVE
        ]);
        return [
            'status' => true,
            'data' =>  $this->find($id)->toArray()
        ];
    }

    protected function getAdsTxtContent(string $url): array
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $content = curl_exec($ch);
        curl_close($ch);
        $content = explode("\r\n", $content);
        $cleanContent = array_map(function ($line){
            return preg_replace('/\s/', '', $line);
        },$content);
        return array_filter($cleanContent, function ($line) {
            return $line !== "";
        });
    }
}
