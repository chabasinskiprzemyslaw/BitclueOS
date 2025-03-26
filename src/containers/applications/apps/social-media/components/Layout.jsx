import Sidebar from "./Sidebar"
import TrendingPanel from "./TrendingPanel"

function Layout({ children, activePage, onChangePage }) {
  return (
    <div className="layout">
      <Sidebar activePage={activePage} onChangePage={onChangePage} />
      <main className="main-content">{children}</main>
    </div>
  )
}

export default Layout