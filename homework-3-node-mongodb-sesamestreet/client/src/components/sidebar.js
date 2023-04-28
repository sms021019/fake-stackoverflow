export default function Sidebar (props) {
  const mode = props.mode

  if (mode !== 'MainPage' && mode !== 'Tags') {
    document.getElementById('questionsBtnId').className = 'sideButtonDefault'
    document.getElementById('tagBtnId').className = 'sideButtonDefault'
  }

  function onSortButtonClick (sortType) {
    props.setTag('none')
    props.setMode(sortType)
  }
  return (
    <div id="main" className="main">
      <div className="sidebar">
          <button className="sideButtonClicked" id="questionsBtnId" onClick={() => {
            console.log(props)
            onSortButtonClick('MainPage')
            document.getElementById('questionsBtnId').className = 'sideButtonClicked'
            document.getElementById('tagBtnId').className = 'sideButtonDefault'
          }}>Questions</button>

          <button className="sideButtonDefault" id="tagBtnId" style = {{}} onClick={() => {
            document.getElementById('questionsBtnId').className = 'sideButtonDefault'
            document.getElementById('tagBtnId').className = 'sideButtonClicked'
            props.setMode('Tags')
          }}>Tags</button>
      </div>
    </div>
  )
}
