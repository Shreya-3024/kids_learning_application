
const quizData = {
    english: {
        title: "📚 English Quiz",
        icon: "📖",
        questions: [
            {
                question: "What is the plural of 'child'?",
                options: ["childs", "children", "childrens", "child"],
                correct: 1,
                funFact: "Did you know? 'Children' is one of the few English words with an -en plural!"
            },
            {
                question: "Which word is a synonym for 'happy'?",
                options: ["sad", "angry", "joyful", "tired"],
                correct: 2,
                emoji: "😊"
            },
            {
            "question": "Which of these is a preposition?",
            "options": ["Run", "Under", "Happy", "Quickly"],
            "correct": 1,
            "funFact": "Prepositions show relationships between words (e.g., 'under the table')."
        },
        {
            "question": "What is the past tense of 'go'?",
            "options": ["Gone", "Went", "Goed", "Going"],
            "correct": 1,
            "emoji": "⏳"
        }
            // Add more questions...
        ]
    },
      math: {
                title: "🔢 Math Quiz",
                icon: "➕",
                questions: [
                    {
                        question: "What is 15 + 27?",
                        options: ["41", "42", "43", "44"],
                        correct: 1,
                        funFact: "Tip: You can break this down to (10 + 20) + (5 + 7) = 30 + 12 = 42"
                    },
                    {
                        question: "What is 8 × 9?",
                        options: ["71", "72", "73", "74"],
                        correct: 1,
                        funFact: "Remember your multiplication tables! 8 × 9 is 72"
                    },
                    {
                        question: "What is 100 ÷ 4?",
                        options: ["20", "25", "30", "35"],
                        correct: 1,
                        funFact: "Division is the opposite of multiplication. 25 × 4 = 100"
                    },
                    {
            "question": "What is 12 × 5?",
            "options": ["50", "55", "60", "65"],
            "correct": 2,
            "funFact": "12 × 5 is the same as (10 × 5) + (2 × 5) = 50 + 10 = 60."
        },
        {
            "question": "If x + 7 = 15, what is x?",
            "options": ["6", "7", "8", "9"],
            "correct": 2,
            "funFact": "Subtract 7 from both sides to solve for x: x = 15 - 7 = 8."
        },
        {
            "question": "What is the area of a square with side length 4 cm?",
            "options": ["8 cm²", "12 cm²", "16 cm²", "20 cm²"],
            "correct": 2,
            "funFact": "Area of a square = side × side = 4 × 4 = 16 cm²."
        }
    ]
},       
            
            hindi: {
                title: "📖 Hindi Quiz",
                icon: "🪔",
                questions: [
                    {
                        question: "'बच्चे' का एकवचन क्या है?",
                        options: ["बच्चा", "बच्चों", "बच्चे", "बच्ची"],
                        correct: 0,
                        funFact: "हिंदी में एकवचन (singular) और बहुवचन (plural) का प्रयोग अंग्रेजी की तरह ही होता है"
                    },
                    {
                        question: "'फूल' का पर्यायवाची शब्द है?",
                        options: ["पत्ता", "कली", "पुष्प", "डाली"],
                        correct: 2,
                        funFact: "पर्यायवाची शब्द वे शब्द होते हैं जिनके अर्थ समान होते हैं"
                    }
                ]
            
        },

    "title": "🌍 General Knowledge Quiz",
    "icon": "🧠",
    "questions": [
        {
            "question": "Which planet is known as the 'Red Planet'?",
            "options": ["Venus", "Mars", "Jupiter", "Saturn"],
            "correct": 1,
            "funFact": "Mars appears red due to iron oxide (rust) on its surface."
        },
        {
            "question": "Who painted the Mona Lisa?",
            "options": ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
            "correct": 2,
            "emoji": "🎨"
        },
        {
            "question": "What is the capital of Japan?",
            "options": ["Beijing", "Seoul", "Tokyo", "Bangkok"],
            "correct": 2,
            "funFact": "Tokyo is one of the most populous cities in the world!"
        }
    ]

    
};

// Global variables
let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = -1;
let answered = false;
let timer;
let timeLeft = 15; // 15 seconds per question
let streak = 0; // Track correct answer streak

// Sound effects
const sounds = {
    correct: new Audio('sounds/correct.mp3'),
    wrong: new Audio('sounds/wrong.mp3'),
    applause: new Audio('sounds/applause.mp3'),
    tick: new Audio('sounds/tick.mp3')
};

// Initialize sounds
Object.values(sounds).forEach(sound => sound.volume = 0.3);

// Quiz functions - ENHANCED
function startQuiz(subject) {
    currentQuiz = quizData[subject];
    currentQuestionIndex = 0;
    score = 0;
    streak = 0;
    
    // Hide home screen, show quiz screen
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('quiz-screen').style.display = 'block';
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('drawing-screen').classList.add('hidden');
    
    // Set quiz title with icon
    document.getElementById('quiz-title').innerHTML = `
        ${currentQuiz.icon} ${currentQuiz.title} ${currentQuiz.icon}
    `;
    
    // Add mascot to quiz header
    const header = document.querySelector('.quiz-header');
    header.innerHTML += `<div class="quiz-mascot">${getRandomMascot()}</div>`;
    
    // Load first question
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timer);
    
    if (currentQuestionIndex >= currentQuiz.questions.length) {
        showResults();
        return;
    }

    const question = currentQuiz.questions[currentQuestionIndex];
    selectedOption = -1;
    answered = false;
    timeLeft = 15;

    // Update displays
    document.getElementById('question-counter').textContent = 
        `${currentQuestionIndex + 1}/${currentQuiz.questions.length}`;
    document.getElementById('score-counter').innerHTML = `
        Score: ${score} <span class="streak">${streak > 0 ? '🔥 ' + streak + ' streak!' : ''}</span>
    `;
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';

    // Display question with possible emoji
    document.getElementById('question').innerHTML = question.question + 
        (question.emoji ? ' ' + question.emoji : '');

    // Display options
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.innerHTML = option;
        optionElement.onclick = () => selectOption(index);
        optionsContainer.appendChild(optionElement);
    });

    // Start timer
    startTimer();
    // Disable next button
    document.getElementById('next-btn').disabled = true;
}

function startTimer() {
    updateTimerDisplay();
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 5) {
            sounds.tick.play();
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timeUp();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.innerHTML = `⏱️ ${timeLeft}s`;
        timerElement.style.color = timeLeft <= 5 ? '#e74c3c' : '#2c3e50';
        timerElement.style.fontWeight = timeLeft <= 5 ? 'bold' : 'normal';
    }
}

function timeUp() {
    answered = true;
    const question = currentQuiz.questions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    
    // Show correct answer
    options[question.correct].classList.add('correct');
    
    // Disable all options
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Show time up message
    const questionElement = document.getElementById('question');
    questionElement.textContent = question.question + " (Time's up! ⏰)";
    
    // Enable next button
    document.getElementById('next-btn').disabled = false;
    streak = 0; // Reset streak
}

function selectOption(index) {
    if (answered) return;

    selectedOption = index;
    const options = document.querySelectorAll('.option');
    
    // Clear previous selections
    options.forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });

    // Mark selected option
    options[index].classList.add('selected');

    // Play selection sound
    sounds.tick.play();
    
    // Enable next button
    document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
    if (selectedOption === -1) return;

    answered = true;
    clearInterval(timer);
    const question = currentQuiz.questions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');

    // Show correct answer
    options[question.correct].classList.add('correct');
    
    // If wrong answer, show it as incorrect
    if (selectedOption !== question.correct) {
        options[selectedOption].classList.add('incorrect');
        sounds.wrong.play();
        streak = 0;
    } else {
        score++;
        streak++;
        sounds.correct.play();
        celebrateCorrectAnswer();
    }

    // Update score display
    document.getElementById('score-counter').innerHTML = `
        Score: ${score} <span class="streak">${streak > 1 ? '🔥 ' + streak + ' streak!' : ''}</span>
    `;

    // Show fun fact if available
    if (question.funFact) {
        const optionsContainer = document.getElementById('options');
        const funFact = document.createElement('div');
        funFact.className = 'fun-fact';
        funFact.textContent = question.funFact;
        optionsContainer.appendChild(funFact);
    }

    // Wait a moment then load next question
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 2000);
}

function celebrateCorrectAnswer() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.innerHTML = ['🎉', '🌟', '✨', '👍', '👏'][Math.floor(Math.random() * 5)];
    document.getElementById('quiz-screen').appendChild(celebration);
    
    celebration.style.left = `${Math.random() * 80 + 10}%`;
    celebration.style.top = `${Math.random() * 50 + 25}%`;
    celebration.style.fontSize = `${Math.random() * 30 + 20}px`;
    
    setTimeout(() => {
        celebration.remove();
    }, 1000);
}

function showResults() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('results-screen').classList.remove('hidden');

    const totalQuestions = currentQuiz.questions.length;
    const percentage = (score / totalQuestions) * 100;

    document.getElementById('final-score').textContent = `Your Score: ${score}/${totalQuestions}`;

    // Set emoji and message based on score
    let emoji, message;
    if (percentage >= 80) {
        emoji = '🎉';
        message = 'Excellent! You\'re a superstar! 🌟';
        sounds.applause.play();
    } else if (percentage >= 60) {
        emoji = '😊';
        message = 'Good job! Keep practicing! 👍';
    } else if (percentage >= 40) {
        emoji = '🤔';
        message = 'Nice try! You can do better! 💪';
    } else {
        emoji = '📚';
        message = 'Keep studying! Practice makes perfect! 🎯';
    }

    document.getElementById('result-emoji').textContent = emoji;
    document.getElementById('result-message').textContent = message;
    
    // Add confetti for good scores
    if (percentage >= 70) {
        startConfetti();
    }
}

function getRandomMascot() {
    const mascots = ['🦊', '🐻', '🐵', '🐶', '🐱', '🐼', '🐨', '🦁'];
    return mascots[Math.floor(Math.random() * mascots.length)];
}

function startConfetti() {
    const container = document.getElementById('results-screen');
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.innerHTML = ['🎉', '🎊', '✨', '🌟', '🏆'][Math.floor(Math.random() * 5)];
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

function initDrawingCanvas() {
    const canvas = document.getElementById('drawingArea');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let painting = false;
    let color = '#000000';
    let size = 5;

    // Set canvas resolution for better quality
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Drawing settings
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    function startPosition(e) {
        painting = true;
        draw(e);
    }

    function finishedPosition() {
        painting = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!painting) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.lineWidth = size;
        ctx.strokeStyle = color;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    // Event Listeners
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', draw);
    
    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startPosition(e);
    });
    canvas.addEventListener('touchend', finishedPosition);
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e);
    });

    // Controls
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelector('.color-option.selected')?.classList.remove('selected');
            opt.classList.add('selected');
            color = opt.dataset.color;
        });
    });

    document.getElementById('brushSize').addEventListener('input', (e) => {
        size = e.target.value;
    });

    document.getElementById('clearBtn').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    document.getElementById('saveBtn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'my-masterpiece.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    // Shape drawing
    const drawShape = (type) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.beginPath();
        if (type === 'triangle') {
            ctx.moveTo(150, 50);
            ctx.lineTo(50, 250);
            ctx.lineTo(250, 250);
            ctx.closePath();
        } else if (type === 'square') {
            ctx.rect(100, 100, 200, 200);
        } else if (type === 'circle') {
            ctx.arc(200, 200, 100, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.beginPath();
    };

    document.getElementById('drawTriangle').addEventListener('click', () => drawShape('triangle'));
    document.getElementById('drawSquare').addEventListener('click', () => drawShape('square'));
    document.getElementById('drawCircle').addEventListener('click', () => drawShape('circle'));

    // Prompts
    const prompts = [
        "Draw a happy little sun! ☀️",
        "Can you draw a friendly space alien? 👽",
        "How about a colorful magic castle? 🏰",
        "Draw your favorite animal! 🐶",
        "Design a super-fast race car! 🏎️",
        "Draw a garden full of giant flowers! 🌸"
    ];

    const promptText = document.getElementById('currentPrompt');
    const promptInput = document.getElementById('promptInput');

    document.getElementById('setPromptBtn').addEventListener('click', () => {
        if (promptInput.value) {
            promptText.textContent = promptInput.value;
            promptInput.value = '';
        }
    });

    document.getElementById('randomPromptBtn').addEventListener('click', () => {
        promptText.textContent = prompts[Math.floor(Math.random() * prompts.length)];
    });
}

function goHome() {
    clearInterval(timer);
    document.getElementById('home-screen').classList.remove('hidden');
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('drawing-screen').classList.add('hidden');
    document.getElementById('game-selection').classList.add('hidden');
    document.getElementById('story-selection').classList.add('hidden');
    window.location.hash = ''; // Clear hash
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Kids Learning Quiz App Loaded! 🎓');
    
    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        }
    }

    // Check for hash in URL to show sections
    const handleHash = () => {
        const hash = window.location.hash;
        if (hash === '#games') {
            showGameSelection();
        } else if (hash === '#drawing') {
            showDrawingScreen();
        }
    };
    
    handleHash();
    window.addEventListener('hashchange', handleHash);

    // Drawing Canvas Logic
    initDrawingCanvas();

    // Preload sounds
    Object.values(sounds).forEach(sound => {
        sound.load();
        sound.volume = 0.3;
    });
});





function showDrawingScreen() {
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('game-selection').classList.add('hidden');
    document.getElementById('story-selection').classList.add('hidden');
    document.getElementById('drawing-screen').classList.remove('hidden');
}

// Add this with your other screen management functions
function showGameSelection() {
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('drawing-screen').classList.add('hidden');
    document.getElementById('game-selection').classList.remove('hidden');
}

function startGame(gameType) {
    document.getElementById('game-selection').classList.add('hidden');
    
    // Clear any previous game
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.add('hidden');
        container.innerHTML = '';
    });
    
    const gameContainer = document.getElementById(`${gameType}-game-container`);
    gameContainer.classList.remove('hidden');
    
    // Add game header
    const gameHeader = document.createElement('div');
    gameHeader.className = 'game-header';
    gameHeader.innerHTML = `
        <h3 class="game-title">${getGameTitle(gameType)}</h3>
        <button class="game-back-btn" onclick="showGameSelection()">Back to Games</button>
    `;
    gameContainer.appendChild(gameHeader);
    
    // Initialize the selected game
    switch(gameType) {
        case 'memory':
            initMemoryGame(gameContainer);
            break;
        case 'sorting':
            initSortingGame(gameContainer);
            break;
        case 'bubble':
            initBubbleGame(gameContainer);
            break;
        case 'scramble':
            initScrambleGame(gameContainer);
            break;
    }
}

function getGameTitle(gameType) {
    const titles = {
        'memory': '🧠 Memory Match',
        'sorting': '🔢 Number Sorting',
        'bubble': '💥 Bubble Pop Math',
        'scramble': '🔤 Word Scramble'
    };
    return titles[gameType] || 'Game';
}

// Then add all the game initialization functions (from my previous examples)
// For each game, you would have a function like:
function initMemoryGame(container) {
    // Clear the container first
    container.innerHTML = '';
    
    // Create game content structure
    const gameContent = document.createElement('div');
    gameContent.className = 'memory-game-content';
    gameContent.innerHTML = `
        <div class="game-header">
            <h3 class="game-title">🧠 Memory Match</h3>
            <button class="game-back-btn" onclick="showGameSelection()">Back to Games</button>
        </div>
        <div class="memory-game">
            <div class="cards"></div>
        </div>
        <div class="game-score">Matches: <span id="memory-score">0</span></div>
    `;
    container.appendChild(gameContent);
    
    // Add the memory game CSS
    const style = document.createElement('style');
    style.textContent = `
        .memory-game {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
        }
        .cards {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin: 20px 0;
        }
        .card {
            height: 100px;
            background-color: #ff9ff3;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            cursor: pointer;
            transition: all 0.3s;
            user-select: none;
        }
        .card.flipped {
            background-color: #feca57;
            transform: rotateY(180deg);
        }
        .card.matched {
            visibility: hidden;
        }
    `;
    container.appendChild(style);

    // Game logic implementation
    const words = ['Apple', 'Banana', 'Cat', 'Dog', 'Apple', 'Banana', 'Cat', 'Dog'];
    const cardsContainer = gameContent.querySelector('.cards');
    const scoreElement = gameContent.querySelector('#memory-score');
    
    let flippedCards = [];
    let matches = 0;
    let canFlip = true; // To prevent rapid clicking

    // Shuffle and create cards
    shuffleArray(words).forEach(word => {
        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = '?';
        card.dataset.word = word;
        card.addEventListener('click', flipCard);
        cardsContainer.appendChild(card);
    });

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function flipCard() {
        if (!canFlip || flippedCards.length >= 2 || this.classList.contains('flipped')) {
            return;
        }

        this.classList.add('flipped');
        this.textContent = this.dataset.word;
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            canFlip = false;
            setTimeout(checkForMatch, 500);
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        
        if (card1.dataset.word === card2.dataset.word) {
            // Match found
            card1.classList.add('matched');
            card2.classList.add('matched');
            matches++;
            scoreElement.textContent = matches;
            
            if (matches === words.length/2) {
                setTimeout(() => {
                    alert(`Congratulations! You matched all ${matches} pairs!`);
                // Optionally restart the game
                    initMemoryGame(container);
                }, 500);
            }
        } else {
            // No match - flip back
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '?';
            card2.textContent = '?';
        }

        flippedCards = [];
        canFlip = true;
    }
}
function initSortingGame(container) {
    container.innerHTML = '';
    
    const gameContent = document.createElement('div');
    gameContent.className = 'sorting-game-content';
    gameContent.innerHTML = `
        <div class="game-header">
            <h3 class="game-title">🔢 Number Sorting</h3>
            <button class="game-back-btn" onclick="showGameSelection()">Back to Games</button>
        </div>
        <div class="sorting-game">
            <h4>Sort these numbers from smallest to biggest!</h4>
            <div class="numbers-container"></div>
            <div class="drop-zone"></div>
        </div>
        <div class="game-score" id="sorting-feedback">Drag numbers to the drop zone above</div>
    `;
    container.appendChild(gameContent);

    const style = document.createElement('style');
    style.textContent = `
        .sorting-game {
            text-align: center;
            font-family: 'Comic Sans MS', cursive;
            max-width: 600px;
            margin: 0 auto;
        }
        .numbers-container {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 20px 0;
            flex-wrap: wrap;
        }
        .number {
            width: 60px;
            height: 60px;
            background-color: #1dd1a1;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            color: white;
            cursor: grab;
            user-select: none;
        }
        .drop-zone {
            min-height: 80px;
            border: 3px dashed #ff9ff3;
            border-radius: 10px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding: 10px;
            margin: 20px auto;
            justify-content: center;
        }
        .drop-zone .number {
            background-color: #feca57;
            cursor: default;
        }
        #sorting-feedback {
            color: #576574;
            font-size: 18px;
            min-height: 24px;
        }
    `;
    container.appendChild(style);

    const numbers = [5, 2, 8, 1, 9];
    const numbersContainer = gameContent.querySelector('.numbers-container');
    const dropZone = gameContent.querySelector('.drop-zone');
    const feedbackEl = gameContent.querySelector('#sorting-feedback');

    // Create draggable numbers
    shuffleArray(numbers).forEach(num => {
        const numberEl = document.createElement('div');
        numberEl.className = 'number';
        numberEl.textContent = num;
        numberEl.draggable = true;
        numberEl.dataset.value = num;
        
        numberEl.addEventListener('dragstart', dragStart);
        numbersContainer.appendChild(numberEl);
    });

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.value);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => e.target.classList.add('dragging'), 0);
    }

    dropZone.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        const value = e.dataTransfer.getData('text/plain');
        const draggedElement = document.querySelector(`.number.dragging`);
        
        if (draggedElement) {
            dropZone.appendChild(draggedElement);
            draggedElement.classList.remove('dragging');
            draggedElement.draggable = false;
            checkOrder();
        }
    });

    function checkOrder() {
        const droppedNumbers = Array.from(dropZone.children).map(el => parseInt(el.dataset.value));
        const sortedNumbers = [...droppedNumbers].sort((a, b) => a - b);
        
        if (droppedNumbers.length === numbers.length) {
            if (JSON.stringify(droppedNumbers) === JSON.stringify(sortedNumbers)) {
                feedbackEl.textContent = 'Perfect sorting! Well done!';
                feedbackEl.style.color = '#2ecc71';
                dropZone.style.borderColor = '#2ecc71';
            } else {
                feedbackEl.textContent = 'Not quite right! Try again!';
                feedbackEl.style.color = '#e74c3c';
                dropZone.style.borderColor = '#e74c3c';
            }
        } else {
            feedbackEl.textContent = `${droppedNumbers.length} of ${numbers.length} numbers placed`;
            feedbackEl.style.color = '#576574';
        }
    }
}
function initBubbleGame(container) {
    container.innerHTML = '';
    
    const gameContent = document.createElement('div');
    gameContent.className = 'bubble-game-content';
    gameContent.innerHTML = `
        <div class="game-header">
            <h3 class="game-title">💥 Bubble Pop Math</h3>
            <button class="game-back-btn" onclick="showGameSelection()">Back to Games</button>
        </div>
        <div class="bubble-game">
            <div class="problem">5 + 3 = ?</div>
            <div class="bubbles-container"></div>
            <div class="game-score">Score: <span id="bubble-score">0</span></div>
        </div>
    `;
    container.appendChild(gameContent);

    const style = document.createElement('style');
    style.textContent = `
        .bubble-game {
            text-align: center;
            font-family: 'Comic Sans MS', cursive;
        }
        .problem {
            font-size: 28px;
            margin: 20px 0;
            color: #576574;
        }
        .bubbles-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            margin: 20px auto;
            max-width: 400px;
        }
        .bubble {
            width: 70px;
            height: 70px;
            background-color: #54a0ff;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            color: white;
            cursor: pointer;
            transition: transform 0.2s;
            animation: float 3s infinite ease-in-out;
        }
        .bubble:hover {
            transform: scale(1.1);
        }
        .bubble.pop {
            transform: scale(1.3);
            opacity: 0;
            transition: all 0.3s;
        }
        .bubble.wrong {
            background-color: #ee5253;
        }
        #bubble-score {
            color: #e74c3c;
            font-weight: bold;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
    `;
    container.appendChild(style);

    let score = 0;
    const scoreElement = gameContent.querySelector('#bubble-score');
    const bubblesContainer = gameContent.querySelector('.bubbles-container');
    const problemElement = gameContent.querySelector('.problem');

    createNewProblem();

    function createNewProblem() {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        const correctAnswer = num1 + num2;
        const wrongAnswers = [
            correctAnswer + 1,
            correctAnswer - 1,
            correctAnswer + 2,
            correctAnswer - 2,
            num1 + num2 - 3,
            num1 + num2 + 3
        ].filter(a => a !== correctAnswer && a >= 0);

        problemElement.textContent = `${num1} + ${num2} = ?`;
        bubblesContainer.innerHTML = '';

        // Create bubbles with correct and wrong answers
        const allAnswers = [correctAnswer, ...wrongAnswers.slice(0, 5)].sort(() => Math.random() - 0.5);

        allAnswers.forEach(answer => {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.textContent = answer;
            
            bubble.addEventListener('click', function() {
                if (parseInt(answer) === correctAnswer) {
                    bubble.classList.add('pop');
                    score++;
                    scoreElement.textContent = score;
                    setTimeout(() => {
                        bubblesContainer.innerHTML = '';
                        createNewProblem();
                    }, 500);
                } else {
                    bubble.classList.add('wrong');
                    setTimeout(() => bubble.classList.remove('wrong'), 500);
                }
            });
            
            bubblesContainer.appendChild(bubble);
        });
    }
}

function initScrambleGame(container) {
    container.innerHTML = '';
    
    const gameContent = document.createElement('div');
    gameContent.className = 'scramble-game-content';
    gameContent.innerHTML = `
        <div class="game-header">
            <h3 class="game-title">🔤 Word Scramble</h3>
            <button class="game-back-btn" onclick="showGameSelection()">Back to Games</button>
        </div>
        <div class="scramble-game">
            <h4>Unscramble the word!</h4>
            <div class="scrambled-word"></div>
            <input type="text" class="guess-input" placeholder="Your guess...">
            <button class="submit-guess">Submit</button>
            <div class="feedback"></div>
            <div class="hint"></div>
            <button class="hint-button">Get Hint</button>
            <div class="game-score">Score: <span id="scramble-score">0</span></div>
        </div>
    `;
    container.appendChild(gameContent);

    const style = document.createElement('style');
    style.textContent = `
        .scramble-game {
            max-width: 500px;
            margin: 0 auto;
            text-align: center;
            font-family: 'Comic Sans MS', cursive;
            background-color: #f7f1e3;
            padding: 20px;
            border-radius: 15px;
        }
        .scrambled-word {
            font-size: 32px;
            letter-spacing: 5px;
            margin: 20px 0;
            color: #227093;
            font-weight: bold;
        }
        .guess-input {
            padding: 10px 15px;
            font-size: 18px;
            border: 2px solid #34ace0;
            border-radius: 8px;
            width: 80%;
            margin-bottom: 10px;
        }
        .submit-guess, .hint-button {
            background-color: #33d9b2;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 8px;
            cursor: pointer;
            margin: 5px;
            transition: background-color 0.3s;
        }
        .submit-guess:hover, .hint-button:hover {
            background-color: #218c74;
        }
        .feedback {
            min-height: 24px;
            margin: 15px 0;
            font-size: 20px;
        }
        .hint {
            color: #84817a;
            font-style: italic;
            margin: 10px 0;
        }
        .correct {
            color: #2ecc71;
        }
        .incorrect {
            color: #e74c3c;
        }
        #scramble-score {
            color: #e74c3c;
            font-weight: bold;
        }
    `;
    container.appendChild(style);

    const words = [
        {word: "elephant", hint: "A large animal with a trunk"},
        {word: "giraffe", hint: "Tall animal with a long neck"},
        {word: "computer", hint: "Device you're using right now"},
        {word: "rainbow", hint: "Appears in the sky after rain"},
        {word: "butterfly", hint: "Colorful insect with wings"}
    ];

    let currentWord = '';
    let scrambledWord = '';
    let score = 0;
    const scrambledWordEl = gameContent.querySelector('.scrambled-word');
    const guessInput = gameContent.querySelector('.guess-input');
    const submitBtn = gameContent.querySelector('.submit-guess');
    const feedbackEl = gameContent.querySelector('.feedback');
    const hintEl = gameContent.querySelector('.hint');
    const hintBtn = gameContent.querySelector('.hint-button');
    const scoreEl = gameContent.querySelector('#scramble-score');

    // Initialize game
    newWord();

    function newWord() {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        currentWord = randomWord.word;
        scrambledWord = scrambleWord(currentWord);
        scrambledWordEl.textContent = scrambledWord;
        hintEl.textContent = '';
        guessInput.value = '';
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';
    }

    function scrambleWord(word) {
        return word.split('').sort(() => Math.random() - 0.5).join('');
    }

    submitBtn.addEventListener('click', checkGuess);
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkGuess();
    });

    hintBtn.addEventListener('click', () => {
        const currentWordObj = words.find(w => w.word === currentWord);
        hintEl.textContent = `Hint: ${currentWordObj.hint}`;
    });

    function checkGuess() {
        const guess = guessInput.value.trim().toLowerCase();
        
        if (guess === currentWord) {
            feedbackEl.textContent = "Correct! Well done!";
            feedbackEl.className = "feedback correct";
            score++;
            scoreEl.textContent = score;
            setTimeout(newWord, 1500);
        } else {
            feedbackEl.textContent = "Try again!";
            feedbackEl.className = "feedback incorrect";
            guessInput.select();
        }
    }
}
 // Function to show the story selection screen
        function showStorySelection() {
            document.getElementById('home-screen').classList.add('hidden');
            document.getElementById('story-selection').classList.remove('hidden');
        }

        function loadStory(storyFile) {
            window.location.href = storyFile;
        }

        function goHome() {
            // Hide all screens except home
            document.querySelectorAll('.container > div').forEach(div => {
                div.classList.add('hidden');
            });
            document.getElementById('home-screen').classList.remove('hidden');
        }

    // Canvas setup
    const canvas = document.getElementById('drawingArea');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let currentColor = '#000000';
    let currentBrushSize = 5;
    let lastX = 0;
    let lastY = 0;
    
    // Prompt elements
    const promptInput = document.getElementById('promptInput');
    const currentPrompt = document.getElementById('currentPrompt');
    const setPromptBtn = document.getElementById('setPromptBtn');
    const randomPromptBtn = document.getElementById('randomPromptBtn');
    
    // Shape buttons
    const drawTriangleBtn = document.getElementById('drawTriangle');
    const drawSquareBtn = document.getElementById('drawSquare');
    const drawCircleBtn = document.getElementById('drawCircle');
    
    // Random prompts for kids
    const randomPrompts = [
        "Draw a triangle with a hat",
        "Illustrate a happy sun",
        "Draw your favorite animal",
        "Create a magical castle",
        "Draw a spaceship to the moon",
        "Illustrate a underwater scene",
        "Draw a tree with candy fruits",
        "Create a picture of your dream playground",
        "Draw a funny monster",
        "Illustrate this story ending: The dragon became friends with the knight"
    ];
    
    // Initialize canvas
    function initCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentBrushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }
    
    // Drawing functions
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    // Shape drawing functions
    function drawTriangle() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const size = 100;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - size);
        ctx.lineTo(centerX + size, centerY + size);
        ctx.lineTo(centerX - size, centerY + size);
        ctx.closePath();
        ctx.stroke();
        
        currentPrompt.textContent = "Great job! Now try coloring it in!";
    }
    
    function drawSquare() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const size = 100;
        
        ctx.beginPath();
        ctx.rect(centerX - size/2, centerY - size/2, size, size);
        ctx.stroke();
    }
    
    function drawCircle() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 70;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Clear canvas
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        initCanvas();
    }
    
    // Save drawing
    function saveDrawing() {
        const link = document.createElement('a');
        link.download = 'kids-drawing.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
    
    // Set prompt
    function setPrompt() {
        const prompt = promptInput.value.trim();
        if (prompt) {
            currentPrompt.textContent = prompt;
            promptInput.value = '';
            
            // Special handling for triangle prompt
            if (prompt.toLowerCase().includes('triangle')) {
                setTimeout(drawTriangle, 500);
            }
        }
    }
    
    // Get random prompt
    function getRandomPrompt() {
        const randomIndex = Math.floor(Math.random() * randomPrompts.length);
        currentPrompt.textContent = randomPrompts[randomIndex];
    }
    
    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // For touch devices
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    });
    
    // Color selection
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            currentColor = option.dataset.color;
            ctx.strokeStyle = currentColor;
        });
    });
    
    // Brush size
    document.getElementById('brushSize').addEventListener('input', () => {
        currentBrushSize = document.getElementById('brushSize').value;
        ctx.lineWidth = currentBrushSize;
    });
    
    // Button events
    setPromptBtn.addEventListener('click', setPrompt);
    randomPromptBtn.addEventListener('click', getRandomPrompt);
    document.getElementById('clearBtn').addEventListener('click', clearCanvas);
    document.getElementById('saveBtn').addEventListener('click', saveDrawing);
    drawTriangleBtn.addEventListener('click', drawTriangle);
    drawSquareBtn.addEventListener('click', drawSquare);
    drawCircleBtn.addEventListener('click', drawCircle);
    
    // Initialize
    initCanvas();
    getRandomPrompt();
