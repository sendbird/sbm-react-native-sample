import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Text, TouchableOpacity, View, useColorScheme} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ChevronRight from '../../assets/chevron-right.svg';
import {COLORS} from '../../constants';
import {handleSignOut} from '../../redux/slices/sendbird';

export default function HomeContent() {
  const unreadCount = useSelector(state => state.sendbird.unreadCount);
  const navigation = useNavigation();
  const selectedTheme = useColorScheme();

  const dispatch = useDispatch();

  const handleSignOutButton = () => {
    dispatch(handleSignOut());
  };

  const isUnread = unreadCount > 0;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <View style={styles.feedBtnContainer}>
            <Text style={styles.feedBtnText}>Feed Channel</Text>
            <View style={{marginLeft: 'auto', flexDirection: 'row'}}>
              {isUnread && (
                <View style={styles.unreadCount(unreadCount)}>
                  <Text style={styles.unreadCountText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                </View>
              )}
              <ChevronRight height={20} width={20} style={styles.image} />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signOutBtn(selectedTheme)} onPress={handleSignOutButton}>
          <Text style={styles.signOutBtnText(selectedTheme)}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingTop: 24,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  feedBtnContainer: {
    alignItems: 'center',
    height: 72,
    maxHeight: 72,
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: COLORS.gray,
  },
  feedBtnText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 24,
    marginLeft: 24,
  },
  unreadCount: count => ({
    borderRadius: 9999,
    width: count > 99 ? 33 : 20,
    height: 20,
    backgroundColor: '#DE360B',
    alignItems: 'center',
    marginRight: 8,
  }),
  unreadCountText: {
    fontSize: 12,
    fontWeight: '700',
    top: '10%',
    color: '#FFFFFF',
  },
  image: {
    marginRight: 16,
    color: '#000',
  },
  signOutBtn: selectedTheme => ({
    marginTop: 32,
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: COLORS[selectedTheme].border,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  signOutBtnText: selectedTheme => ({
    color: COLORS[selectedTheme].text,
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 24,
  }),
});
