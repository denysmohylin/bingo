import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import BingoBallGame from './Ball';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BingoBallGame />
    </>
  );
}

export default App;
