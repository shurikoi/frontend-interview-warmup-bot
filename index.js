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
const getRandomTopic = require("./getRandomTopic")
const inlineQuestionKeyboard = require("./inlineQuestionKeyboard")

const bot = new Bot(process.env.BOT_API_KEY)

// handle the /start command
bot.command("start", async (ctx) => {
  const startKeyboard = new Keyboard()
    .text("HTML")
    .text("CSS")
    .row()
    .text("JavaScript")
    .text("React")
    .row()
    .text("Random Question")
    .resized()

  await ctx.reply("Hi 👋 \nI will help you to prepare for interview")
  await ctx.reply("Where do we begin? Please select your topic below 👇", {
    reply_markup: startKeyboard,
  })
})

let question

bot.hears(["HTML", "CSS", "JavaScript", "React"], async (ctx) => {
  const topic = ctx.message.text.toLowerCase()
  question = getRandomQuestion(topic)

  let inlineKeyboard = inlineQuestionKeyboard(question, topic)

  await ctx.reply(question.text, {
    reply_markup: inlineKeyboard,
  })
})

bot.hears("Random Question", async (ctx) => {
  const topic = getRandomTopic()
  question = getRandomQuestion(topic)
  let inlineKeyboard = inlineQuestionKeyboard(question, topic)

  await ctx.reply(`Your topic: ${topic}\n\n${question.text}`, {
    reply_markup: inlineKeyboard,
  })
})

bot.on("callback_query:data", async (ctx) => {
  const callbackData = JSON.parse(ctx.callbackQuery.data)
  const answer = getCorrectAnswer(question)

  if (!callbackData.type.includes('option')) {
    console.log(answer)
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
  
  // const answer = getCorrectAnswer(question)
  await ctx.reply(`Incorrect answer ❌ \n\n Correct answer: ${answer}`)
  await ctx.answerCallbackQuery()
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
