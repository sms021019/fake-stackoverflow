import FindHyperlinks from './findHyperlinks.js'
import api from '../api.js'

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

function HyperlinkText (text) {
  let answerText = text
  let lengthChange = 0
  const hyperlinkIndexes = FindHyperlinks(text)
  for (let i = 0; i < hyperlinkIndexes.length; i += 2) { // go through each hyperlink
    const beforeText = answerText.substring(0, hyperlinkIndexes[i] + lengthChange)
    const afterText = answerText.substring(hyperlinkIndexes[i + 1] + 1 + lengthChange)
    let answerTextMid = answerText.substring(hyperlinkIndexes[i] + lengthChange, hyperlinkIndexes[i + 1] + 1 + lengthChange)
    lengthChange -= answerTextMid.length

    const hyperlinkText = answerTextMid.substring(1, answerTextMid.indexOf(']('))
    const hyperlinkLink = answerTextMid.substring(answerTextMid.indexOf('](') + 2, answerTextMid.length - 1)

    answerTextMid = '<a href=' + hyperlinkLink + ' target="_blank">' + hyperlinkText + '</a>'
    lengthChange += answerTextMid.length

    answerText = beforeText + answerTextMid + afterText
  }
  return answerText
}

function DisplayAns (props) {
  const answers = props.model.data.answers
  const question = props.question
  const question_ans = question.answers
  const temp = []

  for (let i = 0; i < question_ans.length; i++) {
    for (let j = 0; j < answers.length; j++) {
      if (question_ans[i]._id === answers[j]._id) {
        const hyperlinks = FindHyperlinks(answers[j].text)
        let answerText = ''
        if (hyperlinks[0] === -2) answerText = answers[j].text // no hyperlinks, text is regular
        else answerText = HyperlinkText(answers[j].text)

        temp.push(
                    <div key = {i} style={{ display: 'flex', flex: '0 0 100px', borderBottom: 'dotted', alignItems: 'center' }}>
                        <div style={{ flex: '1', margin: '0 50px' }} dangerouslySetInnerHTML={{ __html: answerText }}></div>
                        <div style={{ flex: '0 0 200px' }}>
                            <p style={{ color: 'green' }}>{answers[j].ans_by}</p>
                            <p>{'answered ' + getTimeDiff(answers[j].ans_date_time)}</p>
                        </div>
                    </div>
        )
      }
    }
  }
  return temp
}

export default function Answer (props) {
  const Qs = props.model.data.questions
  let question = null
  for (let i = 0; i < Qs.length; i++) {
    if (Qs[i]._id === props.index) {
      question = Qs[i]
    }
  }
  console.log('before going post')
  api.post('http://localhost:8000/question/view',
    {
      _id: question._id

    })
    .then(res => {
      console.log(res)
      console.log('Views increment request sent properly')
    })
    .catch(function (response) {
      // handle error
      console.log(response)
      console.log('Request did not send properly')
    })

  question.views += 1

  const hyperlinks = FindHyperlinks(question.text)
  let questionText = ''
  if (hyperlinks[0] === -2) questionText = question.text
  else questionText = HyperlinkText(question.text)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
        <div className="qInfo" style={{ display: 'flex', flex: '0 0 200px', flexDirection: 'column' }}>

            <div id="upper3" style={{ flex: '1', display: 'flex' }}>
                <li style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h3>
                        {question.answers.length + ' answers'}
                    </h3>
                </li>
                <li style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h2>
                        {question.title}
                    </h2>
                </li>
                <li style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => props.setMode('NewQuestion')}>
                    <button id="askQuestionButton" className="button">Ask Question</button>
                </li>
            </div>

            <div id="lower3" style={{ flex: '1', display: 'flex' }}>
                <li style={{ flex: '0 0 200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h3>
                        {question.views + ' views'}
                    </h3>
                </li >
                <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: '50px' }}>
                    <div dangerouslySetInnerHTML={{ __html: questionText }}></div>
                </li>
                <li style={{ flex: '0 0 200px' }}>
                    <p style={{ color: 'red' }}>{question.asked_by}</p>
                    <p>{'asked ' + getTimeDiff(question.ask_date_time)}</p>
                </li>
            </div>
        </div>

        <div className="answers" id="answers" style={{ flex: '1', display: 'flex', flexDirection: 'column', borderBottom: 'dotted' }}>
            <DisplayAns question = {question} model = {props.model}></DisplayAns>
        </div>

        <div className="buttonSpace" id="ansButton" style={{ flex: '0 0 100px', display: 'flex', alignItems: 'center' }}>
            <button id="askQuestionButton" className="button" style={{ marginLeft: '10px' }} onClick={() => {
              props.setMode('newAnswer')
            }}>Answer Question</button>
        </div>
    </div>
  )
}
