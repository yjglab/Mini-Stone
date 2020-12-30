const p2Hero = document.querySelector(".p2-hero");
const p2Deck = document.querySelector(".p2-deck");
let p2DeckData = [];
let p2HeroData = [];
let p2Field = document.querySelector(".p2-cards");
let p2FieldData = [];
let p2Cost = document.querySelector(".p2-cost");

const p1Hero = document.querySelector(".p1-hero");
const p1Deck = document.querySelector(".p1-deck");
let p1DeckData = [];
let p1HeroData = [];
let p1Field = document.querySelector(".p1-cards");
let p1FieldData = [];
let p1Cost = document.querySelector(".p1-cost");

let turn = true;
const turnBtn = document.querySelector(".turn-btn");

function cardDomeConcat(data, dome, hero) {
  let card = document.querySelector(".card-hidden .card").cloneNode(true);
  card.querySelector(".card-cost").textContent = data.cost;
  card.querySelector(".card-att").textContent = data.att;
  card.querySelector(".card-hp").textContent = data.hp;

  if (hero) {
    card.querySelector(".card-cost").style.display = "none";
    let heroName = document.createElement("div");
    heroName.textContent = "HERO";
    card.appendChild(heroName);
  }
  card.addEventListener("click", (card) => {
    if (turn) {
      // P1의 턴
      if (!data.whoseCard) {
        return;
      }
      let currentCost = Number(p1Cost.textContent);
      if (currentCost <= data.cost) {
        return;
      }
      let index = p1DeckData.indexOf(data);
      p1DeckData.splice(index, 1);
      p1FieldData.push(data);
      p1Deck.innerHTML = "";
      p1Field.innerHTML = "";
      p1FieldData.forEach((data) => {
        cardDomeConcat(data, p1Field);
      });
      p1DeckData.forEach((data) => {
        cardDomeConcat(data, p1Deck);
      });
      p1Cost.textContent = currentCost - data.cost;
    } else {
      // P2의 턴
      if (data.whoseCard) {
        return;
      }
      let currentCost = Number(p2Cost.textContent);
      if (currentCost <= data.cost) {
        return;
      }
      let index = p2DeckData.indexOf(data);
      p2DeckData.splice(index, 1);
      p2FieldData.push(data);
      p2Deck.innerHTML = "";
      p2Field.innerHTML = "";
      p2FieldData.forEach((data) => {
        cardDomeConcat(data, p2Field);
      });
      p2DeckData.forEach((data) => {
        cardDomeConcat(data, p2Deck);
      });
      p2Cost.textContent = currentCost - data.cost;
    }
  });

  dome.appendChild(card); // 시각적 삽입
}
function createP2Deck(num) {
  for (let i = 0; i < num; i++) {
    p2DeckData.push(cardFactory(false, false));
  }
  p2DeckData.forEach((data) => {
    cardDomeConcat(data, p2Deck);
  });
}
function createP1Deck(num) {
  for (let i = 0; i < num; i++) {
    p1DeckData.push(cardFactory(false, true)); // hero-false, whoseCard-true
  }
  p1DeckData.forEach((data) => {
    cardDomeConcat(data, p1Deck);
  });
}
function createP2Hero() {
  p2HeroData = cardFactory(true, false);
  cardDomeConcat(p2HeroData, p2Hero, true);
}
function createP1Hero() {
  p1HeroData = cardFactory(true, true); //hero-true, whoseCard-true
  cardDomeConcat(p1HeroData, p1Hero, true);
}

function Card(hero, whose) {
  // 전달값이 참인 경우 hero 뽑음.
  if (hero) {
    this.att = Math.ceil(Math.random() * 2);
    this.hp = Math.ceil(Math.random() * 5) + 25;

    this.hero = true;
  } else {
    this.att = Math.ceil(Math.random() * 5);
    this.hp = Math.ceil(Math.random() * 5);
    this.cost = Math.floor((this.att + this.hp) / 2);
  }
  if (whose) {
    //whose가 true면 p1의 카드, false면 p2의 카드
    this.whoseCard = true;
  }
}

function cardFactory(hero, whose) {
  return new Card(hero, whose);
}

function init() {
  createP2Deck(5);
  createP1Deck(5);
  createP2Hero();
  createP1Hero();
}

turnBtn.addEventListener("click", () => {
  turn = !turn;
});

init();
