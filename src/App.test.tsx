import {render,screen} from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App'

test('renders navigation', async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  )
  expect(await screen.findByRole('navigation')).toBeInTheDocument()
})