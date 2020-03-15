import React from 'react'
import Styled from '@emotion/styled'
import { capitalize } from '../utils/string'
import theme from '../../theme'

const Pill = Styled.span`
  font-size: 1.5rem;
  display: inline-flex;
  align-items: center;
  padding: 0 1rem;
  height: 2.5rem;
  margin: 0.2rem;
  margin-right: 10px;
  border-radius: 1.2rem;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.muted};

  $:not(:first-child) {
    margin-left: 0;
  }
`

const Pills = ({ items }) => {
  return (
    <div>
      {(items || []).map(item => (
        <Pill key={item}>{capitalize(item)}</Pill>
      ))}
    </div>
  )
}

export default Pills
