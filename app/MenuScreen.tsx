import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image as RNImage } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { gql, useQuery } from '@apollo/client';

const ACCENT = '#FF7A00';

// GraphQL query to fetch categories and their menu items
const GET_CATEGORIES = gql`
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

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
}

interface Category {
  id: number;
  name: string;
  description: string;
  imgUrl: string;
  menuItems: MenuItem[];
}

export default function MenuScreen({ navigation }: any) {
  const { loading, error, data } = useQuery(GET_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  // Set initial selected category when data loads
  useEffect(() => {
    if (data?.categories?.length > 0 && !selectedCategory) {
      setSelectedCategory(data.categories[0].name);
    }
  }, [data]);

  const handleAddToCart = (item: MenuItem) => {
    // TODO: Call backend to add to cart
    setCartCount(cartCount + 1);
  };

  // Get menu items for selected category
  const getMenuItems = () => {
    if (!data?.categories || !selectedCategory) return [];
    const category = data.categories.find(cat => cat.name === selectedCategory);
    return category?.menuItems || [];
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading menu: {error.message}</Text>
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {data?.categories?.map((cat: Category) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.tab, selectedCategory === cat.name && styles.tabActive]}
            onPress={() => setSelectedCategory(cat.name)}
          >
            <Text style={[styles.tabText, selectedCategory === cat.name && styles.tabTextActive]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Food List */}
      <FlatList
        data={getMenuItems()}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.menuList}
        refreshing={loading}
        onRefresh={() => {}} // Apollo Client handles refresh automatically
        ListEmptyComponent={
          loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : (
            <Text style={styles.emptyText}>No items found.</Text>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <RNImage source={{ uri: item.imageUrl }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
                <TouchableOpacity 
                  style={[styles.addButton, !item.isAvailable && styles.addButtonDisabled]} 
                  onPress={() => handleAddToCart(item)}
                  disabled={!item.isAvailable}
                >
                  <Text style={styles.addButtonText}>
                    {item.isAvailable ? 'Add to Cart' : 'Not Available'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  menuList: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F7F7F7',
    borderRadius: 16,
    marginBottom: 18,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardImage: {
    width: 90,
    height: 90,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    backgroundColor: '#eee',
  },
  cardContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ACCENT,
  },
  addButton: {
    borderRadius: 20,
    backgroundColor: ACCENT,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
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
    textAlign: 'center',
    marginTop: 40,
    color: 'red',
    fontSize: 16,
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
}); 