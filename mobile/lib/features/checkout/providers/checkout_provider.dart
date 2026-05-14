import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../addresses/models/address_model.dart';
import '../../auth/providers/auth_provider.dart';
import '../../cart/models/cart_item.dart';
import '../../coupons/providers/coupon_provider.dart';
import '../../orders/models/order_model.dart';
import '../../orders/providers/order_provider.dart';
import '../data/models/payment_models.dart';
import '../data/repositories/payment_repository.dart';

// ─── Payment repository provider ─────────────────────────────────────────────

final paymentRepositoryProvider = Provider<PaymentRepository>((ref) {
  return PaymentRepository(ref.watch(apiClientProvider));
});

// ─── State ────────────────────────────────────────────────────────────────────

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

// ─── Notifier ─────────────────────────────────────────────────────────────────

class CheckoutNotifier extends Notifier<CheckoutState> {
  @override
  CheckoutState build() => const CheckoutState();

  void selectAddress(Address address) {
    state = state.copyWith(selectedAddress: address);
  }

  void setPaymentMode(String mode) {
    state = state.copyWith(paymentMode: mode, clearErrors: true);
  }

  void setOrderError(String error) {
    state = state.copyWith(orderError: error, isPlacingOrder: false);
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

  // ─── COD flow ──────────────────────────────────────────────────────────────

  Future<Order?> placeOrder(CartState cart) async {
    if (state.selectedAddress == null) return null;
    state = state.copyWith(isPlacingOrder: true, clearErrors: true);

    try {
      final subtotal = cart.subtotal;
      final deliveryFee = cart.deliveryFee;
      final taxes = cart.taxes;
      final discount = state.couponDiscount;
      final total =
          (subtotal + deliveryFee + taxes - discount).clamp(0.0, double.infinity);

      final order = await ref.read(orderRepositoryProvider).createOrder({
        'restaurantId': cart.restaurantId,
        'addressId': state.selectedAddress!.id,
        'paymentMode': 'CASH_ON_DELIVERY',
        'items': cart.items
            .map((item) => {
                  'menuItemId': item.menuItemId,
                  'name': item.name,
                  'price': item.price,
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

  // ─── ONLINE flow — Step 1: create Razorpay order ───────────────────────────

  /// Calls POST /api/payments/create-order.
  /// Returns the Razorpay order data needed to open the SDK checkout.
  /// The backend re-validates all prices from the DB — never trust client amounts.
  Future<RazorpayOrderData?> initOnlinePayment(CartState cart) async {
    if (state.selectedAddress == null || cart.restaurantId == null) return null;
    state = state.copyWith(isPlacingOrder: true, clearErrors: true);

    try {
      final data = await ref.read(paymentRepositoryProvider).createPaymentOrder(
        restaurantId: cart.restaurantId!,
        items: cart.items
            .map((item) => {
                  'menuItemId': item.menuItemId,
                  'quantity': item.quantity,
                })
            .toList(),
        couponCode: state.couponCode,
      );
      // isPlacingOrder stays true — Razorpay checkout opens next
      return data;
    } catch (e) {
      state = state.copyWith(
        isPlacingOrder: false,
        orderError: e.toString().replaceAll('Exception: ', ''),
      );
      return null;
    }
  }

  // ─── ONLINE flow — Step 3: verify & create order ───────────────────────────

  /// Called from the Razorpay success callback.
  /// Sends server-validated amounts (from RazorpayOrderData) + Razorpay
  /// payment credentials to POST /api/payments/verify.
  /// The backend verifies the HMAC signature before creating the order.
  Future<Order?> confirmOnlinePayment({
    required String razorpayOrderId,
    required String razorpayPaymentId,
    required String razorpaySignature,
    required String restaurantId,
    required String addressId,
    required List<Map<String, dynamic>> items,
    required double subtotal,
    required double deliveryFee,
    required double taxes,
    required double discount,
    required double total,
    String? couponCode,
  }) async {
    state = state.copyWith(isPlacingOrder: true, clearErrors: true);
    try {
      final order = await ref.read(paymentRepositoryProvider).verifyPayment(
        razorpayOrderId: razorpayOrderId,
        razorpayPaymentId: razorpayPaymentId,
        razorpaySignature: razorpaySignature,
        restaurantId: restaurantId,
        addressId: addressId,
        items: items,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        taxes: taxes,
        discount: discount,
        total: total,
        couponCode: couponCode,
      );
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

// ─── Provider ─────────────────────────────────────────────────────────────────

final checkoutProvider =
    NotifierProvider<CheckoutNotifier, CheckoutState>(CheckoutNotifier.new);
