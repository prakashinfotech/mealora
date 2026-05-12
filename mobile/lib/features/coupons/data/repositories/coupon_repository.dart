import '../../../../core/api/api_client.dart';
import '../../../../core/api/api_endpoints.dart';
import '../../models/coupon_model.dart';

class CouponRepository {
  const CouponRepository(this._client);
  final ApiClient _client;

  Future<List<Coupon>> getCoupons() => _client.get(
        ApiEndpoints.coupons,
        fromJson: (data) => (data as List<dynamic>)
            .map((e) => Coupon.fromJson(e as Map<String, dynamic>))
            .toList(),
      );

  Future<double> validateCoupon(String code, double subtotal) async {
    final data = await _client.post<Map<String, dynamic>>(
      ApiEndpoints.validateCoupon,
      data: {'code': code, 'subtotal': subtotal},
    );
    return (data['discount'] as num).toDouble();
  }
}
