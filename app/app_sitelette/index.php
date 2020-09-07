<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once('preprocessing.php');
if ($blockAccess) {
  include_once('error_page/blocked_access.php');
} else {
  if ($saslAccess || $urlKeyAccess) {
    if ($isDesktop) {
      if (!is_null($errorMessage)) {
        include_once('error_page/error_page.php');
      } else {
        include_once 'themes/' . $themeId . '/desktop/head.php';
        if ($useTemplate) {
          echo $siteletteJSON['landingViewHTML'];
        } else {
          include_once 'themes/' . $themeId . '/desktop/body.html';
        }
        echo '</html>';
      }
    } else { 
      include_once 'youdash/index.html'  ;  
    }
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
