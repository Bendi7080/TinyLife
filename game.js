// ==========================================
// TinyLife
// Основная игровая система
// ==========================================


// ================================
// СОСТОЯНИЕ ИГРЫ
// ================================

const player = {
    energy: 80,
    hunger: 70,
    mood: 75,
    money: 50
};


// Игровое время
let gameTime = {
    hour: 7,
    minute: 0
};


// ================================
// ЭЛЕМЕНТЫ ИНТЕРФЕЙСА
// ================================

const clock = document.getElementById("clock");

const energyElement = document.getElementById("energy");
const hungerElement = document.getElementById("hunger");
const moodElement = document.getElementById("mood");
const moneyElement = document.getElementById("money");

const messageElement = document.getElementById("message");


// ================================
// ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
// ================================

function updateInterface() {

    // Время
    const hour = String(gameTime.hour).padStart(2, "0");
    const minute = String(gameTime.minute).padStart(2, "0");

    clock.textContent = `${hour}:${minute}`;


    // Характеристики
    energyElement.textContent = player.energy;
    hungerElement.textContent = player.hunger;
    moodElement.textContent = player.mood;
    moneyElement.textContent = player.money;
}


// ================================
// ИЗМЕНЕНИЕ ВРЕМЕНИ
// ================================

function addTime(minutes) {

    gameTime.minute += minutes;


    while (gameTime.minute >= 60) {

        gameTime.minute -= 60;
        gameTime.hour += 1;
    }


    // Новый день
    if (gameTime.hour >= 24) {

        gameTime.hour = 0;

        messageElement.textContent =
            "Наступил новый день 🌅";
    }


    updateInterface();
}


// ================================
// ОГРАНИЧЕНИЕ ХАРАКТЕРИСТИК
// ================================

function clampStats() {

    player.energy =
        Math.max(0, Math.min(100, player.energy));

    player.hunger =
        Math.max(0, Math.min(100, player.hunger));

    player.mood =
        Math.max(0, Math.min(100, player.mood));

    player.money =
        Math.max(0, player.money);
}


// ================================
// ДЕЙСТВИЯ
// ================================

function gameAction(action) {


    // ----------------------------
    // СПАТЬ
    // ----------------------------

    if (action === "sleep") {

        addTime(120);

        player.energy += 35;

        player.hunger -= 10;

        player.mood += 5;

        messageElement.textContent =
            "Ты поспал два часа. Энергии стало больше 💤";
    }


    // ----------------------------
    // ПОЕСТЬ
    // ----------------------------

    if (action === "eat") {

        if (player.money < 5) {

            messageElement.textContent =
                "У тебя недостаточно денег на еду 💶";

            return;
        }


        addTime(25);

        player.money -= 5;

        player.hunger += 30;

        player.mood += 5;

        messageElement.textContent =
            "Ты приготовил завтрак 🍳";
    }


    // ----------------------------
    // УМЫТЬСЯ
    // ----------------------------

    if (action === "wash") {

        addTime(15);

        player.energy -= 4;

        player.mood += 10;

        messageElement.textContent =
            "Теперь ты чувствуешь себя свежее 🚿";
    }


    // ----------------------------
    // ОТДОХНУТЬ
    // ----------------------------

    if (action === "rest") {

        addTime(30);

        player.energy += 8;

        player.hunger -= 3;

        player.mood += 5;

        messageElement.textContent =
            "Ты немного отдохнул 🪑";
    }


    clampStats();

    updateInterface();
}


// ================================
// АВТОМАТИЧЕСКОЕ ВРЕМЯ
// ================================

// Каждые 10 секунд реального времени
// проходит 5 минут игрового времени.

setInterval(() => {

    addTime(5);

    player.energy -= 0.2;

    player.hunger -= 0.15;

    clampStats();

    updateInterface();

}, 10000);


// ================================
// ЗАПУСК
// ================================

updateInterface();

messageElement.textContent =
    "Добро пожаловать в TinyLife 🌷";
