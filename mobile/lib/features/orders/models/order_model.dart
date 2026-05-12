import '../../addresses/models/address_model.dart';

class OrderItem {
  const OrderItem({
    required this.id,
    required this.menuItemId,
    required this.name,
    required this.price,
    required this.quantity,
  });

  final String id;
  final String menuItemId;
  final String name;
  final double price;
  final int quantity;

  double get itemTotal => price * quantity;

  factory OrderItem.fromJson(Map<String, dynamic> json) => OrderItem(
        id: json['id'] as String,
        menuItemId: json['menuItemId'] as String,
        name: json['name'] as String,
        price: (json['price'] as num).toDouble(),
        quantity: json['quantity'] as int,
      );
}

class OrderTimelineEntry {
  const OrderTimelineEntry({
    required this.id,
    required this.status,
    this.message,
    required this.createdAt,
  });

  final String id;
  final String status;
  final String? message;
  final DateTime createdAt;

  factory OrderTimelineEntry.fromJson(Map<String, dynamic> json) => OrderTimelineEntry(
        id: json['id'] as String,
        status: json['status'] as String,
        message: json['message'] as String?,
        createdAt: DateTime.parse(json['createdAt'] as String),
      );
}

class OrderRestaurant {
  const OrderRestaurant({
    required this.id,
    required this.name,
    required this.imageUrl,
    this.area,
  });

  final String id;
  final String name;
  final String imageUrl;
  final String? area;

  factory OrderRestaurant.fromJson(Map<String, dynamic> json) => OrderRestaurant(
        id: json['id'] as String,
        name: json['name'] as String,
        imageUrl: json['imageUrl'] as String? ?? '',
        area: json['area'] as String?,
      );
}

class Order {
  const Order({
    required this.id,
    required this.status,
    required this.paymentMode,
    required this.paymentStatus,
    required this.subtotal,
    required this.deliveryFee,
    required this.taxes,
    required this.discount,
    required this.total,
    this.couponCode,
    required this.createdAt,
    this.restaurant,
    this.items,
    this.timeline,
    this.address,
  });

  final String id;
  final String status;
  final String paymentMode;
  final String paymentStatus;
  final double subtotal;
  final double deliveryFee;
  final double taxes;
  final double discount;
  final double total;
  final String? couponCode;
  final DateTime createdAt;
  final OrderRestaurant? restaurant;
  final List<OrderItem>? items;
  final List<OrderTimelineEntry>? timeline;
  final Address? address;

  factory Order.fromJson(Map<String, dynamic> json) => Order(
        id: json['id'] as String,
        status: json['status'] as String,
        paymentMode: json['paymentMode'] as String,
        paymentStatus: json['paymentStatus'] as String,
        subtotal: (json['subtotal'] as num).toDouble(),
        deliveryFee: (json['deliveryFee'] as num).toDouble(),
        taxes: (json['taxes'] as num).toDouble(),
        discount: (json['discount'] as num).toDouble(),
        total: (json['total'] as num).toDouble(),
        couponCode: json['couponCode'] as String?,
        createdAt: DateTime.parse(json['createdAt'] as String),
        restaurant: json['restaurant'] != null
            ? OrderRestaurant.fromJson(json['restaurant'] as Map<String, dynamic>)
            : null,
        items: json['items'] != null
            ? (json['items'] as List<dynamic>)
                .map((e) => OrderItem.fromJson(e as Map<String, dynamic>))
                .toList()
            : null,
        timeline: json['timeline'] != null
            ? (json['timeline'] as List<dynamic>)
                .map((e) => OrderTimelineEntry.fromJson(e as Map<String, dynamic>))
                .toList()
            : null,
        address: json['address'] != null
            ? Address.fromJson(json['address'] as Map<String, dynamic>)
            : null,
      );
}

class PaginatedOrders {
  const PaginatedOrders({
    required this.items,
    required this.hasMore,
    required this.page,
  });

  final List<Order> items;
  final bool hasMore;
  final int page;

  factory PaginatedOrders.fromJson(Map<String, dynamic> json) => PaginatedOrders(
        items: (json['items'] as List<dynamic>)
            .map((e) => Order.fromJson(e as Map<String, dynamic>))
            .toList(),
        hasMore: json['hasMore'] as bool,
        page: json['page'] as int,
      );
}
