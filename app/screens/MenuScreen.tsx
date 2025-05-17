import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../graphql/queries/menu';
import { Category, MenuItem } from '../types/menu';
import { CategoryTabs } from '../../components/CategoryTabs';
import { MenuItemCard } from '../../components/MenuItemCard';

const ACCENT = '#FF7A00';

export default function MenuScreen({ navigation }: any) {
  const { loading, error, data, refetch } = useQuery(GET_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (data?.categories?.length > 0 && !selectedCategory) {
      setSelectedCategory(data.categories[0].name);
    }
  }, [data]);

  const handleAddToCart = (item: MenuItem) => {
    // TODO: Call backend to add to cart
    setCartCount(cartCount + 1);
  };

  const getMenuItems = () => {
    if (!data?.categories || !selectedCategory) return [];
    const category = data.categories.find((cat: Category) => cat.name === selectedCategory);
    return category?.menuItems || [];
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ACCENT} />
          <Text style={styles.loadingText}>Loading menu...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="red" />
          <Text style={styles.errorText}>Error loading menu</Text>
          <Text style={styles.errorSubText}>{error.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.logo}
        />
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.cartIcon} onPress={() => navigation?.navigate?.('Cart')}>  
          <Ionicons name="cart-outline" size={28} color={ACCENT} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <CategoryTabs
        categories={data?.categories || []}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Menu Items */}
      <FlatList
        data={getMenuItems()}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <MenuItemCard item={item} onAddToCart={handleAddToCart} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  cartIcon: {
    marginLeft: 12,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: ACCENT,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#bbb',
    fontSize: 16,
  },
  errorText: {
    marginTop: 12,
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorSubText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: ACCENT,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 