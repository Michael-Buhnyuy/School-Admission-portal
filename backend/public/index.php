<?php

// Path to the front controller (this file)
define('FCPATH', __DIR__ . DIRECTORY_SEPARATOR);

// Location of the framework paths
define('ROOTPATH', dirname(__DIR__) . DIRECTORY_SEPARATOR);

// Location of the app directory
define('APPPATH', ROOTPATH . 'app' . DIRECTORY_SEPARATOR);

// Location of the system directory
define('SYSTEMPATH', ROOTPATH . 'system' . DIRECTORY_SEPARATOR);

// Location of the writable directory
define('WRITEPATH', ROOTPATH . 'writable' . DIRECTORY_SEPARATOR);

// Load our autoloader
require_once ROOTPATH . 'vendor/autoload.php';

// Load environment variables
require_once APPPATH . 'Config/Constants.php';

// Load CodeIgniter
$app = require_once SYSTEMPATH . 'Boot.php';

echo $app->run();
