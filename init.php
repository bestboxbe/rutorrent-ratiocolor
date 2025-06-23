<?php
require_once( dirname(__FILE__)."/settings.php" );

$ratioColorSettings = new rRatioColorSettings();
$ratioColorSettings->obtain();

$theSettings->registerPlugin($plugin["name"], $pInfo["perms"]);
$jResult .= $ratioColorSettings->get();