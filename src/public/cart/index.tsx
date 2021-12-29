import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
  <App title="hello world" />,
  document.getElementById('app')
)

// @ts-ignore
module.hot.accept();