const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();
app.use(bodyParser.json());
app.use(express.json()); // JSON 데이터 처리
app.use(express.urlencoded({ extended: true })); // URL-encoded 데이터 처리

// MySQL 연결 설정
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',    // MySQL 사용자명
    password: '1234', // MySQL 비밀번호
    database: 'face_recognition_db'
});

// 데이터베이스 연결
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL 연결 성공!');
});

// Static 파일 제공 (register.html, login.html 파일 포함)
app.use(express.static('face_recognition_app'));

// 기본 경로
app.get('/', (req, res) => {
    res.send('환영합니다! Face Recognition 서버입니다.');
});

// 회원가입 페이지로 이동하는 라우트
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'templates', 'register.html'));
});

// 로그인 페이지로 이동하는 라우트
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'templates', 'login.html'));
});

// 계정 페이지로 이동하는 라우트 추가
app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'templates', 'account.html'));
});

// 대시보드 페이지로 이동하는 라우트
app.get('/dashboard', (req, res) => {
    const userName = req.query.name; // 쿼리 파라미터에서 사용자 이름 가져오기
        if (!userName) {
            return res.redirect('/login'); // 사용자 이름이 없는 경우 로그인 페이지로 리다이렉트
        }
    res.sendFile(path.join(__dirname, '..', 'templates', 'dashboard.html'));
});


// 라우팅 예제
app.post('/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;


    // 폼 데이터 확인을 위한 로그 추가
        console.log('이름:', name);
        console.log('이메일:', email);
        console.log('아이디:', username);
        console.log('비밀번호:', password);


    const sql = 'INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, username, password], (err, result) => {
        if (err) throw err;
        res.send('회원가입 성공!');
    });
});
// 로그인 처리
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('로그인 중 오류 발생:', err);
            res.status(500).send('서버 오류');
        } else if (results.length > 0) {
            const userId = results[0].id; // 사용자의 ID
            const userName = results[0].name; // 사용자의 이름

            // 사용자의 과목을 가져오는 쿼리 수정
            const subjectsQuery = `
                SELECT us.user_id, s.subject_name, s.class
                FROM user_subjects us
                JOIN subjects s ON us.subject_id = s.id
                WHERE us.user_id = ?
            `;
            db.query(subjectsQuery, [userId], (err, subjects) => {
                if (err) {
                    console.error('과목 가져오기 오류:', err);
                    return res.status(500).send('서버 오류');
                }
                console.log(subjects); // 과목 정보 확인
                // 과목 목록을 대시보드에 보내기
                res.redirect(`/dashboard?name=${encodeURIComponent(userName)}&subjects=${encodeURIComponent(JSON.stringify(subjects))}`);
            });
        } else {
            res.status(401).send('로그인 실패: 사용자 이름 또는 비밀번호가 틀립니다.');
        }
    });
});



// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});