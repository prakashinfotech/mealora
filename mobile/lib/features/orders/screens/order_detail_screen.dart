import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../core/utils/formatters.dart';
import '../../addresses/models/address_model.dart';
import '../models/order_model.dart';
import '../providers/order_provider.dart';

class OrderDetailScreen extends ConsumerWidget {
  const OrderDetailScreen({super.key, required this.id});
  final String id;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final orderAsync = ref.watch(orderDetailProvider(id));

    return orderAsync.when(
      loading: () => const Scaffold(
        body: Center(child: CircularProgressIndicator(color: AppColors.brandOrange)),
      ),
      error: (e, _) => Scaffold(
        appBar: AppBar(),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.error_outline, size: 48, color: AppColors.swiggyLightGray),
                const SizedBox(height: 12),
                Text(e.toString(),
                    style: AppTextStyles.bodyMedium, textAlign: TextAlign.center),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => ref.invalidate(orderDetailProvider(id)),
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.brandOrange),
                  child: const Text('Retry', style: TextStyle(color: Colors.white)),
                ),
              ],
            ),
          ),
        ),
      ),
      data: (order) => _OrderDetailView(order: order),
    );
  }
}

class _OrderDetailView extends StatelessWidget {
  const _OrderDetailView({required this.order});
  final Order order;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Order Details', style: AppTextStyles.headlineSmall),
            Text(
              '#${order.id.substring(0, 12).toUpperCase()}',
              style: AppTextStyles.bodySmall,
            ),
          ],
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.swiggyBlack),
          onPressed: () => Navigator.of(context).pop(),
        ),
        elevation: 0,
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(1),
          child: Divider(height: 1, color: AppColors.divider),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.only(bottom: 32),
        children: [
          const SizedBox(height: 8),
          _StatusBanner(status: order.status),
          const SizedBox(height: 8),
          if (order.timeline != null && order.timeline!.isNotEmpty) ...[
            _TimelineSection(timeline: order.timeline!),
            const SizedBox(height: 8),
          ],
          if (order.items != null && order.items!.isNotEmpty) ...[
            _ItemsSection(
              restaurantName: order.restaurant?.name,
              items: order.items!,
            ),
            const SizedBox(height: 8),
          ],
          _BillSection(order: order),
          const SizedBox(height: 8),
          if (order.address != null) _AddressSection(address: order.address!),
        ],
      ),
    );
  }
}

class _StatusBanner extends StatelessWidget {
  const _StatusBanner({required this.status});
  final String status;

  @override
  Widget build(BuildContext context) {
    final color = _statusColor(status);
    final icon = _statusIcon(status);
    final label = _statusLabel(status);

    return Container(
      color: AppColors.surface,
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: color.withAlpha(25),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: AppTextStyles.headlineSmall.copyWith(color: color)),
              const SizedBox(height: 2),
              Text(_statusSubtitle(status), style: AppTextStyles.bodyMedium),
            ],
          ),
        ],
      ),
    );
  }

  static Color _statusColor(String s) => switch (s) {
        'DELIVERED' => AppColors.vegGreen,
        'CANCELLED' => AppColors.error,
        'OUT_FOR_DELIVERY' => AppColors.brandOrange,
        _ => AppColors.warning,
      };

  static IconData _statusIcon(String s) => switch (s) {
        'DELIVERED' => Icons.check_circle_outline,
        'CANCELLED' => Icons.cancel_outlined,
        'OUT_FOR_DELIVERY' => Icons.delivery_dining,
        'PREPARING' => Icons.restaurant,
        _ => Icons.receipt_long_outlined,
      };

  static String _statusLabel(String s) => switch (s) {
        'PLACED' => 'Order Placed',
        'ACCEPTED' => 'Order Accepted',
        'PREPARING' => 'Being Prepared',
        'READY' => 'Ready for Pickup',
        'OUT_FOR_DELIVERY' => 'Out for Delivery',
        'DELIVERED' => 'Delivered',
        'CANCELLED' => 'Cancelled',
        _ => s,
      };

  static String _statusSubtitle(String s) => switch (s) {
        'PLACED' => 'Waiting for restaurant to accept',
        'ACCEPTED' => 'Restaurant confirmed your order',
        'PREPARING' => 'Your food is being prepared',
        'READY' => 'Assigning a delivery partner',
        'OUT_FOR_DELIVERY' => 'Your order is on the way',
        'DELIVERED' => 'Enjoy your meal!',
        'CANCELLED' => 'Your order was cancelled',
        _ => '',
      };
}

class _TimelineSection extends StatelessWidget {
  const _TimelineSection({required this.timeline});
  final List<OrderTimelineEntry> timeline;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.surface,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Order Timeline', style: AppTextStyles.headlineSmall),
          const SizedBox(height: 12),
          ...List.generate(timeline.length, (i) {
            final entry = timeline[i];
            final isLast = i == timeline.length - 1;
            return Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  children: [
                    Container(
                      width: 12,
                      height: 12,
                      decoration: BoxDecoration(
                        color: isLast ? AppColors.brandOrange : AppColors.vegGreen,
                        shape: BoxShape.circle,
                      ),
                    ),
                    if (!isLast)
                      Container(width: 2, height: 36, color: AppColors.divider),
                  ],
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 4),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(_statusLabel(entry.status), style: AppTextStyles.titleLarge),
                        if (entry.message != null)
                          Text(entry.message!, style: AppTextStyles.bodySmall),
                        Text(
                          Formatters.dateTime(entry.createdAt),
                          style: AppTextStyles.bodySmall,
                        ),
                        const SizedBox(height: 8),
                      ],
                    ),
                  ),
                ),
              ],
            );
          }),
        ],
      ),
    );
  }

  static String _statusLabel(String s) => switch (s) {
        'PLACED' => 'Order Placed',
        'ACCEPTED' => 'Accepted',
        'PREPARING' => 'Preparing',
        'READY' => 'Ready',
        'OUT_FOR_DELIVERY' => 'Out for Delivery',
        'DELIVERED' => 'Delivered',
        'CANCELLED' => 'Cancelled',
        _ => s,
      };
}

class _ItemsSection extends StatelessWidget {
  const _ItemsSection({required this.items, this.restaurantName});
  final List<OrderItem> items;
  final String? restaurantName;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.surface,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            restaurantName ?? 'Order Items',
            style: AppTextStyles.headlineSmall,
          ),
          const SizedBox(height: 12),
          ...items.map((item) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Row(
                  children: [
                    Container(
                      width: 20,
                      height: 20,
                      decoration: BoxDecoration(
                        color: AppColors.brandOrangeLight,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Center(
                        child: Text(
                          '${item.quantity}',
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: AppColors.brandOrange,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(child: Text(item.name, style: AppTextStyles.bodyLarge)),
                    Text(
                      Formatters.priceAlways(item.itemTotal),
                      style: AppTextStyles.bodyLarge
                          .copyWith(fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }
}

class _BillSection extends StatelessWidget {
  const _BillSection({required this.order});
  final Order order;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.surface,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Bill Details', style: AppTextStyles.headlineSmall),
          const SizedBox(height: 12),
          _BillRow(label: 'Item total', value: Formatters.priceAlways(order.subtotal)),
          const SizedBox(height: 8),
          _BillRow(
            label: 'Delivery fee',
            value: Formatters.price(order.deliveryFee),
            valueColor: order.deliveryFee == 0 ? AppColors.vegGreen : null,
          ),
          const SizedBox(height: 8),
          _BillRow(label: 'GST & charges', value: Formatters.priceAlways(order.taxes)),
          if (order.discount > 0) ...[
            const SizedBox(height: 8),
            _BillRow(
              label: order.couponCode != null ? 'Coupon (${order.couponCode})' : 'Discount',
              value: '−${Formatters.priceAlways(order.discount)}',
              valueColor: AppColors.vegGreen,
            ),
          ],
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 10),
            child: Divider(color: AppColors.divider),
          ),
          _BillRow(
            label: 'Total Paid',
            value: Formatters.priceAlways(order.total),
            bold: true,
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.payments_outlined, size: 14, color: AppColors.swiggyGray),
              const SizedBox(width: 6),
              Text(
                _paymentLabel(order.paymentMode),
                style: AppTextStyles.bodySmall,
              ),
            ],
          ),
        ],
      ),
    );
  }

  static String _paymentLabel(String mode) => switch (mode) {
        'CASH_ON_DELIVERY' => 'Paid via Cash on Delivery',
        'ONLINE' => 'Paid Online',
        _ => mode,
      };
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
        Text(value, style: style.copyWith(color: valueColor)),
      ],
    );
  }
}

class _AddressSection extends StatelessWidget {
  const _AddressSection({required this.address});
  final Address address;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.surface,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Delivered to', style: AppTextStyles.headlineSmall),
          const SizedBox(height: 10),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.location_on_outlined,
                  size: 18, color: AppColors.brandOrange),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(address.label, style: AppTextStyles.titleLarge),
                    const SizedBox(height: 2),
                    Text(address.fullAddress, style: AppTextStyles.bodyMedium),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
