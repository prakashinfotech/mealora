import '../../../../core/api/api_client.dart';
import '../../../../core/api/api_endpoints.dart';
import '../models/restaurant_model.dart';

class RestaurantRepository {
  RestaurantRepository(this._client);

  final ApiClient _client;

  Future<RestaurantsResponse> getRestaurants({
    int page = 1,
    int limit = 10,
    String? city,
    String? search,
    String? cuisineType,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
      if (city != null && city.isNotEmpty) 'city': city,
      if (search != null && search.isNotEmpty) 'search': search,
      if (cuisineType != null && cuisineType.isNotEmpty) 'cuisine': cuisineType,
    };

    final data = await _client.get<Map<String, dynamic>>(
      ApiEndpoints.restaurants,
      queryParameters: queryParams,
    );
    return RestaurantsResponse.fromJson(data);
  }

  Future<RestaurantDetail> getRestaurantDetail(String id) async {
    final data = await _client.get<Map<String, dynamic>>(
      '${ApiEndpoints.restaurants}/$id',
    );
    return RestaurantDetail.fromJson(data);
  }
}
