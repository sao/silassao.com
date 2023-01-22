import Head from 'next/head'
import Nav from './Nav'
import Content from './Content'

import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Layout({children}) {
    return (
        <>
            <Nav />
            { children }
        </>
    )
}