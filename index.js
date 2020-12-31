const p2 = {
  hero: document.querySelector(".p2-hero"),
  deck: document.querySelector(".p2-deck"),
  field: document.querySelector(".p2-cards"),
  cost: document.querySelector(".p2-cost"),
  deckData: [],
  heroData: [],
  fieldData: [],
  selectedCard: null,
  selectedCardData: null,
};

const p1 = {
  hero: document.querySelector(".p1-hero"),
  deck: document.querySelector(".p1-deck"),
  field: document.querySelector(".p1-cards"),
  cost: document.querySelector(".p1-cost"),
  deckData: [],
  heroData: [],
  fieldData: [],
  selectedCard: null,
  selectedCardData: null,
};

let turn = true;
const turnBtn = document.querySelector(".turn-btn");

function deckToField(data, whoseTurn) {
  let obj = whoseTurn ? p1 : p2;
  let currentCost = Number(obj.cost.textContent);
  if (currentCost < data.cost) {
    return "end";
  }
  let index = obj.deckData.indexOf(data);
  obj.deckData.splice(index, 1);
  obj.fieldData.push(data);
  reprintField(obj);
  reprintDeck(obj);
  data.field = true;
  obj.cost.textContent = currentCost - data.cost;
}

function reprintField(obj) {
  obj.field.innerHTML = "";
  obj.fieldData.forEach((data) => {
    cardDomeConcat(data, obj.field);
  });
}
function reprintDeck(obj) {
  obj.deck.innerHTML = "";
  obj.deckData.forEach((data) => {
    cardDomeConcat(data, obj.deck);
  });
}
function reprintHero(obj) {
  obj.hero.innerHTML = "";
  cardDomeConcat(obj.heroData, obj.hero, true);
}
function reprintScreen(whoseScreen) {
  let obj = whoseScreen ? p1 : p2;
  reprintField(obj);
  reprintDeck(obj);
  reprintHero(obj);
}

function battle(card, data, whoseTurn) {
  let attacker = whoseTurn ? p1 : p2;
  let defender = whoseTurn ? p2 : p1;
  if (card.classList.contains("card-turnover")) {
    return;
  }
  let defenderCard = whoseTurn ? !data.whoseCard : data.whoseCard;
  if (defenderCard && attacker.selectedCard) {
    if (attacker.cost.textContent >= 1) {
      // 여기에 텍스트..
      return; // 코스트를 다 쓰지 않으면 공격 불가
    }
    data.hp = data.hp - attacker.selectedCardData.att;
    if (data.hp <= 0) {
      let index = defender.fieldData.indexOf(data);
      if (index > -1) {
        // 졸 사망 시
        defender.fieldData.splice(index, 1);
      } else {
        // 영웅 사망 시
        // 승리메시지
        init(); // 셋타임아웃
      }
    }
    reprintScreen(!whoseTurn);
    attacker.selectedCard.classList.remove("card-selected"); // 공격 종료
    attacker.selectedCard.classList.add("card-turnover");
    attacker.selectedCard = null;
    attacker.selectedCardData = null;
    return;
  } else if (defenderCard) {
    return;
  }
  if (data.field) {
    document.querySelectorAll(".card").forEach((card) => {
      card.classList.remove("card-selected");
    });
    card.classList.add("card-selected");
    attacker.selectedCard = card;
    attacker.selectedCardData = data;
  } else {
    if (deckToField(data, whoseTurn) !== "end") {
      whoseTurn ? createP1Deck(1) : createP2Deck(1);
    }
  }
}
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
  card.addEventListener("click", () => {
    battle(card, data, turn);
  });
  dome.appendChild(card); // 시각적 삽입
}
function createP2Deck(num) {
  for (let i = 0; i < num; i++) {
    p2.deckData.push(cardFactory(false, false));
  }
  reprintDeck(p2);
}
function createP1Deck(num) {
  for (let i = 0; i < num; i++) {
    p1.deckData.push(cardFactory(false, true)); // hero-false, whoseCard-true
  }
  reprintDeck(p1);
}
function createP2Hero() {
  p2.heroData = cardFactory(true, false);
  cardDomeConcat(p2.heroData, p2.hero, true);
}
function createP1Hero() {
  p1.heroData = cardFactory(true, true); //hero-true, whoseCard-true
  cardDomeConcat(p1.heroData, p1.hero, true);
}

function Card(hero, whose) {
  // 전달값이 참인 경우 hero 뽑음.
  if (hero) {
    this.att = Math.ceil(Math.random() * 2);
    this.hp = Math.ceil(Math.random() * 5) + 25;

    this.hero = true;
    this.field = true;
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
  reprintScreen(true);
  reprintScreen(false);
}

turnBtn.addEventListener("click", () => {
  let obj = turn ? p1 : p2;
  document.querySelector(".p2").classList.toggle("turn");
  document.querySelector(".p1").classList.toggle("turn");
  reprintField(obj);
  reprintHero(obj);
  turn = !turn;
  if (turn) {
    p1.cost.textContent = 10;
  } else {
    p2.cost.textContent = 10;
  }
});

init();
