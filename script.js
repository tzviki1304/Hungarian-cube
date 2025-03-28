document.addEventListener('DOMContentLoaded', () => {
    // --- בחירת אלמנטים ---
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main section');
    const homeSection = document.getElementById('home-section');
    const learnSection = document.getElementById('learn-section');
    const playSection = document.getElementById('play-section');

    const btnGoLearn = document.getElementById('btn-go-learn');
    const btnGoPlay = document.getElementById('btn-go-play');

    // אלמנטים של אזור הלימוד
    const stepsLinks = document.querySelectorAll('.learn-steps-nav a');
    const stepTitle = document.getElementById('step-title');
    const stepDescription = document.getElementById('step-description');
    const stepAlgorithm = document.getElementById('step-algorithm');
    const learnCubeContainer = document.getElementById('learn-cube-container');
    const btnPrevStep = document.getElementById('btn-prev-step');
    const btnNextStep = document.getElementById('btn-next-step');

    // אלמנטים של אזור המשחק
    const playCubeContainer = document.getElementById('play-cube-container');
    const btnScramble = document.getElementById('btn-scramble');
    const btnReset = document.getElementById('btn-reset');
    const btnSolve = document.getElementById('btn-solve');
    const timerDisplay = document.getElementById('timer');
    const hintText = document.getElementById('hint-text');
    const rotationButtons = document.querySelectorAll('.rotation-btn');

    // --- נתוני שלבי הלימוד (דוגמה) ---
    const learningStepsData = [
        { id: 1, title: "הכרת הקובייה", description: "נלמד על החלקים השונים: מרכזים (נשארים במקום), שפות (2 צבעים) ופינות (3 צבעים).", algorithm: "" },
        { id: 2, title: "הצלב הלבן", description: "המטרה: ליצור צלב לבן בשכבה העליונה, כך שצבעי השפות יתאימו למרכזים הצדדיים.", algorithm: "שיטות אינטואיטיביות" },
        { id: 3, title: "שיבוץ פינות לבנות", description: "נכניס את 4 הפינות הלבנות למקומן הנכון בין חלקי הצלב.", algorithm: "R U R' U' / F' U' F / ..." },
        { id: 4, title: "שיבוץ שפות השכבה האמצעית", description: "נמקם את 4 השפות ששייכות לשכבה האמצעית (אלו שאין להן צהוב).", algorithm: "U R U' R' U' F' U F / ..." },
        { id: 5, title: "יצירת צלב צהוב", description: "נהפוך את השכבה העליונה כך שכל החלקים הצהובים פונים למעלה, ויוצרים צלב.", algorithm: "F R U R' U' F'" },
        { id: 6, title: "כיוון השכבה הצהובה (OLL)", description: "נסובב את חלקי השכבה הצהובה כך שכולה תהיה צהובה.", algorithm: "R U R' U R U U R' / ... (יש מספר אלגוריתמים)" },
        { id: 7, title: "מיקום הפינות הצהובות (PLL)", description: "נסדר את הפינות הצהובות במקומן הנכון (גם אם לא מכוונות נכון).", algorithm: "U R U' L' U R' U' L / ..." },
        { id: 8, title: "מיקום השפות הצהובות (PLL)", description: "השלב האחרון! נסדר את השפות הצהובות במקומן להשלמת הקובייה.", algorithm: "R U R' U R U U R' U / ..." }
    ];
    let currentStepIndex = -1; // אף שלב לא נבחר בהתחלה

    // מערך של רמזים לפי שלבי פתרון
    const solveHints = [
        "ראשית, נסו ליצור צלב לבן בחלק העליון",
        "עכשיו סדרו את הפינות הלבנות במקומן הנכון",
        "טפלו בשכבה האמצעית - השתמשו ב-R U R' U' F' U F",
        "צרו צלב צהוב בחלק העליון",
        "סדרו את הפינות הצהובות למקומן הנכון",
        "סיימו את פתרון הקובייה על ידי סידור השפות הצהובות"
    ];
    
    // מערך של המהלכים האחרונים שבוצעו (נשמר לצורך הצגת היסטוריה)
    let lastMoves = [];
    const MAX_HISTORY_MOVES = 10; // מקסימום מהלכים שנשמור בהיסטוריה

    // --- פונקציות ---

    // פונקציה להצגת סקשן ספציפי והסתרת האחרים
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.classList.add('active');
        }
        // עדכון הדגשת הניווט
        updateNavHighlight(sectionId);
    }

     // פונקציה לעדכון הדגשת הקישור הפעיל בניווט הראשי
    function updateNavHighlight(activeSectionId) {
        navLinks.forEach(link => {
            link.classList.remove('active-nav');
            // בודקים איזה קישור מתאים לסקשן הפעיל
            if ((activeSectionId === 'home-section' && link.id === 'nav-home') ||
                (activeSectionId === 'learn-section' && link.id === 'nav-learn') ||
                (activeSectionId === 'play-section' && link.id === 'nav-play')) {
                link.classList.add('active-nav');
            }
        });
    }

    // פונקציה לטעינת תוכן שלב לימוד
    function loadLearningStep(stepIndex) {
        if (stepIndex >= 0 && stepIndex < learningStepsData.length) {
            currentStepIndex = stepIndex;
            const stepData = learningStepsData[stepIndex];
            stepTitle.textContent = `שלב ${stepData.id}: ${stepData.title}`;
            stepDescription.textContent = stepData.description;
            stepAlgorithm.textContent = stepData.algorithm ? `אלגוריתם לדוגמה: ${stepData.algorithm}` : "";

            // עדכון הדגשה ברשימת השלבים
            stepsLinks.forEach(link => link.classList.remove('active-step'));
            const activeLink = document.querySelector(`.learn-steps-nav a[data-step="${stepData.id}"]`);
            if(activeLink) activeLink.classList.add('active-step');

            // עדכון מצב כפתורי ניווט שלבים
            btnPrevStep.disabled = (currentStepIndex === 0);
            btnNextStep.disabled = (currentStepIndex === learningStepsData.length - 1);

            // עדכון קוביית הלימוד להדגמת השלב
            if (window.rubiksCubeUtils) {
                window.rubiksCubeUtils.updateLearnCubeForStep(stepData.id);
            }
        }
    }

    // פונקציה לביצוע סיבוב של הקובייה
    function performCubeMove(move) {
        console.log(`מבצע מהלך: ${move}`);
        
        // ביצוע הסיבוב בקובייה
        if (window.rubiksCubeUtils) {
            window.rubiksCubeUtils.performMove(playCube, move);
            
            // הוספת המהלך להיסטוריה
            lastMoves.push(move);
            if (lastMoves.length > MAX_HISTORY_MOVES) {
                lastMoves.shift(); // מסיר את המהלך הראשון כשעוברים את המקסימום
            }
            
            // עדכון טקסט הרמז לכלול את המהלכים האחרונים
            updateHintText();
        }
    }
    
    // עדכון הרמז לפי מצב הקובייה הנוכחי
    function updateHintText(customHint = null) {
        if (customHint) {
            // אם ניתן רמז ספציפי, נציג אותו
            hintText.textContent = customHint;
        } else if (lastMoves.length > 0) {
            // אחרת, נציג את המהלכים האחרונים
            hintText.textContent = `המהלכים האחרונים: ${lastMoves.join(', ')}`;
        } else {
            hintText.textContent = "לחצו על כפתורי הסיבוב כדי להתחיל לשחק";
        }
    }
    
    // פונקציה לייצור רמז על סמך מצב הקובייה
    function generateHint() {
        // בפרויקט אמיתי, הפונקציה תבדוק את מצב הקובייה ותציע רמז לפי השלב בו המשתמש נמצא
        const randomHintIndex = Math.floor(Math.random() * solveHints.length);
        updateHintText(solveHints[randomHintIndex]);
    }

    // --- הגדרת אירועים (Event Listeners) ---

    // ניווט ראשי
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // מניעת ברירת מחדל של הקישור
            const targetId = link.id.replace('nav-', '') + '-section'; // לדוגמה: "nav-learn" -> "learn-section"
            showSection(targetId);
        });
    });

    // כפתורי "התחל ללמוד" / "שחק"
    btnGoLearn.addEventListener('click', () => showSection('learn-section'));
    btnGoPlay.addEventListener('click', () => showSection('play-section'));

    // ניווט בין שלבי הלימוד
    stepsLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // const stepNum = parseInt(link.getAttribute('data-step')); // אפשרות לקחת מה-data attribute
            loadLearningStep(index);
        });
    });

    btnPrevStep.addEventListener('click', () => {
        if (currentStepIndex > 0) {
            loadLearningStep(currentStepIndex - 1);
        }
    });

    btnNextStep.addEventListener('click', () => {
         if (currentStepIndex < learningStepsData.length - 1) {
            loadLearningStep(currentStepIndex + 1);
        }
    });

    // אירועי לחיצה על כפתורי סיבוב הקובייה
    rotationButtons.forEach(button => {
        button.addEventListener('click', () => {
            const move = button.getAttribute('data-move');
            if (move) {
                performCubeMove(move);
            }
        });
    });

    // --- לוגיקה של אזור המשחק (מצייני מיקום) ---

    let gameTimerInterval = null;
    let secondsElapsed = 0;

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function startTimer() {
        stopTimer(); // עצור טיימר קודם אם קיים
        secondsElapsed = 0;
        timerDisplay.textContent = `זמן: ${formatTime(secondsElapsed)}`;
         gameTimerInterval = setInterval(() => {
            secondsElapsed++;
            timerDisplay.textContent = `זמן: ${formatTime(secondsElapsed)}`;
        }, 1000);
    }

    function stopTimer() {
         clearInterval(gameTimerInterval);
         gameTimerInterval = null;
    }


    btnScramble.addEventListener('click', () => {
        console.log("לוחץ על 'ערבב'");
        // הפעלת פונקציית ערבוב הקוביה
        if (window.rubiksCubeUtils) {
            window.rubiksCubeUtils.scrambleCube(playCube);
            // איפוס היסטוריית המהלכים בעת ערבוב
            lastMoves = [];
            updateHintText("הקובייה עורבבה! נסו לפתור אותה...");
        }
        startTimer(); // התחל טיימר כשמערבבים
    });

    btnReset.addEventListener('click', () => {
        console.log("לוחץ על 'אפס'");
        // הפעלת פונקציית איפוס הקוביה
        if (window.rubiksCubeUtils) {
            window.rubiksCubeUtils.resetCube(playCube);
            // איפוס היסטוריית המהלכים בעת איפוס
            lastMoves = [];
            updateHintText("הקובייה אופסה למצב פתור");
        }
        stopTimer();
        secondsElapsed = 0;
        timerDisplay.textContent = `זמן: ${formatTime(secondsElapsed)}`;
    });

    btnSolve.addEventListener('click', () => {
        console.log("לוחץ על 'פתור (רמז)'");
        // הפעלת פונקציית הרמז (או פתרון מלא)
        generateHint();
    });


    // --- אתחול ---
    showSection('home-section'); // הצג את דף הבית בטעינה
    // הגדרת טקסט הרמז ההתחלתי
    updateHintText("ערבבו את הקובייה כדי להתחיל לשחק");
});