var result = (function () {

    let cacheStorage = {
        active: {},
        configuration: {}, //sites{control, time and url}
        data: {} //insider this there will be currentDate:site:seconds
    }


    const STORAGE = chrome.storage.sync;



    //For getting real time update from the Ui
    chrome.runtime.onMessage.addListener(
        function(response, sender, sendResponse) {
            let temp = response.split(" ");
            let new_url = temp[0];
            let new_url_value = temp[1];
            STORAGE.get("cacheStorage",function(result){
                result.cacheStorage.configuration[new_url]=new_url_value;
                Object.assign(cacheStorage.configuration, result.cacheStorage.configuration);
                STORAGE.set({"cacheStorage": cacheStorage});//for the key configuration
            })

        }
    );

    let delayHandler;

    const trackRealTime = async (name) => {
        const { configuration } = cacheStorage;
        if (configuration[name]) {
            const currentDate = getCurrentDate();
            const { data } = cacheStorage;
            let timeSpent = 0;
            if (data[currentDate] && data[currentDate][name]) {
                timeSpent = data[currentDate][name];
            }
            const secondsLeft = configuration[name] - timeSpent;

            console.log("from delayed Action"+secondsLeft);
            delayHandler = setTimeout(() => {
                notify(`You can no longer be on ${name}`);
                chrome.tabs.executeScript({

                    code: `document.body.style.opacity='0.5';document.body.style.pointerEvents = 'none';
                    let iDiv = document.createElement('div');iDiv.id = 'block';iDiv.className = 'block';
                    iDiv.style.left='500px';iDiv.style.top='200px';iDiv.style.height ='500px';iDiv.style.width ='500px';
                    iDiv.style.zIndex = '2147483647';iDiv.style.backgroundColor='Orange';iDiv.style.position='fixed';
                    document.body.insertAdjacentElement('beforebegin', iDiv);var btn = document.createElement('BUTTON');
                    btn.innerHTML = 'Continue';iDiv.appendChild(btn);btn.style.position='absolute';btn.style.left='160px';btn.style.top='200px';
                    var p1 = document.createElement('p'); p1.innerHTML='Oops....You have exceeded the time limit';
                    iDiv.appendChild(p1);
                    btn.addEventListener('click',function(){
                    iDiv.parentNode.removeChild(iDiv); document.body.style.opacity='1';
                    document.body.style.pointerEvents='auto';})`

                });
            }, secondsLeft * 1000);
        }
    };

    //TODO first refine the current app itself---DONE
    //TODO data should persist atleast for a single day--DONE
    //TODO tab should not close, overlay should be shown, user should be able to close overlay and show msg if user ignores--DONE
    //TODO Url refinement a bit more--DONE
    //TODO realtime update-- DONE
    //TODO show just first 5 Major Urls--DONE

    function initialize() {
        currentDate = getCurrentDate();
        cacheStorage.data = {};
        cacheStorage.data[currentDate] = {};
        console.log("I should be executed first");
        chrome.storage.local.clear(function () {
            var error = chrome.runtime.lastError;
            if (error) {
                console.error(error);
            }
        });
        console.log(cacheStorage);
    }

  //  intiliaze();


//Check whether to continue previous data or initialize
    STORAGE.get('cacheStorage', function(result) {
        if (result) {

            let  currentDate = getCurrentDate();
            //if the data for current date exist in chrome storage
            if(result.cacheStorage.data&&result.cacheStorage.data[currentDate]) {

                //Trying to get the seconds even if the browser is closed
                Object.assign(cacheStorage.data, result.cacheStorage.data);
                Object.assign(cacheStorage.configuration, result.cacheStorage.configuration);
                console.log("Using previous Chrome Storage for CurrentDate")

            }
            else    //if there's no data for the currrent data
            {
                initialize();
                STORAGE.set({'cacheStorage': cacheStorage});

            }
        } else {
            initialize();
            STORAGE.set({'cacheStorage': cacheStorage});

        }
    });

    function notify(message, action) {   //create a notification(IF TIME IS EXCEEDED)
        const notificationObject = {
            type: 'basic',
            iconUrl: 'images/icon_128.png',
            title: 'SCREENTIME',
            message
        };
        if (action) {
            notificationObject.buttons = [
                {title: 'Close Site'}
            ];
            notificationObject.requireInteraction = true;
        }
        // eslint-disable-next-line
        chrome.notifications.create(notificationObject, () => {
        });
    }

    function getActiveTab() {    //return the active Tab
        return new Promise((resolve) => {
            // eslint-disable-next-line
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, (activeTab) => {
                resolve(activeTab[0]);
            });
        });
    }


    function pad(number) {
        if (number < 10) {
            return `0${number}`;
        }
        return number;
    }

    Date.prototype.toISOString = function iso() {
        return `${this.getFullYear()
        }-${pad(this.getMonth() + 1)
        }-${pad(this.getDate())
        }T${pad(this.getHours())
        }:${pad(this.getMinutes())
        }:${pad(this.getSeconds())
        }.${(this.getMilliseconds() / 1000).toFixed(3).slice(2, 5)}`;
    };


    function getCurrentDate() {
        return new Date().toISOString().substr(0, 10);
    }

    function end(cacheStorage) {

        const currentDate = getCurrentDate();



        STORAGE.get("cacheStorage", function (result) {

            //Assigning the cacheStorage from the chrome storage to JavaScript Object
            if (result.cacheStorage.configuration) {
                console.log("From Background storage" + (result.cacheStorage.configuration['facebook']));
                let moment = Date.now();
                console.log(moment);
                console.log(result.cacheStorage['configuration']);
                Object.assign(cacheStorage.configuration, result.cacheStorage.configuration);

                STORAGE.set({"cacheStorage":cacheStorage});

                console.log(cacheStorage['configuration']);
                //cacheStorage['configuration'] = result.cacheStorage.configuration;
            }

            //Testing
            console.log(cacheStorage);

            if (result.cacheStorage.data[currentDate]) {
                console.log("From Background 2 " + result.cacheStorage.data[currentDate]['linkedin']);


                //Generalization needed
                //creating a new key for newly added site
                //Just eliminate the previous redundant value

                if (Object.keys(cacheStorage.data[currentDate]).length !== 0) {
                    STORAGE.get("new_url", function (UrlObject) {

                        console.log(Object.keys(cacheStorage.data[currentDate]).length);
                        console.log("new_url is working" + UrlObject.new_url);
                        let new_url = UrlObject.new_url;
                        console.log(cacheStorage.data[currentDate][new_url]);
                        if (cacheStorage.data[currentDate][new_url] === undefined)
                            cacheStorage.data[currentDate][new_url] = 0;        //New url with total time =0 added
                        console.log('local storage got updated');


                    });
                }

                console.log('Updated cacheStorage ');
                console.log(cacheStorage);
            }


        });

        const moment = Date.now();

        const {active} = cacheStorage;


        console.log("Reached in end function");
        console.log(cacheStorage);
        //To remove previous redundant value
        if (Object.keys(cacheStorage['data']).length === 0) {
            console.log("reached here");
            cacheStorage.data[currentDate] = {};
        }
        console.log("After Change");
        console.log(cacheStorage);

        if (active.name)     //only if some site was previously active
        {
            const seconds = parseInt((moment - active.timeStamp) / 1000, 10);//Here's where the seconds are calculated
            //if there's no key in the data key of cacheStorage for currentDate
            if (!cacheStorage.data[currentDate]) {
                cacheStorage.data = {};
                cacheStorage.data[currentDate] = {};
            }

            //real time update
            cacheStorage.data[currentDate][active.name] = cacheStorage.data[currentDate][active.name]
                ? cacheStorage.data[currentDate][active.name] + seconds
                : seconds;


            console.log('Time spent on the given url is');
            console.log(active.name + "  " + cacheStorage.data[currentDate][active.name]);


            STORAGE.set({"cacheStorage": cacheStorage}, function () {
                console.log('cacheStorage saved');
            });

        }
    }


    function getName(url) {
        try {
            const host = new URL(url).hostname;
            return host.replace('www.', '').replace('.com', '').replace('.net', '').replace('.org','');
        } catch (error) {
            return url;
        }
    }


    async function setActive() {


        //Hacky Patch
        // setTimeout(function () {
        //     STORAGE.get("cacheStorage", function (result) {
        //         console.log("New Changes", result.cacheStorage);
        //     });
        // }, 1000);
        //Hacky Patch

        const activeTab = await getActiveTab();
        console.log("reached setActive");

        if (activeTab) {
            const {url, id} = activeTab;
            const name = getName(url);

            if (cacheStorage.active.name !== name)//some other site was previously active
            {

                const moment = Date.now();
                const currentDate = getCurrentDate();


                //Checking for Time Limit
                //Testing


                STORAGE.get("cacheStorage", function (result) {

                    //Check if any limit is set for the active site


                    const currentDate = getCurrentDate();

                    if (result.cacheStorage.configuration)
                        console.log('From Storage1--' + result.cacheStorage.configuration[name])

                    if (cacheStorage.data[currentDate])
                        console.log('From Storage2--' + cacheStorage.data[currentDate][name])

                    let iDiv = document.createElement('div');iDiv.id = 'block';iDiv.className = 'block';

                    if (cacheStorage.data[currentDate] && cacheStorage.data[currentDate][name]) {
                        if (cacheStorage.data[currentDate][name] > result.cacheStorage.configuration[name])
                        {
                             notify(`Time limit exceeded for ${name}`);

                                 chrome.tabs.executeScript({

                                     code: `document.body.style.opacity='0.5';document.body.style.pointerEvents = 'none';
                                let iDiv = document.createElement('div');iDiv.id = 'block';iDiv.className = 'block';
                                iDiv.style.left='500px';iDiv.style.top='200px';iDiv.style.height ='500px';iDiv.style.width ='500px';
                                iDiv.style.zIndex = '2147483647';iDiv.style.backgroundColor='Orange';iDiv.style.position='fixed';
                                document.body.insertAdjacentElement('beforebegin', iDiv);var btn = document.createElement('BUTTON');
                                btn.innerHTML = 'Continue';iDiv.appendChild(btn);btn.style.position='absolute';btn.style.left='160px';btn.style.top='200px';
                                var p1 = document.createElement('p'); p1.innerHTML='Oops....You have exceeded the time limit';
                                iDiv.appendChild(p1);
                                btn.addEventListener('click',function(){
                                iDiv.parentNode.removeChild(iDiv); document.body.style.opacity='1';
                                document.body.style.pointerEvents='auto';})`

                                 });


                        }
                            console.log('New Modification');
                    }


                });
                //Testing
                //Testing 2


                console.log("reached if of setActive");

                console.log("Before end starts");
                console.log(cacheStorage);

                end(cacheStorage);//first end the other sites session
                //assign the current site to be active.
                cacheStorage.active.name = name;

                cacheStorage.active.timeStamp = Date.now();

                clearTimeout(delayHandler);
                trackRealTime(name);//Doubt for Id

                STORAGE.set({'cacheStorage':cacheStorage});
                console.log(cacheStorage);
            }
        }
    }


    //Note this is when the url in the current active tab changes
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {//this is when the current tabs url is updated
        const {url} = tab;  //get the url key of the tab object
        console.log('updated' + url);
        const name = getName(url);

//Dont do it on reloading....do only if u enter some other site on
//current active Tab.
        if (cacheStorage.active.name !== name) {
            setActive();
        }
    });

    //Everytime first onActivated will fire then onUpdated
    //ANd both need to used for calculation
    //This is when you switch between the active tabs
    chrome.tabs.onActivated.addListener(() => {

        clearTimeout(delayHandler);
        if (cacheStorage.active.name) {//for previous active url
            end(cacheStorage);  //end the session and before ending it calculate the time spent
        }
        setActive();
    });

    const FOCUS_GONE = -1;
    chrome.windows.onFocusChanged.addListener((window) => {
        clearTimeout(delayHandler);
        if (window === FOCUS_GONE) {
            console.log("Focus Changed!!!!!");
            end(cacheStorage);
        } else {
            console.log("Focus Changed!!!!!");
            setActive();
        }
    });
})();

console.log('outside the function' + result);

