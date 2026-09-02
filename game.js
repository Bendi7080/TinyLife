/* ================================================================
   TinyLife 0.5
   Complete game controller
   ================================================================ */

/*
    ---------------------------------------------------------------
    WHAT THIS FILE HANDLES
    ---------------------------------------------------------------

    1. Player statistics
    2. Real calendar dates
    3. Clock and time progression
    4. Day/night periods
    5. Room object interaction
    6. Character movement
    7. Food / washing / rest / study / work
    8. Inventory
    9. Schedule
    10. Event log
    11. Character editor
    12. Save / load
    13. Autosave
    14. Reset
    15. Keyboard accessibility
    16. Offline-safe localStorage state

    The code is intentionally split into small functions so future
    versions can add shops, school, locations, relationships, quests,
    outfits and minigames without rewriting the entire game.
*/

/* ================================================================
   CONSTANTS
   ================================================================ */

const GAME_VERSION = "0.5";

const STORAGE_KEYS = {
    save: "tinylife.save.v5",
    character: "tinylife.character.v5",
    settings: "tinylife.settings.v5"
};

const DAYS_RU = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота"
];

const MONTHS_RU = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь"
];

const SEASONS = {
    winter: {
        name: "Зима",
        icon: "❄️",
        months: [12, 1, 2]
    },
    spring: {
        name: "Весна",
        icon: "🌱",
        months: [3, 4, 5]
    },
    summer: {
        name: "Лето",
        icon: "☀️",
        months: [6, 7, 8]
    },
    autumn: {
        name: "Осень",
        icon: "🍂",
        months: [9, 10, 11]
    }
};

const TIME_PERIODS = [
    {
        id: "night",
        from: 0,
        to: 6,
        label: "Ночь",
        icon: "🌙"
    },
    {
        id: "morning",
        from: 6,
        to: 12,
        label: "Утро",
        icon: "🌅"
    },
    {
        id: "day",
        from: 12,
        to: 18,
        label: "День",
        icon: "☀️"
    },
    {
        id: "evening",
        from: 18,
        to: 24,
        label: "Вечер",
        icon: "🌆"
    }
];

/* ================================================================
   PLAYER STATE
   ================================================================ */

const defaultPlayer = {
    energy: 80,
    hunger: 70,
    mood: 75,
    money: 50,
    reputation: 50,
    school: 70,
    hygiene: 80,
    actionsToday: 0
};

const player = {
    ...defaultPlayer
};

/* ================================================================
   CALENDAR STATE
   ================================================================ */

const calendar = {
    day: 1,
    month: 9,
    year: 2026
};

const gameTime = {
    hour: 7,
    minute: 0
};

/* ================================================================
   CHARACTER STATE
   ================================================================ */

const defaultCharacter = {
    name: "Новый персонаж",
    style: "heart",
    expression: "happy"
};

const characterData = {
    ...defaultCharacter
};

const characterStyles = {
    heart: {
        name: "Уютный",
        description: "Светлый повседневный образ",
        src: "assets/character_heart.png"
    },

    black: {
        name: "Dark",
        description: "Тёмный городской образ",
        src: "assets/character_black.png"
    },

    pink: {
        name: "Pink",
        description: "Розовый образ",
        src: "assets/character_pink.png"
    }
};

const expressions = {
    happy: {
        name: "Спокойное",
        icon: "🙂"
    },

    cheerful: {
        name: "Весёлое",
        icon: "😊"
    },

    tired: {
        name: "Уставшее",
        icon: "😌"
    },

    focused: {
        name: "Сосредоточенное",
        icon: "🤔"
    }
};

/* ================================================================
   INVENTORY
   ================================================================ */

const defaultInventory = {
    apple: 2,
    water: 1,
    notebook: 1,
    pencil: 2,
    snack: 0,
    flower: 0
};

const inventory = {
    ...defaultInventory
};

const inventoryItems = {
    apple: {
        icon: "🍎",
        name: "Яблоко"
    },

    water: {
        icon: "💧",
        name: "Вода"
    },

    notebook: {
        icon: "📓",
        name: "Блокнот"
    },

    pencil: {
        icon: "✏️",
        name: "Карандаш"
    },

    snack: {
        icon: "🍪",
        name: "Перекус"
    },

    flower: {
        icon: "🌷",
        name: "Цветок"
    }
};

/* ================================================================
   SCHEDULE
   ================================================================ */

const schedule = [
    {
        start: 8,
        end: 13,
        title: "Школа",
        icon: "🎓",
        weekdays: [1, 2, 3, 4, 5]
    },

    {
        start: 14,
        end: 17,
        title: "Работа",
        icon: "💼",
        weekdays: [1, 2, 3, 4, 5]
    },

    {
        start: 18,
        end: 19,
        title: "Свободное время",
        icon: "🌷",
        weekdays: [0, 1, 2, 3, 4, 5, 6]
    }
];

/* ================================================================
   ROOM POSITIONS
   ================================================================ */

const positions = {
    bed: {
        left: "23%",
        top: "72%"
    },

    computer: {
        left: "70%",
        top: "67%"
    },

    plant: {
        left: "82%",
        top: "27%"
    },

    window: {
        left: "20%",
        top: "31%"
    },

    door: {
        left: "88%",
        top: "77%"
    },

    character: {
        left: "54%",
        top: "51%"
    }
};

/* ================================================================
   DOM HELPERS
   ================================================================ */

const $ = (id) => document.getElementById(id);

const dom = {
    clock: $("clock"),
    day: $("day"),
    season: $("season"),
    timePeriod: $("timePeriod"),

    energy: $("energy"),
    hunger: $("hunger"),
    mood: $("mood"),
    money: $("money"),

    school: $("school"),
    reputation: $("reputation"),
    schoolBar: $("schoolBar"),
    reputationBar: $("reputationBar"),

    locationName: $("locationName"),
    locationStatus: $("locationStatus"),

    room: $("room"),
    roomScene: $("roomScene"),
    character: $("character"),

    message: $("message"),
    interactionHint: $("interactionHint"),

    actionCount: $("actionCount"),

    profileName: $("profileName"),
    profileMood: $("profileMood"),
    miniAvatar: $("miniAvatar"),

    inventoryGrid: $("inventoryGrid"),
    inventoryCount: $("inventoryCount"),

    scheduleList: $("scheduleList"),
    eventLog: $("eventLog"),

    saveLight: $("saveLight"),
    saveText: $("saveText"),

    characterEditor: $("characterEditor"),
    characterPreview: $("characterPreview"),
    characterName: $("characterName"),
    previewName: $("previewName"),
    previewStyle: $("previewStyle"),
    saveState: $("saveState"),

    styleChoices: $("styleChoices"),
    expressionChoices: $("expressionChoices"),

    confirmModal: $("confirmModal")
};

/* ================================================================
   UTILITY FUNCTIONS
   ================================================================ */

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function clampPlayer() {
    player.energy = clamp(player.energy, 0, 100);
    player.hunger = clamp(player.hunger, 0, 100);
    player.mood = clamp(player.mood, 0, 100);
    player.reputation = clamp(player.reputation, 0, 100);
    player.school = clamp(player.school, 0, 100);
    player.hygiene = clamp(player.hygiene, 0, 100);
    player.money = Math.max(0, player.money);
    player.actionsToday = Math.max(0, player.actionsToday);
}

function pad(number) {
    return String(number).padStart(2, "0");
}

function getDateObject() {
    return new Date(
        calendar.year,
        calendar.month - 1,
        calendar.day
    );
}

function getWeekdayIndex() {
    return getDateObject().getDay();
}

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function getSeason() {
    const month = calendar.month;

    for (const season of Object.values(SEASONS)) {
        if (season.months.includes(month)) {
            return season;
        }
    }

    return SEASONS.autumn;
}

function getTimePeriod() {
    for (const period of TIME_PERIODS) {
        if (
            gameTime.hour >= period.from &&
            gameTime.hour < period.to
        ) {
            return period;
        }
    }

    return TIME_PERIODS[0];
}

function currentMinutes() {
    return gameTime.hour * 60 + gameTime.minute;
}

function formatClock() {
    return `${pad(gameTime.hour)}:${pad(gameTime.minute)}`;
}

function isWeekend() {
    const weekday = getWeekdayIndex();

    return weekday === 0 || weekday === 6;
}

/* ================================================================
   PLAYER MOOD TEXT
   ================================================================ */

function getMoodDescription() {
    const average =
        (
            player.energy +
            player.hunger +
            player.mood +
            player.hygiene
        ) / 4;

    if (average >= 85) {
        return "Сегодня всё отлично ✨";
    }

    if (average >= 70) {
        return "Сегодня всё спокойно.";
    }

    if (average >= 50) {
        return "Можно немного отдохнуть.";
    }

    if (average >= 30) {
        return "Похоже, нужен хороший перерыв.";
    }

    return "Сейчас лучше заняться базовыми потребностями.";
}

/* ================================================================
   DATE / TIME UI
   ================================================================ */

function updateDateAndTime() {
    const weekday = DAYS_RU[getWeekdayIndex()];
    const season = getSeason();
    const period = getTimePeriod();

    dom.clock.textContent = formatClock();

    dom.day.textContent =
        `${weekday}, ${calendar.day}.${pad(calendar.month)}.${calendar.year}`;

    dom.season.textContent =
        `${season.icon} ${season.name}`;

    dom.timePeriod.textContent =
        `${period.icon} ${period.label}`;
}

/* ================================================================
   STAT UI
   ================================================================ */

function updateStatsUI() {
    dom.energy.textContent = Math.round(player.energy);
    dom.hunger.textContent = Math.round(player.hunger);
    dom.mood.textContent = Math.round(player.mood);
    dom.money.textContent = Math.round(player.money);

    dom.school.textContent = Math.round(player.school);
    dom.reputation.textContent = Math.round(player.reputation);

    dom.schoolBar.style.width = `${player.school}%`;
    dom.reputationBar.style.width = `${player.reputation}%`;

    dom.actionCount.textContent =
        `${player.actionsToday} ${pluralizeAction(player.actionsToday)}`;

    dom.profileMood.textContent = getMoodDescription();
}

function pluralizeAction(number) {
    const n = Math.abs(number) % 100;
    const last = n % 10;

    if (n >= 11 && n <= 19) {
        return "действий";
    }

    if (last === 1) {
        return "действие";
    }

    if (last >= 2 && last <= 4) {
        return "действия";
    }

    return "действий";
}

/* ================================================================
   CHARACTER RENDER
   ================================================================ */

function getCharacterSource() {
    return (
        characterStyles[characterData.style]?.src ||
        characterStyles.heart.src
    );
}

function renderRoomCharacter() {
    const src = getCharacterSource();

    dom.character.innerHTML = `
        <img
            src="${src}"
            alt="${escapeHtml(characterData.name)}"
            draggable="false"
        >
    `;
}

function renderMiniAvatar() {
    const src = getCharacterSource();

    dom.miniAvatar.innerHTML = `
        <img
            src="${src}"
            alt=""
            draggable="false"
        >
    `;
}

function updateCharacterUI() {
    dom.profileName.textContent =
        characterData.name || "Новый персонаж";

    renderRoomCharacter();
    renderMiniAvatar();
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* ================================================================
   CHARACTER EDITOR
   ================================================================ */

function openCharacterEditor() {
    dom.characterEditor.classList.add("active");
    dom.characterEditor.setAttribute("aria-hidden", "false");

    dom.characterName.value =
        characterData.name;

    dom.saveState.textContent =
        "Не сохранено";

    renderStyleChoices();
    renderExpressionChoices();
    updateCharacterPreview();

    setTimeout(() => {
        dom.characterName.focus();
    }, 50);
}

function closeCharacterEditor() {
    dom.characterEditor.classList.remove("active");
    dom.characterEditor.setAttribute("aria-hidden", "true");
}

function renderStyleChoices() {
    dom.styleChoices.innerHTML = "";

    Object.entries(characterStyles).forEach(
        ([key, style]) => {
            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "style-choice" +
                (
                    characterData.style === key
                        ? " selected"
                        : ""
                );

            button.innerHTML = `
                <img
                    src="${style.src}"
                    alt=""
                    draggable="false"
                >
                <b>${style.name}</b>
            `;

            button.addEventListener(
                "click",
                () => {
                    characterData.style = key;

                    renderStyleChoices();
                    updateCharacterPreview();
                    markCharacterDirty();
                }
            );

            dom.styleChoices.appendChild(button);
        }
    );
}

function renderExpressionChoices() {
    dom.expressionChoices.innerHTML = "";

    Object.entries(expressions).forEach(
        ([key, expression]) => {
            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "expression-choice" +
                (
                    characterData.expression === key
                        ? " selected"
                        : ""
                );

            button.textContent =
                expression.icon;

            button.title =
                expression.name;

            button.setAttribute(
                "aria-label",
                expression.name
            );

            button.addEventListener(
                "click",
                () => {
                    characterData.expression = key;

                    renderExpressionChoices();
                    markCharacterDirty();
                }
            );

            dom.expressionChoices.appendChild(button);
        }
    );
}

function updateCharacterPreview() {
    const src = getCharacterSource();
    const style = characterStyles[characterData.style];

    dom.characterPreview.innerHTML = `
        <img
            src="${src}"
            alt=""
            draggable="false"
        >
    `;

    dom.previewName.textContent =
        characterData.name || "Новый персонаж";

    dom.previewStyle.textContent =
        style?.name || "Уютный";
}

function markCharacterDirty() {
    dom.saveState.textContent =
        "Есть изменения";

    updateCharacterPreview();
}

function saveCharacter() {
    const typedName =
        dom.characterName.value.trim();

    characterData.name =
        typedName || "Новый персонаж";

    localStorage.setItem(
        STORAGE_KEYS.character,
        JSON.stringify(characterData)
    );

    updateCharacterUI();

    dom.saveState.textContent =
        "Сохранено ✓";

    showMessage(
        `👤 Персонаж "${characterData.name}" сохранён!`
    );

    addLog(
        "👤",
        `Персонаж "${characterData.name}" обновлён.`
    );

    setTimeout(
        closeCharacterEditor,
        400
    );
}

/* ================================================================
   MOVEMENT
   ================================================================ */

function moveCharacter(object) {
    const target =
        positions[object];

    if (!target) {
        return;
    }

    dom.character.classList.add("moving");

    dom.character.style.left =
        target.left;

    dom.character.style.top =
        target.top;

    window.clearTimeout(
        moveCharacter.timeout
    );

    moveCharacter.timeout =
        window.setTimeout(
            () => {
                dom.character.classList.remove(
                    "moving"
                );
            },
            760
        );
}

function resetCharacterPosition() {
    const target = positions.character;

    dom.character.style.left =
        target.left;

    dom.character.style.top =
        target.top;
}

/* ================================================================
   MESSAGE / LOG
   ================================================================ */

let messageTimer = null;

function showMessage(text) {
    dom.message.textContent = text;

    dom.message.animate(
        [
            { opacity: .55, transform: "translateX(-50%) translateY(4px)" },
            { opacity: 1, transform: "translateX(-50%) translateY(0)" }
        ],
        {
            duration: 180,
            easing: "ease-out"
        }
    );

    window.clearTimeout(messageTimer);

    messageTimer = window.setTimeout(
        () => {
            dom.message.textContent =
                "🌷 Нажми на предмет или выбери действие.";
        },
        5000
    );
}

function addLog(icon, text) {
    const entry =
        document.createElement("div");

    entry.className =
        "log-entry";

    entry.innerHTML = `
        <span class="log-icon">${icon}</span>
        <span>${escapeHtml(text)}</span>
        <span class="log-time">${formatClock()}</span>
    `;

    dom.eventLog.prepend(entry);

    while (dom.eventLog.children.length > 12) {
        dom.eventLog.lastElementChild.remove();
    }
}

function clearLog() {
    dom.eventLog.innerHTML = "";

    addLog(
        "🧹",
        "Журнал очищен."
    );
}

/* ================================================================
   TIME PROGRESSION
   ================================================================ */

function addTime(minutes, options = {}) {
    const safeMinutes =
        Math.max(0, Math.round(minutes));

    if (safeMinutes === 0) {
        return;
    }

    let remaining =
        safeMinutes;

    let crossedDay = false;

    while (remaining > 0) {
        const untilMidnight =
            1440 - currentMinutes();

        const step =
            Math.min(remaining, untilMidnight);

        gameTime.minute += step;

        while (gameTime.minute >= 60) {
            gameTime.minute -= 60;
            gameTime.hour++;
        }

        remaining -= step;

        if (gameTime.hour >= 24) {
            gameTime.hour = 0;
            startNewDay();
            crossedDay = true;
        }
    }

    if (!options.skipPassive) {
        applyPassiveNeeds(safeMinutes);
    }

    updateAllUI();

    return crossedDay;
}

function startNewDay() {
    calendar.day++;

    if (
        calendar.day >
        getDaysInMonth(
            calendar.year,
            calendar.month
        )
    ) {
        calendar.day = 1;
        calendar.month++;

        if (calendar.month > 12) {
            calendar.month = 1;
            calendar.year++;
        }
    }

    player.actionsToday = 0;

    player.energy += 25;
    player.hunger -= 15;
    player.mood += 4;
    player.hygiene -= 8;

    clampPlayer();

    showMessage(
        `🌅 Новый день! ${DAYS_RU[getWeekdayIndex()]}, ${calendar.day}.${pad(calendar.month)}.`
    );

    addLog(
        "🌅",
        "Наступил новый день."
    );
}

function applyPassiveNeeds(minutes) {
    const hours =
        minutes / 60;

    player.energy -=
        hours * .35;

    player.hunger -=
        hours * .22;

    player.hygiene -=
        hours * .15;

    if (player.hunger < 25) {
        player.mood -=
            hours * .45;
    }

    if (player.energy < 20) {
        player.mood -=
            hours * .35;
    }

    clampPlayer();
}

/* ================================================================
   ROOM INTERACTIONS
   ================================================================ */

function interact(object) {
    moveCharacter(object);

    switch (object) {
        case "bed":
            interactBed();
            break;

        case "computer":
            interactComputer();
            break;

        case "plant":
            interactPlant();
            break;

        case "window":
            interactWindow();
            break;

        case "door":
            interactDoor();
            break;

        default:
            showMessage(
                "❔ С этим пока нельзя взаимодействовать."
            );
    }
}

function interactBed() {
    addTime(120);

    player.energy += 35;
    player.hunger -= 10;
    player.mood += 5;
    player.hygiene -= 3;
    player.actionsToday++;

    clampPlayer();

    showMessage(
        "💤 Ты поспал два часа."
    );

    addLog(
        "💤",
        "Сон: +энергия, немного меньше голода."
    );
}

function interactComputer() {
    if (player.energy < 10) {
        showMessage(
            "🥱 Слишком мало энергии для компьютера."
        );
        return;
    }

    addTime(30);

    player.energy -= 5;
    player.mood += 8;
    player.actionsToday++;

    clampPlayer();

    showMessage(
        "🖥️ Ты посидел за компьютером."
    );

    addLog(
        "🖥️",
        "Полчаса за компьютером."
    );
}

function interactPlant() {
    addTime(5);

    player.mood += 4;
    player.actionsToday++;

    inventory.flower += 1;

    clampPlayer();

    showMessage(
        "🪴 Растение выглядит довольным. +1 цветок"
    );

    addLog(
        "🪴",
        "Ты полил растение и получил цветок."
    );

    renderInventory();
}

function interactWindow() {
    addTime(5);

    player.mood += 3;
    player.actionsToday++;

    clampPlayer();

    const season =
        getSeason();

    showMessage(
        `${season.icon} Ты немного посмотрел в окно.`
    );

    addLog(
        "🪟",
        "Небольшой перерыв у окна."
    );
}

function interactDoor() {
    addTime(10);

    player.mood += 1;
    player.actionsToday++;

    clampPlayer();

    showMessage(
        "🚪 Ты подошёл к двери. Выйти можно будет в следующем обновлении."
    );

    addLog(
        "🚪",
        "Ты подошёл к двери."
    );
}

/* ================================================================
   QUICK ACTIONS
   ================================================================ */

function performAction(action) {
    switch (action) {
        case "eat":
            actionEat();
            break;

        case "wash":
            actionWash();
            break;

        case "rest":
            actionRest();
            break;

        case "study":
            actionStudy();
            break;

        case "work":
            actionWork();
            break;

        case "save":
            saveGame();
            break;

        default:
            showMessage(
                "❔ Неизвестное действие."
            );
    }
}

function actionEat() {
    if (player.money < 5) {
        showMessage(
            "💶 Недостаточно денег."
        );
        return;
    }

    addTime(25);

    player.money -= 5;
    player.hunger += 30;
    player.mood += 5;
    player.actionsToday++;

    clampPlayer();

    showMessage(
        "🍳 Ты поел. -5€"
    );

    addLog(
        "🍳",
        "Поел в комнате."
    );
}

function actionWash() {
    addTime(15);

    player.energy -= 4;
    player.hygiene += 30;
    player.mood += 10;
    player.actionsToday++;

    clampPlayer();

    showMessage(
        "🚿 Ты привёл себя в порядок."
    );

    addLog(
        "🚿",
        "Умылся и освежился."
    );
}

function actionRest() {
    addTime(30);

    player.energy += 8;
    player.hunger -= 3;
    player.mood += 5;
    player.actionsToday++;

    clampPlayer();

    showMessage(
        "🪑 Ты немного отдохнул."
    );

    addLog(
        "🪑",
        "Небольшой отдых."
    );
}

function actionStudy() {
    if (player.energy < 12) {
        showMessage(
            "📚 Для учёбы нужно хотя бы 12 энергии."
        );
        return;
    }

    addTime(45);

    player.energy -= 10;
    player.hunger -= 5;
    player.mood -= 2;
    player.school += 8;
    player.reputation += 1;
    player.actionsToday++;

    clampPlayer();

    showMessage(
        "📚 Ты позанимался. Школа +8"
    );

    addLog(
        "📚",
        "Учёба: +8 к школьному показателю."
    );
}

function actionWork() {
    const weekday =
        getWeekdayIndex();

    if (
        weekday === 0 ||
        weekday === 6
    ) {
        showMessage(
            "🌿 Сегодня выходной."
        );
        return;
    }

    const now =
        currentMinutes();

    const start =
        14 * 60;

    const end =
        17 * 60;

    if (now < start) {
        showMessage(
            "⏰ Смена начинается в 14:00."
        );
        return;
    }

    if (now >= end) {
        showMessage(
            "❌ Смена уже закончилась."
        );
        return;
    }

    const remaining =
        end - now;

    const shift =
        Math.min(
            180,
            remaining
        );

    addTime(
        shift,
        { skipPassive: true }
    );

    player.money += 30;
    player.energy -= 15;
    player.mood -= 5;
    player.reputation += 2;
    player.actionsToday++;

    clampPlayer();

    showMessage(
        "💼 Смена закончена! +30€"
    );

    addLog(
        "💼",
        "Ты заработал 30€."
    );
}

/* ================================================================
   INVENTORY
   ================================================================ */

function getInventoryTotal() {
    return Object.values(inventory)
        .reduce(
            (sum, value) =>
                sum + Math.max(0, value),
            0
        );
}

function renderInventory() {
    dom.inventoryGrid.innerHTML = "";

    Object.entries(inventoryItems)
        .forEach(
            ([key, item]) => {
                const count =
                    inventory[key] || 0;

                const slot =
                    document.createElement("div");

                slot.className =
                    "inventory-slot";

                slot.title =
                    `${item.name}: ${count}`;

                slot.innerHTML = `
                    <span class="item-icon">
                        ${item.icon}
                    </span>
                    <span class="item-count">
                        ${count}
                    </span>
                `;

                dom.inventoryGrid.appendChild(slot);
            }
        );

    dom.inventoryCount.textContent =
        `${getInventoryTotal()}/12`;
}

/* ================================================================
   SCHEDULE
   ================================================================ */

function renderSchedule() {
    const weekday =
        getWeekdayIndex();

    dom.scheduleList.innerHTML = "";

    const today =
        schedule.filter(
            item =>
                item.weekdays.includes(
                    weekday
                )
        );

    if (today.length === 0) {
        dom.scheduleList.innerHTML = `
            <div class="schedule-item">
                <span class="schedule-time">—</span>
                <span class="schedule-name">Свободный день</span>
                <span class="schedule-state">🌿</span>
            </div>
        `;

        return;
    }

    const now =
        currentMinutes();

    today.forEach(item => {
        const start =
            item.start * 60;

        const end =
            item.end * 60;

        let state =
            "скоро";

        if (now >= end) {
            state = "готово";
        } else if (now >= start) {
            state = "сейчас";
        }

        const element =
            document.createElement("div");

        element.className =
            "schedule-item" +
            (
                state === "сейчас"
                    ? " active"
                    : ""
            );

        element.innerHTML = `
            <span class="schedule-time">
                ${pad(item.start)}:00
            </span>

            <span class="schedule-name">
                ${item.icon} ${item.title}
            </span>

            <span class="schedule-state">
                ${state}
            </span>
        `;

        dom.scheduleList.appendChild(
            element
        );
    });
}

/* ================================================================
   SAVE SYSTEM
   ================================================================ */

function buildSaveObject() {
    return {
        version: GAME_VERSION,

        player: {
            ...player
        },

        calendar: {
            ...calendar
        },

        gameTime: {
            ...gameTime
        },

        characterData: {
            ...characterData
        },

        inventory: {
            ...inventory
        },

        eventLog: dom.eventLog.innerHTML,

        savedAt:
            new Date().toISOString()
    };
}

function saveGame() {
    try {
        const save =
            buildSaveObject();

        localStorage.setItem(
            STORAGE_KEYS.save,
            JSON.stringify(save)
        );

        localStorage.setItem(
            STORAGE_KEYS.character,
            JSON.stringify(characterData)
        );

        setSaveIndicator(
            true,
            "Сохранено"
        );

        showMessage(
            "💾 Игра сохранена!"
        );

        addLog(
            "💾",
            "Игра сохранена."
        );
    } catch (error) {
        console.error(
            "TinyLife save error:",
            error
        );

        setSaveIndicator(
            false,
            "Ошибка сохранения"
        );

        showMessage(
            "⚠️ Не удалось сохранить игру."
        );
    }
}

function loadGame() {
    loadCharacter();
    loadMainSave();

    clampPlayer();
}

function loadCharacter() {
    const raw =
        localStorage.getItem(
            STORAGE_KEYS.character
        );

    if (!raw) {
        return;
    }

    try {
        const saved =
            JSON.parse(raw);

        Object.assign(
            characterData,
            defaultCharacter,
            saved
        );
    } catch (error) {
        console.warn(
            "Character save could not be read.",
            error
        );
    }
}

function loadMainSave() {
    const raw =
        localStorage.getItem(
            STORAGE_KEYS.save
        );

    if (!raw) {
        return;
    }

    try {
        const saved =
            JSON.parse(raw);

        if (saved.player) {
            Object.assign(
                player,
                defaultPlayer,
                saved.player
            );
        }

        if (saved.calendar) {
            Object.assign(
                calendar,
                saved.calendar
            );
        }

        if (saved.gameTime) {
            Object.assign(
                gameTime,
                saved.gameTime
            );
        }

        if (saved.inventory) {
            Object.assign(
                inventory,
                defaultInventory,
                saved.inventory
            );
        }

        if (saved.eventLog) {
            dom.eventLog.innerHTML =
                saved.eventLog;
        }

        setSaveIndicator(
            true,
            "Сохранение загружено"
        );
    } catch (error) {
        console.warn(
            "Game save could not be read.",
            error
        );

        setSaveIndicator(
            false,
            "Сохранение повреждено"
        );
    }
}

function setSaveIndicator(
    success,
    text
) {
    dom.saveText.textContent =
        text;

    dom.saveLight.style.background =
        success
            ? "var(--success)"
            : "var(--danger)";
}

/* ================================================================
   AUTOSAVE
   ================================================================ */

let autosaveTimer = null;

function startAutosave() {
    window.clearInterval(
        autosaveTimer
    );

    autosaveTimer =
        window.setInterval(
            () => {
                silentSave();
            },
            30000
        );
}

function silentSave() {
    try {
        localStorage.setItem(
            STORAGE_KEYS.save,
            JSON.stringify(
                buildSaveObject()
            )
        );

        localStorage.setItem(
            STORAGE_KEYS.character,
            JSON.stringify(
                characterData
            )
        );

        setSaveIndicator(
            true,
            "Автосохранение выполнено"
        );
    } catch (error) {
        console.warn(
            "Autosave failed.",
            error
        );
    }
}

/* ================================================================
   RESET
   ================================================================ */

function openResetConfirmation() {
    dom.confirmModal.classList.add(
        "active"
    );

    dom.confirmModal.setAttribute(
        "aria-hidden",
        "false"
    );
}

function closeResetConfirmation() {
    dom.confirmModal.classList.remove(
        "active"
    );

    dom.confirmModal.setAttribute(
        "aria-hidden",
        "true"
    );
}

function resetGame() {
    localStorage.removeItem(
        STORAGE_KEYS.save
    );

    localStorage.removeItem(
        STORAGE_KEYS.character
    );

    Object.assign(
        player,
        defaultPlayer
    );

    Object.assign(
        calendar,
        {
            day: 1,
            month: 9,
            year: 2026
        }
    );

    Object.assign(
        gameTime,
        {
            hour: 7,
            minute: 0
        }
    );

    Object.assign(
        characterData,
        defaultCharacter
    );

    Object.assign(
        inventory,
        defaultInventory
    );

    dom.eventLog.innerHTML = "";

    resetCharacterPosition();

    updateAllUI();

    addLog(
        "🌷",
        "Новая игра начата."
    );

    showMessage(
        "🌷 TinyLife начинается заново!"
    );

    setSaveIndicator(
        false,
        "Новый прогресс"
    );

    closeResetConfirmation();
}

/* ================================================================
   FAST-FORWARD TO MORNING
   ================================================================ */

function skipToMorning() {
    const now =
        currentMinutes();

    let target =
        7 * 60;

    if (now < target) {
        addTime(
            target - now
        );
        return;
    }

    const minutes =
        (1440 - now) + target;

    addTime(minutes);
}

/* ================================================================
   FULL UI UPDATE
   ================================================================ */

function updateAllUI() {
    updateDateAndTime();
    updateStatsUI();
    updateCharacterUI();
    renderInventory();
    renderSchedule();
}

/* ================================================================
   EVENT LISTENERS
   ================================================================ */

function setupActionButtons() {
    document
        .querySelectorAll(
            ".action-card[data-action]"
        )
        .forEach(
            button => {
                button.addEventListener(
                    "click",
                    () => {
                        performAction(
                            button.dataset.action
                        );
                    }
                );
            }
        );
}

function setupRoomObjects() {
    document
        .querySelectorAll(
            ".scene-object[data-object]"
        )
        .forEach(
            object => {
                object.addEventListener(
                    "click",
                    () => {
                        interact(
                            object.dataset.object
                        );
                    }
                );

                object.addEventListener(
                    "keydown",
                    event => {
                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {
                            event.preventDefault();

                            interact(
                                object.dataset.object
                            );
                        }
                    }
                );
            }
        );
}

function setupCharacterClick() {
    dom.character.addEventListener(
        "click",
        openCharacterEditor
    );

    dom.character.addEventListener(
        "keydown",
        event => {
            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();

                openCharacterEditor();
            }
        }
    );
}

function setupEditor() {
    $("characterButton")
        .addEventListener(
            "click",
            openCharacterEditor
        );

    $("closeEditor")
        .addEventListener(
            "click",
            closeCharacterEditor
        );

    $("saveCharacterButton")
        .addEventListener(
            "click",
            saveCharacter
        );

    dom.characterName
        .addEventListener(
            "input",
            () => {
                characterData.name =
                    dom.characterName.value
                        .trim() ||
                    "Новый персонаж";

                markCharacterDirty();
            }
        );

    dom.characterEditor
        .addEventListener(
            "click",
            event => {
                if (
                    event.target ===
                    dom.characterEditor
                ) {
                    closeCharacterEditor();
                }
            }
        );
}

function setupSystemButtons() {
    $("saveGameButton")?.addEventListener(
        "click",
        saveGame
    );

    $("clearLogButton")?.addEventListener(
        "click",
        clearLog
    );

    $("newDayButton")?.addEventListener(
        "click",
        skipToMorning
    );

    $("resetButton")?.addEventListener(
        "click",
        openResetConfirmation
    );

    $("cancelReset")?.addEventListener(
        "click",
        closeResetConfirmation
    );

    $("confirmReset")?.addEventListener(
        "click",
        resetGame
    );

    dom.confirmModal.addEventListener(
        "click",
        event => {
            if (
                event.target ===
                dom.confirmModal
            ) {
                closeResetConfirmation();
            }
        }
    );
}

function setupKeyboardShortcuts() {
    document.addEventListener(
        "keydown",
        event => {
            if (
                event.key === "Escape"
            ) {
                if (
                    dom.characterEditor
                        .classList
                        .contains("active")
                ) {
                    closeCharacterEditor();
                    return;
                }

                if (
                    dom.confirmModal
                        .classList
                        .contains("active")
                ) {
                    closeResetConfirmation();
                }
            }
        }
    );
}

/* ================================================================
   AUTOMATIC WORLD TIME
   ================================================================ */

function startWorldClock() {
    window.setInterval(
        () => {
            /*
                5 in-game minutes pass every 10 real seconds.
                This is deliberately slow enough to play on iPad
                without the whole day disappearing instantly.
            */
            addTime(5);
        },
        10000
    );
}

/* ================================================================
   STARTUP
   ================================================================ */

function bootGame() {
    loadGame();

    clampPlayer();

    setupActionButtons();
    setupRoomObjects();
    setupCharacterClick();
    setupEditor();
    setupSystemButtons();
    setupKeyboardShortcuts();

    updateAllUI();

    if (!dom.eventLog.children.length) {
        addLog(
            "🌷",
            `TinyLife ${GAME_VERSION} запущен.`
        );

        addLog(
            "👤",
            `Персонаж: ${characterData.name}.`
        );
    }

    showMessage(
        `🌷 Добро пожаловать в TinyLife ${GAME_VERSION}!`
    );

    startAutosave();
    startWorldClock();
}

bootGame();

/* ================================================================
   DEBUG API
   ================================================================

   These helpers are intentionally exposed for development.
   They make testing future versions easier from the browser console.
*/

window.TinyLife = {
    version: GAME_VERSION,

    player,
    calendar,
    gameTime,
    characterData,
    inventory,

    save: saveGame,
    load: loadGame,
    reset: resetGame,

    addTime,
    interact,
    performAction,

    update: updateAllUI
};
