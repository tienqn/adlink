<?php

if (!function_exists('phone')) {

    /**
     * phone formatter
     *
     * @param string $phone
     *
     * @return string
     */
    function phone($phone)
    {
        //do we have an extension?

        //strip out non-numerics
        $phone = preg_replace("/[^0-9]/", "", $phone);

        //area code
        if (strlen($phone) == 10) {
            $phone = '(' . substr($phone, 0, 3) . ') ' . substr($phone, 3, 3) . '-' . substr($phone, 6, 4);
        } //no area code
        else if (strlen($phone) == 7) {
            $phone = substr($phone, 0, 3) . '-' . substr($phone, 3, 4);
        }

        //return
        return $phone;
    }
}

if (!function_exists('blurb')) {

    /**
     * blurb
     *
     * @param string  $blurb
     * @param integer $maxChars
     * @param string  $suffix
     * @param bool    $br
     *
     * @return string
     */
    function blurb($blurb, $maxChars = null, $suffix = '...', $br = true)
    {
        //blurb is shorter than max chars
        if (strlen($blurb) < $maxChars) {
            return nl2br($blurb);
        }

        //shorten output
        if ($maxChars) {
            $blurb = wordwrap($blurb, $maxChars, '<>');
            $blurb = explode('<>', $blurb);
            $blurb = $blurb[0];
        }

        //full output with line breaks
        if ($br) {
            $blurb = nl2br($blurb);
        }

        //return
        return $blurb . $suffix;
    }
}

if (!function_exists('format_bytes')) {

    /**
     * format bytes into something human readable
     *
     * @param int $bytes
     * @param int $precision
     *
     * @return string
     */
    function format_bytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        $bytes = max($bytes, 0);
        $pow   = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow   = min($pow, count($units) - 1);

        //calculate bytes
        $bytes /= pow(1024, $pow);

        //return the bytes
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}

/**
 * Remove first and end quote from a quoted string of text
 *
 * @param mixed $text
 *
 * @return string|string[]|null
 */
function stripquotes($text)
{
    $unquoted = str_replace('"', '', $text);
    $unquoted = str_replace("'", '', $unquoted);
    return $unquoted;
}

function strpos_array($haystack, $needles = [], $offset = 0)
{
    foreach ($needles as $needle) {
        $res = strpos($haystack, $needle, $offset);
        if ($res !== false) {
            return $res;
        }
    }
    return false;
}

function array_in_content($haystack, $needles = [])
{
    $chr = [];
    $haystack = strip_tags($haystack);
    foreach ($needles as $needle) {
        preg_match("/{$needle}/", $haystack, $matches, PREG_OFFSET_CAPTURE);
        if (!empty($matches)) {
            $match = reset($matches);
            list($needle, $position) = $match;
            $chr[$position] = $needle;
        }
    }
    return [
        'position' => !empty($chr) ? min($chr) : false,
        'result'   => $chr,
    ];
}

function get_domain($url){
    $domain = parse_url($url, PHP_URL_HOST);
    $domain = str_replace('www.', '', $domain);
    return $domain;
}

if (!function_exists('mongo_date')) {
    function mongo_date($timestamp) {
        return new \MongoDB\BSON\UTCDateTime($timestamp * 1000);
    }
}