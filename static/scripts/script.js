$(document).ready(function() {
  var modal = document.getElementById('passPopup');
  var modal2 = document.getElementById('avatarPopup');
  var btn = document.getElementById('passBtn');
  var span = document.getElementsByClassName("closePassPopup")[0];
  var span2 = document.getElementsByClassName("closeAvatarPopup")[0];
  var avatarBtn = document.getElementById('avatarBtn');
  var imageURL = 'https://medizzy.com/_nuxt/img/user-placeholder.d2a3ff8.png';


  btn.onclick = function() {
    modal.style.display = "block";
  }

  avatarBtn.onclick = function() {
    modal2.style.display = "block";
  }

  span.onclick = function() {
    modal.style.display = "none";
  }

  span2.onclick = function() {
    modal2.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  document.onclick = function(event) {
    if (event.target == modal2) {
      modal2.style.display = "none";
    }
  }

  if(current_user_avatar != null) {
    AvatarPic.innerHTML = "<img src=\""+ current_user_avatar +"\">";
  }
  else if (current_user_avatar == "") {
    AvatarPic.innerHTML = "<img src= \" "+ imageURL +" \" >";
  }
});
