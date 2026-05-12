import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../features/auth/providers/auth_provider.dart';
import '../data/repositories/order_repository.dart';
import '../models/order_model.dart';

final orderRepositoryProvider = Provider<OrderRepository>((ref) {
  return OrderRepository(ref.watch(apiClientProvider));
});

// ─── Orders list ─────────────────────────────────────────────────────────────

class OrdersState {
  const OrdersState({
    required this.orders,
    required this.hasMore,
    required this.page,
    this.isLoadingMore = false,
  });

  final List<Order> orders;
  final bool hasMore;
  final int page;
  final bool isLoadingMore;

  OrdersState copyWith({
    List<Order>? orders,
    bool? hasMore,
    int? page,
    bool? isLoadingMore,
  }) =>
      OrdersState(
        orders: orders ?? this.orders,
        hasMore: hasMore ?? this.hasMore,
        page: page ?? this.page,
        isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      );
}

class OrdersNotifier extends AutoDisposeAsyncNotifier<OrdersState> {
  @override
  Future<OrdersState> build() async {
    final result = await ref.read(orderRepositoryProvider).getOrders();
    return OrdersState(
      orders: result.items,
      hasMore: result.hasMore,
      page: result.page,
    );
  }

  Future<void> loadMore() async {
    final current = state.valueOrNull;
    if (current == null || !current.hasMore || current.isLoadingMore) return;

    state = AsyncData(current.copyWith(isLoadingMore: true));
    try {
      final result = await ref
          .read(orderRepositoryProvider)
          .getOrders(page: current.page + 1);
      final latest = state.valueOrNull;
      if (latest != null) {
        state = AsyncData(latest.copyWith(
          orders: [...latest.orders, ...result.items],
          hasMore: result.hasMore,
          page: current.page + 1,
          isLoadingMore: false,
        ));
      }
    } catch (_) {
      final latest = state.valueOrNull;
      if (latest != null) {
        state = AsyncData(latest.copyWith(isLoadingMore: false));
      }
    }
  }
}

final ordersProvider =
    AutoDisposeAsyncNotifierProvider<OrdersNotifier, OrdersState>(
  OrdersNotifier.new,
);

// ─── Order detail ─────────────────────────────────────────────────────────────

final orderDetailProvider =
    FutureProvider.autoDispose.family<Order, String>((ref, id) {
  return ref.read(orderRepositoryProvider).getOrderById(id);
});
