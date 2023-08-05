import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap">SEFTOP REPAIRS!</span></h1>
            </header>
            <main className="public__main">
                <p>Located in Beautiful Downtown Foo City,  provides a trained staff ready to meet your tech repair needs.</p>
                <address className="public__addr">
                    SEFTOP Repairs<br />
                    555 Foo Drive<br />
                    Foo City, CA 12345<br />
                    <a href="tel:+15555555555">(051) 471-5530</a>
                </address>
                <br />
                <p>Owner:Davidson</p>
                <h6>Software by: ahamd mujtaba</h6>

            </main>
            <footer>
                <Link to="/login">Employee Login</Link>
            </footer>
        </section>

    )
    return content
}
export default Public