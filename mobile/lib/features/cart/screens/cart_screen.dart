import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/utils/formatters.dart';
import '../models/cart_item.dart';
import '../providers/cart_provider.dart';

class CartScreen extends ConsumerWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.watch(cartProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Cart', style: AppTextStyles.headlineSmall),
            if (cart.restaurantName != null)
              Text(
                cart.restaurantName!,
                style: AppTextStyles.bodySmall,
              ),
          ],
        ),
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
      body: cart.isEmpty
          ? _EmptyCart(onBrowse: () => context.goNamed(RouteNames.restaurants))
          : _CartContent(cart: cart),
      bottomNavigationBar: cart.isEmpty
          ? null
          : _CheckoutBar(cart: cart),
    );
  }
}

class _EmptyCart extends StatelessWidget {
  const _EmptyCart({required this.onBrowse});
  final VoidCallback onBrowse;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 90,
              height: 90,
              decoration: const BoxDecoration(
                color: AppColors.brandPrimaryLight,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.shopping_cart_outlined,
                  size: 40, color: AppColors.brandPrimary),
            ),
            const SizedBox(height: 20),
            const Text('Your cart is empty', style: AppTextStyles.headlineSmall),
            const SizedBox(height: 8),
            const Text(
              'Add items from a restaurant to get started',
              style: AppTextStyles.bodyMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: onBrowse,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.brandPrimary,
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: const Text('Browse Restaurants',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
            ),
          ],
        ),
      ),
    );
  }
}

class _CartContent extends ConsumerWidget {
  const _CartContent({required this.cart});
  final CartState cart;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ListView(
      padding: const EdgeInsets.only(bottom: 16),
      children: [
        // Items
        Container(
          color: AppColors.surface,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                child: Text(
                  cart.restaurantName ?? 'Your Order',
                  style: AppTextStyles.headlineSmall,
                ),
              ),
              ...cart.items.map((item) => _CartItemTile(item: item)),
              const Divider(color: AppColors.divider, height: 1),
              const SizedBox(height: 8),
            ],
          ),
        ),

        const SizedBox(height: 8),

        // Bill summary
        Container(
          color: AppColors.surface,
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Bill Details', style: AppTextStyles.headlineSmall),
              const SizedBox(height: 12),
              _BillRow(label: 'Item total', value: Formatters.priceAlways(cart.subtotal)),
              const SizedBox(height: 8),
              _BillRow(
                label: 'Delivery fee',
                value: Formatters.price(cart.deliveryFee),
                valueColor: cart.deliveryFee == 0 ? AppColors.vegGreen : null,
              ),
              const SizedBox(height: 8),
              _BillRow(
                label: 'GST & charges',
                value: Formatters.priceAlways(cart.taxes),
              ),
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 10),
                child: Divider(color: AppColors.divider),
              ),
              _BillRow(
                label: 'To pay',
                value: Formatters.priceAlways(cart.total),
                bold: true,
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _CartItemTile extends ConsumerWidget {
  const _CartItemTile({required this.item});
  final CartItem item;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notifier = ref.read(cartProvider.notifier);

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Veg indicator
          Container(
            width: 16,
            height: 16,
            margin: const EdgeInsets.only(top: 2),
            decoration: BoxDecoration(
              border: Border.all(
                color: item.isVeg ? AppColors.vegGreen : AppColors.nonVegRed,
                width: 1.5,
              ),
            ),
            child: Center(
              child: Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  color: item.isVeg ? AppColors.vegGreen : AppColors.nonVegRed,
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),

          // Name + price
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.name, style: AppTextStyles.titleLarge),
                const SizedBox(height: 2),
                Text(
                  Formatters.priceAlways(item.price),
                  style: AppTextStyles.bodyMedium,
                ),
              ],
            ),
          ),

          // Quantity controls
          _QuantityControl(
            quantity: item.quantity,
            onIncrement: () => notifier.increment(item.menuItemId),
            onDecrement: () => notifier.decrement(item.menuItemId),
            itemTotal: item.itemTotal,
          ),
        ],
      ),
    );
  }
}

class _QuantityControl extends StatelessWidget {
  const _QuantityControl({
    required this.quantity,
    required this.onIncrement,
    required this.onDecrement,
    required this.itemTotal,
  });

  final int quantity;
  final VoidCallback onIncrement;
  final VoidCallback onDecrement;
  final double itemTotal;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Container(
          decoration: BoxDecoration(
            color: AppColors.brandPrimary,
            borderRadius: BorderRadius.circular(6),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _QBtn(icon: Icons.remove, onTap: onDecrement),
              SizedBox(
                width: 24,
                child: Text(
                  '$quantity',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 14,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              _QBtn(icon: Icons.add, onTap: onIncrement),
            ],
          ),
        ),
        const SizedBox(height: 4),
        Text(
          Formatters.priceAlways(itemTotal),
          style: AppTextStyles.bodyMedium.copyWith(fontWeight: FontWeight.w600),
        ),
      ],
    );
  }
}

class _QBtn extends StatelessWidget {
  const _QBtn({required this.icon, required this.onTap});
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        child: Icon(icon, size: 14, color: Colors.white),
      ),
    );
  }
}

class _BillRow extends StatelessWidget {
  const _BillRow({
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
        Text(
          value,
          style: style.copyWith(color: valueColor),
        ),
      ],
    );
  }
}

class _CheckoutBar extends StatelessWidget {
  const _CheckoutBar({required this.cart});
  final CartState cart;

  @override
  Widget build(BuildContext context) {
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
            onPressed: () => context.pushNamed(RouteNames.checkout),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.brandPrimary,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${cart.totalItems} item${cart.totalItems > 1 ? 's' : ''} · ${Formatters.priceAlways(cart.total)}',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w500),
                ),
                const Text(
                  'Proceed to Checkout  →',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
