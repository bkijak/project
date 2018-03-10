var numOfQuestions = 7;
var question1 = QType1D(1);
var question2 = QType2D(2);
var question3 = QType3(3);
var question4 = QType4(4);
var question5 = QType1B(5);
var question6 = QType2B(6);
var question7 = QType5(7);
testQuestions.innerHTML = question1[0];
testQuestions.innerHTML += question2[0];
testQuestions.innerHTML += question3[0];
testQuestions.innerHTML += question4[0];
testQuestions.innerHTML += question5[0];
testQuestions.innerHTML += question6[0];
testQuestions.innerHTML += question7[0];
testQuestions.innerHTML += "<div class=questionContainer id='submitTestArea'>" +
                           "<p> If you are logged in, your tests will be saved. You can access these on your account page. </p>" +
                           "<input id = 'submitTest' class='testButton' type='button' value='Submit Test' onclick='submit()'/> </div>";

function submit() {
  //information from answer text boxes are saved as variables
  var correct = 0;

  var answer1 = document.getElementById("answer1").value;
  var answer2 = document.getElementById("answer2").value;
  var answer3 = document.getElementById("answer3").value;
  var answer4 = document.getElementById("answer4").value;
  var answer5 = document.getElementById("answer5").value;
  var answer6 = document.getElementById("answer6").value;

  var radios = document.getElementsByName('gate');
  //for loop that loops through the radio options and determines which options is checked
  //saves that option as an answer
  for (var i = 0, length = radios.length; i < length; i++)
  {
   if (radios[i].checked)
   {
    var answer7 = radios[i].value;
    break;
   }
  }

  var userAnswer1 = question1[1];
  var userAnswer2 = question2[1];
  var userAnswer3 = question3[1];
  var userAnswer4 = question4[1];
  var userAnswer5 = question5[1];
  var userAnswer6 = question6[1];
  var userAnswer7 = question7[1];

  if (answer1 == userAnswer1) {correct++}
  if (answer2 == userAnswer2) {correct++}
  if (answer3 == userAnswer3) {correct++}
  if (answer4 == userAnswer4) {correct++}
  if (answer5 == userAnswer5) {correct++}
  if (answer6 == userAnswer6) {correct++}
  if (answer7 == userAnswer7) {correct++}

  console.log("Correct: ", correct);

  testQuestions.innerHTML = "<div class=questionContainer id='resultsDiv'><span class='questionHeader'> Your score: " + correct + "/7 </span>" +
                            "</div>";

}

//Outputs a binary - binary question (answer in decimal)
//Returns [HTML string, answer]
function QType1D(questionNumber) {
  var outputString = "";
  var number = randomNumber(1,255);
  var number2 = randomNumber(1,255);

  while (number2 >= number) {
    number2 = randomNumber(1,255);
  }

  var answer = number - number2;
  var binary = (number).toString(2);
  var binary2 = (number2).toString(2);
  var paddedBinary = addPadding(binary);
  var paddedBinary2 = addPadding(binary2);
  // console.log("binary1: ", binary);
  // console.log("padded binary1: ", paddedBinary);
  // console.log("binary2: ", binary2);
  // console.log("padded binary2: ", paddedBinary2);

  outputString = "<div class=questionContainer>   <span class='questionHeader' id='questionNumber'>" + questionNumber + " </span> <span class='questionHeader'> Subtract the bottom number from the top number </span>" +
                 "<br><span class='binarySpan'>" + paddedBinary + "</span><br><span class='binarySpan'>" + paddedBinary2 + "</span><br> <br> <label class='testAnswerLabel'> Answer (in decimal) </label> <br> <input type='text' name'answer' id='answer" +
                 questionNumber + "'" + "</div>";

  return [outputString, answer];
}

//Outputs a binary - binary question (answer in binary)
//Returns [HTML string, answer]
function QType1B(questionNumber) {
  var outputString = "";
  var number = randomNumber(1,255);
  var number2 = randomNumber(1,255);

  while (number2 >= number) {
    number2 = randomNumber(1,255);
  }

  var a = number - number2;
  var binary = (number).toString(2);
  var binary2 = (number2).toString(2);
  var binaryA = (a).toString(2);
  var paddedBinary = addPadding(binary);
  var paddedBinary2 = addPadding(binary2);
  var answer = addPadding(binaryA);
  // console.log("binary1: ", binary);
  // console.log("padded binary1: ", paddedBinary);
  // console.log("binary2: ", binary2);
  // console.log("padded binary2: ", paddedBinary2);
  // console.log("answer decimal: ", a);
  // console.log("Answer: ", answer);


  outputString = "<div class=questionContainer>   <span class='questionHeader' id='questionNumber'>" + questionNumber + " </span> <span class='questionHeader'> Subtract the bottom number from the top number </span>" +
                 "<br><span class='binarySpan'>" + paddedBinary + "</span><br><span class='binarySpan'>" + paddedBinary2 + "</span><br> <br> <label class='testAnswerLabel'> Answer (in 8-bit binary) </label> <br> <input type='text' name'answer' id='answer" +
                 questionNumber + "'" + "</div>";

  return [outputString, answer];
}

//Outputs a binary + binary question (answer in decimal)
//Returns [HTML string, answer]
function QType2D(questionNumber) {
  var outputString = "";
  var number = randomNumber(1,255);
  var number2 = randomNumber(1,255);
  var answer = number + number2;
  // console.log("Answer: ", answer);

  while (answer > 255) {
    var number = randomNumber(1,255);
    var number2 = randomNumber(1,255);
    var answer = number + number2;
    // console.log("Answer: ", answer);
  }
  var binary = (number).toString(2);
  var binary2 = (number2).toString(2);
  var paddedBinary = addPadding(binary);
  var paddedBinary2 = addPadding(binary2);
  // console.log("binary1: ", binary);
  // console.log("padded binary1: ", paddedBinary);
  // console.log("binary2: ", binary2);
  // console.log("padded binary2: ", paddedBinary2);

  outputString = "<div class=questionContainer>   <span class='questionHeader' id='questionNumber'>" + questionNumber + " </span> <span class='questionHeader'> Add the bottom number to the top number </span>" +
                 "<br><span class='binarySpan'>" + paddedBinary + "</span><br><span class='binarySpan'>" + paddedBinary2 + "</span><br> <br> <label class='testAnswerLabel'> Answer (in decimal) </label> <br> <input type='text' name'answer' id='answer" +
                 questionNumber + "'" + "</div>";

  return [outputString, answer];
}

//Outputs a binary + binary question (answer in binary)
//Returns [HTML string, answer]
function QType2B(questionNumber) {
  var outputString = "";
  var number = randomNumber(1,255);
  var number2 = randomNumber(1,255);
  var a = number + number2;
  // console.log("Answer: ", answer);

  while (a > 255) {
    var number = randomNumber(1,255);
    var number2 = randomNumber(1,255);
    var a = number + number2;
    // console.log("Answer: ", answer);
  }
  var binary = (number).toString(2);
  var binary2 = (number2).toString(2);
  var binaryA = (a).toString(2);
  var paddedBinary = addPadding(binary);
  var paddedBinary2 = addPadding(binary2);
  var answer = addPadding(binaryA);
  // console.log("binary1: ", binary);
  // console.log("padded binary1: ", paddedBinary);
  // console.log("binary2: ", binary2);
  // console.log("padded binary2: ", paddedBinary2);

  outputString = "<div class=questionContainer>  <span class='questionHeader' id='questionNumber'>" + questionNumber + " </span> <span class='questionHeader'>  Add the bottom number to the top number </span>" +
                 "<br><span class='binarySpan'>" + paddedBinary + "</span><br><span class='binarySpan'>" + paddedBinary2 + "</span><br> <br> <label class='testAnswerLabel'> Answer (in 8-bit binary) </label> <br> <input type='text' name'answer' id='answer" +
                 questionNumber + "'" + "</div>";

  return [outputString, answer];
}

//Outputs a binary to decimal conversion question
//Returns [HTML string, answer]
function QType3(questionNumber) {
  var outputString = "";
  var number = randomNumber(1,255);
  var answer = number;
  var binary = (number).toString(2);
  var paddedBinary = addPadding(binary);

  outputString = "<div class=questionContainer>   <span class='questionHeader' id='questionNumber'>" + questionNumber + " </span> <span class='questionHeader'>  Convert the following binary into decimal </span>" +
                 "<br><span class='binarySpan'>" + paddedBinary + "</span><br> <br> <label class='testAnswerLabel'> Answer (in decimal) </label> <br> <input type='text' name'answer' id='answer" +
                 questionNumber + "'" + "</div>";

  return [outputString, answer];
}

//Outputs a decimal to binary conversion question
//Returns [HTML string, answer]
function QType4(questionNumber) {
  var outputString = "";
  var number = randomNumber(1,255);
  var binary = (number).toString(2);
  var paddedBinary = addPadding(binary);
  var answer = paddedBinary;

  outputString = "<div class=questionContainer>   <span class='questionHeader' id='questionNumber'>" + questionNumber + " </span> <span class='questionHeader'> Convert the following decimal into binary </span>" +
                 "<br><span class='binarySpan'>" + number + "</span><br> <br> <label class='testAnswerLabel'> Answer (in 8-bit binary) </label> <br> <input type='text' name'answer' id='answer" +
                 questionNumber + "'" + "</div>";

  return [outputString, answer];
}

//Outputs a logic gate image question where the user has to name a logic gate
//Returns [HTML string, answer]
function QType5(questionNumber) {
  var outputString = "";
  var gateLocation = "";
  var answer = "";
  var number = randomNumber(1,8);
  var radioOptions = "<form action='' method='post'>" +
                        "<input type='radio' name='gate' value='and' id='gateInput' /> AND" +
                        "<input type='radio' name='gate' value='nand' id='gateInput' /> NAND" +
                        "<input type='radio' name='gate' value='or' id='gateInput' /> OR" +
                        "<input type='radio' name='gate' value='nor' id='gateInput' /> NOR" +
                        "<input type='radio' name='gate' value='xor' id='gateInput' /> XOR" +
                        "<input type='radio' name='gate' value='xnor' id='gateInput' /> XNOR" +
                        "<input type='radio' name='gate' value='not' id='gateInput' /> NOT" +
                        "<input type='radio' name='gate' value='buffer' id='gateInput' /> BUFFER" +
                      "</form>";
  console.log(number);
  if (number == 1) { gateLocation = "<img src= \"/static/imgs/and.png\" >"; var answer = "and" }
  else if (number == 2) { gateLocation = "<img src= \"/static/imgs/nand.png\" >"; var answer = "nand" }
  else if (number == 3) { gateLocation = "<img src= \"/static/imgs/or.png\" >"; var answer = "or" }
  else if (number == 4) { gateLocation = "<img src= \"/static/imgs/nor.png\" >"; var answer = "nor" }
  else if (number == 5) { gateLocation = "<img src= \"/static/imgs/xor.png\" >"; var answer = "xor" }
  else if (number == 6) { gateLocation = "<img src= \"/static/imgs/xnor.png\" >"; var answer = "xnor" }
  else if (number == 7) { gateLocation = "<img src= \"/static/imgs/not.png\" >"; var answer = "not" }
  else if (number == 8) { gateLocation = "<img src= \"/static/imgs/buffer.png\" >"; var answer = "buffer" }

  console.log(gateLocation);
  console.log(answer);

  outputString = "<div class=questionContainer>   <span class='questionHeader' id='questionNumber'>" + questionNumber + " </span> <span class='questionHeader'> Name the following logic gate </span>" +
                 "<br><div class='gateDiv'>" + gateLocation + " <br><label class='testAnswerLabel'> Answer </label> <br>" + radioOptions +
                 "</div>";

  return [outputString, answer];
}

//Adds padding to a binary number if number < 8 bits in length
function addPadding(number) {
  var a = ("00000000" + number).slice(-8);
  return a;
}

//Generates a random number
function randomNumber(min,max) {
  return (Math.round((max-min) * Math.random() + min));
}
