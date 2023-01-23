import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Content({children}) {
    return (
      <>
        <div className="col-span-10 bg-gray-800">
          <header></header>
          <main>
            {children}
          </main>
        </div>
      </>
    )
}