class Coupon {
  const Coupon({
    required this.id,
    required this.code,
    required this.title,
    this.description,
    required this.discountType,
    required this.discountValue,
    this.minOrderAmount,
    this.maxDiscount,
  });

  final String id;
  final String code;
  final String title;
  final String? description;
  final String discountType; // 'PERCENTAGE' | 'FLAT'
  final double discountValue;
  final double? minOrderAmount;
  final double? maxDiscount;

  String get displayDiscount {
    if (discountType == 'PERCENTAGE') {
      final cap = maxDiscount != null ? ' up to ₹${maxDiscount!.toStringAsFixed(0)}' : '';
      return '${discountValue.toStringAsFixed(0)}% off$cap';
    }
    return '₹${discountValue.toStringAsFixed(0)} off';
  }

  factory Coupon.fromJson(Map<String, dynamic> json) => Coupon(
        id: json['id'] as String,
        code: json['code'] as String,
        title: json['title'] as String,
        description: json['description'] as String?,
        discountType: json['discountType'] as String,
        discountValue: (json['discountValue'] as num).toDouble(),
        minOrderAmount: (json['minOrderAmount'] as num?)?.toDouble(),
        maxDiscount: (json['maxDiscount'] as num?)?.toDouble(),
      );
}
