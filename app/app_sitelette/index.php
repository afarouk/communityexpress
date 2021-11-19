<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once('preprocessing.php');
if ($blockAccess) {
  include_once('error_page/blocked_access.php');
} else {
  if (!is_null($errorMessage)) {
        include_once('error_page/error_page.php');
  } else if ($saslAccess || $urlKeyAccess) {
    /* handle with YouDash app */
    echo $youdashHTMLFile;
    
  } else if($appAccess){
   
    /* handle with new App (old memqr replacement ) */
    echo $appHTMLFile;

  } else if (isset($pageAccess)) {
    include_once('sitefiles/pages/' . $pageAccess);
  } else {
    /*
     * neither sasl access or urlkey access.
     * neither URL nor sa,sl provided
     */
    include_once('sitefiles/pages/' . 'common_index.php');
  }
}
 