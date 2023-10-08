const questions = require("./questions.json")

const getRandomTopic = () => {
  let topics = []
  let numberOfTopics = 0

  for (const key in questions) {
    if (questions.hasOwnProperty(key)) {
      topics.push(key)
      numberOfTopics++
    }
  }

  const topicIndex = Math.floor(Math.random() * numberOfTopics)
  const topic = topics[topicIndex]

    return topic
}

module.exports = getRandomTopic
