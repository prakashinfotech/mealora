import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../features/restaurants/data/models/restaurant_model.dart';
import 'shimmer_card.dart';

class RestaurantCard extends StatelessWidget {
  const RestaurantCard({
    super.key,
    required this.restaurant,
    required this.onTap,
  });

  final Restaurant restaurant;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _Thumbnail(imageUrl: restaurant.imageUrl, isActive: restaurant.isActive),
          const SizedBox(height: 10),
          _Info(restaurant: restaurant),
        ],
      ),
    );
  }
}

class _Thumbnail extends StatelessWidget {
  const _Thumbnail({required this.imageUrl, required this.isActive});
  final String? imageUrl;
  final bool isActive;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: Stack(
        children: [
          AspectRatio(
            aspectRatio: 16 / 9,
            child: imageUrl != null
                ? CachedNetworkImage(
                    imageUrl: imageUrl!,
                    fit: BoxFit.cover,
                    placeholder: (_, __) => const ShimmerCard(height: double.infinity),
                    errorWidget: (_, __, ___) => _Placeholder(),
                  )
                : _Placeholder(),
          ),
          if (!isActive)
            Positioned.fill(
              child: Container(
                color: Colors.black54,
                alignment: Alignment.center,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.black87,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text(
                    'Currently Closed',
                    style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _Placeholder extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.shimmerBase,
      child: const Center(
        child: Icon(Icons.restaurant, size: 40, color: AppColors.textTertiary),
      ),
    );
  }
}

class _Info extends StatelessWidget {
  const _Info({required this.restaurant});
  final Restaurant restaurant;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          restaurant.name,
          style: AppTextStyles.titleLarge,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: 3),
        Text(
          restaurant.cuisineType,
          style: AppTextStyles.bodySmall,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: 6),
        Row(
          children: [
            _RatingChip(rating: restaurant.rating),
            const SizedBox(width: 8),
            const _Dot(),
            const SizedBox(width: 8),
            Text('${restaurant.avgDeliveryTime} mins', style: AppTextStyles.bodySmall),
            const SizedBox(width: 8),
            const _Dot(),
            const SizedBox(width: 8),
            Text(
              restaurant.deliveryFee == 0
                  ? 'Free delivery'
                  : '₹${restaurant.deliveryFee.toStringAsFixed(0)} delivery',
              style: AppTextStyles.bodySmall,
            ),
          ],
        ),
      ],
    );
  }
}

class _RatingChip extends StatelessWidget {
  const _RatingChip({required this.rating});
  final double rating;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: AppColors.vegGreen,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.star, size: 11, color: Colors.white),
          const SizedBox(width: 2),
          Text(
            rating.toStringAsFixed(1),
            style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }
}

class _Dot extends StatelessWidget {
  const _Dot();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 3,
      height: 3,
      decoration: const BoxDecoration(
        color: AppColors.textTertiary,
        shape: BoxShape.circle,
      ),
    );
  }
}
