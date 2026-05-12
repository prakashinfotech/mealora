class ApiEndpoints {
  ApiEndpoints._();

  // ─── Auth (NextAuth) ──────────────────────────────────────────────────────
  static const String csrf = '/api/auth/csrf';
  static const String credentialsCallback = '/api/auth/callback/credentials';
  static const String session = '/api/auth/session';
  static const String signOut = '/api/auth/signout';
  static const String register = '/api/auth/register';

  // ─── User ─────────────────────────────────────────────────────────────────
  static const String me = '/api/users/me';

  // ─── Restaurants ──────────────────────────────────────────────────────────
  static const String restaurants = '/api/restaurants';
  static String restaurantById(String id) => '/api/restaurants/$id';

  // ─── Search ───────────────────────────────────────────────────────────────
  static const String search = '/api/search';

  // ─── Coupons ──────────────────────────────────────────────────────────────
  static const String coupons = '/api/coupons';
  static const String validateCoupon = '/api/coupons/validate';

  // ─── Orders ───────────────────────────────────────────────────────────────
  static const String orders = '/api/orders';
  static String orderById(String id) => '/api/orders/$id';

  // ─── Addresses ────────────────────────────────────────────────────────────
  static const String addresses = '/api/addresses';
  static String addressById(String id) => '/api/addresses/$id';

  // ─── Payments ─────────────────────────────────────────────────────────────
  static const String createPaymentOrder = '/api/payments/create-order';
  static const String verifyPayment = '/api/payments/verify';
}
