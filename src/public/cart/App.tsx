import React from "react"

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = ({ title }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <h1>
      Hello World
    </h1>
  </div>
);

export default App;