import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/utils/formatters.dart';
import '../../addresses/models/address_model.dart';
import '../../addresses/providers/address_provider.dart';
import '../../cart/models/cart_item.dart';
import '../../cart/providers/cart_provider.dart';
import '../../checkout/data/models/payment_models.dart';
import '../../checkout/providers/checkout_provider.dart';
import '../../coupons/models/coupon_model.dart';
import '../../coupons/providers/coupon_provider.dart';

class CheckoutScreen extends ConsumerStatefulWidget {
  const CheckoutScreen({super.key});

  @override
  ConsumerState<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  ProviderSubscription<AsyncValue<List<Address>>>? _addressSub;

  // Razorpay — initialized once, cleared on dispose
  late final Razorpay _razorpay;

  // Stored between Step 1 (initOnlinePayment) and Step 3 (confirmOnlinePayment)
  // so the SDK success callback has all data needed for verification.
  RazorpayOrderData? _pendingRzpOrder;
  String? _pendingRestaurantId;
  String? _pendingAddressId;

  @override
  void initState() {
    super.initState();

    // ── Razorpay setup ──────────────────────────────────────────────────────
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _onRazorpaySuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _onRazorpayError);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _onExternalWallet);

    // ── Address auto-selection ───────────────────────────────────────────────
    _addressSub = ref.listenManual<AsyncValue<List<Address>>>(
      addressesProvider,
      (_, next) => _tryAutoSelectAddress(next),
      fireImmediately: true,
    );
  }

  void _tryAutoSelectAddress(AsyncValue<List<Address>> value) {
    value.whenData((addresses) {
      if (ref.read(checkoutProvider).selectedAddress == null &&
          addresses.isNotEmpty) {
        final defaultAddr = addresses.firstWhere(
          (a) => a.isDefault,
          orElse: () => addresses.first,
        );
        // Defer to post-frame — prevents !parentDataDirty semantics assertion
        // that fires when state changes during build/layout/GoRouter animation.
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) {
            ref.read(checkoutProvider.notifier).selectAddress(defaultAddr);
          }
        });
      }
    });
  }

  @override
  void dispose() {
    _addressSub?.close();
    _razorpay.clear(); // detach listeners & release native resources
    super.dispose();
  }

  // ─── Place-order entry point ─────────────────────────────────────────────

  Future<void> _handlePlaceOrder(CartState cart) async {
    final checkout = ref.read(checkoutProvider);
    if (checkout.selectedAddress == null || checkout.isPlacingOrder) return;

    if (checkout.paymentMode == 'ONLINE') {
      await _startOnlinePayment(cart, checkout.selectedAddress!);
    } else {
      await _placeCodOrder(cart);
    }
  }

  // ─── COD ─────────────────────────────────────────────────────────────────

  Future<void> _placeCodOrder(CartState cart) async {
    final order = await ref.read(checkoutProvider.notifier).placeOrder(cart);
    if (order != null && mounted) {
      ref.read(cartProvider.notifier).clearCart();
      context.goNamed(RouteNames.orderSuccess, pathParameters: {'id': order.id});
    }
  }

  // ─── ONLINE Step 1: create Razorpay order on backend ─────────────────────

  Future<void> _startOnlinePayment(CartState cart, Address address) async {
    final rzpData = await ref.read(checkoutProvider.notifier).initOnlinePayment(cart);
    if (rzpData == null || !mounted) return;

    // Store for the SDK success callback
    _pendingRzpOrder = rzpData;
    _pendingRestaurantId = cart.restaurantId;
    _pendingAddressId = address.id;

    final options = <String, dynamic>{
      'key': rzpData.keyId,
      'amount': rzpData.amount,        // already in paise from backend
      'currency': rzpData.currency,
      'order_id': rzpData.razorpayOrderId,
      'name': 'Mealora',
      'description': 'Food Order',
      'theme': {'color': '#5B4BDB'},
    };

    try {
      _razorpay.open(options);
    } catch (e) {
      ref.read(checkoutProvider.notifier)
          .setOrderError('Could not open payment gateway. Please try again.');
    }
  }

  // ─── ONLINE Step 3: Razorpay SDK success callback ─────────────────────────

  Future<void> _onRazorpaySuccess(PaymentSuccessResponse response) async {
    final pending = _pendingRzpOrder;
    final restaurantId = _pendingRestaurantId;
    final addressId = _pendingAddressId;

    // Guard: if any pending data is missing, abort safely
    if (pending == null ||
        restaurantId == null ||
        addressId == null ||
        response.paymentId == null ||
        response.orderId == null ||
        response.signature == null) {
      ref.read(checkoutProvider.notifier).setOrderError(
        'Payment completed but order data is missing. Contact support.',
      );
      return;
    }

    _pendingRzpOrder = null;
    _pendingRestaurantId = null;
    _pendingAddressId = null;

    final order = await ref.read(checkoutProvider.notifier).confirmOnlinePayment(
      razorpayOrderId: response.orderId!,
      razorpayPaymentId: response.paymentId!,
      razorpaySignature: response.signature!,
      restaurantId: restaurantId,
      addressId: addressId,
      items: pending.items.map((e) => e.toJson()).toList(),
      subtotal: pending.subtotal,
      deliveryFee: pending.deliveryFee,
      taxes: pending.taxes,
      discount: pending.discount,
      total: pending.total,
      couponCode: pending.couponCode,
    );

    if (order != null && mounted) {
      ref.read(cartProvider.notifier).clearCart();
      context.goNamed(RouteNames.orderSuccess, pathParameters: {'id': order.id});
    }
  }

  // ─── ONLINE: payment cancelled or failed ──────────────────────────────────

  void _onRazorpayError(PaymentFailureResponse response) {
    _pendingRzpOrder = null;
    _pendingRestaurantId = null;
    _pendingAddressId = null;

    final isCancelled = response.code == Razorpay.PAYMENT_CANCELLED;
    ref.read(checkoutProvider.notifier).setOrderError(
      isCancelled
          ? 'Payment cancelled.'
          : response.message ?? 'Payment failed. Please try again.',
    );
  }

  void _onExternalWallet(ExternalWalletResponse response) {
    // External wallet selected (e.g. Paytm). The wallet app handles the flow.
    // Razorpay fires EVENT_PAYMENT_SUCCESS or ERROR when it completes.
  }

  @override
  Widget build(BuildContext context) {
    final cart = ref.watch(cartProvider);
    final checkout = ref.watch(checkoutProvider);

    if (cart.isEmpty) {
      return Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          backgroundColor: AppColors.surface,
          title: const Text('Checkout', style: AppTextStyles.headlineSmall),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: AppColors.textPrimary),
            onPressed: () => context.pop(),
          ),
          elevation: 0,
          bottom: const PreferredSize(
            preferredSize: Size.fromHeight(1),
            child: Divider(height: 1, color: AppColors.divider),
          ),
        ),
        body: const Center(
          child: Text(
            'Your cart is empty.\nGo back and add some items!',
            textAlign: TextAlign.center,
          ),
        ),
      );
    }

    final subtotal = cart.subtotal;
    final deliveryFee = cart.deliveryFee;
    final taxes = cart.taxes;
    final discount = checkout.couponDiscount;
    final total = (subtotal + deliveryFee + taxes - discount).clamp(0.0, double.infinity);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        title: const Text('Checkout', style: AppTextStyles.headlineSmall),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textPrimary),
          onPressed: () => context.pop(),
        ),
        elevation: 0,
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(1),
          child: Divider(height: 1, color: AppColors.divider),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.only(bottom: 16),
        children: [
          const SizedBox(height: 8),
          _AddressSection(),
          const SizedBox(height: 8),
          _PaymentSection(),
          const SizedBox(height: 8),
          _CouponSection(subtotal: subtotal),
          const SizedBox(height: 8),
          _BillSummary(
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            taxes: taxes,
            discount: discount,
            total: total,
            couponCode: checkout.couponCode,
          ),
          const SizedBox(height: 8),
          if (checkout.orderError != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.error.withAlpha(20),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.error.withAlpha(80)),
                ),
                child: Text(
                  checkout.orderError!,
                  style: AppTextStyles.bodyMedium.copyWith(color: AppColors.error),
                ),
              ),
            ),
        ],
      ),
      bottomNavigationBar: _PlaceOrderBar(
        total: total,
        onPlaceOrder: () => _handlePlaceOrder(cart),
      ),
    );
  }
}

// ─── Address Section ──────────────────────────────────────────────────────────

class _AddressSection extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final addressesAsync = ref.watch(addressesProvider);
    final selected = ref.watch(checkoutProvider).selectedAddress;

    return Container(
      color: AppColors.surface,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Delivery Address', style: AppTextStyles.headlineSmall),
          const SizedBox(height: 12),
          addressesAsync.when(
            loading: () => const LinearProgressIndicator(color: AppColors.brandPrimary),
            error: (e, _) => Text(e.toString(), style: AppTextStyles.bodyMedium),
            data: (addresses) {
              if (addresses.isEmpty) {
                return const _AddAddressForm();
              }
              return Column(
                children: [
                  ...addresses.map(
                    (addr) => _AddressTile(
                      address: addr,
                      isSelected: selected?.id == addr.id,
                      onTap: () =>
                          ref.read(checkoutProvider.notifier).selectAddress(addr),
                    ),
                  ),
                  const SizedBox(height: 8),
                  _AddAddressInline(),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

class _AddressTile extends StatelessWidget {
  const _AddressTile({
    required this.address,
    required this.isSelected,
    required this.onTap,
  });

  final Address address;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelected ? AppColors.brandPrimary : AppColors.divider,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(8),
          color: isSelected ? AppColors.brandPrimaryLight : AppColors.surface,
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(
              Icons.location_on_outlined,
              size: 18,
              color: isSelected ? AppColors.brandPrimary : AppColors.textSecondary,
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    address.label,
                    style: AppTextStyles.titleLarge.copyWith(
                      color: isSelected ? AppColors.brandPrimary : AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(address.fullAddress, style: AppTextStyles.bodyMedium),
                ],
              ),
            ),
            if (isSelected)
              const Icon(Icons.check_circle, color: AppColors.brandPrimary, size: 18),
          ],
        ),
      ),
    );
  }
}

class _AddAddressInline extends ConsumerStatefulWidget {
  @override
  ConsumerState<_AddAddressInline> createState() => _AddAddressInlineState();
}

class _AddAddressInlineState extends ConsumerState<_AddAddressInline> {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    if (!_isExpanded) {
      return TextButton.icon(
        onPressed: () => setState(() => _isExpanded = true),
        icon: const Icon(Icons.add, size: 16, color: AppColors.brandPrimary),
        label: const Text('Add new address',
            style: TextStyle(color: AppColors.brandPrimary, fontWeight: FontWeight.w600)),
      );
    }
    return _AddAddressForm(
      onCancel: () => setState(() => _isExpanded = false),
    );
  }
}

class _AddAddressForm extends ConsumerStatefulWidget {
  const _AddAddressForm({this.onCancel});
  final VoidCallback? onCancel;

  @override
  ConsumerState<_AddAddressForm> createState() => _AddAddressFormState();
}

class _AddAddressFormState extends ConsumerState<_AddAddressForm> {
  final _labelCtrl = TextEditingController();
  final _line1Ctrl = TextEditingController();
  final _cityCtrl = TextEditingController();
  final _stateCtrl = TextEditingController();
  final _pincodeCtrl = TextEditingController();
  bool _saving = false;
  String? _error;

  @override
  void dispose() {
    _labelCtrl.dispose();
    _line1Ctrl.dispose();
    _cityCtrl.dispose();
    _stateCtrl.dispose();
    _pincodeCtrl.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (_labelCtrl.text.isEmpty ||
        _line1Ctrl.text.isEmpty ||
        _cityCtrl.text.isEmpty ||
        _stateCtrl.text.isEmpty ||
        _pincodeCtrl.text.isEmpty) {
      setState(() => _error = 'Please fill all fields.');
      return;
    }
    setState(() { _saving = true; _error = null; });
    try {
      final newAddr = await ref.read(addressRepositoryProvider).createAddress({
        'label': _labelCtrl.text.trim(),
        'line1': _line1Ctrl.text.trim(),
        'city': _cityCtrl.text.trim(),
        'state': _stateCtrl.text.trim(),
        'pincode': _pincodeCtrl.text.trim(),
      });
      ref.invalidate(addressesProvider);
      ref.read(checkoutProvider.notifier).selectAddress(newAddr);
      if (widget.onCancel != null) widget.onCancel!();
    } catch (e) {
      setState(() => _error = e.toString().replaceAll('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _field(_labelCtrl, 'Label (Home / Work / Other)'),
        _field(_line1Ctrl, 'Address line'),
        Row(children: [
          Expanded(child: _field(_cityCtrl, 'City')),
          const SizedBox(width: 8),
          Expanded(child: _field(_stateCtrl, 'State')),
        ]),
        _field(_pincodeCtrl, 'Pincode', keyboardType: TextInputType.number),
        if (_error != null)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Text(_error!, style: AppTextStyles.bodySmall.copyWith(color: AppColors.error)),
          ),
        Row(
          children: [
            if (widget.onCancel != null)
              TextButton(
                onPressed: widget.onCancel,
                child: const Text('Cancel',
                    style: TextStyle(color: AppColors.textSecondary)),
              ),
            const Spacer(),
            ElevatedButton(
              onPressed: _saving ? null : _save,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.brandPrimary,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
              ),
              child: _saving
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : const Text('Save Address',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
            ),
          ],
        ),
      ],
    );
  }

  Widget _field(
    TextEditingController ctrl,
    String hint, {
    TextInputType? keyboardType,
  }) =>
      Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: TextField(
          controller: ctrl,
          keyboardType: keyboardType,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: AppTextStyles.bodyMedium,
            filled: true,
            fillColor: AppColors.background,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(6),
              borderSide: const BorderSide(color: AppColors.divider),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(6),
              borderSide: const BorderSide(color: AppColors.divider),
            ),
          ),
        ),
      );
}

// ─── Payment Section ──────────────────────────────────────────────────────────

class _PaymentSection extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mode = ref.watch(checkoutProvider).paymentMode;

    return Container(
      color: AppColors.surface,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Payment Method', style: AppTextStyles.headlineSmall),
          const SizedBox(height: 12),
          _PaymentOption(
            value: 'CASH_ON_DELIVERY',
            label: 'Cash on Delivery',
            icon: Icons.payments_outlined,
            selected: mode,
            onSelect: ref.read(checkoutProvider.notifier).setPaymentMode,
          ),
          const SizedBox(height: 8),
          _PaymentOption(
            value: 'ONLINE',
            label: 'Online Payment',
            subtitle: 'UPI, cards, net banking',
            icon: Icons.credit_card_outlined,
            selected: mode,
            onSelect: ref.read(checkoutProvider.notifier).setPaymentMode,
          ),
        ],
      ),
    );
  }
}

class _PaymentOption extends StatelessWidget {
  const _PaymentOption({
    required this.value,
    required this.label,
    required this.icon,
    required this.selected,
    required this.onSelect,
    this.subtitle,
  });

  final String value;
  final String label;
  final String? subtitle;
  final IconData icon;
  final String selected;
  final ValueChanged<String> onSelect;

  @override
  Widget build(BuildContext context) {
    final isSelected = selected == value;
    return GestureDetector(
      onTap: () => onSelect(value),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelected ? AppColors.brandPrimary : AppColors.divider,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(8),
          color: isSelected ? AppColors.brandPrimaryLight : AppColors.surface,
        ),
        child: Row(
          children: [
            Icon(icon,
                size: 20,
                color: isSelected ? AppColors.brandPrimary : AppColors.textSecondary),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: AppTextStyles.titleLarge),
                  if (subtitle != null)
                    Text(subtitle!, style: AppTextStyles.bodySmall),
                ],
              ),
            ),
            if (isSelected)
              const Icon(Icons.check_circle, color: AppColors.brandPrimary, size: 18),
          ],
        ),
      ),
    );
  }
}

// ─── Coupon Section ───────────────────────────────────────────────────────────

class _CouponSection extends ConsumerStatefulWidget {
  const _CouponSection({required this.subtotal});
  final double subtotal;

  @override
  ConsumerState<_CouponSection> createState() => _CouponSectionState();
}

class _CouponSectionState extends ConsumerState<_CouponSection> {
  final _ctrl = TextEditingController();
  bool _showCoupons = false;

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final checkout = ref.watch(checkoutProvider);
    final notifier = ref.read(checkoutProvider.notifier);

    if (checkout.couponCode != null) {
      return Container(
        color: AppColors.surface,
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.vegGreen.withAlpha(20),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: AppColors.vegGreen.withAlpha(80)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.local_offer_outlined, size: 14, color: AppColors.vegGreen),
                  const SizedBox(width: 6),
                  Text(
                    checkout.couponCode!,
                    style: AppTextStyles.titleLarge.copyWith(color: AppColors.vegGreen),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                '−${Formatters.priceAlways(checkout.couponDiscount)} saved',
                style: AppTextStyles.bodyMedium.copyWith(color: AppColors.vegGreen),
              ),
            ),
            IconButton(
              icon: const Icon(Icons.close, size: 18, color: AppColors.textSecondary),
              onPressed: notifier.removeCoupon,
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
            ),
          ],
        ),
      );
    }

    return Container(
      color: AppColors.surface,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Apply Coupon', style: AppTextStyles.headlineSmall),
          const SizedBox(height: 12),

          // Manual entry
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _ctrl,
                  textCapitalization: TextCapitalization.characters,
                  decoration: InputDecoration(
                    hintText: 'Enter coupon code',
                    hintStyle: AppTextStyles.bodyMedium,
                    filled: true,
                    fillColor: AppColors.background,
                    contentPadding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(6),
                      borderSide: const BorderSide(color: AppColors.divider),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(6),
                      borderSide: const BorderSide(color: AppColors.divider),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              ElevatedButton(
                onPressed: checkout.isValidatingCoupon
                    ? null
                    : () => notifier.applyCoupon(_ctrl.text, widget.subtotal),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.brandPrimary,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                ),
                child: checkout.isValidatingCoupon
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : const Text('Apply',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
              ),
            ],
          ),

          if (checkout.couponError != null)
            Padding(
              padding: const EdgeInsets.only(top: 6),
              child: Text(
                checkout.couponError!,
                style: AppTextStyles.bodySmall.copyWith(color: AppColors.error),
              ),
            ),

          const SizedBox(height: 12),
          GestureDetector(
            onTap: () => setState(() => _showCoupons = !_showCoupons),
            child: Row(
              children: [
                const Icon(Icons.local_offer_outlined, size: 16, color: AppColors.brandPrimary),
                const SizedBox(width: 6),
                Text(
                  _showCoupons ? 'Hide offers' : 'View all offers',
                  style: AppTextStyles.brandLabel,
                ),
                Icon(
                  _showCoupons ? Icons.expand_less : Icons.expand_more,
                  color: AppColors.brandPrimary,
                  size: 18,
                ),
              ],
            ),
          ),

          if (_showCoupons) ...[
            const SizedBox(height: 12),
            _CouponList(
              subtotal: widget.subtotal,
              onApply: (code) {
                _ctrl.text = code;
                setState(() => _showCoupons = false);
                notifier.applyCoupon(code, widget.subtotal);
              },
            ),
          ],
        ],
      ),
    );
  }
}

class _CouponList extends ConsumerWidget {
  const _CouponList({required this.subtotal, required this.onApply});
  final double subtotal;
  final ValueChanged<String> onApply;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final couponsAsync = ref.watch(couponsProvider);
    return couponsAsync.when(
      loading: () => const LinearProgressIndicator(color: AppColors.brandPrimary),
      error: (e, _) => Text(e.toString(), style: AppTextStyles.bodySmall),
      data: (coupons) => Column(
        children: coupons
            .map((c) => _CouponTile(coupon: c, subtotal: subtotal, onApply: onApply))
            .toList(),
      ),
    );
  }
}

class _CouponTile extends StatelessWidget {
  const _CouponTile({
    required this.coupon,
    required this.subtotal,
    required this.onApply,
  });

  final Coupon coupon;
  final double subtotal;
  final ValueChanged<String> onApply;

  @override
  Widget build(BuildContext context) {
    final eligible =
        coupon.minOrderAmount == null || subtotal >= coupon.minOrderAmount!;

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.divider),
        borderRadius: BorderRadius.circular(8),
        color: eligible ? AppColors.surface : AppColors.background,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.brandPrimaryLight,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        coupon.code,
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.brandPrimary,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(coupon.displayDiscount, style: AppTextStyles.titleLarge),
                  ],
                ),
                const SizedBox(height: 4),
                Text(coupon.title, style: AppTextStyles.bodyMedium),
                if (coupon.minOrderAmount != null && !eligible)
                  Padding(
                    padding: const EdgeInsets.only(top: 2),
                    child: Text(
                      'Min order ₹${coupon.minOrderAmount!.toStringAsFixed(0)}',
                      style: AppTextStyles.bodySmall.copyWith(color: AppColors.error),
                    ),
                  ),
              ],
            ),
          ),
          if (eligible)
            TextButton(
              onPressed: () => onApply(coupon.code),
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 8),
              ),
              child: const Text('Apply',
                  style: TextStyle(
                      color: AppColors.brandPrimary, fontWeight: FontWeight.w700)),
            ),
        ],
      ),
    );
  }
}

// ─── Bill Summary ─────────────────────────────────────────────────────────────

class _BillSummary extends StatelessWidget {
  const _BillSummary({
    required this.subtotal,
    required this.deliveryFee,
    required this.taxes,
    required this.discount,
    required this.total,
    this.couponCode,
  });

  final double subtotal;
  final double deliveryFee;
  final double taxes;
  final double discount;
  final double total;
  final String? couponCode;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.surface,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Bill Summary', style: AppTextStyles.headlineSmall),
          const SizedBox(height: 12),
          _Row(label: 'Item total', value: Formatters.priceAlways(subtotal)),
          const SizedBox(height: 8),
          _Row(
            label: 'Delivery fee',
            value: Formatters.price(deliveryFee),
            valueColor: deliveryFee == 0 ? AppColors.vegGreen : null,
          ),
          const SizedBox(height: 8),
          _Row(label: 'GST & charges', value: Formatters.priceAlways(taxes)),
          if (discount > 0) ...[
            const SizedBox(height: 8),
            _Row(
              label: 'Coupon (${couponCode ?? ''})',
              value: '−${Formatters.priceAlways(discount)}',
              valueColor: AppColors.vegGreen,
            ),
          ],
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 10),
            child: Divider(color: AppColors.divider),
          ),
          _Row(
            label: 'Total',
            value: Formatters.priceAlways(total),
            bold: true,
          ),
        ],
      ),
    );
  }
}

class _Row extends StatelessWidget {
  const _Row({
    required this.label,
    required this.value,
    this.bold = false,
    this.valueColor,
  });

  final String label;
  final String value;
  final bool bold;
  final Color? valueColor;

  @override
  Widget build(BuildContext context) {
    final style = bold ? AppTextStyles.labelLarge : AppTextStyles.bodyLarge;
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: style),
        Text(value, style: style.copyWith(color: valueColor)),
      ],
    );
  }
}

// ─── Place Order Bar ──────────────────────────────────────────────────────────

class _PlaceOrderBar extends ConsumerWidget {
  const _PlaceOrderBar({required this.total, required this.onPlaceOrder});
  final double total;
  final VoidCallback onPlaceOrder;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final checkout = ref.watch(checkoutProvider);
    final canPlace = checkout.selectedAddress != null && !checkout.isPlacingOrder;

    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        boxShadow: [BoxShadow(color: Color(0x14000000), blurRadius: 8, offset: Offset(0, -2))],
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: canPlace ? onPlaceOrder : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.brandPrimary,
              disabledBackgroundColor: AppColors.textTertiary,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: checkout.isPlacingOrder
                ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                  )
                : Text(
                    checkout.selectedAddress == null
                        ? 'Select a delivery address'
                        : 'Place Order · ${Formatters.priceAlways(total)}',
                    style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                        fontSize: 15),
                  ),
          ),
        ),
      ),
    );
  }
}
