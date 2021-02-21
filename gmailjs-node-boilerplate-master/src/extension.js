"use strict";

// loader-code: wait until gmailjs has finished loading, before triggering actual extensiode-code.
const loaderId = setInterval(() => {
    if (!window._gmailjs) {
        return;
    }

    clearInterval(loaderId);
    startExtension(window._gmailjs);
}, 100);

// actual extension-code
function startExtension(gmail) {
    console.log("Extension loading...");
    window.gmail = gmail;

    gmail.observe.on("load", () => {
        const userEmail = gmail.get.user_email();
        console.log("Hello, " + userEmail + ". This is your extension talking!");

        gmail.observe.on("view_email", (domEmail) => {
            console.log("Looking at email:", domEmail);
            const emailData = gmail.new.get.email_data(domEmail);
            console.log("Email data:", emailData);
        });

        gmail.observe.before('send_message', function(url, body, data, xhr){
            console.log('hello')
            var body_params = xhr.xhrParams.body_params;
          
            // // lets cc this email to someone extra if the subject is 'Fake example'
            // if(data.subject == 'Fake example') {
            //   if(body_params.cc) {
            //     if(typeof body_params.cc != 'object') body_params.cc = [ body_params.cc ];
            //   } else {
            //     body_params.cc = [];
            //   }
            //   body_params.cc.push('hburbelo@gmail.com');
            // }
            console.log(url)
          console.log(data);
          console.log(body);
          console.log(xhr);
        //   body.content_html = '"<div dir="ltr">always.</div>"'
            const p = document.getElementsByClassName('Am Al');
            console.log(p)
            // now change the subject
            // data.subject = 'Subject overwritten!';
            console.log("sending message, url:", url, 'body', body, 'email_data', data, 'xhr', xhr);
          });
    });
}
