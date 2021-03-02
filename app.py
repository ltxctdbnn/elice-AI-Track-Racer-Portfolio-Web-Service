from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Api, Resource, reqparse
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import set_access_cookies
import pymysql
import bcrypt


db = pymysql.connect(
    user = 'root',
    passwd = 'rmstkd145',
    host = '127.0.0.1',
    port = 3306,
    db = 'elice',
    charset = 'utf8'
)

cursor = db.cursor()

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "fucking-token-cookies"
# 쿠키 활성화
app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
# HTTPS가 아니여도 쿠키를 사용할 수 있도록 허용
app.config["JWT_COOKIE_SECURE"] = False

jwt = JWTManager(app)
CORS(app, supports_credentials=True)

@app.route('/auth/sign-in', methods=['GET','POST'])
def SignIn():
    if request.method == 'POST':
        data = request.get_json(force=True)['body']
        email = data.split('"')[3]
        password = data.split('"')[7]

        query = 'SELECT email, password FROM user WHERE email = %s'
        cursor.execute(query, (email))
        user = cursor.fetchone()

        if user is None:
            result = {
                'status': 500
            }

            return jsonify(result)

        if bcrypt.checkpw(password.encode('utf-8'), user[1].encode('utf-8')):
            access_token = create_access_token(identity=email)
            response = jsonify({"message": 200,
                                "token": access_token,
                                "crossCookie":"bar",
                                "SameSite": None,
                                "Secure":''})
            set_access_cookies(response, access_token)

            return response
            
        else:
            result = {
                'status': 'invaild'
            }

            return jsonify(result)

@app.route('/auth/sign-up', methods=['GET', 'POST'])
def SignUp():
    if request.method == 'POST':
        data = request.get_json(force=True)['body']
        email = data.split('"')[3]
        fullname = data.split('"')[7]
        password = bcrypt.hashpw(data.split('"')[11].encode('utf-8'), bcrypt.gensalt())

        error = None

        if not fullname:
            error = "이름을 입력해주세요"
        elif not email:
            error = "이메일을 입력해주세요"
        elif not password:
            error = "비밀번호를 입력해주세요"

        query = 'SELECT id FROM user WHERE email = %s'
        cursor.execute(query, (email))
        data = cursor.fetchone()

        if data is not None:
            error = '{}은 이미 등록된 계정입니다.'.format(email)
            result = {
                'message': error
            }
            
            return jsonify(result)

        if error is None:
            query = "INSERT INTO `user` (`fullname`, `email`, `password`) VALUES (%s, %s, %s)"
            cursor.execute(query, (fullname, email, password))
            db.commit()
            result = {'message': 'Complete Sign Up, Welcome'}

            return jsonify(result)

@app.route('/auth/validation', methods=['GET'])
@jwt_required()
def validation():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user)


@app.route('/main', methods=['GET', 'POST'])
@jwt_required()
def MainPage():
    return jsonify({"status": "success"})

@app.route('/portfolio/create', methods=['GET','POST'])
def create():
    if request.method == 'POST':
        data = request.get_json(force=True)['body']
        lists = data.split('"')
        email = lists[3]
        univ_name = lists[9]
        univ_major = lists[13] 
        univ_degree = lists[17] 
        univ_degree_status = lists[21] 
        univ_entrance_date = lists[25] 
        univ_graduation_date = lists[29] 
        award_name = lists[35] 
        award_description = lists[39] 
        award_date = lists[43] 
        project_name = lists[49] 
        project_description = lists[53] 
        project_start_date = lists[57] 
        project_end_date = lists[61] 
        certification_name = lists[67] 
        certification_organization = lists[71] 
        certification_date = lists[75]
        query = 'INSERT INTO `portfolio` (`email`, `univ_name`, `univ_major`, `univ_degree`, `univ_degree_status`, `univ_entrance_date`, `univ_graduation_date`, `award_name`, `award_description`, `award_date`, `project_name`, `project_description`, `project_start_date`, `project_end_date`, `certification_name`, `certification_organization`, `certification_date`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'
        cursor.execute(query, (email, univ_name, univ_major, univ_degree, univ_degree_status, univ_entrance_date, univ_graduation_date, award_name, award_description, award_date, project_name, project_description, project_start_date, project_end_date, certification_name, certification_organization, certification_date))
        db.commit()
        result = {'message': 'Complete Sign Up, Welcome'}
        
        return result

@app.route('/portfolio/main', methods=('GET','POST'))
def read():
    if request.method == 'GET':
        query = 'SELECT * FROM portfolio'
        cursor.execute(query)
        data = cursor.fetchone()
        return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
        