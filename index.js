require("dotenv").config()
const {
  Bot,
  Keyboard,
  GrammyError,
  HttpError,
  InlineKeyboard,
} = require("grammy")
const getRandomQuestion = require("./getRandomQuestion")
const getCorrectAnswer = require("./getCorrectAnswer")
const inlineQuestionKeyboard = require("./inlineQuestionKeyboard")
const getQuestion = require("./getQuestion")
const getRandomTopic = require("./getRandomTopic")

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
    .text("Random question")
    .resized()

  await ctx.reply("Hi 👋 \nI will help you to prepare for interview")
  await ctx.reply("Where do we begin? Please select your topic below 👇", {
    reply_markup: startKeyboard,
  })
})

let question
let topic

bot.hears(["HTML", "CSS", "JavaScript", "React"], async (ctx) => {
  topic = ctx.message.text.toLowerCase()
  question = getQuestion(topic)

  const inlineKeyboard = inlineQuestionKeyboard(question, topic)

  await ctx.reply(question.text, {
    reply_markup: inlineKeyboard,
  })
})

bot.hears(/Random Question/i, async (ctx) => {
  topic = getRandomTopic()
  question = getRandomQuestion(topic)
  const inlineKeyboard = inlineQuestionKeyboard(question, topic)

  await ctx.reply(`Your topic: ${topic}\n\n${question.text}`, {
    reply_markup: inlineKeyboard,
  })
})

bot.on("callback_query:data", async (ctx) => {
  const callbackData = JSON.parse(ctx.callbackQuery.data)
  const answer = getCorrectAnswer(question)

  const nextQuestionBtn = new InlineKeyboard().text(
    "Next question",
    JSON.stringify({ type: "next-question" })
  )

  if (callbackData.type.includes("direct")) {
    await ctx.reply(answer, {
      // for unable prewiev for links
      reply_markup: nextQuestionBtn,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    })
    await ctx.answerCallbackQuery()
    return
  }

  if (callbackData.isCorrect) {
    await ctx.reply(`Alright ✅\n\nYour answer:\n${answer}`, {
      reply_markup: nextQuestionBtn,
    })
    await ctx.answerCallbackQuery()
    return
  }

  if (callbackData.type === "next-question") {
    console.log(topic)
    question = getQuestion(topic)

  const inlineKeyboard = inlineQuestionKeyboard(question, topic)

  await ctx.reply(question.text, {
    reply_markup: inlineKeyboard,
  })
    await ctx.answerCallbackQuery()
    return
  }

  await ctx.reply(`Incorrect answer ❌ \n\nCorrect answer:\n${answer}`, {
    reply_markup: nextQuestionBtn,
  })
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
