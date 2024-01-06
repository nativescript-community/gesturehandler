#import "FlingHandler.h"


@interface FlingGestureHandler(){
  @protected UISwipeGestureRecognizer *_rightrecognizer;
  @protected UISwipeGestureRecognizer *_toprecognizer;
  @protected UISwipeGestureRecognizer *_bottomrecognizer;

}
  @property (nonatomic) UISwipeGestureRecognizerDirection direction;
@end
@implementation FlingGestureHandler

- (instancetype)initWithTag:(NSNumber *)tag
{
    if ((self = [super initWithTag:tag])) {
        self.direction = UISwipeGestureRecognizerDirectionLeft | UISwipeGestureRecognizerDirectionRight |   UISwipeGestureRecognizerDirectionUp | UISwipeGestureRecognizerDirectionDown;
        _recognizer = [[UISwipeGestureRecognizer alloc] initWithTarget:self action:@selector(handleGesture:)];
        [(UISwipeGestureRecognizer*)_recognizer setDirection:UISwipeGestureRecognizerDirectionLeft];
        _rightrecognizer = [[UISwipeGestureRecognizer alloc] initWithTarget:self action:@selector(handleGesture:)];
        [(UISwipeGestureRecognizer*)_rightrecognizer setDirection:UISwipeGestureRecognizerDirectionRight];
        _toprecognizer = [[UISwipeGestureRecognizer alloc] initWithTarget:self action:@selector(handleGesture:)];
        [(UISwipeGestureRecognizer*)_toprecognizer setDirection: UISwipeGestureRecognizerDirectionUp];
        _bottomrecognizer = [[UISwipeGestureRecognizer alloc] initWithTarget:self action:@selector(handleGesture:)];
        [(UISwipeGestureRecognizer*)_bottomrecognizer setDirection:UISwipeGestureRecognizerDirectionDown];
    }
    return self;
}

- (void)configure:(NSDictionary *)config
{
 [super configure:config];
  UISwipeGestureRecognizer *recognizer = (UISwipeGestureRecognizer *)_recognizer;
  
  id prop = config[@"direction"];
  if (prop != nil) {
    self.direction = [prop integerValue];
    if ((self.direction & UISwipeGestureRecognizerDirectionLeft) == 0)  {
      _recognizer.enabled = NO;
    }
    if ((self.direction & UISwipeGestureRecognizerDirectionRight) == 0)  {
      _rightrecognizer.enabled = NO;
    }
    if ((self.direction & UISwipeGestureRecognizerDirectionUp) == 0)  {
      _toprecognizer.enabled = NO;
    }
    if ((self.direction & UISwipeGestureRecognizerDirectionDown) == 0)  {
      _bottomrecognizer.enabled = NO;
    }
  }
  
#if !TARGET_OS_TV
  prop = config[@"numberOfPointers"];
  if (prop != nil) {
    NSInteger numberOfTouchesRequired = [prop integerValue];
    recognizer.numberOfTouchesRequired = numberOfTouchesRequired;
    _rightrecognizer.numberOfTouchesRequired = numberOfTouchesRequired;
    _toprecognizer.numberOfTouchesRequired = numberOfTouchesRequired;
    _bottomrecognizer.numberOfTouchesRequired = numberOfTouchesRequired;
  }
#endif
}
- (void)setEnabled:(BOOL)enabled
{
    [super setEnabled:enabled];
    self.recognizer.enabled = enabled;
    _rightrecognizer.enabled = enabled && ((self.direction & UISwipeGestureRecognizerDirectionRight) != 0);
    _toprecognizer.enabled = enabled && ((self.direction & UISwipeGestureRecognizerDirectionUp) != 0);
    _bottomrecognizer.enabled = enabled && ((self.direction & UISwipeGestureRecognizerDirectionDown) != 0);
}

- (void)bindToView:(UIView *)view
{
    [super bindToView:view];
    _rightrecognizer.delegate = self;
    [view addGestureRecognizer:_rightrecognizer];
    _toprecognizer.delegate = self;
    [view addGestureRecognizer:_toprecognizer];
    _bottomrecognizer.delegate = self;
    [view addGestureRecognizer:_bottomrecognizer];
}
- (void)unbindFromView
{
    [super unbindFromView];
    [_rightrecognizer.view removeGestureRecognizer:_rightrecognizer];
    _rightrecognizer.delegate = nil;
    [_toprecognizer.view removeGestureRecognizer:_toprecognizer];
    _toprecognizer.delegate = nil;
    [_bottomrecognizer.view removeGestureRecognizer:_bottomrecognizer];
    _bottomrecognizer.delegate = nil;
}
- (void) setDirection:(NSInteger) value {
  ((UISwipeGestureRecognizer *)_recognizer).direction = value;
}
//
//- (NSNumber *) direction {
//    return [NSNumber numberWithInteger: ((UISwipeGestureRecognizer *)_recognizer).direction];
//}
//
- (void) setNumberOfTouchesRequired:(NSInteger) value {
  ((UISwipeGestureRecognizer *)_recognizer).numberOfTouchesRequired = value;
}
//
//- (NSNumber *) numberOfTouchesRequired {
//  return [NSNumber numberWithInteger: ((UISwipeGestureRecognizer *)_recognizer).numberOfTouchesRequired];
//}

-(NSString*)directionToString:(UISwipeGestureRecognizerDirection) direction {
  if (direction == UISwipeGestureRecognizerDirectionDown) {
    return @"down";
  }
  if (direction == UISwipeGestureRecognizerDirectionUp) {
    return @"up";
  }
  if (direction == UISwipeGestureRecognizerDirectionLeft) {
    return @"left";
  }
  if (direction == UISwipeGestureRecognizerDirectionRight) {
    return @"right";
  }
  return NULL;
}

- (NSMutableDictionary *)eventExtraData:(UISwipeGestureRecognizer *)recognizer
{
  NSMutableDictionary* result = [super eventExtraData:recognizer];
  [result setObject:[self directionToString:recognizer.direction] forKey:@"direction"];
  return result;
}
@end

