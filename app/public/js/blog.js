function checkPassword() {
  var password = document.getElementById('password');
  var cpassword = document.getElementById('cpassword');
  var message = document.getElementById('confirmMessage');
  var correctPWColor = "#66cc66"; //red
  var incorrectPWColor = "#ff6666"; //green

  if(password.value == cpassword.value) {
    cpassword.style.backgroundColor = correctPWColor;
    message.style.color = correctPWColor;
    message.innerHTML = "Passwords Match."
  }
  else {
    cpassword.style.backgroundColor = incorrectPWColor;
    message.style.color = incorrectPWColor;
    message.innerHTML = "Passwords do not match. Check Again."
  }
};