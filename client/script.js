/// <reference path="../_all.d.ts" />
var currentVerb = 'read'; //read, write, edit or erase
var currentNoun = 'company'; //company, broker, place
var viewStub = document.getElementById('stub-create');
var serverAddress = "https://blooming-hamlet-30182.herokuapp.com/";
var localAddress = "http://localhost:3000/";
var webAdress = serverAddress;
var companyID;
var brokerID;
var placeID;
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
        if (currentVerb != "read") {
            loadTemplate();
        }
        if (currentVerb == "read") {
            retrieveData(currentNoun);
        }
        if (currentVerb == 'edit') {
            console.log(111);
            checkFetchEntry();
        }
        if (currentVerb == 'erase') {
            checkFetchEntry();
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
        template.content.querySelector("p.entryID").innerHTML = entry['_id'];
        if (dataType == "company") {
            //Get the paragraph "name" within the template element
            var nameField = template.content.querySelector("p.name");
            //Set it to use the name in the database
            nameField.innerHTML = entry['name'];
        }
        else if (dataType == "broker") {
            // //Get the paragraph "name" within the template element
            // let nameField = template.content.querySelector("p.name");
            // //Set it to use the name in the database
            // nameField.innerHTML = entry['p.name'];
            template.content.querySelector("p.name").innerHTML = entry['name'];
            template.content.querySelector("p.company").innerHTML = entry['company'];
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
//Similar to displayData but meant for editar
function autoComplete(dataType, json) {
    //Get the template element
    //let template = document.getElementById('edit-'+dataType);
    //Get the stub where to place the entry
    var contentStub = document.getElementById('stub-create');
    if (dataType == "company") {
        //Get the paragraph "name" within the template element
        var nameField = contentStub.querySelector("input[name=name]");
        //Set it to use the name in the database
        nameField.value = json['name'];
        contentStub.querySelector("input[name=entryID]").value = json['_id'];
    }
    else if (dataType == "broker") {
        //Get the paragraph "name" within the template element
        var nameField = contentStub.querySelector("input[name=name]");
        var companyField = contentStub.querySelector("input[name=company]");
        //Set it to use the name in the database
        nameField.value = json['name'];
        companyField.value = json['company'];
        contentStub.querySelector("input[name=entryID]").value = json['_id'];
    }
    else if (dataType == "place") {
        //Get the paragraph "name" within the template element
        var addressField = contentStub.querySelector("input[name=address]");
        var brokerField = contentStub.querySelector("input[name=broker]");
        var rentField = contentStub.querySelector("input[name=rent]");
        //Set it to use the name in the database
        addressField.value = json['address'];
        brokerField.value = json['broker'];
        rentField.value = json['rent'];
        contentStub.querySelector("input[name=entryID]").value = json['_id'];
    }
}
//Similar to displayData but meant for editar
function autoCompleteDelete(dataType, json) {
    console.log(444);
    //Get the stub where to place the entry
    var contentStub = document.getElementById('stub-create');
    var idField = contentStub.querySelector("input[name=entryID]");
    idField.value = json['_id'];
}
// uId = ObjectId("59b59b34852a9619b486634f")
// User.findOne({"_id": uId}, function(err, user){
// });
//On click select instance
function selectItem(selectedNode) {
    //First we get the element's parent, then a list of siblings.
    var parentNode = selectedNode.parentElement;
    var siblingNodes = parentNode.children;
    //Now we loop through the siblings and take alway the selected class.
    var node;
    for (var i = 0; i < siblingNodes.length; i++) {
        node = siblingNodes[i];
        node.classList.remove("selected");
    }
    selectedNode.classList.add("selected");
    if (selectedNode.querySelector("p._type").innerHTML == 'company') {
        companyID = selectedNode.querySelector("p.entryID").innerHTML;
    }
    else if (selectedNode.querySelector("p._type").innerHTML == 'broker') {
        brokerID = selectedNode.querySelector("p.entryID").innerHTML;
    }
    else if (selectedNode.querySelector("p._type").innerHTML == 'place') {
        placeID = selectedNode.querySelector("p.entryID").innerHTML;
    }
    console.log(companyID + '/' + brokerID + '/' + placeID);
}
//{"_id":"5aef5d08d92d9831a7b71233","webpage":"file:///home/isac/Documents/HD/Work/Alclone===lmatech/Kobayashi%20Maru/client/client.html","name":"Apollo Inc"}
//When clicking a read main button, preselect the relevant data
function preSelect() {
    var viewStub = document.getElementById('stub-create');
    var items = viewStub.children;
    if (currentNoun == 'company') {
        if (companyID != undefined)
            selectItem(getPreSelected(companyID));
        if (companyID == undefined)
            selectItem(items[0]);
    }
    else if (currentNoun == 'broker') {
        if (brokerID != undefined)
            selectItem(getPreSelected(brokerID));
        if (brokerID == undefined)
            selectItem(items[0]);
    }
    else if (currentNoun == 'place') {
        if (placeID != undefined)
            selectItem(getPreSelected(placeID));
        if (placeID == undefined)
            selectItem(items[0]);
    }
}
//Helper function
function getPreSelected(itemID) {
    var viewStub = document.getElementById('stub-create');
    var items = viewStub.children;
    for (var i = 0; i < items.length; i++) {
        if (items[i].querySelector(".entryID").innerHTML == itemID)
            return items[i];
    }
}
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
        preSelect();
    };
    xhttp.send();
}
//Check if fetchEntry is possible. If so, call it.
function checkFetchEntry() {
    console.log(222);
    if (currentNoun == "company") {
        if (companyID == undefined) {
            clearView();
        }
        else {
            fetchEntry("company", companyID);
        }
    }
    else if (currentNoun == "broker") {
        if (brokerID == undefined) {
            clearView();
        }
        else {
            fetchEntry("broker", brokerID);
        }
    }
    else if (currentNoun == "place") {
        if (placeID == undefined) {
            clearView();
        }
        else {
            fetchEntry("place", placeID);
        }
    }
}
//Query the db for a specific _id in a specific collection
function fetchEntry(collection, entryID) {
    var parameters = "?collection=" + collection + "&entryID=" + entryID;
    console.log(333);
    console.log('>>>' + webAdress + 'fetch' + parameters);
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', webAdress + 'fetch' + parameters, true);
    xhttp.setRequestHeader("Accept", "text/json");
    xhttp.onload = function () {
        //console.log(this.responseText);
        //alert(this.response);
        if (currentVerb == 'edit')
            autoComplete(currentNoun, JSON.parse(this.responseText));
        if (currentVerb == 'erase')
            autoCompleteDelete(currentNoun, JSON.parse(this.responseText));
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
