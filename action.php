<?php
require_once( dirname(__FILE__)."/settings.php" );

$ratioColorSettings = new rRatioColorSettings();
$ratioColorSettings->obtain();

if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'setratiocolor')
{
    $ret = $ratioColorSettings->set();
    if($ret !== false) {
        header("Content-Type: application/javascript");
        header("Content-Length: ".strlen($ret));
        echo $ret;
    } else {
        header("HTTP/1.0 500 Internal Server Error");
        echo "Error saving settings";
    }
}