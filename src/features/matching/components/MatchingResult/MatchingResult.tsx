import { useMutation } from '@apollo/client'
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { Button, CardMedia, CardContent, Card, Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import gql from 'graphql-tag'
import React, { useState, useMemo, useRef, RefObject } from 'react'
import TinderCard from 'react-tinder-card'
import styled from 'styled-components'
import { User } from '@/graphql/generated'

type Props = {
  users: User[]
}

const likeDocument = gql`
  mutation like($from: Int!, $to: Int!, $isLike: Boolean!) {
    like(from: $from, to: $to, isLike: $isLike)
  }
`

function MatchingResultComponents({ users }: Props) {
  const [like, { loading, error }] = useMutation(likeDocument)
  const usersLength = users.length
  const [currentIndex, setCurrentIndex] = useState(usersLength ? usersLength - 1 : 9)
  const [lastDirection, setLastDirection] = useState('')
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex)

  const childRefs: RefObject<any>[] = useMemo(
    () =>
      Array(usersLength)
        .fill(0)
        .map(() => React.createRef()),
    [],
  )

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canGoBack = currentIndex < usersLength - 1

  const canSwipe = currentIndex >= 0

  // set last direction and decrease current index
  const swiped = (direction: string, nameToDelete: string, index: number) => {
    setLastDirection(direction)
    updateCurrentIndex(index - 1)
  }

  const outOfFrame = (name: string, idx: number) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  }

  const swipe = async (dir: string, id: number) => {
    const isLike = dir === 'right'
    if (canSwipe && currentIndex < usersLength) {
      await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
      await like({ variables: { from: 1, to: id, isLike } })
    }
  }

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return
    const newIndex = currentIndex + 1
    updateCurrentIndex(newIndex)
    await childRefs[newIndex].current.restoreCard()
  }

  return (
    <StyledWrapper>
      <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
      <link href='https://fonts.googleapis.com/css?family=Alatsi&display=swap' rel='stylesheet' />
      <StyledTitle>Maching app</StyledTitle>
      <StyledCardContainer>
        {users.map((user: User, index: number) => (
          <TinderCard
            ref={childRefs[index]}
            className='swipe'
            key={user.name}
            onSwipe={(dir) => swiped(dir, user?.name, index)}
            onCardLeftScreen={() => outOfFrame(user.name, index)}
          >
            <Card>
              <CardMedia
                component='img'
                height='300'
                image={process.env.REACT_APP_FRONT_URL + user.profile_img_path}
              />
              <CardContent>
                <Typography gutterBottom variant='h5'>
                  {user.name}
                </Typography>
              </CardContent>
            </Card>
          </TinderCard>
        ))}
      </StyledCardContainer>
      <StyledButtonWrapper>
        <StyledButton onClick={() => swipe('left', users[currentIndex].id)} variant='contained'>
          <ThumbDownAltIcon />
        </StyledButton>
        <StyledButton onClick={() => goBack()} variant='contained'>
          Undo
        </StyledButton>
        <StyledButton onClick={() => swipe('right', users[currentIndex].id)} variant='contained'>
          <ThumbUpIcon />
        </StyledButton>
      </StyledButtonWrapper>
      {lastDirection ? (
        <h2 key={lastDirection} className='infoText'>
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className='infoText'>
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )}
    </StyledWrapper>
  )
}

const StyledTitle = styled('h1')`
  font-family: 'Damion', cursive;
`

const StyledWrapper = styled('div')`
  .swipe {
    position: absolute;
    max-width: 300px;
  }
  .MuiCardMedia-root {
    -webkit-user-drag: none; //CardMediaにstyledcomponentを適用できないため
  }
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  background: linear-gradient(#e66465, #9198e5);
  height: 820px;
`

const StyledCardContainer = styled('div')`
  display: flex;
  justify-content: center;
  width: 90vw;
  max-width: 260px;
  height: 400px;
`

const StyledButtonWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`

const StyledButton = styled(Button)`
  margin: 15px !important;
`

export const MatchingResult = MatchingResultComponents
