
import { useEffect, useState } from 'react'
import './singup.css'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
export default function SignUp() {
  const url = import.meta.env.VITE_BACKEND_URL;
  useEffect(()=> {
    document.title = "CHATIFY IBI27A | SignUp";
  }, []);

  const navigate = useNavigate()

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    image:""
  });



  const [errors,setErrors]=useState({
    ErrorUsername:'',
    ErrorName:'',
    ErrorEmail:'',
    ErrorPassword:'',
    ErrorImage:''
  })


  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup Data:", signupData);
    await axios.post(`${url}/register`,signupData)
    .then((res)=>{
      console.log(res);
      if (res.status === 200) {
        toast.success(res.data.message);
        setErrors({
          ErrorUsername:'',
          ErrorName:'',
          ErrorEmail:'',
          ErrorPassword:'',
          ErrorImage:''
        })
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Thank you for registering with us.'
        })
        navigate('/login')
      }

    }).catch(err=>{
      
      if(err.response.status === 404){
        console.log(err);
        setErrors({
          ErrorUsername: err.response.data.errors.username ? err.response.data.errors.username : '',
          ErrorName: err.response.data.errors.name ? err.response.data.errors.name : '',
          ErrorEmail: err.response.data.errors.email ? err.response.data.errors.email : '',
          ErrorPassword: err.response.data.errors.password ? err.response.data.errors.password : '',
          ErrorImage: err.response.data.errors.image ? err.response.data.errors.image : '',
      });
      }
    })
  };

  const handelSelectImage =(src)=>{
    if (src) {
      // alert(src);
      setSignupData({...signupData,image:src})
    }
  }
  
  return (
    <>
    <section className="py-3 py-md-5 py-xl-8 singup" style={{marginTop:'6rem'}}>
      <div className="container p-5">
        <div className="row gy-4 align-items-center justify-content-center">
          <div className="col-12 col-md-6 col-xl-5">
            <div className="card rounded-4">
              <div className="card-body p-3 p-md-4 p-xl-5">
                <div className="row">
                  <div className="col-12">
                    <div className="mb-4">
                      <h3 className='title'>Sign Up</h3>
                      
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row gy-3 overflow-hidden">
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input type="text" className="form-control" name="username" id="username" placeholder="Username" value={signupData.username} onChange={handleChange}/>
                        <label htmlFor="username" className="form-label">Username</label>
                      </div>
                      {errors.ErrorUsername && (
                        <p className="text-sm text-red-600" style={{color:' #E91E63',fontWeight: '700'}}>{errors.ErrorUsername }</p>
                      )}
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input type="text" className="form-control" name="name" id="name" placeholder="Name" value={signupData.name} onChange={handleChange}/>
                        <label htmlFor="name" className="form-label">Name</label>
                      </div>
                      {errors.ErrorName && (
                        <p className="text-sm text-red-600" style={{color:' #E91E63',fontWeight: '700'}}>{errors.ErrorName }</p>
                      )}
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input type="email" className="form-control" name="email" id="email" placeholder="name@example.com" value={signupData.email} onChange={handleChange}/>
                        <label htmlFor="email" className="form-label">Email</label>
                      </div>
                      {errors.ErrorEmail && (
                        <p className="text-sm text-red-600" style={{color:' #E91E63',fontWeight: '700'}}>{errors.ErrorEmail }</p>
                      )}
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input type="password" className="form-control" name="password" id="password"  placeholder="Password" value={signupData.password} onChange={handleChange}/>
                        <label htmlFor="password" className="form-label">Password</label>
                      </div>
                      {errors.ErrorPassword && (
                        <p className="text-sm text-red-600" style={{color:' #E91E63',fontWeight: '700'}}>{errors.ErrorPassword }</p>
                      )}
                    </div>
                    <div className="col-12 row">
                      <p>Select Image Profile</p>
                      <div className='col-3'>
                        <img style={{cursor:'pointer'}} src={require('../../../public/face/face1.jpg')} width="100%" alt="face1" onClick={()=>handelSelectImage('face1.jpg')}/>
                      </div>
                      <div className='col-3'>
                        <img style={{cursor:'pointer'}} src={require('../../../public/face/face2.jpg')} width="100%" alt="face2" onClick={()=>handelSelectImage('face2.jpg')}/>
                      </div>
                      <div className='col-3'>
                        <img style={{cursor:'pointer'}} src={require('../../../public/face/face3.jpg')} width="100%" alt="face3" onClick={()=>handelSelectImage('face3.jpg')}/>
                      </div>
                      <div className='col-3'>
                        <img style={{cursor:'pointer'}} src={require('../../../public/face/face4.jpg')} width="100%" alt="face4" onClick={()=>handelSelectImage('face4.jpg')}/>
                      </div>
                    </div>
                    <div className="col-12 row mt-2">
                      <div className='col-3'>
                        <img style={{cursor:'pointer'}} src={require('../../../public/face/face5.jpg')} width="100%" alt="face5" onClick={()=>handelSelectImage('face5.jpg')}/>
                      </div>
                      <div className='col-3'>
                        <img  style={{cursor:'pointer'}} src={require('../../../public/face/face6.jpg')} width="100%" alt="face6" onClick={()=>handelSelectImage('face6.jpg')}/>
                      </div>
                      <div className='col-3'>
                        <img style={{cursor:'pointer'}} src={require('../../../public/face/face7.jpg')} width="100%" alt="face7" onClick={()=>handelSelectImage('face7.jpg')}/>
                      </div>
                      <div className='col-3'>
                        <img style={{cursor:'pointer'}} src={require('../../../public/face/face8.jpg')} width="100%" alt="face8" onClick={()=>handelSelectImage('face8.jpg')}/>
                      </div>
                    </div>
                      {errors.ErrorImage && (
                        <p className="text-sm text-red-600" style={{color:' #E91E63',fontWeight: '700'}}>{errors.ErrorImage }</p>
                      )}
                    <div className="col-12">
                      <div className="d-grid">
                        <button className="btn btn-primary btn-lg" type="submit">SignUp</button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className='my-3'>
                  <p className='para'>I Have Account? <Link to='/login'>Login</Link></p>
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
