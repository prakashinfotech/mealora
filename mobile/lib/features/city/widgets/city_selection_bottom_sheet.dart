import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../providers/city_provider.dart';

void showCitySelectionBottomSheet(BuildContext context, WidgetRef ref) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (_) => _CitySelectionSheet(ref: ref),
  );
}

class _CitySelectionSheet extends StatefulWidget {
  const _CitySelectionSheet({required this.ref});
  final WidgetRef ref;

  @override
  State<_CitySelectionSheet> createState() => _CitySelectionSheetState();
}

class _CitySelectionSheetState extends State<_CitySelectionSheet> {
  final _searchController = TextEditingController();
  List<String> _filtered = kAvailableCities;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearch(String query) {
    final q = query.trim().toLowerCase();
    setState(() {
      _filtered = q.isEmpty
          ? kAvailableCities
          : kAvailableCities.where((c) => c.toLowerCase().contains(q)).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    final selectedCity = widget.ref.watch(cityProvider);

    return DraggableScrollableSheet(
      initialChildSize: 0.55,
      minChildSize: 0.4,
      maxChildSize: 0.85,
      builder: (_, scrollController) => Container(
        decoration: const BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          children: [
            // Handle bar
            Container(
              margin: const EdgeInsets.only(top: 12),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.divider,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            // Title
            const Padding(
              padding: EdgeInsets.fromLTRB(20, 16, 20, 12),
              child: Row(
                children: [
                  Icon(Icons.location_city_outlined, color: AppColors.brandPrimary, size: 20),
                  SizedBox(width: 8),
                  Text('Select your city', style: AppTextStyles.headlineSmall),
                ],
              ),
            ),
            // Search
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: TextField(
                controller: _searchController,
                onChanged: _onSearch,
                autofocus: false,
                decoration: InputDecoration(
                  hintText: 'Search city',
                  hintStyle: AppTextStyles.bodyMedium,
                  prefixIcon: const Icon(Icons.search, size: 18, color: AppColors.textTertiary),
                  suffixIcon: _searchController.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.close, size: 16),
                          onPressed: () {
                            _searchController.clear();
                            _onSearch('');
                          },
                        )
                      : null,
                  filled: true,
                  fillColor: AppColors.background,
                  contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 12),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 8),
            const Divider(height: 1, color: AppColors.divider),
            // City list
            Expanded(
              child: _filtered.isEmpty
                  ? const Center(
                      child: Text('No cities found', style: AppTextStyles.bodyMedium),
                    )
                  : ListView.builder(
                      controller: scrollController,
                      itemCount: _filtered.length,
                      itemBuilder: (_, i) => _CityListTile(
                        city: _filtered[i],
                        isSelected: _filtered[i] == selectedCity,
                        onTap: () {
                          widget.ref.read(cityProvider.notifier).selectCity(_filtered[i]);
                          Navigator.of(context).pop();
                        },
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CityListTile extends StatelessWidget {
  const _CityListTile({
    required this.city,
    required this.isSelected,
    required this.onTap,
  });

  final String city;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        child: Row(
          children: [
            Icon(
              Icons.location_on_outlined,
              size: 18,
              color: isSelected ? AppColors.brandPrimary : AppColors.textSecondary,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                city,
                style: AppTextStyles.bodyLarge.copyWith(
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                  color: isSelected ? AppColors.textPrimary : AppColors.textSecondary,
                ),
              ),
            ),
            if (isSelected)
              const Icon(Icons.check_circle, size: 18, color: AppColors.brandPrimary),
          ],
        ),
      ),
    );
  }
}
