In React Native, markers or icons on a map (commonly using react-native-maps) often appear "cut off" or clipped due to how Android renders markers as bitmaps or because of fixed container sizes. 
Common Causes & Solutions
Android Bitmap Clipping: On Android, custom markers are often rendered as static bitmaps. If the icon exceeds the initial bounding box, it gets clipped.
Solution: Use a parent <View> with explicit padding or margin around the icon to ensure the "hitbox" is large enough to contain the entire graphic.
Missing Width/Height on Custom Markers: If using a custom component inside a <Marker>, the map might not correctly calculate the size.
Solution: Explicitly define the width and height in the style of the custom marker's root <View>.
Anchor Point Issues: The icon might be correctly rendered but positioned such that part of it is "off" the designated coordinate area.
Solution: Adjust the anchor prop (e.g., anchor={{ x: 0.5, y: 0.5 }}) to center the icon on the coordinate.
Image Scaling (Android): When scaling marker images with libraries like react-native-reanimated, they may clip on Android.
Solution: For complex animations or scaling, use the patch-package tool to apply community fixes to the react-native-maps library that address Android clipping.
Icon Asset Padding: Sometimes the source image itself is the issue.
Solution: Ensure the source .png or SVG has enough transparent "safe space" around the edges. For app icons specifically, Android recommends leaving the outer 1/6th of the image transparent. 
GitHub
GitHub
 +9
Quick Debugging Steps
Add Background Color: Set a temporary backgroundColor: 'red' on your marker's container to see if the container itself is smaller than the icon.
Toggle tracksViewChanges: Setting tracksViewChanges={false} after the initial render can sometimes resolve rendering artifacts on Android.
Use icon prop vs. Children: Sometimes using the icon={require('./path')} prop instead of passing an <Image> as a child is more stable on Google Maps. 
Stack Overflow
Stack Overflow
 +4