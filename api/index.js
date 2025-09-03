const express = require('express');
const { body, validationResult } = require("express-validator");
//const passport = require('passport');
// const { sign } = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
const cheerio = require("cheerio");
const axios = require("axios");


const index = express.Router();

// validate word first

index.get("/:word", async (req, res) => {
    try {
        const response = await axios(`https://www.wordreference.com/fren/${req.params.word}`);
        const result = await response.data;

        const $ = cheerio.load(result);
        const items = $('tr.odd, tr.even');
        const card = []; // Card with french word, definition, english translations, and examples
        let i = 0;
        for (const item of items) {
            let frWord = $(item).find('td.FrWrd');
            if (frWord.text()) {
                if (i++ >= 2) break; // Only get the first two definitions
                frWord = frWord.split(" "); // French word and class
                card[i] = { frWord: frWord[0], class: frWord[1], def: null, engWord: [], example: null };
            }
            
            const def = $(item).find('td:not([class])').text();
            if (!card[i].def) card[i].def = def.replace(/^\(|\)/g, "");

            let engWord = $(item).find('td.ToWrd');
            if (engWord.text()) {
                // remove the word class
                $(engWord).contents().each((i, el) => { 
                    if(el.type === 'text') engWord = $(el).text().trim() 
                });
                card[i].engWord.push(engWord);
            }

            const example = $(item).find('td.FrEx').text();
            if (example) card[i].example = example;
        }

        console.log(card);

    } catch (err) {
        console.error(err.message)
    }
    
});


// WEB SCRAP https://www.wordreference.com/fren/


// // Send token
// index.get("/protected", 
//     passport.authenticate("jwt", { session: false }),
//     (req, res) => {
//         return res.json(req.user);
//     }
// );

module.exports = index;