import React from 'react'
import Styled from '@emotion/styled'

const Wrapper = Styled.section`
  ${props =>
    props.centered
      ? `display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;`
      : ''}
`

const Container = Styled.div`
  max-width: ${props => (props.big ? '960px' : '700px')};
  margin: 0 auto;
  width: 80%;
`

const Section = ({ name, centered, children, big }) => {
  return (
    <Wrapper id={name} centered={centered}>
      <Container big={big}>{children}</Container>
    </Wrapper>
  )
}

export default Section
