$(document).ready(function() {
  var modal = document.getElementById('passPopup');
  var modal2 = document.getElementById('avatarPopup');
  var btn = document.getElementById('passBtn');
  var span = document.getElementsByClassName("closePassPopup")[0];
  var span2 = document.getElementsByClassName("closeAvatarPopup")[0];
  var avatarBtn = document.getElementById('avatarBtn');


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

  if(current_user_admin == "True") {
    if(current_user_avatar != "None") {
      AvatarPic.innerHTML = "<img class='adminImg' src=\""+ current_user_avatar +"\">";
    }
    else if (current_user_avatar == "None") {
      AvatarPic.innerHTML = "<img class='adminImg' src= \"/static/imgs/admin.png\" >";
    }
  }

  else {
    if(current_user_avatar != "None") {
      AvatarPic.innerHTML = "<img class='userImg' src=\""+ current_user_avatar +"\">";
    }
    else if (current_user_avatar == "None") {
      AvatarPic.innerHTML = "<img class='userImg' src= \"/static/imgs/user.png\" >";
    }
  }






});
