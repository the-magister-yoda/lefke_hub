function SearchBar({ setSearch }) {

  return (

    <input
      placeholder="Search ads..."
      className="border p-3 w-full rounded mb-6"
      onChange={(e) => setSearch(e.target.value)}
    />

  )
}

export default SearchBar