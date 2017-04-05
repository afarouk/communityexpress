<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once('preprocessing.php');

// not mobile or tablet and not already in the iframe
if (isset($pageAccess)) {
  include_once('sitefiles/pages/' . $pageAccess);
} else if ($saslAccess || $urlKeyAccess) {
  if ($isDesktop) {
    // include_once('sitefiles/pages/' . 'common_desktop.php');
    include_once 'themes/'.$themeId.'/desktop/head.php';
    if ($ftlfile) { //temporary
      echo $siteletteJSON['landingViewHTML'];
    } else {
      include_once 'themes/'.$themeId.'/desktop/body.html';
      // echo $siteletteJSON['landingViewHTML'];
    }
    echo '</html>';
  } else {
    if (!is_null($errorMessage)) {
      include_once('error_page/error_page.php');
    } else {
      include_once 'themes/'.$themeId.'/mobile/head.php';
      if ($useTemplate) {
        echo $siteletteJSON['landingViewHTML'];
      } else {
        include_once 'themes/'.$themeId.'/mobile/body.html';
      }
      echo '</html>';
    }
    /*end valid sitelette*/
  }
} else {
  /*
   * neither sasl access or urlkey access.
   * neither URL nor sa,sl provided
   */
  include_once('sitefiles/pages/' . 'common_chalkboards.php');
}
