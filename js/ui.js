//import cacheStorage from './background';

// Control for all the sites
let configuration = {};

let cacheStorage = {};

const STORAGE =chrome.storage.sync;

//For Adding a new Site for tracking via UI
function getName(url) {
    try {
        const host = new URL(url).hostname;
        return host.replace('www.', '').replace('.com', '').replace('.net', '').replace('.org','');
    } catch (error) {
        return url;
    }
}

window.addEventListener('load', (event) => {
    document.getElementById("btnTimeSpent").click();

});


document.getElementById('btnNewurlvalue').addEventListener('click', function () {
    let new_url = document.getElementById("new_url").value;

    new_url = getName(new_url);

    console.log('new url is ' + new_url);

    let currentDate = getCurrentDate();
    STORAGE.get("cacheStorage", function (result) {

        //console.log("First this");
        if (Object.keys(result.cacheStorage.data[currentDate]).length > 0) {
            console.log("accessed cachestorage from UI");
            result.cacheStorage.data[currentDate][new_url] = 0;
        }

        //Change
        //  let cacheStorage1 = result.cacheStorage;

        if (new_url !== "undefined")
            STORAGE.set({"new_url": new_url});//This is useless


        // STORAGE.set({"configuration": cacheStorage1} ,function()
        // {
        //    // console.log('Value is set to new url '+ result.cacheStorage.data[currentDate][new_url]);
        //
        //
        // });


        //setting time constraint

        let new_url_value = document.getElementById("new_url_value").value;
        //configuration[new_url] = new_url_value;

        //Eliminating the need of alt+tab
        let message  = new_url+" "+new_url_value;
        chrome.runtime.sendMessage(message);
        //Eliminating the need of alt+tab



        result.cacheStorage.configuration[new_url]=new_url_value;


        cacheStorage = result.cacheStorage;

        Object.assign(cacheStorage.configuration, result.cacheStorage.configuration);

        STORAGE.set({"cacheStorage": cacheStorage});//for the key configuration
        console.log('Here in UI' +  result.cacheStorage.configuration[new_url]);

    });

});
function sendMessage(url,value)
{
    let message  = url+" "+value;
    chrome.runtime.sendMessage(message);
}

document.getElementById("btnFacebook").addEventListener("click", function () {
    let value = document.getElementById("Facebook").value;
    console.log(value);
    STORAGE.get("cacheStorage", function (result) {


        sendMessage('facebook',value);

        result.cacheStorage.configuration['facebook'] = value;//for the key cacheStorage
synchronize
        console.log(result.cacheStorage.configuration['facebook']);

        cacheStorage = result.cacheStorage;

        console.log(cacheStorage.configuration['facebook']);

        STORAGE.set({"cacheStorage": cacheStorage}, function () {
            console.log('Value is set to' + result.cacheStorage.configuration['facebook']);
        });


    });

});


document.getElementById("btnYoutube").addEventListener("click", function () {
    let value = document.getElementById("Youtube").value;
    console.log(value);
    STORAGE.get("cacheStorage", function (result) {


        sendMessage('youtube',value);

        result.cacheStorage.configuration['youtube'] = value;//for the key cacheStorage

        //Testing
        console.log(result.cacheStorage.configuration['youtube']);

        cacheStorage = result.cacheStorage;
        //console.log(cacheStorage1.configuration['youtube']);

        console.log(cacheStorage.configuration['youtube']);

        //Experiment
        //Working Code
        STORAGE.set({"cacheStorage": cacheStorage}, function () {
            console.log('Value is set to' + result.cacheStorage.configuration['youtube']);
        });

        //Testing

    });

});

document.getElementById("btnLinkedin").addEventListener("click", function () {
    let value = document.getElementById("Linkedin").value;
    console.log(value);
    STORAGE.get("cacheStorage", function (result) {

        sendMessage('linkedin',value);

        result.cacheStorage.configuration['linkedin'] = value;//for the key cacheStorage

        //Testing
        console.log(result.cacheStorage.configuration['linkedin']);

        cacheStorage = result.cacheStorage;
        //console.log(cacheStorage1.configuration['youtube']);

        console.log(cacheStorage.configuration['linkedin']);

        //Experiment
        //Working Code
        STORAGE.set({"cacheStorage": cacheStorage}, function () {
            console.log('Value is set to' + result.cacheStorage.configuration['linkedin']);
        });

        //Testing

    });

});

document.getElementById("btnInstagram").addEventListener("click", function () {
    let value = document.getElementById("Instagram").value;
    console.log(value);
    STORAGE.get("cacheStorage", function (result) {

        sendMessage('instagram',value);


        result.cacheStorage.configuration['instagram'] = value;//for the key cacheStorage

        //Testing
        console.log(result.cacheStorage.configuration['instagram']);

        cacheStorage = result.cacheStorage;
        //console.log(cacheStorage1.configuration['youtube']);

        console.log(cacheStorage.configuration['instagram']);

        //Experiment
        //Working Code
        STORAGE.set({"cacheStorage": cacheStorage}, function () {
            console.log('Value is set to' + result.cacheStorage.configuration['instagram']);
        });

        //Testing

    });

});


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


//Home Page Buttons
document.getElementById("btnTimeSpent").addEventListener("click", function () {


    document.getElementById('myChart').style.display = "block";
    document.getElementById('Control').style.display = "none";

    STORAGE.get('cacheStorage', function (result) {


        let timer = 'timer';
        let data = 'data';


        let myChart = document.getElementById('myChart').getContext('2d');

        let currentDate = getCurrentDate();

        console.log(result.cacheStorage.data[currentDate]);//Note this Step

        console.log(currentDate);



        keys = Object.keys(result.cacheStorage.data[currentDate]);

        values = Object.values(result.cacheStorage.data[currentDate]);

        //Restricting to only 5 Major Urls by sorting
        let map = new Map();

        for(let i=0;i<keys.length;i++)
        {
            map.set(keys[i],values[i]);
        }

        //Sorting the Map in descending order as per value
        map[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
        }

        let keys5=[];
        let values5=[];
        let j=0;
        for (let [key, value] of map) {     // get data sorted
            if(j==5)
                break;
            keys5[j]=key;
            values5[j]=value;
            j++;
        }
        //Restricting to only 5 Major Urls by sorting

        colors = ['rgba(255, 204, 0,0.3)', 'rgba(0, 204, 0,0.3)', 'rgba(51, 204, 255,0.3)', 'rgba(255, 153, 51,0.3)', 'rgba(255, 204, 0,0.3)', 'rgba(0, 204, 0,0.3)', 'rgba(51, 204, 255,0.3)', 'rgba(255, 153, 51,0.3)', 'rgba(255, 204, 0,0.3)', 'rgba(0, 204, 0,0.3)', 'rgba(51, 204, 255,0.3)', 'rgba(255, 153, 51,0.3)'];

        if (keys) {
            console.log('inside');

            let timeChart = new Chart(myChart, {

                type: 'bar',
                data: {

                    labels: keys5,
                    datasets: [{
                        label: 'Time Spent',
                        data: values5,
                        backgroundColor: colors

                    }],


                },
                options: {}


            });

        }

    });


});


document.getElementById("btnControl").addEventListener("click", function () {
    document.getElementById('Control').style.display = "block";
    document.getElementById('myChart').style.display = "none";


});



