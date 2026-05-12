import 'dart:convert';
import '../../../core/constants/app_constants.dart';

class CartItem {
  const CartItem({
    required this.menuItemId,
    required this.name,
    required this.price,
    required this.isVeg,
    required this.quantity,
  });

  final String menuItemId;
  final String name;
  final double price;
  final bool isVeg;
  final int quantity;

  double get itemTotal => price * quantity;

  CartItem copyWith({int? quantity}) => CartItem(
        menuItemId: menuItemId,
        name: name,
        price: price,
        isVeg: isVeg,
        quantity: quantity ?? this.quantity,
      );

  Map<String, dynamic> toJson() => {
        'menuItemId': menuItemId,
        'name': name,
        'price': price,
        'isVeg': isVeg,
        'quantity': quantity,
      };

  factory CartItem.fromJson(Map<String, dynamic> json) => CartItem(
        menuItemId: json['menuItemId'] as String,
        name: json['name'] as String,
        price: (json['price'] as num).toDouble(),
        isVeg: json['isVeg'] as bool? ?? true,
        quantity: json['quantity'] as int,
      );
}

class CartState {
  const CartState({
    this.items = const [],
    this.restaurantId,
    this.restaurantName,
  });

  final List<CartItem> items;
  final String? restaurantId;
  final String? restaurantName;

  bool get isEmpty => items.isEmpty;
  int get totalItems => items.fold(0, (sum, item) => sum + item.quantity);
  double get subtotal => items.fold(0.0, (sum, item) => sum + item.itemTotal);
  double get deliveryFee =>
      subtotal >= AppConstants.freeDeliveryThreshold ? 0 : AppConstants.deliveryFee;
  double get taxes => subtotal * AppConstants.taxRate;
  double get total => subtotal + deliveryFee + taxes;

  int quantityOf(String menuItemId) {
    for (final item in items) {
      if (item.menuItemId == menuItemId) return item.quantity;
    }
    return 0;
  }

  CartState copyWith({
    List<CartItem>? items,
    String? restaurantId,
    String? restaurantName,
  }) =>
      CartState(
        items: items ?? this.items,
        restaurantId: restaurantId ?? this.restaurantId,
        restaurantName: restaurantName ?? this.restaurantName,
      );

  Map<String, dynamic> toJson() => {
        'items': items.map((e) => e.toJson()).toList(),
        'restaurantId': restaurantId,
        'restaurantName': restaurantName,
      };

  factory CartState.fromJson(Map<String, dynamic> json) => CartState(
        items: (json['items'] as List<dynamic>? ?? [])
            .map((e) => CartItem.fromJson(e as Map<String, dynamic>))
            .toList(),
        restaurantId: json['restaurantId'] as String?,
        restaurantName: json['restaurantName'] as String?,
      );

  String toJsonString() => jsonEncode(toJson());

  factory CartState.fromJsonString(String jsonStr) =>
      CartState.fromJson(jsonDecode(jsonStr) as Map<String, dynamic>);
}
