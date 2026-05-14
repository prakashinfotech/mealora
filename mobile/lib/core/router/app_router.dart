import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/data/models/auth_models.dart';
import '../../features/auth/providers/auth_provider.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/register_screen.dart';
import '../../features/cart/screens/cart_screen.dart';
import '../../features/checkout/screens/checkout_screen.dart';
import '../../features/home/screens/home_screen.dart';
import '../../features/orders/screens/order_detail_screen.dart';
import '../../features/orders/screens/order_success_screen.dart';
import '../../features/orders/screens/orders_screen.dart';
import '../../features/addresses/screens/address_management_screen.dart';
import '../../features/profile/screens/profile_screen.dart';
import '../../features/restaurants/screens/restaurant_detail_screen.dart';
import '../../features/restaurants/screens/restaurants_screen.dart';
import '../../shared/screens/main_shell.dart';
import 'route_names.dart';

// Triggers GoRouter.redirect re-evaluation when auth state changes,
// without recreating the router itself.
class _RouterNotifier extends ChangeNotifier {
  _RouterNotifier(Ref ref) {
    _sub = ref.listen<AsyncValue<AuthUser?>>(
      authProvider,
      (_, __) => notifyListeners(),
    );
  }

  late final ProviderSubscription<AsyncValue<AuthUser?>> _sub;

  @override
  void dispose() {
    _sub.close();
    super.dispose();
  }
}

final routerProvider = Provider<GoRouter>((ref) {
  final notifier = _RouterNotifier(ref);
  ref.onDispose(notifier.dispose);

  return GoRouter(
    initialLocation: RoutePaths.home,
    debugLogDiagnostics: true,
    refreshListenable: notifier,
    redirect: (context, state) {
      final authState = ref.read(authProvider);

      // Still loading — don't redirect yet
      if (authState.isLoading) return null;

      final isAuthenticated = authState.valueOrNull != null;
      final isAuthRoute = state.matchedLocation == RoutePaths.login ||
          state.matchedLocation == RoutePaths.register;

      // Routes that require authentication
      final requiresAuth =
          state.matchedLocation.startsWith(RoutePaths.orders) ||
              state.matchedLocation == RoutePaths.profile ||
              state.matchedLocation == RoutePaths.cart ||
              state.matchedLocation == RoutePaths.checkout ||
              state.matchedLocation.startsWith('/order-success');

      if (!isAuthenticated && requiresAuth) {
        return '${RoutePaths.login}?from=${state.matchedLocation}';
      }

      // Already logged in → redirect away from auth screens
      if (isAuthenticated && isAuthRoute) return RoutePaths.home;

      return null;
    },
    routes: [
      // ─── Auth screens (no shell) ─────────────────────────────────────────
      GoRoute(
        path: RoutePaths.login,
        name: RouteNames.login,
        builder: (_, __) => const LoginScreen(),
      ),
      GoRoute(
        path: RoutePaths.register,
        name: RouteNames.register,
        builder: (_, __) => const RegisterScreen(),
      ),

      // ─── Full-screen flows (no bottom nav) ──────────────────────────────
      GoRoute(
        path: RoutePaths.cart,
        name: RouteNames.cart,
        builder: (_, __) => const CartScreen(),
      ),
      GoRoute(
        path: RoutePaths.checkout,
        name: RouteNames.checkout,
        builder: (_, __) => const CheckoutScreen(),
      ),
      GoRoute(
        path: RoutePaths.orderSuccess,
        name: RouteNames.orderSuccess,
        builder: (_, state) =>
            OrderSuccessScreen(orderId: state.pathParameters['id']!),
      ),

      // ─── Main shell with bottom navigation ───────────────────────────────
      ShellRoute(
        builder: (context, state, child) => MainShell(child: child),
        routes: [
          GoRoute(
            path: RoutePaths.home,
            name: RouteNames.home,
            builder: (_, __) => const HomeScreen(),
          ),
          GoRoute(
            path: RoutePaths.restaurants,
            name: RouteNames.restaurants,
            builder: (_, __) => const RestaurantsScreen(),
            routes: [
              GoRoute(
                path: ':id',
                name: RouteNames.restaurantDetail,
                builder: (_, state) =>
                    RestaurantDetailScreen(id: state.pathParameters['id']!),
              ),
            ],
          ),
          GoRoute(
            path: RoutePaths.orders,
            name: RouteNames.orders,
            builder: (_, __) => const OrdersScreen(),
            routes: [
              GoRoute(
                path: ':id',
                name: RouteNames.orderDetail,
                builder: (_, state) =>
                    OrderDetailScreen(id: state.pathParameters['id']!),
              ),
            ],
          ),
          GoRoute(
            path: RoutePaths.profile,
            name: RouteNames.profile,
            builder: (_, __) => const ProfileScreen(),
            routes: [
              GoRoute(
                path: 'addresses',
                name: RouteNames.addressManagement,
                builder: (_, __) => const AddressManagementScreen(),
              ),
            ],
          ),
        ],
      ),
    ],
  );
});
