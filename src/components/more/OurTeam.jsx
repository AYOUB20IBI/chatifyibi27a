import { useEffect } from 'react';
import styleOurTeam from './ourTeam.module.css'
export default function OurTeam() {
  useEffect(() => {
    document.title = "CHATIFY IBI27A | Our Team";
  }, []);
  return (
    <>
<div className={`${styleOurTeam.team3} bg-light`} style={{paddingTop:"7rem"}}>
  <div className="container">
    <div className="row justify-content-center mb-4">
      <div className="col-md-7 text-center">
        <h3 className="mb-3">Our Team</h3>
        <h6 className={`${styleOurTeam.subtitle} font-weight-normal`}>You can relay on our amazing features list and also our customer services will be great experience for you without doubt and in no-time</h6>
      </div>
    </div>
    <div className="row justify-content-center align-items-center">
      <div className="col-lg-12 col-12 mb-4" style={{width:'18rem'}}>
        <div className="row">
          <div className="col-md-12">
            <img id={styleOurTeam.image} src="/src/assets/images/50955.jpg" alt="wrapkit" className="img-fluid" />
          </div>
          <div className="col-md-12">
            <div className="pt-2">
              <h5 className="mt-4 font-weight-medium mb-0">IBIDARNE AYOUB</h5>
              <h6 className={`${styleOurTeam.subtitle}`}>Full Stack Developer</h6>
              <p>Experienced Full Stack Developer skilled in crafting scalable and efficient web applications from front to back.</p>
              <ul className="list-inline">
                <li className="list-inline-item"><a href="#" className="text-decoration-none d-block px-1"><i className="bi bi-facebook"></i></a></li>
                <li className="list-inline-item"><a href="#" className="text-decoration-none d-block px-1"><i className="bi bi-github"></i></a></li>
                <li className="list-inline-item"><a href="#" className="text-decoration-none d-block px-1"><i className="bi bi-instagram"></i></a></li>
                <li className="list-inline-item"><a href="#" className="text-decoration-none d-block px-1"><i className="bi bi-linkedin"></i></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    </>
  )
}
