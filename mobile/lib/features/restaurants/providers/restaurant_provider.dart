import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../features/auth/providers/auth_provider.dart';
import '../../../features/city/providers/city_provider.dart';
import '../data/models/restaurant_model.dart';
import '../data/repositories/restaurant_repository.dart';

// ─── Repository provider ──────────────────────────────────────────────────────

final restaurantRepositoryProvider = Provider<RestaurantRepository>((ref) {
  return RestaurantRepository(ref.watch(apiClientProvider));
});

// ─── Restaurants list state ───────────────────────────────────────────────────

class RestaurantsState {
  const RestaurantsState({
    required this.restaurants,
    required this.hasMore,
    required this.page,
    required this.city,
    this.search,
    this.cuisineType,
    this.isLoadingMore = false,
  });

  final List<Restaurant> restaurants;
  final bool hasMore;
  final int page;
  final String city;
  final String? search;
  final String? cuisineType;
  final bool isLoadingMore;

  RestaurantsState copyWith({
    List<Restaurant>? restaurants,
    bool? hasMore,
    int? page,
    String? city,
    String? search,
    String? cuisineType,
    bool? isLoadingMore,
  }) =>
      RestaurantsState(
        restaurants: restaurants ?? this.restaurants,
        hasMore: hasMore ?? this.hasMore,
        page: page ?? this.page,
        city: city ?? this.city,
        search: search,           // null resets search (intentional)
        cuisineType: cuisineType, // null resets cuisine (intentional)
        isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      );
}

// ─── Restaurants notifier ─────────────────────────────────────────────────────
//
// Uses AutoDisposeAsyncNotifier so build() IS the data fetch.
// ref.watch(cityProvider) inside build() means Riverpod disposes and rebuilds
// this notifier automatically whenever the city changes — no manual refresh needed.

class RestaurantsNotifier extends AutoDisposeAsyncNotifier<RestaurantsState> {
  @override
  Future<RestaurantsState> build() async {
    // Reactive dependency: city change → build() re-runs → fresh fetch
    final city = ref.watch(cityProvider);

    debugPrint('[RestaurantsNotifier] build() — city: $city');

    final result = await ref.read(restaurantRepositoryProvider).getRestaurants(
          city: city,
        );

    debugPrint('[RestaurantsNotifier] loaded ${result.items.length} restaurants for $city');

    return RestaurantsState(
      restaurants: result.items,
      hasMore: result.hasMore,
      page: result.page,
      city: city,
    );
  }

  // Called by screens for search/cuisine filter changes.
  // City is always read from the provider — never passed in.
  Future<void> load({String? search, String? cuisineType}) async {
    final city = ref.read(cityProvider);

    debugPrint('[RestaurantsNotifier] load() — city: $city search: $search cuisine: $cuisineType');

    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final result = await ref.read(restaurantRepositoryProvider).getRestaurants(
            city: city,
            search: search,
            cuisineType: cuisineType,
          );
      return RestaurantsState(
        restaurants: result.items,
        hasMore: result.hasMore,
        page: result.page,
        city: city,
        search: search,
        cuisineType: cuisineType,
      );
    });
  }

  Future<void> loadMore() async {
    final current = state.valueOrNull;
    if (current == null || !current.hasMore || current.isLoadingMore) return;

    state = AsyncData(current.copyWith(isLoadingMore: true));
    final nextPage = current.page + 1;

    try {
      final result = await ref.read(restaurantRepositoryProvider).getRestaurants(
            page: nextPage,
            city: current.city,
            search: current.search,
            cuisineType: current.cuisineType,
          );
      // Re-read state in case it changed while awaiting
      final latest = state.valueOrNull;
      if (latest != null) {
        state = AsyncData(latest.copyWith(
          restaurants: [...latest.restaurants, ...result.items],
          hasMore: result.hasMore,
          page: nextPage,
          search: latest.search,
          cuisineType: latest.cuisineType,
          isLoadingMore: false,
        ));
      }
    } catch (_) {
      final latest = state.valueOrNull;
      if (latest != null) {
        state = AsyncData(latest.copyWith(
          isLoadingMore: false,
          search: latest.search,
          cuisineType: latest.cuisineType,
        ));
      }
    }
  }
}

final restaurantsProvider =
    AutoDisposeAsyncNotifierProvider<RestaurantsNotifier, RestaurantsState>(
  RestaurantsNotifier.new,
);

// ─── Restaurant detail provider ───────────────────────────────────────────────

final restaurantDetailProvider =
    FutureProvider.autoDispose.family<RestaurantDetail, String>((ref, id) {
  return ref.watch(restaurantRepositoryProvider).getRestaurantDetail(id);
});
