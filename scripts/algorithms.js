$(document).ready(function(){
  // A function that sorts a given array using bubble sort
  function bubbleSort(arr){
    var newArray = arr;
    var len = newArray.length;
    for (var i = len-1; i>=0; i--){
      for(var j = 1; j<=i; j++){
       if(newArray[j-1]>newArray[j]){
           var temp = newArray[j-1];
           newArray[j-1] = newArray[j];
           newArray[j] = temp;
        }
     }
    }
    return newArray;
}

// A function that sorts a given array using selection sort
function selectionSort(arr){
  var minIdx, temp,
      len = arr.length;
  for(var i = 0; i < len; i++){
    minIdx = i;
    for(var  j = i+1; j<len; j++){
       if(arr[j]<arr[minIdx]){
          minIdx = j;
       }
    }
    temp = arr[i];
    arr[i] = arr[minIdx];
    arr[minIdx] = temp;
  }
  return arr;
}

// A function that sorts a given array using insertion sort
function insertionSort(arr){
  var i, len = arr.length, el, j;

  for(i = 1; i<len; i++){
    el = arr[i];
    j = i;

    while(j>0 && arr[j-1]>toInsert){
      arr[j] = arr[j-1];
      j--;
   }

   arr[j] = el;
  }

  return arr;
}
// A function that returns a random integer given the min and max value
// that the integer can be
function random_number(min,max) {
    return (Math.round((max-min) * Math.random() + min));
}

// A function to create and return an array filled with random integers
// The method take the length of the array, the minimum random number
// and the maximum random number.
function create_array(num_elements,min,max) {

    var temp, nums = new Array;

    for (var element=0; element<num_elements; element++) {

        //IMPORTANT: DON'T FORGET THE SEMI-COLON AT THE END
        while((temp=number_found(random_number(min,max),nums))==-1);
        nums[element] = temp;
    }

    return (nums);
}

// A function that determines whether an integer already exists within
// an array
function number_found (random_number,number_array) {

    for (var element=0; element<number_array.length; element++) {

        if (random_number==number_array[element]) {
            return (-1);
	}
   }

    return (random_number);
}

var randArray = create_array(10,1,50);
var copyArray = randArray;
console.log("random array: " + randArray);
var bubbleArray = bubbleSort(randArray);
console.log("bubble sort array: " + bubbleArray);
console.log("random array: " + copyArray);
// console.log(selectionSort(randArray));
showArray(copyArray);
// console.log(insertionSort(randArray));
});
