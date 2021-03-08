from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Api, Resource, reqparse
from flask_jwt_extended import (create_access_token, jwt_required, JWTManager, get_jwt_identity,
    create_refresh_token)
import pymysql
import bcrypt
from werkzeug.utils import secure_filename


db = pymysql.connect(
    user = 'root',
    passwd = 'u-Cf_z)Ka6Z7}[C?3K=;S$uPdP7-@ah6',
    host = '127.0.0.1',
    port = 3306,
    db = 'elice',
    charset = 'utf8'
)

cursor = db.cursor()

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "idontknowabout-token-cookies"
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

        query = 'SELECT email, password FROM `user` WHERE email = %s'
        cursor.execute(query, (email))
        user = cursor.fetchone()

        if user is None:
            result = {
                'status': 500
            }

            return jsonify(result)

        if bcrypt.checkpw(password.encode('utf-8'), user[1].encode('utf-8')):
            access_token = create_access_token(identity=email)
            query = 'SELECT user.id, user.email, user.fullname, b.title, b.nickname, b.mbti, b.job, u.univ_name, u.major, u.degree, u.degree_status, u.ent_date, u.grd_date, a.award_name, a.award_desc, a.award_date, p.project_name, p.str_date, p.end_date, p.project_desc, c.cert_name, c.cert_org, c.cert_date FROM `user` LEFT JOIN `basicinfo` AS b ON user.email=b.email LEFT JOIN `univ` AS u ON user.email=u.email LEFT JOIN `award` AS a ON user.email=a.email LEFT JOIN `project` AS p ON user.email=p.email LEFT JOIN `cert` AS c ON user.email=c.email WHERE user.email=%s'
            cursor.execute(query, (email, ))
            user_portfolio = cursor.fetchone()
            if user_portfolio == None:
                response = jsonify({"message": 200,
                                "token": access_token,
                                "crossCookie":"bar",
                                "SameSite": None,
                                "Secure":''})
            elif user_portfolio != None:
                response = jsonify({"message": 200,
                                "token": access_token,
                                "crossCookie":"bar",
                                "SameSite": None,
                                "Secure":'',
                                "portfolio": user_portfolio})
            return response
            
        else:
            result = {
                'message': 400
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

        query = 'SELECT id FROM `user` WHERE email = %s'
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
            access_token = create_access_token(identity=email)
            response = jsonify({"message": 200,
                                "token": access_token,
                                "crossCookie":"bar",
                                "SameSite": None,
                                "Secure":''})
            return response

@app.route('/auth/validation', methods=['GET'])
@jwt_required()
def validation():
    current_user = get_jwt_identity()
    return jsonify({'status':200,'logged_in_as':current_user})


@app.route('/main', methods=['GET', 'POST'])
@jwt_required()
def MainPage():
    current_user = get_jwt_identity()
    return jsonify({"status": 200,'logged_in_as':current_user})

@app.route('/portfolio/create', methods=['POST'])
def create():
    if request.method == 'POST':
        data = request.get_json(force=True)['body']
        lists = data.split('"')
        email = lists[3]
        portfolio_title = lists[9]
        nickname = lists[13] 
        mbti = lists[17] 
        job = lists[21] 
        univ_name = lists[27] 
        major = lists[31] 
        degree = lists[35] 
        degree_status = lists[39] 
        ent_date = lists[43] 
        grd_date = lists[47] 
        award_name = lists[53] 
        award_desc = lists[57] 
        award_date = lists[61] 
        project_name = lists[67] 
        project_desc = lists[71] 
        project_str_date = lists[75]
        project_end_date = lists[79]
        cert_name = lists[85]
        cert_org = lists[89]
        cert_date = lists[93]
        query_basicInfo = 'INSERT INTO `basicinfo` (`email`, `title`, `nickname`, `mbti`, `job`) VALUES (%s, %s, %s, %s, %s)'
        cursor.execute(query_basicInfo, (email, portfolio_title, nickname, mbti, job, ))
        db.commit()
        query_univ = 'INSERT INTO `univ` (`email`, `univ_name`, `major`, `degree`, `degree_status`, `ent_date`, `grd_date`) VALUES (%s, %s, %s, %s, %s, %s, %s)'
        cursor.execute(query_univ, (email, univ_name, major, degree, degree_status, ent_date, grd_date, ))
        db.commit()
        query_award = 'INSERT INTO `award` (`email`, `award_name`, `award_desc`, `award_date`) VALUES (%s, %s, %s, %s)'
        cursor.execute(query_award, (email, award_name, award_desc, award_date ))
        db.commit()
        query_project = 'INSERT INTO `project` (`email`, `project_name`, `str_date`, `end_date`, `project_desc`) VALUES (%s, %s, %s, %s, %s)'
        cursor.execute(query_project, (email, project_name, project_str_date, project_end_date, project_desc, ))
        db.commit()
        query_cert = 'INSERT INTO `cert` (`email`, `cert_name`, `cert_org`, `cert_date`) VALUES (%s, %s, %s, %s)'
        cursor.execute(query_cert, (email, cert_name, cert_org, cert_date, ))
        db.commit()
        result = {'message': 'Complete Sign Up, Welcome'}
        
        return result

@app.route('/edit/basic', methods=['POST'])
def EditBasic():
    if request.method == 'POST':
        data = request.get_json('body')['body']
        email = data['email']
        title = data['title']
        nickname = data['nickname']
        mbti = data['mbti']
        job = data['job']
        query = 'UPDATE `basicinfo` SET title=%s, nickname=%s, mbti=%s, jobs=%s WHERE email=%s'
        cursor.execute(query, (title, nickname, mbti, job, email, ))
        db.commit()

        return jsonify({'status': 200})

@app.route('/edit/univ', methods=['POST'])
def EditUniv():
    if request.method == 'POST':
        data = request.get_json('body')['body']
        print(data)
        email = data['email']
        name = data['name']
        major = data['major']
        degree = data['degree']
        degree_status = data['degree_status']
        entrance_date = data['entrance_date']
        graduation_date = data['graduation_date']
        query = 'UPDATE `univ` SET univ_name=%s, major=%s, degree=%s, degree_status=%s, ent_date=%s, grd_date=%s WHERE email=%s'
        cursor.execute(query, (name, major, degree, degree_status, entrance_date, graduation_date, email, ))
        db.commit()

        return jsonify({'status': 200})

@app.route('/add/univ', methods=['POST'])
def AddUniv():
    if request.method == 'POST':
        data = request.get_json('body')['body']
        print(data)
        email = data['email']
        name = data['name']
        major = data['major']
        degree = data['degree']
        degree_status = data['degree_status']
        entrance_date = data['entrance_date']
        graduation_date = data['graduation_date']
        query = 'INSERT INTO `univ` (email, univ_name, major, degree, degree_status, ent_date, grd_date) VALUES (%s, %s, %s, %s, %s, %s, %s)'
        cursor.execute(query, (email, name, major, degree, degree_status, entrance_date, graduation_date,  ))
        db.commit()

        return jsonify({'status': 200})

@app.route('/edit/award', methods=['POST'])
def EditAward():
    if request.method == 'POST':
        data = request.get_json('body')['body']
        email = data['email']
        name = data['name']
        description = data['description']
        date = data['date']
        query = 'UPDATE `award` SET award_name=%s, award_desc=%s, award_date=%s WHERE email=%s'
        cursor.execute(query, (name, description, date, email, ))
        db.commit()

        return jsonify({'status': 200})

@app.route('/add/award', methods=['POST'])
def AddAward():
    if request.method == 'POST':
        data = request.get_json('body')['body']
        email = data['email']
        name = data['name']
        description = data['description']
        date = data['date']
        query = 'INSERT INTO `award` (email, award_name, award_desc, award_date) VALUES (%s, %s, %s, %s)'
        cursor.execute(query, (email, name, description, date, ))
        db.commit()

        return jsonify({'status': 200})

@app.route('/edit/project', methods=['POST'])
def EditProject():
    if request.method == 'POST':
        data = request.get_json('body')['body']
        email = data['email']
        name = data['name']
        description = data['description']
        start_date = data['start_date']
        end_date = data['end_date']
        query = 'UPDATE `project` SET project_name=%s, project_desc=%s, str_date=%s, end_date=%s WHERE email=%s'
        cursor.execute(query, (name, description, start_date, end_date, email, ))
        db.commit()

        return jsonify({'status': 200})

@app.route('/add/project', methods=['POST'])
def AddProject():
    if request.method == 'POST':
        data = request.get_json('body')['body']
        email = data['email']
        name = data['name']
        description = data['description']
        start_date = data['start_date']
        end_date = data['end_date']
        query = 'INSERT INTO `project` (email, project_name, project_desc, str_date, end_date) VALUES (%s, %s, %s, %s, %s)'
        cursor.execute(query, (email, name, description, start_date, end_date, ))
        db.commit()

        return jsonify({'status': 200})

@app.route('/edit/cert', methods=['POST'])
def EditCert():
    if request.method == 'POST':
        data = request.get_json('body')['body']
        email = data['email']
        name = data['name']
        organization = data['organization']
        date = data['date']
        query = 'UPDATE `cert` SET cert_name=%s, cert_org=%s, cert_date=%s WHERE email=%s'
        cursor.execute(query, (name, organization, date, email, ))
        db.commit()

        return jsonify({'status': 200})

@app.route('/add/cert', methods=['POST'])
def AddCert():
    if request.method == 'POST':
        data = request.get_json('body')['body']
        email = data['email']
        name = data['name']
        organization = data['organization']
        date = data['date']
        query = 'INSERT INTO `cert` (email, cert_name, cert_org, cert_date) VALUES (%s, %s, %s, %s)'
        cursor.execute(query, (email, name, organization, date, ))
        db.commit()

        return jsonify({'status': 200})


@app.route('/portfolio/cert', methods=['GET'])
@jwt_required()
def create_cert():
    current_user = get_jwt_identity()
    query = 'SELECT id, fullname FROM `user` WHERE email = %s'
    cursor.execute(query, (current_user, ))
    user_info = cursor.fetchone()
    return jsonify({'status': 200, 'logged_in_as': current_user, 'userinfo': user_info})

@app.route('/portfolio/read')
@jwt_required()
def read():
    current_user = get_jwt_identity()
    query = 'SELECT user.id, user.email, user.fullname, b.title, b.nickname, b.mbti, b.job, u.univ_name, u.major, u.degree, u.degree_status, u.ent_date, u.grd_date, a.award_name, a.award_desc, a.award_date, p.project_name, p.str_date, p.end_date, p.project_desc, c.cert_name, c.cert_org, c.cert_date FROM `user` LEFT JOIN `basicinfo` AS b ON user.email=b.email LEFT JOIN `univ` AS u ON user.email=u.email LEFT JOIN `award` AS a ON user.email=a.email LEFT JOIN `project` AS p ON user.email=p.email LEFT JOIN `cert` AS c ON user.email=c.email WHERE user.email!=%s'
    cursor.execute(query,(current_user,))
    data = cursor.fetchall()
    return jsonify({'portfolio': data,
        'status':200})

@app.route('/portfolio/racer', methods=['POST'])
def racer():
    if request.method == 'POST':
        racer_email = request.get_json('email')['email']
        print(racer_email)
        query_user = 'SELECT user.id, user.email, user.fullname, b.title, b.nickname, b.mbti, b.job FROM `user` LEFT JOIN `basicinfo` AS b ON user.email=b.email WHERE user.email=%s'
        query_univ = 'SELECT * FROM `univ` WHERE email=%s'
        query_award = 'SELECT * FROM `award` WHERE email=%s'
        query_project = 'SELECT * FROM `project` WHERE email=%s'
        query_cert = 'SELECT * FROM `cert` WHERE email=%s'
        cursor.execute(query_user, (racer_email, ))
        user = cursor.fetchone()
        cursor.execute(query_univ, (racer_email, ))
        univ = cursor.fetchall()
        cursor.execute(query_award, (racer_email, ))
        award = cursor.fetchall()
        cursor.execute(query_project, (racer_email, ))
        project = cursor.fetchall()
        cursor.execute(query_cert, (racer_email, ))
        cert = cursor.fetchall()
        
        return jsonify({'portfolio': {
            'user': user,
            'univ': univ,
            'award': award,
            'project': project,
            'cert': cert
        },'status': 200})




@app.route('/portfolio/main', methods=['GET','POST'])
@jwt_required()
def main():
    if request.method == 'GET':
        current_user = get_jwt_identity()
        query = 'SELECT user.id, user.email, user.fullname, b.title, b.nickname, b.job, FROM `user` LEFT JOIN `basicinfo` AS b ON user.email=b.email WHERE user.email=%s'
        cursor.execute(query, (current_user, ))
        data = cursor.fetchone()
        return jsonify(data)

@app.route('/user/img', methods=['POST'])
def upload():
    if request.method == 'POST':
        f = request.files['file']
        email = request.form['body'].split('"')[3]
        query = 'SELECT id FROM `user` WHERE email = %s'
        cursor.execute(query, (email, ))
        user_id = str(cursor.fetchone()[0])
        f.save('frontend/public/static/images/avatar/'+secure_filename("{}.jpg".format(user_id)))
        img_src = "/static/images/avatar/{}.jpg".format(user_id)
        return jsonify({'status': 200,
            'img_src': img_src})

@app.route('/myportfolio/load')
@jwt_required()
def myPortfolioLoad():
    current_user = get_jwt_identity()
    query_user = 'SELECT user.id, user.email, user.fullname, b.title, b.nickname, b.mbti, b.job FROM `user` LEFT JOIN `basicinfo` AS b ON user.email=b.email WHERE user.email=%s'
    query_univ = 'SELECT * FROM `univ` WHERE email=%s'
    query_award = 'SELECT * FROM `award` WHERE email=%s'
    query_project = 'SELECT * FROM `project` WHERE email=%s'
    query_cert = 'SELECT * FROM `cert` WHERE email=%s'
    cursor.execute(query_user, (current_user, ))
    user = cursor.fetchone()
    cursor.execute(query_univ, (current_user, ))
    univ = cursor.fetchall()
    cursor.execute(query_award, (current_user, ))
    award = cursor.fetchall()
    cursor.execute(query_project, (current_user, ))
    project = cursor.fetchall()
    cursor.execute(query_cert, (current_user, ))
    cert = cursor.fetchall()
    
    return jsonify({'portfolio': {
        'user': user,
        'univ': univ,
        'award': award,
        'project': project,
        'cert': cert
    }, 'status': 200})


if __name__ == '__main__':
    app.run(debug=True)
        
