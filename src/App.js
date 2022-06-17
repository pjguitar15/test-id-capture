import React, { useEffect, useState } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import Camera from './Camera'
import Tesseract from 'tesseract.js'

function App() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [alpha3, setAlpha3] = useState('')
  const [country, setCountry] = useState('')
  const [flag, setFlag] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [passportNum, setPassportNum] = useState('')
  const [birthday, setBirthday] = useState('')
  const [cloudinaryRes, setCloudinaryRes] = useState('')

  useEffect(() => {
    console.log('scanning')
    if (cloudinaryRes) {
      Tesseract.recognize(
        cloudinaryRes,
      ).then(({ data: { text } }) => {
        const split = text.split('\n')
        console.log(split)
        const splittedText = split[0]
        const nextLine = split[1]
        console.log(split)
        // extract country
        const resultCountry = splittedText.slice(2, 5)
        const startOfLastName = splittedText.slice(5)
        const resultLastName = startOfLastName.slice(
          0,
          startOfLastName.indexOf('<')
        )
        const startOfFirstNameIndex =
          resultCountry.length + resultLastName.length + 4
        const startOfFirstName = splittedText.slice(startOfFirstNameIndex)
        const resultFirstName = startOfFirstName.slice(
          0,
          startOfFirstName.indexOf('<')
        )
        const passportNumber = nextLine.slice(
          0,
          nextLine.indexOf(resultCountry)
        )
        const startOfDateIndex = passportNumber.length + resultCountry.length
        const startOfDate = nextLine.slice(startOfDateIndex)
        const resultBirthday =
          startOfDate.slice(0, 2) +
          '-' +
          startOfDate.slice(2, 4) +
          '-' +
          startOfDate.slice(4, 6)
        const startOfExpiryIndexSearch =
          passportNumber.length + resultCountry.length + resultBirthday.length
        console.log(nextLine.slice(startOfExpiryIndexSearch))
        axios
          .get(`https://restcountries.com/v3.1/alpha?codes=${resultCountry}`)
          .then((res) => {
            setFirstName(resultFirstName)
            setLastName(resultLastName)
            setAlpha3(resultCountry)
            setCountry(res.data[0].name.common)
            setFlag(res.data[0].flags.png)
            setCountryCode(res.data[0].ccn3)
            setPassportNum(passportNumber)
            setBirthday(resultBirthday)
          }).then((error) => {
            console.log(error)
          })
        console.log('scanning done')
      })
    }
  }, [cloudinaryRes])
  return (
    <div className='App' style={{ padding: '50px' }}>
      <div className='row'>
        <div className='col-lg-6'>
          <Camera
            cloudinaryRes={cloudinaryRes}
            setCloudinaryRes={setCloudinaryRes}
          />
        </div>
        <div className='col-lg-6'>
          <h1>Result</h1>
          <p className='text-capitalize'>
            First name: <span className='text-capitalize'>{firstName}</span>
          </p>
          <p>Last name: {lastName}</p>
          <p>
            Birthday: {birthday} (
            {birthday.length < 9
              ? 'Could not read full birthday. Please take a photo again'
              : ''}
            )
          </p>
          <p>Country: {country}</p>
          <p>Alpha 3: {alpha3}</p>
          <p>Country code: {countryCode}</p>
          <p>Passport number: {passportNum}</p>
          <img src={flag} alt='flag' style={{ height: '20px' }} />
          {/* <img src={test} alt='' /> */}
        </div>
      </div>
    </div>
  )
}

export default App
