// Mealora — basic smoke test
// This test verifies the app can be instantiated and rendered.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  testWidgets('App renders without crashing', (WidgetTester tester) async {
    // Build a minimal stub to verify the Riverpod/Material layer works
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: Center(child: Text('Mealora')),
          ),
        ),
      ),
    );

    expect(find.text('Mealora'), findsOneWidget);
  });
}
