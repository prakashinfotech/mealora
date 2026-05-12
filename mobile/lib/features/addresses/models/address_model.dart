class Address {
  const Address({
    required this.id,
    required this.label,
    required this.line1,
    this.line2,
    required this.city,
    required this.state,
    required this.pincode,
    this.isDefault = false,
  });

  final String id;
  final String label;
  final String line1;
  final String? line2;
  final String city;
  final String state;
  final String pincode;
  final bool isDefault;

  String get fullAddress {
    final parts = [line1, if (line2 != null && line2!.isNotEmpty) line2!, city, state, pincode];
    return parts.join(', ');
  }

  factory Address.fromJson(Map<String, dynamic> json) => Address(
        id: json['id'] as String,
        label: json['label'] as String,
        line1: json['line1'] as String,
        line2: json['line2'] as String?,
        city: json['city'] as String,
        state: json['state'] as String,
        pincode: json['pincode'] as String,
        isDefault: json['isDefault'] as bool? ?? false,
      );
}
