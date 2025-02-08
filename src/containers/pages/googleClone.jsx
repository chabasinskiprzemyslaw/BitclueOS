import { Grid, Mic, Camera } from "lucide-react"

export default function GoogleClone() {
  return (
    <div className="min-h-screen bg-[#202124] text-white flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-end items-center gap-4">
        <a href="#" className="text-sm hover:underline">
          Gmail
        </a>
        <a href="#" className="text-sm hover:underline">
          Images
        </a>
        <button className="p-2 hover:bg-gray-700 rounded-full">
          <Grid className="w-5 h-5" />
        </button>
        <button className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">P</button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center gap-6 -mt-20">
        <img
          src="https://www.google.pl/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png"
          alt="Google Logo"
          className="w-[272px]"
        />

        <div className="w-full max-w-[584px] relative">
          <div className="relative">
            <input
              type="text"
              className="w-full bg-[#202124] border border-gray-700 rounded-full py-3 px-12 focus:outline-none focus:border-gray-500 hover:bg-[#303134] hover:border-[#5f6368]"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-4">
              <Mic className="w-5 h-5 text-blue-500" />
              <Camera className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button className="px-4 py-2 bg-[#303134] hover:border hover:border-gray-700 rounded text-sm">
              Google Search
            </button>
            <button className="px-4 py-2 bg-[#303134] hover:border hover:border-gray-700 rounded text-sm">
              {"I'm Feeling Lucky"}
            </button>
          </div>

          <div className="mt-6 text-sm text-center">
            Google offered in:{" "}
            <a href="#" className="text-[#8ab4f8] hover:underline">
              polski
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-[#171717] text-[#999da2] text-sm">
        <div className="px-6 py-3 border-b border-gray-700">Poland</div>
        <div className="px-6 py-3 flex flex-wrap justify-between gap-y-3">
          <div className="flex gap-6">
            <a href="#" className="hover:underline">
              About
            </a>
            <a href="#" className="hover:underline">
              Advertising
            </a>
            <a href="#" className="hover:underline">
              Business
            </a>
            <a href="#" className="hover:underline">
              How Search works
            </a>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <a href="#" className="hover:underline">
              Settings
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

