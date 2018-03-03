function showArray(arr) {
    var dispArray = new Array();
    var cardContainer = document.getElementById("arrayContainer");
    for (var i = 0; i <= arr.length -1; i++) {
        dispArray.push(arr[i]);
        var div = document.createElement("div");
        div.innerHTML = (dispArray[i]);
        arrayContainer.appendChild(div);
    }
    console.log("array to be displayed: " + dispArray);
}
