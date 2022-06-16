import React, { useState, useRef, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import Webcam from 'react-webcam'

const Camera = () => {
  const [deviceId, setDeviceId] = React.useState({})
  const [devices, setDevices] = React.useState([])
  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const [imgSrc, setImgSrc] = useState('')
  const webcamRef = useRef()
  const handleDevices = React.useCallback(
    (mediaDevices) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput')),
    [setDevices]
  )

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices)
  }, [handleDevices])

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
  }

  useEffect(() => {
    if (devices.length > 0) {
      setSelectedDeviceId(devices[0].deviceId)
    }
  }, [devices])

  const capture = () => {
    const captured = webcamRef.current.getScreenshot()
    setImgSrc(captured)
  }

  return (
    <div>
      <h4>Capture Photo</h4>
      {imgSrc ? (
        <div>
          <img src={imgSrc} alt='test' />
        </div>
      ) : (
        devices
          .filter((item) => item.deviceId === selectedDeviceId)
          .map((item, index) => (
            <div key={index}>
              <div style={{ position: 'relative' }}>
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
                  ref={webcamRef}
                  audio={false}
                  height={'auto'}
                  screenshotFormat='image/jpeg'
                  width={'100%'}
                  videoConstraints={{ deviceId: item.deviceId }}
                />
              </div>
              <div className='mt-2'>
                <Button onClick={capture}>Capture photo</Button>
              </div>
            </div>
          ))
      )}
    </div>
  )
}

export default Camera
