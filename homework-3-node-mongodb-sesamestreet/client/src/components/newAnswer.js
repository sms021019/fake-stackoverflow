import FindHyperlinks from './findHyperlinks'
import api from '../api.js'

export default function newAnswer (props) {
  const qIndex = props.qIndex

  console.log('qIndex: ' + qIndex)

  const addNewAnswer = (e) => {
    const newAnswerText = e.target.newAnswerText.value
    const hyperlinks = FindHyperlinks(newAnswerText)

    console.log('hyperlinks: ' + hyperlinks)
    if (hyperlinks[0] === -1) { // error, render error message
      console.log('display hyperlink error')
      e.preventDefault()
      document.getElementById('hyperlinkError').style.display = 'inline-block'
    } else { // no hyperlinks or hyperlinks exist and are formatted correctly
      // e.preventDefault();
      api.post('/newAnswer', {
        question_id: qIndex,
        text: e.target.newAnswerText.value,
        ans_by: e.target.newAnswerUsername.value
      })
        .then(function (response) {
          // handlesuccess
          console.log(response)
          console.log('New answer submitted properly')
        })
        .catch(function (response) {
          // handle error
          console.log(response)
          console.log('New answer did not submit properly')
        })
    }
  }

  return (
        <div>
            <form action="/" id="newAnswerPageForm" onSubmit={addNewAnswer}>
                <div className="questionForm">
                    <p className="formLabel">Username*</p>
                    <input type="text" id="newAnswerUsername" name="newAnswerUsername" placeholder="Enter your username" required/>

                    <p className="formLabel">Answer Text*</p>
                    <textarea id="newAnswerText" name="newAnswerText" placeholder="Describe your answer" required></textarea>
                    <p id="hyperlinkError" className="redText" style={{ display: 'none' }}>Hyperlink syntax is [text](link). Please start your links with https:// or http://</p>

                    <br></br>
                    <input id="newAnswerQuestionIndex" type='text' hidden/>
                    <input type="submit" value="Post Answer" className="button" id="submitNewAnswerButton"></input>

                    <p className="redText">* indicates mandatory fields</p>
                </div>
            </form>
        </div>
  )
}
