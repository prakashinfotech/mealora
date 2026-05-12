class Formatters {
  Formatters._();

  /// ₹1,299 or ₹0
  static String price(num amount) {
    if (amount == 0) return 'FREE';
    return '₹${amount.toStringAsFixed(amount % 1 == 0 ? 0 : 2)}';
  }

  /// ₹1,299 always (even when 0)
  static String priceAlways(num amount) =>
      '₹${amount.toStringAsFixed(amount % 1 == 0 ? 0 : 2)}';

  /// 4.2 stars / 2.5k ratings
  static String rating(double rating, int count) {
    final countStr = count >= 1000 ? '${(count / 1000).toStringAsFixed(1)}k' : count.toString();
    return '$rating ($countStr)';
  }

  /// "30–40 mins"
  static String deliveryTime(int minutes) => '$minutes mins';

  /// "2 Jan 2025"
  static String date(DateTime dt) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return '${dt.day} ${months[dt.month - 1]} ${dt.year}';
  }

  /// "2 Jan 2025, 3:45 PM"
  static String dateTime(DateTime dt) {
    final hour = dt.hour % 12 == 0 ? 12 : dt.hour % 12;
    final period = dt.hour < 12 ? 'AM' : 'PM';
    final min = dt.minute.toString().padLeft(2, '0');
    return '${date(dt)}, $hour:$min $period';
  }

  /// Ellipsis truncation
  static String truncate(String text, int maxLength) =>
      text.length > maxLength ? '${text.substring(0, maxLength)}…' : text;
}
