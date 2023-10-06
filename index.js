require("dotenv").config()
const {
  Bot,
  Keyboard,
  InlineKeyboard,
  GrammyError,
  HttpError,
} = require("grammy")
const getRandomQuestion = require("./getRandomQuestion")
const getCorrectAnswer = require("./getCorrectAnswer")

const bot = new Bot(process.env.BOT_API_KEY)

bot.command("start", async (ctx) => {
  const startKeyboard = new Keyboard()
    .text("HTML")
    .text("CSS")
    .row()
    .text("JavaScript")
    .text("React")
    .resized()

  await ctx.reply("Hi 👋 \nI will help you to prepare for interview")
  await ctx.reply("Where do we begin? Please select your topic below 👇", {
    reply_markup: startKeyboard,
  })
})

let question

bot.hears(["HTML", "CSS", "JavaScript", "React"], async (ctx) => {
  const topic = ctx.message.text.toLowerCase()
  let inlineKeyboard

  question = getRandomQuestion(topic)
  console.log(question)

  if (question.hasOptions) {
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
    
    inlineKeyboard = InlineKeyboard.from(buttonRows)
  } else {
    inlineKeyboard = new InlineKeyboard().text(
      "Get answer",
      JSON.stringify({
        type: topic,
        questionId: question.id,
      })
    )
  }

  await ctx.reply(question.text, {
    reply_markup: inlineKeyboard,
  })
})

bot.on("callback_query:data", async (ctx) => {
  const callbackData = JSON.parse(ctx.callbackQuery.data)

  if (!callbackData.type.includes('option')) {
    const answer = getCorrectAnswer(question)

    await ctx.reply(answer, {
      // for unable prewiev for links
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    })
    await ctx.answerCallbackQuery()
    return
  }

  if (callbackData.isCorrect) {
    await ctx.reply('Alright ✅')
    await ctx.answerCallbackQuery()
    return 
  }
  
  const answer = getCorrectAnswer(question)
  await ctx.reply(`Incorrect answer ❌ \n\n Correct answer: ${answer}`)
})

bot.catch((err) => {
  const ctx = err.ctx
  console.error(`Error while handling update ${ctx.update.update_id}:`)
  const e = err.error
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description)
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e)
  } else {
    console.error("Unknown error:", e)
  }
})

bot.start()
