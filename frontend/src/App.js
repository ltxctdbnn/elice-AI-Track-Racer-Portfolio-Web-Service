import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { TextField, Avatar, Grid, Paper, makeStyles, InputLabel, FormControl, 
  Input, MenuItem, Select, IconButton, Icon, OutlinedInput, Box, Button } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';


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
                <Link className="nav-link" to={"/myPortfolio"}>내 포트폴리오</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link">레이서 찾기</Link>
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
  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/main"}>elice Racer's Portfolio</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link">레이서 찾기</Link>
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

  async function sendLogInfo(e) {
    e.preventDefault()
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
                    }}).catch(error => {
                    console.log(error)
                  })
                  
  }

  // useEffect(() => {
  //   const accessToken = sessionStorage.getItem("accessToken");
  //   axios.get("http://localhost:5000/auth/validation", {
  //       headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //       },
  //       withCredentials: true,
  //   }).then(response => {
  //     if (response.status === 200) {
  //       window.location.replace('/main')
  //     }
  //   }
  // )
  // })
  

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

function RegisterPortfolio() {
  const url = 'http://127.0.0.1:5000/portfolio/create';
  const history = useHistory();
  const [loginStatus, setLoginStatus] = useState(false)
  const accessToken = sessionStorage.getItem("accessToken");
  
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
  const handelChange_certification_organization = (e) => {
    setCertification_organization(e.target.value)
  }
  const [certification_date, setCertification_date] = useState(new Date());
  const handelChange_certification_date = (date) => {
    setCertification_date(date)
  }

  async function SavePortfolio(e) {
    e.preventDefault()
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
  
  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    const fetchData = async() => {
      try {
        const result = await axios.get("http://localhost:5000/portfolio/cert", {
          headers: {
          Authorization: `Bearer ${accessToken}`,
        },
    });
    if (result.status === 200) {
      setLoginStatus(true)
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
                    <Box style={{ marginLeft:'0.5rem' }}>🧑🏻‍👋🏻 기본정보</Box>
                  </Grid>
                  <hr></hr>
                  <br/>
                <Row>
                  <TextField id="outlined-basic" placeholder="포트폴리오 제목을 입력해주세요" variant="outlined" 
                  style={{ margin: '0 auto', width: '75%' }} /*value={portfolioTitle} onChange={handleChange_portfolio_title}*/
                  >
                    포트폴리오 타이틀
                  </TextField>
                </Row>
                <Row item xs={12} style={{ marginTop: '3rem' }}>
                  <Col item xs={6}>
                    <Container>
                    <Row>
                    <Avatar src='' style={{ width: '10rem', height: '10rem', margin: '0 auto' }} />
                    <input accept="image/jpg, image/jpeg" id="icon-button-file" 
                      type="file" style={{ visibility: 'hidden', margin: '0 auto'}} />
                    </Row>
                    <Row>
                    <label htmlFor='icon-button-file' style={{ margin: '0 auto' }}>
                      <IconButton color="disabled" aria-label="upload picture" component='span'>
                        <PhotoCamera />
                      </IconButton>
                    </label>
                    </Row>
                    </Container>
                  </Col>
                  <Col item xs={6}>
                    <TextField id="standard-basic" label="닉네임" style={{ minWidth: '15rem', margin: '0 auto'}} />
                    <br/>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="demo-simple-select-label" style={{ minWidth: '15rem', margin: '0 auto'}}>MBTI</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={null}
                        onChange={null}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
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
                                onChange={handelChange_certification_organization} />
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
  }));
  const classes = useStyles();
  const [portfolioData, setPortfolioData] = useState('');
  const elements = [];
  const [result, setResult] = useState(
    <div className={classes.root} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </div>
  );

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
      elements.push(
        <Grid item xs={4}>
          <Card style={{ width: '18rem'}}>
            <Card.Img variant='top' />
            <Card.Body>
                <Avatar  src="/static/images/avatar/1.png" style={{ width: '75%', height: '75%', margin: '0 auto' }} />
              <Card.Title style={{ marginTop: '1rem' }}>
                {portfolioData[i][18]}
              </Card.Title>
              <Card.Text>
                {portfolioData[i][2]}
              </Card.Text>
              <Button variant='contained' color='primary'>더보기</Button>
            </Card.Body>
          </Card>
        </Grid>
      )
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
        <Grid container spacing={3} style={{ marginTop: '10rem' }}>
            {elements}
        </Grid>
      </Container>
      </div>
    </div>
  </Router>
  )
}

function MyPortfolio() {
  
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
  const handelChange_certification_organization = (e) => {
    setCertification_organization(e.target.value)
  }
  const [certification_date, setCertification_date] = useState(new Date());
  const handelChange_certification_date = (date) => {
    setCertification_date(date)
  }

  const [LoadPortfolio, setLoadPortfolio] = useState({});

  const [userInformation, setUserInformation] = useState({
    name: '황정우',
    email: 'ltxctdbnn@gmail.com'
  });

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'left',
      color: theme.palette.text.secondary,
    },
    large: {
      width: theme.spacing(20),
      height: theme.spacing(20),
    },
  }));

  const classes = useStyles();

  function EduButton() {
    
    
    return (
    <Box>
      <Button variant="contained" color="primary" style={{marginRight:'0.5rem'}}>추가</Button>
      <Button variant="contained" color="secondary" style={{marginRight: '1rem'}}>저장</Button>
    </Box>
    )
  }

  async function SaveInfo(e) {
    e.preventDefault()
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
  
    await axios.post('http://localhost:5000'+'/portfolio/create', {
      method: 'POST',
      body: JSON.stringify({
        email: userInformation.email,
        university: university,
        award: award,
        project: project,
        certification: certification
      }),
      withCredentials: true,
    })
  }
  
  
  
    // useEffect(() => {
    //   const accessToken = sessionStorage.getItem("accessToken");
    //   axios.get("${window.location.origin}:5000/auth/validation", {
    //       headers: {
    //           Authorization: `Bearer ${accessToken}`,
    //       },
    //       withCredentials: true,
    //   }).then(response => console.log(response.data)
    // )
    // }, [])

    // console.log(info)
    // await axios.post(url+'/auth/sign-in', {
    //   method: 'POST',
    //   body: JSON.stringify(info),
    //   withCredentials: true,
    // }).then(response => {if (response.data.status === 500) { alert("please login")} else if (response.data.message === 200) {
    //                   // 여기서 쿠키처리
    //                   console.log(response)
    //                   sessionStorage.setItem('accessToken', response.data.token)
    //                 }}).catch(error => {
    //                 console.log(error)
    //               })
    //               history.push('/main')
  

  return (
    <Router>
      <div className="App">
        <Route path="/myPortfolio" component={NavMyPortfolio} />
        <div className={classes.root}>
          <Container fluid="md" style={{ marginTop: '10rem', marginBottom: '10rem' }}>
            <Row>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Paper style={{textAlign:'center'}} className={classes.paper}>
                    <h5>elice AI Track Racer #1</h5>
                    <hr></hr>
                    <Grid>
                      <Row>
                        <Col></Col>
                        <Col>
                          <Avatar alt={userInformation.name} src="/static/images/avatar/1.png" className={classes.large} />
                        </Col>
                        <Col></Col>
                      </Row>
                      <Row>
                        <Col></Col>
                        <Col>
                          {/* 업로드 및 수정 기능 추가해야함 */}
                          <input accept="image/*" className={classes.input} id="icon-button-file" type="file" style={{visibility: 'hidden'}} />
                          <label htmlFor="icon-button-file">
                            <IconButton color="primary" aria-label="upload picture" component="span">
                              <PhotoCamera />
                            </IconButton>
                          </label>
                        </Col>
                        <Col></Col>
                      </Row>
                    </Grid>
                    <br/>
                    <h5>{userInformation.name}</h5>
                    <h5>{userInformation.email}</h5>
                  </Paper>
                </Grid>
                
                
              </Grid>
              
            </Row>
            <Container style={{marginTop:'5rem'}}>
            <Button variant="primary" size='lg' onClick={SaveInfo}>저장</Button>
            </Container>
          </Container>

          

          <Container sytle={{ minHeight: '10rem' }}>
            <Row>
              <Col>
                <p>❤️</p>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </Router>
  )
}