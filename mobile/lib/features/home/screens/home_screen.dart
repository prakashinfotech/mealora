import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../features/auth/providers/auth_provider.dart';
import '../../../features/city/widgets/city_selector_chip.dart';
import '../../../features/restaurants/providers/restaurant_provider.dart';
import '../../../shared/widgets/app_error_widget.dart';
import '../../../shared/widgets/restaurant_card.dart';
import '../../../shared/widgets/section_header.dart';
import '../../../shared/widgets/shimmer_card.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).valueOrNull;
    // Provider auto-refreshes when cityProvider changes — no manual wiring needed.
    final restaurantsAsync = ref.watch(restaurantsProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(child: _Header(userName: user?.name)),
            SliverToBoxAdapter(child: _SearchTap()),
            SliverToBoxAdapter(child: _BannerStrip()),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 20, 16, 12),
                child: SectionHeader(
                  title: 'All Restaurants',
                  subtitle: 'Explore what\'s near you',
                  action: 'See all',
                  onActionTap: () => context.goNamed(RouteNames.restaurants),
                ),
              ),
            ),
            restaurantsAsync.when(
              loading: () => SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (_, __) => const Padding(
                      padding: EdgeInsets.only(bottom: 20),
                      child: ShimmerRestaurantCard(),
                    ),
                    childCount: 4,
                  ),
                ),
              ),
              error: (e, _) => SliverToBoxAdapter(
                child: AppErrorWidget(
                  message: e.toString(),
                  onRetry: () => ref.invalidate(restaurantsProvider),
                ),
              ),
              data: (s) {
                final restaurants = s.restaurants.take(6).toList();
                if (restaurants.isEmpty) {
                  return const SliverToBoxAdapter(
                    child: Padding(
                      padding: EdgeInsets.all(32),
                      child: Center(
                        child: Text(
                          'No restaurants in this city yet.',
                          style: AppTextStyles.bodyMedium,
                        ),
                      ),
                    ),
                  );
                }
                return SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) => Padding(
                        padding: const EdgeInsets.only(bottom: 20),
                        child: RestaurantCard(
                          restaurant: restaurants[index],
                          onTap: () => context.goNamed(
                            RouteNames.restaurantDetail,
                            pathParameters: {'id': restaurants[index].id},
                          ),
                        ),
                      ),
                      childCount: restaurants.length,
                    ),
                  ),
                );
              },
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 24)),
          ],
        ),
      ),
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({this.userName});
  final String? userName;

  @override
  Widget build(BuildContext context) {
    final hour = DateTime.now().hour;
    final greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    final name = userName?.split(' ').first ?? 'there';

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('$greeting, $name 👋', style: AppTextStyles.headlineMedium),
                const SizedBox(height: 6),
                const CitySelectorChip(),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Container(
            width: 40,
            height: 40,
            decoration: const BoxDecoration(
              color: AppColors.brandOrangeLight,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.person_outline, color: AppColors.brandOrange, size: 22),
          ),
        ],
      ),
    );
  }
}

class _SearchTap extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.goNamed(RouteNames.restaurants),
      child: Container(
        margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(10),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(12),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: const Row(
          children: [
            Icon(Icons.search, color: AppColors.swiggyLightGray, size: 20),
            SizedBox(width: 10),
            Text('Search for restaurants or food...', style: AppTextStyles.bodyMedium),
          ],
        ),
      ),
    );
  }
}

class _BannerStrip extends StatelessWidget {
  static const _items = [
    _BannerItem(icon: Icons.local_pizza, label: 'Pizza', color: Color(0xFFFF6B35)),
    _BannerItem(icon: Icons.rice_bowl, label: 'Biryani', color: Color(0xFF4CAF50)),
    _BannerItem(icon: Icons.lunch_dining, label: 'Burgers', color: Color(0xFFE91E63)),
    _BannerItem(icon: Icons.ramen_dining, label: 'Chinese', color: Color(0xFF9C27B0)),
    _BannerItem(icon: Icons.icecream, label: 'Desserts', color: Color(0xFF00BCD4)),
    _BannerItem(icon: Icons.local_cafe, label: 'Drinks', color: Color(0xFFFF9800)),
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.fromLTRB(16, 20, 16, 12),
          child: Text('What\'s on your mind?', style: AppTextStyles.headlineSmall),
        ),
        SizedBox(
          height: 92,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: _items.length,
            separatorBuilder: (_, __) => const SizedBox(width: 16),
            itemBuilder: (context, i) => GestureDetector(
              onTap: () => context.goNamed(RouteNames.restaurants),
              child: Column(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: _items[i].color.withAlpha(25),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(_items[i].icon, color: _items[i].color, size: 28),
                  ),
                  const SizedBox(height: 6),
                  Text(_items[i].label, style: AppTextStyles.labelSmall),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _BannerItem {
  const _BannerItem({required this.icon, required this.label, required this.color});
  final IconData icon;
  final String label;
  final Color color;
}
