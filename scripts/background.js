/* chrome.webNavigation.onCompleted.addListener(function (tab) {
    if (tab.url == "http://192.168.45.49:7990/projects/NEXT/repos/nextbank/pull-requests/1787/overview") { // Inspect whether the place where user clicked matches with our list of URL
        chrome.tabs.executeScript(tab.id, {
            "file": "scripts/content.js"
        }, console.log("text"));
    }
    console.log("test2");
});
 */

/* browser.browserAction.onClicked.addListener(function(tab) {
    if(tab.url == "http://192.168.45.49:7990/projects/NEXT/repos/nextbank/pull-requests/1787/overview"){
        console.log("test");
    }
    console.log("test2");
}) */

/* 
chrome.browserAction.onClicked.addListener(buttonClicked);

function buttonClicked(tab) {
    console.log(tab)
} */


function alert(){
    console.log("ola mundo");
}