import { useEffect, useState } from 'react'
import './login.css'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
export default function Login() {
  const url = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    document.title = "CHATIFY IBI27A | Login";
  }, []);

  const navigate = useNavigate()

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe:false
  });

  const [errors,setErrors]=useState({
    ErrorEmail:'',
    ErrorPassword:'',
    ErrorAll:'',
    ErrorRememberMe:''
  })

  const handleRememberMeChange = (event) => {
    setLoginData(prevData => ({
      ...prevData,
      rememberMe: event.target.checked
    }));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };


  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Login Data:", loginData);
    if(loginData.rememberMe){
      await axios.post(`${url}/login`,loginData)
      .then(async(res)=>{
        sessionStorage.setItem('auth',res.data.user._id)
        sessionStorage.setItem('__tok',Boolean(true))
        console.log(res.data);
        if (res.status === 200) {
          try {
            await axios.put(`${url}/users/${res.data.user._id}/online`, { online: Boolean(true) }).then((res)=>{
              console.log(res.data);
              if (res.status === 200) {
                toast.success(res.data.message);
    
                navigate('/chat')
              }
            })
          } catch (error) {
            console.log(error);
          }
          setErrors({
            ErrorEmail:'',
            ErrorPassword:''
          })
        }
        
      }).catch(err=>{
        console.log(err);
        if(err.response.status === 404){
          console.log(err.response.data.message);
          if(err.response.data.message){
            console.log('ddd'+err.response.data.message);
            setErrors({ErrorAll: err.response.data.message ? err.response.data.message : ''})
          }else{
            setErrors({
              ErrorEmail: err.response.data.errors.email ? err.response.data.errors.email : '',
              ErrorPassword: err.response.data.errors.password ? err.response.data.errors.password : '',
            });
          }
        }
      })
    }else{
      setErrors({
        ErrorRememberMe: 'Please check this box'
      });
    }
  };
  
  return (
    <>
    <section className="py-3 py-md-5 py-xl-8 login" style={{marginTop:'6rem'}}>
      <div className="container p-5">
        <div className="row gy-4 align-items-center justify-content-center">
          <div className="col-12 col-md-6 col-xl-5">
            <div className="card rounded-4">
              <div className="card-body p-3 p-md-4 p-xl-5">
                <div className="row">
                  <div className="col-12">
                    <div className="mb-4">
                      <h3 className='title'>Login</h3>
                      {errors.ErrorAll && (
                        <p className="text-sm text-red-600" style={{color:' #E91E63',fontWeight: '700'}}>{errors.ErrorAll }</p>
                      )}
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row gy-3 overflow-hidden">
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input type="email" className="form-control" name="email" id="email" placeholder="name@example.com" value={loginData.email} onChange={handleChange}/>
                        <label htmlFor="email" className="form-label">Email</label>
                      </div>
                      {errors.ErrorEmail && (
                        <p className="text-sm text-red-600" style={{color:' #E91E63',fontWeight: '700'}}>{errors.ErrorEmail }</p>
                      )}
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input type="password" className="form-control" name="password" id="password"  placeholder="Password" value={loginData.password} onChange={handleChange}/>
                        <label htmlFor="password" className="form-label">Password</label>
                      </div>
                      {errors.ErrorPassword && (
                        <p className="text-sm text-red-600" style={{color:' #E91E63',fontWeight: '700'}}>{errors.ErrorPassword }</p>
                      )}
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" value={loginData.rememberMe} onChange={handleRememberMeChange} name="remember_me" id="remember_me"/>
                        <label className="form-check-label" htmlFor="remember_me">
                          Keep me logged in
                        </label>
                        {errors.ErrorRememberMe && (
                          <p className="text-sm text-red-600" style={{color:' #E91E63',fontWeight: '700'}}>{errors.ErrorRememberMe }</p>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-grid">
                        <button className="btn btn-primary btn-lg" type="submit">Log in now</button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className='my-3'>
                  <p className='para'>I Don't Have an Account? <Link to='/registre'>SignUp</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
