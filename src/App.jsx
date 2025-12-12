import OnSaleNow from "./components/onSaleNow"
import UserData from "./components/userData"


function App() {

  return (
    <div className="bg-red-400 border-4 border-amber-300">
      {/* Tags */}

      <UserData/>

      <OnSaleNow />

    </div>
  )
}

export default App
