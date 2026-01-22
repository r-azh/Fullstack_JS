import { useQuery } from '@apollo/client/react';
import { GET_REPOSITORIES } from '../graphql/queries';

const useRepositories = () => {
  const { data, error, loading, refetch } = useQuery(GET_REPOSITORIES, {
    fetchPolicy: 'cache-and-network',
  });

  const repositories = data?.repositories
    ? data.repositories.edges.map(edge => edge.node)
    : [];

  return {
    repositories,
    loading,
    error,
    refetch,
  };
};

export default useRepositories;
