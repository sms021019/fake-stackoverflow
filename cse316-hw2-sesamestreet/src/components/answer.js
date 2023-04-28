import FindHyperlinks from "./findHyperlinks";

function HyperlinkText(text) {
        var answerText = text;
        var lengthChange = 0;
        const hyperlinkIndexes = FindHyperlinks(text);
        for (let i = 0; i < hyperlinkIndexes.length; i += 2) {//go through each hyperlink
            const beforeText = answerText.substring(0, hyperlinkIndexes[i]+lengthChange);
            const afterText = answerText.substring(hyperlinkIndexes[i+1]+1+lengthChange);
            var answerTextMid = answerText.substring(hyperlinkIndexes[i]+lengthChange, hyperlinkIndexes[i+1]+1+lengthChange);
            lengthChange -= answerTextMid.length;

            const hyperlinkText = answerTextMid.substring(1, answerTextMid.indexOf(']('));
            const hyperlinkLink = answerTextMid.substring(answerTextMid.indexOf('](')+2, answerTextMid.length-1);

            answerTextMid = '<a href=' + hyperlinkLink + ' target="_blank">' + hyperlinkText + '</a>';
            lengthChange += answerTextMid.length;

            answerText = beforeText + answerTextMid + afterText;
        }
        return answerText;
    }

function DisplayAns(props){
    let answers = props.model.data.answers;
    let question = props.question;
    let ansIds = question.ansIds;
    let temp = [];

    for(let i = 0; i < ansIds.length; i++){
        for(let j = 0; j < answers.length; j++){
            if(ansIds[i] === answers[j].aid){
                const hyperlinks = FindHyperlinks(answers[j].text);
                var answerText = "";
                if (hyperlinks[0] === -2) answerText = answers[j].text; //no hyperlinks, text is regular
                else answerText = HyperlinkText(answers[j].text);

                temp.push(
                    <div key = {i} style={{display: 'flex', flex: '0 0 100px', borderBottom: 'dotted', alignItems: 'center'}}>
                        <div style={{flex: '1', margin: '0 50px'}} dangerouslySetInnerHTML={{__html: answerText}}></div>
                        <div style={{flex: '0 0 200px'}}>
                            <p style={{color: 'green'}}>{answers[j].ansBy}</p>
                            <p>{"answered " + props.model.getTimeDiff(answers[j].ansDate)}</p>
                        </div>
                    </div>
                );
            }
        }
    }
    return temp;
}


export default function Answer(props){
    let Qs = props.model.data.questions;
    let index = props.index;
    let question = Qs[index];
    question.views += 1;

    const setQIndex = props.setQIndex;
    const hyperlinks = FindHyperlinks(question.text);
    var questionText = "";
    if (hyperlinks[0] === -2) questionText = question.text;
    else questionText = HyperlinkText(question.text);

    return (
    <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}>
        <div className="qInfo" style={{display: 'flex', flex: '0 0 200px', flexDirection: 'column'}}>

            <div id="upper3" style={{flex: '1', display: 'flex'}}>
                <li style={{flex: '1', display:'flex', alignItems: 'center', justifyContent:'center'}}>
                    <h3>
                        {question.ansIds.length + " answers"}
                    </h3>
                </li>
                <li style={{flex: '1', display:'flex', alignItems: 'center', justifyContent:'center'}}>
                    <h2>
                        {question.title}
                    </h2>
                </li>
                <li style={{flex: '1', display:'flex', alignItems: 'center', justifyContent:'center'}} onClick={() => props.setMode("NewQuestion")}>
                    <button id="askQuestionButton" className="button">Ask Question</button>
                </li>
            </div>


            <div id="lower3" style={{flex: '1', display: 'flex'}}>
                <li style={{flex: '0 0 200px', display:'flex', alignItems: 'center', justifyContent:'center'}}>
                    <h3>
                        {question.views + " views"}
                    </h3>
                </li >
                <li style={{ display:'flex', alignItems: 'center', justifyContent:'center', paddingRight: '50px'}}>
                    <div dangerouslySetInnerHTML={{__html: questionText}}></div>
                </li>
                <li style={{flex: '0 0 200px'}}>
                    <p style={{color: 'red'}}>{question.askedBy}</p>
                    <p>{"asked " + props.model.getTimeDiff(question.askDate)}</p>
                </li>
            </div>
        </div>

        <div className="answers" id="answers" style={{flex: '1', display: 'flex', flexDirection: 'column', borderBottom: 'dotted'}}>
            <DisplayAns question = {question} model = {props.model}></DisplayAns>
        </div>

        <div className="buttonSpace" id="ansButton" style={{flex: '0 0 100px', display: 'flex', alignItems: 'center'}}>
            <button id="askQuestionButton" className="button" style={{marginLeft: '10px'}} onClick={() => {
                props.setMode("newAnswer");
                setQIndex(index);
            }}>Answer Question</button>
        </div>
    </div>
    );
}