import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../providers/city_provider.dart';
import 'city_selection_bottom_sheet.dart';

class CitySelectorChip extends ConsumerWidget {
  const CitySelectorChip({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final city = ref.watch(cityProvider);

    return GestureDetector(
      onTap: () => showCitySelectionBottomSheet(context, ref),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.location_on, size: 14, color: AppColors.brandOrange),
          const SizedBox(width: 3),
          Text(
            city,
            style: AppTextStyles.labelLarge.copyWith(color: AppColors.swiggyBlack),
          ),
          const SizedBox(width: 2),
          const Icon(Icons.keyboard_arrow_down_rounded, size: 16, color: AppColors.swiggyGray),
        ],
      ),
    );
  }
}
