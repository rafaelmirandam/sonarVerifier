var urlWithProject = window.location.pathname;
var branch = document.getElementsByClassName('branch-name')[0].innerText;

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
        } else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 401) {
            insertTag(null, '401', null);
        } else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 404) {
            insertTag(null, '404', null);
        }
    }
    xhr.send();
}

function createXhr(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.setRequestHeader('Set-Cookie', 'SameSite=None; Secure')
    return xhr;
}

function findIssues(branch, firstAnalisysDate) {
    var url = new URL("http://192.168.45.73:9000/api/issues/search");
    url.searchParams.set("componentKeys", project+":"+branch);
    url.searchParams.set("statuses", "OPEN");
    url.searchParams.set("createdAfter", firstAnalisysDate);
    var xhr = createXhr(url);
    xhr.onreadystatechange = function() {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            insertTag(JSON.parse(xhr.responseText).total, '200', firstAnalisysDate);
        } else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 401) {
            insertTag(null, '401', null);
        } else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 404) {
            insertTag(null, '404', null);
        }
    }
    xhr.send();
};

function getProject(url) {
    var resources = url.split("/");
    if (resources[4] === "nextbank") {
        return "next-platform";
    }
    if (resources[4] === "partnership-and-offers") {
        return "next-parcerias";
    }
    return resources[4];
};

function insertTag(issueNumber, status, firstAnalisysDate) {
    var approve = "aui-icon aui-icon-small build-icon aui-iconfont-approve successful-build-icon";
    var reprove = "aui-icon aui-icon-small build-icon aui-iconfont-error failed-build-icon";
    var inProgress = "aui-button aui-button-link aui-icon aui-icon-small build-icon aui-iconfont-time inprogress-build-icon";
    var info = "aui-icon aui-icon-small aui-iconfont-help";
    var div = document.createElement("DIV");
    var url = "http://192.168.45.73:9000/project/issues?createdAfter="+firstAnalisysDate+"&id="+project+":"+branch+"&resolved=false";
    div.className = "plugin-item build-status-summary";
    var a = document.createElement("A");
    a.setAttribute('target', '_blank');
    a.className = "build-status-overview-link";
    var spanIcon = document.createElement("SPAN");
    var text
    if (issueNumber == 0) {
        a.setAttribute("href", url);
        spanIcon.className = approve;
        text = document.createTextNode("No issues on sonar, have a cookie :)");
    } else if (issueNumber > 0) {
        a.setAttribute("href", url);
        spanIcon.className = reprove;
        a.setAttribute("style", "color:#E53C17");
        text = document.createTextNode(issueNumber+" sonarqube issue(s)");
    } else if(issueNumber == null) {
        a.setAttribute("data-toggle", "tooltip");
        if (status == '401') {
            a.setAttribute("href", "http://192.168.45.73:9000/");
            spanIcon.className = info;
            text = document.createTextNode("Click here to login on sonar");
            a.setAttribute("title", "To view your sonar issues here you need to sign in on sonarqube and return to this page");
        } else if (status == '404') {
            a.setAttribute("href", "http://192.168.45.48:8085/");
            spanIcon.className = inProgress;
            text = document.createTextNode("Waiting for the build to finish");
            a.setAttribute("title", "To view your sonar issues here the first analyses needs to be finish, check Bamboo to see the progress");
        }
    }
    var span = document.createElement("SPAN");
    span.appendChild(text);
    a.appendChild(spanIcon);
    a.appendChild(span);
    div.appendChild(a);
    
    document.getElementsByClassName("plugin-section-primary")[0].appendChild(div);
};