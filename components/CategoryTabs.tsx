import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, Image, ActivityIndicator, View } from 'react-native';
import { Category } from '../app/types/menu';

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
  const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>({});
  const [errorImages, setErrorImages] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    categories.forEach(cat => {
      console.log('Category image URL:', cat.name, cat.imgUrl);
    });
  }, [categories]);

  const handleImageLoad = (categoryId: string) => {
    console.log('Category image loaded:', categoryId);
    setLoadingImages(prev => ({ ...prev, [categoryId]: false }));
  };

  const handleImageError = (categoryId: string) => {
    console.log('Category image error:', categoryId);
    setLoadingImages(prev => ({ ...prev, [categoryId]: false }));
    setErrorImages(prev => ({ ...prev, [categoryId]: true }));
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[styles.tab, selectedCategory === cat.name && styles.tabActive]}
          onPress={() => onSelectCategory(cat.name)}
        >
          <View style={styles.imageContainer}>
            {loadingImages[cat.id] && (
              <ActivityIndicator 
                style={styles.loader} 
                color={selectedCategory === cat.name ? '#fff' : ACCENT} 
                size="small" 
              />
            )}
            {cat.imgUrl && !errorImages[cat.id] && (
              <Image 
                source={{ uri: cat.imgUrl }} 
                style={[
                  styles.categoryImage,
                  selectedCategory === cat.name && styles.categoryImageActive
                ]}
                onLoadStart={() => {
                  console.log('Category image loading started:', cat.name, cat.imgUrl);
                  setLoadingImages(prev => ({ ...prev, [cat.id]: true }));
                }}
                onLoadEnd={() => handleImageLoad(cat.id.toString())}
                onError={(error) => {
                  console.log('Category image loading error:', error.nativeEvent, cat.name, cat.imgUrl);
                  handleImageError(cat.id.toString());
                }}
              />
            )}
          </View>
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
    alignItems: 'center',
    maxHeight: 200,
    minWidth: 100,
  },
  tabActive: {
    backgroundColor: ACCENT,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 20,
    marginBottom: 4,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  categoryImageActive: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#fff',
  },
}); 