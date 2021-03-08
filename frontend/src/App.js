import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { TextField, Avatar, Grid, Paper, makeStyles, InputLabel, FormControl, 
  Input, MenuItem, Select, IconButton, Icon, OutlinedInput, Box, Button, fade } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import CreateIcon from '@material-ui/icons/Create';
import AddIcon from '@material-ui/icons/Add';
import Modal from 'react-bootstrap/Modal'
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';


axios.defaults.baseURL = `http://localhost:5000`;
axios.defaults.withCredentials = true;

export default function App() {
  const history = useHistory();

  return (
  <Router>
    <Switch>
      <Route exact path='/' component={SignIn} />
      <Route path="/sign-up" component={SignUp} />
      <Route path="/main" component={MainPage} />
      <Route path="/myPortfolio" component={MyPortfolio} />
      <Route path='/registerPortfolio' component={RegisterPortfolio} />
      <Route path='/racer' component={Racer} />
    </Switch>
  </Router>
  );
}

function NavHome() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/"}>elice Racer's Portfolio</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-up"}>Sign Up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  );
}

function NavSignUp() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/"}>elice Racer's Portfolio</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/"}>Sign In</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  );
}

function NavMainPage() {  
  function SignOut() {
    sessionStorage.clear();
    window.location.replace('/');
  }
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/main"}>elice Racer's Portfolio</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/myPortfolio"}>
                  <a onClick={toMyportfolio}>내 포트폴리오</a></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to='/'>
                  <a onClick={SignOut}>Sign Out</a></Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  );
}

function NavMyPortfolio() {  
  const history = useHistory();
  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/main"}>
            <a onClick={(e)=>{window.location.replace('/main')}}>elice Racer's Portfolio</a></Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link"><a onClick={(e)=>{window.location.replace('/main')}}>레이서 찾기</a></Link>
              </li>
              <li className="nav-item">
              <Link className="nav-link" to='/'>
                  <a onClick={SignOut}>Sign Out</a></Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  );
}

function NavRegisterPortfolio() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand">elice Racer's Portfolio</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          </div>
        </div>
      </nav>
  );
}

function SignIn() {
  const url = 'http://127.0.0.1:5000';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();


  const onChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const onChangePassword = (e) => {
    setPassword(e.target.value)
  }
  

 
  const info = {
    'email': email,
    'password': password
  };
  const [loginError, setLoginError] = useState(<></>);

  async function sendLogInfo(e) {
    e.preventDefault();
    await axios.post(url+'/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify(info),
      withCredentials: true,
    }).then(response => {if (response.data.status === 500) { alert("please login")} else if (response.data.message === 200) {
                      console.log(response)
                      sessionStorage.setItem('accessToken', response.data.token);
                      sessionStorage.setItem('portfolio', response.data.portfolio);
                      if (sessionStorage.getItem('portfolio') != 'undefined') {
                        window.location.replace('/main')
                      } else if (sessionStorage.getItem('portfolio') === 'undefined') {
                      window.location.replace('/registerPortfolio')
                      }
                    } else if (response.data.message === 400) {
                      alert("비밀번호가 일치하지 않습니다!")
                    }
                  }).catch(error => {
                      
                  }
                  )
                  
  }
  

  return (
    <div className="App">
      <Route path="/" component={NavHome} />
    <div className="outer">
    <div className="inner">
      <form>
          <h3>Log in</h3>
          <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" placeholder="Email을 입력해주세요" name="email" value={email} onChange={onChangeEmail} />
          </div>

          <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" placeholder="Password를 입력해주세요" name="password" value={password} onChange={onChangePassword} />
          </div>
          {}
          <div className="form-group">
              <div className="custom-control custom-checkbox">
                  <input type="checkbox" className="custom-control-input" id="customCheck1" />
              </div>
          </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block" onClick={sendLogInfo}>Sign In</button><br/>
          <p>아직 가입하지 않으셨나요?</p>
          <Link to="/sign-up">
            <button className="btn btn-secondary btn-lg btn-block">Sign Up</button>
          </Link>
      </form>
    </div>
    </div>
    </div>
  );
}



function SignUp() {
  const url = 'http://127.0.0.1:5000/auth/sign-up';
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [password_check, setPassword_check] = useState('');
  
  const history = useHistory();


  const onChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const onChangeFullname = (e) => {
    setFullname(e.target.value)
  }

  const onChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const onChangePassword_check = (e) => {
    setPassword_check(e.target.value)
  }

  async function sendSignUpInfo(e) {
    if (password === password_check) {
    e.preventDefault()
    const info = {
      'email': email,
      'fullname': fullname,
      'password': password
    };
    console.log(info)
    await axios.post(url, {method: 'POST',
                    body: JSON.stringify(info)
                    }).then(response => {if (response.data.status === 500) { 
                      alert("에러가 발생하였습니다.")} else if (response.data.message === 200) {
                      sessionStorage.setItem('accessToken', response.data.token)
                      console.log(response)
                      if (sessionStorage.getItem['accessToken'] !== null) {
                        window.location.replace('/registerPortfolio')
                      }
                    }}).catch(error => {
                    alert(error)
                  })
  
} else {
  alert('비밀번호를 다시 확인해주세요')
  e.preventDefault();
}
}


  return (
    <div className="App">
      <Route path="/sign-up" component={NavSignUp} />
    <div className="outer">
    <div className="inner">
    <form>
        <h3>Register</h3>

        <div className="form-group">
            <label>Name</label>
            <input type="text" className="form-control" placeholder="이름을 입력해주세요" name="fullname" value={fullname} onChange={onChangeFullname} />
        </div>

        <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" placeholder="Email을 입력해주세요" name="email" value={email} onChange={onChangeEmail} />
        </div>

        <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Password를 입력해주세요" name="password" value={password} onChange={onChangePassword} />
        </div>
        <div className="form-group">
            <label>Password 재입력</label>
            <input type="password" className="form-control" placeholder="Password를 한 번 더 입력해주세요" name="password_check" value={password_check} onChange={onChangePassword_check} />
        </div>
        <Link to="/">
          <button type="submit" className="btn btn-primary btn-lg btn-block" onClick={sendSignUpInfo}>Register</button>
        </Link>
        <p className="forgot-password text-right">
            Already registered <a href="/">log in?</a>
        </p>
    </form>
    </div>
    </div>
    </div>
  );
}

function SignOut() {
  sessionStorage.clear()
  window.location.replace('/')
}

function toMyportfolio() {
  window.location.replace('/myPortfolio')
}

function RegisterPortfolio() {
  const url = 'http://127.0.0.1:5000/portfolio/create';
  const history = useHistory();
  const [loginStatus, setLoginStatus] = useState(false)
  const accessToken = sessionStorage.getItem("accessToken");
  
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const handleChange_portfolio_title = (e) => {
    setPortfolioTitle(e.target.value)
  }
  const [nickname, setNickname] = useState('');
  const handleChange_nickname = (e) => {
    setNickname(e.target.value)
  };
  const [mbti, setMBTI] = useState('');
  const handleChange_mbti = (e) => {
    setMBTI(e.target.value)
  };
  const [job, setJob] = useState('');
  const handleChange_job = (e) => {
    setJob(e.target.value)
  };

  const [univ_name, setUniv_name] = useState('');
  const handleChange_univ_name = (e) => {
    setUniv_name(e.target.value)
  };
  const [univ_major, setUniv_major] = useState('');
  const handleChange_univ_major = (e) => {
    setUniv_major(e.target.value)
  };
  const [univ_degree, setUniv_degree] = useState('');
  const handleChange_univ_degree = (e) => {
    setUniv_degree(e.target.value)
  };
  const [univ_degree_status, setUniv_degree_status] = useState('');
  const handleChange_univ_degree_status = (e) => {
    setUniv_degree_status(e.target.value)
  };
  const [univ_entrance_date, setUniv_entrance_date] = useState(new Date());
  const handleChange_univ_entrance_date = (date) => {
    setUniv_entrance_date(date)
  };
  const [univ_graduation_date, setUniv_graduation_date] = useState(new Date());
  const handleChange_univ_graduation_date = (date) => {
    setUniv_graduation_date(date)
  };
  const [award_name, setAward_name] = useState('');
  const handleChange_award_name = (e) => {
    setAward_name(e.target.value)
  };
  const [award_description, setAward_description] = useState('');
  const handleChange_award_description = (e) => {
    setAward_description(e.target.value)
  };
  const [award_date, setAward_date] = useState(new Date());
  const handleChange_award_date = (date) => {
    setAward_date(date)
  };
  const [project_name, setProject_name] = useState('');
  const handleChange_project_name = (e) => {
    setProject_name(e.target.value)
  }
  const [project_description, setProject_description] = useState('');
  const handleChange_project_description = (e) => {
    setProject_description(e.target.value)
  }
  const [project_start_date, setProject_start_date] = useState(new Date());
  const handleChange_project_start_date = (date) => {
    setProject_start_date(date)
  }
  const [project_end_date, setProject_end_date] = useState(new Date());
  const handleChange_project_end_date = (date) => {
    setProject_end_date(date)
  }
  const [certification_name, setCertification_name] = useState('');
  const handelChange_certification_name = (e) => {
    setCertification_name(e.target.value)
  }
  const [certification_organization, setCertification_organization] = useState('');
  const handleChange_certification_organization = (e) => {
    setCertification_organization(e.target.value)
  }
  const [certification_date, setCertification_date] = useState(new Date());
  const handelChange_certification_date = (date) => {
    setCertification_date(date)
  }

  async function SavePortfolio(e) {
    e.preventDefault()
    const basicInfo = {
      title: portfolioTitle,
      nickname: nickname,
      mbti: mbti,
      hope: job
    }
    const university  = {
      name: univ_name,
      major: univ_major,
      degree: univ_degree,
      degree_status: univ_degree_status,
      entrance_date: univ_entrance_date,
      graduation_date: univ_graduation_date
    };
    const award = {
      name: award_name,
      description: award_description,
      date: award_date
    };
    const project = {
      name: project_name,
      description: project_description,
      start_date: project_start_date,
      end_date: project_end_date
    };
    const certification = {
      name: certification_name,
      organization: certification_organization,
      date: certification_date
    };
    console.log(university,award,project,certification)
    
    await axios.post('http://localhost:5000/portfolio/create', {
      body: JSON.stringify({
        email: sessionStorage.getItem('email'),
        basicInfo: basicInfo,
        university: university,
        award: award,
        project: project,
        certification: certification
      }),
      withCredentials: true,
    })
    sessionStorage.clear();
    window.location.replace('/');
  }

  function goingHome() {
    sessionStorage.clear();
    window.location.replace('/')
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'left',
      color: theme.palette.text.primary,
      fontSize: '18px'
    },
    large: {
      width: theme.spacing(30),
      height: theme.spacing(30),
    }
  }));

  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [user_id, setUser_id] = useState('');
  const [img, setImg] = useState(null);
  const formData = new FormData();
  const [filename, setFilename] = useState('');
  const [img_src, setImg_src] = useState('');
    const imgUpload = (e) => {
      setImg(e.target.files[0]);
      console.log(img)
      formData.append('file', img);
      formData.append('body', JSON.stringify({'email': sessionStorage.getItem('email')}));
      console.log(accessToken)
      const Upload = async() => {
        const result = await axios.post('http://localhost:5000/user/img', formData);
        console.log(result)
        setImg_src(result.data.img_src)
    }
    Upload();
  }
  
  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    const fetchData = async() => {
      try {
        const result = await axios.get("http://localhost:5000/portfolio/cert", {
          headers: {
          Authorization: `Bearer ${accessToken}`,
        },
    });
    console.log(result)
    setFilename(result.data.userinfo[0]);

    if (result.status === 200) {
      setLoginStatus(true)
      setUsername(result.data.userinfo[1])
      setUser_id(result.data.userinfo[0])
      console.log(result)
      sessionStorage.setItem('email', result.data.logged_in_as)
    }
  } catch(error) {
    console.log(error)
    }
  };
  fetchData();
    },[]);
  if (loginStatus === true) {
    const img_src = "/static/images/avatar/"+user_id+".jpg";
    return (
      <div className="App">
        <Route path="/registerPortfolio" component={NavRegisterPortfolio} />
          <Grid item xs={12} container direction="row" justify="center" alignItems="center" style={{ marginTop: '10rem' }}>
            <Col item xs={2}><Container></Container></Col>
            <Col>
            <Container>
            <Paper className={classes.paper}>
              <Grid style={{ marginBottom: '3rem' }}>
              <Grid container direction='row' justify='space-between' alignItems='baseline' spacing={1} >
                    <Box style={{ marginLeft:'0.5rem' }}> hellow {username}🧑🏻‍👋🏻</Box>
                  </Grid>
                  <hr></hr>
                  <br/>
                <Row>
                  <TextField id="outlined-basic" placeholder="포트폴리오 제목을 입력해주세요" variant="outlined" 
                    style={{ margin: '0 auto', width: '75%' }} value={portfolioTitle} onChange={handleChange_portfolio_title}>
                  </TextField>
                </Row>
                <Row item xs={12} style={{ marginTop: '3rem' }}>
                  <Col item xs={6}>
                    <Container>
                    <Row>
                    <Avatar src={img_src} style={{ width: '10rem', height: '10rem', margin: '0 auto' }} />
                    <input accept="image/jpg, image/jpeg" id="icon-button-file" 
                      type="file" style={{ visibility: 'hidden', margin: '0 auto'}} onChange={imgUpload} />
                    </Row>
                    <Row>
                    <label htmlFor='icon-button-file' style={{ margin: '0 auto' }}>
                      <IconButton color="disabled" aria-label="upload picture" component='span'>
                        <PhotoCamera />
                      </IconButton>
                    </label>
                    </Row>
                      <div style={{ fontSize: 6, textAlign: 'center' }}>
                        * jpg 파일만 업로드 가능 권장 이미지 크기 300px X 300px
                      </div>
                    </Container>
                  </Col>
                  <Col item xs={6}>
                    <TextField id="standard-basic" label="닉네임" style={{ minWidth: '15rem', margin: '0 auto'}} 
                      value={nickname} onChange={handleChange_nickname} />
                    <br/><br/>
                    <FormControl className={classes.formControl} style={{ minWidth: '15rem', margin: '0 auto'}}>
                      <InputLabel id="demo-simple-select-label">MBTI</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={mbti}
                        onChange={handleChange_mbti}
                      >
                        <MenuItem value='ISTJ'>ISTJ</MenuItem>
                        <MenuItem value='ISTP'>ISTP</MenuItem>
                        <MenuItem value='ESTP'>ESTP</MenuItem>
                        <MenuItem value='ESTJ'>ESTJ</MenuItem>
                        <MenuItem value='ISFJ'>ISFJ</MenuItem>
                        <MenuItem value='ISFP'>ISFP</MenuItem>
                        <MenuItem value='ESFP'>ESFP</MenuItem>
                        <MenuItem value='ESFJ'>ESFJ</MenuItem>
                        <MenuItem value='INFJ'>INFJ</MenuItem>
                        <MenuItem value='INFP'>INFP</MenuItem>
                        <MenuItem value='ENFP'>ENFP</MenuItem>
                        <MenuItem value='ENFJ'>ENFJ</MenuItem>
                        <MenuItem value='INTJ'>INTJ</MenuItem>
                        <MenuItem value='INTP'>INTP</MenuItem>
                        <MenuItem value='ENTP'>ENTP</MenuItem>
                        <MenuItem value='ENTJ'>ENTJ</MenuItem>
                      </Select>
                    </FormControl>
                    <br/><br/>
                    <FormControl className={classes.formControl} style={{ minWidth: '15rem', margin: '0 auto'}}>
                      <InputLabel id="demo-simple-select-label">Wanna be</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={job}
                        onChange={handleChange_job}
                      >
                        <MenuItem value='BackEnd Developer'>BackEnd Developer</MenuItem>
                        <MenuItem value='FrontEnd Developer'>FrontEnd Developer</MenuItem>
                        <MenuItem value='IOS Developer'>IOS Developer</MenuItem>
                        <MenuItem value='Android Developer'>Android Developer</MenuItem>
                        <MenuItem value='FullStack Developer'>FullStack Developer</MenuItem>
                        <MenuItem value='Product Manage'>Product Manager</MenuItem>
                        <MenuItem value='Incharge Recruit'>Incharge Recruit</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                </Row>
              </Grid>
              </Paper>
              </Container>
              <Container style={{ marginTop: '2rem' }}>
                <Paper className={classes.paper}>
                  <Grid container direction='row' justify='space-between' alignItems='baseline' spacing={1} >
                    <Box style={{ marginLeft:'0.5rem' }}>🧑🏻‍🎓 학력</Box>
                  </Grid>
                  <hr></hr>
                  <br/>
                  <form className={classes.root} noValidate autoComplete="off" 
                    style={{ marginLeft: '1rem', marginBottom: '3rem' }}>
                    <Grid>
                      <Row>
                        <Col>
                          <FormControl style={{ marginLeft: '1rem' }}>
                            <InputLabel htmlFor="component-simple">학교명</InputLabel>
                            <Input style={{ width: '15rem' }} id="component-simple" 
                              value={univ_name} onChange={handleChange_univ_name} />
                          </FormControl>
                        </Col>
                        <Col>
                          <FormControl style={{ marginLeft: '1rem', minWidth: '7rem' }}>
                            <InputLabel id="demo-simple-select-label">학위</InputLabel>
                            <Select
                              style={{ minWidth: '5rem' }}
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={univ_degree}
                              onChange={handleChange_univ_degree}
                            >
                              <MenuItem value={'bachelor'}>학사</MenuItem>
                              <MenuItem value={'master'}>석사</MenuItem>
                              <MenuItem value={'doctor'}>박사</MenuItem>
                            </Select>
                          </FormControl>
                        </Col>
                      </Row>
                      <br/>
                      <Row>
                        <Col>
                          <FormControl style={{ marginLeft: '1rem' }}>
                            <InputLabel htmlFor="component-simple">전공</InputLabel>
                            <Input style={{ width: '15rem' }} id="component-simple" 
                              value={univ_major} onChange={handleChange_univ_major} />
                            </FormControl>
                        </Col>
                        <Col>
                          <FormControl style={{ marginLeft: '1rem', minWidth: '7rem' }}>
                            <InputLabel id="demo-simple-select-label">수료</InputLabel>
                            <Select
                              style={{ minWidth: '5rem' }}
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={univ_degree_status}
                              onChange={handleChange_univ_degree_status}
                            >
                              <MenuItem value={'attending'}>재학</MenuItem>
                              <MenuItem value={'graduate'}>졸업</MenuItem>
                              <MenuItem value={'completion'}>수료</MenuItem>
                              <MenuItem value={'absence'}>휴학</MenuItem>
                              <MenuItem value={'drop'}>중퇴</MenuItem>
                            </Select>
                          </FormControl>
                        </Col>
                      </Row>
                      <br/>
                      <Row>
                        <Col>
                          <FormControl style={{ marginLeft: '1rem', minWidth: '10rem' }}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="입학일"
                                value={univ_entrance_date}
                                onChange={handleChange_univ_entrance_date}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                              />
                            </MuiPickersUtilsProvider>
                          </FormControl>
                        </Col>
                        <Col>
                          <FormControl style={{ marginLeft: '1rem', minWidth: '10rem' }}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="졸업일"
                                value={univ_graduation_date}
                                onChange={handleChange_univ_graduation_date}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                              />
                            </MuiPickersUtilsProvider>
                          </FormControl>
                        </Col>
                      </Row>
                    </Grid>
                  </form>
                </Paper>
              </Container>
              <Container style={{ marginTop: '2rem' }}>
                <Paper className={classes.paper}>
                  <p>🏆 수상이력</p>
                  <hr></hr>
                  <br/>
                  <form style={{ marginLeft: '1rem', marginBottom: '3rem' }}>
                    <TextField
                      id="text"
                      label="수상명"
                      type="text"
                      value={award_name}
                      onChange={handleChange_award_name}
                      style={{ marginLeft: '1rem', marginBottom: '1rem', minWidth: '20rem' }}
                    />
                    <br/>
                    <br/>
                    <TextField
                      id="outlined-multiline-static"
                      label="수상내용"
                      multiline
                      rows={4}
                      variant="outlined"
                      style={{ marginLeft: '1rem', minWidth: '92%' }}
                      value={award_description}
                      onChange={handleChange_award_description}
                    />
                    <br/>
                  </form>
                </Paper>
              </Container>
              <Container style={{ marginTop: '2rem' }}>
                <Paper className={classes.paper}>
                  <p>🧑🏻‍💻 프로젝트</p>
                  <hr></hr>
                  <br/>
                  <form style={{ marginLeft: '1rem', marginBottom: '3rem' }}>
                    <TextField
                      style={{ marginLeft: '1rem', minWidth: '20rem' }}
                      id="text"
                      label="프로젝트명"
                      type="text"
                      value={project_name}
                      onChange={handleChange_project_name}
                    />
                  <br/>
                  <br/>
                  <Grid>
                    <Row>
                      <Col>
                        <FormControl style={{ marginLeft: '1rem', minWidth: '10rem' }}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="시작일"
                            value={project_start_date}
                            onChange={handleChange_project_start_date}
                            KeyboardButtonProps={{
                            'aria-label': 'change date',
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      </FormControl>
                    </Col>
                    <Col>
                      <FormControl style={{ marginLeft: '1rem', minWidth: '10rem' }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="종료일"
                            value={project_end_date}
                            onChange={handleChange_project_end_date}
                            KeyboardButtonProps={{
                              'aria-label': 'change date',
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      </FormControl>
                    </Col>
                  </Row>
                </Grid>
                <br/>
                <TextField
                  id="outlined-multiline-static"
                  label="프로젝트 내용"
                  multiline
                  rows={4}
                  variant="outlined"
                  style={{ marginLeft: '1rem', minWidth: '92%' }}
                  value={project_description}
                  onChange={handleChange_project_description}
                />
                <br/>
              </form>
                  </Paper>
                </Container>
                <Container style={{ marginTop: '2rem' }}>
                  <Paper className={classes.paper}>
                        <p>📃자격증</p>
                    <hr></hr>
                    <br/>
                    <form style={{ marginLeft: '1rem', marginBottom: '3rem' }}>
                      <Grid>
                        <Row>
                          <Col>
                            <FormControl style={{ marginLeft: '1rem' }}>
                              <InputLabel htmlFor="component-simple">자격증 이름</InputLabel>
                              <Input style={{ width: '15rem' }} id="component-simple" value={certification_name} 
                                onChange={handelChange_certification_name} />
                            </FormControl>
                          </Col>
                          <Col>
                            <FormControl style={{ marginLeft: '1rem' }}>
                              <InputLabel htmlFor="component-simple">주관기관</InputLabel>
                              <Input style={{ width: '15rem' }} id="component-simple" value={certification_organization} 
                                onChange={handleChange_certification_organization} />
                            </FormControl>
                          </Col>
                        </Row>
                      </Grid>
                      <br/>
                      <FormControl style={{ marginLeft: '1rem', minWidth: '10rem' }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="취득일"
                            value={certification_date}
                            onChange={handelChange_certification_date}
                            KeyboardButtonProps={{
                            'aria-label': 'change date',
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      </FormControl>
                    </form>
                  </Paper>
                </Container>
                <Container style={{ marginTop: '2rem', marginBottom: '5rem' }}>
                  <Button variant="contained" color="primary" size="large" onClick={SavePortfolio}>저장</Button>
                </Container>
            </Col>
            <Col item xs={2}><Container></Container></Col>
          </Grid>
    </div>
    );
  } else {
      function pop() {
        alert('oops! something WRONG')
      }
      return (
        <Router>
          <div className="App">
            <div className="outer">
              <div className="inner">
                <h1>Wrong Access</h1>
                <Button variant="contained" color="primary" onClick={goingHome}>Home으로 돌아가기</Button>
              </div> 
            </div>
          </div> 
        </Router>
        
    )
  }

  
}

function MainPage() {
  const history = useHistory();
  const [loginStatus, setLoginStatus] = useState(false)
  
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
    large: {
        width: theme.spacing(20),
        height: theme.spacing(20)
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));
  const classes = useStyles();
  const [portfolioData, setPortfolioData] = useState('');
  const elements = [];
  const [result, setResult] = useState(
    <div className={classes.root} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </div>
  );
  const [ssearch, setSearch] = useState('');
  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  }

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    const fetchData = async() => {
      try {
      const result = await axios.get('http://localhost:5000/portfolio/read', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(result)
      if (result.status === 200) {
        setLoginStatus(true)
        setPortfolioData(result.data.portfolio)
      }
    } catch(error) {
      console.log(error)
    }
    
  };
  fetchData();
},[])
  
  

    for (let i=0; i<portfolioData.length; i++) {
      if (ssearch !== '') {
        if (portfolioData[i][2].indexOf(ssearch) != -1) {
          const img_src = "/static/images/avatar/" + portfolioData[i][0] + ".jpg"
      elements.push(
        <Grid item xs={4}>
          <Card style={{ width: '18rem', height: '25rem'}}>
            <Card.Img variant='top' />
              <Box style={{ marginTop: '1rem' }}>
                <h4>{portfolioData[i][2]}</h4>
              </Box>
            <Card.Body>
                
                <Avatar  src={img_src} style={{ width: '10rem', height: '10rem', margin: '0 auto' }} />
              <Card.Title style={{ marginTop: '1rem', height: '2rem' }}>
                {portfolioData[i][3]}
              </Card.Title>
              <Card.Text>
                
                <p></p>
                <h4>{portfolioData[i][6]}</h4>
              </Card.Text>
            </Card.Body>
            <Button variant='contained' color='primary' style={{ width: '5rem', margin: '0 auto', marginBottom: '1rem' }}
              onClick={(e)=>{sessionStorage.setItem('racer', portfolioData[i][1]);console.log(sessionStorage.getItem('racer'));ViewPortfolio();}}>더보기</Button>
          </Card>
        </Grid>
      )
    } else {
      <></>
    }
      } else {
        const img_src = "/static/images/avatar/" + portfolioData[i][0] + ".jpg"
        elements.push(
          <Grid item xs={4}>
            <Card style={{ width: '18rem', height: '25rem'}}>
              <Card.Img variant='top' />
                <Box style={{ marginTop: '1rem' }}>
                  <h4>{portfolioData[i][2]}</h4>
                </Box>
              <Card.Body>
                  
                  <Avatar  src={img_src} style={{ width: '10rem', height: '10rem', margin: '0 auto' }} />
                <Card.Title style={{ marginTop: '1rem', height: '2rem' }}>
                  {portfolioData[i][3]}
                </Card.Title>
                <Card.Text>
                  
                  <p></p>
                  <h4>{portfolioData[i][6]}</h4>
                </Card.Text>
              </Card.Body>
              <Button variant='contained' color='primary' style={{ width: '5rem', margin: '0 auto', marginBottom: '1rem' }}
                onClick={(e)=>{sessionStorage.setItem('racer', portfolioData[i][1]);console.log(sessionStorage.getItem('racer'));ViewPortfolio();}}>더보기</Button>
            </Card>
          </Grid>
        )
      }
      
    }

  function ViewPortfolio() {
    setTimeout(() => {},3000)
    history.push('/racer')
  }

function goingHome() {
  sessionStorage.clear();
  window.location.replace('/')
}

  
if (loginStatus !== true) {
  return (
    <div className="App">
      <div className="outer">
        <div className="inner" style={{ textAlign: 'center' }}>
          <div style={{ marginTop: '2rem' }}></div>
          <h1>잘못된 접근입니다</h1>
          <h4>잠시 후 메인화면으로 돌아갑니다</h4>
          <Button variant='contained' color="primary" onClick={goingHome}>홈으로 돌아가기</Button>
        </div> 
      </div>
    </div> 
  )
  } else if (sessionStorage.getItem('portfolio') === 'undefined') {
    window.location.replace('/registerPortfolio')
  }
  console.log(portfolioData)

  return (
    <Router>
    <div className="App">
      <Route path="/main" component={NavMainPage} />
    <div>
      <Container style={{ margin: '0 auto' }}>
      <Grid item xs={12}>
      <Row>
      <Col item xs={4}></Col>
      <Col>
      <div className={classes.search} style={{ marginTop: '7rem', width: '50%' }}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              value={ssearch}
              onChange={handleChangeSearch}
            />
          </div>
          </Col>
          <Col item xs={2}></Col>
          </Row>
          </Grid>
        <Grid container spacing={3} style={{ marginTop: '3rem' }}>
            {elements}
        </Grid>
      </Container>
      </div>
    </div>
  </Router>
  )
}

function Racer() {
  const [userData, setUserData] = useState('');
  const [univData, setUnivData] = useState('');
  const [awardData, setAwardData] = useState('');
  const [projectData, setProjectData] = useState('');
  const [certData, setCertData] = useState('');
  const accessToken = sessionStorage.getItem("accessToken");
  
  useEffect(() => {
    const racer_email = sessionStorage.getItem('racer')
    console.log(racer_email)
    const fetchData = async() => {
      try {
        const result = await axios.post('http://localhost:5000/portfolio/racer', {email: racer_email});
        if (result.status === 200) {
          setUserData(result.data.portfolio.user);
          setUnivData(result.data.portfolio.univ)
          setAwardData(result.data.portfolio.award)
          setProjectData(result.data.portfolio.project)
          setCertData(result.data.portfolio.cert)
      }} catch(error) {
        console.log(error)
      }
    };
    fetchData();
  },[])
  console.log(userData)
  console.log(univData)
  console.log(awardData)
  console.log(projectData)
  console.log(certData)
  
  const img_src = "/static/images/avatar/"+userData[0]+".jpg";

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'left',
      color: theme.palette.text.primary,
    },
    large: {
      width: theme.spacing(20),
      height: theme.spacing(20),
    },
  }));

  const classes = useStyles();

  const readUniv = [];
    for (let i = 0; i<univData.length; i++) {
      readUniv.push(
      <form className={classes.root} noValidate autoComplete="off" 
        style={{ marginLeft: '4rem', marginBottom: '1rem' }}>
        <Grid style={{ textAlign: 'left' }}>
          <Row>
            <Col>
              <h5>학교 : {univData[i][2]}</h5>
            </Col>
            <Col>
            <h5>학위 : {univData[i][4]}</h5>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col>
              <h5>전공 : {univData[i][3]}</h5>
            </Col>
            <Col>
              <h5>학적 : {univData[i][5]}</h5>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col>
              <FormControl style={{ minWidth: '10rem' }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="yyyy/MM/dd"
                    margin="normal"
                    id="date-picker-inline"
                    label="입학일"
                    value={univData[i][6]}
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
            </Col>
            <Col>
              <FormControl style={{ minWidth: '10rem' }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="yyyy/MM/dd"
                    margin="normal"
                    id="date-picker-inline"
                    label="졸업일"
                    value={univData[i][7]}
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
            </Col>
          </Row>
        </Grid>
        </form>
      )
    }

    const readAward = [];
    for (let i = 0; i<awardData.length; i++) {
      readAward.push(
      <form className={classes.root} noValidate autoComplete="off" 
        style={{ marginLeft: '4rem', marginBottom: '1rem', marginRight: '4rem' }}>
        <Grid style={{ textAlign: 'left' }}>
          <Row>
            <Col>
              <h5>수상명 : {awardData[i][2]}</h5>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col>
            <div>
            <h5>수상내용 : {awardData[i][3]}</h5>
            </div>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col>
              <FormControl style={{ minWidth: '10rem' }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="yyyy/MM/dd"
                    margin="normal"
                    id="date-picker-inline"
                    label="수상일"
                    value={awardData[i][4]}
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
            </Col>
          </Row>
        </Grid>
        </form>
      )
    }

    const readProject = [];
    for (let i = 0; i<projectData.length; i++) {
      readProject.push(
      <form className={classes.root} noValidate autoComplete="off" 
        style={{ marginLeft: '4rem', marginBottom: '1rem', marginRight: '4rem' }}>
        <Grid style={{ textAlign: 'left' }}>
          <Row>
            <Col>
              <h5>프로젝트명 : {projectData[i][2]}</h5>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col>
            <div>
            <h5>프로젝트 내용 : {projectData[i][5]}</h5>
            </div>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col>
              <FormControl style={{ minWidth: '10rem' }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="yyyy/MM/dd"
                    margin="normal"
                    id="date-picker-inline"
                    label="시작일"
                    value={projectData[i][3]}
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
            </Col>
            <Col>
              <FormControl style={{ minWidth: '10rem' }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="yyyy/MM/dd"
                    margin="normal"
                    id="date-picker-inline"
                    label="종료일"
                    value={projectData[i][4]}
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
            </Col>
          </Row>
        </Grid>
        </form>
      )
    }

    const readCert = [];
    for (let i = 0; i<certData.length; i++) {
      readCert.push(
      <form className={classes.root} noValidate autoComplete="off" 
        style={{ marginLeft: '4rem', marginBottom: '1rem', marginRight: '4rem' }}>
        <Grid style={{ textAlign: 'left' }}>
          <Row>
            <Col>
              <h5>자격증명 : {certData[i][2]}</h5>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col>
            <div>
            <h5>주관기관 : {certData[i][3]}</h5>
            </div>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col>
              <FormControl style={{ minWidth: '10rem' }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="yyyy/MM/dd"
                    margin="normal"
                    id="date-picker-inline"
                    label="취득일"
                    value={certData[i][4]}
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
            </Col>
          </Row>
        </Grid>
        </form>
      )
    }

  return (
    <Router>
      <div className="App">
        <Route path="/racer" component={NavMyPortfolio} />
        <div className={classes.root}>
          <Container fluid="md" style={{ marginTop: '10rem', marginBottom: '10rem' }}>
            <Row>
              <Grid container spacing={4}>
                <Grid item xs={4}>
                  <Paper style={{ textAlign: 'center' }} className={classes.paper}>
                    <Row>
                      <Col>
                        <div style={{ marginTop: '0.3rem' }}>
                          <h5>
                            {userData[2]}
                          </h5>
                        </div>
                      </Col>
                    </Row>
                    <hr></hr>
                    <Grid>
                      <Row>
                        <Col></Col>
                        <Col>
                          <Avatar src={img_src} className={classes.large} />
                        </Col>
                        <Col></Col>
                      </Row>
                      <Row style={{ marginTop: '2rem' }}>
                        <Col>
                          <h3>
                            {userData[3]}
                          </h3>
                          <h6>
                            닉네임 : {userData[4]}
                          </h6>
                          <h6>
                            MBTI : {userData[5]}
                          </h6>
                          <h5>
                            {userData[6]}가 되고싶어요
                          </h5>
                        </Col>
                      </Row>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={8}>
                  <Paper className={classes.paper}>
                    <Grid container direction='row' spacing={1}>
                    <Col>
                    <div style={{ marginLeft:'0.5rem', marginTop: '0.3rem' }}>🧑🏻‍🎓 학력</div>
                    </Col>
                  </Grid>
                  <hr></hr>
                  <br/>
                  {readUniv}
                  </Paper>
                  <Paper className={classes.paper} style={{ marginTop: '2rem' }}>
                  <Grid container direction='row' spacing={1}>
                    <Col>
                    <div style={{ marginLeft:'0.5rem', marginTop: '0.3rem' }}>🧑🏻‍🎓 수상이력</div>
                    </Col>
                  </Grid>
                  <hr></hr>
                  <br/>
                  {readAward}
                  </Paper>
                  <Paper className={classes.paper} style={{ marginTop: '2rem' }}>
                  <Grid container direction='row' spacing={1}>
                    <Col>
                    <div style={{ marginLeft:'0.5rem', marginTop: '0.3rem' }}>🧑🏻‍🎓 수상이력</div>
                    </Col>
                  </Grid>
                  <hr></hr>
                  <br/>
                  {readProject}
                  </Paper>
                  <Paper className={classes.paper} style={{ marginTop: '2rem' }}>
                  <Grid container direction='row' spacing={1}>
                    <Col>
                    <div style={{ marginLeft:'0.5rem', marginTop: '0.3rem' }}>🧑🏻‍🎓 수상이력</div>
                    </Col>
                  </Grid>
                  <hr></hr>
                  <br/>
                  {readCert}
                  </Paper>
                </Grid>
              </Grid>
            </Row>
          </Container>
        </div>
      </div>
    </Router>
  );
}

function MyPortfolio() {
  const [userData, setUserData] = useState('');
  const [univData, setUnivData] = useState('');
  const [awardData, setAwardData] = useState('');
  const [projectData, setProjectData] = useState('');
  const [certData, setCertData] = useState('');
  const accessToken = sessionStorage.getItem("accessToken");
  
  useEffect(() => {
    
    const fetchData = async() => {
      try {
        const result = await axios.get('http://localhost:5000/myportfolio/load', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (result.status === 200) {
          setUserData(result.data.portfolio.user);
          setUnivData(result.data.portfolio.univ)
          setAwardData(result.data.portfolio.award)
          setProjectData(result.data.portfolio.project)
          setCertData(result.data.portfolio.cert)
      }} catch(error) {
        console.log(error)
      }
    };
    fetchData();
  },[])
  console.log(userData)
  console.log(univData)
  console.log(awardData)
  console.log(projectData)
  console.log(certData)
  
  const img_src = "/static/images/avatar/"+userData[0]+".jpg";

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'left',
      color: theme.palette.text.primary,
    },
    large: {
      width: theme.spacing(20),
      height: theme.spacing(20),
    },
  }));

  const classes = useStyles();
  const [modalEditBasicInfo, setModalEditBasicInfo] = useState(false);
  const [modalEditUniv, setModalEditUniv] = useState(false);
  const [modalAddUniv, setModalAddUniv] = useState(false);
  const [modalEditAward, setModalEditAward] = useState(false);
  const [modalAddAward, setModalAddAward] = useState(false);
  const [modalEditProject, setModalEditProject] = useState(false);
  const [modalAddProject, setModalAddProject] = useState(false);
  const [modalEditCert, setModalEditCert] = useState(false);
  const [modalAddCert, setModalAddCert] = useState(false);
  
  const [portfolioTitle, setPortfolioTitle] = useState(userData[3]);
  const handleChange_portfolio_title = (e) => {
    setPortfolioTitle(e.target.value)
  }
  const [nickname, setNickname] = useState(userData[4]);
  const handleChange_nickname = (e) => {
    setNickname(e.target.value)
  };
  const [mbti, setMBTI] = useState(userData[5]);
  const handleChange_mbti = (e) => {
    setMBTI(e.target.value)
  };
  const [job, setJob] = useState(userData[6]);
  const handleChange_job = (e) => {
    setJob(e.target.value)
  };
  
  
  
  
  const username = userData[2];
  const user_id = userData[0];
  const [img, setImg] = useState(null);
  const formData = new FormData();
  const [filename, setFilename] = useState('');
  const imgUpload = (e) => {
    setImg(e.target.files[0]);
    console.log(img)
    formData.append('file', img);
    formData.append('body', JSON.stringify({'email': userData[1]}));
    console.log(accessToken)
    const Upload = async() => {
      try {
          const result = await axios.post('http://localhost:5000/user/img', formData);
          console.log(result)
      } catch(error) {
        console.log(error)
        alert("업로드를 다시 시도해주세요")
      }
        };
        Upload();
    }
  async function SaveEditBasicInfo(e) {
    await axios.post('http://localhost:5000/edit/basic', {
      body: {
        email: userData[1],
        title: portfolioTitle,
        nickname: nickname,
        mbti: mbti,
        job: job
      },
      withCredentials: true,
    })
  }
  function EditBasicInfo(props) {
    return (
      <Modal {...props} size="lg"  aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            내 정보 수정하기
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid item xs={10} style={{ margin: '0 auto' }}>
            <Row>
              <Col item xs={4} style={{ margin: '0 auto' }}>
                <Avatar src={img_src} className={classes.large} style={{ marginTop: '2rem', marginBottom: '1rem'}} />
                <input accept="image/jpg, image/jpeg" id="icon-button-file" name="image"
                  type="file" style={{ margin: '0 auto'}} onChange={imgUpload} />
              </Col>
              <Col item xs={6} style={{ margin: '0 auto' }}>
                <Row style={{ marginBottom: '1rem' }}>
                  <TextField id="standard-basic" label="포트폴리오 제목"
                    style={{ margin: '0 auto', width: '90%' }} value={portfolioTitle} onChange={handleChange_portfolio_title}>
                  </TextField>
                </Row>
                <Row style={{ marginBottom: '1rem' }}>
                  <TextField id="standard-basic" label="닉네임" style={{ margin: '0 auto', width: '90%' }} 
                    value={nickname} onChange={handleChange_nickname} />
                </Row>
                <Row style={{ marginBottom: '1rem' }}>
                  <FormControl className={classes.formControl} style={{ margin: '0 auto', width: '90%' }}>
                    <InputLabel id="demo-simple-select-label">MBTI</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={mbti}
                      onChange={handleChange_mbti}
                    >
                      <MenuItem value='ISTJ'>ISTJ</MenuItem>
                      <MenuItem value='ISTP'>ISTP</MenuItem>
                      <MenuItem value='ESTP'>ESTP</MenuItem>
                      <MenuItem value='ESTJ'>ESTJ</MenuItem>
                      <MenuItem value='ISFJ'>ISFJ</MenuItem>
                      <MenuItem value='ISFP'>ISFP</MenuItem>
                      <MenuItem value='ESFP'>ESFP</MenuItem>
                      <MenuItem value='ESFJ'>ESFJ</MenuItem>
                      <MenuItem value='INFJ'>INFJ</MenuItem>
                      <MenuItem value='INFP'>INFP</MenuItem>
                      <MenuItem value='ENFP'>ENFP</MenuItem>
                      <MenuItem value='ENFJ'>ENFJ</MenuItem>
                      <MenuItem value='INTJ'>INTJ</MenuItem>
                      <MenuItem value='INTP'>INTP</MenuItem>
                      <MenuItem value='ENTP'>ENTP</MenuItem>
                      <MenuItem value='ENTJ'>ENTJ</MenuItem>
                    </Select>
                  </FormControl>
                </Row>
                <Row style={{ marginBottom: '1rem' }}>
                  <FormControl className={classes.formControl} style={{ margin: '0 auto', width: '90%' }}>
                    <InputLabel id="demo-simple-select-label">Wanna be</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={job}
                      onChange={handleChange_job}
                    >
                      <MenuItem value='BackEnd Developer'>BackEnd Developer</MenuItem>
                      <MenuItem value='FrontEnd Developer'>FrontEnd Developer</MenuItem>
                      <MenuItem value='IOS Developer'>IOS Developer</MenuItem>
                      <MenuItem value='Android Developer'>Android Developer</MenuItem>
                      <MenuItem value='FullStack Developer'>FullStack Developer</MenuItem>
                      <MenuItem value='Product Manage'>Product Manager</MenuItem>
                      <MenuItem value='Incharge Recruit'>Incharge Recruit</MenuItem>
                    </Select>
                  </FormControl>
                </Row>
              </Col>
            </Row>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={SaveEditBasicInfo}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  

  function EditUniv(props) {
    const [univ_name, setUniv_name] = useState(univData[2]);
  const handleChange_univ_name = (e) => {
    setUniv_name(e.target.value)
  };
  const [univ_major, setUniv_major] = useState(univData[3]);
  const handleChange_univ_major = (e) => {
    setUniv_major(e.target.value)
  };
  const [univ_degree, setUniv_degree] = useState(univData[4]);
  const handleChange_univ_degree = (e) => {
    setUniv_degree(e.target.value)
  };
  const [univ_degree_status, setUniv_degree_status] = useState(univData[5]);
  const handleChange_univ_degree_status = (e) => {
    setUniv_degree_status(e.target.value)
  };
  const [univ_entrance_date, setUniv_entrance_date] = useState(Date(univData[6]));
  const handleChange_univ_entrance_date = (date) => {
    setUniv_entrance_date(date)
  };
  const [univ_graduation_date, setUniv_graduation_date] = useState(Date(univData[7]));
  const handleChange_univ_graduation_date = (date) => {
    setUniv_graduation_date(date)
  };
    
    
    function SaveEditUniv(e) {
      axios.post('http://localhost:5000/edit/univ', {
        body: {
          email: userData[1],
          name: univ_name,
          major: univ_major,
          degree: univ_degree,
          degree_status: univ_degree_status,
          entrance_date: univ_entrance_date,
          graduation_date: univ_graduation_date,
          id: univData[0]
        },
        withCredentials: true,
      })
      window.location.reload();
    }
    
    return (
      <Modal {...props} size="lg"  aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            학력 정보 수정하기
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid item xs={10} style={{ margin: '0 auto' }}>
            <Row>
              <Col item xs={6} style={{ margin: '0 auto' }}>
                <Row style={{ marginBottom: '1rem' }}>
                  <TextField id="standard-basic" label="학교"
                    style={{ margin: '0 auto', width: '90%' }} value={univ_name} onChange={handleChange_univ_name}>
                  </TextField>
                </Row>
                <Row style={{ marginBottom: '1rem' }}>
                  <TextField id="standard-basic" label="전공" style={{ margin: '0 auto', width: '90%' }} 
                    value={univ_major} onChange={handleChange_univ_major} />
                </Row>
                <Row style={{ marginBottom: '1rem' }}>
                  <FormControl className={classes.formControl} style={{ margin: '0 auto', width: '90%' }}>
                    <InputLabel id="demo-simple-select-label">학위</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={univ_degree}
                      onChange={handleChange_univ_degree}
                    >
                      <MenuItem value='bachelor'>학사</MenuItem>
                      <MenuItem value='master'>석사</MenuItem>
                      <MenuItem value='doctor'>박사</MenuItem>
                    </Select>
                  </FormControl>
                </Row>
                <Row style={{ marginBottom: '1rem' }}>
                  <FormControl className={classes.formControl} style={{ margin: '0 auto', width: '90%' }}>
                    <InputLabel id="demo-simple-select-label">수료</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={univ_degree_status}
                      onChange={handleChange_univ_degree_status}
                    >
                      <MenuItem value='attending'>재학</MenuItem>
                      <MenuItem value='graduate'>졸업</MenuItem>
                      <MenuItem value='completion'>수료</MenuItem>
                      <MenuItem value='absence'>휴학</MenuItem>
                      <MenuItem value='drop'>중퇴</MenuItem>
                    </Select>
                  </FormControl>
                </Row>
                <Row>
                <FormControl style={{ marginLeft: '1rem', minWidth: '10rem' }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="입학일"
                    value={univ_entrance_date}
                    onChange={handleChange_univ_entrance_date}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
              </Row>
              <Row>
              <FormControl style={{ marginLeft: '1rem', minWidth: '10rem' }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="졸업일"
                    value={univ_graduation_date}
                    onChange={handleChange_univ_graduation_date}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
              </Row>
              </Col>
            </Row>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={SaveEditUniv}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }

    const readUniv = [];
    for (let i = 0; i<univData.length; i++) {
      readUniv.push(
      <form className={classes.root} noValidate autoComplete="off" 
        style={{ marginLeft: '4rem', marginBottom: '1rem' }}>
        <Grid style={{ textAlign: 'left' }}>
          <Row>
            <Col>
              <h5>학교 : {univData[i][2]}</h5>
            </Col>
            <Col>
            <h5>학위 : {univData[i][4]}</h5>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col>
              <h5>전공 : {univData[i][3]}</h5>
            </Col>
            <Col>
              <h5>학적 : {univData[i][5]}</h5>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col>
              <FormControl style={{ minWidth: '10rem' }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="yyyy/MM/dd"
                    margin="normal"
                    id="date-picker-inline"
                    label="입학일"
                    value={univData[i][6]}
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
            </Col>
            <Col>
              <FormControl style={{ minWidth: '10rem' }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="yyyy/MM/dd"
                    margin="normal"
                    id="date-picker-inline"
                    label="졸업일"
                    value={univData[i][7]}
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
            </Col>
          </Row>
        </Grid>
        </form>
      )
    }

  
  
  function AddUniv(props) {
    const [univ_name, setUniv_name] = useState(univData[2]);
  const handleChange_univ_name = (e) => {
    setUniv_name(e.target.value)
  };
  const [univ_major, setUniv_major] = useState(univData[3]);
  const handleChange_univ_major = (e) => {
    setUniv_major(e.target.value)
  };
  const [univ_degree, setUniv_degree] = useState(univData[4]);
  const handleChange_univ_degree = (e) => {
    setUniv_degree(e.target.value)
  };
  const [univ_degree_status, setUniv_degree_status] = useState(univData[5]);
  const handleChange_univ_degree_status = (e) => {
    setUniv_degree_status(e.target.value)
  };
  const [univ_entrance_date, setUniv_entrance_date] = useState(Date(univData[6]));
  const handleChange_univ_entrance_date = (date) => {
    setUniv_entrance_date(date)
  };
  const [univ_graduation_date, setUniv_graduation_date] = useState(Date(univData[7]));
  const handleChange_univ_graduation_date = (date) => {
    setUniv_graduation_date(date)
  };
    
  function SaveAddUniv(e) {
    axios.post('http://localhost:5000/add/univ', {
      body:{
        email: userData[1],
        name: univ_name,
        major: univ_major,
        degree: univ_degree,
        degree_status: univ_degree_status,
        entrance_date: univ_entrance_date,
        graduation_date: univ_graduation_date
      },
      withCredentials: true,
    })
    window.location.reload();
  }
    
    return (
      <Modal {...props} size="lg"  aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            학력 정보 추가하기
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid item xs={10} style={{ margin: '0 auto' }}>
            <Row>
              <Col item xs={6} style={{ margin: '0 auto' }}>
                <Row style={{ marginBottom: '1rem' }}>
                  <TextField id="standard-basic" label="학교"
                    style={{ margin: '0 auto', width: '90%' }} value={univ_name} onChange={handleChange_univ_name}>
                  </TextField>
                </Row>
                <Row style={{ marginBottom: '1rem' }}>
                  <TextField id="standard-basic" label="전공" style={{ margin: '0 auto', width: '90%' }} 
                    value={univ_major} onChange={handleChange_univ_major} />
                </Row>
                <Row style={{ marginBottom: '1rem' }}>
                  <FormControl className={classes.formControl} style={{ margin: '0 auto', width: '90%' }}>
                    <InputLabel id="demo-simple-select-label">학위</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={univ_degree}
                      onChange={handleChange_univ_degree}
                    >
                      <MenuItem value='bachelor'>학사</MenuItem>
                      <MenuItem value='master'>석사</MenuItem>
                      <MenuItem value='doctor'>박사</MenuItem>
                    </Select>
                  </FormControl>
                </Row>
                <Row style={{ marginBottom: '1rem' }}>
                  <FormControl className={classes.formControl} style={{ margin: '0 auto', width: '90%' }}>
                    <InputLabel id="demo-simple-select-label">수료</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={univ_degree_status}
                      onChange={handleChange_univ_degree_status}
                    >
                      <MenuItem value='attending'>재학</MenuItem>
                      <MenuItem value='graduate'>졸업</MenuItem>
                      <MenuItem value='completion'>수료</MenuItem>
                      <MenuItem value='absence'>휴학</MenuItem>
                      <MenuItem value='drop'>중퇴</MenuItem>
                    </Select>
                  </FormControl>
                </Row>
                <Row>
                <FormControl style={{ marginLeft: '1rem', minWidth: '10rem' }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="입학일"
                    value={univ_entrance_date}
                    onChange={handleChange_univ_entrance_date}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
              </Row>
              <Row>
              <FormControl style={{ marginLeft: '1rem', minWidth: '10rem' }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="졸업일"
                    value={univ_graduation_date}
                    onChange={handleChange_univ_graduation_date}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
              </Row>
              </Col>
            </Row>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={SaveAddUniv}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  


function EditAward(props) {
  
  const [award_name, setAward_name] = useState('');
  const handleChange_award_name = (e) => {
    setAward_name(e.target.value)
  };
  const [award_description, setAward_description] = useState('');
  const handleChange_award_description = (e) => {
    setAward_description(e.target.value)
  };
  const [award_date, setAward_date] = useState(new Date());
  const handleChange_award_date = (date) => {
    setAward_date(date)
  };
  const [award_id, setAward_id] = useState();
  const handleChange_award_id = (e) => {
    setAward_id(e.target.value)
  }


  function SaveEditAward(e) {
    axios.post('http://localhost:5000/edit/award', {
      body: {
        email: userData[1],
        name: award_name,
        description: award_description,
        date: award_date,
        id: awardData[0]
      },
      withCredentials: true,
    })
    window.location.reload();
  }
  
  
  return (
    <Modal {...props} size="lg"  aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          수상 정보 수정하기
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Grid item xs={10} style={{ margin: '0 auto' }}>
          <Row>
            <Col item xs={6} style={{ margin: '0 auto' }}>
              <Row style={{ marginBottom: '1rem' }}>
                <TextField id="standard-basic" label="수상명"
                  style={{ margin: '0 auto', width: '90%' }} value={award_name} onChange={handleChange_award_name}>
                </TextField>
              </Row>
              <Row>
              <FormControl style={{ marginLeft: '1rem', minWidth: '10rem' }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="수상일"
                  value={award_date}
                  onChange={handleChange_award_date}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
            </Row>
            <Row style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <TextField
                      id="outlined-multiline-static"
                      label="수상내용"
                      multiline
                      rows={4}
                      variant="outlined"
                      style={{ marginLeft: '1rem', minWidth: '92%' }}
                      value={award_description}
                      onChange={handleChange_award_description}
                    />
              </Row>
            </Col>
          </Row>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={SaveEditAward}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

  const readAward = [];
  for (let i = 0; i<awardData.length; i++) {
    readAward.push(
    <form className={classes.root} noValidate autoComplete="off" 
      style={{ marginLeft: '4rem', marginBottom: '1rem', marginRight: '4rem' }}>
      <Grid style={{ textAlign: 'left' }}>
        <Row>
          <Col>
            <h5>수상명 : {awardData[i][2]}</h5>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col>
          <div>
          <h5>수상내용 : {awardData[i][3]}</h5>
          </div>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col>
            <FormControl style={{ minWidth: '10rem' }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="yyyy/MM/dd"
                  margin="normal"
                  id="date-picker-inline"
                  label="수상일"
                  value={awardData[i][4]}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Col>
        </Row>
      </Grid>
      </form>
    )
  }



function AddAward(props) {
  const [award_name, setAward_name] = useState('');
  const handleChange_award_name = (e) => {
    setAward_name(e.target.value)
  };
  const [award_description, setAward_description] = useState('');
  const handleChange_award_description = (e) => {
    setAward_description(e.target.value)
  };
  const [award_date, setAward_date] = useState(new Date());
  const handleChange_award_date = (date) => {
    setAward_date(date)
  };
  
  function SaveAddAward(e) {
    axios.post('http://localhost:5000/add/award', {
      body:{
        email: userData[1],
        name: award_name,
        description: award_description,
        date: award_date
      },
      withCredentials: true,
    })
    window.location.reload();
  }

  return (
    <Modal {...props} size="lg"  aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          수상 정보 추가하기
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Grid item xs={10} style={{ margin: '0 auto' }}>
          <Row>
            <Col item xs={6} style={{ margin: '0 auto' }}>
              <Row style={{ marginBottom: '1rem' }}>
                <TextField id="standard-basic" label="수상명"
                  style={{ margin: '0 auto', width: '90%' }} value={award_name} onChange={handleChange_award_name}>
                </TextField>
              </Row>
              <Row>
              <FormControl style={{ marginLeft: '1rem', minWidth: '10rem' }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="수상일"
                  value={award_date}
                  onChange={handleChange_award_date}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
            </Row>
            <Row style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <TextField
                      id="outlined-multiline-static"
                      label="수상내용"
                      multiline
                      rows={4}
                      variant="outlined"
                      style={{ marginLeft: '1rem', minWidth: '92%' }}
                      value={award_description}
                      onChange={handleChange_award_description}
                    />
              </Row>
            </Col>
          </Row>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={SaveAddAward}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}


function EditProject(props) {
  const [project_name, setProject_name] = useState('');
  const handleChange_project_name = (e) => {
    setProject_name(e.target.value)
  }
  const [project_description, setProject_description] = useState('');
  const handleChange_project_description = (e) => {
    setProject_description(e.target.value)
  }
  const [project_start_date, setProject_start_date] = useState(new Date());
  const handleChange_project_start_date = (date) => {
    setProject_start_date(date)
  }
  const [project_end_date, setProject_end_date] = useState(new Date());
  const handleChange_project_end_date = (date) => {
    setProject_end_date(date)
  }
  
  function SaveEditProject(e) {
    axios.post('http://localhost:5000/edit/project', {
      body: {
        email: userData[1],
        name: project_name,
        description: project_description,
        start_date: project_start_date,
        end_date: project_end_date
      },
      withCredentials: true,
    })
    window.location.reload();
  }
  
  
  return (
    <Modal {...props} size="lg"  aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          프로젝트 정보 수정하기
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Grid item xs={10} style={{ margin: '0 auto' }}>
          <Row>
            <Col item xs={6} style={{ margin: '0 auto' }}>
              <Row style={{ marginBottom: '1rem' }}>
                <TextField id="standard-basic" label="프로젝트명"
                  style={{ margin: '0 auto', width: '90%' }} value={project_name} onChange={handleChange_project_name}>
                </TextField>
              </Row>
              <Row>
                <Col>
              <FormControl style={{ marginLeft: '1rem', minWidth: '10rem' }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="시작일"
                  value={project_start_date}
                  onChange={handleChange_project_start_date}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
            </Col>
            <Col>
              <FormControl style={{ marginLeft: '1rem', minWidth: '10rem' }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="종료일"
                  value={project_end_date}
                  onChange={handleChange_project_end_date}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
            </Col>
            </Row>
            <Row style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <TextField
                      id="outlined-multiline-static"
                      label="프로젝트 내용"
                      multiline
                      rows={4}
                      variant="outlined"
                      style={{ marginLeft: '1rem', minWidth: '92%' }}
                      value={project_description}
                      onChange={handleChange_project_description}
                    />
              </Row>
            </Col>
          </Row>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={SaveEditProject}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

  const readProject = [];
  for (let i = 0; i<projectData.length; i++) {
    readProject.push(
    <form className={classes.root} noValidate autoComplete="off" 
      style={{ marginLeft: '4rem', marginBottom: '1rem', marginRight: '4rem' }}>
      <Grid style={{ textAlign: 'left' }}>
        <Row>
          <Col>
            <h5>프로젝트명 : {projectData[i][2]}</h5>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col>
          <div>
          <h5>프로젝트 내용 : {projectData[i][5]}</h5>
          </div>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col>
            <FormControl style={{ minWidth: '10rem' }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="yyyy/MM/dd"
                  margin="normal"
                  id="date-picker-inline"
                  label="시작일"
                  value={projectData[i][3]}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Col>
          <Col>
            <FormControl style={{ minWidth: '10rem' }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="yyyy/MM/dd"
                  margin="normal"
                  id="date-picker-inline"
                  label="종료일"
                  value={projectData[i][4]}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Col>
        </Row>
      </Grid>
      </form>
    )
  }


function AddProject(props) {
  const [project_name, setProject_name] = useState('');
  const handleChange_project_name = (e) => {
    setProject_name(e.target.value)
  }
  const [project_description, setProject_description] = useState('');
  const handleChange_project_description = (e) => {
    setProject_description(e.target.value)
  }
  const [project_start_date, setProject_start_date] = useState(new Date());
  const handleChange_project_start_date = (date) => {
    setProject_start_date(date)
  }
  const [project_end_date, setProject_end_date] = useState(new Date());
  const handleChange_project_end_date = (date) => {
    setProject_end_date(date)
  }
  
  function SaveAddProject(e) {
    axios.post('http://localhost:5000/add.project', {
      body: {
        email: userData[1],
        name: project_name,
        description: project_description,
        start_date: project_start_date,
        end_date: project_end_date
      },
      withCredentials: true,
    })
    window.location.reload();
  }
  
  
  return (
    <Modal {...props} size="lg"  aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          프로젝트 정보 추가하기
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Grid item xs={10} style={{ margin: '0 auto' }}>
          <Row>
            <Col item xs={6} style={{ margin: '0 auto' }}>
              <Row style={{ marginBottom: '1rem' }}>
                <TextField id="standard-basic" label="프로젝트명"
                  style={{ margin: '0 auto', width: '90%' }} value={project_name} onChange={handleChange_project_name}>
                </TextField>
              </Row>
              <Row>
                <Col>
              <FormControl style={{ marginLeft: '1rem', minWidth: '10rem' }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="시작일"
                  value={project_start_date}
                  onChange={handleChange_project_start_date}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
            </Col>
            <Col>
              <FormControl style={{ marginLeft: '1rem', minWidth: '10rem' }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="종료일"
                  value={project_end_date}
                  onChange={handleChange_project_end_date}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
            </Col>
            </Row>
            <Row style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <TextField
                      id="outlined-multiline-static"
                      label="프로젝트 내용"
                      multiline
                      rows={4}
                      variant="outlined"
                      style={{ marginLeft: '1rem', minWidth: '92%' }}
                      value={project_description}
                      onChange={handleChange_project_description}
                    />
              </Row>
            </Col>
          </Row>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={SaveAddProject}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}


function EditCert(props) {
  const [certification_name, setCertification_name] = useState('');
  const handleChange_certification_name = (e) => {
    setCertification_name(e.target.value)
  }
  const [certification_organization, setCertification_organization] = useState('');
  const handleChange_certification_organization = (e) => {
    setCertification_organization(e.target.value)
  }
  const [certification_date, setCertification_date] = useState(new Date());
  const handleChange_certification_date = (date) => {
    setCertification_date(date)
  }
  
  function SaveEditCert(e) {
    axios.post('http://localhost:5000/edit/cert', {
      body: {
        email: userData[1],
        name: certification_name,
        organization: certification_organization,
        date: certification_date,
        id: certData[0]
      },
      withCredentials: true,
    })
    window.location.reload();
  }
  
  
  return (
    <Modal {...props} size="lg"  aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          자격증 정보 수정하기
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Grid item xs={10} style={{ margin: '0 auto' }}>
          <Row>
            <Col item xs={6} style={{ margin: '0 auto' }}>
              <Row style={{ marginBottom: '1rem' }}>
                <TextField id="standard-basic" label="자격증명"
                  style={{ margin: '0 auto', width: '90%' }} value={certification_name} onChange={handleChange_certification_name}>
                </TextField>
              </Row>
              <Row style={{ marginBottom: '1rem' }}>
                <TextField id="standard-basic" label="주관기관"
                  style={{ margin: '0 auto', width: '90%' }} value={certification_organization} onChange={handleChange_certification_organization}>
                </TextField>
              </Row>
              <Row>
              <FormControl style={{ marginLeft: '1rem', minWidth: '10rem' }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="취득일"
                  value={certification_date}
                  onChange={handleChange_certification_date}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
            </Row>
            </Col>
          </Row>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={SaveEditCert}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

  const readCert = [];
  for (let i = 0; i<certData.length; i++) {
    readCert.push(
    <form className={classes.root} noValidate autoComplete="off" 
      style={{ marginLeft: '4rem', marginBottom: '1rem', marginRight: '4rem' }}>
      <Grid style={{ textAlign: 'left' }}>
        <Row>
          <Col>
            <h5>자격증명 : {certData[i][2]}</h5>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col>
          <div>
          <h5>주관기관 : {certData[i][3]}</h5>
          </div>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col>
            <FormControl style={{ minWidth: '10rem' }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="yyyy/MM/dd"
                  margin="normal"
                  id="date-picker-inline"
                  label="취득일"
                  value={certData[i][4]}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Col>
        </Row>
      </Grid>
      </form>
    )
  }


function AddCert(props) {
  const [certification_name, setCertification_name] = useState('');
  const handleChange_certification_name = (e) => {
    setCertification_name(e.target.value)
  }
  const [certification_organization, setCertification_organization] = useState('');
  const handleChange_certification_organization = (e) => {
    setCertification_organization(e.target.value)
  }
  const [certification_date, setCertification_date] = useState(new Date());
  const handleChange_certification_date = (date) => {
    setCertification_date(date)
  }
  
  function SaveAddCert(e) {
    axios.post('http://localhost:5000/add/cert', {
      body:{
        email: userData[1],
        name: certification_name,
        organization: certification_organization,
        date: certification_date
      },
      withCredentials: true,
    })
    window.location.reload();
  }
  
  
  return (
    <Modal {...props} size="lg"  aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          자격증 정보 추가하기
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Grid item xs={10} style={{ margin: '0 auto' }}>
          <Row>
            <Col item xs={6} style={{ margin: '0 auto' }}>
              <Row style={{ marginBottom: '1rem' }}>
                <TextField id="standard-basic" label="자격증명"
                  style={{ margin: '0 auto', width: '90%' }} value={certification_name} onChange={handleChange_certification_name}>
                </TextField>
              </Row>
              <Row style={{ marginBottom: '1rem' }}>
                <TextField id="standard-basic" label="주관기관"
                  style={{ margin: '0 auto', width: '90%' }} value={certification_organization} onChange={handleChange_certification_organization}>
                </TextField>
              </Row>
              <Row>
              <FormControl style={{ marginLeft: '1rem', minWidth: '10rem' }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="취득일"
                  value={certification_date}
                  onChange={handleChange_certification_date}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
            </Row>
            </Col>
          </Row>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={SaveAddCert}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

  return (
    <Router>
      <div className="App">
        <Route path="/myportfolio" component={NavMyPortfolio} />
        <div className={classes.root}>
          <Container fluid="md" style={{ marginTop: '10rem', marginBottom: '10rem' }}>
            <Row>
              <Grid container spacing={4}>
                <Grid item xs={4}>
                  <Paper style={{ textAlign: 'center' }} className={classes.paper}>
                    <Row>
                      <Col></Col>
                      <Col>
                        <div style={{ marginTop: '0.3rem' }}>
                          <h5>
                            {userData[2]}
                          </h5>
                        </div>
                      </Col>
                      <Col>
                        <IconButton color="disabled" aria-label="edit" component='span' size='small' 
                          style={{ marginLeft: '3rem' }} onClick={() => setModalEditBasicInfo(true)}>
                          <CreateIcon />
                        </IconButton>
                        <EditBasicInfo show={modalEditBasicInfo} onHide={() => setModalEditBasicInfo(false)} />
                      </Col>
                    </Row>
                    <hr></hr>
                    <Grid>
                      <Row>
                        <Col></Col>
                        <Col>
                          <Avatar src={img_src} className={classes.large} />
                        </Col>
                        <Col></Col>
                      </Row>
                      <Row style={{ marginTop: '2rem' }}>
                        <Col>
                          <h3>
                            {userData[3]}
                          </h3>
                          <h6>
                            닉네임 : {userData[4]}
                          </h6>
                          <h6>
                            MBTI : {userData[5]}
                          </h6>
                          <h5>
                            {userData[6]}가 되고싶어요
                          </h5>
                        </Col>
                      </Row>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={8}>
                  <Paper className={classes.paper}>
                    <Grid container direction='row' spacing={1}>
                    <Col>
                    <div style={{ marginLeft:'0.5rem', marginTop: '0.3rem' }}>🧑🏻‍🎓 학력</div>
                    </Col>
                    <Col style={{ textAlign: 'right' }}>
                        <IconButton color="disabled" aria-label="edit" component='span' size='small' 
                          style={{ marginLeft: '1rem' }} onClick={() => setModalEditUniv(true)}>
                          <CreateIcon />
                        </IconButton>
                        <EditUniv show={modalEditUniv} onHide={() => setModalEditUniv(false)} />
                        <IconButton color="disabled" aria-label="add" component='span' size='small' 
                          style={{ marginLeft: '1rem' }} onClick={() => setModalAddUniv(true)}>
                          <AddIcon />
                        </IconButton>
                        <AddUniv show={modalAddUniv} onHide={() => setModalAddUniv(false)} />
                      </Col>
                  </Grid>
                  <hr></hr>
                  <br/>
                  {readUniv}
                  </Paper>
                  <Paper className={classes.paper} style={{ marginTop: '2rem' }}>
                  <Grid container direction='row' spacing={1}>
                    <Col>
                    <div style={{ marginLeft:'0.5rem', marginTop: '0.3rem' }}>🧑🏻‍🎓 수상이력</div>
                    </Col>
                    <Col style={{ textAlign: 'right' }}>
                        <IconButton color="disabled" aria-label="edit" component='span' size='small' 
                          style={{ marginLeft: '1rem' }} onClick={() => setModalEditAward(true)}>
                          <CreateIcon />
                        </IconButton>
                        <EditAward show={modalEditAward} onHide={() => setModalEditAward(false)} />
                        <IconButton color="disabled" aria-label="add" component='span' size='small' 
                          style={{ marginLeft: '1rem' }} onClick={() => setModalAddAward(true)}>
                          <AddIcon />
                        </IconButton>
                        <AddAward show={modalAddAward} onHide={() => setModalAddAward(false)} />
                      </Col>
                  </Grid>
                  <hr></hr>
                  <br/>
                  {readAward}
                  </Paper>
                  <Paper className={classes.paper} style={{ marginTop: '2rem' }}>
                  <Grid container direction='row' spacing={1}>
                    <Col>
                    <div style={{ marginLeft:'0.5rem', marginTop: '0.3rem' }}>🧑🏻‍🎓 수상이력</div>
                    </Col>
                    <Col style={{ textAlign: 'right' }}>
                        <IconButton color="disabled" aria-label="edit" component='span' size='small' 
                          style={{ marginLeft: '1rem' }} onClick={() => setModalEditProject(true)}>
                          <CreateIcon />
                        </IconButton>
                        <EditProject show={modalEditProject} onHide={() => setModalEditProject(false)} />
                        <IconButton color="disabled" aria-label="add" component='span' size='small' 
                          style={{ marginLeft: '1rem' }} onClick={() => setModalAddProject(true)}>
                          <AddIcon />
                        </IconButton>
                        <AddProject show={modalAddProject} onHide={() => setModalAddProject(false)} />
                      </Col>
                  </Grid>
                  <hr></hr>
                  <br/>
                  {readProject}
                  </Paper>
                  <Paper className={classes.paper} style={{ marginTop: '2rem' }}>
                  <Grid container direction='row' spacing={1}>
                    <Col>
                    <div style={{ marginLeft:'0.5rem', marginTop: '0.3rem' }}>🧑🏻‍🎓 수상이력</div>
                    </Col>
                    <Col style={{ textAlign: 'right' }}>
                        <IconButton color="disabled" aria-label="edit" component='span' size='small' 
                          style={{ marginLeft: '1rem' }} onClick={() => setModalEditCert(true)}>
                          <CreateIcon />
                        </IconButton>
                        <EditCert show={modalEditCert} onHide={() => setModalEditCert(false)} />
                        <IconButton color="disabled" aria-label="add" component='span' size='small' 
                          style={{ marginLeft: '1rem' }} onClick={() => setModalAddCert(true)}>
                          <AddIcon />
                        </IconButton>
                        <AddCert show={modalAddCert} onHide={() => setModalAddCert(false)} />
                      </Col>
                  </Grid>
                  <hr></hr>
                  <br/>
                  {readCert}
                  </Paper>
                </Grid>
              </Grid>
            </Row>
          </Container>
        </div>
      </div>
    </Router>
  );
  
}
