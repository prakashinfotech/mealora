class RazorpayOrderItem {
  const RazorpayOrderItem({
    required this.menuItemId,
    required this.name,
    required this.price,
    required this.quantity,
  });

  final String menuItemId;
  final String name;
  final double price;
  final int quantity;

  factory RazorpayOrderItem.fromJson(Map<String, dynamic> json) =>
      RazorpayOrderItem(
        menuItemId: json['menuItemId'] as String,
        name: json['name'] as String,
        price: (json['price'] as num).toDouble(),
        quantity: json['quantity'] as int,
      );

  Map<String, dynamic> toJson() => {
        'menuItemId': menuItemId,
        'name': name,
        'price': price,
        'quantity': quantity,
      };
}

/// Response from POST /api/payments/create-order
class RazorpayOrderData {
  const RazorpayOrderData({
    required this.razorpayOrderId,
    required this.keyId,
    required this.amount,
    required this.currency,
    required this.subtotal,
    required this.deliveryFee,
    required this.taxes,
    required this.discount,
    this.couponCode,
    required this.total,
    required this.items,
  });

  final String razorpayOrderId;
  final String keyId;
  final int amount;       // in paise (₹1 = 100 paise)
  final String currency;
  final double subtotal;
  final double deliveryFee;
  final double taxes;
  final double discount;
  final String? couponCode;
  final double total;
  final List<RazorpayOrderItem> items; // server-validated snapshot

  factory RazorpayOrderData.fromJson(Map<String, dynamic> json) =>
      RazorpayOrderData(
        razorpayOrderId: json['razorpayOrderId'] as String,
        keyId: json['keyId'] as String,
        amount: (json['amount'] as num).toInt(),
        currency: json['currency'] as String,
        subtotal: (json['subtotal'] as num).toDouble(),
        deliveryFee: (json['deliveryFee'] as num).toDouble(),
        taxes: (json['taxes'] as num).toDouble(),
        discount: (json['discount'] as num).toDouble(),
        couponCode: json['couponCode'] as String?,
        total: (json['total'] as num).toDouble(),
        items: (json['items'] as List<dynamic>)
            .map((e) => RazorpayOrderItem.fromJson(e as Map<String, dynamic>))
            .toList(),
      );
}
