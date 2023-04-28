// import Model from '../models/model.js';
import FindHyperlinks from './findHyperlinks.js'
import api from '../api.js'

export default function NewQuestion () {
  // useEffect(() => {
  //     loadNewQuestion();
  // }, [])

  // function loadNewQuestion() {
  //     async function asyncLoadNewQuestion(){
  //         return api.get('/newQuestion').then(response => {
  //             if (response.data.success) {
  //                 setModel(response.data)
  //             }
  //             else {
  //                 return -2;
  //             }
  //         });
  //     }
  //     return asyncLoadNewQuestion();
  // }

  const fiveTagsMax = (e) => {
    const words = e.target.value.split(/\s+/)

    // if (IndexTag(model, words[0]) < 0) {
    //     console.log('new: ' + words[0]);
    // }
    // else console.log('old: ' + words[0]);

    if (words.length > 5) {
      if (e.keyCode !== 8) e.preventDefault() // if not backspace, prevent typing
    }
  }

  const addNewQuestion = (e) => {
    const newQuestionText = e.target.newQuestionText.value
    const hyperlinks = FindHyperlinks(newQuestionText)
    console.log(newQuestionText)

    if (hyperlinks[0] === -1) { // error, render error message
      console.log('display hyperlink error')
      e.preventDefault()
      document.getElementById('hyperlinkErrorQuestion').style.display = 'inline-block'
    } else {
      const newQ = {
        title: e.target.newQuestionTitle.value,
        text: e.target.newQuestionText.value,
        tags: e.target.newQuestionTags.value,
        asked_by: e.target.newQuestionUsername.value
      }


      api.post('http://localhost:8000/newQuestion', newQ)
        .then(function (response) {
          // handlesuccess
          console.log(response)
          console.log('New question submitted properly')
        })
        .catch(function (response) {
          // handle error
          console.log(response)
          console.log('New question did not submit properly')
        })
    }
  }

  // -------new question form html start-------
  return (
        <form action="/newQuestion" id="newQuestionForm" onSubmit={addNewQuestion}>
        <div className="questionForm" id="questionForm">

            <p className="formLabel">Question Title*</p>
            <p className="subtext">Limit title to 100 characters or less</p>
            <input type="text" id="newQuestionTitle" name="newQuestionTitle" placeholder="Summarize your question"
                required maxLength="100"/>

            <p className="formLabel">Question Text*</p>
            <p className="subtext">Add details</p>
            <textarea id="newQuestionText" name="newQuestionText" placeholder="Describe your question"
                required></textarea>
            <p id="hyperlinkErrorQuestion" className='redText' style={{ display: 'none' }}>Hyperlink syntax is [text](link). Please start your links with https:// or http://</p>

            {/* event listener needed for 5 words */}
            <p className="formLabel">Tags*</p>
            <p className="subtext">Add keywords separated by whitespace</p>
            <input type="text" id="newQuestionTags" name="newQuestionTags" placeholder="Enter a max of 5 tags" required onKeyDown={fiveTagsMax}/>

            <p className="formLabel">Username*</p>
            <input type="text" id="newQuestionUsername" name="newQuestionUsername" placeholder="Enter your username"
                required/>

            <br/><br/>
            <input type="submit" value="Post Question" className="button" id="submitNewQuestionButton"/>

            <p className="redText">* indicates mandatory fields</p>

        </div>

    </form>
  )
  // -------new question form html end-------
}
