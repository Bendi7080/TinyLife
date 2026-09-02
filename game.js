// ==========================================
// TinyLife 0.3
// ==========================================

const player = {
    energy: 80,
    hunger: 70,
    mood: 75,
    money: 50,
    reputation: 50,
    school: 70
};

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

let gameTime = {
    hour: 7,
    minute: 0
};


// ==========================================
// HTML
// ==========================================

const clock = document.getElementById("clock");
const dayElement = document.getElementById("day");

const energyElement = document.getElementById("energy");
const hungerElement = document.getElementById("hunger");
const moodElement = document.getElementById("mood");
const moneyElement = document.getElementById("money");

const messageElement = document.getElementById("message");
const character = document.getElementById("character");


// ==========================================
// ОБНОВЛЕНИЕ
// ==========================================

function updateInterface() {

    clock.textContent =
        String(gameTime.hour).padStart(2, "0") +
        ":" +
        String(gameTime.minute).padStart(2, "0");

    dayElement.textContent =
        `${calendar.weekDays[calendar.weekDay]}, ` +
        `${calendar.day}.${calendar.month}.${calendar.year}`;

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
// ВРЕМЯ
// ==========================================

function addTime(minutes) {

    gameTime.minute += minutes;

    while (gameTime.minute >= 60) {
        gameTime.minute -= 60;
        gameTime.hour++;
    }

    if (gameTime.hour >= 24) {

        gameTime.hour = 0;

        calendar.day++;
        calendar.weekDay++;

        if (calendar.weekDay >= 7) {
            calendar.weekDay = 0;
        }

        if (calendar.day > 30) {
            calendar.day = 1;
            calendar.month++;
        }

        if (calendar.month > 12) {
            calendar.month = 1;
            calendar.year++;
        }

        messageElement.textContent =
            "🌅 Наступил новый день!";
    }

    updateInterface();
}


// ==========================================
// ХАРАКТЕРИСТИКИ
// ==========================================

function clampStats() {

    player.energy =
        Math.max(0, Math.min(100, player.energy));

    player.hunger =
        Math.max(0, Math.min(100, player.hunger));

    player.mood =
        Math.max(0, Math.min(100, player.mood));

    player.school =
        Math.max(0, Math.min(100, player.school));

    player.reputation =
        Math.max(0, Math.min(100, player.reputation));

    player.money =
        Math.max(0, player.money);
}


// ==========================================
// ДВИЖЕНИЕ
// ==========================================

const positions = {

    bed: {
        left: "22%",
        top: "70%"
    },

    computer: {
        left: "72%",
        top: "65%"
    },

    plant: {
        left: "85%",
        top: "25%"
    },

    window: {
        left: "25%",
        top: "30%"
    },

    door: {
        left: "86%",
        top: "78%"
    }
};


function moveCharacter(object) {

    if (!positions[object]) {
        return;
    }

    character.classList.add("moving");

    character.style.left =
        positions[object].left;

    character.style.top =
        positions[object].top;

    setTimeout(() => {
        character.classList.remove("moving");
    }, 700);
}


// ==========================================
// ВЗАИМОДЕЙСТВИЕ
// ==========================================

function interact(object) {

    moveCharacter(object);


    if (object === "bed") {

        addTime(120);

        player.energy += 35;
        player.hunger -= 10;
        player.mood += 5;

        messageElement.textContent =
            "💤 Ты поспал два часа.";
    }


    else if (object === "computer") {

        addTime(30);

        player.energy -= 5;
        player.mood += 8;

        messageElement.textContent =
            "🖥️ Ты посидел за компьютером.";
    }


    else if (object === "plant") {

        addTime(5);

        player.mood += 4;

        messageElement.textContent =
            "🪴 Ты полил растение.";
    }


    else if (object === "window") {

        addTime(5);

        player.mood += 3;

        messageElement.textContent =
            "🪟 Ты посмотрел в окно.";
    }


    else if (object === "door") {

        addTime(10);

        messageElement.textContent =
            "🚪 Ты подошёл к двери.";
    }


    else if (object === "character") {

        messageElement.textContent =
            "👤 Это твой персонаж.";
    }


    clampStats();
    updateInterface();
}


// ==========================================
// КНОПКИ
// ==========================================

function gameAction(action) {

    if (action === "sleep") {
        interact("bed");
        return;
    }

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


    if (action === "wash") {

        addTime(15);

        player.energy -= 4;
        player.mood += 10;

        messageElement.textContent =
            "🚿 Ты привёл себя в порядок.";
    }


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
    updateInterface();

    messageElement.textContent =
        "💼 Смена закончена! +30€";
}


// ==========================================
// АВТОМАТИЧЕСКОЕ ВРЕМЯ
// ==========================================

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
    "🌷 Добро пожаловать в TinyLife 0.4!";

// ==========================================
// РЕДАКТОР ПЕРСОНАЖА
// ==========================================

const characterData = {

    name: "Новый персонаж",

    hair: 1,

    eyes: 1,

    top: 1,

    bottom: 1
};


// Варианты внешности

const characterStyles = {

    hair: [
        "💇",
        "👩‍🦰",
        "👱",
        "👩‍🦱"
    ],

    eyes: [
        "👀",
        "👁️",
        "◉",
        "◍"
    ],

    top: [
        "👕",
        "🧥",
        "👚",
        "🥼"
    ],

    bottom: [
        "👖",
        "🩳",
        "👗",
        "👖"
    ]
};

function openCharacterEditor() {

    const editor =
        document.getElementById("characterEditor");

    editor.classList.add("active");

    updateCharacterEditor();
}


function closeCharacterEditor() {

    const editor =
        document.getElementById("characterEditor");

    editor.classList.remove("active");
}


function updateCharacterEditor() {

    document.getElementById("characterName").value =
        characterData.name;

    document.getElementById("hairValue").textContent =
        "Волосы " + characterData.hair;

    document.getElementById("eyesValue").textContent =
        "Глаза " + characterData.eyes;

    document.getElementById("topValue").textContent =
        "Верх " + characterData.top;

    document.getElementById("bottomValue").textContent =
        "Низ " + characterData.bottom;


    updateCharacterPreview();
}


function changeHair(amount) {

    characterData.hair += amount;

    if (characterData.hair < 1)
        characterData.hair = 4;

    if (characterData.hair > 4)
        characterData.hair = 1;

    updateCharacterEditor();
}


function changeEyes(amount) {

    characterData.eyes += amount;

    if (characterData.eyes < 1)
        characterData.eyes = 4;

    if (characterData.eyes > 4)
        characterData.eyes = 1;

    updateCharacterEditor();
}


function changeTop(amount) {

    characterData.top += amount;

    if (characterData.top < 1)
        characterData.top = 4;

    if (characterData.top > 4)
        characterData.top = 1;

    updateCharacterEditor();
}


function changeBottom(amount) {

    characterData.bottom += amount;

    if (characterData.bottom < 1)
        characterData.bottom = 4;

    if (characterData.bottom > 4)
        characterData.bottom = 1;

    updateCharacterEditor();
}

function updateCharacterPreview() {

    const preview =
        document.getElementById("characterPreview");

    const hair =
        characterStyles.hair[
            characterData.hair - 1
        ];

    const eyes =
        characterStyles.eyes[
            characterData.eyes - 1
        ];

    const top =
        characterStyles.top[
            characterData.top - 1
        ];

    const bottom =
        characterStyles.bottom[
            characterData.bottom - 1
        ];


    preview.innerHTML = `
        <div class="preview-character">

            <div class="preview-hair">
                ${hair}
            </div>

            <div class="preview-eyes">
                ${eyes}
            </div>

            <div class="preview-clothes">
                ${top} ${bottom}
            </div>

        </div>
    `;
}



function saveCharacter() {

    const name =
        document.getElementById("characterName").value.trim();

    if (name !== "") {

        characterData.name = name;
    }


    localStorage.setItem(
        "tinyLifeCharacter",
        JSON.stringify(characterData)
    );
    
updateRoomCharacter();

    messageElement.textContent =
        `👤 Персонаж "${characterData.name}" сохранён!`;

    closeCharacterEditor();
}
console.log("TinyLife JS работает!");
window.openCharacterEditor = function () {
    
};
function updateRoomCharacter() {

    const roomCharacter =
        document.getElementById("character");

    if (!roomCharacter) {
        return;
    }


    roomCharacter.innerHTML = `
        <div class="room-character">

            <div>
                ${characterStyles.hair[
                    characterData.hair - 1
                ]}
            </div>

            <div>
                ${characterStyles.eyes[
                    characterData.eyes - 1
                ]}
            </div>

            <div>
                ${characterStyles.top[
                    characterData.top - 1
                ]}
                ${characterStyles.bottom[
                    characterData.bottom - 1
                ]}
            </div>

        </div>
    `;
}
