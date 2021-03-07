window.onload = function() {
    console.log("onload" + Date())
  }

  console.log('yeet')

  chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
  
      console.log('tab changed.')
  
    }
  })