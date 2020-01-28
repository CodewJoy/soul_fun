import React from "react"
import ReactDOM from "react-dom"
import './style.css'

class App extends React.Component {
    render() {
        return (
            <div>
                Hello, JSX
            </div>
        )
    }
}
ReactDOM.render(<App/>, document.querySelector("#root"))