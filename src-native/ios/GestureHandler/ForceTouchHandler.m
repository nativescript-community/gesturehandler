#import "ForceTouchHandler.h"

#import <UIKit/UIGestureRecognizerSubclass.h>


@interface ForceTouchGestureRecognizer : UIGestureRecognizer

@property (nonatomic) CGFloat maxForce;
@property (nonatomic) CGFloat minForce;
@property (nonatomic) CGFloat force;
@property (nonatomic) BOOL feedbackOnActivation;

- (id)initWithGestureHandler:(GestureHandler*)gestureHandler;

@end

@implementation ForceTouchGestureRecognizer {
  __weak GestureHandler *_gestureHandler;
  UITouch *_firstTouch;
}


- (id)initWithGestureHandler:(GestureHandler*)gestureHandler
{
  if ((self = [super initWithTarget:gestureHandler action:@selector(handleGesture:)])) {
    _gestureHandler = gestureHandler;
    _force = 0;
    _minForce = 0.2;
    _maxForce = NAN;
    _feedbackOnActivation = NO;
  }
  return self;
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  if (_firstTouch) {
    // ignore rest of fingers
    return;
  }
  [super touchesBegan:touches withEvent:event];
  _firstTouch = [touches anyObject];
  [self handleForceWithTouches:touches];
  self.state = UIGestureRecognizerStatePossible;
}

- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  if (![touches containsObject:_firstTouch]) {
    // Considered only the very first touch
    return;
  }
  [super touchesMoved:touches withEvent:event];
  
  [self handleForceWithTouches:touches];
  
  if ([self shouldFail]) {
    self.state = UIGestureRecognizerStateFailed;
    return;
  }
  
  if (self.state == UIGestureRecognizerStatePossible && [self shouldActivate]) {
    [self performFeedbackIfRequired];
    self.state = UIGestureRecognizerStateBegan;
  }
}

- (BOOL)shouldActivate {
  return (_force >= _minForce);
}

- (BOOL)shouldFail {
  return TEST_MAX_IF_NOT_NAN(_force, _maxForce);
}

- (void)performFeedbackIfRequired
{
#if !TARGET_OS_TV
  if (_feedbackOnActivation) {
    if (@available(iOS 10.0, *)) {
      [[[UIImpactFeedbackGenerator alloc] initWithStyle:(UIImpactFeedbackStyleMedium)] impactOccurred];
    }
  }
#endif
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  if (![touches containsObject:_firstTouch]) {
    // Considered only the very first touch
    return;
  }
  [super touchesEnded:touches withEvent:event];
  if (self.state == UIGestureRecognizerStateBegan || self.state == UIGestureRecognizerStateChanged) {
    self.state = UIGestureRecognizerStateEnded;
  } else {
    self.state = UIGestureRecognizerStateFailed;
  }
}

- (void)handleForceWithTouches:(NSSet<UITouch *> *)touches {
  _force = _firstTouch.force / _firstTouch.maximumPossibleForce;
}

- (void)reset {
  [super reset];
  _force = 0;
  _firstTouch = NULL;
}

@end

@implementation ForceTouchHandler

- (instancetype)initWithTag:(NSNumber *)tag
{
  if ((self = [super initWithTag:tag])) {
    _recognizer = [[ForceTouchGestureRecognizer alloc] initWithGestureHandler:self];
  }
  return self;
}

- (void)configure:(NSDictionary *)config
{
  [super configure:config];
  ForceTouchGestureRecognizer *recognizer = (ForceTouchGestureRecognizer *)_recognizer;

  APPLY_FLOAT_PROP(maxForce);
  APPLY_FLOAT_PROP(minForce);

  id prop = config[@"feedbackOnActivation"];
  if (prop != nil) {
    recognizer.feedbackOnActivation = [prop boolValue];
  }
}

//
//- (void) setMaxForce:(NSNumber *) value {
//  ((ForceTouchGestureRecognizer *)_recognizer).maxForce = [value integerValue];
//}
//
//- (NSNumber *) maxForce {
//  return [NSNumber numberWithInteger: ((ForceTouchGestureRecognizer *)_recognizer).maxForce];
//}
//
//- (void) setMinForce:(NSNumber *) value {
//  ((ForceTouchGestureRecognizer *)_recognizer).minForce = [value integerValue];
//}
//
//- (NSNumber *) minForce {
//  return [NSNumber numberWithInteger: ((ForceTouchGestureRecognizer *)_recognizer).minForce];
//}
//
//
//- (void) setFeedbackOnActivation:(NSNumber *) value {
//  ((ForceTouchGestureRecognizer *)_recognizer).feedbackOnActivation = [value boolValue];
//}
//
//- (NSNumber *) feedbackOnActivation {
//  return [NSNumber numberWithBool: ((ForceTouchGestureRecognizer *)_recognizer).feedbackOnActivation];
//}

- (GestureHandlerEventExtraData *)eventExtraData:(ForceTouchGestureRecognizer *)recognizer
{
  return [GestureHandlerEventExtraData
          forForce: recognizer.force
          forPosition:[recognizer locationInView:recognizer.view]
          withAbsolutePosition:[recognizer locationInView:recognizer.view.window]
          withNumberOfTouches:recognizer.numberOfTouches];
}

@end

