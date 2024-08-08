import Header from "./Header.jsx"
import Footer from "./Footer.jsx"
import {useState, useEffect, useRef} from "react"

function Admin() {
    const elementRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.5 } 
      );
  
      if (elementRef.current) {
        observer.observe(elementRef.current);
      }
  
      return () => {
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      };
    }, []);

    return(
        <>
            <Header></Header>

            <div className="body">
                <div ref={elementRef} className={ (!isVisible) ? "about-left" : "about-left fade-in" }>
                    <input type="text" />
                    <button className="verifier-access-btn">Give Access</button>
                </div>

                <div className={ (!isVisible) ? "about-right" : "about-right fade-in" }>

                </div>
            </div>

            <Footer></Footer>
        </>
    )
}

export default Admin