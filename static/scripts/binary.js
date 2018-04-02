$(document).ready(function(){
  var number = randomNumber(1,255);
  var number2 = randomNumber(1,255);
  var answer = number + number2;

  while (answer > 255) {
    var number = randomNumber(1,255);
    var number2 = randomNumber(1,255);
    var answer = number + number2;
  }
  var binary = (number).toString(2);
  var binary2 = (number2).toString(2);
  var binaryAnswer = (answer).toString(2);
  var paddedBinary = addPadding(binary);
  var paddedBinary2 = addPadding(binary2);
  var paddedAnswer = addPadding(binaryAnswer);

  var bin1 = []
  var bin2 = []
  for (var i = 0; i < paddedBinary.length; i++) {
      bin1[i] = paddedBinary.charAt(i);
  }

  for (var i = 0; i < paddedBinary2.length; i++) {
      bin2[i] = paddedBinary2.charAt(i);
  }

  console.log(paddedBinary);
  console.log(bin1);

  console.log(paddedBinary2);
  console.log(bin2);

  console.log('Original answer = ' + paddedAnswer)

  var carry = ['empty','empty','empty','empty','empty','empty','empty','empty'];
  var answer = ['empty','empty','empty','empty','empty','empty','empty','empty'];

  runDemo(bin1, bin2, carry, answer, 7, 2000);
});


//goes through columns of binary arrays and determines the carry and answer for
//each one of them, calls displayBinary() within each loop. The loop has a delay
// determined by the user
function runDemo(binary1, binary2, carry, answer, i, delay) {
    var finished = 0;
    var text = "";
    if (i < 0) {
      finished = 1;
      displayBinary(binary1, binary2, carry, answer, i, finished);
      document.getElementById('algoInfo').innerHTML += "Demonstration finished";
      return;
    }

    setTimeout(function () {
      if(binary1[i] == 0 && binary2[i] == 0) {
        if(carry[i] == 0 || carry[i] == 'empty') {
          carry[i-1] = 'empty';
          answer[i] = 0;
          text = "<p><span class='bin'> 0 </span> + <span class='bin'> 0 </span> + <span class='carry'> 0 </span> = <span class='answer'> 0 </span></p>" +
           "<p>Next carry is <span class='carry'> 0 </span></p>"
        }
        if(carry[i] == 1) {
          answer[i] = 1;
          text = "<p><span class='bin'> 0 </span> + <span class='bin'> 0 </span> + <span class='carry'> 1 </span> = <span class='answer'> 1 </span></p>" +
           "<p>Next carry is <span class='carry'> 0 </span></p>"
        }
      }
      if(binary1[i] == 1 && binary2[i] == 0){
        if(carry[i] == 0 || carry[i] == 'empty') {
          carry[i-1] = 'empty';
          answer[i] = 1;
          text = "<p><span class='bin'> 1 </span> + <span class='bin'> 0 </span> + <span class='carry'> 0 </span> = <span class='answer'> 1 </span></p>" +
           "<p>Next carry is <span class='carry'> 0 </span></p>"
        }
        if(carry[i] == 1) {
          answer[i] = 0;
          carry[i-1] = 1;
          text = "<p><span class='bin'> 1 </span> + <span class='bin'> 0 </span> + <span class='carry'> 1 </span> = <span class='answer'> 0 </span></p>" +
           "<p>Next carry is <span class='carry'> 0 </span></p>"
        }
      }
      if(binary1[i] == 0 && binary2[i] == 1) {
        if(carry[i] == 0 || carry[i] == 'empty') {
          carry[i-1] = 'empty';
          answer[i] = 1;
          text = "<p><span class='bin'> 0 </span> + <span class='bin'> 1 </span> + <span class='carry'> 0 </span> = <span class='answer'> 1 </span></p>" +
           "<p>Next carry is <span class='carry'> 0 </span></p>"
        }
        if(carry[i] == 1) {
          answer[i] = 0;
          carry[i-1] = 1;
          text = "<p><span class='bin'> 0 </span> + <span class='bin'> 1 </span> + <span class='carry'> 1 </span> = <span class='answer'> 0 </span></p>" +
           "<p>Next carry is <span class='carry'> 1 </span></p>"
        }
      }
      if(binary1[i] == 1 && binary2[i] == 1){
        if(carry[i] == 0 || carry[i] == 'empty') {
          carry[i-1] = 1;
          answer[i] = 0;
          text = "<p><span class='bin'> 1 </span> + <span class='bin'> 1 </span> + <span class='carry'> 0 </span> = <span class='answer'> 0 </span></p>" +
           "<p>Next carry is <span class='carry'> 1 </span></p>"
        }
        if(carry[i] == 1) {
          answer[i] = 1;
          carry[i-1] = 1;
          text = "<p><span class='bin'> 1 </span> + <span class='bin'> 1 </span> + <span class='carry'> 1 </span> = <span class='answer'> 1 </span></p>" +
           "<p>Next carry is <span class='carry'> 1 </span></p>"
        }
      }


      document.getElementById('algoInfo').innerHTML = text;
      displayBinary(binary1, binary2, carry, answer, i, finished);

      runDemo(binary1, binary2, carry, answer, --i, delay);
    }, delay);
}

//displays a table in HTML containing all binary values
function displayBinary(binary1, binary2, carry, answer, column, finished) {
  var row1 = [];
  var row2 = [];
  var row3 = [];
  var row4 = [];

  var td1 = "<td class='unfocused'>";
  var td2 = "<td class='focused'>";
  var ctd = "</td>"

    // for loop looping through all the columns within the binary table
    for(var i = 0; i < 8; i++) {
      if(i != column) {
        row1[i] = td1 + binary1[i] + ctd;
        row2[i] = td1 + binary2[i] + ctd;
        if(carry[i] == 'empty') {
          row3[i] = td1 + ctd;
        }
        else {
          row3[i] = td1 + carry[i] + ctd;
        }
        if(answer[i] == 'empty') {
          row4[i] = td1 + ctd;
        }
        else {
          row4[i] = td1 + answer[i] + ctd;
        }
      }
      else if(i == column) {
        //if the loop in the function calling this function has not finished
        if(!finished) {
          row1[i] = td2 + binary1[i] + ctd;
          row2[i] = td2 + binary2[i] + ctd;
          if(carry[i] == 'empty') {
            row3[i] = td2 + ctd;
          }
          else {
            row3[i] = td2 + carry[i] + ctd;
          }
          if(answer[i] == 'empty') {
            row4[i] = td2 + ctd;
          }
          else {
            row4[i] = td2 + answer[i] + ctd;
          }
        }
        //if the loop in the function calling this function has finished
        else {
          row1[i] = td1 + binary1[i] + ctd;
          row2[i] = td1 + binary2[i] + ctd;
          if(carry[i] == 'empty') {
            row3[i] = td1 + ctd;
          }
          else {
            row3[i] = td1 + carry[i] + ctd;
          }
          if(answer[i] == 'empty') {
            row4[i] = td1 + ctd;
          }
          else {
            row4[i] = td1 + answer[i] + ctd;
          }
        }

      }
    }
    //writing generated rows which are arrays of columns to HTML
    row1=row1.join("");
    row2=row2.join("");
    row3=row3.join("");
    row4=row4.join("");
    // console.log(row1);
    console.log(row3);

    document.getElementById('binary1').innerHTML = row1;
    document.getElementById('binary2').innerHTML = row2;
    document.getElementById('carry').innerHTML = row3;
    document.getElementById('answer').innerHTML = row4;

}

//generates a random number within the given range
function randomNumber(min,max) {
  return (Math.round((max-min) * Math.random() + min));
}

//pads a number with zeros so that the length of the number is 8
function addPadding(number) {
  var a = ("00000000" + number).slice(-8);
  return a;
}
