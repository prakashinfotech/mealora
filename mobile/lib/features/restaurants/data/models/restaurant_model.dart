class Restaurant {
  const Restaurant({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    required this.imageUrl,
    this.bannerUrl,
    required this.cuisineType,
    required this.address,
    required this.area,
    required this.city,
    required this.rating,
    required this.ratingCount,
    required this.avgDeliveryTime,
    required this.deliveryFee,
    required this.minOrderAmount,
    this.isOpen = true,
    this.isActive = true,
  });

  final String id;
  final String name;
  final String slug;
  final String? description;
  final String imageUrl;
  final String? bannerUrl;
  final String cuisineType; // joined from cuisines[]
  final String address;
  final String area;
  final String city;
  final double rating;
  final int ratingCount;
  final int avgDeliveryTime;
  final double deliveryFee;
  final double minOrderAmount;
  final bool isOpen;
  final bool isActive;

  factory Restaurant.fromJson(Map<String, dynamic> json) {
    final cuisines = json['cuisines'] as List<dynamic>? ?? [];
    return Restaurant(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String?,
      imageUrl: json['imageUrl'] as String? ?? '',
      bannerUrl: json['bannerUrl'] as String?,
      cuisineType: cuisines.isEmpty ? '' : cuisines.join(', '),
      address: json['address'] as String? ?? '',
      area: json['area'] as String? ?? '',
      city: json['city'] as String? ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      ratingCount: json['ratingCount'] as int? ?? 0,
      avgDeliveryTime: json['avgDeliveryTime'] as int? ?? 30,
      deliveryFee: (json['deliveryFee'] as num?)?.toDouble() ?? 0.0,
      minOrderAmount: (json['minOrderAmount'] as num?)?.toDouble() ?? 0.0,
      isOpen: json['isOpen'] as bool? ?? true,
      isActive: json['isActive'] as bool? ?? true,
    );
  }
}

class MenuCategory {
  const MenuCategory({
    required this.id,
    required this.name,
    this.description,
    required this.sortOrder,
    required this.items,
  });

  final String id;
  final String name;
  final String? description;
  final int sortOrder;
  final List<MenuItem> items;

  factory MenuCategory.fromJson(Map<String, dynamic> json) => MenuCategory(
        id: json['id'] as String,
        name: json['name'] as String,
        description: json['description'] as String?,
        sortOrder: json['sortOrder'] as int? ?? 0,
        items: (json['items'] as List<dynamic>? ?? [])
            .map((e) => MenuItem.fromJson(e as Map<String, dynamic>))
            .toList(),
      );
}

class MenuItem {
  const MenuItem({
    required this.id,
    required this.name,
    this.description,
    required this.price,
    this.imageUrl,
    this.isVeg = true,
    this.isAvailable = true,
    required this.categoryId,
  });

  final String id;
  final String name;
  final String? description;
  final double price;
  final String? imageUrl;
  final bool isVeg;
  final bool isAvailable;
  final String categoryId;

  factory MenuItem.fromJson(Map<String, dynamic> json) => MenuItem(
        id: json['id'] as String,
        name: json['name'] as String,
        description: json['description'] as String?,
        price: (json['price'] as num).toDouble(),
        imageUrl: json['imageUrl'] as String?,
        isVeg: json['isVeg'] as bool? ?? true,
        isAvailable: json['isAvailable'] as bool? ?? true,
        categoryId: json['categoryId'] as String,
      );
}

class RestaurantDetail {
  const RestaurantDetail({
    required this.restaurant,
    required this.categories,
  });

  final Restaurant restaurant;
  final List<MenuCategory> categories;

  // Backend returns the restaurant object directly with categories embedded,
  // not a wrapper { restaurant: {}, categories: [] }.
  factory RestaurantDetail.fromJson(Map<String, dynamic> json) =>
      RestaurantDetail(
        restaurant: Restaurant.fromJson(json),
        categories: (json['categories'] as List<dynamic>? ?? [])
            .map((e) => MenuCategory.fromJson(e as Map<String, dynamic>))
            .toList(),
      );
}

class RestaurantsResponse {
  const RestaurantsResponse({
    required this.items,
    required this.total,
    required this.page,
    required this.limit,
    required this.hasMore,
  });

  final List<Restaurant> items;
  final int total;
  final int page;
  final int limit;
  final bool hasMore;

  factory RestaurantsResponse.fromJson(Map<String, dynamic> json) =>
      RestaurantsResponse(
        items: (json['items'] as List<dynamic>)
            .map((e) => Restaurant.fromJson(e as Map<String, dynamic>))
            .toList(),
        total: json['total'] as int,
        page: json['page'] as int,
        limit: json['limit'] as int,
        hasMore: json['hasMore'] as bool,
      );
}
