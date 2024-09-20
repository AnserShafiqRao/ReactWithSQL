import axios from 'axios';
import React, { useEffect, useState } from 'react';
import UserCreation from './UserCreation';

const Home = () => {
  const [fullName, setFullName] = useState('');
  const [description, setDescription] = useState('');
  const [responseMessage, setResponseMessage] = useState('');  // To display backend response
  const [dataList, setDataList] = useState([]);  // Initialize as an array
  const [specificData, setSpecificData] = useState('');  // State for specific name search

  const handleForm = (e) => {
    e.preventDefault();
    axios.post('http://localhost:4000/post', {
      clientName: fullName,
      description: description
    })
    .then((response) => {
      console.log(response.data);
      setResponseMessage(response.data.message);  // Set success message
      fetchData();  // Fetch updated data after form submission
    })
    .catch((error) => {
      console.error(error);
      setResponseMessage('Error occurred while submitting the form');  // Set error message
    });
  };

  const fetchData = () => {
    axios.get('http://localhost:4000/get-data')
      .then((result) => {
        setDataList(result.data);  // Update dataList with fetched data
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  // useEffect(() => {
  //   fetchData();  // Fetch data when component mounts
  // }, []);  // Empty array to avoid infinite loop

  const fetchDataByName = (e) => {
    e.preventDefault();  // Prevent default form submission
    axios.get(`http://localhost:4000/get-data/${specificData}`)
      .then((result) => {
        setDataList(result.data);  // Update dataList with fetched data by name
      })
      .catch((error) => {
        console.error('Error fetching data by name:', error);
      });
  };

  const deleteItemCall = (name, description) => {
    axios.delete(`http://localhost:4000/delete-post`, {
      params: {
        name: name,
        description: description
      }
    })
    .then(() => {
      alert('Deleted Successfully');
      fetchData();  // Refresh the data list
    })
    .catch((error) => {
      console.error('Error deleting item:', error);
    });
  };

  return (
    <div className='w-full flex flex-col justify-center items-center'>

      <UserCreation />

      <form className='flex flex-col w-[70%]' onSubmit={handleForm}>
        <label>Full Name</label>
        <input
          type='text'
          value={fullName}
          name='fullName'
          placeholder='Enter your full name'
          onChange={(e) => setFullName(e.target.value)}
        />
        <label>Description</label>
        <textarea
          value={description}
          name='description'
          placeholder='Enter description'
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type='submit'>Submit</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}  {/* Display backend message */}
      
      {/* Search by name */}
      <div>
        <form onSubmit={fetchDataByName}>
          <label>Search by Name</label>
          <input
            type='text'
            value={specificData}
            name='specificData'
            onChange={(e) => setSpecificData(e.target.value)}  // Fix onChange
          />
          <button type='submit'>Search</button>
        </form>
      </div>
      
      {/* Data List */}
      <div className='flex flex-col'>
        {dataList.length > 0 ? (
          dataList.map((Data, index) => (
            <div key={index} className='flex flex-col'>
              <h3>{Data.name}</h3>
              <h3>{Data.description}</h3>
              <button onClick={() => deleteItemCall(Data.name, Data.description)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default Home;
