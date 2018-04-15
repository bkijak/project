import os
from flask import Flask, render_template, flash, redirect, url_for, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from wtforms import BooleanField, validators, StringField, SubmitField, PasswordField, TextAreaField
from wtforms.validators import DataRequired, Regexp, EqualTo, Email, ValidationError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin, LoginManager, login_required, login_manager, login_user, logout_user, current_user
from flask_bootstrap import Bootstrap
import json, time, datetime

###########################################
##################CONFIG###################
###########################################

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.config['SECRET_KEY'] = 'abcdefg12345'
app.config['SQLALCHEMY_DATABASE_URI'] =\
    'sqlite:///' + os.path.join(basedir, 'data.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bootstrap = Bootstrap(app)
login_manager = LoginManager(app)
login_manager.session_protection = 'basic'
login_manager.login_view = 'login'

###########################################
#############DATABSE MODELS################
###########################################

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique = True, index = True)
    username = db.Column(db.String(64), index=True)
    password_hash = db.Column(db.String(128))
    avatar_link = db.Column(db.String(255))
    date = db.Column(db.String(64))
    is_admin = db.Column(db.Boolean)
    tests = db.relationship('Test', backref='user', lazy='dynamic')
    discussions = db.relationship('Discussion', backref='user', lazy='dynamic')

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<User %r>' % self.username

class Test(db.Model):
    __tablename__ = 'tests'
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.datetime.now)
    percentage = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_name = db.Column(db.Text)
    questions = db.relationship('Question', backref='test', lazy='dynamic')

class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.Integer, primary_key=True)
    question_number = db.Column(db.Integer)
    question = db.Column(db.Text)
    correct_answer = db.Column(db.Text)
    user_answer = db.Column(db.Text)
    correct = db.Column(db.Boolean)
    test_id = db.Column(db.Integer, db.ForeignKey('tests.id'))

class Discussion(db.Model):
    __tablename__ = 'discussions'
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.datetime.now)
    topic = db.Column(db.Text)
    context = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_name = db.Column(db.Text)
    comments = db.relationship('Comment', backref='discussion', lazy='dynamic')

class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.datetime.now)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_name = db.Column(db.Text)
    comment_body = db.Column(db.Text)
    discussion_id = db.Column(db.Integer, db.ForeignKey('discussions.id'))
    admin_answer = db.Column(db.Boolean)

# db.create_all()

###########################################
##################VIEWS####################
###########################################

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

@app.route('/learn', methods=['GET', 'POST'])
def learn():
    return render_template('learn.html')

@app.route('/test', methods=['GET', 'POST'])
def test():
    if request.method == 'POST':
        if current_user.is_authenticated:
            userName = current_user.username
            questions = request.get_json()
            correct = 0
            for i in range(0, 10):
                if questions[i]['correct'] == 1:
                    correct += 1

            test = Test(percentage = correct*10,
                        user = current_user._get_current_object(),
                        user_name = userName)
            db.session.add(test)
            db.session.flush()
            db.session.refresh(test)
            currentTestID = test.id
            db.session.commit()

            for i in range(0, 10):
                questionNumber = questions[i]['questionNumber']
                question = questions[i]['question']
                correctAnswer = questions[i]['answer']
                userAnswer = questions[i]['userAnswer']
                isCorrect = questions[i]['correct']

                question = Question(question_number = questionNumber,
                                    question = question,
                                    correct_answer = correctAnswer,
                                    user_answer = userAnswer,
                                    correct = isCorrect,
                                    test_id = currentTestID)
                db.session.add(question)
                db.session.commit()

            return render_template('test.html')
        else:
            return render_template('test.html')

    if request.method == 'GET':
        return render_template('test.html')

@app.route('/discussion', methods=['GET', 'POST'])
@login_required
def discussion():
    form = DiscussionForm()
    discussions = Discussion.query.all()
    if form.validate_on_submit():
        discussion = Discussion(topic = form.topic.data,
                                context = form.context.data,
                                user_id = current_user.id,
                                user_name = current_user.username)
        db.session.add(discussion)
        db.session.commit()
        flash('discussion submitted')
        return redirect(url_for('discussion'))

    return render_template('discussion.html', form=form, discussionList=discussions)

@app.route('/discussion/topic/<discussionID>', methods=['GET', 'POST'])
def viewTopic(discussionID):
    discussion = Discussion.query.filter_by(id=discussionID).first()
    form = CommentForm()
    comments = db.session.query(Comment).filter_by(discussion_id = discussionID).all()
    commentInfo = []
    for comment in comments:
        id = comment.id
        timestamp = comment.timestamp
        userID = comment.user_id
        userName = comment.user_name
        commentBody = comment.comment_body
        adminAnswer = comment.admin_answer

        a = CommentObj(id, timestamp, userID, userName, commentBody, adminAnswer)
        commentInfo.append(a)

    if form.validate_on_submit():
        adminAnswer = current_user.is_admin
        comment = Comment(user_id = current_user.id,
                          user_name = current_user.username,
                          comment_body = form.comment.data,
                          discussion_id = discussionID,
                          admin_answer = adminAnswer)
        db.session.add(comment)
        db.session.commit()
        flash('comment submitted')
        return redirect(url_for('viewTopic', discussionID=discussionID ))

    return render_template('topic.html', discussion=discussion, commentInfo = commentInfo, form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email = form.email.data).first()
        if user is not None and user.verify_password(form.password.data):
            login_user(user, form.remember_me.data)
            return redirect(url_for('account'))
        flash('Please provide a valid email or password')
    return render_template('login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('See you soon!')
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    date = time.strftime("%d/%m/%Y")
    admin = 0;
    if form.validate_on_submit():
        user = User(email=form.email.data,
                    username=form.userName.data,
                    password=form.password.data,
                    date=date,
                    is_admin = admin)
        db.session.add(user)
        db.session.commit()
        flash("Student account created")
        return redirect(url_for('login'))
    return render_template('register.html', form=form)

@app.route('/register_admin', methods=['GET', 'POST'])
def register_admin():
    with open('pass.txt', 'r') as myfile:
        adminPass=myfile.read()
    form = RegisterFormAdmin()
    date = time.strftime("%d/%m/%Y")
    if form.validate_on_submit():
        if form.adminPassword.data == adminPass:
            admin = 1
            user = User(email=form.email.data,
                        username=form.userName.data,
                        password=form.password.data,
                        date=date,
                        is_admin = admin)
            db.session.add(user)
            db.session.commit()
            return redirect(url_for('login'))
            flash('Administrator account created')
        else:
            flash('Invalid administrator password')

    return render_template('register_admin.html', form=form)

@app.route('/account', methods=['GET', 'POST'])
@login_required
def account():
    form = ChangePassForm()
    form2 = ChangeAvatarForm()
    if form.validate_on_submit():
        if current_user.verify_password(form.currPass.data):
            current_user.password = form.newPass.data
            db.session.add(current_user)
            db.session.commit()
            flash('Password changed successfully')
            return redirect(url_for('account'))
        else:
            flash('Invalid current password')
    if form2.validate_on_submit():
        current_user.avatar_link = form2.imageLink.data
        db.session.add(current_user)
        db.session.commit()
        flash('Avatar changed successfully')
        return redirect(url_for('account'))

    tests = db.session.query(Test).filter_by(user_id=current_user.id).all()
    testInfo = []
    for test in tests:
        id = test.id
        timestamp = test.timestamp
        percentage = test.percentage
        user_id = test.user_id
        user_name = test.user_name
        a = TestObj(id, timestamp, percentage, user_id, user_name)
        testInfo.append(a)


    users = db.session.query(User).filter_by(is_admin=0).all()
    userList = []
    for user in users:
        id = user.id
        email = user.email
        username = user.username
        date_created = user.date
        b = UserObj(id, email, username, date_created)
        userList.append(b)

    testInfo.reverse()
    userList.reverse()
    return render_template('account.html', pass_form=form, avatar_form=form2, tests1=testInfo, users1 = userList)


@app.route('/account/view_test/<testID>', methods=['GET', 'POST'])
@login_required
def loadTest(testID):
    test = Test.query.filter_by(id=testID).first()
    if test is None:
        abort(404)
    if current_user.is_admin == 0:
        if current_user.id != test.user_id:
            abort(403)

    questions = db.session.query(Question).filter_by(test_id = testID).all()
    questionInfo = []
    for question in questions:
        id = question.id
        question_number = question.question_number
        questionDetails = question.question
        correct_answer = question.correct_answer
        user_answer = question.user_answer
        correct = question.correct
        a = QuestionObj(id, question_number, questionDetails, correct_answer, user_answer, correct)
        questionInfo.append(a)

    return render_template('accountTest.html', test=test, questions1=questionInfo)


@app.route('/account/view_user/<userID>', methods=['GET', 'POST'])
@login_required
def loadUser(userID):
    user = User.query.filter_by(id=userID).first()
    if user is None:
        abort(404)
    if current_user.is_admin == 0:
        abort(403)

    tests = db.session.query(Test).filter_by(user_id=userID)
    testList = []
    for test in tests:
        id = test.id
        timestamp = test.timestamp
        percentage = test.percentage
        user_id = test.user_id
        user_name = test.user_name
        a = TestObj(id, timestamp, percentage, user_id, user_name)
        testList.append(a)

    testList.reverse()
    return render_template('userTests.html', userViewed=user, tests2=testList)

@app.route('/learn/selectionSort')
def selectionSort():
    return render_template('selectionSort.html')

@app.route('/learn/insertionSort')
def insertionSort():
    return render_template('insertionSort.html')

@app.route('/learn/binaryAddition')
def binaryAddition():
    return render_template('binaryAddition.html')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(403)
def page_not_found(e):
    return render_template('403.html'), 403

#############################################
##################CLASSES####################
#############################################

class TestObj:
    def __init__(self, id, timestamp, percentage, user_id, user_name):
        self.id = id
        self.timestamp = timestamp
        self.percentage = percentage
        self.user_id = user_id
        self.user_name = user_name

    def __str__(self):
        return  str(self.__class__) + '\n'+ '\n'.join(('{} = {}'.format(item, self.__dict__[item]) for item in self.__dict__))

class QuestionObj:
    def __init__(self, id, question_number, question, correct_answer, user_answer, correct):
        self.id = id
        self.question_number = question_number
        self.question = question
        self.correct_answer = correct_answer
        self.user_answer = user_answer
        self.correct = correct

    def __str__(self):
        return  str(self.__class__) + '\n'+ '\n'.join(('{} = {}'.format(item, self.__dict__[item]) for item in self.__dict__))

class UserObj:
    def __init__(self, id, email, username, date_created):
        self.id = id
        self.email = email
        self.username = username
        self.date_created = date_created

    def __str__(self):
        return  str(self.__class__) + '\n'+ '\n'.join(('{} = {}'.format(item, self.__dict__[item]) for item in self.__dict__))

class CommentObj:
    def __init__(self, id, timestamp, user_id, user_name, comment_body, admin_answer):
        self.id = id
        self.timestamp = timestamp
        self.user_id = user_id
        self.user_name = user_name
        self.comment_body = comment_body
        self.admin_answer = admin_answer

    def __str__(self):
        return  str(self.__class__) + '\n'+ '\n'.join(('{} = {}'.format(item, self.__dict__[item]) for item in self.__dict__))

def myconverter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__()




###########################################
##################FORMS####################
###########################################

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Keep me signed in')
    submit = SubmitField('Submit')

class RegisterForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    userName = StringField('First name and last name', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired(),
                                                    EqualTo('passwordVal', message='Passwords must match')])
    passwordVal = PasswordField('Confirm password', validators=[DataRequired()])
    submit = SubmitField('Register')

    def validate_email(self, field):
        if User.query.filter_by(email=field.data).first():
            raise ValidationError('Email already in use.')

    def validate_userName(self, field):
        if User.query.filter_by(username=field.data).first():
            raise ValidationError('User name already in use')

class RegisterFormAdmin(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    userName = StringField('First name and last name', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired(),
                                                    EqualTo('passwordVal', message='Passwords must match')])
    passwordVal = PasswordField('Confirm password', validators=[DataRequired()])
    adminPassword = PasswordField('Administrator password', validators=[DataRequired()])
    submit = SubmitField('Register')

    def validate_email(self, field):
        if User.query.filter_by(email=field.data).first():
            raise ValidationError('Email already in use.')

    def validate_userName(self, field):
        if User.query.filter_by(username=field.data).first():
            raise ValidationError('User name already in use')

class ChangePassForm(FlaskForm):
    currPass = PasswordField('Current password', validators=[DataRequired()])
    newPass = PasswordField('New password', validators=[DataRequired(),
                                                        EqualTo('newPassConf', message='New passwords must match')])
    newPassConf = PasswordField('Confirm new password', validators=[DataRequired()])
    submit = SubmitField('Change password')

class ChangeAvatarForm(FlaskForm):
    imageLink = StringField('Image link', validators=[DataRequired()])
    submitImg = SubmitField('Submit');

class DiscussionForm(FlaskForm):
    topic = StringField('Topic', validators=[DataRequired()])
    context = TextAreaField('Context', validators=[DataRequired()])
    submit = SubmitField('Submit')

class CommentForm(FlaskForm):
    comment = TextAreaField('Comment', validators=[DataRequired()])
    submit = SubmitField('Submit')

###########################################
##################RUN######################
###########################################

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0', use_reloader=False, port=4000)
