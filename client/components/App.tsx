import '../main.css'
import Canvas from './Canvas'

function App() {
  return (
    <div className="App" style={{ backgroundImage: 'url(images/default-background.svg)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
      <Canvas width={1040} height={750} />
    </div>
  )
}

export default App
