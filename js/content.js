chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.requested == "createDiv"){
            //Code to create the div

            function CreateDiv(){
                console.log("Created");
                var div = document.createElement("div");
                div.style.width = "100px";
                div.style.height = "100px";
                div.innerHTML = "Hello";
                document.body.appendChild(div);
            }

            chrome.contextMenus.create({"title": "Menu", "onclick": CreateDiv});
            sendResponse({confirmation: "Successfully created div"});
        }
    });


