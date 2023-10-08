const getCorrectAnswer = (question) => {
    if (!question?.hasOptions) {
        return question?.answer
    }

    return question.options.find((option) => option.isCorrect).text
}

module.exports = getCorrectAnswer