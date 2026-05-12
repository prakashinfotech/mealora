import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_constants.dart';
import '../../../features/city/providers/city_provider.dart';
import '../../../features/restaurants/data/models/restaurant_model.dart';
import '../models/cart_item.dart';

class CartNotifier extends Notifier<CartState> {
  @override
  CartState build() {
    final prefs = ref.read(sharedPreferencesProvider);
    final jsonStr = prefs.getString(AppConstants.cartKey);
    if (jsonStr != null) {
      try {
        return CartState.fromJsonString(jsonStr);
      } catch (_) {}
    }
    return const CartState();
  }

  /// Returns true if [restaurantId] conflicts with the current cart's restaurant.
  bool isDifferentRestaurant(String restaurantId) =>
      state.restaurantId != null && state.restaurantId != restaurantId;

  void addItem({
    required String restaurantId,
    required String restaurantName,
    required MenuItem item,
  }) {
    final existingIdx = state.items.indexWhere((i) => i.menuItemId == item.id);
    List<CartItem> updated;
    if (existingIdx >= 0) {
      updated = [...state.items];
      updated[existingIdx] =
          updated[existingIdx].copyWith(quantity: updated[existingIdx].quantity + 1);
    } else {
      updated = [
        ...state.items,
        CartItem(
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          isVeg: item.isVeg,
          quantity: 1,
        ),
      ];
    }
    state = CartState(
      items: updated,
      restaurantId: restaurantId,
      restaurantName: restaurantName,
    );
    _persist();
  }

  /// Increments quantity of an already-in-cart item (e.g. from cart screen).
  void increment(String menuItemId) {
    final idx = state.items.indexWhere((i) => i.menuItemId == menuItemId);
    if (idx < 0) return;
    final updated = [...state.items];
    updated[idx] = updated[idx].copyWith(quantity: updated[idx].quantity + 1);
    state = state.copyWith(items: updated);
    _persist();
  }

  void decrement(String menuItemId) {
    final idx = state.items.indexWhere((i) => i.menuItemId == menuItemId);
    if (idx < 0) return;
    List<CartItem> updated = [...state.items];
    if (updated[idx].quantity <= 1) {
      updated.removeAt(idx);
    } else {
      updated[idx] = updated[idx].copyWith(quantity: updated[idx].quantity - 1);
    }
    state = updated.isEmpty
        ? const CartState()
        : state.copyWith(items: updated);
    _persist();
  }

  void removeItem(String menuItemId) {
    final updated = state.items.where((i) => i.menuItemId != menuItemId).toList();
    state = updated.isEmpty ? const CartState() : state.copyWith(items: updated);
    _persist();
  }

  void clearCart() {
    state = const CartState();
    _persist();
  }

  void _persist() {
    ref
        .read(sharedPreferencesProvider)
        .setString(AppConstants.cartKey, state.toJsonString());
  }
}

final cartProvider = NotifierProvider<CartNotifier, CartState>(CartNotifier.new);
