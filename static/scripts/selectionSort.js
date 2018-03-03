var targetCount;
var count;
var timer;
var array1;
var topTri = "<span id='topTri'>&#9650</span>";
var botTri = "<span id='botTri'>&#9660;</span>";

//Executes the sorting algorithm on a randomly generated array
//given the number of elements by the user
function runSort() {
  var numElements = document.getElementById("elements").value;
  algorithmText3.innerHTML = "";
  // alert(numElements);
  array1 = createArray(numElements, 1, numElements*2);
  var speed = parseInt(speedSelectList.options[speedSelectList.selectedIndex].value);
  targetCount = 1;
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(animateSelectionSort, speed);
}

//Selection sort algorithm
function selectionSort(array1) {
  for (var i = 0; i < array1.length-1; i++) {
    var text = "";
    var minimalPos = i;
    var start = array1[i];
    for (var j = i; j < array1.length; j++) {
      if (array1[j] < start) {
        algorithmText1.innerHTML = "<p> <span id='algoElement' class='target'>" + array1[j] + "</span> is smaller than <span id='algoElement' class='minimalPos'>" + start + "</span> <br>" +
                                    " <span id='algoElement' class='minimalPos'>" + array1[j] + "</span> is now the smallest element </p>";
        minimalPos = j;
        start = array1[j];
      }
      if (array1[j] > start) {
        algorithmText1.innerHTML = "<p> <span id='algoElement' class='target'>" + array1[j] + "</span> is larger than <span id='algoElement' class='minimalPos'>" + start + "</span> " +
                                    " <br> Smallest element stays the same </p>";
      }
      if (updateCount()) {
        printArray(array1, i, j, minimalPos);
        return;
      }
    }
    if (array1[i] != array1[minimalPos]){
      algorithmText1.innerHTML = "<p>" + "Switching <span id='algoElement' class='start'>" + array1[i] + "</span> with <span id='algoElement' class='minimalPos'>"
      + array1[minimalPos] + "</span> </p>";
    }

    var temp = array1[i];
    array1[i] = array1[minimalPos];
    array1[minimalPos] = temp;


  }
  //Printing the array once more becuase i is greater than the lenngth of the array
  algorithmText1.innerHTML = "<p>" + "All " + array1.length + " elements sorted " + "</p>";
  printArray(array1, i+1, -1, -1);
  endAnimate();
}

//A fuction to display the array in HTML
function printArray (array1, start, target, minimalPos) {
  //initialise string item which will be one item within the list
  var item = "";
  for (var i = 0; i < array1.length; i++) {
    var style = "";
    var triangle1 = "";
    var triangle2 = "";

    if (i < start) {
      style = "class = 'finished'";
    }
    if (i == start) {
      triangle1 = topTri;
      style = "class = 'start'";
    }
    if (i == target) {
      style = "class = 'target'";
    }
    if (i == minimalPos) {
      triangle2 = botTri;
      style = "class = 'minimalPos'";
    }
    if(i == minimalPos && i == start) {
      style = "class = 'minAndStart'";
    }
    if(i == minimalPos && i == target) {
      style = "class = 'minAndTar'";
    }
    if(i == minimalPos && i == target && i == start) {
      style = "class = 'minAndStartAndTar'";
    }
    item += "<li " + style + ">" + array1[i] + triangle1 + triangle2 + "</li>";
  }

  OutDiv.innerHTML = "<ul>" + item + "</ul>";
}

//A function used to animate the selection sort algorithm
function animateSelectionSort() {
  count = 0;
  selectionSort(array1);
  targetCount++;
}

function endAnimate() {
  clearInterval(timer);
}

function updateCount() {
  count++;
  return (count == targetCount);
}

// A function that returns a random integer given the min and max value
// that the integer can be
function randomNumber(min,max) {
    return (Math.round((max-min) * Math.random() + min));
}

// A function to create and return an array filled with random integers
// The method takes the length of the array, the minimum random number
// and the maximum random number.
function createArray(num_elements,min,max) {

    var temp, nums = new Array;

    for (var element=0; element<num_elements; element++) {

        while((temp=numberFound(randomNumber(min,max),nums))==-1);
        nums[element] = temp;
    }

    return (nums);
}

// A function that determines whether an integer already exists within
// an array
function numberFound (random_number,number_array) {

    for (var element=0; element<number_array.length; element++) {

        if (random_number==number_array[element]) {
            return (-1);
	}
   }

    return (random_number);
}
