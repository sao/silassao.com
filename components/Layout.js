import Nav from './Nav'
import Content from './Content'

export default function Layout({ children }) {
    return (
        <>
            <Nav />
            <Content>
                { children }
            </Content>
        </>
    )
}