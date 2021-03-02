import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { TextField, 
  Avatar, 
  Grid, 
  Paper, 
  makeStyles, 
  InputLabel, 
  FormControl, 
  Input,
  MenuItem,
  Select,
  IconButton,
  Icon,
  OutlinedInput } from '@material-ui/core';
  import DateFnsUtils from '@date-io/date-fns';
  import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
  import PhotoCamera from '@material-ui/icons/PhotoCamera';


axios.defaults.baseURL = "http://127.0.0.1:5000";
axios.defaults.withCredentials = true;

export default function App() {
  
  return (
  <Router>
    <Switch>
      <Route exact path='/' component={SignIn} />
      <Route path="/sign-up" component={SignUp} />
      <Route path="/main" component={MainPage} />
      <Route path="/myPortfolio" component={MyPortfolio} />
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
                      // 여기서 쿠키처리
                      console.log(response)
                      sessionStorage.setItem('accessToken', response.data.token)
                    }}).catch(error => {
                    console.log(error)
                  })
                  history.push('/main')
  }

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    axios.get("http://localhost:5000/auth/validation", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
    }).then(response => console.log(response.data)
  )
  }, [])
  

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

  function sendLogInfo(e) {
    e.preventDefault()
    const info = {
      'email': email,
      'fullname': fullname,
      'password': password
    };
    console.log(info)
    axios.post(url, {method: 'POST',
                    body: JSON.stringify(info)
                    }).then(response => console.log(response))
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
          <button type="submit" className="btn btn-primary btn-lg btn-block" onClick={sendLogInfo}>Register</button>
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
}

function MainPage() {
  const history = useHistory();
  const [loginStatus, setLoginStatus] = useState(false)
  
  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    const fetchData = async() => {
      try {
        const result = await axios.get("http://localhost:5000/auth/validation", {
          headers: {
          Authorization: `Bearer ${accessToken}`,
        },
    });
    if (result.status === 200) {setLoginStatus(true)}
  } catch(error) {
    console.log(error)
  }
};
fetchData();
  }, []);

  const [portfolioData, setPortfolioData] = useState('');
  const elements = [];

  useEffect(() => {
    axios.get('http://localhost:5000/portfolio/main').then(response => 
    setPortfolioData(response.data))
    console.log(portfolioData)
    for(let i=0; i<portfolioData.length; i++) {
        elements.push(
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Card.Title>i</Card.Title>
              <Card.Text>
                i
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
        )
      };
  }, []);

  if (loginStatus === true) {
  return (
    <Router>
    <div className="App">
      <Route path="/main" component={NavMainPage} />
    <div>
      <Container fluid="md">
        <Row style={{ marginTop: '10rem' }}>
          <Col>
          {elements}
          </Col>
        </Row>
      </Container>
      </div>
    </div>
  </Router>
  );
  } else {
    function pop() {
      alert('올바르지 않은 접근입니다')
    }
    return (
      <h1>Wrong Access</h1>
  )
}
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
      width: theme.spacing(30),
      height: theme.spacing(30),
    }
  }));

  const classes = useStyles();



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
    //   axios.get("http://localhost:5000/auth/validation", {
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
                <Grid item xs={8}>
              <Container>
                <Paper className={classes.paper}>
                      <p>🧑🏻‍🎓학력사항</p>
                  <hr></hr>
                  <br/>
                  <form className={classes.root} noValidate autoComplete="off">
        <Grid>
          <Row>
            <Col>
              <FormControl style={{ marginLeft: '1rem' }}>
                <InputLabel htmlFor="component-simple">학교명</InputLabel>
                <Input style={{ width: '15rem' }} id="component-simple" value={univ_name} onChange={handleChange_univ_name} />
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
                <Input style={{ width: '15rem' }} id="component-simple" value={univ_major} onChange={handleChange_univ_major} />
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
                      <p>🏆수상이력</p>
                  <hr></hr>
                  <br/>
                  <form>
        <TextField
          style={{ marginLeft: '1rem', minWidth: '20rem' }}
          id="text"
          label="수상명"
          type="text"
          value={award_name}
          onChange={handleChange_award_name}
        />
        <br/>
        <br/>
        <FormControl label="수상내용" variant="outlined" style={{ marginLeft: '1rem' }}>
          <p>수상내용</p>
          <InputLabel htmlFor="component-outlined" style={{ minWidth: '33rem', maxWidth: '33rem' }}></InputLabel>
          <OutlinedInput multiline='true' id="component-outlined" style={{ minWidth: '33rem', maxWidth: '33rem', minHeight: '10rem' }}
          value={award_description} onChange={handleChange_award_description} />
        </FormControl>
        <br/>
      </form>
                </Paper>
              </Container>
              <Container style={{ marginTop: '2rem' }}>
                <Paper className={classes.paper}>
                      <p>🧑🏻‍💻프로젝트</p>
                  <hr></hr>
                  <br/>
                  <form>
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
        <FormControl label="프로젝트 내용" variant="outlined" style={{ marginLeft: '1rem' }}>
          <p>프로젝트 내용</p>
          <InputLabel htmlFor="component-outlined" style={{ minWidth: '33rem' }}></InputLabel>
          <OutlinedInput multiline='true' id="component-outlined" style={{ minWidth: '33rem', minHeight: '10rem'}} value={project_description} onChange={handleChange_project_description} />
        </FormControl>
        <br/>
      </form>
                </Paper>
              </Container>
              <Container style={{ marginTop: '2rem' }}>
                <Paper className={classes.paper}>
                      <p>📃자격증</p>
                  <hr></hr>
                  <br/>
                  <form>
      <Grid>
        <Row>
          <Col>
            <FormControl style={{ marginLeft: '1rem' }}>
              <InputLabel htmlFor="component-simple">자격증 이름</InputLabel>
              <Input style={{ width: '15rem' }} id="component-simple" value={certification_name} onChange={handelChange_certification_name} />
            </FormControl>
          </Col>
          <Col>
            <FormControl style={{ marginLeft: '1rem' }}>
              <InputLabel htmlFor="component-simple">주관기관</InputLabel>
              <Input style={{ width: '15rem' }} id="component-simple" value={certification_organization} onChange={handelChange_certification_organization} />
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
        <br/>
        </form>
                </Paper>
              </Container>
              
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