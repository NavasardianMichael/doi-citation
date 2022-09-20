import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import './app.css';
import { Button } from '@mui/material';

function App() {
  const [ query, setQuery ] = useState<string>('')
  const [ citation, setCitation ] = useState<string>('* ~~~~~~~~~~~~~~~~~~~~~~ *')
  const [ stackbarOpened, setStackbarOpened ] = useState<boolean>(false)
  const [ stackbarReason, setStackbarReason ] = useState<string>('')

  const REASONS = {
    SUCCESS: 'The citation is copied to your clipboard',
    ERROR: 'An Error Occured',
  }

  const closeSnackbar = () => setStackbarOpened(false)
  
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    closeSnackbar()

    const res = await fetch(`https://citation.crosscite.org/format?style=apa&lang=en-US&doi=${query}`)
    const value = await res.text()

    if(res.status === 200) {
      setCitation(value)
      navigator.clipboard.writeText(value)
      setStackbarOpened(true)
      setStackbarReason(REASONS.SUCCESS)
    } else {
      setStackbarOpened(true)
      setStackbarReason(value ?? REASONS.ERROR)
    }    
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    setQuery(e.target.value)
  }

  return (
    <div className="app">
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
      <h3>Citation</h3>
      <p>{citation}</p>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={stackbarOpened} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity={stackbarReason === REASONS.SUCCESS ? 'success' : 'error'} sx={{ width: '100%' }}>
          {stackbarReason}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
