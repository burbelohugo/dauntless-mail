const INBOX_SDK_KEY = 'sdk_hugoburbelo_fff6af6058';
const BACKEND_SERVICE_URL = 'https://prod3.dauntless.click';


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
			const requestContent = encodeURIComponent(composeView.getHTMLContent());
			const requestText = composeView.getTextContent();
			const imgUrl = httpPost(BACKEND_SERVICE_URL, {content: requestContent});

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
});
