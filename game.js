// ==========================================
// TinyLife 0.2
// Время • Дни • Школа • Работа • Деньги
// ==========================================


// ==========================================
// ИГРОК
// ==========================================

const player = {
    energy: 80,
    hunger: 70,
    mood: 75,
    money: 50,

    // Прогресс
    reputation: 50,
    school: 70
};


// ==========================================
// КАЛЕНДАРЬ
// ==========================================

const calendar = {

    day: 1,
    month: 9,
    year: 2026,

    weekDays: [
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
        "Воскресенье"
    ],

    weekDay: 0
};


// ==========================================
// ИГРОВОЕ ВРЕМЯ
// ==========================================

let gameTime = {
    hour: 7,
    minute: 0
};


// ==========================================
// ЭЛЕМЕНТЫ HTML
// ==========================================

const clock = document.getElementById("clock");

const dayElement =
    document.getElementById("day");

const energyElement =
    document.getElementById("energy");

const hungerElement =
    document.getElementById("hunger");

const moodElement =
    document.getElementById("mood");

const moneyElement =
    document.getElementById("money");

const messageElement =
    document.getElementById("message");


// ==========================================
// ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
// ==========================================

function updateInterface() {

    // Время

    const hour =
        String(gameTime.hour).padStart(2, "0");

    const minute =
        String(gameTime.minute).padStart(2, "0");

    clock.textContent =
        `${hour}:${minute}`;


    // День недели и дата

    dayElement.textContent =
        `${calendar.weekDays[calendar.weekDay]}, ` +
        `${calendar.day}.${calendar.month}.${calendar.year}`;


    // Характеристики

    energyElement.textContent =
        Math.round(player.energy);

    hungerElement.textContent =
        Math.round(player.hunger);

    moodElement.textContent =
        Math.round(player.mood);

    moneyElement.textContent =
        Math.round(player.money);
}


// ==========================================
// ДОБАВЛЕНИЕ ВРЕМЕНИ
// ==========================================

function addTime(minutes) {

    gameTime.minute += minutes;


    while (gameTime.minute >= 60) {

        gameTime.minute -= 60;

        gameTime.hour += 1;
    }


    // Новый день

    if (gameTime.hour >= 24) {

        gameTime.hour = 0;

        nextDay();
    }


    updateInterface();
}


// ==========================================
// СЛЕДУЮЩИЙ ДЕНЬ
// ==========================================

function nextDay() {

    calendar.day += 1;

    calendar.weekDay += 1;


    // Воскресенье → Понедельник

    if (calendar.weekDay >= 7) {

        calendar.weekDay = 0;
    }


    // Упрощённый переход месяца

    if (calendar.day > 30) {

        calendar.day = 1;

        calendar.month += 1;
    }


    if (calendar.month > 12) {

        calendar.month = 1;

        calendar.year += 1;
    }


    // Утреннее состояние

    player.energy =
        Math.max(player.energy - 5, 0);

    player.hunger =
        Math.max(player.hunger - 10, 0);


    messageElement.textContent =
        "🌅 Наступил новый день!";
}


// ==========================================
// ОГРАНИЧЕНИЕ ХАРАКТЕРИСТИК
// ==========================================

function clampStats() {

    player.energy =
        Math.max(
            0,
            Math.min(100, player.energy)
        );

    player.hunger =
        Math.max(
            0,
            Math.min(100, player.hunger)
        );

    player.mood =
        Math.max(
            0,
            Math.min(100, player.mood)
        );

    player.school =
        Math.max(
            0,
            Math.min(100, player.school)
        );

    player.reputation =
        Math.max(
            0,
            Math.min(100, player.reputation)
        );

    player.money =
        Math.max(0, player.money);
}


// ==========================================
// ШКОЛА
// ==========================================

function checkSchool() {

    // Школа работает с понедельника
    // по пятницу.

    if (calendar.weekDay >= 5) {

        return;
    }


    // Проверяем время

    if (
        gameTime.hour === 8 &&
        gameTime.minute <= 35
    ) {

        messageElement.textContent =
            "🏫 Пора идти в школу!";
    }


    // Если уже слишком поздно

    if (gameTime.hour >= 9) {

        player.school -= 5;

        player.reputation -= 2;

        messageElement.textContent =
            "🔴 Ты опоздал в школу!";
    }
}


// ==========================================
// РАБОТА
// ==========================================

function checkWork() {

    // Работа доступна после школы.

    if (
        gameTime.hour === 16 &&
        gameTime.minute <= 30
    ) {

        messageElement.textContent =
            "💼 Началась твоя смена!";
    }
}


// ==========================================
// ДЕЙСТВИЯ
// ==========================================

function gameAction(action) {


    // ======================================
    // СПАТЬ
    // ======================================

    if (action === "sleep") {

        addTime(120);

        player.energy += 35;

        player.hunger -= 10;

        player.mood += 5;

        messageElement.textContent =
            "💤 Ты поспал два часа.";
    }


    // ======================================
    // ЕДА
    // ======================================

    if (action === "eat") {

        if (player.money < 5) {

            messageElement.textContent =
                "💶 Недостаточно денег.";

            return;
        }


        addTime(25);

        player.money -= 5;

        player.hunger += 30;

        player.mood += 5;

        messageElement.textContent =
            "🍳 Ты поел.";
    }


    // ======================================
    // УМЫТЬСЯ
    // ======================================

    if (action === "wash") {

        addTime(15);

        player.energy -= 4;

        player.mood += 10;

        messageElement.textContent =
            "🚿 Ты привёл себя в порядок.";
    }


    // ======================================
    // ОТДОХНУТЬ
    // ======================================

    if (action === "rest") {

        addTime(30);

        player.energy += 8;

        player.hunger -= 3;

        player.mood += 5;

        messageElement.textContent =
            "🪑 Ты немного отдохнул.";
    }


    clampStats();

    updateInterface();
}


// ==========================================
// РАБОТА
// ==========================================

function work() {

    // Работа занимает 3 часа.

    if (gameTime.hour < 14) {

        messageElement.textContent =
            "⏰ Смена ещё не началась.";

        return;
    }


    if (gameTime.hour >= 17) {

        messageElement.textContent =
            "❌ Смена уже закончилась.";

        return;
    }


    addTime(180);


    player.money += 30;

    player.energy -= 15;

    player.mood -= 5;

    player.reputation += 2;


    clampStats();

    messageElement.textContent =
        "💼 Смена закончена! +30€";
}


// ==========================================
// ПРОВЕРКА СОБЫТИЙ
// ==========================================

setInterval(() => {

    checkSchool();

    checkWork();

    clampStats();

    updateInterface();

}, 1000);


// ==========================================
// ВРЕМЯ ИГРЫ
// ==========================================

// Каждые 10 секунд
// проходит 5 минут.

setInterval(() => {

    addTime(5);

    player.energy -= 0.2;

    player.hunger -= 0.15;

    clampStats();

    updateInterface();

}, 10000);


// ==========================================
// ЗАПУСК
// ==========================================

updateInterface();

messageElement.textContent =
    "🌷 Новый день начинается...";
// ==========================================
// TinyLife 0.3
// Интерактивные предметы
// ==========================================


// ==========================================
// ПОЗИЦИИ ПРЕДМЕТОВ
// ==========================================

const objectPositions = {

    bed: {
        left: 18,
        top: 70
    },

    computer: {
        left: 72,
        top: 65
    },

    plant: {
        left: 88,
        top: 22
    },

    window: {
        left: 18,
        top: 25
    },

    door: {
        left: 90,
        top: 78
    }
};


// ==========================================
// ВЗАИМОДЕЙСТВИЕ
// ==========================================

function interact(object) {

    const character =
        document.getElementById("character");


    // Персонаж идёт к предмету

    if (objectPositions[object]) {

        const position =
            objectPositions[object];

        character.style.left =
            position.left + "%";

        character.style.top =
            position.top + "%";

        character.classList.add("moving");


        setTimeout(() => {

            character.classList.remove("moving");

        }, 700);
    }


    // ======================================
    // КРОВАТЬ
    // ======================================

    if (object === "bed") {

        addTime(120);

        player.energy += 35;

        player.hunger -= 10;

        player.mood += 5;

        messageElement.textContent =
            "💤 Ты лёг поспать. Прошло 2 часа.";
    }


    // ======================================
    // КОМПЬЮТЕР
    // ======================================

    if (object === "computer") {

        addTime(30);

        player.energy -= 5;

        player.mood += 8;

        messageElement.textContent =
            "🖥️ Ты немного посидел за компьютером.";
    }


    // ======================================
    // РАСТЕНИЕ
    // ======================================

    if (object === "plant") {

        addTime(5);

        player.mood += 4;

        messageElement.textContent =
            "🪴 Ты полил растение.";
    }


    // ======================================
    // ОКНО
    // ======================================

    if (object === "window") {

        player.mood += 3;

        messageElement.textContent =
            "🪟 Ты посмотрел в окно. На улице спокойно.";
    }


    // ======================================
    // ДВЕРЬ
    // ======================================

    if (object === "door") {

        addTime(10);

        messageElement.textContent =
            "🚪 Ты подошёл к двери. Скоро можно будет выйти в город.";
    }


    // ======================================
    // САМИ СЕБЯ
    // ======================================

    if (object === "character") {

        messageElement.textContent =
            `👤 Энергия: ${Math.round(player.energy)} | ` +
            `Голод: ${Math.round(player.hunger)} | ` +
            `Настроение: ${Math.round(player.mood)}`;
    }


    clampStats();

    updateInterface();
}
