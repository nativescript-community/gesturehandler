#import "GestureHandler.h"

@interface ForceTouchHandler : GestureHandler
- (void) setMaxForce:(NSInteger) value;
- (void) setMinForce:(NSInteger) value;
- (void) setFeedbackOnActivation:(Boolean) value;
@end
