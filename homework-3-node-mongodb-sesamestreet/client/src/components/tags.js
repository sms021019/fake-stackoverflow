function DisplayTags (props) {
  const obj = props.model
  const tags = obj.data.tags
  const tagBody = [] // ID: tagBody

  for (let i = 0; i < tags.length; i++) {
    const tagID = tags[i].name
    const tagName = tags[i].name
    tagBody.push(
            <div className='tags' id = {'tags' + i} key = {i} style={{ flex: '33.33%' }}>
                <div style={{ textAlign: 'center' }}>
                    <button className='fakeButton' id={'tagLink' + i} value={tagID} onClick={() => {
                      props.setTag(tagID)
                      props.setMode('MainPage')
                    }}>{tagName}</button>
                    <NumQs model = {props.model} index = {i}></NumQs>
                </div>
            </div>
    )
  }
  return tagBody
}

function NumQs (props) {
  let count = 0
  const tag = props.model.data.tags[props.index].name
  const questions = props.model.data.questions
  for (let t = 0; t < questions.length; t++) {
    for (let j = 0; j < questions[t].tags.length; j++) {
      if (questions[t].tags[j].name === tag) {
        count++
      }
    }
  }
  if (count > 1) {
    return (<div style={{ textAlign: 'center' }}>{count + ' questions'}</div>)
  } else {
    return (<div style={{ textAlign: 'center' }}>{count + ' question'}</div>)
  }
}

export default function tags (props) {
  return (
    <div className="tagMain" id="tagMain" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
        <div className="tagHead" id="tagHead" style={{ display: 'flex', flex: '0 0 100px' }}>
            <li style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <div id="totalTags"><h2>{props.model.data.tags.length} tags</h2></div>
            </li>
            <li style = {{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <h2>All Tags</h2>
            </li>
            <li style = {{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <button id="askQuestionButton" className="button" onClick={() => props.setMode('NewQuestion')}>Ask Question</button>
            </li>
        </div>

        <div id="tagBody" style={{ display: 'flex', flexWrap: 'wrap' }}>
            <DisplayTags model = {props.model} setMode = {props.setMode} setTag = {props.setTag}></DisplayTags>
        </div>
    </div>

  )
}
