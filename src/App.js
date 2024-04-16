import Navigation from "./component/structure/Navigation";
import Footer     from "./component/structure/Footer";
import './css/App.css'
import TP from './img/Power-Tx-2.png';
import { Link } from "react-router-dom";

const App = () => {
  return (
    <div className="page1">
      <Navigation />
      <div className="d-flex justify-content-center welcom-info ">
        <div className="d-flex flex-column justify-content-center align-items-center boxindex">
          <h2 className="header1">เเผนกบำรุงรักษาสถานีไฟฟ้า</h2>
          <p>ยินดีต้อนรับเข้าสู่เเผนกบำรุงรักษาสถานีไฟฟ้า</p>
          <div className="d-flex justify-content-center">
            <Link className="btn btn-outline-danger mx-3" >รายการ PM</Link>
            <Link className="btn btn-outline-success mx-3" >รายการชำรุด</Link>
          </div>
        </div>
        <img width="600px" className="Picindex" src={TP} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
