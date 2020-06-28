var urlWithProject = window.location.pathname;
var branch = document.getElementsByClassName('branch-name')[0].innerText;
var auth = 'Basic bTE5MDQ5OEBjb3Jwci5icmFkZXNjby5jb20uYnI6Q2FwQDA4MDU=';

var project = getProject(urlWithProject);

findFirstAnalisys(branch);

function findFirstAnalisys(branch) {
    var firstAnalisysDate = '';
    var url = new URL("http://192.168.45.73:9000/api/project_analyses/search");
    url.searchParams.set("project", project+":"+branch);
    var xhr = createXhr(url);
    xhr.onreadystatechange = function() {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
            var response = JSON.parse(xhr.responseText);
            firstAnalisysDate = response.analyses[response.analyses.length -1].date;
            findIssues(branch, firstAnalisysDate.substring(0, 10));
        }
    }
    xhr.send();
}

function createXhr(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader('Authorization', auth);
    xhr.setRequestHeader('Content-Type', '*/*');
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    return xhr;
}

function findIssues(branch, firstAnalisysDate) {
    var url = new URL("http://192.168.45.73:9000/api/issues/search");
    url.searchParams.set("componentKeys", project+":"+branch);
    url.searchParams.set("statuses", "OPEN");
    url.searchParams.set("createdAfter", firstAnalisysDate)
    var xhr = createXhr(url);
    xhr.onreadystatechange = function() {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            insertTag(JSON.parse(xhr.responseText).total);
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
    a.setAttribute("href","http://192.168.45.73:9000/dashboard?id="+project+":"+branch);
    a.setAttribute('target', '_blank');
    a.className = "build-status-overview-link";
    var spanIcon = document.createElement("SPAN");
    var text
    if (issueNumber == 0){
        spanIcon.className = approve;
        text = document.createTextNode("No issues on sonar, have a cookie :)")
    } else {
        spanIcon.className = reprove;
        a.setAttribute("style", "color:#E53C17");
        text = document.createTextNode(issueNumber+" sonarqube issue(s)");
    }
    var span = document.createElement("SPAN");
    span.appendChild(text);
    a.appendChild(spanIcon);
    a.appendChild(span);
    div.appendChild(a);
    
    document.getElementsByClassName("plugin-section-primary")[0].appendChild(div);
};