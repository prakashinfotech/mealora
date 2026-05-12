class RouteNames {
  RouteNames._();

  static const String login = 'login';
  static const String register = 'register';

  static const String shell = 'shell';
  static const String home = 'home';
  static const String restaurants = 'restaurants';
  static const String restaurantDetail = 'restaurantDetail';

  static const String cart = 'cart';
  static const String checkout = 'checkout';

  static const String orders = 'orders';
  static const String orderDetail = 'orderDetail';
  static const String orderSuccess = 'orderSuccess';

  static const String profile = 'profile';
}

class RoutePaths {
  RoutePaths._();

  static const String login = '/login';
  static const String register = '/register';

  static const String home = '/';
  static const String restaurants = '/restaurants';
  static const String restaurantDetail = '/restaurants/:id';

  static const String cart = '/cart';
  static const String checkout = '/checkout';

  static const String orders = '/orders';
  static const String orderDetail = '/orders/:id';
  static const String orderSuccess = '/order-success/:id';

  static const String profile = '/profile';
}
