const questions = require("./questions.json")

let counter = 0
let prevTopic
const getQuestion = (topic) => {
    counter++
    if (topic != prevTopic) counter = 0
    prevTopic = topic
    console.log(counter)
    // const numOfQuestions = Object.keys(questions[topic]).length - 1
    return questions[topic][counter]
}

module.exports = getQuestion