var targetCount;
var count;
var timer;
var array1;
var topTri = "<span id='topTri' >&#9650</span>";
var botTri = "<span id='botTri' >&#9660;</span>";

//Executes the sorting algorithm on a randomly generated array
//given the number of elements by the user
function runSort() {
  var numElements = document.getElementById("elements").value;
  // alert(numElements);
  array1 = createArray(numElements, 1, numElements*2);
  var speed = parseInt(speedSelectList.options[speedSelectList.selectedIndex].value);
  targetCount = 1;
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(animateInsertionSort, speed);
}

//Insertion sort algorithm
function insertionSort(array1) {
  for(var i = 1; i <array1.length; i++) {
    var current = array1[i];
    var j = i-1;
    while ((j >= 0)) {
      if(updateCount()) {
        printArray(array1, j+1, i, i)
        return;
      }
      if(current >= array1[j]) {
        algorithmText1.innerHTML = "<p> <span id='algoElement'>" + current + "</span> is larger than <span id='algoElement'>" + array1[j] + "</span> <br> <span id='algoElement'>" + current +
                                    "</span> sorted into this position </p>";
        break;
      }


      if (current <= array1[j] && j != 0) {
        algorithmText1.innerHTML = "<p> <span id='algoElement'>" + current + "</span> is smaller than <span id='algoElement'>" + array1[j] + " </span> <br> Progressing further </p>";

      }
      if (j == 0) {
        algorithmText1.innerHTML = "<p>  <span id='algoElement'>" + current + "</span> is smaller than <span id='algoElement'>" + array1[j] + "</span> <br> <span id='algoElement'>" + current + "</span> is now the first element in the array </p>";
      }
      array1[j+1] = array1[j];
      array1[j] = current;
      j--;
    }
    array1[j+1] = current;
  }

  algorithmText1.innerHTML = "<p>" + "All " + array1.length + " elements sorted " + "</p>";
  printArray(array1, i+1, -1, -1);
  endAnimate();
}

//A fuction to display the array in HTML
function printArray (array1, start, target, minimalPos) {
  //initialise string item which will be one item within the list
  var item = "";
  var item0 = "";
  for (var i = 0; i < array1.length; i++) {
    var style = "";
    var style2 = "";
    var triangle1 = "";
    var triangle2 = "";


    // if (i == start) {
    //   style = "class = 'target'";
    // }
    if (i == target) {
      style = "class = 'start'";
    }
    if (i == minimalPos) {
      triangle2 = topTri;
      style = "class = 'start'";
    }
    if (i == minimalPos && i == start) {
      triangle2 = topTri;
      style = "class = 'tarAndStart'";
    }
    if (i < minimalPos || minimalPos == -1) {
      style = "class = 'finished'";
    }
    if(i == start && i < minimalPos) {
      style = "class = 'target'";
    }
    if (array1[i] > array1[i-1]) {
      style2 = "class = 'lowerThan'";
    }

    item += "<li " + style + ">" + array1[i] + triangle1 + triangle2 + "</li>";
    item0 += "<li " + style2 + ">" + array1[i-1] + "</li>";

  }

  OutDiv.innerHTML = "<ul>" + item + "</ul>";
}

//A function used to animate the selection sort algorithm
function animateInsertionSort() {
  B = array1.slice();
  count = 0;
  insertionSort(B);
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
