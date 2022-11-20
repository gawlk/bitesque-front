/* @refresh reload */
import routes from '~solid-pages'

import './styles/main.css'
import 'tailwindcss/tailwind.css'

console.log('routes', routes)

const root = document.getElementById('root')

if (root) {
  const Routes = useRoutes(routes)

  render(
    () => (
      <Router>
        <Routes />
      </Router>
    ),
    root
  )
}
