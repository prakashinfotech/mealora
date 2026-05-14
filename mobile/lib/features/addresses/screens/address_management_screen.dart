import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../models/address_model.dart';
import '../providers/address_provider.dart';

class AddressManagementScreen extends ConsumerWidget {
  const AddressManagementScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final addressesAsync = ref.watch(addressesProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        title: const Text('My Addresses', style: AppTextStyles.headlineSmall),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.swiggyBlack),
          onPressed: () => Navigator.of(context).pop(),
        ),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(1),
          child: Divider(height: 1, color: AppColors.divider),
        ),
      ),
      body: addressesAsync.when(
        loading: () =>
            const Center(child: CircularProgressIndicator(color: AppColors.brandOrange)),
        error: (e, _) => _ErrorRetry(
          message: e.toString().replaceAll('Exception: ', ''),
          onRetry: () => ref.invalidate(addressesProvider),
        ),
        data: (addresses) => addresses.isEmpty
            ? _EmptyAddresses(onAdd: () => _showAddSheet(context, ref))
            : ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: addresses.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (_, i) => _AddressCard(
                  address: addresses[i],
                  onSetDefault: addresses[i].isDefault
                      ? null
                      : () => _setDefault(context, ref, addresses[i].id),
                  onDelete: () => _confirmDelete(context, ref, addresses[i]),
                ),
              ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddSheet(context, ref),
        backgroundColor: AppColors.brandOrange,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text(
          'Add Address',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }

  Future<void> _setDefault(BuildContext context, WidgetRef ref, String id) async {
    try {
      await ref.read(addressesProvider.notifier).setDefault(id);
    } catch (e) {
      if (context.mounted) {
        _showSnack(context, e.toString().replaceAll('Exception: ', ''), isError: true);
      }
    }
  }

  Future<void> _confirmDelete(
      BuildContext context, WidgetRef ref, Address address) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Address', style: AppTextStyles.headlineSmall),
        content: Text(
          'Remove "${address.label}"?\n${address.fullAddress}',
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
            child: const Text('Delete',
                style: TextStyle(color: AppColors.error, fontWeight: FontWeight.w600)),
          ),
        ],
      ),
    );
    if (confirmed != true || !context.mounted) return;
    try {
      await ref.read(addressesProvider.notifier).deleteAddress(address.id);
      if (context.mounted) _showSnack(context, 'Address deleted.');
    } catch (e) {
      if (context.mounted) {
        _showSnack(context, e.toString().replaceAll('Exception: ', ''), isError: true);
      }
    }
  }

  void _showAddSheet(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (_) => _AddAddressSheet(ref: ref),
    );
  }

  void _showSnack(BuildContext context, String msg, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(msg),
      backgroundColor: isError ? AppColors.error : AppColors.swiggyBlack,
      behavior: SnackBarBehavior.floating,
      duration: const Duration(seconds: 3),
    ));
  }
}

// ─── Address Card ──────────────────────────────────────────────────────────────

class _AddressCard extends StatelessWidget {
  const _AddressCard({
    required this.address,
    required this.onSetDefault,
    required this.onDelete,
  });

  final Address address;
  final VoidCallback? onSetDefault;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: address.isDefault ? AppColors.brandOrange : AppColors.divider,
          width: address.isDefault ? 1.5 : 1,
        ),
        boxShadow: const [
          BoxShadow(color: Color(0x08000000), blurRadius: 4, offset: Offset(0, 2)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: address.isDefault
                      ? AppColors.brandOrangeLight
                      : AppColors.background,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      _labelIcon(address.label),
                      size: 14,
                      color: address.isDefault
                          ? AppColors.brandOrange
                          : AppColors.swiggyGray,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      address.label,
                      style: AppTextStyles.bodySmall.copyWith(
                        fontWeight: FontWeight.w700,
                        color: address.isDefault
                            ? AppColors.brandOrange
                            : AppColors.swiggyBlack,
                      ),
                    ),
                  ],
                ),
              ),
              if (address.isDefault) ...[
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.vegGreen.withAlpha(20),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    'DEFAULT',
                    style: AppTextStyles.labelSmall.copyWith(
                      color: AppColors.vegGreen,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
              const Spacer(),
              IconButton(
                icon: const Icon(Icons.delete_outline,
                    size: 20, color: AppColors.swiggyGray),
                onPressed: onDelete,
                tooltip: 'Delete',
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(address.line1, style: AppTextStyles.bodyLarge),
          if (address.line2 != null && address.line2!.isNotEmpty)
            Text(address.line2!, style: AppTextStyles.bodyMedium),
          Text(
            '${address.city}, ${address.state} – ${address.pincode}',
            style: AppTextStyles.bodyMedium,
          ),
          if (onSetDefault != null) ...[
            const SizedBox(height: 10),
            GestureDetector(
              onTap: onSetDefault,
              child: Text(
                'Set as default',
                style: AppTextStyles.brandLabel.copyWith(fontSize: 13),
              ),
            ),
          ],
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

// ─── Empty State ───────────────────────────────────────────────────────────────

class _EmptyAddresses extends StatelessWidget {
  const _EmptyAddresses({required this.onAdd});
  final VoidCallback onAdd;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.location_off_outlined,
                size: 64, color: AppColors.swiggyLightGray),
            const SizedBox(height: 16),
            const Text('No saved addresses',
                style: AppTextStyles.headlineSmall),
            const SizedBox(height: 8),
            const Text(
              'Add a delivery address to get your food delivered.',
              style: AppTextStyles.bodyMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: onAdd,
              icon: const Icon(Icons.add, color: Colors.white),
              label: const Text('Add Address',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.brandOrange,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Error / Retry ─────────────────────────────────────────────────────────────

class _ErrorRetry extends StatelessWidget {
  const _ErrorRetry({required this.message, required this.onRetry});
  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.wifi_off_outlined,
                size: 48, color: AppColors.swiggyLightGray),
            const SizedBox(height: 16),
            const Text('Could not load addresses',
                style: AppTextStyles.headlineSmall),
            const SizedBox(height: 6),
            Text(message,
                style: AppTextStyles.bodyMedium,
                textAlign: TextAlign.center),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: onRetry,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.brandOrange,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8)),
              ),
              child: const Text('Retry',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Add Address Bottom Sheet ──────────────────────────────────────────────────

class _AddAddressSheet extends StatefulWidget {
  const _AddAddressSheet({required this.ref});
  final WidgetRef ref;

  @override
  State<_AddAddressSheet> createState() => _AddAddressSheetState();
}

class _AddAddressSheetState extends State<_AddAddressSheet> {
  final _labelCtrl = TextEditingController();
  final _line1Ctrl = TextEditingController();
  final _line2Ctrl = TextEditingController();
  final _cityCtrl = TextEditingController();
  final _stateCtrl = TextEditingController();
  final _pincodeCtrl = TextEditingController();
  bool _saving = false;
  String? _error;

  @override
  void dispose() {
    _labelCtrl.dispose();
    _line1Ctrl.dispose();
    _line2Ctrl.dispose();
    _cityCtrl.dispose();
    _stateCtrl.dispose();
    _pincodeCtrl.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (_labelCtrl.text.isEmpty ||
        _line1Ctrl.text.isEmpty ||
        _cityCtrl.text.isEmpty ||
        _stateCtrl.text.isEmpty ||
        _pincodeCtrl.text.isEmpty) {
      setState(() => _error = 'Please fill all required fields.');
      return;
    }
    setState(() {
      _saving = true;
      _error = null;
    });
    try {
      await widget.ref.read(addressesProvider.notifier).addAddress({
        'label': _labelCtrl.text.trim(),
        'line1': _line1Ctrl.text.trim(),
        if (_line2Ctrl.text.trim().isNotEmpty) 'line2': _line2Ctrl.text.trim(),
        'city': _cityCtrl.text.trim(),
        'state': _stateCtrl.text.trim(),
        'pincode': _pincodeCtrl.text.trim(),
      });
      if (mounted) Navigator.of(context).pop();
    } catch (e) {
      setState(() => _error = e.toString().replaceAll('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bottom = MediaQuery.viewInsetsOf(context).bottom;
    return Padding(
      padding: EdgeInsets.fromLTRB(16, 20, 16, 20 + bottom),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Text('Add New Address', style: AppTextStyles.headlineSmall),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.close, color: AppColors.swiggyGray),
                  onPressed: () => Navigator.of(context).pop(),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _field(_labelCtrl, 'Label (e.g. Home, Work)', required: true),
            _field(_line1Ctrl, 'Address line 1', required: true),
            _field(_line2Ctrl, 'Address line 2 (optional)'),
            Row(children: [
              Expanded(child: _field(_cityCtrl, 'City', required: true)),
              const SizedBox(width: 10),
              Expanded(child: _field(_stateCtrl, 'State', required: true)),
            ]),
            _field(_pincodeCtrl, 'Pincode',
                required: true, keyboard: TextInputType.number),
            if (_error != null) ...[
              const SizedBox(height: 4),
              Text(_error!,
                  style: AppTextStyles.bodySmall.copyWith(color: AppColors.error)),
            ],
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _saving ? null : _save,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.brandOrange,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8)),
                ),
                child: _saving
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                            strokeWidth: 2, color: Colors.white),
                      )
                    : const Text('Save Address',
                        style: TextStyle(
                            color: Colors.white, fontWeight: FontWeight.w700)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _field(
    TextEditingController ctrl,
    String hint, {
    bool required = false,
    TextInputType? keyboard,
  }) =>
      Padding(
        padding: const EdgeInsets.only(bottom: 10),
        child: TextField(
          controller: ctrl,
          keyboardType: keyboard,
          decoration: InputDecoration(
            hintText: required ? hint : hint,
            hintStyle: AppTextStyles.bodyMedium,
            filled: true,
            fillColor: AppColors.background,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.divider),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.divider),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.brandOrange, width: 1.5),
            ),
          ),
        ),
      );
}
