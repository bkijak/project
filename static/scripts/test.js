$(document).ready(function() {

var numOfQuestions = 10;
var question1 = outputQType1(1);
var question2 = outputQType1(2);
testQuestions.innerHTML = question1[0];
testQuestions.innerHTML += question2[0];

//Outputs a binary - binary question
//Returns [HTML string, answer]
function outputQType1(questionNumber) {
  var outputString = "";
  var number = randomNumber(1,255);
  var number2 = randomNumber(1,255);

  while (number2 >= number) {
    number2 = randomNumber(1,255);
  }

  var answer = number - number2;
  var binary = (number).toString(2);
  var binary2 = (number2).toString(2);
  var paddedBinary = ("00000000" + binary).slice(-8);

  var paddedBinary2 = ("00000000" + binary2).slice(-8);
  console.log("binary1: ", binary);
  console.log("padded binary1: ", paddedBinary);
  console.log("binary2: ", binary2);
  console.log("padded binary2: ", paddedBinary2);


  outputString = "<div class=questionContainer>  <h1 class='questionHeader'> Question " + questionNumber + " - subtract the bottom number from the top number </h1>" +
                         "<br>" + paddedBinary + "<br>" + paddedBinary2 + "<br> <br> <label class='testAnswerLabel'> Answer (in decimal) </label> <br> <input type='text' name'answer' id='answer" +
                         questionNumber + "'" + "</div>";

  return [outputString, answer];

}

function addPadding(number) {
  var a = ("00000000" + number).slice(-8);
  return a;
}

function randomNumber(min,max) {
  return (Math.round((max-min) * Math.random() + min));
}

});
