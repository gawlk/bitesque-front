/* @refresh reload */
import { MetaProvider } from '@solidjs/meta'
import routes from '~solid-pages'

import './styles/main.css'
import 'tailwindcss/tailwind.css'

console.log('routes', routes)

const root = document.getElementById('root')

if (root) {
  const Routes = useRoutes(routes)

  render(
    () => (
      <MetaProvider>
        <Router>
          <Routes />
        </Router>
      </MetaProvider>
    ),
    root
  )
}
