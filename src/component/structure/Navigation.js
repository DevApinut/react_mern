import { Link, useNavigate } from "react-router-dom";
import '../../css/Navigation.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReact } from '@fortawesome/free-brands-svg-icons'
import { useEffect, useState } from "react";
import { getpermission, logout, getusername, getToken } from "../../service/service";
import Swal from "sweetalert2";


const Navigation = () => {

  const history = useNavigate();
  const [statuslogin, setstatuslogin] = useState(getusername())
  const [statuspermission, setToken] = useState(getToken())
  const [statusToken, setpermission] = useState(getpermission())

  useEffect(() => {
    setstatuslogin(getusername())
  }, [statuslogin])


  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" href="#"><FontAwesomeIcon icon={faReact} /></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to='/' className="nav-link active" aria-current="page">หน้าเเรก</Link>
              </li>
              <li className="nav-item">
                <Link to='/about' className="nav-link">เกี่ยวกับเรา</Link>
              </li>
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  ผลการทดสอบ
                </Link>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><Link to="/Test" className="dropdown-item">รายการ PM</Link></li>
                  <li><Link className="dropdown-item">รายการชำรุด</Link></li>
                  <li><Link to="/Stock" className="dropdown-item">คลังพัสดุ</Link></li>
                  {/* <li><Link className="dropdown-item"></Link></li> */}
                </ul>
              </li>

              {(!(getpermission() === 'member' || getpermission() === 'personel' || getpermission() === 'Admin')) && (
                <li className="nav-item">
                  <Link to="/login" className="nav-link" >เข้าสู่ระบบ</Link>
                </li>
              )}


              {(!(getpermission() === 'member' || getpermission() === 'personel' || getpermission() === 'Admin')) && (
                <li className="nav-item">
                  <Link to="/register" className="nav-link" >สมัครสมาชิก</Link>
                </li>
              )}



              {(getpermission() === 'member' || getpermission() === 'Admin' || getpermission() === 'personel') && (
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {statuslogin}
                  </Link>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    {getpermission() === 'Admin' && (
                      <li><Link to="/usermanage" className="dropdown-item">จัดการสมาชิก</Link></li>
                    )}
                    <li><Link to="/changepassword" className="dropdown-item">เปลี่ยนแปลงรหัสผ่าน</Link></li>
                    {(getpermission() === 'member' || getpermission() === 'Admin' || getpermission() === 'personel') && (
                      <li className="nav-item">
                        <button className="dropdown-item" onClick={() => {
                          logout(() => {
                            Swal.fire(
                              "เเจ้งเตือน",
                              "ลงชื่อออกสำเร็จ",
                              'success'
                            )
                              .then(() => history("/"))
                          })
                          // console.log(getusername(),getToken(),getpermission())                
                        }}>ออกจากระบบ</button>
                      </li>
                    )}
                    {/* <li><Link className="dropdown-item"></Link></li> */}
                  </ul>
                </li>
              )}

            </ul>
            <form className="d-flex">              
                <input className="form-control" type="search" placeholder="Search" aria-label="Search" />              
                <button className="btn btn-outline-success" type="submit">Search</button>  
            </form>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navigation;