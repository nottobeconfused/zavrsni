import PropTypes from 'prop-types'
import React, { Component } from 'react'

export class NotFound extends Component {
  static propTypes = {}

  render() {
    return (
        <>
        <div className="error">
          <h1>Not found</h1>
        </div>
        </>
    )
  }
}

export default NotFound