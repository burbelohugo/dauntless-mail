function openSettings() {
    const inputText = document.getElementById("name-input").value;
    const id = window.latest.latestId;
    const res = httpPost('https://prod3.dauntless.click/update', {id, content: inputText});
    window.close();
 }

function httpPost(url, content) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", url, false);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send(JSON.stringify(content));
    return xmlHttp.responseText;
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
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
