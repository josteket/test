document.addEventListener('DOMContentLoaded', () => {
    console.log('JavaScript для тренировок загружен и готов к работе.');

    // Инициализация общего количества тренировок на главной странице
    let totalTrainings = parseInt(localStorage.getItem('totalTrainings')) || 0;
    if (document.getElementById('total-trainings')) {
        document.getElementById('total-trainings').textContent = totalTrainings;
    }

    // Элементы страницы
    const trainingButtons = document.querySelectorAll('.training-button');
    const availableTrainings = document.getElementById('available-trainings');
    const totalTrainingsElement = document.getElementById('total-trainings');
    const progressBar = document.querySelector('.progress');
    const boostButton = document.getElementById('boost-button');
    const navButtons = document.querySelectorAll('.nav-button');
    const levelElement = document.getElementById('current-level');
    const circleContainer = document.querySelector('.circle-container');
    const totalTrainingsProfile = document.getElementById('total-trainings-profile');
    const runningSessionsElement = document.getElementById('running-sessions');
    const gymSessionsElement = document.getElementById('gym-sessions');
    const yogaSessionsElement = document.getElementById('yoga-sessions');
    const swimmingSessionsElement = document.getElementById('swimming-sessions');
    const boxingSessionsElement = document.getElementById('boxing-sessions');
    const experienceToNextLevelElement = document.getElementById('experience-to-next-level');

    // Данные
    let trainingsLeft = parseInt(localStorage.getItem('trainingsLeft'));
    if (isNaN(trainingsLeft)) {
        trainingsLeft = 3;
    }
    totalTrainings = parseInt(localStorage.getItem('totalTrainings'));
    if (isNaN(totalTrainings)) {
        totalTrainings = 0;
    }
    let experiencePoints = parseInt(localStorage.getItem('experiencePoints'));
    if (isNaN(experiencePoints)) {
        experiencePoints = 0;
    }
    let trainingSessions = JSON.parse(localStorage.getItem('trainingSessions')) || {
        running: 0,
        gym: 0,
        yoga: 0,
        swimming: 0,
        boxing: 0
    };
    const maxTrainingsPerDay = 3;

    // Уровневая система (количество очков для перехода на следующий уровень)
    const experiencePerLevel = [
        10, // С 1 на 2 уровень
        30, // С 2 на 3 уровень
        80, // С 3 на 4 уровень
        120, // С 4 на 5 уровень
        160, // С 5 на 6 уровень
        200, // С 6 на 7 уровень
        230, // С 7 на 8 уровень
        260, // С 8 на 9 уровень
        5    // С 9 на 10 уровень (оставшиеся очки)
    ];

    // Названия уровней
    const levelNames = [
        'Beginner', 'Candidate Master', 'Master of Sports', 'Elite Athlete',
        'Expert', 'Master', 'Champion', 'Legend',
        'Superhero', 'Olympic Reserve'
    ];

    // Функция определения текущего уровня и прогресса
    function getCurrentLevelAndProgress() {
        let accumulatedPoints = 0;
        for (let i = 0; i < experiencePerLevel.length; i++) {
            if (experiencePoints < accumulatedPoints + experiencePerLevel[i]) {
                return {
                    levelIndex: i,
                    progress: ((experiencePoints - accumulatedPoints) / experiencePerLevel[i]) * 100,
                    pointsToNextLevel: experiencePerLevel[i] - (experiencePoints - accumulatedPoints)
                };
            }
            accumulatedPoints += experiencePerLevel[i];
        }
        return {
            levelIndex: levelNames.length - 1,
            progress: 100,
            pointsToNextLevel: 0
        };
    }

    // Проверка и обновление энергии в полночь
    function resetTrainingsAtMidnight() {
        const lastReset = localStorage.getItem('lastReset');
        const currentDate = new Date().toDateString();

        if (lastReset !== currentDate) {
            trainingsLeft = maxTrainingsPerDay;
            localStorage.setItem('trainingsLeft', trainingsLeft);
            localStorage.setItem('lastReset', currentDate);
            console.log('Энергия сброшена до максимума на новый день');
        }
    }

    // Функция обновления количества тренировок и опыта
    function updateStats() {
        if (availableTrainings) {
            availableTrainings.textContent = `${trainingsLeft}/${maxTrainingsPerDay}`;
        }
        if (totalTrainingsElement) {
            totalTrainingsElement.textContent = totalTrainings;
        }
        if (totalTrainingsProfile) {
            totalTrainingsProfile.textContent = totalTrainings;
        }
        if (runningSessionsElement) {
            runningSessionsElement.textContent = trainingSessions.running;
        }
        if (gymSessionsElement) {
            gymSessionsElement.textContent = trainingSessions.gym;
        }
        if (yogaSessionsElement) {
            yogaSessionsElement.textContent = trainingSessions.yoga;
        }
        if (swimmingSessionsElement) {
            swimmingSessionsElement.textContent = trainingSessions.swimming;
        }
        if (boxingSessionsElement) {
            boxingSessionsElement.textContent = trainingSessions.boxing;
        }
        localStorage.setItem('totalTrainings', totalTrainings);
        localStorage.setItem('experiencePoints', experiencePoints);
        localStorage.setItem('trainingsLeft', trainingsLeft);
        localStorage.setItem('trainingSessions', JSON.stringify(trainingSessions));

        // Обновление уровня и прогресс-бара
        const { levelIndex, progress, pointsToNextLevel } = getCurrentLevelAndProgress();
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            console.log(`Текущий уровень: ${levelNames[levelIndex]}, Прогресс уровня: ${progress}%`);
        }
        if (levelElement) {
            levelElement.textContent = levelNames[levelIndex];
        }
        if (experienceToNextLevelElement) {
            experienceToNextLevelElement.textContent = pointsToNextLevel;
        }
    }

    // Обработчики нажатия на кнопки тренировок
    trainingButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log(`Нажата кнопка тренировки: ${button.dataset.training}`);
            if (trainingsLeft > 0) {
                trainingsLeft -= 1;
                totalTrainings += 1;
                experiencePoints += 1;

                // Обновление тренировочных сессий
                const trainingType = button.dataset.training;
                if (trainingType && trainingSessions[trainingType] !== undefined) {
                    trainingSessions[trainingType] += 1;
                }

                console.log(`Осталось тренировок: ${trainingsLeft}, Общее количество тренировок: ${totalTrainings}, Опыт: ${experiencePoints}`);
                updateStats();
            } else {
                alert('Вы достигли максимального количества тренировок на сегодня!');
                console.log('Попытка тренировки при отсутствии доступных тренировок');
            }
        });
    });

    // Обработчик нажатия на кнопку "BOOST"
    if (boostButton) {
        boostButton.addEventListener('click', () => {
            console.log('Нажата кнопка BOOST');
            // Логика для перехода на страницу улучшений
            window.location.href = 'earn.html';
        });
    }

    // Обработчики кнопок навигации
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log(`Нажата кнопка: ${button.id}`);
            // Здесь можно добавить логику для перехода на другие страницы
        });
    });

    // Анимация пульсирующего свечения вокруг круга
    if (circleContainer) {
        circleContainer.classList.add('pulsating-glow');
    }

    // Инициализация
    resetTrainingsAtMidnight();
    updateStats();
});