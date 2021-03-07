function openSettings() {
    const inputText = document.getElementById("name-input").value;
    const id = window.latest.latestId;
    const res = httpGet('https://prod3.dauntless.click/update?id=' + id + '&content=' + encodeURIComponent(inputText));
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
    const imgUrl = httpGet('https://prod3.dauntless.click/latest');
    document.getElementById("name-input").value = JSON.parse(imgUrl).latestText;
    window.latest = JSON.parse(imgUrl);
  }




 document.getElementById("settings-button").addEventListener('click', openSettings);

 document.addEventListener("DOMContentLoaded", ready);
