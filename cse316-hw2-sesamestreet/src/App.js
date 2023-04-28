// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import FakeStackOverflow from './components/fakestackoverflow.js'
import Tags from './components/tags.js'
import Banner from './components/banner';
import Sidebar from './components/sidebar';
import Model from './models/model.js';
import { useState } from 'react';
import Answer from './components/answer.js'
import NewAnswer from './components/newAnswer';
import NewQuestion from './components/newQuestion';


function App() {
  const [mode, setMode] = useState('MainPage');
  const [inputText, setInputText] = useState("");
  const [model, setModel] = useState(new Model());
  const [tag, setTag] = useState("none");
  const [index, setIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  
  console.log(tag);

  let content = null;
  if(mode === 'MainPage'){
    console.log(model);
    content = <FakeStackOverflow input = {inputText} model = {model} tag = {tag} setTag = {setTag} setMode={setMode} setIndex={setIndex}></FakeStackOverflow>
  }else if(mode === 'Tags'){
    content = <Tags model = {model} setMode = {setMode} tag = {tag} setTag = {setTag}></Tags>
  }
  else if(mode === 'NewQuestion'){
    content = <NewQuestion model = {model} setModel={setModel} setMode={setMode}></NewQuestion>
  }else if(mode === 'Answer'){
    content = <Answer model = {model} index = {index} setMode={setMode} setQIndex={setQIndex}></Answer>
  }else if(mode === 'newAnswer'){
    content = <NewAnswer model = {model} setModel={setModel} setMode={setMode} qIndex = {qIndex}></NewAnswer>
  }

  return (
    <section className='fakeso'>
      <div style={{display: 'flex', flexDirection: 'column', position:'absolute', width:'100%', height:'100%', backgroundColor:'#ffddaa'}}> 
        {/* The top banner and sidebar menu that are always displaying */}
        <Banner setInputText = {setInputText}></Banner>
        <div style={{display: 'flex', flex: '1', backgroundColor:'gray'}}>
          <Sidebar setMode={setMode} setTag = {setTag} mode={mode}></Sidebar>
          {/* The current displaying page  */}
          <div style = {{flex: '1'}}>
            {content}
          </div>  
        </div>
      </div>
    </section>



  );
}

export default App;
