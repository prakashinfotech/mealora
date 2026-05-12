import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../features/auth/providers/auth_provider.dart';
import '../data/repositories/coupon_repository.dart';
import '../models/coupon_model.dart';

final couponRepositoryProvider = Provider<CouponRepository>((ref) {
  return CouponRepository(ref.watch(apiClientProvider));
});

final couponsProvider = FutureProvider.autoDispose<List<Coupon>>((ref) {
  return ref.read(couponRepositoryProvider).getCoupons();
});
