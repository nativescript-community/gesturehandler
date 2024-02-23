//
//  PanHandler.m
//  GestureHandler
//
//  Created by Krzysztof Magiera on 12/10/2017.
//  Copyright © 2017 Software Mansion. All rights reserved.
//

#import "PanHandler.h"

#import <UIKit/UIGestureRecognizerSubclass.h>

@interface BetterPanGestureRecognizer : UIPanGestureRecognizer

@property (nonatomic) CGFloat minDistSq;
@property (nonatomic) CGFloat minVelocityX;
@property (nonatomic) CGFloat minVelocityY;
@property (nonatomic) CGFloat minVelocitySq;
@property (nonatomic) CGFloat activeOffsetXStart;
@property (nonatomic) CGFloat activeOffsetXEnd;
@property (nonatomic) CGFloat failOffsetXStart;
@property (nonatomic) CGFloat failOffsetXEnd;
@property (nonatomic) CGFloat activeOffsetYStart;
@property (nonatomic) CGFloat activeOffsetYEnd;
@property (nonatomic) CGFloat failOffsetYStart;
@property (nonatomic) CGFloat failOffsetYEnd;


- (id)initWithGestureHandler:(GestureHandler*)gestureHandler;

@end


@implementation BetterPanGestureRecognizer {
  __weak GestureHandler *_gestureHandler;
  NSUInteger _realMinimumNumberOfTouches;
  BOOL _hasCustomActivationCriteria;
}

- (id)initWithGestureHandler:(GestureHandler*)gestureHandler
{
  if ((self = [super initWithTarget:gestureHandler action:@selector(handleGesture:)])) {
    _gestureHandler = gestureHandler;
    _minDistSq = NAN;
    _minVelocityX = NAN;
    _minVelocityY = NAN;
    _minVelocitySq = NAN;
    _activeOffsetXStart = NAN;
    _activeOffsetXEnd = NAN;
    _failOffsetXStart = NAN;
    _failOffsetXEnd = NAN;
    _activeOffsetYStart = NAN;
    _activeOffsetYEnd = NAN;
    _failOffsetYStart = NAN;
    _failOffsetYEnd = NAN;
    _hasCustomActivationCriteria = NO;
#if !TARGET_OS_TV
    _realMinimumNumberOfTouches = self.minimumNumberOfTouches;
#endif
  }
  return self;
}

- (void)setMinimumNumberOfTouches:(NSUInteger)minimumNumberOfTouches
{
  _realMinimumNumberOfTouches = minimumNumberOfTouches;
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
#if !TARGET_OS_TV
  if (_hasCustomActivationCriteria) {
    // We use "minimumNumberOfTouches" property to prevent pan handler from recognizing
    // the gesture too early before we are sure that all criteria (e.g. minimum distance
    // etc. are met)
    super.minimumNumberOfTouches = 20;
  } else {
    super.minimumNumberOfTouches = _realMinimumNumberOfTouches;
  }
#endif
  [super touchesBegan:touches withEvent:event];

  // we check for active before UIGestureRecognizerStateBegan because otherwise
  // we dont behave as Android and activate on first touch
  if (![_gestureHandler.delegate gestureHandler:_gestureHandler shouldActivateForEvent:[_gestureHandler eventExtraData:self]]) {
    self.state = UIGestureRecognizerStateFailed;
  }
}

- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  [super touchesMoved:touches withEvent:event];
  if (self.state == UIGestureRecognizerStatePossible && [self shouldFailUnderCustomCriteria]) {
    self.state = UIGestureRecognizerStateFailed;
    [self reset];
    return;
  }
  if ((self.state == UIGestureRecognizerStatePossible || self.state == UIGestureRecognizerStateChanged)) {
    if (_gestureHandler.shouldCancelWhenOutside && ![_gestureHandler containsPointInView]) {
      // If the previous recognizer state is UIGestureRecognizerStateChanged
      // then UIGestureRecognizer's sate machine will only transition to
      // UIGestureRecognizerStateCancelled even if you set the state to
      // UIGestureRecognizerStateFailed here. Making the behavior explicit.
      self.state = (self.state == UIGestureRecognizerStatePossible)
      ? UIGestureRecognizerStateFailed
      : UIGestureRecognizerStateCancelled;
      [self reset];
      return;
    }
  }
  if (_hasCustomActivationCriteria && self.state == UIGestureRecognizerStatePossible && [self shouldActivateUnderCustomCriteria]) {
#if !TARGET_OS_TV
    super.minimumNumberOfTouches = _realMinimumNumberOfTouches;
    if ([self numberOfTouches] >= _realMinimumNumberOfTouches) {
      self.state = UIGestureRecognizerStateBegan;
      [self setTranslation:CGPointMake(0, 0) inView:self.view];
    }
#endif
  }
}

- (void)reset
{
  self.enabled = YES;
  [super reset];
}

- (void)updateHasCustomActivationCriteria
{
  _hasCustomActivationCriteria = !isnan(_minDistSq)
  || !isnan(_minVelocityX) || !isnan(_minVelocityY) || !isnan(_minVelocitySq)
  || !isnan(_activeOffsetXStart) || !isnan(_activeOffsetXEnd)
  ||  !isnan(_activeOffsetYStart) || !isnan(_activeOffsetYEnd);
}

- (BOOL)shouldFailUnderCustomCriteria
{
  CGPoint trans = [self translationInView:self.view];
  if (!isnan(_failOffsetXStart) && trans.x < _failOffsetXStart) {
    return YES;
  }
  if (!isnan(_failOffsetXEnd) && trans.x > _failOffsetXEnd) {
    return YES;
  }
  if (!isnan(_failOffsetYStart) && trans.y < _failOffsetYStart) {
    return YES;
  }
  if (!isnan(_failOffsetYEnd) && trans.y > _failOffsetYEnd) {
    return YES;
  }
  return NO;
}

- (BOOL)shouldActivateUnderCustomCriteria
{
  CGPoint trans = [self translationInView:self.view];
  if (!isnan(_activeOffsetXStart) && trans.x < _activeOffsetXStart) {
    return YES;
  }
  if (!isnan(_activeOffsetXEnd) && trans.x > _activeOffsetXEnd) {
    return YES;
  }
  if (!isnan(_activeOffsetYStart) && trans.y < _activeOffsetYStart) {
    return YES;
  }
  if (!isnan(_activeOffsetYEnd) && trans.y > _activeOffsetYEnd) {
    return YES;
  }
  
  if (TEST_MIN_IF_NOT_NAN(VEC_LEN_SQ(trans), _minDistSq)) {
    return YES;
  }
  
  CGPoint velocity = [self velocityInView:self.view];
  if (TEST_MIN_IF_NOT_NAN(velocity.x, _minVelocityX)) {
    return YES;
  }
  if (TEST_MIN_IF_NOT_NAN(velocity.y, _minVelocityY)) {
    return YES;
  }
  if (TEST_MIN_IF_NOT_NAN(VEC_LEN_SQ(velocity), _minVelocitySq)) {
    return YES;
  }
  
  return NO;
}

@end

@implementation PanGestureHandler

- (instancetype)initWithTag:(NSNumber *)tag
{
  if ((self = [super initWithTag:tag])) {
    _recognizer = [[BetterPanGestureRecognizer alloc] initWithGestureHandler:self];
    self.activateOnBegin = NO;
  }
  return self;
}

- (void)configure:(NSDictionary *)config
{
  [super configure:config];
  BetterPanGestureRecognizer *recognizer = (BetterPanGestureRecognizer *)_recognizer;
  
  APPLY_FLOAT_PROP(minVelocityX);
  APPLY_FLOAT_PROP(minVelocityY);
  APPLY_FLOAT_PROP(activeOffsetXStart);
  APPLY_FLOAT_PROP(activeOffsetXEnd);
  APPLY_FLOAT_PROP(failOffsetXStart);
  APPLY_FLOAT_PROP(failOffsetXEnd);
  APPLY_FLOAT_PROP(activeOffsetYStart);
  APPLY_FLOAT_PROP(activeOffsetYEnd);
  APPLY_FLOAT_PROP(failOffsetYStart);
  APPLY_FLOAT_PROP(failOffsetYEnd);
  
#if !TARGET_OS_TV
  APPLY_NAMED_INT_PROP(minimumNumberOfTouches, @"minPointers");
  APPLY_NAMED_INT_PROP(maximumNumberOfTouches, @"maxPointers");
#endif
    
  id prop = config[@"minDist"];
  if (prop != nil) {
    CGFloat dist = [prop floatValue];
    recognizer.minDistSq = dist * dist;
  }
  
  prop = config[@"minVelocity"];
  if (prop != nil) {
    CGFloat velocity = [prop floatValue];
    recognizer.minVelocitySq = velocity * velocity;
  }
  [recognizer updateHasCustomActivationCriteria];
}

- (NSMutableDictionary *)eventExtraData:(UIPanGestureRecognizer *)recognizer
{
  CGPoint translation = [recognizer translationInView:recognizer.view];
  CGPoint velocity = [recognizer velocityInView:recognizer.view.window];
  NSMutableDictionary* result = [super eventExtraData:recognizer];
  [result setObject:@(translation.x) forKey:@"translationX"];
  [result setObject:@(translation.y) forKey:@"translationY"];
  [result setObject:SAFE_VELOCITY(velocity.x) forKey:@"velocityX"];
  [result setObject:SAFE_VELOCITY(velocity.y) forKey:@"velocityY"];
  return result;
}

- (void)setMinDist:(CGFloat)value {
  ((BetterPanGestureRecognizer*)_recognizer).minDistSq = value * value;
}
- (void)setMinVelocityX:(CGFloat)value {
  ((BetterPanGestureRecognizer*)_recognizer).minVelocityX = value;
}
- (void)setMinVelocityY:(CGFloat)value {
  ((BetterPanGestureRecognizer*)_recognizer).minVelocityY = value;
}
- (void)setMinVelocitySq:(CGFloat)value {
  ((BetterPanGestureRecognizer*)_recognizer).minVelocitySq = value;
}
- (void)setActiveOffsetXStart:(CGFloat)value {
  ((BetterPanGestureRecognizer*)_recognizer).activeOffsetXStart = value;
}
- (void)setActiveOffsetXEnd:(CGFloat)value {
  ((BetterPanGestureRecognizer*)_recognizer).activeOffsetXEnd = value;
}
- (void)setFailOffsetXStart:(CGFloat)value {
  ((BetterPanGestureRecognizer*)_recognizer).failOffsetXStart = value;
}
- (void)setFailOffsetXEnd:(CGFloat)value {
  ((BetterPanGestureRecognizer*)_recognizer).failOffsetXEnd = value;
}
- (void)setActiveOffsetYStart:(CGFloat)value {
  ((BetterPanGestureRecognizer*)_recognizer).activeOffsetYStart = value;
}
- (void)setActiveOffsetYEnd:(CGFloat)value {
  ((BetterPanGestureRecognizer*)_recognizer).activeOffsetYEnd = value;
}
- (void)setFailOffsetYStart:(CGFloat)value {
  ((BetterPanGestureRecognizer*)_recognizer).failOffsetYStart = value;
}
- (void)setFailOffsetYEnd:(CGFloat)value {
  ((BetterPanGestureRecognizer*)_recognizer).failOffsetYEnd = value;
}
@end
