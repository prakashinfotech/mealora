import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../features/auth/providers/auth_provider.dart';
import '../data/repositories/address_repository.dart';
import '../models/address_model.dart';

final addressRepositoryProvider = Provider<AddressRepository>((ref) {
  return AddressRepository(ref.watch(apiClientProvider));
});

final addressesProvider = FutureProvider<List<Address>>((ref) {
  return ref.read(addressRepositoryProvider).getAddresses();
});
