import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../features/city/providers/city_provider.dart';
import '../../../features/city/widgets/city_selector_chip.dart';
import '../../../shared/widgets/app_error_widget.dart';
import '../../../shared/widgets/restaurant_card.dart';
import '../../../shared/widgets/shimmer_card.dart';
import '../providers/restaurant_provider.dart';

class RestaurantsScreen extends ConsumerStatefulWidget {
  const RestaurantsScreen({super.key});

  @override
  ConsumerState<RestaurantsScreen> createState() => _RestaurantsScreenState();
}

class _RestaurantsScreenState extends ConsumerState<RestaurantsScreen> {
  final _searchController = TextEditingController();
  final _scrollController = ScrollController();
  String? _selectedCuisine;

  static const _cuisines = [
    'All', 'North Indian', 'South Indian', 'Chinese', 'Italian',
    'Pizza', 'Burgers', 'Biryani', 'Desserts', 'Beverages',
  ];

  @override
  void initState() {
    super.initState();
    // No manual load() — restaurantsProvider auto-loads via ref.watch(cityProvider)
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      ref.read(restaurantsProvider.notifier).loadMore();
    }
  }

  void _search(String query) {
    ref.read(restaurantsProvider.notifier).load(
          search: query.trim().isEmpty ? null : query.trim(),
          cuisineType: _selectedCuisine,
        );
  }

  void _selectCuisine(String cuisine) {
    setState(() => _selectedCuisine = cuisine == 'All' ? null : cuisine);
    ref.read(restaurantsProvider.notifier).load(
          search: _searchController.text.trim().isEmpty
              ? null
              : _searchController.text.trim(),
          cuisineType: cuisine == 'All' ? null : cuisine,
        );
  }

  @override
  Widget build(BuildContext context) {
    // When city changes, clear UI filters — the provider already reloads automatically.
    ref.listen<String>(cityProvider, (prev, next) {
      if (prev != next) {
        _searchController.clear();
        setState(() => _selectedCuisine = null);
      }
    });

    final state = ref.watch(restaurantsProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            _TopBar(
              searchController: _searchController,
              onSearchChanged: _search,
            ),
            _CuisineFilter(
              cuisines: _cuisines,
              selected: _selectedCuisine ?? 'All',
              onSelect: _selectCuisine,
            ),
            Expanded(
              child: state.when(
                loading: () => const ShimmerList(),
                error: (e, _) => AppErrorWidget(
                  message: e.toString(),
                  onRetry: () => ref.invalidate(restaurantsProvider),
                ),
                data: (s) {
                  if (s.restaurants.isEmpty) {
                    return const Center(
                      child: Text(
                        'No restaurants found.',
                        style: AppTextStyles.bodyMedium,
                      ),
                    );
                  }
                  return ListView.separated(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: s.restaurants.length + (s.isLoadingMore ? 1 : 0),
                    separatorBuilder: (_, __) => const SizedBox(height: 20),
                    itemBuilder: (context, index) {
                      if (index == s.restaurants.length) {
                        return const Center(
                          child: Padding(
                            padding: EdgeInsets.all(16),
                            child: CircularProgressIndicator(
                              color: AppColors.brandPrimary,
                              strokeWidth: 2,
                            ),
                          ),
                        );
                      }
                      final restaurant = s.restaurants[index];
                      return RestaurantCard(
                        restaurant: restaurant,
                        onTap: () => context.goNamed(
                          RouteNames.restaurantDetail,
                          pathParameters: {'id': restaurant.id},
                        ),
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TopBar extends StatelessWidget {
  const _TopBar({required this.searchController, required this.onSearchChanged});
  final TextEditingController searchController;
  final ValueChanged<String> onSearchChanged;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const CitySelectorChip(),
          const SizedBox(height: 10),
          TextField(
            controller: searchController,
            onChanged: onSearchChanged,
            decoration: InputDecoration(
              hintText: 'Search restaurants or cuisines',
              prefixIcon: const Icon(Icons.search, size: 20, color: AppColors.textTertiary),
              suffixIcon: searchController.text.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.close, size: 18),
                      onPressed: () {
                        searchController.clear();
                        onSearchChanged('');
                      },
                    )
                  : null,
              filled: true,
              fillColor: AppColors.surface,
              contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 16),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide.none,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _CuisineFilter extends StatelessWidget {
  const _CuisineFilter({
    required this.cuisines,
    required this.selected,
    required this.onSelect,
  });

  final List<String> cuisines;
  final String selected;
  final ValueChanged<String> onSelect;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 40,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: cuisines.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (_, i) {
          final cuisine = cuisines[i];
          final isSelected = cuisine == selected;
          return ChoiceChip(
            label: Text(cuisine),
            selected: isSelected,
            onSelected: (_) => onSelect(cuisine),
            selectedColor: AppColors.brandPrimary,
            labelStyle: TextStyle(
              color: isSelected ? Colors.white : AppColors.textSecondary,
              fontSize: 12,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
            ),
            backgroundColor: AppColors.surface,
            side: BorderSide(
              color: isSelected ? AppColors.brandPrimary : AppColors.divider,
            ),
            padding: const EdgeInsets.symmetric(horizontal: 8),
            visualDensity: VisualDensity.compact,
          );
        },
      ),
    );
  }
}
