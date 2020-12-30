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
  obj.deck.innerHTML = "";
  obj.field.innerHTML = "";
  obj.fieldData.forEach((data) => {
    cardDomeConcat(data, obj.field);
  });
  obj.deckData.forEach((data) => {
    cardDomeConcat(data, obj.deck);
  });
  data.field = true;
  obj.cost.textContent = currentCost - data.cost;
}

function reprintScreen(whoseScreen) {
  let obj = whoseScreen ? p1 : p2;
  obj.deck.innerHTML = "";
  obj.field.innerHTML = "";
  obj.hero.innerHTML = "";
  obj.fieldData.forEach((data) => {
    cardDomeConcat(data, obj.field);
  });
  obj.deckData.forEach((data) => {
    cardDomeConcat(data, obj.deck);
  });
  cardDomeConcat(obj.heroData, obj.hero, true);
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
    if (turn) {
      // P1의 턴
      if (card.classList.contains("card-turnover")) {
        return;
      }
      if (!data.whoseCard && p1.selectedCard) {
        if (p1.cost.textContent >= 1) {
          // 여기에 텍스트..
          return; // 코스트를 다 쓰지 않으면 공격 불가
        }
        data.hp = data.hp - p1.selectedCardData.att;
        if (data.hp <= 0) {
          let index = p2.fieldData.indexOf(data);
          if (index > -1) {
            // 졸 사망 시
            p2.fieldData.splice(index, 1);
          } else {
            // 영웅 사망 시
            // 승리메시지
            init(); // 셋타임아웃
          }
        }
        reprintScreen(false);
        p1.selectedCard.classList.remove("card-selected"); // 공격 종료
        p1.selectedCard.classList.add("card-turnover");
        p1.selectedCard = null;
        p1.selectedCardData = null;
        return;
      } else if (!data.whoseCard) {
        return;
      }
      if (data.field) {
        card.parentNode.parentNode.querySelectorAll(".card").forEach((card) => {
          card.classList.remove("card-selected");
        });
        card.classList.add("card-selected");
        p1.selectedCard = card;
        p1.selectedCardData = data;
      } else {
        if (deckToField(data, true) !== "end") {
          createP1Deck(1);
        }
      }
    } else {
      // P2의 턴
      if (card.classList.contains("card-turnover")) {
        return;
      }
      if (data.whoseCard && p2.selectedCard) {
        if (p2.cost.textContent >= 1) {
          // 여기에 텍스트..
          return; // 코스트를 다 쓰지 않으면 공격 불가
        }
        data.hp = data.hp - p2.selectedCardData.att;
        if (data.hp <= 0) {
          let index = p1.fieldData.indexOf(data);
          if (index > -1) {
            // 졸 사망 시
            p1.fieldData.splice(index, 1);
          } else {
            // 영웅 사망 시
            // 승리메시지
            init(); // 셋타임아웃
          }
        }
        reprintScreen(true);
        p2.selectedCard.classList.remove("card-selected"); // 공격 종료
        p2.selectedCard.classList.add("card-turnover");
        p2.selectedCard = null;
        p2.selectedCardData = null;
        return;
      } else if (data.whoseCard) {
        return;
      }
      if (data.field) {
        card.parentNode.parentNode.querySelectorAll(".card").forEach((card) => {
          card.classList.remove("card-selected");
        });
        card.classList.add("card-selected");
        p2.selectedCard = card;
        p2.selectedCardData = data;
      } else {
        if (deckToField(data, false) !== "end") {
          createP2Deck(1);
        }
      }
    }
  });

  dome.appendChild(card); // 시각적 삽입
}
function createP2Deck(num) {
  for (let i = 0; i < num; i++) {
    p2.deckData.push(cardFactory(false, false));
  }
  p2.deck.innerHTML = "";
  p2.deckData.forEach((data) => {
    cardDomeConcat(data, p2.deck);
  });
}
function createP1Deck(num) {
  for (let i = 0; i < num; i++) {
    p1.deckData.push(cardFactory(false, true)); // hero-false, whoseCard-true
  }
  p1.deck.innerHTML = "";
  p1.deckData.forEach((data) => {
    cardDomeConcat(data, p1.deck);
  });
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
  obj.field.innerHTML = "";
  obj.hero.innerHTML = "";
  obj.fieldData.forEach((data) => {
    cardDomeConcat(data, obj.field);
  });
  cardDomeConcat(obj.heroData, obj.hero, true);
  turn = !turn;
  if (turn) {
    p1.cost.textContent = 10;
  } else {
    p2.cost.textContent = 10;
  }
});

init();
