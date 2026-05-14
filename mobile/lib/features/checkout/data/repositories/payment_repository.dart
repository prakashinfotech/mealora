import '../../../../core/api/api_client.dart';
import '../../../../core/api/api_endpoints.dart';
import '../../../orders/models/order_model.dart';
import '../models/payment_models.dart';

class PaymentRepository {
  const PaymentRepository(this._client);
  final ApiClient _client;

  /// Step 1 of ONLINE flow: create a Razorpay order on the backend.
  /// Only sends menuItemId + quantity — backend re-validates prices from DB.
  Future<RazorpayOrderData> createPaymentOrder({
    required String restaurantId,
    required List<Map<String, dynamic>> items,
    String? couponCode,
  }) =>
      _client.post<RazorpayOrderData>(
        ApiEndpoints.createPaymentOrder,
        data: {
          'restaurantId': restaurantId,
          'items': items,
          if (couponCode != null) 'couponCode': couponCode,
        },
        fromJson: (data) =>
            RazorpayOrderData.fromJson(data as Map<String, dynamic>),
      );

  /// Step 3 of ONLINE flow: verify payment signature, then create the order.
  /// Items and amounts come from the server-validated RazorpayOrderData —
  /// never trust values the Flutter client computed itself.
  Future<Order> verifyPayment({
    required String razorpayOrderId,
    required String razorpayPaymentId,
    required String razorpaySignature,
    required String restaurantId,
    required String addressId,
    required List<Map<String, dynamic>> items,
    required double subtotal,
    required double deliveryFee,
    required double taxes,
    required double discount,
    required double total,
    String? couponCode,
  }) =>
      _client.post<Order>(
        ApiEndpoints.verifyPayment,
        data: {
          'razorpayOrderId': razorpayOrderId,
          'razorpayPaymentId': razorpayPaymentId,
          'razorpaySignature': razorpaySignature,
          'restaurantId': restaurantId,
          'addressId': addressId,
          'items': items,
          'subtotal': subtotal,
          'deliveryFee': deliveryFee,
          'taxes': taxes,
          'discount': discount,
          'total': total,
          if (couponCode != null) 'couponCode': couponCode,
        },
        fromJson: (data) => Order.fromJson(data as Map<String, dynamic>),
      );
}
