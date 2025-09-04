const index = require("./index");

const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const axios = require("axios");

// Get index router
app.use("/", index);

jest.mock('axios');


// Tests
test("creates card with a valid word", done => {
  const word = "bien";
  
  axios.mockResolvedValue({ data: 
    `
    <table class='WRD'  data-dict='fren'><tr class='wrtopsection'><td colspan='3' title='Principal Translations' id='regular'><strong><span class='ph' data-ph='sMainMeanings'>Principales traductions</span></strong></td></tr><tr class='langHeader' style='font-size: 13px;text-decoration: underline;font-weight:bold;'><td class='FrWrd'>Français</td><td></td><td class='ToWrd'>Anglais</td></tr><div><p class='wrcopyright'><a name="bien98"></a><span dir='auto'>WordReference English-<span class='ph' data-ph='sLanguage'>French</span> Dictionary © 2025:</span></p></div><tr class='odd' id='fren:843:1'><td class='FrWrd'><strong>bien</strong> <em class='POS2' data-lang='fr' data-abbr='adv'>adv</em></td><td>(de manière satisfaisante)</td><td class='ToWrd' >well <em class='POS2' data-lang='en' data-abbr='adv'>adv</em></td><tr class='odd'><td>&nbsp;</td><td colspan='2' class='FrEx'><span dir='ltr'>Tout est bien qui finit bien.  Mon frère joue bien au tennis.</span></td></tr><tr class='odd'><td>&nbsp;</td><td colspan='2' class='ToEx' dir='ltr'>All's well that ends well. My brother plays tennis well.</td></tr><tr class='even' id='fren:3006342:1'><td class='FrWrd'><strong>bien</strong> <em class='POS2' data-lang='fr' data-abbr='adv'>adv</em></td><td>(beaucoup, très)</td><td class='ToWrd' >well <em class='POS2' data-lang='en' data-abbr='adv'>adv</em></td><tr class='even'><td>&nbsp;</td><td>&nbsp;</td><td class='ToWrd' >a lot <em class='POS2' data-lang='en' data-abbr='pron'>pron</em></td><tr class='even'><td>&nbsp;</td><td colspan='2' class='FrEx'><span dir='ltr'>J'ai bien mangé.</span></td></tr><tr class='even'><td>&nbsp;</td><td colspan='2' class='ToEx' dir='ltr'>I've eaten well.</td></tr><tr class='even'><td>&nbsp;</td><td colspan='2' class='ToEx' dir='ltr'>I've eaten a lot.</td></tr><tr class='odd' id='fren:841:1'><td class='FrWrd'><strong>bien</strong> <em class='POS2' data-lang='fr' data-abbr='adj inv'>adj inv</em></td><td>(objet, travail,... : satisfaisant, de bonne qualité)</td><td class='ToWrd' >good <em class='POS2' data-lang='en' data-abbr='adj'>adj</em></td><tr class='odd'><td>&nbsp;</td><td>&nbsp;</td><td class='ToWrd' >fine <em class='POS2' data-lang='en' data-abbr='adj'>adj</em></td><tr class='odd'><td>&nbsp;</td><td colspan='2' class='FrEx'><span dir='ltr'>Ce travail est très bien.</span></td></tr><tr class='odd'><td>&nbsp;</td><td colspan='2' class='ToEx' dir='ltr'>This work is very good.</td></tr>
    `
  });

  const result = [
        {
            "frWord": "bien",
            "class": "adv",
            "def": "de manière satisfaisante",
            "engWord": [
                "well"
            ],
            "example": "Tout est bien qui finit bien.  Mon frère joue bien au tennis."
        },
        {
            "frWord": "bien",
            "class": "adv",
            "def": "beaucoup, très",
            "engWord": [
                "well",
                "a lot"
            ],
            "example": "J'ai bien mangé."
        }
    ];

  request(app)
    .get(`/${word}`)
    .expect("Content-Type", /json/)
    .expect(result)
    .expect(200, done);
});


test("fails when word is not valid", done => {
    const word = "fji10";

    request(app)
      .get(`/${word}`)
      .expect(400, done);

})
