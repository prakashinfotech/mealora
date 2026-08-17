import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/utils/formatters.dart';
import '../../../features/cart/models/cart_item.dart';
import '../../../features/cart/providers/cart_provider.dart';
import '../../../shared/widgets/app_error_widget.dart';
import '../../../shared/widgets/app_loading_widget.dart';
import '../data/models/restaurant_model.dart';
import '../providers/restaurant_provider.dart';

class RestaurantDetailScreen extends ConsumerWidget {
  const RestaurantDetailScreen({super.key, required this.id});
  final String id;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final detailAsync = ref.watch(restaurantDetailProvider(id));

    return detailAsync.when(
      loading: () => const Scaffold(body: AppLoadingWidget()),
      error: (e, _) => Scaffold(
        appBar: AppBar(),
        body: AppErrorWidget(
          message: e.toString(),
          onRetry: () => ref.invalidate(restaurantDetailProvider(id)),
        ),
      ),
      data: (detail) => _DetailView(detail: detail),
    );
  }
}

class _DetailView extends ConsumerWidget {
  const _DetailView({required this.detail});
  final RestaurantDetail detail;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final restaurant = detail.restaurant;
    final cart = ref.watch(cartProvider);
    final hasCart = !cart.isEmpty && cart.restaurantId == restaurant.id;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          _AppBar(restaurant: restaurant),
          SliverToBoxAdapter(child: _RestaurantInfo(restaurant: restaurant)),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) => _CategorySection(
                category: detail.categories[index],
                restaurant: restaurant,
              ),
              childCount: detail.categories.length,
            ),
          ),
          SliverToBoxAdapter(
            child: SizedBox(height: hasCart ? 80 : 32),
          ),
        ],
      ),
      bottomSheet: hasCart ? _CartBar(cart: cart) : null,
    );
  }
}

// ─── Sticky cart bar ──────────────────────────────────────────────────────────

class _CartBar extends StatelessWidget {
  const _CartBar({required this.cart});
  final CartState cart;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 16),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        boxShadow: [BoxShadow(color: Color(0x1A000000), blurRadius: 12, offset: Offset(0, -2))],
      ),
      child: SafeArea(
        top: false,
        child: GestureDetector(
          onTap: () => context.pushNamed(RouteNames.cart),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: AppColors.brandPrimary,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.brandPrimaryDark,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    '${cart.totalItems}',
                    style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                        fontSize: 13),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    '${cart.totalItems} item${cart.totalItems > 1 ? 's' : ''} added',
                    style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                        fontSize: 14),
                  ),
                ),
                Text(
                  Formatters.priceAlways(cart.total),
                  style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontSize: 14),
                ),
                const SizedBox(width: 6),
                const Text('→',
                    style: TextStyle(color: Colors.white, fontSize: 16)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ─── AppBar ───────────────────────────────────────────────────────────────────

class _AppBar extends StatelessWidget {
  const _AppBar({required this.restaurant});
  final Restaurant restaurant;

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 220,
      pinned: true,
      backgroundColor: AppColors.surface,
      flexibleSpace: FlexibleSpaceBar(
        background: restaurant.bannerUrl != null
            ? CachedNetworkImage(
                imageUrl: restaurant.bannerUrl!,
                fit: BoxFit.cover,
                placeholder: (_, __) => Container(color: AppColors.shimmerBase),
                errorWidget: (_, __, ___) => Container(color: AppColors.shimmerBase),
              )
            : Container(color: AppColors.shimmerBase),
      ),
      leading: _BackButton(),
    );
  }
}

class _BackButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: CircleAvatar(
        backgroundColor: Colors.white.withAlpha(230),
        radius: 18,
        child: IconButton(
          icon: const Icon(Icons.arrow_back, size: 18, color: AppColors.textPrimary),
          onPressed: () => Navigator.of(context).pop(),
          padding: EdgeInsets.zero,
        ),
      ),
    );
  }
}

// ─── Restaurant info ──────────────────────────────────────────────────────────

class _RestaurantInfo extends StatelessWidget {
  const _RestaurantInfo({required this.restaurant});
  final Restaurant restaurant;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.surface,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(restaurant.name, style: AppTextStyles.headlineMedium),
          const SizedBox(height: 4),
          Text(restaurant.cuisineType, style: AppTextStyles.bodyMedium),
          if (restaurant.description != null) ...[
            const SizedBox(height: 8),
            Text(restaurant.description!, style: AppTextStyles.bodyMedium),
          ],
          const SizedBox(height: 12),
          const Divider(color: AppColors.divider),
          const SizedBox(height: 12),
          Row(
            children: [
              _StatItem(
                icon: Icons.star,
                iconColor: AppColors.vegGreen,
                value: restaurant.rating.toStringAsFixed(1),
                label: '${restaurant.ratingCount} ratings',
              ),
              const SizedBox(width: 24),
              _StatItem(
                icon: Icons.access_time,
                iconColor: AppColors.brandPrimary,
                value: '${restaurant.avgDeliveryTime} min',
                label: 'Delivery time',
              ),
              const SizedBox(width: 24),
              _StatItem(
                icon: Icons.delivery_dining,
                iconColor: AppColors.textSecondary,
                value: restaurant.deliveryFee == 0
                    ? 'Free'
                    : '₹${restaurant.deliveryFee.toStringAsFixed(0)}',
                label: 'Delivery fee',
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  const _StatItem({
    required this.icon,
    required this.iconColor,
    required this.value,
    required this.label,
  });

  final IconData icon;
  final Color iconColor;
  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 14, color: iconColor),
            const SizedBox(width: 4),
            Text(value, style: AppTextStyles.labelLarge),
          ],
        ),
        const SizedBox(height: 2),
        Text(label, style: AppTextStyles.bodySmall),
      ],
    );
  }
}

// ─── Menu category ────────────────────────────────────────────────────────────

class _CategorySection extends StatelessWidget {
  const _CategorySection({required this.category, required this.restaurant});
  final MenuCategory category;
  final Restaurant restaurant;

  @override
  Widget build(BuildContext context) {
    if (category.items.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 20, 16, 8),
          child: Text(
            '${category.name} (${category.items.length})',
            style: AppTextStyles.headlineSmall,
          ),
        ),
        ...category.items.map(
          (item) => _MenuItemTile(item: item, restaurant: restaurant),
        ),
      ],
    );
  }
}

// ─── Menu item tile with cart controls ───────────────────────────────────────

class _MenuItemTile extends ConsumerWidget {
  const _MenuItemTile({required this.item, required this.restaurant});
  final MenuItem item;
  final Restaurant restaurant;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.watch(cartProvider);
    final qty = cart.quantityOf(item.id);
    final notifier = ref.read(cartProvider.notifier);

    return Container(
      color: AppColors.surface,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _VegIndicator(isVeg: item.isVeg),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.name,
                  style: AppTextStyles.titleLarge.copyWith(
                    color: item.isAvailable
                        ? AppColors.textPrimary
                        : AppColors.textTertiary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '₹${item.price.toStringAsFixed(0)}',
                  style: AppTextStyles.bodyLarge
                      .copyWith(fontWeight: FontWeight.w600),
                ),
                if (item.description != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    item.description!,
                    style: AppTextStyles.bodySmall,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
                if (!item.isAvailable)
                  Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Text(
                      'Currently unavailable',
                      style: AppTextStyles.bodySmall
                          .copyWith(color: AppColors.error),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          // Image + cart controls stacked
          SizedBox(
            width: 90,
            child: Column(
              children: [
                if (item.imageUrl != null)
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: CachedNetworkImage(
                      imageUrl: item.imageUrl!,
                      width: 90,
                      height: 90,
                      fit: BoxFit.cover,
                      placeholder: (_, __) => Container(
                          width: 90, height: 90, color: AppColors.shimmerBase),
                      errorWidget: (_, __, ___) => Container(
                          width: 90, height: 90, color: AppColors.shimmerBase),
                    ),
                  )
                else
                  Container(
                    width: 90,
                    height: 90,
                    decoration: BoxDecoration(
                      color: AppColors.shimmerBase,
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                const SizedBox(height: 6),
                if (item.isAvailable)
                  qty == 0
                      ? _AddButton(
                          onAdd: () => _handleAdd(context, ref, notifier),
                        )
                      : _QtyControl(
                          qty: qty,
                          onDecrement: () => notifier.decrement(item.id),
                          onIncrement: () => notifier.addItem(
                            restaurantId: restaurant.id,
                            restaurantName: restaurant.name,
                            item: item,
                          ),
                        ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _handleAdd(BuildContext context, WidgetRef ref, CartNotifier notifier) {
    if (notifier.isDifferentRestaurant(restaurant.id)) {
      _showClearCartDialog(context, ref, notifier);
    } else {
      notifier.addItem(
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        item: item,
      );
    }
  }

  void _showClearCartDialog(
      BuildContext context, WidgetRef ref, CartNotifier notifier) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Start new cart?'),
        content: const Text(
            'Your cart has items from another restaurant. Starting a new cart will remove those items.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Keep current'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              notifier.clearCart();
              notifier.addItem(
                restaurantId: restaurant.id,
                restaurantName: restaurant.name,
                item: item,
              );
            },
            child: const Text('Start new',
                style: TextStyle(color: AppColors.brandPrimary)),
          ),
        ],
      ),
    );
  }
}

class _AddButton extends StatelessWidget {
  const _AddButton({required this.onAdd});
  final VoidCallback onAdd;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onAdd,
      child: Container(
        width: 90,
        padding: const EdgeInsets.symmetric(vertical: 6),
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border.all(color: AppColors.brandPrimary),
          borderRadius: BorderRadius.circular(6),
        ),
        child: const Center(
          child: Text(
            'ADD',
            style: TextStyle(
              color: AppColors.brandPrimary,
              fontWeight: FontWeight.w700,
              fontSize: 13,
            ),
          ),
        ),
      ),
    );
  }
}

class _QtyControl extends StatelessWidget {
  const _QtyControl({
    required this.qty,
    required this.onDecrement,
    required this.onIncrement,
  });

  final int qty;
  final VoidCallback onDecrement;
  final VoidCallback onIncrement;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 90,
      decoration: BoxDecoration(
        color: AppColors.brandPrimary,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _QBtn(icon: Icons.remove, onTap: onDecrement),
          Text(
            '$qty',
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w700,
              fontSize: 14,
            ),
          ),
          _QBtn(icon: Icons.add, onTap: onIncrement),
        ],
      ),
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

class _VegIndicator extends StatelessWidget {
  const _VegIndicator({required this.isVeg});
  final bool isVeg;

  @override
  Widget build(BuildContext context) {
    final color = isVeg ? AppColors.vegGreen : AppColors.nonVegRed;
    return Container(
      width: 16,
      height: 16,
      decoration: BoxDecoration(
        border: Border.all(color: color, width: 1.5),
      ),
      child: Center(
        child: Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
      ),
    );
  }
}
