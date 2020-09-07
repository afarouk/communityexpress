<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);


/*React App changes*/
/*Handle request to /manifest.json to return dynamically modified file for a specified sasl*/
$manifest = json_decode(file_get_contents(__DIR__ . DIRECTORY_SEPARATOR . 'youdash' . DIRECTORY_SEPARATOR . 'manifest.json', true));
$url = $_GET['url'];
//print_r($_GET);
if ($url) {
    $demo = $_GET['demo'];
    $manifest->start_url = $url . ($demo ? '/?demo=true' : '') ;
    header('Content-type: application/json');
    echo json_encode($manifest, JSON_UNESCAPED_SLASHES);
    exit();
}
