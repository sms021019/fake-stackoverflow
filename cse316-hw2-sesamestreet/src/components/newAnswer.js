import Model from "../models/model";
import FindHyperlinks from "./findHyperlinks";

export default function newAnswer(props){
    const model = props.model;
    const setModel = props.setModel;
    const qIndex = props.qIndex;
    const newModel = new Model();

    console.log("qIndex: " + qIndex);

    const addNewAnswer = (e) => {  
        const newAnswerText = e.target.newAnswerText.value;
        const hyperlinks = FindHyperlinks(newAnswerText);

        console.log("hyperlinks: " + hyperlinks);
        if (hyperlinks[0] === -1) { //error, render error message
            console.log("display hyperlink error");
            e.preventDefault();
            document.getElementById('hyperlinkError').style.display = "inline-block";
        }

        else { //no hyperlinks or hyperlinks exist and are formatted correctly
            document.getElementById('hyperlinkError').style.display = "none";
            const dateTime = new Date();

            //-------update answers start-------
            const modelCopyAnswers = [];
            for(let i = 0; i < model.data.answers.length; i++){
                modelCopyAnswers[i] = model.data.answers[i];
            }
            modelCopyAnswers.push({
                aid: "a" + (modelCopyAnswers.length + 1),
                ansBy: e.target.newAnswerUsername.value,
                ansDate: dateTime,
                text: newAnswerText,
            });
            newModel.data.answers = modelCopyAnswers;
            //-------update answers end-------

            //-------update questions start-------
            const modelCopyQuestions = [];
            for(let i = 0; i < model.data.questions.length; i++){
            modelCopyQuestions[i] = model.data.questions[i];
            }
            modelCopyQuestions[qIndex].ansIds.push("a" + modelCopyAnswers.length); 
            newModel.data.questions = modelCopyQuestions;
            //-------update questions end-------

            //-------carry over tags start-------
            const modelCopyTags = [];
            for (let i = 0; i < model.data.tags.length; i++){
                modelCopyTags[i] = model.data.tags[i];
            }
            newModel.data.tags = modelCopyTags;
            //-------carry over tags end-------

            setModel(newModel);

            e.preventDefault();
            console.log("updated model");
            console.log(model);
            props.setMode("MainPage");
        }
    }

    return(
        <div>
            <form action="/" id="newAnswerPageForm" onSubmit={addNewAnswer}>
                <div className="questionForm">
                    <p className="formLabel">Username*</p>
                    <input type="text" id="newAnswerUsername" name="newAnswerUsername" placeholder="Enter your username" required/>
                    
                    <p className="formLabel">Answer Text*</p>
                    <textarea id="newAnswerText" name="newAnswerText" placeholder="Describe your answer" required></textarea>
                    <p id="hyperlinkError" className="redText" style={{display: 'none'}}>Hyperlink syntax is [text](link). Please start your links with 'https://' or 'http://'</p>

                    <br></br>
                    <input id="newAnswerQuestionIndex" type='text' hidden/>
                    <input type="submit" value="Post Answer" className="button" id="submitNewAnswerButton"></input>

                    <p className="redText">* indicates mandatory fields</p>
                </div>
            </form>
        </div>
    );
}