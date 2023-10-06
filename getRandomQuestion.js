const questions = require("./questions.json")

const getRandomQuestion = (topic) => {
    // get random index of item in topic's array 
    const questionId = Math.floor(Math.random() * questions[topic].length) 
    return questions[topic][questionId]
}

module.exports = getRandomQuestion
