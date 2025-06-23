<?php
require_once( dirname(__FILE__)."/../../php/settings.php");
require_once( dirname(__FILE__)."/conf.php");

class rRatioColorSettings
{
    public $hash = "ratiocolor.dat";
    public $data = array();
    
    public function __construct()
    {
        global $ratioColorSettings;
        $this->data = $ratioColorSettings;
    }
    
    public function get()
    {
        $ret = "plugin.ratioColorSettings = ".json_encode($this->data).";";
        return $ret;
    }
    
    public function set()
    {
        $input = file_get_contents('php://input');
        $settings = json_decode($input, true);
        if($settings)
        {
            $this->data = $settings;
            $this->store();
            return "plugin.ratioColorSettings = ".json_encode($this->data).";";
        }
        return false;
    }
    
    public function store()
    {
        $cache = new rCache();
        $rss = array('__hash__' => $this->hash);
        if(is_array($this->data))
            $rss = array_merge($rss, $this->data);
        return $cache->set($rss);
    }
    
    public function obtain()
    {
        $cache = new rCache();
        $rss = array('__hash__' => $this->hash);
        if($cache->get($rss) && is_array($rss))
            $this->data = $rss;
        return true;
    }
}