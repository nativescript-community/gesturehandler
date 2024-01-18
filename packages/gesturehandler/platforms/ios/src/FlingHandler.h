#import "GestureHandler.h"

@interface FlingGestureHandler : GestureHandler
- (void) setDirection:(NSInteger) value;
- (void) setNumberOfTouchesRequired:(NSInteger) value;
@end
