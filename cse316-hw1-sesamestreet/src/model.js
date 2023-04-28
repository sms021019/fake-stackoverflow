export default class Model {
    constructor() {
        this.data = {
            questions: [
                {
                    qid: 'q1',
                    title: 'Programmatically navigate using React router',
                    text: 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.',
                    tagIds: ['t1', 't2'],
                    askedBy: 'JoJi John',
                    askDate: new Date('December 17, 2020 03:24:00'),
                    ansIds: ['a1', 'a2'],
                    views: 10,
                },
                {
                    qid: 'q2',
                    title: 'android studio save string shared preference, start activity and load the saved string',
                    text: 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.',
                    tagIds: ['t3', 't4', 't2'],
                    askedBy: 'saltyPeter',
                    askDate: new Date('January 01, 2022 21:06:12'),
                    ansIds: ['a3', 'a4', 'a5'],
                    views: 121,
                }
            ],
            tags: [
                {
                    tid: 't1',
                    name: 'react',
                },
                {
                    tid: 't2',
                    name: 'javascript',
                },
                {
                    tid: 't3',
                    name: 'android-studio',
                },
                {
                    tid: 't4',
                    name: 'shared-preferences',
                }
            ],

            answers: [
                {
                    aid: 'a1',
                    text: 'React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.',
                    ansBy: 'hamkalo',
                    ansDate: new Date('March 02, 2022 15:30:00'),
                },
                {
                    aid: 'a2',
                    text: 'On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.',
                    ansBy: 'azad',
                    ansDate: new Date('January 31, 2023 15:30:00'),
                },
                {
                    aid: 'a3',
                    text: 'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.',
                    ansBy: 'abaya',
                    ansDate: new Date('April 21, 2022 15:25:22'),
                },
                {
                    aid: 'a4',
                    text: 'YourPreference yourPreference = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);',
                    ansBy: 'alia',
                    ansDate: new Date('December 02, 2022 02:20:59'),
                },
                {
                    aid: 'a5',
                    text: 'I just found all the above examples just too confusing, so I wrote my own. ',
                    ansBy: 'sana',
                    ansDate: new Date('December 31, 2022 20:20:59'),
                }
            ]
        };
    }
    // add methods to query, insert, and update the model here. E.g.,

    // getAllQstns() {
    //   return this.data.questions;
    // }

    // $(document).ready(function(){
    //   board = boardSetting();
    //   $("section #board div").click(clickBoard); 
    //   AITurn();

    //  });

    getLength() {
        return this.data.questions.length;
    }
    getNumAns = function(i) {
        return this.data.questions[i].ansIds.length;
    }

    getNumViews = function(i) {
        return this.data.questions[i].views;
    }
    getTitle = function(i) {
        return this.data.questions[i].title;
    }
    getAuthor = function(i) {
        return this.data.questions[i].askedBy;
    }
    getTags = function(i) {
        let tags = document.getElementById("cardTags" + i);
        // let tags = []
        for (let j = 0; j < this.data.questions[i].tagIds.length; j++) {
            for (let g = 0; g < this.data.tags.length; g++) {
                if (this.data.questions[i].tagIds[j] == this.data.tags[g].tid) {
                    tags.innerHTML += "<li>" + this.data.tags[g].name + "</li>";
                }

            }

        }
        return tags;
    }



    getTagNames = function(tagIds) {
        var i, id;

        for (i = 0; i < tagIds.length; i++) {
            id = tagIds[i]
        }
    }


    getTimeDiff = function(someTime) {

      let nowTemp = new Date();
      let someTimeTemp = new Date(someTime);
      
      someTime = new Date(someTime).toISOString();
      const now = new Date().toISOString();
      const diff = (new Date(now) - new Date(someTime)) / 1000; // convert to seconds
      
      if (diff < 60) {
        return Math.floor(diff) + " seconds ago";
      } else if (diff < 60 * 60) {
        return Math.floor(diff / 60) + " minutes ago";
      } else if (diff < 24 * 60 * 60) {
        return Math.floor(diff / (60 * 60)) + " hours ago";
      } else {
        const options = { month: "short", day: "numeric", hour: "numeric", minute: "numeric" };
        const yearDiff = nowTemp.getFullYear() - someTimeTemp.getFullYear();
        if (yearDiff > 0) {
          options.year = "numeric";
        }
        return new Date(someTime).toLocaleDateString("en-US", options) + " at " + new Date(someTime).toLocaleTimeString();
      }
    }


    getData = function(){
      return this.data;
    }
    setData = function(data){
      this.data = data;
    }
    saveData = function(){
      sessionStorage.setItem("currentData", JSON.stringify(this.data));
    }
    loadData = function(){
      this.data = JSON.parse(sessionStorage.getItem("currentData"));
    }

    // displayFlex = function(i){
      
    //   document.getElementById("card" + i).style.display = "none";
    // }
  
}

