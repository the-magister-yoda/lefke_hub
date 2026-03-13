import { useEffect, useState } from "react"
import { api } from "../api/api"
import AdCard from "../components/AdCard"
import SearchBar from "../components/SearchBar"
import Categories from "../components/Categories"

function Home() {
  const [ads, setAds] = useState([])
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  useEffect(() => {
    api.get("/ad", { params: { search, category: categoryFilter } })
       .then(res => setAds(res.data.items))
  }, [search, categoryFilter])

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <SearchBar setSearch={setSearch} />
        <Categories setCategoryFilter={setCategoryFilter} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ads.map(ad => <AdCard key={ad.id} ad={ad} />)}
        </div>
      </div>
    </div>
  )
}

export default Home