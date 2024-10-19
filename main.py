from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)

@app.route('/login')
def home():
    # 로그인 상태를 확인하는 조건을 추가하세요.
    is_logged_in = False  # 이 값을 로그인 상태에 따라 True 또는 False로 설정하세요.

    if is_logged_in:
        return render_template('dashboard.html')  # 로그인한 경우 대시보드로 리다이렉트
    else:
        return render_template('login.html')  # 로그인하지 않은 경우 로그인 페이지 렌더링

@app.route('/register')
def register():
    return render_template('register.html')  # 회원가입 페이지 렌더링

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')  # 대시보드 페이지 렌더링

@app.route('/account')
def account():
    return render_template('account.html')  # 계정 페이지 렌더링

@app.route('/calendar')
def calendar():
    return render_template('calendar.html')  # 캘린더 페이지 렌더링

@app.route('/attendance')
def attendance():
    return render_template('attendance.html')  # 출결 페이지 렌더링

@app.route('/attendancecheck')
def attendancecheck():
    return render_template('attendancecheck.html')  # 출결 페이지 렌더링

@app.route('/studentlist')
def studentlist():
    return render_template('studentlist.html')  # 학생 조회 페이지 렌더링

@app.route('/base')
def base():
    return render_template('base.html')  # nav바 페이지 렌더링


if __name__ == '__main__':
    app.run(debug=True)
