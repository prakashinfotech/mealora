import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/utils/formatters.dart';
import '../models/order_model.dart';
import '../providers/order_provider.dart';

class OrdersScreen extends ConsumerStatefulWidget {
  const OrdersScreen({super.key});

  @override
  ConsumerState<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends ConsumerState<OrdersScreen> {
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      ref.read(ordersProvider.notifier).loadMore();
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(ordersProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        title: const Text('My Orders', style: AppTextStyles.headlineSmall),
        elevation: 0,
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(1),
          child: Divider(height: 1, color: AppColors.divider),
        ),
      ),
      body: state.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.brandOrange),
        ),
        error: (e, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.error_outline, size: 48, color: AppColors.swiggyLightGray),
                const SizedBox(height: 12),
                Text(e.toString(), style: AppTextStyles.bodyMedium, textAlign: TextAlign.center),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => ref.invalidate(ordersProvider),
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.brandOrange),
                  child: const Text('Retry', style: TextStyle(color: Colors.white)),
                ),
              ],
            ),
          ),
        ),
        data: (s) {
          if (s.orders.isEmpty) {
            return const _EmptyOrders();
          }
          return ListView.separated(
            controller: _scrollController,
            padding: const EdgeInsets.all(16),
            itemCount: s.orders.length + (s.isLoadingMore ? 1 : 0),
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              if (index == s.orders.length) {
                return const Center(
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: CircularProgressIndicator(
                        color: AppColors.brandOrange, strokeWidth: 2),
                  ),
                );
              }
              return _OrderCard(
                order: s.orders[index],
                onTap: () => context.pushNamed(
                  RouteNames.orderDetail,
                  pathParameters: {'id': s.orders[index].id},
                ),
              );
            },
          );
        },
      ),
    );
  }
}

class _EmptyOrders extends StatelessWidget {
  const _EmptyOrders();

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
                color: AppColors.brandOrangeLight,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.receipt_long_outlined,
                  size: 40, color: AppColors.brandOrange),
            ),
            const SizedBox(height: 20),
            const Text('No orders yet', style: AppTextStyles.headlineSmall),
            const SizedBox(height: 8),
            const Text(
              'Your past orders will appear here',
              style: AppTextStyles.bodyMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => context.goNamed(RouteNames.restaurants),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.brandOrange,
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: const Text('Order Now',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
            ),
          ],
        ),
      ),
    );
  }
}

class _OrderCard extends StatelessWidget {
  const _OrderCard({required this.order, required this.onTap});

  final Order order;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final statusColor = _statusColor(order.status);
    final statusLabel = _statusLabel(order.status);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          boxShadow: const [BoxShadow(color: Color(0x0A000000), blurRadius: 4, offset: Offset(0, 2))],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (order.restaurant?.imageUrl.isNotEmpty == true)
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.network(
                      order.restaurant!.imageUrl,
                      width: 52,
                      height: 52,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => _PlaceholderImage(),
                    ),
                  )
                else
                  _PlaceholderImage(),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        order.restaurant?.name ?? 'Order #${order.id.substring(0, 8)}',
                        style: AppTextStyles.titleLarge,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      if (order.restaurant?.area != null)
                        Text(order.restaurant!.area!, style: AppTextStyles.bodySmall),
                      const SizedBox(height: 4),
                      Text(
                        Formatters.dateTime(order.createdAt),
                        style: AppTextStyles.bodySmall,
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: statusColor.withAlpha(25),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    statusLabel,
                    style: TextStyle(
                      color: statusColor,
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Divider(color: AppColors.divider, height: 1),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  Formatters.priceAlways(order.total),
                  style: AppTextStyles.labelLarge,
                ),
                Text(
                  _paymentLabel(order.paymentMode),
                  style: AppTextStyles.bodySmall,
                ),
                const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text('View Details',
                        style: TextStyle(
                            color: AppColors.brandOrange,
                            fontSize: 12,
                            fontWeight: FontWeight.w600)),
                    SizedBox(width: 2),
                    Icon(Icons.chevron_right, size: 16, color: AppColors.brandOrange),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  static Color _statusColor(String status) => switch (status) {
        'DELIVERED' => AppColors.vegGreen,
        'CANCELLED' => AppColors.error,
        'OUT_FOR_DELIVERY' => AppColors.brandOrange,
        _ => AppColors.warning,
      };

  static String _statusLabel(String status) => switch (status) {
        'PLACED' => 'Placed',
        'ACCEPTED' => 'Accepted',
        'PREPARING' => 'Preparing',
        'READY' => 'Ready',
        'OUT_FOR_DELIVERY' => 'On the way',
        'DELIVERED' => 'Delivered',
        'CANCELLED' => 'Cancelled',
        _ => status,
      };

  static String _paymentLabel(String mode) => switch (mode) {
        'CASH_ON_DELIVERY' => 'Cash on Delivery',
        'ONLINE' => 'Online Payment',
        _ => mode,
      };
}

class _PlaceholderImage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 52,
      height: 52,
      decoration: BoxDecoration(
        color: AppColors.shimmerBase,
        borderRadius: BorderRadius.circular(8),
      ),
      child: const Icon(Icons.restaurant, color: AppColors.swiggyLightGray),
    );
  }
}
