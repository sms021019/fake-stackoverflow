import Model from './model.js';

//sessionStorage.clear();

//let obj = new Model();


if (!sessionStorage.getItem("currentData")) {
    let obj = new Model();
    console.log("Setting new object");
    let data = sessionStorage.setItem("currentData", JSON.stringify(new Model().getData()));
    console.log(sessionStorage.getItem("currentData"));
}
// else {
//     console.log("Printing old object");
//     console.log(sessionStorage.getItem("currentObject"));
//     sessionStorage.clear();
// }



//export { obj };


// var presortedByTags = false;
// var cardsToSort = []; //array of question objects
// var cardTags = []; //array of string card ids

document.addEventListener('DOMContentLoaded', function() {
    // presortedByTags = false;
    // console.log("tags sorted: " + presortedByTags);

    newestSort();

    unansSetup();
    newestSetup();
    searchBarSetup();
    activeSetup();
    tagsPageSetup();
    ansBtnSetup();
    newQuestionPageSetup();
    newAnswerPageSetup();
});
// window.onload = function() {

//   newestSort();
//   unansSetup();
//   newestSetup();
//   searchBarSetup();
//   activeSetup();
//   tagsPageSetup();
// }

//----------Set Five Word Limit for number of tags-------------
if (document.getElementById("newQuestionTags")) {
    document.getElementById("newQuestionTags").addEventListener("keypress", function(evt) {
        var words = this.value.split(/\s+/);
        if (words.length > 5) {
            evt.preventDefault();
        }
    })
}
//-------------------------------------------------------------

//-------------Check if tag exists---------
//returns tag id if exists (integer)
//returns -1 if not
function doesTagExist(tag) {
    let obj = new Model();
    obj.loadData();
    // let obj = JSON.parse(sessionStorage.getItem("currentData"));
    let tags = obj.data.tags;
    for (let i = 0; i < tags.length; i++) {
        if (tags[i].name.toLowerCase() == tag.toLowerCase()) return i + 1;
    }
    return -1;
}

function addTag(tag) { //adds tag to list of tags, returns tag id (integer)
    let obj = new Model();
    obj.loadData();
    // let obj = JSON.parse(sessionStorage.getItem("currentData"));
    let tags = obj.data.tags;
    obj.data.tags.push({
        tid: "t" + (tags.length + 1),
        name: tag,
    });
    obj.saveData();
    // sessionStorage.setItem("currentData", JSON.stringify(obj));
    console.log("adding tag...");
    console.log(obj);
    return tags.length;
}
//-----------------------------------------

//---Add a new question---
// console.log("Basic object questions:");
// console.log(obj.data.questions);
// console.log("Current session object:");
// console.log(sessionStorage.getItem("currentObject"));
console.log("JSON Parsed session object:")
console.log(JSON.parse(sessionStorage.getItem("currentData")));



function getData(form) {

    //////////time stuff////////////
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    console.log(dateTime);
    /////////////////////

    var formData = new FormData(form);
    //console.log(Object.fromEntries(formData));

    //make an array of the tag ids
    //if new tag, add to list of tags
    const newQuestionTags = formData.get("newQuestionTags").trim().split(/\s+/g);

    for (let i = 0; i < newQuestionTags.length; i++) {
        var tag = newQuestionTags[i];
        var tagID = doesTagExist(tag);
        console.log(tagID);
        if (tagID < 0) newQuestionTags[i] = "t" + addTag(tag);
        else newQuestionTags[i] = "t" + tagID;
    }

    let obj = new Model();
    obj.loadData();
    // let obj = JSON.parse(sessionStorage.getItem("currentObject"));

    //add question
    obj.data.questions.push({
        qid: "q" + (1 + obj.data.questions.length),
        title: formData.get("newQuestionTitle"),
        text: formData.get("newQuestionText"),
        tagIds: newQuestionTags,
        askedBy: formData.get("newQuestionUsername"),
        askDate: dateTime,
        ansIds: [],
        views: 0,
    });

    obj.saveData();
    // sessionStorage.setItem("currentObject", JSON.stringify(obj.getData()));
    console.log("finished: ");
    console.log(obj);
    //console.log(sessionStorage.getItem("currentObject"));
}

if (document.getElementById("newQuestionForm")) {
    document.getElementById("newQuestionForm").addEventListener("submit", function(evt) {
        //evt.preventDefault(); //Stop from directing back to home page
        getData(evt.target);
    })
}
//------------------------
// function getAnsData(form) {
//     let obj = new Model();
//     obj.loadData();

//     obj.data.answers.push({
//         aid: "a" + (1 + obj.data.answers.length),
//         text: ,
//         ans
//     });

// }

// if (document.getElementById("newAnswerPageForm")) {
//     document.getElementById("newAnswerPageForm").addEventListener("submit", function(evt) {
//         //evt.preventDefault(); //Stop from directing back to home page
//         getAnsData(evt.target);
//     })
// } 
//---------------------------
let displayNumQs = function() {
    let obj = new Model();
    obj.loadData();
    // let obj = JSON.parse(sessionStorage.getItem("currentObject"));

    let count = 0;
    let tempCard;
    for (let i = 0; i < obj.data.questions.length; i++) {
        tempCard = document.getElementById("card" + i).style.display;
        if (tempCard === "none") {
            count++;
        }
    }
    let element1 = document.getElementById("numofClasses");
    if (obj.data.questions.length == 1) element1.innerHTML = "1 question";
    else element1.innerHTML = (obj.data.questions.length - count) + " questions";
    // sessionStorage.setItem("currentData", JSON.stringify(obj));
}

let displayCards = function() {
    let obj = new Model();
    obj.loadData();
    // let obj = JSON.parse(sessionStorage.getItem("currentObject"));

    let reset = document.getElementById("questions");
    let qList = obj.data.questions;
    if (reset) reset.innerHTML = "";

    // if (presortedByTags) {
    // for (let i = 0; i < cardsToSort.length; i++) {
    //     let numAns = cardsToSort[i].ansIds.length;
    //     let numViews = cardsToSort[i].views;

    //     let temp = document.getElementById("questions");

    //     if (temp) temp.innerHTML += "<div class = card id = card" + i + ">  </div>"
    //     let cardName = "card" + i;
    //     let card = document.getElementById(cardName);

    //     //hidden form
    //     card.innerHTML += "<form class='cardForm' id='cardForm" + i + "'> <input type='hidden' name='cardFormi' id='cardFormi' value='" + i + "'></form>";
        
    //     card.innerHTML += "<div class = \"views\" id = 'views" + i + "'>" + cardsToSort[i].ansIds.length + " answers\n" + "\n<br>" + cardsToSort[i].views + " views" + "</div>";
    //     card.innerHTML += "<div class = \"cardTitle\" id = 'cardTitle" + i + "'><button class = \"fakeButton\" value="+i+" id = \"qCard"+i+"\">" + cardsToSort[i].title + "</button></div>";
    //     card.innerHTML += "<div class = \"cardAuthor\" id = 'cardAuthor" + i + "'> <span style= 'color: red;'>" + cardsToSort[i].askedBy + "</span> asked " + obj.getTimeDiff(cardsToSort[i].askDate) + "</div>";
    //     card.innerHTML += "<div class = \"cardTags\" id = \"cardTags" + i + "\"></div>";
    //     obj.getTags(i); //not sure if this will work with double sorting
    // }
    // }

    // else {
    for (let i = 0; i < qList.length; i++) {
        let numAns = qList[i].ansIds.length;
        let numViews = qList[i].views;

        let temp = document.getElementById("questions");

        if (temp) temp.innerHTML += "<div class = card id = card" + i + ">  </div>"
        let cardName = "card" + i;
        let card = document.getElementById(cardName);

        //hidden form
        card.innerHTML += "<form class='cardForm' id='cardForm" + i + "'> <input type='hidden' name='cardFormi' id='cardFormi' value='" + i + "'></form>";
        
        card.innerHTML += "<div class = \"views\" id = 'views" + i + "'>" + qList[i].ansIds.length + " answers\n" + "\n<br>" + qList[i].views + " views" + "</div>";
        card.innerHTML += "<div class = \"cardTitle\" id = 'cardTitle" + i + "'><button class = \"fakeButton\" value="+i+" id = \"qCard"+i+"\">" + qList[i].title + "</button></div>";
        card.innerHTML += "<div class = \"cardAuthor\" id = 'cardAuthor" + i + "'> <span style= 'color: red;'>" + qList[i].askedBy + "</span> asked " + obj.getTimeDiff(qList[i].askDate) + "</div>";
        card.innerHTML += "<div class = \"cardTags\" id = \"cardTags" + i + "\"></div>";
        obj.getTags(i);
        
    }
    // }
    // sessionStorage.setItem("currentData", JSON.stringify(obj));
    displayNumQs();

}

let unansSetup = function() {
    let unansButton = document.getElementById("unans");
    unansButton.addEventListener("click", unansSort);
}

let unansSort = function() {
    let obj = new Model();
    obj.loadData();
    // let obj = JSON.parse(sessionStorage.getItem("currentObject"));
    let count = 0;
    console.log("unans active");

    // if (presortedByTags) {
    // for (let i = 0; i < cardsToSort.length; i++) {
    //     if (cardsToSort[i].ansIds.length != 0) {
    //         count++;
    //         document.getElementById(cardTags[i]).style.display = "none";
    //     }
    // }

    // let element1 = document.getElementById("numofClasses");
    // if (cardsToSort.length - count == 1) element1.innerHTML = "1 question";
    // else element1.innerHTML = (cardsToSort.length - count) + " questions";    
    // }
    // else {
    let questions = obj.data.questions;
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].ansIds.length != 0) {
            count++;
            document.getElementById("card" + i).style.display = "none";
        }
    // }
    

    let element1 = document.getElementById("numofClasses");
    if (obj.getLength() - count == 1) element1.innerHTML = "1 question";
    else element1.innerHTML = (obj.getLength() - count) + " questions";
    }
    obj.saveData();
    // sessionStorage.setItem("currentObject", JSON.stringify(obj.getData()));
}

let activeSetup = function() {
    let activeButton = document.getElementById("active");
    activeButton.addEventListener("click", activeSort);
}


let activeSort = function() {
    let obj = new Model();
    obj.loadData();
    // let obj = JSON.parse(sessionStorage.getItem("currentObject"));
    let ansArr = [];
    let ansDates = [];
    let recentArr = [];


    for (let i = 0; i < obj.data.questions.length; i++) {
        ansDates = [];
        ansArr = obj.data.questions[i].ansIds; // ansId

        for (let j = 0; j < ansArr.length; j++) {
            ansDates.push(getAnsDates(ansArr[j])); // translate ansId into ansDate
        }
        recentArr.push(getRecent(ansDates));

    }

    for (let i = 0; i < recentArr.length; i++) {
        for (let j = i + 1; j < recentArr.length; j++) {
            if (recentArr[i] < recentArr[j]) {
                let temp = obj.data.questions[i];
                obj.data.questions[i] = obj.data.questions[j];
                obj.data.questions[j] = temp;
            }
        }
    }
    obj.saveData();// sessionStorage.setItem("currentObject", JSON.stringify(obj.getData()));
    displayCards();

}



let getRecent = function(arr) {
    let mostRecent = null;
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] < arr[j]) {
                mostRecent = arr[j];
            }
        }
    }
    return mostRecent;
}

let getAnsDates = function(ans) {
    let obj = new Model();
    obj.loadData();
    // let obj = JSON.parse(sessionStorage.getItem("currentObject"));
    for (let z = 0; z < obj.data.answers.length; z++) {
        if (ans === obj.data.answers[z].aid) {
            return obj.data.answers[z].ansDate;

        }
    }
    return 0;
}


let newestSetup = function() {
    let newestButton = document.getElementById("newest");
    newestButton.addEventListener("click", newestSort);

}

let newestSort = function() {
    let obj = new Model();
    obj.loadData();
    console.log(obj);
    // let obj = JSON.parse(sessionStorage.getItem("currentObject"));

    // console.log(cardsToSort);
    // console.log(cardTags);
    
    // if(presortedByTags) {
    //     for (let i = 0; i < cardsToSort.length; i++) {
    //         for (let j = i + 1; j < cardsToSort.length; j++) {
    //             if (cardsToSort[i].askDate < cardsToSort[j].askDate) {
    //                 let temp = cardsToSort[i];
    //                 cardsToSort[i] = cardsToSort[j];
    //                 cardsToSort[j] = temp;
    //             }
    //         }
    //     }
    // }
    // else {
    for (let i = 0; i < obj.data.questions.length; i++) {
        for (let j = i + 1; j < obj.data.questions.length; j++) {
            if (obj.data.questions[i].askDate < obj.data.questions[j].askDate) {
                let temp = obj.data.questions[i];
                obj.data.questions[i] = obj.data.questions[j];
                obj.data.questions[j] = temp;
            }
        }
    }
    // }
    obj.saveData();
    displayCards();
}

let searchBarSetup = function() {
    let searchBarElm = document.getElementById("searchbar");

    searchBarElm.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            onSearchBarKeyUp();
        }
    });
}


// <-------------------searching function----------------->

let tagSearchKeyup = function(str){
  document.getElementById("searchbar").value = str;
  onSearchBarKeyUp();
}

let onSearchBarKeyUp = function() {
    let obj = new Model();
    obj.loadData();
    // let obj = JSON.parse(sessionStorage.getItem("currentObject"));

    var value, name, item, i, j, text, tags, key1, key2;

    value = document.getElementById("searchbar").value.toUpperCase();
    item = obj.data.questions;
    tags = obj.data.tags;

    for (i = 0; i < item.length; i++) {
        value = document.getElementById("searchbar").value.toUpperCase();
        let key = true;
        let key1 = true;       

        console.log(value);

        var tempValue = value;
        while (tagDetecter(tempValue)) {
            console.log("check point 1");
            
            var tagName = tempValue.substring(tempValue.indexOf("[") + 1, tempValue.indexOf("]"));
            var tagId = getTagid(tagName);

            if (item[i].tagIds.indexOf(tagId) > -1) {
                
                key = true;
                tempValue = tempValue.replace("[" + tagName + "]", "");
                value = tempValue;
            } else {
                key = false;
                tempValue = tempValue.replace("[" + tagName + "]", "");
                value = tempValue;
                value = value.trim();
                if(value == ""){
                  key1 = false;
                }
                
              
            }
        }
        value = value.trim();
        tempValue = tempValue.trim();

        name = item[i].title;
        text = item[i].text;

        if (name.toUpperCase().indexOf(value) > -1 ) {
            key = true;
            
        } else if (text.toUpperCase().indexOf(value) > -1) {
            key = true;
            
        } else{
          key = false;
          
        }


        if (key && key1) {
            console.log("card" + i + " has been displayed.");
            document.getElementById("card" + i).style.display = "flex";
        } else {
            console.log("card" + i + " has hidden from the list");
            document.getElementById("card" + i).style.display = "none";
        }
    }
  
    obj.saveData();
    displayNumQs();
}

/*
Helper function for searching by tag names
*/
let getTagid = function(valueTags) {
    let obj = new Model();
    obj.loadData();
    // let obj = JSON.parse(sessionStorage.getItem("currentObject"));
    var i, tags;
    tags = obj.data.tags;
    for (i = 0; i < tags.length; i++) {
        if (tags[i].name.toUpperCase() === valueTags) {
            return tags[i].tid;
        }
    }
    return "none";
}

/*
Another Helper function for searching by tag names
*/
let tagDetecter = function(value) {
    if (value.indexOf("[") > -1 && value.indexOf("]") > -1) {
        return true;
    }
}
//<----------------Searching function END--------------->


//<----------------Tag functions-------------------->
let tagsPageSetup = function(){

  let tagBtn = document.getElementById("tagBtnId");
  tagBtn.addEventListener("click", showTagPage);
  
}

let showTagPage = function(){
  if(document.getElementById("tagMain").style.display == ""){
    getTotalTags();
    displayTags(); 
    
  }

    if(document.getElementById("newQuestionForm").style.display == "block"){
    getTotalTags();
    displayTags(); 
    
  }
    
  document.getElementById("mainPage").style.display = "none";
  document.getElementById("newAnswerPageForm").style.display = "none";
  document.getElementById("answerPageForm").style.display = "none";
    document.getElementById("newQuestionForm").style.display="none";
  document.getElementById("tagMain").style.display = "block";
    
}

let displayTags = function(){
  let obj = new Model();
  obj.loadData();
  
  let tags = obj.data.tags;
  let tagBody = document.getElementById("tagBody");
  
  for(let i = 0; i < tags.length; i++){
    tagBody.innerHTML += "<div class = \"tags\" id = \"tag"+i+"\"></div>";
  }
  
  for(let i = 0; i < tags.length; i++){
    let tag = document.getElementById("tag" + i);
    
    let tagID = tags[i].tid;
    let tagName = tags[i].name;
    
    tag.innerHTML += "<div><button class = \"fakeButton\"id = \"tagLink"+i+"\" value=\""+tagID+"\">"+tagName+"</button></div>";
    tag.innerHTML += displayNumQsByTag(i);
    document.getElementById("tagLink" + i).addEventListener(('click') , tagLinkSetup);
  }
  obj.saveData();
}


let tagLinkSetup = function(e){
  console.log("");
  let obj = new Model();
  obj.loadData();
  let tags = obj.data.tags;

  document.getElementById("tagMain").style.display = "none";
  document.getElementById("mainPage").style.display = "block";
  for(let i = 0; i < obj.getLength(); i++){
    document.getElementById("card" + i).style.display = "none";
    
    for(let j = 0; j < obj.data.questions[i].tagIds.length; j++){
      if(e.target.value == obj.data.questions[i].tagIds[j]){
        document.getElementById("card" + i).style.display = "flex";
        break;
      }
    }
    
  }
  
  displayNumQs();
  
}

let tagSort = function(i){
  let obj = new Model();
  obj.loadData();


  displayNumQsByTag(i);
  
  document.getElementById("mainPage").style.display = "block";
  document.getElementById("tagMain").style.display = "none";
  
    
  
  console.log("link clicked");
}

let displaySortedTag = function(i){
  let obj = new Model();
  obj.loadData();
  console.log("link clicked");
  
  let tags = obj.data.tags;
  
  let key = document.getElementById("tagLink"+i);
  
  let tagLinkPage = function(){
    console.log("link clicked");
    // document.getElementById("searchbar").value = "["+tags[i].name+"]";
    displayNumQsByTag()
    // onSearchBarKeyUp();
  }
  key.addEventListener("click",tagLinkPage);
}

let getTotalTags = function()
{
  let obj = new Model();
  obj.loadData();
  let tagsTotal = document.getElementById("totalTags");
  tagsTotal.innerHTML = obj.data.tags.length + " Tags";
}

let displayNumQsByTag = function(i){
    // presortedByTags = true;
    // console.log("tags sorted: " + presortedByTags);
    // cardsToSort = [];
    // cardTags = [];
    
  let obj = new Model();
  obj.loadData();  
  let fin = "";
  let count = 0;
  let tag = obj.data.tags[i].tid;
  let tags = obj.data.tags;
  let questions = obj.data.questions;
  for(let t = 0; t < questions.length; t++){
    for(let j = 0; j < questions[t].tagIds.length; j++){
      if(questions[t].tagIds[j] === tag){
        document.getElementById("card"+t).style.display = "flex";
        count++;
        // cardsToSort.push(questions[t]);
        //   cardTags.push("card"+t);
      }else{
        document.getElementById("card"+t).style.display = "none";
      }
    }
  }
  obj.saveData();
  fin = count + " question";
  if(count > 1){
    fin += "s";
  }
  return fin;
  
}



//--------------------New question----------------------------------
let newQuestionPageSetup = function() {
    let qBtn = document.getElementById("askQuestionButton");
    qBtn.addEventListener("click", showNewQuestionPage);
    
    let qBtnTags = document.getElementById("askQuestionButtonTagsPage");
    qBtnTags.addEventListener("click", showNewQuestionPage);
    
    let qBtnAns = document.getElementById("askQuestionButtonAnswer");
    qBtnAns.addEventListener("click", showNewQuestionPage);
}

let showNewQuestionPage = function() {

    document.getElementById("mainPage").style.display="none";
    document.getElementById("tagMain").style.display = "none";
    document.getElementById("newQuestionForm").style.display="block";
    document.getElementById("answerPageForm").style.display="none";
  document.getElementById("newAnswerPageForm").style.display="none";
}


//--------------------New question END----------------------------------

//------------------Answer Page -----------------------
let ansBtnSetup = function(){
  let obj = new Model();
  obj.loadData();

  for(let i = 0; i < obj.getLength(); i++){
document.getElementById("qCard"+i).addEventListener("click",answerPageSetup);
  }
  
}
let answerPageSetup = function(e){
  console.log("linked!");
  console.log(e.target.value);
  let index = e.target.value
  let ansLink = document.getElementById(e.target.id);

  document.getElementById("mainPage").style.display="none";
  document.getElementById("tagMain").style.display="none";
  document.getElementById("newQuestionForm").style.display="none";
  document.getElementById("answerPageForm").style.display="block";
  document.getElementById("newAnswerPageForm").style.display="none";

  displayInfo(index);
  displayAns(index);
}

let displayInfo = function(i){
  let obj = new Model();
  obj.loadData();
  let Qs = obj.data.questions;

  let upper3 = document.getElementById("upper3");
  upper3.innerHTML += "<li id='qTitle'><h3>" + Qs[i].ansIds.length + " answers</h3><li>";
  upper3.innerHTML += "<li><h2>" + Qs[i].title + "</h2></li>";

    document.getElementById("askQuestionButtonAnswer").style.display="block";
  // upper3.innerHTML += "<button id=\"askQuestionButtonAnswer\" class=\"button\">Ask Question</button>";

  let lower3 = document.getElementById("lower3");
  lower3.innerHTML += "<div id = \"qViews\">"+ Qs[i].views + " views</div>";
  lower3.innerHTML += "<div id = \"qText\">"+ Qs[i].text + " </div>";
  lower3.innerHTML += "<div id = \"qDate\"><span style= 'color: red;'>" + Qs[i].askedBy + "</span> asked " + obj.getTimeDiff(Qs[i].askDate) + "</div>";
  
}

let displayAns = function(i){
  let obj = new Model();
  obj.loadData();
  let Qs = obj.data.questions;
  let As = obj.data.answers;

  let answers = document.getElementById("answers");
  for(let j = 0; j < Qs[i].ansIds.length; j++){
    let ansId = Qs[i].ansIds[j];
    for(let t = 0; t < As.length; t++){
      if(ansId == As[t].aid){
        answers.innerHTML += "<div class = \"aText\">"+As[t].text + "</div>";
        answers.innerHTML += "<div class = \"aDate\"><span style= 'color: green;'>"+As[t].ansBy + "</span> answered "+ obj.getTimeDiff(As[t].ansDate) +"</div>";
      }
    }
  }
/*   answers.innerHTML +=  */

}

let newAnswerPageSetup = function(){
  let answerQuestionBtn = document.getElementById("answerQuestionBtn");
  answerQuestionBtn.addEventListener("click", newAnswerPage);
}

let newAnswerPage = function(){
  document.getElementById("mainPage").style.display="none";
  document.getElementById("tagMain").style.display="none";
  document.getElementById("newQuestionForm").style.display="none";
  document.getElementById("answerPageForm").style.display="none";
  document.getElementById("newAnswerPageForm").style.display="block";
}









