const INBOX_SDK_KEY = 'sdk_hugoburbelo_fff6af6058';
const BACKEND_SERVICE_URL = 'https://prod3.dauntless.click';

let blundrUserId = '';

function getRandomToken() {
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    return hex;
}

// get or set unique user id
chrome.storage.sync.get('blundr_userid', (items) => {
    let userid = items.blundr_userid;
    if (userid) {
		blundrUserId = userid;
    } else {
        userid = getRandomToken();
        chrome.storage.sync.set({blundr_userid: userid}, () => {
            blundrUserId = userid;
        });
    }
});

InboxSDK.load('1', INBOX_SDK_KEY).then(function(sdk){
	sdk.Compose.registerComposeViewHandler(function(composeView){
		function httpPost(url, content) {
			const xmlHttp = new XMLHttpRequest();
			xmlHttp.open("POST", url, false);
			xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xmlHttp.send(JSON.stringify(content));
			return xmlHttp.responseText;
		}

		composeView.on('presending', function(event) {
			console.log(composeView.getHTMLContent())
			const requestContent = composeView.getHTMLContent();
			const requestText = composeView.getTextContent();
			console.log(`Blundr user id is ${blundrUserId}`);
			const imgUrl = httpPost(BACKEND_SERVICE_URL, {content: requestContent, userId: blundrUserId});

			console.log('Successfully replaced text content with image.')
			console.log(imgUrl)

			composeView.setBodyHTML(`
				<div>
					<img src="${imgUrl}"/>
				</div>
				<div>
					<div style='color: white; font-size: 1px; display: none;'>
					${requestText}
					</div>
				</div>
			`)
		  });

		
	});

	sdk.Toolbars.registerThreadButton({
		title: "Edit in Blundr",
		iconUrl: chrome.runtime.getURL("blundr_logo.png"),
		positions: ["LIST", "ROW"],
		listSection: sdk.Toolbars.SectionNames.OTHER,
		onClick: async (event) => { 
			const cpView = await sdk.Compose.openNewComposeView();
			document.querySelectorAll('[data-tooltip="Send ‪(Ctrl-Enter)‬"]').forEach(function(el) {
				el.innerHTML = "Re-Send";
			  });
			cpView.setToRecipients(["hburbelo@gmail.com"]);
			cpView.setSubject("Michelle test");
			cpView.setBodyHTML("<b>Hugo is cool</b>"); 
		},
	  });
});
