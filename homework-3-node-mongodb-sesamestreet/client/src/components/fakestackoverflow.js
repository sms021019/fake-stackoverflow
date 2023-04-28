import { useState, useRef } from 'react'

// import axios from 'Axios';

// let Question = require('../../../server/models/questions');
// let Answer = require('../../../server/models/answers');
// let Tag = require('../../../server/models/tags');

// exports.show_home = async function(res) {
//   let questions = await Question
//   let question_number = await Question.countDocuments({});
// }

// axios.

// ----Getter function for tag display----
function getTags (list, obj) {
  const temp = []
  let num = 0
  for (let j = 0; j < list.length; j++) {
    for (let g = 0; g < obj.data.tags.length; g++) {
      if (list[j].name === obj.data.tags[g].name) {
        temp.push(<li key = {'tag' + num++}>{obj.data.tags[g].name}</li>)
      }
    }
  }
  return temp
}
// ----END of getter function for tag display----

// getTimeDiff() which was originally existed in the model.js in HW2
function getTimeDiff (someTime) {
  const nowTemp = new Date()
  const someTimeTemp = new Date(someTime)

  someTime = new Date(someTime).toISOString()
  const now = new Date().toISOString()
  const diff = (new Date(now) - new Date(someTime)) / 1000 // convert to seconds

  if (diff < 60) {
    return Math.floor(diff) + ' seconds ago'
  } else if (diff < 60 * 60) {
    return Math.floor(diff / 60) + ' minutes ago'
  } else if (diff < 24 * 60 * 60) {
    return Math.floor(diff / (60 * 60)) + ' hours ago'
  } else {
    const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
    const yearDiff = nowTemp.getFullYear() - someTimeTemp.getFullYear()
    if (yearDiff > 0) {
      options.year = 'numeric'
    }
    return new Date(someTime).toLocaleDateString('en-US', options) + ' at ' + new Date(someTime).toLocaleTimeString()
  }
}
// ---- END of getTimeDiff() ----

// ----function that prints questions----
const DisplayCards = function (props) {
  let qList = props.model
  qList = searching(props.model, props.input, props.obj)
  props.setNum(qList.length)

  const temp = []
  for (let i = 0; i < qList.length; i++) {
    const cardName = 'card' + i
    temp.push(
    <div className ='card' id={cardName} key={cardName}>
          <div className = 'views' id = 'views" + i + "'> <p>{qList[i].answers.length} answers</p> <p>{qList[i].views} views</p> </div>
          <div className = 'cardTitle' id = 'cardTitle" + i + "'> <button className = 'fakeButton' value={i} id = {'qCard' + i} onClick = {(e) => {
            console.log(e)
            // let num = parseInt(qList[i].qid.replace(/\D/g, ''));
            // props.setIndex(num-1);
            props.setIndex(qList[i]._id)
            props.setMode('Answer')
          }}> {qList[i].title} </button> </div>
          <div className = 'cardAuthor' id = 'cardAuthor" + i + "'> <span style= {{ color: 'red' }}> {qList[i].asked_by} </span> asked {getTimeDiff(qList[i].ask_date_time)} </div>
          <div className = 'cardTags' id = 'cardTags" + i + "'>{getTags(qList[i].tags, props.obj)} </div>
        </div>)
  }

  return temp
}
// ----END of printing questions function----

// ----Sorting function by the newest uploaded date----
function sortByNewest (list) {
  console.log('Newest sorting activated')

  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      if (list[i].ask_date_time < list[j].ask_date_time) {
        const temp = list[i]
        list[i] = list[j]
        list[j] = temp
      }
    }
  }
  console.log('sorted arr')
  console.log(list)
  return list
}
// ----END of Sorting function by the newest uploaded date----

// ----Sorting function by the active answer----
function sortByActive (list, model) {
  const tempansDates = []
  const temprecentArr = []

  const getAnsDates = function (ans) {
    for (let z = 0; z < model.data.answers.length; z++) {
      if (ans._id === model.data.answers[z]._id) {
        return model.data.answers[z].ans_date_time
      }
    }
    return 0
  }

  for (let i = 0; i < list.length; i++) {
    if (list[i].answers.length === 0) {
      temprecentArr.push({
        mostRecent: null,
        question: list[i]
      })
    } else {
      for (let j = 0; j < list[i].answers.length; j++) {
        tempansDates.push(getAnsDates(list[i].answers[j]))
      }
      const mostRecent = tempansDates.reduce((prev, current) => (current > prev ? current : prev))
      temprecentArr.push({
        mostRecent: new Date(mostRecent),
        question: list[i]
      })
    }
  }

  const result = temprecentArr
    .filter(obj => obj.mostRecent != null)
    .sort((a, b) => b.mostRecent - a.mostRecent)

  for (let i = 0; i < temprecentArr.length; i++) {
    if (temprecentArr[i].mostRecent == null) {
      result.push(temprecentArr[i])
    }
  }

  const final = result.map(obj => obj.question)
  return final
}
// ----END of Sorting function by the active answer----

// ----Sorting function that display only unanswered questions----
function sortByUnanswered (list) {
  console.log('unaswered activated')
  return list.filter(question => question.answers.length === 0)
}
// ----END of Sorting function that display only unanswered questions----


//----Searching function----
function searching(list, input, obj) {
  if(tagDetecter(input)){
    let inputWOtags = input.replace(/\[.*?\]/g, "").trim();
    if(inputWOtags != ""){
      return list.filter(question => {
        return (question.title.toLowerCase().includes(inputWOtags.toLowerCase()) || question.text.toLowerCase().includes(inputWOtags.toLowerCase()) || tagSearch(question, input, obj));
      });
    }else{
      return list.filter(question => {
        return (question.title.toLowerCase().includes(input.toLowerCase()) || question.text.toLowerCase().includes(input.toLowerCase()) || tagSearch(question, input, obj));
      });
    }
    
  }
  // let inputWOtags = input.replace(/\[.*?\]/g, "").trim();

  return list.filter(question => {
    return (question.title.toLowerCase().includes(input.toLowerCase()) || question.text.toLowerCase().includes(input.toLowerCase()) || tagSearch(question, input, obj))
  })
}
// ----END of searching function----

// ----Additional searching functions for tag searching----
function tagSearch (question, input, obj) {
  function extractValues (input) {
    const regex = /\[(.*?)\]/g
    const matches = []
    let match

    while ((match = regex.exec(input)) !== null) {
      matches.push(match[1])
    }

    return matches
  }
  let tagNames = []
  let questionTagNames = []

  if (tagDetecter(input)) {
    tagNames = extractValues(input)
    questionTagNames = tagIdtoName(question, obj)
    for (let i = 0; i < tagNames.length; i++) {
      for (let j = 0; j < questionTagNames.length; j++) {
        if (tagNames[i] === questionTagNames[j]) {
          return true
        }
      }
    }
  } else {
    return false
  }
}

//----Helping functions for tag searching
function tagIdtoName(question, obj){
  let temp = [];
  for(let i =0; i < question.tags.length; i++){
    for(let j = 0; j < obj.data.tags.length; j++){
      if(question.tags[i]._id === obj.data.tags[j]._id){
        temp.push(obj.data.tags[j].name);
      }
    }
  }
  return temp
}
function tagDetecter (value) {
  if (value.indexOf('[') > -1 && value.indexOf(']') > -1) {
    return true
  }
}
// ----END of tag searching function----

function sortByTag (list, tag) {
  console.log('sort by tag activated')
  return list.filter(question => {
    for (let i = 0; i < question.tags.length; i++) {
      if (question.tags[i].name === tag) return true
    }
    return false
  })
}

// ----main function of fake stack overflow main page----
export default function FakeStackOverflow (props) {
  console.log(props)
  const model = props.model
  const [sortType, setSortType] = useState('Newest')
  const counter = useRef(0)
  const [num, setNum] = useState(props.model.data.questions.length)

  let numText = ''
  if (num === 1) {
    numText = '1 question'
  } else {
    numText = num + ' questions'
  }

  console.log(props.counter)

  let modelCopy = []
  for (let i = 0; i < model.data.questions.length; i++) {
    modelCopy[i] = model.data.questions[i]
  }

  if (sortType === 'Active') {
    console.log('order Before Active sorting')
    console.log(modelCopy)
    modelCopy = sortByActive(modelCopy, model)
  } else if (sortType === 'Unanswered') {
    modelCopy = sortByUnanswered(modelCopy)
  } else if (sortType === 'Newest') {
    modelCopy = sortByNewest(modelCopy)
    console.log('order of qs')
    console.log(modelCopy)
  }
  if (props.tag !== 'none') {
    modelCopy = sortByTag(modelCopy, props.tag)
    console.log(counter.current++)
  }

  function onSortButtonClick (sortType) {
    console.log('onsort')
    props.setTag('none')
    setSortType(sortType)
  }

  return (
    <div id="mainPage">
      <div id="header" className="header">
        <div style={{ display: 'flex', flex: 1 }}>
          <h2 style = {{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>All Questions</h2>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <button style = {{}} id="askQuestionButton" className="button" onClick={() => {
              console.log(props)
              props.setMode('NewQuestion')
            }}>Ask Question</button>
          </div>
        </div>
        <div style={{ display: 'flex', flex: 1 }}>
          <div style = {{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }} id="numofClasses" className="underHead">{numText}</div>
          <div style = {{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }} id="sortBtns">
            <li><button id="newest" onClick={() => onSortButtonClick('Newest')}>Newest</button></li>
            <li><button id="active" onClick={() => onSortButtonClick('Active')}>Active</button></li>
            <li><button id="unans" onClick={() => onSortButtonClick('Unanswered')}>Unanswered</button></li>
          </div>
        </div>

      </div>
      <div style={{ flex: '1' }} id = "questions">
        <DisplayCards model = {modelCopy} input = {props.input} obj = {model} tag = {props.tag} setMode = {props.setMode} setIndex = {props.setIndex} setNum = {setNum}></DisplayCards>
      </div>
    </div>
  )
}
// ----END of main function of fake stack overflow main page----
