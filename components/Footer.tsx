import { MoveUp } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-black border-t py-4 border-white/10 text-white pb-4 px-6 md:px-20 relative overflow-hidden">
      <div className="text-xs md:text-sm text-gray-300 tracking-tight flex justify-between items-center mx-auto z-10 relative">
        <p>All rights reserved © {new Date().getFullYear()}</p>
        <p>YourMedia</p>
      </div>
    </footer>
  )
}

export default Footer
