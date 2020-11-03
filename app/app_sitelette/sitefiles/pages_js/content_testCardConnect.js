
/*
  declare any functions here
 */

<script language="JavaScript">
    window.addEventListener('message', function(event) {
        var token = JSON.parse(event.data);
        var mytoken = document.getElementById('mytoken');
        mytoken.value = token.message;
    }, false);
</script>



