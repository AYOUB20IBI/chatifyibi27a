import { useEffect } from 'react';
import styleContact from './Contact.module.css'
import Swal from 'sweetalert2';
function Contact() {
    useEffect(() => {
        document.title = "CHATIFY IBI27A | Contact";
    }, []);
    const SendEmail =(e)=>{
        e.preventDefault()
        Swal.fire({
            icon:'info',
            title:'Attention',
            text:'Still in maintenance phase'
        })
    }
  return (
    <>
    <section className="bg-light" id={`${styleContact.section_contact}`} style={{paddingTop:'7rem'}}>
        <div className="container-xxl py-5">
            <div className="container">
                <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                    <h6 className="section-title text-center text-primary text-uppercase">Contact Us</h6>
                    <h1 className="mb-5" style={{
                      fontSize: '3rem',
                      fontWeight: '700',
                      color:' #000000'
                    }}>Contact <span className="text-warning text-uppercase">Chatify IBI27A</span></h1>
                    <hr className="w-50 mx-auto mb-5 mb-xl-9 border-light-subtle" />
                </div>
                <div className="row g-4" id={`${styleContact.lesBody}`}>
                    <div className="col-12">
                        <div className="row gy-4">
                            <div className="col-md-4">
                                <h6 className="section-title text-start text-primary text-uppercase"style={{
                                  fontSize: '1.5rem',
                                  fontWeight: '700',
                                }}>Personal</h6>
                                <p><i className="bi bi-envelope-at me-2 text-primary"></i>ayoubibidarne2@gmail.com</p>
                            </div>
                            <div className="col-md-4">
                                <h6 className="section-title text-start text-primary text-uppercase" style={{
                                  fontSize: '1.5rem',
                                  fontWeight: '700',
                                }}>General</h6>
                                <p><i className="bi bi-envelope-at-fill me-2 text-primary"></i>ayoubibidarne2@gmail.com</p>
                            </div>
                            <div className="col-md-4">
                                <h6 className="section-title text-start text-primary text-uppercase" style={{
                                  fontSize: '1.5rem',
                                  fontWeight: '700',
                                }}>Technical</h6>
                                <p><i className="bi bi-envelope-at-fill me-2 text-primary"></i>ayoubibidarne2@gmail.com</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 wow fadeIn" data-wow-delay="0.1s">
                      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106376.5600070085!2d-7.6693945531336505!3d33.572403232825756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa113b%3A0xb06c1d84f310fd3!2sCasablanca%2C%20Morocco!5e0!3m2!1sen!2sbd!4v1713531259008!5m2!1sen!2sbd" 
                        style={{minHeight: '350px', border:'0',width:'100%'}}  allowfullscreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                      </iframe>
                      
                    </div>
                    <div className="col-md-6">
                        <div className="wow fadeInUp" data-wow-delay="0.2s">
                            <form>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input type="text" className="form-control" id="name" placeholder="Your Name" style={{background:' #ffffff54'}}/>
                                            <label htmlFor="name">Your Name</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input type="email" className="form-control" id="email" placeholder="Your Email" style={{background:' #ffffff54'}}/>
                                            <label htmlFor="email">Your Email</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <input type="text" className="form-control" id="subject" placeholder="Subject" style={{background:' #ffffff54'}}/>
                                            <label htmlFor="subject">Subject</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <textarea className="form-control" placeholder="Leave a message here" id="message" style={{height: '150px',background:' #ffffff54'}}></textarea>
                                            <label htmlFor="message">Message</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button className="btn btn-warning text-light w-100 py-3 fw-bold" type="submit" onClick={SendEmail}>Send Message <i className="bi bi-send-check-fill"></i></button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default Contact