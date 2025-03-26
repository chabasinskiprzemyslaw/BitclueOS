import Sidebar from "./Sidebar"
import TrendingPanel from "./TrendingPanel"

function Layout({ children, activePage, onChangePage, isLoggedIn }) {
  if (!isLoggedIn) {
    return <div>Please log in to continue</div>
  }

  return (
    <div className="layout">
      <Sidebar activePage={activePage} onChangePage={onChangePage} isLoggedIn={isLoggedIn} />
      <main className="main-content">{children}</main>
    </div>
  )
}

export default Layout