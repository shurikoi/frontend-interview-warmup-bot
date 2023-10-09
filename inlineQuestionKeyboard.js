const { InlineKeyboard } = require("grammy")

const inlineQuestionKeyboard = (question, topic) => {
  if (question?.hasOptions) {
    const buttonRows = question.options.map((option) => [
      InlineKeyboard.text(
        option.text,
        JSON.stringify({
          type: `${topic}-option`,
          isCorrect: option.isCorrect,
          questionId: question.id,
        })
      ),
    ])

    return InlineKeyboard.from(buttonRows)
  } else {
    return (new InlineKeyboard().text(
      "Get answer",
      JSON.stringify({
        type: `${topic}-direct`,
        questionId: question.id,
      })
    ))
  }
}

module.exports = inlineQuestionKeyboard
