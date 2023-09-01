import React, { useState, useMemo } from 'react';
import { Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import { generateCustomCitation } from './processors';
import './app.css';

function App() {
  const [ query, setQuery ] = useState<string>('')
  const [ isPending, setIsPending ] = useState<boolean>(false) 
  const [ citation, setCitation ] = useState<string>('')
  const [ stackbarOpened, setStackbarOpened ] = useState<boolean>(false)
  const [ stackbarReason, setStackbarReason ] = useState<string>('')
  const customCitation = useMemo(() => {
    return generateCustomCitation(citation)
  }, [citation])

  const REASONS = {
    SUCCESS: 'The citation is copied to your clipboard',
    ERROR: 'An Error Occured',
    FAILED: 'Request Failed'
  }

  const closeSnackbar = () => setStackbarOpened(false)
  
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setIsPending(true)
    closeSnackbar()

    try {
      const res = await fetch(`https://citation.crosscite.org/format?style=apa&lang=en-US&doi=${query}`)
      const value = await res.text()

      if(res.status === 200) {
        setCitation(value)
        navigator.clipboard.writeText(generateCustomCitation(value) || value)
        setStackbarReason(REASONS.SUCCESS)
      } else {
        setStackbarReason(value ?? REASONS.ERROR)
      } 
    } catch {
      setStackbarReason(REASONS.FAILED)
    } finally {
      setStackbarOpened(true)
      setIsPending(false)
    }
  }

  const handleCitationClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setStackbarOpened(false)
    const citation = document.getElementById(e.currentTarget.id)?.textContent as string
    navigator.clipboard.writeText(citation)
    setTimeout(() => {
      setStackbarOpened(true)
      setStackbarReason(REASONS.SUCCESS)
    }, 100)
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    setQuery(e.target.value)
  }

  return (
    <div className={`app ${isPending ? 'pending' : undefined}`}>
      <h2>Cite by DOI</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          autoFocus
          id="standard-error"
          label="enter DOI"
          value={query}
          onChange={handleChange}
          variant="standard"
          required
        />
        <Button type='submit' style={{margin: '1.5rem auto', display: 'block'}} variant="contained">Search</Button>
      </form>
      {
        citation ?
        <button id='original' onClick={handleCitationClick} className='citation'>
          {citation}
        </button> :
        <p>* ~~~~~~~~~~~~~~~~~~~~~~ *</p>
      }
      <br />
      {
        !!customCitation &&
        <button id='custom' onClick={handleCitationClick} className='citation'>{customCitation}</button>
      }
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={stackbarOpened} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity={stackbarReason === REASONS.SUCCESS ? 'success' : 'error'} sx={{ width: '100%' }}>
          {stackbarReason}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
