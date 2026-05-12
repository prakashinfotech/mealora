// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'restaurant_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$RestaurantImpl _$$RestaurantImplFromJson(Map<String, dynamic> json) =>
    _$RestaurantImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String?,
      imageUrl: json['imageUrl'] as String?,
      bannerUrl: json['bannerUrl'] as String?,
      cuisineType: json['cuisineType'] as String,
      address: json['address'] as String,
      city: json['city'] as String,
      state: json['state'] as String?,
      rating: (json['rating'] as num).toDouble(),
      reviewCount: (json['reviewCount'] as num).toInt(),
      deliveryTime: (json['deliveryTime'] as num).toInt(),
      deliveryFee: (json['deliveryFee'] as num).toDouble(),
      minimumOrder: (json['minimumOrder'] as num).toDouble(),
      isActive: json['isActive'] as bool? ?? true,
    );

Map<String, dynamic> _$$RestaurantImplToJson(_$RestaurantImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'slug': instance.slug,
      'description': instance.description,
      'imageUrl': instance.imageUrl,
      'bannerUrl': instance.bannerUrl,
      'cuisineType': instance.cuisineType,
      'address': instance.address,
      'city': instance.city,
      'state': instance.state,
      'rating': instance.rating,
      'reviewCount': instance.reviewCount,
      'deliveryTime': instance.deliveryTime,
      'deliveryFee': instance.deliveryFee,
      'minimumOrder': instance.minimumOrder,
      'isActive': instance.isActive,
    };

_$MenuCategoryImpl _$$MenuCategoryImplFromJson(Map<String, dynamic> json) =>
    _$MenuCategoryImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      sortOrder: (json['sortOrder'] as num).toInt(),
      items: (json['items'] as List<dynamic>)
          .map((e) => MenuItem.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$$MenuCategoryImplToJson(_$MenuCategoryImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'sortOrder': instance.sortOrder,
      'items': instance.items,
    };

_$MenuItemImpl _$$MenuItemImplFromJson(Map<String, dynamic> json) =>
    _$MenuItemImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      price: (json['price'] as num).toDouble(),
      imageUrl: json['imageUrl'] as String?,
      isVeg: json['isVeg'] as bool? ?? true,
      isAvailable: json['isAvailable'] as bool? ?? true,
      categoryId: json['categoryId'] as String,
    );

Map<String, dynamic> _$$MenuItemImplToJson(_$MenuItemImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'price': instance.price,
      'imageUrl': instance.imageUrl,
      'isVeg': instance.isVeg,
      'isAvailable': instance.isAvailable,
      'categoryId': instance.categoryId,
    };

_$RestaurantDetailImpl _$$RestaurantDetailImplFromJson(
        Map<String, dynamic> json) =>
    _$RestaurantDetailImpl(
      restaurant:
          Restaurant.fromJson(json['restaurant'] as Map<String, dynamic>),
      categories: (json['categories'] as List<dynamic>)
          .map((e) => MenuCategory.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$$RestaurantDetailImplToJson(
        _$RestaurantDetailImpl instance) =>
    <String, dynamic>{
      'restaurant': instance.restaurant,
      'categories': instance.categories,
    };

_$RestaurantsResponseImpl _$$RestaurantsResponseImplFromJson(
        Map<String, dynamic> json) =>
    _$RestaurantsResponseImpl(
      items: (json['items'] as List<dynamic>)
          .map((e) => Restaurant.fromJson(e as Map<String, dynamic>))
          .toList(),
      total: (json['total'] as num).toInt(),
      page: (json['page'] as num).toInt(),
      limit: (json['limit'] as num).toInt(),
      hasMore: json['hasMore'] as bool,
    );

Map<String, dynamic> _$$RestaurantsResponseImplToJson(
        _$RestaurantsResponseImpl instance) =>
    <String, dynamic>{
      'items': instance.items,
      'total': instance.total,
      'page': instance.page,
      'limit': instance.limit,
      'hasMore': instance.hasMore,
    };
