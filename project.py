import os
from flask import Flask, render_template, flash, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from wtforms import BooleanField, validators, StringField, SubmitField, PasswordField
from wtforms.validators import DataRequired, Regexp, EqualTo, Email, ValidationError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin, LoginManager, login_required, login_manager, login_user, logout_user
from flask_bootstrap import Bootstrap

###########################################
##################CONFIG###################
###########################################

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.config['SECRET_KEY'] = 'hard to guess string'
app.config['SQLALCHEMY_DATABASE_URI'] =\
    'sqlite:///' + os.path.join(basedir, 'data.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bootstrap = Bootstrap(app)
login_manager = LoginManager(app)
login_manager.session_protection = 'basic'
login_manager.login_view = 'login.html'

###########################################
##################MODELS###################
###########################################

class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True)
    users = db.relationship('User', backref='role', lazy='dynamic')

    def __repr__(self):
        return '<Role %r>' % self.name


class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique = True, index = True)
    username = db.Column(db.String(64), unique=True, index=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    password_hash = db.Column(db.String(128))

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


# db.create_all()

# k = User(email='a@a.com',
#             username='asd',
#             password='123')
# db.session.add(k)
###########################################
##################VIEWS####################
###########################################

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

@app.route('/index', methods=['GET', 'POST'])
def index2():
    return render_template('index.html')

@app.route('/learn', methods=['GET', 'POST'])
def learn():
    return render_template('learn.html')

@app.route('/test')
def test():
    return render_template('test.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email = form.email.data).first()
        if user is not None and user.verify_password(form.password.data):
            login_user(user, form.remember_me.data)
            return redirect(url_for('index'))
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
    if form.validate_on_submit():
        user = User(email=form.email.data,
                    username=form.userName.data,
                    password=form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Account creation successful')
        return redirect(url_for('login'))
    return render_template('register.html', form=form)

@app.route('/account')
@login_required
def account():
    return render_template('account.html')

@app.route('/learn/selectionSort')
def selectionSort():
    return render_template('selectionSort.html')

@app.route('/learn/insertionSort')
def insertionSort():
    return render_template('insertionSort.html')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


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

###########################################
##################RUN######################
###########################################

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0', use_reloader=False, port=4000)
