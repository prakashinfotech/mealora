import '../../../../core/api/api_client.dart';
import '../../../../core/api/api_endpoints.dart';
import '../../../../core/constants/app_constants.dart';
import '../../models/order_model.dart';

class OrderRepository {
  const OrderRepository(this._client);
  final ApiClient _client;

  Future<PaginatedOrders> getOrders({int page = 1}) async {
    final data = await _client.get<Map<String, dynamic>>(
      ApiEndpoints.orders,
      queryParameters: {
        'page': page,
        'limit': AppConstants.ordersPageSize,
      },
    );
    return PaginatedOrders.fromJson(data);
  }

  Future<Order> getOrderById(String id) => _client.get(
        ApiEndpoints.orderById(id),
        fromJson: (data) => Order.fromJson(data as Map<String, dynamic>),
      );

  Future<Order> createOrder(Map<String, dynamic> body) => _client.post(
        ApiEndpoints.orders,
        data: body,
        fromJson: (data) => Order.fromJson(data as Map<String, dynamic>),
      );
}
