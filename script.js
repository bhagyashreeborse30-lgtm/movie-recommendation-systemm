/* =====================================================================
   CineMatch – AI-Based Movie Recommendation System
   Type: Rule-Based Expert System (IF-THEN rules, no ML, no external API)

   The file is organised into the four parts of an expert system:

     1. KNOWLEDGE BASE   – facts about movies (MOVIES array)
     2. RULE BASE        – IF-THEN rules (RULES, AGE_RULES, default rule D1)
     3. INFERENCE ENGINE – matches user facts with rules (recommend function)
     4. USER INTERFACE   – reads the form and draws the results
   ===================================================================== */
"use strict";

/* =====================================================================
   1. KNOWLEDGE BASE
   Each movie is a "fact". Fields:
     id, title, year, genre, language,
     age         -> "Child" (All Ages), "Teen" (13+) or "Adult" (18+)
     description -> short summary shown on the card
     poster      -> OPTIONAL path to your own image, e.g. "posters/john-wick.jpg".
                    If it is missing, a poster is drawn automatically (see makePoster).
   ===================================================================== */
const MOVIES = [
  /* ---------- ACTION ---------- */
  { id: "john-wick", title: "John Wick", year: 2014, genre: "Action", language: "English", age: "Adult",
    description: "A retired hitman is dragged back into the criminal underworld after thieves wrong him." },
  { id: "extraction", title: "Extraction", year: 2020, genre: "Action", language: "English", age: "Adult",
    description: "A hardened mercenary risks everything to rescue a kidnapped teenager in a dangerous city." },
  { id: "dark-knight", title: "The Dark Knight", year: 2008, genre: "Action", language: "English", age: "Teen",
    description: "Batman faces the Joker, a criminal mastermind who pushes Gotham into chaos." },
  { id: "mi-fallout", title: "Mission: Impossible – Fallout", year: 2018, genre: "Action", language: "English", age: "Teen",
    description: "Ethan Hunt races against time to stop a deadly plot after a mission goes wrong." },
  { id: "incredibles", title: "The Incredibles", year: 2004, genre: "Action", language: "English", age: "Child",
    description: "A family of superheroes comes out of hiding to save the world together." },
  { id: "kung-fu-panda", title: "Kung Fu Panda", year: 2008, genre: "Action", language: "English", age: "Child",
    description: "A clumsy, food-loving panda is chosen to become the legendary Dragon Warrior." },
  { id: "war", title: "War", year: 2019, genre: "Action", language: "Hindi", age: "Teen",
    description: "An elite Indian soldier is sent to hunt down his former mentor, who has gone rogue." },
  { id: "uri", title: "Uri: The Surgical Strike", year: 2019, genre: "Action", language: "Hindi", age: "Teen",
    description: "Inspired by true events, an army officer leads a daring and carefully planned mission." },
  { id: "pathaan", title: "Pathaan", year: 2023, genre: "Action", language: "Hindi", age: "Teen",
    description: "A secret agent takes on a ruthless mercenary who threatens the country." },
  { id: "chhota-bheem", title: "Chhota Bheem and the Throne of Bali", year: 2013, genre: "Action", language: "Hindi", age: "Child",
    description: "Young hero Bheem and his friends travel to a faraway kingdom to protect it from a villain." },
  { id: "pawankhind", title: "Pawankhind", year: 2022, genre: "Action", language: "Marathi", age: "Teen",
    description: "A historical war drama about Baji Prabhu Deshpande's heroic stand at the Ghod Khind pass." },
  { id: "lai-bhaari", title: "Lai Bhaari", year: 2014, genre: "Action", language: "Marathi", age: "Teen",
    description: "A larger-than-life hero stands up against a powerful villain in this masala action film." },

  /* ---------- COMEDY ---------- */
  { id: "hera-pheri", title: "Hera Pheri", year: 2000, genre: "Comedy", language: "Hindi", age: "Teen",
    description: "Three broke men's lives turn upside down after a wrong-number call about a kidnapping." },
  { id: "chup-chup-ke", title: "Chup Chup Ke", year: 2006, genre: "Comedy", language: "Hindi", age: "Teen",
    description: "A man in debt pretends to be mute, leading to a chain of funny misunderstandings." },
  { id: "chillar-party", title: "Chillar Party", year: 2011, genre: "Comedy", language: "Hindi", age: "Child",
    description: "A group of kids in a housing colony band together to protect a stray dog." },
  { id: "grand-budapest", title: "The Grand Budapest Hotel", year: 2014, genre: "Comedy", language: "English", age: "Adult",
    description: "A legendary hotel concierge and his young lobby boy get tangled in a stolen-painting mystery." },
  { id: "paddington-2", title: "Paddington 2", year: 2017, genre: "Comedy", language: "English", age: "Child",
    description: "A kind-hearted bear is wrongly jailed and must clear his name." },
  { id: "home-alone", title: "Home Alone", year: 1990, genre: "Comedy", language: "English", age: "Child",
    description: "A boy left behind at Christmas defends his house against two clumsy burglars." },
  { id: "night-museum", title: "Night at the Museum", year: 2006, genre: "Comedy", language: "English", age: "Child",
    description: "A new night guard discovers that the museum's exhibits come alive after dark." },
  { id: "ashi-hi-banwa-banwi", title: "Ashi Hi Banwa Banwi", year: 1988, genre: "Comedy", language: "Marathi", age: "Child",
    description: "A classic Marathi family comedy full of bachelors, a rented house and a hilarious cover-up." },
  { id: "zapatlela", title: "Zapatlela", year: 1993, genre: "Comedy", language: "Marathi", age: "Child",
    description: "A ventriloquist's doll, possessed by a criminal's spirit, comes to life." },
  { id: "navra-maza-navsacha", title: "Navra Maza Navsacha", year: 2004, genre: "Comedy", language: "Marathi", age: "Teen",
    description: "A middle-class couple's journey turns into a chain of comic mishaps." },

  /* ---------- DRAMA ---------- */
  { id: "shawshank", title: "The Shawshank Redemption", year: 1994, genre: "Drama", language: "English", age: "Adult",
    description: "Two imprisoned men form a bond over many years and find hope and redemption." },
  { id: "forrest-gump", title: "Forrest Gump", year: 1994, genre: "Drama", language: "English", age: "Teen",
    description: "A kind-hearted man unknowingly witnesses and shapes decades of history." },
  { id: "pursuit-of-happyness", title: "The Pursuit of Happyness", year: 2006, genre: "Drama", language: "English", age: "Teen",
    description: "A struggling salesman fights homelessness to build a better life for his young son." },
  { id: "wonder", title: "Wonder", year: 2017, genre: "Drama", language: "English", age: "Child",
    description: "A boy with a facial difference starts school and teaches everyone about kindness." },
  { id: "hugo", title: "Hugo", year: 2011, genre: "Drama", language: "English", age: "Child",
    description: "An orphan living in a Paris train station uncovers a mystery linked to a broken automaton." },
  { id: "taare-zameen-par", title: "Taare Zameen Par", year: 2007, genre: "Drama", language: "Hindi", age: "Child",
    description: "A caring teacher discovers the hidden struggle of a gifted young boy." },
  { id: "3-idiots", title: "3 Idiots", year: 2009, genre: "Drama", language: "Hindi", age: "Teen",
    description: "Three engineering students challenge a rigid education system and chase their real dreams." },
  { id: "dangal", title: "Dangal", year: 2016, genre: "Drama", language: "Hindi", age: "Teen",
    description: "A former wrestler trains his daughters to become world-class champions." },
  { id: "shwaas", title: "Shwaas", year: 2004, genre: "Drama", language: "Marathi", age: "Child",
    description: "A grandfather makes a heartbreaking journey to protect his grandson's eyesight." },
  { id: "killa", title: "Killa", year: 2014, genre: "Drama", language: "Marathi", age: "Child",
    description: "A young boy learns to adjust to life in a small coastal town after his family moves." },
  { id: "natrang", title: "Natrang", year: 2010, genre: "Drama", language: "Marathi", age: "Teen",
    description: "A tamasha-loving wrestler gives up everything to fulfil his dream of playing a female role." },

  /* ---------- SCI-FI ---------- */
  { id: "interstellar", title: "Interstellar", year: 2014, genre: "Sci-Fi", language: "English", age: "Teen",
    description: "Explorers travel through a wormhole in search of a new home for humanity." },
  { id: "the-martian", title: "The Martian", year: 2015, genre: "Sci-Fi", language: "English", age: "Teen",
    description: "An astronaut stranded on Mars must survive until a rescue mission can reach him." },
  { id: "wall-e", title: "WALL-E", year: 2008, genre: "Sci-Fi", language: "English", age: "Child",
    description: "A lonely robot on an abandoned Earth discovers friendship and a new purpose." },
  { id: "big-hero-6", title: "Big Hero 6", year: 2014, genre: "Sci-Fi", language: "English", age: "Child",
    description: "A boy genius and his huggable robot friend form a high-tech hero team." },
  { id: "koi-mil-gaya", title: "Koi... Mil Gaya", year: 2003, genre: "Sci-Fi", language: "Hindi", age: "Child",
    description: "A gentle young man befriends a friendly alien who changes his life." },
  { id: "pk", title: "PK", year: 2014, genre: "Sci-Fi", language: "Hindi", age: "Teen",
    description: "An alien visiting Earth questions customs and beliefs with childlike curiosity." },
  { id: "ra-one", title: "Ra.One", year: 2011, genre: "Sci-Fi", language: "Hindi", age: "Teen",
    description: "A video-game villain escapes into the real world and a gamer must stop him." },
  { id: "krrish", title: "Krrish", year: 2006, genre: "Sci-Fi", language: "Hindi", age: "Teen",
    description: "A young man with extraordinary powers becomes a masked hero." }
];

/* Age labels used on the movie cards (clear age suitability). */
const AGE_INFO = {
  Child: { label: "All Ages", css: "age-child" },
  Teen:  { label: "13+",      css: "age-teen"  },
  Adult: { label: "18+",      css: "age-adult" }
};

/* A bigger number means a more mature audience. Used for sorting. */
const AGE_LEVEL = { Child: 1, Teen: 2, Adult: 3 };

/* =====================================================================
   2. RULE BASE
   2a. Recommendation rules:  IF <conditions> THEN recommend <movies>
       "conditions" can have a genre and, optionally, a language.
       A rule with MORE conditions is MORE SPECIFIC and has higher priority.
   ===================================================================== */
const RULES = [
  // The three sample rules from the project brief
  { id: "R1",  conditions: { genre: "Action", language: "English" }, movies: ["john-wick", "extraction"] },
  { id: "R2",  conditions: { genre: "Comedy" },                      movies: ["hera-pheri", "chup-chup-ke"] },
  { id: "R3",  conditions: { genre: "Sci-Fi" },                      movies: ["interstellar", "the-martian"] },

  // Drama rules for every language
  { id: "R4",  conditions: { genre: "Drama", language: "English" },  movies: ["shawshank", "forrest-gump", "pursuit-of-happyness", "wonder", "hugo"] },
  { id: "R5",  conditions: { genre: "Drama", language: "Hindi" },    movies: ["taare-zameen-par", "3-idiots", "dangal"] },
  { id: "R6",  conditions: { genre: "Drama", language: "Marathi" },  movies: ["shwaas", "killa", "natrang"] },

  // Other genre + language combinations
  { id: "R7",  conditions: { genre: "Action", language: "Hindi" },   movies: ["war", "uri", "pathaan", "chhota-bheem"] },
  { id: "R8",  conditions: { genre: "Action", language: "Marathi" }, movies: ["pawankhind", "lai-bhaari"] },
  { id: "R9",  conditions: { genre: "Comedy", language: "English" }, movies: ["grand-budapest", "paddington-2", "home-alone", "night-museum"] },
  { id: "R10", conditions: { genre: "Comedy", language: "Marathi" }, movies: ["ashi-hi-banwa-banwi", "zapatlela", "navra-maza-navsacha"] },
  { id: "R11", conditions: { genre: "Sci-Fi", language: "Hindi" },   movies: ["koi-mil-gaya", "pk", "ra-one", "krrish"] }
];

/* 2b. Age-safety rules: decide which age labels each age group may see. */
const AGE_RULES = {
  Child: { id: "AR1", allowed: ["Child"],                  text: 'IF Age = Child THEN allow only "All Ages" movies' },
  Teen:  { id: "AR2", allowed: ["Child", "Teen"],          text: 'IF Age = Teen THEN allow "All Ages" and "13+" movies' },
  Adult: { id: "AR3", allowed: ["Child", "Teen", "Adult"], text: "IF Age = Adult THEN allow all movies" }
};

/* 2c. Default rule D1 – used when the normal rules cannot give enough
       age-appropriate movies (for example, a Child choosing Action + English). */
const DEFAULT_RULE = {
  id: "D1",
  text: "IF the matched rules give too few age-appropriate movies THEN recommend age-appropriate movies of the same genre (same language first)"
};

const MIN_RESULTS = 2;      // below this many movies, the default rule D1 adds more
const MAX_RESULTS = 4;      // never show more than this many cards
const DEFAULT_COUNT = 3;    // how many movies D1 adds when no rule movie is usable

/* =====================================================================
   3. INFERENCE ENGINE
   Input : facts = { genre, language, age }   (the user's preferences)
   Output: the recommended movies + a full explanation of every step
   Steps :
     1. MATCH     – find every rule whose conditions equal the user's facts
     2. RESOLVE   – sort matched rules by specificity (most conditions first)
     3. FILTER    – remove movies that are not suitable for the age group
     4. FIRE      – the first rule that still has movies "fires"
     5. DEFAULT   – if fewer than MIN_RESULTS movies remain, add rule D1
   ===================================================================== */

/* Helper: get a movie fact by its id. */
function getMovie(id) {
  return MOVIES.find(movie => movie.id === id);
}

/* Helper: is this movie allowed for the selected age group? (uses AGE_RULES) */
function isAllowed(movie, ageGroup) {
  return AGE_RULES[ageGroup].allowed.includes(movie.age);
}

/* Helper: "Genre = Action AND Language = English" */
function conditionText(rule) {
  return Object.entries(rule.conditions)
    .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)} = ${value}`)
    .join(" AND ");
}

/* Helper: full readable rule, used in the About page and the results panel. */
function ruleText(rule) {
  const names = rule.movies.map(id => getMovie(id).title).join(", ");
  return `IF ${conditionText(rule)} THEN Recommend: ${names}`;
}

/* STEP 1 - MATCH: a rule matches when every condition equals the user's fact. */
function findMatchingRules(facts) {
  return RULES.filter(rule =>
    Object.entries(rule.conditions).every(([key, value]) => facts[key] === value)
  );
}

/* Default rule D1: age-appropriate movies of the same genre.
   Movies in the user's language come first, then the most mature allowed ones. */
function applyDefaultRule(facts, excludeIds) {
  const candidates = MOVIES
    .filter(m => m.genre === facts.genre && isAllowed(m, facts.age) && !excludeIds.includes(m.id))
    .sort((a, b) =>
      (b.language === facts.language) - (a.language === facts.language) ||
      AGE_LEVEL[b.age] - AGE_LEVEL[a.age]
    );

  // If there are enough movies in the user's language, use only those.
  const sameLanguage = candidates.filter(m => m.language === facts.language);
  return sameLanguage.length >= MIN_RESULTS ? sameLanguage : candidates;
}

/* The main inference function. */
function recommend(facts) {
  const ageRule = AGE_RULES[facts.age];

  // STEP 1 + 2: match the rules, then put the most specific rule first
  const matchedRules = findMatchingRules(facts).sort(
    (a, b) => Object.keys(b.conditions).length - Object.keys(a.conditions).length
  );

  const ruleReport = [];   // what happened to each matched rule (shown to the user)
  const results = [];      // the final list of recommendations
  let firedRule = null;

  // STEP 3 + 4: filter by age, then fire the first rule that has movies left
  for (const rule of matchedRules) {
    if (firedRule) {
      ruleReport.push({ rule, status: "skipped", removed: [] });   // lower priority
      continue;
    }
    const movies = rule.movies.map(getMovie);
    const allowed = movies.filter(m => isAllowed(m, facts.age));
    const removed = movies.filter(m => !isAllowed(m, facts.age));

    if (allowed.length > 0) {
      firedRule = rule;
      allowed.slice(0, MAX_RESULTS).forEach(movie => results.push({ movie, source: rule.id, rule }));
      ruleReport.push({ rule, status: "fired", removed });
    } else {
      ruleReport.push({ rule, status: "blocked", removed });       // every movie was too mature
    }
  }

  // STEP 5: default rule D1 fills in missing recommendations
  let usedDefault = false;
  if (results.length < MIN_RESULTS) {
    const needed = results.length === 0 ? DEFAULT_COUNT : MIN_RESULTS - results.length;
    const extras = applyDefaultRule(facts, results.map(r => r.movie.id)).slice(0, needed);
    extras.forEach(movie => results.push({ movie, source: DEFAULT_RULE.id, rule: null }));
    usedDefault = extras.length > 0;
  }

  // Is the user's language missing from every recommendation?
  const languageMissing = results.length > 0 && results.every(r => r.movie.language !== facts.language);

  return { facts, ageRule, matchedRules, ruleReport, results, firedRule, usedDefault, languageMissing };
}

/* Builds the "Why this movie?" sentence for one recommendation. */
function explainMovie(result, outcome) {
  const { movie, source, rule } = result;
  const { facts, ageRule } = outcome;
  const ageText = `Age check ${ageRule.id}: "${AGE_INFO[movie.age].label}" is suitable for ${facts.age}.`;
  let text;

  if (source === DEFAULT_RULE.id) {
    text = `Default rule D1: the matched rules could not give enough age-appropriate movies, so the engine picked a ${facts.genre} movie from the knowledge base. ${ageText}`;
  } else {
    text = `Rule ${source} matched your choices (${conditionText(rule)}) and lists this movie. ${ageText}`;
  }
  if (movie.language !== facts.language) {
    text += ` Language note: no ${facts.language} option fits here, so this ${movie.language} movie is the closest match.`;
  }
  return text;
}

/* =====================================================================
   4. USER INTERFACE
   Everything below reads the form and shows results. The AI logic is above.
   ===================================================================== */

/* ---------- small helpers ---------- */
function esc(text) {                      // stops text from being read as HTML
  return String(text).replace(/[&<>"']/g, ch => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
  ));
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------- automatic poster artwork (SVG) ----------
   Real posters are copyrighted, so each card gets an original poster drawn
   from the movie's genre colours and title. To use a real image instead,
   add  poster: "posters/name.jpg"  to the movie in MOVIES. */
const GENRE_COLORS = {
  "Action": ["#be123c", "#4c1d95"],
  "Comedy": ["#f59e0b", "#be185d"],
  "Drama":  ["#7c3aed", "#1e1b4b"],
  "Sci-Fi": ["#06b6d4", "#4338ca"]
};

function wrapTitle(title, maxChars) {     // splits a long title into short lines
  const lines = [];
  let current = "";
  title.split(" ").forEach(word => {
    const attempt = (current + " " + word).trim();
    if (attempt.length <= maxChars) { current = attempt; }
    else { if (current) lines.push(current); current = word; }
  });
  if (current) lines.push(current);
  return lines;
}

function makePoster(movie) {
  if (movie.poster) return movie.poster;                    // use your own image if given

  const [c1, c2] = GENRE_COLORS[movie.genre] || ["#7c3aed", "#ec4899"];
  const lines = wrapTitle(movie.title, 12);
  const size = lines.length > 3 ? 26 : 32;
  const startY = 235 - ((lines.length - 1) * size * 1.2) / 2;

  const titleSvg = lines.map((line, i) =>
    `<text x="150" y="${startY + i * size * 1.2}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="${size}" fill="#fff">${esc(line.toUpperCase())}</text>`
  ).join("");

  // film-strip holes on the left and right edge
  const holes = Array.from({ length: 10 }, (_, i) =>
    `<rect x="9" y="${22 + i * 42}" width="10" height="16" rx="3" fill="#000" opacity=".35"/>` +
    `<rect x="281" y="${22 + i * 42}" width="10" height="16" rx="3" fill="#000" opacity=".35"/>`
  ).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
      <radialGradient id="s" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="300" height="450" fill="url(#g)"/>
    <rect width="300" height="450" fill="url(#s)"/>
    <circle cx="150" cy="118" r="62" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>
    <circle cx="150" cy="118" r="40" fill="#fff" fill-opacity=".12"/>
    <rect y="330" width="300" height="120" fill="#000" opacity=".3"/>
    ${holes}
    <text x="150" y="124" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="15" letter-spacing="4" fill="#fff">${esc(movie.genre.toUpperCase())}</text>
    ${titleSvg}
    <text x="150" y="410" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" letter-spacing="2" fill="#fff" opacity=".9">${movie.year} · ${esc(movie.language.toUpperCase())}</text>
  </svg>`;

  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* ---------- drawing the results ---------- */
function renderMovieCard(result, outcome, index) {
  const { movie } = result;
  const age = AGE_INFO[movie.age];
  return `
    <article class="movie-card" style="--i:${index}">
      <div class="poster">
        <img src="${makePoster(movie)}" alt="Poster of ${esc(movie.title)}" loading="lazy">
        <span class="age-badge ${age.css}">${age.label}</span>
      </div>
      <div class="card-body">
        <h3>${esc(movie.title)} <span class="year">(${movie.year})</span></h3>
        <div class="tags">
          <span class="tag tag-genre">${esc(movie.genre)}</span>
          <span class="tag tag-lang">${esc(movie.language)}</span>
          <span class="tag tag-age ${age.css}">Suitable: ${age.label}</span>
        </div>
        <p class="desc">${esc(movie.description)}</p>
        <div class="why">
          <h4>Why this movie?</h4>
          <p>${esc(explainMovie(result, outcome))}</p>
        </div>
      </div>
    </article>`;
}

/* The "AI Reasoning" panel: shows every step of the inference engine,
   so the matched rule can be explained during the practical exam. */
function renderReasoning(outcome) {
  const { facts, ageRule, ruleReport, results, firedRule, usedDefault } = outcome;

  const matchedHtml = ruleReport.length
    ? ruleReport.map(item => {
        const labels = {
          fired:   ["fired", "FIRED"],
          skipped: ["skipped", "SKIPPED – a more specific rule already fired"],
          blocked: ["blocked", "BLOCKED – all its movies are too mature for this age group"]
        };
        const [css, text] = labels[item.status];
        return `<li><code>${item.rule.id}</code> matched
                (${Object.keys(item.rule.conditions).length} condition${Object.keys(item.rule.conditions).length > 1 ? "s" : ""})
                <span class="status status-${css}">${text}</span></li>`;
      }).join("")
    : "<li>No recommendation rule matched these facts.</li>";

  const removed = ruleReport.flatMap(item => item.removed).map(m => m.title);
  const removedText = removed.length
    ? `Removed as not suitable for ${facts.age}: ${esc(removed.join(", "))}.`
    : "No movie had to be removed.";

  const firedLine = firedRule
    ? `<div class="rule-line"><span class="rule-tag">Matched rule ${firedRule.id}</span>${esc(ruleText(firedRule))}</div>`
    : "";
  const defaultLine = usedDefault
    ? `<div class="rule-line"><span class="rule-tag">Default rule D1</span>${esc(DEFAULT_RULE.text)}</div>`
    : "";

  return `
    <div class="reasoning">
      <h3>AI Reasoning <span>Inference Engine output</span></h3>
      ${firedLine}
      ${defaultLine}
      <ol class="steps">
        <li><strong>Facts collected:</strong> Genre = ${esc(facts.genre)}, Language = ${esc(facts.language)}, Age = ${esc(facts.age)}.</li>
        <li><strong>Rules matched (most specific first):</strong>
          <ul>${matchedHtml}</ul></li>
        <li><strong>Age rule ${ageRule.id}:</strong> ${esc(ageRule.text)}. ${removedText}</li>
        <li><strong>Conclusion:</strong> ${results.length} movie${results.length === 1 ? "" : "s"} recommended.</li>
      </ol>
    </div>`;
}

function renderResults(outcome) {
  const banner = outcome.languageMissing
    ? `<p class="notice">Our knowledge base has no ${esc(outcome.facts.language)} ${esc(outcome.facts.genre)} movie for this age group, so these are the closest matches in other languages.</p>`
    : "";

  const cards = outcome.results.map((result, i) => renderMovieCard(result, outcome, i)).join("");

  return `
    <div class="results-head">
      <h3>Your recommendations</h3>
      <p>${esc(outcome.facts.genre)} · ${esc(outcome.facts.language)} · ${esc(outcome.facts.age)}</p>
    </div>
    ${banner}
    ${renderReasoning(outcome)}
    <div class="movie-grid">${cards}</div>`;
}

/* ---------- the About page: show the live Rule Base ---------- */
function renderRuleBase() {
  const box = document.getElementById("ruleList");
  if (!box) return;

  const recRules = RULES.map(rule =>
    `<li><code class="rid">${rule.id}</code><span>${esc(ruleText(rule))}</span></li>`).join("");
  const ageRules = Object.values(AGE_RULES).map(rule =>
    `<li><code class="rid">${rule.id}</code><span>${esc(rule.text)}</span></li>`).join("");

  box.innerHTML = `
    <h4>Recommendation rules</h4><ul class="rule-list">${recRules}</ul>
    <h4>Age-safety rules</h4><ul class="rule-list">${ageRules}</ul>
    <h4>Default rule</h4><ul class="rule-list"><li><code class="rid">${DEFAULT_RULE.id}</code><span>${esc(DEFAULT_RULE.text)}</span></li></ul>`;
}

/* Small statistics in the hero section, calculated from the real data. */
function renderStats() {
  const languages = new Set(MOVIES.map(m => m.language)).size;
  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  set("statMovies", MOVIES.length);
  set("statRules", RULES.length + Object.keys(AGE_RULES).length + 1);
  set("statLanguages", languages);
}

/* ---------- navigation: mobile menu + highlight the current section ---------- */
function initNavigation() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  // close the mobile menu after choosing a link
  links.addEventListener("click", event => {
    if (event.target.matches("a")) {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // highlight the nav link of the section that is on screen
  const navLinks = links.querySelectorAll("a");
  const sections = ["home", "recommend", "about"].map(id => document.getElementById(id));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link =>
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(section => observer.observe(section));
  }
}

/* ---------- the preference form ---------- */
function initForm() {
  const form = document.getElementById("prefForm");
  const message = document.getElementById("formMessage");
  const resultsBox = document.getElementById("results");
  const findButton = document.getElementById("findBtn");
  const placeholder = resultsBox.innerHTML;     // remember the starting "empty" message

  form.addEventListener("submit", event => {
    event.preventDefault();                      // stay on the page

    // read the three selected values
    const data = new FormData(form);
    const facts = {
      genre: data.get("genre"),
      language: data.get("language"),
      age: data.get("age")
    };

    // validation: all three choices are needed
    const missing = Object.entries({ Genre: facts.genre, Language: facts.language, "Age group": facts.age })
      .filter(([, value]) => !value).map(([name]) => name);
    if (missing.length) {
      message.textContent = "Please choose: " + missing.join(", ") + ".";
      return;
    }
    message.textContent = "";

    // short "thinking" animation so the inference engine feels alive
    findButton.disabled = true;
    findButton.textContent = "Matching rules…";
    resultsBox.innerHTML = `<div class="thinking" role="status"><span class="dots"><i></i><i></i><i></i></span>Inference engine is matching your preferences with the rules…</div>`;
    resultsBox.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });

    setTimeout(() => {
      const outcome = recommend(facts);          // <-- the AI inference happens here
      resultsBox.innerHTML = renderResults(outcome);
      findButton.disabled = false;
      findButton.textContent = "Find My Movies";
    }, prefersReducedMotion() ? 0 : 700);
  });

  // Reset button: clear the choices and the results
  document.getElementById("resetBtn").addEventListener("click", () => {
    form.reset();
    message.textContent = "";
    resultsBox.innerHTML = placeholder;
  });
}

/* ---------- start everything when the page has loaded ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderStats();
  renderRuleBase();
  initNavigation();
  initForm();
  document.getElementById("year").textContent = new Date().getFullYear();
});
