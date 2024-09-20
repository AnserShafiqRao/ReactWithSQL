import axios from 'axios';
import React, { useEffect, useState } from 'react'


const UserCreation = () => {
    const [userData, setUserData] = useState({
        FullName: '',
        UserName: '',
        Password: '',
        Email: '',
        ContactNumber: '',
        DateOfBirth: '',
        IdCreationDate: '',
        IdCreationTime: '',
        Location: '',
    })


    // For checking the availabilty of the USERNAME.
    const [usernameCheck, setUsernameCheck] = useState(true);
    const CheckUserName=async()=>{
        await axios.post('http://localhost:4000/check-username',{
            UserName: userData.UserName,
        }).then((result) => {
            if(result.data.exists){
                setUsernameCheck(false);
            }else{
                setUsernameCheck(true);
            }
        }).catch((error) =>{
            console.error(error)
        })
    }


    // For Confirmation and Syntax Check Of Password
    const [syntaxError, setSyntaxError] = useState(false);
    const [syntaxMessage, setSyntaxMessage] = useState('')
    const [matchError, setMatchError] = useState(false);
    const [matchMessage, setMatchMessage] = useState('')
    const [passwords, setPasswords] = useState({
        first: '',
    })
    const checkPasswordSyntax = (e) => {
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&^*]).{8,}$/;
        const pass = e.target.value;
        const { name, value } = e.target;

        setPasswords((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (!regex.test(pass)) {
            setSyntaxError(true);
            setSyntaxMessage(
                'Password must have at least one uppercase letter, one lowercase letter, one unique character, one number, and be at least 8 characters long!'
            );
        } else {
            setSyntaxError(false);
            setSyntaxMessage('');
        }
    };

    const ConfirmPassword = (e) =>{
        e.preventDefault();
        const passwordEntry = e.target.value;
        if(passwordEntry !== ''){
            if(passwords.first !== passwordEntry){
                setMatchError(true)
                setMatchMessage('Passwords not same.')
            }else{
                setMatchError(false)
                setMatchMessage('Password Confirmed')
                setUserData((prev) => ({
                    ...prev,
                    Password: passwords.first,
                }))
            }
        }
    }

    // For adding date of birth 
    const [DateOfBirth, setDateOfBirth] = useState({
        month:'', day: '', year:''
    })
    const handleDOB = (e,parent) =>{
        e.preventDefault();
        const {name, value} = e.target;
        setDateOfBirth((prev) => ({
            ...prev,
            [name] : value,
        }))
        const updatedDate = {...DateOfBirth, [name]:value}
        const fullCheck = Object.values(updatedDate).every(field => field !== '')
        if (fullCheck){
            const DOB = `${updatedDate.month} ${updatedDate.day}, ${updatedDate.year}`
            console.log('Submitted Date => ', DOB);
            setUserData((prev) => ({
                ...prev,
                [parent]: DOB,
            }))
        }else{
            console.log(updatedDate)
        }
    }

    // For Reading user's location and form's submission time and date
    const ReadUserLocation =() => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                async(position) =>{
                    const {latitude, longitude} = position.coords;

                    const apiKey = '68fdd8294f4942de976769c0942d3047';
                    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C${longitude}&key=${apiKey}`;
                    try{
                        const response = await axios.get(url)
                        const data = response.data.results[0].components;
                        const userLocation = `${data.town || data.village || data.city}, ${data.state || data.region}, ${data.country}`
                        setUserData((prev) =>({
                            ...prev,
                            Location: userLocation,
                        }))
                    }catch(err) {
                        console.error(err);
                    }
                }
            )
        }
    }

    useEffect(() =>{
        const UserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timeAndDate = new Date().toLocaleString('en-GB',{timeZone: UserTimeZone, hour12: false})
        const [date, time] = timeAndDate.split(', ')
        
        setUserData((prev) => ({
            ...prev,
            IdCreationDate: date,
            IdCreationTime: time,
        }))
        ReadUserLocation()
    },[])



    const handleDataEntry = (e) =>{
        e.preventDefault();
        const {name, value} = e.target;
        if(name === 'ContactNumber'){
            let newValue = value.replace(/\D/g, '');
            // Limit to 10 digits
            if (newValue.length > 10) {
                newValue = newValue.slice(0, 10);
            }
            // Format as (###) ###-####
            newValue = newValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            setUserData((prev) => ({
                ...prev,
                [name]: newValue,
            }));
        }else{
            setUserData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    }
    
    const handleSubmission =async (e) =>{
        e.preventDefault();

        await CheckUserName();

        try{
            const response = axios.post('http://localhost:4000/create-user', {
                FullName: userData.FullName,
                UserName: userData.UserName,
                Password: userData.Password,
                Email: userData.Email,
                ContactNumber: userData.ContactNumber,
                DateOfBirth: userData.DateOfBirth,
                CreationDate: userData.IdCreationDate,
                CreationTime: userData.IdCreationTime ,
                Location: userData.Location
            })
            if(response.status === 200){
                console.log('Successfully added a new user');
            }
        }catch(err ){
            console.log(err)
        }
    }


    return (
        <div className='flex lg:flex-col w-full '>
            <form onSubmit={handleSubmission}>
            {/* FullName */}
            <div>
                <label className=''>Full Name</label>
                <input type='text' placeholder='Enter your full name...' name='FullName' value={userData.FullName} onChange={handleDataEntry} />
            </div>
            {/* UserName */}
            <div>
                <label className=''>Username</label>
                <input type='text' placeholder='Enter a unique username...' name='UserName' value={userData.UserName} onChange={handleDataEntry} />
                {!usernameCheck && <h4 className='text-[1vw] text-red-700'>Username already taken</h4>}
            </div>
            {/* Email Address */}
            <div>
                <label className=''>E-Mail</label>
                <input type='email' placeholder='Enter your email address...' name='Email' value={userData.Email} onChange={handleDataEntry} />
            </div>
            {/* Contact Number */}
            <div>
                <label className=''>Contact Number</label>
                <input type='text' placeholder='Enter your contact number...' name='ContactNumber' value={userData.ContactNumber} onChange={handleDataEntry} />
            </div>
            {/* Date Of Birth */}
            <div>
                {/* Month */}
                <div>
                    <label>Month</label>
                    <select id='month' name='month' value={DateOfBirth.month} onChange={(e) => handleDOB(e,'DateOfBirth')}>
                        <option value=''>Select Month</option>
                        <option value='JAN'>January</option>
                        <option value='FEB'>February</option>
                        <option value='MAR'>March</option>
                        <option value='APR'>April</option>
                        <option value='MAY'>May</option>
                        <option value='JUN'>June</option>
                        <option value='JUL'>July</option>
                        <option value='AUG'>August</option>
                        <option value='SEP'>September</option>
                        <option value='OCT'>October</option>
                        <option value='NOV'>November</option>
                        <option value='DEC'>December</option>
                    </select>
                </div>
                {/* Day */}
                <div>
                    <label>Day</label>
                    <select id='day' name='day' value={DateOfBirth.day} onChange={(e) => handleDOB(e, 'DateOfBirth')}> 
                        <option value=''>Select Day</option>
                        {Array.from({length: 31}, (_,a) => (
                            <option key={a+1} value={String(a+1).padStart(2,'0')}>
                                {a+1}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Year */}
                <div>
                    <label>Year</label>
                    <select id='year' name='year' value={DateOfBirth.year} onChange={(e) => handleDOB(e,'DateOfBirth')}>
                        <option value=''>Select Year</option>
                        {Array.from({length: 100},(_,a) =>(
                            <option key={a} value={String(2024-a)}>
                                {2024-a}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {/* Password Entry */}
            <div>
                <label>Password</label>
                <input type='text' name='first' value={passwords.first} placeholder='Enter your password' onChange={checkPasswordSyntax}/>
                {syntaxError && <h4 className='text-[1vw] text-red-700'>{syntaxMessage}</h4>}
            </div>
            <div>
                <label>Confirm Password</label>
                <input type='text' name='second' value={passwords.second} placeholder='Enter password to confirm it' onChange={ConfirmPassword}/>
                {matchError && <h4 className='text-[1rem] text-red-700'>{matchMessage}</h4>}
                {!matchError && <h4 className='text-[1rem] text-sky-700'>{matchMessage}</h4>}
            </div>

            <button type='submit' >Submit</button>

            </form>
        </div>
    )
}

export default UserCreation