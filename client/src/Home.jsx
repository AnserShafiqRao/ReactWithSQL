// import axios from 'axios';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';

const Home = () => {
  const { UserName } = useParams();
  const navigate = useNavigate();
  const [UserData, setUserData] = useState({});


  const FetchUserData = async (UserName) => {
    await axios.get(`http://localhost:4000/fetchuser/${UserName}`)
      .then((result) => {
        const userData = result.data;
        if (Array.isArray(userData) && userData.length > 0) {
          setUserData(userData[0]);
        } else {
          console.log('No user data found');
        }
      }).catch((err) => {
        console.error(`User's Data Not Available`, err);
      });
  };
  

  useEffect(() => {
    const data = localStorage.getItem('UserName')
    FetchUserData(data);
  }, []);

  const handleUserLogout = (e) =>{
    e.preventDefault();
    localStorage.removeItem('UserName');
    navigate('/')
  }

  return (
    <div className='w-full flex flex-col justify-center items-center'>

      <h3>
        {UserData ? `Welcome ${UserData.FullName} && ${UserName}`: null}
      </h3>

      <Link to={`/${UserName}/about`}>
      About Me
      </Link>

      <button onClick={handleUserLogout}>
        Logout
      </button>

    </div>
  );
};

export default Home;
