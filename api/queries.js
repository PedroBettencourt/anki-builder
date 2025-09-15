const { PrismaClient } = require('./generated/prisma');

// Change database if it's for testing or not
const databaseUrl = process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

async function addCard(frWord, wordClass, def, engWord, example, def2, engWord2, example2, 
                        due, stability, difficulty, elapsed_days, scheduled_days, reps, lapses, learning_steps, state, last_review) {

    const card = await prisma.card.create({ data: 
        { 
          username: "testing",
          frWord: frWord, wordClass: wordClass, 
          def: def, engWord: engWord, example: example, 
          def2: def2, engWord2: engWord2, example2: example2,
          due: due, stability: stability, difficulty: difficulty,
          elapsed_days: elapsed_days, scheduled_days: scheduled_days,
          reps: reps, lapses: lapses, learning_steps: learning_steps,
          state: state, last_review: last_review                
        }
    });
    return card;
};

module.exports = { addCard };