import {FlatList, StyleSheet, Text, TouchableOpacity, View, useColorScheme} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {initCollection} from '../../redux/slices/sendbird';
import {parseThemeColor} from '../../utils';

export default function CategoryFilters() {
  const dispatch = useDispatch();
  const selectedTheme = useColorScheme();
  const isCategoryFilterEnabled = useSelector(state => state.sendbird.feedChannel.isCategoryFilterEnabled);
  const categories = useSelector(state => state.sendbird.feedChannel.notificationCategories);
  const categorySettings = useSelector(state => state.sendbird.globalSettings.themes[0].list.category);
  const activeFilter = useSelector(state => state.sendbird.activeFilter);

  if (isCategoryFilterEnabled) {
    return (
      <View style={styles.filterContainer}>
        <FlatList
          data={categories}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.filter(activeFilter, item.customType, categorySettings, selectedTheme)}
              onPress={() => {
                dispatch(initCollection({selectedFilter: item.customType}));
              }}>
              <Text style={styles.filterText(activeFilter, item.customType, categorySettings, selectedTheme)}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.customType}
          contentContainerStyle={{columnGap: 8}}
          horizontal
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  filterContainer: {
    width: '100%',
    padding: 16,
  },
  filter: (activeFilter, item, theme, selectedTheme) => ({
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.radius,
    backgroundColor:
      activeFilter === item
        ? parseThemeColor(theme.selectedBackgroundColor, selectedTheme)
        : parseThemeColor(theme.backgroundColor, selectedTheme),
  }),
  filterText: (activeFilter, item, theme, selectedTheme) => ({
    fontSize: theme.textSize,
    fontWeight: '500',
    color:
      activeFilter === item
        ? parseThemeColor(theme.selectedTextColor, selectedTheme)
        : parseThemeColor(theme.textColor, selectedTheme),
  }),
});
