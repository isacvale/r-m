/// <reference path="../_all.d.ts" />
var currentVerb = 'read'; //read, write, edit or erase
var currentNoun = 'company'; //company, broker, place
var viewStub = document.getElementById('stub-create');
var serverAddress = "https://blooming-hamlet-30182.herokuapp.com/";
var localAddress = "http://localhost:3000/";
var webAdress = serverAddress;
//const webAdress = localAddress;
/*if(webAdress == serverAddress){
    //Let's fix the form's action if running locally
    let templatesArr = ["write-company","write-broker","write-place"];
    let tAction:string;
    
    templatesArr.forEach(function(tID){
        if(tID == "write-company") tAction = "/company";
        else if(tID == "write-broker") tAction = "/broker";
        else if(tID == "write-place") tAction = "/place";
        
        let template = document.getElementById(tID);
        console.log(template+'/'+tID);
        console.log(template.content)
        let content = template.content;
        content.querySelector("form").action="/company";
    });
}*/
//Relic: to be recycled
function loadData() {
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', webAdress, true);
    xhttp.setRequestHeader("Accept", "text/json");
    console.log('jdnvjdvnj');
    xhttp.onload = function () {
        console.log(xhttp.responseText);
        console.log(document);
        viewStub.innerHTML = this.responseText;
    };
    xhttp.send();
}
//MAIN CODE
//What to do when first loading
window.onload = function () {
    setTimeout(removeSpinner, 1500);
    //Let's preload ReadCompany. First we bleach the buttons.
    fixBleach('verb', 'sq-ler');
    fixBleach('noun', 'sq-company');
    //Finally we retrieve and display the data
    var dataDB = retrieveData('company');
    //alert(dataDB);
    //loadTemplate();
};
//On-click of main buttons
function selectBtn(btn_id) {
    if (btn_id != currentVerb && btn_id != currentVerb) {
        clearView();
        switch (btn_id) {
            case "sq-company":
                currentNoun = 'company';
                fixBleach('noun', "sq-company");
                break;
            case "sq-broker":
                currentNoun = 'broker';
                fixBleach('noun', "sq-broker");
                break;
            case "sq-space":
                currentNoun = 'place';
                fixBleach('noun', "sq-space");
                break;
            case "sq-ler":
                currentVerb = 'read';
                fixBleach('verb', "sq-ler");
                break;
            case "sq-criar":
                currentVerb = 'write';
                fixBleach('verb', "sq-criar");
                break;
            case "sq-editar":
                currentVerb = 'edit';
                fixBleach('verb', "sq-editar");
                break;
            case "sq-apagar":
                currentVerb = 'erase';
                fixBleach('verb', "sq-apagar");
                break;
        }
        if (currentVerb != "read")
            loadTemplate();
        if (currentVerb == "read") {
            retrieveData(currentNoun);
            /*let dataJson = retrieveData(currentNoun);
            alert('>>> :');
            alert(dataJson);
            displayData( currentNoun, dataJson );*/
        }
    }
}
//Load content template to canvas
function loadTemplate() {
    var viewStub = document.getElementById('stub-create');
    var templateId = currentVerb + '-' + currentNoun;
    var viewTemplate = document.getElementById(templateId);
    viewStub.innerHTML = viewTemplate.innerHTML;
    //alert(templateId);
}
//Load the template, reassign results and paste them on canvas
function displayData(dataType, json) {
    json.forEach(function (entry) {
        //Get the template element
        var template = document.getElementById('read-' + dataType);
        //Get the stub where to place the entry
        var contentStub = document.getElementById('stub-create');
        if (dataType == "company") {
            //Get the paragraph "name" within the template element
            var nameField = template.content.querySelector("p");
            //Set it to use the name in the database
            nameField.innerHTML = entry['name'];
        }
        else if (dataType == "broker") {
            //Get the paragraph "name" within the template element
            var nameField = template.content.querySelector("p.name");
            //Set it to use the name in the database
            nameField.innerHTML = entry['name'];
            template.content.querySelector("p.name").innerHTML = entry['company'];
        }
        else if (dataType == "place") {
            template.content.querySelector("p.address").innerHTML = entry['address'];
            template.content.querySelector("p.broker").innerHTML = entry['broker'];
            template.content.querySelector("p.rent").innerHTML = entry['rent'];
        }
        //Clone the entry with the db data
        var clone = document.importNode(template.content, true);
        //Append the clone to the stub
        contentStub.appendChild(clone);
    });
}
//{"_id":"5aef5d08d92d9831a7b71233","webpage":"file:///home/isac/Documents/HD/Work/Alclone===lmatech/Kobayashi%20Maru/client/client.html","name":"Apollo Inc"}
//NETWORK
//GET data from db with ajax
function retrieveData(strType) {
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', webAdress + strType, true);
    xhttp.setRequestHeader("Accept", "text/json");
    xhttp.onload = function () {
        //alert('response: '+this.response);
        //let response = JSON.parse(this.responseText);
        //return response;
        displayData(strType, JSON.parse(this.responseText));
    };
    xhttp.send();
}
//AESTHETICS
//Remove spinner
function removeSpinner() {
    var spinner = document.getElementById("spinner");
    spinner.style.display = 'none';
}
//Clear content on canvas
function clearView() {
    var viewStub = document.getElementById('stub-create');
    viewStub.innerHTML = "";
}
//Make main buttons toggle white for selected
function fixBleach(btnType, btnId) {
    if (btnType == 'verb') {
        var verbIDs = ["sq-ler", "sq-criar", "sq-editar", "sq-apagar"];
        verbIDs.forEach(function (btn) {
            document.getElementById(btn).classList.remove('bleached');
        });
    }
    else if (btnType == 'noun') {
        var nounIDs = ["sq-company", "sq-broker", "sq-space"];
        nounIDs.forEach(function (btn, index) {
            document.getElementById(btn).classList.remove('bleached');
        });
    }
    document.getElementById(btnId).classList.add('bleached');
}
/*$color0: #fff;
$color1: #fad6a6;
$color2: #deb681;
$color3: #c49c68;
$color4: #e3e4e2;
$color5: #e2d2d8;
$color6: #cdc6d7;
$color7: #a7bec4;
$color8: #5c3738;*/
