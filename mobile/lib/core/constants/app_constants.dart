class AppConstants {
  AppConstants._();

  // Pricing — mirrors shared/constants/index.ts
  static const double deliveryFee = 40.0;
  static const double freeDeliveryThreshold = 299.0;
  static const double taxRate = 0.05;

  // Pagination
  static const int ordersPageSize = 10;

  // SharedPreferences keys
  static const String cartKey = 'cart_data';
}
