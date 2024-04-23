import styleFooter from './footer.module.css'
import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <>
    <div className="py-1" id={`${styleFooter.Copyrights}`}>
        <div className="container-fluid  d-flex flex-wrap justify-content-between align-items-center my-4" style={{fontSize: '12px',fontWeight: '400'}}>
            <div className="col-md-4 d-flex align-items-center">
                <p className="mb-3 mb-md-0 ">Copyright © 2022 <span>Chatify IBI27A</span>, All Rights Reserved. Powered By <Link target='_blank' to="https://ibidarne-ayoub.vercel.app/" className='text-decoration-none'><span>Ibidarne</span></Link></p>
            </div>
          
            <ul className="nav col-md-4 justify-content-end list-unstyled d-flex" id={`${styleFooter.list_security}`}>
                <li className="ms-3 px-2"><Link  to="https://www.facebook.com/ayoub.ibidaren" target='_blank'><i className="bi bi-facebook"></i></Link></li>
                <li className="ms-3 befour px-2"><Link   to="https://www.instagram.com/ibi27a/" target='_blank'><i className="bi bi-instagram"></i></Link></li>
                <li className="ms-3 px-2"><Link  to="https://www.linkedin.com/in/ayoub-ibidarne-9b33562a4/" target='_blank'><i className="bi bi-linkedin"></i></Link></li>
                <li className="ms-3 befour px-2"><Link  to="https://t.me/ayoub27a" target='_blank'><i className="bi bi-telegram"></i></Link></li>
            </ul>
        </div>
    </div>
    </>
  )
}
