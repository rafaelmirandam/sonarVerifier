
var fromBranch = document.getElementsByClassName('branch-name')[0].innerText;
var toBranch = document.getElementsByClassName('branch-name')[1].innerText;
var auth = 'Basic ' + btoa("m190498@corpr.bradesco.com.br:Cap@0805");
var issues = [];
var final;

var xhr = new XMLHttpRequest();

callSonar(fromBranch);
callSonar(toBranch);

function callback() {
    if(xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            result = xhr.responseText;
            issues.push(JSON.parse(result))
        }
    }
};

function callSonar(branch) {
    xhr.open("GET", "http://192.168.45.73:9000/api/issues/search?id=next-platform:"+branch, true);
    xhr.setRequestHeader('Authorization', auth);
    xhr.setRequestHeader('Content-Type','application/json')
    xhr.setRequestHeader('dataType', 'jsonp')
    xhr.onreadystatechange = callback;
    xhr.send();
};