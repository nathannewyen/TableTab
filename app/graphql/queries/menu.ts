import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      description
      imgUrl
      menuItems {
        id
        name
        description
        price
        imageUrl
        isAvailable
      }
    }
  }
`; 