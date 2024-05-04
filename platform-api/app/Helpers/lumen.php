<?php

if (!function_exists('config_path')) {
    /**
     * Get the configuration path.
     *
     * @param string $path
     * @return string
     */
    function config_path($path = ''): string
    {
        return app()->basePath() . '/config' . ($path ? '/' . $path : $path);
    }
}

if (!function_exists('now')) {
    /**
     * Get a Carbon instance for the current date and time.
     *
     * @param DateTimeZone|string|null $tz
     * @return \Illuminate\Support\Carbon
     */
    function now(DateTimeZone|string $tz = null): \Illuminate\Support\Carbon
    {
        return \Illuminate\Support\Carbon::now($tz);
    }
}
