import SearchBar from 'D:/isitonhydra/components/SearchBar'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-purple-500 to-pink-500">
      <h1 className="text-6xl font-bold text-white mb-8">Is it on Hydra?</h1>
      <SearchBar />
    </main>
  )
}

