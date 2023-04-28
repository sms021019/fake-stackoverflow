export default function Banner(props){
    const handleSubmit = (e) => {
        e.preventDefault();
    }
    return <div className="banner">
      <div className="title">
          <h1>Fake Stack Overflow</h1>
      </div>
  
      <div className="searchArea">
          <form onSubmit={handleSubmit} action="">
              <input type="text" id="searchbar" placeholder="Search..."  onChange={(e) => {
                props.setInputText(e.target.value.toLowerCase());
                }}/>
              <span></span>
          </form>
      </div>
  
    </div>
  }
  