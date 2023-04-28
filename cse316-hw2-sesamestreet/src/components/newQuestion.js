import Model from '../models/model.js';
import FindHyperlinks from './findHyperlinks.js';
import IndexTag from './indexTag.js';

export default function NewQuestion(props) {
    const model = props.model;
    const setModel = props.setModel;
    const newModel = new Model();
    

    console.log(model);

    const fiveTagsMax = (e) => {
        const words = e.target.value.split(/\s+/);

        // if (IndexTag(model, words[0]) < 0) {
        //     console.log('new: ' + words[0]);
        // }
        // else console.log('old: ' + words[0]);

        if (words.length > 5) {
            if (e.keyCode !== 8) e.preventDefault(); //if not backspace, prevent typing
        }
    }

    const addNewQuestion = (e) => {
        const newQuestionText = e.target.newQuestionText.value;
        const hyperlinks = FindHyperlinks(newQuestionText);

        if (hyperlinks[0] === -1) { //error, render error message
            console.log("display hyperlink error");
            e.preventDefault();
            document.getElementById('hyperlinkErrorQuestion').style.display = "inline-block";
        }

        else {
            const dateTime = new Date();

            //-------update tags start-------
            const newQuestionTagsOriginal = e.target.newQuestionTags.value.trim().split(/\s+/g);
            const newQuestionTags = [...new Set(newQuestionTagsOriginal)]; //removes duplicates

            const modelCopyTags = [];
            for (let i = 0; i < model.data.tags.length; i++){
                modelCopyTags[i] = model.data.tags[i];
            }

            //create tags array for new question
            for (let i = 0; i < newQuestionTags.length; i++) {
                const tag = newQuestionTags[i];
                const tagID = IndexTag(model, tag);
                if (tagID < 0) {//new tag, must be added to model.data.tags
                    newQuestionTags[i] = "t" + (1 + modelCopyTags.length); 
                    
                    modelCopyTags.push({
                        tid: "t" + (modelCopyTags.length + 1),
                        name: tag,
                    });
                }
                else newQuestionTags[i] = "t" + (1 + tagID); //old tag
            }

            newModel.data.tags = modelCopyTags;
            // setModel(prevModel => ({ //update model.data.tags
            //     ...prevModel,
            //     data: {
            //         ...prevModel.data,
            //         tags: modelCopyTags,
            //     }
            // }));
            //-------update tags end-------


            //-------update questions start-------
            const modelCopyQuestions = [];
            for(let i = 0; i < model.data.questions.length; i++){
            modelCopyQuestions[i] = model.data.questions[i];
            }
            modelCopyQuestions.push({
                ansIds: [],
                askDate: dateTime,
                askedBy: e.target.newQuestionUsername.value,
                qid: "q" + (1 + modelCopyQuestions.length),
                tagIds: newQuestionTags,
                text: e.target.newQuestionText.value,
                title: e.target.newQuestionTitle.value,
                views: 0,
            });
            //-------update questions end-------

            newModel.data.questions = modelCopyQuestions;
            // setModel(prevModel => ({
            //     ...prevModel,
            //     data: {
            //         ...prevModel.data, //model.data.answers is same
            //         questions: modelCopyQuestions,
            //     }
            // }));

            //-------carry over answers start-------
            const modelCopyAnswers = [];
            for(let i = 0; i < model.data.answers.length; i++){
                modelCopyAnswers[i] = model.data.answers[i];
            }
            newModel.data.answers = modelCopyAnswers;
            //-------carry over answers end-------

            setModel(newModel);

            //testing
            e.preventDefault();
            console.log("updated model");
            console.log(model);
            props.setMode("MainPage");
        }
    }


    //-------new question form html start-------
    return (
        <form action="/" id="newQuestionForm" onSubmit={addNewQuestion}>
        <div className="questionForm" id="questionForm">

            <p className="formLabel">Question Title*</p>
            <p className="subtext">Limit title to 100 characters or less</p>
            <input type="text" id="newQuestionTitle" name="newQuestionTitle" placeholder="Summarize your question"
                required maxLength="100"/>

            <p className="formLabel">Question Text*</p>
            <p className="subtext">Add details</p>
            <textarea id="newQuestionText" name="newQuestionText" placeholder="Describe your question"
                required></textarea>
            <p id="hyperlinkErrorQuestion" className='redText' style={{display: 'none'}}>Hyperlink syntax is [text](link). Please start your links with 'https://' or 'http://'</p>

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
    //-------new question form html end-------
}