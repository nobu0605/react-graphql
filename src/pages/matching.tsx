import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import React from 'react'
import { MatchingResult } from '@/features/matching/components/MatchingResult/MatchingResult'

const usersDocument = gql`
  query users {
    users {
      id
      name
      profile_img_path
    }
  }
`

function Matching() {
  const { loading, error, data } = useQuery(usersDocument)

  if (!data || loading) {
    return <></>
  }

  console.log('data: ', data)
  return (
    <>
      <MatchingResult users={data.users} />
    </>
  )
}

export default Matching
