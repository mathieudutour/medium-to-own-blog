import React from "react"
import { capitalize } from "../utils/string"

import "./pills.css"

function cssSafe(str) {
  return encodeURIComponent(str.toLowerCase()).replace(/%[0-9A-F]{2}/gi, "")
}

const Pills = ({ items }) => {
  return (
    <div className="pills">
      {(items || []).map(item => (
        <span
          className={`pill pill--${cssSafe(item)}`}
          key={item}
          style={{ marginRight: 10 }}
        >
          {capitalize(item)}
        </span>
      ))}
    </div>
  )
}

export default Pills
