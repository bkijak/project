//A method to display and close alerts on the website
$(document).ready(function() {
  var alert = document.getElementById('alert-warning');
  var closeBtn = document.getElementById('close');

  closeBtn.onclick = function() {
    alert.style.display = "none";
  }
});
