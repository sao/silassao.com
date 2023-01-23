import Image from "next/image"
import Logo from '../public/logo_1600.png'
import Link from "next/link"

export default function Nav() {
    return (
        <nav className="col-span-2 bg-zinc-600">
            <Image src={Logo}/>
            <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/contact">Contact</Link></li>
            </ul>
        </nav>
    )
}