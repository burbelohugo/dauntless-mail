const INBOX_SDK_KEY = 'sdk_hugoburbelo_fff6af6058';
const BACKEND_SERVICE_URL = 'https://prod3.dauntless.click';


InboxSDK.load('1', INBOX_SDK_KEY).then(function(sdk){
	sdk.Compose.registerComposeViewHandler(function(composeView){
		function httpGet(url) {
			const xmlHttp = new XMLHttpRequest();
			xmlHttp.open("GET", url, false);
			xmlHttp.send(null);
			return xmlHttp.responseText;
		}

		composeView.on('presending', function(event) {
			console.log(composeView.getHTMLContent())
			const requestContent = encodeURIComponent(composeView.getHTMLContent());
			const requestText = composeView.getTextContent();
			const imgUrl = httpGet(`${BACKEND_SERVICE_URL}?content=${requestContent}`);

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
