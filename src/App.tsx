import { useEffect } from 'react'

function App() {
  useEffect(() => {
    // Redirect to our HTML application
    window.location.href = '/index.html';
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black text-green-500 font-mono">
      <p>Loading Terminal Typing Trainer...</p>
    </div>
  )
}

export default App