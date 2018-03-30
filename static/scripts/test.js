$(document).ready(function(){
  //number of questions in the test
  var numOfQuestions = 10;

  //1D = binary-binary=decimal
  //1B = binary-binary=binary
  //2D = binary+binary=decimal
  //2B = binary+binary=binary
  //3 = binary to decimal
  //4 = decimal to binary
  //5 = logic gate name

  //Initialising a 2d array
  window.questions = [];
  questions[0] = QType3(1);
  questions[1] = QType3(2);
  questions[2] = QType4(3);
  questions[3] = QType4(4);
  questions[4] = QType2D(5);
  questions[5] = QType2B(6);
  questions[6] = QType1D(7);
  questions[7] = QType1B(8);
  questions[8] = QType5(9);
  questions[9] = QType6(10);
  testQuestions.innerHTML = questions[0][3];
  testQuestions.innerHTML += questions[1][3];
  testQuestions.innerHTML += questions[2][3];
  testQuestions.innerHTML += questions[3][3];
  testQuestions.innerHTML += questions[4][3];
  testQuestions.innerHTML += questions[5][3];
  testQuestions.innerHTML += questions[6][3];
  testQuestions.innerHTML += questions[7][3];
  testQuestions.innerHTML += questions[8][3];
  testQuestions.innerHTML += questions[9][3];
  testQuestions.innerHTML += "<div class=questionContainer id='submitTestArea'>" +
                             "<p> If you are logged in, your tests will be saved. You can access these on your account page. </p>" +
                             "<input id = 'submitTest' class='testButton' type='button' value='Submit Test' onclick='submit()'/> </div>";

});

//function that converts an array into an Object
//object contains variables: questionNumber, question, answer and htmlOutput
function toObject(arr) {
  var rv = new Object();
  rv.questionNumber = 0;
  rv.question = "";
  rv.answer = "";
  rv.userAnswer = "";
  rv.correct = 0;
  rv.setQuestionNumber = function(a) {
    this.questionNumber = a;
  }
  rv.setQuestion = function(a) {
    this.question = a;
  }
  rv.setAnswer = function(a) {
    this.answer = a;
  }
  rv.setUserAnswer = function(a) {
    this.userAnswer = a;
  }
  rv.setCorrect = function(a) {
    this.correct = a;
  }

  rv.setQuestionNumber(arr[0]);
  rv.setQuestion(arr[1]);
  rv.setAnswer(arr[2]);
  rv.setUserAnswer(arr[4]);
  rv.setCorrect(arr[5]);
  return rv;
}

function submit() {
  //information from answer text boxes are saved as variables
  var correct = 0;
  var numOfQuestions = 10;
  //array of strings corresponding to answer boxes on the test page
  var answerVars = ["answer1", "answer2", "answer3", "answer4", "answer5", "answer6", "answer7", "answer8", "", "answer10"];

  //looping through answerVars as well as questions[] and adding user answers to questions[]
  for (var i = 0; i < numOfQuestions; i++) {
    if (i != 8) {
      if (document.getElementById(answerVars[i]).value != "") {
        questions[i][4] = document.getElementById(answerVars[i]).value;
      }
      else if (document.getElementById(answerVars[i]).value == "")
          questions[i][4] = "blank";
      }

    //9th question has a radio option instead of a text box
    else if (i == 8) {
      var radios = document.getElementsByName('gate');
      //for loop that loops through the radio options and determines which options is checked
      //saves that option as an answer
      for (var j = 0, length = radios.length; j < length; j++)
      {
       if (radios[j].checked)
       {
         questions[i][4] = radios[j].value;
         break;
       }
      }
      console.log(questions[i][4]);
      if(questions[i][4] === undefined) {
        questions[i][4] = "blank";
      }
    }
  }

  //comparing user answers to correct ones generated when the questions is generated
  //incrementing correct if user answer is the same as generated answer
  //assigning correct boolean to the array
  for (var i = 0; i < numOfQuestions; i++) {
    var correctBool = 0
    if (questions[i][4] == questions[i][2]) {
      correctBool = 1;
      correct++
    }
    questions[i][5] = correctBool;
  }

  for (var i = 0; i < numOfQuestions; i++) {
    console.log("User answer", i , ": ", questions[i][4]);
  }
  testQuestions.innerHTML = "<div class=questionContainer id='resultsDiv'><span class='questionHeader'> You got " + correct + " out of " + numOfQuestions + " questions correct. </span>" +
                            "</div>";

  var questionObj0 = toObject(questions[0]);
  var questionObj1 = toObject(questions[1]);
  var questionObj2 = toObject(questions[2]);
  var questionObj3 = toObject(questions[3]);
  var questionObj4 = toObject(questions[4]);
  var questionObj5 = toObject(questions[5]);
  var questionObj6 = toObject(questions[6]);
  var questionObj7 = toObject(questions[7]);
  var questionObj8 = toObject(questions[8]);
  var questionObj9 = toObject(questions[9]);
  var objectArray = [questionObj0, questionObj1, questionObj2, questionObj3, questionObj4, questionObj5, questionObj6, questionObj7, questionObj8, questionObj9];


  $.ajax({
    type: 'POST',
    url: window.location.href,
    data: JSON.stringify(objectArray),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json'
    }).done(function(msg) {
      console.log(msg);
    });
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

  outputString = "<div class=questionContainer>   <span class='questionHeader' id='questionNumber'>" + questionNumber + " </span> <span class='questionHeader'> Subtract the bottom number from the top number </span>" +
                 "<br><span class='binarySpan'>" + paddedBinary + "</span><br><span class='binarySpan'>" + paddedBinary2 + "</span><br> <br> <label class='testAnswerLabel'> Answer (in decimal) </label> <br> <input type='text' name'answer' id='answer" +
                 questionNumber + "'" + "</div>";

  var question = "Subtract " + paddedBinary2 + " from " + paddedBinary + " (answer in decimal)";
  var a = questionNumber;
  return [a, question, answer, outputString];
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

  outputString = "<div class=questionContainer>   <span class='questionHeader' id='questionNumber'>" + questionNumber + " </span> <span class='questionHeader'> Subtract the bottom number from the top number </span>" +
                 "<br><span class='binarySpan'>" + paddedBinary + "</span><br><span class='binarySpan'>" + paddedBinary2 + "</span><br> <br> <label class='testAnswerLabel'> Answer (in 8-bit binary) </label> <br> <input type='text' name'answer' id='answer" +
                 questionNumber + "'" + "</div>";
  var question = "Subtract " + paddedBinary2 + " from " + paddedBinary + " (answer in 8-bit binary)";
  var a = questionNumber;

  return [questionNumber, question, answer, outputString];
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

  outputString = "<div class=questionContainer>   <span class='questionHeader' id='questionNumber'>" + questionNumber + " </span> <span class='questionHeader'> Add the bottom number to the top number </span>" +
                 "<br><span class='binarySpan'>" + paddedBinary + "</span><br><span class='binarySpan'>" + paddedBinary2 + "</span><br> <br> <label class='testAnswerLabel'> Answer (in decimal) </label> <br> <input type='text' name'answer' id='answer" +
                 questionNumber + "'" + "</div>";
  var question = "Add " + paddedBinary + " to " + paddedBinary2 + " (answer in decimal)";
  var a = questionNumber;

  return [a, question, answer, outputString];
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

  outputString = "<div class=questionContainer>  <span class='questionHeader' id='questionNumber'>" + questionNumber + " </span> <span class='questionHeader'>  Add the bottom number to the top number </span>" +
                 "<br><span class='binarySpan'>" + paddedBinary + "</span><br><span class='binarySpan'>" + paddedBinary2 + "</span><br> <br> <label class='testAnswerLabel'> Answer (in 8-bit binary) </label> <br> <input type='text' name'answer' id='answer" +
                 questionNumber + "'" + "</div>";
  var question = "Add " + paddedBinary + " to " + paddedBinary2 + " (answer in 8-bit binary)";
  var a = questionNumber;

  return [a, question, answer, outputString];
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
  question = "Convert " + paddedBinary + " to decimal";
  var a = questionNumber;

  return [a, question, answer, outputString];
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
  question = "Convert " + number + " to binary (8-bit)";
  var a = questionNumber;

  return [a, question, answer, outputString];
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

  if (number == 1) { gateLocation = "<img src= \"/static/imgs/and.png\" >"; var answer = "and" }
  else if (number == 2) { gateLocation = "<img src= \"/static/imgs/nand.png\" >"; var answer = "nand" }
  else if (number == 3) { gateLocation = "<img src= \"/static/imgs/or.png\" >"; var answer = "or" }
  else if (number == 4) { gateLocation = "<img src= \"/static/imgs/nor.png\" >"; var answer = "nor" }
  else if (number == 5) { gateLocation = "<img src= \"/static/imgs/xor.png\" >"; var answer = "xor" }
  else if (number == 6) { gateLocation = "<img src= \"/static/imgs/xnor.png\" >"; var answer = "xnor" }
  else if (number == 7) { gateLocation = "<img src= \"/static/imgs/not.png\" >"; var answer = "not" }
  else if (number == 8) { gateLocation = "<img src= \"/static/imgs/buffer.png\" >"; var answer = "buffer" }

  outputString = "<div class=questionContainer>   <span class='questionHeader' id='questionNumber'>" + questionNumber + " </span> <span class='questionHeader'> Name the following logic gate </span>" +
                 "<br><div class='gateDiv'>" + gateLocation + " <br><label class='testAnswerLabel'> Answer </label> <br>" + radioOptions +
                 "</div>";
  question = "Name the following logic gate: " + gateLocation;
  var a = questionNumber;
  return [a, question, answer, outputString];
}

function QType6(questionNumber) {
  var outputString = "";
  var inputs = 0;
  var gateLocation = "";
  var answer = "";
  var number = randomNumber(1,8);
  var input1 = randomNumber(0,1);
  var input2 = randomNumber(0,1);

  if (number == 1) {
    gateLocation = "<img src= \"/static/imgs/and.png\" >";
    if (input1 == 1 && input2 == 1 ) {answer = 1}
    else {answer = 0}
    inputs = 2;
  }

  else if (number == 2) {
    gateLocation = "<img src= \"/static/imgs/nand.png\" >";
    if (input1 == 1 && input2 == 1 ) {answer = 0}
    else {answer = 1}
    inputs = 2;
  }

  else if (number == 3) {
    gateLocation = "<img src= \"/static/imgs/or.png\" >";
    if (input1 == 0 && input2 == 0) {answer = 0}
    else {answer = 1}
    inputs = 2;
  }

  else if (number == 4) {
    gateLocation = "<img src= \"/static/imgs/nor.png\" >";
    if (input1 == 1 && input2 == 1) {answer = 0}
    else {answer = 1}
    inputs = 2;
  }

  else if (number == 5) {
    gateLocation = "<img src= \"/static/imgs/xor.png\" >";
    if (input1 == 0 && input2 == 0) {answer = 0}
    else if (input1 == 1 && input2 == 1) {answer = 0}
    else if (input1 == 1 && input2 == 0) {answer = 1}
    else if (input1 == 0 && input2 == 1) {answer = 1}
    inputs = 2;
  }

  else if (number == 6) {
    gateLocation = "<img src= \"/static/imgs/xnor.png\" >";
    if (input1 == 0 && input2 == 0) {answer = 1}
    else if (input1 == 1 && input2 == 1) {answer = 1}
    else if (input1 == 1 && input2 == 0) {answer = 0}
    else if (input1 == 0 && input2 == 1) {answer = 0}
    inputs = 2;
  }

  else if (number == 7) {
    gateLocation = "<img src= \"/static/imgs/not.png\" >";
    if (input1 == 1) {answer = 0}
    else if (input1 == 0) {answer = 1}
    inputs = 1;
  }

  else if (number == 8) {
    gateLocation = "<img src= \"/static/imgs/buffer.png\" >";
    if (input1 == 1) {answer = 1}
    else if (input1 == 0) {answer = 0}
    inputs = 1;
  }

  if (inputs == 2) {
    outputString = "<div class=questionContainer>   <span class='questionHeader' id='questionNumber'>" + questionNumber +
                   " </span> <span class='questionHeader'> Give the output of the following gate, given input 1 = " + input1 +
                   " and input 2 = " + input2 + " </span>" +
                   "<br><div class='gateDiv'>" + gateLocation + " <br><label class='testAnswerLabel'> Answer </label> <br> <input type='text' name'answer' id='answer" +
                   questionNumber + "'" + "</div>";
    question = "Give the output of the following gate, given input 1 = " + input1 + " and input 2 = " + input2 + ": " + gateLocation;
  }
  else if (inputs == 1) {
    outputString = "<div class=questionContainer>   <span class='questionHeader' id='questionNumber'>" + questionNumber +
                   " </span> <span class='questionHeader'> Give the output of the following gate, given input 1 = " + input1 + " </span>" +
                   "<br><div class='gateDiv'>" + gateLocation + " <br><label class='testAnswerLabel'> Answer </label> <br> <input type='text' name'answer' id='answer" +
                   questionNumber + "'" + "</div>";
    question = "Give the output of the following gate, given input 1 = " + input1 + ": " + gateLocation;
  }

  var a = questionNumber;
  return [a, question, answer, outputString];
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
