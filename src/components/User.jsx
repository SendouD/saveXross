import Header from "./Header.jsx"
import Footer from "./Footer.jsx"
import {useState, useEffect, useRef} from "react"

function User() {
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
            <Header/>

            <div className="body">
                <div ref={elementRef} className={ (!isVisible) ? "about-left" : "about-left fade-in" }>
                    <div className="form-inps">
                    <div className="form-name">Raise a Rescue!</div>
                    <input type="text" className="phoneno-inp" placeholder="Enter your Phone No.:"/>
                    <input type="text" className="address-inp" placeholder="Enter the Address"/>
                    <div>
                        <input type="radio" id="rescue" name="severity" value="rescue"/>
                        <label for="html">Rescue</label><br/>
                        <input type="radio" id="injury" name="severity" value="injury"/>
                        <label for="css">Injury</label><br/>
                        <input type="radio" id="accident" name="severity" value="accident"/>
                        <label for="javascript">Accident</label><br/>
                        <input type="radio" id="animal-abuse" name="severity" value="animalabuse"/>
                        <label for="javascript">Animal-Abuse</label>
                    </div>

                    <input type="file" className="gore-img" accept="image/*"/>
                    </div>
                </div>

                <div className={ (!isVisible) ? "about-right" : "about-right fade-in" }>

                </div>
            </div>

            <Footer/>
        </>
    )
}

export default User