import "./css/Header.css"

function Header() {
    return(
        <>
            <div className="center-header">
                <div className="header-body">
                    <div className="header-left">
                        <div className="logo-name">BlueXross</div>
                    </div>

                    <div className="header-middle">
                        <a href="/user" className="nav-links">User</a>
                        <a href="/verifier" className="nav-links">Verifier</a>
                        <a href="/admin" className="nav-links">Admin</a>
                    </div>

                    <div className="header-right">
                        <button className="rescue-btn">Raise a Rescue!</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header