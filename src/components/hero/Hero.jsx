
import styleHero from './hero.module.css';
import img from '../../assets/images/img7.png'
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
export default function Hero() {
  useEffect(() => {
    document.title = "CHATIFY IBI27A | Home";
  }, []);
  return (
    <div  id={`${styleHero.section_hero}`} >
      <div className="container">
        <div className="row align-items-center justify-content-between">
          <div className="col-12 col-lg-6">
            <h1 className="text-4xl font-bold text-orange mb-4" id={`${styleHero.title}`}>CHAT IBI27A: Your <span>Ultimate Chat</span> Destination</h1>
            <p  className="text-xl mb-4" id={`${styleHero.para}`}>Seamlessly connect with friends, family, and colleagues in a vibrant and user-friendly chat environment. Join us today!</p>
            <ul className="mb-4">
              <li >✓ Seamless Connectivity</li>
              <li >✓ 24/7 Support</li>
              <li >✓ No Payment Required</li>
              <li >✓ Flexible Cancellation</li>
            </ul>
            <Link className="btn btn-orange mb-4" to="/login" id={`${styleHero.btn}`}>
                <i className="bi bi-chat-left-dots-fill me-1"></i>Get Started for FREE
            </Link>
          </div>
          <div className="col-12 col-lg-6 ">
            <div id={`${styleHero.image}`}>
              <img src={img} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
