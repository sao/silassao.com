import Head from 'next/head'
import Nav from './Nav'
import Content from './Content'

import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Layout({children}) {
    return (
        <>
        <div className="grid grid-cols-12 gap-4">
            <Nav />
            <Content>
                {children}
            </Content>
        </div>
        </>
    )
}