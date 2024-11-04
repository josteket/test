document.addEventListener('DOMContentLoaded', () => {
    console.log('Загрузка профиля пользователя.');

    // Получение данных из локального хранилища
    let fitPoints = parseInt(localStorage.getItem('fitPoints')) || 0;
    let workoutStats = JSON.parse(localStorage.getItem('workoutStats')) || {
        running: 0,
        gym: 0,
        yoga: 0
    };
    let achievementStatus = JSON.parse(localStorage.getItem('achievementStatus')) || {
        runner: false,
        gymLover: false,
        yogaMaster: false,
        weeklyWarrior: false,
        hundredPoints: false
    };

    const fitPointsDisplay = document.getElementById('fit-points');
    const userLevelDisplay = document.getElementById('user-level');
    const progressBar = document.getElementById('progress-bar');

    // Названия уровней
    const levelNames = [
        'Новичок', 'Любитель', 'Спортсмен', 'Атлет',
        'Эксперт', 'Мастер', 'Чемпион', 'Легенда',
        'Супергерой', 'Фитнесс Гуру'
    ];

    // Функция для обновления уровня и прогресс-бара
    function updateLevel() {
        const pointsPerYear = 365 * 3 * 10; // Среднее количество за 3 тренировки в день с бонусом в 10
        const pointsPerLevel = pointsPerYear / levelNames.length;
        const levelIndex = Math.min(Math.floor(fitPoints / pointsPerLevel), levelNames.length - 1);
        const nextLevelPoints = (levelIndex + 1) * pointsPerLevel;

        userLevelDisplay.textContent = levelNames[levelIndex];
        
        // Обновление прогресс-бара
        const progressPercentage = ((fitPoints - levelIndex * pointsPerLevel) / pointsPerLevel) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    // Обновление отображения Fit Points и уровня
    fitPointsDisplay.textContent = fitPoints;
    updateLevel();

    // Обновляем статистику тренировок
    document.getElementById('running-stats').textContent = workoutStats.running;
    document.getElementById('gym-stats').textContent = workoutStats.gym;
    document.getElementById('yoga-stats').textContent = workoutStats.yoga;

    // Функция для обновления достижений
    function updateAchievements() {
        if (workoutStats.running >= 10 && !achievementStatus.runner) {
            const achievementElement = document.getElementById('achievement-runner');
            achievementElement.textContent = "Начинающий бегун: выполнено";
            achievementElement.classList.add('completed');
            achievementStatus.runner = true;
        }

        if (workoutStats.gym >= 20 && !achievementStatus.gymLover) {
            const achievementElement = document.getElementById('achievement-gym-lover');
            achievementElement.textContent = "Любитель спорта: выполнено";
            achievementElement.classList.add('completed');
            achievementStatus.gymLover = true;
        }

        if (workoutStats.yoga >= 15 && !achievementStatus.yogaMaster) {
            const achievementElement = document.getElementById('achievement-yoga-master');
            achievementElement.textContent = "Йога-мастер: выполнено";
            achievementElement.classList.add('completed');
            achievementStatus.yogaMaster = true;
        }

        if (fitPoints >= 100 && !achievementStatus.hundredPoints) {
            const achievementElement = document.getElementById('achievement-100points');
            achievementElement.textContent = "100 Fit Points: выполнено";
            achievementElement.classList.add('completed');
            achievementStatus.hundredPoints = true;
        }

        // Сохраняем достижения
        localStorage.setItem('achievementStatus', JSON.stringify(achievementStatus));
    }

    // Обновляем достижения на основе текущих данных
    updateAchievements();
});
