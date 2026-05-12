// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'restaurant_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

Restaurant _$RestaurantFromJson(Map<String, dynamic> json) {
  return _Restaurant.fromJson(json);
}

/// @nodoc
mixin _$Restaurant {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get slug => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  String? get imageUrl => throw _privateConstructorUsedError;
  String? get bannerUrl => throw _privateConstructorUsedError;
  String get cuisineType => throw _privateConstructorUsedError;
  String get address => throw _privateConstructorUsedError;
  String get city => throw _privateConstructorUsedError;
  String? get state => throw _privateConstructorUsedError;
  double get rating => throw _privateConstructorUsedError;
  int get reviewCount => throw _privateConstructorUsedError;
  int get deliveryTime => throw _privateConstructorUsedError;
  double get deliveryFee => throw _privateConstructorUsedError;
  double get minimumOrder => throw _privateConstructorUsedError;
  bool get isActive => throw _privateConstructorUsedError;

  /// Serializes this Restaurant to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Restaurant
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $RestaurantCopyWith<Restaurant> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RestaurantCopyWith<$Res> {
  factory $RestaurantCopyWith(
          Restaurant value, $Res Function(Restaurant) then) =
      _$RestaurantCopyWithImpl<$Res, Restaurant>;
  @useResult
  $Res call(
      {String id,
      String name,
      String slug,
      String? description,
      String? imageUrl,
      String? bannerUrl,
      String cuisineType,
      String address,
      String city,
      String? state,
      double rating,
      int reviewCount,
      int deliveryTime,
      double deliveryFee,
      double minimumOrder,
      bool isActive});
}

/// @nodoc
class _$RestaurantCopyWithImpl<$Res, $Val extends Restaurant>
    implements $RestaurantCopyWith<$Res> {
  _$RestaurantCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Restaurant
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? description = freezed,
    Object? imageUrl = freezed,
    Object? bannerUrl = freezed,
    Object? cuisineType = null,
    Object? address = null,
    Object? city = null,
    Object? state = freezed,
    Object? rating = null,
    Object? reviewCount = null,
    Object? deliveryTime = null,
    Object? deliveryFee = null,
    Object? minimumOrder = null,
    Object? isActive = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      slug: null == slug
          ? _value.slug
          : slug // ignore: cast_nullable_to_non_nullable
              as String,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      imageUrl: freezed == imageUrl
          ? _value.imageUrl
          : imageUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      bannerUrl: freezed == bannerUrl
          ? _value.bannerUrl
          : bannerUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      cuisineType: null == cuisineType
          ? _value.cuisineType
          : cuisineType // ignore: cast_nullable_to_non_nullable
              as String,
      address: null == address
          ? _value.address
          : address // ignore: cast_nullable_to_non_nullable
              as String,
      city: null == city
          ? _value.city
          : city // ignore: cast_nullable_to_non_nullable
              as String,
      state: freezed == state
          ? _value.state
          : state // ignore: cast_nullable_to_non_nullable
              as String?,
      rating: null == rating
          ? _value.rating
          : rating // ignore: cast_nullable_to_non_nullable
              as double,
      reviewCount: null == reviewCount
          ? _value.reviewCount
          : reviewCount // ignore: cast_nullable_to_non_nullable
              as int,
      deliveryTime: null == deliveryTime
          ? _value.deliveryTime
          : deliveryTime // ignore: cast_nullable_to_non_nullable
              as int,
      deliveryFee: null == deliveryFee
          ? _value.deliveryFee
          : deliveryFee // ignore: cast_nullable_to_non_nullable
              as double,
      minimumOrder: null == minimumOrder
          ? _value.minimumOrder
          : minimumOrder // ignore: cast_nullable_to_non_nullable
              as double,
      isActive: null == isActive
          ? _value.isActive
          : isActive // ignore: cast_nullable_to_non_nullable
              as bool,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$RestaurantImplCopyWith<$Res>
    implements $RestaurantCopyWith<$Res> {
  factory _$$RestaurantImplCopyWith(
          _$RestaurantImpl value, $Res Function(_$RestaurantImpl) then) =
      __$$RestaurantImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      String slug,
      String? description,
      String? imageUrl,
      String? bannerUrl,
      String cuisineType,
      String address,
      String city,
      String? state,
      double rating,
      int reviewCount,
      int deliveryTime,
      double deliveryFee,
      double minimumOrder,
      bool isActive});
}

/// @nodoc
class __$$RestaurantImplCopyWithImpl<$Res>
    extends _$RestaurantCopyWithImpl<$Res, _$RestaurantImpl>
    implements _$$RestaurantImplCopyWith<$Res> {
  __$$RestaurantImplCopyWithImpl(
      _$RestaurantImpl _value, $Res Function(_$RestaurantImpl) _then)
      : super(_value, _then);

  /// Create a copy of Restaurant
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? description = freezed,
    Object? imageUrl = freezed,
    Object? bannerUrl = freezed,
    Object? cuisineType = null,
    Object? address = null,
    Object? city = null,
    Object? state = freezed,
    Object? rating = null,
    Object? reviewCount = null,
    Object? deliveryTime = null,
    Object? deliveryFee = null,
    Object? minimumOrder = null,
    Object? isActive = null,
  }) {
    return _then(_$RestaurantImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      slug: null == slug
          ? _value.slug
          : slug // ignore: cast_nullable_to_non_nullable
              as String,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      imageUrl: freezed == imageUrl
          ? _value.imageUrl
          : imageUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      bannerUrl: freezed == bannerUrl
          ? _value.bannerUrl
          : bannerUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      cuisineType: null == cuisineType
          ? _value.cuisineType
          : cuisineType // ignore: cast_nullable_to_non_nullable
              as String,
      address: null == address
          ? _value.address
          : address // ignore: cast_nullable_to_non_nullable
              as String,
      city: null == city
          ? _value.city
          : city // ignore: cast_nullable_to_non_nullable
              as String,
      state: freezed == state
          ? _value.state
          : state // ignore: cast_nullable_to_non_nullable
              as String?,
      rating: null == rating
          ? _value.rating
          : rating // ignore: cast_nullable_to_non_nullable
              as double,
      reviewCount: null == reviewCount
          ? _value.reviewCount
          : reviewCount // ignore: cast_nullable_to_non_nullable
              as int,
      deliveryTime: null == deliveryTime
          ? _value.deliveryTime
          : deliveryTime // ignore: cast_nullable_to_non_nullable
              as int,
      deliveryFee: null == deliveryFee
          ? _value.deliveryFee
          : deliveryFee // ignore: cast_nullable_to_non_nullable
              as double,
      minimumOrder: null == minimumOrder
          ? _value.minimumOrder
          : minimumOrder // ignore: cast_nullable_to_non_nullable
              as double,
      isActive: null == isActive
          ? _value.isActive
          : isActive // ignore: cast_nullable_to_non_nullable
              as bool,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$RestaurantImpl implements _Restaurant {
  const _$RestaurantImpl(
      {required this.id,
      required this.name,
      required this.slug,
      this.description,
      this.imageUrl,
      this.bannerUrl,
      required this.cuisineType,
      required this.address,
      required this.city,
      this.state,
      required this.rating,
      required this.reviewCount,
      required this.deliveryTime,
      required this.deliveryFee,
      required this.minimumOrder,
      this.isActive = true});

  factory _$RestaurantImpl.fromJson(Map<String, dynamic> json) =>
      _$$RestaurantImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String slug;
  @override
  final String? description;
  @override
  final String? imageUrl;
  @override
  final String? bannerUrl;
  @override
  final String cuisineType;
  @override
  final String address;
  @override
  final String city;
  @override
  final String? state;
  @override
  final double rating;
  @override
  final int reviewCount;
  @override
  final int deliveryTime;
  @override
  final double deliveryFee;
  @override
  final double minimumOrder;
  @override
  @JsonKey()
  final bool isActive;

  @override
  String toString() {
    return 'Restaurant(id: $id, name: $name, slug: $slug, description: $description, imageUrl: $imageUrl, bannerUrl: $bannerUrl, cuisineType: $cuisineType, address: $address, city: $city, state: $state, rating: $rating, reviewCount: $reviewCount, deliveryTime: $deliveryTime, deliveryFee: $deliveryFee, minimumOrder: $minimumOrder, isActive: $isActive)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RestaurantImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.slug, slug) || other.slug == slug) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.imageUrl, imageUrl) ||
                other.imageUrl == imageUrl) &&
            (identical(other.bannerUrl, bannerUrl) ||
                other.bannerUrl == bannerUrl) &&
            (identical(other.cuisineType, cuisineType) ||
                other.cuisineType == cuisineType) &&
            (identical(other.address, address) || other.address == address) &&
            (identical(other.city, city) || other.city == city) &&
            (identical(other.state, state) || other.state == state) &&
            (identical(other.rating, rating) || other.rating == rating) &&
            (identical(other.reviewCount, reviewCount) ||
                other.reviewCount == reviewCount) &&
            (identical(other.deliveryTime, deliveryTime) ||
                other.deliveryTime == deliveryTime) &&
            (identical(other.deliveryFee, deliveryFee) ||
                other.deliveryFee == deliveryFee) &&
            (identical(other.minimumOrder, minimumOrder) ||
                other.minimumOrder == minimumOrder) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      name,
      slug,
      description,
      imageUrl,
      bannerUrl,
      cuisineType,
      address,
      city,
      state,
      rating,
      reviewCount,
      deliveryTime,
      deliveryFee,
      minimumOrder,
      isActive);

  /// Create a copy of Restaurant
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$RestaurantImplCopyWith<_$RestaurantImpl> get copyWith =>
      __$$RestaurantImplCopyWithImpl<_$RestaurantImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$RestaurantImplToJson(
      this,
    );
  }
}

abstract class _Restaurant implements Restaurant {
  const factory _Restaurant(
      {required final String id,
      required final String name,
      required final String slug,
      final String? description,
      final String? imageUrl,
      final String? bannerUrl,
      required final String cuisineType,
      required final String address,
      required final String city,
      final String? state,
      required final double rating,
      required final int reviewCount,
      required final int deliveryTime,
      required final double deliveryFee,
      required final double minimumOrder,
      final bool isActive}) = _$RestaurantImpl;

  factory _Restaurant.fromJson(Map<String, dynamic> json) =
      _$RestaurantImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get slug;
  @override
  String? get description;
  @override
  String? get imageUrl;
  @override
  String? get bannerUrl;
  @override
  String get cuisineType;
  @override
  String get address;
  @override
  String get city;
  @override
  String? get state;
  @override
  double get rating;
  @override
  int get reviewCount;
  @override
  int get deliveryTime;
  @override
  double get deliveryFee;
  @override
  double get minimumOrder;
  @override
  bool get isActive;

  /// Create a copy of Restaurant
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$RestaurantImplCopyWith<_$RestaurantImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

MenuCategory _$MenuCategoryFromJson(Map<String, dynamic> json) {
  return _MenuCategory.fromJson(json);
}

/// @nodoc
mixin _$MenuCategory {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  int get sortOrder => throw _privateConstructorUsedError;
  List<MenuItem> get items => throw _privateConstructorUsedError;

  /// Serializes this MenuCategory to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of MenuCategory
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $MenuCategoryCopyWith<MenuCategory> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MenuCategoryCopyWith<$Res> {
  factory $MenuCategoryCopyWith(
          MenuCategory value, $Res Function(MenuCategory) then) =
      _$MenuCategoryCopyWithImpl<$Res, MenuCategory>;
  @useResult
  $Res call(
      {String id,
      String name,
      String? description,
      int sortOrder,
      List<MenuItem> items});
}

/// @nodoc
class _$MenuCategoryCopyWithImpl<$Res, $Val extends MenuCategory>
    implements $MenuCategoryCopyWith<$Res> {
  _$MenuCategoryCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of MenuCategory
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? description = freezed,
    Object? sortOrder = null,
    Object? items = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      sortOrder: null == sortOrder
          ? _value.sortOrder
          : sortOrder // ignore: cast_nullable_to_non_nullable
              as int,
      items: null == items
          ? _value.items
          : items // ignore: cast_nullable_to_non_nullable
              as List<MenuItem>,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$MenuCategoryImplCopyWith<$Res>
    implements $MenuCategoryCopyWith<$Res> {
  factory _$$MenuCategoryImplCopyWith(
          _$MenuCategoryImpl value, $Res Function(_$MenuCategoryImpl) then) =
      __$$MenuCategoryImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      String? description,
      int sortOrder,
      List<MenuItem> items});
}

/// @nodoc
class __$$MenuCategoryImplCopyWithImpl<$Res>
    extends _$MenuCategoryCopyWithImpl<$Res, _$MenuCategoryImpl>
    implements _$$MenuCategoryImplCopyWith<$Res> {
  __$$MenuCategoryImplCopyWithImpl(
      _$MenuCategoryImpl _value, $Res Function(_$MenuCategoryImpl) _then)
      : super(_value, _then);

  /// Create a copy of MenuCategory
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? description = freezed,
    Object? sortOrder = null,
    Object? items = null,
  }) {
    return _then(_$MenuCategoryImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      sortOrder: null == sortOrder
          ? _value.sortOrder
          : sortOrder // ignore: cast_nullable_to_non_nullable
              as int,
      items: null == items
          ? _value._items
          : items // ignore: cast_nullable_to_non_nullable
              as List<MenuItem>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$MenuCategoryImpl implements _MenuCategory {
  const _$MenuCategoryImpl(
      {required this.id,
      required this.name,
      this.description,
      required this.sortOrder,
      required final List<MenuItem> items})
      : _items = items;

  factory _$MenuCategoryImpl.fromJson(Map<String, dynamic> json) =>
      _$$MenuCategoryImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String? description;
  @override
  final int sortOrder;
  final List<MenuItem> _items;
  @override
  List<MenuItem> get items {
    if (_items is EqualUnmodifiableListView) return _items;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_items);
  }

  @override
  String toString() {
    return 'MenuCategory(id: $id, name: $name, description: $description, sortOrder: $sortOrder, items: $items)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MenuCategoryImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.sortOrder, sortOrder) ||
                other.sortOrder == sortOrder) &&
            const DeepCollectionEquality().equals(other._items, _items));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, name, description, sortOrder,
      const DeepCollectionEquality().hash(_items));

  /// Create a copy of MenuCategory
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$MenuCategoryImplCopyWith<_$MenuCategoryImpl> get copyWith =>
      __$$MenuCategoryImplCopyWithImpl<_$MenuCategoryImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MenuCategoryImplToJson(
      this,
    );
  }
}

abstract class _MenuCategory implements MenuCategory {
  const factory _MenuCategory(
      {required final String id,
      required final String name,
      final String? description,
      required final int sortOrder,
      required final List<MenuItem> items}) = _$MenuCategoryImpl;

  factory _MenuCategory.fromJson(Map<String, dynamic> json) =
      _$MenuCategoryImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String? get description;
  @override
  int get sortOrder;
  @override
  List<MenuItem> get items;

  /// Create a copy of MenuCategory
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$MenuCategoryImplCopyWith<_$MenuCategoryImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

MenuItem _$MenuItemFromJson(Map<String, dynamic> json) {
  return _MenuItem.fromJson(json);
}

/// @nodoc
mixin _$MenuItem {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  double get price => throw _privateConstructorUsedError;
  String? get imageUrl => throw _privateConstructorUsedError;
  bool get isVeg => throw _privateConstructorUsedError;
  bool get isAvailable => throw _privateConstructorUsedError;
  String get categoryId => throw _privateConstructorUsedError;

  /// Serializes this MenuItem to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of MenuItem
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $MenuItemCopyWith<MenuItem> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MenuItemCopyWith<$Res> {
  factory $MenuItemCopyWith(MenuItem value, $Res Function(MenuItem) then) =
      _$MenuItemCopyWithImpl<$Res, MenuItem>;
  @useResult
  $Res call(
      {String id,
      String name,
      String? description,
      double price,
      String? imageUrl,
      bool isVeg,
      bool isAvailable,
      String categoryId});
}

/// @nodoc
class _$MenuItemCopyWithImpl<$Res, $Val extends MenuItem>
    implements $MenuItemCopyWith<$Res> {
  _$MenuItemCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of MenuItem
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? description = freezed,
    Object? price = null,
    Object? imageUrl = freezed,
    Object? isVeg = null,
    Object? isAvailable = null,
    Object? categoryId = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      price: null == price
          ? _value.price
          : price // ignore: cast_nullable_to_non_nullable
              as double,
      imageUrl: freezed == imageUrl
          ? _value.imageUrl
          : imageUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      isVeg: null == isVeg
          ? _value.isVeg
          : isVeg // ignore: cast_nullable_to_non_nullable
              as bool,
      isAvailable: null == isAvailable
          ? _value.isAvailable
          : isAvailable // ignore: cast_nullable_to_non_nullable
              as bool,
      categoryId: null == categoryId
          ? _value.categoryId
          : categoryId // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$MenuItemImplCopyWith<$Res>
    implements $MenuItemCopyWith<$Res> {
  factory _$$MenuItemImplCopyWith(
          _$MenuItemImpl value, $Res Function(_$MenuItemImpl) then) =
      __$$MenuItemImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      String? description,
      double price,
      String? imageUrl,
      bool isVeg,
      bool isAvailable,
      String categoryId});
}

/// @nodoc
class __$$MenuItemImplCopyWithImpl<$Res>
    extends _$MenuItemCopyWithImpl<$Res, _$MenuItemImpl>
    implements _$$MenuItemImplCopyWith<$Res> {
  __$$MenuItemImplCopyWithImpl(
      _$MenuItemImpl _value, $Res Function(_$MenuItemImpl) _then)
      : super(_value, _then);

  /// Create a copy of MenuItem
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? description = freezed,
    Object? price = null,
    Object? imageUrl = freezed,
    Object? isVeg = null,
    Object? isAvailable = null,
    Object? categoryId = null,
  }) {
    return _then(_$MenuItemImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      price: null == price
          ? _value.price
          : price // ignore: cast_nullable_to_non_nullable
              as double,
      imageUrl: freezed == imageUrl
          ? _value.imageUrl
          : imageUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      isVeg: null == isVeg
          ? _value.isVeg
          : isVeg // ignore: cast_nullable_to_non_nullable
              as bool,
      isAvailable: null == isAvailable
          ? _value.isAvailable
          : isAvailable // ignore: cast_nullable_to_non_nullable
              as bool,
      categoryId: null == categoryId
          ? _value.categoryId
          : categoryId // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$MenuItemImpl implements _MenuItem {
  const _$MenuItemImpl(
      {required this.id,
      required this.name,
      this.description,
      required this.price,
      this.imageUrl,
      this.isVeg = true,
      this.isAvailable = true,
      required this.categoryId});

  factory _$MenuItemImpl.fromJson(Map<String, dynamic> json) =>
      _$$MenuItemImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String? description;
  @override
  final double price;
  @override
  final String? imageUrl;
  @override
  @JsonKey()
  final bool isVeg;
  @override
  @JsonKey()
  final bool isAvailable;
  @override
  final String categoryId;

  @override
  String toString() {
    return 'MenuItem(id: $id, name: $name, description: $description, price: $price, imageUrl: $imageUrl, isVeg: $isVeg, isAvailable: $isAvailable, categoryId: $categoryId)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MenuItemImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.price, price) || other.price == price) &&
            (identical(other.imageUrl, imageUrl) ||
                other.imageUrl == imageUrl) &&
            (identical(other.isVeg, isVeg) || other.isVeg == isVeg) &&
            (identical(other.isAvailable, isAvailable) ||
                other.isAvailable == isAvailable) &&
            (identical(other.categoryId, categoryId) ||
                other.categoryId == categoryId));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, name, description, price,
      imageUrl, isVeg, isAvailable, categoryId);

  /// Create a copy of MenuItem
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$MenuItemImplCopyWith<_$MenuItemImpl> get copyWith =>
      __$$MenuItemImplCopyWithImpl<_$MenuItemImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MenuItemImplToJson(
      this,
    );
  }
}

abstract class _MenuItem implements MenuItem {
  const factory _MenuItem(
      {required final String id,
      required final String name,
      final String? description,
      required final double price,
      final String? imageUrl,
      final bool isVeg,
      final bool isAvailable,
      required final String categoryId}) = _$MenuItemImpl;

  factory _MenuItem.fromJson(Map<String, dynamic> json) =
      _$MenuItemImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String? get description;
  @override
  double get price;
  @override
  String? get imageUrl;
  @override
  bool get isVeg;
  @override
  bool get isAvailable;
  @override
  String get categoryId;

  /// Create a copy of MenuItem
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$MenuItemImplCopyWith<_$MenuItemImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

RestaurantDetail _$RestaurantDetailFromJson(Map<String, dynamic> json) {
  return _RestaurantDetail.fromJson(json);
}

/// @nodoc
mixin _$RestaurantDetail {
  Restaurant get restaurant => throw _privateConstructorUsedError;
  List<MenuCategory> get categories => throw _privateConstructorUsedError;

  /// Serializes this RestaurantDetail to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of RestaurantDetail
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $RestaurantDetailCopyWith<RestaurantDetail> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RestaurantDetailCopyWith<$Res> {
  factory $RestaurantDetailCopyWith(
          RestaurantDetail value, $Res Function(RestaurantDetail) then) =
      _$RestaurantDetailCopyWithImpl<$Res, RestaurantDetail>;
  @useResult
  $Res call({Restaurant restaurant, List<MenuCategory> categories});

  $RestaurantCopyWith<$Res> get restaurant;
}

/// @nodoc
class _$RestaurantDetailCopyWithImpl<$Res, $Val extends RestaurantDetail>
    implements $RestaurantDetailCopyWith<$Res> {
  _$RestaurantDetailCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of RestaurantDetail
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? restaurant = null,
    Object? categories = null,
  }) {
    return _then(_value.copyWith(
      restaurant: null == restaurant
          ? _value.restaurant
          : restaurant // ignore: cast_nullable_to_non_nullable
              as Restaurant,
      categories: null == categories
          ? _value.categories
          : categories // ignore: cast_nullable_to_non_nullable
              as List<MenuCategory>,
    ) as $Val);
  }

  /// Create a copy of RestaurantDetail
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $RestaurantCopyWith<$Res> get restaurant {
    return $RestaurantCopyWith<$Res>(_value.restaurant, (value) {
      return _then(_value.copyWith(restaurant: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$RestaurantDetailImplCopyWith<$Res>
    implements $RestaurantDetailCopyWith<$Res> {
  factory _$$RestaurantDetailImplCopyWith(_$RestaurantDetailImpl value,
          $Res Function(_$RestaurantDetailImpl) then) =
      __$$RestaurantDetailImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({Restaurant restaurant, List<MenuCategory> categories});

  @override
  $RestaurantCopyWith<$Res> get restaurant;
}

/// @nodoc
class __$$RestaurantDetailImplCopyWithImpl<$Res>
    extends _$RestaurantDetailCopyWithImpl<$Res, _$RestaurantDetailImpl>
    implements _$$RestaurantDetailImplCopyWith<$Res> {
  __$$RestaurantDetailImplCopyWithImpl(_$RestaurantDetailImpl _value,
      $Res Function(_$RestaurantDetailImpl) _then)
      : super(_value, _then);

  /// Create a copy of RestaurantDetail
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? restaurant = null,
    Object? categories = null,
  }) {
    return _then(_$RestaurantDetailImpl(
      restaurant: null == restaurant
          ? _value.restaurant
          : restaurant // ignore: cast_nullable_to_non_nullable
              as Restaurant,
      categories: null == categories
          ? _value._categories
          : categories // ignore: cast_nullable_to_non_nullable
              as List<MenuCategory>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$RestaurantDetailImpl implements _RestaurantDetail {
  const _$RestaurantDetailImpl(
      {required this.restaurant, required final List<MenuCategory> categories})
      : _categories = categories;

  factory _$RestaurantDetailImpl.fromJson(Map<String, dynamic> json) =>
      _$$RestaurantDetailImplFromJson(json);

  @override
  final Restaurant restaurant;
  final List<MenuCategory> _categories;
  @override
  List<MenuCategory> get categories {
    if (_categories is EqualUnmodifiableListView) return _categories;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_categories);
  }

  @override
  String toString() {
    return 'RestaurantDetail(restaurant: $restaurant, categories: $categories)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RestaurantDetailImpl &&
            (identical(other.restaurant, restaurant) ||
                other.restaurant == restaurant) &&
            const DeepCollectionEquality()
                .equals(other._categories, _categories));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, restaurant,
      const DeepCollectionEquality().hash(_categories));

  /// Create a copy of RestaurantDetail
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$RestaurantDetailImplCopyWith<_$RestaurantDetailImpl> get copyWith =>
      __$$RestaurantDetailImplCopyWithImpl<_$RestaurantDetailImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$RestaurantDetailImplToJson(
      this,
    );
  }
}

abstract class _RestaurantDetail implements RestaurantDetail {
  const factory _RestaurantDetail(
      {required final Restaurant restaurant,
      required final List<MenuCategory> categories}) = _$RestaurantDetailImpl;

  factory _RestaurantDetail.fromJson(Map<String, dynamic> json) =
      _$RestaurantDetailImpl.fromJson;

  @override
  Restaurant get restaurant;
  @override
  List<MenuCategory> get categories;

  /// Create a copy of RestaurantDetail
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$RestaurantDetailImplCopyWith<_$RestaurantDetailImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

RestaurantsResponse _$RestaurantsResponseFromJson(Map<String, dynamic> json) {
  return _RestaurantsResponse.fromJson(json);
}

/// @nodoc
mixin _$RestaurantsResponse {
  List<Restaurant> get items => throw _privateConstructorUsedError;
  int get total => throw _privateConstructorUsedError;
  int get page => throw _privateConstructorUsedError;
  int get limit => throw _privateConstructorUsedError;
  bool get hasMore => throw _privateConstructorUsedError;

  /// Serializes this RestaurantsResponse to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of RestaurantsResponse
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $RestaurantsResponseCopyWith<RestaurantsResponse> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RestaurantsResponseCopyWith<$Res> {
  factory $RestaurantsResponseCopyWith(
          RestaurantsResponse value, $Res Function(RestaurantsResponse) then) =
      _$RestaurantsResponseCopyWithImpl<$Res, RestaurantsResponse>;
  @useResult
  $Res call(
      {List<Restaurant> items, int total, int page, int limit, bool hasMore});
}

/// @nodoc
class _$RestaurantsResponseCopyWithImpl<$Res, $Val extends RestaurantsResponse>
    implements $RestaurantsResponseCopyWith<$Res> {
  _$RestaurantsResponseCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of RestaurantsResponse
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? items = null,
    Object? total = null,
    Object? page = null,
    Object? limit = null,
    Object? hasMore = null,
  }) {
    return _then(_value.copyWith(
      items: null == items
          ? _value.items
          : items // ignore: cast_nullable_to_non_nullable
              as List<Restaurant>,
      total: null == total
          ? _value.total
          : total // ignore: cast_nullable_to_non_nullable
              as int,
      page: null == page
          ? _value.page
          : page // ignore: cast_nullable_to_non_nullable
              as int,
      limit: null == limit
          ? _value.limit
          : limit // ignore: cast_nullable_to_non_nullable
              as int,
      hasMore: null == hasMore
          ? _value.hasMore
          : hasMore // ignore: cast_nullable_to_non_nullable
              as bool,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$RestaurantsResponseImplCopyWith<$Res>
    implements $RestaurantsResponseCopyWith<$Res> {
  factory _$$RestaurantsResponseImplCopyWith(_$RestaurantsResponseImpl value,
          $Res Function(_$RestaurantsResponseImpl) then) =
      __$$RestaurantsResponseImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {List<Restaurant> items, int total, int page, int limit, bool hasMore});
}

/// @nodoc
class __$$RestaurantsResponseImplCopyWithImpl<$Res>
    extends _$RestaurantsResponseCopyWithImpl<$Res, _$RestaurantsResponseImpl>
    implements _$$RestaurantsResponseImplCopyWith<$Res> {
  __$$RestaurantsResponseImplCopyWithImpl(_$RestaurantsResponseImpl _value,
      $Res Function(_$RestaurantsResponseImpl) _then)
      : super(_value, _then);

  /// Create a copy of RestaurantsResponse
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? items = null,
    Object? total = null,
    Object? page = null,
    Object? limit = null,
    Object? hasMore = null,
  }) {
    return _then(_$RestaurantsResponseImpl(
      items: null == items
          ? _value._items
          : items // ignore: cast_nullable_to_non_nullable
              as List<Restaurant>,
      total: null == total
          ? _value.total
          : total // ignore: cast_nullable_to_non_nullable
              as int,
      page: null == page
          ? _value.page
          : page // ignore: cast_nullable_to_non_nullable
              as int,
      limit: null == limit
          ? _value.limit
          : limit // ignore: cast_nullable_to_non_nullable
              as int,
      hasMore: null == hasMore
          ? _value.hasMore
          : hasMore // ignore: cast_nullable_to_non_nullable
              as bool,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$RestaurantsResponseImpl implements _RestaurantsResponse {
  const _$RestaurantsResponseImpl(
      {required final List<Restaurant> items,
      required this.total,
      required this.page,
      required this.limit,
      required this.hasMore})
      : _items = items;

  factory _$RestaurantsResponseImpl.fromJson(Map<String, dynamic> json) =>
      _$$RestaurantsResponseImplFromJson(json);

  final List<Restaurant> _items;
  @override
  List<Restaurant> get items {
    if (_items is EqualUnmodifiableListView) return _items;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_items);
  }

  @override
  final int total;
  @override
  final int page;
  @override
  final int limit;
  @override
  final bool hasMore;

  @override
  String toString() {
    return 'RestaurantsResponse(items: $items, total: $total, page: $page, limit: $limit, hasMore: $hasMore)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RestaurantsResponseImpl &&
            const DeepCollectionEquality().equals(other._items, _items) &&
            (identical(other.total, total) || other.total == total) &&
            (identical(other.page, page) || other.page == page) &&
            (identical(other.limit, limit) || other.limit == limit) &&
            (identical(other.hasMore, hasMore) || other.hasMore == hasMore));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType,
      const DeepCollectionEquality().hash(_items), total, page, limit, hasMore);

  /// Create a copy of RestaurantsResponse
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$RestaurantsResponseImplCopyWith<_$RestaurantsResponseImpl> get copyWith =>
      __$$RestaurantsResponseImplCopyWithImpl<_$RestaurantsResponseImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$RestaurantsResponseImplToJson(
      this,
    );
  }
}

abstract class _RestaurantsResponse implements RestaurantsResponse {
  const factory _RestaurantsResponse(
      {required final List<Restaurant> items,
      required final int total,
      required final int page,
      required final int limit,
      required final bool hasMore}) = _$RestaurantsResponseImpl;

  factory _RestaurantsResponse.fromJson(Map<String, dynamic> json) =
      _$RestaurantsResponseImpl.fromJson;

  @override
  List<Restaurant> get items;
  @override
  int get total;
  @override
  int get page;
  @override
  int get limit;
  @override
  bool get hasMore;

  /// Create a copy of RestaurantsResponse
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$RestaurantsResponseImplCopyWith<_$RestaurantsResponseImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
