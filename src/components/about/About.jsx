import { useEffect } from 'react'
import image1 from '../../assets/images/image1.jpeg'
import image2 from '../../assets/images/image2.jpeg'
import image3 from '../../assets/images/image3.jpeg'
import image4 from '../../assets/images/image4.jpeg'

import styleAbout from './About.module.css'
import { Link } from 'react-router-dom';
export default function About() {
    useEffect(() => {
        document.title = "CHATIFY IBI27A | About";
    }, []);
  return (
    <>
        <section id={`${styleAbout.section}`}  style={{paddingTop:'5rem'}}>
            <div className="container-xxl py-5" >
                <div className="container">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-6" id={`${styleAbout.section_one}`}>
                            <h6 className={`${styleAbout.section_title} text-start text-primary text-uppercase`}>About Us <span className={`${styleAbout.ligne_About}`}></span></h6>
                                <>
                                    <h1 className="mb-4"style={{
                                        fontSize: '1.8rem',
                                        fontWeight: '700',
                                        color:' #000000'
                                    }}>Welcome to <span className="text-warning text-uppercase">Chatify <span style={{color:'red'}}>IBI27A.</span></span></h1>
                                    <p className="mb-4 text-dark">
                                      I am a Full-Stack developer based in Casablanca, Morocco, 
                                      currently working as a Full Stack intern. I am deeply passionate 
                                      about enhancing my coding skills and developing websites. I specialize 
                                      in building WebApps and websites using the MERN Stack. I am dedicated 
                                      to self-improvement and constantly work on enhancing my skills. 
                                      Building Full-Stack clones is a particular area of interest for me.</p>
                                    <ul id={`${styleAbout.list_security}`} className="nav col-md-4 list-unstyled d-flex">
                                        <li className="ms-3 px-1"><Link  to="https://www.facebook.com/ayoub.ibidaren" target='_blank'><i className="bi bi-facebook"></i></Link></li>
                                        <li className="ms-3 befour px-1"><Link   to="https://www.instagram.com/ibi27a/" target='_blank'><i className="bi bi-instagram"></i></Link></li>
                                        <li className="ms-3 px-1"><Link  to="https://www.linkedin.com/in/ayoub-ibidarne-9b33562a4/" target='_blank'><i className="bi bi-linkedin"></i></Link></li>
                                        <li className="ms-3 befour px-1"><Link  to="https://t.me/ayoub27a" target='_blank'><i className="bi bi-telegram"></i></Link></li>
                                    </ul>
                                </>
                                
                            <Link className="btn btn-warning text-light fw-bold py-3 px-5 mt-2" to="/contact">Contact <i className="bi bi-envelope-at-fill"></i></Link>
                        </div>
                        <div className="col-lg-6">
                            <div className="row g-3" id={`${styleAbout.section_images}`}>
                                <div className="col-6 text-end">
                                    <img className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.1s" src={image2} style={{marginTop: '25%'}}/>
                                </div>
                                <div className="col-6 text-start">
                                    <img className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.3s" src={image3}/>
                                </div>
                                <div className="col-6 text-end">
                                    <img className="img-fluid rounded w-50 wow zoomIn" data-wow-delay="0.5s" src={image4}/>
                                </div>
                                <div className="col-6 text-start">
                                    <img className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.7s" src={image1}/>
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
