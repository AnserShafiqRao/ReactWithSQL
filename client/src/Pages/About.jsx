import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const About = () => {
    const { UserName } = useParams();
    const [picture, setPicture] = useState(null)
    const [UserData, setUserData] = useState(null); // Initialize as null
    const [UserImages, setUserImages] = useState(null)


    const FetchUserData = async (UserName) => {
        await axios.get(`http://localhost:4000/fetchuser/${UserName}`)
            .then((result) => {
                const userData = result.data;
                if (Array.isArray(userData) && userData.length > 0) {
                    setUserData(userData[0]); // Set the first user if array is returned
                } else {
                    console.log('No user data found');
                }
            }).catch((err) => {
                console.error(`User's Data Not Available`, err);
            });
    };

    const FetchImages = async(UserName) => {
        await axios.get(`http://localhost:4000/get-images/${UserName}`)
        .then((result) => {
            const userImages = result.data;
            setUserImages(userImages)
        })
        .catch((err) => {
            console.error(`User Images Not Available`, err);
        });
    }


    useEffect(() => {
        FetchUserData(UserName);
        FetchImages(UserName);
    }, [UserName]);


    // const [uploaded]


    if (!UserData) return <div>Loading...</div>;


    const handleFileChange = (e) => {
        setPicture(e.target.files[0]);
    };



    const handlePic = async(e) =>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('UserName', UserName)
    formData.append('image', picture);

    try {
      const res = await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPicture(res.data.message);
    } catch (err) {
      console.error(err);
      setPicture('Error uploading image.');
    }
    }


    // Display user data as individual properties
    return (
        <div>
            <h1>User Details</h1>
            <p><strong>Name:</strong> {UserData.FullName}</p>
            <p><strong>UserName:</strong> {UserData.UserName}</p>
            <p><strong>Contact Number:</strong> {UserData.ContactNumber}</p>
            <p><strong>Password:</strong> {UserData.Password}</p>
            <p><strong>Email:</strong> {UserData.Email}</p>
            <p><strong>DOB:</strong> {UserData.DateOfBirth}</p>
            {/* Add more fields as necessary */}

            <form onSubmit={handlePic}>
                <label>
                    Upload A Picture
                </label>
                <input type='file' accept='image/*' name='ProfilePic' onChange={handleFileChange} />
                <button type='submit' > Add</button>
            </form>

            {
                UserImages ? (
                    <div>
                        {UserImages.map((item, index) => (
                            <img src={`http://localhost:4000/${item.FilePath}`} key={index} alt={`${item.UserName}`} />
                        ))}
                    </div>
                ):
                (
                    <div>
                        No Image Filed
                    </div>
                )
            }

        </div>
    );
};

export default About;
