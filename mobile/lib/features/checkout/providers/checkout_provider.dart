import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../addresses/models/address_model.dart';
import '../../cart/models/cart_item.dart';
import '../../coupons/providers/coupon_provider.dart';
import '../../orders/models/order_model.dart';
import '../../orders/providers/order_provider.dart';

class CheckoutState {
  const CheckoutState({
    this.selectedAddress,
    this.paymentMode = 'CASH_ON_DELIVERY',
    this.couponCode,
    this.couponDiscount = 0.0,
    this.isValidatingCoupon = false,
    this.isPlacingOrder = false,
    this.couponError,
    this.orderError,
  });

  final Address? selectedAddress;
  final String paymentMode;
  final String? couponCode;
  final double couponDiscount;
  final bool isValidatingCoupon;
  final bool isPlacingOrder;
  final String? couponError;
  final String? orderError;

  CheckoutState copyWith({
    Address? selectedAddress,
    String? paymentMode,
    String? couponCode,
    double? couponDiscount,
    bool? isValidatingCoupon,
    bool? isPlacingOrder,
    String? couponError,
    String? orderError,
    bool clearCoupon = false,
    bool clearErrors = false,
  }) =>
      CheckoutState(
        selectedAddress: selectedAddress ?? this.selectedAddress,
        paymentMode: paymentMode ?? this.paymentMode,
        couponCode: clearCoupon ? null : couponCode ?? this.couponCode,
        couponDiscount: clearCoupon ? 0.0 : couponDiscount ?? this.couponDiscount,
        isValidatingCoupon: isValidatingCoupon ?? this.isValidatingCoupon,
        isPlacingOrder: isPlacingOrder ?? this.isPlacingOrder,
        couponError: clearErrors || clearCoupon ? null : couponError ?? this.couponError,
        orderError: clearErrors ? null : orderError ?? this.orderError,
      );
}

class CheckoutNotifier extends Notifier<CheckoutState> {
  @override
  CheckoutState build() => const CheckoutState();

  void selectAddress(Address address) {
    state = state.copyWith(selectedAddress: address);
  }

  void setPaymentMode(String mode) {
    state = state.copyWith(paymentMode: mode);
  }

  Future<void> applyCoupon(String code, double subtotal) async {
    if (code.trim().isEmpty) return;
    state = state.copyWith(isValidatingCoupon: true, clearErrors: true);
    try {
      final discount = await ref
          .read(couponRepositoryProvider)
          .validateCoupon(code.trim().toUpperCase(), subtotal);
      state = state.copyWith(
        couponCode: code.trim().toUpperCase(),
        couponDiscount: discount,
        isValidatingCoupon: false,
      );
    } catch (e) {
      state = state.copyWith(
        couponError: e.toString().replaceAll('Exception: ', ''),
        isValidatingCoupon: false,
      );
    }
  }

  void removeCoupon() {
    state = state.copyWith(clearCoupon: true);
  }

  Future<Order?> placeOrder(CartState cart) async {
    if (state.selectedAddress == null) return null;
    state = state.copyWith(isPlacingOrder: true, clearErrors: true);

    try {
      final subtotal = cart.subtotal;
      final deliveryFee = cart.deliveryFee;
      final taxes = cart.taxes;
      final discount = state.couponDiscount;
      final total = (subtotal + deliveryFee + taxes - discount).clamp(0.0, double.infinity);

      final order = await ref.read(orderRepositoryProvider).createOrder({
        'restaurantId': cart.restaurantId,
        'addressId': state.selectedAddress!.id,
        'paymentMode': state.paymentMode,
        'items': cart.items
            .map((item) => {
                  'menuItemId': item.menuItemId,
                  'quantity': item.quantity,
                })
            .toList(),
        'subtotal': subtotal,
        'deliveryFee': deliveryFee,
        'taxes': taxes,
        'discount': discount,
        'total': total,
        if (state.couponCode != null) 'couponCode': state.couponCode,
      });

      state = state.copyWith(isPlacingOrder: false);
      return order;
    } catch (e) {
      state = state.copyWith(
        isPlacingOrder: false,
        orderError: e.toString().replaceAll('Exception: ', ''),
      );
      return null;
    }
  }
}

final checkoutProvider =
    NotifierProvider<CheckoutNotifier, CheckoutState>(
  CheckoutNotifier.new,
);
