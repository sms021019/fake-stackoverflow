// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
// import { createRequire } from 'module'
// const require = createRequire(import.meta.url);
const Answer = require('./models/answers')
const Question = require('./models/questions')
const Tag = require('./models/tags')

const express = require('express')
const app = express()
const cors = require('cors')
const port = 8000

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.listen(port, () => {
  console.log(`app listening on ${port}`)
})

const mongoose = require('mongoose')
const mongoDB = 'mongodb://127.0.0.1:27017/fake_so'
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connnection error:'))
db.on('connected', () => {
  console.log('Connected to database')
})

// Handle the SIGINT signal
process.on('SIGINT', async () => {
    await db.close().then((res) => {
        console.log(res)
        console.log("\nServer closed. Database instance disconnected");
        process.exit(0);
    }).catch((err) => {
        console.log(err)
    });
  });

app.get('/', async (req, res) => {
  console.log('in get function')
  const questions = await Question.find({}).populate('tags').populate('answers').exec()
  console.log(questions)
  const tags = await Tag.find({})
  console.log('THESE ARE THE TAGS: ' + tags)
  const answers = await Answer.find({})
  return res.status(200).json({
    success: true,
    data: {
      questions,
      tags,
      answers
    }
  })
})

app.get('/tags', async (req, res) => {
  const tags = await Tag.find({})
  console.log('Tags gotten')
  return res.status(200).json(tags)
})

app.get('/tags/:id', async (req, res) => {
  console.log('Find the tags with id: ' + JSON.stringify(req.params.id))

  const question = await Question.findById({ _id: req.params.id })
  const question_tags = await question.populate('tags')
  return res.status(200).json(question_tags)

  //   await Tag.findById({ _id: req.params.id }, (err, list) => {
  //     if (err) {
  //       return res.status(400).json({ success: false, error: err })
  //     }
  //     console.log('Found list: ' + JSON.stringify(list))

//     return res.status(200).json({ success: true, playlist: list })
//   })
//   req.params._id
})

// app.get('/answer', (req, res) => {
//     QuestionDetails.show_question_dtls(res, req.query.id);
// })

app.post('/question/view', (req, res) => {
  console.log('In post server')
  console.log(req.body._id)
  const updateViews = async (id) => {
    console.log('before increment')
    await Question.updateOne({ _id: id }, { $inc: { views: 1 } })
    console.log('after increment')
  }

  updateViews(req.body._id)
    .then(res => {
      res.send('Question views updated')
    })
    .catch(err => {
      res.send('Failed to update question views ' + err)
    })
})

// Creating new Question and Answer
app.post('/newQuestion', async (req, res) => {
  console.log(req.body)

  const createQuestion = async (res, title, text, tags, asked_by) => {
    const question = Question({
      title,
      text,
      tags,
      asked_by,
      ask_date_time: new Date(),
      answers: [],
      views: 0
    })
    await question.save()
    res.send('Created new question : ' + question)
  }

  // Populate new question's tags array with corresponding object ids
  // Go through request's string of tags
  const requestTags = req.body.tags.trim().split(/\s+/g)
  const newQuestionTags = []

  console.log('current tags in db: ' + await Tag.find({}))
  // For each tag search through database by name
  for (let i = 0; i < requestTags.length; i++) {
    console.log('tag being searched for: ' + requestTags[i])
    const possibleTag = await Tag.find({ name: requestTags[i] })

    // If exists append object id to array
    if (possibleTag.length > 0) {
      console.log(possibleTag[0]._id)
      newQuestionTags.push(possibleTag[0]._id)
    }
    // If DNE, add to DB and append new object id to array
    else {
      console.log('Tag does not exist. Creating tag...')
      const tag = Tag({
        name: requestTags[i]
      })
      await tag.save()
      const possibleTag = await Tag.find({ name: requestTags[i] })
      newQuestionTags.push(possibleTag[0]._id)
    }
  }

  createQuestion(res,
    req.body.title,
    req.body.text,
    newQuestionTags,
    req.body.asked_by
  ).catch(err => {
    res.send('Failed to create new question ' + err)
  })
})

app.post('/newAnswer', (req, res) => {
  console.log('REQUEST HERE Question id: ' + req.body.question_id)
  console.log(req.body)

  const createAnswer = async (res, question_id, text, ans_by, ans_date_time) => {
    const answer = Answer({
      text,
      ans_by,
      ans_date_time
    })
    // console.log("before update question");
    await Question.updateOne({ _id: question_id }, { $push: { answers: answer } })
    // console.log("after update question");

    await answer.save()
    res.send('Created new answer : ' + question)
  }

  createAnswer(res,
    req.body.question_id,
    req.body.text,
    req.body.ans_by
  ).catch(err => {
    res.send('Failed to create new answer ' + err)
  })
})
