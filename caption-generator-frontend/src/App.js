import { useEffect } from 'react';
import './App.css';
import { useRef, useState } from 'react';

function App() {

  const hiddenFileInput = useRef(null);
  const uploadedImageRef = useRef(null);

  const [file, setFile] = useState(null);
  const [mood, setMood] = useState('')
  const [captions, setCaptions] = useState([])
  const [isGenerating, setGenerating] = useState(false)
  const [selectedmood, setSelectedmood] = useState([false, false, false, false])
  const captionsListRef = useRef(null)

  useEffect(() => {
    if (captionsListRef && captionsListRef.current) {
      captionsListRef.current.scrollIntoView({ behavior: "smooth" })
    }

  }, [isGenerating])

  const onClickHandler = event => {
    hiddenFileInput.current.click();

  }

  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    setFile(URL.createObjectURL(fileUploaded))
  };

  function onClickSetMood(mood, moodid) {
    const newmood = [false, false, false, false]
    newmood[moodid] = true
    setSelectedmood(newmood)

    setMood(mood)
    console.log("Mood is set to " + mood)
  };

  function onClickGenerate(event) {
    console.log("clicked!")

    setGenerating(true)
    const formdata = new FormData()
    formdata.append('mood', mood)
    formdata.append('img', hiddenFileInput.current.files[0])

    const requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    fetch("https://caption-craft-7sv56ny6rq-uc.a.run.app/captions", requestOptions)
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(data => {

        let res_string = data.captions
        res_string = res_string.replace('\n+', '\n')
        let temp = res_string.split('\n')

        temp = temp.filter(capn => capn !== '')

        console.log('temp = ' + temp)

        setCaptions([...temp]);
        setGenerating(false);
        console.log(captions)
      })
      .catch(error => {
        setCaptions([]);
        setGenerating(false)
        console.log("Generating failed " + error)
      })

  }

  const handleCopyClick = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className='app-container'>
      <div className='big-header'>

        <h1 className="header-line mb-5">Let's Unlock Your Instagram Potential!</h1>

        <span onClick={onClickHandler} className="my-button btn btn-primary">
          Upload Image
        </span>

        <input type='file' ref={hiddenFileInput} onChange={handleChange} className='file-input' />

      </div>



      {
        file != null &&
        <div className='preview-container'>

          <div className='preview-image-container'>
            <img src={file} alt='Uploaded image' className='preview-image' ref={uploadedImageRef} onLoad={event => event.currentTarget.scrollIntoView({ behavior: "smooth" })} />
          </div>

          <div className='card-container'>
            <div className="custom-card card">
              <div className="card-body">
                <h5 className="card-title mb-3">Select a mood for your caption...</h5>
                <p className="card-text">

                  <button className='emoji' onClick={() => onClickSetMood('quirky', 0)}>&#128540;</button>
                  <button className='emoji' onClick={() => onClickSetMood('happy', 1)}>&#128513;</button>
                  <button className='emoji' onClick={() => onClickSetMood('calm', 2)}>&#128524;</button>
                  <button className='emoji' onClick={() => onClickSetMood('mischievous', 3)}>&#128520;</button>

                </p>
              </div>
            </div>

            {!isGenerating &&
              <button onClick={onClickGenerate} disabled={mood == ""} className="my-button-generate btn btn-primary">
                Generate {mood} caption
              </button>
            }

            {
              isGenerating && <div className="lds-heart"><div></div></div>
            }

          </div>

        </div>
      }

      {captions.length > 0 && !isGenerating &&
        <div className='caption-list' ref={captionsListRef}>
          <ul className='my-ul'>
            <h3 className="mb-5">Click to copy, happy posting!</h3>
            {captions.map((item, id) =>
            (<li key={id} onClick={(event) => navigator.clipboard.writeText(event.currentTarget.innerText)}>{item}</li>

            ))}
          </ul>
        </div>
      }

      {/* <footer>
        <p>Made at UB-Hacks 2023</p>
        <p>Vineet Kalghatgi | Madhura Satao</p>
      </footer> */}

    </div>
  );
}

export default App;
