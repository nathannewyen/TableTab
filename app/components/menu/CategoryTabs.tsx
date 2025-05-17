import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Category } from '../../types/menu';

const ACCENT = '#FF7A00';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (name: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[styles.tab, selectedCategory === cat.name && styles.tabActive]}
          onPress={() => onSelectCategory(cat.name)}
        >
          <Text style={[styles.tabText, selectedCategory === cat.name && styles.tabTextActive]}>
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#F7F7F7',
    marginRight: 10,
  },
  tabActive: {
    backgroundColor: ACCENT,
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 16,
  },
  tabTextActive: {
    color: '#fff',
  },
}); 