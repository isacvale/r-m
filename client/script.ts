/// <reference path="../_all.d.ts" />

var currentVerb:string = 'read'; //read, write, edit or erase
var currentNoun:string = 'company'; //company, broker, place
const viewStub = document.getElementById('stub-create');
const serverAddress:string = "https://blooming-hamlet-30182.herokuapp.com/";
const localAddress:string = "http://localhost:3000/";
const webAdress = serverAddress;

var companyID:string;
var brokerID:string;
var placeID:string;

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
            xhttp.onload = function(){
                console.log(xhttp.responseText);
                console.log(document);
                viewStub.innerHTML = this.responseText;
            }
            xhttp.send();
        }

//MAIN CODE

//What to do when first loading
window.onload = function(){
    setTimeout( removeSpinner, 1500 );

    //Let's preload ReadCompany. First we bleach the buttons.
    fixBleach('verb', 'sq-ler');
    fixBleach('noun', 'sq-company');


    //Finally we retrieve and display the data
    let dataDB = retrieveData('company');
    //alert(dataDB);

    //loadTemplate();
}

//On-click of main buttons
function selectBtn(btn_id){
    if(btn_id!=currentVerb && btn_id!=currentVerb){
        clearView();
        switch( btn_id ){
            case "sq-company":
                currentNoun = 'company';
                fixBleach('noun',"sq-company");
                break;
            case "sq-broker":
                currentNoun = 'broker';
                fixBleach('noun',"sq-broker");
                break;
            case "sq-space":
                currentNoun = 'place';
                fixBleach('noun',"sq-space");
                break;

            case "sq-ler":
                currentVerb = 'read';
                fixBleach('verb',"sq-ler");
                break;
            case "sq-criar":
                currentVerb = 'write';
                fixBleach('verb',"sq-criar");
                break;
            case "sq-editar":
                currentVerb = 'edit';
                fixBleach('verb',"sq-editar");
                break;
            case "sq-apagar":
                currentVerb = 'erase';
                fixBleach('verb',"sq-apagar");
                break;
        }
        if(currentVerb!="read"){
            loadTemplate();
        }

        if(currentVerb=="read"){
            retrieveData(currentNoun);
        }

        if(currentVerb=='edit'){
            checkFetchEntry();
        }
    }
}

//Load content template to canvas
function loadTemplate(){
    let viewStub = document.getElementById('stub-create');

    let templateId: string = currentVerb+'-'+currentNoun;
    let viewTemplate = document.getElementById(templateId);
    viewStub.innerHTML = viewTemplate.innerHTML;
    //alert(templateId);
}

//Load the template, reassign results and paste them on canvas
function displayData(dataType, json){

    json.forEach((entry)=>{

        //Get the template element
        let template = document.getElementById('read-'+dataType);
        //Get the stub where to place the entry
        let contentStub = document.getElementById('stub-create');

        template.content.querySelector("p._id").innerHTML = entry['_id'];

        if(dataType=="company"){
            //Get the paragraph "name" within the template element
            let nameField = template.content.querySelector("p.name");
            //Set it to use the name in the database
            nameField.innerHTML = entry['name'];
        }
        else if(dataType=="broker"){
            //Get the paragraph "name" within the template element
            let nameField = template.content.querySelector("p.name");
            //Set it to use the name in the database
            nameField.innerHTML = entry['p.name'];
            template.content.querySelector("p.company").innerHTML = entry['company'];
        }
        else if(dataType=="place"){
            template.content.querySelector("p.address").innerHTML = entry['address'];
            template.content.querySelector("p.broker").innerHTML = entry['broker'];
            template.content.querySelector("p.rent").innerHTML = entry['rent'];
        }

        //Clone the entry with the db data
        var clone = document.importNode(template.content,true);
        //Append the clone to the stub
        contentStub.appendChild(clone);

    });
}

//Similar to displayData but meant for editar
function autoComplete(dataType,json){
  //Get the template element
  let template = document.getElementById('edit-'+dataType);
  //Get the stub where to place the entry
  let contentStub = document.getElementById('stub-create');

  if(dataType=="company"){
      //Get the paragraph "name" within the template element
      let nameField = template.content.querySelector("input[name=name]");
      //Set it to use the name in the database
      nameField.innerHTML = json['name'];
  }
  else if(dataType=="company"){
      //Get the paragraph "name" within the template element
      let nameField = template.content.querySelector("input[name=name]");
      let companyField = template.content.querySelector("input[name=company]");
      //Set it to use the name in the database
      nameField.innerHTML = json['name'];
      companyField.innerHTML = json['company'];
  }
  else if(dataType=="place"){
      //Get the paragraph "name" within the template element
      let addressField = template.content.querySelector("input[name=address]");
      let brokerField = template.content.querySelector("input[name=broker]");
      let rentField = template.content.querySelector("input[name=rent]");
      //Set it to use the name in the database
      addressField.innerHTML = json['address'];
      brokerField.innerHTML = json['broker'];
      rentField.innerHTML = json['rent'];
  }
}

//On click select instance
function selectItem(selectedNode){

    //First we get the element's parent, then a list of siblings.
    let parentNode = selectedNode.parentElement;
    let siblingNodes = parentNode.children;
    //Now we loop through the siblings and take alway the selected class.
    let node;
    for(var i=0;i<siblingNodes.length;i++){
        node = siblingNodes[i];
        node.classList.remove("selected");
    }
    selectedNode.classList.add("selected");


    if(selectedNode.querySelector("p._type").innerHTML == 'company'){
        companyID = selectedNode.querySelector("p._id").innerHTML;
    }
    else if(selectedNode.querySelector("p._type").innerHTML == 'broker'){
        brokerID = selectedNode.querySelector("p._id").innerHTML;
    }
    else if(selectedNode.querySelector("p._type").innerHTML == 'place'){
        placeID = selectedNode.querySelector("p._id").innerHTML;
    }

    console.log(companyID+'/'+brokerID+'/'+placeID);
}


//{"_id":"5aef5d08d92d9831a7b71233","webpage":"file:///home/isac/Documents/HD/Work/Alclone===lmatech/Kobayashi%20Maru/client/client.html","name":"Apollo Inc"}

//When clicking a read main button, preselect the relevant data
function preSelect(){
    let viewStub = document.getElementById('stub-create');
    let items = viewStub.children;
    if(currentNoun=='company'){
        if(companyID!=undefined) selectItem(getPreSelected(companyID));
        if(companyID==undefined) selectItem(items[0]);
    }
    else if(currentNoun=='broker'){
        if(brokerID!=undefined) selectItem(getPreSelected(brokerID));
        if(brokerID==undefined) selectItem(items[0]);
    }
    else if(currentNoun=='place'){
        if(placeID!=undefined) selectItem(getPreSelected(placeID));
        if(placeID==undefined) selectItem(items[0]);
    }
}

//Helper function
function getPreSelected(itemID){
    let viewStub = document.getElementById('stub-create');
    let items = viewStub.children;
    for(var i=0;i<items.length;i++){
        if(items[i].querySelector("._id").innerHTML==itemID) return items[i];
    }
}

//NETWORK

//GET data from db with ajax
function retrieveData(strType:string){
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', webAdress+strType, true);
    xhttp.setRequestHeader("Accept", "text/json");
    xhttp.onload = function(){
        //alert('response: '+this.response);
        //let response = JSON.parse(this.responseText);
        //return response;
        displayData(strType,JSON.parse(this.responseText));
        preSelect();
        }
        xhttp.send();
}

//Check if fetchEntry is possible. If so, call it.
function checkFetchEntry(){
    if(currentNoun=="company"){
        if(companyID==undefined){clearView();}
        else {fetchEntry("company", companyID);}
    }
    else if(currentNoun=="broker"){
        if(brokerID==undefined){clearView();}
        else {fetchEntry("broker", brokerID);}
    }
    else if(currentNoun=="place"){
        if(placeID==undefined){clearView();}
        else {fetchEntry("place", placeID);}
    }
}

//Query the db for a specific _id in a specific collection
function fetchEntry(collection:string, entryID:string){
    let parameters:string = "?collection="+collection+"&entryID="+entryID;

    console.log('>>>'+webAdress+'fetch'+parameters)
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', webAdress+'fetch'+parameters, true);
    xhttp.setRequestHeader("Accept", "text/json");
    xhttp.onload = function(){
        //console.log(this.responseText);
        if(currentVerb=='edit')  autoComplete(currentNoun,JSON.parse(this.responseText));
        }
        xhttp.send();
}
//AESTHETICS

//Remove spinner
function removeSpinner(){
    let spinner = document.getElementById("spinner");

    spinner.style.display = 'none';
}
//Clear content on canvas
function clearView(){
    let viewStub = document.getElementById('stub-create');

    viewStub.innerHTML = "";
}
//Make main buttons toggle white for selected
function fixBleach(btnType:string, btnId:string){
    if(btnType == 'verb'){
        let verbIDs:string[] = ["sq-ler","sq-criar","sq-editar","sq-apagar"];
        verbIDs.forEach((btn)=>{
            document.getElementById(btn).classList.remove('bleached');
        });
    } else if(btnType == 'noun'){
        let nounIDs = ["sq-company","sq-broker","sq-space"];
        nounIDs.forEach((btn,index)=>{
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
