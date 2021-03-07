function openSettings() {
    const inputText = document.getElementById("name-input").value;
    const id = window.latest.latestId;
    const res = httpGet('https://blooming-citadel-63501.herokuapp.com/update?id=' + id + '&content=' + encodeURIComponent(inputText));
    window.close();
 }

 function httpGet(theUrl)
 {
     var xmlHttp = new XMLHttpRequest();
     xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
     xmlHttp.send( null );
     return xmlHttp.responseText;
 }

 function ready() {
    const imgUrl = httpGet('https://blooming-citadel-63501.herokuapp.com/latest');
    document.getElementById("name-input").value = JSON.parse(imgUrl).latestText;
    window.latest = JSON.parse(imgUrl);
  }




 document.getElementById("settings-button").addEventListener('click', openSettings);

 document.addEventListener("DOMContentLoaded", ready);
