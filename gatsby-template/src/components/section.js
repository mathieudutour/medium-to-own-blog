import React from 'react'
import PropTypes from 'prop-types'

import './section.css'

const Section = ({ name, centered, children, big }) => {
  return (
    <section id={name} className={centered ? 'center' : ''}>
      <div className={`${big ? '' : 'container small'}`}>{children}</div>
    </section>
  )
}

Section.propTypes = {
  name: PropTypes.string.isRequired,
  centered: PropTypes.bool,
  big: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default Section
