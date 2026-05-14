import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../addresses/models/address_model.dart';
import '../../addresses/providers/address_provider.dart';
import '../../auth/data/models/auth_models.dart';
import '../../auth/providers/auth_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authAsync = ref.watch(authProvider);

    return authAsync.when(
      loading: () => const _LoadingProfile(),
      error: (_, __) => const _LoadingProfile(),
      data: (user) {
        if (user == null) {
          // Guard: router redirect handles this, but just in case
          return const _LoadingProfile();
        }
        return _ProfileContent(user: user);
      },
    );
  }
}

// ─── Main Content ─────────────────────────────────────────────────────────────

class _ProfileContent extends ConsumerWidget {
  const _ProfileContent({required this.user});
  final AuthUser user;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final addressesAsync = ref.watch(addressesProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: AppColors.surface,
        elevation: 0,
        title: const Text('Profile', style: AppTextStyles.headlineSmall),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(1),
          child: Divider(height: 1, color: AppColors.divider),
        ),
      ),
      body: ListView(
        children: [
          // ── Header ──────────────────────────────────────────────────────
          _ProfileHeaderCard(user: user),
          const SizedBox(height: 8),

          // ── Quick Actions ────────────────────────────────────────────────
          _QuickActionsSection(user: user),
          const SizedBox(height: 8),

          // ── Saved Addresses ──────────────────────────────────────────────
          _AddressPreviewSection(addressesAsync: addressesAsync),
          const SizedBox(height: 8),

          // ── Account ──────────────────────────────────────────────────────
          _SettingsSection(
            title: 'Account',
            tiles: [
              _ProfileMenuTile(
                icon: Icons.info_outline,
                title: 'About Swiggy Clone',
                onTap: () => _showAbout(context),
              ),
              const _ProfileMenuTile(
                icon: Icons.lock_outline,
                title: 'Privacy Policy',
                subtitle: 'Coming soon',
                onTap: null,
              ),
              const _ProfileMenuTile(
                icon: Icons.description_outlined,
                title: 'Terms of Service',
                subtitle: 'Coming soon',
                onTap: null,
              ),
            ],
          ),
          const SizedBox(height: 8),

          // ── Logout ────────────────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
            child: _LogoutButton(),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  void _showAbout(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Swiggy Clone', style: AppTextStyles.headlineSmall),
        content: const Text(
          'A full-stack food delivery demo built with Flutter, Next.js, and Prisma.\n\nv1.0.0',
          style: AppTextStyles.bodyMedium,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Close',
                style: TextStyle(color: AppColors.brandOrange)),
          ),
        ],
      ),
    );
  }
}

// ─── Header Card ──────────────────────────────────────────────────────────────

class _ProfileHeaderCard extends StatelessWidget {
  const _ProfileHeaderCard({required this.user});
  final AuthUser user;

  @override
  Widget build(BuildContext context) {
    final initials = _initials(user.name);

    return Container(
      color: AppColors.surface,
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Row(
            children: [
              // Avatar
              CircleAvatar(
                radius: 32,
                backgroundColor: AppColors.brandOrangeLight,
                child: Text(
                  initials,
                  style: const TextStyle(
                    color: AppColors.brandOrange,
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
              const SizedBox(width: 16),
              // Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(user.name, style: AppTextStyles.headlineSmall),
                    const SizedBox(height: 2),
                    Text(user.email, style: AppTextStyles.bodyMedium),
                    if (user.phone != null && user.phone!.isNotEmpty) ...[
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          const Icon(Icons.phone_outlined,
                              size: 13, color: AppColors.swiggyGray),
                          const SizedBox(width: 4),
                          Text(user.phone!, style: AppTextStyles.bodyMedium),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          // Edit profile placeholder
          OutlinedButton.icon(
            onPressed: () => _showEditComingSoon(context),
            icon: const Icon(Icons.edit_outlined,
                size: 15, color: AppColors.brandOrange),
            label: const Text('Edit Profile',
                style: TextStyle(
                    color: AppColors.brandOrange, fontWeight: FontWeight.w600)),
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: AppColors.brandOrange),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8)),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              minimumSize: Size.zero,
            ),
          ),
        ],
      ),
    );
  }

  String _initials(String name) {
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }

  void _showEditComingSoon(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Edit profile coming soon.'),
        behavior: SnackBarBehavior.floating,
        duration: Duration(seconds: 2),
      ),
    );
  }
}

// ─── Quick Actions ─────────────────────────────────────────────────────────────

class _QuickActionsSection extends ConsumerWidget {
  const _QuickActionsSection({required this.user});
  final AuthUser user;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      color: AppColors.surface,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Quick Actions', style: AppTextStyles.headlineSmall),
          const SizedBox(height: 16),
          Row(
            children: [
              _QuickActionCard(
                icon: Icons.receipt_long_outlined,
                label: 'My Orders',
                color: const Color(0xFFE8F5E9),
                iconColor: AppColors.vegGreen,
                onTap: () => context.goNamed(RouteNames.orders),
              ),
              const SizedBox(width: 12),
              _QuickActionCard(
                icon: Icons.location_on_outlined,
                label: 'Addresses',
                color: AppColors.brandOrangeLight,
                iconColor: AppColors.brandOrange,
                onTap: () => context.goNamed(RouteNames.addressManagement),
              ),
              const SizedBox(width: 12),
              _QuickActionCard(
                icon: Icons.local_offer_outlined,
                label: 'Coupons',
                color: const Color(0xFFE3F2FD),
                iconColor: const Color(0xFF1976D2),
                onTap: () => _showComingSoon(context),
              ),
              const SizedBox(width: 12),
              _QuickActionCard(
                icon: Icons.help_outline,
                label: 'Help',
                color: const Color(0xFFF3E5F5),
                iconColor: const Color(0xFF7B1FA2),
                onTap: () => _showComingSoon(context),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showComingSoon(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Coming soon.'),
        behavior: SnackBarBehavior.floating,
        duration: Duration(seconds: 2),
      ),
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  const _QuickActionCard({
    required this.icon,
    required this.label,
    required this.color,
    required this.iconColor,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final Color color;
  final Color iconColor;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            children: [
              Icon(icon, size: 24, color: iconColor),
              const SizedBox(height: 6),
              Text(
                label,
                style: AppTextStyles.labelSmall.copyWith(
                  color: AppColors.swiggyBlack,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Address Preview Section ──────────────────────────────────────────────────

class _AddressPreviewSection extends ConsumerWidget {
  const _AddressPreviewSection({required this.addressesAsync});
  final AsyncValue<List<Address>> addressesAsync;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      color: AppColors.surface,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Saved Addresses', style: AppTextStyles.headlineSmall),
              GestureDetector(
                onTap: () => context.goNamed(RouteNames.addressManagement),
                child: const Text('Manage →', style: AppTextStyles.brandLabel),
              ),
            ],
          ),
          const SizedBox(height: 12),
          addressesAsync.when(
            loading: () => const LinearProgressIndicator(
                color: AppColors.brandOrange, minHeight: 2),
            error: (_, __) => const Text(
              'Could not load addresses.',
              style: AppTextStyles.bodyMedium,
            ),
            data: (addresses) {
              if (addresses.isEmpty) {
                return GestureDetector(
                  onTap: () => context.goNamed(RouteNames.addressManagement),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      border: Border.all(
                          color: AppColors.brandOrange, style: BorderStyle.solid),
                      borderRadius: BorderRadius.circular(8),
                      color: AppColors.brandOrangeLight,
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.add_location_outlined,
                            size: 20, color: AppColors.brandOrange),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text('Add your first delivery address',
                              style: AppTextStyles.bodyLarge),
                        ),
                        Icon(Icons.arrow_forward_ios,
                            size: 14, color: AppColors.brandOrange),
                      ],
                    ),
                  ),
                );
              }

              final preview = addresses.take(2).toList();
              final extra = addresses.length - preview.length;

              return Column(
                children: [
                  ...preview.map((a) => _AddressPreviewCard(address: a)),
                  if (extra > 0)
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: GestureDetector(
                        onTap: () => context.goNamed(RouteNames.addressManagement),
                        child: Text(
                          '+$extra more address${extra > 1 ? 'es' : ''} — View all',
                          style: AppTextStyles.brandLabel,
                        ),
                      ),
                    ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

class _AddressPreviewCard extends StatelessWidget {
  const _AddressPreviewCard({required this.address});
  final Address address;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.divider),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              _labelIcon(address.label),
              size: 18,
              color: address.isDefault
                  ? AppColors.brandOrange
                  : AppColors.swiggyGray,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      address.label,
                      style: AppTextStyles.titleLarge,
                    ),
                    if (address.isDefault) ...[
                      const SizedBox(width: 6),
                      Container(
                        padding:
                            const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.brandOrangeLight,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          'DEFAULT',
                          style: AppTextStyles.labelSmall.copyWith(
                            color: AppColors.brandOrange,
                            fontWeight: FontWeight.w700,
                            fontSize: 9,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  address.fullAddress,
                  style: AppTextStyles.bodyMedium,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  IconData _labelIcon(String label) {
    final l = label.toLowerCase();
    if (l.contains('home')) return Icons.home_outlined;
    if (l.contains('work') || l.contains('office')) return Icons.business_outlined;
    return Icons.location_on_outlined;
  }
}

// ─── Settings Section ─────────────────────────────────────────────────────────

class _SettingsSection extends StatelessWidget {
  const _SettingsSection({required this.title, required this.tiles});
  final String title;
  final List<Widget> tiles;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.surface,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 8),
            child: Text(
              title.toUpperCase(),
              style: AppTextStyles.labelSmall.copyWith(
                letterSpacing: 0.8,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          ...tiles.map((tile) => Column(
                children: [
                  tile,
                  if (tile != tiles.last)
                    const Padding(
                      padding: EdgeInsets.only(left: 56),
                      child: Divider(height: 1, color: AppColors.divider),
                    ),
                ],
              )),
          const SizedBox(height: 4),
        ],
      ),
    );
  }
}

// ─── Profile Menu Tile ────────────────────────────────────────────────────────

class _ProfileMenuTile extends StatelessWidget {
  const _ProfileMenuTile({
    required this.icon,
    required this.title,
    this.subtitle,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String? subtitle;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, size: 18, color: AppColors.swiggyGray),
      ),
      title: Text(
        title,
        style: AppTextStyles.bodyLarge.copyWith(
          color: onTap != null ? AppColors.swiggyBlack : AppColors.swiggyLightGray,
        ),
      ),
      subtitle: subtitle != null
          ? Text(subtitle!, style: AppTextStyles.bodySmall)
          : null,
      trailing: onTap != null
          ? const Icon(Icons.arrow_forward_ios,
              size: 14, color: AppColors.swiggyLightGray)
          : null,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
      minLeadingWidth: 36,
    );
  }
}

// ─── Logout Button ─────────────────────────────────────────────────────────────

class _LogoutButton extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return OutlinedButton.icon(
      onPressed: () => _confirmLogout(context, ref),
      icon: const Icon(Icons.logout, size: 18, color: AppColors.error),
      label: const Text(
        'Logout',
        style: TextStyle(
            color: AppColors.error, fontWeight: FontWeight.w700, fontSize: 15),
      ),
      style: OutlinedButton.styleFrom(
        side: const BorderSide(color: AppColors.error),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        padding: const EdgeInsets.symmetric(vertical: 14),
        minimumSize: const Size(double.infinity, 0),
      ),
    );
  }

  Future<void> _confirmLogout(BuildContext context, WidgetRef ref) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Logout', style: AppTextStyles.headlineSmall),
        content: const Text(
          'Are you sure you want to logout?',
          style: AppTextStyles.bodyMedium,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel',
                style: TextStyle(color: AppColors.swiggyGray)),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Logout',
                style: TextStyle(
                    color: AppColors.error, fontWeight: FontWeight.w600)),
          ),
        ],
      ),
    );
    if (confirmed != true || !context.mounted) return;
    await ref.read(authProvider.notifier).logout();
    // GoRouter's redirect fires automatically when authProvider → null
  }
}

// ─── Loading Skeleton ──────────────────────────────────────────────────────────

class _LoadingProfile extends StatelessWidget {
  const _LoadingProfile();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: AppColors.surface,
        elevation: 0,
        title: const Text('Profile', style: AppTextStyles.headlineSmall),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(1),
          child: Divider(height: 1, color: AppColors.divider),
        ),
      ),
      body: ListView(
        children: [
          // Header shimmer
          Container(
            color: AppColors.surface,
            padding: const EdgeInsets.all(20),
            child: const Row(
              children: [
                _Shimmer(width: 64, height: 64, radius: 32),
                SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _Shimmer(width: 140, height: 16),
                      SizedBox(height: 8),
                      _Shimmer(width: 200, height: 13),
                      SizedBox(height: 6),
                      _Shimmer(width: 110, height: 13),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          // Quick actions shimmer
          Container(
            color: AppColors.surface,
            padding: const EdgeInsets.all(16),
            child: Row(
              children: List.generate(
                4,
                (_) => const Expanded(
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: 4),
                    child: _Shimmer(width: double.infinity, height: 70, radius: 12),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Container(
            color: AppColors.surface,
            padding: const EdgeInsets.all(16),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _Shimmer(width: 140, height: 16),
                SizedBox(height: 12),
                _Shimmer(width: double.infinity, height: 60, radius: 8),
                SizedBox(height: 8),
                _Shimmer(width: double.infinity, height: 60, radius: 8),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Shimmer extends StatelessWidget {
  const _Shimmer({required this.width, required this.height, this.radius = 6});
  final double width;
  final double height;
  final double radius;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: AppColors.divider,
        borderRadius: BorderRadius.circular(radius),
      ),
    );
  }
}
