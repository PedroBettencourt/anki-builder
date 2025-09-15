const express = require('express');
const { body, param, validationResult } = require("express-validator");
const { createEmptyCard, FSRS, Rating } = require("ts-fsrs");
const db = require("./queries");

//const passport = require('passport');
// const { sign } = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
const cheerio = require("cheerio");
const axios = require("axios");


const index = express.Router();

// REVIEW THIS FOR VERBS (EX. DÉCOUVRIR)

// Get word card
async function getCard(word) {
    const response = await axios(`https://www.wordreference.com/fren/${word}`);
    const result = await response.data;

    const $ = cheerio.load(result);
    const items = $('tr.odd, tr.even');
    const card = []; // Card with french word, definition, english translations, and examples
    let i = 0;
    for (const item of items) {
        let frWord = $(item).find('td.FrWrd').text();
        if (frWord) {
            if (i++ >= 2) break; // Only get the first two definitions
            frWord = frWord.split(" "); // French word and class
            card[i - 1] = { id: i - 1, frWord: frWord[0], wordClass: frWord[1], def: null, engWord: [], example: null };
        }

        const def = $(item).find('td:not([class])').text();
        let match = def.match(/^\((.*?)\)/); // Get the 1st definition and then [1] is without parentheses
        if (match && !card[i - 1].def) card[i - 1].def = match[1];

        let engWord = $(item).find('td.ToWrd');
        if (engWord.text()) {
            // remove the word class
            $(engWord).contents().each((i, el) => { 
                if(el.type === 'text') engWord = $(el).text().trim() ;
            });
            card[i - 1].engWord.push(engWord);
        };

        const example = $(item).find('td.FrEx').text();
        if (example) card[i - 1].example = example;
    }
    return card;
};

const validateWord = [
    param("word")
        .exists()
        .trim()
        .matches(/^[A-zÀ-ÿ]{1,}$/)
        .withMessage("Invalid word!"),
];

index.get("/:word", validateWord, async (req, res) => {
    // Validate word
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    };

    try {
        const card = await getCard(req.params.word);
        res.status(200).json(card);
    } catch (err) {
        res.status(400).json(err);
    };
});


// Save card
const validateCard = [
    body("frWord")
        .exists().trim().matches(/^[A-zÀ-ÿ]{1,}$/).withMessage("Invalid french word!"),

    body("wordClass")
        .exists().trim().matches(/^[A-zÀ-ÿ]{1,}$/).withMessage("Invalid class!"),

    body("def")
        .exists().trim().matches(/^[A-zÀ-ÿ\s]{1,}$/).withMessage("Invalid definition!"),

    body("engWord")
        .exists().isArray().withMessage("There must be english words!"),
    body("engWord.*")
        .matches(/^[A-zÀ-ÿ\s]{1,}$/).withMessage("Invalid english words!"),

    body("example")
        .exists().trim().matches(/^[A-zÀ-ÿ\s]{1,}$/).withMessage("Invalid word!"),
    
    body("def2")
        .matches(/^[A-zÀ-ÿ\s]*$/).withMessage("Invalid second definition!"),

    body("engWord2.*")
        .matches(/^[A-zÀ-ÿ\s]*$/).withMessage("Invalid second english words!"),

    body("example2")
        .matches(/^[A-zÀ-ÿ\s]*$/).withMessage("Invalid second example!"),
];

index.post("/newcard", validateCard, async(req, res) => {
    // Validate card
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    };

    const { frWord, wordClass, def, engWord, example, def2, engWord2, example2 } = req.body;

    // Create fsrs card
    const card = createEmptyCard();

    // Add to the database
    const dbCard = await db.addCard(
        frWord, wordClass, def, engWord, example, def2, engWord2, example2, 
        card.due, card.stability, card.difficulty, card.elapsed_days, card.scheduled_days, 
        card.reps, card.lapses, card.learning_steps, card.state, card.last_review)

    // Missing authentication to add to database -- temporarily adding to a testing user
    
    res.json(dbCard);
});


// // Send token
// index.get("/protected", 
//     passport.authenticate("jwt", { session: false }),
//     (req, res) => {
//         return res.json(req.user);
//     }
// );

module.exports = index;