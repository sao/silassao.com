import Nav from './nav'
import Content from './content'

export default function Layout({ children }) {
    return (
        <>
            <Nav>
                
            </Nav>
            <Content>
                { children }
            </Content>
        </>
    )
}