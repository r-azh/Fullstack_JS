import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Link, useNavigate } from 'react-router-native';
import { useQuery } from '@apollo/client/react';
import Constants from 'expo-constants';
import theme from '../theme';
import Text from './Text';
import { ME } from '../graphql/queries';
import useSignOut from '../hooks/useSignOut';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBar,
    paddingBottom: 10,
  },
  scrollView: {
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

const AppBarTab = ({ children, to }) => {
  return (
    <Link to={to}>
      <View style={styles.tab}>
        <Text fontWeight="bold" style={{ color: 'white' }}>
          {children}
        </Text>
      </View>
    </Link>
  );
};

const AppBar = () => {
  const { data } = useQuery(ME);
  const signOut = useSignOut();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.scrollView}>
        <AppBarTab to="/">Repositories</AppBarTab>
        {data?.me ? (
          <Pressable onPress={handleSignOut} style={styles.tab}>
            <Text fontWeight="bold" style={{ color: 'white' }}>
              Sign out
            </Text>
          </Pressable>
        ) : (
          <AppBarTab to="/signin">Sign in</AppBarTab>
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;
