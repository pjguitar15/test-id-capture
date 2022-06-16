import React, { useState, useRef, useEffect, useCallback } from 'react'
import Axios from 'axios'
import { Button } from 'react-bootstrap'
import Webcam from 'react-webcam'

const Camera = () => {
  const [devices, setDevices] = useState([])
  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const [imgSrc, setImgSrc] = useState('')
  const [cloudinaryRes, setCloudinaryRes] = useState('')
  const [cameraHeight, setCameraHeight] = useState(0)
  const [cameraWidth, setCameraWidth] = useState(0)
  const [cameraOn, setCameraOn] = useState(false)
  const webcamRef = useRef()
  const widthHeightRef = useRef()

  const handlePlay = () => {
    console.log(webcamRef.current.clientWidth)
  }

  const handleDevices = React.useCallback(
    (mediaDevices) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput')),
    [setDevices]
  )

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices)
  }, [handleDevices])

  useEffect(() => {
    if (devices.length > 0) {
      setSelectedDeviceId(devices[0].deviceId)
    }
  }, [devices])

  const capture = () => {
    const captured = webcamRef.current.getScreenshot()
    setImgSrc(captured)
    console.log(webcamRef.current.getBoundingclientRect)
    // setCameraHeight(webcamRef.current.clientHeight)
    // setCameraWidth(webcamRef.current.clientWidth)
    // we can save it to cloudinary, crop it there, and get the cropped results
    // we can also take photo,
    // install it first using npm i axios
  }

  useEffect(() => {
    // how to use axios. this is inside uploadImage function
    const formData = new FormData()
    if (imgSrc) {
      formData.append('file', imgSrc) // selectedImage is a state
      formData.append('upload_preset', 'aipowered')

      const cloudName = 'philcob'
      Axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      ).then((res) => {
        const firstPartOfUrl = res.data.url.slice(
          0,
          res.data.url.indexOf('load/') + 5
        )
        const newHeightValue = 0.3 * widthHeightRef.current.clientHeight
        const cropUrl = `c_crop,h_${Math.floor(newHeightValue)},w_${
          widthHeightRef.current.clientWidth
        }`
        const lastPartOfUrl = res.data.url.slice(
          res.data.url.indexOf('load/') + 4
        )
        setCloudinaryRes(firstPartOfUrl + cropUrl + lastPartOfUrl)
        console.log(firstPartOfUrl + cropUrl + lastPartOfUrl)
      }) // res.data.url takes the image url
    }
  }, [imgSrc])
  return (
    <div>
      <h4>Capture Photo</h4>
      <Button
        style={{ display: cameraOn ? 'none' : 'block' }}
        onClick={() => setCameraOn(true)}
      >
        Turn on camera
      </Button>
      {cloudinaryRes ? (
        <div>
          <img src={cloudinaryRes} alt='test' />
        </div>
      ) : (
        devices
          .filter((item) => item.deviceId === selectedDeviceId)
          .map((item, index) => (
            <div key={index}>
              <div ref={widthHeightRef} style={{ position: 'relative' }}>
                <div
                  className='bg-dark'
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    height: '35%',
                    width: '100%',
                    opacity: '0.7',
                  }}
                ></div>
                <div
                  className='bg-dark'
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    height: '35%',
                    width: '100%',
                    opacity: '0.7',
                  }}
                ></div>
                <Webcam
                  onPlay={handlePlay}
                  style={{ display: cameraOn ? 'block' : 'none' }}
                  ref={webcamRef}
                  audio={false}
                  height={'auto'}
                  screenshotFormat='image/jpeg'
                  width={'100%'}
                  videoConstraints={{ deviceId: item.deviceId }}
                />
              </div>
              <div className='mt-2'>
                <Button
                  style={{ display: cameraOn ? 'block' : 'none' }}
                  onClick={capture}
                >
                  Capture photo
                </Button>
              </div>
            </div>
          ))
      )}
    </div>
  )
}
export default Camera
