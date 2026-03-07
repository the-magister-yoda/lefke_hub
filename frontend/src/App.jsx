import { useEffect, useState } from "react"

function App() {

  const [data, setData] = useState(null)

  useEffect(() => {
    fetch("http://localhost:8000/ads")
      .then(response => response.json())
      .then(data => setData(data))
  }, [])

  return (
    <div>
      <h1>Frontend работает</h1>
      <h2>Ответ от FastAPI:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default App