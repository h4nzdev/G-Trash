Looking at the screenshot and the code, I can now pinpoint the exact cause. The bug on real devices (Expo Go) vs emulators comes down to two compounding issues:
Root Cause 1: Animated.View inside a Marker
React Native Maps renders Marker children into a native view layer. On real iOS/Android devices, Animated.View triggers a different compositing path that clips its own content unpredictably. Emulators are more lenient with this.
Root Cause 2: No explicit dimensions + padding instead of alignItems/justifyContent
Animated.View sizes itself dynamically from padding, which native map markers can't reliably measure on real hardware.
The fix — replace Animated.View with a plain View and give it explicit dimensions:
tsx{/* Truck Marker */}
{showTruck && (
  <Marker coordinate={truckData.location} anchor={{ x: 0.5, y: 0.5 }}>
    <View style={styles.truckMarker}>
      <IconSymbol name="truck.fill" size={24} color="#FFFFFF" />
    </View>
  </Marker>
)}
And update the style:
tstruckMarker: {
  backgroundColor: GTrashColors.truck,
  width: 48,
  height: 48,
  borderRadius: 24,          // exactly half → clean circle
  alignItems: "center",      // replaces padding
  justifyContent: "center",  // replaces padding
  borderWidth: 3,
  borderColor: "#FFFFFF",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
  // ❌ removed: padding: 10
  // ❌ removed: Animated.View wrapper (no animation was actually being used)
},
The Animated.View wasn't animating anything on the truck marker anyway — it had no Animated.Value attached to its style — so switching to View loses nothing while fixing the native clipping bug on real devices.