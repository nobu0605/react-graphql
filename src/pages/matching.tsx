import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { MatchingResult } from '@/features/matching/components/MatchingResult/MatchingResult'

const usersDocument = gql`
  query unlikedUsers($userId: Int!) {
    unlikedUsers(userId: $userId) {
      id
      name
      profile_img_path
    }
  }
`

function Matching() {
  const { loading, error, data } = useQuery(usersDocument, { variables: { userId: 1 } })

  if (!data || loading) {
    return <></>
  }

  return (
    <>
      <MatchingResult users={data.unlikedUsers} />
    </>
  )
}

export default Matching
