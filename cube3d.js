// קובץ יצירת קוביה הונגרית בתלת-מימד
// מטפל בכל הלוגיקה של יצירת ומניפולציה של קוביה תלת-מימד עם Three.js

// אובייקטים גלובליים
let homeScene, homeCamera, homeRenderer, homeCube, homeControls;
let learnScene, learnCamera, learnRenderer, learnCube, learnControls;
let playScene, playCamera, playRenderer, playCube, playControls;

// צבעים סטנדרטיים של קוביה הונגרית
const CUBE_COLORS = {
    white: 0xFFFFFF,   // לבן (למעלה)
    yellow: 0xFFFF00,  // צהוב (למטה)
    red: 0xFF0000,     // אדום (קדימה)
    orange: 0xFF8C00,  // כתום (אחורה)
    blue: 0x0000FF,    // כחול (שמאל)
    green: 0x00FF00    // ירוק (ימין)
};

// מידות הקוביה
const CUBE_SIZE = 1;
const CUBE_GAP = 0.08;
const CUBE_PIECE_SIZE = (CUBE_SIZE - 2 * CUBE_GAP) / 3;

// אתחול
document.addEventListener('DOMContentLoaded', () => {
    // אתחול הקוביות בשלושת האזורים
    initHomePageCube();
    initLearnCube();
    initPlayCube();

    // הפעלת אנימציה
    animateCubes();

    // חיבור טיפול באירועים עבור כפתורי המשחק
    connectPlayButtons();
});

// אתחול הקוביה בדף הבית
function initHomePageCube() {
    const container = document.querySelector('.visual-placeholder');
    
    // ניקוי התוכן הקיים
    container.innerHTML = '';
    
    // הגדרת סצנה, מצלמה, ומרנדר
    homeScene = new THREE.Scene();
    homeCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    homeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    // הגדרת גודל ורקע
    homeRenderer.setSize(300, 300);
    container.appendChild(homeRenderer.domElement);
    
    // יצירת קוביה
    homeCube = createSimpleCube();
    homeScene.add(homeCube);
    
    // מיקום המצלמה והקוביה
    homeCamera.position.z = 5;
    
    // הוספת שליטה
    homeControls = createControls(homeCamera, homeRenderer);
    
    // תאורה
    addLighting(homeScene);
}

// אתחול הקוביה באזור הלמידה
function initLearnCube() {
    const container = document.getElementById('learn-cube-container');
    
    // ניקוי התוכן הקיים
    container.innerHTML = '';
    
    // הגדרת סצנה, מצלמה, ומרנדר
    learnScene = new THREE.Scene();
    learnCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    learnRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    // הגדרת גודל ורקע
    learnRenderer.setSize(300, 300);
    container.appendChild(learnRenderer.domElement);
    
    // יצירת קוביה
    learnCube = createRubiksCube();
    learnScene.add(learnCube);
    
    // מיקום המצלמה והקוביה
    learnCamera.position.z = 5;
    
    // הוספת שליטה
    learnControls = createControls(learnCamera, learnRenderer);
    
    // תאורה
    addLighting(learnScene);
}

// אתחול הקוביה באזור המשחק
function initPlayCube() {
    const container = document.getElementById('play-cube-container');
    
    // ניקוי התוכן הקיים
    container.innerHTML = '';
    
    // הגדרת סצנה, מצלמה, ומרנדר
    playScene = new THREE.Scene();
    playCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    playRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    // הגדרת גודל ורקע
    playRenderer.setSize(300, 300);
    container.appendChild(playRenderer.domElement);
    
    // יצירת קוביה
    playCube = createRubiksCube();
    playScene.add(playCube);
    
    // מיקום המצלמה והקוביה
    playCamera.position.z = 5;
    
    // הוספת שליטה
    playControls = createControls(playCamera, playRenderer);
    
    // תאורה
    addLighting(playScene);
}

// יצירת קוביה פשוטה עבור דף הבית
function createSimpleCube() {
    const group = new THREE.Group();
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    
    // יצירת החומרים עם הצבעים השונים
    const materials = [
        new THREE.MeshPhongMaterial({ color: CUBE_COLORS.green }), // ימין
        new THREE.MeshPhongMaterial({ color: CUBE_COLORS.blue }),  // שמאל
        new THREE.MeshPhongMaterial({ color: CUBE_COLORS.white }), // למעלה
        new THREE.MeshPhongMaterial({ color: CUBE_COLORS.yellow }), // למטה
        new THREE.MeshPhongMaterial({ color: CUBE_COLORS.red }),   // קדימה
        new THREE.MeshPhongMaterial({ color: CUBE_COLORS.orange }) // אחורה
    ];
    
    const cube = new THREE.Mesh(geometry, materials);
    group.add(cube);
    
    return group;
}

// יצירת קוביית רוביק מלאה (3x3x3)
function createRubiksCube() {
    const group = new THREE.Group();
    const cubeSize = CUBE_PIECE_SIZE;
    const gap = CUBE_GAP;
    const totalSize = 3 * cubeSize + 2 * gap;
    const offset = totalSize / 2 - cubeSize / 2;
    
    // מערך שיכיל את כל קוביות הפיסות
    const pieces = [];
    
    // יצירת 27 קוביות קטנות (3x3x3)
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            for (let z = 0; z < 3; z++) {
                // אם זו קובייה פנימית (לא נראית), נדלג עליה
                if (x === 1 && y === 1 && z === 1) continue;
                
                const piece = createCubePiece(x, y, z);
                
                // מיקום הקובייה
                piece.position.x = (x - 1) * (cubeSize + gap);
                piece.position.y = (y - 1) * (cubeSize + gap);
                piece.position.z = (z - 1) * (cubeSize + gap);
                
                group.add(piece);
                pieces.push(piece);
            }
        }
    }
    
    return group;
}

// יצירת פיסת קוביית רוביק בודדת
function createCubePiece(x, y, z) {
    const geometry = new THREE.BoxGeometry(CUBE_PIECE_SIZE, CUBE_PIECE_SIZE, CUBE_PIECE_SIZE);
    
    // מערך של חומרים לששת הפאות - כולם שחורים כברירת מחדל
    const materials = [
        new THREE.MeshPhongMaterial({ color: 0x111111 }), // ימין (x+)
        new THREE.MeshPhongMaterial({ color: 0x111111 }), // שמאל (x-)
        new THREE.MeshPhongMaterial({ color: 0x111111 }), // למעלה (y+)
        new THREE.MeshPhongMaterial({ color: 0x111111 }), // למטה (y-)
        new THREE.MeshPhongMaterial({ color: 0x111111 }), // קדימה (z+)
        new THREE.MeshPhongMaterial({ color: 0x111111 })  // אחורה (z-)
    ];

    // קביעת צבעים בהתאם למיקום החיצוני של הקובייה
    if (x === 0) materials[1] = new THREE.MeshPhongMaterial({ color: CUBE_COLORS.blue }); // שמאל (x-)
    if (x === 2) materials[0] = new THREE.MeshPhongMaterial({ color: CUBE_COLORS.green }); // ימין (x+)
    if (y === 0) materials[3] = new THREE.MeshPhongMaterial({ color: CUBE_COLORS.yellow }); // למטה (y-)
    if (y === 2) materials[2] = new THREE.MeshPhongMaterial({ color: CUBE_COLORS.white }); // למעלה (y+)
    if (z === 0) materials[5] = new THREE.MeshPhongMaterial({ color: CUBE_COLORS.orange }); // אחורה (z-)
    if (z === 2) materials[4] = new THREE.MeshPhongMaterial({ color: CUBE_COLORS.red }); // קדימה (z+)
    
    const piece = new THREE.Mesh(geometry, materials);
    
    // הוספת גבולות שחורים
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    piece.add(edges);

    // זיהוי המיקום של החלק בקובייה - שימושי לסיבובים
    piece.userData = {
        originalPosition: { x, y, z },
        type: getPartType(x, y, z)
    };
    
    return piece;
}

// פונקציה לזיהוי סוג החלק בקובייה (מרכז, שפה, או פינה)
function getPartType(x, y, z) {
    let exteriorFaces = 0;
    if (x === 0 || x === 2) exteriorFaces++;
    if (y === 0 || y === 2) exteriorFaces++;
    if (z === 0 || z === 2) exteriorFaces++;
    
    if (exteriorFaces === 1) return 'center'; // מרכז פאה
    if (exteriorFaces === 2) return 'edge';   // שפה (2 צבעים)
    if (exteriorFaces === 3) return 'corner'; // פינה (3 צבעים)
    return 'inner';                           // חלק פנימי (לא אמור להיות)
}

// הוספת תאורה לסצנה
function addLighting(scene) {
    // תאורה מכוונת (כמו שמש)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);
    
    // תאורת סביבה (כללית)
    const ambLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambLight);
}

// יצירת בקרי סיבוב למצלמה/קוביה
function createControls(camera, renderer) {
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    return controls;
}

// אנימציה מתמשכת של כל הקוביות
function animateCubes() {
    requestAnimationFrame(animateCubes);
    
    // סיבוב עצמי של הקוביה בדף הבית
    if (homeCube) {
        homeCube.rotation.x += 0.005;
        homeCube.rotation.y += 0.01;
    }
    
    // עדכון שליטה
    if (homeControls) homeControls.update();
    if (learnControls) learnControls.update();
    if (playControls) playControls.update();
    
    // רינדור
    if (homeRenderer && homeScene && homeCamera) {
        homeRenderer.render(homeScene, homeCamera);
    }
    if (learnRenderer && learnScene && learnCamera) {
        learnRenderer.render(learnScene, learnCamera);
    }
    if (playRenderer && playScene && playCamera) {
        playRenderer.render(playScene, playCamera);
    }
}

// פעולות קוביית המשחק
function connectPlayButtons() {
    const btnScramble = document.getElementById('btn-scramble');
    const btnReset = document.getElementById('btn-reset');
    const btnSolve = document.getElementById('btn-solve');
    
    if (btnScramble) {
        btnScramble.addEventListener('click', () => {
            scrambleCube(playCube);
        });
    }
    
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            resetCube(playCube);
        });
    }
    
    if (btnSolve) {
        btnSolve.addEventListener('click', () => {
            solveCube(playCube);
        });
    }
}

// ערבוב אמיתי של הקוביה (סיבוב צדדים)
function scrambleCube(cube) {
    if (!cube) return;
    
    // מספר רנדומלי של סיבובים
    const rotations = Math.floor(Math.random() * 15) + 10; // 10-25 סיבובים
    
    // רשימת המהלכים האפשריים
    const possibleMoves = ['R', 'L', 'U', 'D', 'F', 'B', 'R\'', 'L\'', 'U\'', 'D\'', 'F\'', 'B\''];
    
    console.log(`ערבוב הקוביה ב-${rotations} סיבובים אקראיים`);
    
    // ביצוע סיבובים אקראיים
    for (let i = 0; i < rotations; i++) {
        const moveIndex = Math.floor(Math.random() * possibleMoves.length);
        const move = possibleMoves[moveIndex];
        performMove(cube, move);
    }
}

// ביצוע מהלך בקוביה
function performMove(cube, move) {
    if (!cube) return;
    
    console.log(`מבצע מהלך: ${move}`);
    
    // זיהוי המהלך והכיוון
    const layer = move.charAt(0); // R, L, U, D, F, B
    const counterClockwise = move.length > 1 && move.charAt(1) === '\'';
    
    // זווית סיבוב
    const angle = counterClockwise ? -Math.PI/2 : Math.PI/2;
    
    // מצא את כל הקוביות שצריכות להסתובב
    const children = cube.children;
    
    // סיבוב כל החלקים הרלוונטיים לפי הציר המתאים
    for (let i = 0; i < children.length; i++) {
        const piece = children[i];
        const pos = piece.position;
        
        switch(layer) {
            case 'R': // ימין (x+)
                if (pos.x > 0.1) { // שייך לשכבה הימנית
                    rotatePieceAroundWorldAxis(piece, new THREE.Vector3(1, 0, 0), angle);
                }
                break;
            case 'L': // שמאל (x-)
                if (pos.x < -0.1) { // שייך לשכבה השמאלית
                    rotatePieceAroundWorldAxis(piece, new THREE.Vector3(-1, 0, 0), angle);
                }
                break;
            case 'U': // למעלה (y+)
                if (pos.y > 0.1) { // שייך לשכבה העליונה
                    rotatePieceAroundWorldAxis(piece, new THREE.Vector3(0, 1, 0), angle);
                }
                break;
            case 'D': // למטה (y-)
                if (pos.y < -0.1) { // שייך לשכבה התחתונה
                    rotatePieceAroundWorldAxis(piece, new THREE.Vector3(0, -1, 0), angle);
                }
                break;
            case 'F': // קדימה (z+)
                if (pos.z > 0.1) { // שייך לשכבה הקדמית
                    rotatePieceAroundWorldAxis(piece, new THREE.Vector3(0, 0, 1), angle);
                }
                break;
            case 'B': // אחורה (z-)
                if (pos.z < -0.1) { // שייך לשכבה האחורית
                    rotatePieceAroundWorldAxis(piece, new THREE.Vector3(0, 0, -1), angle);
                }
                break;
        }
    }
}

// פונקציית עזר לסיבוב חלק מסביב לציר העולמי
function rotatePieceAroundWorldAxis(piece, axisVector, angle) {
    // יצירת מטריצת סיבוב
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationAxis(axisVector.normalize(), angle);
    
    // שמירת המיקום הנוכחי
    const currentPos = piece.position.clone();
    
    // הפעלת הסיבוב על המיקום
    currentPos.applyMatrix4(rotationMatrix);
    
    // עדכון המיקום והסיבוב
    piece.position.copy(currentPos);
    piece.updateMatrix();
    
    // עדכון הסיבוב של החלק עצמו
    rotationMatrix.multiply(piece.matrix);
    piece.matrix.copy(rotationMatrix);
    
    // עדכון קווטרניון לפי המטריצה החדשה
    piece.rotation.setFromRotationMatrix(piece.matrix);
}

// איפוס הקוביה - החזרה למצב פתור
function resetCube(cube) {
    if (!cube) return;
    
    // יצירת קוביה חדשה במצב פתור
    const newCube = createRubiksCube();
    
    // מחיקת כל הקוביות הישנות
    while(cube.children.length > 0) { 
        cube.remove(cube.children[0]); 
    }
    
    // העברת כל הקוביות החדשות לקוביה המקורית
    while(newCube.children.length > 0) {
        const child = newCube.children[0];
        newCube.remove(child);
        cube.add(child);
    }
    
    // איפוס הסיבוב הכללי
    cube.rotation.set(0, 0, 0);
}

// ביצוע אלגוריתם הפתרון לקוביה
function solveCube(cube) {
    if (!cube) return;
    
    console.log("מפעיל פתרון אוטומטי לקוביה");
    
    // בגרסה זו אנחנו פשוט מאפסים את הקוביה (כאילו פתרנו אותה)
    resetCube(cube);
}

// עדכון קוביית הלימוד לפי השלב הנוכחי
function updateLearnCubeForStep(stepId) {
    // בגרסה מתקדמת, יעודכן מצב הקוביה לפי השלב הנוכחי
    console.log(`עדכון קוביית הלימוד לשלב ${stepId}`);
    
    // דוגמה לרוטציה קצת שונה בכל שלב (בגרסת דמו)
    if (learnCube) {
        resetCube(learnCube);
        
        switch (stepId) {
            case 1: // הכרת הקוביה
                // קוביה פתורה, בלי שינוי
                break;
            case 2: // הצלב הלבן
                // קוביה עם הצלב הלבן (הקוביה בזוית שרואים את הצלב העליון)
                learnCube.rotation.x = -Math.PI / 6;
                break;
            case 3: // שיבוץ פינות לבנות
                // קוביה עם צלב לבן + פינות
                learnCube.rotation.x = -Math.PI / 6;
                learnCube.rotation.y = Math.PI / 4;
                break;
            case 4: // שיבוץ שפות השכבה האמצעית
                // מראה את השכבה האמצעית
                learnCube.rotation.x = 0;
                learnCube.rotation.y = -Math.PI / 4;
                break;
            case 5: // יצירת צלב צהוב
                // מראה את השכבה הצהובה מלמעלה
                learnCube.rotation.x = Math.PI / 6;
                break;
            // וכן הלאה...
            default:
                // ברירת מחדל - קוביה בזוית צפייה נוחה
                learnCube.rotation.x = -Math.PI / 6;
                learnCube.rotation.y = Math.PI / 6;
        }
    }
}

// חשיפת הפונקציות לשימוש מקבצים אחרים
window.rubiksCubeUtils = {
    updateLearnCubeForStep,
    scrambleCube,
    resetCube,
    solveCube
};