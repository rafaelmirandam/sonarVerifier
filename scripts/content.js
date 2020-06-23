var url = window.location.pathname;
var fromBranch = document.getElementsByClassName('branch-name')[0].innerText;
var toBranch = document.getElementsByClassName('branch-name')[1].innerText;
var auth = 'Basic ' + btoa("m190498@corpr.bradesco.com.br:Cap@0805");
var issues = [];
var project = getProject(url);
var html = ""

callSonar(fromBranch);
callSonar(toBranch);

console.log(issues[0]+"-"+issues[1]);


var result = issues[0]-issues[1];

insertTag(result)


function callSonar(branch) {
    console.log(branch)
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://192.168.45.73:9000/api/issues/search?id="+project+":"+branch, false);
    xhr.setRequestHeader('Authorization', auth);
    xhr.setRequestHeader('Content-Type','application/json')
    xhr.setRequestHeader('dataType', 'jsonp')
    xhr.onreadystatechange = function() {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            issues.push(JSON.parse(xhr.responseText).total);
        }
    }
    xhr.send();
};

function getProject(url){
    var resources = url.split("/");
    if (resources[4] === "nextbank"){
        return "next-platform";
    }
    return resources[4];
};

/* 
<div class="plugin-item build-status-summary">
   <a href="https://bamboo.prebanco.com.br/browse/CN-CORENEXT4415-2" class="build-status-overview-link" data-single-build="true">
    <span class="aui-icon aui-icon-small aui-iconfont-build" title="Builds">Build status</span><strong class="count">1</strong> <span class="label">build</span></a>
   <div class="item-extra-content"><a href="https://bamboo.prebanco.com.br/browse/CN-CORENEXT4415-2" class="aui-icon aui-icon-small build-icon aui-iconfont-approve successful-build-icon " data-build-status="SUCCESSFUL"></a></div>
</div>
*/

function insertTag(issueNumber) {
    var div = document.createElement("DIV");
    div.className = "plugin-item build-status-summary";
    var a = document.createElement("A");
    //a.href = "http://192.168.45.73:9000/dashboard?id="+project+":"+fromBranch;
    a.setAttribute("href","http://192.168.45.73:9000/dashboard?id="+project+":"+fromBranch);
    a.setAttribute('target', '_blank');
    a.className = "build-status-overview-link";
    var span = document.createElement("SPAN");
    var text = document.createTextNode("Vc tem "+issueNumber+" issues no sonar")
    span.appendChild(text);
    a.appendChild(span);
    div.appendChild(a);

    document.getElementsByClassName("plugin-section-primary")[0].appendChild(div);
    
};