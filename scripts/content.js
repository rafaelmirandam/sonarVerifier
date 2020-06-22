
var fromBranch = document.getElementsByClassName('branch-name')[0].innerText;
var toBranch = document.getElementsByClassName('branch-name')[1].innerText;
var auth = 'Basic ' + btoa("m190498@corpr.bradesco.com.br:Cap@0805");
var request = new XMLHttpRequest();
console.log(auth);
request.open('GET', 'http://192.168.45.73:9000/api/issues/search?id=next-platform%3Afeature%2Fcap%2FBG-NEXT2-22616', true);
request.setRequestHeader('Authorization', auth);
request.responseType = "json";
request.send();
request.onload = () => {
    alert(request.response);
}
var response = JSON.parse(request.response);
console.log(response);
console.log(request.response);