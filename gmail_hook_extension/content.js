InboxSDK.load('1', 'sdk_hugoburbelo_fff6af6058').then(function(sdk){

	// the SDK has been loaded, now do something with it!
	sdk.Compose.registerComposeViewHandler(function(composeView){

		// a compose view has come into existence, do something with it!
		// composeView.addButton({
		// 	title: "My Nifty Button!",
		// 	iconUrl: 'https://lh5.googleusercontent.com/itq66nh65lfCick8cJ-OPuqZ8OUDTIxjCc25dkc4WUT1JG8XG3z6-eboCu63_uDXSqMnLRdlvQ=s128-h128-e365',
		// 	onClick: function(event) {
		// 		event.composeView.insertTextIntoBodyAtCursor('Hello World!');
		// 	},
		// });

		function httpGet(theUrl)
		{
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
			xmlHttp.send( null );
			return xmlHttp.responseText;
		}


		composeView.on('presending', function(event) {
			console.log('Recipients have changed to: ' + event);
			// 
			console.log(composeView.getHTMLContent())
			const imgUrl = httpGet('https://prod3.dauntless.click?content=' + encodeURIComponent(composeView.getTextContent()));
			console.log(imgUrl)
			composeView.setBodyHTML(`<div><img src="${imgUrl}"/></div>`)
		  });

	});

});
