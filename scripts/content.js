var url = window.location.pathname;
var fromBranch = document.getElementsByClassName('branch-name')[0].innerText;
var toBranch = document.getElementsByClassName('branch-name')[1].innerText;
var auth = 'Basic ' + btoa("m190498@corpr.bradesco.com.br:Cap@0805");
var issues = [];

var project = getProject(url);
console.log(project);

callSonar(fromBranch);
callSonar(toBranch);
var result = issues[0]-issues[1];
console.log(issues[0]+"-"+issues[1]+"="+result);

insertTag(result);


function callSonar(branch) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://192.168.45.73:9000/api/issues/search?componentKeys="+project+":"+branch, false);
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

function insertTag(issueNumber) {
    var approve = "aui-icon aui-icon-small build-icon aui-iconfont-approve successful-build-icon";
    var reprove = "aui-icon aui-icon-small build-icon aui-iconfont-error failed-build-icon";
    var div = document.createElement("DIV");
    div.className = "plugin-item build-status-summary";
    var a = document.createElement("A");
    a.setAttribute("href","http://192.168.45.73:9000/dashboard?id="+project+":"+fromBranch);
    a.setAttribute('target', '_blank');
    a.className = "build-status-overview-link";
    var spanIcon = document.createElement("SPAN");
    if (issueNumber == 0){
        spanIcon.className = approve;
    } else {
        spanIcon.className = reprove;
        a.setAttribute("style", "color:#E53C17");
    }
    var span = document.createElement("SPAN");
    var text = document.createTextNode(issueNumber+" sonarqube issue(s)")
    span.appendChild(text);
    a.appendChild(spanIcon);
    a.appendChild(span);
    div.appendChild(a);
    
    document.getElementsByClassName("plugin-section-primary")[0].appendChild(div);
};