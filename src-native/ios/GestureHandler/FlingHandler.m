#import "FlingHandler.h"

@implementation FlingGestureHandler

- (instancetype)initWithTag:(NSNumber *)tag
{
    if ((self = [super initWithTag:tag])) {
        _recognizer = [[UISwipeGestureRecognizer alloc] initWithTarget:self action:@selector(handleGesture:)];
        
    }
    return self;
}

- (void)configure:(NSDictionary *)config
{
  [super configure:config];
  UISwipeGestureRecognizer *recognizer = (UISwipeGestureRecognizer *)_recognizer;
  
  id prop = config[@"direction"];
  if (prop != nil) {
    recognizer.direction = [prop integerValue];
  }
  
#if !TARGET_OS_TV
  prop = config[@"numberOfPointers"];
  if (prop != nil) {
    recognizer.numberOfTouchesRequired = [prop integerValue];
  }
#endif
}

//- (void) setDirection:(NSNumber *) value {
//  ((UISwipeGestureRecognizer *)_recognizer).direction = [value integerValue];
//}
//
//- (NSNumber *) direction {
//    return [NSNumber numberWithInteger: ((UISwipeGestureRecognizer *)_recognizer).direction];
//}
//
//- (void) setNumberOfTouchesRequired:(NSNumber *) value {
//  ((UISwipeGestureRecognizer *)_recognizer).numberOfTouchesRequired = [value integerValue];
//}
//
//- (NSNumber *) numberOfTouchesRequired {
//  return [NSNumber numberWithInteger: ((UISwipeGestureRecognizer *)_recognizer).numberOfTouchesRequired];
//}


@end

