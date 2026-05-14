import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../features/auth/providers/auth_provider.dart';
import '../data/repositories/address_repository.dart';
import '../models/address_model.dart';

final addressRepositoryProvider = Provider<AddressRepository>((ref) {
  return AddressRepository(ref.watch(apiClientProvider));
});

// ─── Notifier ─────────────────────────────────────────────────────────────────

class AddressNotifier extends AsyncNotifier<List<Address>> {
  @override
  Future<List<Address>> build() =>
      ref.read(addressRepositoryProvider).getAddresses();

  Future<Address> addAddress(Map<String, dynamic> body) async {
    final repo = ref.read(addressRepositoryProvider);
    final newAddr = await repo.createAddress(body);
    final current = state.valueOrNull ?? [];
    state = AsyncData([...current, newAddr]);
    return newAddr;
  }

  Future<void> setDefault(String id) async {
    await ref.read(addressRepositoryProvider).setDefault(id);
    // Re-fetch so isDefault flags are accurate from the server
    state = AsyncData(await ref.read(addressRepositoryProvider).getAddresses());
  }

  Future<void> deleteAddress(String id) async {
    await ref.read(addressRepositoryProvider).deleteAddress(id);
    final updated =
        state.valueOrNull?.where((a) => a.id != id).toList() ?? [];
    state = AsyncData(updated);
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
//
// Kept as `addressesProvider` so the checkout screen (which uses
// ref.watch(addressesProvider) and ref.invalidate(addressesProvider))
// requires no changes.

final addressesProvider =
    AsyncNotifierProvider<AddressNotifier, List<Address>>(AddressNotifier.new);
